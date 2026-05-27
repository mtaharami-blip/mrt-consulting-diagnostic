import type { Archetype, CategoryId, CategoryScore, DiagnosticOutput, FlagRule } from '../types'

export function generateOutput(
  archetype: Archetype,
  scores: CategoryScore[],
  triggeredFlags: FlagRule[],
  assessedCategories: CategoryId[]
): DiagnosticOutput {
  // Select top 3 observations: prioritise triggered flags, supplement with defaults
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
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    headline: archetype.headline,
    categoryScores: scores,
    observations,
    centralQuestion: archetype.centralQuestion,
    misdiagnosisNote: archetype.misdiagnosisNote,
    focusAreas: archetype.focusAreas,
  }
}

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
  const { detectFlags } = require('./flag-detector')
  const { classifyArchetype } = require('./classifier')

  const scores: CategoryScore[] = computeCategoryScores(answers, questions, focusAreas)
  const flags: FlagRule[] = detectFlags(answers, context, flagRules, questions)
  const archetype: Archetype = classifyArchetype(scores, context, flags, archetypes)

  return generateOutput(archetype, scores, flags, focusAreas)
}
