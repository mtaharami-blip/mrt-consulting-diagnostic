import type { CategoryScore, DiagnosticOutput } from '@/diagnostic/types'
import { questions } from '@/diagnostic/config/questions'
import type { Json } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// Label maps — human-readable strings for stored IDs
// ---------------------------------------------------------------------------

export const sectorLabels: Record<string, string> = {
  professional_services: 'B2B Professional Services',
  technology: 'B2B Technology / Software',
  industrial: 'Industrial / Manufacturing',
  financial_services: 'Financial Services',
  healthcare: 'Healthcare / Life Sciences',
  consumer: 'Consumer / Retail',
  other: 'Other',
}

export const scaleLabels: Record<string, string> = {
  under_10m: 'Under $10M',
  '10_50m': '$10M – $50M',
  '50_150m': '$50M – $150M',
  '150_500m': '$150M – $500M',
  over_500m: 'Over $500M',
}

export const situationLabels: Record<string, string> = {
  growing_under_pressure: 'Growing — margins under pressure',
  plateaued: 'Growth has plateaued',
  declining: 'Performance declining',
  sensing_risk: 'Sensing a risk ahead',
  transition: 'Preparing for transition',
}

export const roleLabels: Record<string, string> = {
  ceo: 'CEO / MD / Owner',
  coo: 'COO',
  cfo: 'CFO',
  commercial: 'Commercial / Sales Leader',
  board: 'Board Member / Investor',
  other: 'Other Senior Leader',
}

export const archetypeLabels: Record<string, string> = {
  // New BCT + PST patterns
  strategic_clarity_deficit:        'Strategic Clarity Deficit',
  business_model_mismatch:          'Business Model Mismatch',
  operating_model_lag:              'Operating Model Lag',
  management_infrastructure_deficit:'Management Infrastructure Deficit',
  systemic_misalignment:            'Systemic Misalignment',
  narrative_confidence_gap:         'Narrative Confidence Gap',
  external_constraint:              'External Constraint',
  broad_review:                     'Broad Review Recommended',
  // Legacy archetypes (backward compat for old sessions)
  scaling_inflection: 'Scaling Inflection',
  strategic_drift:    'Strategic Drift',
  execution_gap:      'Execution Gap',
  commercial_engine:  'Commercial Engine',
  financial_symptom:  'Financial Symptom',
  margin_capital:     'Margin & Capital Discipline',
  systemic_pressure:  'Systemic Pressure',
  fallback:           'Broad Review Recommended',
}

export const categoryLabels: Record<string, string> = {
  strategy:   'Strategy',
  operations: 'Operating Model',
  revenue:    'Business Model',
  finance:    'Performance',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Look up a human-readable label, falling back gracefully to the raw ID. */
export function label(map: Record<string, string>, id: string | null | undefined): string {
  if (!id) return '—'
  return map[id] ?? id
}

/** Safely parse JSONB → DiagnosticOutput */
export function parseOutput(json: Json | null): DiagnosticOutput | null {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return null
  return json as unknown as DiagnosticOutput
}

/** Safely parse JSONB → CategoryScore[] */
export function parseScores(json: Json | null): CategoryScore[] {
  if (!json || !Array.isArray(json)) return []
  return json as unknown as CategoryScore[]
}

/** Safely parse JSONB → answers map */
export function parseAnswers(json: Json | null): Record<string, string> {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {}
  return json as unknown as Record<string, string>
}

/** Build a readable answer transcript from raw answers map. */
export function getAnswerTranscript(answers: Record<string, string>) {
  const categoryOrder = ['strategy', 'operations', 'revenue', 'finance']

  return Object.entries(answers)
    .map(([questionId, answerId]) => {
      const question = questions.find((q) => q.id === questionId)
      if (!question) return null
      const option = question.options.find((o) => o.id === answerId)
      if (!option) return null
      return {
        questionId,
        questionText: question.text,
        answerId,
        answerText: option.text,
        score: option.score,
        category: question.category,
        categoryOrder: categoryOrder.indexOf(question.category),
        questionNum: parseInt(questionId.slice(1), 10),
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (!a || !b) return 0
      if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder
      return a.questionNum - b.questionNum
    }) as Array<{
    questionId: string
    questionText: string
    answerId: string
    answerText: string
    score: number
    category: string
    categoryOrder: number
    questionNum: number
  }>
}

/** Format ISO timestamp → "May 27, 2026, 2:34 PM" */
export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Format ISO timestamp → "May 27, 2026" */
export function formatDateShort(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Signal level → Tailwind bg color class */
export function signalBarColor(level: string): string {
  switch (level) {
    case 'green': return 'bg-signal-green'
    case 'yellow': return 'bg-signal-yellow'
    case 'orange': return 'bg-signal-orange'
    case 'red': return 'bg-signal-red'
    default: return 'bg-cream-border'
  }
}

/** Signal level → Tailwind text color class */
export function signalTextColor(level: string): string {
  switch (level) {
    case 'green': return 'text-signal-green'
    case 'yellow': return 'text-signal-yellow'
    case 'orange': return 'text-signal-orange'
    case 'red': return 'text-signal-red'
    default: return 'text-text-muted'
  }
}
