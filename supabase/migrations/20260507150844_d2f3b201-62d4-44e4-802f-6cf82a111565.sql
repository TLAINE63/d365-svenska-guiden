CREATE TABLE public.ai_usage_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash text NOT NULL,
  endpoint text NOT NULL,
  usage_day date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_lookup ON public.ai_usage_log (ip_hash, endpoint, usage_day);
CREATE INDEX idx_ai_usage_day ON public.ai_usage_log (usage_day);

ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage ai usage log"
ON public.ai_usage_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);