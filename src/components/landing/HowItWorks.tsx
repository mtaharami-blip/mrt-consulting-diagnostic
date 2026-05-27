import Link from 'next/link'

const steps = [
  {
    num: '01',
    title: 'Establish Context',
    description:
      'Four short questions establish your business profile — sector, scale, situation, and role. This calibrates the diagnostic to your specific context.',
  },
  {
    num: '02',
    title: 'Select Focus Areas',
    description:
      'Choose one or two dimensions where you are sensing the most pressure. Strategy, operations, revenue, or financial performance.',
  },
  {
    num: '03',
    title: 'Deep Dive Assessment',
    description:
      'Seven structured questions per area, designed to surface the specific patterns that distinguish root causes from symptoms. Takes 5–8 minutes.',
  },
  {
    num: '04',
    title: 'Receive Your Diagnostic',
    description:
      'An immediate output: archetype classification, signal map across all four dimensions, three observed patterns, and one central diagnostic question.',
  },
]

const features = [
  {
    title: 'Clarify the Root Cause',
    description:
      'Go beyond symptoms to uncover the underlying issue affecting performance. The diagnostic maps signal patterns to probable root causes, not just descriptions of the problem.',
  },
  {
    title: 'Prioritize the Right Issue',
    description:
      'Focus on what matters most. Multi-dimensional pressure often traces to a single primary constraint — the diagnostic surfaces which lever has the greatest downstream impact.',
  },
  {
    title: 'Turn Diagnosis into Action',
    description:
      'Receive tailored recommendations — specific enough to take to a leadership meeting, structured enough to drive a focused improvement agenda.',
  },
]

export function HowItWorks() {
  return (
    <>
      {/* Steps section */}
      <section id="how-it-works" className="py-14 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <p
              className="text-[11px] tracking-[0.15em] uppercase text-gold mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              How It Works
            </p>
            <h2
              className="text-3xl md:text-4xl text-navy leading-snug"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Built on the same framework our consultants use in the first week of every engagement.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-cream-border">
            {steps.map((step) => (
              <div key={step.num} className="bg-cream p-8">
                <div
                  className="text-[13px] text-teal font-medium mb-5"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-[18px] text-navy leading-snug mb-3"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[13px] text-text-secondary leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-14 md:py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <p
              className="text-[11px] tracking-[0.15em] uppercase text-gold mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              What You Receive
            </p>
            <h2
              className="text-3xl md:text-4xl text-white leading-snug"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              A diagnostic output that is worth sharing in a leadership meeting.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {features.map((f, idx) => (
              <div key={f.title} className="bg-navy p-8">
                <div className="h-px w-8 bg-teal mb-6" />
                <h3
                  className="text-[18px] text-white leading-snug mb-4"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-[13px] text-white/60 leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
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
          </div>
        </div>
      </section>
    </>
  )
}
