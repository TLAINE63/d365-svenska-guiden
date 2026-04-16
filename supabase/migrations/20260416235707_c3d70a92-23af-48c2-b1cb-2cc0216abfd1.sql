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
  industry_apps,
  is_featured,
  customer_examples,
  office_cities,
  map_url,
  invoice_email,
  invoice_contact,
  org_number,
  legal_name,
  youtube_video_id,
  created_at,
  updated_at
FROM public.partners;

GRANT SELECT ON public.partners_public TO anon, authenticated;