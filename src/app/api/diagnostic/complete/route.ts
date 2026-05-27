import { NextRequest, NextResponse } from 'next/server'
import { questions, getQuestionsForFlow } from '@/diagnostic/config/questions'
import { flagRules } from '@/diagnostic/config/flags'
import { archetypes } from '@/diagnostic/config/archetypes'
import { computeCategoryScores } from '@/diagnostic/engine/scorer'
import { detectFlags } from '@/diagnostic/engine/flag-detector'
import { classifyArchetype } from '@/diagnostic/engine/classifier'
import { generateOutput } from '@/diagnostic/engine/output-generator'
import type { CategoryId, ContextAnswers } from '@/diagnostic/types'
import { supabase, isSupabaseConfigured, type DiagnosticSessionInsert, type Json } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { context, focusAreas, answers, contactInfo } = body as {
      context: ContextAnswers
      focusAreas: CategoryId[]
      answers: Record<string, string>
      contactInfo?: { name?: string; company?: string; email?: string; phone?: string }
    }

    console.log('[diagnostic/complete] Request received', {
      focusAreas,
      answerCount: answers ? Object.keys(answers).length : 0,
      hasContactInfo: Boolean(contactInfo?.email),
      supabaseConfigured: isSupabaseConfigured,
    })

    if (!focusAreas?.length || !answers) {
      console.error('[diagnostic/complete] Missing required fields', { focusAreas, answers })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run the diagnostic pipeline
    const questionsForFlow = getQuestionsForFlow(focusAreas)
    const scores = computeCategoryScores(answers, questionsForFlow, focusAreas)
    const flags = detectFlags(answers, context, flagRules, questionsForFlow)
    const archetype = classifyArchetype(scores, context, flags, archetypes)
    const output = generateOutput(archetype, scores, flags, focusAreas)

    console.log('[diagnostic/complete] Pipeline complete', {
      archetypeId: archetype.id,
      flagCount: flags.length,
      scoreCount: scores.length,
    })

    const flagIds = flags.map((f) => f.id)
    const completedAt = new Date().toISOString()

    let sessionId: string
    let saved = false
    let dbError: string | null = null

    if (!isSupabaseConfigured || !supabase) {
      console.error('[diagnostic/complete] Supabase is NOT configured — check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
      sessionId = generateFallbackId()
    } else {
      // NOTE: contact_phone is intentionally excluded from this insert.
      // The column was added to schema.sql but may not exist in the live
      // database if the ALTER TABLE migration has not been run yet.
      // Run this in Supabase SQL Editor to add it:
      //   ALTER TABLE public.diagnostic_sessions
      //   ADD COLUMN IF NOT EXISTS contact_phone TEXT;
      const insert: DiagnosticSessionInsert = {
        completed_at: completedAt,
        sector: context.sector ?? null,
        scale: context.scale ?? null,
        situation: context.situation ?? null,
        role: context.role ?? null,
        focus_areas: focusAreas,
        answers: answers as unknown as Json,
        scores: scores as unknown as Json,
        archetype_id: archetype.id,
        flags_triggered: flagIds,
        output: output as unknown as Json,
        opted_in: Boolean(contactInfo?.email),
        contact_name: contactInfo?.name ?? null,
        contact_email: contactInfo?.email ?? null,
        contact_company: contactInfo?.company ?? null,
        brief_sent: false,
      }

      console.log('[diagnostic/complete] Attempting Supabase insert', {
        table: 'diagnostic_sessions',
        opted_in: insert.opted_in,
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
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
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
