import { useState } from "react";
import { ChevronDown, Link2, Scale } from "lucide-react";
import type { SolutionMap } from "@/lib/systemval/solutionMap";

const CLARITY = { clear: "Tydlig riktning", multiple: "Flera möjliga vägar", limited: "Begränsat underlag" } as const;
const KIND = { integration: "Information", process: "Processöverlämning", system_boundary: "Systemgräns", keep_existing: "Befintligt system" } as const;

/** Sprint 5: minimal preliminär lösningskarta. Inga poäng eller procent. */
export default function SolutionMapSection({ map: m }: { map: SolutionMap }) {
  const [why, setWhy] = useState(false);
  const tracks = [...m.start, ...m.complements, ...m.later];
  return (
    <section aria-labelledby="map-title" className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="map-title" className="text-lg font-semibold text-foreground">Er preliminära lösningskarta</h2>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{CLARITY[m.clarity]}</span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground">Börja med</h3>
        {m.start.length
          ? <ul className="mt-1 space-y-1 text-foreground">{m.start.map((t) => <li key={t.id}>{t.label}</li>)}</ul>
          : <p className="mt-1 text-sm text-muted-foreground">Underlaget räcker ännu inte för att peka ut var ni bör börja.</p>}
      </div>

      {m.alternatives.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Scale className="h-4 w-4 text-accent" aria-hidden />Alternativ att jämföra</h3>
          <ul className="mt-1 space-y-2">
            {m.alternatives.map((a) => (
              <li key={a.need} className="text-sm">
                <span className="font-medium text-foreground">{a.options.map((o) => o.label).join(" eller ")}</span>
                <p className="text-muted-foreground">{a.why}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {m.complements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Kompletterande lösningar</h3>
          <ul className="mt-1 space-y-1 text-foreground">{m.complements.map((t) => <li key={t.id}>{t.label}</li>)}</ul>
        </div>
      )}

      {m.later.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Möjlig senare etapp</h3>
          <ul className="mt-1 space-y-1 text-foreground">{m.later.map((t) => <li key={t.id}>{t.label}</li>)}</ul>
        </div>
      )}
      {m.phasingNote && <p className="text-sm text-muted-foreground">{m.phasingNote}</p>}

      {m.dependencies.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Link2 className="h-4 w-4 text-accent" aria-hidden />Viktiga samband</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {m.dependencies.map((d) => (
              <li key={d.key}><span className="font-medium text-foreground">{KIND[d.kind]}:</span> <span className="text-muted-foreground">{d.text}</span></li>
            ))}
          </ul>
        </div>
      )}

      {m.openQuestions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Att utreda vidare</h3>
          <ol className="mt-1 list-decimal pl-5 space-y-1 text-sm text-foreground">{m.openQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
        </div>
      )}

      {tracks.length > 0 && (
        <div>
          <button type="button" onClick={() => setWhy((v) => !v)} aria-expanded={why}
            className="flex items-center gap-2 text-left text-sm font-semibold text-foreground underline-offset-4 hover:underline">
            Varför föreslår vi detta?
            <ChevronDown className={`h-4 w-4 transition-transform ${why ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {why && (
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {tracks.map((t) => <li key={t.id}><span className="text-foreground">{t.label}:</span> {t.why}</li>)}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
