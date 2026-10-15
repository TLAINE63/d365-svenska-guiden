import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Pencil, RotateCcw, Puzzle, Sparkles, Scale, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SolutionPicture } from "@/lib/systemval/solutions";
import type { ErpResult } from "@/lib/systemval/modules/erp";
import { EXISTING_NOTE } from "@/lib/systemval/modules/erpTexts";
import { CLARITY_LABEL, DEP_LABEL, type Cta, type SystemvalResult } from "@/lib/systemval/result";
import { getApplicationIcon } from "@/lib/applicationLabels";

/** Produktnamn med officiell Dynamics 365-ikon. */
function ProductLabel({ label, size = "h-6 w-6" }: { label: string; size?: string }) {
  const icon = getApplicationIcon(label);
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      {icon && <img src={icon} alt="" aria-hidden className={`${size} shrink-0 object-contain`} loading="lazy" />}
      <span>{label}</span>
    </span>
  );
}

export interface AnswerSummaryItem { index: number; question: string; answer: string }

interface Props {
  picture: SolutionPicture;
  result: SystemvalResult;
  erp?: ErpResult;
  answers: AnswerSummaryItem[];
  onEdit: (index: number) => void;
  onRestart: () => void;
  onCta?: (cta: Cta, primary: boolean) => void;
  onWhyOpened?: () => void;
  onDeepen?: () => void;
  deepSlot?: ReactNode;
}

const H2 = "text-lg font-semibold text-foreground";

