-- 1. Leverantörer som egen entitet
CREATE TABLE IF NOT EXISTS public.isv_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  website text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.isv_vendors TO anon;
GRANT SELECT ON public.isv_vendors TO authenticated;
GRANT ALL ON public.isv_vendors TO service_role;

ALTER TABLE public.isv_vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vendors are publicly readable" ON public.isv_vendors;
CREATE POLICY "Vendors are publicly readable"
  ON public.isv_vendors FOR SELECT
  USING (true);

-- 2. Utökad produktmodell på befintlig tabell
ALTER TABLE public.isv_solutions
  ADD COLUMN IF NOT EXISTS vendor_slug text REFERENCES public.isv_vendors(slug) ON UPDATE CASCADE,
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS delivery_model text NOT NULL DEFAULT 'native_isv',
  ADD COLUMN IF NOT EXISTS finance_relevance text NOT NULL DEFAULT 'no',
  ADD COLUMN IF NOT EXISTS supply_chain_relevance text NOT NULL DEFAULT 'no',
  ADD COLUMN IF NOT EXISTS best_for text,
  ADD COLUMN IF NOT EXISTS considerations text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS verified_at date,
  ADD COLUMN IF NOT EXISTS editorial_tier text,
  ADD COLUMN IF NOT EXISTS nordic_relevance text,
  ADD COLUMN IF NOT EXISTS publication_wave text;

-- Migrera befintlig BC-specifik "type" till neutral leveransform
UPDATE public.isv_solutions SET delivery_model = CASE
  WHEN type ILIKE '%native%' THEN 'native_isv'
  WHEN type ILIKE '%external%' THEN 'external_saas'
  WHEN type ILIKE '%integration%' THEN 'integration_layer'
  WHEN type ILIKE '%industry%' OR type ILIKE '%bransch%' THEN 'industry_solution'
  ELSE 'native_isv' END;

CREATE INDEX IF NOT EXISTS isv_solutions_vendor_slug_idx ON public.isv_solutions (vendor_slug);
CREATE INDEX IF NOT EXISTS isv_solutions_verified_at_idx ON public.isv_solutions (verified_at);
CREATE INDEX IF NOT EXISTS isv_solutions_category_idx ON public.isv_solutions (category);