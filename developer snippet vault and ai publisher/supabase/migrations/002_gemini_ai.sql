-- ==============================================================================
-- Developer Snippet Vault & AI Publisher
-- Migration: 002_gemini_ai.sql
-- Description: Add tags and summary columns for Gemini AI integration
-- ==============================================================================

-- 1. ALTER SNIPPETS TABLE
-- ------------------------------------------------------------------------------
ALTER TABLE public.snippets
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS summary TEXT;

-- 2. INDEX ON TAGS
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_snippets_tags ON public.snippets USING GIN (tags);
