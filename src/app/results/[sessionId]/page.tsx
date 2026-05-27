'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type {
  DiagnosticOutput,
  ContextAnswers,
  LayerSignal,
  AlignmentTest,
  NarrativeConflict,
  ConstraintLocation,
  LensSignal,
  FrameworkLayer,
} from '@/diagnostic/types'
import { CategorySignalMap } from '@/components/results/CategorySignalMap'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const layerLabel: Record<FrameworkLayer, string> = {
  strategy:        'Strategy',
  business_model:  'Business Model',
  operating_model: 'Operating Model',
  performance:     'Performance Management',
}

const constraintLayerLabel: Record<string, string> = {
  strategy:        'Strategy',
  business_model:  'Business Model',
  operating_model: 'Operating Model',
  performance:     'Performance Management',
  alignment:       'Cross-layer misalignment',
  external:        'External environment',
}

const strengthColor: Record<string, string> = {
  clear:   'bg-signal-green',
  partial: 'bg-signal-yellow',
  absent:  'bg-signal-red',
}

const strengthLabel: Record<string, string> = {
  clear:   'Clear',
  partial: 'Partial',
  absent:  'Absent',
}

const alignmentColor: Record<string, string> = {
  aligned:    'text-signal-green',
  partial:    'text-signal-yellow',
  misaligned: 'text-signal-red',
  untestable: 'text-text-muted',
}

const alignmentLabel: Record<string, string> = {
  aligned:    'Aligned',
  partial:    'Partial alignment',
  misaligned: 'Misaligned',
  untestable: 'Insufficient data',
}

const alignmentTestLabel: Record<string, string> = {
  strategy_businessModel:        'Strategy → Business Model',
  businessModel_operatingModel:  'Business Model → Operating Model',
  strategy_operatingModel:       'Strategy → Operating Model',
}

