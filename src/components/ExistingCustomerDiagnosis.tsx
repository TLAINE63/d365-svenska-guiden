import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { SYMPTOMS, diagnose, followUpFor, type DxAnswers, type DxSymptom } from "@/lib/existingDiagnosis";
import { getBuyerContext, shortProductName } from "@/lib/buyerContext";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { nowrapBrand } from "@/lib/nowrapBrand";

const track = (event_name: string, metadata: Record<string, unknown> = {}) =>
  trackFunnelEvent({ event_type: "analysis_start", event_name, metadata: { tool: "befintlig-kund-diagnos", ...metadata } });

export default function ExistingCustomerDiagnosis() {
  const [a, setA] = useState<DxAnswers>({});
  const [product, setProduct] = useState<string | null>(null);
  const started = useRef(false);
  const completed = useRef<string | null>(null);

  useEffect(() => { setProduct(getBuyerContext().product ?? null); }, []);

  const answers = { ...a, knownProduct: product };
  const follow = followUpFor(a.symptom);
  const result = diagnose(answers);

  useEffect(() => {
    if (result && completed.current !== result.need) {
      completed.current = result.need;
      trackFunnelEvent({ event_type: "analysis_complete", event_name: "befintlig_diagnos_complete", metadata: { tool: "befintlig-kund-diagnos", need: result.need, known_product: Boolean(product) } });
    }
  }, [result, product]);

  const pick = (symptom: DxSymptom) => {
    if (!started.current) { started.current = true; track("befintlig_diagnos_start"); }
    completed.current = null;
    setA({ symptom });
  };

  return (
    <section className="mb-12 rounded-lg border border-border bg-card p-6 sm:p-8" aria-labelledby="dx-h">
      <h2 id="dx-h" className="text-2xl font-bold text-foreground mb-2">Osäkra på orsaken? Gör en kort diagnos</h2>
      <p className="text-muted-foreground mb-5 max-w-3xl">
        {nowrapBrand("Välj det som bäst beskriver läget. Ni får ett förslag på vilken typ av hjälp som passar, inget skickas vidare.")}
        {product && <> Vi utgår från att ni använder {nowrapBrand(shortProductName(product) ?? product)}.</>}
      </p>

      <fieldset>
        <legend className="sr-only">Nuläge</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {SYMPTOMS.map((s) => (
            <button key={s.value} type="button" aria-pressed={a.symptom === s.value} onClick={() => pick(s.value)}
              className={`text-left rounded-md border p-3 text-sm transition-colors ${a.symptom === s.value ? "border-primary bg-primary/10 text-foreground font-medium" : "border-border bg-background text-foreground hover:border-primary/50"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      {follow && (
        <fieldset className="mt-5">
          <legend className="font-semibold text-foreground mb-2">{follow.question}</legend>
          <div className="flex flex-wrap gap-2">
            {follow.options.map((o) => {
              const sel = (a as Record<string, unknown>)[follow.id] === o.value;
              return (
                <button key={o.value} type="button" aria-pressed={sel} onClick={() => setA({ ...a, [follow.id]: o.value })}
                  className={`rounded-md border px-3 py-2 text-sm ${sel ? "border-primary bg-primary/10 font-medium" : "border-border bg-background hover:border-primary/50"}`}>
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {result && (
        <div className="mt-6 rounded-md border border-border bg-secondary/40 p-5" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Det här verkar vara rätt typ av hjälp</p>
          <h3 className="text-xl font-semibold text-foreground mb-2">{nowrapBrand(result.title)}</h3>
          <p className="text-sm text-muted-foreground mb-4">{nowrapBrand(result.why)}</p>
          <ul className="flex flex-col sm:flex-row flex-wrap gap-3">
            {result.steps.map((s, i) => (
              <li key={s.href + s.label}>
                <Link to={s.href}
                  onClick={() => { track(`befintlig_diagnos_to_${s.kind}`, { need: result.need, target: s.href }); if (s.kind === "second_opinion") track("diagnos_to_second_opinion", { need: result.need, known_product: Boolean(product) }); }}
                  className={i === 0 ? "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90" : "inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-background"}>
                  {nowrapBrand(s.label)} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => { setA({}); completed.current = null; }} className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3 w-3" aria-hidden /> Börja om
          </button>
        </div>
      )}
    </section>
  );
}
