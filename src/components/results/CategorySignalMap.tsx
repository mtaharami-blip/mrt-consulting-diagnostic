'use client'

import type { CategoryScore } from '@/diagnostic/types'
import { categories, signalConfig } from '@/diagnostic/config/categories'
import { cn } from '@/lib/cn'

interface CategorySignalMapProps {
  scores: CategoryScore[]
}

export function CategorySignalMap({ scores }: CategorySignalMapProps) {
  return (
    <div>
      <p
        className="text-[11px] tracking-[0.14em] uppercase text-text-muted mb-5"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Diagnostic Signal Map
      </p>

      <div className="flex flex-col gap-4">
        {scores.map((score) => {
          const cat = categories.find((c) => c.id === score.categoryId)
          if (!cat) return null

          const config = score.assessed ? signalConfig[score.level] : null

          return (
            <div key={score.categoryId}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[13px] text-navy"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {cat.label}
                  </span>
                  {!score.assessed && (
                    <span
                      className="text-[11px] text-text-muted italic"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      (not assessed)
                    </span>
                  )}
                </div>
                {score.assessed && (
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn('text-[11px] tracking-[0.08em] uppercase font-medium', config?.color)}
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {signalConfig[score.level].label}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-[3px] bg-cream-border rounded-full overflow-hidden">
                {score.assessed ? (
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', config?.barColor)}
                    style={{ width: `${score.normalized}%` }}
                  />
                ) : (
                  <div className="h-full w-full bg-cream-border opacity-40" />
                )}
              </div>

              {score.assessed && (
                <div className="flex justify-end mt-1">
                  <span
                    className="text-[11px] text-text-muted"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {score.normalized}/100
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-cream-border">
        {(Object.entries(signalConfig) as [string, (typeof signalConfig)[keyof typeof signalConfig]][]).map(
          ([level, conf]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', conf.barColor)} />
              <span
                className="text-[11px] text-text-muted"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {conf.label.split(' — ')[0]}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}
