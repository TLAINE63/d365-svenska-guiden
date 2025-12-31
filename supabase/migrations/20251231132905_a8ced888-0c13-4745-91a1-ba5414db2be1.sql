-- 1. PARTNERS TABLE: Protect sensitive contact info
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Partners are publicly viewable" ON public.partners;

-- Create service_role only SELECT policy for full access (including sensitive data)
CREATE POLICY "Service role can read all partner data"
ON public.partners
FOR SELECT
TO service_role
USING (true);

-- Create a secure view for public access with only non-sensitive columns
CREATE OR REPLACE VIEW public.partners_public AS
SELECT 
  id,
  slug,
  name,
  description,
  logo_url,
  website,
  applications,
  industries,
  is_featured,
  created_at,
  updated_at
FROM public.partners;

-- Grant public access to the view
GRANT SELECT ON public.partners_public TO anon, authenticated;

-- 2. LEADS TABLE: Already has service_role policy, add explicit anon/authenticated denial
-- (The existing policy is already RESTRICTIVE and TO service_role, which implicitly denies others)

-- 3. PARTNER_CHANGE_REQUESTS: Already has service_role policy
-- (The existing policy is already RESTRICTIVE and TO service_role, which implicitly denies others)

-- 4. PARTNER_CLICKS: Add service_role only SELECT policy
CREATE POLICY "Service role can read partner clicks"
ON public.partner_clicks
FOR SELECT
TO service_role
USING (true);