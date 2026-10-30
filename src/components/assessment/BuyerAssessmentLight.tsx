import { lazy, Suspense, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { CONCRETE_NEEDS, type BusinessNeedKey } from "@/lib/solutionNeeds";
import {
  ASSESSMENT_HORIZONS, ASSESSMENT_PHASES, ASSESSMENT_SIZES, assessBuyer, assessmentSummaryLines, hasAssessmentInput,
  type AssessmentInput, type AssessmentResult,
} from "@/lib/buyerAssessment";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

const selectCls = "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface Props {
  sourcePage: string;
  initialAreas?: BusinessNeedKey[];
  /** Fortsätt i behovsguiden när det rekommenderade steget är guiden. */
  onContinueGuide?: () => void;
  /** Ytterligare knappar bredvid "Visa bedömningen", t.ex. Prata med d365.se. */
  extraActions?: ReactNode;
  onChange?: (input: AssessmentInput) => void;
}

/**
 * Sprint 1.7: frivillig bedömning. Resultatet visas direkt, utan kontaktuppgifter. Den som vill
 * diskutera bedömningen skickar den till d365.se (internt ärende, inget till partners).
 */
export default function BuyerAssessmentLight({ sourcePage, initialAreas = [], onContinueGuide, extraActions, onChange }: Props) {
  const [input, setInputState] = useState<AssessmentInput>({ areas: initialAreas });
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [open, setOpen] = useState(false);
  const started = useRef(false);
  const track = (event_name: string, metadata: Record<string, unknown> = {}) =>
    trackFunnelEvent({ event_type: "analysis_step", event_name, metadata: { tool: "buyer_assessment_light", source_page: sourcePage, ...metadata } });

  const setInput = (next: AssessmentInput) => {
    if (!started.current) { started.current = true; track("assessment_started"); }
    setInputState(next);
    onChange?.(next);
    if (result) setResult(null);
  };
  const toggleArea = (k: BusinessNeedKey) => {
    const areas = input.areas || [];
    setInput({ ...input, areas: areas.includes(k) ? areas.filter((x) => x !== k) : [...areas, k] });
  };

  const show = () => {
    if (!started.current) { started.current = true; track("assessment_started"); }
    const r = assessBuyer(input);
    setResult(r);
    trackFunnelEvent({ event_type: "analysis_complete", event_name: "assessment_completed", metadata: { tool: "buyer_assessment_light", source_page: sourcePage, areas: (input.areas || []).join(","), size: input.size ?? null, phase: input.phase ?? null, horizon: input.horizon ?? null, questions: r.questions.length } });
    window.setTimeout(() => document.getElementById("bedomning-resultat")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5">
      <h2 className="text-lg font-semibold text-foreground mb-1">Gör en kort bedömning av ert läge</h2>
      <p className="text-sm text-muted-foreground mb-4">Allt är frivilligt. Ni ser resultatet direkt, utan att lämna några kontaktuppgifter.</p>
      <div className="space-y-4">
        <div>
          <Label htmlFor="ba-change">Vad vill organisationen förändra?</Label>
          <Textarea id="ba-change" rows={2} maxLength={600} value={input.change ?? ""} onChange={(e) => setInput({ ...input, change: e.target.value })} />
        </div>
        <fieldset>
          <legend className="text-sm font-medium mb-2">Relevant område</legend>
          <div className="flex flex-wrap gap-2">
            {CONCRETE_NEEDS.map((n) => {
              const on = (input.areas || []).includes(n.key);
              return (
                <button key={n.key} type="button" aria-pressed={on} onClick={() => toggleArea(n.key)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${on ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50"}`}>
                  {n.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="ba-system">Nuvarande system</Label>
            <Input id="ba-system" maxLength={120} placeholder="T.ex. Excel, Fortnox, Visma" value={input.currentSystem ?? ""} onChange={(e) => setInput({ ...input, currentSystem: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="ba-size">Ungefärlig omfattning</Label>
            <select id="ba-size" className={selectCls} value={input.size ?? ""} onChange={(e) => setInput({ ...input, size: e.target.value || undefined })}>
              <option value="">Välj</option>
              {ASSESSMENT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="ba-phase">Projektfas</Label>
            <select id="ba-phase" className={selectCls} value={input.phase ?? ""} onChange={(e) => setInput({ ...input, phase: e.target.value || undefined })}>
              <option value="">Välj</option>
              {ASSESSMENT_PHASES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="ba-horizon">Tidshorisont</Label>
            <select id="ba-horizon" className={selectCls} value={input.horizon ?? ""} onChange={(e) => setInput({ ...input, horizon: e.target.value || undefined })}>
              <option value="">Välj</option>
              {ASSESSMENT_HORIZONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={show} disabled={!hasAssessmentInput(input)}>Visa bedömningen <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          {extraActions}
        </div>
      </div>

      {result && (
        <div id="bedomning-resultat" className="mt-6 scroll-mt-28 rounded-lg border border-border bg-card p-5" aria-live="polite">
          <h3 className="text-lg font-semibold text-foreground mb-4">Er bedömning</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {result.situation.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Er situation</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{result.situation.map((s) => <li key={s}>{nowrapBrand(s)}</li>)}</ul>
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Frågor att reda ut</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{result.questions.map((q) => <li key={q}>{nowrapBrand(q)}</li>)}</ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Relevanta vägar att utforska</h4>
              <ul className="space-y-1">
                {result.paths.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} onClick={() => track("assessment_selfservice_continued", { target: l.href, via: "path" })} className="text-sm font-medium text-primary hover:underline">
                      {nowrapBrand(l.label)} <ArrowRight className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Rekommenderat nästa steg</h4>
              <p className="text-sm font-medium text-foreground">{nowrapBrand(result.nextStep.label)}</p>
              <p className="text-sm text-muted-foreground">{nowrapBrand(result.nextStep.text)}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Bedömningen bygger bara på era svar. Den är ingen produktrekommendation och ingen poäng.</p>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
            <Button onClick={() => setOpen(true)}>Diskutera bedömningen med d365.se <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            {result.nextStep.continueGuide && onContinueGuide ? (
              <Button variant="outline" onClick={() => { track("assessment_selfservice_continued", { target: "behovsguide", via: "next_step" }); onContinueGuide(); }}>Fortsätt utforska själv</Button>
            ) : (
              <Button asChild variant="outline">
                <Link to={result.nextStep.to ?? "/kom-igang/"} onClick={() => track("assessment_selfservice_continued", { target: result.nextStep.to ?? "/kom-igang/", via: "next_step" })}>Fortsätt utforska själv</Link>
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Inget skickas till någon partner. En introduktion görs bara efter ert godkännande.</p>
        </div>
      )}

      {open && result && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setOpen(false)}
            topic={{
              title: "Diskutera bedömningen med d365.se",
              description: "Bedömningen följer med. d365.se går igenom den manuellt och hör av sig. Inget skickas till någon partner.",
              helpWith: "Diskutera bedömningen",
              startEvent: "assessment_contact_started",
              submitEvent: "assessment_contact_requested",
              messageLabel: "Kommentar (valfritt)",
              hideFocus: true,
              extras: [
                ...(input.change?.trim() || input.currentSystem?.trim() ? [{ key: "underlag", label: "Ert underlag", lines: [input.change?.trim() && `Vill förändra: ${input.change.trim()}`, input.currentSystem?.trim() && `Nuvarande system: ${input.currentSystem.trim()}`].filter(Boolean) as string[] }] : []),
                ...assessmentSummaryLines(input, result),
              ],
              metadata: { tool: "buyer_assessment_light", source_page: sourcePage, areas: (input.areas || []).join(","), size: input.size ?? null, phase: input.phase ?? null, horizon: input.horizon ?? null },
              advisory: { placement: "solution_assessment", cta: "Diskutera bedömningen med d365.se", pageType: "behovsguide" },
              doneTitle: "Tack, vi har tagit emot er bedömning",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom bedömningen manuellt och hör av sig.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
