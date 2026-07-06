
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS extended_content text,
  ADD COLUMN IF NOT EXISTS extended_content_updated_at timestamptz;

CREATE OR REPLACE VIEW public.partners_public AS
SELECT id, slug, name, description, logo_url, logo_dark_bg, website, email,
       contact_person, contact_photo_url, phone, applications, industries,
       secondary_industries, geography, product_filters, industry_apps,
       is_featured, customer_examples, office_cities, map_url, youtube_video_id,
       created_at, updated_at, industry_pitches, agreement_signed, related_party,
       positioning_statement, delivery_profile, team_size_sweden,
       implementations_done, not_a_fit, implementations_per_app, ai_summary,
       ai_summary_generated_at, ai_profile,
       extended_content, extended_content_updated_at
  FROM public.partners
 WHERE is_featured = true;

GRANT SELECT ON public.partners_public TO anon, authenticated;
