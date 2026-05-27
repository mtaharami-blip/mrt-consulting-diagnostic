-- =============================================================================
-- MRT Consulting — Business Diagnostic Tool
-- Supabase Schema
--
-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cfazrjnmdpakposmcqwt/sql/new
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table: diagnostic_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diagnostic_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,

  -- Context intake (stored as string IDs)
  sector          TEXT,
  scale           TEXT,
  situation       TEXT,
  role            TEXT,

  -- Assessment
  focus_areas     TEXT[]  NOT NULL DEFAULT '{}',
  answers         JSONB   NOT NULL DEFAULT '{}',   -- { "S1": "S1_A", "O3": "O3_C", … }

  -- Computed results (stored so results page never recomputes)
  scores          JSONB,                           -- CategoryScore[]
  archetype_id    TEXT,
  flags_triggered TEXT[]  NOT NULL DEFAULT '{}',
  output          JSONB,                           -- Full DiagnosticOutput snapshot

  -- Lead capture (NULL until user explicitly opts in)
  opted_in        BOOLEAN NOT NULL DEFAULT false,
  contact_email   TEXT,
  contact_name    TEXT,
  contact_company TEXT,

  -- Consultant workflow
  brief_sent      BOOLEAN NOT NULL DEFAULT false,
  brief_sent_at   TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Fast lookup by session ID (primary key covers this)

-- Consultant dashboard: opted-in sessions newest first
CREATE INDEX IF NOT EXISTS idx_sessions_opted_in
  ON public.diagnostic_sessions (opted_in, completed_at DESC)
  WHERE opted_in = true;

-- Analytics: archetype distribution over time
CREATE INDEX IF NOT EXISTS idx_sessions_archetype
  ON public.diagnostic_sessions (archetype_id, completed_at DESC);

-- General time-series queries
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at
  ON public.diagnostic_sessions (completed_at DESC);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The anon key is used server-side only (Next.js API routes).
-- UUIDs are 128-bit random — effectively unguessable bearer tokens.
-- No list/scan endpoint exists in the application.
-- ---------------------------------------------------------------------------

ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;

-- Allow API routes to insert new sessions
CREATE POLICY "api_insert"
  ON public.diagnostic_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow retrieval by session ID (results page, shared links)
CREATE POLICY "api_select"
  ON public.diagnostic_sessions
  FOR SELECT TO anon
  USING (true);

-- Allow opt-in update (adds contact info to existing session)
CREATE POLICY "api_update_optin"
  ON public.diagnostic_sessions
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
