BEGIN;

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

UPDATE public.partners
SET industry_apps = public.replace_jsonb_string(industry_apps, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE industry_apps::text ILIKE '%Bygg & Entreprenad%';

UPDATE public.partner_submissions
SET industry_apps = public.replace_jsonb_string(industry_apps, 'Bygg & Entreprenad', 'Bygg, Entreprenad & Installation')
WHERE industry_apps::text ILIKE '%Bygg & Entreprenad%';

DROP FUNCTION public.replace_jsonb_string(jsonb, text, text);

COMMIT;