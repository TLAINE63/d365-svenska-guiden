import { Info } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
}

/**
 * Förklaring som visas över partnerlistor och i partnerguidens resultat.
 * Transparens om hur urval och rangordning fungerar.
 */
export default function WhyTheseResults({ className = "" }: Props) {
  return (
    <div
      className={`rounded border border-border bg-secondary/40 px-4 py-4 ${className}`}
      aria-label="Varför visas dessa partners?"
    >
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
        <Info className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
        Varför visas dessa partners?
      </div>
      <div className="text-[13px] leading-relaxed text-foreground/85 italic">
        <p>
          Vi visar partners som matchar era val av bransch, lösning och geografi.
          Resultatet sorteras efter hur väl de passar er profil.
          AI kan hjälpa till att förklara relevansen – men påverkar inte vilka partners som visas.
          {" "}
          <Link to="/agande-och-intressen/" className="text-[hsl(var(--cta-orange))] hover:underline font-semibold not-italic">
            Läs mer om metodiken
          </Link>
        </p>
      </div>
    </div>
  );
}
