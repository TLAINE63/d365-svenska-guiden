import { useEffect, useState } from "react";

/** Val besökaren gjort under sessionen (ingen persondata, bara sessionStorage). */
export interface BuyerContext {
  industry?: string | null;
  product?: string | null;
  size?: string | null;
}

const KEY = "buyer_context";
const EVENT = "buyer-context-change";

export function getBuyerContext(): BuyerContext {
  try {
    if (typeof window === "undefined") return {};
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as BuyerContext;
  } catch {
    return {};
  }
}

export function updateBuyerContext(patch: BuyerContext): void {
  try {
    if (typeof window === "undefined") return;
    const current = getBuyerContext();
    const next: BuyerContext = { ...current };
    for (const [k, v] of Object.entries(patch) as [keyof BuyerContext, string | null | undefined][]) {
      if (v === undefined) continue;
      if (v === null || v === "" || v === "Vet inte ännu") delete next[k];
      else next[k] = v;
    }
    if (JSON.stringify(next) === JSON.stringify(current)) return;
    sessionStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function clearBuyerContext(): void {
  try {
    sessionStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function useBuyerContext(): BuyerContext {
  const [ctx, setCtx] = useState<BuyerContext>({});
  useEffect(() => {
    const sync = () => setCtx(getBuyerContext());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return ctx;
}

export const hasBuyerContext = (c: BuyerContext) => Boolean(c.industry || c.product || c.size);

/** Kort produktnamn för rubriker. */
export function shortProductName(product?: string | null): string | null {
  if (!product) return null;
  if (product === "Finance & SCM" || product === "Finance & Supply Chain") return "F&SCM";
  if (product === "Customer Insights (Marketing)") return "Customer Insights";
  return product;
}

export function productKeyFor(product?: string | null): "bc" | "fsc" | "sales" | "service" | null {
  if (!product) return null;
  if (product === "Business Central") return "bc";
  if (["Finance & SCM", "Finance & Supply Chain", "Commerce", "Human Resources"].includes(product)) return "fsc";
  if (["Sales", "Customer Insights (Marketing)"].includes(product)) return "sales";
  if (["Customer Service", "Field Service", "Contact Center", "Project Operations"].includes(product)) return "service";
  return null;
}

export function sizeLabel(size?: string | null): string | null {
  if (!size) return null;
  const map: Record<string, string> = {
    "1-49": "1–49 anställda",
    "50-99": "50–99 anställda",
    "100-249": "100–249 anställda",
    "250-999": "250–999 anställda",
    "1.000-4.999": "1\u00A0000–4\u00A0999 anställda",
    ">5.000": "över 5\u00A0000 anställda",
  };
  return map[size] || size;
}

interface CountablePartner {
  industries?: string[];
  product_filters?: Record<string, { industries?: string[]; companySize?: string[] } | undefined>;
}

/** Antal partners som matchar val. Storlek används bara om det ger träffar. */
export function countMatchingPartners(partners: CountablePartner[], c: BuyerContext): number {
  const key = productKeyFor(c.product);
  const base = partners.filter((p) => {
    const filters = p.product_filters || {};
    if (key) {
      const f = filters[key];
      if (!f) return false;
      if (c.industry && !f.industries?.includes(c.industry)) return false;
      return true;
    }
    if (Object.keys(filters).length === 0) return false;
    if (c.industry) {
      return (p.industries || []).includes(c.industry) ||
        Object.values(filters).some((f) => f?.industries?.includes(c.industry!));
    }
    return true;
  });
  if (!c.size || !key) return base.length;
  const sized = base.filter((p) => p.product_filters?.[key]?.companySize?.includes(c.size!));
  return sized.length > 0 ? sized.length : base.length;
}

/** "Se F&SCM-partners för ett företag inom Tillverkning i er storlek" */
export function contextualPartnerPhrase(c: BuyerContext): string {
  const prod = shortProductName(c.product);
  let s = prod ? `Se ${prod}-partners` : "Se partners";
  if (c.industry) s += ` för ett företag inom ${c.industry.toLowerCase()}`;
  if (c.size) s += c.industry ? " i er storlek" : " för ett företag i er storlek";
  return s;
}
