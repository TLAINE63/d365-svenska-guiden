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
  /** Visuell variant — kompakt eller fullbredd. Default 'full'. */
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
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <GitCompare className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">{title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {comparisons.map((c) => (
                <Link
                  key={c.slug}
                  to={`/jamfor/${c.slug}/`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {c.productShort} vs {c.competitor}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
              <Link
                to="/jamfor/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-primary hover:underline"
              >
                Alla jämförelser
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-10 md:py-12 bg-secondary/20 border-y border-border ${className}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <GitCompare className="w-3.5 h-3.5" /> Snabblänkar
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Köparsidiga sida-vid-sida-jämförelser med samma rader, samma frågor och alltid
              &quot;när passar inte&quot;.
            </p>
          </div>
          <Link
            to="/jamfor/"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1 whitespace-nowrap"
          >
            Alla jämförelser <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              to={`/jamfor/${c.slug}/`}
              className="group rounded-lg border border-border bg-background p-4 hover:border-primary/50 transition-colors"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                {c.productBreadcrumb}
              </p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {c.productShort} vs {c.competitor}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Läs jämförelsen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonQuickLinks;
