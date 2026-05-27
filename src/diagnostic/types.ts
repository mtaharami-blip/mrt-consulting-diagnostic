export type CategoryId = 'strategy' | 'operations' | 'revenue' | 'finance'

// ─── Framework layer types (BCT + PST) ──────────────────────────────────────

export type FrameworkLayer = 'strategy' | 'business_model' | 'operating_model' | 'performance'
export type LensId = 'external' | 'value_chain' | 'financials' | 'decision_making'
export type LayerStrength = 'clear' | 'partial' | 'absent'
export type AlignmentResult = 'aligned' | 'partial' | 'misaligned' | 'untestable'
export type ConstraintLayer = FrameworkLayer | 'alignment' | 'external'
export type SignalLevel = 'green' | 'yellow' | 'orange' | 'red'
export type SectorId =
  | 'professional_services'
  | 'technology'
  | 'industrial'
  | 'financial_services'
  | 'healthcare'
  | 'consumer'
  | 'other'
export type ScaleId =
  | 'under_10m'
  | '10_50m'
  | '50_150m'
  | '150_500m'
  | 'over_500m'
export type SituationId =
  | 'growing_under_pressure'
  | 'plateaued'
  | 'declining'
  | 'sensing_risk'
  | 'transition'
export type RoleId = 'ceo' | 'coo' | 'cfo' | 'commercial' | 'board' | 'other'

export interface AnswerOption {
  id: string
  text: string
  score: number // 0–3
  flagIds?: string[]
}

export interface Question {
  id: string // e.g. "SA", "BMA", "EXA"
  category: CategoryId  // for CategoryScore compat — BCT layer maps to existing CategoryId
  layer?: FrameworkLayer | LensId | 'cross_layer' // framework mapping (new)
  excludeFromScore?: boolean // PST lens questions excluded from CategoryScore (new)
  text: string
  options: AnswerOption[]
  weight: number // default 1.0
  dropWhenSecondary: boolean
}

export interface ContextOption {
  id: string
  text: string
}

export interface ContextQuestion {
  id: 'C1' | 'C2' | 'C3' | 'C4'
  text: string
  field: 'sector' | 'scale' | 'situation' | 'role'
  options: ContextOption[]
}

export interface Category {
  id: CategoryId
  label: string
  description: string
  icon: string
}

export interface FlagCondition {
  questionId: string
  answerIds: string[]
}

export interface ContextCondition {
  field: 'sector' | 'scale' | 'situation' | 'role'
  values: string[]
}

export interface FlagRule {
  id: string
  questionCondition: FlagCondition
  contextCondition?: ContextCondition
  observation: string
  severity: 'low' | 'medium' | 'high'
}

export interface ArchetypeTrigger {
  primaryCategories: {
    ids: CategoryId[]
    requiredLevels: SignalLevel[]
  }
  excludedLevels?: {
    ids: CategoryId[]
    levels: SignalLevel[]
  }
  contextConditions?: ContextCondition[]
  priority: number
}

export interface FocusArea {
  title: string
  description: string
}

export interface Archetype {
  id: string
  name: string
  trigger: ArchetypeTrigger
  headline: string
  centralQuestion: string
  misdiagnosisNote: string
  focusAreas: FocusArea[]
  defaultObservations: string[] // used when fewer than 3 flags trigger
}

// --- Computed types (produced by the engine, not stored in config) ---

export interface ContextAnswers {
  sector?: SectorId
  scale?: ScaleId
  situation?: SituationId
  role?: RoleId
}

export interface CategoryScore {
  categoryId: CategoryId
  raw: number
  max: number
  normalized: number // 0–100
  level: SignalLevel
  assessed: boolean
}

export interface DiagnosticOutput {
  archetypeId: string
  archetypeName: string
  headline: string
  categoryScores: CategoryScore[]
  observations: string[]
  centralQuestion: string
  misdiagnosisNote: string
  focusAreas: FocusArea[]
  // Framework-mapped signal profile (populated by new engine)
  layerSignals?: LayerSignal[]
  lensSignals?: LensSignal[]
  alignmentTests?: AlignmentTest[]
  narrativeConflicts?: NarrativeConflict[]
  constraintLocation?: ConstraintLocation
}

// --- Session / persistence ---

export interface DiagnosticSession {
  id: string
  createdAt: string
  completedAt: string
  context: ContextAnswers
  focusAreas: CategoryId[]
  answers: Record<string, string>
  scores: CategoryScore[]
  archetypeId: string
  flagsTriggered: string[]
  output: DiagnosticOutput
  optedIn: boolean
  contactEmail?: string
  contactName?: string
  contactCompany?: string
}

// --- Contact info ---

export interface ContactInfo {
  name: string
  company: string
  email: string
  phone?: string
}

