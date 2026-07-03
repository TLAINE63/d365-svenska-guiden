import { Partner } from "@/data/partners";
import { DatabasePartner, ProductFilterInput, ProductFilters } from "@/hooks/usePartners";

type CardPartner = Partner | DatabasePartner;

function isDatabasePartner(p: CardPartner): p is DatabasePartner {
  return "product_filters" in p && "slug" in p;
}

function toArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function allProductFilters(p: CardPartner): ProductFilterInput[] {
  if (isDatabasePartner(p)) {
    return Object.values(p.product_filters || {}).filter(
      (pf): pf is ProductFilterInput => !!pf && (pf.industries?.length > 0 || pf.companySize?.length > 0)
    );
  }
  // Static partner productFilters
  const staticFilters = p.productFilters ? Object.values(p.productFilters) : [];
  return staticFilters.map((pf) => ({
    ...pf,
    geography: pf?.geography ? [pf.geography] : [],
    secondaryIndustries: pf?.secondaryIndustries || [],
  })) as ProductFilterInput[];
}

function productFilterKeys(p: CardPartner): string[] {
  if (isDatabasePartner(p)) {
    return Object.keys(p.product_filters || {}).filter(
      (k) => !!p.product_filters[k as keyof ProductFilters]
    );
  }
  return p.productFilters ? Object.keys(p.productFilters) : [];
}

function allIndustries(p: CardPartner): string[] {
  const filters = allProductFilters(p);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const pf of filters) {
    for (const i of pf?.industries || []) {
      if (!seen.has(i)) {
        seen.add(i);
        out.push(i);
      }
    }
  }
  for (const i of p.industries || []) {
    if (!seen.has(i)) {
      seen.add(i);
      out.push(i);
    }
  }
  return out;
}

function allSecondaryIndustries(p: CardPartner): string[] {
  const filters = allProductFilters(p);
  const seen = new Set<string>();
  for (const pf of filters) {
    for (const i of pf?.secondaryIndustries || []) {
      seen.add(i);
    }
  }
  return Array.from(seen);
}

function allCompanySizeBuckets(p: CardPartner): string[] {
  const filters = allProductFilters(p);
  const seen = new Set<string>();
  for (const pf of filters) {
    for (const s of pf?.companySize || []) {
      seen.add(s);
    }
  }
  if (!isDatabasePartner(p)) {
    for (const s of p.companySize || []) {
      seen.add(s);
    }
  }
  return Array.from(seen);
}

function allGeography(p: CardPartner): string[] {
  const filters = allProductFilters(p);
  const seen = new Set<string>();
  for (const pf of filters) {
    for (const g of pf?.geography || []) {
      if (g) seen.add(g);
    }
  }
  for (const g of toArray(p.geography)) {
    if (g) seen.add(g);
  }
  return Array.from(seen);
}

function hasCommerceApplication(p: CardPartner): boolean {
  const apps = p.applications || [];
  return apps.some((a) => /commerce/i.test(a));
}

export function shortenIndustry(name: string): string {
  const map: Record<string, string> = {
    "Tillverkningsindustri": "Tillverkning",
    "Livsmedel & Processindustri": "Livsmedel",
    "Jordbruk & Skogsbruk": "Jordbruk",
    "Hälsa- & sjukvård": "Hälsa & sjukvård",
    "Life Science / Medtech": "Life Science",
    "Non-profit / Organisationer": "Non-profit",
    "Uthyrningsverksamhet": "Uthyrning",
    "Mode, Sport & Textil": "Mode & textil",
  };
  return map[name] || name;
}

export function getCardLocationLabel(p: CardPartner): string {
  const geos = allGeography(p);
  if (geos.includes("Globalt") || geos.includes("Europa") || geos.includes("Internationellt") || geos.includes("Övriga världen")) {
    return "Norden +";
  }
  if (geos.includes("Norden")) return "Norden";
  if (geos.includes("Sverige")) return "Sverige";
  return geos[0] || "Sverige";
}

