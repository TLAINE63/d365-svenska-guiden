ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS information_status text NOT NULL DEFAULT 'compiled',
  ADD COLUMN IF NOT EXISTS information_verified_at date;

ALTER TABLE public.partners
  ADD CONSTRAINT partners_information_status_check
  CHECK (information_status IN ('verified', 'partner_confirmed', 'compiled'));

COMMENT ON COLUMN public.partners.information_status IS 'Public information status: verified = granskad av d365.se-redaktionen, partner_confirmed = bekräftad av partnern, compiled = sammanställd av d365.se. Set manually by editors only; independent of commercial status and never set by AI.';
COMMENT ON COLUMN public.partners.information_verified_at IS 'Date of the latest d365.se verification (used for "Senast verifierad" sort).';

-- Backfill: Thomas decision 2026-10-30, published profiles were reviewed before publishing.
UPDATE public.partners
  SET information_status = 'verified',
      information_verified_at = COALESCE(published_at::date, updated_at::date, created_at::date)
  WHERE is_featured = true;

CREATE OR REPLACE FUNCTION public.partners_information_status_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.information_status = 'verified' AND NEW.information_verified_at IS NULL THEN
    NEW.information_verified_at := current_date;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_information_status_validate ON public.partners;
CREATE TRIGGER partners_information_status_validate
  BEFORE INSERT OR UPDATE OF information_status, information_verified_at ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.partners_information_status_validate();

CREATE OR REPLACE VIEW public.partners_public AS
 SELECT id, slug, name, description, logo_url, logo_dark_bg, website, email, contact_person, contact_photo_url, phone,
    applications, industries, secondary_industries, geography, product_filters, industry_apps, is_featured,
    customer_examples, office_cities, map_url, youtube_video_id, created_at, updated_at, industry_pitches,
    agreement_signed, related_party, positioning_statement, delivery_profile, team_size_sweden, implementations_done,
    not_a_fit, implementations_per_app, ai_summary, ai_summary_generated_at, ai_profile, extended_content,
    extended_content_updated_at, partner_size_tier, partner_size_tier_needs_review, ai_summary_full, best_fit_for,
    ai_tags, extended_competencies, team_size_per_app, key_differentiators, key_differentiators_source,
    public_profile_summary, public_focus_tags, public_topics_12m, public_profile_sources, public_profile_updated_at,
    information_status, information_verified_at
   FROM public.partners
  WHERE is_featured = true;