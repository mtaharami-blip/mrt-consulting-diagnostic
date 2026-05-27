import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { sendUserConfirmation, sendConsultantNotification } from '@/lib/email'
import type { DiagnosticOutput } from '@/diagnostic/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, email, name, company, output, context, focusAreas } = body as {
      sessionId: string
      email: string
      name?: string
      company?: string
      output: DiagnosticOutput
      context: Record<string, string>
      focusAreas: string[]
    }

    if (!email || !sessionId) {
      return NextResponse.json({ error: 'Email and session ID are required' }, { status: 400 })
    }

    // Update session in database
    if (isSupabaseConfigured && supabase && !sessionId.startsWith('local-')) {
      await supabase
        .from('diagnostic_sessions')
        .update({
          opted_in: true,
          contact_email: email,
          contact_name: name ?? null,
          contact_company: company ?? null,
        })
        .eq('id', sessionId)
    }

    // Send both emails in parallel
    const [userResult, consultantResult] = await Promise.allSettled([
      sendUserConfirmation({ email, name, output }),
      sendConsultantNotification({
        sessionId,
        context: context as any,
        focusAreas: focusAreas as any,
        answers: {},
        output,
        contact: { email, name, company },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Opt-in error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
