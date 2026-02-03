-- Drop the existing partner_events table and recreate with proper structure
DROP TABLE IF EXISTS public.partner_events;

-- Create partner_event_tokens table for unique access links per partner
CREATE TABLE public.partner_event_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL UNIQUE,
    token TEXT NOT NULL DEFAULT encode(extensions.gen_random_bytes(32), 'hex') UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.partner_event_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can manage tokens
CREATE POLICY "Service role can manage event tokens" 
ON public.partner_event_tokens 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create partner_events table with approval workflow
CREATE TABLE public.partner_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
    
    -- Event details
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    end_time TIME,
    
    -- Location/Online
    is_online BOOLEAN NOT NULL DEFAULT true,
    location TEXT,
    event_link TEXT,
    
    -- Registration
    registration_link TEXT,
    registration_deadline DATE,
    
    -- Media
    image_url TEXT,
    
    -- Recording (after event)
    recording_url TEXT,
    recording_available BOOLEAN NOT NULL DEFAULT false,
    
    -- Approval workflow
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved events
CREATE POLICY "Anyone can view approved events" 
ON public.partner_events 
FOR SELECT 
USING (status = 'approved');

-- Service role can manage all events
CREATE POLICY "Service role can manage events" 
ON public.partner_events 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partner_events_updated_at
BEFORE UPDATE ON public.partner_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();