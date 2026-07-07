ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS observed_company_sizes jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS observed_revenue       jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS observed_delivery_geo  jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.partners.observed_company_sizes IS 'Observerad målgruppsstorlek per produktområde (bc/fsc/sales/service).';
COMMENT ON COLUMN public.partners.observed_revenue IS 'Observerad kundomsättning per produktområde (bc/fsc/sales/service).';
COMMENT ON COLUMN public.partners.observed_delivery_geo IS 'Observerad leveransgeografi per produktområde (bc/fsc/sales/service).';

DROP VIEW IF EXISTS public.partners_basic_public;

CREATE VIEW public.partners_basic_public
WITH (security_invoker = true) AS
SELECT id, slug, name, website,
       observed_products, observed_industries, observed_locations, observed_updated_at,
       observed_company_sizes, observed_revenue, observed_delivery_geo,
       extended_content, extended_content_updated_at,
       profile_level, created_at, updated_at
FROM public.partners
WHERE COALESCE(is_featured, false) = false
  AND COALESCE(hide_basic_card, false) = false
  AND (
    COALESCE(observed_products, '{}'::jsonb) <> '{}'::jsonb
    OR COALESCE(observed_industries, '{}'::jsonb) <> '{}'::jsonb
    OR COALESCE(array_length(observed_locations, 1), 0) > 0
  );

GRANT SELECT ON public.partners_basic_public TO anon, authenticated;