-- Add new columns for partner management: dates, fees, notes, contact person
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS contact_person text,
ADD COLUMN IF NOT EXISTS activation_date date,
ADD COLUMN IF NOT EXISTS monthly_fee decimal(10,2),
ADD COLUMN IF NOT EXISTS cancellation_date date,
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Add comments explaining the columns
COMMENT ON COLUMN public.partners.contact_person IS 'Name of the primary contact person at the partner';
COMMENT ON COLUMN public.partners.activation_date IS 'Date when the partner was/will be activated on the site';
COMMENT ON COLUMN public.partners.monthly_fee IS 'Monthly subscription fee in SEK';
COMMENT ON COLUMN public.partners.cancellation_date IS 'Date when the partner agreement ends (if applicable)';
COMMENT ON COLUMN public.partners.admin_notes IS 'Internal notes for admin purposes';

-- Update the public view to include contact_person (but not sensitive admin fields)
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public
WITH (security_invoker = true) AS
SELECT
  id,
  slug,
  name,
  description,
  logo_url,
  website,
  applications,
  industries,
  secondary_industries,
  geography,
  product_filters,
  is_featured,
  created_at,
  updated_at
FROM public.partners;

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('partner-logos', 'partner-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for partner logos
CREATE POLICY "Partner logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-logos');

CREATE POLICY "Service role can upload partner logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Service role can update partner logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'partner-logos');

CREATE POLICY "Service role can delete partner logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'partner-logos');