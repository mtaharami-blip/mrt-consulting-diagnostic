'use client'

import { useRouter } from 'next/navigation'

export function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[12px] text-white/40 hover:text-white/70 transition-colors"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      Sign out
    </button>
  )
}
