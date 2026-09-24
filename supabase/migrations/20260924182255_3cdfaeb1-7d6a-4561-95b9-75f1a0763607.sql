ALTER TABLE public.funnel_events
  ADD COLUMN IF NOT EXISTS step text,
  ADD COLUMN IF NOT EXISTS landing_path text,
  ADD COLUMN IF NOT EXISTS traffic_source text,
  ADD COLUMN IF NOT EXISTS tool text,
  ADD COLUMN IF NOT EXISTS device text,
  ADD COLUMN IF NOT EXISTS partner_slug text;
CREATE INDEX IF NOT EXISTS funnel_events_step_occurred_idx ON public.funnel_events (step, occurred_at);
CREATE INDEX IF NOT EXISTS funnel_events_session_idx ON public.funnel_events (session_id);