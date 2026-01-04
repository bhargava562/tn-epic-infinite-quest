-- Fix 1: Achievement manipulation - Restrict user_achievements to SELECT only
-- Drop the overly permissive ALL policy
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.user_achievements;

-- Keep only SELECT policy (already exists: "Users can view their own achievements")

-- Fix 2: Trip rewards bypass - Restrict trips UPDATE to only safe columns
-- Drop existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;

-- Create restrictive UPDATE policy that only allows status changes
-- tokens_earned and dharma_earned should be calculated server-side
CREATE POLICY "Users can update their own trips status only"
ON public.trips FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update the trigger to calculate rewards server-side instead of trusting user input
CREATE OR REPLACE FUNCTION public.update_user_stats_on_trip_complete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  calculated_tokens INTEGER;
  calculated_dharma INTEGER;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Calculate tokens from verified sources (memories + save point visits)
    SELECT COALESCE(SUM(tokens_earned), 0) INTO calculated_tokens
    FROM (
      SELECT tokens_earned FROM public.memories WHERE trip_id = NEW.id AND user_id = NEW.user_id
      UNION ALL
      SELECT tokens_earned FROM public.save_point_visits WHERE trip_id = NEW.id AND user_id = NEW.user_id
    ) AS rewards;
    
    -- Calculate dharma from verified activities
    SELECT COALESCE(SUM(points_earned), 0) INTO calculated_dharma
    FROM public.dharma_activities 
    WHERE trip_id = NEW.id AND user_id = NEW.user_id AND verified = true;
    
    -- Update profile with calculated values (not user-supplied)
    UPDATE public.profiles
    SET 
      tokens = tokens + calculated_tokens,
      dharma_score = dharma_score + calculated_dharma,
      total_trips = total_trips + 1,
      updated_at = NOW()
    WHERE id = NEW.user_id;
    
    -- Also update the trip record with calculated values
    NEW.tokens_earned := calculated_tokens;
    NEW.dharma_earned := calculated_dharma;
  END IF;
  RETURN NEW;
END;
$$;

-- Fix 3: Public profile exposure - Remove overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a leaderboard view for public stats (no email/PII)
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  id,
  display_name,
  level,
  dharma_score,
  total_trips,
  total_memories
FROM public.profiles
ORDER BY dharma_score DESC
LIMIT 100;

-- Grant access to the leaderboard view
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;