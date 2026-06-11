
-- Add missing product from official price list
INSERT INTO public.product_prices (product_key, product_name, category, price_sek, price_unit, is_quote, sort_order)
VALUES ('intelligent-order-management', 'Intelligent Order Management', 'ERP', 3010.98, 'per månad (1 000 orderrader)', false, 75)
ON CONFLICT (product_key) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  price_sek = EXCLUDED.price_sek,
  price_unit = EXCLUDED.price_unit,
  is_quote = EXCLUDED.is_quote,
  sort_order = EXCLUDED.sort_order;

-- Re-sequence sort_order to match the official price-list order
-- ERP
UPDATE public.product_prices SET sort_order = 10  WHERE product_key = 'bc-essentials';
UPDATE public.product_prices SET sort_order = 20  WHERE product_key = 'bc-premium';
UPDATE public.product_prices SET sort_order = 30  WHERE product_key = 'bc-team-members';
UPDATE public.product_prices SET sort_order = 40  WHERE product_key = 'finance';
UPDATE public.product_prices SET sort_order = 50  WHERE product_key = 'finance-premium';
UPDATE public.product_prices SET sort_order = 60  WHERE product_key = 'supply-chain-management';
UPDATE public.product_prices SET sort_order = 70  WHERE product_key = 'scm-premium';
UPDATE public.product_prices SET sort_order = 75  WHERE product_key = 'intelligent-order-management';
UPDATE public.product_prices SET sort_order = 80  WHERE product_key = 'commerce';
UPDATE public.product_prices SET sort_order = 90  WHERE product_key = 'commerce-nathandel';
UPDATE public.product_prices SET sort_order = 100 WHERE product_key = 'project-operations';
UPDATE public.product_prices SET sort_order = 110 WHERE product_key = 'human-resources';

-- CRM
UPDATE public.product_prices SET sort_order = 10  WHERE product_key = 'sales-professional';
UPDATE public.product_prices SET sort_order = 20  WHERE product_key = 'sales-enterprise';
UPDATE public.product_prices SET sort_order = 30  WHERE product_key = 'sales-premium';
UPDATE public.product_prices SET sort_order = 40  WHERE product_key = 'relationship-sales';
UPDATE public.product_prices SET sort_order = 50  WHERE product_key = 'customer-service-pro';
UPDATE public.product_prices SET sort_order = 60  WHERE product_key = 'customer-service-enterprise';
UPDATE public.product_prices SET sort_order = 70  WHERE product_key = 'customer-service-premium';
UPDATE public.product_prices SET sort_order = 80  WHERE product_key = 'contact-center-komplett';
UPDATE public.product_prices SET sort_order = 90  WHERE product_key = 'contact-center-digitalt';
UPDATE public.product_prices SET sort_order = 100 WHERE product_key = 'field-service';
UPDATE public.product_prices SET sort_order = 110 WHERE product_key = 'field-service-contractor';
UPDATE public.product_prices SET sort_order = 120 WHERE product_key = 'customer-insights';
UPDATE public.product_prices SET sort_order = 130 WHERE product_key = 'customer-insights-attach';

-- Update note for Relationship Sales to reflect the price list
UPDATE public.product_prices
SET price_note = 'Minst 10 licenser', price_unit = 'Offert'
WHERE product_key = 'relationship-sales';

-- Mark Customer Service Enterprise/Premium and Contact Center kampanj-rabatt
UPDATE public.product_prices
SET price_note = '40 % kampanjrabatt 1 okt 2025–30 jun 2026 (EA/CSP)'
WHERE product_key IN ('customer-service-enterprise','customer-service-premium','contact-center-komplett','contact-center-digitalt');
