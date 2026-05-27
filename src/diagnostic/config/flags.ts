import type { FlagRule } from '../types'

export const flagRules: FlagRule[] = [
  {
    id: 'FLAG_CONCENTRATION',
    questionCondition: { questionId: 'R7', answerIds: ['R7_A'] },
    observation:
      'Your revenue appears concentrated in a small number of accounts — a structural fragility that compounds any commercial performance issue and creates meaningful downside risk if a key relationship changes.',
    severity: 'high',
  },
  {
    id: 'FLAG_LEADERSHIP_MISALIGNMENT',
    questionCondition: { questionId: 'S4', answerIds: ['S4_D'] },
    observation:
      'Leadership misalignment on strategic priorities is a root cause in its own right, not a symptom — it will undermine execution in every dimension and make improvement initiatives harder to sustain.',
    severity: 'high',
  },
  {
    id: 'FLAG_NO_OPS_VISIBILITY',
    questionCondition: { questionId: 'O3', answerIds: ['O3_D'] },
    observation:
      'Operating without structured performance visibility means problems compound before they are identified — this is frequently the difference between a manageable issue and a crisis that could have been prevented.',
    severity: 'high',
  },
  {
    id: 'FLAG_CASH_VOLATILITY',
    questionCondition: { questionId: 'F3', answerIds: ['F3_C'] },
    observation:
      'Cash generation volatility is a signal of an underlying working capital or revenue recognition issue that may not be visible in your profit figures — profitable businesses can still face acute liquidity stress.',
    severity: 'medium',
  },
  {
    id: 'FLAG_NO_DELIVERY_MEASURE',
    questionCondition: { questionId: 'O1', answerIds: ['O1_D'] },
    observation:
      'An inability to measure delivery consistency is itself a diagnostic signal — it suggests the operating model has not been instrumented for management, making it difficult to identify where performance is being lost.',
    severity: 'medium',
  },
  {
    id: 'FLAG_NO_PROFIT_VISIBILITY',
    questionCondition: { questionId: 'F2', answerIds: ['F2_D'] },
    observation:
      'Without segment-level profitability data, capital allocation decisions are made on incomplete information — the business may be subsidizing underperforming products or accounts with strong ones, without knowing it.',
    severity: 'high',
  },
  {
    id: 'FLAG_STRATEGIC_INSTABILITY',
    questionCondition: { questionId: 'S6', answerIds: ['S6_A'] },
    observation:
      'Frequent strategic pivots can signal the absence of a genuine strategic framework — activity substituting for clarity. Strategies rarely have time to produce results before they are replaced.',
    severity: 'medium',
  },
  {
    id: 'FLAG_NO_FINANCIAL_TARGETS',
    questionCondition: { questionId: 'F6', answerIds: ['F6_D'] },
    observation:
      'Operating without clear financial targets — or without tracking performance against them — makes it difficult to distinguish a strong year from a lucky one, and a problem from a trend.',
    severity: 'medium',
  },
  {
    id: 'FLAG_MARGIN_COMPRESSION',
    questionCondition: { questionId: 'F1', answerIds: ['F1_D'] },
    observation:
      'Margin compression without a clear understanding of its cause is a more serious signal than compression you understand — it suggests the business is losing value somewhere in its operation or commercial model without a clear diagnostic.',
    severity: 'high',
  },
  {
    id: 'FLAG_CONCENTRATION_SMALL_CO',
    questionCondition: { questionId: 'R7', answerIds: ['R7_A'] },
    contextCondition: { field: 'scale', values: ['under_10m', '10_50m'] },
    observation:
      'Revenue concentration risk is particularly acute at your scale — a single account departure can represent a significant proportion of total revenue and constrain your ability to invest in growth.',
    severity: 'high',
  },
  {
    id: 'FLAG_MISALIGNMENT_DECLINE',
    questionCondition: { questionId: 'S4', answerIds: ['S4_C', 'S4_D'] },
    contextCondition: { field: 'situation', values: ['declining'] },
    observation:
      'Leadership misalignment during a performance decline is a compounding risk — it slows the response at exactly the moment when speed and coherence matter most.',
    severity: 'high',
  },
  {
    id: 'FLAG_CAPITAL_TRANSITION',
    questionCondition: { questionId: 'F4', answerIds: ['F4_C', 'F4_D'] },
    contextCondition: { field: 'situation', values: ['transition'] },
    observation:
      'Capital allocation discipline becomes critical heading into a transition — reactive or undisciplined investment decisions made in this period can significantly affect the outcome or valuation of a transaction.',
    severity: 'high',
  },
  {
    id: 'FLAG_LEVERAGE_PRO_SERVICES',
    questionCondition: { questionId: 'O4', answerIds: ['O4_D'] },
    contextCondition: { field: 'sector', values: ['professional_services'] },
    observation:
      'For professional services businesses, building leverage in the operating model — the ability to grow revenue without proportionally growing headcount — is the central scaling challenge. A purely proportional model creates a ceiling on both profitability and valuation.',
    severity: 'medium',
  },
]
