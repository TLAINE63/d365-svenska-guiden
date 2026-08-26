CREATE TABLE public.partner_engagement_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid REFERENCES public.partners(id) ON DELETE CASCADE,
  partner_slug text NOT NULL,
  event_name text NOT NULL,
  event_level smallint NOT NULL DEFAULT 1,
  visitor_id text,
  session_id text,
  page_path text,
  intent_track text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_anonymized text,
  user_agent text,
  occurred_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_pee_partner_time ON public.partner_engagement_events (partner_slug, occurred_at DESC);
CREATE INDEX idx_pee_event_time ON public.partner_engagement_events (event_name, occurred_at DESC);
CREATE INDEX idx_pee_visitor ON public.partner_engagement_events (visitor_id, occurred_at DESC);

GRANT ALL ON public.partner_engagement_events TO service_role;

ALTER TABLE public.partner_engagement_events ENABLE ROW LEVEL SECURITY;