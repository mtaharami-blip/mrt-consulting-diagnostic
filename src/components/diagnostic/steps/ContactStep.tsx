'use client'

import { useState } from 'react'
import { useDiagnostic } from '../DiagnosticProvider'
import { cn } from '@/lib/cn'

export function ContactStep() {
  const { dispatch } = useDiagnostic()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const isValid =
    name.trim().length > 0 &&
    company.trim().length > 0 &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    dispatch({
      type: 'SET_CONTACT_INFO',
      info: {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      },
    })
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="flex flex-col max-w-xl w-full">
      <p
        className="text-[11px] tracking-[0.15em] uppercase mb-6 text-gold"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Your Profile
      </p>

      <h2
        className="text-3xl md:text-4xl text-navy leading-snug mb-3"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Before we begin, tell us who you are.
      </h2>

      <p
        className="text-[14px] text-text-secondary leading-relaxed mb-8"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Your diagnostic will be prepared specifically for you. A consultant will follow
        up with a personalized interpretation of your results.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Full Name <span className="text-gold normal-case tracking-normal">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              autoFocus
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Company <span className="text-gold normal-case tracking-normal">*</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
              required
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Email Address <span className="text-gold normal-case tracking-normal">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] tracking-[0.1em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Phone{' '}
              <span
                className="normal-case tracking-normal text-text-muted"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                (optional)
              </span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 000 000 0000"
              className="border border-cream-border bg-white px-4 py-3 text-[14px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>
        </div>

        <div className="mt-2">
          <button
            type="submit"
            disabled={!isValid}
            className={cn(
              'inline-flex items-center gap-3 px-8 py-4 text-[13px] tracking-[0.08em] uppercase transition-colors duration-200',
              isValid
                ? 'bg-teal text-white hover:bg-teal-dark cursor-pointer'
                : 'bg-cream-dark text-text-muted cursor-not-allowed border border-cream-border'
            )}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Begin the Assessment
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>

      <p
        className="mt-5 text-[12px] text-text-muted"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Your details are handled with the same confidentiality as your diagnostic responses.
      </p>
    </div>
  )
}
