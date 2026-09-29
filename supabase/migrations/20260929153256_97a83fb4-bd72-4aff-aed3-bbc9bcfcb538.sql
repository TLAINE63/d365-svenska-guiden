-- 1. Produktkatalog
CREATE TABLE public.product_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text NOT NULL UNIQUE CHECK (product_key ~ '^[a-z0-9-]+$'),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('erp','crm','power-platform','data-ai','other')),
  legacy_names text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.product_catalog TO service_role;
ALTER TABLE public.product_catalog ENABLE ROW LEVEL SECURITY;

INSERT INTO public.product_catalog (product_key,name,category,legacy_names,sort_order) VALUES
('business-central','Dynamics 365 Business Central','erp',ARRAY['Business Central'],10),
('finance','Dynamics 365 Finance','erp',ARRAY['Finance','F&SCM'],20),
('supply-chain','Dynamics 365 Supply Chain Management','erp',ARRAY['Supply Chain Management','F&SCM'],30),
('project-operations','Dynamics 365 Project Operations','erp',ARRAY['Project Operations'],40),
('commerce','Dynamics 365 Commerce','erp',ARRAY['Commerce'],50),
('human-resources','Dynamics 365 Human Resources','erp',ARRAY['Human Resources'],60),
('sales','Dynamics 365 Sales','crm',ARRAY['Sales'],110),
('customer-service','Dynamics 365 Customer Service','crm',ARRAY['Customer Service'],120),
('field-service','Dynamics 365 Field Service','crm',ARRAY['Field Service'],130),
('customer-insights','Dynamics 365 Customer Insights','crm',ARRAY['Customer Insights (Marketing)'],140),
('contact-center','Dynamics 365 Contact Center','crm',ARRAY['Contact Center'],150),
('power-platform','Power Platform','power-platform','{}',210),
('power-apps','Power Apps','power-platform','{}',220),
('power-automate','Power Automate','power-platform','{}',230),
('power-pages','Power Pages','power-platform','{}',240),
('dataverse','Dataverse','power-platform','{}',250),
('power-bi','Power BI','data-ai','{}',310),
('copilot','Copilot','data-ai','{}',320),
('copilot-studio','Copilot Studio','data-ai','{}',330),
('ai-agents','AI och agenter','data-ai','{}',340);

-- 2. Partnerproduktprofil
CREATE TABLE public.partner_product_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.product_catalog(id),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  is_primary boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'unverified',
  verified_by text,
  verified_at date,
  source_url text,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, product_id),
  CONSTRAINT ppp_status_chk CHECK (verification_status IN ('partner_verified','editorial_verified','public_source','legacy_import','unverified')),
  CONSTRAINT ppp_source_chk CHECK (verification_status NOT IN ('partner_verified','editorial_verified','public_source') OR verified_by IS NOT NULL),
  CONSTRAINT ppp_date_chk CHECK (verification_status <> 'partner_verified' OR verified_at IS NOT NULL)
);
GRANT ALL ON public.partner_product_profiles TO service_role;
ALTER TABLE public.partner_product_profiles ENABLE ROW LEVEL SECURITY;

-- 3. BC-attribut: tillåtna värden + val
CREATE TABLE public.bc_attribute_options (
  attribute_type text NOT NULL CHECK (attribute_type IN ('migration','competency','project_type','delivery_model')),
  value_key text NOT NULL CHECK (value_key ~ '^[a-z0-9_]+$'),
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  PRIMARY KEY (attribute_type, value_key)
);
GRANT ALL ON public.bc_attribute_options TO service_role;
ALTER TABLE public.bc_attribute_options ENABLE ROW LEVEL SECURITY;

