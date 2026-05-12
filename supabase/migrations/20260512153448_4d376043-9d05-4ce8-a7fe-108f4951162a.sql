
-- Snitcher visit data (one row per identified company-session)
CREATE TABLE public.snitcher_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_uuid TEXT NOT NULL,
  organisation_uuid TEXT NOT NULL,
  session_uuid TEXT NOT NULL,
  company_name TEXT,
  company_domain TEXT,
  company_industry TEXT,
  company_size TEXT,
  company_country TEXT,
  company_logo_url TEXT,
  session_started_at TIMESTAMPTZ,
  session_ended_at TIMESTAMPTZ,
  visited_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  partner_slugs TEXT[] NOT NULL DEFAULT '{}',
  raw_data JSONB,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_uuid)
);

CREATE INDEX idx_snitcher_visits_partner_slugs ON public.snitcher_visits USING GIN (partner_slugs);
CREATE INDEX idx_snitcher_visits_session_started ON public.snitcher_visits (session_started_at DESC);
CREATE INDEX idx_snitcher_visits_org ON public.snitcher_visits (organisation_uuid);

ALTER TABLE public.snitcher_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage snitcher visits"
ON public.snitcher_visits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Partner report drafts (one per partner per period, awaiting admin approval)
CREATE TABLE public.partner_report_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID,
  partner_slug TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  recipient_email TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  subject TEXT NOT NULL,
  intro_text TEXT,
  companies JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded_organisation_uuids TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending_review',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (partner_slug, period_start)
);

CREATE INDEX idx_partner_report_drafts_status ON public.partner_report_drafts (status, period_start DESC);

ALTER TABLE public.partner_report_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage report drafts"
ON public.partner_report_drafts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE TRIGGER trg_report_drafts_updated_at
BEFORE UPDATE ON public.partner_report_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
