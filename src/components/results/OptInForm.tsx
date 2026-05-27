'use client'

import { useState } from 'react'
import type { DiagnosticOutput, ContextAnswers, CategoryId } from '@/diagnostic/types'
import { cn } from '@/lib/cn'

interface OptInFormProps {
  sessionId: string
  output: DiagnosticOutput
  context?: ContextAnswers
  focusAreas?: CategoryId[]
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function OptInForm({ sessionId, output, context = {}, focusAreas = [] }: OptInFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || formState === 'submitting') return

    setFormState('submitting')

    try {
      const res = await fetch('/api/diagnostic/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email: email.trim(),
          name: name.trim() || undefined,
          company: company.trim() || undefined,
          output,
          context,
          focusAreas,
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className="bg-teal-light border border-teal/20 rounded-sm p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3
            className="text-[15px] font-medium text-navy"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Your request has been received
          </h3>
        </div>
        <p
          className="text-[14px] text-text-secondary leading-relaxed"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          A consultant will review your diagnostic profile and send a prepared interpretation to{' '}
          <strong>{email}</strong> within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-navy rounded-sm p-8 md:p-10">
      <p
        className="text-[11px] tracking-[0.14em] uppercase text-white/50 mb-3"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Consultant Interpretation
      </p>
      <h3
        className="text-xl md:text-2xl text-white leading-snug mb-3"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Every diagnostic completed through this tool is reviewed by one of our consultants.
      </h3>
      <p
        className="text-[14px] text-white/70 leading-relaxed mb-7"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        If you would like a consultant interpretation of your diagnostic profile — including
        how your pattern of responses compares to similar businesses and what the evidence
        suggests about root cause — leave your contact details below. You will receive a
        prepared brief within 48 hours, from a named consultant, specific to your situation.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-white/50 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
          <input
            type="text"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-white/50 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
        </div>

        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-white/50 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
          <button
            type="submit"
            disabled={!email.trim() || formState === 'submitting'}
            className={cn(
              'px-6 py-3 text-[13px] tracking-[0.08em] uppercase transition-all duration-200 whitespace-nowrap',
              email.trim() && formState !== 'submitting'
                ? 'bg-teal text-white hover:bg-teal-dark cursor-pointer'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            )}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {formState === 'submitting' ? 'Sending…' : 'Request Interpretation'}
          </button>
        </div>

        {formState === 'error' && (
          <p
            className="text-[12px] text-red-300"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Something went wrong. Please try again or contact us directly.
          </p>
        )}

        <p
          className="text-[11px] text-white/40 mt-1"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          One response. From a named consultant. Within 48 hours.
        </p>
      </form>
    </div>
  )
}
