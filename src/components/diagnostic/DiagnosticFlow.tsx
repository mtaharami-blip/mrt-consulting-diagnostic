'use client'

import { useDiagnostic } from './DiagnosticProvider'
import { ProgressBar } from './ProgressBar'
import { IntroStep } from './steps/IntroStep'
import { ContactStep } from './steps/ContactStep'
import { ContextStep } from './steps/ContextStep'
import { FocusSelectionStep } from './steps/FocusSelectionStep'
import { QuestionStep } from './steps/QuestionStep'
import { ProcessingStep } from './steps/ProcessingStep'
import Link from 'next/link'

export function DiagnosticFlow() {
  const { state, progressPercent, totalQuestions } = useDiagnostic()
  const showProgress = state.step !== 'intro' && state.step !== 'done'

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="border-b border-cream-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-navy hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-navy rounded-sm flex items-center justify-center">
            <span
              className="text-white text-[13px] font-semibold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              M
            </span>
          </div>
          <span
            className="text-[12px] tracking-[0.12em] uppercase text-navy hidden sm:block"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            MRT Consulting
          </span>
        </Link>

        {showProgress && (
          <div className="flex-1 max-w-xs mx-8">
            <ProgressBar
              percent={progressPercent}
              step={state.step}
              questionIndex={state.step === 'questions' ? state.questionIndex : undefined}
              totalQuestions={state.step === 'questions' ? totalQuestions : undefined}
            />
          </div>
        )}

        <div className="w-24 flex justify-end">
          {state.step !== 'intro' && state.step !== 'processing' && (
            <span
              className="text-[11px] tracking-[0.08em] text-text-muted uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Confidential
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-12 py-12 md:py-20">
        <div className="w-full max-w-2xl">
          {state.step === 'intro' && <IntroStep />}
          {state.step === 'contact' && <ContactStep />}
          {state.step === 'context' && <ContextStep />}
          {state.step === 'focus' && <FocusSelectionStep />}
          {state.step === 'questions' && <QuestionStep />}
          {state.step === 'processing' && <ProcessingStep />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-border px-6 md:px-12 py-4">
        <p
          className="text-[11px] text-text-muted text-center"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Your responses are confidential and are not shared without your consent.
        </p>
      </footer>
    </div>
  )
}
