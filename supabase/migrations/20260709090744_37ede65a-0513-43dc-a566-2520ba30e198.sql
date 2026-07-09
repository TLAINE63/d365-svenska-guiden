
CREATE TABLE public.partner_news (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  editorial_title text NOT NULL,
  summary text NOT NULL,
  source_url text NOT NULL,
  source_type text NOT NULL DEFAULT 'other',
  product_area text NOT NULL DEFAULT 'ovrigt',
  news_type text NOT NULL DEFAULT 'artikel',
  industry text,
  image_url text,
  news_date date NOT NULL DEFAULT CURRENT_DATE,
  is_featured boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT false,
  show_on_partner_profile boolean NOT NULL DEFAULT true,
  show_on_product_page boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partner_news_status_check CHECK (status IN ('draft','review','approved','published','unpublished','archived')),
  CONSTRAINT partner_news_source_type_check CHECK (source_type IN ('linkedin','partner_web','blog','press','webinar','event','other')),
  CONSTRAINT partner_news_product_area_check CHECK (product_area IN ('business-central','finance-scm','crm','power-platform','microsoft-ai','ovrigt')),
  CONSTRAINT partner_news_news_type_check CHECK (news_type IN ('kundcase','event','webinar','erbjudande','artikel','rapport','branschlosning','produktnyhet','partnernyhet','analys'))
);

GRANT SELECT ON public.partner_news TO anon, authenticated;
GRANT ALL ON public.partner_news TO service_role;

ALTER TABLE public.partner_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published partner news"
  ON public.partner_news
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Service role manages partner news"
  ON public.partner_news
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX partner_news_status_published_at_idx
  ON public.partner_news (status, published_at DESC);

CREATE INDEX partner_news_partner_status_idx
  ON public.partner_news (partner_id, status, published_at DESC);

CREATE INDEX partner_news_product_status_idx
  ON public.partner_news (product_area, status);

CREATE TRIGGER partner_news_set_updated_at
  BEFORE UPDATE ON public.partner_news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
