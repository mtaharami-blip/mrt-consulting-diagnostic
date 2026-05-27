'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { DiagnosticOutput, ContextAnswers, CategoryId } from '@/diagnostic/types'
import { CategorySignalMap } from '@/components/results/CategorySignalMap'
import { OptInForm } from '@/components/results/OptInForm'
import { signalConfig } from '@/diagnostic/config/categories'
import { cn } from '@/lib/cn'

function ResultsContent({
  output,
  sessionId,
  context,
  focusAreas,
}: {
  output: DiagnosticOutput
  sessionId: string
  context: ContextAnswers
  focusAreas: CategoryId[]
}) {
  const primaryScore = output.categoryScores
    .filter((s) => s.assessed)
    .sort((a, b) => a.normalized - b.normalized)[0]

  const signalLevel = primaryScore?.level ?? 'yellow'
  const signalConf = signalConfig[signalLevel]

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-cream-border px-6 md:px-12 py-4 flex items-center justify-between bg-cream">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-navy rounded-sm flex items-center justify-center">
            <span
              className="text-white text-[13px] font-semibold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              M
            </span>
          </div>
          <span
            className="text-[12px] tracking-[0.12em] uppercase text-navy hidden sm:block"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            MRT Consulting
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span
            className="text-[11px] tracking-[0.08em] uppercase text-text-muted"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Diagnostic Complete
          </span>
          <Link
            href="/diagnostic"
            className="text-[12px] text-teal hover:text-teal-dark transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Run a new diagnostic →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Archetype badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-cream-dark border border-cream-border px-4 py-2 rounded-sm">
            <span
              className="text-[10px] tracking-[0.14em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Diagnostic Classification
            </span>
            <span className="text-cream-border">·</span>
            <span
              className="text-[11px] font-medium text-navy"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {output.archetypeName}
            </span>
          </div>
        </div>

        {/* Headline — the most important element */}
        <div className="mb-12 max-w-3xl">
          <p
            className="text-[11px] tracking-[0.15em] uppercase text-gold mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Primary Finding
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-[42px] text-navy leading-[1.2] font-normal"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {output.headline}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left column — signal map */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-cream-border rounded-sm p-6">
              <CategorySignalMap scores={output.categoryScores} />
            </div>
          </div>

          {/* Right column — observations */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <p
                className="text-[11px] tracking-[0.14em] uppercase text-text-muted mb-5"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Observed Patterns
              </p>
              <div className="flex flex-col gap-3">
                {output.observations.map((obs, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-cream-border rounded-sm p-5 flex gap-4"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-cream-dark border border-cream-border flex items-center justify-center">
                        <span
                          className="text-[10px] text-text-muted"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {idx + 1}
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-[14px] text-text-secondary leading-relaxed"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {obs}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Central Question — the highest-value element */}
        <div className="bg-navy rounded-sm p-8 md:p-10 mb-8">
          <p
            className="text-[11px] tracking-[0.14em] uppercase text-white/50 mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            The Central Diagnostic Question
          </p>
          <p
            className="text-xl md:text-2xl text-white leading-relaxed font-normal italic"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            "{output.centralQuestion}"
          </p>
          <p
            className="text-[12px] text-white/40 mt-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Take this question to your leadership team.
          </p>
        </div>

        {/* Misdiagnosis note */}
        <div className="mb-8">
          <div className="bg-cream-dark border border-cream-border rounded-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-sm bg-gold/15 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v5M6 9v1" stroke="#C9943A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div>
                <p
                  className="text-[11px] tracking-[0.12em] uppercase text-gold mb-2"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  What Gets Misdiagnosed Here
                </p>
                <p
                  className="text-[14px] text-text-secondary leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {output.misdiagnosisNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        {output.focusAreas.length > 0 && (
          <div className="mb-12">
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-text-muted mb-5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Recommended Focus Areas
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {output.focusAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-cream-border rounded-sm p-6"
                >
                  <div className="h-px w-6 bg-teal mb-5" />
                  <h3
                    className="text-[16px] text-navy leading-snug mb-3"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {area.title}
                  </h3>
                  <p
                    className="text-[13px] text-text-secondary leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opt-in */}
        <OptInForm
          sessionId={sessionId}
          output={output}
          context={context}
          focusAreas={focusAreas}
        />

        {/* Footer note */}
        <div className="mt-8 pt-8 border-t border-cream-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p
            className="text-[12px] text-text-muted"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            MRT Consulting · Business Diagnostic Tool
          </p>
          <Link
            href="/diagnostic"
            className="text-[12px] text-teal hover:text-teal-dark transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Run a new diagnostic →
          </Link>
        </div>
      </main>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[14px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading your diagnostic results…
        </p>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p
          className="text-[11px] tracking-[0.14em] uppercase text-text-muted mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Session Not Found
        </p>
        <h1
          className="text-2xl text-navy mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          This diagnostic session could not be found.
        </h1>
        <p
          className="text-[14px] text-text-secondary mb-8"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Results are stored in your browser session. If you started a new session or
          cleared your browser data, your previous results may no longer be available.
        </p>
        <Link
          href="/diagnostic"
          className="inline-flex items-center gap-2 bg-teal text-white px-6 py-3 text-[13px] tracking-[0.08em] uppercase hover:bg-teal-dark transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Start a New Diagnostic
        </Link>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  const [output, setOutput] = useState<DiagnosticOutput | null>(null)
  const [context, setContext] = useState<ContextAnswers>({})
  const [focusAreas, setFocusAreas] = useState<CategoryId[]>([])
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading')

  useEffect(() => {
    if (!sessionId) return

    // First: try sessionStorage (fast path — fresh completion)
    try {
      const stored = sessionStorage.getItem(`diagnostic_output_${sessionId}`)
      const stateStored = sessionStorage.getItem('arpus_diagnostic_state')

      if (stored) {
        const parsed = JSON.parse(stored) as DiagnosticOutput
        setOutput(parsed)

        if (stateStored) {
          const state = JSON.parse(stateStored)
          setContext(state.context ?? {})
          setFocusAreas(state.focusAreas ?? [])
        }

        setStatus('found')
        return
      }
    } catch {}

    // Fallback: fetch from API (shared link or new tab)
    fetch(`/api/diagnostic/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        setOutput(data.output as DiagnosticOutput)
        setStatus('found')
      })
      .catch(() => {
        setStatus('not-found')
      })
  }, [sessionId])

  if (status === 'loading') return <LoadingState />
  if (status === 'not-found' || !output) return <NotFoundState />

  return (
    <ResultsContent
      output={output}
      sessionId={sessionId}
      context={context}
      focusAreas={focusAreas}
    />
  )
}
