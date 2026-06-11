import { useMemo } from "react";
import { useProductPrices } from "./useProductPrices";
import {
  FALLBACK_PRICE_MAP,
  type FallbackPrice,
} from "@/data/productPricesFallback";
import type { PriceMap, PriceLike } from "@/lib/productPriceFormat";

/**
 * Slår ihop static fallback (omedelbar render, SSG) med live-data från
 * `product_prices` (vinner när den finns). Använd istället för att läsa
 * `useProductPrices()` direkt när du bara behöver slå upp priser per key.
 */
export function usePriceMap(): PriceMap {
  const { data } = useProductPrices();
  return useMemo(() => {
    if (!data || data.length === 0) return FALLBACK_PRICE_MAP;
    const merged = new Map<string, PriceLike>(FALLBACK_PRICE_MAP);
    for (const p of data) {
      merged.set(p.product_key, {
        price_sek: p.price_sek,
        price_unit: p.price_unit,
        is_quote: p.is_quote,
        product_name: p.product_name,
      });
    }
    return merged;
  }, [data]);
}

export type { FallbackPrice };
