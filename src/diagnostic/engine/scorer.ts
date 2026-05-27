import type { CategoryId, CategoryScore } from '../types'
import type { Question } from '../types'
import { normalizedToLevel } from '../config/categories'

/**
 * Computes category scores for all four BCT-mapped categories.
 *
 * In the new architecture, all categories are always assessed (no focus selection).
 * Questions with `excludeFromScore: true` are PST lens questions — they are
 * excluded from CategoryScore calculation but contribute to LensSignal detection.
 *
 * The assessedCategories param is preserved for backward compat with old sessions
 * but new calls should pass all four category IDs.
 */
export function computeCategoryScores(
  answers: Record<string, string>,
  questions: Question[],
  assessedCategories: CategoryId[]
): CategoryScore[] {
  const allCategories: CategoryId[] = ['strategy', 'operations', 'revenue', 'finance']

  return allCategories.map((categoryId) => {
    const assessed = assessedCategories.includes(categoryId)

    if (!assessed) {
      return {
        categoryId,
        raw: 0,
        max: 0,
        normalized: 0,
        level: 'green',
        assessed: false,
      }
    }

    // Only BCT layer questions contribute to category score
    const categoryQuestions = questions.filter(
      (q) => q.category === categoryId && !q.excludeFromScore,
    )

    let raw = 0
    let max = 0

    for (const question of categoryQuestions) {
      const answerId = answers[question.id]
      if (!answerId) continue

      const option = question.options.find((o) => o.id === answerId)
      if (!option) continue

      const weight = question.weight ?? 1.0
      const maxScore = Math.max(...question.options.map((o) => o.score))

      raw += option.score * weight
      max += maxScore * weight
    }

    const normalized = max > 0 ? Math.round((raw / max) * 100) : 0
    const level = normalizedToLevel(normalized)

    return { categoryId, raw, max, normalized, level, assessed }
  })
}
