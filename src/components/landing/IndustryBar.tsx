const industries = [
  'Industrials',
  'Financial Services',
  'Infrastructure',
  'Technology',
  'Healthcare',
  'Professional Services',
]

export function IndustryBar() {
  return (
    <section className="bg-cream-dark border-y border-cream-border py-5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <p
            className="text-[11px] tracking-[0.14em] uppercase text-text-muted whitespace-nowrap"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Trusted by leaders across
          </p>
          <div className="h-4 w-px bg-cream-border hidden md:block" />
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {industries.map((name) => (
              <span
                key={name}
                className="text-[12px] tracking-[0.08em] uppercase text-text-muted"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
