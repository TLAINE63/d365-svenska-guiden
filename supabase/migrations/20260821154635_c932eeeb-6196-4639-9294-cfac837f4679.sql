CREATE TABLE public.d365_video_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text NOT NULL UNIQUE,
  channel_name text NOT NULL,
  channel_url text,
  is_active boolean NOT NULL DEFAULT true,
  last_fetched_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  items_imported integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.d365_video_sources TO service_role;
ALTER TABLE public.d365_video_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "d365_video_sources service only" ON public.d365_video_sources FOR ALL USING (false) WITH CHECK (false);

CREATE TABLE public.d365_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  channel_id text,
  channel_name text,
  published_at timestamptz,
  duration text,
  duration_seconds integer,
  thumbnail_url text,
  language text,
  product_groups text[] NOT NULL DEFAULT '{}',
  question_types text[] NOT NULL DEFAULT '{}',
  summary_sv text,
  relevance_score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  source_id uuid REFERENCES public.d365_video_sources(id) ON DELETE SET NULL,
  ai_classified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.d365_videos TO anon, authenticated;
GRANT ALL ON public.d365_videos TO service_role;
ALTER TABLE public.d365_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published videos are public" ON public.d365_videos FOR SELECT USING (status = 'published');

CREATE INDEX d365_videos_status_idx ON public.d365_videos (status);
CREATE INDEX d365_videos_products_idx ON public.d365_videos USING gin (product_groups);
CREATE INDEX d365_videos_published_idx ON public.d365_videos (published_at DESC);

CREATE TABLE public.d365_video_ingest_state (
  id integer PRIMARY KEY DEFAULT 1,
  is_running boolean NOT NULL DEFAULT false,
  lease_until timestamptz,
  paused_reason text,
  paused_at timestamptz,
  last_run_at timestamptz,
  last_result text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT d365_video_ingest_state_single_row CHECK (id = 1)
);
GRANT ALL ON public.d365_video_ingest_state TO service_role;
ALTER TABLE public.d365_video_ingest_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "d365_video_ingest_state service only" ON public.d365_video_ingest_state FOR ALL USING (false) WITH CHECK (false);
INSERT INTO public.d365_video_ingest_state (id) VALUES (1);

CREATE TRIGGER d365_videos_set_updated_at BEFORE UPDATE ON public.d365_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER d365_video_sources_set_updated_at BEFORE UPDATE ON public.d365_video_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER d365_video_ingest_state_set_updated_at BEFORE UPDATE ON public.d365_video_ingest_state FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();