import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import type { BusinessNeedKey } from "@/lib/solutionNeeds";
import { MEETING_TOPIC } from "@/components/advisory/AdvisorContactButtons";
import {
  APPROVAL, CRITICALITY, OWNERSHIP, PATH_LABELS, PROCESS_TYPES, SYSTEMS, TASK_TYPES,
  assessSolutionPath, type PathInput, type PathResult,
} from "@/lib/solutionPath";
import { READINESS_DISCLAIMER, READINESS_QUESTIONS, evaluateReadiness, readinessRelevant, type ReadinessInput } from "@/lib/agentReadiness";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));
const selectCls = "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface Props { sourcePage: string; areas?: BusinessNeedKey[] }

/** Lösningsvägval: standard, ISV, agent/automation, egenutveckling eller kombination. Resultat utan kontaktuppgifter. */
export default function SolutionPathChoice({ sourcePage, areas = [] }: Props) {
  const [input, setInput] = useState<PathInput>({});
  const [result, setResult] = useState<PathResult | null>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState<ReadinessInput>({});
  const readiness = result && readinessRelevant(result) && Object.values(ready).some(Boolean) ? evaluateReadiness(input, ready) : null;
  const set = (k: keyof PathInput, v: string) => { setInput({ ...input, [k]: v || undefined }); setResult(null); };

  const show = () => {
    const r = assessSolutionPath({ ...input, areas });
    setResult(r);
    trackFunnelEvent({ event_type: "analysis_complete", event_name: "solution_path_completed", metadata: { tool: "solution_path", source_page: sourcePage, primary: r.primary ?? "insufficient", process: input.processType ?? null } });
    window.setTimeout(() => document.getElementById("vagval-resultat")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const sel = (k: keyof PathInput, label: string, opts: readonly { value: string; label: string }[]) => (
    <div>
      <Label htmlFor={`sp-${k}`}>{label}</Label>
      <select id={`sp-${k}`} className={selectCls} value={(input[k] as string) || ""} onChange={(e) => set(k, e.target.value)}>
        <option value="">Välj</option>
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5" id="losningsvagval">
      <h3 className="text-lg font-semibold text-foreground">Hur bör behovet lösas?</h3>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">{nowrapBrand("Allt behöver inte lösas med ny programvara. Svara på några frågor så ser ni om standard i Dynamics 365, ett tillägg, automation, egen utveckling eller en kombination är rimligast att undersöka först.")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="sp-need">Behovet i en mening (valfritt)</Label>
          <Input id="sp-need" value={input.need || ""} maxLength={200} onChange={(e) => set("need", e.target.value)} placeholder="T.ex. matcha leverantörsfakturor mot inleveranser" />
        </div>
        {sel("processType", "Vilken sorts process är det?", PROCESS_TYPES)}
        {sel("taskType", "Hur ser arbetet ut?", TASK_TYPES)}
        {sel("criticality", "Hur kritisk är processen?", CRITICALITY)}
        {sel("systems", "Vilka system berörs?", SYSTEMS)}
        {sel("approval", "Krävs mänskligt godkännande?", APPROVAL)}
        {sel("ownership", "Vem ska förvalta lösningen?", OWNERSHIP)}
      </div>
      <Button className="mt-4" onClick={show}>Visa vägvalet <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>

      {result && (
        <div id="vagval-resultat" className="mt-6 scroll-mt-28 rounded-lg border border-border bg-card p-5 space-y-4" aria-live="polite">
          {input.need?.trim() && (
            <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ert behov</p><p className="text-sm text-foreground">{input.need.trim()}</p></div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rekommenderat första vägval</p>
            <p className="text-base font-semibold text-foreground">{result.primary ? nowrapBrand(PATH_LABELS[result.primary]) : "Underlaget räcker inte ännu"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Varför</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{result.why.map((w) => <li key={w}>{nowrapBrand(w)}</li>)}</ul>
          </div>
          {result.alternatives.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alternativ att jämföra</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{result.alternatives.map((a) => <li key={a}>{nowrapBrand(PATH_LABELS[a])}</li>)}</ul>
            </div>
          )}
          {result.verify.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Behöver verifieras</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{result.verify.map((v) => <li key={v}>{nowrapBrand(v)}</li>)}</ul>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Läs vidare</p>
            <ul className="mt-1 flex flex-wrap gap-2">
              {result.links.map((l) => (
                <li key={l.href}><Link to={l.href} className="inline-block rounded-md border border-border px-3 py-1.5 text-sm text-primary hover:bg-muted">{nowrapBrand(l.label)}</Link></li>
              ))}
            </ul>
          </div>
          {readinessRelevant(result) && (
            <div className="border-t border-border pt-4" id="agent-forutsattningar">
              <p className="text-sm font-semibold text-foreground">Har ni förutsättningar för en agent eller automation?</p>
              <p className="text-sm text-muted-foreground">Tre korta frågor till. Vi använder också era svar ovan om arbetet, godkännande och förvaltning.</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {READINESS_QUESTIONS.map((q) => (
                  <div key={q.key}>
                    <Label htmlFor={`ar-${q.key}`}>{q.label}</Label>
                    <select id={`ar-${q.key}`} className={selectCls} value={ready[q.key] || ""} onChange={(e) => setReady({ ...ready, [q.key]: (e.target.value || undefined) as ReadinessInput[typeof q.key] })}>
                      <option value="">Välj</option>
                      {q.options.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              {readiness && (
                <div className="mt-4 rounded-md border border-border bg-muted/40 p-4 space-y-3" aria-live="polite">
                  <p className="text-base font-semibold text-foreground">{readiness.title}</p>
                  <p className="text-sm text-muted-foreground">{nowrapBrand(readiness.summary)}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Svaren bakom bedömningen</p>
                    <ul className="list-disc pl-5 space-y-0.5 text-sm text-muted-foreground">{readiness.basis.map((b) => <li key={b}>{b}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{readiness.insufficient ? "Det här behöver undersökas" : "Nästa steg"}</p>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-foreground">
                      {readiness.nextSteps.map((s) => (
                        <li key={s.label}>
                          {s.href ? <Link to={s.href} className="text-primary underline-offset-4 hover:underline">{nowrapBrand(s.label)}</Link>
                            : s.advisory ? <button type="button" onClick={() => setOpen(true)} className="text-left text-primary underline-offset-4 hover:underline">{s.label}</button>
                            : nowrapBrand(s.label)}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <p className="text-xs text-muted-foreground">{READINESS_DISCLAIMER}</p>
                </div>
              )}
            </div>
          )}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">Vill ni ha en personlig bedömning?</p>
            <p className="text-sm text-muted-foreground">Ett kostnadsfritt samtal på 20 minuter med d365.se. Inget skickas till någon partner.</p>
            <Button variant="outline" className="mt-3" onClick={() => setOpen(true)}>Boka 20 min rådgivning <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          </div>
        </div>
      )}

      {open && result && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setOpen(false)}
            topic={{
              ...MEETING_TOPIC,
              extras: [{ key: "vagval", label: "Lösningsvägval", lines: [
                ...(input.need?.trim() ? [`Behov: ${input.need.trim()}`] : []),
                `Första vägval: ${result.primary ? PATH_LABELS[result.primary] : "underlaget räcker inte"}`,
                ...result.alternatives.map((a) => `Alternativ: ${PATH_LABELS[a]}`),
                ...(readiness ? [`Förutsättningar för agent: ${readiness.title}`] : []),
              ] }],
              metadata: { tool: "solution_path", source_page: sourcePage, primary: result.primary ?? "insufficient" },
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
