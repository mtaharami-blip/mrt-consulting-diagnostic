'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { DiagnosticSessionRow } from '@/lib/supabase'
import {
  label,
  sectorLabels,
  roleLabels,
  archetypeLabels,
  parseScores,
  parseOutput,
  formatDate,
  signalBarColor,
} from '@/lib/admin-helpers'

type SortField = 'date' | 'name' | 'archetype' | 'optin'
type SortDir = 'asc' | 'desc'

interface Props {
  sessions: DiagnosticSessionRow[]
}

function ScoreDots({ scores }: { scores: ReturnType<typeof parseScores> }) {
  const cats = ['strategy', 'operations', 'revenue', 'finance']
  return (
    <div className="flex items-center gap-1">
      {cats.map((cat) => {
        const s = scores.find((x) => x.categoryId === cat)
        if (!s?.assessed) {
          return <div key={cat} className="w-2 h-2 rounded-full bg-cream-border" title={`${cat}: N/A`} />
        }
        return (
          <div
            key={cat}
            className={`w-2 h-2 rounded-full ${signalBarColor(s.level)}`}
            title={`${cat}: ${s.normalized}/100 (${s.level})`}
          />
        )
      })}
    </div>
  )
}

export function SessionsTable({ sessions }: Props) {
  const [search, setSearch] = useState('')
  const [optedInOnly, setOptedInOnly] = useState(false)
  const [archetypeFilter, setArchetypeFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const uniqueArchetypes = useMemo(() => {
    const ids = [...new Set(sessions.map((s) => s.archetype_id).filter(Boolean))] as string[]
    return ids.sort((a, b) => (archetypeLabels[a] ?? a).localeCompare(archetypeLabels[b] ?? b))
  }, [sessions])

  const filtered = useMemo(() => {
    let result = [...sessions]

    if (optedInOnly) result = result.filter((s) => s.opted_in)

    if (archetypeFilter !== 'all') {
      result = result.filter((s) => s.archetype_id === archetypeFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.contact_name?.toLowerCase().includes(q) ||
          s.contact_email?.toLowerCase().includes(q) ||
          s.contact_company?.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortField === 'date') {
        cmp = (a.completed_at ?? '').localeCompare(b.completed_at ?? '')
      } else if (sortField === 'name') {
        cmp = (a.contact_name ?? '').localeCompare(b.contact_name ?? '')
      } else if (sortField === 'archetype') {
        cmp = (archetypeLabels[a.archetype_id ?? ''] ?? '').localeCompare(
          archetypeLabels[b.archetype_id ?? ''] ?? ''
        )
      } else if (sortField === 'optin') {
        cmp = Number(a.opted_in) - Number(b.opted_in)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [sessions, search, optedInOnly, archetypeFilter, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function SortIndicator({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-white/20 ml-1">↕</span>
    return <span className="text-gold ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company…"
            className="w-full border border-cream-border bg-white px-4 py-2 text-[13px] text-navy placeholder:text-text-muted outline-none focus:border-teal transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy text-[16px] leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Archetype filter */}
        <select
          value={archetypeFilter}
          onChange={(e) => setArchetypeFilter(e.target.value)}
          className="border border-cream-border bg-white px-3 py-2 text-[12px] text-navy outline-none focus:border-teal transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <option value="all">All archetypes</option>
          {uniqueArchetypes.map((id) => (
            <option key={id} value={id}>
              {archetypeLabels[id] ?? id}
            </option>
          ))}
        </select>

        {/* Opt-in toggle */}
        <button
          onClick={() => setOptedInOnly((v) => !v)}
          className={`px-4 py-2 text-[12px] tracking-[0.06em] uppercase border transition-colors ${
            optedInOnly
              ? 'bg-teal text-white border-teal'
              : 'bg-white text-text-muted border-cream-border hover:border-navy hover:text-navy'
          }`}
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Leads only
        </button>

        {/* Spacer + count */}
        <div className="flex-1" />
        <span
          className="text-[12px] text-text-muted"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {filtered.length} of {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </span>

        {/* CSV Export */}
        <a
          href="/api/admin/export"
          className="inline-flex items-center gap-2 border border-cream-border bg-white px-4 py-2 text-[12px] tracking-[0.06em] uppercase text-text-secondary hover:border-navy hover:text-navy transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export CSV
        </a>
      </div>

      {/* Table */}
      <div className="border border-cream-border bg-white overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-cream-border bg-cream-dark">
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal cursor-pointer hover:text-navy select-none whitespace-nowrap"
                style={{ fontFamily: 'var(--font-inter)' }}
                onClick={() => toggleSort('date')}
              >
                Date <SortIndicator field="date" />
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal cursor-pointer hover:text-navy select-none"
                style={{ fontFamily: 'var(--font-inter)' }}
                onClick={() => toggleSort('name')}
              >
                Name <SortIndicator field="name" />
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Email
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Company
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Phone
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Role
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Sector
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal cursor-pointer hover:text-navy select-none whitespace-nowrap"
                style={{ fontFamily: 'var(--font-inter)' }}
                onClick={() => toggleSort('archetype')}
              >
                Archetype <SortIndicator field="archetype" />
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal"
                style={{ fontFamily: 'var(--font-inter)' }}
                title="Strategy · Operations · Revenue · Finance"
              >
                Signals
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-text-muted font-normal cursor-pointer hover:text-navy select-none"
                style={{ fontFamily: 'var(--font-inter)' }}
                onClick={() => toggleSort('optin')}
              >
                Lead <SortIndicator field="optin" />
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-12 text-center text-[13px] text-text-muted"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  No sessions match your filters.
                </td>
              </tr>
            )}
            {filtered.map((session, idx) => {
              const scores = parseScores(session.scores)
              const output = parseOutput(session.output)
              const archetypeName =
                output?.archetypeName ?? label(archetypeLabels, session.archetype_id)

              return (
                <tr
                  key={session.id}
                  className={`border-b border-cream-border hover:bg-cream/60 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-cream/30'
                  }`}
                >
                  <td
                    className="px-4 py-3 text-[12px] text-text-muted whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {formatDate(session.completed_at)}
                  </td>
                  <td
                    className="px-4 py-3 text-[13px] text-navy font-medium max-w-[140px] truncate"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    title={session.contact_name ?? undefined}
                  >
                    {session.contact_name ?? <span className="text-text-muted font-normal">—</span>}
                  </td>
                  <td
                    className="px-4 py-3 text-[12px] text-text-secondary max-w-[180px] truncate"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    title={session.contact_email ?? undefined}
                  >
                    {session.contact_email ?? <span className="text-text-muted">—</span>}
                  </td>
                  <td
                    className="px-4 py-3 text-[12px] text-text-secondary max-w-[140px] truncate"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    title={session.contact_company ?? undefined}
                  >
                    {session.contact_company ?? <span className="text-text-muted">—</span>}
                  </td>
                  <td
                    className="px-4 py-3 text-[12px] text-text-secondary whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    title={session.contact_phone ?? undefined}
                  >
                    {session.contact_phone ?? <span className="text-text-muted">—</span>}
                  </td>
                  <td
                    className="px-4 py-3 text-[12px] text-text-secondary whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {label(roleLabels, session.role)}
                  </td>
                  <td
                    className="px-4 py-3 text-[12px] text-text-secondary whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {label(sectorLabels, session.sector)}
                  </td>
                  <td
                    className="px-4 py-3 text-[12px] text-navy whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {archetypeName}
                  </td>
                  <td className="px-4 py-3">
                    <ScoreDots scores={scores} />
                  </td>
                  <td className="px-4 py-3">
                    {session.opted_in ? (
                      <span
                        className="inline-block px-2 py-0.5 text-[10px] tracking-[0.08em] uppercase bg-teal-light text-teal border border-teal/20"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        Lead
                      </span>
                    ) : (
                      <span
                        className="inline-block px-2 py-0.5 text-[10px] tracking-[0.08em] uppercase bg-cream-dark text-text-muted border border-cream-border"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        Anon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/session/${session.id}`}
                      className="text-[11px] tracking-[0.08em] uppercase text-teal hover:text-teal-dark transition-colors whitespace-nowrap"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
