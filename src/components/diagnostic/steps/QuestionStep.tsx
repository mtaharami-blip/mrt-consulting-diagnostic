'use client'

import { useEffect, useState } from 'react'
import { useDiagnostic } from '../DiagnosticProvider'
import { cn } from '@/lib/cn'
import { categories } from '@/diagnostic/config/categories'
import type { CategoryId } from '@/diagnostic/types'

const categoryLabel: Record<CategoryId, string> = {
  strategy: 'Strategy',
  operations: 'Operations',
  revenue: 'Revenue',
  finance: 'Finance',
}

export function QuestionStep() {
  const { state, dispatch, currentQuestions, totalQuestions, isLastQuestion, progressPercent } =
    useDiagnostic()
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(true)

  const question = currentQuestions[state.questionIndex]
  const selectedAnswer = question ? state.answers[question.id] : undefined

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [state.questionIndex])

  function handleSelect(answerId: string) {
    if (!question || animating) return

    dispatch({ type: 'SET_ANSWER', questionId: question.id, answerId })

    if (isLastQuestion) {
      // All questions answered — go to contact gate before showing results
      setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' })
      }, 350)
    } else {
      setAnimating(true)
      setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' })
        setAnimating(false)
      }, 300)
    }
  }

  function handleBack() {
    if (state.questionIndex === 0) {
      dispatch({ type: 'NEXT_STEP' }) // won't work — need prev step logic
    } else {
      dispatch({ type: 'NEXT_QUESTION' }) // placeholder; real back handled below
    }
  }

  if (!question) return null

  const catLabel = categoryLabel[question.category]

  return (
    <div
      className={cn(
        'flex flex-col max-w-2xl w-full transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <p
        className="text-[11px] tracking-[0.15em] uppercase mb-2 text-gold"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {catLabel}
      </p>

      <h2
        className="text-2xl md:text-[28px] text-navy leading-snug mb-8 font-normal"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {question.text}
      </h2>

      <div className="flex flex-col gap-2.5">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option.id
          const letter = String.fromCharCode(65 + idx) // A, B, C...

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={animating}
              className={cn(
                'text-left px-5 py-4 border rounded-sm transition-all duration-150 group',
                animating ? 'cursor-default' : 'cursor-pointer',
                isSelected
                  ? 'bg-navy border-navy text-white'
                  : 'bg-white border-cream-border text-navy hover:border-navy-700 hover:bg-cream-dark'
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    'text-[11px] tracking-[0.1em] mt-0.5 flex-shrink-0 w-5 font-medium transition-colors',
                    isSelected ? 'text-white/60' : 'text-text-muted'
                  )}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {letter}
                </span>
                <span
                  className={cn(
                    'text-[14px] leading-relaxed transition-colors',
                    isSelected ? 'text-white' : 'text-navy'
                  )}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {option.text}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {state.questionIndex > 0 && (
        <button
          onClick={() => {
            setAnimating(true)
            setTimeout(() => {
              dispatch({ type: 'PREV_QUESTION' })
              setAnimating(false)
            }, 200)
          }}
          className="mt-6 text-[12px] text-text-muted hover:text-navy transition-colors self-start flex items-center gap-2"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Previous question
        </button>
      )}
    </div>
  )
}
