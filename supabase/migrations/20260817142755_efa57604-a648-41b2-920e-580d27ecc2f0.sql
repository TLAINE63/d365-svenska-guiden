CREATE TABLE public.isv_solution_overrides (
  solution_id text PRIMARY KEY,
  short_description text,
  what text,
  when_fits text,
  use_cases text[],
  combos text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.isv_solution_overrides TO anon;
GRANT SELECT ON public.isv_solution_overrides TO authenticated;
GRANT ALL ON public.isv_solution_overrides TO service_role;

ALTER TABLE public.isv_solution_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read isv overrides"
ON public.isv_solution_overrides FOR SELECT USING (true);

CREATE POLICY "Service role can manage isv overrides"
ON public.isv_solution_overrides FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER isv_solution_overrides_set_updated_at
BEFORE UPDATE ON public.isv_solution_overrides
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();