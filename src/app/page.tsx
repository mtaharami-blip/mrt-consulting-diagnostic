import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { IndustryBar } from '@/components/landing/IndustryBar'
import { HowItWorks } from '@/components/landing/HowItWorks'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <IndustryBar />
      <HowItWorks />

      {/* Final CTA */}
      <section className="bg-cream py-14 md:py-20 border-t border-cream-border">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <p
            className="text-[11px] tracking-[0.15em] uppercase text-gold mb-5"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Begin the Diagnostic
          </p>
          <h2
            className="text-3xl md:text-5xl text-navy leading-snug mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Understand what is actually holding your business back.
          </h2>
          <p
            className="text-[16px] text-text-secondary leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            In 7–10 minutes, receive a structured diagnostic that most leadership teams spend
            weeks trying to produce on their own.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center gap-3 bg-teal text-white px-8 py-4 text-[13px] tracking-[0.08em] uppercase hover:bg-teal-dark transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Start the Free Assessment
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white/10 border border-white/20 rounded-sm flex items-center justify-center">
              <span
                className="text-white text-[11px] font-semibold"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                M
              </span>
            </div>
            <span
              className="text-[12px] tracking-[0.14em] uppercase text-white/60"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              MRT Consulting
            </span>
          </div>

          <p className="text-[12px] text-white/40" style={{ fontFamily: 'var(--font-inter)' }}>
            © {new Date().getFullYear()} MRT Consulting. All diagnostic responses are confidential.
          </p>
        </div>
      </footer>
    </div>
  )
}
