/**
 * Output Generator
 *
 * Assembles the final DiagnosticOutput from all engine components.
 *
 * New architecture uses:
 *   - DiagnosticPattern (not Archetype) for headline, central question, etc.
 *   - LayerSignal[], LensSignal[], AlignmentTest[], NarrativeConflict[], ConstraintLocation
 *     as additional output fields
 *
 * Backward compat: the old Archetype-based generateOutput is preserved for
 * legacy sessions that use the old pipeline. New sessions use generateOutputFromPattern.
 */

import type {
  Archetype,
  CategoryId,
  CategoryScore,
  DiagnosticOutput,
  FlagRule,
  DiagnosticPattern,
  LayerSignal,
  LensSignal,
  AlignmentTest,
  NarrativeConflict,
  ConstraintLocation,
} from '../types'

// ─── Legacy output generator (Archetype-based) ───────────────────────────────

/** @deprecated Use generateOutputFromPattern for new sessions */
export function generateOutput(
  archetype: Archetype,
  scores: CategoryScore[],
  triggeredFlags: FlagRule[],
  assessedCategories: CategoryId[]
): DiagnosticOutput {
  const flagObservations = triggeredFlags.slice(0, 3).map((f) => f.observation)
  const defaultObservations = archetype.defaultObservations

  const observations: string[] = []
  const seen = new Set<string>()

  for (const obs of [...flagObservations, ...defaultObservations]) {
    if (observations.length >= 3) break
    if (!seen.has(obs)) {
      seen.add(obs)
      observations.push(obs)
    }
  }

  return {
    archetypeId:      archetype.id,
    archetypeName:    archetype.name,
    headline:         archetype.headline,
    categoryScores:   scores,
    observations,
    centralQuestion:  archetype.centralQuestion,
    misdiagnosisNote: archetype.misdiagnosisNote,
    focusAreas:       archetype.focusAreas,
  }
}

// ─── New output generator (Pattern-based) ────────────────────────────────────

/**
 * Builds the top 3 diagnostic observations from the richer signal set.
 *
 * Priority order:
 * 1. Narrative conflicts (highest diagnostic value — reveal gaps between stated and observed)
 * 2. Constraint location root causes
 * 3. Alignment test evidence (misaligned tests)
 * 4. High-severity lens signals
 * 5. Pattern default observations (fallback)
 */
function buildObservations(
  pattern: DiagnosticPattern,
  layerSignals: LayerSignal[],
  lensSignals: LensSignal[],
  alignmentTests: AlignmentTest[],
  narrativeConflicts: NarrativeConflict[],
  constraintLocation: ConstraintLocation,
): string[] {
  const candidates: string[] = []
  const seen = new Set<string>()

  const add = (text: string | undefined) => {
    if (!text || seen.has(text)) return
    seen.add(text)
    candidates.push(text)
  }

  // 1. Narrative conflicts — high significance first
  for (const conflict of narrativeConflicts) {
    if (conflict.significance === 'high') {
      add(`${conflict.stated} — yet ${conflict.observed.toLowerCase()}`)
    }
  }
  for (const conflict of narrativeConflicts) {
    if (conflict.significance === 'medium') {
      add(`${conflict.stated} — yet ${conflict.observed.toLowerCase()}`)
    }
  }

  // 2. Constraint location root causes
  for (const cause of constraintLocation.likelyRootCauses) {
    add(cause)
  }

  // 3. Misaligned test evidence
  for (const test of alignmentTests) {
    if (test.result === 'misaligned') {
      for (const e of test.evidence.slice(0, 1)) {
        add(e)
      }
    }
  }

  // 4. High-severity lens signals
  for (const lens of lensSignals) {
    if (lens.severity === 'high') {
      for (const sig of lens.signals.slice(0, 1)) {
        add(sig)
      }
    }
  }

  // 5. Layer key signals from the primary constraint layer
  const primarySignal = layerSignals.find(
    ls => ls.layer === constraintLocation.primaryLayer,
  )
  if (primarySignal) {
    for (const sig of primarySignal.keySignals.slice(0, 2)) {
      add(sig)
    }
  }

  // 6. Pattern defaults as final fallback
  for (const obs of pattern.defaultObservations) {
    add(obs)
  }

  return candidates.slice(0, 3)
}

/**
 * Generates DiagnosticOutput from the new BCT + PST framework engine outputs.
 */
export function generateOutputFromPattern(
  pattern: DiagnosticPattern,
  scores: CategoryScore[],
  layerSignals: LayerSignal[],
  lensSignals: LensSignal[],
  alignmentTests: AlignmentTest[],
  narrativeConflicts: NarrativeConflict[],
  constraintLocation: ConstraintLocation,
): DiagnosticOutput {
  const observations = buildObservations(
    pattern,
    layerSignals,
    lensSignals,
    alignmentTests,
    narrativeConflicts,
    constraintLocation,
  )

  return {
    archetypeId:        pattern.id,
    archetypeName:      pattern.name,
    headline:           pattern.headline,
    categoryScores:     scores,
    observations,
    centralQuestion:    pattern.centralQuestion,
    misdiagnosisNote:   pattern.misdiagnosisNote,
    focusAreas:         pattern.focusAreas,
    layerSignals,
    lensSignals,
    alignmentTests,
    narrativeConflicts,
    constraintLocation,
  }
}

// ─── Legacy pipeline runner (kept for backward compat) ───────────────────────

/** @deprecated Use the new pipeline in complete/route.ts */
export function runDiagnosticPipeline(params: {
  answers: Record<string, string>
  context: import('../types').ContextAnswers
  focusAreas: CategoryId[]
  questions: import('../types').Question[]
  flagRules: FlagRule[]
  archetypes: Archetype[]
}): DiagnosticOutput {
  const { answers, context, focusAreas, questions, flagRules, archetypes } = params

  const { computeCategoryScores } = require('./scorer')
  const { detectFlags }           = require('./flag-detector')
  const { classifyArchetype }     = require('./classifier')

  const scores: CategoryScore[]  = computeCategoryScores(answers, questions, focusAreas)
  const flags: FlagRule[]        = detectFlags(answers, context, flagRules, questions)
  const archetype: Archetype     = classifyArchetype(scores, context, flags, archetypes)

  return generateOutput(archetype, scores, flags, focusAreas)
}
