CREATE TABLE public.unprofiled_partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  note text,
  website text,
  display_order integer NOT NULL DEFAULT 100,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.unprofiled_partners TO anon, authenticated;
GRANT ALL ON public.unprofiled_partners TO service_role;

ALTER TABLE public.unprofiled_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible unprofiled partners"
  ON public.unprofiled_partners FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Service role manages unprofiled partners"
  ON public.unprofiled_partners FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_unprofiled_partners_updated_at
  BEFORE UPDATE ON public.unprofiled_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();