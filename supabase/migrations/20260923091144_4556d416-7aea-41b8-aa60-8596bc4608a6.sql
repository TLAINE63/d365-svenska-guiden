ALTER TABLE public.partner_assignment_profiles
  ADD COLUMN IF NOT EXISTS onsite_cities text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS remote_available boolean NOT NULL DEFAULT false;

CREATE OR REPLACE VIEW public.assignment_profiles_public AS
SELECT ap.id,
    ap.guide_slug,
    p.slug AS partner_slug,
    p.name AS partner_name,
    p.logo_url,
    p.logo_dark_bg,
    ap.heading,
    ap.experience_summary,
    ap.typical_assignments,
    ap.products,
    ap.industries,
    ap.regions,
    ap.delivery_modes,
    ap.last_reviewed_at,
    COALESCE(( SELECT array_agg(DISTINCT e.evidence_type) AS array_agg
           FROM public.assignment_profile_evidence e
          WHERE e.profile_id = ap.id AND e.is_public = true AND e.evidence_type <> 'internal_reference'::text), '{}'::text[]) AS public_evidence_types,
    ap.onsite_cities,
    ap.remote_available
   FROM public.partner_assignment_profiles ap
     JOIN public.partners p ON p.id = ap.partner_id
  WHERE ap.status = 'published'::text AND p.is_featured = true AND ap.last_reviewed_at IS NOT NULL AND ap.last_reviewed_at > (CURRENT_DATE - '1 year'::interval);

CREATE INDEX IF NOT EXISTS partner_assignment_profiles_onsite_cities_idx
  ON public.partner_assignment_profiles USING gin (onsite_cities);