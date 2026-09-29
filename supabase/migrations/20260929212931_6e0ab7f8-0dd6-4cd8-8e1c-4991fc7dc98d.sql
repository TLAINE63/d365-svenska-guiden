UPDATE public.product_attribute_options o
SET is_active = false
FROM public.product_catalog p
WHERE o.product_id = p.id
  AND p.product_key IN ('sales', 'customer-insights')
  AND o.dimension_key = 'competency';