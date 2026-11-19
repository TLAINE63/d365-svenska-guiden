import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Link2, Check } from "lucide-react";
import ToolResultNextStep from "@/components/tools/ToolResultNextStep";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { QUESTIONS, COPILOT_PRODUCTS, MICROSOFT_SOURCES, assess, pdfContent, answerLabel, isAnswered, toggleMulti, vals, MAX_MULTI, type Answers, type QuestionKey } from "@/lib/crmCopilotAssessment";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

/** Paket 3: rådgivande beslutsunderlag om Copilot och CRM. Neutralt startläge i SSG. */
export default function CrmCopilotAssessmentCard({ sourcePage }: { sourcePage: string }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [started, setStarted] = useState(false);
  const [dialog, setDialog] = useState(false);
  const result = useMemo(() => assess(answers), [answers]);

  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    const url = `https://d365.se${sourcePage}#copilot-crm-underlag`;
    try { await navigator.clipboard.writeText(url); } catch { window.prompt("Kopiera länken:", url); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
    trackFunnelEvent({ event_type: "engagement", event_name: "crm_copilot_link_copied", metadata: { page: sourcePage } });
  };

  const pick = (k: QuestionKey, v: string) => {
    if (!started) { setStarted(true); trackFunnelEvent({ event_type: "engagement", event_name: "crm_copilot_assessment_started", metadata: { page: sourcePage } }); }
    const q0 = QUESTIONS.find((q) => q.key === k);
    const next: Answers = { ...answers, [k]: q0?.multi ? toggleMulti(vals(answers, k), v) : v };
    setAnswers(next);
    if (QUESTIONS.every((q) => isAnswered(next, q.key)) && !QUESTIONS.every((q) => isAnswered(answers, q.key))) {
      const r = assess(next);
      trackFunnelEvent({ event_type: "engagement", event_name: "crm_copilot_assessment_completed", metadata: { page: sourcePage, paths: r.paths.map((p) => p.key).join(","), limited: r.limited } });
    }
  };

  const pdfData = pdfContent(answers, result);
  const answered = QUESTIONS.filter((q) => isAnswered(answers, q.key)).length;

  return (
    <section id="copilot-crm-underlag" className="py-10 sm:py-12 bg-muted/30 scroll-mt-24" data-next-step-block>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-primary">Beslutsunderlag, cirka 2 minuter</p>
          <Button type="button" variant="outline" size="sm" onClick={copyLink} aria-live="polite">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />} {copied ? "Länken är kopierad" : "Kopiera direktlänk"}
          </Button>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Behöver ni fortfarande ett CRM när Copilot kan göra delar av jobbet?</h2>
        <p className="text-muted-foreground mb-4">Copilot är en arbetsyta för mejl, möten och sökning. CRM är systemgrunden för kundregister, pipeline, behörigheter och affärslogik. Svara på sju frågor så får ni ett första underlag om vilka vägar som kan vara relevanta att undersöka. Det är inte en produktrekommendation.</p>

        <details className="mb-6 rounded-lg border border-border bg-card p-4">
          <summary className="cursor-pointer font-semibold text-foreground">Skillnaden mellan Copilot-produkterna</summary>
          <ul className="mt-3 space-y-2 text-sm">
            {COPILOT_PRODUCTS.map((p) => <li key={p.name}><strong className="text-foreground">{p.name}:</strong> <span className="text-muted-foreground">{p.text}</span></li>)}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Funktioner och licensvillkor ändras. Kontrollera alltid mot Microsofts aktuella källor: {MICROSOFT_SOURCES.map((s, i) => <span key={s.url}>{i > 0 && " och "}<a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{s.label}</a></span>)}.</p>
        </details>

        <ol className="space-y-5">
          {QUESTIONS.map((q, i) => (
            <li key={q.key} className="rounded-lg border border-border bg-card p-4">
              <fieldset>
                <legend className="font-semibold text-foreground mb-3">{i + 1}. {q.label}{q.multi && <span className="block text-sm font-normal text-muted-foreground mt-1">Välj upp till {MAX_MULTI} alternativ.</span>}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((o) => {
                    const on = vals(answers, q.key).includes(o.value);
                    return (
                      <label key={o.value} className={`flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm min-w-0 ${on ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                        <input type={q.multi ? "checkbox" : "radio"} name={`cc-${q.key}`} value={o.value} checked={on} onChange={() => pick(q.key, o.value)} className="mt-0.5 accent-primary" />
                        <span className="break-words">{o.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        {!result.complete && <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{answered} av 7 frågor besvarade. "Vet inte" räknas som svar.</p>}

        {result.complete && (
          <div className="mt-8 space-y-6" aria-live="polite" data-testid="cc-result">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-xl font-bold text-foreground mb-3">A. Vad svaren indikerar</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">{result.observations.map((o) => <li key={o}>{o}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">B. Vägar som kan vara relevanta att undersöka</h3>
              <p className="text-sm text-muted-foreground mb-3">Flera vägar kan gälla samtidigt. Ordningen är ingen rangordning.</p>
              <div className="grid gap-4 md:grid-cols-2">
                {result.paths.map((p) => (
                  <article key={p.key} className="rounded-lg border border-border bg-card p-5 flex flex-col" data-path={p.key}>
                    <h4 className="font-semibold text-foreground mb-2">{p.title}</h4>
                    <p className="text-sm text-muted-foreground flex-1">{p.why}</p>
                    <ul className="mt-3 space-y-1 text-sm">{p.links.map((l) => <li key={l.to}><Link to={l.to} className="text-primary underline underline-offset-2" onClick={() => trackFunnelEvent({ event_type: "engagement", event_name: "crm_copilot_guide_clicked", metadata: { path: p.key, to: l.to } })}>{l.label}</Link></li>)}</ul>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-xl font-bold text-foreground mb-3">C. Frågor som behöver utredas vidare</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">{result.openQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
              <p className="mt-4 text-xs text-muted-foreground">Detta är ett första beslutsunderlag baserat på era sju svar. Det är inte en kravspecifikation, en CRM-upphandling eller en produktrekommendation.</p>
            </div>

            <ToolResultNextStep tool="copilot_crm" product="sales" entry={{ label: "Beslutsunderlag: Copilot och CRM", values: pdfData.values }} pdf={pdfData.pdf} />

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setDialog(true)}>Diskutera underlaget med d365.se <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
              <Button variant="outline" onClick={() => { setAnswers({}); setStarted(false); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Börja om</Button>
            </div>
          </div>
        )}
      </div>

      {dialog && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setDialog(false)}
            topic={{
              title: "Diskutera underlaget med d365.se",
              description: "Vi går igenom era svar och de öppna frågorna. Inget skickas till någon partner.",
              helpWith: "Rådgivning: Copilot och CRM",
              startEvent: "solution_assessment_started",
              submitEvent: "solution_assessment_requested",
              messageLabel: "Vad vill ni prata om?",
              hideFocus: true,
              sourcePage,
              extras: [
                { key: "cc_svar", label: "Era svar", lines: QUESTIONS.map((q) => `${q.label} ${answerLabel(q.key, answers[q.key]) || "Ej besvarad"}`) },
                { key: "cc_observationer", label: "Observationer (regelbaserade, från svaren)", lines: result.observations },
                { key: "cc_vagar", label: "Vägar att undersöka", lines: result.paths.map((p) => p.title) },
                { key: "cc_fragor", label: "Frågor som återstår att utreda", lines: result.openQuestions },
              ],
              metadata: { initial_intent: "BuyerProject", topic: "crm_copilot_decision", product: "sales" },
              advisory: { placement: "solution_assessment", cta: "Diskutera underlaget med d365.se", pageType: "copilot_crm_underlag" },
              doneTitle: "Tack, vi hör av oss",
              showDoneSummary: true,
              doneNotes: ["d365.se går igenom underlaget manuellt och hör av sig.", "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande."],
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
