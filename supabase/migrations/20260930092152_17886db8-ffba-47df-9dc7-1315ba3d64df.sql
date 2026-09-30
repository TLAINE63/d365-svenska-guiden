ALTER TABLE public.partner_product_attributes ADD COLUMN IF NOT EXISTS level text CHECK (level IS NULL OR level IN ('har_gjort','har_gjort_flera','specialitet'));
ALTER TABLE public.partner_product_profiles
  ADD COLUMN IF NOT EXISTS support_level text CHECK (support_level IS NULL OR support_level IN ('endast_projekt','kontorstid','utokad_support','forvaltningsavtal')),
  ADD COLUMN IF NOT EXISTS fixed_price_start boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fixed_price_start_name text,
  ADD COLUMN IF NOT EXISTS fixed_price_start_url text,
  ADD COLUMN IF NOT EXISTS field_meta jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.bc_source_label(s text) RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE s WHEN 'partner_verified' THEN 'partner' WHEN 'editorial_verified' THEN 'redaktion' WHEN 'public_source' THEN 'publik' ELSE NULL END
$$;

CREATE OR REPLACE VIEW public.bc_partners_v1 AS
SELECT '1.0'::text AS schema_version,
  p.id AS partner_id, p.name AS partner_name, p.slug AS partner_slug,
  CASE WHEN p.is_featured THEN 'verified' ELSE 'basic' END AS partner_status,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'label', o.label, 'level', a.level,
      'source', public.bc_source_label(a.verification_status), 'verified_at', a.verified_at) ORDER BY o.sort_order), '[]'::jsonb)
     FROM partner_product_attributes a JOIN product_attribute_options o ON o.id = a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.is_active AND o.dimension_key = 'migration') AS migration_sources,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'label', o.label,
      'source', public.bc_source_label(a.verification_status), 'verified_at', a.verified_at) ORDER BY o.sort_order), '[]'::jsonb)
     FROM partner_product_attributes a JOIN product_attribute_options o ON o.id = a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.is_active AND o.dimension_key = 'competency') AS bc_competencies,
  CASE WHEN p.slug ILIKE 'cosmo%' THEN 'ingen'
       ELSE COALESCE((SELECT CASE s.solution_type WHEN 'third_party' THEN 'tredjepart' ELSE 'egen' END
         FROM partner_industry_solutions s WHERE s.profile_id = pp.id AND s.is_published ORDER BY s.created_at LIMIT 1), 'ingen') END AS industry_solution_type,
  CASE WHEN p.slug ILIKE 'cosmo%' THEN NULL ELSE (SELECT s.name FROM partner_industry_solutions s WHERE s.profile_id = pp.id AND s.is_published ORDER BY s.created_at LIMIT 1) END AS industry_solution_name,
  CASE WHEN p.slug ILIKE 'cosmo%' THEN '{}'::text[] ELSE COALESCE((SELECT s.industries FROM partner_industry_solutions s WHERE s.profile_id = pp.id AND s.is_published ORDER BY s.created_at LIMIT 1), '{}'::text[]) END AS industry_solution_industries,
  jsonb_build_object('offered', pp.fixed_price_start,
    'name', CASE WHEN pp.fixed_price_start THEN pp.fixed_price_start_name END,
    'url', CASE WHEN pp.fixed_price_start THEN pp.fixed_price_start_url END) AS fixed_price_start,
  pp.support_level,
  pp.field_meta,
  pp.updated_at
FROM partner_product_profiles pp
JOIN product_catalog c ON c.id = pp.product_id AND c.product_key = 'business-central'
JOIN partners p ON p.id = pp.partner_id
WHERE pp.is_published AND p.slug IS NOT NULL;

GRANT SELECT ON public.bc_partners_v1 TO anon, authenticated;
GRANT ALL ON public.bc_partners_v1 TO service_role;