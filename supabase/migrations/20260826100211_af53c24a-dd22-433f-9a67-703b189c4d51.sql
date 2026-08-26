CREATE TABLE public.crawler_hits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL,
  bot_label text NOT NULL,
  user_agent text,
  path text,
  referrer text,
  ip_prefix text,
  hit_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.crawler_hits TO service_role;

ALTER TABLE public.crawler_hits ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_crawler_hits_hit_at ON public.crawler_hits (hit_at DESC);
CREATE INDEX idx_crawler_hits_bot ON public.crawler_hits (bot_id, hit_at DESC);