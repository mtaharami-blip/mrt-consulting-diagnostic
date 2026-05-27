import type { Archetype, CategoryScore, ContextAnswers, FlagRule } from '../types'
import { fallbackArchetype } from '../config/archetypes'

export function classifyArchetype(
  scores: CategoryScore[],
  context: ContextAnswers,
  triggeredFlags: FlagRule[],
  archetypes: Archetype[]
): Archetype {
  const scoreMap = Object.fromEntries(scores.map((s) => [s.categoryId, s]))
  const flagIds = new Set(triggeredFlags.map((f) => f.id))

  const matches: Archetype[] = []

  for (const archetype of archetypes) {
    const { trigger } = archetype
    const { primaryCategories, excludedLevels, contextConditions } = trigger

    // Check primary category conditions
    const primaryMatch = primaryCategories.ids.some((catId) => {
      const score = scoreMap[catId]
      return score?.assessed && primaryCategories.requiredLevels.includes(score.level)
    })

    if (!primaryMatch) continue

    // Check excluded levels — if any of these hold, the archetype does not match
    if (excludedLevels) {
      const excluded = excludedLevels.ids.some((catId) => {
        const score = scoreMap[catId]
        return score?.assessed && excludedLevels.levels.includes(score.level)
      })
      if (excluded) continue
    }

    // Check context conditions (all must match if present)
    if (contextConditions && contextConditions.length > 0) {
      const contextMatch = contextConditions.every(({ field, values }) => {
        const contextValue = context[field]
        return contextValue && values.includes(contextValue)
      })
      if (!contextMatch) continue
    }

    matches.push(archetype)
  }

  if (matches.length === 0) return fallbackArchetype

  // Return highest-priority match
  return matches.sort((a, b) => b.trigger.priority - a.trigger.priority)[0]
}
