-- Create default admin account
-- This script creates a default admin user for initial system access
-- Email: admin@system.local
-- Password: AdminPass123!

-- Note: This will be handled through Supabase Auth, but we'll create the profile entry
-- The actual user creation needs to be done through the registration form or Supabase dashboard

-- Insert default admin profile (will be linked when admin signs up)
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  department,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Placeholder UUID, will be replaced when real admin signs up
  'admin@system.local',
  'System Administrator',
  'admin',
  'Administration',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create some sample data for testing
INSERT INTO public.announcements (
  title,
  content,
  priority,
  target_role,
  created_by,
  expires_at,
  created_at
) VALUES (
  'Welcome to Student Portal',
  'Welcome to the new student management system. Please explore all the features available.',
  'high',
  'all',
  '00000000-0000-0000-0000-000000000001',
  NOW() + INTERVAL '30 days',
  NOW()
) ON CONFLICT DO NOTHING;
