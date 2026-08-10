BEGIN;

CREATE OR REPLACE FUNCTION public.replace_jsonb_text_ci(j jsonb, pattern text, replacement text)
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
    RETURN to_jsonb(regexp_replace(j #>> '{}', pattern, replacement, 'gi'));
  ELSIF jsonb_typeof(j) = 'object' THEN
    result := '{}'::jsonb;
    FOR key, val IN SELECT * FROM jsonb_each(j) LOOP
      result := result || jsonb_build_object(key, public.replace_jsonb_text_ci(val, pattern, replacement));
    END LOOP;
    RETURN result;
  ELSIF jsonb_typeof(j) = 'array' THEN
    result := '[]'::jsonb;
    FOR arr_elem IN SELECT * FROM jsonb_array_elements(j) LOOP
      result := result || jsonb_build_array(public.replace_jsonb_text_ci(arr_elem, pattern, replacement));
    END LOOP;
    RETURN result;
  ELSE
    RETURN j;
  END IF;
END;
$$;

-- Ampersand-form in product_filters text fields
UPDATE public.partners
SET product_filters = public.replace_jsonb_text_ci(product_filters, 'bygg & entreprenad', 'bygg, entreprenad & installation')
WHERE product_filters::text ILIKE '%bygg & entreprenad%';

-- Hyphenated forms in product_filters text fields
UPDATE public.partners
SET product_filters = public.replace_jsonb_text_ci(product_filters, 'bygg- och entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE product_filters::text ILIKE '%bygg- och entreprenad%';

UPDATE public.partners
SET product_filters = public.replace_jsonb_text_ci(product_filters, 'bygg- & entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE product_filters::text ILIKE '%bygg- & entreprenad%';

-- Ampersand form in plain text columns
UPDATE public.partners
SET positioning_statement = regexp_replace(positioning_statement, 'bygg & entreprenad', 'bygg, entreprenad & installation', 'gi')
WHERE positioning_statement ILIKE '%bygg & entreprenad%';

UPDATE public.partners
SET extended_content = regexp_replace(extended_content, 'bygg & entreprenad', 'bygg, entreprenad & installation', 'gi')
WHERE extended_content ILIKE '%bygg & entreprenad%';

UPDATE public.industry_pages
SET intro = regexp_replace(intro, 'bygg & entreprenad', 'bygg, entreprenad & installation', 'gi')
WHERE intro ILIKE '%bygg & entreprenad%';

-- Hyphenated forms in industry intro (branschsidan)
UPDATE public.industry_pages
SET intro = regexp_replace(intro, 'bygg- och entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1', 'gi')
WHERE intro ILIKE '%bygg- och entreprenad%';

UPDATE public.industry_pages
SET intro = regexp_replace(intro, 'bygg- & entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1', 'gi')
WHERE intro ILIKE '%bygg- & entreprenad%';

DROP FUNCTION public.replace_jsonb_text_ci(jsonb, text, text);

COMMIT;