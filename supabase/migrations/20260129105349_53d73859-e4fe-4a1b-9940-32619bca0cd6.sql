-- 1. Drop the permissive anonymous SELECT policy on partners table
-- This prevents direct access to admin fields like admin_contact_name, admin_contact_email, monthly_fee, admin_notes, etc.
DROP POLICY IF EXISTS "Anyone can read partner data for public view" ON public.partners;

-- 2. Drop and recreate partners_public view to include public contact fields
-- The view already excludes admin-only fields, but we need to add contact_person, email, phone for partner profiles
DROP VIEW IF EXISTS public.partners_public;

CREATE VIEW public.partners_public
WITH (security_invoker = true)
AS SELECT 
  id,
  slug,
  name,
  description,
  logo_url,
  logo_dark_bg,
  website,
  contact_person,  -- Public contact info for partner profiles
  email,           -- Public contact email for partner profiles
  phone,           -- Public contact phone for partner profiles
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
-- Excludes: admin_contact_name, admin_contact_email, monthly_fee, activation_date, cancellation_date, admin_notes, address

-- 3. Grant SELECT access on the view to anon and authenticated roles
GRANT SELECT ON public.partners_public TO anon, authenticated;