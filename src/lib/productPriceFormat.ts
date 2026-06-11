/**
 * Centralt formatteringslager för D365-priser.
 *
 * Alla priser på sajten ska hämtas via dessa helpers så att uppdateringar i
 * `product_prices`-tabellen (admin → "Priser") slår igenom överallt.
 *
 * Token-syntax för Q&A-svar, FAQ-data, meta-descriptions m.m.:
 *   {{price:bc-essentials}}            → "765 kr per användare/månad"          (avrundat)
 *   {{price:bc-essentials:exact}}      → "764,70 kr per användare/månad"       (exakt)
 *   {{price:bc-essentials:amount}}     → "765 kr"                              (avrundat, utan enhet)
 *   {{price:bc-essentials:amount-exact}} → "764,70 kr"                         (exakt, utan enhet)
 *   {{price:bc-essentials:short}}      → "765 kr/mån"                          (kort, generiskt)
 *   {{price:bc-essentials:name}}       → "Business Central Essentials"
 */

import {
  FALLBACK_PRICE_MAP,
  type FallbackPrice,
} from "@/data/productPricesFallback";

export type PriceLike = Pick<
  FallbackPrice,
  "price_sek" | "price_unit" | "is_quote" | "product_name"
>;

export type PriceMap = ReadonlyMap<string, PriceLike>;

export type PriceMode =
  | "default" // "765 kr per användare/månad"
  | "exact" // "764,70 kr per användare/månad"
  | "amount" // "765 kr"
  | "amount-exact" // "764,70 kr"
  | "short" // "765 kr/mån"
  | "name"; // produktnamn

const nfRounded = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });
const nfExact = new Intl.NumberFormat("sv-SE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function compactUnit(unit: string): string {
  // "per användare/månad" → "/användare/månad", "per månad" → "/månad" etc.
  if (!unit) return "";
  if (unit.toLowerCase().startsWith("per ")) return "/" + unit.slice(4);
  return unit;
}

function shortUnit(unit: string): string {
  // För prose: alla per-användare-priser blir "/mån", övriga behåller sin enhet kortat.
  const u = (unit || "").toLowerCase();
  if (u.includes("användare")) return "/mån";
  if (u.includes("tenant")) return "/mån (per tenant)";
  if (u.startsWith("per ")) return "/" + unit.slice(4);
  return unit;
}

export function formatPrice(p: PriceLike, mode: PriceMode = "default"): string {
  if (mode === "name") return p.product_name;
  if (p.is_quote || p.price_sek == null) {
    if (mode === "amount" || mode === "amount-exact") return "Offert";
    return "Offert";
  }
  const amount = p.price_sek;
  switch (mode) {
    case "amount":
      return `${nfRounded.format(amount)} kr`;
    case "amount-exact":
      return `${nfExact.format(amount)} kr`;
    case "exact":
      return `${nfExact.format(amount)} kr ${p.price_unit}`.trim();
    case "short":
      return `${nfRounded.format(amount)} kr${shortUnit(p.price_unit)}`;
    case "default":
    default:
      return `${nfRounded.format(amount)} kr ${p.price_unit}`.trim();
  }
}

export function getPrice(
  key: string,
  map: PriceMap = FALLBACK_PRICE_MAP
): PriceLike | undefined {
  return map.get(key);
}

export function formatPriceByKey(
  key: string,
  mode: PriceMode = "default",
  map: PriceMap = FALLBACK_PRICE_MAP
): string {
  const p = map.get(key);
  if (!p) {
    // Loud i dev, tyst i prod: returnera tokenen så det syns vid granskning.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[priceCatalog] okänd product_key: "${key}"`);
    }
    return `{{price:${key}}}`;
  }
  return formatPrice(p, mode);
}

const PRICE_TOKEN_RE = /\{\{price:([a-z0-9-]+)(?::([a-z-]+))?\}\}/gi;

/**
 * Ersätter alla {{price:key[:mode]}}-tokens i en text mot formatterade priser
 * från katalogen. Tokens som inte hittar match lämnas orörda (synligt fel).
 */
export function resolvePriceTokens(
  text: string,
  map: PriceMap = FALLBACK_PRICE_MAP
): string {
  if (!text || text.indexOf("{{price:") === -1) return text;
  return text.replace(PRICE_TOKEN_RE, (_match, key: string, mode?: string) => {
    return formatPriceByKey(
      key.toLowerCase(),
      (mode?.toLowerCase() as PriceMode) || "default",
      map
    );
  });
}
