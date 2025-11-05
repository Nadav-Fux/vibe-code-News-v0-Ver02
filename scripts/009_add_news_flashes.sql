-- Create news_flashes table for quick updates/news
CREATE TABLE IF NOT EXISTS news_flashes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE news_flashes ENABLE ROW LEVEL SECURITY;

-- Everyone can read news flashes
CREATE POLICY "Anyone can view news flashes"
  ON news_flashes
  FOR SELECT
  USING (true);

-- Only admins and editors can create news flashes
CREATE POLICY "Admins and editors can create news flashes"
  ON news_flashes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Only admins and editors can update their own news flashes
CREATE POLICY "Admins and editors can update their news flashes"
  ON news_flashes
  FOR UPDATE
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can delete news flashes
CREATE POLICY "Admins can delete news flashes"
  ON news_flashes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add indexes
CREATE INDEX idx_news_flashes_created_at ON news_flashes(created_at DESC);
CREATE INDEX idx_news_flashes_author ON news_flashes(author_id);
CREATE INDEX idx_news_flashes_pinned ON news_flashes(is_pinned) WHERE is_pinned = true;

-- Insert mock data
INSERT INTO news_flashes (content, image_url, is_pinned) VALUES
  ('ברוכים הבאים לפלטפורמת Vibe Code GLM! 🎉 כאן תמצאו מדריכים, טיפים וחדשות מעולם הקוד והטכנולוגיה.', NULL, true),
  ('טיפ היום: השתמשו ב-async/await במקום .then() לקוד נקי ויותר קריא! 💡', NULL, false),
  ('מדריך חדש: איך לבנות API עם Next.js 14 - עכשיו באתר! 🚀', NULL, false),
  ('האם ידעתם? TypeScript יכול לחסוך לכם שעות של דיבאגינג! 🐛', NULL, false),
  ('עדכון: הוספנו תמיכה ב-GLM 4.6 ו-Gemini 2.5 לכל המשתמשים! ⚡', NULL, false);
