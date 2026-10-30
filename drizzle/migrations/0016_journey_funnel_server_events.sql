-- Sprint 2.2: gemensamma resehändelser som bara databasen kan säkerställa
-- (buyer-approved introduction, möte begärt, möte genomfört). Anonyma: bara id:n och uppräknade värden.
CREATE OR REPLACE FUNCTION public.journey_type_for_placement(_placement text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE
    WHEN _placement IN ('solution_assessment','solution_advice','needs_guide') THEN 'solution'
    WHEN _placement IN ('partner_search','compare','plan','home') THEN 'partner'
    WHEN _placement = 'expert_requirement' THEN 'expert'
    WHEN _placement IN ('cost_help','tool_result') THEN 'cost'
    WHEN _placement IN ('existing_dynamics','partner_relationship_review','second_opinion','partner_switch') THEN 'existing'
    WHEN _placement = 'isv_product_help' THEN 'isv'
    ELSE 'other' END
$$;

CREATE OR REPLACE FUNCTION public.journey_log_event(_name text, _meta jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $$
  INSERT INTO public.funnel_events (event_type, event_name, page_path, metadata, tool)
  VALUES ('journey_funnel', _name, '/server', _meta, 'journey_funnel');
$$;

CREATE OR REPLACE FUNCTION public.inquiries_advisory_events()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE jm jsonb;
BEGIN
  IF NOT NEW.is_advisory THEN RETURN NEW; END IF;
  jm := jsonb_build_object('booking_id', NEW.id, 'case_id', NEW.advisory_case_id, 'placement', NEW.advisory_placement,
    'journey_type', public.journey_type_for_placement(NEW.advisory_placement), 'source_site', NEW.source_site,
    'conversion_type', 'contact_d365', 'recipient', 'd365');
  IF NEW.meeting_held_at IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.meeting_held_at IS NULL) THEN
    PERFORM public.advisory_log_event('advisory_meeting_held', jsonb_build_object('booking_id', NEW.id, 'case_id', NEW.advisory_case_id, 'placement', NEW.advisory_placement, 'cta', NEW.advisory_cta, 'page_type', NEW.page_type));
    PERFORM public.journey_log_event('meeting_held', jm);
  END IF;
  IF (NEW.booking_status = 'bokad' OR NEW.meeting_at IS NOT NULL)
     AND (TG_OP = 'INSERT' OR (OLD.booking_status IS DISTINCT FROM 'bokad' AND OLD.meeting_at IS NULL AND OLD.meeting_held_at IS NULL)) THEN
    PERFORM public.journey_log_event('meeting_requested', jm);
  END IF;
  RETURN NEW;
END $function$;

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
    IF c.origin_placement = 'expert_requirement' THEN
      PERFORM public.advisory_log_event('buyer_approved_expert_introduction', meta);
    END IF;
    -- Sprint 2.2: förmedlad kontakt, alltid efter dokumenterat godkännande (valideringstriggern).
    PERFORM public.journey_log_event('buyer_approved_introduction', jsonb_build_object(
      'intro_id', NEW.id, 'case_id', NEW.case_id, 'placement', c.origin_placement,
      'journey_type', public.journey_type_for_placement(c.origin_placement),
      'conversion_type', 'mediated_introduction', 'recipient', 'partner', 'partner_slug', NEW.partner_slug));
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.business_status IS DISTINCT FROM OLD.business_status AND NEW.business_status <> 'introducerad' THEN
    PERFORM public.advisory_log_event('advisory_intro_' || NEW.business_status, meta);
  END IF;
  RETURN NEW;
END $function$;