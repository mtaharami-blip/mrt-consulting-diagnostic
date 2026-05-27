'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') ?? '/admin'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Invalid password.')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-12 justify-center">
          <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-sm flex items-center justify-center">
            <span
              className="text-white text-[14px] font-semibold"
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
              className="text-[12px] tracking-[0.16em] uppercase text-white/40 ml-1.5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Consulting
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-cream rounded-sm p-8">
          <p
            className="text-[10px] tracking-[0.16em] uppercase text-gold mb-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Internal Access
          </p>
          <h1
            className="text-[22px] text-navy mb-6 leading-snug"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Admin Dashboard
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] tracking-[0.1em] uppercase text-text-muted mb-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full border border-cream-border bg-white px-4 py-3 text-[14px] text-navy outline-none focus:border-teal transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <p
                className="text-[12px] text-signal-red"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-navy text-white py-3 text-[12px] tracking-[0.08em] uppercase hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p
          className="text-center text-[11px] text-white/30 mt-6"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          MRT Consulting · Internal Use Only
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
