import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Pencil, RotateCcw, Puzzle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SolutionPicture } from "@/lib/systemval/solutions";
import type { ErpResult } from "@/lib/systemval/modules/erp";
import type { SvcResult } from "@/lib/systemval/modules/service";
import { DISCLAIMER, EXISTING_NOTE, PRODUCT_LABEL, driverLabel, startDiffers } from "@/lib/systemval/modules/erpTexts";

export interface AnswerSummaryItem { index: number; question: string; answer: string }

interface Props {
  picture: SolutionPicture;
  erp?: ErpResult;
  svc?: SvcResult;
  answers: AnswerSummaryItem[];
  onEdit: (index: number) => void;
  onRestart: () => void;
  onNextStep?: (kind: string) => void;
  onDeepen?: () => void;
  deepSlot?: ReactNode;
}

/** Sprint 3: preliminär lösningsbild. Visar aldrig poäng eller regel-id. */
export default function SolutionResultView({ picture: p, erp, svc, answers, onEdit, onRestart, onNextStep, onDeepen, deepSlot }: Props) {
  const [why, setWhy] = useState(false);
  const [whySvc, setWhySvc] = useState(false);
  const svcReasons = svc ? [...new Set([...svc.customerServiceSignals, ...svc.contactCenterSignals, ...svc.fieldServiceSignals, ...svc.integrationSignals, ...svc.combinationSignals].map((x) => x.reason))] : [];
  const CLARITY = { clear: "Tydlig riktning", multiple: "Flera möjliga vägar", limited: "Begränsat underlag" } as const;
  const start = erp?.selectedProductStartingPoint ? PRODUCT_LABEL[erp.selectedProductStartingPoint] : null;
  const driver = erp ? driverLabel(erp) : null;

  return (
    <section aria-labelledby="sol-title" className="space-y-8">
      <header>
        <h1 id="sol-title" className="text-2xl sm:text-3xl font-semibold text-foreground text-balance">Er preliminära Dynamics&nbsp;365-väg</h1>
        <p className="mt-3 text-muted-foreground">
          Utifrån era svar har vi identifierat några lösningsområden som verkar särskilt relevanta att undersöka vidare. Se detta som en vägledning inför nästa steg, inte som ett slutligt systemval.
        </p>
      </header>

      <div>
        <h2 className="text-lg font-semibold text-foreground">Så tolkar vi ert behov</h2>
        <p className="mt-2 text-muted-foreground">{p.interpretation}</p>
        {start && (
          <p className="mt-2 text-sm text-muted-foreground">
            Er valda utgångspunkt: <span className="font-medium text-foreground">{start}</span>
            {erp && startDiffers(erp) && ". Vår preliminära bedömning skiljer sig, eftersom den utgår från de behov ni beskrivit."}
          </p>
        )}
      </div>

      {p.primary.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Börja med att titta på</h2>
          {p.comparePrimary && <p className="mt-1 text-sm text-muted-foreground">Era svar pekar mot båda spåren. De bör jämföras innan ni går vidare.</p>}
          <div className={`mt-3 grid gap-4 ${p.primary.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {p.primary.map((s) => (
              <article key={s.id} className="flex flex-col rounded-xl border border-primary/40 bg-primary/5 p-5">
                <h3 className="text-lg font-semibold text-foreground text-balance">{s.label}</h3>
                {s.reasons.length > 0 && (
                  <>
                    <p className="mt-3 text-sm font-medium text-foreground">Varför den verkar relevant för er</p>
                    <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-muted-foreground">{s.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                  </>
                )}
                {driver && ["fscm", "finance", "scm"].includes(s.id) && <p className="mt-2 text-sm text-muted-foreground">{driver}</p>}
                <div className="mt-auto pt-4">
                  <Button asChild variant="outline" size="sm"><Link to={s.href}>{s.cta}<ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {p.complementary.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Kan också vara relevant</h2>
          <div className="mt-3 grid gap-3">
            {p.complementary.map((s) => (
              <article key={s.id} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold text-foreground">{s.label}</h3>
                {s.text && <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>}
                <Link to={s.href} className="mt-2 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline">
                  {s.cta}<ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {p.investigate.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Bör undersökas vidare</h2>
          <p className="mt-1 text-sm text-muted-foreground">Era svar visar viss relevans, men underlaget räcker ännu inte för en tydligare vägledning.</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {p.investigate.map((s) => (
              <li key={s.id} className="rounded-lg border border-border bg-card p-3 text-sm">
                <Link to={s.href} className="font-medium text-foreground underline-offset-4 hover:underline">{s.label}</Link>
                {s.reasons[0] && <p className="mt-0.5 text-muted-foreground">{s.reasons[0]}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {p.aiNotes.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles className="h-4 w-4 text-accent" aria-hidden />AI och Copilot inom era områden</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{p.aiNotes.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="mt-2 text-xs text-muted-foreground">Vilka funktioner som finns och ingår i licensen behöver kontrolleras.</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground">Saker ni bör undersöka vidare</h2>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-foreground">{p.openQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
        {erp?.existingSolutionInvestigation && <p className="mt-3 rounded-md bg-muted p-3 text-sm text-foreground">{EXISTING_NOTE}</p>}
      </div>

      {p.addOn && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground"><Puzzle className="h-4 w-4 text-accent" aria-hidden />Tillägg kan behöva utvärderas</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Era behov inom {p.addOn.areas.join(", ")} kan innebära att standardfunktionaliteten behöver kompletteras. Innan ni väljer lösning bör ni därför även undersöka relevanta tilläggslösningar.
          </p>
          <Link to="/kunskapscenter/dynamics-365-tillagg/" className="mt-2 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline">
            Så fungerar tillägg till Dynamics&nbsp;365<ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>
      )}

      <div className="rounded-xl border border-primary/40 bg-card p-5">
        <h2 className="text-sm font-semibold text-muted-foreground">Rekommenderat nästa steg</h2>
        <p className="mt-1 text-sm text-muted-foreground">{p.nextStep.reason}</p>
        <Button asChild className="mt-3 w-full sm:w-auto">
          <Link to={p.nextStep.href} onClick={() => onNextStep?.(p.nextStep.kind)}>{p.nextStep.label}<ArrowRight className="h-4 w-4 ml-1" /></Link>
        </Button>
      </div>

      {deepSlot ?? (onDeepen && (
        <div className="rounded-xl border border-border bg-muted/50 p-5">
          <h2 className="font-semibold text-foreground">Vill ni gå ett steg längre?</h2>
          <p className="mt-1 text-sm text-muted-foreground">En kort, frivillig fördjupning om just era lösningsområden. Era svar följer med, och ni får förslag på vad ni bör besluta om härnäst.</p>
          <Button variant="outline" className="mt-3" onClick={onDeepen}>Fördjupa analysen<ArrowRight className="h-4 w-4 ml-1" /></Button>
        </div>
      ))}

      {erp && erp.reasons.length > 0 && (
        <div>
          <button type="button" onClick={() => setWhy((v) => !v)} aria-expanded={why}
            className="flex items-center gap-2 text-left font-semibold text-foreground underline-offset-4 hover:underline">
            Varför bedömer vi affärssystemet så här?
            <ChevronDown className={`h-4 w-4 transition-transform ${why ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {why && (
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground">{erp.reasons.map((t) => <li key={t}>{t}</li>)}</ul>
          )}
        </div>
      )}

      {svc && (
        <div>
          <button type="button" onClick={() => setWhySvc((v) => !v)} aria-expanded={whySvc}
            className="flex items-center gap-2 text-left font-semibold text-foreground underline-offset-4 hover:underline">
            Varför bedömer vi service och kunddialog så här?
            <ChevronDown className={`h-4 w-4 transition-transform ${whySvc ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {whySvc && (
            <div className="mt-3 text-sm text-muted-foreground">
              <p>Tydlighet: <span className="font-medium text-foreground">{CLARITY[svc.clarity]}</span></p>
              {svcReasons.length > 0
                ? <ul className="mt-2 list-disc pl-5 space-y-1">{svcReasons.map((t) => <li key={t}>{t}</li>)}</ul>
                : <p className="mt-2">Era svar ger ännu inga tydliga behov inom service och kunddialog.</p>}
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground">Era svar</h2>
        <dl className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          {answers.map((a) => (
            <div key={a.index} className="flex items-start justify-between gap-3 p-3">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{a.question}</dt>
                <dd className="text-sm text-foreground">{a.answer}</dd>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEdit(a.index)} aria-label={`Ändra svar: ${a.question}`}>
                <Pencil className="h-3.5 w-3.5 mr-1" />Ändra
              </Button>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
      <Button variant="ghost" onClick={onRestart}><RotateCcw className="h-4 w-4 mr-1" />Börja om</Button>
    </section>
  );
}