export function getCardIndustryLabel(p: CardPartner, highlightedIndustry?: string | null): string {
  const primary = allIndustries(p);
  const secondary = allSecondaryIndustries(p);
  if (highlightedIndustry) {
    const isPrimary = primary.includes(highlightedIndustry);
    const isSecondary = secondary.includes(highlightedIndustry);
    if (isPrimary || isSecondary) {
      const labels = [shortenIndustry(highlightedIndustry)];
      if (!isPrimary) {
        // If the highlighted industry is not a primary focus, anchor with the partner's main primary industry.
        const primaryMatch = primary.find((i) => i !== highlightedIndustry);
        if (primaryMatch) labels.push(shortenIndustry(primaryMatch));
      }
      return labels.join(" & ");
    }
    // Highlighted industry is not targeted by this partner; still show the partner's primary focus.
    const labels = primary.slice(0, 2).map(shortenIndustry);
    if (labels.length) return labels.join(" & ");
  }
  return primary.slice(0, 2).map(shortenIndustry).join(" & ");
}

export function getCardProductFocusLabel(p: CardPartner): string {
  const keys = new Set(productFilterKeys(p));
  const hasCommerce = hasCommerceApplication(p);

  let crmLabel: string | null = null;
  if (keys.has("sales") && keys.has("service")) {
    crmLabel = "CRM, Service & Fältservice";
  } else if (keys.has("sales")) {
    crmLabel = "CRM & Sales";
  } else if (keys.has("service")) {
    crmLabel = "Service & Fältservice";
  } else if (keys.has("crm")) {
    crmLabel = "CRM";
  }

  const labels: string[] = [];
  if (crmLabel) labels.push(crmLabel);

  if (keys.has("fsc") || keys.has("bc")) {
    if (keys.has("bc") && !keys.has("fsc")) {
      labels.push(hasCommerce ? "Business Central & Commerce" : "Business Central");
    } else if (keys.has("fsc")) {
      labels.push(hasCommerce ? "ERP, Supply Chain & Commerce" : "ERP & Supply Chain");
    }
  }

  if (labels.length === 0) {
    // Fallback to applications if no product filters exist.
    const apps = (p.applications || []).slice(0, 3);
    return apps.join(" & ") || "Dynamics 365";
  }

  return labels.join(" & ");
}

export function getCardSizeLabel(p: CardPartner): string {
  const buckets = allCompanySizeBuckets(p);
  if (buckets.length === 0) {
    // Static partners sometimes have size in revenue instead.
    return "Alla storlekar";
  }

  const hasSmall = buckets.some((b) => ["1-49", "50-99", "100-249"].includes(b));
  const hasMid = buckets.some((b) => ["250-999", "1.000-4.999"].includes(b));
  const hasLarge = buckets.some((b) => b === ">5.000");

  if ((hasSmall && hasLarge) || (hasSmall && hasMid && hasLarge)) return "SMB–Enterprise";
  if (hasMid && hasLarge) return "Midmarket–Enterprise";
  if (hasSmall && hasMid) return "SMB–Midmarket";
  if (hasSmall) return "SMB";
  if (hasMid) return "Midmarket";
  if (hasLarge) return "Enterprise";
  return "Alla storlekar";
}

export function getCardAiSummary(p: CardPartner): string | null {
  if (isDatabasePartner(p) && p.ai_profile?.card_ai_summary?.trim()) {
    return p.ai_profile.card_ai_summary.trim();
  }
  return null;
}

export interface CardSummaryData {
  location: string;
  industry: string;
  productFocus: string;
  size: string;
  aiSummary: string | null;
}

export function getCardSummaryData(
  p: CardPartner,
  highlightedIndustry?: string | null
): CardSummaryData {
  return {
    location: getCardLocationLabel(p),
    industry: getCardIndustryLabel(p, highlightedIndustry),
    productFocus: getCardProductFocusLabel(p),
    size: getCardSizeLabel(p),
    aiSummary: getCardAiSummary(p),
  };
}
