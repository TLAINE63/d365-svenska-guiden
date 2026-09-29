BEGIN;

-- 1. Katalogklassificering
ALTER TABLE public.product_catalog
  ADD COLUMN catalog_type text,
  ADD COLUMN display_group text,
  ADD COLUMN parent_product_id uuid REFERENCES public.product_catalog(id);

UPDATE public.product_catalog SET catalog_type='app', display_group='erp'
 WHERE product_key IN ('business-central','finance','supply-chain','project-operations','commerce','human-resources');
UPDATE public.product_catalog SET catalog_type='app', display_group='crm'
 WHERE product_key IN ('sales','customer-service','field-service','customer-insights','contact-center');
UPDATE public.product_catalog SET catalog_type='platform', display_group='platform' WHERE product_key='power-platform';
UPDATE public.product_catalog SET catalog_type='capability', display_group='platform',
  parent_product_id=(SELECT id FROM public.product_catalog WHERE product_key='power-platform')
 WHERE product_key IN ('power-apps','power-automate','power-pages','dataverse');
UPDATE public.product_catalog SET catalog_type='capability', display_group='data_analytics' WHERE product_key='power-bi';
UPDATE public.product_catalog SET catalog_type='capability', display_group='ai' WHERE product_key IN ('copilot','copilot-studio','ai-agents');
INSERT INTO public.product_catalog (product_key, name, category, catalog_type, display_group, sort_order)
VALUES ('fabric','Microsoft Fabric','data-ai','capability','data_analytics',315)
ON CONFLICT (product_key) DO NOTHING;

ALTER TABLE public.product_catalog
  ALTER COLUMN catalog_type SET NOT NULL,
  ALTER COLUMN display_group SET NOT NULL,
  ADD CONSTRAINT product_catalog_catalog_type_check CHECK (catalog_type IN ('app','platform','capability')),
  ADD CONSTRAINT product_catalog_display_group_check CHECK (display_group IN ('erp','crm','platform','data_analytics','ai'));

-- 2. Paket/grupper (F&SCM)
CREATE TABLE public.product_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key text NOT NULL UNIQUE CHECK (group_key ~ '^[a-z0-9-]+$'),
  name text NOT NULL,
  purpose text NOT NULL DEFAULT 'display' CHECK (purpose IN ('display','export','display_export')),
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.product_group_members (
  group_id uuid NOT NULL REFERENCES public.product_groups(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.product_catalog(id),
  PRIMARY KEY (group_id, product_id)
);
GRANT ALL ON public.product_groups, public.product_group_members TO service_role;
ALTER TABLE public.product_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_group_members ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER product_groups_set_updated_at BEFORE UPDATE ON public.product_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.product_groups (group_key, name, purpose, sort_order) VALUES ('fscm','F&SCM','display_export',20);
INSERT INTO public.product_group_members (group_id, product_id)
SELECT g.id, c.id FROM public.product_groups g, public.product_catalog c
WHERE g.group_key='fscm' AND c.product_key IN ('finance','supply-chain');

-- Distinkt partner per grupp (undviker dubbelräkning)
CREATE VIEW public.partner_product_group_membership WITH (security_invoker=on) AS
SELECT DISTINCT g.group_key, pp.partner_id,
  bool_or(pp.is_published) OVER (PARTITION BY g.group_key, pp.partner_id) AS any_published
FROM public.product_groups g
JOIN public.product_group_members m ON m.group_id=g.id
JOIN public.partner_product_profiles pp ON pp.product_id=m.product_id;
GRANT SELECT ON public.partner_product_group_membership TO service_role;

-- 3. Gemensam attributkatalog
CREATE TABLE public.product_attribute_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.product_catalog(id),
  dimension_key text NOT NULL CHECK (dimension_key ~ '^[a-z0-9_]+$'),
  attribute_key text NOT NULL CHECK (attribute_key ~ '^[a-z0-9_-]+$'),
  label text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, dimension_key, attribute_key)
);
GRANT ALL ON public.product_attribute_options TO service_role;
ALTER TABLE public.product_attribute_options ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER product_attribute_options_set_updated_at BEFORE UPDATE ON public.product_attribute_options FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.product_attribute_options (product_id, dimension_key, attribute_key, label, sort_order, is_active)
SELECT c.id, o.attribute_type, o.value_key, o.label, o.sort_order, o.is_active
FROM public.bc_attribute_options o CROSS JOIN public.product_catalog c
WHERE c.product_key='business-central';

