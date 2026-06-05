
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS agreement_signed_at timestamptz;

-- Backfill published_at for already-featured partners
UPDATE public.partners
SET published_at = COALESCE(activation_date::timestamptz, created_at)
WHERE is_featured = true AND published_at IS NULL;

-- Backfill agreement_signed_at for partners with signed agreements
UPDATE public.partners
SET agreement_signed_at = COALESCE(activation_date::timestamptz, created_at)
WHERE agreement_signed = true AND agreement_signed_at IS NULL;

-- Trigger to auto-set the dates when the flags flip to true
CREATE OR REPLACE FUNCTION public.partners_set_milestone_dates()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_featured = true AND (OLD.is_featured IS DISTINCT FROM true) AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;
  IF NEW.agreement_signed = true AND (OLD.agreement_signed IS DISTINCT FROM true) AND NEW.agreement_signed_at IS NULL THEN
    NEW.agreement_signed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_set_milestone_dates_trg ON public.partners;
CREATE TRIGGER partners_set_milestone_dates_trg
BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.partners_set_milestone_dates();

-- Also handle INSERT (new partner created already featured/signed)
CREATE OR REPLACE FUNCTION public.partners_set_milestone_dates_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_featured = true AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;
  IF NEW.agreement_signed = true AND NEW.agreement_signed_at IS NULL THEN
    NEW.agreement_signed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_set_milestone_dates_insert_trg ON public.partners;
CREATE TRIGGER partners_set_milestone_dates_insert_trg
BEFORE INSERT ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.partners_set_milestone_dates_insert();
