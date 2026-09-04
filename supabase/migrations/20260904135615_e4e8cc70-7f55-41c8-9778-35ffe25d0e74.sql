CREATE TABLE IF NOT EXISTS public.partner_report_monthly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES public.partners(id) ON DELETE SET NULL,
  partner_slug text NOT NULL,
  partner_name text NOT NULL DEFAULT '',
  period_month date NOT NULL,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  computed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_slug, period_month)
);

GRANT ALL ON public.partner_report_monthly TO service_role;

ALTER TABLE public.partner_report_monthly ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS partner_report_monthly_month_idx
  ON public.partner_report_monthly (period_month DESC);