-- 4. Gemensamma partnerval
CREATE TABLE public.partner_product_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_product_profile_id uuid NOT NULL REFERENCES public.partner_product_profiles(id) ON DELETE CASCADE,
  product_attribute_option_id uuid NOT NULL REFERENCES public.product_attribute_options(id),
  verification_status text NOT NULL DEFAULT 'unverified',
  source_type text,
  source_url text,
  verified_by text,
  verified_at date,
  is_published boolean NOT NULL DEFAULT false,
  editorial_note text,
  legacy_bc_attribute_id uuid UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_product_profile_id, product_attribute_option_id),
  CONSTRAINT ppa_status_chk CHECK (verification_status IN ('partner_verified','editorial_verified','public_source','legacy_import','unverified')),
  CONSTRAINT ppa_source_type_chk CHECK (source_type IS NULL OR source_type IN ('partner','redaktion','publik_kalla','import')),
  CONSTRAINT ppa_source_chk CHECK (verification_status NOT IN ('partner_verified','editorial_verified','public_source') OR verified_by IS NOT NULL),
  CONSTRAINT ppa_date_chk CHECK (verification_status <> 'partner_verified' OR verified_at IS NOT NULL)
);
CREATE INDEX ppa_option_idx ON public.partner_product_attributes(product_attribute_option_id);
GRANT ALL ON public.partner_product_attributes TO service_role;
ALTER TABLE public.partner_product_attributes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER partner_product_attributes_set_updated_at BEFORE UPDATE ON public.partner_product_attributes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Attributet måste tillhöra profilens produkt
CREATE OR REPLACE FUNCTION public.ppa_require_matching_product()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.partner_product_profiles p
    JOIN public.product_attribute_options o ON o.product_id = p.product_id
    WHERE p.id = NEW.partner_product_profile_id AND o.id = NEW.product_attribute_option_id
  ) THEN
    RAISE EXCEPTION 'Attributet tillhör inte profilens produkt';
  END IF;
  IF NEW.source_type IS NULL THEN
    NEW.source_type := CASE NEW.verification_status
      WHEN 'partner_verified' THEN 'partner' WHEN 'editorial_verified' THEN 'redaktion'
      WHEN 'public_source' THEN 'publik_kalla' WHEN 'legacy_import' THEN 'import' ELSE NULL END;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER ppa_require_matching_product_trg BEFORE INSERT OR UPDATE ON public.partner_product_attributes
FOR EACH ROW EXECUTE FUNCTION public.ppa_require_matching_product();

-- Migrera befintliga BC-val (0 rader vid migreringstillfället, men skriptet är komplett)
INSERT INTO public.partner_product_attributes (partner_product_profile_id, product_attribute_option_id, verification_status, source_url, verified_by, verified_at, is_published, editorial_note, legacy_bc_attribute_id, created_at, updated_at)
SELECT a.profile_id, o.id, a.verification_status, a.source_url, a.verified_by, a.verified_at, a.is_published, a.editorial_note, a.id, a.created_at, a.updated_at
FROM public.partner_bc_attributes a
JOIN public.product_catalog c ON c.product_key='business-central'
JOIN public.product_attribute_options o ON o.product_id=c.id AND o.dimension_key=a.attribute_type AND o.attribute_key=a.value_key
ON CONFLICT DO NOTHING;

