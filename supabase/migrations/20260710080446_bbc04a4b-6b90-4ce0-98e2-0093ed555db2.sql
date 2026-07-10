
-- Vivicta: strip internal advisor sentence from ai_summary
UPDATE public.partners
SET ai_summary = 'Vivicta erbjuder ett helhetsåtagande inom Microsoft Dynamics 365, inklusive Finance, Supply Chain Management, Business Central och de flesta Customer Engagement-moduler. De har kontor i flera svenska städer och fokuserar på branscher som industri, tillverkning, process- och skogsindustri, återvinning, energi, offentlig sektor samt handel och service.'
WHERE slug = 'vivicta';

-- Vivicta: fix contactName typo Perssson -> Persson in product_filters.bc
UPDATE public.partners
SET product_filters = jsonb_set(product_filters, '{bc,contactName}', '"Anton Persson"'::jsonb)
WHERE slug = 'vivicta' AND product_filters->'bc'->>'contactName' = 'Anton Perssson';

-- Vivicta: remove "Kundexempelkangespåföfrågan" from customerExamples in bc filter
UPDATE public.partners
SET product_filters = jsonb_set(
  product_filters,
  '{bc,customerExamples}',
  (
    SELECT COALESCE(jsonb_agg(v), '[]'::jsonb)
    FROM jsonb_array_elements_text(product_filters->'bc'->'customerExamples') v
    WHERE v <> 'Kundexempelkangespåföfrågan'
  )
)
WHERE slug = 'vivicta';

-- Vivicta: fix Contract Invoicing description (was a URL) in industry_apps
UPDATE public.partners
SET industry_apps = (
  SELECT jsonb_agg(
    CASE
      WHEN item->>'name' = 'Contract Invoicing'
      THEN jsonb_set(item, '{description}', '"Contract Invoicing för Business Central automatiserar och effektiviserar hantering av abonnemangs- och avtalsfakturering, med stöd för återkommande fakturor och periodiserade intäkter."'::jsonb)
      ELSE item
    END
  )
  FROM jsonb_array_elements(industry_apps) item
)
WHERE slug = 'vivicta';

-- Vivicta: dedupe Transport & Logistik pitches (keep newer AI-generated version)
UPDATE public.partners
SET industry_pitches = (
  SELECT jsonb_agg(item ORDER BY (item->>'generated_at') DESC)
  FROM (
    SELECT DISTINCT ON (item->>'industry', item->>'product') item
    FROM jsonb_array_elements(industry_pitches) item
    ORDER BY item->>'industry', item->>'product', (item->>'generated_at') DESC
  ) sub
)
WHERE slug = 'vivicta';

-- 4PS: dedupe Bygg & Entreprenad pitches (keep newest, which is partner-edited)
UPDATE public.partners
SET industry_pitches = (
  SELECT jsonb_agg(item ORDER BY (item->>'generated_at') DESC)
  FROM (
    SELECT DISTINCT ON (item->>'industry', item->>'product') item
    FROM jsonb_array_elements(industry_pitches) item
    ORDER BY item->>'industry', item->>'product', (item->>'generated_at') DESC
  ) sub
)
WHERE slug = '4ps-sweden';
