UPDATE public.product_attribute_options o SET is_active = false
FROM public.product_catalog pc
WHERE pc.id = o.product_id AND o.dimension_key = 'competency'
  AND pc.product_key IN ('customer-service','field-service','contact-center');

INSERT INTO public.product_attribute_options (product_id, dimension_key, attribute_key, label, description, sort_order, is_active)
SELECT id, 'competency', 'telephony', 'Telefonilösningar', 'Integration av telefoni (t.ex. Teams Phone, Azure Communication Services eller extern växel) i Contact Center', 10, true
FROM public.product_catalog WHERE product_key = 'contact-center'
ON CONFLICT (product_id, dimension_key, attribute_key) DO UPDATE SET is_active = true, label = EXCLUDED.label, description = EXCLUDED.description;