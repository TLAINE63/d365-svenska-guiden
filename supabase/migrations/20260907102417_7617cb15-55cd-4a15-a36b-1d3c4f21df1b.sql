ALTER TABLE public.isv_solutions
  ADD COLUMN IF NOT EXISTS sales_relevance text,
  ADD COLUMN IF NOT EXISTS customer_insights_relevance text,
  ADD COLUMN IF NOT EXISTS customer_service_relevance text,
  ADD COLUMN IF NOT EXISTS field_service_relevance text,
  ADD COLUMN IF NOT EXISTS contact_center_relevance text,
  ADD COLUMN IF NOT EXISTS source_status text;

CREATE INDEX IF NOT EXISTS isv_solutions_vendor_name_idx ON public.isv_solutions (lower(vendor), lower(name));