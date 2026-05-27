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
        title: 'Structural capacity relative to growth ambition',
        description:
          'Your answers suggest the operating model is absorbing more management attention and resource per unit of output than it should — a pattern consistent with a business that has outgrown its original design. The question is not whether growth is possible, but whether the current structure can produce it without proportionally increasing complexity, cost, and leadership strain.',
      },
      {
        title: 'Management bandwidth and decision concentration',
        description:
          'Scaling businesses frequently reach a point where senior leadership is making decisions the organization should be making one level down. This is not a delegation preference — it is a structural constraint. When decision-making remains concentrated at the top, it becomes the binding limit on growth speed and organizational capability development.',
      },
      {
        title: 'Operational performance visibility at current scale',
        description:
          'As businesses grow, the informal visibility mechanisms that worked at smaller scale — direct observation, trusted relationships, instinctive awareness — no longer provide an accurate picture of what is happening operationally. If your leadership team is relying on those signals now, at your current scale, the probability is high that significant operational problems are compounding below the surface before they become visible.',
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
        title: 'Differentiation validity in the current market',
        description:
          'A differentiation claim that cannot be confirmed by your best customers — or that is described differently across your leadership team — is not a strategic asset. It is a belief. The gap between what the business believes differentiates it and what customers actually value is one of the most common and most consequential sources of strategic underperformance.',
      },
      {
        title: 'Strategic consensus and the cost of its absence',
        description:
          'When leadership teams hold different views about which markets to pursue, which customers to serve, and what the business is ultimately trying to become, those disagreements do not stay in the boardroom. They surface as conflicting priorities, misaligned investments, and execution that moves in multiple directions simultaneously. The cost of unresolved strategic misalignment is paid throughout the organization.',
      },
      {
        title: 'Business model fit with current market conditions',
        description:
          'Business models that were sound at a different point in the market cycle can become constraints as conditions change. The mechanism — how the business creates, delivers, and captures value — may no longer match how the best customers want to engage. Where the model has drifted out of alignment with customer expectations, the symptoms often appear as pricing pressure, declining win rates, or customer acquisition costs that are rising without clear explanation.',
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
        title: 'Structural sources of delivery failure',
        description:
          'Execution failures in capable organizations typically have structural causes rather than people causes. When delivery is inconsistent, when rework is frequent, or when commitments are regularly missed, the most productive line of inquiry is into process design, accountability architecture, and the information available to operational managers — not the caliber of the individuals involved.',
      },
      {
        title: 'Accountability architecture and ownership gaps',
        description:
          'Clear accountability — where a named individual owns an outcome, has the authority to affect it, and is measured against it — is rare in mid-market organizations. What looks like an accountability gap is usually an organizational design problem: roles that overlap, outcomes that are nobody\'s primary responsibility, or expectations that have never been made explicit. The business pays for these gaps in every operating cycle.',
      },
      {
        title: 'The management visibility deficit',
        description:
          'The gap between what leadership believes is happening operationally and what is actually happening is frequently the most consequential blind spot in a mid-market business. When operational performance is managed through informal signals — leadership instinct, anecdotal feedback, or lagging financial data — problems compound for extended periods before they become visible. By that point, they are significantly more expensive to address.',
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
        title: 'The actual basis of commercial decisions',
        description:
          'Most businesses believe they understand why they win and why they lose. Structured win/loss evidence consistently reveals that the actual reasons diverge significantly from leadership\'s assumptions. Decisions about pricing, market positioning, and sales investment made on inaccurate assumptions about competitive dynamics tend to compound the underlying commercial problem rather than address it.',
      },
      {
        title: 'Value capture relative to value delivered',
        description:
          'Persistent pricing pressure is diagnostic. It typically signals one of three things: the business is competing in segments where its value proposition is not differentiated; the value it creates is not being communicated in terms customers find compelling; or pricing decisions are being made reactively rather than based on a clear view of what customers are willing to pay for. Each has a materially different implication for what needs to change.',
      },
      {
        title: 'Retention risk and revenue concentration',
        description:
          'Revenue growth built primarily on new customer acquisition, without strong retention and expansion in existing accounts, creates structural commercial fragility. Each year\'s growth must overcome the prior year\'s attrition. The businesses that build durable revenue engines invest disproportionately in understanding why customers stay and why they leave — and most have not done this work with sufficient rigor.',
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
        title: 'The upstream source of financial underperformance',
        description:
          'When financial performance is below expectation in a business that otherwise appears to be functioning — customers are being served, revenue is being generated, operations are running — the most likely explanation is that value is being lost in translation: between delivery and billing, between effort and margin, or between investment and return. The financial outcomes are downstream signals, not the primary problem.',
      },
      {
        title: 'Hidden margin destruction by segment',
        description:
          'Most businesses operating at the aggregate financial level are making capital allocation, pricing, and growth decisions without the information needed to make them well. Businesses that look profitable in aggregate frequently contain segments, product lines, or customer relationships that are consuming resources at a significant loss, masked by the performance of the rest of the portfolio. The decisions being made in the absence of this information have a measurable cost.',
      },
      {
        title: 'Cash conversion and its structural drivers',
        description:
          'A gap between reported profitability and cash generation is one of the more consequential and frequently underexamined financial dynamics in mid-market businesses. Profitable businesses can and do fail for cash reasons. Understanding the specific mechanics of how cash moves through the business — and where it gets absorbed — is a prerequisite for managing the financial risk profile with any precision.',
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
        title: 'Capital deployment and return accountability',
        description:
          'Businesses that grow revenue without a disciplined view of where capital is deployed — and what it is returning — frequently find that margin improvement lags revenue growth by design. Resources accumulate in initiatives, markets, and customer relationships that once made strategic sense but are no longer generating adequate return. Without an explicit portfolio view, the opportunity cost of continued deployment is invisible.',
      },
      {
        title: 'Margin compression drivers and trajectory',
        description:
          'When operating margins are compressing while revenue is growing or stable, there is typically a specific identifiable cause: costs growing faster than revenue, a shift in product or customer mix toward lower-margin work, pricing that is lagging cost inflation, or investment in capabilities that have not yet generated return. Cutting costs without identifying which of these is primary risks addressing the symptom while the underlying cause continues.',
      },
      {
        title: 'The quality of investment decisions',
        description:
          'Capital allocation quality — the discipline and rigor with which a business decides where to deploy its resources — is one of the most significant determinants of long-term financial performance, and one of the least frequently examined. In most mid-market businesses, investment decisions are made on the basis of intuition, relationship, or momentum rather than structured evaluation of expected return and risk. The cumulative effect of poor allocation compounds over time.',
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
        title: 'The shared root cause across dimensions',
        description:
          'Multi-dimensional underperformance — where strategy, operations, and commercial performance are all showing constraint signals simultaneously — rarely has multiple independent causes. In most cases, there is a single root cause, usually strategic in nature, that is manifesting across dimensions. Identifying and naming that root cause, rather than treating each dimension as a separate problem requiring a separate solution, is the necessary first step.',
      },
      {
        title: 'Strategic positioning under compound pressure',
        description:
          'When a business experiences simultaneous pressure across multiple performance dimensions, the most productive question is whether the underlying strategic positioning — the markets chosen, the model employed, the competitive basis — is still adequate for the environment it is operating in. Organizations that are well-positioned and well-structured typically do not experience simultaneous deterioration across unrelated performance areas.',
      },
      {
        title: 'Leadership bandwidth and the compound cost of systemic pressure',
        description:
          'Businesses operating under systemic pressure consume leadership bandwidth at a disproportionate rate. Senior leaders are drawn into operational problem-solving, financial management, and commercial firefighting simultaneously — leaving limited capacity for the strategic thinking that would address the root cause. This creates a self-reinforcing dynamic: the pressure compounds faster than leadership can respond to it.',
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
      title: 'Primary constraint identification',
      description:
        'Your diagnostic signals do not converge on a single dominant constraint, which is itself meaningful information. It may indicate that the business is performing adequately across most dimensions, or that the real constraint has not yet been clearly surfaced. In either case, the most productive next step is a structured effort to develop a working hypothesis about where the greatest performance leverage resides — before committing resources to any specific improvement agenda.',
    },
    {
      title: 'Stress-testing the current performance narrative',
      description:
        'The explanation that leadership currently holds about why the business is performing as it is — the internal narrative about causes and constraints — may or may not be accurate. In businesses without a clear primary constraint signal, that narrative is frequently untested. The signal patterns from this diagnostic provide a starting point for examining where the evidence is consistent with the current understanding, and where it suggests a different interpretation.',
    },
  ],
}
