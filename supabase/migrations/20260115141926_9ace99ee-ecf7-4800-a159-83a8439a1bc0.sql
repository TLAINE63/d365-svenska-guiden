-- Add customer_examples column to partners table
ALTER TABLE public.partners ADD COLUMN customer_examples text[] DEFAULT '{}'::text[];

-- Update the partners_public view to include customer_examples
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public AS
SELECT 
  id,
  name,
  slug,
  description,
  logo_url,
  logo_dark_bg,
  website,
  applications,
  industries,
  secondary_industries,
  geography,
  product_filters,
  is_featured,
  customer_examples,
  created_at,
  updated_at
FROM public.partners
WHERE is_featured = true;