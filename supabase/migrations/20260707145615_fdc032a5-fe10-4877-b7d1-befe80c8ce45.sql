
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS hide_basic_card boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.partners.hide_basic_card IS
  'När true döljs partnern helt publikt även som Basickort (används för opublicerade partners som aktivt bett att inte synas).';

CREATE OR REPLACE VIEW public.partners_basic_public
WITH (security_invoker = true) AS
SELECT
  id, slug, name, website,
  observed_products, observed_industries, observed_locations, observed_updated_at,
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
