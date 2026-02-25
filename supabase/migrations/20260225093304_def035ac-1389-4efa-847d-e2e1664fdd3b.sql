ALTER TABLE public.partners ADD COLUMN office_cities text[] DEFAULT '{}'::text[];

-- Also add to the public view
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public AS
SELECT
  id, name, description, logo_url, website, email, phone, contact_person,
  applications, industries, secondary_industries, geography, customer_examples,
  product_filters, is_featured, logo_dark_bg, created_at, updated_at,
  industry_apps, slug, office_cities
FROM public.partners
WHERE is_featured = true;