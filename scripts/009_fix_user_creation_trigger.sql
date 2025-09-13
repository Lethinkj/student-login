-- Fix the user creation trigger to work properly without requiring a session
-- This ensures user profiles are created even when email confirmation is disabled

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function that handles user creation properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into users table with proper error handling
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    role, 
    student_id, 
    department, 
    year,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'student_id',
    NEW.raw_user_meta_data ->> 'department',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'year' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'year')::INTEGER 
      ELSE 1 
    END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    student_id = EXCLUDED.student_id,
    department = EXCLUDED.department,
    year = EXCLUDED.year,
    updated_at = NOW();

  -- Create initial leaderboard entry for students only
  IF COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'student' THEN
    INSERT INTO public.leaderboard (
      user_id, 
      points, 
      rank, 
      achievements,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id, 
      0, 
      0, 
      ARRAY[]::TEXT[],
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      updated_at = NOW();
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Disable email confirmation for immediate login
UPDATE auth.config 
SET email_confirm_required = false 
WHERE true;

-- Also disable email change confirmation
UPDATE auth.config 
SET email_change_confirm_required = false 
WHERE true;
