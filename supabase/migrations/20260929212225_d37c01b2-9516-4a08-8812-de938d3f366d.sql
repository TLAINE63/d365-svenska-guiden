CREATE OR REPLACE FUNCTION public.ppc_mirror_partner_level()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pid uuid;
BEGIN
  IF pg_trigger_depth() > 1 THEN RETURN NULL; END IF;
  IF TG_OP = 'DELETE' THEN
    SELECT partner_id INTO pid FROM partner_product_profiles WHERE id = OLD.partner_product_profile_id;
    DELETE FROM partner_product_capabilities c USING partner_product_profiles p
      WHERE c.partner_product_profile_id = p.id AND p.partner_id = pid
        AND c.capability_product_id = OLD.capability_product_id AND c.id <> OLD.id;
    RETURN NULL;
  END IF;
  SELECT partner_id INTO pid FROM partner_product_profiles WHERE id = NEW.partner_product_profile_id;
  IF TG_OP = 'UPDATE' THEN
    UPDATE partner_product_capabilities c SET
      verification_status = NEW.verification_status, source_type = NEW.source_type, verified_by = NEW.verified_by,
      verified_at = NEW.verified_at, is_published = NEW.is_published, editorial_note = NEW.editorial_note, source_url = NEW.source_url
    FROM partner_product_profiles p
    WHERE c.partner_product_profile_id = p.id AND p.partner_id = pid
      AND c.capability_product_id = NEW.capability_product_id AND c.id <> NEW.id;
  END IF;
  INSERT INTO partner_product_capabilities (partner_product_profile_id, capability_product_id, verification_status, source_type, verified_by, verified_at, is_published, editorial_note, source_url)
  SELECT p.id, NEW.capability_product_id, NEW.verification_status, NEW.source_type, NEW.verified_by, NEW.verified_at, NEW.is_published, NEW.editorial_note, NEW.source_url
  FROM partner_product_profiles p
  WHERE p.partner_id = pid AND p.id <> NEW.partner_product_profile_id
    AND p.product_id <> NEW.capability_product_id
    AND NOT EXISTS (SELECT 1 FROM partner_product_capabilities x WHERE x.partner_product_profile_id = p.id AND x.capability_product_id = NEW.capability_product_id);
  RETURN NULL;
END $$;
REVOKE EXECUTE ON FUNCTION public.ppc_mirror_partner_level() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS ppc_mirror_partner_level ON public.partner_product_capabilities;
CREATE TRIGGER ppc_mirror_partner_level AFTER INSERT OR UPDATE OR DELETE ON public.partner_product_capabilities
FOR EACH ROW EXECUTE FUNCTION public.ppc_mirror_partner_level();

-- Backfill: sprid befintliga förmågor till partnerns alla produktprofiler (bäst verifierade raden vinner)
INSERT INTO public.partner_product_capabilities (partner_product_profile_id, capability_product_id, verification_status, source_type, verified_by, verified_at, is_published, editorial_note, source_url)
SELECT p.id, b.capability_product_id, b.verification_status, b.source_type, b.verified_by, b.verified_at, b.is_published, b.editorial_note, b.source_url
FROM (
  SELECT DISTINCT ON (pp.partner_id, c.capability_product_id) pp.partner_id, c.*
  FROM public.partner_product_capabilities c JOIN public.partner_product_profiles pp ON pp.id = c.partner_product_profile_id
  ORDER BY pp.partner_id, c.capability_product_id, c.is_published DESC,
    CASE c.verification_status WHEN 'partner_verified' THEN 1 WHEN 'editorial_verified' THEN 2 WHEN 'public_source' THEN 3 ELSE 4 END
) b
JOIN public.partner_product_profiles p ON p.partner_id = b.partner_id AND p.product_id <> b.capability_product_id
WHERE NOT EXISTS (SELECT 1 FROM public.partner_product_capabilities x WHERE x.partner_product_profile_id = p.id AND x.capability_product_id = b.capability_product_id);