import { MARKET_PULSE } from "@/data/marketPulse";

export type MarketPulse = typeof MARKET_PULSE;

// Svenska namn för Snitchers branschetiketter; okända etiketter visas inte.
const INDUSTRY_SV: Record<string, string> = {
  "Information Technology and Services": "IT och tjänster",
  "Computer Software": "IT och tjänster",
  "Marketing and Advertising": "Marknadsföring",
  "Financial Services": "Finans",
  "Banking": "Finans",
  "Construction": "Bygg och entreprenad",
  "Higher Education": "Utbildning",
  "Education Management": "Utbildning",
  "Government Administration": "Offentlig sektor",
  "Consumer Goods": "Handel och konsumentvaror",
  "Retail": "Handel och konsumentvaror",
  "Wholesale": "Grossist",
  "Machinery": "Tillverkning",
  "Mechanical or Industrial Engineering": "Tillverkning",
  "Industrial Automation": "Tillverkning",
  "Logistics and Supply Chain": "Logistik",
  "Transportation/Trucking/Railroad": "Logistik",
  "Real Estate": "Fastigheter",
  "Management Consulting": "Konsulttjänster",
  "Hospital & Health Care": "Vård",
  "Food & Beverages": "Livsmedel",
};

// Branscher som inte visas publikt (Thomas 2026-11-25): IT, marknadsföring och utbildning är sällan Dynamics-köpare.
export const HIDDEN_INDUSTRIES = new Set(["IT och tjänster", "Marknadsföring", "Utbildning"]);

export function mapMarketPulse(raw: any): MarketPulse | null {
  if (!raw || typeof raw.companies !== "number") return null;
  const industries = Array.from(new Set(((raw.industries || []) as string[]).map((i) => INDUSTRY_SV[i]).filter((i) => i && !HIDDEN_INDUSTRIES.has(i)))).slice(0, 5);
  return {
    periodStart: String(raw.period_start),
    periodEnd: String(raw.period_end),
    companies: raw.companies,
    searchImpressions: Number(raw.search_impressions) || 0,
    pageViews: raw.page_views,
    uniqueVisitors: raw.unique_visitors,
    profileViews: raw.profile_views,
    sizes: [
      { label: "1–50 anställda", count: raw.size_small },
      { label: "51–500 anställda", count: raw.size_mid },
      { label: "Över 500 anställda", count: raw.size_large },
    ],
    industries: industries.length ? industries : MARKET_PULSE.industries,
  };
}
