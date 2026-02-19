
-- Add industry_apps JSONB column to partners table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'industry_apps') THEN
    ALTER TABLE public.partners ADD COLUMN industry_apps jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add industry_apps JSONB column to partner_submissions table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partner_submissions' AND column_name = 'industry_apps') THEN
    ALTER TABLE public.partner_submissions ADD COLUMN industry_apps jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Drop and recreate the partners_public view to include industry_apps
DROP VIEW IF EXISTS public.partners_public;

CREATE VIEW public.partners_public
WITH (security_invoker = false)
AS
SELECT
  id, name, description, logo_url, website, email, phone,
  contact_person, applications, industries, secondary_industries,
  geography, product_filters, is_featured, logo_dark_bg,
  customer_examples, slug, created_at, updated_at, industry_apps
FROM public.partners;
