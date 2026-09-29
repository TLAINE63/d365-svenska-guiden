WITH capability_ids AS (
  SELECT
    (SELECT id FROM public.product_catalog WHERE product_key = 'copilot-studio') AS target_id,
    (SELECT id FROM public.product_catalog WHERE product_key = 'ai-agents') AS source_id
), ranked AS (
  SELECT DISTINCT ON (ppc.partner_product_profile_id)
    ppc.partner_product_profile_id,
    ids.target_id AS capability_product_id,
    ppc.verification_status,
    ppc.source_type,
    ppc.source_url,
    ppc.verified_by,
    ppc.verified_at,
    bool_or(ppc.is_published) OVER (PARTITION BY ppc.partner_product_profile_id) AS is_published,
    ppc.editorial_note,
    min(ppc.created_at) OVER (PARTITION BY ppc.partner_product_profile_id) AS created_at,
    max(ppc.updated_at) OVER (PARTITION BY ppc.partner_product_profile_id) AS updated_at
  FROM public.partner_product_capabilities ppc
  CROSS JOIN capability_ids ids
  WHERE ppc.capability_product_id IN (ids.target_id, ids.source_id)
  ORDER BY ppc.partner_product_profile_id,
    CASE ppc.verification_status
      WHEN 'partner_verified' THEN 5
      WHEN 'editorial_verified' THEN 4
      WHEN 'public_source' THEN 3
      WHEN 'legacy_import' THEN 2
      ELSE 1
    END DESC,
    ppc.verified_at DESC NULLS LAST,
    ppc.updated_at DESC
), removed AS (
  DELETE FROM public.partner_product_capabilities ppc
  USING capability_ids ids
  WHERE ppc.capability_product_id IN (ids.target_id, ids.source_id)
)
INSERT INTO public.partner_product_capabilities
  (partner_product_profile_id, capability_product_id, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note, created_at, updated_at)
SELECT
  partner_product_profile_id, capability_product_id, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note, created_at, updated_at
FROM ranked
ON CONFLICT (partner_product_profile_id, capability_product_id) DO UPDATE SET
  verification_status = EXCLUDED.verification_status,
  source_type = EXCLUDED.source_type,
  source_url = EXCLUDED.source_url,
  verified_by = EXCLUDED.verified_by,
  verified_at = EXCLUDED.verified_at,
  is_published = EXCLUDED.is_published,
  editorial_note = EXCLUDED.editorial_note,
  updated_at = EXCLUDED.updated_at;

UPDATE public.product_catalog
SET name = 'Copilot Studio och AI-agenter',
    is_active = true,
    updated_at = now()
WHERE product_key = 'copilot-studio';

UPDATE public.product_catalog
SET is_active = false,
    updated_at = now()
WHERE product_key = 'ai-agents';

UPDATE public.partner_review_changes
SET value_key = 'copilot-studio',
    value_label = 'Copilot Studio och AI-agenter',
    updated_at = now()
WHERE dimension_key = 'capability'
  AND value_key = 'ai-agents';