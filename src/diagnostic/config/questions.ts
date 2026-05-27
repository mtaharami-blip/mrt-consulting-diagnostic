import type { Question } from '../types'

/**
 * Framework-mapped question set.
 *
 * BCT Layer questions (11) — feed CategoryScore and LayerSignal
 *   Strategy layer   → category: 'strategy'   (SA, SB, SC)
 *   Business Model   → category: 'revenue'    (BMA, BMB, BMC)
 *   Operating Model  → category: 'operations' (OMA, OMB, OMC)
 *   Performance      → category: 'finance'    (PA, PB)
 *
 * PST Lens questions (7) — excludeFromScore, feed LensSignal
 *   External         → category: 'strategy'   (EXA, EXB)
 *   Value Chain      → category: 'operations' (VCA)
 *   Financials       → category: 'finance'    (FINA, FINB)
 *   Decision-Making  → category: 'operations' (DMA, DMB)
 *
 * Cross-layer probes (2) — excludeFromScore, feed NarrativeConflict detection
 *   (XA, XB)
 *
 * All respondents answer all questions. No focus selection step.
 */
export const questions: Question[] = [

  // ─── STRATEGY LAYER ─────────────────────────────────────────────────────────

  {
    id: 'SA',
    category: 'strategy',
    layer: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How precisely can your leadership team articulate what your business does that its closest competitors do not — in terms your best customers would confirm and that are reflected in your pricing?',
    options: [
      { id: 'SA_A', score: 3, text: 'Precisely — specific, externally confirmed, and reflected in what we charge' },
      { id: 'SA_B', score: 2, text: 'Largely — our view is clear but not fully consistent across the leadership team' },
      { id: 'SA_C', score: 1, text: 'Partially — customers do not consistently value what we believe differentiates us' },
      { id: 'SA_D', score: 0, text: 'Aspirationally — we describe differentiation we believe exists but have not rigorously validated' },
    ],
  },
  {
    id: 'SB',
    category: 'strategy',
    layer: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'If you compared where your business actually allocates budget, leadership attention, and organizational energy against the strategy you would describe to your board — how well do they align?',
    options: [
      { id: 'SB_A', score: 3, text: 'Very well — resource allocation clearly reflects our stated strategic priorities' },
      { id: 'SB_B', score: 2, text: 'Mostly — real alignment with visible exceptions we are working through' },
      { id: 'SB_C', score: 1, text: 'Partially — meaningful gaps between stated strategy and observed resource allocation' },
      { id: 'SB_D', score: 0, text: 'Poorly — different parts of the organization are pursuing different implicit strategies' },
    ],
  },
  {
    id: 'SC',
    category: 'strategy',
    layer: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Over the last 18 months, has your market position — pricing power, win rates, share in your target segments — been confirming or challenging your strategic assumptions?',
    options: [
      { id: 'SC_A', score: 3, text: 'Confirming — market signals reinforce our strategic direction' },
      { id: 'SC_B', score: 2, text: 'Mixed — some signals confirm, others raise questions we are working through' },
      { id: 'SC_C', score: 1, text: 'Challenging — signals the business is not fully explaining within the current strategic frame' },
      { id: 'SC_D', score: 0, text: 'Unmeasured — we do not track market position with enough precision to answer reliably' },
    ],
  },

  // ─── BUSINESS MODEL LAYER ────────────────────────────────────────────────────

  {
    id: 'BMA',
    category: 'revenue',
    layer: 'business_model',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'When you win competitive situations, what reason does the customer give for choosing you — and is that the same reason your leadership team would give for why you are the right choice?',
    options: [
      { id: 'BMA_A', score: 3, text: 'Consistent — what customers say aligns well with what we believe about our value' },
      { id: 'BMA_B', score: 2, text: 'Mostly aligned — with some gaps between customer articulation and our own framing' },
      { id: 'BMA_C', score: 1, text: 'Often different — customers choose us for reasons we do not emphasize in our positioning' },
      { id: 'BMA_D', score: 0, text: 'Unknown — we do not have structured insight into why we win or lose' },
    ],
  },
  {
    id: 'BMB',
    category: 'revenue',
    layer: 'business_model',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Does your pricing logic reflect the value your business creates for its best customers — or does it reflect what the market currently accepts?',
    options: [
      { id: 'BMB_A', score: 3, text: 'Value-reflective — pricing is anchored to outcomes and value created, not market norms' },
      { id: 'BMB_B', score: 2, text: 'Partially value-reflective — we price for value in some situations but default to market rates in others' },
      { id: 'BMB_C', score: 1, text: 'Market-anchored — pricing is primarily determined by what the market will accept' },
      { id: 'BMB_D', score: 0, text: 'Reactive — pricing decisions are made deal-by-deal without a coherent underlying framework' },
    ],
  },
  {
    id: 'BMC',
    category: 'revenue',
    layer: 'business_model',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'As revenue grows, does your cost base grow proportionally — or have you built structural leverage into how you create and deliver value?',
    options: [
      { id: 'BMC_A', score: 3, text: 'Meaningful leverage — revenue growth does not require proportional cost or headcount increases' },
      { id: 'BMC_B', score: 2, text: 'Some leverage — with areas where the model is still resource-proportional' },
      { id: 'BMC_C', score: 1, text: 'Largely proportional — cost base tracks revenue growth closely' },
      { id: 'BMC_D', score: 0, text: 'Proportional by design — the model requires approximately the same resource input per unit of output' },
    ],
  },

  // ─── OPERATING MODEL LAYER ───────────────────────────────────────────────────

  {
    id: 'OMA',
    category: 'operations',
    layer: 'operating_model',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How consistently does the experience of working with your business — delivery quality, reliability, and what happens when problems arise — match what you commit to in the sales process?',
    options: [
      { id: 'OMA_A', score: 3, text: 'High consistency — strong alignment between what we sell and what we deliver' },
      { id: 'OMA_B', score: 2, text: 'Reasonable consistency — with identifiable gaps we are aware of and actively managing' },
      { id: 'OMA_C', score: 1, text: 'Inconsistent — quality varies in ways we cannot fully explain or predict' },
      { id: 'OMA_D', score: 0, text: 'Visibility gap — we do not have sufficient insight into the delivery experience to answer reliably' },
    ],
  },
  {
    id: 'OMB',
    category: 'operations',
    layer: 'operating_model',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Is your current organizational structure — leadership roles, accountabilities, and decision rights — configured for what your strategy requires today, or for what it required two to three years ago?',
    options: [
      { id: 'OMB_A', score: 3, text: 'Configured for today — structure reflects current strategic requirements' },
      { id: 'OMB_B', score: 2, text: 'Largely for today — with inherited elements we have not fully updated' },
      { id: 'OMB_C', score: 1, text: 'Mixed — significant parts reflect an earlier business configuration' },
      { id: 'OMB_D', score: 0, text: 'Primarily inherited — the organizational design has not been meaningfully revisited as the strategy has evolved' },
    ],
  },
  {
    id: 'OMC',
    category: 'operations',
    layer: 'operating_model',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'When operational performance diverges from what was planned, how quickly does your leadership team identify this — and through what mechanism?',
    options: [
      { id: 'OMC_A', score: 3, text: 'Quickly, through structured monitoring — clear metrics and regular review surfaces divergences early' },
      { id: 'OMC_B', score: 2, text: 'Reasonably quickly — with some visibility gaps that are worked around' },
      { id: 'OMC_C', score: 1, text: 'Often after the fact — operational problems tend to surface after they have already had impact' },
      { id: 'OMC_D', score: 0, text: 'Primarily through informal signals — structured performance monitoring is not in place' },
    ],
  },

  // ─── PERFORMANCE LAYER ───────────────────────────────────────────────────────

  {
    id: 'PA',
    category: 'finance',
    layer: 'performance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Are the metrics your leadership team reviews most regularly causally connected to the strategic and operational drivers you are trying to manage — or do they primarily measure activity?',
    options: [
      { id: 'PA_A', score: 3, text: 'Causally connected — primary metrics directly reflect strategic and operational performance drivers' },
      { id: 'PA_B', score: 2, text: 'Mostly connected — with some legacy or activity-based metrics that do not drive decisions' },
      { id: 'PA_C', score: 1, text: 'Partially connected — significant time is spent on metrics that do not link to strategic outcomes' },
      { id: 'PA_D', score: 0, text: 'Primarily activity-based — the measurement system is not clearly linked to what matters strategically' },
    ],
  },
  {
    id: 'PB',
    category: 'finance',
    layer: 'performance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'When your leadership team identifies a performance gap, what is your track record of correctly diagnosing the root cause and resolving it on the first attempt?',
    options: [
      { id: 'PB_A', score: 3, text: 'Strong — reliable process from identifying a gap to root cause diagnosis to resolution' },
      { id: 'PB_B', score: 2, text: 'Reasonable — correct diagnosis most of the time, with notable exceptions' },
      { id: 'PB_C', score: 1, text: 'Inconsistent — problems frequently recur, suggesting symptoms are being addressed rather than causes' },
      { id: 'PB_D', score: 0, text: 'Poor — performance gaps often persist because we are uncertain what is driving them' },
    ],
  },

  // ─── EXTERNAL LENS (PST) ─────────────────────────────────────────────────────

  {
    id: 'EXA',
    category: 'strategy',
    layer: 'external',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you characterize the underlying demand environment in your core market right now — independent of your own performance in it?',
    options: [
      { id: 'EXA_A', score: 3, text: 'Growing — clear demand pull, customers actively seeking solutions in our market space' },
      { id: 'EXA_B', score: 2, text: 'Stable — the overall market is not contracting but growth requires taking share' },
      { id: 'EXA_C', score: 1, text: 'Contracting or shifting — demand in our traditional market is declining or changing structurally' },
      { id: 'EXA_D', score: 0, text: 'Uncertain — we do not have a clear independent read on underlying market dynamics' },
    ],
  },
  {
    id: 'EXB',
    category: 'strategy',
    layer: 'external',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Is the pricing pressure your business experiences primarily driven by competitors offering better or cheaper alternatives — or by your own uncertainty about the value your work creates?',
    options: [
      { id: 'EXB_A', score: 3, text: 'Minimal pressure — we compete primarily on quality and outcomes; price is rarely the deciding factor' },
      { id: 'EXB_B', score: 2, text: 'External competitive pressure — alternatives exist that put a ceiling on what the market will pay' },
      { id: 'EXB_C', score: 1, text: 'Internally driven — price pressure is partly self-inflicted; we concede before the market requires it' },
      { id: 'EXB_D', score: 0, text: 'Mixed — both external competition and internal pricing uncertainty are material factors' },
    ],
  },

  // ─── VALUE CHAIN LENS (PST) ──────────────────────────────────────────────────

  {
    id: 'VCA',
    category: 'operations',
    layer: 'value_chain',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Where in your delivery cycle does the greatest friction, inconsistency, or loss of value occur most frequently?',
    options: [
      { id: 'VCA_A', score: 2, text: 'Winning work — generating the right opportunities and converting them is where friction is highest' },
      { id: 'VCA_B', score: 1, text: 'Setting work up — scoping, pricing, and onboarding create more strain than the delivery itself' },
      { id: 'VCA_C', score: 1, text: 'Delivering work — quality and timeline issues occur most in the core execution phase' },
      { id: 'VCA_D', score: 1, text: 'Completing work — handoffs, sign-offs, invoicing, or close-out create friction that drags value' },
      { id: 'VCA_E', score: 2, text: 'Sustaining relationships — delivery is adequate but retention and account expansion are where value is lost' },
    ],
  },

  // ─── FINANCIALS LENS (PST) ───────────────────────────────────────────────────

  {
    id: 'FINA',
    category: 'finance',
    layer: 'financials',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'If you had to locate your primary financial challenge on a P&L, where is the pressure most concentrated?',
    options: [
      { id: 'FINA_A', score: 1, text: 'Revenue level — not generating enough top-line relative to strategy and market potential' },
      { id: 'FINA_B', score: 1, text: 'Gross margin level — revenue is acceptable but the cost of delivering it compresses margin' },
      { id: 'FINA_C', score: 1, text: 'Net margin level — gross margin is reasonable but overhead and operating costs are too high' },
      { id: 'FINA_D', score: 0, text: 'Multiple levels simultaneously — financial pressure is visible across the P&L, not concentrated' },
      { id: 'FINA_E', score: 3, text: 'Not a material issue — financial performance is broadly in line with expectations' },
    ],
  },
  {
    id: 'FINB',
    category: 'finance',
    layer: 'financials',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'If revenue is underperforming expectations, is the primary driver a volume shortfall (not enough customers or transactions) or a price shortfall (not capturing enough value per engagement)?',
    options: [
      { id: 'FINB_A', score: 1, text: 'Primarily volume — not enough customers, transactions, or renewals' },
      { id: 'FINB_B', score: 1, text: 'Primarily price — demand is there but we are not capturing sufficient value per engagement' },
      { id: 'FINB_C', score: 0, text: 'Both — we need more customers and we need to charge more for what we do' },
      { id: 'FINB_D', score: 0, text: 'Unclear — we do not have the data to distinguish between these drivers confidently' },
    ],
  },

  // ─── DECISION-MAKING LENS (PST) ──────────────────────────────────────────────

  {
    id: 'DMA',
    category: 'operations',
    layer: 'decision_making',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'When your business needs to make a significant strategic or operational decision, how would you describe the process?',
    options: [
      { id: 'DMA_A', score: 3, text: 'Clear and efficient — ownership is understood, needed information is available, decisions are made at an appropriate pace' },
      { id: 'DMA_B', score: 2, text: 'Functional but slow — the right decisions get made but the process takes longer than it should' },
      { id: 'DMA_C', score: 1, text: 'Diffuse ownership — significant decisions involve too many people or get escalated unnecessarily' },
      { id: 'DMA_D', score: 0, text: 'Avoidant — significant decisions are frequently deferred, discussed without resolution, or delegated without accountability' },
    ],
  },
  {
    id: 'DMB',
    category: 'operations',
    layer: 'decision_making',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Once your leadership team makes a significant decision to change something — a direction, process, or priority — how reliably does the organization execute that change?',
    options: [
      { id: 'DMB_A', score: 3, text: 'High reliability — when we decide to change something, we execute it' },
      { id: 'DMB_B', score: 2, text: 'Moderate — most decisions land but there are consistent areas of the organization that slow change' },
      { id: 'DMB_C', score: 1, text: 'Inconsistent — some decisions execute cleanly while others stall, without a clear pattern' },
      { id: 'DMB_D', score: 0, text: 'Low — the gap between decisions made and changes implemented is a known and persistent problem' },
    ],
  },

  // ─── CROSS-LAYER PROBES ──────────────────────────────────────────────────────

  {
    id: 'XA',
    category: 'strategy',
    layer: 'cross_layer',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How frequently does your leadership team encounter operational or commercial evidence that conflicts with the strategic narrative — and what typically happens when it does?',
    options: [
      { id: 'XA_A', score: 3, text: 'Rarely — our narrative is well-grounded; when conflicting evidence appears, we update the narrative' },
      { id: 'XA_B', score: 2, text: 'Occasionally — with a productive process for reconciling evidence with strategy' },
      { id: 'XA_C', score: 1, text: 'Regularly — with ongoing tension about how to interpret evidence that does not fit the current frame' },
      { id: 'XA_D', score: 0, text: 'Frequently — the typical response is to explain conflicting evidence away rather than examine the strategy' },
    ],
  },
  {
    id: 'XB',
    category: 'strategy',
    layer: 'cross_layer',
    excludeFromScore: true,
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'If you had to locate the primary constraint on your business\'s performance in a single layer — strategy, business model, operations, or performance management — which would you place it in?',
    options: [
      { id: 'XB_A', score: 0, text: 'Strategy — how we have positioned the business and where we have chosen to compete' },
      { id: 'XB_B', score: 0, text: 'Business Model — how we create, deliver, and capture value' },
      { id: 'XB_C', score: 0, text: 'Operations — how effectively we execute the model day-to-day' },
      { id: 'XB_D', score: 0, text: 'Performance Management — how we measure, monitor, and improve performance' },
      { id: 'XB_E', score: 0, text: 'Uncertain — the constraint feels distributed and we have not been able to isolate it' },
    ],
  },
]

/**
 * Returns all questions for the diagnostic flow.
 * In the new architecture, all questions are universal — no focus selection.
 * The focusAreas param is kept for backward compat but ignored.
 */
export function getQuestionsForFlow(
  _focusAreas?: import('../types').CategoryId[]
): Question[] {
  return questions
}
