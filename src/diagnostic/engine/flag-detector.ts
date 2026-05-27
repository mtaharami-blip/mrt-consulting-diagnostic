import type { ContextAnswers, FlagRule } from '../types'
import type { Question } from '../types'

export function detectFlags(
  answers: Record<string, string>,
  context: ContextAnswers,
  flagRules: FlagRule[],
  questions: Question[]
): FlagRule[] {
  const answeredQuestionIds = new Set(Object.keys(answers))
  const triggered: FlagRule[] = []

  for (const rule of flagRules) {
    const { questionId, answerIds } = rule.questionCondition

    // Only evaluate if the question was answered
    if (!answeredQuestionIds.has(questionId)) continue

    const selectedAnswer = answers[questionId]
    if (!answerIds.includes(selectedAnswer)) continue

    // Check optional context condition
    if (rule.contextCondition) {
      const { field, values } = rule.contextCondition
      const contextValue = context[field]
      if (!contextValue || !values.includes(contextValue)) continue
    }

    triggered.push(rule)
  }

  // Sort by severity: high → medium → low
  const severityOrder: Record<FlagRule['severity'], number> = {
    high: 0,
    medium: 1,
    low: 2,
  }

  return triggered.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  )
}
