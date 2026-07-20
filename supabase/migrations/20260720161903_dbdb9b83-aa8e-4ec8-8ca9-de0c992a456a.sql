
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS attribution_news_id uuid REFERENCES public.partner_news(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attribution_source text;

CREATE INDEX IF NOT EXISTS leads_attribution_news_id_idx
  ON public.leads(attribution_news_id)
  WHERE attribution_news_id IS NOT NULL;
