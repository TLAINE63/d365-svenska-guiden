
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  company TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  background JSONB NOT NULL DEFAULT '{}'::jsonb,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  dimension_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  free_text TEXT,
  followup_preference TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb
);

GRANT INSERT ON public.assessments TO anon;
GRANT INSERT ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an assessment"
ON public.assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Service role manages assessments"
ON public.assessments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX idx_assessments_created_at ON public.assessments(created_at DESC);