INSERT INTO public.bc_attribute_options (attribute_type,value_key,label,sort_order) VALUES
('migration','nav','NAV / Navision',1),('migration','bc_onprem','Business Central On-Prem',2),
('migration','bc_other_environment','Business Central från annan miljö eller partner',3),('migration','visma','Visma',4),
('migration','monitor','Monitor ERP',5),('migration','pyramid','Pyramid',6),('migration','jeeves','Jeeves',7),
('migration','sap_business_one','SAP Business One',8),('migration','fortnox','Fortnox',9),('migration','other_erp','Annat ERP',10),
('competency','finance_accounting','Ekonomi och redovisning',1),('competency','purchasing','Inköp',2),
('competency','sales_order','Försäljning och order',3),('competency','warehouse_logistics','Lager och logistik',4),
('competency','distribution_wholesale','Distribution och grossist',5),('competency','manufacturing','Produktion och tillverkning',6),
('competency','projects','Projektverksamhet',7),('competency','service_management','Servicehantering',8),
('competency','retail_ecommerce','Retail och e-handel',9),('competency','edi','EDI',10),
('competency','integrations_api','Integrationer och API',11),('competency','reporting_power_bi','Rapportering och Power BI',12),
('competency','power_platform_bc','Power Platform i anslutning till Business Central',13),('competency','copilot_bc','Copilot i Business Central',14),
('competency','multi_company','Flerbolagsmiljö',15),('competency','international','Internationell verksamhet',16),
('project_type','new_implementation','Nyimplementation',1),('project_type','migration','Migrering',2),
('project_type','upgrade','Uppgradering',3),('project_type','maintenance_support','Förvaltning och support',4),
('project_type','rescue','Rescue-projekt',5),('project_type','system_consolidation','Konsolidering av flera system',6),
('project_type','multi_company_implementation','Flerbolagsimplementation',7),('project_type','international_rollout','Internationell utrullning',8),
('delivery_model','fixed_price_start','Fastprisstart',1),('delivery_model','quickstart_package','Snabbstartspaket',2),
('delivery_model','proof_of_concept','Proof of Concept',3),('delivery_model','phased_implementation','Successiv implementation',4),
('delivery_model','traditional_project','Traditionellt implementationsprojekt',5),('delivery_model','maintenance_partner','Förvaltningspartner',6),
('delivery_model','managed_services','Managed Services',7);

CREATE TABLE public.partner_bc_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.partner_product_profiles(id) ON DELETE CASCADE,
  attribute_type text NOT NULL,
  value_key text NOT NULL,
  verification_status text NOT NULL DEFAULT 'unverified',
  verified_by text,
  verified_at date,
  source_url text,
  editorial_note text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, attribute_type, value_key),
  FOREIGN KEY (attribute_type, value_key) REFERENCES public.bc_attribute_options(attribute_type, value_key),
  CONSTRAINT pba_status_chk CHECK (verification_status IN ('partner_verified','editorial_verified','public_source','legacy_import','unverified')),
  CONSTRAINT pba_source_chk CHECK (verification_status NOT IN ('partner_verified','editorial_verified','public_source') OR verified_by IS NOT NULL),
  CONSTRAINT pba_date_chk CHECK (verification_status <> 'partner_verified' OR verified_at IS NOT NULL)
);
GRANT ALL ON public.partner_bc_attributes TO service_role;
ALTER TABLE public.partner_bc_attributes ENABLE ROW LEVEL SECURITY;

-- 4. Branschlösningar
CREATE TABLE public.partner_industry_solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.partner_product_profiles(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(trim(name)) > 0),
  description text,
  industries text[] NOT NULL DEFAULT '{}',
  solution_type text NOT NULL DEFAULT 'own' CHECK (solution_type IN ('own','third_party','packaged_offering')),
  source_url text,
  partner_verified boolean NOT NULL DEFAULT false,
  editorial_verified boolean NOT NULL DEFAULT false,
  verified_at date,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pis_date_chk CHECK (NOT partner_verified OR verified_at IS NOT NULL)
);
GRANT ALL ON public.partner_industry_solutions TO service_role;
ALTER TABLE public.partner_industry_solutions ENABLE ROW LEVEL SECURITY;

-- 5. Certifieringar (tom struktur)
CREATE TABLE public.partner_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.product_catalog(id),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  issuer text,
  valid_from date,
  valid_to date,
  source_url text,
  verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('partner_verified','editorial_verified','public_source','legacy_import','unverified')),
  verified_by text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.partner_certifications TO service_role;
ALTER TABLE public.partner_certifications ENABLE ROW LEVEL SECURITY;

-- Triggers
CREATE OR REPLACE FUNCTION public.ppp_require_active_product()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR NEW.product_id IS DISTINCT FROM OLD.product_id)
     AND NOT EXISTS (SELECT 1 FROM public.product_catalog WHERE id = NEW.product_id AND is_active) THEN
    RAISE EXCEPTION 'Produkten är inaktiv eller saknas';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER ppp_require_active_product_trg BEFORE INSERT OR UPDATE ON public.partner_product_profiles
FOR EACH ROW EXECUTE FUNCTION public.ppp_require_active_product();

