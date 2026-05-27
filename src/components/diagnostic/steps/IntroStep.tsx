'use client'

import { useDiagnostic } from '../DiagnosticProvider'

export function IntroStep() {
  const { dispatch } = useDiagnostic()

  return (
    <div className="flex flex-col items-start max-w-xl">
      <p
        className="text-[11px] tracking-[0.15em] uppercase mb-6 text-gold"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Business Diagnostic
      </p>

      <h1
        className="text-4xl md:text-5xl leading-[1.15] text-navy mb-6"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Let us help you identify what is actually holding your business back.
      </h1>

      <p
        className="text-base leading-relaxed text-text-secondary mb-8 max-w-lg"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        This structured assessment takes 7–10 minutes. It is built on the same diagnostic
        framework our consultants use in the first week of every engagement.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10">
        {[
          { num: '4', label: 'Diagnostic categories' },
          { num: '7–10', label: 'Minutes to complete' },
          { num: '100%', label: 'Confidential' },
        ].map(({ num, label }) => (
          <div key={label} className="bg-cream-dark border border-cream-border rounded-sm p-4">
            <div
              className="text-2xl font-semibold text-navy mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {num}
            </div>
            <div
              className="text-[12px] text-text-muted leading-snug"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => dispatch({ type: 'NEXT_STEP' })}
        className="inline-flex items-center gap-3 bg-teal text-white px-8 py-4 text-[13px] tracking-[0.08em] uppercase hover:bg-teal-dark transition-colors duration-200 cursor-pointer"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Start the Assessment
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <p
        className="mt-5 text-[12px] text-text-muted"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Your responses are confidential. A consultant will review your results.
      </p>
    </div>
  )
}
