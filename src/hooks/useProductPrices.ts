import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductPrice {
  id: string;
  product_key: string;
  product_name: string;
  category: "ERP" | "CRM" | string;
  price_sek: number | null;
  price_unit: string;
  price_note: string | null;
  is_quote: boolean;
  sort_order: number;
}

/**
 * Centralt prisregister – hämtar alla produktpriser från `product_prices`.
 * Använd `formatPrice(p)` för att rendera priset på samma sätt överallt.
 */
export function useProductPrices(category?: "ERP" | "CRM") {
  return useQuery({
    queryKey: ["product-prices", category ?? "all"],
    queryFn: async (): Promise<ProductPrice[]> => {
      let query = supabase
        .from("product_prices")
        .select("*")
        .order("sort_order", { ascending: true });

      if (category) query = query.eq("category", category);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as ProductPrice[];
    },
    staleTime: 1000 * 60 * 60, // 1h – priser ändras sällan
  });
}

/** Hjälpfunktion: hämta ett enskilt pris via key. */
export function useProductPrice(productKey: string) {
  const { data, ...rest } = useProductPrices();
  return {
    ...rest,
    data: data?.find((p) => p.product_key === productKey),
  };
}

/** Formattera ett pris konsekvent: "764,70 kr per användare/månad" eller "Offert". */
export function formatPrice(p: Pick<ProductPrice, "price_sek" | "price_unit" | "is_quote">): string {
  if (p.is_quote || p.price_sek == null) return "Offert";
  const formatted = new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(p.price_sek);
  return `${formatted} kr ${p.price_unit}`.trim();
}
