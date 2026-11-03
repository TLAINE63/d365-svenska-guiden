ALTER TABLE public.isv_solutions ADD COLUMN IF NOT EXISTS demo_video_url text;
ALTER TABLE public.isv_solutions ADD COLUMN IF NOT EXISTS customer_cases jsonb NOT NULL DEFAULT '[]'::jsonb;

-- businesscentral.se: kräver både D365 Verifierad och aktiv ISV Presence.
CREATE OR REPLACE VIEW public.bc_isv_products_v1 AS
SELECT
  '1.0'::text AS schema_version,
  s.solution_id AS product_id,
  s.name AS product_name,
  s.vendor_slug AS vendor_id,
  COALESCE(NULLIF(o.vendor_name, ''), v.name, s.vendor) AS vendor_name,
  v.website AS vendor_website,
  v.description AS vendor_description,
  v.logo_url AS vendor_logo_url,
  v.information_status AS vendor_information_status,
  v.last_verified_date AS vendor_last_verified_date,
  s.category,
  s.subcategory,
  COALESCE(bp.bc_use_case, public.bc_isv_use_case(s.category)) AS use_case,
  public.bc_isv_use_case_label(COALESCE(bp.bc_use_case, public.bc_isv_use_case(s.category))) AS use_case_label,
  COALESCE(NULLIF(o.short_description, ''), s.short_description) AS short_description,
  COALESCE(NULLIF(o.what, ''), s.what) AS what,
  COALESCE(NULLIF(o.when_fits, ''), s.when_fits) AS when_fits,
  COALESCE(NULLIF(o.use_cases, '{}'), s.use_cases) AS use_cases,
  s.best_for,
  s.considerations,
  COALESCE(NULLIF(o.products, '{}'), s.products) AS compatible_products,
  s.delivery_model AS integration_type,
  s.geo AS available_in,
  COALESCE(NULLIF(o.industries, '{}'), s.industry_focus) AS industries,
  COALESCE(NULLIF(o.partner_slugs, '{}'), s.partner_slugs) AS partner_slugs,
  COALESCE(NULLIF(o.vendor_website, ''), s.vendor_website, v.website) AS product_website,
  s.information_status,
  s.last_verified_date,
  s.premium_product,
  COALESCE(v.premium_vendor, false) AS premium_vendor,
  COALESCE(bp.bc_slug, s.solution_id) AS bc_slug,
  bp.bc_intro,
  bp.bc_seo_title,
  bp.bc_seo_description,
  bp.bc_editorial_context,
  'https://d365.se/kunskapscenter/dynamics-365-tillagg/?losning=' || s.solution_id AS d365_url,
  'isv_product_help'::text AS help_placement,
  GREATEST(s.updated_at, COALESCE(o.updated_at, s.updated_at), COALESCE(bp.updated_at, s.updated_at)) AS updated_at
FROM public.isv_solutions s
LEFT JOIN public.isv_vendors v ON v.slug = s.vendor_slug AND v.publication_status = 'published'
LEFT JOIN public.isv_solution_overrides o ON o.solution_id = s.solution_id
LEFT JOIN public.isv_bc_presentation bp ON bp.solution_id = s.solution_id
WHERE s.is_published
  AND s.publish_businesscentral
  AND s.information_status = 'verified'
  AND s.premium_product IS TRUE
  AND COALESCE(s.lifecycle_status, 'active') = 'active'
  AND (s.products IS NULL OR cardinality(s.products) = 0 OR 'Business Central' = ANY(s.products));

GRANT SELECT ON public.bc_isv_products_v1 TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.public_isv_product_facts()
RETURNS TABLE(solution_id text, technical_model text, target_size text, price_info text, countries jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.solution_id,
    CASE WHEN a.technical_model ILIKE 'Embedded%' THEN 'Embedded'
         WHEN a.technical_model ILIKE 'Connected%' THEN 'Connected'
         WHEN a.technical_model ILIKE 'Hybrid%' THEN 'Hybrid' END,
    NULLIF(trim(a.target_size), ''),
    CASE WHEN a.price_info IS NULL OR trim(a.price_info) = '' OR a.price_info ILIKE 'Ej %' THEN NULL ELSE a.price_info END,
    COALESCE((SELECT jsonb_agg(jsonb_build_object('code', m.country_code, 'availability', m.availability) ORDER BY m.country_code)
              FROM public.isv_solution_markets m
              WHERE m.solution_id = s.solution_id AND m.availability IN ('Verifierad','Starkt indikerad')), '[]'::jsonb)
  FROM public.isv_solutions s
  LEFT JOIN public.isv_solution_analysis a ON a.solution_id = s.solution_id
  WHERE s.is_published = true;
$$;
REVOKE ALL ON FUNCTION public.public_isv_product_facts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_isv_product_facts() TO anon, authenticated, service_role;