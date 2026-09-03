ALTER TABLE public.partner_news
  ADD COLUMN IF NOT EXISTS ingest_method text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS verbatim boolean NOT NULL DEFAULT false;

DO $$ BEGIN
  ALTER TABLE public.partner_news
    ADD CONSTRAINT partner_news_ingest_method_check
    CHECK (ingest_method IN ('manual','url','feed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS partner_news_ingest_method_idx ON public.partner_news (ingest_method);