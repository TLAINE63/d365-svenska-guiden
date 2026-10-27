CREATE TABLE public.underlag_forward_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  assessment_type text NOT NULL,
  source_page text,
  partner_slugs text[] NOT NULL DEFAULT '{}',
  products text[] NOT NULL DEFAULT '{}',
  industry text,
  company_size text,
  underlag_summary text NOT NULL,
  result_url text,
  pdf_path text,
  pdf_filename text,
  lead_id uuid,
  reviewed_at timestamptz,
  review_note text,
  delivered integer,
  total integer
);

GRANT ALL ON public.underlag_forward_requests TO service_role;

ALTER TABLE public.underlag_forward_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.underlag_forward_requests_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status NOT IN ('pending','approved','rejected') THEN
    RAISE EXCEPTION 'Ogiltig status: %', NEW.status;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status <> 'pending' AND NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Förfrågan är redan hanterad';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER underlag_forward_requests_validate
BEFORE INSERT OR UPDATE ON public.underlag_forward_requests
FOR EACH ROW EXECUTE FUNCTION public.underlag_forward_requests_validate();

CREATE INDEX underlag_forward_requests_status_idx ON public.underlag_forward_requests (status, created_at DESC);