/** Sprint 6: slutresultat. Visar aldrig poäng, procent eller regel-id. */
export default function SolutionResultView({ picture: p, result: r, erp, answers, onEdit, onRestart, onCta, onWhyOpened, onDeepen, deepSlot }: Props) {
  const [why, setWhy] = useState(false);
  const [more, setMore] = useState(false);
  const deps = [...r.integrationDependencies, ...r.processDependencies];

  return (
    <section aria-labelledby="sol-title" className="space-y-8">
      <header>
        <p className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{CLARITY_LABEL[r.clarity]}</p>
        <h1 id="sol-title" className="mt-3 text-2xl sm:text-3xl font-semibold text-foreground text-balance">Er preliminära Dynamics&nbsp;365-väg</h1>
        <p className="mt-2 text-sm text-muted-foreground">{r.clarityText}</p>
      </header>

      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vad ni har kommit fram till</p>
        <p className="mt-1 text-foreground">
          {r.primaryTracks.length > 0
            ? <>Främst att utvärdera: <span className="font-semibold">{r.primaryTracks.map((t) => t.label).join(" och ")}</span>.</>
            : "Underlaget räcker ännu inte för att peka ut ett huvudspår."}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nästa steg</p>
        <Button asChild className="mt-2 w-full sm:w-auto">
          <Link to={r.primaryCTA.route} onClick={() => onCta?.(r.primaryCTA, true)}>{r.primaryCTA.label}<ArrowRight className="h-4 w-4 ml-1" /></Link>
        </Button>
        {r.primaryCTA.transfer && <p className="mt-2 text-xs text-muted-foreground">Er sammanfattning sparas lokalt i er webbläsare, utan kontaktuppgifter.</p>}
      </div>

      <div>
        <h2 className={H2}>Så tolkar vi ert behov</h2>
        <p className="mt-2 text-muted-foreground">{r.needsInterpretation}</p>
        {r.selectedStartingPoint && (
          <p className="mt-2 text-sm text-muted-foreground">
            Er valda utgångspunkt: <span className="font-medium text-foreground">{r.selectedStartingPoint.label}</span>
            {r.selectedStartingPoint.differs ? ". Vår preliminära bedömning skiljer sig, eftersom den utgår från de behov ni beskrivit." : ". Era svar stödjer den utgångspunkten."}
          </p>
        )}
      </div>

      {r.primaryTracks.length > 0 && (
        <div>
          <h2 className={H2}>Främst att utvärdera</h2>
          <div className={`mt-3 grid gap-4 ${r.primaryTracks.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {r.primaryTracks.map((t) => (
              <article key={t.id} className="flex flex-col rounded-xl border border-primary/40 bg-primary/5 p-5">
                <h3 className="text-lg font-semibold text-foreground text-balance"><ProductLabel label={t.label} size="h-7 w-7" /></h3>
                {t.explanation && <p className="mt-1 text-sm text-muted-foreground">{t.explanation}</p>}
                {t.why.length > 0 && (
                  <>
                    <p className="mt-3 text-sm font-medium text-foreground">Varför det framstår som relevant</p>
                    <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-muted-foreground">{t.why.map((x) => <li key={x}>{x}</li>)}</ul>
                  </>
                )}
                {t.validate && <p className="mt-3 text-sm text-muted-foreground"><span className="font-medium text-foreground">Behöver valideras: </span>{t.validate}</p>}
              </article>
            ))}
          </div>
        </div>
      )}

      {r.alternativeTracks.length > 0 && (
        <div>
          <h2 className={`${H2} flex items-center gap-2`}><Scale className="h-4 w-4 text-accent" aria-hidden />Alternativ att jämföra</h2>
          <div className="mt-3 grid gap-3">
            {r.alternativeTracks.map((a) => (
              <article key={a.labels.join("|")} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold text-foreground text-balance">
                  {a.labels.map((l, i) => (
                    <span key={l}>
                      {i > 0 && " eller "}
                      <ProductLabel label={l} />
                    </span>
                  ))}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.whyBoth}</p>
                <p className="mt-2 text-sm font-medium text-foreground">Skillnader att utreda</p>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-muted-foreground">{a.differences.map((d) => <li key={d}>{d}</li>)}</ul>
                <p className="mt-2 text-sm text-muted-foreground"><span className="font-medium text-foreground">Det som saknas för att skilja dem åt: </span>{a.missingAnswer}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {r.complementaryTracks.length > 0 && (
        <div>
          <h2 className={H2}>Kompletterande lösningar</h2>
          <div className="mt-3 grid gap-3">
            {[...r.complementaryTracks, ...(more ? r.moreTracks : [])].map((c) => (
              <article key={c.id} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold text-foreground"><ProductLabel label={c.label} /></h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.need} {c.whyNotMain} {c.timing}</p>
              </article>
            ))}
          </div>
          {r.moreTracks.length > 0 && !more && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setMore(true)}>Visa fler identifierade behov</Button>
          )}
        </div>
      )}

      {(r.laterPhaseTracks.length > 0 || r.phasingNote) && (
        <div>
          <h2 className={H2}>{r.laterPhaseTracks.length > 0 ? "Möjlig senare etapp" : "Införandeordning"}</h2>
          {r.laterPhaseTracks.map((l) => <p key={l.label} className="mt-2 text-sm text-muted-foreground">{l.text}</p>)}
          {r.phasingNote && <p className="mt-2 text-sm text-muted-foreground">{r.phasingNote}</p>}
        </div>
      )}

      {deps.length > 0 && (
        <div>
          <h2 className={`${H2} flex items-center gap-2`}><Link2 className="h-4 w-4 text-accent" aria-hidden />Viktiga samband och beroenden</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {deps.map((d) => <li key={d.key}><span className="font-medium text-foreground">{DEP_LABEL[d.kind]}: </span><span className="text-muted-foreground">{d.text}</span></li>)}
          </ul>
        </div>
      )}

      {r.unresolvedQuestions.length > 0 && (
        <div>
          <h2 className={H2}>Det här bör ni utreda vidare</h2>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-foreground">{r.unresolvedQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
          {erp?.existingSolutionInvestigation && <p className="mt-3 rounded-md bg-muted p-3 text-sm text-foreground">{EXISTING_NOTE}</p>}
        </div>
      )}

      {p.addOn && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className={`${H2} flex items-center gap-2`}><Puzzle className="h-4 w-4 text-accent" aria-hidden />Tillägg kan behöva utvärderas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Era behov inom {p.addOn.areas.join(", ")} kan innebära att standardfunktionaliteten behöver kompletteras.</p>
          <Link to="/kunskapscenter/dynamics-365-tillagg/" className="mt-2 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline">
            Så fungerar tillägg till Dynamics&nbsp;365<ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>
      )}

      {p.aiNotes.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles className="h-4 w-4 text-accent" aria-hidden />AI och Copilot inom era områden</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{p.aiNotes.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      )}

      <div className="rounded-xl border border-primary/40 bg-card p-5">
        <h2 className="text-sm font-semibold text-muted-foreground">Rekommenderat nästa steg</h2>
        <Button asChild className="mt-3 w-full sm:w-auto">
          <Link to={r.primaryCTA.route} onClick={() => onCta?.(r.primaryCTA, true)}>{r.primaryCTA.label}<ArrowRight className="h-4 w-4 ml-1" /></Link>
        </Button>
        {(r.secondaryCTAs.length > 0 || (!deepSlot && onDeepen)) && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">Andra vägar vidare</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {r.secondaryCTAs.map((c) => (
                <Link key={c.destinationId} to={c.route} onClick={() => onCta?.(c, false)} className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline">
                  {c.label}<ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              ))}
              {!deepSlot && onDeepen && (
                <button type="button" onClick={onDeepen} className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Fördjupa analysen med några frågor till<ArrowRight className="h-3.5 w-3.5 ml-1" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {deepSlot}

      {r.methodologyExplanation.length > 0 && (
        <div>
          <button type="button" onClick={() => { if (!why) onWhyOpened?.(); setWhy((v) => !v); }} aria-expanded={why} aria-controls="why-panel"
            className="flex items-center gap-2 rounded-sm text-left font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Varför föreslår vi detta?
            <ChevronDown className={`h-4 w-4 transition-transform ${why ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {why && (
            <ul id="why-panel" className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground">{r.methodologyExplanation.map((t) => <li key={t}>{t}</li>)}</ul>
          )}
        </div>
      )}

      <div>
        <h2 className={H2}>Era svar</h2>
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

      <p className="text-xs text-muted-foreground">{r.disclaimer}</p>
      <Button variant="ghost" onClick={onRestart}><RotateCcw className="h-4 w-4 mr-1" />Börja om</Button>
    </section>
  );
}
