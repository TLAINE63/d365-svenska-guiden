import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { isvProductPath } from "@/lib/isvPresentation";
import { nowrapBrand } from "@/lib/nowrapBrand";
import type { IsvSolution } from "@/data/bcIsvSolutions";
import type { TabKey } from "@/components/partner/types";

/** Vilken produktflik en ISV-produkt hör till, utifrån produkterna den är byggd för. */
export const isvMatchesTab = (products: string[] | undefined, tab: TabKey): boolean => {
  const list = products?.length ? products : ["Business Central"];
  return list.some((p) => {
    const v = p.toLowerCase();
    if (v.includes("business central")) return tab === "bc";
    if (v.includes("finance") || v.includes("supply chain") || v.includes("f&o") || v.includes("f&scm")) return tab === "fsc";
    return tab === "crm";
  });
};

export const resoldProductsFor = (solutions: IsvSolution[], partnerSlug: string, tab: TabKey) =>
  solutions.filter((s) => (s.partnerSlugs || []).includes(partnerSlug) && isvMatchesTab(s.products, tab));

/** ISV-produkter där leverantören själv angett partnern som återförsäljare. */
export default function PartnerResoldIsvProducts({ partnerSlug, partnerName, tab }: { partnerSlug: string; partnerName: string; tab: TabKey }) {
  const items = resoldProductsFor(useIsvSolutions(), partnerSlug, tab);
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Tilläggslösningar som {partnerName} säljer
      </h2>
      <p className="text-sm text-muted-foreground mb-4">Leverantörerna har själva angett {partnerName} som återförsäljare.</p>
      <ul className="grid sm:grid-cols-2 gap-3">
        {items.map((s) => (
          <li key={s.id}>
            <Link to={isvProductPath(s.id)} className="block rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
              <span className="font-semibold text-foreground">{s.name}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">{s.vendor}</span>
              {s.shortDescription && <span className="block text-sm text-muted-foreground mt-2 line-clamp-2">{nowrapBrand(s.shortDescription)}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
