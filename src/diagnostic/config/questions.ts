import type { Question } from '../types'

export const questions: Question[] = [
  // ─── STRATEGY ───────────────────────────────────────────────────────────────

  {
    id: 'S1',
    category: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How clearly can you articulate what makes your business meaningfully different from its closest competitors — in a way your best customers would confirm?',
    options: [
      { id: 'S1_A', score: 3, text: 'Very clearly — our differentiation is specific, validated, and reflected in our pricing' },
      { id: 'S1_B', score: 2, text: 'Mostly clearly — we have a view but it is not always consistent across the leadership team' },
      { id: 'S1_C', score: 1, text: 'Somewhat — customers do not always seem to value what we think differentiates us' },
      { id: 'S1_D', score: 0, text: 'Not clearly — our differentiation is mainly claims we make, not differences we can prove' },
    ],
  },
  {
    id: 'S2',
    category: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'In the last 12 months, has your competitive position — win rates, pricing power, or market share — been improving, holding, or weakening?',
    options: [
      { id: 'S2_A', score: 3, text: 'Clearly improving' },
      { id: 'S2_B', score: 2, text: 'Roughly holding — neither gaining nor losing ground' },
      { id: 'S2_C', score: 1, text: 'Weakening in some areas but stable overall' },
      { id: 'S2_D', score: 0, text: 'Clearly weakening across the business' },
    ],
  },
  {
    id: 'S3',
    category: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you characterize the growth opportunity in your core market over the next three years?',
    options: [
      { id: 'S3_A', score: 3, text: 'Significant — the market is growing and we are well-positioned to capture share' },
      { id: 'S3_B', score: 2, text: 'Moderate — there is growth but it requires us to compete harder or expand into adjacent areas' },
      { id: 'S3_C', score: 1, text: 'Limited — the market is mature or contracting and we need to find new growth vectors' },
      { id: 'S3_D', score: 0, text: 'Uncertain — we do not have a clear read on where growth will come from' },
    ],
  },
  {
    id: 'S4',
    category: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How aligned is your leadership team on strategic priorities — which markets to pursue, which to exit, and where to invest?',
    options: [
      { id: 'S4_A', score: 3, text: 'Strongly aligned — clear priorities that the team is behind' },
      { id: 'S4_B', score: 2, text: 'Mostly aligned — some debate on priorities but generally coherent' },
      { id: 'S4_C', score: 1, text: 'Partially aligned — meaningful disagreement that has not been resolved' },
      { id: 'S4_D', score: 0, text: 'Not aligned — different parts of the organization are pursuing different agendas', flagIds: ['FLAG_LEADERSHIP_MISALIGNMENT'] },
    ],
  },
  {
    id: 'S5',
    category: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'When your strategy is not working, what is the most common explanation given internally?',
    options: [
      { id: 'S5_A', score: 2, text: 'Execution — the strategy is right but we are not implementing it effectively' },
      { id: 'S5_B', score: 1, text: 'Market conditions — external factors are working against us' },
      { id: 'S5_C', score: 1, text: 'Resources — we lack the capacity or capability to execute' },
      { id: 'S5_D', score: 0, text: 'The strategy itself — there is genuine internal debate about whether the direction is right' },
    ],
  },
  {
    id: 'S6',
    category: 'strategy',
    weight: 1.0,
    dropWhenSecondary: true,
    text: 'How frequently does your business make meaningful strategic changes — market entry or exit, pivots, or major investment shifts?',
    options: [
      { id: 'S6_A', score: 1, text: 'Too frequently — we change direction before strategies have time to prove themselves', flagIds: ['FLAG_STRATEGIC_INSTABILITY'] },
      { id: 'S6_B', score: 3, text: 'At the right cadence — we review and adjust thoughtfully based on evidence' },
      { id: 'S6_C', score: 1, text: 'Too infrequently — we hold positions even when evidence suggests we should adapt' },
      { id: 'S6_D', score: 0, text: 'We do not have a clear process for strategic review' },
    ],
  },
  {
    id: 'S7',
    category: 'strategy',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How well does your current business model — how you create, deliver, and capture value — match what your best customers actually need today?',
    options: [
      { id: 'S7_A', score: 3, text: 'Very well — our model was built around their needs and remains relevant' },
      { id: 'S7_B', score: 2, text: 'Reasonably well — with gaps we are aware of and working on' },
      { id: 'S7_C', score: 1, text: 'With growing tension — our model made sense when built but the market has shifted' },
      { id: 'S7_D', score: 0, text: 'Poorly — there is a fundamental mismatch that we are trying to address' },
    ],
  },

  // ─── OPERATIONS ─────────────────────────────────────────────────────────────

  {
    id: 'O1',
    category: 'operations',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How confident are you that the commitments your business makes to customers — delivery timelines, quality, service levels — are consistently met?',
    options: [
      { id: 'O1_A', score: 3, text: 'High confidence — we have a strong track record and process controls in place' },
      { id: 'O1_B', score: 2, text: 'Moderate confidence — we deliver most of the time but with more variation than we would like' },
      { id: 'O1_C', score: 1, text: 'Low confidence — inconsistent delivery is a known and active problem' },
      { id: 'O1_D', score: 0, text: 'We do not measure this with enough precision to answer confidently', flagIds: ['FLAG_NO_DELIVERY_MEASURE'] },
    ],
  },
  {
    id: 'O2',
    category: 'operations',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Where do slowdowns or bottlenecks most frequently occur in your operations?',
    options: [
      { id: 'O2_A', score: 2, text: 'At the front end — intake, scoping, quoting, or onboarding new work' },
      { id: 'O2_B', score: 1, text: 'In core delivery — the middle of the work where most value is created' },
      { id: 'O2_C', score: 1, text: 'At the back end — handoffs, completion, invoicing, or closing out work' },
      { id: 'O2_D', score: 0, text: 'They move around — there is no stable, identifiable constraint' },
    ],
  },
  {
    id: 'O3',
    category: 'operations',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How well does your leadership team have visibility into operational performance in real time?',
    options: [
      { id: 'O3_A', score: 3, text: 'Very well — clear metrics, dashboards, and a regular review cadence' },
      { id: 'O3_B', score: 2, text: 'Reasonably well — some visibility but gaps in key areas' },
      { id: 'O3_C', score: 1, text: 'Poorly — we learn about operational problems after they have already had impact' },
      { id: 'O3_D', score: 0, text: 'We rely primarily on informal signals rather than structured data', flagIds: ['FLAG_NO_OPS_VISIBILITY'] },
    ],
  },
  {
    id: 'O4',
    category: 'operations',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you characterize the scalability of your current operating model?',
    options: [
      { id: 'O4_A', score: 3, text: 'Highly scalable — we could grow 30–50% without fundamental changes to how we operate' },
      { id: 'O4_B', score: 2, text: 'Somewhat scalable — modest growth is manageable but structural constraints exist beyond that' },
      { id: 'O4_C', score: 1, text: 'Constrained — we are near capacity or experiencing growing pains' },
      { id: 'O4_D', score: 0, text: 'Proportional — our cost base grows in lockstep with revenue and we are not building leverage' },
    ],
  },
  {
    id: 'O5',
    category: 'operations',
    weight: 1.0,
    dropWhenSecondary: true,
    text: 'How effective is your organization at implementing changes to how work gets done?',
    options: [
      { id: 'O5_A', score: 3, text: 'Very effective — when we decide to change a process or system, we execute cleanly' },
      { id: 'O5_B', score: 2, text: 'Mostly effective — we can implement changes but with more friction than we would like' },
      { id: 'O5_C', score: 1, text: 'Inconsistently effective — some parts adapt well, others resist or stall' },
      { id: 'O5_D', score: 0, text: 'Poor — most operational improvement initiatives take far longer than expected or fail' },
    ],
  },
  {
    id: 'O6',
    category: 'operations',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Where would you locate the primary accountability gap in your organization — where outcomes are expected but ownership is unclear?',
    options: [
      { id: 'O6_A', score: 3, text: 'This is not a significant issue — accountability is generally clear and enforced' },
      { id: 'O6_B', score: 2, text: 'At the middle management level — managers are not fully owning their outcomes' },
      { id: 'O6_C', score: 1, text: 'At the leadership team level — roles and accountabilities overlap or are ambiguous' },
      { id: 'O6_D', score: 0, text: 'At the operational or frontline level — individual accountability for output is inconsistent' },
    ],
  },
  {
    id: 'O7',
    category: 'operations',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you describe your organization\'s relationship with its core operating data — costs, throughput, quality, and utilization?',
    options: [
      { id: 'O7_A', score: 3, text: 'Data-driven — decisions are routinely informed by accurate, timely operational data' },
      { id: 'O7_B', score: 2, text: 'Partially data-driven — we use data in some areas but rely on judgment in others' },
      { id: 'O7_C', score: 1, text: 'Data-aware but action-poor — we have data but do not act on it consistently' },
      { id: 'O7_D', score: 0, text: 'Data-poor — we do not have reliable data in key operational areas' },
    ],
  },

  // ─── REVENUE ─────────────────────────────────────────────────────────────────

  {
    id: 'R1',
    category: 'revenue',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'Over the last 12 months, revenue growth has been primarily driven by:',
    options: [
      { id: 'R1_A', score: 2, text: 'New customer acquisition' },
      { id: 'R1_B', score: 3, text: 'Expansion within existing accounts — customers buying more or upgrading' },
      { id: 'R1_C', score: 1, text: 'Price increases across the book of business' },
      { id: 'R1_D', score: 1, text: 'Market tailwinds — rising demand or reduced competition' },
      { id: 'R1_E', score: 0, text: 'We have not been growing, or the primary source is unclear' },
    ],
  },
  {
    id: 'R2',
    category: 'revenue',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you characterize your pricing position relative to the value you deliver?',
    options: [
      { id: 'R2_A', score: 3, text: 'We price at a premium and customers accept it — our pricing reflects our value' },
      { id: 'R2_B', score: 2, text: 'We price in the middle of the market and compete on a mix of value and cost' },
      { id: 'R2_C', score: 1, text: 'We are regularly pressured on price and often concede to win or retain business' },
      { id: 'R2_D', score: 0, text: 'Pricing is largely reactive or negotiated deal-by-deal — we have no clear pricing strategy' },
    ],
  },
  {
    id: 'R3',
    category: 'revenue',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How well do you understand why customers choose you over alternatives — and why some choose not to?',
    options: [
      { id: 'R3_A', score: 3, text: 'Very well — we have structured win/loss data and customer insight that informs our decisions' },
      { id: 'R3_B', score: 2, text: 'Reasonably well — we have a view based on experience, though largely anecdotal' },
      { id: 'R3_C', score: 1, text: 'Partially — we know why we win but have limited insight into why we lose' },
      { id: 'R3_D', score: 0, text: 'Poorly — we have no systematic understanding of our win/loss drivers' },
    ],
  },
  {
    id: 'R4',
    category: 'revenue',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you describe retention and expansion in your most important accounts?',
    options: [
      { id: 'R4_A', score: 3, text: 'Strong — we retain most key customers and consistently expand within accounts' },
      { id: 'R4_B', score: 2, text: 'Adequate — retention is reasonable but expansion is limited or inconsistent' },
      { id: 'R4_C', score: 1, text: 'Concerning — we see meaningful churn or shrinkage in accounts we expected to grow' },
      { id: 'R4_D', score: 0, text: 'We do not track this with enough precision to answer confidently' },
    ],
  },
  {
    id: 'R5',
    category: 'revenue',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How aligned are your sales and commercial activities with what your best customers actually value most?',
    options: [
      { id: 'R5_A', score: 3, text: 'Well aligned — our commercial approach reflects a clear understanding of customer priorities' },
      { id: 'R5_B', score: 2, text: 'Partially aligned — we know what customers value but our commercial motion does not always reflect it' },
      { id: 'R5_C', score: 1, text: 'Misaligned — we sell based on our capabilities and strengths, not what customers need' },
      { id: 'R5_D', score: 0, text: 'We have not done the work to understand this distinction clearly' },
    ],
  },
  {
    id: 'R6',
    category: 'revenue',
    weight: 1.0,
    dropWhenSecondary: true,
    text: 'Where does the most friction occur in your customer acquisition process?',
    options: [
      { id: 'R6_A', score: 1, text: 'Generating awareness or reaching the right decision-makers' },
      { id: 'R6_B', score: 1, text: 'Converting interest into serious conversations' },
      { id: 'R6_C', score: 1, text: 'Closing — opportunities move slowly through our pipeline or stall at the end' },
      { id: 'R6_D', score: 0, text: 'Onboarding — we win the work but lose momentum in the transition to delivery' },
    ],
  },
  {
    id: 'R7',
    category: 'revenue',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'If revenue growth slowed or stopped tomorrow, which cause is most likely?',
    options: [
      { id: 'R7_A', score: 0, text: 'Loss of a small number of key accounts — we have meaningful customer concentration risk', flagIds: ['FLAG_CONCENTRATION'] },
      { id: 'R7_B', score: 1, text: 'A competitor offering a better or cheaper alternative' },
      { id: 'R7_C', score: 1, text: 'Our inability to consistently deliver what we have sold' },
      { id: 'R7_D', score: 1, text: 'Market contraction or a demand shift outside our control' },
      { id: 'R7_E', score: 0, text: 'Our own sales capacity or go-to-market model limitations' },
    ],
  },

  // ─── FINANCE ─────────────────────────────────────────────────────────────────

  {
    id: 'F1',
    category: 'finance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you describe the trend in your gross and operating margins over the last 12–24 months?',
    options: [
      { id: 'F1_A', score: 3, text: 'Expanding — margins are improving as we scale or operate more efficiently' },
      { id: 'F1_B', score: 2, text: 'Stable — margins are holding at acceptable levels' },
      { id: 'F1_C', score: 1, text: 'Compressing — margins are declining and we understand why' },
      { id: 'F1_D', score: 0, text: 'Compressing — margins are declining and the cause is not fully clear', flagIds: ['FLAG_MARGIN_COMPRESSION'] },
    ],
  },
  {
    id: 'F2',
    category: 'finance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How well do you understand the profit contribution of individual products, services, customers, or business units?',
    options: [
      { id: 'F2_A', score: 3, text: 'Very well — we have clear profitability data by segment and use it in decisions' },
      { id: 'F2_B', score: 2, text: 'Reasonably well — we have a general sense but gaps in precision' },
      { id: 'F2_C', score: 1, text: 'Partially — we track revenue by segment but not profitability' },
      { id: 'F2_D', score: 0, text: 'Poorly — we manage to overall financials and have limited segment-level visibility', flagIds: ['FLAG_NO_PROFIT_VISIBILITY'] },
    ],
  },
  {
    id: 'F3',
    category: 'finance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How would you characterize cash generation relative to your reported profitability?',
    options: [
      { id: 'F3_A', score: 3, text: 'Consistent — cash generation tracks closely with operating profit' },
      { id: 'F3_B', score: 2, text: 'Lagging — we are profitable but cash conversion is slower than it should be' },
      { id: 'F3_C', score: 1, text: 'Volatile — cash generation is unpredictable and creates periodic stress', flagIds: ['FLAG_CASH_VOLATILITY'] },
      { id: 'F3_D', score: 0, text: 'We have limited visibility into the drivers of our cash cycle' },
    ],
  },
  {
    id: 'F4',
    category: 'finance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How disciplined is your organization\'s investment decision-making — capex, headcount additions, and new initiatives?',
    options: [
      { id: 'F4_A', score: 3, text: 'Very disciplined — investments are evaluated against clear financial criteria and reviewed regularly' },
      { id: 'F4_B', score: 2, text: 'Moderately disciplined — we have processes but they are inconsistently applied' },
      { id: 'F4_C', score: 1, text: 'Reactive — investment decisions are driven more by opportunity or pressure than structured evaluation' },
      { id: 'F4_D', score: 0, text: 'We deploy capital opportunistically without a formal allocation framework' },
    ],
  },
  {
    id: 'F5',
    category: 'finance',
    weight: 1.0,
    dropWhenSecondary: true,
    text: 'How would you characterize the financial risk profile of your business currently?',
    options: [
      { id: 'F5_A', score: 3, text: 'Well-managed — appropriate reserves, manageable leverage, and meaningful financial flexibility' },
      { id: 'F5_B', score: 2, text: 'Acceptable — some areas of risk but nothing representing a near-term threat' },
      { id: 'F5_C', score: 1, text: 'Elevated — more exposed than we would like in one or more financial dimensions' },
      { id: 'F5_D', score: 0, text: 'High — meaningful financial constraints are limiting our strategic options' },
    ],
  },
  {
    id: 'F6',
    category: 'finance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'If your business underperformed its financial targets last year, what was the primary cause?',
    options: [
      { id: 'F6_A', score: 1, text: 'Revenue shortfall — we did not generate the top-line we expected' },
      { id: 'F6_B', score: 1, text: 'Cost overruns — revenue was acceptable but costs exceeded plan' },
      { id: 'F6_C', score: 1, text: 'Working capital — we were profitable but cash-constrained' },
      { id: 'F6_D', score: 0, text: 'We did not have clear targets, or we did not track performance against them', flagIds: ['FLAG_NO_FINANCIAL_TARGETS'] },
      { id: 'F6_E', score: 3, text: 'We met or exceeded our financial targets' },
    ],
  },
  {
    id: 'F7',
    category: 'finance',
    weight: 1.0,
    dropWhenSecondary: false,
    text: 'How effectively does your organization translate financial data into operational decisions?',
    options: [
      { id: 'F7_A', score: 3, text: 'Very effectively — financial insights drive specific operational and commercial changes' },
      { id: 'F7_B', score: 2, text: 'Partially — finance produces good data but operational teams do not consistently act on it' },
      { id: 'F7_C', score: 1, text: 'Poorly — there is a significant gap between finance and operations' },
      { id: 'F7_D', score: 0, text: 'Finance is primarily a reporting function, not a decision-support function' },
    ],
  },
]

export function getQuestionsForFlow(
  focusAreas: import('../types').CategoryId[]
): Question[] {
  if (focusAreas.length === 0) return []

  const [primary, secondary] = focusAreas

  const primaryQs = questions.filter((q) => q.category === primary)

  const secondaryQs = secondary
    ? questions.filter((q) => q.category === secondary && !q.dropWhenSecondary)
    : []

  return [...primaryQs, ...secondaryQs]
}
