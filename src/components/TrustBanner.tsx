import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";

type Variant = "full" | "compact";

interface Props {
  variant?: Variant;
  className?: string;
}

const POINTS = [
  "Vi säljer inte implementation eller system",
  "Matchningen bygger på relevans utifrån produkt, bransch och behov. AI används inte för att välja bort partners – grundurvalet bygger på strukturerade kriterier; AI tolkar signaler och förklarar relevans",
  "Alla identifierade partners kan visas. Verifierade partners betalar samma fasta avgift för en egen profil – ingen kan köpa bättre placering",
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
              Vi säljer inte system. Alla identifierade partners kan visas. Verifierade partners betalar för en egen profil. Rekommendationer baseras på relevans – inte betalning.
            </span>
            <Link
              to="/agande-och-intressen/"
              className="inline-flex items-center gap-1 font-semibold text-[hsl(var(--cta-orange))] hover:underline shrink-0"
            >
              Läs mer om ägande och intressen <ArrowRight className="w-3.5 h-3.5" />
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
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4 sm:py-5">
        <div className="bg-card border border-border rounded p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <div className="lg:w-1/4 lg:shrink-0">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--cta-orange))] mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Transparens
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                Så fungerar d365.se
              </h2>
              <Link
                to="/agande-och-intressen/"
                className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-[hsl(var(--cta-orange))] hover:underline"
              >
                Läs mer om metodiken <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <ul className="flex-1 grid grid-cols-1 gap-y-1.5">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] text-foreground">
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full bg-[hsl(var(--cta-orange))] shrink-0"
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
