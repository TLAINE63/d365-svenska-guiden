-- Drop the existing view
DROP VIEW IF EXISTS public.partners_public;

-- Recreate the view with SECURITY INVOKER (this is the default and more secure)
CREATE VIEW public.partners_public
WITH (security_invoker = true)
AS SELECT 
  id,
  name,
  slug,
  description,
  logo_url,
  logo_dark_bg,
  website,
  applications,
  industries,
  secondary_industries,
  geography,
  customer_examples,
  is_featured,
  product_filters,
  created_at,
  updated_at
FROM public.partners;

-- Grant SELECT permission to anon and authenticated roles
GRANT SELECT ON public.partners_public TO anon, authenticated;