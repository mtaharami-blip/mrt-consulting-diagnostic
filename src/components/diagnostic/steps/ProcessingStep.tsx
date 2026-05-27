'use client'

import { useEffect, useState } from 'react'

const steps = [
  'Mapping your diagnostic profile',
  'Identifying signal patterns',
  'Classifying root cause indicators',
  'Generating your diagnostic output',
]

export function ProcessingStep() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, steps.length - 1))
    }, 700)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-start max-w-md">
      <div className="mb-10">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mb-6" />
        <h2
          className="text-2xl md:text-3xl text-navy leading-snug"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Analysing your responses
        </h2>
        <p
          className="text-[14px] text-text-secondary mt-3"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          This takes a moment. Your results are being generated.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {steps.map((step, idx) => {
          const done = idx < activeStep
          const active = idx === activeStep
          return (
            <div
              key={step}
              className="flex items-center gap-3 transition-opacity duration-300"
              style={{ opacity: idx <= activeStep ? 1 : 0.3 }}
            >
              <div className="w-4 h-4 flex-shrink-0">
                {done ? (
                  <svg viewBox="0 0 16 16" fill="none" className="text-teal">
                    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : active ? (
                  <div className="w-4 h-4 border border-teal border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-cream-border" />
                )}
              </div>
              <span
                className="text-[13px] text-text-secondary"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
