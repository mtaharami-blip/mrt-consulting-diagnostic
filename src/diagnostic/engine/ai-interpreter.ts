/**
 * AI Interpreter
 *
 * Sends the structured evidence package to Claude and returns a validated
 * AIInterpretation. This is the only file in the codebase that calls the
 * Anthropic API.
 *
 * Design principles:
 * - API key read from environment only — never hardcoded
 * - Single attempt, 45 s timeout — no SDK-level retries (maxRetries: 0)
 *   Retrying on timeout costs 3× wall time; the after() caller handles
 *   failure gracefully by setting ai_status = 'failed'
 * - max_tokens capped at 800 — the JSON schema fits comfortably; lower
 *   ceiling reduces generation time under load
 * - Strict output validation before returning — malformed responses rejected
 * - Low temperature (0.3) for analytical consistency
 * - Caller is responsible for catching errors and setting ai_status = 'failed'
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AIInterpretationInput, AIInterpretation } from '../types'
import { AI_SYSTEM_PROMPT, AI_OUTPUT_SCHEMA, AI_FIELD_RULES } from '../config/ai-prompts'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODEL         = 'claude-sonnet-4-5'
const MAX_TOKENS    = 800   // 800 is ample for the structured output; reduces generation time
const TEMPERATURE   = 0.3
const TIMEOUT_MS    = 45_000  // single attempt; no retries

// ─── Error type ───────────────────────────────────────────────────────────────

export class AIInterpretationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AIInterpretationError'
  }
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

/**
 * Trims the evidence package before serialisation to reduce input token count.
 * Keeps only weak answers (score ≤ 1) in the transcript — these are the
 * diagnostically significant responses; high-scoring answers add little signal
 * and cost ~40% of input tokens.
 */
function trimInput(input: AIInterpretationInput): AIInterpretationInput {
  return {
    ...input,
    answerTranscript: input.answerTranscript.filter(a => a.score <= 1),
  }
}

function buildUserPrompt(input: AIInterpretationInput): string {
  const trimmed = trimInput(input)
  return `Interpret the following diagnostic profile and return a JSON object matching this exact schema:

${AI_OUTPUT_SCHEMA}

${AI_FIELD_RULES}

Diagnostic profile:
${JSON.stringify(trimmed, null, 2)}`
}

// ─── JSON extraction ─────────────────────────────────────────────────────────

/**
 * Extracts and parses a JSON object from a Claude response that may include
 * markdown fences, preamble text, or explanation after the object.
 *
 * Strategies tried in order:
 * 1. Direct parse — response is already clean JSON
 * 2. Fence extraction — captures content inside ```json ... ``` or ``` ... ```
 *    (handles preamble text before the fence, e.g. "Here is the output:\n```")
 * 3. Brace extraction — finds first { ... last } in the raw text
 *    (handles responses that prefix/suffix the object with prose)
 *
 * Throws if all three strategies fail.
 */
function extractJSON(text: string): unknown {
  const trimmed = text.trim()

  // Strategy 1: direct parse
  try {
    return JSON.parse(trimmed)
  } catch { /* fall through */ }

  // Strategy 2: extract from code fence (non-greedy, handles preamble)
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim())
    } catch { /* fall through */ }
  }

  // Strategy 3: extract from first { to matching last }
  const braceStart = trimmed.indexOf('{')
  const braceEnd   = trimmed.lastIndexOf('}')
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      return JSON.parse(trimmed.slice(braceStart, braceEnd + 1))
    } catch { /* fall through */ }
  }

  throw new Error('No JSON object found in response')
}

// ─── Output validation ────────────────────────────────────────────────────────

function assertString(value: unknown, field: string, maxLength?: number): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AIInterpretationError(`${field} is missing or empty`)
  }
  if (maxLength && value.length > maxLength) {
    throw new AIInterpretationError(`${field} exceeds ${maxLength} characters (got ${value.length})`)
  }
  return value
}

