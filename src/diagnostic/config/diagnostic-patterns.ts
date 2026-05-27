import type { DiagnosticPattern } from '../types'

/**
 * Diagnostic patterns replacing the old score-threshold archetypes.
 *
 * Each pattern is matched against the LayerSignal profile + AlignmentTest results
 * produced by the BCT + PST engine. Patterns are evaluated in priority order;
 * highest-priority match wins.
 *
 * Layer → CategoryId mapping for CategoryScore compat:
 *   strategy        → 'strategy'
 *   business_model  → 'revenue'
 *   operating_model → 'operations'
 *   performance     → 'finance'
 */
export const diagnosticPatterns: DiagnosticPattern[] = [
  {
    id: 'strategic_clarity_deficit',
    name: 'Strategic Clarity Deficit',
    trigger: {
      // Fires when the strategy layer is absent or partial — regardless of coherence.
      // A uniformly weak strategy layer (coherent but low-scoring) is still a clarity deficit.
      // The priority (90) ensures this wins over operating_model_lag (80) and
      // business_model_mismatch (85) when strategy is the primary failure.
      primaryConditions: [
        { layer: 'strategy', strength: ['absent', 'partial'] },
      ],
      priority: 90,
    },
    headline:
      'The primary constraint is strategic clarity — the business is executing competently in a direction that has not been sufficiently tested, differentiated, or aligned across leadership.',
    centralQuestion:
      'Is your leadership team deploying organizational energy toward the strategy the business has declared — or toward the strategic direction each of them has individually concluded is the right one?',
    misdiagnosisNote:
      'Businesses in this pattern frequently misdiagnose the issue as an execution or commercial problem and redirect effort toward operational improvement or sales investment. The signal to watch: when capable people execute diligently but results do not improve, the direction is the variable — not the capability.',
    defaultObservations: [
      'The pattern of responses indicates that strategic differentiation is being described internally without consistent external confirmation — a gap between what the business believes positions it and what the market is validating.',
      'Resource allocation that does not reflect stated strategic priorities is one of the most reliable signals of strategic misalignment — it reveals the strategy that is actually being executed, versus the one that is being articulated.',
      'When market signals — win rates, pricing power, competitive position — are trending in a direction the current strategic frame cannot fully explain, the frame itself warrants examination.',
    ],
    focusAreas: [
      {
        title: 'Differentiation validity in the current market',
        description:
          'A differentiation claim that cannot be confirmed by your best customers — or that is described differently across your leadership team — is not a strategic asset. It is a belief. The gap between what the business believes differentiates it and what customers actually value is one of the most common and most consequential sources of strategic underperformance.',
      },
      {
        title: 'Leadership alignment on strategic direction',
        description:
          'When leadership teams hold different working assumptions about which markets to pursue, which customers to serve, and what the business is ultimately trying to become, those differences do not stay in the boardroom. They surface as conflicting priorities, misaligned investments, and execution that moves simultaneously in multiple directions. The cost of unresolved strategic misalignment is paid throughout the organization on every operating cycle.',
      },
      {
        title: 'Strategy-to-resource alignment',
        description:
          'The clearest test of whether a strategy is real is whether the organization is actually allocating its scarcest resources — budget, senior leadership time, and organizational attention — in proportion to the stated strategic priorities. Where there is meaningful divergence between stated strategy and observed allocation, the allocation is the more reliable signal of what the organization actually believes.',
      },
    ],
  },

  {
    id: 'business_model_mismatch',
    name: 'Business Model Mismatch',
    trigger: {
      // Fires when strategy is viable but the business model fails to translate it.
      // Removed coherent: false requirement — an absent/consistently weak BM is
      // a mismatch regardless of internal coherence.
      primaryConditions: [
        { layer: 'strategy', strength: ['clear', 'partial'] },
        { layer: 'business_model', strength: ['absent', 'partial'] },
      ],
      alignmentConditions: [
        { id: 'strategy_businessModel', results: ['misaligned', 'partial'] },
      ],
      priority: 85,
    },
    headline:
      'Your strategy has directional clarity that the business model is not yet translating into commercial outcomes — how you create, deliver, and capture value is not fully aligned with what your strategic position requires.',
    centralQuestion:
      'Is the way you price, deliver, and expand with customers a reflection of the strategic position you have chosen — or a reflection of sector norms and deal-by-deal commercial decisions?',
    misdiagnosisNote:
      'Business model constraints are frequently misattributed to commercial execution failures. The instinct is to increase sales activity, invest in marketing, or renegotiate pricing individually. These interventions address the output of the business model, not its underlying logic. Improving commercial results durably requires examining whether the mechanism by which the business creates and captures value is actually designed for the strategy it is pursuing.',
    defaultObservations: [
      'The gap between stated differentiation and pricing behavior is a diagnostic signal in its own right — businesses that claim a premium strategic position but price at market rates or reactively are describing two different commercial strategies simultaneously.',
      'When customers choose a business for different reasons than the business believes it is being chosen — a pattern the answers suggest here — the value proposition is not landing as intended, which has downstream implications for retention, expansion, and pricing power.',
      'A business model that grows costs proportionally with revenue is structurally limited in how it can deliver margin improvement — growth becomes an investment rather than a compounding advantage.',
    ],
    focusAreas: [
      {
        title: 'Value proposition external validation',
        description:
          'Most businesses have a working theory of why customers choose them. Structured win/loss evidence consistently reveals that the actual reasons diverge from leadership assumptions. Decisions about pricing, market positioning, and sales investment made on inaccurate assumptions about why the business wins tend to compound the underlying commercial problem rather than address it.',
      },
      {
        title: 'Pricing model coherence',
        description:
          'Persistent pricing pressure is diagnostic. It typically signals one of three things: the business is competing in segments where its value proposition is not differentiated; the value it creates is not being communicated in terms customers find compelling; or pricing decisions are being made reactively rather than based on a clear view of what customers are willing to pay for. Each has a materially different implication for what needs to change.',
      },
      {
        title: 'Commercial-strategy alignment',
        description:
          'The commercial motion of a business — how it generates, qualifies, and converts opportunities — should be a direct expression of the strategic position. Where the sales process, proposal structure, and pricing logic are inherited from an earlier business configuration or sector convention rather than designed around the current strategy, commercial results will consistently underperform what the strategy should produce.',
      },
    ],
  },

  {
    id: 'operating_model_lag',
    name: 'Operating Model Lag',
    trigger: {
      // Only fires when strategy is at least partially viable — distinguishing
      // "OM is the constraint" from "strategy is absent so everything downstream fails."
      // The strategy_businessModel alignment being reasonable is implied by requiring
      // strategy to be clear or partial here.
      primaryConditions: [
        { layer: 'strategy', strength: ['clear', 'partial'] },
        { layer: 'operating_model', strength: ['absent', 'partial'] },
      ],
      alignmentConditions: [
        { id: 'businessModel_operatingModel', results: ['misaligned', 'partial'] },
      ],
      priority: 80,
    },
    headline:
      'The operating model is the binding constraint — the organization\'s strategy and commercial proposition are clearer than the operational structure\'s ability to deliver and sustain them at current and intended scale.',
    centralQuestion:
      'Is the current organizational structure — roles, processes, decision rights, and management infrastructure — configured for the business you are today, or for the business you were two to three years ago?',
    misdiagnosisNote:
      'Operating model constraints are most commonly misdiagnosed as talent problems. Leadership concludes they need different or more capable people — and the response is restructuring, new hires, or performance management. In the majority of cases, the people are adequate. The operating model is not giving them the structure, visibility, accountability, or tools they need to deliver consistently. Adding capable people to an inadequate operating model produces capable people frustrated by the same structural failures.',
    defaultObservations: [
      'A delivery experience that varies in ways leadership cannot predict or explain is a structural signal, not a people signal — it indicates that the operating model has not been designed with the controls and visibility needed to produce consistent outcomes.',
      'Organizational structure that reflects an earlier business configuration — roles, accountabilities, and decision rights designed for a smaller, simpler, or differently-positioned business — is one of the most common hidden constraints in growing organizations. The cost shows up in decision speed, accountability gaps, and strategy that stalls in execution.',
      'The gap between what leadership believes is happening operationally and what is actually happening is frequently the most consequential blind spot in mid-market businesses. When operational performance is managed through informal signals, problems compound before they become visible.',
    ],
    focusAreas: [
      {
        title: 'Organizational configuration for current strategy',
        description:
          'The structure of an organization — how roles are defined, how accountability is assigned, how decisions are made — encodes assumptions about what the business is trying to do. Organizations that have grown, shifted strategy, or entered new markets without redesigning those structural elements are effectively executing a new strategy with an old organizational model. The friction this creates is often attributed to execution failure when the cause is structural misfit.',
      },
      {
        title: 'Delivery coherence and operating model instrumentation',
        description:
          'Delivery consistency is the operating model\'s primary output. When delivery quality varies in ways that leadership cannot explain or predict, the operating model has not been designed with the process controls, visibility mechanisms, and accountability architecture needed to produce reliable outcomes. Inconsistent delivery is a structural diagnostic, not a calibration issue.',
      },
      {
        title: 'Management infrastructure for current scale',
        description:
          'The informal visibility mechanisms that work at small scale — direct observation, trusted relationships, instinctive awareness of what is happening — lose reliability as organizations grow. If leadership is relying on informal signals to understand operational performance at current scale, the probability is high that significant problems are compounding below the surface before they become visible. By the time they surface, the cost of addressing them is substantially higher.',
      },
    ],
  },

  {
    id: 'management_infrastructure_deficit',
    name: 'Management Infrastructure Deficit',
    trigger: {
      primaryConditions: [
        { layer: 'performance', strength: ['absent'] },
        { layer: 'strategy', strength: ['clear', 'partial'] },
        { layer: 'business_model', strength: ['clear', 'partial'] },
      ],
      priority: 75,
    },
    headline:
      'The business\'s primary constraint is not strategic or commercial — it is the management infrastructure: the organization\'s ability to see, measure, understand, and act on performance signals with sufficient precision and reliability.',
    centralQuestion:
      'If the metrics your leadership team reviews every week were replaced tomorrow with metrics directly connected to the strategic and operational drivers of performance, which decisions made in the last 12 months would have been made differently?',
    misdiagnosisNote:
      'Management infrastructure deficits are frequently invisible because the business is still performing — revenue is flowing, customers are being served, and operations are running. The constraint becomes visible only when performance deteriorates and the organization discovers it lacks the tools to diagnose why. At that point, the cost of the deficit is substantially higher than it would have been to address it proactively. The diagnostic signal to watch: a business that routinely addresses performance problems by addressing symptoms rather than root causes is one whose management infrastructure cannot yet distinguish between the two.',
    defaultObservations: [
      'Metrics that measure activity rather than outcomes are a structural constraint — they give leadership the impression of visibility while obscuring the causal mechanisms that actually drive performance.',
      'A performance improvement process that consistently produces recurring problems — the same issues surfacing in cycle after cycle — is reliably diagnosing symptoms rather than causes. This is not a people problem. It is a measurement and diagnostic infrastructure problem.',
      'The gap between what the business is doing and what is resulting from it — the signal-to-action translation layer — is where management infrastructure lives. A weak infrastructure means the business can be working hard and still not know whether its efforts are connected to the outcomes that matter.',
    ],
    focusAreas: [
      {
        title: 'Metric-strategy alignment',
        description:
          'Metrics that are not causally connected to strategic and operational drivers consume leadership attention without generating decision-relevant information. The discipline of identifying which three to five indicators most accurately predict the outcomes the business cares about — and designing performance management around those — is one of the highest-leverage improvements an organization can make. The metrics in use are rarely the metrics that matter most.',
      },
      {
        title: 'Root cause diagnosis capability',
        description:
          'A business that consistently diagnoses performance gaps incorrectly will consistently invest in the wrong solutions. The reliability of root cause diagnosis is therefore a direct multiplier on the effectiveness of every improvement effort the organization makes. Building a reliable diagnostic process — one that distinguishes between structural causes, process causes, and people causes — is prerequisite to durable performance improvement.',
      },
      {
        title: 'Performance visibility infrastructure',
        description:
          'Visibility infrastructure is the set of data, cadences, and reporting mechanisms through which leadership maintains an accurate picture of what the business is doing and what it is producing. Where this infrastructure is incomplete, leadership is making decisions with a partial or delayed picture of reality. The decisions that result from that partial picture have a compounding cost that is rarely visible until it accumulates into a meaningful gap between actual and potential performance.',
      },
    ],
  },

  {
    id: 'systemic_misalignment',
    name: 'Systemic Misalignment',
    trigger: {
      primaryConditions: [
        { layer: 'strategy', strength: ['absent', 'partial'] },
        { layer: 'business_model', strength: ['absent', 'partial'] },
        { layer: 'operating_model', strength: ['absent', 'partial'] },
      ],
      // Accept misaligned AND untestable — both indicate cross-layer breakdown.
      // 'untestable' fires when the business lacks sufficient visibility to even
      // measure alignment, which in a multi-layer-absent context IS a systemic signal.
      alignmentConditions: [
        { id: 'strategy_businessModel', results: ['misaligned', 'untestable'] },
        { id: 'businessModel_operatingModel', results: ['misaligned', 'untestable'] },
      ],
      priority: 70,
    },
    headline:
      'The diagnostic indicates structural misalignment across multiple framework layers — the strategy, business model, and operating model appear to have evolved independently rather than as a coherent, mutually reinforcing system.',
    centralQuestion:
      'If you were designing this business from scratch with today\'s market knowledge, today\'s capabilities, and today\'s strategic objectives — how much of the current strategy, business model, and operating model would you reproduce, and what would you change?',
    misdiagnosisNote:
      'When multiple framework layers show constraint simultaneously, the instinct is to run parallel improvement programs — a strategy refresh here, an operational transformation there, a commercial restructure somewhere else. Without a prior diagnosis of the alignment failures these programs are meant to address, they frequently conflict, duplicate effort, or cancel each other out. Systemic misalignment requires a systemic diagnosis before a systemic response. Running improvement programs in parallel without a unifying root cause hypothesis is activity without architecture.',
    defaultObservations: [
      'Multi-layer constraint signals most commonly indicate that the business\'s strategy, business model, and operating model have evolved at different rates or in response to different pressures — producing a configuration where the parts are working against each other rather than reinforcing each other.',
      'The pattern across the responses suggests that constraint at any one layer is not independent of constraint at the others — the most productive line of inquiry is the alignment relationship between layers, rather than the quality of execution within any single one.',
      'Organizations experiencing simultaneous pressure across strategy, business model, and operating model are often at a strategic inflection point — the business has grown or the environment has changed in ways that have made the original configuration increasingly inadequate without a clear moment of transition.',
    ],
    focusAreas: [
      {
        title: 'Alignment between strategy and business model',
        description:
          'The business model is the mechanism that makes the strategy real — it is how the strategic position is actually delivered to customers and how value is captured economically. When strategy and business model are out of alignment, the strategy cannot produce what it intends and the business model cannot produce what it should. This misalignment is typically not sudden — it develops as the strategy evolves without a corresponding redesign of how value is created and captured.',
      },
      {
        title: 'Alignment between business model and operating model',
        description:
          'The operating model is the engine that delivers the business model. When these two are misaligned — when the organization is configured to execute a business model it is no longer pursuing, or when the operating model cannot deliver what the business model requires — the gap shows up as delivery inconsistency, margin pressure, or scaling failure. The operating model should be designed backward from the business model\'s requirements, not forward from historical configuration.',
      },
      {
        title: 'Root cause of cross-layer divergence',
        description:
          'The most important diagnostic question for a business experiencing multi-layer constraint is: when did the layers diverge, and what caused the divergence? The answer typically reveals either a strategic shift that was not followed by a business model and operating model redesign, or an operating model that scaled in response to growth without being redesigned for the business model it was meant to serve. Identifying the origin of the misalignment is prerequisite to designing the right correction.',
      },
    ],
  },

  {
    id: 'narrative_confidence_gap',
    name: 'Narrative Confidence Gap',
    trigger: {
      // Fires when the business looks coherent on the surface but cross-layer
      // alignment shows disconnects — the internal model and the evidence are diverging.
      // Requires at least one partial cross-layer alignment to distinguish from a
      // genuinely healthy business (which should fall to broad_review).
      primaryConditions: [
        { layer: 'strategy', strength: ['clear', 'partial'] },
        { layer: 'business_model', strength: ['clear', 'partial'] },
      ],
      alignmentConditions: [
        { id: 'strategy_businessModel', results: ['partial', 'misaligned'] },
      ],
      priority: 60,
    },
    headline:
      'The business is performing adequately but the leadership team\'s internal model of why it is performing — and what would cause it to stop — may not accurately reflect the evidence the business is producing.',
    centralQuestion:
      'When your business produces evidence that conflicts with your strategic narrative — unusual customer behavior, unexpected competitive dynamics, unexplained margin movement — does the leadership response update the narrative or protect it?',
    misdiagnosisNote:
      'Narrative confidence gaps are particularly difficult to diagnose because they are invisible by definition: a leadership team operating on an inaccurate internal model of the business does not experience the model as inaccurate. The pattern that makes this detectable is a combination of otherwise reasonable layer signals with persistent contradictions across those layers that have not been systematically examined. The risk is not current performance — it is that the business is building strategic and commercial decisions on assumptions that are not being tested against accumulating evidence.',
    defaultObservations: [
      'The combination of individual layer signals that appear reasonable with multiple contradictions between those signals — differentiation claims that don\'t match pricing behavior, strategy-behavior alignment claims that don\'t match organizational configuration — suggests a gap between how leadership describes the business and how it actually operates.',
      'Evidence that consistently conflicts with the strategic narrative and is consistently explained away rather than examined is a reliable early signal of strategic assumptions that have not been tested against current market reality.',
      'The most consequential risk in this pattern is not a current performance problem but a future one: decisions being made on an understanding of the business that the evidence has been quietly challenging for some time.',
    ],
    focusAreas: [
      {
        title: 'Strategic assumption testing',
        description:
          'The strategic assumptions underlying the business — about what differentiates it, who the best customers are, why they choose it, and what would cause them to leave — should be treated as hypotheses to be tested, not conclusions to be defended. The cadence and rigor with which leadership tests its core strategic assumptions is a more important indicator of strategic health than the content of the assumptions themselves.',
      },
      {
        title: 'Narrative-evidence reconciliation process',
        description:
          'Every leadership team maintains a working narrative of why the business is performing as it is and what is driving its results. That narrative is updated, explicitly or implicitly, every time new evidence arrives. How that update process works — whether conflicting evidence is examined and integrated or explained away — determines whether the organization\'s understanding of itself improves over time or calcifies around an outdated model.',
      },
      {
        title: 'Leading indicators of strategic position change',
        description:
          'The early signals that a strategic position is eroding — subtle shifts in win/loss ratios, gradual changes in the reasons customers cite for choosing the business, slow movement in pricing power — are typically visible in the data before they become visible in headline financial results. Building a capability to read these early signals is the difference between proactive repositioning and reactive restructuring.',
      },
    ],
  },

  {
    id: 'external_constraint',
    name: 'External Constraint',
    trigger: {
      primaryConditions: [
        { layer: 'strategy', strength: ['clear', 'partial'] },
        { layer: 'operating_model', strength: ['clear', 'partial'] },
      ],
      contextConditions: [
        { field: 'situation', values: ['declining', 'plateaued', 'sensing_risk'] },
      ],
      priority: 55,
    },
    headline:
      'The primary constraint appears to be external rather than structural — the business is adequately configured internally but operating in a market environment that is actively working against it.',
    centralQuestion:
      'Is the strategic response to the current external environment a repositioning decision that leadership has made deliberately — or a set of commercial and operational adaptations that are accumulating without an explicit strategic choice about what the business is becoming?',
    misdiagnosisNote:
      'External constraints are frequently misdiagnosed as internal execution failures — declining revenue leads to performance management, operational cost reduction, or commercial restructuring, even when the cause is market contraction or structural competitive shift. These responses address symptoms rather than the actual constraint and can damage the business by consuming internal energy on problems that internal action cannot solve. The correct diagnostic question when the business is performing below expectations is: how much of the gap is within the organization\'s ability to address, and how much is the market itself?',
    defaultObservations: [
      'The signal profile suggests that internal configuration — strategy, business model, operating model — is more coherent than the external performance would imply. This pattern is consistent with a business that is executing adequately within a market environment that is creating headwind independent of internal quality.',
      'Market contraction, competitive commoditisation, or structural demand shift can produce financial and commercial symptoms that are identical to those produced by internal strategy or execution failure. Distinguishing between these causes is the most important diagnostic step before committing to a response.',
      'Businesses that have historically performed well in a market environment and are now experiencing pressure without clear internal causes are often encountering a market transition that their current strategic position was not designed for — the question is whether to adapt the position or wait for the environment to stabilize.',
    ],
    focusAreas: [
      {
        title: 'External environment assessment',
        description:
          'A rigorous, data-grounded assessment of the external environment — market size and direction, competitive dynamics, demand-side changes, and regulatory or technological shifts — is the necessary foundation for distinguishing internal from external causes of performance pressure. Without this, improvement programs address what is visible rather than what is causal.',
      },
      {
        title: 'Strategic response to market dynamics',
        description:
          'When the external environment is the primary constraint, the strategic question is not how to improve execution within the current position — it is whether the current position is still viable, and if not, what the right repositioning is. This is a fundamentally different kind of decision from operational improvement, and it requires a fundamentally different kind of leadership process.',
      },
      {
        title: 'Internal configuration relative to new external conditions',
        description:
          'Even where the primary constraint is external, the internal configuration may need to change — not because it was poorly designed, but because the external environment has changed what it needs to deliver. The operating model, commercial motion, and cost structure that were appropriate for a different market environment may require adjustment for the current one, independent of whether internal execution has been sound.',
      },
    ],
  },
]

