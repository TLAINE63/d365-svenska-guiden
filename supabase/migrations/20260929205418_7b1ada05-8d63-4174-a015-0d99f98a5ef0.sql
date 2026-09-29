UPDATE public.product_attribute_options
SET is_active = false,
    updated_at = now()
WHERE dimension_key IN ('project_type', 'delivery_model')
  AND is_active = true;

INSERT INTO public.product_attribute_options
  (product_id, dimension_key, attribute_key, label, description, sort_order, is_active)
SELECT
  p.id,
  'special_delivery',
  v.attribute_key,
  v.label,
  v.description,
  v.sort_order,
  true
FROM public.product_catalog p
CROSS JOIN (VALUES
  ('managed_services', 'Managed Services', 'Proaktivt helhetsansvar med löpande övervakning, förbättring och optimering, utöver ett vanligt supportavtal.', 10),
  ('rescue', 'Rescue-projekt', 'Övertagande och stabilisering av ett problemfyllt eller avstannat projekt.', 20),
  ('international_rollout', 'Internationell utrullning', 'Utrullning i flera länder med lokala krav och samordnad styrning.', 30),
  ('system_consolidation', 'Systemkonsolidering', 'Sammanslagning av flera system eller miljöer till en gemensam lösning.', 40),
  ('multi_company_implementation', 'Flerbolagsimplementation', 'Införande för flera bolag eller komplexa legala strukturer.', 50),
  ('fixed_price_start', 'Fastprisstart', 'En tydligt avgränsad inledande fas till fast pris.', 60),
  ('quickstart_package', 'Snabbstartspaket', 'Ett standardiserat och paketerat införande med tydlig omfattning.', 70),
  ('proof_of_concept', 'Proof of Concept', 'Ett avgränsat test som verifierar lösningen före ett större införande.', 80)
) AS v(attribute_key, label, description, sort_order)
WHERE p.product_key IN ('business-central', 'finance', 'supply-chain', 'sales', 'customer-insights', 'customer-service', 'field-service', 'contact-center')
ON CONFLICT (product_id, dimension_key, attribute_key)
DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

WITH mapping(old_dimension, old_key, new_key) AS (
  VALUES
    ('delivery_model', 'managed_services', 'managed_services'),
    ('project_type', 'rescue', 'rescue'),
    ('project_type', 'international_rollout', 'international_rollout'),
    ('project_type', 'system_consolidation', 'system_consolidation'),
    ('project_type', 'multi_company_implementation', 'multi_company_implementation'),
    ('delivery_model', 'fixed_price_start', 'fixed_price_start'),
    ('delivery_model', 'quickstart_package', 'quickstart_package'),
    ('delivery_model', 'proof_of_concept', 'proof_of_concept')
), candidates AS (
  SELECT DISTINCT ON (a.partner_product_profile_id, new_opt.id)
    a.partner_product_profile_id,
    new_opt.id AS product_attribute_option_id,
    a.verification_status,
    a.source_type,
    a.source_url,
    a.verified_by,
    a.verified_at,
    a.is_published,
    a.editorial_note,
    a.created_at,
    a.updated_at
  FROM public.partner_product_attributes a
  JOIN public.product_attribute_options old_opt ON old_opt.id = a.product_attribute_option_id
  JOIN mapping m ON m.old_dimension = old_opt.dimension_key AND m.old_key = old_opt.attribute_key
  JOIN public.partner_product_profiles profile ON profile.id = a.partner_product_profile_id
  JOIN public.product_attribute_options new_opt
    ON new_opt.product_id = profile.product_id
   AND new_opt.dimension_key = 'special_delivery'
   AND new_opt.attribute_key = m.new_key
  ORDER BY a.partner_product_profile_id, new_opt.id,
    a.is_published DESC,
    CASE a.verification_status
      WHEN 'partner_verified' THEN 5
      WHEN 'editorial_verified' THEN 4
      WHEN 'public_source' THEN 3
      WHEN 'legacy_import' THEN 2
      ELSE 1
    END DESC,
    a.verified_at DESC NULLS LAST,
    a.updated_at DESC
)
INSERT INTO public.partner_product_attributes
  (partner_product_profile_id, product_attribute_option_id, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note, created_at, updated_at)
SELECT
  partner_product_profile_id, product_attribute_option_id, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note, created_at, updated_at
FROM candidates
ON CONFLICT (partner_product_profile_id, product_attribute_option_id) DO NOTHING;

CREATE OR REPLACE VIEW public.export_bc_partner_v1 AS
SELECT
  '1.0'::text AS schema_version,
  p.id AS partner_id,
  p.name AS partner_name,
  p.slug AS partner_slug,
  p.logo_url,
  '/partner/'::text || p.slug || '/'::text AS profile_url,
  pp.verification_status,
  pp.verified_at AS last_verified_at,
  COALESCE(p.geography, '{}'::text[]) AS geography,
  COALESCE(p.office_cities, '{}'::text[]) AS office_cities,
  COALESCE(p.product_filters->'bc'->'companySize', '[]'::jsonb) AS customer_size_ranges,
  COALESCE(p.product_filters->'bc'->'revenue', '[]'::jsonb) AS revenue_ranges,
  COALESCE(p.product_filters->'bc'->'industries', '[]'::jsonb) AS industries,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id = a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.is_active AND o.dimension_key = 'competency') AS bc_competencies,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id = a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.is_active AND o.dimension_key = 'migration') AS migration_experience,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id = a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.is_active AND o.dimension_key = 'special_delivery'
      AND o.attribute_key IN ('rescue', 'international_rollout', 'system_consolidation', 'multi_company_implementation')) AS project_types,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id = a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.is_active AND o.dimension_key = 'special_delivery'
      AND o.attribute_key IN ('managed_services', 'fixed_price_start', 'quickstart_package', 'proof_of_concept')) AS delivery_models,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', s.name, 'description', s.description, 'industries', s.industries, 'type', s.solution_type, 'sourceUrl', s.source_url, 'partnerVerified', s.partner_verified, 'editorialVerified', s.editorial_verified, 'verifiedAt', s.verified_at)), '[]'::jsonb)
     FROM public.partner_industry_solutions s
    WHERE s.profile_id = pp.id AND s.is_published) AS industry_solutions
FROM public.partner_product_profiles pp
JOIN public.product_catalog c ON c.id = pp.product_id AND c.product_key = 'business-central'
JOIN public.partners p ON p.id = pp.partner_id
WHERE pp.is_published;