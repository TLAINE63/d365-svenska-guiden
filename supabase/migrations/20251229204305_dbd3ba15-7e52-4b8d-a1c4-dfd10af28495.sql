-- Create leads table for capturing potential customer leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact information
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Qualification data
  company_size TEXT,
  industry TEXT,
  selected_product TEXT,
  
  -- Lead source tracking
  source_page TEXT,
  source_type TEXT DEFAULT 'cta',
  
  -- Additional context
  message TEXT,
  
  -- Lead management
  status TEXT NOT NULL DEFAULT 'new',
  assigned_partners TEXT[] DEFAULT '{}',
  admin_notes TEXT,
  forwarded_at TIMESTAMP WITH TIME ZONE,
  
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Only service role can read leads (admin access via edge function)
CREATE POLICY "Service role can read leads"
ON public.leads
FOR SELECT
USING (true);

-- Anyone can submit leads (public form)
CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Only service role can update leads
CREATE POLICY "Service role can update leads"
ON public.leads
FOR UPDATE
USING (true);

-- Only service role can delete leads
CREATE POLICY "Service role can delete leads"
ON public.leads
FOR DELETE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_partners_updated_at();