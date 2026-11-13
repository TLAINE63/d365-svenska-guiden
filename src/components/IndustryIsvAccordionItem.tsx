import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Puzzle } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { isvSolutionsForIndustry } from "@/lib/industryIsvSolutions";

const nb = (t: string) => t.replace(/Dynamics 365/g, "Dynamics\u00a0365");

/** Utfällbar sektion på branschsidor: tillägg som leverantören taggat för branschen. */
export default function IndustryIsvAccordionItem({ industrySlug, industryName }: { industrySlug: string; industryName: string }) {
  const all = useIsvSolutions();
  const list = useMemo(() => isvSolutionsForIndustry(all, industrySlug), [all, industrySlug]);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 pb-4">
          {list.map((s) => (
            <Link key={s.id} to={`/isv/produkt/${encodeURIComponent(s.id)}/`} className="rounded-lg border border-border bg-background p-4 hover:border-primary transition-colors">
              <h3 className="font-semibold text-foreground">{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{s.vendor} · {nb((s.products?.length ? s.products : ["Business Central"]).join(", "))}</p>
              {s.shortDescription && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.shortDescription}</p>}
            </Link>
          ))}
        </div>
        <Link to="/kunskapscenter/dynamics-365-tillagg/" className="inline-block text-sm font-semibold text-primary pb-4">Se hela tilläggskatalogen</Link>
      </AccordionContent>
    </AccordionItem>
  );
}
