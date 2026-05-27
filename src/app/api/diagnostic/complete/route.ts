import { NextRequest, NextResponse } from 'next/server'
import { getQuestionsForFlow } from '@/diagnostic/config/questions'
import { computeCategoryScores } from '@/diagnostic/engine/scorer'
import { buildSignals } from '@/diagnostic/engine/signal-builder'
import { detectLenses } from '@/diagnostic/engine/lens-detector'
import { matchPattern } from '@/diagnostic/engine/pattern-matcher'
import { generateOutputFromPattern } from '@/diagnostic/engine/output-generator'
import type { ContextAnswers } from '@/diagnostic/types'
import { supabase, isSupabaseConfigured, type DiagnosticSessionInsert, type Json } from '@/lib/supabase'

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
    const { pattern } = matchPattern(layerSignals, alignmentTests, narrativeConflicts, context)

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
