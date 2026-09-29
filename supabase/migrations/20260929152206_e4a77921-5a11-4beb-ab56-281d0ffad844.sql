ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS structured_profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS data_verified_at date,
  ADD COLUMN IF NOT EXISTS data_verified_by text;
ALTER TABLE public.partner_submissions
  ADD COLUMN IF NOT EXISTS structured_profile jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.partners_validate_verified_by()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.data_verified_by IS NOT NULL AND NEW.data_verified_by NOT IN ('partner','redaktion','publik_kalla') THEN
    RAISE EXCEPTION 'Ogiltigt värde för data_verified_by: %', NEW.data_verified_by;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER partners_validate_verified_by_trg
BEFORE INSERT OR UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.partners_validate_verified_by();