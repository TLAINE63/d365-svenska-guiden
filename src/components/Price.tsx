import { usePriceMap } from "@/hooks/usePriceMap";
import { formatPriceByKey, type PriceMode } from "@/lib/productPriceFormat";

interface PriceProps {
  productKey: string;
  mode?: PriceMode;
  className?: string;
}

/**
 * Renderar ett pris från det centrala prisregistret.
 *
 * Använder `usePriceMap()` så att admin-uppdateringar i `product_prices`
 * slår igenom direkt, med statisk fallback för omedelbar render.
 */
export function Price({ productKey, mode = "default", className }: PriceProps) {
  const map = usePriceMap();
  const text = formatPriceByKey(productKey, mode, map);
  if (className) return <span className={className}>{text}</span>;
  return <>{text}</>;
}
