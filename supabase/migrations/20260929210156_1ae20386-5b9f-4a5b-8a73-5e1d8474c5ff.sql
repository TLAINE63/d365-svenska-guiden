WITH pairs AS (
  SELECT src.id AS src_id, tgt.id AS tgt_id
  FROM public.product_attribute_options src
  JOIN public.product_attribute_options tgt
    ON tgt.product_id = src.product_id
   AND tgt.dimension_key = 'special_delivery'
   AND tgt.attribute_key = 'quickstart_package'
  WHERE src.dimension_key = 'special_delivery'
    AND src.attribute_key = 'fixed_price_start'
), ranked AS (
  SELECT DISTINCT ON (a.partner_product_profile_id, pairs.tgt_id)
    a.partner_product_profile_id,
    pairs.tgt_id AS product_attribute_option_id,
    a.verification_status,
    a.source_type,
    a.source_url,
    a.verified_by,
    a.verified_at,
    a.is_published,
    a.editorial_note
  FROM public.partner_product_attributes a
  JOIN pairs ON pairs.src_id = a.product_attribute_option_id
  ORDER BY a.partner_product_profile_id, pairs.tgt_id,
    CASE a.verification_status
      WHEN 'partner_verified' THEN 5
      WHEN 'editorial_verified' THEN 4
      WHEN 'public_source' THEN 3
      WHEN 'legacy_import' THEN 2
      ELSE 1
    END DESC,
    a.verified_at DESC NULLS LAST,
    a.updated_at DESC
), removed AS (
  DELETE FROM public.partner_product_attributes a
  USING pairs
  WHERE a.product_attribute_option_id = pairs.src_id
)
INSERT INTO public.partner_product_attributes
  (partner_product_profile_id, product_attribute_option_id, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note)
SELECT partner_product_profile_id, product_attribute_option_id, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note
FROM ranked
ON CONFLICT (partner_product_profile_id, product_attribute_option_id) DO NOTHING;

UPDATE public.product_attribute_options
SET label = 'Snabbstartspaket till fast pris',
    description = 'Ett paketerat införande med tydlig omfattning och fast pris.',
    is_active = true
WHERE dimension_key = 'special_delivery' AND attribute_key = 'quickstart_package';

UPDATE public.product_attribute_options
SET is_active = false
WHERE dimension_key = 'special_delivery' AND attribute_key = 'fixed_price_start';

UPDATE public.partner_review_changes
SET value_key = 'quickstart_package',
    value_label = 'Snabbstartspaket till fast pris',
    updated_at = now()
WHERE dimension_key = 'special_delivery' AND value_key = 'fixed_price_start';

UPDATE public.partner_review_changes
SET value_label = 'Snabbstartspaket till fast pris',
    updated_at = now()
WHERE dimension_key = 'special_delivery' AND value_key = 'quickstart_package';