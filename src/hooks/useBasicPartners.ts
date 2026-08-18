import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isPartnerExcluded } from "@/lib/partnerVisibility";


/**
 * A Basic partner is a partner that has NOT bought profile publication on d365.se.
 * Only "observed" data (compiled from public sources) is ever exposed.
 * NEVER expose contact info, ai_profile, ai_summary, economics, source_documents etc.
 *
 * The view `partners_basic_public` whitelists the observed columns at DB level –
 * client cannot accidentally pull sensitive columns.
 */
export type ProductKey = "bc" | "fsc" | "sales" | "service";

/** Legacy key kept only for backwards-compatible reads of existing "crm" data. */
type LegacyProductKey = ProductKey | "crm";

export interface BasicPartner {
  id: string;
  slug: string;
  name: string;
  /** Only used for the standalone Basic-card outlink. Never surfaced in compare/list. */
  website: string | null;
  observed_products: Partial<Record<ProductKey, boolean>>;
  observed_industries: Partial<Record<ProductKey, string[]>>;
  observed_company_sizes: Partial<Record<ProductKey, string[]>>;
  observed_revenue: Partial<Record<ProductKey, string[]>>;
  observed_delivery_geo: Partial<Record<ProductKey, string[]>>;
  observed_locations: string[];
  observed_updated_at: string | null;
  extended_content: string | null;
  extended_content_updated_at: string | null;
  extended_summary: string | null;
  profile_level: "basic";
  created_at: string;
  updated_at: string;
}

/** Split legacy "crm" into both sales + service so existing data still renders. */
function expandLegacyProducts<T>(
  raw: Partial<Record<LegacyProductKey, T>> | null | undefined,
  merge: (a: T | undefined, b: T | undefined) => T | undefined,
): Partial<Record<ProductKey, T>> {
  const src = raw || {};
  const out: Partial<Record<ProductKey, T>> = {
    bc: src.bc,
    fsc: src.fsc,
    sales: merge(src.sales, src.crm),
    service: merge(src.service, src.crm),
  };
  (Object.keys(out) as ProductKey[]).forEach((k) => {
    if (out[k] === undefined) delete out[k];
  });
  return out;
}

function normalizeStringArrayMap(
  raw: any,
): Partial<Record<ProductKey, string[]>> {
  const out: Partial<Record<ProductKey, string[]>> = {};
  const src = raw && typeof raw === "object" ? raw : {};
  (["bc", "fsc", "sales", "service"] as ProductKey[]).forEach((k) => {
    const arr = Array.isArray(src[k]) ? src[k].filter((x: any) => typeof x === "string") : [];
    if (arr.length) out[k] = arr;
  });
  return out;
}

function normalizeRaw(row: any): BasicPartner {
  const products = expandLegacyProducts<boolean>(
    row?.observed_products || {},
    (a, b) => (a === true || b === true ? true : a ?? b),
  );
  const industries = expandLegacyProducts<string[]>(
    row?.observed_industries || {},
    (a, b) => {
      const merged = Array.from(new Set([...(a || []), ...(b || [])]));
      return merged.length ? merged : undefined;
    },
  );
  return {
    ...row,
    observed_products: products,
    observed_industries: industries,
    observed_company_sizes: normalizeStringArrayMap(row?.observed_company_sizes),
    observed_revenue: normalizeStringArrayMap(row?.observed_revenue),
    observed_delivery_geo: normalizeStringArrayMap(row?.observed_delivery_geo),
    observed_locations: row?.observed_locations || [],
    extended_content: row?.extended_content ?? null,
    extended_content_updated_at: row?.extended_content_updated_at ?? null,
    extended_summary: row?.extended_summary ?? null,
  } as BasicPartner;
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
      return (data || [])
        .map(normalizeRaw)
        .filter((p) => !isPartnerExcluded(p.name, p.slug));

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
      if (!data || isPartnerExcluded(data.name, data.slug)) return null;
      return normalizeRaw(data);

    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/** Truncate observed industries to max 3 per product area (defensive – DB is source-of-truth). */
export function normalizeObservedIndustries(
  raw: Partial<Record<ProductKey, string[]>> | null | undefined,
): Partial<Record<ProductKey, string[]>> {
  const out: Partial<Record<ProductKey, string[]>> = {};
  if (!raw) return out;
  (["bc", "fsc", "sales", "service"] as ProductKey[]).forEach((k) => {
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
  extendedLabel:
    "Publik information sammanställd av d365.se från publikt tillgängliga källor.",
  footer:
    "Den här översikten är sammanställd av d365.se utifrån publika källor.",
  partnerRepHeading: "Representerar du denna partner?",
  partnerRepBody:
    "Verifiera och komplettera informationen så att kunder får ett korrekt underlag när de jämför Dynamics 365-partners.",
  cta: "Komplettera partnerprofilen",
  standaloneNoContact:
    "Kontaktväg via d365.se är inte aktiverad för denna profil.",
  buyerGuidanceCta: "Kontakta d365.se för vägledning",
  buyerGuidanceBody:
    "d365.se har inte en verifierad direktkontakt kopplad till denna profil, men vi kan hjälpa dig att bedöma alternativen och komma vidare.",
  matchingLimited: "Begränsad data: partnern kan inte bedömas fullt ut.",
  compareMissing: "data saknas",
} as const;


export const PRODUCT_LABEL: Record<ProductKey, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain",
  sales: "Sales & Marketing",
  service: "Service / Field Service / Contact Center",
};

export const PRODUCT_ORDER: ProductKey[] = ["bc", "fsc", "sales", "service"];
