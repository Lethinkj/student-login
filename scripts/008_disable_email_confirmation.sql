-- Disable email confirmation for new users
-- This should be run to ensure users can login immediately after registration

-- Update auth settings to disable email confirmation
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_email_confirmations = false
WHERE id = 1;

-- If the above doesn't work, we need to ensure users are automatically confirmed
-- Update any existing unconfirmed users to be confirmed
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
