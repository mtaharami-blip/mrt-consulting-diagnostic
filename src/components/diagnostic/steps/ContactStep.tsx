'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDiagnostic } from '../DiagnosticProvider'
import { cn } from '@/lib/cn'

export function ContactStep() {
  const { state, dispatch } = useDiagnostic()
  const router = useRouter()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid =
    name.trim().length > 0 &&
    company.trim().length > 0 &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting) return

    const contactInfo = {
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    }

    dispatch({ type: 'SET_CONTACT_INFO', info: contactInfo })
    dispatch({ type: 'SET_PROCESSING' })
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/diagnostic/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: state.context,
          focusAreas: state.focusAreas,
          answers: state.answers,
          contactInfo,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(`API returned ${res.status}: ${body.error ?? 'unknown error'}`)
      }

      const data = await res.json()

      // Log whether the session was actually saved to the database
      if (!data.saved) {
        console.error('[ContactStep] Session was NOT saved to Supabase.', {
          dbError: data.dbError,
          sessionId: data.sessionId,
        })
      } else {
        console.log('[ContactStep] Session saved successfully:', data.sessionId)
      }

      try {
        sessionStorage.setItem(
          `diagnostic_output_${data.sessionId}`,
          JSON.stringify(data.output)
        )
      } catch {}

      dispatch({ type: 'SET_DONE', sessionId: data.sessionId, output: data.output })
      router.push(`/results/${data.sessionId}`)
    } catch (err) {
      console.error('[ContactStep] Submission error:', err)
      dispatch({ type: 'SET_STEP', step: 'contact' })
      setSubmitting(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex flex-col max-w-xl w-full">
      <p
        className="text-[11px] tracking-[0.15em] uppercase mb-6 text-gold"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Assessment Complete
      </p>

      <h2
        className="text-3xl md:text-4xl text-navy leading-snug mb-3"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Your diagnostic is ready.
      </h2>

      <p
        className="text-[14px] text-text-secondary leading-relaxed mb-8"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Enter your details to access your results. A consultant will follow up with a
        personalized interpretation within 48 hours.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Full Name <span className="text-gold normal-case tracking-normal">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              autoFocus
              disabled={submitting}
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Company <span className="text-gold normal-case tracking-normal">*</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
              required
              disabled={submitting}
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Email Address <span className="text-gold normal-case tracking-normal">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              disabled={submitting}
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Phone{' '}
              <span
                className="normal-case tracking-normal text-text-muted"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                (optional)
              </span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 000 000 0000"
              disabled={submitting}
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>
        </div>

        {error && (
          <p
            className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-sm"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {error}
          </p>
        )}

        <div className="flex items-center gap-5 mt-2">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className={cn(
              'inline-flex items-center gap-3 px-8 py-4 text-[13px] tracking-[0.08em] uppercase transition-colors duration-200',
              isValid && !submitting
                ? 'bg-teal text-white hover:bg-teal-dark cursor-pointer'
                : 'bg-cream-dark text-text-muted cursor-not-allowed border border-cream-border'
            )}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                View My Results
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>

          {!submitting && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_STEP', step: 'questions' })}
              className="text-[12px] text-text-muted hover:text-navy transition-colors flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to questions
            </button>
          )}
        </div>
      </form>

      <p
        className="mt-5 text-[12px] text-text-muted"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Your details are handled with the same confidentiality as your diagnostic responses.
      </p>
    </div>
  )
}
