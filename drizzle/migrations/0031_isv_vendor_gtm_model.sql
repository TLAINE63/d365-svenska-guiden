ALTER TABLE public.isv_vendors ADD COLUMN IF NOT EXISTS gtm_model text;
COMMENT ON COLUMN public.isv_vendors.gtm_model IS 'Försäljningsmodell: direkt, partner eller hybrid. NULL = okänt. Sätts manuellt i admin, påverkar aldrig sortering eller filter.';

CREATE OR REPLACE FUNCTION public.isv_vendors_gtm_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.gtm_model IS NOT NULL AND NEW.gtm_model NOT IN ('direkt','partner','hybrid') THEN
    RAISE EXCEPTION 'gtm_model måste vara direkt, partner eller hybrid';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS isv_vendors_gtm_validate ON public.isv_vendors;
CREATE TRIGGER isv_vendors_gtm_validate BEFORE INSERT OR UPDATE OF gtm_model ON public.isv_vendors
FOR EACH ROW EXECUTE FUNCTION public.isv_vendors_gtm_validate();