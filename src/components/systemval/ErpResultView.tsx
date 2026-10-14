import { useState } from "react";
import { ArrowLeft, ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ErpResult } from "@/lib/systemval/modules/erp";
import {
  CLARITY_LABEL, DISCLAIMER, EXISTING_NOTE, PO_NOTE, PRODUCT_LABEL,
  driverLabel, interpretation, startDiffers, trackLabel,
} from "@/lib/systemval/modules/erpTexts";

interface Props { result: ErpResult; onBack: () => void; onRestart: () => void }

/** Minimal ERP-resultatvy (Sprint 2). Visar aldrig poäng eller rule_id. */
export default function ErpResultView({ result: r, onBack, onRestart }: Props) {
  const [why, setWhy] = useState(false);
  const driver = driverLabel(r);
  const start = r.selectedProductStartingPoint ? PRODUCT_LABEL[r.selectedProductStartingPoint] : null;

  return (
    <section aria-labelledby="erp-result" className="space-y-6">
      <h1 id="erp-result" className="text-2xl sm:text-3xl font-semibold text-foreground">Preliminär vägledning för ert affärssystem</h1>

      {start && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Er valda utgångspunkt</h2>
          <p className="mt-1 font-medium text-foreground">{start}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground">Så tolkar vi ert behov</h2>
        <div className="mt-2 space-y-1 text-muted-foreground">{interpretation(r).map((t) => <p key={t}>{t}</p>)}</div>
      </div>

      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Främst att utvärdera</h2>
          <span className="rounded-full border border-border bg-background px-3 py-0.5 text-xs font-medium text-foreground">{CLARITY_LABEL[r.clarity]}</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-foreground">{trackLabel(r)}</p>
        {driver && <p className="mt-1 text-sm text-muted-foreground">{driver}</p>}
        {start && startDiffers(r) && (
          <p className="mt-2 text-sm text-muted-foreground">Vår preliminära bedömning skiljer sig från er valda utgångspunkt.</p>
        )}
      </div>

      {(r.projectOperationsSignal || r.existingSolutionInvestigation) && (
        <ul className="space-y-2 text-sm text-foreground">
          {r.projectOperationsSignal && <li className="rounded-md bg-muted p-3">{PO_NOTE}</li>}
          {r.existingSolutionInvestigation && <li className="rounded-md bg-muted p-3">{EXISTING_NOTE}</li>}
        </ul>
      )}

      <div>
        <button type="button" onClick={() => setWhy((v) => !v)} aria-expanded={why}
          className="flex items-center gap-2 text-left font-semibold text-foreground underline-offset-4 hover:underline">
          Varför föreslår vi detta?
          <ChevronDown className={`h-4 w-4 transition-transform ${why ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {why && (
          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
            {r.reasons.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">{r.reasons.map((t) => <li key={t}>{t}</li>)}</ul>
            ) : <p>Ni har inte angett krav som pekar mot ett visst produktspår.</p>}
            {r.uncertainties.length > 0 && <p>Underlaget innehåller frågor som ännu är obesvarade, vilket påverkar hur säker bedömningen är.</p>}
            {start && startDiffers(r) && <p>Bedömningen utgår från de behov ni beskrivit, inte från den produkt ni valde som utgångspunkt.</p>}
          </div>
        )}
      </div>

      {r.openQuestions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Det här behöver ni utreda vidare</h2>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-foreground">{r.openQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" />Ändra svar</Button>
        <Button variant="ghost" onClick={onRestart}><RotateCcw className="h-4 w-4 mr-1" />Börja om</Button>
      </div>
    </section>
  );
}
