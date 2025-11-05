-- תיקון RLS policies לטבלת cookie_consents
-- מאפשר למשתמשים (גם אנונימיים) להכניס הסכמות cookies

DROP POLICY IF EXISTS "Anyone can insert cookie consents" ON cookie_consents;
CREATE POLICY "Anyone can insert cookie consents"
ON cookie_consents
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own cookie consents" ON cookie_consents;
CREATE POLICY "Users can update own cookie consents"
ON cookie_consents
FOR UPDATE
TO public
USING (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

-- תיקון RLS policies לטבלת privacy_audit_log
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON privacy_audit_log;
CREATE POLICY "Anyone can insert audit logs"
ON privacy_audit_log
FOR INSERT
TO public
WITH CHECK (true);

-- הוספת מדיניות לטבלת user_rights_requests
DROP POLICY IF EXISTS "Admins can view all requests" ON user_rights_requests;
CREATE POLICY "Admins can view all requests"
ON user_rights_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'editor')
  )
);

DROP POLICY IF EXISTS "Admins can update requests" ON user_rights_requests;
CREATE POLICY "Admins can update requests"
ON user_rights_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'editor')
  )
);

-- הוספת טבלה להתראות אוטומטיות
CREATE TABLE IF NOT EXISTS privacy_request_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES user_rights_requests(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_request', 'request_updated', 'request_completed', 'reminder')),
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- אינדקס לביצועים
CREATE INDEX IF NOT EXISTS idx_privacy_notifications_status ON privacy_request_notifications(status);
CREATE INDEX IF NOT EXISTS idx_privacy_notifications_request ON privacy_request_notifications(request_id);

-- RLS לטבלת התראות
ALTER TABLE privacy_request_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all notifications"
ON privacy_request_notifications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'editor')
  )
);

-- טבלה לניהול התנגדויות לשימושים
CREATE TABLE IF NOT EXISTS user_objections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  objection_type TEXT NOT NULL CHECK (objection_type IN ('marketing', 'analytics', 'profiling', 'automated_decisions', 'data_sharing')),
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- אינדקס לביצועים
CREATE INDEX IF NOT EXISTS idx_user_objections_user ON user_objections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_objections_email ON user_objections(email);
CREATE INDEX IF NOT EXISTS idx_user_objections_status ON user_objections(status);

-- RLS לטבלת התנגדויות
ALTER TABLE user_objections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own objections"
ON user_objections
FOR SELECT
TO public
USING (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND email = current_setting('request.jwt.claims', true)::json->>'email')
);

CREATE POLICY "Users can insert own objections"
ON user_objections
FOR INSERT
TO public
WITH CHECK (
  (user_id = auth.uid()) OR 
  (user_id IS NULL)
);

CREATE POLICY "Users can update own objections"
ON user_objections
FOR UPDATE
TO public
USING (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND email = current_setting('request.jwt.claims', true)::json->>'email')
);

-- פונקציה לעדכון updated_at אוטומטי
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- טריגר לעדכון updated_at
DROP TRIGGER IF EXISTS update_user_objections_updated_at ON user_objections;
CREATE TRIGGER update_user_objections_updated_at
BEFORE UPDATE ON user_objections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- הוספת שדות חסרים לטבלת profiles (אם לא קיימים)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketing_consent') THEN
    ALTER TABLE profiles ADD COLUMN marketing_consent BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'data_processing_consent') THEN
    ALTER TABLE profiles ADD COLUMN data_processing_consent BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_privacy_update') THEN
    ALTER TABLE profiles ADD COLUMN last_privacy_update TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;
