import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * A Basic partner is a partner that has NOT bought profile publication on d365.se.
 * Only "observed" data (compiled from public sources) is ever exposed.
 * NEVER expose contact info, ai_profile, ai_summary, economics, source_documents etc.
 *
 * The view `partners_basic_public` whitelists the observed columns at DB level –
 * client cannot accidentally pull sensitive columns.
 */
export type ProductKey = "bc" | "fsc" | "crm";

export interface BasicPartner {
  id: string;
  slug: string;
  name: string;
  /** Only used for the standalone Basic-card outlink. Never surfaced in compare/list. */
  website: string | null;
  observed_products: Partial<Record<ProductKey, boolean>>;
  observed_industries: Partial<Record<ProductKey, string[]>>;
  observed_locations: string[];
  observed_updated_at: string | null;
  profile_level: "basic";
  created_at: string;
  updated_at: string;
}

export function useBasicPartners() {
  return useQuery({
    queryKey: ["basic-partners"],
    queryFn: async (): Promise<BasicPartner[]> => {
      const { data, error } = await (supabase as any)
        .from("partners_basic_public")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data || []) as BasicPartner[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBasicPartner(slug: string | undefined) {
  return useQuery({
    queryKey: ["basic-partner", slug],
    queryFn: async (): Promise<BasicPartner | null> => {
      if (!slug) return null;
      const { data, error } = await (supabase as any)
        .from("partners_basic_public")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as BasicPartner | null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/** Truncate observed industries to max 3 per product area (defensive – DB is source-of-truth). */
export function normalizeObservedIndustries(
  raw: Partial<Record<ProductKey, string[]>> | null | undefined
): Partial<Record<ProductKey, string[]>> {
  const out: Partial<Record<ProductKey, string[]>> = {};
  if (!raw) return out;
  (["bc", "fsc", "crm"] as ProductKey[]).forEach((k) => {
    const arr = Array.isArray(raw[k]) ? raw[k]! : [];
    if (arr.length) out[k] = arr.slice(0, 3);
  });
  return out;
}

export const BASIC_COPY = {
  industriesLabel:
    "Branschinriktning enligt d365.se:s marknadsanalys. Ej bekräftad av partnern.",
  productsLabel:
    "Observerade produktområden baserade på partnerns publika information.",
  footer:
    "Denna partner har ännu inte en egen profil på d365.se. Uppgifterna är sammanställda av d365.se från publika källor.",
  cta: "Är detta ert bolag? Ta kontroll över er profil.",
  standaloneNoContact:
    "Denna partner är inte ansluten till d365.se och kan inte kontaktas härifrån.",
  matchingLimited: "Begränsad data: partnern kan inte bedömas fullt ut.",
  compareMissing: "data saknas",
} as const;

export const PRODUCT_LABEL: Record<ProductKey, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain",
  crm: "CRM (Sales / Service / Marketing)",
};