function validateOutput(raw: unknown): AIInterpretation {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new AIInterpretationError('Response is not a JSON object')
  }
  const obj = raw as Record<string, unknown>

  // constraintNarrative
  const constraintNarrative = assertString(obj.constraintNarrative, 'constraintNarrative', 600)

  // signalClusters — 2-3 items
  if (!Array.isArray(obj.signalClusters)) {
    throw new AIInterpretationError('signalClusters is not an array')
  }
  if (obj.signalClusters.length < 2 || obj.signalClusters.length > 3) {
    throw new AIInterpretationError(
      `signalClusters must have 2-3 items, got ${obj.signalClusters.length}`,
    )
  }
  const signalClusters = (obj.signalClusters as unknown[]).map((item, i) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new AIInterpretationError(`signalClusters[${i}] is not an object`)
    }
    const c = item as Record<string, unknown>
    const theme = assertString(c.theme, `signalClusters[${i}].theme`)
    if (!Array.isArray(c.supportingSignals) || c.supportingSignals.length < 2) {
      throw new AIInterpretationError(
        `signalClusters[${i}].supportingSignals must have 2+ items`,
      )
    }
    const implication = assertString(c.implication, `signalClusters[${i}].implication`)
    return {
      theme,
      supportingSignals: c.supportingSignals as string[],
      implication,
    }
  })

  // businessImplications — 3-4 items
  if (!Array.isArray(obj.businessImplications)) {
    throw new AIInterpretationError('businessImplications is not an array')
  }
  if (obj.businessImplications.length < 3 || obj.businessImplications.length > 4) {
    throw new AIInterpretationError(
      `businessImplications must have 3-4 items, got ${obj.businessImplications.length}`,
    )
  }
  const businessImplications = obj.businessImplications as string[]

  // refinedCentralQuestion
  const refinedCentralQuestion = assertString(
    obj.refinedCentralQuestion,
    'refinedCentralQuestion',
  )

  // confidence
  if (!obj.confidence || typeof obj.confidence !== 'object' || Array.isArray(obj.confidence)) {
    throw new AIInterpretationError('confidence object is missing')
  }
  const conf = obj.confidence as Record<string, unknown>
  const validLevels = ['high', 'medium', 'low'] as const
  if (!validLevels.includes(conf.level as typeof validLevels[number])) {
    throw new AIInterpretationError(
      `confidence.level must be high/medium/low, got: ${conf.level}`,
    )
  }
  const rationale = assertString(conf.rationale, 'confidence.rationale')
  if (
    typeof conf.assessmentCoverage !== 'number' ||
    conf.assessmentCoverage < 0 ||
    conf.assessmentCoverage > 1
  ) {
    throw new AIInterpretationError(
      `confidence.assessmentCoverage must be 0–1, got: ${conf.assessmentCoverage}`,
    )
  }

  return {
    constraintNarrative,
    signalClusters,
    businessImplications,
    refinedCentralQuestion,
    confidence: {
      level:              conf.level as 'high' | 'medium' | 'low',
      rationale,
      assessmentCoverage: conf.assessmentCoverage as number,
    },
    modelVersion: MODEL,
    generatedAt:  new Date().toISOString(),
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Sends the evidence package to Claude and returns a validated interpretation.
 *
 * Single attempt — no retries. Throws AIInterpretationError on any failure
 * (missing API key, timeout, network error, API error, schema validation
 * failure). The caller in complete/route.ts catches this and sets
 * ai_status = 'failed', which is the graceful degradation path.
 */
export async function interpretDiagnostic(
  input: AIInterpretationInput,
): Promise<AIInterpretation> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('[AI interpreter] ANTHROPIC_API_KEY is not set')
    throw new AIInterpretationError('ANTHROPIC_API_KEY is not configured')
  }

  // maxRetries: 0 — the SDK retries by default (×3 total).
  // With a 45 s timeout each that would be 135 s total wall time on Vercel.
  // We handle failure in the caller; a single clean attempt is correct here.
  const client = new Anthropic({
    apiKey,
    timeout:    TIMEOUT_MS,
    maxRetries: 0,
  })

  const startMs = Date.now()
  let textContent: string

  try {
    const response = await client.messages.create({
      model:       MODEL,
      max_tokens:  MAX_TOKENS,
      temperature: TEMPERATURE,
      system:      AI_SYSTEM_PROMPT,
      messages:    [{ role: 'user', content: buildUserPrompt(input) }],
    })

    const elapsed = Date.now() - startMs
    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new AIInterpretationError('Claude response contains no text block')
    }
    textContent = textBlock.text.trim()
    console.log(`[AI interpreter] API call succeeded in ${elapsed} ms (${textContent.length} chars)`)
  } catch (err) {
    const elapsed = Date.now() - startMs
    if (err instanceof AIInterpretationError) throw err

    // Categorise the Anthropic SDK error for logging clarity
    const errName  = (err as Error)?.name  ?? 'Unknown'
    const errMsg   = (err as Error)?.message ?? String(err)
    const isTimeout = errName === 'APIConnectionTimeoutError' ||
      errMsg.toLowerCase().includes('timeout') ||
      elapsed >= TIMEOUT_MS - 500

    if (isTimeout) {
      console.error(`[AI interpreter] Timeout after ${elapsed} ms (limit ${TIMEOUT_MS} ms)`)
    } else if (errName === 'APIStatusError' || errName === 'RateLimitError') {
      const status = (err as { status?: number }).status
      console.error(`[AI interpreter] API error — ${errName} status=${status ?? '?'}: ${errMsg}`)
    } else {
      console.error(`[AI interpreter] Unexpected error — ${errName}: ${errMsg}`)
    }

    throw new AIInterpretationError(`Claude API call failed (${errName})`, err)
  }

  // Parse JSON — try three extraction strategies in order
  let parsed: unknown
  try {
    parsed = extractJSON(textContent)
  } catch {
    console.error(
      '[AI interpreter] JSON parse failed. Raw response (first 500 chars):',
      textContent.slice(0, 500),
    )
    throw new AIInterpretationError('Claude response is not valid JSON', textContent)
  }

  // Validate schema
  try {
    return validateOutput(parsed)
  } catch (err) {
    if (err instanceof AIInterpretationError) {
      console.error('[AI interpreter] Schema validation failed:', err.message)
    }
    throw err
  }
}
