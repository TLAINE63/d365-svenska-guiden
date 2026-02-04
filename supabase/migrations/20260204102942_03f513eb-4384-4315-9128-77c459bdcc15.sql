-- Create table for visitor analytics with geographic data
CREATE TABLE public.visitor_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  -- Geographic data
  geo_country TEXT,
  geo_country_code TEXT,
  geo_region TEXT,
  geo_city TEXT,
  -- Engagement data
  time_on_page_seconds INTEGER,
  is_bounce BOOLEAN DEFAULT true,
  -- Anonymized IP for deduplication
  ip_anonymized TEXT
);

-- Create indexes for efficient querying
CREATE INDEX idx_visitor_analytics_visited_at ON public.visitor_analytics(visited_at DESC);
CREATE INDEX idx_visitor_analytics_country_code ON public.visitor_analytics(geo_country_code);
CREATE INDEX idx_visitor_analytics_page_path ON public.visitor_analytics(page_path);
CREATE INDEX idx_visitor_analytics_session_id ON public.visitor_analytics(session_id);

-- Enable RLS
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for tracking)
CREATE POLICY "Anyone can insert visitor analytics"
ON public.visitor_analytics
FOR INSERT
WITH CHECK (true);

-- Only service role can read (for admin dashboard)
CREATE POLICY "Service role can read visitor analytics"
ON public.visitor_analytics
FOR SELECT
USING (true);

-- Add comment
COMMENT ON TABLE public.visitor_analytics IS 'Tracks page visits with geographic data for Swedish visitor analysis';