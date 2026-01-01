-- Fix security issues: Remove public access to partner_clicks table
-- All operations should go through the track-partner-click Edge Function which has proper validation and rate limiting

-- 1. Drop the anonymous INSERT policy (allows direct database inserts bypassing Edge Function validation)
DROP POLICY IF EXISTS "Allow anonymous inserts for tracking" ON public.partner_clicks;

-- 2. Drop any authenticated users read policy if it exists
DROP POLICY IF EXISTS "Allow authenticated users to read clicks" ON public.partner_clicks;

-- 3. Create service_role only INSERT policy (Edge Function uses service_role)
CREATE POLICY "Service role can insert partner clicks"
ON public.partner_clicks
FOR INSERT
TO service_role
WITH CHECK (true);