/**
 * AI Interpreter
 *
 * Sends the structured evidence package to Claude and returns a validated
 * AIInterpretation. This is the only file in the codebase that calls the
 * Anthropic API.
 *
 * Design principles:
 * - API key read from environment only — never hardcoded
 * - 15-second timeout; on any failure, throws AIInterpretationError
 * - Strict output validation before returning — malformed responses are rejected
 * - Low temperature (0.3) for analytical consistency
 * - Caller is responsible for catching errors and setting ai_status = 'failed'
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AIInterpretationInput, AIInterpretation } from '../types'
import { AI_SYSTEM_PROMPT, AI_OUTPUT_SCHEMA, AI_FIELD_RULES } from '../config/ai-prompts'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODEL         = 'claude-sonnet-4-5'
const MAX_TOKENS    = 1200
const TEMPERATURE   = 0.3
const TIMEOUT_MS    = 15_000

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

function buildUserPrompt(input: AIInterpretationInput): string {
  return `Interpret the following diagnostic profile and return a JSON object matching this exact schema:

${AI_OUTPUT_SCHEMA}

${AI_FIELD_RULES}

Diagnostic profile:
${JSON.stringify(input, null, 2)}`
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
 * Throws AIInterpretationError on any failure (missing API key, timeout,
 * network error, schema validation failure). The caller in complete/route.ts
 * catches this and sets ai_status = 'failed'.
 */
export async function interpretDiagnostic(
  input: AIInterpretationInput,
): Promise<AIInterpretation> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new AIInterpretationError('ANTHROPIC_API_KEY is not configured')
  }

  const client = new Anthropic({ apiKey, timeout: TIMEOUT_MS })

  let textContent: string
  try {
    const response = await client.messages.create({
      model:       MODEL,
      max_tokens:  MAX_TOKENS,
      temperature: TEMPERATURE,
      system:      AI_SYSTEM_PROMPT,
      messages:    [{ role: 'user', content: buildUserPrompt(input) }],
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new AIInterpretationError('Claude response contains no text block')
    }
    textContent = textBlock.text.trim()
  } catch (err) {
    if (err instanceof AIInterpretationError) throw err
    throw new AIInterpretationError('Claude API call failed', err)
  }

  let parsed: unknown
  try {
    // Strip accidental markdown fences if Claude includes them
    const clean = textContent
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim()
    parsed = JSON.parse(clean)
  } catch {
    throw new AIInterpretationError('Claude response is not valid JSON', textContent)
  }

  return validateOutput(parsed)
}
