-- 1) Add ai_profile jsonb column to partners and partner_submissions
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS ai_profile jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.partner_submissions ADD COLUMN IF NOT EXISTS ai_profile jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 2) Recreate partners_public view to include ai_profile (preserve existing column set)
DROP VIEW IF EXISTS public.partners_public;
CREATE VIEW public.partners_public AS
SELECT
  id, slug, name, description, logo_url, logo_dark_bg, website, email,
  contact_person, contact_photo_url, phone, applications, industries,
  secondary_industries, geography, product_filters, industry_apps, is_featured,
  customer_examples, office_cities, map_url, youtube_video_id, created_at,
  updated_at, industry_pitches, agreement_signed, related_party,
  positioning_statement, delivery_profile, team_size_sweden,
  implementations_done, not_a_fit, implementations_per_app,
  invoice_email, invoice_contact, org_number, legal_name,
  ai_summary, ai_summary_generated_at,
  ai_profile
FROM public.partners;

GRANT SELECT ON public.partners_public TO anon, authenticated;

-- 3) One-time data migration: aggregate legacy per-product AI into partner-level ai_profile.
-- Mapping:
--   Standard caps (Microsoft Standard) -> 'standard-copilot'
--   Partner-built caps (Copilot Studio/Power Platform) -> 'copilot-studio'  AND  'power-platform'
--   Advanced caps (Azure AI/ML) -> 'azure-ai'
-- ai_relevant_areas: include product label for each product key with any aiCapabilities
-- evidence_level: ['self-declared']
-- delivery_model: NULL (ej angivet)
-- experience_level: NULL, project_count_range: NULL
UPDATE public.partners p SET ai_profile = jsonb_build_object(
  'capabilities', (
    SELECT COALESCE(jsonb_agg(DISTINCT cap), '[]'::jsonb) FROM (
      SELECT 'standard-copilot' AS cap
        WHERE EXISTS (
          SELECT 1 FROM jsonb_each(p.product_filters) pf
          WHERE jsonb_typeof(pf.value->'aiCapabilities') = 'array'
            AND EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(pf.value->'aiCapabilities') c
              WHERE c IN ('ai-standard','bc-copilot','ai-assistant')
                 OR c LIKE '%-std-%'
            )
        )
      UNION ALL
      SELECT 'copilot-studio'
        WHERE EXISTS (
          SELECT 1 FROM jsonb_each(p.product_filters) pf
          WHERE jsonb_typeof(pf.value->'aiCapabilities') = 'array'
            AND EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(pf.value->'aiCapabilities') c
              WHERE c IN ('ai-partner','bc-agent','ai-agents')
                 OR c LIKE '%-partner-%'
            )
        )
      UNION ALL
      SELECT 'power-platform'
        WHERE EXISTS (
          SELECT 1 FROM jsonb_each(p.product_filters) pf
          WHERE jsonb_typeof(pf.value->'aiCapabilities') = 'array'
            AND EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(pf.value->'aiCapabilities') c
              WHERE c IN ('ai-automation','ai-prediction')
                 OR c LIKE '%-partner-automation'
            )
        )
      UNION ALL
      SELECT 'azure-ai'
        WHERE EXISTS (
          SELECT 1 FROM jsonb_each(p.product_filters) pf
          WHERE jsonb_typeof(pf.value->'aiCapabilities') = 'array'
            AND EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(pf.value->'aiCapabilities') c
              WHERE c IN ('ai-advanced','bc-azure','ai-azure')
                 OR c LIKE '%-adv-%'
            )
        )
    ) AS subq
  ),
  'relevant_areas', (
    SELECT COALESCE(jsonb_agg(DISTINCT area), '[]'::jsonb) FROM (
      SELECT CASE k
        WHEN 'bc'      THEN 'Business Central'
        WHEN 'fsc'     THEN 'Dynamics 365 Finance'
        WHEN 'sales'   THEN 'Dynamics 365 Sales'
        WHEN 'service' THEN 'Dynamics 365 Customer Service'
      END AS area
      FROM jsonb_each(p.product_filters) AS t(k, v)
      WHERE k IN ('bc','fsc','sales','service')
        AND jsonb_typeof(v->'aiCapabilities') = 'array'
        AND jsonb_array_length(v->'aiCapabilities') > 0
      UNION ALL
      SELECT 'Dynamics 365 Supply Chain Management'
      WHERE EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(COALESCE(p.product_filters->'fsc'->'aiCapabilities','[]'::jsonb)) c
        WHERE c LIKE 'fsc-%scm%' OR c LIKE 'fsc-%supply%'
      )
    ) sub
    WHERE area IS NOT NULL
  ),
  'use_cases', '[]'::jsonb,
  'experience_level', NULL,
  'project_count_range', NULL,
  'evidence_level', jsonb_build_array('self-declared'),
  'delivery_model', NULL,
  'description', NULL,
  'migrated_at', to_jsonb(now())
)
WHERE p.ai_profile = '{}'::jsonb
  AND p.product_filters IS NOT NULL
  AND p.product_filters <> '{}'::jsonb;