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

-- industry_pitches
UPDATE public.partners
SET industry_pitches = public.replace_jsonb_text_ci(industry_pitches, 'bygg & entreprenad', 'bygg, entreprenad & installation')
WHERE industry_pitches::text ILIKE '%bygg & entreprenad%';

UPDATE public.partners
SET industry_pitches = public.replace_jsonb_text_ci(industry_pitches, 'bygg- och entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE industry_pitches::text ILIKE '%bygg- och entreprenad%';

UPDATE public.partners
SET industry_pitches = public.replace_jsonb_text_ci(industry_pitches, 'bygg- & entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE industry_pitches::text ILIKE '%bygg- & entreprenad%';

-- ai_profile
UPDATE public.partners
SET ai_profile = public.replace_jsonb_text_ci(ai_profile, 'bygg & entreprenad', 'bygg, entreprenad & installation')
WHERE ai_profile::text ILIKE '%bygg & entreprenad%';

UPDATE public.partners
SET ai_profile = public.replace_jsonb_text_ci(ai_profile, 'bygg- och entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE ai_profile::text ILIKE '%bygg- och entreprenad%';

UPDATE public.partners
SET ai_profile = public.replace_jsonb_text_ci(ai_profile, 'bygg- & entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE ai_profile::text ILIKE '%bygg- & entreprenad%';

-- industry_pages.applications
UPDATE public.industry_pages
SET applications = public.replace_jsonb_text_ci(applications, 'bygg & entreprenad', 'bygg, entreprenad & installation')
WHERE applications::text ILIKE '%bygg & entreprenad%';

UPDATE public.industry_pages
SET applications = public.replace_jsonb_text_ci(applications, 'bygg- och entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE applications::text ILIKE '%bygg- och entreprenad%';

UPDATE public.industry_pages
SET applications = public.replace_jsonb_text_ci(applications, 'bygg- & entreprenad([a-zåäöA-ZÅÄÖ]*)', 'bygg-, entreprenad- och installation\1')
WHERE applications::text ILIKE '%bygg- & entreprenad%';

DROP FUNCTION public.replace_jsonb_text_ci(jsonb, text, text);

COMMIT;