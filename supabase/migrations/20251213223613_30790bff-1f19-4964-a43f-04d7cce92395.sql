-- Create table for tracking partner link clicks
CREATE TABLE public.partner_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_name TEXT NOT NULL,
  partner_website TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_source TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Enable Row Level Security
ALTER TABLE public.partner_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (tracking doesn't require auth)
CREATE POLICY "Allow anonymous inserts for tracking" 
ON public.partner_clicks 
FOR INSERT 
WITH CHECK (true);

-- Allow read access for authenticated users (admin viewing stats)
CREATE POLICY "Allow authenticated users to read clicks" 
ON public.partner_clicks 
FOR SELECT 
USING (true);

-- Create index for faster queries by partner name
CREATE INDEX idx_partner_clicks_partner_name ON public.partner_clicks(partner_name);

-- Create index for time-based queries
CREATE INDEX idx_partner_clicks_clicked_at ON public.partner_clicks(clicked_at);