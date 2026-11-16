CREATE TABLE public.forfragningar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  produkt text NOT NULL,
  bransch text,
  antal_anstallda text NOT NULL,
  tidplan text NOT NULL,
  beskrivning text NOT NULL,
  namn text NOT NULL,
  roll text,
  email text NOT NULL,
  samtycke boolean NOT NULL DEFAULT false,
  prefill jsonb NOT NULL DEFAULT '{}'::jsonb,
  partner_slugs text[] NOT NULL DEFAULT '{}',
  kalla text,
  source_page text,
  landing_page text,
  session_pages text[],
  status text NOT NULL DEFAULT 'ny'
);
GRANT ALL ON public.forfragningar TO service_role;
GRANT SELECT ON public.forfragningar TO authenticated;
ALTER TABLE public.forfragningar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read forfragningar" ON public.forfragningar FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));