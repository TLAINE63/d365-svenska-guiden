import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { costAssumptions } from "@/data/costAssumptions";
import {
  COST_ASSESSMENT_SUBJECTS, COST_ORG_SIZES, COST_PROJECT_PHASES, COST_SOLUTION_AREAS,
  costHelpLines, costNextSteps, trackCost, type CostHelpDraft,
} from "@/lib/costJourney";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

const selectCls = "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export interface CostDriver { label: string; text: string }

interface Props {
  /** Sidan där resultatet visas, för mätning. */
  sourcePage: string;
  /** Lösningsområde från kalkylatorn (etikett i COST_SOLUTION_AREAS). */
  area?: string;
  /** Kostnadsguidens avsnitt för lösningen, t.ex. "business-central". */
  costAnchor?: string;
  /** Organisationsstorlek från kalkylatorn (etikett i COST_ORG_SIZES). */
  size?: string;
  /** Vad som driver kostnaden utifrån besökarens egna val. */
  drivers: CostDriver[];
  /** Kalkylresultatet i klartext, följer med om besökaren ber om hjälp. */
  estimateLines?: string[];
  className?: string;
}

/**
 * Sprint 1.5: visas efter ett kostnadsresultat. "Vad påverkar er faktiska kostnad?",
 * "Vad vill ni göra härnäst?" och Conversion Exit "Få hjälp att bedöma kostnadsbilden"
 * (PlanContactDialog advisory → internt ärende hos d365.se, inget skickas till partners).
 */
export default function CostNextSteps({ sourcePage, area, costAnchor, size, drivers, estimateLines = [], className = "" }: Props) {
  const [draft, setDraft] = useState<CostHelpDraft>({ area, size });
  const [open, setOpen] = useState(false);
  useEffect(() => { setDraft((d) => ({ ...d, area: area ?? d.area, size: size ?? d.size })); }, [area, size]);

  const excluded = costAnchor ? costAssumptions[costAnchor]?.excluded ?? [] : [];
  const steps = costNextSteps(costAnchor);
  const lines = costHelpLines(draft, estimateLines);

  return (
    <section data-next-step-block="" data-source-template="calculator" className={`rounded-xl border border-border bg-card p-5 sm:p-6 ${className}`} aria-labelledby="kostnad-paverkar-h">
      <h2 id="kostnad-paverkar-h" className="text-xl sm:text-2xl font-bold text-foreground mb-2">Vad påverkar er faktiska kostnad?</h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
        Spannet är en uppskattning. Det här avgör var i spannet ert projekt hamnar, och vad partnerns offert behöver visa.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 mb-4">
        {drivers.map((d) => (
          <li key={d.label} className="rounded-lg border border-border bg-background p-3">
            <p className="text-sm font-semibold text-foreground">{nowrapBrand(d.label)}</p>
            <p className="text-sm text-muted-foreground">{nowrapBrand(d.text)}</p>
          </li>
        ))}
      </ul>
      {excluded.length > 0 && (
        <div className="mb-6 text-sm">
          <p className="font-semibold text-foreground mb-1">Ingår inte i spannet</p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
            {excluded.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 mt-6">Vad vill ni göra härnäst?</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {steps.map((s) => (
          <li key={s.key}>
            <Link
              to={s.href}
              onClick={() => trackCost("cost_next_step_clicked", { step: s.key, source_page: sourcePage, area: draft.area ?? null })}
              className="group flex h-full flex-col rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-semibold text-foreground group-hover:text-primary">{s.label} <ArrowRight className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" /></span>
              <span className="mt-1 text-sm text-muted-foreground">{s.text}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="rounded-lg border border-border bg-muted/30 p-5">
        <h3 className="text-lg font-semibold text-foreground mb-1">Vill ni ha hjälp att bedöma kostnadsbilden?</h3>
        <p className="text-sm text-muted-foreground mb-4">d365.se går igenom underlaget manuellt. Allt nedan är frivilligt och inget skickas till någon partner.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="ch-area">Lösningsområde</Label>
            <select id="ch-area" className={selectCls} value={draft.area ?? ""} onChange={(e) => setDraft({ ...draft, area: e.target.value || undefined })}>
              <option value="">Välj</option>
              {COST_SOLUTION_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="ch-size">Organisation/användare</Label>
            <select id="ch-size" className={selectCls} value={draft.size ?? ""} onChange={(e) => setDraft({ ...draft, size: e.target.value || undefined })}>
              <option value="">Välj</option>
              {COST_ORG_SIZES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="ch-subject">Vad gäller bedömningen?</Label>
            <select id="ch-subject" className={selectCls} value={draft.subject ?? ""} onChange={(e) => setDraft({ ...draft, subject: e.target.value || undefined })}>
              <option value="">Välj</option>
              {COST_ASSESSMENT_SUBJECTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="ch-phase">Projektfas</Label>
            <select id="ch-phase" className={selectCls} value={draft.phase ?? ""} onChange={(e) => setDraft({ ...draft, phase: e.target.value || undefined })}>
              <option value="">Välj</option>
              {COST_PROJECT_PHASES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <Button className="mt-4" onClick={() => setOpen(true)}>
          Få hjälp att bedöma kostnadsbilden <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {open && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setOpen(false)}
            topic={{
              title: "Få hjälp att bedöma kostnadsbilden",
              description: "d365.se går igenom kostnadsbilden manuellt och hör av sig. Inget skickas till någon partner.",
              helpWith: `Kostnadsbild${draft.area ? `: ${draft.area}` : ""}`,
              startEvent: "cost_help_started",
              submitEvent: "cost_help_requested",
              messageLabel: "Kommentar (valfritt)",
              hideFocus: true,
              extras: lines.length ? [{ key: "kostnadsbild", label: "Kostnadsbild", lines }] : [],
              metadata: { initial_intent: "BuyerProject", area: draft.area ?? null, size: draft.size ?? null, subject: draft.subject ?? null, phase: draft.phase ?? null, source_page: sourcePage },
              advisory: { placement: "cost_help", cta: "Få hjälp att bedöma kostnadsbilden", pageType: "kostnad" },
              doneTitle: "Tack, vi har tagit emot ert underlag",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom kostnadsbilden manuellt och hör av sig.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
