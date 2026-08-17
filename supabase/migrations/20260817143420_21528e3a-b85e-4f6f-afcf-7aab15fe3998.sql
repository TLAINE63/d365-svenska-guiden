ALTER TABLE public.isv_solution_overrides
  ADD COLUMN IF NOT EXISTS products text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS industries text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS vendor_website text,
  ADD COLUMN IF NOT EXISTS vendor_contact_name text,
  ADD COLUMN IF NOT EXISTS vendor_contact_email text,
  ADD COLUMN IF NOT EXISTS vendor_updated_at timestamptz;

CREATE TABLE public.isv_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solution_id text NOT NULL,
  solution_name text NOT NULL,
  vendor_name text,
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by text
);

GRANT ALL ON public.isv_invitations TO service_role;
ALTER TABLE public.isv_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to isv invitations"
  ON public.isv_invitations FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE TABLE public.isv_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.isv_invitations(id) ON DELETE CASCADE,
  solution_id text NOT NULL,
  short_description text,
  what text,
  when_fits text,
  use_cases text[] NOT NULL DEFAULT '{}',
  combos text[] NOT NULL DEFAULT '{}',
  products text[] NOT NULL DEFAULT '{}',
  industries text[] NOT NULL DEFAULT '{}',
  vendor_website text,
  contact_name text,
  contact_email text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

GRANT ALL ON public.isv_submissions TO service_role;
ALTER TABLE public.isv_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to isv submissions"
  ON public.isv_submissions FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE INDEX idx_isv_invitations_token ON public.isv_invitations(token);
CREATE INDEX idx_isv_submissions_solution ON public.isv_submissions(solution_id);