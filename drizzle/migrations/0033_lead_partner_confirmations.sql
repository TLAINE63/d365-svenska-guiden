CREATE TABLE public.lead_partner_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  confirmed_at timestamptz
);
REVOKE ALL ON public.lead_partner_confirmations FROM anon, authenticated;
GRANT ALL ON public.lead_partner_confirmations TO service_role;
ALTER TABLE public.lead_partner_confirmations ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.lead_partner_confirmations IS 'Double opt-in for submit-lead partner requests: partners are emailed only after the buyer confirms via a one-time token. Service role only, no policies.';