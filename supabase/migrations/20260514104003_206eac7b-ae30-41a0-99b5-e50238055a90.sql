CREATE TABLE public.semrush_monthly_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL UNIQUE,
  organic_traffic integer,
  organic_keywords integer,
  authority_score numeric,
  backlinks integer,
  referring_domains integer,
  top_keywords jsonb DEFAULT '[]'::jsonb,
  top_pages jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.semrush_monthly_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage semrush stats"
  ON public.semrush_monthly_stats
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_semrush_monthly_stats_updated_at
  BEFORE UPDATE ON public.semrush_monthly_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_partner_profile_views_slug_date ON public.partner_profile_views (partner_slug, viewed_at DESC);