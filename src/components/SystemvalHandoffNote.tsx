import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { sizeLabel, useBuyerContext } from "@/lib/buyerContext";
import { SHORT_LABEL, calcLinkFor, handoffFor, readSystemvalContext, type HandoffPage, type SystemvalContext } from "@/lib/systemvalHandoff";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

const D = "Dynamics\u00A0365";

/**
 * Diskret ruta på produktsidan när besökaren har gjort Systemval och sidans produkt
 * föreslogs som huvudspår eller komplement. Visas bara efter mount (SSG-säkert).
 */
export default function SystemvalHandoffNote({ page, className = "" }: { page: HandoffPage; className?: string }) {
  const [ctx, setCtx] = useState<SystemvalContext | null>(null);
  const buyer = useBuyerContext();
  const tracked = useRef(false);
  useEffect(() => { setCtx(readSystemvalContext()); }, []);

  const match = handoffFor(ctx, page);
  const calc = match ? calcLinkFor(ctx, page) : null;

  useEffect(() => {
    if (!match || tracked.current) return;
    tracked.current = true;
    trackFunnelEvent({ event_type: "journey", event_name: "handover_hydrated", metadata: { from: "systemval", product: page, role: match.role, prefilled: Boolean(calc?.prefilled) } });
  }, [match, calc, page]);

  if (!ctx || !match) return null;

  const label = SHORT_LABEL[match.id];
  const primaries = ctx.primary.filter((id) => id !== match.id).map((id) => SHORT_LABEL[id]);
  const heading =
    match.role === "primary"
      ? ctx.primary.length > 1 ? `${label} var ett av huvudspåren i er vägledning` : `${label} var huvudspåret i er vägledning`
      : primaries.length ? `${label} föreslogs som komplement till ${primaries.join(" och ")}` : `${label} föreslogs som komplement i er vägledning`;
  const text =
    match.role === "primary"
      ? "Läs sidan med det i åtanke och pröva sedan kostnaden mot era egna förutsättningar."
      : "Läs om hur det kompletterar huvudspåret och om det behövs från start eller i en senare etapp.";
  const chips = [buyer.industry, sizeLabel(buyer.size)].filter(Boolean) as string[];

  return (
    <aside aria-label="Från er vägledning i Systemval" className={`container mx-auto max-w-4xl px-4 sm:px-6 my-6 print:hidden ${className}`}>
      <div className="rounded-lg border border-border bg-secondary/40 p-4 sm:p-5">
        <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
          <Compass className="h-4 w-4" aria-hidden="true" />
          Från er vägledning i Systemval
        </p>
        <h2 className="text-base sm:text-lg font-semibold leading-snug text-foreground">{heading.split("Dynamics 365").join(D)}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        {chips.length > 0 && (
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Era tidigare val:</span>
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-border bg-background px-2.5 py-0.5 font-medium text-foreground">{c}</span>
            ))}
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {calc && (
            <li>
              <Link
                to={calc.url}
                onClick={() => trackFunnelEvent({ event_type: "engagement", event_name: "systemval_to_calc", metadata: { product: page, role: match.role, prefilled: calc.prefilled } })}
                className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              >
                {calc.prefilled ? "Räkna på kostnaden med era svar" : "Räkna på kostnaden"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </li>
          )}
          <li><Link to="/underlag/" className="text-foreground underline-offset-4 hover:underline">Visa min D365-plan</Link></li>
          <li><Link to="/kom-igang/" className="text-muted-foreground underline-offset-4 hover:underline">Ändra svaren</Link></li>
        </ul>
      </div>
    </aside>
  );
}
