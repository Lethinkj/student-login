-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, student_id, department, year)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'student_id',
    NEW.raw_user_meta_data ->> 'department',
    COALESCE((NEW.raw_user_meta_data ->> 'year')::INTEGER, 1)
  );

  -- Create initial leaderboard entry for students
  IF COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'student' THEN
    INSERT INTO public.leaderboard (user_id, points, rank)
    VALUES (NEW.id, 0, 0);
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update leaderboard rankings
CREATE OR REPLACE FUNCTION public.update_leaderboard_rankings()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update rankings based on points
  WITH ranked_users AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY points DESC) as new_rank
    FROM public.leaderboard
  )
  UPDATE public.leaderboard 
  SET rank = ranked_users.new_rank
  FROM ranked_users
  WHERE public.leaderboard.user_id = ranked_users.user_id;
  
  RETURN NULL;
END;
$$;

-- Trigger to update rankings when points change
DROP TRIGGER IF EXISTS update_rankings_trigger ON public.leaderboard;
CREATE TRIGGER update_rankings_trigger
  AFTER UPDATE OF points ON public.leaderboard
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.update_leaderboard_rankings();
