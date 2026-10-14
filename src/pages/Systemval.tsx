import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { CONFIG_VERSION, MAX_QUESTIONS } from "@/lib/systemval/config";
import { answer, contextFor, deriveState, emptyInput, getQuestion, resolveOptions, resolveText, toggleMulti, type DialogInput } from "@/lib/systemval/engine";
import type { ErpResult } from "@/lib/systemval/modules/erp";
import SolutionResultView, { type AnswerSummaryItem } from "@/components/systemval/SolutionResultView";
import { buildSolutionPicture } from "@/lib/systemval/solutions";
import { trackSystemval } from "@/lib/systemval/analytics";

const STORAGE_KEY = "d365_systemval_v1";

const load = (): DialogInput => {
  if (typeof window === "undefined") return emptyInput();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as DialogInput) : null;
    return parsed && parsed.version === CONFIG_VERSION ? parsed : emptyInput();
  } catch { return emptyInput(); }
};

const debugAllowed = () =>
  import.meta.env.DEV ||
  (typeof window !== "undefined" && /localhost|id-preview--|lovableproject\.com/.test(window.location.hostname));


export default function Systemval() {
  const [params] = useSearchParams();
  const [input, setInput] = useState<DialogInput>(emptyInput);
  const [cursor, setCursor] = useState(0);
  const [draft, setDraft] = useState<string[]>([]);
  const [debug, setDebug] = useState(false);

  useEffect(() => { const i = load(); setInput(i); setCursor(deriveState(i).path.length); }, []);
  useEffect(() => { setDebug(debugAllowed() && params.get("debug") === "1"); }, [params]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(input)); } catch { /* ignore */ } }, [input]);

  const state = useMemo(() => deriveState(input), [input]);
  const pos = Math.min(cursor, state.path.length);
  const questionId = pos < state.path.length ? state.path[pos] : state.nextQuestionId;
  const question = questionId ? getQuestion(questionId) : undefined;
  const ctx = useMemo(() => (questionId ? contextFor(input, questionId) : null), [input, questionId]);
  const options = question && ctx ? resolveOptions(question, ctx) : [];

  useEffect(() => {
    setDraft(questionId ? input.answers[questionId] ?? [] : []);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [questionId, pos]); // eslint-disable-line react-hooks/exhaustive-deps

  const erp = state.moduleResults.erp as ErpResult | undefined;
  const picture = useMemo(() => (question ? null : buildSolutionPicture(state, erp)), [question, state, erp]);
  const summary: AnswerSummaryItem[] = useMemo(() => state.path.map((id, index) => {
    const q = getQuestion(id);
    if (!q) return null;
    const c = contextFor(input, id);
    const opts = resolveOptions(q, c);
    const vals = state.activeAnswers[id] ?? [];
    return { index, question: resolveText(q, c), answer: vals.map((v) => opts.find((o) => o.id === v)?.label ?? v).join(", ") };
  }).filter(Boolean) as AnswerSummaryItem[], [state, input]);
  useEffect(() => {
    if (picture) trackSystemval("solution_result_shown", { primary: picture.primary.map((p) => p.id).join(","), next: picture.nextStep.kind });
  }, [picture?.nextStep.kind, picture?.primary.map((p) => p.id).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
  const tracked = useRef({ started: false, shown: "", result: "" });
  useEffect(() => {
    if (erp && !tracked.current.started) { tracked.current.started = true; trackSystemval("erp_module_started"); }
    if (question?.module === "erp" && tracked.current.shown !== question.id) {
      tracked.current.shown = question.id; trackSystemval("erp_question_shown", { question: question.id });
    }
    if (!question && erp) {
      const key = `${erp.preliminaryOutcome}:${erp.clarity}`;
      if (tracked.current.result !== key) {
        tracked.current.result = key;
        trackSystemval("erp_dialog_completed", { questions: state.currentPathQuestionCount });
        trackSystemval("erp_result_shown", { outcome: erp.preliminaryOutcome, clarity: erp.clarity });
      }
    }
  }, [erp, question, state.currentPathQuestionCount]);

  const commit = (values: string[]) => {
    if (!questionId) return;
    const prev = input.answers[questionId];
    if (prev && prev.join() !== values.join()) trackSystemval("answer_changed", { question: questionId });
    if (question?.module === "erp") trackSystemval("erp_question_answered", { question: questionId });
    setInput((prev) => answer(prev, questionId, values));
    setCursor(pos + 1);
  };
  const back = () => setCursor(Math.max(0, pos - 1));
  const restart = () => { setInput(emptyInput()); setCursor(0); };

  const isEntry = questionId === "entry";
  const shownNumber = state.path.slice(0, pos).filter((id) => getQuestion(id)?.countsTowardBudget).length + 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Vi står inför ett systemval | Behovsguide | d365.se"
        description="Ett kort första samtal om era behov inför ett systemval med Dynamics 365."
        canonicalPath="/kom-igang/systemval/"
        noIndex
      />
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto w-full max-w-2xl px-4">
          <p className="text-sm font-medium text-accent mb-2">Vi står inför ett systemval</p>

          {question && (
            <section aria-labelledby="q-title">
              {!isEntry && (
                <p className="text-xs text-muted-foreground mb-2">
                  Fråga {shownNumber} · {question.type === "multi" ? "Välj ett eller flera alternativ" : "Välj ett alternativ"}
                </p>
              )}
              <h1 id="q-title" className="text-2xl sm:text-3xl font-semibold text-foreground text-balance mb-2">
                {ctx ? resolveText(question, ctx) : ""}
              </h1>
              {question.help && <p className="text-muted-foreground mb-4">{question.help}</p>}

              <div role={question.type === "multi" ? "group" : "radiogroup"} aria-labelledby="q-title" className="mt-5 grid gap-3">
                {options.map((o) => {
                  const selected = draft.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role={question.type === "multi" ? "checkbox" : "radio"}
                      aria-checked={selected}
                      onClick={() => {
                        if (question.type === "single") { setDraft([o.id]); commit([o.id]); }
                        else setDraft((d) => toggleMulti(d, o, options));
                      }}
                      className={`w-full text-left rounded-xl border p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="flex items-start gap-3">
                        <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${question.type === "multi" ? "rounded" : "rounded-full"} ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span>
                          <span className="block font-medium text-foreground">{o.label}</span>
                          {o.desc && <span className="block text-sm text-muted-foreground mt-0.5">{o.desc}</span>}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {pos > 0 && (
                  <Button variant="outline" onClick={back}><ArrowLeft className="h-4 w-4 mr-1" />Tillbaka</Button>
                )}
                {question.type === "multi" && (
                  <Button onClick={() => commit(draft)} disabled={draft.length === 0}>Fortsätt</Button>
                )}
                {pos > 0 && (
                  <Button variant="ghost" onClick={restart}><RotateCcw className="h-4 w-4 mr-1" />Börja om</Button>
                )}
              </div>
            </section>
          )}

          {!question && picture && (
            <SolutionResultView
              picture={picture}
              erp={erp}
              answers={summary}
              onEdit={(i) => setCursor(i)}
              onRestart={restart}
              onNextStep={(kind) => trackSystemval("next_step_clicked", { kind })}
            />
          )}

          {debug && (
            <aside className="mt-10 rounded-lg border border-dashed border-border bg-muted p-4 text-xs font-mono text-foreground overflow-x-auto">
              <p className="font-semibold mb-2">DEBUG (endast test, ingen rådgivning) · {CONFIG_VERSION}</p>
              <label className="flex items-center gap-2 mb-2 font-sans">
                <input
                  type="checkbox"
                  checked={input.debugRequestCommon?.includes("change_intent") ?? false}
                  onChange={(e) => setInput((p) => ({ ...p, debugRequestCommon: e.target.checked ? ["change_intent"] : [] }))}
                />
                Simulera att en modul begär förändringsavsikt
              </label>
              <pre className="whitespace-pre-wrap">{JSON.stringify({
                entry: state.entry,
                needs: state.needs,
                primaryNeed: state.primaryNeed,
                secondaryNeeds: state.secondaryNeeds,
                prioritySetting: state.prioritySetting,
                productStart: state.productStart,
                problems: state.problems,
                activeAnswers: state.activeAnswers,
                inactiveAnswers: state.inactiveAnswers,
                path: state.path,
                cursor: pos,
                currentPathQuestionCount: `${state.currentPathQuestionCount}/${MAX_QUESTIONS}`,
                nextQuestionId: state.nextQuestionId,
                budgetReached: state.budgetReached,
                activeModules: state.activeModules,
                nextReason: state.nextReason,
                interactionHistory: state.interactionHistory.length,
                erp: erp ? {
                  activated: erp.activated, activationReason: erp.activationReason, processNeeds: erp.processNeeds,
                  financialComplexity: erp.financialComplexity, warehouseNeeds: erp.warehouseNeeds, logisticsNeeds: erp.logisticsNeeds,
                  productionNeeds: erp.productionNeeds, companyStructure: erp.companyStructure, currentSystem: erp.currentSystem,
                  changeIntent: erp.changeIntent, bcSignals: erp.bcSignals, financeSignals: erp.financeSignals, scmSignals: erp.scmSignals,
                  comparisonSignals: erp.comparisonSignals, uncertainties: erp.uncertainties,
                  unansweredDecisiveQuestions: erp.unansweredDecisiveQuestions, projectOperationsSignal: erp.projectOperationsSignal,
                  existingSolutionInvestigation: erp.existingSolutionInvestigation, activatedRules: erp.activatedRules,
                  preliminaryOutcome: erp.preliminaryOutcome, fscmDriver: erp.fscmDriver, clarity: erp.clarity, rulesVersion: erp.rulesVersion,
                } : "ERP-modulen inte aktiverad",
                solutions: picture ? { primary: picture.primary.map((p) => p.id), complementary: picture.complementary.map((p) => p.id), investigate: picture.investigate.map((p) => p.id), addOn: picture.addOn, nextStep: picture.nextStep.kind, signals: picture.signals.map((x) => `${x.id}:${x.kind}:${x.weight}`) } : null,
              }, null, 2)}</pre>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
