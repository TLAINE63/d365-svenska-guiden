import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Puzzle } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { isvSolutionsForIndustry } from "@/lib/industryIsvSolutions";

/** Fyra produktgrupper som filterknappar. */
const GROUPS: { key: string; label: string; products: string[] }[] = [
  { key: "bc", label: "Business Central", products: ["Business Central"] },
  { key: "fscm", label: "Finance & Supply Chain", products: ["Finance & Supply Chain Management"] },
  { key: "sales", label: "Sales & Customer Insights", products: ["Sales", "Customer Insights (Marketing)", "Customer Insights"] },
  { key: "service", label: "Customer Service, Field Service & Contact Center", products: ["Customer Service", "Field Service", "Contact Center"] },
];
const productsOf = (s: { products?: string[] }) => (s.products?.length ? s.products : ["Business Central"]);

const nb = (t: string) => t.replace(/Dynamics 365/g, "Dynamics\u00a0365");

/** Utfällbar sektion på branschsidor: tillägg som leverantören taggat för branschen. */
export default function IndustryIsvAccordionItem({ industrySlug, industryName }: { industrySlug: string; industryName: string }) {
  const all = useIsvSolutions();
  const list = useMemo(() => isvSolutionsForIndustry(all, industrySlug), [all, industrySlug]);
  const [group, setGroup] = useState<string | null>(null);
  const counts = useMemo(
    () => Object.fromEntries(GROUPS.map((g) => [g.key, list.filter((s) => productsOf(s).some((p) => g.products.some((gp) => p.startsWith(gp)))).length])),
    [list],
  );
  const shown = useMemo(() => {
    const g = GROUPS.find((x) => x.key === group);
    return g ? list.filter((s) => productsOf(s).some((p) => g.products.some((gp) => p.startsWith(gp)))) : list;
  }, [list, group]);
  if (!list.length) return null;
  return (
    <AccordionItem value="isv" className="border border-border rounded-lg bg-card px-5">
      <AccordionTrigger headingLevel="h2" className="hover:no-underline py-4">
        <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
          <Puzzle className="w-5 h-5 text-primary" />
          Typiska tilläggslösningar för {industryName.toLowerCase()} ({list.length})
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-wrap gap-2 pt-2" role="group" aria-label="Filtrera på Dynamics 365-produkt">
          <button type="button" aria-pressed={group === null} onClick={() => setGroup(null)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${group === null ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"}`}>
            Alla ({list.length})
          </button>
          {GROUPS.filter((g) => counts[g.key] > 0).map((g) => (
            <button key={g.key} type="button" aria-pressed={group === g.key} onClick={() => setGroup(group === g.key ? null : g.key)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${group === g.key ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"}`}>
              {g.label} ({counts[g.key]})
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 pb-4">
          {shown.map((s) => (
            <Link key={s.id} to={`/isv/produkt/${encodeURIComponent(s.id)}/`} className="rounded-lg border border-border bg-background p-4 hover:border-primary transition-colors">
              <h3 className="font-semibold text-foreground">{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{s.vendor} · {nb(productsOf(s).join(", "))}</p>
              {s.shortDescription && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.shortDescription}</p>}
            </Link>
          ))}
        </div>
        <Link to="/kunskapscenter/dynamics-365-tillagg/" className="inline-block text-sm font-semibold text-primary pb-4">Se hela tilläggskatalogen</Link>
      </AccordionContent>
    </AccordionItem>
  );
}
