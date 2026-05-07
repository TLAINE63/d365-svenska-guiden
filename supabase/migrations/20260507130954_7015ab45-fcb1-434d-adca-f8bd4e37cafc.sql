-- Lägg till slug för interna artiklar
ALTER TABLE public.knowledge_articles
  ADD COLUMN IF NOT EXISTS slug text UNIQUE;

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_published
  ON public.knowledge_articles (is_published, published_at DESC);

-- updated_at trigger
DROP TRIGGER IF EXISTS knowledge_articles_set_updated_at ON public.knowledge_articles;
CREATE TRIGGER knowledge_articles_set_updated_at
  BEFORE UPDATE ON public.knowledge_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Validering: publicerade artiklar måste ha title + url + published_at
CREATE OR REPLACE FUNCTION public.knowledge_articles_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.title IS NULL OR length(trim(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'title krävs';
  END IF;

  IF NEW.is_published THEN
    IF NEW.url IS NULL OR length(trim(NEW.url)) = 0 THEN
      RAISE EXCEPTION 'En publicerad artikel måste ha en url';
    END IF;
    IF NEW.published_at IS NULL THEN
      NEW.published_at := now();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS knowledge_articles_validate_trigger ON public.knowledge_articles;
CREATE TRIGGER knowledge_articles_validate_trigger
  BEFORE INSERT OR UPDATE ON public.knowledge_articles
  FOR EACH ROW EXECUTE FUNCTION public.knowledge_articles_validate();

-- Rensa tomma artiklar (saknar title eller url)
DELETE FROM public.knowledge_articles
WHERE title IS NULL
   OR length(trim(title)) = 0
   OR url IS NULL
   OR length(trim(url)) = 0;