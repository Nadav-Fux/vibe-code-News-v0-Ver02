-- Update specific user to admin role
UPDATE profiles 
SET role = 'admin'
WHERE email = 'nadavf@gmail.com';

-- If profile doesn't exist yet, this will create it when you sign up
-- The trigger will automatically create a profile with role='viewer'
-- Then this script will update it to 'admin'
