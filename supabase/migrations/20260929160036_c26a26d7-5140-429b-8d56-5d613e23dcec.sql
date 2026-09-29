BEGIN;
-- Flytta eventuella BC-val till förmågemodellen med bevarad metadata
INSERT INTO public.partner_product_capabilities (partner_product_profile_id, capability_product_id, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note, created_at, updated_at)
SELECT a.partner_product_profile_id, c.id, a.verification_status, a.source_type, a.source_url, a.verified_by, a.verified_at, a.is_published,
       COALESCE(a.editorial_note || ' | ', '') || 'Migrerad från BC-attribut ' || o.attribute_key, a.created_at, a.updated_at
FROM public.partner_product_attributes a
JOIN public.product_attribute_options o ON o.id = a.product_attribute_option_id
JOIN public.product_catalog c ON c.product_key = CASE o.attribute_key
  WHEN 'reporting_power_bi' THEN 'power-bi' WHEN 'power_platform_bc' THEN 'power-platform' WHEN 'copilot_bc' THEN 'copilot' END
WHERE o.attribute_key IN ('reporting_power_bi','power_platform_bc','copilot_bc')
ON CONFLICT (partner_product_profile_id, capability_product_id) DO NOTHING;

DELETE FROM public.partner_product_attributes a
USING public.product_attribute_options o
WHERE o.id = a.product_attribute_option_id AND o.attribute_key IN ('reporting_power_bi','power_platform_bc','copilot_bc');

-- Inaktiva alternativ kan inte väljas
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
  IF (TG_OP = 'INSERT' OR NEW.product_attribute_option_id IS DISTINCT FROM OLD.product_attribute_option_id)
     AND NOT EXISTS (SELECT 1 FROM public.product_attribute_options WHERE id = NEW.product_attribute_option_id AND is_active) THEN
    RAISE EXCEPTION 'Alternativet är inaktivt (kan vara ersatt av en tvärgående förmåga)';
  END IF;
  IF NEW.source_type IS NULL THEN
    NEW.source_type := CASE NEW.verification_status
      WHEN 'partner_verified' THEN 'partner' WHEN 'editorial_verified' THEN 'redaktion'
      WHEN 'public_source' THEN 'publik_kalla' WHEN 'legacy_import' THEN 'import' ELSE NULL END;
  END IF;
  RETURN NEW;
END; $$;
COMMIT;