-- 5. Tvärgående förmågor per produktprofil
CREATE TABLE public.partner_product_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_product_profile_id uuid NOT NULL REFERENCES public.partner_product_profiles(id) ON DELETE CASCADE,
  capability_product_id uuid NOT NULL REFERENCES public.product_catalog(id),
  verification_status text NOT NULL DEFAULT 'unverified',
  source_type text,
  source_url text,
  verified_by text,
  verified_at date,
  is_published boolean NOT NULL DEFAULT false,
  editorial_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_product_profile_id, capability_product_id),
  CONSTRAINT ppc_status_chk CHECK (verification_status IN ('partner_verified','editorial_verified','public_source','legacy_import','unverified')),
  CONSTRAINT ppc_source_type_chk CHECK (source_type IS NULL OR source_type IN ('partner','redaktion','publik_kalla','import')),
  CONSTRAINT ppc_source_chk CHECK (verification_status NOT IN ('partner_verified','editorial_verified','public_source') OR verified_by IS NOT NULL),
  CONSTRAINT ppc_date_chk CHECK (verification_status <> 'partner_verified' OR verified_at IS NOT NULL)
);
GRANT ALL ON public.partner_product_capabilities TO service_role;
ALTER TABLE public.partner_product_capabilities ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER partner_product_capabilities_set_updated_at BEFORE UPDATE ON public.partner_product_capabilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.ppc_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.product_catalog WHERE id = NEW.capability_product_id AND catalog_type IN ('capability','platform') AND is_active) THEN
    RAISE EXCEPTION 'Endast aktiva förmågor eller plattformar kan kopplas som tvärgående förmåga';
  END IF;
  IF EXISTS (SELECT 1 FROM public.partner_product_profiles WHERE id = NEW.partner_product_profile_id AND product_id = NEW.capability_product_id) THEN
    RAISE EXCEPTION 'En profil kan inte ha sin egen produkt som förmåga';
  END IF;
  IF NEW.source_type IS NULL THEN
    NEW.source_type := CASE NEW.verification_status
      WHEN 'partner_verified' THEN 'partner' WHEN 'editorial_verified' THEN 'redaktion'
      WHEN 'public_source' THEN 'publik_kalla' WHEN 'legacy_import' THEN 'import' ELSE NULL END;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER ppc_validate_trg BEFORE INSERT OR UPDATE ON public.partner_product_capabilities
FOR EACH ROW EXECUTE FUNCTION public.ppc_validate();

-- 6. Exportvy v1.0 läser nu den gemensamma modellen, samma kolumner och semantik
CREATE OR REPLACE VIEW public.export_bc_partner_v1 WITH (security_invoker=on) AS
SELECT '1.0'::text AS schema_version,
  p.id AS partner_id, p.name AS partner_name, p.slug AS partner_slug, p.logo_url,
  ('/partner/'::text || p.slug) || '/'::text AS profile_url,
  pp.verification_status, pp.verified_at AS last_verified_at,
  COALESCE(p.geography, '{}'::text[]) AS geography,
  COALESCE(p.office_cities, '{}'::text[]) AS office_cities,
  COALESCE((p.product_filters -> 'bc') -> 'companySize', '[]'::jsonb) AS customer_size_ranges,
  COALESCE((p.product_filters -> 'bc') -> 'revenue', '[]'::jsonb) AS revenue_ranges,
  COALESCE((p.product_filters -> 'bc') -> 'industries', '[]'::jsonb) AS industries,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id=a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.dimension_key='competency') AS bc_competencies,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id=a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.dimension_key='migration') AS migration_experience,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id=a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.dimension_key='project_type') AS project_types,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', o.attribute_key, 'sourceType', a.verification_status, 'verifiedAt', a.verified_at) ORDER BY o.attribute_key), '[]'::jsonb)
     FROM public.partner_product_attributes a JOIN public.product_attribute_options o ON o.id=a.product_attribute_option_id
    WHERE a.partner_product_profile_id = pp.id AND a.is_published AND o.dimension_key='delivery_model') AS delivery_models,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', s.name, 'description', s.description, 'industries', s.industries, 'type', s.solution_type, 'sourceUrl', s.source_url, 'partnerVerified', s.partner_verified, 'editorialVerified', s.editorial_verified, 'verifiedAt', s.verified_at)), '[]'::jsonb)
     FROM public.partner_industry_solutions s WHERE s.profile_id = pp.id AND s.is_published) AS industry_solutions
FROM public.partner_product_profiles pp
JOIN public.product_catalog c ON c.id = pp.product_id AND c.product_key = 'business-central'
JOIN public.partners p ON p.id = pp.partner_id
WHERE pp.is_published;

-- 7. Legacy: behålls orörda, men nya skrivningar stoppas
COMMENT ON TABLE public.bc_attribute_options IS 'LEGACY (2026-09-29): ersatt av product_attribute_options. Tas bort först efter godkänd migrering.';
COMMENT ON TABLE public.partner_bc_attributes IS 'LEGACY (2026-09-29): ersatt av partner_product_attributes. Skrivskyddad. Tas bort först efter godkänd migrering.';
CREATE OR REPLACE FUNCTION public.legacy_bc_attributes_block_writes()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RAISE EXCEPTION 'partner_bc_attributes är legacy; skriv till partner_product_attributes';
END; $$;
CREATE TRIGGER legacy_bc_attributes_block_writes_trg BEFORE INSERT OR UPDATE ON public.partner_bc_attributes
FOR EACH ROW EXECUTE FUNCTION public.legacy_bc_attributes_block_writes();

COMMIT;