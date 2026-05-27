import Link from 'next/link'

export function Nav() {
  return (
    <header className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-white/10 border border-white/20 rounded-sm flex items-center justify-center group-hover:bg-white/15 transition-colors">
            <span
              className="text-white text-[13px] font-semibold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              M
            </span>
          </div>
          <div>
            <span
              className="text-[12px] tracking-[0.16em] uppercase text-white/90"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              MRT
            </span>
            <span
              className="text-[12px] tracking-[0.16em] uppercase text-white/50 ml-1.5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Consulting
            </span>
          </div>
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {['Capabilities', 'Industries', 'Insights', 'About'].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-[13px] text-white/60 hover:text-white/90 transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/diagnostic"
          className="bg-teal text-white px-5 py-2.5 text-[12px] tracking-[0.08em] uppercase hover:bg-teal-dark transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Start Diagnostic
        </Link>
      </div>
    </header>
  )
}
