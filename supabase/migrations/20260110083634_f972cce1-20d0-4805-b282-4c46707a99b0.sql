-- Add new columns for product-specific filtering and geography
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS geography text DEFAULT 'Sverige',
ADD COLUMN IF NOT EXISTS secondary_industries text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS product_filters jsonb DEFAULT '{}';

-- Add comment explaining the structure
COMMENT ON COLUMN public.partners.geography IS 'Geographic coverage: Sverige, Norden, Europa, or Internationellt';
COMMENT ON COLUMN public.partners.secondary_industries IS 'Secondary industries (Erfarenhet även inom) - shown on profile but not used for filtering';
COMMENT ON COLUMN public.partners.product_filters IS 'Product-specific filters: { bc: { industries: [], secondaryIndustries: [], companySize: [], geography: string, ranking: number }, fsc: {...}, crm: {...} }';

-- Update the public view to include new columns
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public AS
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