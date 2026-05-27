/**
 * AI Input Builder
 *
 * Transforms deterministic engine outputs into a structured evidence package
 * for the Claude AI interpretation layer.
 *
 * Design principles:
 * - All data comes from the deterministic engine; nothing is invented here
 * - Human-readable labels replace raw IDs so the AI works from meaning, not codes
 * - Lens highlights are capped to high/medium severity to keep the payload lean
 * - Answer transcript includes only scored questions (PST lens questions excluded)
 */

import type {
  ContextAnswers,
  DiagnosticPattern,
  CategoryScore,
  LayerSignal,
  AlignmentTest,
  NarrativeConflict,
  ConstraintLocation,
  LensSignal,
  Question,
  FrameworkLayer,
  AIInterpretationInput,
} from '../types'
import type { MatchClarity } from './pattern-matcher'
import {
  SECTOR_LABELS,
  SCALE_LABELS,
  SITUATION_LABELS,
  ROLE_LABELS,
} from '../config/ai-prompts'

// ─── Label maps ───────────────────────────────────────────────────────────────

const LAYER_LABELS: Record<FrameworkLayer, string> = {
  strategy:        'Strategy',
  business_model:  'Business Model',
  operating_model: 'Operating Model',
  performance:     'Performance Management',
}

const ALIGNMENT_TEST_LABELS: Record<string, string> = {
  strategy_businessModel:       'Strategy → Business Model',
  businessModel_operatingModel: 'Business Model → Operating Model',
  strategy_operatingModel:      'Strategy → Operating Model',
}

const CATEGORY_LABELS: Record<string, string> = {
  strategy:   'Strategy',
  operations: 'Operating Model',
  revenue:    'Business Model',
  finance:    'Performance Management',
}

const LENS_LABELS: Record<string, string> = {
  external:        'External Environment',
  value_chain:     'Value Chain',
  financials:      'Financial Structure',
  decision_making: 'Decision-Making',
}

const CONSTRAINT_LAYER_LABELS: Record<string, string> = {
  strategy:        'Strategy',
  business_model:  'Business Model',
  operating_model: 'Operating Model',
  performance:     'Performance Management',
  alignment:       'Cross-layer misalignment',
  external:        'External environment',
}

// ─── Builder ──────────────────────────────────────────────────────────────────

/**
 * Builds the structured evidence package sent to the Claude API.
 *
 * Called synchronously in the route handler (before after()) so all data
 * is captured in the closure before the response is flushed.
 */
export function buildAIInput(
  context: ContextAnswers,
  pattern: DiagnosticPattern,
  matchClarity: MatchClarity,
  scores: CategoryScore[],
  layerSignals: LayerSignal[],
  alignmentTests: AlignmentTest[],
  narrativeConflicts: NarrativeConflict[],
  constraintLocation: ConstraintLocation,
  lensSignals: LensSignal[],
  answers: Record<string, string>,
  questions: Question[],
): AIInterpretationInput {
  // ── Answer transcript (scored questions only, human-readable text) ───────────
  const answerTranscript: AIInterpretationInput['answerTranscript'] = Object.entries(answers)
    .flatMap(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId)
      if (!question || question.excludeFromScore) return []
      const option = question.options.find(o => o.id === answerId)
      if (!option) return []
      return [{
        questionId,
        categoryId: question.category,
        questionText: question.text,
        selectedAnswerText: option.text,
        score: option.score,
      }]
    })
    // Sort by category then question ID for readability in the prompt
    .sort((a, b) => {
      const catOrder = ['strategy', 'operations', 'revenue', 'finance']
      const catDiff = catOrder.indexOf(a.categoryId) - catOrder.indexOf(b.categoryId)
      if (catDiff !== 0) return catDiff
      return a.questionId.localeCompare(b.questionId)
    })

  // ── Lens highlights (high/medium severity only — keeps token count lean) ─────
  const lensHighlights = lensSignals
    .filter(ls => ls.severity === 'high' || ls.severity === 'medium')
    .map(ls => ({
      lensId:         ls.lensId,
      lensLabel:      LENS_LABELS[ls.lensId] ?? ls.lensId,
      classification: ls.classification,
      signals:        ls.signals.slice(0, 3), // cap at 3 signals per lens
      severity:       ls.severity,
    }))

  return {
    context: {
      sector:    context.sector    ? (SECTOR_LABELS[context.sector]    ?? context.sector)    : null,
      scale:     context.scale     ? (SCALE_LABELS[context.scale]      ?? context.scale)     : null,
      situation: context.situation ? (SITUATION_LABELS[context.situation] ?? context.situation) : null,
      role:      context.role      ? (ROLE_LABELS[context.role]        ?? context.role)      : null,
    },

    pattern: {
      id:           pattern.id,
      name:         pattern.name,
      headline:     pattern.headline,
      matchClarity,
    },

    categoryScores: scores.map(s => ({
      categoryId: s.categoryId,
      label:      CATEGORY_LABELS[s.categoryId] ?? s.categoryId,
      normalized: s.assessed ? Math.round(s.normalized) : null,
      level:      s.assessed ? s.level : null,
      assessed:   s.assessed,
    })),

    layerSignals: layerSignals.map(ls => ({
      layer:          ls.layer,
      layerLabel:     LAYER_LABELS[ls.layer] ?? ls.layer,
      strength:       ls.strength,
      coherent:       ls.coherent,
      keySignals:     ls.keySignals,
      contradictions: ls.contradictions,
    })),

    alignmentTests: alignmentTests.map(at => ({
      id:       at.id,
      label:    ALIGNMENT_TEST_LABELS[at.id] ?? at.id,
      result:   at.result,
      evidence: at.evidence,
    })),

    narrativeConflicts: narrativeConflicts.map(nc => ({
      stated:       nc.stated,
      observed:     nc.observed,
      significance: nc.significance,
    })),

    constraintLocation: {
      primaryLayer:      constraintLocation.primaryLayer,
      primaryLayerLabel: CONSTRAINT_LAYER_LABELS[constraintLocation.primaryLayer] ?? constraintLocation.primaryLayer,
      confidence:        constraintLocation.confidence,
      likelyRootCauses:  constraintLocation.likelyRootCauses,
      symptomSignals:    constraintLocation.symptomSignals,
      alternativeHypothesis: constraintLocation.alternativeHypothesis ?? null,
    },

    lensHighlights,

    answerTranscript,
  }
}
