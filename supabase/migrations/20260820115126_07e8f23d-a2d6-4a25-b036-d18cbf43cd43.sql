CREATE TABLE public.not_found_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  full_url text,
  referrer text,
  user_agent text,
  session_id text,
  ip_anonymized text,
  geo_country text,
  geo_country_code text,
  is_bot boolean NOT NULL DEFAULT false,
  resolved boolean NOT NULL DEFAULT false,
  resolved_note text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_not_found_events_occurred_at ON public.not_found_events (occurred_at DESC);
CREATE INDEX idx_not_found_events_path ON public.not_found_events (path);

GRANT ALL ON public.not_found_events TO service_role;

ALTER TABLE public.not_found_events ENABLE ROW LEVEL SECURITY;