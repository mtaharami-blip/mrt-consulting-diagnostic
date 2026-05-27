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
    const { context, focusAreas, answers } = body as {
      context: ContextAnswers
      focusAreas: CategoryId[]
      answers: Record<string, string>
    }

    if (!focusAreas?.length || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run the diagnostic pipeline
    const questionsForFlow = getQuestionsForFlow(focusAreas)
    const scores = computeCategoryScores(answers, questionsForFlow, focusAreas)
    const flags = detectFlags(answers, context, flagRules, questionsForFlow)
    const archetype = classifyArchetype(scores, context, flags, archetypes)
    const output = generateOutput(archetype, scores, flags, focusAreas)

    const flagIds = flags.map((f) => f.id)
    const completedAt = new Date().toISOString()

    let sessionId: string

    if (isSupabaseConfigured && supabase) {
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
        opted_in: false,
        brief_sent: false,
      }

      const { data, error } = await supabase
        .from('diagnostic_sessions')
        .insert(insert)
        .select('id')
        .single()

      if (error || !data) {
        console.error('Supabase insert error:', error)
        // Fall back to a generated ID so the app still works
        sessionId = generateFallbackId()
      } else {
        sessionId = data.id
      }
    } else {
      sessionId = generateFallbackId()
    }

    return NextResponse.json({ sessionId, output })
  } catch (err) {
    console.error('Diagnostic complete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateFallbackId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
