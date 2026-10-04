CREATE TABLE public.serp_watch_domains (domain text PRIMARY KEY, is_own boolean NOT NULL DEFAULT false, sort_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.serp_watch_phrases (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), phrase text NOT NULL UNIQUE, group_tag text NOT NULL, sort_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.serp_watch_runs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), month date NOT NULL, domain text NOT NULL, status text NOT NULL DEFAULT 'pending', chunks_done int NOT NULL DEFAULT 0, chunks_total int NOT NULL DEFAULT 0, calls_used int NOT NULL DEFAULT 0, last_error text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(month, domain));
CREATE TABLE public.serp_watch_results (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), run_id uuid NOT NULL REFERENCES public.serp_watch_runs(id) ON DELETE CASCADE, phrase_id uuid NOT NULL REFERENCES public.serp_watch_phrases(id) ON DELETE CASCADE, position int, volume int, url text, fetched_at timestamptz NOT NULL DEFAULT now(), UNIQUE(run_id, phrase_id));
CREATE TABLE public.serp_watch_api_usage (day date PRIMARY KEY, calls int NOT NULL DEFAULT 0);
ALTER TABLE public.serp_watch_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serp_watch_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serp_watch_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serp_watch_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serp_watch_api_usage ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.serp_watch_domains, public.serp_watch_phrases, public.serp_watch_runs, public.serp_watch_results, public.serp_watch_api_usage TO service_role;
CREATE TRIGGER serp_watch_runs_upd BEFORE UPDATE ON public.serp_watch_runs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.serp_watch_domains(domain,is_own,sort_order) VALUES ('d365.se',true,0),('affarssystemguiden.se',false,1),('businesswith.se',false,2),('crm-systemguiden.se',false,3),('herbertnathan.com',false,4);

INSERT INTO public.serp_watch_phrases(phrase,group_tag,sort_order)
SELECT p, g, row_number() OVER () FROM (VALUES
('erp system','Generiska'),('affärssystem','Generiska'),('crm system','Generiska'),('microsoft dynamics 365','Generiska'),('affärssystem jämförelse','Generiska'),
('dynamics 365 business central','Produkt'),('business central','Produkt'),('dynamics 365 finance','Produkt'),('dynamics 365 sales','Produkt'),('dynamics 365 supply chain management','Produkt'),('dynamics 365 field service','Produkt'),
('dynamics 365 crm','CE och övriga'),('microsoft crm','CE och övriga'),('dynamics 365 customer service','CE och övriga'),('dynamics 365 customer insights','CE och övriga'),('dynamics 365 contact center','CE och övriga'),('dynamics 365 project operations','CE och övriga'),('dynamics 365 commerce','CE och övriga'),('dynamics 365 human resources','CE och övriga'),
('dynamics 365 partner','Partner'),('business central partner','Partner'),('dynamics 365 partner sverige','Partner'),('business central partner stockholm','Partner'),('business central partner göteborg','Partner'),('dynamics 365 crm partner','Partner'),('dynamics 365 sales partner','Partner'),('dynamics 365 customer service partner','Partner'),('dynamics 365 field service partner','Partner'),('dynamics 365 konsult','Partner'),('byta dynamics partner','Partner'),('välja erp partner','Partner'),
('dynamics 365 pris','Kostnad'),('business central pris','Kostnad'),('business central licens','Kostnad'),('business central kostnad','Kostnad'),('dynamics 365 implementering kostnad','Kostnad'),('dynamics 365 crm pris','Kostnad'),('dynamics 365 sales pris','Kostnad'),
('nav till business central','Migrering'),('uppgradera nav','Migrering'),('ax 2012 uppgradering','Migrering'),('ax 2012 till dynamics 365','Migrering'),('migrera till business central','Migrering'),
('affärssystem för tillverkning','Bransch'),('erp för tillverkande företag','Bransch'),('affärssystem grossist','Bransch'),('affärssystem handel','Bransch'),('affärssystem bygg','Bransch'),('affärssystem serviceföretag','Bransch'),('affärssystem konsultbolag','Bransch'),
('upphandling affärssystem','Upphandling'),('kravspecifikation affärssystem','Upphandling'),('bästa affärssystem','Upphandling'),
('dynamics 365 copilot','Copilot'),('copilot business central','Copilot')
) v(p,g);