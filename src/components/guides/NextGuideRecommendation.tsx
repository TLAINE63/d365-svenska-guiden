import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PARTNER_GUIDES, PartnerGuideKey, guidePath, nextGuide } from "@/data/partnerGuides";

interface Props {
  current: PartnerGuideKey;
  className?: string;
}

/**
 * Nästa rekommenderade guide. På huvudguiden visas hela urvalet av
 * produktguider, på produktguiderna nästa guide i sekvensen.
 */
const NextGuideRecommendation = ({ current, className = "" }: Props) => {
  if (current === "hub") {
    const rest = PARTNER_GUIDES.filter((g) => g.key !== "hub");
    return (
      <section className={`my-10 ${className}`} aria-label="Fortsätt läsa">
        <h2 className="text-lg font-bold mb-3">Fortsätt med guiden för ert system</h2>
        <div className="flex flex-wrap gap-2">
          {rest.map((g) => (
            <Link
              key={g.key}
              to={guidePath(g)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-[hsl(var(--cta-orange))] hover:text-[hsl(var(--cta-orange))]"
            >
              {g.shortLabel}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const next = nextGuide(current);
  if (!next) return null;

  return (
    <section className={`my-10 rounded-lg border border-border bg-muted/30 p-5 ${className}`} aria-label="Nästa guide">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        Nästa rekommenderade guide
      </p>
      <Link
        to={guidePath(next)}
        className="inline-flex items-center gap-2 text-base font-semibold hover:text-[hsl(var(--cta-orange))]"
      >
        {next.cardTitle}
        <ArrowRight className="h-4 w-4" />
      </Link>
      <p className="mt-1.5 text-sm text-muted-foreground">{next.cardDescription}</p>
    </section>
  );
};

export default NextGuideRecommendation;
