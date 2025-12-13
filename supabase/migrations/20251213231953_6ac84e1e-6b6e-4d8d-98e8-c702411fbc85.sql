-- Drop the overly permissive SELECT policy that exposes analytics data to all authenticated users
DROP POLICY "Allow authenticated users to read clicks" ON public.partner_clicks;

-- No replacement policy needed - this is analytics data that:
-- 1. Is written via edge function (using service role key which bypasses RLS)
-- 2. Is sent via email to admin
-- 3. Should not be readable by any client-side user