const confidenceColor: Record<string, string> = {
  high:   'text-signal-red',
  medium: 'text-signal-yellow',
  low:    'text-text-muted',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LayerSignalProfile({ layerSignals }: { layerSignals: LayerSignal[] }) {
  return (
    <div className="bg-white border border-cream-border rounded-sm p-6">
      <p
        className="text-[10px] tracking-[0.16em] uppercase text-text-muted mb-4"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Framework Layer Analysis
      </p>
      <div className="flex flex-col gap-3">
        {layerSignals.map((ls) => (
          <div key={ls.layer} className="flex items-center gap-3">
            <div className="w-[130px] flex-shrink-0">
              <span
                className="text-[12px] text-text-secondary"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {layerLabel[ls.layer]}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${strengthColor[ls.strength]}`}
              />
              <span
                className="text-[11px] text-text-muted"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {strengthLabel[ls.strength]}
                {!ls.coherent && (
                  <span className="text-signal-yellow ml-1.5">· Incoherent</span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlignmentTestsPanel({ tests }: { tests: AlignmentTest[] }) {
  return (
    <div className="bg-white border border-cream-border rounded-sm p-6">
      <p
        className="text-[10px] tracking-[0.16em] uppercase text-text-muted mb-4"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Cross-Layer Alignment
      </p>
      <div className="flex flex-col gap-4">
        {tests.map((test) => (
          <div key={test.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-[12px] text-text-secondary"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {alignmentTestLabel[test.id]}
              </span>
              <span
                className={`text-[11px] font-medium ${alignmentColor[test.result]}`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {alignmentLabel[test.result]}
              </span>
            </div>
            {test.result !== 'aligned' && test.evidence.length > 0 && (
              <p
                className="text-[12px] text-text-muted leading-relaxed pl-2 border-l border-cream-border"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {test.evidence[0]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ConstraintLocationPanel({ location }: { location: ConstraintLocation }) {
  return (
    <div className="bg-cream-dark border border-cream-border rounded-sm p-6 md:p-8">
      <p
        className="text-[10px] tracking-[0.16em] uppercase text-text-muted mb-2"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Constraint Location
      </p>
      <div className="flex items-baseline gap-3 mb-5">
        <span
          className="text-[22px] text-navy"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {constraintLayerLabel[location.primaryLayer] ?? location.primaryLayer}
        </span>
        <span
          className={`text-[11px] font-medium ${confidenceColor[location.confidence]}`}
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {location.confidence} confidence
        </span>
      </div>

      {location.likelyRootCauses.length > 0 && (
        <div className="mb-4">
          <p
            className="text-[11px] tracking-[0.10em] uppercase text-text-muted mb-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Likely root causes
          </p>
          <ul className="flex flex-col gap-1.5">
            {location.likelyRootCauses.map((cause, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-teal text-[12px] mt-0.5 flex-shrink-0">—</span>
                <p
                  className="text-[13px] text-text-secondary leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {cause}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {location.symptomSignals.length > 0 && (
        <div className="mb-4">
          <p
            className="text-[11px] tracking-[0.10em] uppercase text-text-muted mb-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Downstream symptoms visible
          </p>
          <ul className="flex flex-col gap-1.5">
            {location.symptomSignals.map((signal, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-text-muted text-[12px] mt-0.5 flex-shrink-0">·</span>
                <p
                  className="text-[13px] text-text-muted leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {signal}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {location.alternativeHypothesis && (
        <div className="mt-4 pt-4 border-t border-cream-border">
          <p
            className="text-[11px] tracking-[0.10em] uppercase text-gold mb-1.5"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Alternative hypothesis
          </p>
          <p
            className="text-[13px] text-text-secondary leading-relaxed italic"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {location.alternativeHypothesis}
          </p>
        </div>
      )}
    </div>
  )
}

function NarrativeConflictsPanel({ conflicts }: { conflicts: NarrativeConflict[] }) {
  if (!conflicts.length) return null

  return (
    <div className="mb-8">
      <p
        className="text-[11px] tracking-[0.14em] uppercase text-text-muted mb-4"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Evidence Conflicts
      </p>
      <div className="flex flex-col gap-3">
        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="bg-white border border-cream-border rounded-sm p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 rounded-sm bg-gold/15 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v4M5 8v1" stroke="#C9943A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p
                  className="text-[12px] text-text-muted mb-1"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span className="font-medium text-text-secondary">Stated:</span>{' '}
                  {conflict.stated}
                </p>
                <p
                  className="text-[13px] text-text-secondary leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span className="font-medium">Observed:</span>{' '}
                  {conflict.observed}
                </p>
              </div>
              {conflict.significance === 'high' && (
                <div className="flex-shrink-0">
                  <span
                    className="text-[10px] tracking-[0.10em] uppercase text-signal-red"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    High
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LensHighlightsPanel({ lensSignals }: { lensSignals: LensSignal[] }) {
  const significant = lensSignals.filter(
    (l) => l.severity === 'high' || l.severity === 'medium',
  )
  if (!significant.length) return null

  const lensLabel: Record<string, string> = {
    external:        'Market & Competitive Context',
    value_chain:     'Value Chain',
    financials:      'Financial Profile',
    decision_making: 'Decision-Making',
  }

  return (
    <div className="mb-8">
      <p
        className="text-[11px] tracking-[0.14em] uppercase text-text-muted mb-4"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Contextual Signal Analysis
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {significant.map((lens) => (
          <div
            key={lens.lensId}
            className="bg-white border border-cream-border rounded-sm p-5"
          >
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-text-muted mb-3"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {lensLabel[lens.lensId] ?? lens.lensId}
            </p>
            <div className="flex flex-col gap-1.5">
              {lens.signals.map((sig, i) => (
                <p
                  key={i}
                  className="text-[13px] text-text-secondary leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {sig}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main results content ─────────────────────────────────────────────────────

function ResultsContent({
  output,
  sessionId,
  context,
  contactEmail,
}: {
  output: DiagnosticOutput
  sessionId: string
  context: ContextAnswers
  contactEmail: string | null
}) {
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

        {/* Pattern badge */}
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

        {/* Headline */}
        <div className="mb-12 max-w-3xl">
          <p
            className="text-[11px] tracking-[0.15em] uppercase text-gold mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Primary Constraint Identified
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-[42px] text-navy leading-[1.2] font-normal"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {output.headline}
          </h1>
        </div>

        {/* Signal map + layer analysis + observations grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Left: CategoryScoreMap + LayerSignals + AlignmentTests */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white border border-cream-border rounded-sm p-6">
              <CategorySignalMap scores={output.categoryScores} />
            </div>

            {output.layerSignals && output.layerSignals.length > 0 && (
              <LayerSignalProfile layerSignals={output.layerSignals} />
            )}

            {output.alignmentTests && output.alignmentTests.length > 0 && (
              <AlignmentTestsPanel tests={output.alignmentTests} />
            )}
          </div>

          {/* Right: Observations */}
          <div className="lg:col-span-2">
            <p
              className="text-[11px] tracking-[0.14em] uppercase text-text-muted mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Diagnostic Observations
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

        {/* Constraint Location — key new section */}
        {output.constraintLocation && (
          <div className="mb-8">
            <ConstraintLocationPanel location={output.constraintLocation} />
          </div>
        )}

        {/* Narrative Conflicts — between the lines */}
        {output.narrativeConflicts && output.narrativeConflicts.length > 0 && (
          <NarrativeConflictsPanel conflicts={output.narrativeConflicts} />
        )}

        {/* Lens Highlights — external / financials / decision-making */}
        {output.lensSignals && output.lensSignals.length > 0 && (
          <LensHighlightsPanel lensSignals={output.lensSignals} />
        )}

        {/* Central Question */}
        <div className="bg-navy rounded-sm p-8 md:p-10 mb-8">
          <p
            className="text-[11px] tracking-[0.14em] uppercase text-white/50 mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            The Central Question
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
            The pattern of your responses points to this as the question most worth examining.
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
              Priority Areas Requiring Executive Attention
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

        {/* Consultant debrief confirmation */}
        <div className="mb-12 bg-navy rounded-sm p-8 md:p-10">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-sm bg-teal flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div>
              <p
                className="text-[11px] tracking-[0.14em] uppercase text-white/50 mb-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Consultant Interpretation
              </p>
              <p
                className="text-xl text-white leading-snug mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Your diagnostic debrief is being prepared.
              </p>
              <p
                className="text-[14px] text-white/70 leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                A consultant interpretation of your profile will be sent
                {contactEmail ? (
                  <> to <span className="text-white/90">{contactEmail}</span></>
                ) : (
                  ' to you'
                )}{' '}
                within 48 hours.
              </p>
            </div>
          </div>
        </div>

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

// ─── Loading / not found states ───────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  const [output, setOutput] = useState<DiagnosticOutput | null>(null)
  const [context, setContext] = useState<ContextAnswers>({})
  const [contactEmail, setContactEmail] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading')

  useEffect(() => {
    if (!sessionId) return

    // Fast path: check sessionStorage first
    try {
      const stored = sessionStorage.getItem(`diagnostic_output_${sessionId}`)
      const stateStored = sessionStorage.getItem('arpus_diagnostic_state')

      if (stored) {
        const parsed = JSON.parse(stored) as DiagnosticOutput
        setOutput(parsed)

        if (stateStored) {
          const state = JSON.parse(stateStored)
          setContext(state.context ?? {})
          setContactEmail(state.contactInfo?.email ?? null)
        }

        setStatus('found')
        return
      }
    } catch {}

    // Fallback: fetch from API
    fetch(`/api/diagnostic/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        setOutput(data.output as DiagnosticOutput)
        setContactEmail(data.contactEmail ?? null)
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
      contactEmail={contactEmail}
    />
  )
}
