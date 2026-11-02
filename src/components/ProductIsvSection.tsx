import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Puzzle, ArrowRight, HelpCircle } from "lucide-react";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import type { IsvSolution } from "@/data/bcIsvSolutions";
import { selectFscmIsvs } from "@/lib/fscmIsvSelection";
import { needForCategory, type IsvBuyerNeed } from "@/lib/isvBuyerNeeds";
import { Button } from "@/components/ui/button";
import { commonExampleRank } from "@/lib/isvCommonExamples";

/** Lösningar utan angivna produkter räknas som Business Central-tillägg. */
const solutionProducts = (s: IsvSolution): string[] =>
  s.products?.length ? s.products : ["Business Central"];

const nb = (t: string) => t.replace(/Dynamics 365/g, "Dynamics\u00a0365");

interface ProductIsvSectionProps {
  /** Produktnamn exakt som i ISV_PRODUCTS, t.ex. "Business Central". */
  product: string;
  title?: string;
  description?: string;
  /** Antal kompletteringsområden som visas. */
  limit?: number;
  className?: string;
  /** F&SCM: föredra redaktionellt kontrollerade exempel. */
  reviewedFscmSelection?: boolean;
}

/**
 * Redaktionell relevans: dokumenterad verifiering och nordisk relevans.
 * Kommersiell status (avtal, premium) används aldrig.
 */
const evidence = (s: IsvSolution): number => {
  const tier = (s.editorialTier || s.tier || "").toLowerCase();
  return (tier.includes("1") ? 3 : tier.includes("2") ? 1 : 0) +
    (s.nordicRelevance === "high" ? 2 : 0) + (s.verifiedAt ? 1 : 0);
};

/** Antal namngivna exempel per område (max ett per leverantör). */
const EXAMPLES_PER_AREA = 4;

interface Area { need: IsvBuyerNeed; count: number; categories: string[]; example: IsvSolution; more: IsvSolution[] }

const catalogBase = "/kunskapscenter/dynamics-365-tillagg/";

const ProductIsvSection = ({
  product,
  title,
  description,
  limit = 4,
  className = "",
  reviewedFscmSelection = false,
}: ProductIsvSectionProps) => {
  const all = useIsvSolutions();

  const areas = useMemo<Area[]>(() => {
    const solutions = all.filter((s) => solutionProducts(s).includes(product));
    const reviewed = new Set(reviewedFscmSelection ? selectFscmIsvs(solutions).map((s) => s.id) : []);
    const groups = new Map<string, { need: IsvBuyerNeed; items: IsvSolution[]; cats: Set<string> }>();
    for (const s of solutions) {
      const need = needForCategory(s.category || "");
      const g = groups.get(need.id) || { need, items: [], cats: new Set<string>() };
      g.items.push(s);
      if (s.category) g.cats.add(s.category);
      groups.set(need.id, g);
    }
    const usedVendors = new Set<string>();
    return [...groups.values()]
      .filter((g) => g.need.id !== "ovrigt")
      .sort((a, b) => b.items.length - a.items.length || a.need.label.localeCompare(b.need.label, "sv"))
      .slice(0, limit)
      .map((g) => {
        const ranked = [...g.items].sort(
          (a, b) =>
            (commonExampleRank(product, a.id) - commonExampleRank(product, b.id) || 0) ||
            evidence(b) - evidence(a) ||
            Number(reviewed.has(b.id)) - Number(reviewed.has(a.id)) ||
            a.name.localeCompare(b.name, "sv"),
        );
        const example = ranked.find((s) => !usedVendors.has(s.vendor)) || ranked[0];
        usedVendors.add(example.vendor);
        const seen = new Set([example.vendor]);
        const more: IsvSolution[] = [];
        for (const s of ranked) {
          if (more.length >= EXAMPLES_PER_AREA - 1) break;
          if (seen.has(s.vendor)) continue;
          seen.add(s.vendor);
          more.push(s);
        }
        return { need: g.need, count: g.items.length, categories: [...g.cats], example, more };
      });
  }, [all, product, limit, reviewedFscmSelection]);

  if (areas.length === 0) return null;

  const productUrl = `${catalogBase}?produkt=${encodeURIComponent(product)}`;
  const areaUrl = (a: Area) =>
    `${productUrl}${a.categories.map((c) => `&kategori=${encodeURIComponent(c)}`).join("")}`;
  const solutionUrl = (s: IsvSolution) => `${productUrl}&losning=${encodeURIComponent(s.id)}`;

  return (
    <section className={`py-14 md:py-16 bg-muted/30 border-y border-border ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <Puzzle className="w-3.5 h-3.5" aria-hidden /> Tilläggslösningar
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {title || `Vad hanterar ${product}, och när kan en komplettering vara värd att undersöka?`}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-3xl">
              {nb(description ||
                `Standardfunktionerna i applikationen räcker ofta långt. Beroende på krav, volymer och konfiguration kan en komplettering ändå vara värd att undersöka. Här är de områden där katalogen har flest lösningar för ${product}, med några vanliga exempel per område.`)}
            </p>
          </div>
          <Button asChild variant="outline" className="h-auto min-h-10 whitespace-normal text-left">
            <Link to={productUrl}>
              {`Se alla tillägg för ${product}`}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((a) => (
            <article key={a.need.id} className="flex flex-col rounded-lg border border-border bg-card p-5">
              <h3 className="text-base font-bold text-foreground">{a.need.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{a.count} {a.count === 1 ? "lösning" : "lösningar"} i katalogen</p>
              <div className="mt-4 border-t border-border pt-3 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Exempel · {a.example.vendor}</div>
                <p className="text-sm font-semibold text-foreground mt-1">
                  <Link to={solutionUrl(a.example)} className="hover:text-primary underline-offset-4 hover:underline">{a.example.name}</Link>
                </p>
                {a.example.shortDescription && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{nb(a.example.shortDescription)}</p>
                )}
                {a.example.considerations && (
                  <p className="text-xs text-muted-foreground mt-2"><span className="font-medium text-foreground">Kontrollera: </span>{nb(a.example.considerations)}</p>
                )}
                {a.more.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    <span className="font-medium text-foreground">Fler i området: </span>
                    {a.more.map((s, i) => (
                      <span key={s.id}>
                        {i > 0 && ", "}
                        <Link to={solutionUrl(s)} className="underline underline-offset-4 hover:text-primary">{s.name}</Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <Link to={areaUrl(a)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-4">
                Se området i katalogen <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 flex gap-3 rounded-lg border border-border bg-card p-4 text-sm">
          <HelpCircle className="w-5 h-5 shrink-0 text-accent" aria-hidden />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Fråga er partner: </span>
            Vad löser standardfunktionerna i applikationen, vad kräver tillägg eller anpassning, och vem ansvarar för integration, uppgraderingar och support?
          </p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Exemplen väljs efter dokumenterad koppling till applikationen och nordisk relevans, högst ett per leverantör, aldrig efter kommersiell status.</p>
      </div>
    </section>
  );
};

export default ProductIsvSection;
