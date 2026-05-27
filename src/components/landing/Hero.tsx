import Link from 'next/link'

export function Hero() {
  return (
    <section className="bg-cream pt-10 pb-6 md:pt-14 md:pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Eyebrow — spans full width with extending rule */}
        <div className="flex items-center gap-4 mb-10">
          <p
            className="text-[11px] tracking-[0.15em] uppercase text-gold shrink-0"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Business Diagnostic Tool
          </p>
          <div className="h-px flex-1 bg-gold/25" />
        </div>

        {/* Headline — wide, confident, runs across the page */}
        <h1
          className="text-5xl md:text-6xl lg:text-[76px] leading-[1.05] text-navy mb-10 max-w-4xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Diagnose the Real{' '}
          <em className="text-teal not-italic">Business</em>{' '}
          Issue.
        </h1>

        {/* Body + CTAs left / Stats right — natural two-column balance */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end">

          <div>
            <p
              className="text-[17px] leading-relaxed text-text-secondary mb-10 max-w-xl"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              A structured diagnostic assessment that helps leaders uncover the root cause
              of underperformance — across strategy, operations, revenue, or financial
              performance.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-3 bg-teal text-white px-8 py-4 text-[13px] tracking-[0.08em] uppercase hover:bg-teal-dark transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Start the Assessment
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2.5 border border-navy text-navy px-8 py-4 text-[13px] tracking-[0.08em] uppercase hover:bg-navy/5 transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                See How It Works
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                  <polygon points="5.5,4.5 10,7 5.5,9.5" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Stats — right-aligned, stacked vertically */}
          <div className="flex flex-row lg:flex-col gap-8 lg:gap-7 lg:items-end lg:text-right pb-1">
            {[
              { num: '7–10 min', label: 'to complete' },
              { num: '4', label: 'diagnostic dimensions' },
              { num: '100%', label: 'confidential' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  className="text-[22px] font-semibold text-navy leading-none"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {num}
                </div>
                <div
                  className="text-[11px] text-text-muted mt-1"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Full-width bottom rule */}
        <div className="mt-10 h-px bg-cream-border" />

      </div>
    </section>
  )
}
