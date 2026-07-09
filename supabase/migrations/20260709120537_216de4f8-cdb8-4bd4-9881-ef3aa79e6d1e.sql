
ALTER TABLE public.partner_news
  ADD COLUMN IF NOT EXISTS product_areas text[] NOT NULL DEFAULT '{}';

-- Backfill from existing single value
UPDATE public.partner_news
   SET product_areas = ARRAY[product_area]
 WHERE (product_areas IS NULL OR array_length(product_areas,1) IS NULL)
   AND product_area IS NOT NULL;

-- Validation trigger: each item must be an allowed value; keep product_area in sync
CREATE OR REPLACE FUNCTION public.partner_news_product_areas_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  allowed text[] := ARRAY['business-central','finance-scm','crm','crm-sales','crm-service','power-platform','microsoft-ai','ovrigt'];
  a text;
BEGIN
  IF NEW.product_areas IS NULL OR array_length(NEW.product_areas, 1) IS NULL THEN
    IF NEW.product_area IS NOT NULL THEN
      NEW.product_areas := ARRAY[NEW.product_area];
    ELSE
      RAISE EXCEPTION 'Minst ett produktområde krävs';
    END IF;
  END IF;

  FOREACH a IN ARRAY NEW.product_areas LOOP
    IF NOT (a = ANY(allowed)) THEN
      RAISE EXCEPTION 'Ogiltigt produktområde: %', a;
    END IF;
  END LOOP;

  -- Keep primary product_area = first entry for backward compatibility
  NEW.product_area := NEW.product_areas[1];
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partner_news_product_areas_validate_trg ON public.partner_news;
CREATE TRIGGER partner_news_product_areas_validate_trg
BEFORE INSERT OR UPDATE ON public.partner_news
FOR EACH ROW EXECUTE FUNCTION public.partner_news_product_areas_validate();

CREATE INDEX IF NOT EXISTS partner_news_product_areas_gin
  ON public.partner_news USING GIN (product_areas);
