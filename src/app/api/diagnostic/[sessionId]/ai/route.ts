/**
 * GET /api/diagnostic/[sessionId]/ai
 *
 * Polling endpoint for the AI interpretation layer.
 * The results page fires one request 3 seconds after load.
 *
 * Response:
 *   { status: 'pending' | 'complete' | 'failed' | 'not_found', interpretation: AIInterpretation | null }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireSupabase } from '@/lib/supabase'
import type { AIInterpretation } from '@/diagnostic/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params

  let db: ReturnType<typeof requireSupabase>
  try {
    db = requireSupabase()
  } catch {
    return NextResponse.json({ status: 'not_found', interpretation: null }, { status: 503 })
  }

  const { data, error } = await db
    .from('diagnostic_sessions')
    .select('ai_status, ai_interpretation, ai_generated_at, ai_model_version')
    .eq('id', sessionId)
    .single()

  if (error || !data) {
    return NextResponse.json({ status: 'not_found', interpretation: null }, { status: 404 })
  }

  return NextResponse.json({
    status:         data.ai_status ?? 'pending',
    interpretation: data.ai_status === 'complete'
      ? (data.ai_interpretation as unknown as AIInterpretation)
      : null,
  })
}
