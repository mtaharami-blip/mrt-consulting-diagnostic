/**
 * Pattern Matcher — BCT + PST Diagnostic Pattern Classification
 *
 * Takes LayerSignal[], AlignmentTest[], NarrativeConflict[], and context
 * and returns the best-matching DiagnosticPattern.
 *
 * Replaces the old score-threshold archetype classifier.
 * Pure function. No side effects, no DB access.
 */

import type {
  LayerSignal,
  AlignmentTest,
  NarrativeConflict,
  ConstraintLocation,
  ContextAnswers,
  DiagnosticPattern,
  PatternLayerCondition,
  AlignmentResult,
  FrameworkLayer,
  LayerStrength,
} from '../types'
import { diagnosticPatterns, fallbackPattern } from '../config/diagnostic-patterns'

// ─── Condition evaluation ─────────────────────────────────────────────────────

function evaluateLayerCondition(
  condition: PatternLayerCondition,
  layerSignals: LayerSignal[],
): boolean {
  const signal = layerSignals.find(s => s.layer === condition.layer)
  if (!signal) return false

  const strengthMatches = condition.strength.includes(signal.strength)
  if (!strengthMatches) return false

  if (condition.coherent !== undefined && signal.coherent !== condition.coherent) {
    return false
  }

  return true
}

function evaluateAlignmentCondition(
  condition: { id: AlignmentTest['id']; results: AlignmentResult[] },
  alignmentTests: AlignmentTest[],
): boolean {
  const test = alignmentTests.find(t => t.id === condition.id)
  if (!test) return false
  return condition.results.includes(test.result)
}

function evaluateContextCondition(
  condition: { field: 'sector' | 'scale' | 'situation' | 'role'; values: string[] },
  context: ContextAnswers,
): boolean {
  const value = context[condition.field]
  if (!value) return false
  return condition.values.includes(value)
}

/**
 * Evaluates whether a pattern's trigger conditions are met.
 * Returns a match score (0 = no match, higher = stronger match).
 */
function evaluatePattern(
  pattern: DiagnosticPattern,
  layerSignals: LayerSignal[],
  alignmentTests: AlignmentTest[],
  narrativeConflicts: NarrativeConflict[],
  context: ContextAnswers,
): number | null {
  const { trigger } = pattern

  // All primary conditions must match
  const primaryMatch = trigger.primaryConditions.every(cond =>
    evaluateLayerCondition(cond, layerSignals),
  )
  if (!primaryMatch) return null

  // All alignment conditions must match (if specified)
  if (trigger.alignmentConditions) {
    const alignmentMatch = trigger.alignmentConditions.every(cond =>
      evaluateAlignmentCondition(cond, alignmentTests),
    )
    if (!alignmentMatch) return null
  }

  // Context conditions are GATES: all must pass for the pattern to match.
  // If context data is missing (null), the gate fails — this prevents patterns
  // designed for specific situations from firing on generic/unknown profiles.
  // Exception: if the context field is undefined/null AND no context was collected,
  // we treat context conditions as satisfied (permissive degradation).
  if (trigger.contextConditions && trigger.contextConditions.length > 0) {
    const hasAnyContext = Object.values(context).some(v => v !== undefined && v !== null)
    if (hasAnyContext) {
      // Context was collected — enforce the gates
      const contextMatch = trigger.contextConditions.every(cond =>
        evaluateContextCondition(cond, context),
      )
      if (!contextMatch) return null
    }
    // If no context collected at all, treat conditions as passing (graceful degradation)
  }

  // Narrative conflict boost: patterns whose narrative matches conflicts get priority
  const conflictBoost = narrativeConflicts.filter(nc => nc.significance === 'high').length * 3

  return trigger.priority + conflictBoost
}

// ─── Match clarity derivation ────────────────────────────────────────────────

export type MatchClarity = 'strong' | 'moderate' | 'borderline'

/**
 * Derives match clarity based on how many other patterns also matched.
 * Used by the AI input builder.
 */
export function deriveMatchClarity(
  winnerScore: number,
  allScores: number[],
): MatchClarity {
  const runners = allScores.filter(s => s !== winnerScore && s !== null)
  const runnerCount = runners.length

  if (runnerCount === 0) return 'strong'
  if (runnerCount === 1) return 'moderate'
  return 'borderline'
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface PatternMatchResult {
  pattern:      DiagnosticPattern
  matchScore:   number
  matchClarity: MatchClarity
}

/**
 * Classifies the diagnostic profile against the pattern library.
 *
 * Evaluation order:
 * 1. Evaluate all patterns against layer signals + alignment tests
 * 2. Among matches, select the highest-scoring (priority + context boost)
 * 3. Fall back to the 'broad_review' pattern if no specific pattern matches
 *
 * @param layerSignals       - BCT layer signals from signal-builder
 * @param alignmentTests     - Alignment test results from signal-builder
 * @param narrativeConflicts - Detected narrative conflicts from lens-detector
 * @param context            - Business context (sector, scale, situation, role)
 */
export function matchPattern(
  layerSignals: LayerSignal[],
  alignmentTests: AlignmentTest[],
  narrativeConflicts: NarrativeConflict[],
  context: ContextAnswers,
): PatternMatchResult {
  const scores: Array<{ pattern: DiagnosticPattern; score: number }> = []

  for (const pattern of diagnosticPatterns) {
    // Skip fallback during competitive evaluation
    if (pattern.id === 'broad_review') continue

    const score = evaluatePattern(
      pattern,
      layerSignals,
      alignmentTests,
      narrativeConflicts,
      context,
    )

    if (score !== null) {
      scores.push({ pattern, score })
    }
  }

  // Sort matches by score descending
  scores.sort((a, b) => b.score - a.score)

  // Use fallback if no matches
  if (scores.length === 0) {
    return {
      pattern:      fallbackPattern,
      matchScore:   0,
      matchClarity: 'borderline',
    }
  }

  const winner = scores[0]
  const allScores = scores.map(s => s.score)
  const matchClarity = deriveMatchClarity(winner.score, allScores)

  return {
    pattern:      winner.pattern,
    matchScore:   winner.score,
    matchClarity,
  }
}
