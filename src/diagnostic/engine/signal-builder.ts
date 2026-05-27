/**
 * Signal Builder — BCT Framework Layer Analysis
 *
 * Takes raw answers + question definitions and produces:
 *   - LayerSignal[]   — strength, coherence, key signals, and contradictions per BCT layer
 *   - AlignmentTest[] — cross-layer alignment results with evidence
 *
 * This is a pure function. No side effects, no DB access.
 */

import type {
  Question,
  LayerSignal,
  AlignmentTest,
  FrameworkLayer,
  LayerStrength,
  AlignmentResult,
} from '../types'

// ─── Layer → question ID mapping ────────────────────────────────────────────

const LAYER_QUESTIONS: Record<FrameworkLayer, string[]> = {
  strategy:       ['SA', 'SB', 'SC'],
  business_model: ['BMA', 'BMB', 'BMC'],
  operating_model:['OMA', 'OMB', 'OMC'],
  performance:    ['PA', 'PB'],
}

// ─── Human-readable signal text per answer option ───────────────────────────

const ANSWER_SIGNALS: Record<string, string> = {
  SA_A: 'Differentiation is specific, externally confirmed, and reflected in pricing',
  SA_B: 'Leadership has a largely clear differentiation view — not fully consistent across the team',
  SA_C: 'Customers do not consistently value the claimed differentiation',
  SA_D: 'Differentiation is aspirational — not rigorously validated externally',

  SB_A: 'Resource allocation clearly reflects stated strategic priorities',
  SB_B: 'Mostly aligned between stated strategy and resource allocation',
  SB_C: 'Meaningful gaps between stated strategy and observed resource allocation',
  SB_D: 'Different parts of the organization are pursuing different implicit strategies',

  SC_A: 'Market signals confirm strategic direction — win rates, pricing power, and share improving',
  SC_B: 'Mixed market signals — some confirm direction, others raise unresolved questions',
  SC_C: 'Market signals are actively challenging strategic assumptions',
  SC_D: 'Market position not tracked with sufficient precision to validate the strategy',

  BMA_A: 'Customer win reasons align well with leadership\'s value proposition framing',
  BMA_B: 'Mostly aligned — with some gap between how customers and leadership frame the value',
  BMA_C: 'Customers choose the business for reasons leadership does not emphasize in positioning',
  BMA_D: 'No structured insight into why the business wins or loses competitive situations',

  BMB_A: 'Pricing anchored to outcomes and value created — not market norms',
  BMB_B: 'Pricing is value-reflective in some situations but defaults to market rates in others',
  BMB_C: 'Pricing primarily determined by what the market will accept',
  BMB_D: 'Pricing is made deal-by-deal without a coherent underlying framework',

  BMC_A: 'Meaningful operating leverage — revenue growth does not require proportional cost growth',
  BMC_B: 'Some operating leverage built in — resource-proportional areas remain',
  BMC_C: 'Cost base tracks revenue growth closely — limited structural leverage',
  BMC_D: 'Model is designed to require the same resource input per unit of output',

  OMA_A: 'High consistency between what is sold and what is delivered',
  OMA_B: 'Reasonable delivery consistency — identifiable gaps actively managed',
  OMA_C: 'Delivery quality varies in ways leadership cannot fully explain or predict',
  OMA_D: 'Insufficient visibility into delivery experience to assess consistency',

  OMB_A: 'Organizational structure configured for current strategic requirements',
  OMB_B: 'Largely configured for today — with inherited structural elements not yet updated',
  OMB_C: 'Significant organizational elements reflect an earlier business configuration',
  OMB_D: 'Organizational design has not been meaningfully revisited as strategy has evolved',

  OMC_A: 'Structured monitoring surfaces operational divergences early',
  OMC_B: 'Reasonable operational visibility — with some gaps worked around',
  OMC_C: 'Operational problems typically surface after they have already had impact',
  OMC_D: 'Primarily informal signals — structured performance monitoring not in place',

  PA_A: 'Primary metrics directly reflect strategic and operational performance drivers',
  PA_B: 'Mostly connected metrics — with legacy activity-based measures still present',
  PA_C: 'Significant leadership attention on metrics not linked to strategic outcomes',
  PA_D: 'Measurement system not clearly linked to what matters strategically',

  PB_A: 'Reliable process from performance gap identification through to root cause resolution',
  PB_B: 'Correct root cause diagnosis most of the time — with notable exceptions',
  PB_C: 'Problems frequently recur — symptoms are being addressed rather than root causes',
  PB_D: 'Performance gaps persist because the driving cause remains unclear',
}

// ─── Core types ─────────────────────────────────────────────────────────────

