-- Insert sample leaderboard data for demonstration
-- This would normally be populated through user activities

-- First, let's create some sample users (these would be created through registration)
-- Note: These are just for demonstration - real users would register through the UI

-- Update existing users with some sample leaderboard data
-- This assumes some users have already registered

-- Sample leaderboard entries with achievements
INSERT INTO public.leaderboard (user_id, points, rank, achievements) 
SELECT 
  id,
  CASE 
    WHEN role = 'student' THEN 
      FLOOR(RANDOM() * 1000 + 100)::INTEGER
    ELSE 0
  END as points,
  0 as rank, -- Will be updated by trigger
  CASE 
    WHEN role = 'student' THEN 
      ARRAY[
        CASE WHEN RANDOM() > 0.5 THEN 'Perfect Attendance' END,
        CASE WHEN RANDOM() > 0.6 THEN 'Academic Excellence' END,
        CASE WHEN RANDOM() > 0.7 THEN 'Community Helper' END,
        CASE WHEN RANDOM() > 0.8 THEN 'Early Bird' END
      ]::TEXT[]
    ELSE ARRAY[]::TEXT[]
  END as achievements
FROM public.users 
WHERE role = 'student'
ON CONFLICT (user_id) DO UPDATE SET
  points = EXCLUDED.points,
  achievements = EXCLUDED.achievements;

-- Trigger the ranking update
UPDATE public.leaderboard SET points = points WHERE points > 0;
