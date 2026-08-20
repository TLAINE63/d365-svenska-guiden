CREATE TABLE public.market_report_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  suffix text,
  note text NOT NULL DEFAULT '',
  group_key text NOT NULL DEFAULT 'overblick',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.market_report_stats TO anon;
GRANT SELECT ON public.market_report_stats TO authenticated;
GRANT ALL ON public.market_report_stats TO service_role;

ALTER TABLE public.market_report_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read market report stats"
  ON public.market_report_stats FOR SELECT USING (true);

CREATE POLICY "Service role can manage market report stats"
  ON public.market_report_stats FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER market_report_stats_set_updated_at
  BEFORE UPDATE ON public.market_report_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.market_report_stats (label, value, note, group_key, sort_order) VALUES
('Identifierade partners', 84, 'Företag som aktivt levererar Dynamics 365 på den svenska marknaden.', 'overblick', 10),
('Verifierade profiler', 17, 'Partners som själva granskat och godkänt sin profil på d365.se.', 'overblick', 20),
('Business Central', 46, 'Partners med dokumenterad leverans av Dynamics 365 Business Central.', 'produkt', 30),
('Finance & Supply Chain', 37, 'Partners inriktade mot F&SCM och större ERP-implementationer.', 'produkt', 40),
('CRM / Customer Engagement', 50, 'Sales, Customer Service, Field Service, Contact Center och Customer Insights.', 'produkt', 50),
('Power Platform / AI', 24, 'Partners med registrerad erfarenhet av Copilot, agenter eller Power Platform.', 'produkt', 60),
('Tillverkning', 53, 'Partners med tillverkande industri som uttalat fokusområde.', 'bransch', 70),
('Handel & Retail', 32, 'Partners med parti-, detalj- eller e-handel som fokusområde.', 'bransch', 80),
('Life Science', 10, 'Partners med läkemedel, medtech eller life science som fokusområde.', 'bransch', 90),
('Små specialistpartners', 36, 'Nischade bolag, typiskt under ca 50 konsulter i Sverige.', 'storlek', 100),
('Stora globala partners', 25, 'Internationella aktörer med flera hundra konsulter och global leveransmodell.', 'storlek', 110);

INSERT INTO public.site_settings (key, value) VALUES ('market_report_updated', '2026/08/20')
ON CONFLICT (key) DO NOTHING;