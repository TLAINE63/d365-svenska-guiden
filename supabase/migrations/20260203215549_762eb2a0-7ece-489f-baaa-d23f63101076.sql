-- First, create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create partner_events table for partner events and webinars
CREATE TABLE public.partner_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
    invitation_token TEXT NULL,
    
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
    
    -- Status
    is_published BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view published events (for public display on partner profile)
CREATE POLICY "Anyone can view published events" 
ON public.partner_events 
FOR SELECT 
USING (is_published = true);

-- Service role can manage all events (for admin)
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