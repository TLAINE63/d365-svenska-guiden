-- Add contact_photo_url to partners table for displaying customer contact photo on partner profile
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS contact_photo_url TEXT;

-- Recreate the partners_public view to include contact_photo_url
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
  email,
  contact_person,
  contact_photo_url,
  phone,
  applications,
  industries,
  secondary_industries,
  geography,
  product_filters,
  is_featured,
  created_at,
  updated_at,
  customer_examples,
  office_cities,
  map_url,
  industry_apps,
  invoice_email,
  invoice_contact,
  org_number,
  legal_name
FROM public.partners
WHERE is_featured = true;

-- Grant select on the view to anon and authenticated roles
GRANT SELECT ON public.partners_public TO anon, authenticated;