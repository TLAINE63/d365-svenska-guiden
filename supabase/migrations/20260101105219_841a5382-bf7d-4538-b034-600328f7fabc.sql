-- Drop existing view and recreate with SECURITY INVOKER (default, safe)
DROP VIEW IF EXISTS public.partners_public;

-- Recreate the view without SECURITY DEFINER
-- By default, views use SECURITY INVOKER which respects the querying user's permissions
CREATE VIEW public.partners_public 
WITH (security_invoker = true)
AS SELECT 
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

-- Grant access to the view for public access
GRANT SELECT ON public.partners_public TO anon;
GRANT SELECT ON public.partners_public TO authenticated;