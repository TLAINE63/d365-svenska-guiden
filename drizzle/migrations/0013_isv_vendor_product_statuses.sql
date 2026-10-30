-- Sprint 1.9: ISV Vendor (isv_vendors) 1→N ISV Product (isv_solutions), med oberoende status per nivå.
ALTER TABLE public.isv_vendors
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS publication_status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS profile_source text NOT NULL DEFAULT 'd365_research',
  ADD COLUMN IF NOT EXISTS confirmation_status text NOT NULL DEFAULT 'not_confirmed',
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'not_reviewed',
  ADD COLUMN IF NOT EXISTS last_verified_date date,
  ADD COLUMN IF NOT EXISTS information_status text NOT NULL DEFAULT 'compiled',
  ADD COLUMN IF NOT EXISTS premium_vendor boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_d365 boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS publish_businesscentral boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_d365guide boolean NOT NULL DEFAULT false;

ALTER TABLE public.isv_solutions
  ADD COLUMN IF NOT EXISTS product_source text NOT NULL DEFAULT 'd365_research',
  ADD COLUMN IF NOT EXISTS confirmation_status text NOT NULL DEFAULT 'not_confirmed',
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'not_reviewed',
  ADD COLUMN IF NOT EXISTS last_verified_date date,
  ADD COLUMN IF NOT EXISTS information_status text NOT NULL DEFAULT 'compiled',
  ADD COLUMN IF NOT EXISTS premium_product boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_d365 boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS publish_businesscentral boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_d365guide boolean NOT NULL DEFAULT false;

-- Interna leverantörsuppgifter (kontakt, avtalsstatus) hålls utanför den publika tabellen.
CREATE TABLE IF NOT EXISTS public.isv_vendor_internal (
  vendor_slug text PRIMARY KEY,
  contact_name text,
  contact_email text,
  buyer_opportunity_agreement_status text NOT NULL DEFAULT 'none',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.isv_vendor_internal TO service_role;
ALTER TABLE public.isv_vendor_internal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to isv vendor internal" ON public.isv_vendor_internal
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Självservice per leverantör: inbjudan kan gälla en produkt eller hela leverantören.
ALTER TABLE public.isv_invitations
  ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT 'solution',
  ADD COLUMN IF NOT EXISTS vendor_slug text;
ALTER TABLE public.isv_submissions
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'solution_update',
  ADD COLUMN IF NOT EXISTS vendor_slug text,
  ADD COLUMN IF NOT EXISTS payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS confirm_information boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS request_publication boolean NOT NULL DEFAULT false;

-- Publik informationsstatus härleds alltid ur verifiering och bekräftelse.
-- Premium, avtal eller källa kan aldrig göra en post verifierad, och leverantör/produkt påverkar inte varandra.
CREATE OR REPLACE FUNCTION public.isv_information_status_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE src text;
BEGIN
  IF TG_TABLE_NAME = 'isv_vendors' THEN
    src := NEW.profile_source;
    IF NEW.publication_status NOT IN ('draft','submitted','published','hidden') THEN
      RAISE EXCEPTION 'Ogiltig publiceringsstatus: %', NEW.publication_status;
    END IF;
  ELSE
    src := NEW.product_source;
  END IF;
  IF src NOT IN ('d365_research','d365_ai_research','vendor_submitted','mixed') THEN
    RAISE EXCEPTION 'Ogiltig källa: %', src;
  END IF;
  IF NEW.confirmation_status NOT IN ('not_confirmed','confirmed') THEN
    RAISE EXCEPTION 'Ogiltig bekräftelsestatus: %', NEW.confirmation_status;
  END IF;
  IF NEW.verification_status NOT IN ('not_reviewed','reviewed','partially_verified','verified','verification_expired') THEN
    RAISE EXCEPTION 'Ogiltig verifieringsstatus: %', NEW.verification_status;
  END IF;
  IF NEW.verification_status = 'verified' AND NEW.last_verified_date IS NULL THEN
    NEW.last_verified_date := current_date;
  END IF;
  NEW.information_status := CASE
    WHEN NEW.verification_status = 'verified' THEN 'verified'
    WHEN NEW.confirmation_status = 'confirmed' THEN 'vendor_confirmed'
    ELSE 'compiled' END;
  RETURN NEW;
END $$;

CREATE TRIGGER isv_vendors_information_status
  BEFORE INSERT OR UPDATE ON public.isv_vendors
  FOR EACH ROW EXECUTE FUNCTION public.isv_information_status_validate();
CREATE TRIGGER isv_solutions_information_status
  BEFORE INSERT OR UPDATE ON public.isv_solutions
  FOR EACH ROW EXECUTE FUNCTION public.isv_information_status_validate();

CREATE OR REPLACE FUNCTION public.isv_vendor_internal_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.buyer_opportunity_agreement_status NOT IN ('none','offered','signed','ended') THEN
    RAISE EXCEPTION 'Ogiltig avtalsstatus: %', NEW.buyer_opportunity_agreement_status;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER isv_vendor_internal_validate
  BEFORE INSERT OR UPDATE ON public.isv_vendor_internal
  FOR EACH ROW EXECUTE FUNCTION public.isv_vendor_internal_validate();

-- Startläge enligt beslut 2026-10: alla befintliga leverantörer och produkter är Sammanställd av d365.se.
UPDATE public.isv_vendors SET information_status = 'compiled';
UPDATE public.isv_solutions SET information_status = 'compiled';