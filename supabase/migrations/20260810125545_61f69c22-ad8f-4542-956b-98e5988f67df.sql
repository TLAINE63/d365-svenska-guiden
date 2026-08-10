BEGIN;

-- Rekursiv hjälpfunktion för att byta ut en sträng i alla JSONB-värden
CREATE OR REPLACE FUNCTION public.replace_jsonb_string(j jsonb, old_str text, new_str text)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  key text;
  val jsonb;
  arr_elem jsonb;
BEGIN
  IF jsonb_typeof(j) = 'string' THEN
    IF j #>> '{}' = old_str THEN
      RETURN to_jsonb(new_str);
    ELSE
      RETURN j;
    END IF;
  ELSIF jsonb_typeof(j) = 'object' THEN
    result := '{}'::jsonb;
    FOR key, val IN SELECT * FROM jsonb_each(j) LOOP
      result := result || jsonb_build_object(key, public.replace_jsonb_string(val, old_str, new_str));
    END LOOP;
    RETURN result;
  ELSIF jsonb_typeof(j) = 'array' THEN
    result := '[]'::jsonb;
    FOR arr_elem IN SELECT * FROM jsonb_array_elements(j) LOOP
      result := result || jsonb_build_array(public.replace_jsonb_string(arr_elem, old_str, new_str));
    END LOOP;
    RETURN result;
  ELSE
    RETURN j;
  END IF;
END;
$$;

-- Uppdatera branschsida
UPDATE public.industry_pages
SET name = 'Bygg, Entreprenad & Installation',
    meta_title = 'Bygg, Entreprenad & Installation och Microsoft Dynamics 365',
    meta_description = 'En guide för beslutsfattare i bygg-, entreprenad- och installationsbranschen. Lär dig hur Dynamics 365 kan stödja era projekt, processer och utmaningar.'
WHERE slug = 'bygg-entreprenad';

-- Uppdatera textarray-kolumner
UPDATE public.partners
SET industries = array_replace(industries, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation'),
    secondary_industries = array_replace(secondary_industries, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE 'Bygg & Entreprenad' = ANY(industries)
   OR 'Bygg & Entreprenad' = ANY(secondary_industries);

UPDATE public.partner_submissions
SET industries = array_replace(industries, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation'),
    secondary_industries = array_replace(secondary_industries, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE 'Bygg & Entreprenad' = ANY(industries)
   OR 'Bygg & Entreprenad' = ANY(secondary_industries);

-- Uppdatera leads
UPDATE public.leads
SET industry = 'Bygg, Entreprenad & Installation'
WHERE industry = 'Bygg & Entreprenad';

-- Uppdatera JSONB-kolumner
UPDATE public.partners
SET product_filters = public.replace_jsonb_string(product_filters, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE product_filters::text ILIKE '%Bygg & Entreprenad%';

UPDATE public.partners
SET industry_pitches = public.replace_jsonb_string(industry_pitches, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE industry_pitches::text ILIKE '%Bygg & Entreprenad%';

UPDATE public.partners
SET observed_industries = public.replace_jsonb_string(observed_industries, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE observed_industries::text ILIKE '%Bygg & Entreprenad%';

UPDATE public.partner_submissions
SET product_filters = public.replace_jsonb_string(product_filters, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE product_filters::text ILIKE '%Bygg & Entreprenad%';

-- Rensa hjälpfunktionen
DROP FUNCTION public.replace_jsonb_string(jsonb, text, text);

COMMIT;