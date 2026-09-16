CREATE TABLE public.partner_public_insights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  generated_market_profile text,
  observed_topics text[] NOT NULL DEFAULT '{}',
  observed_products text[] NOT NULL DEFAULT '{}',
  observed_industries text[] NOT NULL DEFAULT '{}',
  articles_count integer NOT NULL DEFAULT 0,
  webinars_count integer NOT NULL DEFAULT 0,
  case_studies_count integer NOT NULL DEFAULT 0,
  latest_content jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_updated timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id)
);

GRANT SELECT ON public.partner_public_insights TO anon;
GRANT SELECT ON public.partner_public_insights TO authenticated;
GRANT ALL ON public.partner_public_insights TO service_role;

ALTER TABLE public.partner_public_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publikt innehåll kan läsas av alla"
  ON public.partner_public_insights FOR SELECT
  USING (true);

CREATE TRIGGER partner_public_insights_set_updated_at
  BEFORE UPDATE ON public.partner_public_insights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();