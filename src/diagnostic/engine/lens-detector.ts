/**
 * Lens Detector — PST Rubik's Cube Lens Analysis
 *
 * Takes answers + context + questions and produces:
 *   - LensSignal[]        — PST lens classifications (External, Value Chain, Financials, Decision-Making)
 *   - NarrativeConflict[] — contradictions between stated positions and behavioral answer patterns
 *   - ConstraintLocation  — primary constraint layer with confidence and supporting evidence
 *
 * Pure function. No side effects, no DB access.
 */

import type {
  Question,
  ContextAnswers,
  LensSignal,
  NarrativeConflict,
  ConstraintLocation,
  ConstraintLayer,
  LayerSignal,
  AlignmentTest,
} from '../types'

// ─── External Lens ───────────────────────────────────────────────────────────

function detectExternalLens(answers: Record<string, string>): LensSignal {
  const exa = answers['EXA']
  const exb = answers['EXB']
  const signals: string[] = []
  let classification = 'neutral'
  let severity: LensSignal['severity'] = 'none'

  // Market environment
  if (exa === 'EXA_A') {
    signals.push('Growing demand environment — market pull exists independent of company performance')
    classification = 'demand_favourable'
  } else if (exa === 'EXA_B') {
    signals.push('Stable demand — growth requires taking share from competitors rather than market expansion')
    classification = 'demand_neutral'
    severity = 'low'
  } else if (exa === 'EXA_C') {
    signals.push('Contracting or structurally shifting demand — headwind independent of company execution')
    classification = 'demand_adverse'
    severity = 'high'
  } else if (exa === 'EXA_D') {
    signals.push('No clear read on underlying market dynamics — external environment is being managed blind')
    classification = 'demand_unknown'
    severity = 'medium'
  }

  // Competitive / pricing pressure source
  if (exb === 'EXB_A') {
    signals.push('Minimal competitive price pressure — outcomes and quality are the primary competitive basis')
  } else if (exb === 'EXB_B') {
    signals.push('External competitive ceiling on pricing — alternatives exist that constrain value capture')
    if (severity === 'none' || severity === 'low') severity = 'medium'
  } else if (exb === 'EXB_C') {
    signals.push('Internally-driven price concession — the business yields on price before the market requires it')
    if (severity === 'none' || severity === 'low') severity = 'medium'
    classification = classification === 'demand_favourable' ? 'demand_favourable_self_limiting' : 'internally_constrained'
  } else if (exb === 'EXB_D') {
    signals.push('Both competitive and internal factors are suppressing pricing — compound price pressure')
    if (severity !== 'high') severity = 'high'
  }

  return {
    lensId: 'external',
    classification,
    signals,
    severity,
  }
}

// ─── Value Chain Lens ─────────────────────────────────────────────────────────

function detectValueChainLens(answers: Record<string, string>): LensSignal {
  const vca = answers['VCA']
  const signals: string[] = []
  let classification = 'unknown'
  let severity: LensSignal['severity'] = 'none'

  const frictionMap: Record<string, { classification: string; signal: string; severity: LensSignal['severity'] }> = {
    VCA_A: {
      classification: 'front_end_constraint',
      signal: 'Primary value chain friction at the front end — winning and converting the right work is the binding constraint',
      severity: 'medium',
    },
    VCA_B: {
      classification: 'setup_constraint',
      signal: 'Friction concentrated in scoping, pricing, and onboarding — value is lost before delivery begins',
      severity: 'medium',
    },
    VCA_C: {
      classification: 'delivery_constraint',
      signal: 'Core delivery is the primary friction point — quality and timeline issues in execution are the main drag',
      severity: 'high',
    },
    VCA_D: {
      classification: 'close_out_constraint',
      signal: 'Friction at handoffs, sign-off, invoicing, and close-out — value is eroded in completing work',
      severity: 'medium',
    },
    VCA_E: {
      classification: 'retention_constraint',
      signal: 'Delivery is adequate but retention and expansion are the primary value loss point — customer relationships are not compounding',
      severity: 'medium',
    },
  }

  if (vca && frictionMap[vca]) {
    const entry = frictionMap[vca]
    classification = entry.classification
    signals.push(entry.signal)
    severity = entry.severity
  }

  return {
    lensId: 'value_chain',
    classification,
    signals,
    severity,
  }
}

