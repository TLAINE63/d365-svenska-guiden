-- Create table for tracking partner profile views (card clicks + direct visits)
CREATE TABLE public.partner_profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  partner_slug TEXT NOT NULL,
  view_type TEXT NOT NULL CHECK (view_type IN ('card_click', 'profile_visit')),
  page_source TEXT,
  referrer TEXT,
  ip_address_anonymized TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for efficient per-partner aggregation
CREATE INDEX idx_partner_profile_views_partner_id ON public.partner_profile_views(partner_id);
CREATE INDEX idx_partner_profile_views_partner_slug ON public.partner_profile_views(partner_slug);
CREATE INDEX idx_partner_profile_views_viewed_at ON public.partner_profile_views(viewed_at DESC);

-- Enable RLS
ALTER TABLE public.partner_profile_views ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (edge functions handle inserts and admin reads)
CREATE POLICY "Service role can read profile views"
  ON public.partner_profile_views
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert profile views"
  ON public.partner_profile_views
  FOR INSERT
  TO service_role
  WITH CHECK (true);