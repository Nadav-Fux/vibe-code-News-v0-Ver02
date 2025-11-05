-- מערכת מלאה לעמידה בתיקון 13 לחוק הגנת הפרטיות

-- טבלת הגדרות פרטיות למשתמש
CREATE TABLE IF NOT EXISTS privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marketing_emails BOOLEAN DEFAULT false,
  analytics_cookies BOOLEAN DEFAULT false,
  functional_cookies BOOLEAN DEFAULT true,
  advertising_cookies BOOLEAN DEFAULT false,
  data_sharing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- טבלת Cookie Consents
CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  necessary BOOLEAN DEFAULT true,
  functional BOOLEAN DEFAULT false,
  analytics BOOLEAN DEFAULT false,
  advertising BOOLEAN DEFAULT false,
  consent_date TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 year'
);

-- טבלת בקשות זכויות (משופרת)
CREATE TABLE IF NOT EXISTS user_rights_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'correction', 'deletion', 'export', 'objection')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  description TEXT,
  response TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES auth.users(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- טבלת ייצוא מידע
CREATE TABLE IF NOT EXISTS data_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('json', 'csv', 'pdf')),
  file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- טבלת התראות פרטיות
CREATE TABLE IF NOT EXISTS privacy_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('policy_update', 'data_breach', 'consent_expiry', 'rights_request')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user ON privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_session ON cookie_consents(session_id);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_user ON cookie_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_rights_requests_user ON user_rights_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_rights_requests_status ON user_rights_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_exports_user ON data_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_notifications_user ON privacy_notifications(user_id);

-- RLS Policies
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rights_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_notifications ENABLE ROW LEVEL SECURITY;

-- משתמשים יכולים לראות ולערוך רק את ההגדרות שלהם
CREATE POLICY "Users can view own privacy settings" ON privacy_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own privacy settings" ON privacy_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own privacy settings" ON privacy_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- משתמשים יכולים לראות את ההסכמות שלהם
CREATE POLICY "Users can view own cookie consents" ON cookie_consents
  FOR SELECT USING (auth.uid() = user_id);

-- משתמשים יכולים ליצור בקשות זכויות
CREATE POLICY "Users can view own rights requests" ON user_rights_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create rights requests" ON user_rights_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- משתמשים יכולים לראות את הייצואים שלהם
CREATE POLICY "Users can view own data exports" ON data_exports
  FOR SELECT USING (auth.uid() = user_id);

-- משתמשים יכולים לראות את ההתראות שלהם
CREATE POLICY "Users can view own notifications" ON privacy_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON privacy_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- פונקציה לעדכון updated_at אוטומטי
CREATE OR REPLACE FUNCTION update_privacy_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER privacy_settings_updated_at
  BEFORE UPDATE ON privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_privacy_settings_updated_at();
