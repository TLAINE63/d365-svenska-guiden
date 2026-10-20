/**
 * Kopplar kravspecifikationerna till besökarens lokala köparprofil (buyerProfile),
 * så att bransch, storlek och valda områden följer med oavsett väg in.
 * URL-/test-förifyllning har alltid företräde; profilen används bara som reserv.
 */
import { useEffect, useRef } from "react";
import { getBuyerProfile, saveProfile, type BuyerProfile } from "@/lib/buyerProfile";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

export type KravProduct = "erp" | "sales" | "service" | "marketing";

/** Branschnamn från profilen (slug eller namn), bara om det finns i giltig lista. */
export function profileIndustryName(p: BuyerProfile, valid: readonly string[]): string | undefined {
  const raw = p.company?.industry;
  if (typeof raw !== "string" || !raw) return undefined;
  const name = STANDARD_INDUSTRIES.find((i) => i.slug === raw)?.name ?? raw;
  return valid.includes(name) ? name : undefined;
}

export function industrySlug(name: string): string {
  return STANDARD_INDUSTRIES.find((i) => i.name === name)?.slug ?? name;
}

export interface KravRestore { industry?: string; size?: string; areas: string[] }

/** Vad profilen kan återställa för en viss kravspec. */
export function readKravFromProfile(p: BuyerProfile, product: KravProduct, opts: { industries: readonly string[]; sizes: readonly string[]; areaIds: readonly string[] }): KravRestore {
  const size = p.project?.[`krav_${product}_size`];
  const areas = p.project?.[`krav_${product}_areas`];
  return {
    industry: profileIndustryName(p, opts.industries),
    size: typeof size === "string" && opts.sizes.includes(size) ? size : undefined,
    areas: Array.isArray(areas) ? areas.filter((a) => opts.areaIds.includes(a)) : [],
  };
}

interface SyncArgs {
  product: KravProduct;
  industries: readonly string[];
  sizes: readonly string[];
  areaIds: readonly string[];
  industry: string; setIndustry: (v: string) => void;
  companySize: string; setCompanySize: (v: string) => void;
  areas: string[]; setAreas: (v: string[]) => void;
  step: number; setStep: (v: number) => void;
}

/** Fyller i tomma fält från profilen efter mount (SSG-säkert) och sparar ändringar tillbaka. */
export function useKravProfileSync(a: SyncArgs) {
  const ready = useRef(false);
  useEffect(() => {
    const r = readKravFromProfile(getBuyerProfile(), a.product, a);
    const ind = a.industry || r.industry;
    if (!a.industry && r.industry) a.setIndustry(r.industry);
    const size = a.companySize || r.size;
    if (!a.companySize && r.size) a.setCompanySize(r.size);
    if (!a.areas.length && r.areas.length) a.setAreas(r.areas);
    if (a.step === 1 && ind) a.setStep(size ? 3 : 2);
    const t = window.setTimeout(() => { ready.current = true; }, 0);
    return () => window.clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ready.current || !a.industry) return;
    if (profileIndustryName(getBuyerProfile(), a.industries) === a.industry) return;
    saveProfile({ company: { industry: industrySlug(a.industry) } });
  }, [a.industry]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ready.current) return;
    saveProfile({ project: { [`krav_${a.product}_size`]: a.companySize || null, [`krav_${a.product}_areas`]: a.areas.length ? a.areas : null } });
  }, [a.companySize, a.areas.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
}