// ─── Financials Lens ──────────────────────────────────────────────────────────

function detectFinancialsLens(answers: Record<string, string>): LensSignal {
  const fina = answers['FINA']
  const finb = answers['FINB']
  const signals: string[] = []
  let classification = 'healthy'
  let severity: LensSignal['severity'] = 'none'

  // P&L level diagnosis
  if (fina === 'FINA_A') {
    classification = 'L1_revenue_constraint'
    signals.push('Financial pressure concentrated at revenue level — root cause likely in Strategy or Business Model (insufficient demand capture or poor positioning)')
    severity = 'high'
  } else if (fina === 'FINA_B') {
    classification = 'L2_gross_margin_constraint'
    signals.push('Gross margin compression despite acceptable revenue — root cause likely in Business Model (pricing logic, delivery cost, or leverage absence) or Operating Model efficiency')
    severity = 'high'
  } else if (fina === 'FINA_C') {
    classification = 'L3_net_margin_constraint'
    signals.push('Net margin pressure despite reasonable gross margin — root cause likely in Operating Model overhead or Performance Management discipline')
    severity = 'medium'
  } else if (fina === 'FINA_D') {
    classification = 'multi_level_pressure'
    signals.push('Financial pressure visible across multiple P&L levels simultaneously — diagnostic complexity is high; single-layer fix unlikely to be sufficient')
    severity = 'high'
  } else if (fina === 'FINA_E') {
    classification = 'healthy'
    signals.push('Financial performance is broadly in line with expectations — no primary financial constraint signal')
    severity = 'none'
  }

  // Volume vs. price diagnosis (for L1 revenue constraint)
  if (finb && fina !== 'FINA_E') {
    if (finb === 'FINB_A') {
      signals.push('Revenue shortfall is primarily a volume problem — insufficient customers, transactions, or renewals')
      if (classification === 'L1_revenue_constraint') {
        classification = 'L1_volume_gap'
      }
    } else if (finb === 'FINB_B') {
      signals.push('Revenue shortfall is primarily a price realization problem — demand exists but value is not being captured per engagement')
      if (classification === 'L1_revenue_constraint') {
        classification = 'L1_price_gap'
      }
    } else if (finb === 'FINB_C') {
      signals.push('Both volume and price are below requirement — a compound commercial constraint')
      if (classification === 'L1_revenue_constraint') {
        classification = 'L1_compound_gap'
      }
    } else if (finb === 'FINB_D') {
      signals.push('Unable to distinguish volume from price as the driver — operating without revenue analytics')
      if (classification === 'L1_revenue_constraint') {
        classification = 'L1_unknown_driver'
      }
    }
  }

  return {
    lensId: 'financials',
    classification,
    signals,
    severity,
  }
}

// ─── Decision-Making Lens ─────────────────────────────────────────────────────

function detectDecisionMakingLens(answers: Record<string, string>): LensSignal {
  const dma = answers['DMA']
  const dmb = answers['DMB']
  const signals: string[] = []
  let classification = 'functional'
  let severity: LensSignal['severity'] = 'none'

  // Decision quality
  if (dma === 'DMA_A') {
    signals.push('Decision-making is clear and efficient — ownership understood, information available, appropriate pace')
  } else if (dma === 'DMA_B') {
    signals.push('Decision-making is functional but slow — right decisions eventually made but the process is costly in time')
    severity = 'low'
    classification = 'slow'
  } else if (dma === 'DMA_C') {
    signals.push('Diffuse decision ownership — significant decisions involve too many people or escalate unnecessarily')
    severity = 'medium'
    classification = 'diffuse_ownership'
  } else if (dma === 'DMA_D') {
    signals.push('Significant decisions are frequently deferred, discussed without resolution, or delegated without accountability')
    severity = 'high'
    classification = 'avoidant'
  }

  // Implementation reliability
  if (dmb === 'DMB_A') {
    signals.push('High decision implementation reliability — when the organization decides to change something, it executes')
  } else if (dmb === 'DMB_B') {
    signals.push('Moderate implementation reliability — most decisions land but specific parts of the organization consistently slow change')
    if (severity === 'none') severity = 'low'
    if (classification === 'functional') classification = 'slow'
  } else if (dmb === 'DMB_C') {
    signals.push('Inconsistent implementation — some decisions execute cleanly while others stall without a clear pattern')
    if (severity === 'none' || severity === 'low') severity = 'medium'
    if (classification === 'functional' || classification === 'slow') classification = 'inconsistent_mobilization'
  } else if (dmb === 'DMB_D') {
    signals.push('Persistent decision-implementation gap — the gap between decisions made and changes executed is a known organizational problem')
    if (severity !== 'high') severity = 'high'
    classification = 'mobilization_failure'
  }

  // Combined: avoidant + mobilization failure = leadership fragmentation
  if (dma === 'DMA_D' && dmb === 'DMB_D') {
    classification = 'leadership_fragmentation'
    severity = 'high'
  }

  return {
    lensId: 'decision_making',
    classification,
    signals,
    severity,
  }
}

