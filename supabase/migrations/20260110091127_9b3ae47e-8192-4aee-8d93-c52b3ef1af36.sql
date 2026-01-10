-- First drop the view that depends on geography column
DROP VIEW IF EXISTS public.partners_public;

-- Remove the default before changing type
ALTER TABLE public.partners ALTER COLUMN geography DROP DEFAULT;

-- Change geography from single text to array for multi-select
ALTER TABLE public.partners 
ALTER COLUMN geography TYPE text[] USING CASE WHEN geography IS NULL THEN '{}'::text[] ELSE ARRAY[geography]::text[] END;

-- Set new default as empty array
ALTER TABLE public.partners ALTER COLUMN geography SET DEFAULT '{}'::text[];

-- Add admin contact fields
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS admin_contact_name text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS admin_contact_email text;

-- Recreate the partners_public view
CREATE VIEW public.partners_public 
WITH (security_invoker = true)
AS
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