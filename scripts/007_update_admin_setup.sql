-- Update the default admin setup
-- This script ensures the admin account is properly configured

-- First, let's create a function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, department, student_id, year)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'student_id',
    CASE 
      WHEN NEW.raw_user_meta_data->>'year' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'year')::INTEGER 
      ELSE NULL 
    END
  );
  
  -- If the user is a student, create a leaderboard entry
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.leaderboard (user_id, points, achievements)
    VALUES (NEW.id, 0, ARRAY[]::TEXT[]);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Remove the placeholder admin entry since it will be created through registration
DELETE FROM public.users WHERE email = 'admin@system.local';
