import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  label,
  sectorLabels,
  scaleLabels,
  situationLabels,
  roleLabels,
  archetypeLabels,
  parseScores,
  formatDateShort,
} from '@/lib/admin-helpers'

function escapeCsv(val: string | null | undefined): string {
  const str = val ?? ''
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const HEADERS = [
  'Session ID',
  'Date',
  'Name',
  'Email',
  'Company',
  'Phone',
  'Role',
  'Sector',
  'Scale',
  'Situation',
  'Archetype',
  'Focus Areas',
  'Strategy Score',
  'Operations Score',
  'Revenue Score',
  'Finance Score',
]

export async function GET() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { data: sessions, error } = await supabase
    .from('diagnostic_sessions')
    .select('*')
    .order('completed_at', { ascending: false })
    .limit(5000)

  if (error || !sessions) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }

  const rows = sessions.map((s) => {
    const scores = parseScores(s.scores)
    const getScore = (catId: string) => {
      const sc = scores.find((x) => x.categoryId === catId)
      return sc?.assessed ? String(sc.normalized) : 'N/A'
    }

    return [
      s.id,
      formatDateShort(s.completed_at),
      s.contact_name ?? '',
      s.contact_email ?? '',
      s.contact_company ?? '',
      (s as unknown as { contact_phone?: string | null }).contact_phone ?? '',
      label(roleLabels, s.role),
      label(sectorLabels, s.sector),
      label(scaleLabels, s.scale),
      label(situationLabels, s.situation),
      label(archetypeLabels, s.archetype_id),
      (s.focus_areas ?? []).join(' | '),
      getScore('strategy'),
      getScore('operations'),
      getScore('revenue'),
      getScore('finance'),
    ]
      .map(escapeCsv)
      .join(',')
  })

  const csv = [HEADERS.join(','), ...rows].join('\n')
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="mrt-diagnostics-${date}.csv"`,
    },
  })
}
