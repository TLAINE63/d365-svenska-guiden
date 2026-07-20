
-- Feed sources per partner for automatic ingestion
CREATE TABLE public.partner_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  feed_url TEXT NOT NULL,
  feed_type TEXT NOT NULL DEFAULT 'rss', -- rss | atom
  source_type TEXT NOT NULL DEFAULT 'linkedin', -- linkedin | webinar | blog
  default_news_type TEXT NOT NULL DEFAULT 'partnernyhet',
  default_product_areas TEXT[] NOT NULL DEFAULT ARRAY['ovrigt']::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_error TEXT,
  items_imported INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (partner_id, feed_url)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_feeds TO authenticated;
GRANT ALL ON public.partner_feeds TO service_role;

ALTER TABLE public.partner_feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages feeds"
  ON public.partner_feeds FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER trg_partner_feeds_updated_at
  BEFORE UPDATE ON public.partner_feeds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Dedup key on partner_news for ingested items
ALTER TABLE public.partner_news
  ADD COLUMN IF NOT EXISTS source_feed_id UUID REFERENCES public.partner_feeds(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_guid TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS partner_news_source_guid_uniq
  ON public.partner_news (partner_id, source_guid)
  WHERE source_guid IS NOT NULL;
