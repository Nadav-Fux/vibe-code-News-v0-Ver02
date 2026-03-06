-- ============================================================
-- Trae Studio: Content Generation & Feed Cache Tables
-- Migration: 020_studio_tables
-- ============================================================

-- studio_generations: stores all AI-generated content
CREATE TABLE IF NOT EXISTS studio_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin','twitter','facebook','tiktok','blog','newsletter')),
  llm_used TEXT NOT NULL,
  tone TEXT DEFAULT 'professional',
  depth TEXT DEFAULT 'medium',
  style TEXT DEFAULT 'standard',
  source_refs JSONB DEFAULT '[]'::jsonb,
  word_count INTEGER DEFAULT 0,
  char_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- studio_feed_cache: cached content from external sources (RSS, SERP, Twitter, Apify)
CREATE TABLE IF NOT EXISTS studio_feed_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('rss','serp','twitter','apify')),
  source_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_studio_gen_platform ON studio_generations(platform);
CREATE INDEX IF NOT EXISTS idx_studio_gen_created ON studio_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_gen_user ON studio_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_studio_feed_type ON studio_feed_cache(source_type);
CREATE INDEX IF NOT EXISTS idx_studio_feed_fetched ON studio_feed_cache(fetched_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE studio_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_feed_cache ENABLE ROW LEVEL SECURITY;

-- Service role: full access to both tables
CREATE POLICY "Service role full access on generations"
  ON studio_generations FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on feed_cache"
  ON studio_feed_cache FOR ALL
  USING (true)
  WITH CHECK (true);

-- Authenticated users: can read all generations
CREATE POLICY "Auth users can read generations"
  ON studio_generations FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users: can insert their own generations
CREATE POLICY "Auth users can insert own generations"
  ON studio_generations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users: can read feed cache
CREATE POLICY "Auth users can read feed cache"
  ON studio_feed_cache FOR SELECT
  TO authenticated
  USING (true);
