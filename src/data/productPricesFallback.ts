/**
 * Statisk fallback-snapshot av prisregistret (`product_prices`).
 *
 * Denna fil behövs för:
 *   - synkront rendering (SSG, FAQ JSON-LD, SEO-meta) innan React Query hunnit hämta katalogen
 *   - tester och offline-utveckling
 *
 * Sanningens källa = `product_prices`-tabellen (redigeras i /admin → "Priser").
 * När admin uppdaterar katalogen slår ändringen igenom direkt på klienten via
 * `useProductPrices()`. Denna fallback uppdateras vid behov (manuellt eller via
 * build-skript). Snapshot per: 2026-06-11 (Microsofts officiella SEK-prislista).
 */

export interface FallbackPrice {
  product_key: string;
  product_name: string;
  category: "ERP" | "CRM";
  price_sek: number | null;
  price_unit: string;
  price_note: string | null;
  is_quote: boolean;
}

export const FALLBACK_PRICES: FallbackPrice[] = [
  // ERP
  { product_key: "bc-essentials", product_name: "Business Central Essentials", category: "ERP", price_sek: 764.70, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "bc-premium", product_name: "Business Central Premium", category: "ERP", price_sek: 1051.40, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "bc-team-members", product_name: "Business Central Team Members", category: "ERP", price_sek: 76.50, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "finance", product_name: "Finance", category: "ERP", price_sek: 2007.30, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "finance-premium", product_name: "Finance Premium", category: "ERP", price_sek: 2867.60, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "supply-chain-management", product_name: "Supply Chain Management", category: "ERP", price_sek: 2007.30, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "scm-premium", product_name: "Supply Chain Management Premium", category: "ERP", price_sek: 2867.60, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "intelligent-order-management", product_name: "Intelligent Order Management", category: "ERP", price_sek: 3010.98, price_unit: "per månad (1 000 orderrader)", price_note: null, is_quote: false },
  { product_key: "commerce", product_name: "Commerce", category: "ERP", price_sek: 2007.30, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "commerce-nathandel", product_name: "Commerce, tillägg för näthandel", category: "ERP", price_sek: 38234.40, price_unit: "per månad", price_note: null, is_quote: false },
  { product_key: "project-operations", product_name: "Project Operations", category: "ERP", price_sek: 1290.40, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "human-resources", product_name: "Human Resources", category: "ERP", price_sek: 1290.40, price_unit: "per användare/månad", price_note: "Självbetjäning: 38,20 kr/användare/månad", is_quote: false },

  // CRM
  { product_key: "sales-professional", product_name: "Sales Professional", category: "CRM", price_sek: 621.30, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "sales-enterprise", product_name: "Sales Enterprise", category: "CRM", price_sek: 1003.70, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "sales-premium", product_name: "Sales Premium", category: "CRM", price_sek: 1433.80, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "relationship-sales", product_name: "Microsoft Relationship Sales", category: "CRM", price_sek: null, price_unit: "Offert", price_note: "Minst 10 licenser", is_quote: true },
  { product_key: "customer-service-pro", product_name: "Customer Service Professional", category: "CRM", price_sek: 477.90, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "customer-service-enterprise", product_name: "Customer Service Enterprise", category: "CRM", price_sek: 1003.70, price_unit: "per användare/månad", price_note: "40 % kampanjrabatt 1 okt 2025–30 jun 2026 (EA/CSP)", is_quote: false },
  { product_key: "customer-service-premium", product_name: "Customer Service Premium", category: "CRM", price_sek: 1863.90, price_unit: "per användare/månad", price_note: "40 % kampanjrabatt 1 okt 2025–30 jun 2026 (EA/CSP)", is_quote: false },
  { product_key: "contact-center-komplett", product_name: "Contact Center (komplett)", category: "CRM", price_sek: 1051.40, price_unit: "per användare/månad", price_note: "40 % kampanjrabatt 1 okt 2025–30 jun 2026 (EA/CSP)", is_quote: false },
  { product_key: "contact-center-digitalt", product_name: "Contact Center, digitalt", category: "CRM", price_sek: 908.10, price_unit: "per användare/månad", price_note: "40 % kampanjrabatt 1 okt 2025–30 jun 2026 (EA/CSP)", is_quote: false },
  { product_key: "field-service", product_name: "Field Service", category: "CRM", price_sek: 1003.70, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "field-service-contractor", product_name: "Field Service, leverantör (contractor)", category: "CRM", price_sek: 477.90, price_unit: "per användare/månad", price_note: null, is_quote: false },
  { product_key: "customer-insights", product_name: "Customer Insights", category: "CRM", price_sek: 16249.60, price_unit: "per tenant/månad", price_note: "Obegränsat antal användare", is_quote: false },
  { product_key: "customer-insights-attach", product_name: "Customer Insights-komplettering (attach)", category: "CRM", price_sek: 9558.60, price_unit: "per tenant/månad", price_note: "Kräver minst 10 befintliga Dynamics 365-licenser", is_quote: false },
];

export const FALLBACK_PRICE_MAP: ReadonlyMap<string, FallbackPrice> = new Map(
  FALLBACK_PRICES.map((p) => [p.product_key, p])
);
