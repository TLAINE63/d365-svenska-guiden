-- Create table for partner invitations
CREATE TABLE public.partner_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  email TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT
);

-- Create table for submitted partner data (before approval)
CREATE TABLE public.partner_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES public.partner_invitations(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  
  -- Partner profile fields
  name TEXT NOT NULL,
  description TEXT,
  website TEXT NOT NULL,
  logo_url TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  applications TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  secondary_industries TEXT[] DEFAULT '{}',
  geography TEXT[] DEFAULT '{}',
  product_filters JSONB DEFAULT '{}',
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.partner_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for partner_invitations
-- Service role can do everything
CREATE POLICY "Service role can manage invitations"
ON public.partner_invitations FOR ALL
USING (true)
WITH CHECK (true);

-- Public can read their own invitation by token (for the form)
CREATE POLICY "Anyone can read invitation by token"
ON public.partner_invitations FOR SELECT
USING (true);

-- RLS policies for partner_submissions
-- Service role can do everything
CREATE POLICY "Service role can manage submissions"
ON public.partner_submissions FOR ALL
USING (true)
WITH CHECK (true);

-- Public can insert submissions (when filling the form)
CREATE POLICY "Anyone can submit partner data"
ON public.partner_submissions FOR INSERT
WITH CHECK (true);

-- Create index for token lookups
CREATE INDEX idx_partner_invitations_token ON public.partner_invitations(token);
CREATE INDEX idx_partner_invitations_status ON public.partner_invitations(status);