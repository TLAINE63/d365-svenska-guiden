
CREATE TABLE IF NOT EXISTS public.seo_keyword_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  snapshot_date date NOT NULL,
  position numeric(6,2),
  previous_position numeric(6,2),
  search_volume integer,
  estimated_traffic integer,
  cpc numeric(8,2),
  url text,
  database text NOT NULL DEFAULT 'se',
  source text NOT NULL DEFAULT 'semrush',
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (keyword, snapshot_date, database)
);

CREATE INDEX IF NOT EXISTS idx_seo_keyword_daily_keyword ON public.seo_keyword_daily (keyword, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_seo_keyword_daily_date ON public.seo_keyword_daily (snapshot_date DESC);

GRANT ALL ON public.seo_keyword_daily TO service_role;

ALTER TABLE public.seo_keyword_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages daily keyword rankings"
  ON public.seo_keyword_daily
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
