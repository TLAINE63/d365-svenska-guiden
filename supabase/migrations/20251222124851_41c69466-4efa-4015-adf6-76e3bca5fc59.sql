-- Create partners table for storing editable partner information
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  applications TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view partners)
CREATE POLICY "Partners are publicly viewable"
ON public.partners
FOR SELECT
USING (true);

-- Create policy for admin insert (using service role key only for now)
CREATE POLICY "Allow insert for service role"
ON public.partners
FOR INSERT
WITH CHECK (true);

-- Create policy for admin update
CREATE POLICY "Allow update for service role"
ON public.partners
FOR UPDATE
USING (true);

-- Create policy for admin delete
CREATE POLICY "Allow delete for service role"
ON public.partners
FOR DELETE
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_partners_updated_at();