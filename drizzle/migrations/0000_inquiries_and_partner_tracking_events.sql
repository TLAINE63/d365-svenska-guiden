CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source_site text NOT NULL DEFAULT 'd365.se',
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('partner','kortlista','fraga')),
  contact_name text NOT NULL, email text NOT NULL, company text NOT NULL,
  role text, phone text, product_area text, timeframe text, help_with text, message text,
  project jsonb, include_project boolean DEFAULT true, privacy_ack boolean NOT NULL,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  referrer text, landing_page text, session_id text
);
CREATE TABLE public.inquiry_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  inquiry_id uuid NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  partner_slug text NOT NULL, share_consent boolean NOT NULL, consent_text text NOT NULL,
  status text DEFAULT 'skickad', status_token text UNIQUE, status_updated_at timestamptz
);
CREATE TABLE public.partner_tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source_site text NOT NULL DEFAULT 'd365.se',
  event_name text NOT NULL, partner_slug text, page_path text, session_id text, product_area text,
  utm_source text, utm_medium text, utm_campaign text, metadata jsonb
);
CREATE INDEX ON public.partner_tracking_events (partner_slug, created_at);
CREATE INDEX ON public.inquiry_partners (partner_slug);
GRANT INSERT ON public.inquiries, public.inquiry_partners, public.partner_tracking_events TO anon, authenticated;
GRANT SELECT ON public.inquiries, public.inquiry_partners, public.partner_tracking_events TO authenticated;
GRANT ALL ON public.inquiries, public.inquiry_partners, public.partner_tracking_events TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tracking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert inquiries" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (privacy_ack = true);
CREATE POLICY "insert inquiry partners" ON public.inquiry_partners FOR INSERT TO anon, authenticated WITH CHECK (share_consent = true);
CREATE POLICY "insert tracking events" ON public.partner_tracking_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read inquiries" ON public.inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins read inquiry partners" ON public.inquiry_partners FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins read tracking events" ON public.partner_tracking_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));