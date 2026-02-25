ALTER TABLE public.partners ADD COLUMN map_url text DEFAULT NULL;

-- Update public view to include map_url
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public AS
SELECT
  id, name, description, logo_url, website, email, phone, contact_person,
  applications, industries, secondary_industries, geography, customer_examples,
  product_filters, is_featured, logo_dark_bg, created_at, updated_at,
  industry_apps, slug, office_cities, map_url
FROM public.partners
WHERE is_featured = true;