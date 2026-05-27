import type { Category, SignalLevel } from '../types'

export const categories: Category[] = [
  {
    id: 'strategy',
    label: 'Strategy',
    description: 'Strategic clarity, differentiation, market validation, and leadership alignment',
    icon: 'compass',
  },
  {
    id: 'operations',
    label: 'Operating Model',
    description: 'Organizational configuration, delivery coherence, and management infrastructure',
    icon: 'settings',
  },
  {
    id: 'revenue',
    label: 'Business Model',
    description: 'Value proposition, monetization logic, and structural leverage',
    icon: 'trending-up',
  },
  {
    id: 'finance',
    label: 'Performance',
    description: 'Metric alignment, improvement reliability, and management discipline',
    icon: 'dollar-sign',
  },
]

export const signalThresholds: Record<SignalLevel, { min: number; max: number }> = {
  green: { min: 80, max: 100 },
  yellow: { min: 60, max: 79 },
  orange: { min: 35, max: 59 },
  red: { min: 0, max: 34 },
}

export function normalizedToLevel(normalized: number): SignalLevel {
  if (normalized >= 80) return 'green'
  if (normalized >= 60) return 'yellow'
  if (normalized >= 35) return 'orange'
  return 'red'
}

export const signalConfig: Record<
  SignalLevel,
  { label: string; color: string; bgColor: string; barColor: string }
> = {
  green: {
    label: 'No constraint signal',
    color: 'text-signal-green',
    bgColor: 'bg-signal-green-bg',
    barColor: 'bg-signal-green',
  },
  yellow: {
    label: 'Signals to monitor',
    color: 'text-signal-yellow',
    bgColor: 'bg-signal-yellow-bg',
    barColor: 'bg-signal-yellow',
  },
  orange: {
    label: 'Constraint pattern emerging',
    color: 'text-signal-orange',
    bgColor: 'bg-signal-orange-bg',
    barColor: 'bg-signal-orange',
  },
  red: {
    label: 'Active constraint — high confidence',
    color: 'text-signal-red',
    bgColor: 'bg-signal-red-bg',
    barColor: 'bg-signal-red',
  },
}
