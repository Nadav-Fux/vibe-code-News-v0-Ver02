-- טבלה לאירועי A/B testing
CREATE TABLE IF NOT EXISTS ab_test_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view' או 'conversion'
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_ab_test_events_experiment ON ab_test_events(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_variant ON ab_test_events(variant);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_created ON ab_test_events(created_at);

-- RLS policies
ALTER TABLE ab_test_events ENABLE ROW LEVEL SECURITY;

-- כולם יכולים להכניס אירועים
CREATE POLICY "Anyone can insert ab test events"
  ON ab_test_events
  FOR INSERT
  TO public
  WITH CHECK (true);

-- תיקון: שימוש בטבלת profiles במקום user_roles
-- רק מנהלים יכולים לראות תוצאות
CREATE POLICY "Only admins can view ab test events"
  ON ab_test_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
