CREATE TABLE public.site_backlink_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL DEFAULT 'd365.se',
  captured_at timestamptz NOT NULL DEFAULT now(),
  referring_domains integer,
  backlinks integer,
  authority_score numeric,
  follows integer,
  nofollows integer,
  top_domains jsonb NOT NULL DEFAULT '[]'::jsonb,
  hidden_domains text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_backlink_snapshots TO anon;
GRANT SELECT ON public.site_backlink_snapshots TO authenticated;
GRANT ALL ON public.site_backlink_snapshots TO service_role;

ALTER TABLE public.site_backlink_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Backlink snapshots are publicly readable"
ON public.site_backlink_snapshots
FOR SELECT
USING (true);

CREATE INDEX idx_site_backlink_snapshots_domain_captured
ON public.site_backlink_snapshots (domain, captured_at DESC);

CREATE TRIGGER update_site_backlink_snapshots_updated_at
BEFORE UPDATE ON public.site_backlink_snapshots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();