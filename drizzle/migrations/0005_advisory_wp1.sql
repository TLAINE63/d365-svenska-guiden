-- WP1: rådgivningsledd partnerintroduktion.
-- Advisory Booking = befintlig inquiries-rad (is_advisory = true). Advisory Case och Partner Introduction är nya, endast interna.

CREATE TABLE public.advisory_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  contact_name text,
  company text,
  email text,
  phone text,
  need_summary text,
  journey_context jsonb,
  notes text,
  status text NOT NULL DEFAULT 'ny',
  next_step text,
  budget text,
  timeline text,
  origin_placement text,
  origin_cta text
);
GRANT ALL ON public.advisory_cases TO service_role;
GRANT SELECT ON public.advisory_cases TO authenticated;
ALTER TABLE public.advisory_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read advisory cases" ON public.advisory_cases FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER advisory_cases_updated_at BEFORE UPDATE ON public.advisory_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.advisory_cases_validate() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status NOT IN ('ny','mote_bokat','mote_genomfort','introduktion','avslutad') THEN
    RAISE EXCEPTION 'Ogiltig ärendestatus: %', NEW.status;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER advisory_cases_validate BEFORE INSERT OR UPDATE ON public.advisory_cases FOR EACH ROW EXECUTE FUNCTION public.advisory_cases_validate();

-- Manuellt kopplade relaterade ärenden (aldrig automatisk sammanslagning).
CREATE TABLE public.advisory_case_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  case_a uuid NOT NULL REFERENCES public.advisory_cases(id) ON DELETE CASCADE,
  case_b uuid NOT NULL REFERENCES public.advisory_cases(id) ON DELETE CASCADE,
  note text,
  CONSTRAINT advisory_case_links_order CHECK (case_a < case_b),
  CONSTRAINT advisory_case_links_unique UNIQUE (case_a, case_b)
);
GRANT ALL ON public.advisory_case_links TO service_role;
GRANT SELECT ON public.advisory_case_links TO authenticated;
ALTER TABLE public.advisory_case_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read advisory case links" ON public.advisory_case_links FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Advisory Booking: återanvänd inquiries.
ALTER TABLE public.inquiries
  ADD COLUMN is_advisory boolean NOT NULL DEFAULT false,
  ADD COLUMN advisory_case_id uuid REFERENCES public.advisory_cases(id) ON DELETE SET NULL,
  ADD COLUMN advisory_placement text,
  ADD COLUMN advisory_cta text,
  ADD COLUMN page_type text,
  ADD COLUMN booking_status text,
  ADD COLUMN meeting_at timestamptz,
  ADD COLUMN meeting_held_at timestamptz;
CREATE INDEX inquiries_advisory_case_idx ON public.inquiries(advisory_case_id) WHERE advisory_case_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.inquiries_advisory_validate() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.is_advisory THEN
    NEW.booking_status := COALESCE(NEW.booking_status, 'forfragan');
    IF NEW.booking_status NOT IN ('forfragan','bokad','genomford','avbokad','uteblev') THEN
      RAISE EXCEPTION 'Ogiltig bokningsstatus: %', NEW.booking_status;
    END IF;
    IF NEW.booking_status = 'genomford' AND NEW.meeting_held_at IS NULL THEN
      NEW.meeting_held_at := now();
    END IF;
  ELSIF NEW.booking_status IS NOT NULL OR NEW.advisory_case_id IS NOT NULL THEN
    RAISE EXCEPTION 'Bokningsfält gäller bara rådgivningsbokningar';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER inquiries_advisory_validate BEFORE INSERT OR UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.inquiries_advisory_validate();

-- Befintliga rådgivningsförfrågningar: typ "fraga" utan partnermottagare och utan introduktionsbegäran.
UPDATE public.inquiries i SET is_advisory = true, booking_status = 'forfragan'
WHERE i.inquiry_type = 'fraga'
  AND NOT EXISTS (SELECT 1 FROM public.inquiry_partners ip WHERE ip.inquiry_id = i.id)
  AND (i.project IS NULL OR NOT (i.project ? 'introduktion_begard'));

