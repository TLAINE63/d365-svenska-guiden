-- Extend the public view to expose the new (non-sensitive) tier signal so the
-- frontend can forward it to the match-partners edge function without a
-- second round-trip. Tier is intentionally kept intern (no public filter UI).
CREATE OR REPLACE VIEW public.partners_public AS
SELECT
  id, slug, name, description, logo_url, logo_dark_bg, website,
  email, contact_person, contact_photo_url, phone,
  applications, industries, secondary_industries, geography,
  product_filters, industry_apps, is_featured, customer_examples,
  office_cities, map_url, youtube_video_id,
  created_at, updated_at,
  industry_pitches, agreement_signed, related_party,
  positioning_statement, delivery_profile, team_size_sweden,
  implementations_done, not_a_fit, implementations_per_app,
  ai_summary, ai_summary_generated_at, ai_profile,
  extended_content, extended_content_updated_at,
  partner_size_tier,
  partner_size_tier_needs_review
FROM public.partners
WHERE is_featured = true;

-- Views inherit access from the base table via the invoker's privileges;
-- re-grant to be explicit (matches existing pattern for partners_public).
GRANT SELECT ON public.partners_public TO anon, authenticated;