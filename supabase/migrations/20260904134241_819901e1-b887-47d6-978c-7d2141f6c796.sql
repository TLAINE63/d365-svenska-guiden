CREATE TABLE public.buyer_tool_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool text NOT NULL CHECK (tool IN ('behovsanalys','kravspecifikation','jamforelse')),
  status text NOT NULL CHECK (status IN ('paborjad','slutford','avbruten')),
  product_key text,
  industry text,
  company_size text,
  matched_partner_ids uuid[] NOT NULL DEFAULT '{}',
  session_hash text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.buyer_tool_events TO service_role;

ALTER TABLE public.buyer_tool_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_buyer_tool_events_occurred_at ON public.buyer_tool_events (occurred_at DESC);
CREATE INDEX idx_buyer_tool_events_tool_status ON public.buyer_tool_events (tool, status, occurred_at DESC);
CREATE INDEX idx_buyer_tool_events_partners ON public.buyer_tool_events USING gin (matched_partner_ids);