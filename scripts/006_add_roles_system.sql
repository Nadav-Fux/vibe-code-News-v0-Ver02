-- Add roles system to the platform

-- Create role enum (only if it doesn't exist)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('viewer', 'editor', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles (only if it doesn't exist)
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'viewer';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Update existing users to editor role (only those without a role)
UPDATE profiles SET role = 'editor' WHERE role IS NULL;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can edit
CREATE OR REPLACE FUNCTION can_edit(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role IN ('editor', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for articles to respect roles
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
CREATE POLICY "Users can update own articles"
  ON articles FOR UPDATE
  USING (
    auth.uid() = author_id 
    OR can_edit(auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
CREATE POLICY "Users can delete own articles"
  ON articles FOR DELETE
  USING (
    auth.uid() = author_id 
    OR is_admin(auth.uid())
  );

-- Add index for role lookups (only if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

COMMENT ON COLUMN profiles.role IS 'User role: viewer (read only), editor (can create/edit content), admin (full access)';
