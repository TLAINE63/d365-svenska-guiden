CREATE TABLE public.ai_citation_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_month date NOT NULL,
  engine text NOT NULL,
  query_text text NOT NULL,
  mentioned boolean NOT NULL DEFAULT false,
  position_note text,
  source_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ai_citation_checks_month_idx ON public.ai_citation_checks (check_month DESC);

GRANT ALL ON public.ai_citation_checks TO service_role;

ALTER TABLE public.ai_citation_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to ai_citation_checks"
ON public.ai_citation_checks
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE TRIGGER update_ai_citation_checks_updated_at
BEFORE UPDATE ON public.ai_citation_checks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();