interface AnswerScore {
  questionId: string
  answerId: string
  score: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAnswerScore(
  questionId: string,
  answerId: string | undefined,
  questions: Question[],
): number | null {
  if (!answerId) return null
  const q = questions.find(q => q.id === questionId)
  if (!q) return null
  const opt = q.options.find(o => o.id === answerId)
  return opt?.score ?? null
}

function getLayerScores(
  layer: FrameworkLayer,
  answers: Record<string, string>,
  questions: Question[],
): AnswerScore[] {
  return LAYER_QUESTIONS[layer]
    .map(qId => {
      const answerId = answers[qId]
      const score = getAnswerScore(qId, answerId, questions)
      if (score === null) return null
      return { questionId: qId, answerId, score }
    })
    .filter((x): x is AnswerScore => x !== null)
}

function deriveStrength(scores: AnswerScore[]): LayerStrength {
  if (scores.length === 0) return 'absent'
  const total = scores.reduce((sum, s) => sum + s.score, 0)
  const maxPossible = scores.length * 3
  const normalized = (total / maxPossible) * 100

  if (normalized >= 70) return 'clear'
  if (normalized >= 35) return 'partial'
  return 'absent'
}

function deriveCoherence(scores: AnswerScore[]): boolean {
  // A layer is incoherent when it contains both high-signal (score=3) and
  // absent-signal (score=0) answers — indicating contradictory capabilities
  const hasHigh = scores.some(s => s.score === 3)
  const hasLow  = scores.some(s => s.score === 0)
  return !(hasHigh && hasLow)
}

function buildKeySignals(scores: AnswerScore[]): string[] {
  return scores
    .filter(s => s.score <= 1)            // surface the diagnostic signals (weak answers)
    .sort((a, b) => a.score - b.score)    // worst first
    .map(s => ANSWER_SIGNALS[s.answerId])
    .filter(Boolean)
}

function buildContradictions(scores: AnswerScore[]): string[] {
  if (scores.length < 2) return []
  const high = scores.filter(s => s.score === 3)
  const low  = scores.filter(s => s.score === 0)
  if (!high.length || !low.length) return []

  const result: string[] = []
  for (const h of high) {
    for (const l of low) {
      const ht = ANSWER_SIGNALS[h.answerId]
      const lt = ANSWER_SIGNALS[l.answerId]
      if (ht && lt) {
        result.push(`Contradiction: "${ht}" alongside "${lt}"`)
      }
    }
  }
  return result
}

// ─── Layer Signal Builder ─────────────────────────────────────────────────────

function buildLayerSignal(
  layer: FrameworkLayer,
  answers: Record<string, string>,
  questions: Question[],
): LayerSignal {
  const scores = getLayerScores(layer, answers, questions)

  return {
    layer,
    coherent:       deriveCoherence(scores),
    strength:       deriveStrength(scores),
    keySignals:     buildKeySignals(scores),
    contradictions: buildContradictions(scores),
  }
}

// ─── Alignment Test Helpers ───────────────────────────────────────────────────

/** Gets a numeric score for a single question answer, or null if not answered */
function score(qId: string, answers: Record<string, string>, questions: Question[]): number | null {
  return getAnswerScore(qId, answers[qId], questions)
}

/** Shorthand: score is at or above threshold */
function atLeast(val: number | null, threshold: number): boolean {
  return val !== null && val >= threshold
}

/** Shorthand: score is at or below threshold */
function atMost(val: number | null, threshold: number): boolean {
  return val !== null && val <= threshold
}

// ─── Alignment Tests ─────────────────────────────────────────────────────────

/**
 * Strategy ↔ Business Model alignment
 *
 * Aligned:    Strategy is clear (SA≥2, SB≥2) AND business model translates it (BMA≥2, BMB≥2)
 * Partial:    Strategy is partly clear but BM has notable gaps (one of BMA or BMB is ≤1)
 * Misaligned: Strategy claims clarity (SA≥2) but BM doesn't reflect it (BMA≤1 OR BMB≤1)
 * Untestable: Both SA=SC_D and BMA_D (no insight from either side)
 */
function testStrategyBusinessModel(
  answers: Record<string, string>,
  questions: Question[],
): AlignmentTest {
  const sa  = score('SA',  answers, questions)
  const sb  = score('SB',  answers, questions)
  const bma = score('BMA', answers, questions)
  const bmb = score('BMB', answers, questions)

  const evidence: string[] = []
  let result: AlignmentResult = 'aligned'

  // Untestable: no win/loss insight AND no market tracking
  if (answers['BMA'] === 'BMA_D' && answers['SC'] === 'SC_D') {
    result = 'untestable'
    evidence.push('No structured win/loss insight (BMA) and no market position tracking (SC) — insufficient signal to test alignment')
    return { id: 'strategy_businessModel', result, evidence }
  }

  // Check alignment: strategy clear + BM reflects it
  const strategyIsPartlyClear = atLeast(sa, 2) || atLeast(sb, 2)
  const strategyIsClear       = atLeast(sa, 2) && atLeast(sb, 2)
  const bmTranslates          = atLeast(bma, 2) && atLeast(bmb, 2)
  const bmFails               = atMost(bma, 1) || atMost(bmb, 1)

  if (strategyIsClear && bmTranslates) {
    result = 'aligned'
    if (sa !== null) evidence.push(ANSWER_SIGNALS[answers['SA']] ?? '')
    if (bma !== null) evidence.push(ANSWER_SIGNALS[answers['BMA']] ?? '')
  } else if (strategyIsClear && bmFails) {
    result = 'misaligned'
    if (sa !== null && atLeast(sa, 2)) evidence.push(`Strategy claims clarity: ${ANSWER_SIGNALS[answers['SA']] ?? ''}`)
    if (bma !== null && atMost(bma, 1)) evidence.push(`But business model does not reflect it: ${ANSWER_SIGNALS[answers['BMA']] ?? ''}`)
    if (bmb !== null && atMost(bmb, 1)) evidence.push(ANSWER_SIGNALS[answers['BMB']] ?? '')
  } else if (strategyIsPartlyClear && bmFails) {
    result = 'partial'
    if (sb !== null && atMost(sb, 1)) evidence.push(ANSWER_SIGNALS[answers['SB']] ?? '')
    if (bmb !== null) evidence.push(ANSWER_SIGNALS[answers['BMB']] ?? '')
  } else {
    result = 'partial'
    if (sa !== null) evidence.push(ANSWER_SIGNALS[answers['SA']] ?? '')
    if (bma !== null) evidence.push(ANSWER_SIGNALS[answers['BMA']] ?? '')
  }

  return {
    id: 'strategy_businessModel',
    result,
    evidence: evidence.filter(Boolean),
  }
}

/**
 * Business Model ↔ Operating Model alignment
 *
 * Aligned:    BM is coherent (BMA≥2, BMB≥2, BMC≥2) AND OM delivers it (OMA≥2, OMB≥2)
 * Partial:    BM makes commitments the OM partially fulfills
 * Misaligned: BM makes value claims (BMA≥2) but OM cannot consistently deliver (OMA≤1)
 *             OR BM claims leverage (BMC_A) but OM structure is outdated (OMB≤1)
 * Untestable: OMA_D (no delivery visibility)
 */
function testBusinessModelOperatingModel(
  answers: Record<string, string>,
  questions: Question[],
): AlignmentTest {
  const bma = score('BMA', answers, questions)
  const bmb = score('BMB', answers, questions)
  const bmc = score('BMC', answers, questions)
  const oma = score('OMA', answers, questions)
  const omb = score('OMB', answers, questions)

  const evidence: string[] = []
  let result: AlignmentResult = 'aligned'

  // Untestable: no delivery visibility
  if (answers['OMA'] === 'OMA_D') {
    result = 'untestable'
    evidence.push('Insufficient delivery visibility (OMA) to test whether the operating model is fulfilling the business model\'s commitments')
    return { id: 'businessModel_operatingModel', result, evidence }
  }

  // Misalignment signal 1: BM makes strong value claims but delivery is inconsistent
  if (atLeast(bma, 2) && atMost(oma, 1)) {
    result = 'misaligned'
    evidence.push(`Business model claims: ${ANSWER_SIGNALS[answers['BMA']] ?? ''}`)
    evidence.push(`Operating model delivers: ${ANSWER_SIGNALS[answers['OMA']] ?? ''}`)
  }

  // Misalignment signal 2: BM claims leverage but structure hasn't evolved
  if (answers['BMC'] === 'BMC_A' && atMost(omb, 1)) {
    result = 'misaligned'
    evidence.push('Business model claims leverage (BMC) but organizational structure has not been configured to deliver it (OMB)')
    if (omb !== null) evidence.push(ANSWER_SIGNALS[answers['OMB']] ?? '')
  }

  // Partial: some BM-OM gaps but not fully broken
  if (result === 'aligned') {
    const bmCoherent = atLeast(bma, 2) && atLeast(bmb, 2)
    const omDelivers = atLeast(oma, 2) && atLeast(omb, 2)
    if (bmCoherent && omDelivers) {
      result = 'aligned'
      if (bma !== null) evidence.push(ANSWER_SIGNALS[answers['BMA']] ?? '')
      if (oma !== null) evidence.push(ANSWER_SIGNALS[answers['OMA']] ?? '')
    } else if (bmCoherent && !omDelivers) {
      result = 'partial'
      if (oma !== null) evidence.push(ANSWER_SIGNALS[answers['OMA']] ?? '')
      if (omb !== null) evidence.push(ANSWER_SIGNALS[answers['OMB']] ?? '')
    } else {
      result = 'partial'
      if (bma !== null) evidence.push(ANSWER_SIGNALS[answers['BMA']] ?? '')
      if (oma !== null) evidence.push(ANSWER_SIGNALS[answers['OMA']] ?? '')
    }
  }

  return {
    id: 'businessModel_operatingModel',
    result,
    evidence: evidence.filter(Boolean),
  }
}

/**
 * Strategy ↔ Operating Model alignment
 *
 * Aligned:    Resource allocation matches strategy (SB≥2) AND structure is configured for it (OMB≥2)
 * Partial:    Strategy has been updated but the organization hasn't fully followed
 * Misaligned: Both SB≤1 (resources don't reflect strategy) AND OMB≤1 (structure not updated) —
 *             the operating model is running a different business than the declared strategy
 * Untestable: SC_D (no market tracking — can't establish if the strategy is even valid to align to)
 */
function testStrategyOperatingModel(
  answers: Record<string, string>,
  questions: Question[],
): AlignmentTest {
  const sb  = score('SB',  answers, questions)
  const sc  = score('SC',  answers, questions)
  const omb = score('OMB', answers, questions)
  const omc = score('OMC', answers, questions)

  const evidence: string[] = []
  let result: AlignmentResult = 'aligned'

  // Untestable: no market position data + no operational monitoring
  if (answers['SC'] === 'SC_D' && answers['OMC'] === 'OMC_D') {
    result = 'untestable'
    evidence.push('Neither market position (SC) nor operational monitoring (OMC) produce sufficient data to test strategy-to-operations alignment')
    return { id: 'strategy_operatingModel', result, evidence }
  }

  // Misaligned: resource allocation gap AND outdated structure both present
  if (atMost(sb, 1) && atMost(omb, 1)) {
    result = 'misaligned'
    if (sb !== null) evidence.push(`Resource allocation gap: ${ANSWER_SIGNALS[answers['SB']] ?? ''}`)
    if (omb !== null) evidence.push(`Structural misalignment: ${ANSWER_SIGNALS[answers['OMB']] ?? ''}`)
    if (sc !== null && atMost(sc, 1)) evidence.push(`Market signal: ${ANSWER_SIGNALS[answers['SC']] ?? ''}`)
  }
  // Partial: one of the alignment mechanisms is working, the other is not
  else if ((atMost(sb, 1) && atLeast(omb, 2)) || (atLeast(sb, 2) && atMost(omb, 1))) {
    result = 'partial'
    if (sb !== null) evidence.push(ANSWER_SIGNALS[answers['SB']] ?? '')
    if (omb !== null) evidence.push(ANSWER_SIGNALS[answers['OMB']] ?? '')
  }
  // Aligned
  else if (atLeast(sb, 2) && atLeast(omb, 2)) {
    result = 'aligned'
    if (sb !== null) evidence.push(ANSWER_SIGNALS[answers['SB']] ?? '')
    if (omb !== null) evidence.push(ANSWER_SIGNALS[answers['OMB']] ?? '')
  }
  else {
    result = 'partial'
    if (sb !== null) evidence.push(ANSWER_SIGNALS[answers['SB']] ?? '')
    if (omb !== null) evidence.push(ANSWER_SIGNALS[answers['OMB']] ?? '')
  }

  return {
    id: 'strategy_operatingModel',
    result,
    evidence: evidence.filter(Boolean),
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface SignalBuildResult {
  layerSignals:   LayerSignal[]
  alignmentTests: AlignmentTest[]
}

/**
 * Builds BCT layer signals and cross-layer alignment tests from raw answers.
 *
 * @param answers  - Record of questionId → answerId from the completed diagnostic
 * @param questions - Full question definitions (used for option lookup)
 */
export function buildSignals(
  answers: Record<string, string>,
  questions: Question[],
): SignalBuildResult {
  const layers: FrameworkLayer[] = ['strategy', 'business_model', 'operating_model', 'performance']

  const layerSignals: LayerSignal[] = layers.map(layer =>
    buildLayerSignal(layer, answers, questions),
  )

  const alignmentTests: AlignmentTest[] = [
    testStrategyBusinessModel(answers, questions),
    testBusinessModelOperatingModel(answers, questions),
    testStrategyOperatingModel(answers, questions),
  ]

  return { layerSignals, alignmentTests }
}
