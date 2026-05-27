import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { SessionsTable } from '@/components/admin/SessionsTable'

export const dynamic = 'force-dynamic'

async function getSessions() {
  if (!isSupabaseConfigured || !supabase) return []

  const { data, error } = await supabase
    .from('diagnostic_sessions')
    .select('*')
    .order('completed_at', { ascending: false })
    .limit(1000)

  if (error) {
    console.error('Admin: failed to fetch sessions', error)
    return []
  }

  return data ?? []
}

export default async function AdminPage() {
  const sessions = await getSessions()

  const totalLeads = sessions.filter((s) => s.opted_in).length
  const thisWeek = sessions.filter((s) => {
    if (!s.completed_at) return false
    const d = new Date(s.completed_at)
    const now = new Date()
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8">

      {/* Page header */}
      <div className="flex items-end justify-between mb-8 pb-6 border-b border-cream-border">
        <div>
          <p
            className="text-[10px] tracking-[0.16em] uppercase text-gold mb-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Internal Dashboard
          </p>
          <h1
            className="text-[28px] text-navy leading-none"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Diagnostic Submissions
          </h1>
        </div>

        {/* Summary stats */}
        <div className="flex items-center gap-8">
          {[
            { num: sessions.length, label: 'Total sessions' },
            { num: totalLeads, label: 'Leads' },
            { num: thisWeek, label: 'This week' },
          ].map(({ num, label }) => (
            <div key={label} className="text-right">
              <div
                className="text-[22px] font-semibold text-navy leading-none"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {num}
              </div>
              <div
                className="text-[11px] text-text-muted mt-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-signal-yellow-bg border border-signal-yellow/30 px-5 py-4 mb-6 text-[13px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>
          <strong>Supabase not configured.</strong> Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to load real data.
        </div>
      )}

      <SessionsTable sessions={sessions} />
    </main>
  )
}
