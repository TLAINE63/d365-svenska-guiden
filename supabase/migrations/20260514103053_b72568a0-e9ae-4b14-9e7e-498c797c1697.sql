CREATE TABLE public.seo_keyword_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  month DATE NOT NULL,
  position NUMERIC(6,2),
  ctr NUMERIC(5,2),
  impressions INTEGER,
  clicks INTEGER,
  index_status TEXT NOT NULL DEFAULT 'indexed' CHECK (index_status IN ('indexed','not_indexed','partial')),
  target_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (keyword, month)
);

CREATE INDEX idx_seo_keyword_rankings_keyword ON public.seo_keyword_rankings (keyword);
CREATE INDEX idx_seo_keyword_rankings_month ON public.seo_keyword_rankings (month DESC);

ALTER TABLE public.seo_keyword_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage seo rankings"
ON public.seo_keyword_rankings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_seo_keyword_rankings_updated_at
BEFORE UPDATE ON public.seo_keyword_rankings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();