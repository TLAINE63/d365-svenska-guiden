ALTER TABLE public.isv_solutions ADD COLUMN IF NOT EXISTS product_gallery jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.isv_solutions ADD COLUMN IF NOT EXISTS product_features jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.isv_solutions ADD COLUMN IF NOT EXISTS integration_evidence jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.isv_solutions ADD COLUMN IF NOT EXISTS partner_evidence jsonb NOT NULL DEFAULT '[]'::jsonb;
COMMENT ON COLUMN public.isv_solutions.integration_evidence IS 'Product-specific documentation; reviewed flag set only by authenticated editorial service handlers, never inferred from general verification.';
COMMENT ON COLUMN public.isv_solutions.partner_evidence IS 'Documented product relationships; legacy partner_slugs are preserved and never automatically promoted to reviewed evidence.';