export const fallbackPattern: DiagnosticPattern = {
  id: 'broad_review',
  name: 'Broad Diagnostic Review',
  trigger: { primaryConditions: [], priority: 0 },
  headline:
    'Your diagnostic profile does not converge on a single primary constraint — this pattern calls for a deeper examination before committing to a specific improvement agenda.',
  centralQuestion:
    'What is the one question that, if your leadership team could answer it definitively, would most change how you allocate organizational energy in the next 12 months?',
  misdiagnosisNote:
    'Businesses without a clear dominant constraint signal are sometimes tempted to pursue broad transformation programs that attempt to improve everything simultaneously. This approach tends to dilute leadership focus and produce marginal improvement across the board rather than material impact where it matters most. The more productive response is to develop a clear working hypothesis about the primary constraint before investing in a comprehensive improvement program — and to test that hypothesis explicitly before acting on it.',
  defaultObservations: [
    'The signal profile does not point clearly to a single dominant constraint — which is itself useful diagnostic information. It may indicate that the business is performing reasonably across most dimensions, or that the primary constraint has not yet been clearly surfaced by this assessment.',
    'Without a clear primary constraint, improvement efforts risk being distributed too broadly to produce meaningful impact in any one area. The most valuable next step is to sharpen the hypothesis about where the most significant performance leverage actually resides.',
    'The pattern of responses suggests that the business has multiple partial constraints rather than one dominant one — a configuration that often benefits from structured leadership team diagnosis before committing to an improvement agenda.',
  ],
  focusAreas: [
    {
      title: 'Primary constraint identification',
      description:
        'Your diagnostic signals do not converge on a single dominant constraint, which is itself meaningful information. The most productive next step is a structured leadership team process to develop and test a hypothesis about where the greatest performance leverage resides — before committing resources to any specific improvement agenda.',
    },
    {
      title: 'Stress-testing the current performance narrative',
      description:
        'The explanation that leadership currently holds about why the business is performing as it is may or may not be accurate. Where the diagnostic does not produce a clear primary constraint signal, examining that narrative systematically — testing each assumption against available evidence — is typically more valuable than immediately pursuing operational improvement.',
    },
  ],
}