// ─── Narrative Conflict Detection ────────────────────────────────────────────

function detectNarrativeConflicts(
  answers: Record<string, string>,
  layerSignals: LayerSignal[],
  alignmentTests: AlignmentTest[],
): NarrativeConflict[] {
  const conflicts: NarrativeConflict[] = []

  const s = (qId: string): string | undefined => answers[qId]

  const strategySignal  = layerSignals.find(l => l.layer === 'strategy')
  const bmSignal        = layerSignals.find(l => l.layer === 'business_model')
  const omSignal        = layerSignals.find(l => l.layer === 'operating_model')
  const perfSignal      = layerSignals.find(l => l.layer === 'performance')

  // Conflict 1: "We have a clear strategy" + pricing has no framework
  // SA/SB → high scores but BMB → reactive/market-anchored
  if ((s('SA') === 'SA_A' || s('SA') === 'SA_B') && (s('BMB') === 'BMB_C' || s('BMB') === 'BMB_D')) {
    conflicts.push({
      id: 'differentiation_vs_pricing',
      stated: 'Leadership reports a clearly differentiated strategic position',
      observed: 'Pricing logic is market-anchored or reactive — inconsistent with the claimed level of differentiation',
      significance: 'high',
    })
  }

  // Conflict 2: "We are aligned" + operational structure is inherited
  // SB → resource allocation clear but OMB → structural lag
  if ((s('SB') === 'SB_A' || s('SB') === 'SB_B') && (s('OMB') === 'OMB_C' || s('OMB') === 'OMB_D')) {
    conflicts.push({
      id: 'alignment_claim_vs_structure',
      stated: 'Resource allocation is reported as reflecting strategic priorities',
      observed: 'Organizational structure remains configured for an earlier version of the business — the org design has not followed the strategy',
      significance: 'medium',
    })
  }

  // Conflict 3: External attribution + internal failures visible
  // XA → conflicting evidence explained away, but layer signals show internal weaknesses
  if (s('XA') === 'XA_D' || s('XA') === 'XA_C') {
    const internalSignalWeak =
      (strategySignal && strategySignal.strength === 'absent') ||
      (bmSignal && bmSignal.strength === 'absent') ||
      (omSignal && omSignal.strength === 'absent')

    if (internalSignalWeak) {
      conflicts.push({
        id: 'external_attribution_vs_internal_evidence',
        stated: 'Conflicting operational and commercial evidence is regularly explained away rather than integrated into strategy',
        observed: 'Signal patterns across BCT layers point to significant internal weaknesses — the evidence being dismissed is diagnostic',
        significance: 'high',
      })
    }
  }

  // Conflict 4: Self-diagnosis vs. evidence-based constraint location
  // XB self-report of constraint location vs. what the signal profile actually shows
  const xb = s('XB')
  if (xb) {
    const selfReportedLayerMap: Record<string, string> = {
      XB_A: 'strategy',
      XB_B: 'business_model',
      XB_C: 'operating_model',
      XB_D: 'performance',
    }
    const selfReportedLayer = selfReportedLayerMap[xb]

    if (selfReportedLayer && selfReportedLayer !== 'XB_E') {
      // Find the actually weakest layer
      const ranked = [...(layerSignals ?? [])]
        .filter(ls => ls.strength !== undefined)
        .sort((a, b) => {
          const order: Record<string, number> = { absent: 0, partial: 1, clear: 2 }
          return order[a.strength] - order[b.strength]
        })
      const weakestLayer = ranked[0]?.layer

      if (weakestLayer && weakestLayer !== selfReportedLayer) {
        const layerLabels: Record<string, string> = {
          strategy:        'Strategy',
          business_model:  'Business Model',
          operating_model: 'Operating Model',
          performance:     'Performance Management',
        }
        conflicts.push({
          id: 'self_diagnosis_vs_evidence',
          stated: `Leadership locates the primary constraint in ${layerLabels[selfReportedLayer] ?? selfReportedLayer}`,
          observed: `Signal patterns suggest the weakest BCT layer is ${layerLabels[weakestLayer] ?? weakestLayer} — the self-reported constraint location may be the symptom, not the root cause`,
          significance: 'medium',
        })
      }
    }
  }

  // Conflict 5: Claims strong performance management + poor root cause diagnosis
  if ((s('PA') === 'PA_A' || s('PA') === 'PA_B') && (s('PB') === 'PB_C' || s('PB') === 'PB_D')) {
    conflicts.push({
      id: 'metrics_vs_diagnosis',
      stated: 'Metrics are reported as causally connected to strategic drivers',
      observed: 'Root cause diagnosis is poor — problems recur — suggesting the measurement system is not generating diagnostic insight, only reporting activity',
      significance: 'medium',
    })
  }

  return conflicts
}

