-- יצירת טבלה למסמכים משפטיים
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'privacy_law', 'security_regulations', 'accessibility_law'
  version TEXT NOT NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- יצירת טבלת audit log לכל פעולות פרטיות
CREATE TABLE IF NOT EXISTS privacy_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'view', 'edit', 'delete', 'export', 'consent_given', 'consent_revoked'
  resource_type TEXT NOT NULL, -- 'profile', 'article', 'comment', 'analytics'
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- יצירת טבלת הסכמות משתמשים
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'marketing', 'analytics', 'data_processing'
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, consent_type)
);

-- יצירת טבלת בקשות למחיקת מידע (זכות למחיקה)
CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'completed', 'rejected'
  reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT
);

-- יצירת טבלת בקשות לעיון במידע (זכות עיון)
CREATE TABLE IF NOT EXISTS data_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'completed', 'rejected'
  data_provided JSONB,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_privacy_audit_log_user_id ON privacy_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_audit_log_created_at ON privacy_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_privacy_audit_log_action_type ON privacy_audit_log(action_type);
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_status ON data_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_status ON data_access_requests(status);

-- הכנסת המסמכים המשפטיים
INSERT INTO legal_documents (title, content, document_type, version, effective_date) VALUES
(
  'תקנות הגנת הפרטיות (אבטחת מידע) - מדריך מלא',
  'תקנות הגנת הפרטיות (אבטחת מידע) נכנסו לתוקף ב-8 במאי 2018. התקנות חלות על כל המשק הישראלי והן מבקשות להגן על האנשים שמידע אודותיהם קיים במאגר המידע...',
  'security_regulations',
  '2018',
  '2018-05-08'
),
(
  'תיקון 13 לחוק הגנת הפרטיות',
  'תיקון 13 לחוק הגנת הפרטיות התשמ"א-1981 כולל זכויות נושא המידע: זכות עיון, תיקון, מחיקה, התנגדות לעיבוד, והודעה על העברת מידע לחו"ל...',
  'privacy_law',
  '13',
  '2011-01-01'
);

-- RLS policies
ALTER TABLE privacy_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

-- משתמשים יכולים לראות רק את הלוגים שלהם
CREATE POLICY "Users can view own audit logs"
  ON privacy_audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- אדמינים יכולים לראות הכל
CREATE POLICY "Admins can view all audit logs"
  ON privacy_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- משתמשים יכולים לנהל את ההסכמות שלהם
CREATE POLICY "Users can manage own consents"
  ON user_consents FOR ALL
  USING (auth.uid() = user_id);

-- משתמשים יכולים לשלוח בקשות למחיקה
CREATE POLICY "Users can create deletion requests"
  ON data_deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own deletion requests"
  ON data_deletion_requests FOR SELECT
  USING (auth.uid() = user_id);

-- משתמשים יכולים לשלוח בקשות לעיון
CREATE POLICY "Users can create access requests"
  ON data_access_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own access requests"
  ON data_access_requests FOR SELECT
  USING (auth.uid() = user_id);

-- כולם יכולים לקרוא מסמכים משפטיים
CREATE POLICY "Anyone can view legal documents"
  ON legal_documents FOR SELECT
  TO public
  USING (true);

COMMENT ON TABLE privacy_audit_log IS 'לוג מלא של כל פעולות הפרטיות - נדרש לפי תיקון 13';
COMMENT ON TABLE user_consents IS 'ניהול הסכמות משתמשים לעיבוד מידע';
COMMENT ON TABLE data_deletion_requests IS 'בקשות למחיקת מידע - זכות למחיקה לפי תיקון 13';
COMMENT ON TABLE data_access_requests IS 'בקשות לעיון במידע - זכות עיון לפי תיקון 13';
