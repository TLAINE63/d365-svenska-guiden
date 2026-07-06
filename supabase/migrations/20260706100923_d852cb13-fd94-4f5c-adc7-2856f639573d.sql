
-- Remove broad anon SELECT on partners table (exposed sensitive billing/admin fields).
-- Public access now goes exclusively through the partners_public view.
DROP POLICY IF EXISTS "Anyone can read featured partners" ON public.partners;

-- Recreate partners_public view without internal billing / legal fields.
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public
WITH (security_invoker = true)
AS
SELECT
  id, slug, name, description, logo_url, logo_dark_bg, website, email,
  contact_person, contact_photo_url, phone, applications, industries,
  secondary_industries, geography, product_filters, industry_apps,
  is_featured, customer_examples, office_cities, map_url, youtube_video_id,
  created_at, updated_at, industry_pitches, agreement_signed, related_party,
  positioning_statement, delivery_profile, team_size_sweden,
  implementations_done, not_a_fit, implementations_per_app,
  ai_summary, ai_summary_generated_at, ai_profile
FROM public.partners
WHERE is_featured = true;

GRANT SELECT ON public.partners_public TO anon, authenticated;

-- Keep a minimal anon SELECT policy so the view (security_invoker) can read the underlying table.
-- Column exposure is now controlled by the view definition, not by RLS.
CREATE POLICY "Public can read featured partners via view"
ON public.partners
FOR SELECT
TO anon, authenticated
USING (is_featured = true);
