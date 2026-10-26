ALTER TABLE public.knowledge_articles ADD COLUMN IF NOT EXISTS partner_slugs text[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS knowledge_articles_partner_slugs_idx ON public.knowledge_articles USING gin (partner_slugs);
UPDATE public.knowledge_articles SET partner_slugs = ARRAY['4ps-sweden'] WHERE slug = 'affarssystem-bygg-installation';