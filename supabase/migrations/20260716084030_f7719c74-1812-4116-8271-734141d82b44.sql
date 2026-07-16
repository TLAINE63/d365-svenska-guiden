ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS extended_summary text;

COMMENT ON COLUMN public.partners.extended_summary IS
  'Kort sammanfattning från fördjupningstexten, visas separat på Basickortet.';

DROP VIEW IF EXISTS public.partners_basic_public;

CREATE VIEW public.partners_basic_public
WITH (security_invoker = true) AS
SELECT id, slug, name, website,
       observed_products, observed_industries, observed_locations, observed_updated_at,
       observed_company_sizes, observed_revenue, observed_delivery_geo,
       extended_content, extended_content_updated_at,
       extended_summary,
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
