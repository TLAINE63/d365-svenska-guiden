CREATE OR REPLACE FUNCTION public.partner_introductions_events()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE c record; meta jsonb;
BEGIN
  SELECT origin_placement, origin_cta INTO c FROM public.advisory_cases WHERE id = NEW.case_id;
  meta := jsonb_build_object('intro_id', NEW.id, 'case_id', NEW.case_id, 'placement', c.origin_placement, 'cta', c.origin_cta, 'status', NEW.business_status);
  IF NEW.introduced_at IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.introduced_at IS NULL) THEN
    PERFORM public.advisory_log_event('advisory_partner_introduction', meta);
    -- Sprint 1.2: introduktion från ett kompetensbehov. Valideringstriggern kräver köparens godkännande.
    IF c.origin_placement = 'expert_requirement' THEN
      PERFORM public.advisory_log_event('buyer_approved_expert_introduction', meta);
    END IF;
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.business_status IS DISTINCT FROM OLD.business_status AND NEW.business_status <> 'introducerad' THEN
    PERFORM public.advisory_log_event('advisory_intro_' || NEW.business_status, meta);
  END IF;
  RETURN NEW;
END $function$;