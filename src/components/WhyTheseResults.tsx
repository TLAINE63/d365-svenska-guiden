import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  defaultOpen?: boolean;
}

/**
 * Förklaring som visas över partnerlistor och i partnerguidens resultat.
 * Transparens om hur urval och rangordning fungerar.
 */
export default function WhyTheseResults({ className = "", defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded border border-border bg-secondary/40 ${className}`}
      aria-label="Varför visas dessa partners?"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Info className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
          Varför visas dessa partners?
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-[13px] leading-relaxed text-foreground/85 space-y-2">
          <p>
            Först filtrerar vi bort partners som inte matchar era grundkriterier, till exempel
            produktområde, bransch och geografisk relevans. Därefter rangordnas kvarvarande
            partners efter hur väl de matchar era behov, med störst vikt på produktområde och
            branscherfarenhet.
          </p>
          <p>
            AI kan hjälpa till att sammanfatta varför en partner verkar relevant, men AI
            exkluderar aldrig partners på egen hand.
          </p>
          <p className="text-xs text-muted-foreground">
            <Link to="/agande-och-intressen/" className="text-[hsl(var(--cta-orange))] hover:underline font-semibold">
              Läs mer om metodiken
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