// --- State machine ---

export type DiagnosticStep =
  | 'intro'
  | 'context'
  | 'focus'
  | 'questions'
  | 'contact'
  | 'processing'
  | 'done'

export interface DiagnosticState {
  step: DiagnosticStep
  contactInfo: ContactInfo | null
  context: ContextAnswers
  focusAreas: CategoryId[]
  answers: Record<string, string> // questionId → answerId
  questionIndex: number // index within the computed question list
  sessionId: string | null
  output: DiagnosticOutput | null
}

// --- Framework Signal Types (BCT + PST engine) ---

export interface LayerSignal {
  layer: FrameworkLayer
  coherent: boolean
  strength: LayerStrength
  keySignals: string[]   // human-readable signals from specific answers
  contradictions: string[] // conflicting signals within this layer
}

export interface LensSignal {
  lensId: LensId
  classification: string  // lens-specific classification value
  signals: string[]       // human-readable signal texts
  severity: 'high' | 'medium' | 'low' | 'none'
}

export interface AlignmentTest {
  id: 'strategy_businessModel' | 'businessModel_operatingModel' | 'strategy_operatingModel'
  result: AlignmentResult
  evidence: string[]  // specific answer patterns that drive this result
}

export interface NarrativeConflict {
  id: string
  stated: string   // what leadership framing implies about the business
  observed: string // what the signal pattern collectively suggests
  significance: 'high' | 'medium'
}

export interface ConstraintLocation {
  primaryLayer: ConstraintLayer
  confidence: 'high' | 'medium' | 'low'
  symptomSignals: string[]      // downstream evidence visible
  likelyRootCauses: string[]    // upstream logic the engine infers
  alternativeHypothesis: string | null
}

// Diagnostic pattern (replaces Archetype in the new engine)
export interface PatternLayerCondition {
  layer: FrameworkLayer
  strength: LayerStrength[]  // layer must be at one of these strengths
  coherent?: boolean         // if specified, coherence must match
}

export interface DiagnosticPattern {
  id: string
  name: string
  trigger: {
    primaryConditions: PatternLayerCondition[]
    alignmentConditions?: { id: AlignmentTest['id']; results: AlignmentResult[] }[]
    contextConditions?: ContextCondition[]
    priority: number
  }
  headline: string
  centralQuestion: string
  misdiagnosisNote: string
  focusAreas: FocusArea[]
  defaultObservations: string[]
}

// --- AI Interpretation Layer ---

export interface AISignalCluster {
  theme: string               // e.g. "Operational capacity under growth pressure"
  supportingSignals: string[] // 2-3 signals drawn from specific answers/flags
  implication: string         // what this cluster means diagnostically — 1-2 sentences
}

export interface AIConfidenceScore {
  level: 'high' | 'medium' | 'low'
  rationale: string           // e.g. "Two categories unassessed; archetype match was borderline"
  assessmentCoverage: number  // 0.25–1.0 (fraction of 4 categories assessed)
}

export interface AIInterpretation {
  constraintNarrative: string        // 2-3 sentence executive synthesis of the constraint pattern
  signalClusters: AISignalCluster[]  // 2-3 clusters of related signals
  businessImplications: string[]     // 3-4 implications — what this pattern means for the business
  refinedCentralQuestion: string     // archetype central question sharpened for this specific profile
  confidence: AIConfidenceScore
  modelVersion: string
  generatedAt: string                // ISO timestamp
}

// Structured input sent to the Claude API
export interface AIInterpretationInput {
  context: {
    sector: string | null
    scale: string | null
    situation: string | null
    role: string | null
  }
  archetype: {
    id: string
    name: string
    headline: string
    matchClarity: 'strong' | 'moderate' | 'borderline'
  }
  categoryScores: {
    categoryId: string
    normalized: number | null
    level: string | null
    assessed: boolean
  }[]
  triggeredFlags: {
    id: string
    severity: string
    observation: string
  }[]
  answerTranscript: {
    questionId: string
    categoryId: string
    questionText: string
    selectedAnswerText: string
    score: number
  }[]
}

export type DiagnosticAction =
  | { type: 'RESTORE_STATE'; state: DiagnosticState }
  | { type: 'SET_CONTACT_INFO'; info: ContactInfo }
  | { type: 'SET_CONTEXT'; field: keyof ContextAnswers; value: string }
  | { type: 'SET_STEP'; step: DiagnosticStep }
  | { type: 'NEXT_STEP' }
  | { type: 'SET_FOCUS_AREAS'; areas: CategoryId[] }
  | { type: 'SET_ANSWER'; questionId: string; answerId: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_PROCESSING' }
  | { type: 'SET_DONE'; sessionId: string; output: DiagnosticOutput }
  | { type: 'RESET' }
