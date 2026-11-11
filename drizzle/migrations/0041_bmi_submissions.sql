CREATE TABLE public.bmi_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 2,
  b0 text NOT NULL,
  b5 integer NOT NULL,
  phase text NOT NULL,
  b1 text,
  b2 text,
  b3 text,
  b4 jsonb NOT NULL DEFAULT '[]'::jsonb,
  answers jsonb NOT NULL,
  section_scores jsonb NOT NULL,
  total integer NOT NULL,
  level text NOT NULL
);
GRANT ALL ON public.bmi_submissions TO service_role;
ALTER TABLE public.bmi_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages bmi submissions" ON public.bmi_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX bmi_submissions_segment_idx ON public.bmi_submissions (b0, b1, b2);
COMMENT ON TABLE public.bmi_submissions IS 'Beslutsmognadsindex v2: anonymous self-assessments written only by the bmi-score function; v1 answers stay in assessments.';