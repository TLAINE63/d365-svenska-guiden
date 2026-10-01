CREATE TABLE public.buyer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL UNIQUE,
  company jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_erp jsonb NOT NULL DEFAULT '{}'::jsonb,
  scope jsonb NOT NULL DEFAULT '{}'::jsonb,
  fscm jsonb NOT NULL DEFAULT '{}'::jsonb,
  crm jsonb NOT NULL DEFAULT '{}'::jsonb,
  contact_center jsonb NOT NULL DEFAULT '{}'::jsonb,
  integrations jsonb NOT NULL DEFAULT '{}'::jsonb,
  project jsonb NOT NULL DEFAULT '{}'::jsonb,
  assessment jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.buyer_profiles TO authenticated;
GRANT ALL ON public.buyer_profiles TO service_role;
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read buyer profiles" ON public.buyer_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER buyer_profiles_set_updated_at BEFORE UPDATE ON public.buyer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.underlag_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid,
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text,
  consent boolean NOT NULL DEFAULT false,
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  underlag_text text NOT NULL DEFAULT '',
  buying_signal text,
  email_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.underlag_submissions TO authenticated;
GRANT ALL ON public.underlag_submissions TO service_role;
ALTER TABLE public.underlag_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read underlag submissions" ON public.underlag_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX underlag_submissions_email_created_idx ON public.underlag_submissions (lower(email), created_at DESC);