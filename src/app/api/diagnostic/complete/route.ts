import { after } from 'next/server'
import { NextRequest, NextResponse } from 'next/server'
import { getQuestionsForFlow } from '@/diagnostic/config/questions'
import { computeCategoryScores } from '@/diagnostic/engine/scorer'
import { buildSignals } from '@/diagnostic/engine/signal-builder'
import { detectLenses } from '@/diagnostic/engine/lens-detector'
import { matchPattern } from '@/diagnostic/engine/pattern-matcher'
import { generateOutputFromPattern } from '@/diagnostic/engine/output-generator'
import { buildAIInput } from '@/diagnostic/engine/ai-input-builder'
import { interpretDiagnostic } from '@/diagnostic/engine/ai-interpreter'
import type { ContextAnswers } from '@/diagnostic/types'
import {
  supabase,
  supabaseAdmin,
  isSupabaseConfigured,
  type DiagnosticSessionInsert,
  type Json,
} from '@/lib/supabase'

// All 4 categories are always assessed in the new architecture
const ALL_CATEGORIES = ['strategy', 'operations', 'revenue', 'finance'] as const

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { context, answers, contactInfo } = body as {
      context: ContextAnswers
      answers: Record<string, string>
      contactInfo?: { name?: string; company?: string; email?: string; phone?: string }
      // focusAreas is no longer required — kept in body type for legacy client compat
      focusAreas?: string[]
    }

    console.log('[diagnostic/complete] Request received', {
      answerCount: answers ? Object.keys(answers).length : 0,
      hasContactInfo: Boolean(contactInfo?.email),
      supabaseConfigured: isSupabaseConfigured,
    })

    if (!answers || Object.keys(answers).length === 0) {
      console.error('[diagnostic/complete] Missing answers')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── 1. Questions ─────────────────────────────────────────────────────────
    const questionsForFlow = getQuestionsForFlow()

    // ── 2. BCT Layer signals + alignment tests ───────────────────────────────
    const { layerSignals, alignmentTests } = buildSignals(answers, questionsForFlow)

    // ── 3. PST Lens signals + narrative conflicts + constraint location ───────
    const { lensSignals, narrativeConflicts, constraintLocation } = detectLenses(
      answers,
      context,
      questionsForFlow,
      layerSignals,
      alignmentTests,
    )

    // ── 4. Pattern matching ──────────────────────────────────────────────────
    const { pattern, matchClarity } = matchPattern(layerSignals, alignmentTests, narrativeConflicts, context)

    // ── 5. Category scores (for backward compat display) ─────────────────────
    const scores = computeCategoryScores(answers, questionsForFlow, [...ALL_CATEGORIES])

    // ── 6. Final output assembly ─────────────────────────────────────────────
    const output = generateOutputFromPattern(
      pattern,
      scores,
      layerSignals,
      lensSignals,
      alignmentTests,
      narrativeConflicts,
      constraintLocation,
    )

    console.log('[diagnostic/complete] Pipeline complete', {
      patternId: pattern.id,
      constraintLayer: constraintLocation.primaryLayer,
      conflictCount: narrativeConflicts.length,
    })

    const completedAt = new Date().toISOString()

    let sessionId: string
    let saved = false
    let dbError: string | null = null

    if (!isSupabaseConfigured || !supabase) {
      console.error('[diagnostic/complete] Supabase is NOT configured — check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
      sessionId = generateFallbackId()
    } else {
      const insert: DiagnosticSessionInsert = {
        completed_at: completedAt,
        sector:       context.sector    ?? null,
        scale:        context.scale     ?? null,
        situation:    context.situation ?? null,
        role:         context.role      ?? null,
        focus_areas:  [...ALL_CATEGORIES],
        answers:      answers as unknown as Json,
        scores:       scores  as unknown as Json,
        archetype_id: pattern.id,
        flags_triggered: [],       // flags replaced by narrative conflicts in new engine
        output:       output  as unknown as Json,
        opted_in:     Boolean(contactInfo?.email),
        contact_name:    contactInfo?.name    ?? null,
        contact_email:   contactInfo?.email   ?? null,
        contact_company: contactInfo?.company ?? null,
        contact_phone:   contactInfo?.phone   ?? null,
        brief_sent: false,
        ai_status: 'pending',
      }

      console.log('[diagnostic/complete] Attempting Supabase insert', {
        table:        'diagnostic_sessions',
        opted_in:     insert.opted_in,
        contact_email: insert.contact_email,
        archetype_id: insert.archetype_id,
      })

      const { data, error } = await supabase
        .from('diagnostic_sessions')
        .insert(insert)
        .select('id')
        .single()

      if (error || !data) {
        dbError = error
          ? `${error.code}: ${error.message}${error.details ? ` | details: ${error.details}` : ''}${error.hint ? ` | hint: ${error.hint}` : ''}`
          : 'No data returned from insert'
        console.error('[diagnostic/complete] Supabase insert FAILED', {
          code:    error?.code,
          message: error?.message,
          details: error?.details,
          hint:    error?.hint,
        })
        sessionId = generateFallbackId()
      } else {
        sessionId = data.id
        saved = true
        console.log('[diagnostic/complete] Supabase insert succeeded', { sessionId })
      }
    }

    // ── 8. Schedule async AI interpretation (post-response, non-blocking) ───
    // Build the evidence package now (synchronous) so all computed values are
    // captured in the closure before the response is flushed.
    if (saved && process.env.ANTHROPIC_API_KEY) {
      const questionsForAI = getQuestionsForFlow()
      const aiInput = buildAIInput(
        context,
        pattern,
        matchClarity,
        scores,
        layerSignals,
        alignmentTests,
        narrativeConflicts,
        constraintLocation,
        lensSignals,
        answers,
        questionsForAI,
      )
      const capturedSessionId = sessionId

      after(async () => {
        const adminClient = supabaseAdmin
        if (!adminClient) {
          console.error('[AI interpretation] No Supabase client available for update')
          return
        }
        try {
          console.log('[AI interpretation] Starting for session', capturedSessionId)
          const interpretation = await interpretDiagnostic(aiInput)
          const { error: updateError } = await adminClient
            .from('diagnostic_sessions')
            .update({
              ai_interpretation: interpretation as unknown as Json,
              ai_status:         'complete',
              ai_generated_at:   interpretation.generatedAt,
              ai_model_version:  interpretation.modelVersion,
            })
            .eq('id', capturedSessionId)
          if (updateError) {
            console.error('[AI interpretation] Supabase update failed', updateError)
          } else {
            console.log('[AI interpretation] Complete for session', capturedSessionId)
          }
        } catch (err) {
          console.error('[AI interpretation] Failed for session', capturedSessionId, err)
          // Best-effort status update — don't throw if this also fails
          await adminClient
            .from('diagnostic_sessions')
            .update({ ai_status: 'failed' })
            .eq('id', capturedSessionId)
            .then(() => {/* fire and forget */})
        }
      })
    }

    return NextResponse.json({
      sessionId,
      output,
      saved,
      ...(dbError ? { dbError } : {}),
    })
  } catch (err) {
    console.error('[diagnostic/complete] Unhandled exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateFallbackId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
