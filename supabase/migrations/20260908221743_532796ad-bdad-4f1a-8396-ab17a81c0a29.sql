ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS key_differentiators text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.partner_submissions ADD COLUMN IF NOT EXISTS key_differentiators text[] NOT NULL DEFAULT '{}';

CREATE OR REPLACE VIEW public.partners_public AS
SELECT id, slug, name, description, logo_url, logo_dark_bg, website, email, contact_person,
  contact_photo_url, phone, applications, industries, secondary_industries, geography,
  product_filters, industry_apps, is_featured, customer_examples, office_cities, map_url,
  youtube_video_id, created_at, updated_at, industry_pitches, agreement_signed, related_party,
  positioning_statement, delivery_profile, team_size_sweden, implementations_done, not_a_fit,
  implementations_per_app, ai_summary, ai_summary_generated_at, ai_profile, extended_content,
  extended_content_updated_at, partner_size_tier, partner_size_tier_needs_review, ai_summary_full,
  best_fit_for, ai_tags, extended_competencies, team_size_per_app, key_differentiators
FROM public.partners
WHERE is_featured = true;