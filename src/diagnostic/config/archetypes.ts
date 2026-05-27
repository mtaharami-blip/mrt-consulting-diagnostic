import type { Archetype } from '../types'

export const archetypes: Archetype[] = [
  {
    id: 'scaling_inflection',
    name: 'Scaling Inflection',
    trigger: {
      primaryCategories: { ids: ['operations'], requiredLevels: ['red', 'orange'] },
      contextConditions: [
        { field: 'situation', values: ['growing_under_pressure'] },
      ],
      priority: 90,
    },
    headline:
      'The pattern suggests your business has reached an operational inflection point — the model that got you here is creating friction for the next stage of growth.',
    centralQuestion:
      'What specifically needs to be true about your operating model and leadership structure for your business to double in size without proportionally doubling its complexity and cost?',
    misdiagnosisNote:
      'Growth-stage businesses frequently attribute scaling problems to resourcing — the answer feels like more people, more systems, more capital. The more accurate diagnosis is usually structural: the operating model was never designed for the scale the business is now attempting. Adding resources to an inadequate model accelerates the cost without resolving the constraint.',
    defaultObservations: [
      'Your answers indicate that operational constraints are limiting your ability to convert growth into margin — a pattern consistent with a business that has outgrown its original operating design.',
      'The combination of growth pressure and operational friction often signals that management bandwidth is being consumed by operational problem-solving rather than strategic leadership.',
      'Businesses at this inflection typically need to make a deliberate choice about what to build, what to systematize, and what to outsource — rather than simply working harder within the current model.',
    ],
    focusAreas: [
      {
        title: 'Operating model design for the next stage',
        description:
          'Map your current operating model explicitly — how work flows, where decisions are made, and where management time is spent. Then design what it needs to look like at 2× your current scale. The gap between those two maps is your transformation agenda.',
      },
      {
        title: 'Management leverage and delegation audit',
        description:
          'Identify which decisions your senior leadership is making today that should be made one level down. Scaling organizations that do not build management leverage create a bottleneck at the top that limits both speed and capacity.',
      },
      {
        title: 'Operational visibility infrastructure',
        description:
          'Determine what you need to be able to see — in near real time — to manage the business at your next scale. Build that visibility now, before you need it, so decisions are data-driven rather than reactive.',
      },
    ],
  },
  {
    id: 'strategic_drift',
    name: 'Strategic Drift',
    trigger: {
      primaryCategories: { ids: ['strategy'], requiredLevels: ['red', 'orange'] },
      excludedLevels: { ids: ['operations', 'revenue'], levels: ['red'] },
      priority: 70,
    },
    headline:
      'The primary constraint is strategic clarity — your execution capability may be stronger than your current direction allows.',
    centralQuestion:
      'Is your leadership team optimizing for the strategy you have declared — or for the strategy each of them has individually concluded is the right one?',
    misdiagnosisNote:
      'Businesses in this pattern frequently misdiagnose the issue as an execution problem. Leadership doubles down on operational improvement or process discipline — and improves execution of the wrong things. The signal to watch: if your best people are executing well but results are not improving, the direction is the variable, not the capability.',
    defaultObservations: [
      'Your answers indicate that the strategic direction is unclear, contested, or misaligned with what your market is actually rewarding — a pattern that limits the effectiveness of everything downstream.',
      'Differentiation that cannot be articulated internally will not be perceived externally — pricing power, customer loyalty, and win rates are all downstream of a clear and credible strategic position.',
      'Strategy misalignment at the leadership level is rarely resolved by communication alone — it typically requires a structured process to surface, test, and resolve the underlying disagreements about where the business should compete and how.',
    ],
    focusAreas: [
      {
        title: 'Competitive differentiation audit',
        description:
          'Conduct structured conversations with your 10 best customers and 5 lost prospects. The goal is not to validate your positioning thesis — it is to discover what they actually value and whether it matches what you believe differentiates you. The gap between those two views is your strategic problem.',
      },
      {
        title: 'Leadership alignment on strategic priorities',
        description:
          'Run a structured prioritization exercise with your leadership team: which markets are you in, which will you win, and which will you exit? Make the disagreements explicit. Unresolved strategic debate at the top creates misaligned execution throughout the organization.',
      },
      {
        title: 'Business model relevance review',
        description:
          'Examine whether your current business model — how you create, deliver, and capture value — still matches the way your best customers want to buy and be served. Business models that were sound five years ago may now be creating friction rather than value.',
      },
    ],
  },
  {
    id: 'execution_gap',
    name: 'Execution Gap',
    trigger: {
      primaryCategories: { ids: ['operations'], requiredLevels: ['red', 'orange'] },
      excludedLevels: { ids: ['strategy'], levels: ['red', 'orange'] },
      priority: 70,
    },
    headline:
      'The evidence points to an execution constraint — your strategic direction appears sound but delivery capability is limiting what you can achieve.',
    centralQuestion:
      'How much of your operational capacity is currently consumed by correcting problems that better process design would prevent — and does your leadership team have a clear view of this number?',
    misdiagnosisNote:
      'The most common misdiagnosis here is a talent problem. Leadership concludes they need different people — and the response is hiring, restructuring, or performance management. In most cases, the people are capable but the operating model is not giving them what they need to succeed: clear processes, adequate visibility, unambiguous accountability, and the right tools.',
    defaultObservations: [
      'Your answers indicate that the operational model is creating constraints that limit how much value the strategy can generate — a pattern where strong intent does not convert to strong outcomes.',
      'Execution constraints at scale typically have structural causes: unclear accountability, insufficient operational visibility, or a process design that has not kept pace with business complexity.',
      'The gap between what a leadership team believes is happening in operations and what is actually happening is one of the most common and most costly problems in mid-market businesses.',
    ],
    focusAreas: [
      {
        title: 'Operational bottleneck mapping',
        description:
          'Identify where work consistently slows, where quality falls short, and where rework is most frequent. Map the actual flow of work rather than the intended flow — the gap between those two is where operational capacity is being lost.',
      },
      {
        title: 'Accountability and ownership clarity',
        description:
          'For every key outcome in the business, identify who is explicitly accountable, how that accountability is measured, and what happens when it is not met. Ambiguity in accountability is the most common structural cause of execution failure.',
      },
      {
        title: 'Operational data and performance visibility',
        description:
          'Determine what your leadership team needs to see — and currently cannot see — to manage operational performance effectively. Build or improve the reporting that would let you identify problems in days rather than months.',
      },
    ],
  },
  {
    id: 'commercial_engine',
    name: 'Commercial Engine Failure',
    trigger: {
      primaryCategories: { ids: ['revenue'], requiredLevels: ['red', 'orange'] },
      excludedLevels: { ids: ['strategy', 'operations'], levels: ['red'] },
      priority: 70,
    },
    headline:
      'The diagnostic points to a commercial performance constraint — how you sell, price, and retain customers is the primary performance lever.',
    centralQuestion:
      'Are you experiencing a pricing problem, a value communication problem, or a customer targeting problem — and do you know with confidence which one it actually is?',
    misdiagnosisNote:
      'Revenue challenges are frequently misdiagnosed as a sales capacity issue. The response is to hire more salespeople, increase marketing spend, or drive more activity. If the underlying commercial model is not sound — if pricing is reactive, if retention is weak, if win/loss patterns are not understood — more activity produces more cost, not more revenue.',
    defaultObservations: [
      'Your answers indicate that the commercial engine is underperforming relative to the underlying quality of your product or service — a pattern where delivery capability is not translating into commercial outcomes.',
      'Pricing pressure without a clear understanding of its cause is particularly diagnostic — it may indicate a competitive positioning issue, a value communication gap, or a customer selection problem, each of which has a different solution.',
      'Businesses that cannot articulate why they win and why they lose are making commercial decisions without the most important inputs — and improving commercial performance in that environment is largely a matter of luck.',
    ],
    focusAreas: [
      {
        title: 'Win/loss analysis',
        description:
          'Conduct structured debrief interviews on your last 20 competitive situations — both wins and losses. Not to confirm your current assumptions about why you win, but to discover what buyers are actually deciding on. The findings frequently surprise leadership teams and directly reframe the commercial strategy.',
      },
      {
        title: 'Pricing model and value capture review',
        description:
          'Examine your pricing architecture against the value you demonstrably create. Identify where you are underpricing relative to outcomes, where you are facing resistance, and whether your pricing model (fixed, value-based, variable) still matches how customers prefer to buy.',
      },
      {
        title: 'Customer retention and expansion mechanics',
        description:
          'Map your customer lifecycle from acquisition through renewal or churn. Identify where value is created, where it is communicated, and where relationships are at risk. Retention is the most capital-efficient growth lever in most businesses and the most frequently undermanaged.',
      },
    ],
  },
  {
    id: 'financial_symptom',
    name: 'Financial Symptom',
    trigger: {
      primaryCategories: { ids: ['finance'], requiredLevels: ['red', 'orange'] },
      excludedLevels: { ids: ['strategy', 'operations', 'revenue'], levels: ['red', 'orange'] },
      priority: 65,
    },
    headline:
      'Your financial outcomes appear to be symptoms of underlying operational or commercial issues rather than structural financial problems in themselves.',
    centralQuestion:
      'If you could see the true margin contribution of each product, service line, and customer segment today, which decisions would you make differently — and what has the absence of that data cost you?',
    misdiagnosisNote:
      'Businesses in this pattern sometimes treat the financial outcomes as the primary problem and pursue financial restructuring, cost reduction programs, or refinancing. These may provide temporary relief but will not address the underlying operational or commercial cause. Financial performance is downstream — improving it durably requires fixing what is upstream.',
    defaultObservations: [
      'Your financial outcomes appear to be downstream of operational or commercial dynamics rather than structural financial problems — which means the right intervention is upstream, not in the finance function itself.',
      'Margin compression or cash stress in a business with otherwise sound strategic and commercial signals often indicates a cost structure that has not been actively managed as the business has grown.',
      'The gap between reported profitability and operational performance is frequently wider than leadership teams realize — and closing it requires better financial visibility at the segment level, not just at the aggregate.',
    ],
    focusAreas: [
      {
        title: 'Segment-level profitability analysis',
        description:
          'Build a true profitability view by product, service line, customer, and channel — allocating shared costs as accurately as possible. Most businesses find that a small number of segments generate the majority of margin, while others are consuming resources at a loss that is masked by the aggregate.',
      },
      {
        title: 'Cost structure and overhead review',
        description:
          'Map your cost structure explicitly against the value-creating activities in the business. Identify where overhead has accumulated that is not directly supporting revenue or margin — and distinguish between costs that are fixed, variable, and discretionary.',
      },
      {
        title: 'Cash cycle and working capital optimization',
        description:
          'Analyze the gap between when you incur costs and when you collect cash. For most mid-market businesses, improvements in billing terms, collections, and payment timing can release meaningful working capital without any change to the underlying business model.',
      },
    ],
  },
  {
    id: 'margin_capital',
    name: 'Margin & Capital Discipline',
    trigger: {
      primaryCategories: { ids: ['finance'], requiredLevels: ['red', 'orange'] },
      priority: 60,
    },
    headline:
      'Profitability and capital discipline appear to be the primary constraints — the business may be generating revenue but losing value in how it flows through to margin and cash.',
    centralQuestion:
      'How much capital has your business deployed in the last 24 months into initiatives that have not yet returned their cost — and is there a clear plan and timeline for each of them?',
    misdiagnosisNote:
      'The instinct here is often to cut costs. Cost reduction can improve margin in the short term but typically does not address the capital allocation decisions that produced low-return investments. Margin improvement without profitability visibility — knowing which specific products, customers, or initiatives are consuming margin — is not durable.',
    defaultObservations: [
      'Your answers indicate that the financial performance of the business is not reflecting its operating and commercial activity — a gap that typically has specific, identifiable causes rather than being a general condition.',
      'Businesses with strong revenue but weak margin often have accumulated complexity — products, customers, or initiatives that consume resources disproportionate to the value they return.',
      'Capital allocation without clear financial criteria and regular portfolio review tends to favor inertia over value — continuing to invest in things that once made sense, rather than things that are creating the highest return today.',
    ],
    focusAreas: [
      {
        title: 'Investment portfolio review',
        description:
          'Create an explicit inventory of where your business is deploying capital — including initiatives, headcount, technology, and markets. For each, assess the expected return, the current evidence of progress, and the honest probability of success. This is not a cost-cutting exercise — it is a reallocation exercise.',
      },
      {
        title: 'Margin driver analysis',
        description:
          'Identify the three to five specific factors that are most responsible for the gap between your revenue growth and your margin growth. Are costs growing faster than revenue? Are you taking on lower-margin work? Is pricing lagging cost inflation? Each has a different solution.',
      },
      {
        title: 'Financial governance and decision framework',
        description:
          'Establish clear financial criteria for investment decisions — minimum return thresholds, stage-gate reviews for major initiatives, and regular portfolio reviews. This does not require a complex framework — a consistent set of questions asked before and after every significant investment is sufficient.',
      },
    ],
  },
  {
    id: 'systemic_pressure',
    name: 'Systemic Pressure',
    trigger: {
      primaryCategories: {
        ids: ['strategy', 'operations', 'revenue', 'finance'],
        requiredLevels: ['red', 'orange'],
      },
      priority: 50,
    },
    headline:
      'The diagnostic indicates systemic pressure across multiple dimensions — this pattern often signals a strategic positioning issue that is manifesting operationally and commercially.',
    centralQuestion:
      'If you had to identify the single underlying cause driving underperformance across strategy, operations, and revenue simultaneously — what would it be, and is your leadership team aligned on that answer?',
    misdiagnosisNote:
      'When multiple dimensions are under pressure simultaneously, the instinct is to run parallel improvement programs — an operational transformation here, a commercial refresh there, a strategy review somewhere else. Without a unifying diagnosis of the root cause, these initiatives frequently conflict or cancel each other out. The result is significant effort that produces limited improvement.',
    defaultObservations: [
      'Your diagnostic shows meaningful constraints across more than one dimension — a pattern that most often indicates a shared root cause rather than independent problems requiring separate solutions.',
      'Multi-dimensional underperformance is typically a signal that the business is at a strategic inflection point — the current positioning, model, or structure is no longer adequate for the environment the business is operating in.',
      'Attempting to fix operational, commercial, and financial performance simultaneously without first diagnosing the shared root cause tends to produce activity without traction.',
    ],
    focusAreas: [
      {
        title: 'Root cause hypothesis development',
        description:
          'Before pursuing any specific improvement program, invest in developing a shared, explicit hypothesis about the single most important constraint in the business. Test it against the evidence from multiple dimensions. A well-formed root cause hypothesis is the most valuable output of a diagnostic process.',
      },
      {
        title: 'Strategic position review',
        description:
          'Examine whether the business is positioned to win in the markets it has chosen, with the model it has built, at the scale it is operating. Multi-dimensional pressure frequently traces back to a strategic positioning issue — competing in markets where the firm cannot win, or with a model that no longer fits the competitive landscape.',
      },
      {
        title: 'Leadership alignment and decision-making process',
        description:
          'In businesses under systemic pressure, leadership bandwidth is often consumed by operational firefighting rather than strategic decision-making. Identify how leadership time is currently being spent versus where it needs to be spent — and what would need to change to shift that allocation.',
      },
    ],
  },
]

