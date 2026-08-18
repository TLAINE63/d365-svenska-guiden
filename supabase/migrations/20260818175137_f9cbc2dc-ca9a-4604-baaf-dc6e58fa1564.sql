CREATE TABLE public.partner_performance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES public.partners(id) ON DELETE CASCADE,
  partner_slug text NOT NULL,
  partner_name text NOT NULL,
  period_month date NOT NULL,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  admin_comment text,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  approved_at timestamptz,
  sent_at timestamptz,
  recipient_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_slug, period_month)
);

GRANT ALL ON public.partner_performance_reports TO service_role;

ALTER TABLE public.partner_performance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages performance reports"
ON public.partner_performance_reports
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE TRIGGER partner_performance_reports_updated_at
BEFORE UPDATE ON public.partner_performance_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();