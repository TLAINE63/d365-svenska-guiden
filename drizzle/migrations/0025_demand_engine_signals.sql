-- Signalinsamling för Demand Engine (steg 2). Inga IP-, user agent-, referrer- eller sessionskolumner.
CREATE TABLE public.demand_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site text NOT NULL DEFAULT 'd365.se',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL CHECK (event_type IN ('tool_completed','form_submitted','download')),
  object text NOT NULL CHECK (length(object) BETWEEN 1 AND 80),
  path text CHECK (path IS NULL OR length(path) <= 300),
  company_domain text CHECK (company_domain IS NULL OR length(company_domain) <= 253)
);
GRANT ALL ON public.demand_events TO service_role;
ALTER TABLE public.demand_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX demand_events_occurred_idx ON public.demand_events (occurred_at);

CREATE TABLE public.needs_analysis_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  analysis text NOT NULL CHECK (analysis IN ('erp-behovsanalys','crm-behovsanalys','kundservice-behovsanalys')),
  name text,
  company text,
  email text NOT NULL,
  phone text
);
GRANT ALL ON public.needs_analysis_submissions TO service_role;
ALTER TABLE public.needs_analysis_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read needs analysis submissions" ON public.needs_analysis_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.needs_analysis_submissions TO authenticated;

-- Sidhistorik och samtyckesversion på formulärtabellerna
ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS session_pages text[],
  ADD COLUMN IF NOT EXISTS consent_text_version text;
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS session_pages text[],
  ADD COLUMN IF NOT EXISTS consent_partner_share boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_text_version text;
ALTER TABLE public.underlag_forward_requests
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS session_pages text[],
  ADD COLUMN IF NOT EXISTS consent_partner_share boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_text_version text;
ALTER TABLE public.underlag_submissions
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS session_pages text[],
  ADD COLUMN IF NOT EXISTS consent_text_version text;

