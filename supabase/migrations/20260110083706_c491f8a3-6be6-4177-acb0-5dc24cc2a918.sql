-- Fix the view to use SECURITY INVOKER
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  slug,
  name,
  description,
  logo_url,
  website,
  applications,
  industries,
  secondary_industries,
  geography,
  product_filters,
  is_featured,
  created_at,
  updated_at
FROM public.partners;