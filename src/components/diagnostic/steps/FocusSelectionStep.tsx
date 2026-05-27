'use client'

import { useState } from 'react'
import { useDiagnostic } from '../DiagnosticProvider'
import { categories } from '@/diagnostic/config/categories'
import type { CategoryId } from '@/diagnostic/types'
import { cn } from '@/lib/cn'

const categoryIcons: Record<CategoryId, React.ReactNode> = {
  strategy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  ),
  operations: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  revenue: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  finance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
}

export function FocusSelectionStep() {
  const { state, dispatch } = useDiagnostic()
  const [selected, setSelected] = useState<CategoryId[]>(state.focusAreas)

  function toggleCategory(id: CategoryId) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((c) => c !== id)
      }
      if (prev.length >= 2) {
        return [prev[1], id]
      }
      return [...prev, id]
    })
  }

  function handleContinue() {
    if (selected.length === 0) return
    dispatch({ type: 'SET_FOCUS_AREAS', areas: selected })
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="flex flex-col max-w-2xl w-full">
      <p
        className="text-[11px] tracking-[0.15em] uppercase mb-2 text-gold"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Focus Areas
      </p>

      <h2
        className="text-2xl md:text-3xl text-navy leading-snug mb-2"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Where are you seeing the biggest challenge?
      </h2>

      <p
        className="text-[14px] text-text-secondary mb-8"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Select up to two areas. Your diagnostic will focus on these dimensions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id)
          const selectionOrder = selected.indexOf(cat.id)

          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                'relative text-left p-5 border rounded-sm transition-all duration-150 cursor-pointer group',
                isSelected
                  ? 'bg-navy border-navy text-white'
                  : 'bg-white border-cream-border text-navy hover:border-navy-700 hover:bg-cream-dark'
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-teal flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}

              <div className={cn('mb-3', isSelected ? 'text-white/70' : 'text-text-muted')}>
                {categoryIcons[cat.id]}
              </div>

              <h3
                className={cn(
                  'text-[15px] font-medium mb-1 leading-snug',
                  isSelected ? 'text-white' : 'text-navy'
                )}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {cat.label.split(' & ')[0]}
                {cat.label.includes(' & ') && (
                  <span className={isSelected ? 'text-white/80' : 'text-text-secondary'}>
                    {' & ' + cat.label.split(' & ')[1]}
                  </span>
                )}
              </h3>

              <p
                className={cn(
                  'text-[12px] leading-snug',
                  isSelected ? 'text-white/70' : 'text-text-muted'
                )}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {cat.description}
              </p>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={cn(
            'inline-flex items-center gap-3 px-8 py-4 text-[13px] tracking-[0.08em] uppercase transition-all duration-200',
            selected.length > 0
              ? 'bg-teal text-white hover:bg-teal-dark cursor-pointer'
              : 'bg-cream-border text-text-muted cursor-not-allowed'
          )}
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Begin Assessment
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {selected.length > 0 && (
          <p className="text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
            {selected.length === 1
              ? `${categories.find(c => c.id === selected[0])?.label.split(' & ')[0]} selected`
              : `${selected.length} areas selected`}
          </p>
        )}
      </div>
    </div>
  )
}
