ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS is_partner_self boolean NOT NULL DEFAULT false;

-- Partnerns egen förfrågan på sin profil: e-postdomänen är partnerns webbplatsdomän (eller domänen
-- i partnerns registrerade kontaktadresser), eller meddelandet gäller uppenbart den egna profilen.
CREATE OR REPLACE FUNCTION public.demand_is_partner_self(_email text, _source_page text, _message text)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _slug text; dom text; p record; site text;
BEGIN
  _slug := substring(coalesce(_source_page,'') from '^/(?:basic|partner)/([a-z0-9-]+)');
  IF _slug IS NULL THEN RETURN false; END IF;
  SELECT pa.website, pa.email, pa.admin_contact_email, pa.invoice_email INTO p FROM public.partners pa WHERE pa.slug = _slug;
  IF NOT FOUND THEN RETURN false; END IF;
  dom := public.demand_company_domain(_email);
  IF dom IS NOT NULL THEN
    site := regexp_replace(lower(split_part(regexp_replace(coalesce(p.website,''), '^[a-z]+://', '', 'i'), '/', 1)), '^www\.', '');
    IF site <> '' AND (dom = site OR dom LIKE '%.' || site OR site LIKE '%.' || dom) THEN RETURN true; END IF;
    IF dom IN (public.demand_company_domain(p.email), public.demand_company_domain(p.admin_contact_email), public.demand_company_domain(p.invoice_email)) THEN RETURN true; END IF;
  END IF;
  IF coalesce(_message,'') ~* '(vår|min|vår egen) (grund)?profil|uppdatera (vår|min|profilen)|ändra (vår|min|profilen)|publicera (vår|min|profilen)|partneransökan|bli verifierad partner|verifiera (vår|oss)' THEN
    RETURN true;
  END IF;
  RETURN false;
END $$;

CREATE OR REPLACE FUNCTION public.leads_mark_partner_self()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF coalesce(NEW.source_type,'') IN ('basic_partner_inquiry','partner_contact_request','partner_demo_request','partner_quote_request','partner_multi_quote_request','compare_partners_intro') THEN
    NEW.is_partner_self := public.demand_is_partner_self(NEW.email, NEW.source_page, NEW.message);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS leads_mark_partner_self ON public.leads;
CREATE TRIGGER leads_mark_partner_self BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.leads_mark_partner_self();

CREATE OR REPLACE FUNCTION public.demand_leads_event()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE st text := coalesce(NEW.source_type,''); sp text := coalesce(NEW.source_page,''); slug text;
BEGIN
  -- Partnerns egna förfrågningar ger ingen händelse.
  IF NEW.is_partner_self THEN RETURN NEW; END IF;
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
      WHEN st IN ('partner_guide','lead_magnet') THEN 'partnerguide'
      WHEN st = 'ebook_download' THEN 'e-bok-partnervalet'
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
END $function$;

UPDATE public.leads SET is_partner_self = public.demand_is_partner_self(email, source_page, message)
WHERE source_type IN ('basic_partner_inquiry','partner_contact_request','partner_demo_request','partner_quote_request','partner_multi_quote_request','compare_partners_intro');