-- Företagsdomän ur e-post; tom för privata e-posttjänster.
CREATE OR REPLACE FUNCTION public.demand_company_domain(_email text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN d IS NULL OR d = '' THEN NULL
    WHEN d IN ('gmail.com','googlemail.com','hotmail.com','hotmail.se','outlook.com','outlook.se','live.se','live.com','icloud.com','me.com','yahoo.com','yahoo.se','telia.com','msn.com','protonmail.com','proton.me') THEN NULL
    ELSE d END
  FROM (SELECT regexp_replace(lower(trim(split_part(coalesce(_email,''), '@', 2))), '^www\.', '') AS d) x
$$;

CREATE OR REPLACE FUNCTION public.demand_log(_type text, _object text, _path text, _email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.demand_events (event_type, object, path, company_domain)
  VALUES (_type, _object, _path, public.demand_company_domain(_email));
EXCEPTION WHEN others THEN
  -- Signalen får aldrig stoppa ett formulär.
  NULL;
END $$;
REVOKE ALL ON FUNCTION public.demand_log(text,text,text,text) FROM PUBLIC, anon, authenticated;

-- inquiries: en händelse per inskickning (rådgivning skriver även advisory_cases, som inte har trigger)
CREATE OR REPLACE FUNCTION public.demand_inquiries_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE obj text;
BEGIN
  IF coalesce(NEW.source_site,'d365.se') <> 'd365.se' THEN RETURN NEW; END IF;
  obj := CASE
    WHEN NEW.is_advisory AND NEW.advisory_placement = 'second_opinion' THEN 'second-opinion'
    WHEN NEW.is_advisory AND NEW.advisory_placement = 'expert_requirement' THEN 'kompetens'
    WHEN NEW.is_advisory THEN 'radgivning'
    ELSE 'partnermatchning' END;
  PERFORM public.demand_log('form_submitted', obj,
    CASE obj WHEN 'partnermatchning' THEN '/forfragan/tack/' ELSE '/tack/' || obj || '/' END, NEW.email);
  RETURN NEW;
END $$;
CREATE TRIGGER demand_inquiries_event AFTER INSERT ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.demand_inquiries_event();

-- leads: köparformulär och formulärkrävda underlag
CREATE OR REPLACE FUNCTION public.demand_leads_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE st text := coalesce(NEW.source_type,''); sp text := coalesce(NEW.source_page,''); slug text;
BEGIN
  IF st = 'kontakt' THEN
    PERFORM public.demand_log('form_submitted','kontakt','/tack/kontakt/',NEW.email);
  ELSIF st = 'kompetens_behov' THEN
    PERFORM public.demand_log('form_submitted','kompetens','/tack/kompetens/',NEW.email);
  ELSIF st IN ('basic_partner_inquiry','compare_partners_intro','partner_contact_request') THEN
    PERFORM public.demand_log('form_submitted','partnermatchning','/tack/partnermatchning/',NEW.email);
  ELSE
    slug := CASE
      WHEN st = 'lead_magnet' THEN 'kopparguide-2026'
      WHEN st = 'implementation_calculator_pdf' THEN 'implementationskalkyl'
      WHEN st = 'partner_guide' THEN 'partnerguide'
      WHEN st = 'ai_readiness' THEN 'ai-mognad'
      WHEN st LIKE 'roi_pdf_%' THEN 'roi-' || substr(st, 9)
      WHEN st = 'requirements_spec' THEN 'kravspec-' || CASE
        WHEN sp LIKE '%kravspecifikation-sales%' THEN 'sales'
        WHEN sp LIKE '%kravspecifikation-marketing%' THEN 'marketing'
        WHEN sp LIKE '%kravspecifikation-kundservice%' THEN 'kundservice'
        ELSE 'erp' END
      ELSE NULL END;
    IF slug IS NOT NULL THEN
      PERFORM public.demand_log('download', slug, '/hamtat/' || slug || '/', NEW.email);
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER demand_leads_event AFTER INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.demand_leads_event();

CREATE OR REPLACE FUNCTION public.demand_underlag_forward_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.demand_log('form_submitted','skicka-underlag','/tack/skicka-underlag/',NEW.email);
  RETURN NEW;
END $$;
CREATE TRIGGER demand_underlag_forward_event AFTER INSERT ON public.underlag_forward_requests FOR EACH ROW EXECUTE FUNCTION public.demand_underlag_forward_event();

CREATE OR REPLACE FUNCTION public.demand_underlag_submission_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.demand_log('form_submitted','underlag','/tack/underlag/',NEW.email);
  RETURN NEW;
END $$;
CREATE TRIGGER demand_underlag_submission_event AFTER INSERT ON public.underlag_submissions FOR EACH ROW EXECUTE FUNCTION public.demand_underlag_submission_event();

CREATE OR REPLACE FUNCTION public.demand_assessment_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(trim(NEW.contact_email),'') <> '' THEN
    PERFORM public.demand_log('tool_completed','beslutsmognad','/beslutsmognad/resultat/',NEW.contact_email);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER demand_assessment_event AFTER INSERT ON public.assessments FOR EACH ROW EXECUTE FUNCTION public.demand_assessment_event();

CREATE OR REPLACE FUNCTION public.demand_needs_analysis_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.demand_log('tool_completed', NEW.analysis,
    CASE NEW.analysis
      WHEN 'erp-behovsanalys' THEN '/ERPbehovsanalys/resultat/'
      WHEN 'crm-behovsanalys' THEN '/CRMbehovsanalys/resultat/'
      ELSE '/kundservice-behovsanalys/resultat/' END,
    NEW.email);
  RETURN NEW;
END $$;
CREATE TRIGGER demand_needs_analysis_event AFTER INSERT ON public.needs_analysis_submissions FOR EACH ROW EXECUTE FUNCTION public.demand_needs_analysis_event();

REVOKE ALL ON FUNCTION public.demand_inquiries_event(), public.demand_leads_event(), public.demand_underlag_forward_event(), public.demand_underlag_submission_event(), public.demand_assessment_event(), public.demand_needs_analysis_event() FROM PUBLIC, anon, authenticated;