export const fallbackArchetype: Archetype = {
  id: 'broad_review',
  name: 'Broad Diagnostic Review',
  trigger: { primaryCategories: { ids: [], requiredLevels: [] }, priority: 0 },
  headline:
    'Your diagnostic does not indicate a single dominant constraint — this pattern typically calls for a broader strategic review before committing to a specific improvement agenda.',
  centralQuestion:
    'What is the one thing, if you got it right, that would have the greatest positive impact on your business performance over the next 12 months — and do you have a clear hypothesis about what that is?',
  misdiagnosisNote:
    'Businesses without a clear primary constraint are sometimes tempted to pursue broad transformation programs that attempt to improve everything simultaneously. This approach tends to dilute leadership focus and produce incremental improvement across the board rather than meaningful improvement where it matters most. The priority is to sharpen the diagnosis before committing to the response.',
  defaultObservations: [
    'Your answers do not indicate a single dominant area of constraint — which itself is useful diagnostic information. It suggests either that the business is performing reasonably across most dimensions, or that the real constraint has not yet been clearly surfaced.',
    'Without a clear primary constraint, improvement efforts risk being distributed too broadly to produce meaningful impact in any one area.',
    'The most valuable next step is a structured effort to develop and test a hypothesis about the single most important lever for performance improvement in your specific business.',
  ],
  focusAreas: [
    {
      title: 'Structured hypothesis development',
      description:
        'Work with your leadership team to develop an explicit hypothesis about the primary constraint in the business. Use the diagnostic signals from this assessment as starting points, not conclusions. The goal is to identify the one thing that, if fixed, would have the greatest downstream impact.',
    },
    {
      title: 'Performance data review',
      description:
        'Gather the performance data that would allow you to test your hypothesis — financial, operational, and commercial. Look for the patterns that confirm or challenge your current understanding of where the business is losing value.',
    },
  ],
}
