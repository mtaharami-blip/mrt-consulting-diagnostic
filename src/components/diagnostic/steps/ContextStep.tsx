'use client'

import { useState } from 'react'
import { useDiagnostic } from '../DiagnosticProvider'
import { contextQuestions } from '@/diagnostic/config/context-questions'
import { cn } from '@/lib/cn'

export function ContextStep() {
  const { state, dispatch } = useDiagnostic()
  const [currentQ, setCurrentQ] = useState(0)

  const question = contextQuestions[currentQ]
  const selectedValue = question ? state.context[question.field] : undefined
  const isLastContext = currentQ === contextQuestions.length - 1

  function handleSelect(optionId: string) {
    if (!question) return
    dispatch({ type: 'SET_CONTEXT', field: question.field, value: optionId })

    setTimeout(() => {
      if (isLastContext) {
        dispatch({ type: 'NEXT_STEP' })
      } else {
        setCurrentQ((q) => q + 1)
      }
    }, 280)
  }

  if (!question) return null

  return (
    <div className="flex flex-col max-w-2xl w-full">
      <p
        className="text-[11px] tracking-[0.15em] uppercase mb-2 text-gold"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Context — {currentQ + 1} of {contextQuestions.length}
      </p>

      <h2
        className="text-2xl md:text-3xl text-navy leading-snug mb-8"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {question.text}
      </h2>

      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          const selected = selectedValue === option.id
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={cn(
                'text-left px-5 py-4 border rounded-sm transition-all duration-150 cursor-pointer group',
                selected
                  ? 'bg-navy border-navy text-white'
                  : 'bg-white border-cream-border text-navy hover:border-navy-700 hover:bg-cream-dark'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                    selected ? 'border-white' : 'border-cream-border group-hover:border-navy-600'
                  )}
                >
                  {selected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className="text-[14px] leading-snug"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {option.text}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {currentQ > 0 && (
        <button
          onClick={() => setCurrentQ((q) => q - 1)}
          className="mt-6 text-[12px] text-text-muted hover:text-navy transition-colors self-start flex items-center gap-2"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      )}
    </div>
  )
}