-- Partner Introduction.
CREATE TABLE public.partner_introductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  case_id uuid NOT NULL REFERENCES public.advisory_cases(id) ON DELETE CASCADE,
  partner_slug text NOT NULL,
  partner_name text,
  origin text NOT NULL DEFAULT 'advisory',
  consent_given boolean NOT NULL DEFAULT false,
  consent_at timestamptz,
  consent_scope text[] NOT NULL DEFAULT '{}',
  consent_note text,
  introduced_at timestamptz,
  partner_response text NOT NULL DEFAULT 'vantar',
  partner_response_at timestamptz,
  business_status text NOT NULL DEFAULT 'forberedd',
  estimated_project_size text,
  business_outcome text,
  outcome_at timestamptz,
  next_step text,
  admin_notes text,
  commercial_model text NOT NULL DEFAULT 'none',
  CONSTRAINT partner_introductions_commercial_model CHECK (commercial_model IN ('none','lead_fee','success_fee')),
  CONSTRAINT partner_introductions_unique_partner UNIQUE (case_id, partner_slug)
);
GRANT ALL ON public.partner_introductions TO service_role;
GRANT SELECT ON public.partner_introductions TO authenticated;
ALTER TABLE public.partner_introductions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read partner introductions" ON public.partner_introductions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER partner_introductions_updated_at BEFORE UPDATE ON public.partner_introductions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.partner_introductions_validate() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE need text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.partners WHERE slug = NEW.partner_slug) THEN
    RAISE EXCEPTION 'Partnern finns inte: %', NEW.partner_slug;
  END IF;
  IF NEW.origin NOT IN ('advisory') THEN RAISE EXCEPTION 'Ogiltigt ursprung'; END IF;
  IF NEW.partner_response NOT IN ('vantar','accepterad','avbojd') THEN RAISE EXCEPTION 'Ogiltigt partnersvar'; END IF;
  IF NEW.business_status NOT IN ('forberedd','introducerad','dialog','kvalificerad','vunnen','forlorad','okand') THEN
    RAISE EXCEPTION 'Ogiltig affärsstatus: %', NEW.business_status;
  END IF;
  -- Godkännande krävs innan något delas med partnern.
  IF NEW.introduced_at IS NOT NULL AND (NOT NEW.consent_given OR NEW.consent_at IS NULL OR cardinality(NEW.consent_scope) = 0) THEN
    RAISE EXCEPTION 'Introduktionen kan inte skickas utan dokumenterat godkännande och delningsomfång';
  END IF;
  IF NEW.business_status <> 'forberedd' AND NEW.introduced_at IS NULL THEN
    RAISE EXCEPTION 'Status kräver att introduktionen har skickats';
  END IF;
  IF NEW.business_status = 'kvalificerad' THEN
    SELECT need_summary INTO need FROM public.advisory_cases WHERE id = NEW.case_id;
    IF coalesce(btrim(need), '') = '' OR NEW.partner_response <> 'accepterad' OR coalesce(btrim(NEW.next_step), '') = '' THEN
      RAISE EXCEPTION 'Kvalificerad möjlighet kräver identifierat behov, att partnern accepterat och ett konkret nästa steg';
    END IF;
  END IF;
  IF NEW.partner_response <> 'vantar' AND NEW.partner_response_at IS NULL THEN NEW.partner_response_at := now(); END IF;
  IF NEW.business_status IN ('vunnen','forlorad') AND NEW.outcome_at IS NULL THEN NEW.outcome_at := now(); END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER partner_introductions_validate BEFORE INSERT OR UPDATE ON public.partner_introductions FOR EACH ROW EXECUTE FUNCTION public.partner_introductions_validate();

-- Mätning: händelser som sker i administrationen loggas anonymt i funnel_events (endast id:n, ingen PII).
CREATE OR REPLACE FUNCTION public.advisory_log_event(_name text, _meta jsonb) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.funnel_events (event_type, event_name, page_path, metadata, tool)
  VALUES ('advisory', _name, '/admin', _meta, 'advisory');
$$;
REVOKE ALL ON FUNCTION public.advisory_log_event(text, jsonb) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.inquiries_advisory_events() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.is_advisory AND NEW.meeting_held_at IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.meeting_held_at IS NULL) THEN
    PERFORM public.advisory_log_event('advisory_meeting_held', jsonb_build_object('booking_id', NEW.id, 'case_id', NEW.advisory_case_id, 'placement', NEW.advisory_placement, 'cta', NEW.advisory_cta, 'page_type', NEW.page_type));
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER inquiries_advisory_events AFTER INSERT OR UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.inquiries_advisory_events();

CREATE OR REPLACE FUNCTION public.partner_introductions_events() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c record; meta jsonb;
BEGIN
  SELECT origin_placement, origin_cta INTO c FROM public.advisory_cases WHERE id = NEW.case_id;
  meta := jsonb_build_object('intro_id', NEW.id, 'case_id', NEW.case_id, 'placement', c.origin_placement, 'cta', c.origin_cta, 'status', NEW.business_status);
  IF NEW.introduced_at IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.introduced_at IS NULL) THEN
    PERFORM public.advisory_log_event('advisory_partner_introduction', meta);
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.business_status IS DISTINCT FROM OLD.business_status AND NEW.business_status <> 'introducerad' THEN
    PERFORM public.advisory_log_event('advisory_intro_' || NEW.business_status, meta);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER partner_introductions_events AFTER INSERT OR UPDATE ON public.partner_introductions FOR EACH ROW EXECUTE FUNCTION public.partner_introductions_events();