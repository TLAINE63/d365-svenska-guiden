CREATE TABLE public.funnel_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page_path TEXT,
  step_number INT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_anonymized TEXT,
  user_agent TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage funnel events"
ON public.funnel_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Block anon access to funnel events"
ON public.funnel_events
FOR SELECT
TO anon
USING (false);

CREATE INDEX idx_funnel_events_occurred_at ON public.funnel_events (occurred_at DESC);
CREATE INDEX idx_funnel_events_type_occurred ON public.funnel_events (event_type, occurred_at DESC);
CREATE INDEX idx_funnel_events_session ON public.funnel_events (session_id);
CREATE INDEX idx_funnel_events_name ON public.funnel_events (event_name);