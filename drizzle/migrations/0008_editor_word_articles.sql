ALTER TABLE public.knowledge_articles
  ADD COLUMN IF NOT EXISTS body_html text,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS hero_caption text,
  ADD COLUMN IF NOT EXISTS article_section text,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reading_time_minutes integer,
  ADD COLUMN IF NOT EXISTS source_filename text;

COMMENT ON COLUMN public.knowledge_articles.body_html IS 'Sanerad HTML för helartiklar som redaktionen laddat upp från Word; visas på /artiklar/<slug>/.';