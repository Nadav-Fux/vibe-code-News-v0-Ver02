-- Create tables for AI Scraper system

-- Renamed table and added comprehensive Twitter/Nitter support
CREATE TABLE IF NOT EXISTS scraper_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rss', 'html', 'twitter', 'nitter')),
  category TEXT NOT NULL CHECK (category IN ('tech_news', 'ai_news', 'company', 'influencer')),
  is_active BOOLEAN DEFAULT true,
  scrape_frequency_minutes INTEGER DEFAULT 60,
  last_scraped_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scraped_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES scraper_sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  raw_html TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pending_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scraped_content_id UUID REFERENCES scraped_content(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('news_flash', 'article')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  confidence_score DECIMAL(3,2),
  ai_model_used TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Added comprehensive sources including Twitter accounts via Nitter
INSERT INTO scraper_sources (name, url, type, category, scrape_frequency_minutes) VALUES
-- Tech News Sites
('TechCrunch', 'https://techcrunch.com/feed/', 'rss', 'tech_news', 30),
('The Verge', 'https://www.theverge.com/rss/index.xml', 'rss', 'tech_news', 30),
('Ars Technica', 'https://feeds.arstechnica.com/arstechnica/index', 'rss', 'tech_news', 30),
('Wired', 'https://www.wired.com/feed/rss', 'rss', 'tech_news', 60),
('VentureBeat', 'https://venturebeat.com/feed/', 'rss', 'tech_news', 60),
('MIT Technology Review', 'https://www.technologyreview.com/feed/', 'rss', 'tech_news', 120),
('XDA Developers', 'https://www.xda-developers.com/feed/', 'rss', 'tech_news', 60),

-- AI Specific News
('AI News - VentureBeat', 'https://venturebeat.com/category/ai/feed/', 'rss', 'ai_news', 30),
('OpenAI Blog', 'https://openai.com/blog/rss/', 'rss', 'ai_news', 60),
('Google AI Blog', 'https://blog.google/technology/ai/rss/', 'rss', 'ai_news', 60),

-- Twitter Accounts via Nitter (OpenAI)
('OpenAI Twitter', 'https://nitter.net/OpenAI/rss', 'nitter', 'company', 15),
('Sam Altman Twitter', 'https://nitter.net/sama/rss', 'nitter', 'influencer', 15),

-- Twitter Accounts via Nitter (Anthropic)
('Anthropic Twitter', 'https://nitter.net/AnthropicAI/rss', 'nitter', 'company', 15),

-- Twitter Accounts via Nitter (Google)
('Google AI Twitter', 'https://nitter.net/GoogleAI/rss', 'nitter', 'company', 15),
('Google DeepMind Twitter', 'https://nitter.net/GoogleDeepMind/rss', 'nitter', 'company', 15),

-- Twitter Accounts via Nitter (Microsoft)
('Microsoft AI Twitter', 'https://nitter.net/MSFTResearch/rss', 'nitter', 'company', 15),

-- Twitter Accounts via Nitter (Meta)
('Meta AI Twitter', 'https://nitter.net/MetaAI/rss', 'nitter', 'company', 15),

-- Twitter Accounts via Nitter (Influencers)
('Andrej Karpathy Twitter', 'https://nitter.net/karpathy/rss', 'nitter', 'influencer', 15),
('Yann LeCun Twitter', 'https://nitter.net/ylecun/rss', 'nitter', 'influencer', 15),
('Andrew Ng Twitter', 'https://nitter.net/AndrewYNg/rss', 'nitter', 'influencer', 15),

-- Twitter Accounts via Nitter (Vercel/Next.js)
('Vercel Twitter', 'https://nitter.net/vercel/rss', 'nitter', 'company', 30),
('Next.js Twitter', 'https://nitter.net/nextjs/rss', 'nitter', 'company', 30),
('Guillermo Rauch Twitter', 'https://nitter.net/rauchg/rss', 'nitter', 'influencer', 30)

ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scraper_sources_active ON scraper_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_scraper_sources_type ON scraper_sources(type);
CREATE INDEX IF NOT EXISTS idx_scraped_content_source ON scraped_content(source_id);
CREATE INDEX IF NOT EXISTS idx_pending_content_status ON pending_content(status);
CREATE INDEX IF NOT EXISTS idx_pending_content_created ON pending_content(created_at DESC);

-- Enable RLS
ALTER TABLE scraper_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage sources" ON scraper_sources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view scraped content" ON scraped_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage pending content" ON pending_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
