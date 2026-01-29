-- Fix the partners_public view by removing security_invoker
-- This allows the view to bypass RLS on the underlying table while still only exposing safe columns
DROP VIEW IF EXISTS public.partners_public;

CREATE VIEW public.partners_public AS 
SELECT 
  id,
  slug,
  name,
  description,
  logo_url,
  logo_dark_bg,
  website,
  contact_person,
  email,
  phone,
  applications,
  industries,
  secondary_industries,
  geography,
  customer_examples,
  product_filters,
  is_featured,
  created_at,
  updated_at
FROM public.partners;

-- Grant SELECT access on the view to anon and authenticated roles
GRANT SELECT ON public.partners_public TO anon, authenticated;