-- WP1 Aktuellt: bakåtkompatibel utökning av befintligt artikelregister.
-- Befintliga artiklar påverkas inte (alla nya kolumner är nullable eller har neutrala standardvärden).
ALTER TABLE public.knowledge_articles
  ADD COLUMN IF NOT EXISTS editorial_status text,
  ADD COLUMN IF NOT EXISTS analysis jsonb,
  ADD COLUMN IF NOT EXISTS source_name text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS source_published_at date,
  ADD COLUMN IF NOT EXISTS extra_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS fact_checked_at date,
  ADD COLUMN IF NOT EXISTS product_keys text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS topic text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS customer_status text,
  ADD COLUMN IF NOT EXISTS availability_status text,
  ADD COLUMN IF NOT EXISTS recommended_action text,
  ADD COLUMN IF NOT EXISTS needs_verification boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cta_label text,
  ADD COLUMN IF NOT EXISTS cta_url text,
  ADD COLUMN IF NOT EXISTS editorial_priority integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS context_until date;

ALTER TABLE public.knowledge_articles
  ADD CONSTRAINT knowledge_articles_editorial_status_chk CHECK (editorial_status IS NULL OR editorial_status IN ('candidate','draft','review','approved','published','ignored','archived')),
  ADD CONSTRAINT knowledge_articles_customer_status_chk CHECK (customer_status IS NULL OR customer_status IN ('evaluating','existing','both')),
  ADD CONSTRAINT knowledge_articles_availability_chk CHECK (availability_status IS NULL OR availability_status IN ('planned','preview','rolling_out','available','changed','not_relevant','unclear')),
  ADD CONSTRAINT knowledge_articles_action_chk CHECK (recommended_action IS NULL OR recommended_action IN ('investigate','prepare','monitor','wait')),
  ADD CONSTRAINT knowledge_articles_topic_chk CHECK (topic IS NULL OR topic IN ('ai-copilot','agenter','erp','crm','automation','data-analys','integration','licensiering'));

CREATE UNIQUE INDEX IF NOT EXISTS knowledge_articles_aktuellt_slug_uq
  ON public.knowledge_articles (slug) WHERE content_type = 'aktuellt';
CREATE INDEX IF NOT EXISTS knowledge_articles_aktuellt_source_idx
  ON public.knowledge_articles (source_url) WHERE content_type = 'aktuellt';

-- Intern redaktionell bedömning (relevanspoäng m.m.). Aldrig publik.
CREATE TABLE public.knowledge_article_assessments (
  article_id uuid PRIMARY KEY REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
  relevance_score integer,
  relevance_reason text,
  recommendation text,
  not_publish_reasons text[] NOT NULL DEFAULT '{}'::text[],
  verification_notes text,
  ai_suggestion jsonb,
  ingest_method text NOT NULL DEFAULT 'link',
  intake_source text,
  discovered_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kaa_score_chk CHECK (relevance_score IS NULL OR (relevance_score >= 0 AND relevance_score <= 100)),
  CONSTRAINT kaa_recommendation_chk CHECK (recommendation IS NULL OR recommendation IN ('publish','consider','not_publish')),
  CONSTRAINT kaa_ingest_chk CHECK (ingest_method IN ('link','paste','agent'))
);

GRANT ALL ON public.knowledge_article_assessments TO service_role;
ALTER TABLE public.knowledge_article_assessments ENABLE ROW LEVEL SECURITY;
-- Inga policyer: endast backend (service role) läser och skriver.

CREATE TRIGGER knowledge_article_assessments_set_updated_at
  BEFORE UPDATE ON public.knowledge_article_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Validering: befintliga regler oförändrade, Aktuellt får en publiceringsspärr.
CREATE OR REPLACE FUNCTION public.knowledge_articles_validate()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.title IS NULL OR length(trim(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'title krävs';
  END IF;

  IF NEW.content_type = 'aktuellt' THEN
    IF NEW.editorial_status IS NULL THEN
      NEW.editorial_status := 'candidate';
    END IF;
    -- Publicering kräver status published, och tvärtom.
    IF NEW.is_published AND NEW.editorial_status <> 'published' THEN
      RAISE EXCEPTION 'Aktuellt kan bara publiceras med status publicerad';
    END IF;
    IF NEW.editorial_status = 'published' AND NOT NEW.is_published THEN
      NEW.is_published := true;
    END IF;
    IF NEW.is_published THEN
      -- Ingen automatisk publicering: en ny post kan aldrig vara publicerad direkt,
      -- och en befintlig post måste först vara godkänd av redaktionen.
      IF TG_OP = 'INSERT' THEN
        RAISE EXCEPTION 'Aktuellt kan inte publiceras direkt vid import';
      END IF;
      IF OLD.editorial_status NOT IN ('approved','published') THEN
        RAISE EXCEPTION 'Aktuellt måste godkännas innan publicering';
      END IF;
      IF NEW.source_url IS NULL OR length(trim(NEW.source_url)) = 0 THEN
        RAISE EXCEPTION 'Aktuellt kräver en primärkälla';
      END IF;
      IF NEW.fact_checked_at IS NULL THEN
        RAISE EXCEPTION 'Aktuellt kräver datum för senaste faktakontroll';
      END IF;
      IF NEW.needs_verification THEN
        RAISE EXCEPTION 'Artikeln är markerad Behöver verifieras';
      END IF;
      IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
        RAISE EXCEPTION 'Aktuellt kräver en slug';
      END IF;
      NEW.url := '/aktuellt/' || NEW.slug || '/';
    END IF;
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
$function$;