CREATE OR REPLACE FUNCTION public.pba_require_bc_profile()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.partner_product_profiles p JOIN public.product_catalog c ON c.id = p.product_id
                 WHERE p.id = NEW.profile_id AND c.product_key = 'business-central') THEN
    RAISE EXCEPTION 'BC-attribut kan bara kopplas till en Business Central-profil';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER pba_require_bc_profile_trg BEFORE INSERT OR UPDATE ON public.partner_bc_attributes
FOR EACH ROW EXECUTE FUNCTION public.pba_require_bc_profile();

CREATE TRIGGER product_catalog_upd BEFORE UPDATE ON public.product_catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER ppp_upd BEFORE UPDATE ON public.partner_product_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER pba_upd BEFORE UPDATE ON public.partner_bc_attributes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER pis_upd BEFORE UPDATE ON public.partner_industry_solutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER pcert_upd BEFORE UPDATE ON public.partner_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Backfill: produktprofiler från befintliga produkter (legacy_import, opublicerade)
INSERT INTO public.partner_product_profiles (partner_id, product_id, status, verification_status)
SELECT DISTINCT p.id, c.id, 'draft', 'legacy_import'
FROM public.partners p
CROSS JOIN LATERAL unnest(COALESCE(p.applications, '{}')) AS app(name)
JOIN public.product_catalog c ON app.name = ANY(c.legacy_names)
ON CONFLICT (partner_id, product_id) DO NOTHING;

-- Exportvy v1.0 (endast publicerat, inga kontaktuppgifter)
CREATE VIEW public.export_bc_partner_v1 WITH (security_invoker = on) AS
SELECT
  '1.0'::text AS schema_version,
  p.id AS partner_id, p.name AS partner_name, p.slug AS partner_slug, p.logo_url,
  '/partner/' || p.slug || '/' AS profile_url,
  pp.verification_status, pp.verified_at AS last_verified_at,
  COALESCE(p.geography, '{}') AS geography,
  COALESCE(p.office_cities, '{}'::text[]) AS office_cities,
  COALESCE(p.product_filters->'bc'->'companySize', '[]'::jsonb) AS customer_size_ranges,
  COALESCE(p.product_filters->'bc'->'revenue', '[]'::jsonb) AS revenue_ranges,
  COALESCE(p.product_filters->'bc'->'industries', '[]'::jsonb) AS industries,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key',a.value_key,'sourceType',a.verification_status,'verifiedAt',a.verified_at) ORDER BY a.value_key),'[]') FROM public.partner_bc_attributes a WHERE a.profile_id=pp.id AND a.is_published AND a.attribute_type='competency') AS bc_competencies,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key',a.value_key,'sourceType',a.verification_status,'verifiedAt',a.verified_at) ORDER BY a.value_key),'[]') FROM public.partner_bc_attributes a WHERE a.profile_id=pp.id AND a.is_published AND a.attribute_type='migration') AS migration_experience,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key',a.value_key,'sourceType',a.verification_status,'verifiedAt',a.verified_at) ORDER BY a.value_key),'[]') FROM public.partner_bc_attributes a WHERE a.profile_id=pp.id AND a.is_published AND a.attribute_type='project_type') AS project_types,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key',a.value_key,'sourceType',a.verification_status,'verifiedAt',a.verified_at) ORDER BY a.value_key),'[]') FROM public.partner_bc_attributes a WHERE a.profile_id=pp.id AND a.is_published AND a.attribute_type='delivery_model') AS delivery_models,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('name',s.name,'description',s.description,'industries',s.industries,'type',s.solution_type,'sourceUrl',s.source_url,'partnerVerified',s.partner_verified,'editorialVerified',s.editorial_verified,'verifiedAt',s.verified_at)),'[]') FROM public.partner_industry_solutions s WHERE s.profile_id=pp.id AND s.is_published) AS industry_solutions
FROM public.partner_product_profiles pp
JOIN public.product_catalog c ON c.id = pp.product_id AND c.product_key = 'business-central'
JOIN public.partners p ON p.id = pp.partner_id
WHERE pp.is_published;
REVOKE ALL ON public.export_bc_partner_v1 FROM anon, authenticated;
GRANT SELECT ON public.export_bc_partner_v1 TO service_role;

-- Städning av förra stegets fält (tomma)
DROP TRIGGER IF EXISTS partners_validate_verified_by_trg ON public.partners;
DROP FUNCTION IF EXISTS public.partners_validate_verified_by();
ALTER TABLE public.partners DROP COLUMN IF EXISTS structured_profile, DROP COLUMN IF EXISTS data_verified_at, DROP COLUMN IF EXISTS data_verified_by;
ALTER TABLE public.partner_submissions DROP COLUMN IF EXISTS structured_profile;