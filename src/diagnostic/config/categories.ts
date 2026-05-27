import type { Category, SignalLevel } from '../types'

export const categories: Category[] = [
  {
    id: 'strategy',
    label: 'Strategy & Market Position',
    description: 'Clarity of direction, differentiation, and competitive positioning',
    icon: 'compass',
  },
  {
    id: 'operations',
    label: 'Operations & Execution',
    description: 'Delivery capability, process efficiency, and operational visibility',
    icon: 'settings',
  },
  {
    id: 'revenue',
    label: 'Revenue & Commercial Performance',
    description: 'Growth engine, pricing, customer acquisition and retention',
    icon: 'trending-up',
  },
  {
    id: 'finance',
    label: 'Financial Health & Capital Allocation',
    description: 'Margin profile, cash generation, and investment discipline',
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
    label: 'No primary constraint detected',
    color: 'text-signal-green',
    bgColor: 'bg-signal-green-bg',
    barColor: 'bg-signal-green',
  },
  yellow: {
    label: 'Signals worth monitoring',
    color: 'text-signal-yellow',
    bgColor: 'bg-signal-yellow-bg',
    barColor: 'bg-signal-yellow',
  },
  orange: {
    label: 'Meaningful constraint likely',
    color: 'text-signal-orange',
    bgColor: 'bg-signal-orange-bg',
    barColor: 'bg-signal-orange',
  },
  red: {
    label: 'Primary constraint — high confidence',
    color: 'text-signal-red',
    bgColor: 'bg-signal-red-bg',
    barColor: 'bg-signal-red',
  },
}