// ─── Constraint Location ──────────────────────────────────────────────────────

function deriveConstraintLocation(
  layerSignals: LayerSignal[],
  alignmentTests: AlignmentTest[],
  externalLens: LensSignal,
  financialsLens: LensSignal,
  narrativeConflicts: NarrativeConflict[],
): ConstraintLocation {
  // Rank layers by weakness
  const strengthOrder: Record<string, number> = { absent: 0, partial: 1, clear: 2 }
  const rankedLayers = [...layerSignals].sort(
    (a, b) => strengthOrder[a.strength] - strengthOrder[b.strength],
  )

  const weakestLayer = rankedLayers[0]
  const secondWeakest = rankedLayers[1]

  // Count misaligned tests
  const misalignedTests = alignmentTests.filter(t => t.result === 'misaligned')
  const partialTests    = alignmentTests.filter(t => t.result === 'partial')

  // Check for external constraint dominance
  const externalIsDominant =
    externalLens.severity === 'high' &&
    externalLens.classification === 'demand_adverse' &&
    layerSignals.every(ls => ls.strength !== 'absent')

  // Determine primary layer
  let primaryLayer: ConstraintLayer
  let confidence: ConstraintLocation['confidence']

  if (externalIsDominant) {
    primaryLayer = 'external'
    confidence = 'medium'
  } else if (misalignedTests.length >= 2) {
    // Multiple misalignments — the constraint is structural/alignment
    primaryLayer = 'alignment'
    confidence = 'high'
  } else if (weakestLayer?.strength === 'absent') {
    primaryLayer = weakestLayer.layer
    confidence = secondWeakest?.strength === 'absent' ? 'medium' : 'high'
  } else if (misalignedTests.length === 1) {
    // Single misalignment — constraint lives in the weaker of the two misaligned layers
    const misalignedTest = misalignedTests[0]
    const [layerA, layerB] = misalignedTest.id.split('_') as [string, string]
    const layerASignal = layerSignals.find(ls => {
      const map: Record<string, string> = {
        strategy: 'strategy',
        businessModel: 'business_model',
        operatingModel: 'operating_model',
      }
      return ls.layer === map[layerA]
    })
    const layerBSignal = layerSignals.find(ls => {
      const map: Record<string, string> = {
        strategy: 'strategy',
        businessModel: 'business_model',
        operatingModel: 'operating_model',
      }
      return ls.layer === map[layerB]
    })

    if (layerASignal && layerBSignal) {
      primaryLayer =
        strengthOrder[layerASignal.strength] <= strengthOrder[layerBSignal.strength]
          ? layerASignal.layer
          : layerBSignal.layer
    } else {
      primaryLayer = weakestLayer?.layer ?? 'strategy'
    }
    confidence = 'medium'
  } else if (weakestLayer?.strength === 'partial') {
    primaryLayer = weakestLayer.layer
    confidence = partialTests.length > 0 ? 'medium' : 'low'
  } else {
    primaryLayer = weakestLayer?.layer ?? 'strategy'
    confidence = 'low'
  }

  // Build symptom signals — what downstream effects are visible
  const symptomSignals: string[] = []
  for (const ls of layerSignals) {
    if (ls.layer !== primaryLayer && ls.keySignals.length > 0) {
      symptomSignals.push(...ls.keySignals.slice(0, 1))
    }
  }
  if (financialsLens.severity === 'high') {
    symptomSignals.push(...financialsLens.signals.slice(0, 1))
  }

  // Build likely root causes — upstream logic
  const likelyRootCauses: string[] = []
  const primarySignal = layerSignals.find(ls => ls.layer === primaryLayer)
  if (primarySignal) {
    likelyRootCauses.push(...primarySignal.keySignals.slice(0, 2))
  }
  for (const conflict of narrativeConflicts) {
    if (conflict.significance === 'high') {
      likelyRootCauses.push(conflict.observed)
    }
  }
  for (const test of misalignedTests) {
    likelyRootCauses.push(...test.evidence.slice(0, 1))
  }

  // Alternative hypothesis: if financials lens points to a different layer
  let alternativeHypothesis: string | null = null
  const finClassification = financialsLens.classification
  if (finClassification === 'L2_gross_margin_constraint' && primaryLayer === 'strategy') {
    alternativeHypothesis =
      'The gross margin signal could indicate a Business Model issue (pricing or delivery cost) rather than a pure strategy problem — worth separating these before concluding on root cause'
  } else if (finClassification === 'L3_net_margin_constraint' && primaryLayer !== 'operating_model') {
    alternativeHypothesis =
      'Net margin pressure often has an Operating Model root (overhead discipline, process efficiency) — even when the declared constraint appears elsewhere in the framework'
  } else if (externalLens.severity === 'high' && primaryLayer !== 'external') {
    alternativeHypothesis =
      'External market conditions are materially adverse — some of what reads as an internal constraint may be partially attributable to a demand or competitive headwind'
  }

  return {
    primaryLayer,
    confidence,
    symptomSignals:      symptomSignals.filter(Boolean).slice(0, 3),
    likelyRootCauses:    likelyRootCauses.filter(Boolean).slice(0, 3),
    alternativeHypothesis,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface LensDetectResult {
  lensSignals:        LensSignal[]
  narrativeConflicts: NarrativeConflict[]
  constraintLocation: ConstraintLocation
}

/**
 * Detects PST lens signals, narrative conflicts, and derives constraint location.
 *
 * @param answers       - Record of questionId → answerId
 * @param context       - Business context (sector, scale, situation, role)
 * @param questions     - Full question definitions
 * @param layerSignals  - BCT layer signals from signal-builder (required for conflict detection)
 * @param alignmentTests - Alignment test results from signal-builder
 */
export function detectLenses(
  answers: Record<string, string>,
  context: ContextAnswers,
  questions: Question[],
  layerSignals: LayerSignal[],
  alignmentTests: AlignmentTest[],
): LensDetectResult {
  const externalLens      = detectExternalLens(answers)
  const valueChainLens    = detectValueChainLens(answers)
  const financialsLens    = detectFinancialsLens(answers)
  const decisionMakingLens = detectDecisionMakingLens(answers)

  const lensSignals: LensSignal[] = [
    externalLens,
    valueChainLens,
    financialsLens,
    decisionMakingLens,
  ]

  const narrativeConflicts = detectNarrativeConflicts(answers, layerSignals, alignmentTests)

  const constraintLocation = deriveConstraintLocation(
    layerSignals,
    alignmentTests,
    externalLens,
    financialsLens,
    narrativeConflicts,
  )

  return {
    lensSignals,
    narrativeConflicts,
    constraintLocation,
  }
}
