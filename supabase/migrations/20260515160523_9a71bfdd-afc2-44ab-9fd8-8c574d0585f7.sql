CREATE TABLE public.industry_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  meta_title text,
  meta_description text,
  hero_image_url text,
  intro text,
  processes jsonb NOT NULL DEFAULT '[]'::jsonb,
  challenges jsonb NOT NULL DEFAULT '[]'::jsonb,
  roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  applications jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_industries text[] NOT NULL DEFAULT '{}'::text[],
  is_published boolean NOT NULL DEFAULT false,
  ai_generated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.industry_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published industry pages"
  ON public.industry_pages
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Service role can manage industry pages"
  ON public.industry_pages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_industry_pages_updated_at
  BEFORE UPDATE ON public.industry_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.industry_pages_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    RAISE EXCEPTION 'slug krävs';
  END IF;
  IF NEW.name IS NULL OR length(trim(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'name krävs';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER industry_pages_validate_trigger
  BEFORE INSERT OR UPDATE ON public.industry_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.industry_pages_validate();

CREATE INDEX idx_industry_pages_slug ON public.industry_pages(slug);
CREATE INDEX idx_industry_pages_published ON public.industry_pages(is_published) WHERE is_published = true;