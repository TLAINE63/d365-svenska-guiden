-- Create table for partner change requests
CREATE TABLE public.partner_change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  requester_email TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  changes JSONB NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT
);

-- Enable RLS
ALTER TABLE public.partner_change_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert change requests (public form)
CREATE POLICY "Anyone can submit change requests"
ON public.partner_change_requests
FOR INSERT
WITH CHECK (true);

-- Only service role can read/update/delete (admin only)
CREATE POLICY "Service role can read change requests"
ON public.partner_change_requests
FOR SELECT
USING (true);

CREATE POLICY "Service role can update change requests"
ON public.partner_change_requests
FOR UPDATE
USING (true);

CREATE POLICY "Service role can delete change requests"
ON public.partner_change_requests
FOR DELETE
USING (true);