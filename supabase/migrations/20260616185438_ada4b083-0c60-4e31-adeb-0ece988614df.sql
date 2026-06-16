
DROP VIEW IF EXISTS public.partners_public;

CREATE VIEW public.partners_public AS
SELECT id, slug, name, description, logo_url, logo_dark_bg, website, email,
  contact_person, contact_photo_url, phone, applications, industries,
  secondary_industries, geography, product_filters, industry_apps, is_featured,
  customer_examples, office_cities, map_url, youtube_video_id,
  created_at, updated_at, industry_pitches, agreement_signed, related_party
FROM public.partners;

GRANT SELECT ON public.partners_public TO anon, authenticated;

DROP POLICY IF EXISTS "Block all reads from non-service roles" ON public.funnel_events;
CREATE POLICY "Block all reads from non-service roles"
ON public.funnel_events
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Block all reads from non-service roles" ON public.partner_filter_exposures;
CREATE POLICY "Block all reads from non-service roles"
ON public.partner_filter_exposures
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Block all reads from non-service roles" ON public.visitor_analytics;
CREATE POLICY "Block all reads from non-service roles"
ON public.visitor_analytics
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);
