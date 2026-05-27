import Link from 'next/link'
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton'

export const metadata = {
  title: 'Admin Dashboard — MRT Consulting',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Top nav */}
      <header className="bg-navy text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-6 h-6 bg-white/10 border border-white/20 rounded-sm flex items-center justify-center">
                <span
                  className="text-white text-[11px] font-semibold"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  M
                </span>
              </div>
              <span
                className="text-[11px] tracking-[0.14em] uppercase text-white/70 group-hover:text-white/90 transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                MRT Consulting
              </span>
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <span
              className="text-[11px] tracking-[0.12em] uppercase text-gold"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="text-[12px] text-white/60 hover:text-white/90 transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Sessions
            </Link>
            <a
              href="/api/admin/export"
              className="text-[12px] text-white/60 hover:text-white/90 transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Export CSV
            </a>
            <div className="h-4 w-px bg-white/20" />
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}
