CREATE OR REPLACE VIEW public.bc_isv_products_v1 AS SELECT '1.0'::text AS schema_version,
    s.solution_id AS product_id,
    s.name AS product_name,
    s.vendor_slug AS vendor_id,
    COALESCE(NULLIF(o.vendor_name, ''::text), v.name, s.vendor) AS vendor_name,
    v.website AS vendor_website,
    v.description AS vendor_description,
    v.logo_url AS vendor_logo_url,
    v.information_status AS vendor_information_status,
    v.last_verified_date AS vendor_last_verified_date,
    s.category,
    s.subcategory,
    COALESCE(bp.bc_use_case, bc_isv_use_case(s.category)) AS use_case,
    bc_isv_use_case_label(COALESCE(bp.bc_use_case, bc_isv_use_case(s.category))) AS use_case_label,
    COALESCE(NULLIF(o.short_description, ''::text), s.short_description) AS short_description,
    COALESCE(NULLIF(o.what, ''::text), s.what) AS what,
    COALESCE(NULLIF(o.when_fits, ''::text), s.when_fits) AS when_fits,
    COALESCE(NULLIF(o.use_cases, '{}'::text[]), s.use_cases) AS use_cases,
    s.best_for,
    s.considerations,
    COALESCE(NULLIF(o.products, '{}'::text[]), s.products) AS compatible_products,
    s.delivery_model AS integration_type,
    s.geo AS available_in,
    COALESCE(NULLIF(o.industries, '{}'::text[]), s.industry_focus) AS industries,
    COALESCE(NULLIF(o.partner_slugs, '{}'::text[]), s.partner_slugs) AS partner_slugs,
    COALESCE(NULLIF(o.vendor_website, ''::text), s.vendor_website, v.website) AS product_website,
    s.information_status,
    s.last_verified_date,
    s.premium_product,
    COALESCE(v.premium_vendor, false) AS premium_vendor,
    COALESCE(bp.bc_slug, s.solution_id) AS bc_slug,
    bp.bc_intro,
    bp.bc_seo_title,
    bp.bc_seo_description,
    bp.bc_editorial_context,
    ('https://d365.se/kunskapscenter/dynamics-365-tillagg/?losning='::text || s.solution_id) AS d365_url,
    'isv_product_help'::text AS help_placement,
    GREATEST(s.updated_at, COALESCE(o.updated_at, s.updated_at), COALESCE(bp.updated_at, s.updated_at)) AS updated_at,
    (s.information_status = 'verified'::text) AS is_verified
   FROM (((isv_solutions s
     LEFT JOIN isv_vendors v ON (((v.slug = s.vendor_slug) AND (v.publication_status = 'published'::text))))
     LEFT JOIN isv_solution_overrides o ON ((o.solution_id = s.solution_id)))
     LEFT JOIN isv_bc_presentation bp ON ((bp.solution_id = s.solution_id)))
  WHERE (s.is_published AND s.publish_businesscentral AND ((s.vendor_slug IS NULL) OR (v.slug IS NOT NULL)) AND (COALESCE(s.lifecycle_status, 'active'::text) = 'active'::text) AND ((s.products IS NULL) OR (cardinality(s.products) = 0) OR ('Business Central'::text = ANY (s.products))));
CREATE OR REPLACE VIEW public.bc_partners_v1 AS SELECT '1.0'::text AS schema_version,
    p.id AS partner_id,
    p.name AS partner_name,
    p.slug AS partner_slug,
        CASE
            WHEN p.is_featured THEN 'verified'::text
            ELSE 'basic'::text
        END AS partner_status,
    ( SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'label', o.label, 'level', a.level, 'source', bc_source_label(a.verification_status), 'verified_at', a.verified_at) ORDER BY o.sort_order), '[]'::jsonb) AS "coalesce"
           FROM (partner_product_attributes a
             JOIN product_attribute_options o ON ((o.id = a.product_attribute_option_id)))
          WHERE ((a.partner_product_profile_id = pp.id) AND a.is_published AND o.is_active AND (o.dimension_key = 'migration'::text))) AS migration_sources,
    ( SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'label', o.label, 'source', bc_source_label(a.verification_status), 'verified_at', a.verified_at) ORDER BY o.sort_order), '[]'::jsonb) AS "coalesce"
           FROM (partner_product_attributes a
             JOIN product_attribute_options o ON ((o.id = a.product_attribute_option_id)))
          WHERE ((a.partner_product_profile_id = pp.id) AND a.is_published AND o.is_active AND (o.dimension_key = 'competency'::text))) AS bc_competencies,
        CASE
            WHEN (p.slug ~~* 'cosmo%'::text) THEN 'ingen'::text
            ELSE COALESCE(( SELECT
                    CASE s.solution_type
                        WHEN 'third_party'::text THEN 'tredjepart'::text
                        ELSE 'egen'::text
                    END AS "case"
               FROM partner_industry_solutions s
              WHERE ((s.profile_id = pp.id) AND s.is_published)
              ORDER BY s.created_at
             LIMIT 1), 'ingen'::text)
        END AS industry_solution_type,
        CASE
            WHEN (p.slug ~~* 'cosmo%'::text) THEN NULL::text
            ELSE ( SELECT s.name
               FROM partner_industry_solutions s
              WHERE ((s.profile_id = pp.id) AND s.is_published)
              ORDER BY s.created_at
             LIMIT 1)
        END AS industry_solution_name,
        CASE
            WHEN (p.slug ~~* 'cosmo%'::text) THEN '{}'::text[]
            ELSE COALESCE(( SELECT s.industries
               FROM partner_industry_solutions s
              WHERE ((s.profile_id = pp.id) AND s.is_published)
              ORDER BY s.created_at
             LIMIT 1), '{}'::text[])
        END AS industry_solution_industries,
    jsonb_build_object('offered', pp.fixed_price_start, 'name',
        CASE
            WHEN pp.fixed_price_start THEN pp.fixed_price_start_name
            ELSE NULL::text
        END, 'url',
        CASE
            WHEN pp.fixed_price_start THEN pp.fixed_price_start_url
            ELSE NULL::text
        END) AS fixed_price_start,
    pp.support_level,
    pp.field_meta,
    pp.updated_at,
    p.information_status,
    p.information_verified_at
   FROM ((partner_product_profiles pp
     JOIN product_catalog c ON (((c.id = pp.product_id) AND (c.product_key = 'business-central'::text))))
     JOIN partners p ON ((p.id = pp.partner_id)))
  WHERE (pp.is_published AND (p.slug IS NOT NULL) AND (COALESCE(p.is_featured, false) OR (NOT COALESCE(p.hide_basic_card, false))));