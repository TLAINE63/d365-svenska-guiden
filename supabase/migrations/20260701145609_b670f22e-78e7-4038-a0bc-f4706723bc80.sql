-- 1) Merge Finance and Supply Chain Management into F&SCM in the applications array.
UPDATE public.partners
SET applications = ARRAY(
  SELECT DISTINCT unnest(
    ARRAY(
      SELECT CASE
        WHEN x = 'Finance' OR x = 'Supply Chain Management' THEN 'F&SCM'
        ELSE x
      END
      FROM unnest(applications) AS x
    )
  )
)
WHERE applications && ARRAY['Finance', 'Supply Chain Management'];

-- 2) Merge product_profiles keys for Finance and Supply Chain Management into F&SCM and remove deprecated fields.
UPDATE public.partners
SET product_profiles = COALESCE((
  SELECT jsonb_object_agg(
    CASE WHEN k IN ('Finance', 'Supply Chain Management') THEN 'F&SCM' ELSE k END,
    v - 'roles' - 'engagement_model'
  )
  FROM jsonb_each(product_profiles) AS e(k, v)
), '{}'::jsonb)
WHERE product_profiles ?| ARRAY['Finance', 'Supply Chain Management']
   OR product_profiles @? '$.** ? (@.roles != null || @.engagement_model != null)';

-- 3) Merge implementations_per_app keys for Finance and Supply Chain Management into F&SCM.
UPDATE public.partners
SET implementations_per_app = COALESCE((
  SELECT jsonb_object_agg(
    CASE WHEN k IN ('Finance', 'Supply Chain Management') THEN 'F&SCM' ELSE k END,
    v
  )
  FROM jsonb_each(implementations_per_app) AS e(k, v)
), '{}'::jsonb)
WHERE implementations_per_app ?| ARRAY['Finance', 'Supply Chain Management'];
