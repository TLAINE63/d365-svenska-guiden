
-- Centralized product price catalog so prices can be updated in one place
CREATE TABLE public.product_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text NOT NULL UNIQUE,
  product_name text NOT NULL,
  category text NOT NULL, -- 'ERP' | 'CRM'
  price_sek numeric(12,2), -- NULL when price is "offert"
  price_unit text NOT NULL DEFAULT 'per användare/månad',
  price_note text,
  is_quote boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_prices TO authenticated;
GRANT ALL ON public.product_prices TO service_role;

ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

-- Prices are public catalog data, readable by everyone
CREATE POLICY "Anyone can read product prices"
  ON public.product_prices
  FOR SELECT
  USING (true);

-- Writes are restricted to service_role (admin via edge functions / dashboard)
CREATE POLICY "Service role can manage product prices"
  ON public.product_prices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER product_prices_set_updated_at
  BEFORE UPDATE ON public.product_prices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: ERP
INSERT INTO public.product_prices (product_key, product_name, category, price_sek, price_unit, price_note, is_quote, sort_order) VALUES
  ('bc-essentials',           'Business Central Essentials',         'ERP',  764.70, 'per användare/månad', NULL, false, 10),
  ('bc-premium',              'Business Central Premium',            'ERP', 1051.40, 'per användare/månad', NULL, false, 20),
  ('bc-team-members',         'Business Central Team Members',       'ERP',   76.50, 'per användare/månad', NULL, false, 30),
  ('finance',                 'Finance',                             'ERP', 2007.30, 'per användare/månad', NULL, false, 40),
  ('finance-premium',         'Finance Premium',                     'ERP', 2867.60, 'per användare/månad', NULL, false, 50),
  ('supply-chain-management', 'Supply Chain Management',             'ERP', 2007.30, 'per användare/månad', NULL, false, 60),
  ('scm-premium',             'Supply Chain Management Premium',     'ERP', 2867.60, 'per användare/månad', NULL, false, 70),
  ('commerce',                'Commerce',                            'ERP', 2007.30, 'per användare/månad', NULL, false, 80),
  ('commerce-nathandel',      'Commerce, tillägg för näthandel',     'ERP', 38234.40, 'per månad', NULL, false, 90),
  ('project-operations',      'Project Operations',                  'ERP', 1290.40, 'per användare/månad', NULL, false, 100),
  ('human-resources',         'Human Resources',                     'ERP', 1290.40, 'per användare/månad', 'Självbetjäning: 38,20 kr', false, 110);

-- Seed: CRM / Sales / Service
INSERT INTO public.product_prices (product_key, product_name, category, price_sek, price_unit, price_note, is_quote, sort_order) VALUES
  ('sales-professional',         'Sales Professional',                       'CRM',  621.30, 'per användare/månad', NULL, false, 10),
  ('sales-enterprise',           'Sales Enterprise',                         'CRM', 1003.70, 'per användare/månad', NULL, false, 20),
  ('sales-premium',              'Sales Premium',                            'CRM', 1433.80, 'per användare/månad', NULL, false, 30),
  ('relationship-sales',         'Microsoft Relationship Sales',             'CRM',    NULL, 'offert', 'Minst 10 licenser', true, 40),
  ('customer-service-pro',       'Customer Service Professional',            'CRM',  477.90, 'per användare/månad', NULL, false, 50),
  ('customer-service-enterprise','Customer Service Enterprise',              'CRM', 1003.70, 'per användare/månad', NULL, false, 60),
  ('customer-service-premium',   'Customer Service Premium',                 'CRM', 1863.90, 'per användare/månad', NULL, false, 70),
  ('contact-center-komplett',    'Contact Center (komplett)',                'CRM', 1051.40, 'per användare/månad', NULL, false, 80),
  ('contact-center-digitalt',    'Contact Center, digitalt',                 'CRM',  908.10, 'per användare/månad', NULL, false, 90),
  ('field-service',              'Field Service',                            'CRM', 1003.70, 'per användare/månad', NULL, false, 100),
  ('field-service-contractor',   'Field Service, leverantör (contractor)',   'CRM',  477.90, 'per användare/månad', NULL, false, 110),
  ('customer-insights',          'Customer Insights',                        'CRM', 16249.60, 'per tenant/månad', NULL, false, 120),
  ('customer-insights-attach',   'Customer Insights-komplettering (attach)', 'CRM',  9558.60, 'per tenant/månad', NULL, false, 130);
