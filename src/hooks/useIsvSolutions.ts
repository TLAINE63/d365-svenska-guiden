import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BC_ISV_SOLUTIONS, type IsvSolution } from "@/data/bcIsvSolutions";

export interface IsvOverride {
  solution_id: string;
  short_description: string | null;
  what: string | null;
  when_fits: string | null;
  use_cases: string[] | null;
  combos: string[] | null;
  products?: string[] | null;
  industries?: string[] | null;
  partner_slugs?: string[] | null;
  vendor_name?: string | null;
  vendor_website?: string | null;
  vendor_contact_name?: string | null;
  vendor_contact_email?: string | null;
  admin_contact_name?: string | null;
  admin_contact_email?: string | null;
  admin_contact_phone?: string | null;
  sales_contact_name?: string | null;
  sales_contact_email?: string | null;
  sales_contact_phone?: string | null;
  vendor_updated_at?: string | null;
}

export function applyIsvOverrides(
  solutions: IsvSolution[],
  overrides: Record<string, IsvOverride>
): IsvSolution[] {
  if (!Object.keys(overrides).length) return solutions;
  return solutions.map((s) => {
    const o = overrides[s.id];
    if (!o) return s;
    return {
      ...s,
      shortDescription: o.short_description?.trim() || s.shortDescription,
      what: o.what?.trim() || s.what,
      whenFits: o.when_fits?.trim() || s.whenFits,
      useCases: o.use_cases?.length ? o.use_cases : s.useCases,
      combos: o.combos?.length ? o.combos : s.combos,
      products: o.products?.length ? o.products : s.products,
      industryFocus: o.industries?.length ? o.industries : s.industryFocus,
      partnerSlugs: o.partner_slugs?.length ? o.partner_slugs : s.partnerSlugs,
      vendor: o.vendor_name?.trim() || s.vendor,
      vendorWebsite: o.vendor_website?.trim() || s.vendorWebsite,
      vendorUpdatedAt: o.vendor_updated_at || s.vendorUpdatedAt,
    };
  });
}

/** Rå rad från tabellen isv_solutions (lösningar skapade i admin). */
export interface IsvSolutionRow {
  solution_id: string;
  name: string;
  vendor: string;
  short_description: string | null;
  category: string;
  type: string;
  tier: string;
  tags: string[] | null;
  industries: string[] | null;
  geo: string[] | null;
  what: string | null;
  use_cases: string[] | null;
  when_fits: string | null;
  combos: string[] | null;
  products: string[] | null;
  industry_focus: string[] | null;
  partner_slugs: string[] | null;
  vendor_website: string | null;
  is_published?: boolean;
  sort_order?: number;
}

/** Konverterar en databasrad till katalogens IsvSolution-format. */
export function rowToSolution(r: IsvSolutionRow): IsvSolution {
  return {
    id: r.solution_id,
    name: r.name,
    vendor: r.vendor,
    shortDescription: r.short_description || "",
    type: r.type as IsvSolution["type"],
    category: r.category as IsvSolution["category"],
    tier: r.tier as IsvSolution["tier"],
    tags: r.tags || [],
    industries: (r.industries || []) as IsvSolution["industries"],
    geo: (r.geo || []) as IsvSolution["geo"],
    what: r.what || "",
    useCases: r.use_cases || [],
    whenFits: r.when_fits || "",
    combos: r.combos || [],
    partnersSE: [],
    products: r.products || undefined,
    industryFocus: r.industry_focus || undefined,
    partnerSlugs: r.partner_slugs || undefined,
    vendorWebsite: r.vendor_website || undefined,
  };
}

/**
 * Returnerar ISV-katalogen: statisk kodkatalog + lösningar skapade i admin,
 * med eventuella admin- eller leverantörsredigerade texter pålagda.
 * Faller alltid tillbaka på den statiska katalogen (viktigt för SSG).
 */
export function useIsvSolutions(): IsvSolution[] {
  const [overrides, setOverrides] = useState<Record<string, IsvOverride>>({});
  const [dbSolutions, setDbSolutions] = useState<IsvSolution[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("isv_solution_overrides_public")
        .select(
          "solution_id, short_description, what, when_fits, use_cases, combos, products, industries, partner_slugs, vendor_name, vendor_website, vendor_updated_at"
        );
      if (error || cancelled || !data) return;
      const map: Record<string, IsvOverride> = {};
      for (const row of data as IsvOverride[]) map[row.solution_id] = row;
      setOverrides(map);
    })();

    (async () => {
      const { data, error } = await supabase
        .from("isv_solutions")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error || cancelled || !data) return;
      setDbSolutions((data as unknown as IsvSolutionRow[]).map(rowToSolution));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const staticIds = new Set(BC_ISV_SOLUTIONS.map((s) => s.id));
    const merged = [...BC_ISV_SOLUTIONS, ...dbSolutions.filter((s) => !staticIds.has(s.id))];
    return applyIsvOverrides(merged, overrides);
  }, [overrides, dbSolutions]);
}
