ALTER TABLE public.semrush_monthly_stats
  ADD COLUMN IF NOT EXISTS domain text NOT NULL DEFAULT 'd365.se';

UPDATE public.semrush_monthly_stats SET domain = 'd365.se' WHERE domain IS NULL OR domain = '';

ALTER TABLE public.semrush_monthly_stats DROP CONSTRAINT IF EXISTS semrush_monthly_stats_month_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'semrush_monthly_stats_domain_month_key'
  ) THEN
    ALTER TABLE public.semrush_monthly_stats
      ADD CONSTRAINT semrush_monthly_stats_domain_month_key UNIQUE (domain, month);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_semrush_monthly_stats_domain_month
  ON public.semrush_monthly_stats (domain, month DESC);