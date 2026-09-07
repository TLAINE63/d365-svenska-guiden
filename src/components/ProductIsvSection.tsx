import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Puzzle, ArrowRight } from "lucide-react";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import type { IsvSolution } from "@/data/bcIsvSolutions";

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
}: ProductIsvSectionProps) => {
  const all = useIsvSolutions();

  const solutions = useMemo(
    () => all.filter((s) => solutionProducts(s).includes(product)),
    [all, product]
  );

  const catalogUrl = `/kunskapscenter/dynamics-365-tillagg/?produkt=${encodeURIComponent(product)}`;
  const shown = useMemo(() => diversify(solutions, limit), [solutions, limit]);
  const hasSolutions = solutions.length > 0;


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
          <Link
            to={catalogUrl}
            className="inline-flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            {`Se alla tillägg för ${product}`}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((s) => (
            <Link
              key={s.id}
              to={`/kunskapscenter/dynamics-365-tillagg/?produkt=${encodeURIComponent(product)}&losning=${encodeURIComponent(s.id)}`}
              className="group block rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {s.vendor}
              </div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition">
                {s.name}
              </h3>
              <div className="mt-2 inline-block text-[11px] font-medium px-2 py-0.5 rounded border border-border text-muted-foreground">
                {s.category}
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                {s.shortDescription}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-4">
                Visa lösningen <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductIsvSection;
