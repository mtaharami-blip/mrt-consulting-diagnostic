export type CategoryId = 'strategy' | 'operations' | 'revenue' | 'finance'
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
  id: string // e.g. "S1", "O3"
  category: CategoryId
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

export type DiagnosticAction =
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
