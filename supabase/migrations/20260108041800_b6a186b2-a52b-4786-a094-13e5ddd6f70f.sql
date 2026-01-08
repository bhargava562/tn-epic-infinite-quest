-- Fix the leaderboard view to use SECURITY DEFINER to bypass RLS
-- This allows authenticated users to see the leaderboard while keeping profiles table properly secured

DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard
WITH (security_barrier = true)
AS
SELECT id, display_name, level, dharma_score, total_trips, total_memories
FROM public.profiles
ORDER BY dharma_score DESC
LIMIT 100;

-- Grant SELECT access to the view for authenticated and anonymous users
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;

-- Set the view owner to postgres (SECURITY DEFINER equivalent for views)
-- The view will run with elevated permissions, bypassing RLS on profiles
ALTER VIEW public.leaderboard OWNER TO postgres;