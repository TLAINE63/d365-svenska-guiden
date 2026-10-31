ALTER TABLE public.isv_vendors ADD COLUMN IF NOT EXISTS vendor_updated_at timestamptz;
ALTER TABLE public.isv_solutions ADD COLUMN IF NOT EXISTS vendor_updated_at timestamptz;
COMMENT ON COLUMN public.isv_vendors.vendor_updated_at IS 'Senaste gången leverantören själv skickade in uppdateringar via sin profileringslänk.';
COMMENT ON COLUMN public.isv_solutions.vendor_updated_at IS 'Senaste gången leverantören själv skickade in uppdateringar för produkten via sin profileringslänk.';