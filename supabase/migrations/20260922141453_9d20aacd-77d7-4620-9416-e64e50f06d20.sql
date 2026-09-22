
CREATE TABLE public.competence_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  guide_type text NOT NULL CHECK (guide_type IN ('role','product')),
  product_area text,
  intro text,
  sections jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo_title text,
  seo_description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.competence_guides TO anon, authenticated;
GRANT ALL ON public.competence_guides TO service_role;
ALTER TABLE public.competence_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published guides are readable" ON public.competence_guides
  FOR SELECT USING (status = 'published');

CREATE TRIGGER competence_guides_set_updated_at
  BEFORE UPDATE ON public.competence_guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.partner_assignment_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  guide_slug text NOT NULL REFERENCES public.competence_guides(slug) ON UPDATE CASCADE,
  heading text NOT NULL,
  experience_summary text NOT NULL,
  typical_assignments text[] NOT NULL DEFAULT '{}',
  products text[] NOT NULL DEFAULT '{}',
  industries text[] NOT NULL DEFAULT '{}',
  regions text[] NOT NULL DEFAULT '{}',
  delivery_modes text[] NOT NULL DEFAULT '{}',
  last_reviewed_at date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, guide_slug)
);

GRANT ALL ON public.partner_assignment_profiles TO service_role;
ALTER TABLE public.partner_assignment_profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER partner_assignment_profiles_set_updated_at
  BEFORE UPDATE ON public.partner_assignment_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.assignment_profiles_enforce_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE published_count integer;
BEGIN
  IF NEW.status <> 'published' THEN
    RETURN NEW;
  END IF;
  SELECT count(*) INTO published_count
  FROM public.partner_assignment_profiles
  WHERE partner_id = NEW.partner_id
    AND status = 'published'
    AND id <> NEW.id;
  IF published_count >= 3 THEN
    RAISE EXCEPTION 'En partner kan ha hogst tre publicerade uppdragsprofiler';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER partner_assignment_profiles_limit
  BEFORE INSERT OR UPDATE ON public.partner_assignment_profiles
  FOR EACH ROW EXECUTE FUNCTION public.assignment_profiles_enforce_limit();

CREATE TABLE public.assignment_profile_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.partner_assignment_profiles(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (evidence_type IN ('customer_case','customer_reference','microsoft_certification','internal_reference')),
  title text NOT NULL,
  url text,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.assignment_profile_evidence TO service_role;
ALTER TABLE public.assignment_profile_evidence ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER assignment_profile_evidence_set_updated_at
  BEFORE UPDATE ON public.assignment_profile_evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE VIEW public.assignment_profiles_public
WITH (security_invoker = false) AS
SELECT
  ap.id,
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
  COALESCE((
    SELECT array_agg(DISTINCT e.evidence_type)
    FROM public.assignment_profile_evidence e
    WHERE e.profile_id = ap.id
      AND e.is_public = true
      AND e.evidence_type <> 'internal_reference'
  ), '{}') AS public_evidence_types
FROM public.partner_assignment_profiles ap
JOIN public.partners p ON p.id = ap.partner_id
WHERE ap.status = 'published'
  AND p.is_featured = true
  AND ap.last_reviewed_at IS NOT NULL
  AND ap.last_reviewed_at > (current_date - interval '12 months');

GRANT SELECT ON public.assignment_profiles_public TO anon, authenticated;
