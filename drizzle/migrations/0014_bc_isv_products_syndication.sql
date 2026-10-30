-- Sprint 2.0: businesscentral.se visar BC-relevanta ISV-produkter ur samma produktpost som d365.se.
-- Egen presentation per produkt för businesscentral.se (URL, ingress, SEO, redaktionell kontext, use case).
-- Kärndata (ProductID, VendorID, kompatibilitet, status) finns bara i isv_solutions/isv_vendors.
CREATE TABLE public.isv_bc_presentation (
  solution_id text PRIMARY KEY REFERENCES public.isv_solutions(solution_id) ON DELETE CASCADE,
  bc_slug text UNIQUE,
  bc_intro text,
  bc_seo_title text,
  bc_seo_description text,
  bc_editorial_context text,
  bc_use_case text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.isv_bc_presentation TO service_role;
ALTER TABLE public.isv_bc_presentation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No direct public access to bc presentation" ON public.isv_bc_presentation
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.isv_bc_presentation_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.bc_slug IS NOT NULL AND NEW.bc_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' THEN
    RAISE EXCEPTION 'Ogiltig adress för businesscentral.se: %', NEW.bc_slug;
  END IF;
  IF NEW.bc_use_case IS NOT NULL AND NEW.bc_use_case NOT IN ('wms','scanning','manufacturing','planning','edi','ap-automation','expense','payroll','banking','tax','document-management','e-commerce','shipping','reporting-bi','integration','localization','industry','other') THEN
    RAISE EXCEPTION 'Ogiltigt use case: %', NEW.bc_use_case;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER isv_bc_presentation_validate
  BEFORE INSERT OR UPDATE ON public.isv_bc_presentation
  FOR EACH ROW EXECUTE FUNCTION public.isv_bc_presentation_validate();

-- Use case härleds ur katalogens kategori; redaktionen kan välja annat i presentationen.
CREATE OR REPLACE FUNCTION public.bc_isv_use_case(_category text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE _category
    WHEN 'WMS' THEN 'wms'
    WHEN 'Mobility' THEN 'scanning'
    WHEN 'Planering & produktion' THEN 'manufacturing'
    WHEN 'PLM / Engineering' THEN 'manufacturing'
    WHEN 'Supply chain collaboration' THEN 'planning'
    WHEN 'EDI / e-faktura' THEN 'edi'
    WHEN 'AP automation' THEN 'ap-automation'
    WHEN 'HR' THEN 'payroll'
    WHEN 'Treasury & bank' THEN 'banking'
    WHEN 'Tax & compliance' THEN 'tax'
    WHEN 'Dokument & output' THEN 'document-management'
    WHEN 'E-handel' THEN 'e-commerce'
    WHEN 'Retail / POS' THEN 'e-commerce'
    WHEN 'PIM' THEN 'e-commerce'
    WHEN 'Frakt & TA' THEN 'shipping'
    WHEN 'Rapportering / FP&A' THEN 'reporting-bi'
    WHEN 'Integration / iPaaS' THEN 'integration'
    WHEN 'Lokalisering' THEN 'localization'
    WHEN 'Branschpaket' THEN 'industry'
    ELSE 'other' END
$$;

CREATE OR REPLACE FUNCTION public.bc_isv_use_case_label(_key text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE _key
    WHEN 'wms' THEN 'Lager och WMS' WHEN 'scanning' THEN 'Scanning och mobilt'
    WHEN 'manufacturing' THEN 'Tillverkning' WHEN 'planning' THEN 'Planering'
    WHEN 'edi' THEN 'EDI och e-faktura' WHEN 'ap-automation' THEN 'Leverantörsfakturor (AP)'
    WHEN 'expense' THEN 'Utlägg' WHEN 'payroll' THEN 'Lön och HR'
    WHEN 'banking' THEN 'Bank och betalningar' WHEN 'tax' THEN 'Skatt och moms'
    WHEN 'document-management' THEN 'Dokumenthantering' WHEN 'e-commerce' THEN 'E-handel'
    WHEN 'shipping' THEN 'Frakt och logistik' WHEN 'reporting-bi' THEN 'Rapportering och BI'
    WHEN 'integration' THEN 'Integration' WHEN 'localization' THEN 'Svensk lokalisering'
    WHEN 'industry' THEN 'Branschlösning' ELSE 'Övrigt' END
$$;

-- Publik vy för businesscentral.se (schema 1.0). Publiceringsregel: aktiv, publicerad,
-- byggd för Business Central, markerad för businesscentral.se och Verifierad av d365.se.
-- Inga kontaktuppgifter, avtal eller interna fält. Premium påverkar bara presentation.
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
  AND COALESCE(s.lifecycle_status, 'active') = 'active'
  AND (s.products IS NULL OR cardinality(s.products) = 0 OR 'Business Central' = ANY(s.products));

GRANT SELECT ON public.bc_isv_products_v1 TO anon, authenticated, service_role;