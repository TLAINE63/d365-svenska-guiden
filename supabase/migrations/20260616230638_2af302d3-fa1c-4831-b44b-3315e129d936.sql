
-- Run view as querying user again (avoid SECURITY DEFINER linter error)
ALTER VIEW public.partners_public SET (security_invoker = true);

-- Public read policy on the base table, filtered to featured partners only
DROP POLICY IF EXISTS "Anyone can read featured partners" ON public.partners;
CREATE POLICY "Anyone can read featured partners"
  ON public.partners FOR SELECT
  TO anon, authenticated
  USING (is_featured = true);

-- Column-level grants: only expose the safe columns the view projects.
GRANT SELECT (
  id, slug, name, description, logo_url, logo_dark_bg, website, email,
  contact_person, contact_photo_url, phone, applications, industries,
  secondary_industries, geography, product_filters, industry_apps,
  is_featured, customer_examples, office_cities, map_url, youtube_video_id,
  created_at, updated_at, industry_pitches, agreement_signed, related_party
) ON public.partners TO anon, authenticated;
