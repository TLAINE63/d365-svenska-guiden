CREATE TABLE public.partner_filter_exposures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_slug text NOT NULL,
  partner_id uuid,
  page_path text NOT NULL,
  filter_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  session_id text,
  ip_anonymized text,
  user_agent text,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_partner_filter_exposures_slug_time ON public.partner_filter_exposures (partner_slug, viewed_at DESC);
CREATE INDEX idx_partner_filter_exposures_time ON public.partner_filter_exposures (viewed_at DESC);

ALTER TABLE public.partner_filter_exposures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages filter exposures"
  ON public.partner_filter_exposures
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Block anon access to filter exposures"
  ON public.partner_filter_exposures
  FOR SELECT
  TO anon
  USING (false);