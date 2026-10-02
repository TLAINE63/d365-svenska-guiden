CREATE TABLE public.newsletter_content (
  id text PRIMARY KEY DEFAULT 'current',
  subject text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_content ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.newsletter_content FROM anon, authenticated;
GRANT ALL ON public.newsletter_content TO service_role;