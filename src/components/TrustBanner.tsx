import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";

type Variant = "full" | "compact";

interface Props {
  variant?: Variant;
  className?: string;
}

const POINTS = [
  "Vi säljer inte implementation eller system",
  "Partners betalar samma fasta avgift – ingen kan köpa bättre placering",
  "Rekommendationer baseras på behovsmatchning, inte annonsbudget",
  "Vi visar även aktörer utanför plattformen för transparens",
];

/**
 * Global "Så fungerar d365.se"-banner.
 * Full = hero-startsida. Compact = partnerlistor/profil/footer.
 */
export default function TrustBanner({ variant = "full", className = "" }: Props) {
  if (variant === "compact") {
    return (
      <aside
        className={`bg-secondary/60 border-y border-border ${className}`}
        aria-label="Så fungerar d365.se"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[13px] text-foreground/80">
            <span className="inline-flex items-center gap-2 font-semibold text-foreground shrink-0">
              <ShieldCheck className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
              Så fungerar d365.se:
            </span>
            <span className="flex-1">
              Vi säljer inte system. Alla partners betalar samma avgift. Rekommendationer baseras på relevans – inte betalning.
            </span>
            <Link
              to="/agande-och-intressen/"
              className="inline-flex items-center gap-1 font-semibold text-[hsl(var(--cta-orange))] hover:underline shrink-0"
            >
              Läs mer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section
      className={`bg-background border-b border-border ${className}`}
      aria-label="Så fungerar d365.se"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-10">
        <div className="bg-card border border-border rounded p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-8">
            <div className="lg:w-1/3 lg:shrink-0">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--cta-orange))] mb-2">
                <ShieldCheck className="w-4 h-4" />
                Transparens
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Så fungerar d365.se
              </h2>
              <p className="text-sm text-muted-foreground">
                En köparorienterad plattform för Microsoft Dynamics 365 – utan dolda intressen.
              </p>
              <Link
                to="/agande-och-intressen/"
                className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[hsl(var(--cta-orange))] hover:underline"
              >
                Läs mer om metodiken <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="flex-1 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--cta-orange))] shrink-0"
                    aria-hidden
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
