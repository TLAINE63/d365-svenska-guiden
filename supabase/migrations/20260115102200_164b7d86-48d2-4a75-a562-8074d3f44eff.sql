-- Add field to control logo background style per partner
ALTER TABLE public.partners 
ADD COLUMN logo_dark_bg boolean NOT NULL DEFAULT false;

-- Add comment explaining the field
COMMENT ON COLUMN public.partners.logo_dark_bg IS 'If true, display logo on dark background (for light-colored logos). If false, use light background.';

-- Update NAB Solutions to use dark background since they have a light logo
UPDATE public.partners 
SET logo_dark_bg = true 
WHERE slug = 'nab-solutions';

-- Recreate the public view to include the new field
DROP VIEW IF EXISTS public.partners_public;

CREATE VIEW public.partners_public
WITH (security_invoker=on) AS
SELECT 
  id,
  slug,
  name,
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
  created_at,
  updated_at
FROM public.partners;