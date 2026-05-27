-- Migration: Add AI interpretation columns to diagnostic_sessions
-- Run this in the Supabase SQL editor before deploying the AI layer.
--
-- ai_status values:
--   NULL        → session pre-dates AI layer (no AI attempted)
--   'pending'   → AI call queued; results page shows loading state
--   'complete'  → ai_interpretation populated; ready to render
--   'failed'    → AI call failed; results page silently omits AI section

ALTER TABLE public.diagnostic_sessions
  ADD COLUMN IF NOT EXISTS ai_interpretation JSONB        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_status         TEXT         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_generated_at   TIMESTAMPTZ  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_model_version  TEXT         DEFAULT NULL;

-- Index for polling queries (results page polls by session ID + status)
CREATE INDEX IF NOT EXISTS idx_sessions_ai_status
  ON public.diagnostic_sessions (ai_status, completed_at DESC)
  WHERE ai_status IS NOT NULL;

-- Comment columns for documentation
COMMENT ON COLUMN public.diagnostic_sessions.ai_interpretation IS
  'Structured AI interpretation (AIInterpretation JSON). NULL until ai_status = complete.';
COMMENT ON COLUMN public.diagnostic_sessions.ai_status IS
  'AI generation lifecycle: NULL | pending | complete | failed';
COMMENT ON COLUMN public.diagnostic_sessions.ai_generated_at IS
  'Timestamp when AI interpretation was successfully written.';
COMMENT ON COLUMN public.diagnostic_sessions.ai_model_version IS
  'Claude model identifier used for this interpretation, e.g. claude-sonnet-4-5';
