CREATE OR REPLACE FUNCTION public.demand_leads_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE st text := coalesce(NEW.source_type,''); sp text := coalesce(NEW.source_page,''); slug text;
BEGIN
  IF NEW.submission_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.leads WHERE submission_id = NEW.submission_id AND id <> NEW.id
  ) THEN
    RETURN NEW;
  END IF;
  IF st = 'kontakt' THEN
    PERFORM public.demand_log('form_submitted','kontakt','/tack/kontakt/',NEW.email);
  ELSIF st = 'kompetens_behov' THEN
    PERFORM public.demand_log('form_submitted','kompetens','/tack/kompetens/',NEW.email);
  ELSIF st IN ('basic_partner_inquiry','compare_partners_intro','partner_contact_request','partner_demo_request','partner_quote_request','partner_multi_quote_request') THEN
    PERFORM public.demand_log('form_submitted','partnermatchning','/tack/partnermatchning/',NEW.email);
  ELSE
    slug := CASE
      WHEN st LIKE 'buyer_guide_%' THEN 'kopparguide-2026'
      WHEN st = 'implementation_calculator_pdf' THEN 'implementationskalkyl'
      WHEN st = 'partner_guide' THEN 'partnerguide'
      WHEN st = 'ai_readiness' THEN 'ai-mognad'
      WHEN st LIKE 'roi_pdf_%' THEN 'roi-' || regexp_replace(substr(st, 9), '-roi$', '')
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
REVOKE ALL ON FUNCTION public.demand_leads_event() FROM PUBLIC, anon, authenticated;