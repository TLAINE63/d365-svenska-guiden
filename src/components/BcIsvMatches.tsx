import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Puzzle, ArrowRight } from "lucide-react";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { matchBcIsvAreas } from "@/lib/bcIsvMatches";

const base = "/kunskapscenter/dynamics-365-tillagg/?produkt=Business%20Central";

/** Exempel ur tilläggskatalogen för testets tilläggsbehov. Visas bara när katalogen har träffar. */
const BcIsvMatches = ({ areas }: { areas: string[] }) => {
  const all = useIsvSolutions();
  const matches = useMemo(() => matchBcIsvAreas(areas, all).slice(0, 6), [areas, all]);
  if (!matches.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
        <Puzzle className="w-3.5 h-3.5" aria-hidden /> Tilläggslösningar för era behov
      </div>
      <h3 className="text-lg font-semibold text-foreground">Exempel ur katalogen att jämföra</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-5">
        Upp till tre exempel per behov, valda efter dokumenterad verifiering och nordisk relevans, högst ett per leverantör. Det är inga rekommendationer: be er partner bekräfta vad standard klarar innan ni väljer tillägg.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {matches.map((m) => (
          <article key={m.area} className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold text-foreground">{m.area}</h4>
            <ul className="mt-2 space-y-2">
              {m.solutions.map((s) => (
                <li key={s.id} className="text-sm">
                  <Link to={`${base}&losning=${encodeURIComponent(s.id)}`} className="font-medium text-foreground hover:text-primary hover:underline underline-offset-4">
                    {s.name}
                  </Link>
                  <span className="text-muted-foreground"> · {s.vendor}</span>
                  {s.shortDescription && <p className="text-xs text-muted-foreground line-clamp-2">{s.shortDescription.replace(/Dynamics 365/g, "Dynamics\u00a0365")}</p>}
                </li>
              ))}
            </ul>
            <Link to={`${base}${m.categories.map((c) => `&kategori=${encodeURIComponent(c)}`).join("")}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3">
              Se fler i katalogen <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BcIsvMatches;
