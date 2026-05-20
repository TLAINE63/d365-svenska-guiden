
-- 1) Lista över sökord vi övervakar
CREATE TABLE public.seo_tracked_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (keyword, target_url)
);

ALTER TABLE public.seo_tracked_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages tracked keywords"
ON public.seo_tracked_keywords
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE TRIGGER trg_seo_tracked_keywords_updated_at
BEFORE UPDATE ON public.seo_tracked_keywords
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Veckosnapshots per sökord
CREATE TABLE public.seo_keyword_weekly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text,
  week_start date NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  impressions integer NOT NULL DEFAULT 0,
  ctr numeric(6,4),
  position numeric(6,2),
  source text NOT NULL DEFAULT 'gsc',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX seo_keyword_weekly_unique
  ON public.seo_keyword_weekly (keyword, week_start, COALESCE(target_url, ''));

CREATE INDEX seo_keyword_weekly_keyword_idx
  ON public.seo_keyword_weekly (keyword, week_start DESC);

ALTER TABLE public.seo_keyword_weekly ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages weekly keyword stats"
ON public.seo_keyword_weekly
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
