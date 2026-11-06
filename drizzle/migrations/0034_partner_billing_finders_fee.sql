ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS billing_interval text NOT NULL DEFAULT 'month',
  ADD COLUMN IF NOT EXISTS annual_fee numeric,
  ADD COLUMN IF NOT EXISTS annual_start_date date,
  ADD COLUMN IF NOT EXISTS discount_percent numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS has_finders_fee boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS finders_fee_signed_at date,
  ADD COLUMN IF NOT EXISTS finders_fee_notes text;

CREATE OR REPLACE FUNCTION public.partners_billing_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.billing_interval NOT IN ('month','year') THEN RAISE EXCEPTION 'Ogiltigt faktureringsintervall'; END IF;
  IF NEW.discount_percent < 0 OR NEW.discount_percent > 100 THEN RAISE EXCEPTION 'Rabatt måste vara 0–100 %%'; END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS partners_billing_validate ON public.partners;
CREATE TRIGGER partners_billing_validate BEFORE INSERT OR UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.partners_billing_validate();