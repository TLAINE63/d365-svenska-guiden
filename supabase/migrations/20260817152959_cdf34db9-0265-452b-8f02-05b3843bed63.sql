CREATE TABLE public.isv_solutions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solution_id text NOT NULL UNIQUE,
  name text NOT NULL,
  vendor text NOT NULL,
  short_description text,
  category text NOT NULL DEFAULT 'Integration / iPaaS',
  type text NOT NULL DEFAULT 'BC-native (ISV)',
  tier text NOT NULL DEFAULT 'Tier 2',
  tags text[] NOT NULL DEFAULT '{}',
  industries text[] NOT NULL DEFAULT '{}',
  geo text[] NOT NULL DEFAULT '{}',
  what text,
  use_cases text[] NOT NULL DEFAULT '{}',
  when_fits text,
  combos text[] NOT NULL DEFAULT '{}',
  products text[] NOT NULL DEFAULT '{}',
  industry_focus text[] NOT NULL DEFAULT '{}',
  partner_slugs text[] NOT NULL DEFAULT '{}',
  vendor_website text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.isv_solutions TO anon, authenticated;
GRANT ALL ON public.isv_solutions TO service_role;

ALTER TABLE public.isv_solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publicerade ISV-lösningar är läsbara för alla"
ON public.isv_solutions FOR SELECT
USING (is_published = true);

CREATE TRIGGER isv_solutions_set_updated_at
BEFORE UPDATE ON public.isv_solutions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();