-- Fix: Recreate leaderboard view with SECURITY INVOKER to respect RLS policies
-- This ensures the view uses the querying user's permissions, not the view creator's

DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard
WITH (security_invoker = true)
AS
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

-- Re-grant access to the view
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;