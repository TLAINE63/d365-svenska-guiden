CREATE TABLE public.result_summary_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  email text NOT NULL,
  tool text NOT NULL,
  lines jsonb NOT NULL DEFAULT '[]'::jsonb,
  follow_up boolean NOT NULL DEFAULT false,
  source_page text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  confirmed_at timestamptz
);
REVOKE ALL ON public.result_summary_requests FROM anon, authenticated;
GRANT ALL ON public.result_summary_requests TO service_role;
ALTER TABLE public.result_summary_requests ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.result_summary_requests IS 'Double opt-in for send-result-summary: content is only emailed after the recipient confirms via a one-time token. Service role only, no policies.';
CREATE INDEX result_summary_requests_email_created_idx ON public.result_summary_requests (email, created_at);