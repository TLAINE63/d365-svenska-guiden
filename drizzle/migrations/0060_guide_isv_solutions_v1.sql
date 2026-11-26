CREATE OR REPLACE VIEW public.guide_isv_solutions_v1 WITH (security_invoker = false) AS SELECT '1.0'::text AS schema_version,
 s.solution_id AS product_id, s.name AS product_name, s.vendor_slug AS vendor_id,
 COALESCE(NULLIF(o.vendor_name,''), v.name, s.vendor) AS vendor_name,
 v.website AS vendor_website, v.logo_url AS vendor_logo_url,
 s.category, s.subcategory,
 COALESCE(NULLIF(o.short_description,''), s.short_description) AS short_description,
 COALESCE(NULLIF(o.what,''), s.what) AS what,
 COALESCE(NULLIF(o.when_fits,''), s.when_fits) AS when_fits,
 COALESCE(NULLIF(o.use_cases,'{}'::text[]), s.use_cases) AS use_cases,
 s.best_for, s.considerations,
 COALESCE(NULLIF(o.products,'{}'::text[]), s.products) AS compatible_products,
 s.delivery_model AS integration_type, s.geo AS available_in,
 COALESCE(NULLIF(o.industries,'{}'::text[]), s.industry_focus) AS industries,
 COALESCE(NULLIF(o.partner_slugs,'{}'::text[]), s.partner_slugs) AS partner_slugs,
 COALESCE(NULLIF(o.vendor_website,''), s.vendor_website, v.website) AS product_website,
 s.information_status, s.last_verified_date,
 (s.information_status = 'verified') AS is_verified,
 COALESCE(s.premium_product,false) AS premium_product,
 COALESCE(v.premium_vendor,false) AS premium_vendor,
 ('https://d365.se/kunskapscenter/dynamics-365-tillagg/?losning=' || s.solution_id) AS d365_url,
 GREATEST(s.updated_at, COALESCE(o.updated_at, s.updated_at)) AS updated_at
FROM isv_solutions s
LEFT JOIN isv_vendors v ON v.slug = s.vendor_slug AND v.publication_status = 'published' AND COALESCE(v.publish_d365guide,true)
LEFT JOIN isv_solution_overrides o ON o.solution_id = s.solution_id
WHERE s.is_published AND COALESCE(s.publish_d365guide,false)
 AND (s.vendor_slug IS NULL OR v.slug IS NOT NULL)
 AND COALESCE(s.lifecycle_status,'active') = 'active';
GRANT SELECT ON public.guide_isv_solutions_v1 TO anon, authenticated;
GRANT ALL ON public.guide_isv_solutions_v1 TO service_role;