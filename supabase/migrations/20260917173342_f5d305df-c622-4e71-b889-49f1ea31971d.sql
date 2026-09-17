ALTER TABLE public.partner_news ALTER COLUMN partner_id DROP NOT NULL;
ALTER TABLE public.partner_news ADD COLUMN IF NOT EXISTS source_org text NOT NULL DEFAULT 'partner';
ALTER TABLE public.partner_feeds ALTER COLUMN partner_id DROP NOT NULL;
ALTER TABLE public.partner_feeds ADD COLUMN IF NOT EXISTS source_org text NOT NULL DEFAULT 'partner';

ALTER TABLE public.partner_news DROP CONSTRAINT IF EXISTS partner_news_source_org_chk;
ALTER TABLE public.partner_news ADD CONSTRAINT partner_news_source_org_chk
  CHECK (source_org IN ('partner','microsoft') AND (source_org <> 'partner' OR partner_id IS NOT NULL));

ALTER TABLE public.partner_feeds DROP CONSTRAINT IF EXISTS partner_feeds_source_org_chk;
ALTER TABLE public.partner_feeds ADD CONSTRAINT partner_feeds_source_org_chk
  CHECK (source_org IN ('partner','microsoft') AND (source_org <> 'partner' OR partner_id IS NOT NULL));

INSERT INTO public.partner_feeds (partner_id, source_org, feed_url, feed_type, source_type, default_news_type, default_product_areas, is_active)
SELECT NULL, 'microsoft', v.url, 'rss', 'blog', 'produktnyhet', v.areas, true
FROM (VALUES
  ('https://www.microsoft.com/en-us/dynamics-365/blog/feed/', ARRAY['ovrigt']),
  ('https://www.microsoft.com/en-us/dynamics-365/blog/tag/business-central/feed/', ARRAY['business-central']),
  ('https://www.microsoft.com/en-us/dynamics-365/blog/tag/copilot/feed/', ARRAY['microsoft-ai'])
) AS v(url, areas)
WHERE NOT EXISTS (SELECT 1 FROM public.partner_feeds f WHERE f.feed_url = v.url);