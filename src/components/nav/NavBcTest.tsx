import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NAV_QUESTIONS, NAV_PATH_TEXT, NAV_UNSAFE_TEXT, calculateNavResult, type NavAnswers,
} from "@/lib/navBcDecision";

const PATH_ORDER = ["A", "B", "C"] as const;

const NavBcTest = () => {
  const [answers, setAnswers] = useState<NavAnswers>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const q = NAV_QUESTIONS[step];
  const total = NAV_QUESTIONS.length;
  const value = answers[q.id];
  const answered = q.multi ? Array.isArray(value) && value.length > 0 : !!value;
  const result = useMemo(() => (done ? calculateNavResult(answers) : null), [done, answers]);

  const pick = (v: string) => {
    if (q.multi) {
      const cur = Array.isArray(value) ? value : [];
      setAnswers({ ...answers, [q.id]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
    } else setAnswers({ ...answers, [q.id]: v });
  };

  const scrollTop = () => document.getElementById("nav-test")?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (result) {
    const t = NAV_PATH_TEXT[result.path];
    return (
      <div className="rounded-xl border border-border bg-card p-5 sm:p-8 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Er rekommenderade väg</p>
          <div className="mt-3 flex gap-2" aria-hidden>
            {PATH_ORDER.map((p) => (
              <span key={p} className={`h-1.5 flex-1 rounded-full ${p === result.path ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <h3 className="mt-4 text-xl sm:text-2xl font-bold text-foreground">{t.title}</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{t.body}</p>
          {result.path === "B" && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-foreground">
              {["Behåll", "Standard", "App", "Avveckla"].map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="rounded-full border border-border bg-muted px-2.5 py-1">{s}</span>
                  {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden />}
                </span>
              ))}
            </div>
          )}
          {result.path === "C" && (
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <li className="rounded-lg border border-border bg-muted/40 p-3"><strong>A.</strong> Migrera och modernisera befintlig NAV</li>
              <li className="rounded-lg border border-border bg-muted/40 p-3"><strong>B.</strong> Implementera Business Central utifrån dagens behov och migrera utvald data</li>
            </ol>
          )}
          <p className="mt-4 text-sm"><span className="font-semibold text-foreground">Nästa steg: </span><span className="text-muted-foreground">{t.next}</span></p>
        </div>

        {result.unknowns.length > 0 && (
          <div className="rounded-lg border border-accent/40 bg-accent/5 p-4 sm:p-5">
            <p className="flex items-start gap-2 font-semibold text-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              {result.unsafe ? NAV_UNSAFE_TEXT : "Det finns delar av er NAV-miljö som först behöver kartläggas."}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-6">
              {result.unknowns.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </div>
        )}

        {result.situation.length > 0 && (
          <section>
            <h4 className="font-semibold text-foreground">Ert utgångsläge</h4>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {result.situation.join(", ").replace(/^./, (c) => c.toUpperCase())}.
            </p>
          </section>
        )}

        {result.factors.length > 0 && (
          <section>
            <h4 className="font-semibold text-foreground">Det som främst påverkar bedömningen</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {result.factors.map((f) => (
                <li key={f} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground">{f}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h4 className="font-semibold text-foreground">Det här bör ni undersöka först</h4>
          <ul className="mt-3 space-y-2">
            {result.investigate.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />{i}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="font-semibold text-foreground">Frågor att ta med till en Business Central-partner</h4>
          <ol className="mt-3 space-y-2 list-decimal pl-5 text-sm text-foreground">
            {result.partnerQuestions.map((p) => <li key={p}>{p}</li>)}
          </ol>
        </section>

        <p className="text-xs text-muted-foreground border-t border-border pt-4">
          Bedömningen bygger enbart på era svar och d365.se:s regler. Den är ett första beslutsunderlag, inte en teknisk förstudie eller offert.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => { setDone(false); setStep(0); scrollTop(); }}>
            <ArrowLeft className="mr-2 h-4 w-4" />Ändra svar
          </Button>
          <Button variant="ghost" onClick={() => { setAnswers({}); setDone(false); setStep(0); scrollTop(); }}>
            <RotateCcw className="mr-2 h-4 w-4" />Börja om
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Fråga {step + 1} av {total}</span>
        {q.multi && <span>Välj ett eller flera</span>}
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-muted" aria-hidden>
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>
      <fieldset className="mt-6">
        <legend className="text-lg sm:text-xl font-semibold text-foreground">{q.question}</legend>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {q.options.map((opt) => {
            const selected = q.multi ? Array.isArray(value) && value.includes(opt.value) : value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role={q.multi ? "checkbox" : "radio"}
                aria-checked={selected}
                onClick={() => pick(opt.value)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors min-h-12 ${
                  selected ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border hover:border-foreground/30 text-foreground"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center border ${q.multi ? "rounded" : "rounded-full"} ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {selected && <Check className="h-3.5 w-3.5" />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />Tillbaka
        </Button>
        {step < total - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!answered}>
            Nästa<ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => { setDone(true); scrollTop(); }} disabled={!answered}>
            Visa min rekommendation<ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavBcTest;
