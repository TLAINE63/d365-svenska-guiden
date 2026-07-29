import { Link } from "react-router-dom";
import { ArrowRight, GitCompare } from "lucide-react";
import {
  getComparisonsByProduct,
  PRODUCT_META,
  type ProductKey,
} from "@/data/erpComparisons";

interface Props {
  /** En eller flera produktnycklar att visa jämförelser för. */
  productKeys: ProductKey | ProductKey[];
  /** Visuell variant – kompakt eller fullbredd. Default 'full'. */
  variant?: "full" | "compact";
  /** Override-rubrik. */
  heading?: string;
  /** Klassnamn för wrapper-sektionen. */
  className?: string;
}

const ComparisonQuickLinks = ({
  productKeys,
  variant = "full",
  heading,
  className = "",
}: Props) => {
  const keys = Array.isArray(productKeys) ? productKeys : [productKeys];
  const comparisons = keys.flatMap((k) => getComparisonsByProduct(k));

  if (comparisons.length === 0) return null;

  const firstMeta = PRODUCT_META[keys[0]];
  const title =
    heading ??
    (keys.length === 1
      ? `Jämför ${firstMeta.short} mot konkurrenter`
      : "Jämför mot konkurrenter");

  if (variant === "compact") {
    return (
      <section className={`py-6 ${className}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-xl border border-border bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <GitCompare className="w-4 h-4 text-primary shrink-0" />
              <h2 className="text-base font-bold text-foreground leading-snug">{title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {comparisons.map((c) => (
                <Link
                  key={c.slug}
                  to={`/jamfor/${c.slug}/`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-md border border-border bg-background text-sm text-foreground hover:border-primary/50 hover:text-primary active:bg-secondary/60 transition-colors max-w-full"
                >
                  <span className="break-words">
                    {c.productShort} vs {c.competitor}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              ))}
              <Link
                to="/jamfor/"
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-md text-sm font-medium text-primary hover:underline"
              >
                Alla jämförelser
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-8 sm:py-10 md:py-12 bg-secondary/20 border-y border-border ${className}`}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <GitCompare className="w-3.5 h-3.5 shrink-0" /> Snabblänkar
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug break-words">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Köparsidiga sida-vid-sida-jämförelser med samma rader, samma frågor och alltid
              &quot;när passar inte&quot;.
            </p>
          </div>
          <Link
            to="/jamfor/"
            className="inline-flex items-center gap-1 self-start sm:self-auto min-h-[44px] px-1 text-sm font-medium text-primary hover:underline whitespace-nowrap"
          >
            Alla jämförelser <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              to={`/jamfor/${c.slug}/`}
              className="group flex flex-col rounded-lg border border-border bg-background p-4 min-h-[112px] hover:border-primary/50 hover:shadow-sm active:bg-secondary/40 transition-all"
            >
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 break-words">
                {c.productBreadcrumb}
              </p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug break-words hyphens-auto">
                {c.productShort} <span className="text-muted-foreground font-normal">vs</span>{" "}
                {c.competitor}
              </p>
              <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Läs jämförelsen <ArrowRight className="w-3 h-3 shrink-0" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonQuickLinks;
