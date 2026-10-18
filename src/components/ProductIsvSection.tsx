import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Puzzle, ArrowRight } from "lucide-react";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import type { IsvSolution } from "@/data/bcIsvSolutions";
import { FSCM_ISV_EVIDENCE, selectFscmIsvs } from "@/lib/fscmIsvSelection";
import { Button } from "@/components/ui/button";

/** Lösningar utan angivna produkter räknas som Business Central-tillägg. */
const solutionProducts = (s: IsvSolution): string[] =>
  s.products?.length ? s.products : ["Business Central"];

interface ProductIsvSectionProps {
  /** Produktnamn exakt som i ISV_PRODUCTS, t.ex. "Business Central". */
  product: string;
  /** Rubriktext – standard baseras på produktnamnet. */
  title?: string;
  description?: string;
  /** Antal lösningar som visas som smakprov. */
  limit?: number;
  className?: string;
  reviewedFscmSelection?: boolean;
}

/** Intern prioritering – exponeras aldrig som kvalitetsmärkning i gränssnittet. */
const priority = (s: IsvSolution): number => {
  const tier = (s.editorialTier || s.tier || "").toLowerCase();
  let score = tier.includes("1") ? 3 : tier.includes("2") ? 2 : 1;
  if (s.nordicRelevance === "high") score += 2;
  if (s.verifiedAt) score += 1;
  return score;
};

/**
 * Väljer ett brett urval: högst två lösningar per leverantör och spridning
 * över kategorier, så att en enskild leverantör inte dominerar sektionen.
 */
const diversify = (list: IsvSolution[], limit: number): IsvSolution[] => {
  const byCategory = new Map<string, IsvSolution[]>();
  for (const s of [...list].sort((a, b) => priority(b) - priority(a) || a.name.localeCompare(b.name, "sv"))) {
    const key = s.category || "Övrigt";
    byCategory.set(key, [...(byCategory.get(key) || []), s]);
  }
  const queues = [...byCategory.values()];
  const picked: IsvSolution[] = [];
  const vendorCount = new Map<string, number>();
  let progress = true;
  while (picked.length < limit && progress) {
    progress = false;
    for (const q of queues) {
      if (picked.length >= limit) break;
      const idx = q.findIndex((s) => (vendorCount.get(s.vendor) || 0) < 2);
      if (idx === -1) continue;
      const [s] = q.splice(idx, 1);
      vendorCount.set(s.vendor, (vendorCount.get(s.vendor) || 0) + 1);
      picked.push(s);
      progress = true;
    }
  }
  return picked;
};

const ProductIsvSection = ({
  product,
  title,
  description,
  limit = 6,
  className = "",
  reviewedFscmSelection = false,
}: ProductIsvSectionProps) => {
  const all = useIsvSolutions();

  const solutions = useMemo(
    () => all.filter((s) => solutionProducts(s).includes(product)),
    [all, product]
  );

  const catalogUrl = `/kunskapscenter/dynamics-365-tillagg/?produkt=${encodeURIComponent(product)}`;
  const shown = useMemo(() => reviewedFscmSelection ? selectFscmIsvs(solutions).slice(0, limit) : diversify(solutions, limit), [solutions, limit, reviewedFscmSelection]);
  const hasSolutions = shown.length > 0;


  // Visa bara sektionen om det finns minst en ISV-lösning för produkten
  if (!hasSolutions) return null;

  return (
    <section className={`py-14 md:py-16 bg-muted/30 border-y border-border ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <Puzzle className="w-3.5 h-3.5" /> Tilläggslösningar
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {title || `Tilläggslösningar för ${product}`}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
              {description ||
                `Standardfunktionerna räcker inte alltid hela vägen. Här är ett urval av ISV-lösningar som kompletterar ${product} – hela katalogen finns i Kunskapscentret.`}
            </p>
          </div>
          <Button asChild variant="outline" className="h-auto min-h-10 whitespace-normal text-left">
          <Link
            to={catalogUrl}
          >
            {`Se alla tillägg för ${product}`}
            <ArrowRight className="w-4 h-4" />
          </Link>
          </Button>
        </div>

        <div className={`grid sm:grid-cols-2 ${reviewedFscmSelection ? "" : "lg:grid-cols-3"} gap-4`}>
          {shown.map((s) => (
            <article
              key={s.id}
              className="group block rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {s.vendor}
              </div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition">
                <Link to={`/kunskapscenter/dynamics-365-tillagg/?produkt=${encodeURIComponent(product)}&losning=${encodeURIComponent(s.id)}`}>{s.name}</Link>
              </h3>
              <div className="mt-2 inline-block text-[11px] font-medium px-2 py-0.5 rounded border border-border text-muted-foreground">
                {s.category}
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                {s.shortDescription}
              </p>
              {reviewedFscmSelection && (
                <div className="mt-3 space-y-2 text-sm">
                  <p className="font-medium text-foreground">{FSCM_ISV_EVIDENCE[s.id]?.area}</p>
                  {s.bestFor && <p className="text-muted-foreground"><span className="font-medium text-foreground">Undersök när: </span>{s.bestFor.replace(/Dynamics 365/g, "Dynamics\u00a0365")}</p>}
                  {s.considerations && <p className="text-muted-foreground"><span className="font-medium text-foreground">Kontrollera: </span>{s.considerations.replace(/Dynamics 365/g, "Dynamics\u00a0365")}</p>}
                  <a href={FSCM_ISV_EVIDENCE[s.id]?.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-muted-foreground underline underline-offset-4">Källa för produktstöd, kontrollerad 2026-10-18</a>
                </div>
              )}
              <Link to={`/kunskapscenter/dynamics-365-tillagg/?produkt=${encodeURIComponent(product)}&losning=${encodeURIComponent(s.id)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-4">
                Visa lösningen <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductIsvSection;
