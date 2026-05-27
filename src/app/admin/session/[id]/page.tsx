import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  label,
  sectorLabels,
  scaleLabels,
  situationLabels,
  roleLabels,
  archetypeLabels,
  categoryLabels,
  parseOutput,
  parseScores,
  parseAnswers,
  getAnswerTranscript,
  formatDate,
  signalBarColor,
  signalTextColor,
} from '@/lib/admin-helpers'

export const dynamic = 'force-dynamic'

async function getSession(id: string) {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('diagnostic_sessions')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data
}

const signalLevelLabel: Record<string, string> = {
  green: 'No constraint',
  yellow: 'Monitor',
  orange: 'Constraint',
  red: 'Critical',
}

export default async function AdminSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession(id)
  if (!session) notFound()

  const output = parseOutput(session.output)
  const scores = parseScores(session.scores)
  const answers = parseAnswers(session.answers)
  const transcript = getAnswerTranscript(answers)

  const archetypeName =
    output?.archetypeName ?? label(archetypeLabels, session.archetype_id)

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-8">

      {/* Back + header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-[12px] text-text-muted hover:text-navy transition-colors mb-5"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All sessions
        </Link>

        <div className="flex items-start justify-between gap-4 pb-6 border-b border-cream-border">
          <div>
            <p
              className="text-[10px] tracking-[0.16em] uppercase text-gold mb-2"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Diagnostic Session
            </p>
            <h1
              className="text-[26px] text-navy leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {session.contact_name ?? 'Anonymous Submission'}
            </h1>
            <p
              className="text-[12px] text-text-muted mt-1"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {formatDate(session.completed_at)} · Session {session.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          {session.opted_in ? (
            <span
              className="shrink-0 inline-block px-3 py-1 text-[10px] tracking-[0.1em] uppercase bg-teal-light text-teal border border-teal/20"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Lead — Opted In
            </span>
          ) : (
            <span
              className="shrink-0 inline-block px-3 py-1 text-[10px] tracking-[0.1em] uppercase bg-cream-dark text-text-muted border border-cream-border"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Anonymous
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 mb-6">

        {/* Left column */}
        <div className="flex flex-col gap-4">

          {/* Contact */}
          {session.opted_in && (
            <Section title="Contact Information">
              <Row label="Name" value={session.contact_name} />
              <Row label="Email">
                {session.contact_email ? (
                  <a
                    href={`mailto:${session.contact_email}`}
                    className="text-teal hover:text-teal-dark transition-colors"
                  >
                    {session.contact_email}
                  </a>
                ) : '—'}
              </Row>
              <Row label="Company" value={session.contact_company} />
            </Section>
          )}

          {/* Business profile */}
          <Section title="Business Profile">
            <Row label="Role" value={label(roleLabels, session.role)} />
            <Row label="Sector" value={label(sectorLabels, session.sector)} />
            <Row label="Scale" value={label(scaleLabels, session.scale)} />
            <Row label="Situation" value={label(situationLabels, session.situation)} />
            <Row label="Focus areas" value={
              session.focus_areas?.map((f) => categoryLabels[f] ?? f).join(', ') || '—'
            } />
          </Section>

          {/* Classification */}
          <Section title="Diagnostic Classification">
            <Row label="Archetype" value={archetypeName} emphasis />
            <Row label="Archetype ID" value={session.archetype_id} mono />
            <Row
              label="Flags"
              value={
                session.flags_triggered?.length
                  ? session.flags_triggered.join(', ')
                  : 'None'
              }
              mono
            />
          </Section>

          {/* Signal map */}
          <Section title="Category Signal Map">
            {['strategy', 'operations', 'revenue', 'finance'].map((cat) => {
              const s = scores.find((x) => x.categoryId === cat)
              return (
                <div key={cat} className="flex items-center gap-3 py-1.5">
                  <span
                    className="text-[12px] text-text-secondary w-24 shrink-0"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {categoryLabels[cat]}
                  </span>
                  {s?.assessed ? (
                    <>
                      <div className="flex-1 h-[3px] bg-cream-dark rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${signalBarColor(s.level)}`}
                          style={{ width: `${s.normalized}%` }}
                        />
                      </div>
                      <span
                        className="text-[11px] tabular-nums text-right w-6 text-text-muted"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {s.normalized}
                      </span>
                      <span
                        className={`text-[10px] tracking-[0.08em] uppercase w-20 text-right ${signalTextColor(s.level)}`}
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {signalLevelLabel[s.level] ?? s.level}
                      </span>
                    </>
                  ) : (
                    <span
                      className="flex-1 text-[12px] text-text-muted italic"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Not assessed
                    </span>
                  )}
                </div>
              )
            })}
          </Section>
        </div>

        {/* Right column — diagnostic output */}
        {output ? (
          <div className="flex flex-col gap-4">

            {/* Headline */}
            <Section title="Primary Finding">
              <p
                className="text-[16px] text-navy leading-relaxed"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {output.headline}
              </p>
            </Section>

            {/* Observations */}
            <Section title="Observed Patterns">
              <ol className="flex flex-col gap-3">
                {output.observations.map((obs, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="text-[11px] text-text-muted shrink-0 mt-0.5 w-5 text-right"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {i + 1}.
                    </span>
                    <p
                      className="text-[13px] text-text-secondary leading-relaxed"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {obs}
                    </p>
                  </li>
                ))}
              </ol>
            </Section>

            {/* Central question */}
            <div className="bg-navy rounded-sm p-6">
              <p
                className="text-[9px] tracking-[0.16em] uppercase text-white/40 mb-3"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Central Diagnostic Question
              </p>
              <p
                className="text-[14px] text-white/85 leading-relaxed italic"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                "{output.centralQuestion}"
              </p>
            </div>

            {/* Misdiagnosis */}
            <Section title="What Gets Misdiagnosed Here">
              <p
                className="text-[13px] text-text-secondary leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {output.misdiagnosisNote}
              </p>
            </Section>

            {/* Focus areas */}
            {output.focusAreas.length > 0 && (
              <Section title="Recommended Focus Areas">
                <div className="flex flex-col gap-4">
                  {output.focusAreas.map((area, i) => (
                    <div key={i}>
                      <div className="h-px w-5 bg-teal mb-2" />
                      <p
                        className="text-[13px] font-medium text-navy mb-1"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {area.title}
                      </p>
                      <p
                        className="text-[12px] text-text-secondary leading-relaxed"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {area.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        ) : (
          <div className="bg-cream-dark border border-cream-border p-6 text-[13px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
            Diagnostic output not available for this session.
          </div>
        )}
      </div>

      {/* Answer transcript */}
      {transcript.length > 0 && (
        <div className="border border-cream-border bg-white">
          <div className="px-6 py-4 border-b border-cream-border">
            <p
              className="text-[10px] tracking-[0.16em] uppercase text-text-muted"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Full Answer Transcript
            </p>
          </div>
          <div className="divide-y divide-cream-border">
            {transcript.map((item) => (
              <div key={item.questionId} className="px-6 py-4 grid grid-cols-[5rem_1fr] gap-4">
                <div className="shrink-0 pt-0.5">
                  <span
                    className="text-[11px] font-medium text-teal"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {item.questionId}
                  </span>
                  <span
                    className={`block text-[10px] mt-0.5 ${
                      item.score === 3
                        ? 'text-signal-green'
                        : item.score === 2
                        ? 'text-signal-yellow'
                        : item.score === 1
                        ? 'text-signal-orange'
                        : 'text-signal-red'
                    }`}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Score: {item.score}/3
                  </span>
                </div>
                <div>
                  <p
                    className="text-[12px] text-text-muted mb-1.5 leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {item.questionText}
                  </p>
                  <p
                    className="text-[13px] text-navy leading-snug"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    → {item.answerText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

// ---------------------------------------------------------------------------
// Micro-components
// ---------------------------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-cream-border">
      <div className="px-5 py-3 border-b border-cream-border">
        <p
          className="text-[10px] tracking-[0.14em] uppercase text-text-muted"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {title}
        </p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function Row({
  label: lbl,
  value,
  children,
  emphasis,
  mono,
}: {
  label: string
  value?: string | null
  children?: React.ReactNode
  emphasis?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span
        className="text-[11px] text-text-muted w-24 shrink-0 pt-0.5"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {lbl}
      </span>
      {children ? (
        <span
          className="text-[13px] text-navy flex-1"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {children}
        </span>
      ) : (
        <span
          className={`flex-1 text-[13px] ${emphasis ? 'text-navy font-medium' : 'text-text-secondary'} ${mono ? 'font-mono text-[11px] break-all' : ''}`}
          style={{ fontFamily: mono ? undefined : 'var(--font-inter)' }}
        >
          {value ?? '—'}
        </span>
      )}
    </div>
  )
}
