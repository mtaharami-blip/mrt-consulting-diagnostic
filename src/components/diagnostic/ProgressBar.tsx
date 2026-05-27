'use client'

interface ProgressBarProps {
  percent: number
  step: string
  questionIndex?: number
  totalQuestions?: number
}

export function ProgressBar({ percent, step, questionIndex, totalQuestions }: ProgressBarProps) {
  const stepLabel: Record<string, string> = {
    intro: '',
    contact: '',
    context: 'Business Context',
    focus: 'Focus Areas',
    questions: 'Assessment',
    processing: 'Analysing',
    done: 'Complete',
  }

  const showQuestionCount = step === 'questions' && totalQuestions && totalQuestions > 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[11px] tracking-[0.12em] uppercase font-sans text-text-muted"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {stepLabel[step] || ''}
        </span>
        {showQuestionCount && (
          <span
            className="text-[11px] tracking-[0.08em] font-sans text-text-muted"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {questionIndex! + 1} of {totalQuestions}
          </span>
        )}
      </div>
      <div className="h-[2px] bg-cream-border rounded-full overflow-hidden">
        <div
          className="h-full bg-teal rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
