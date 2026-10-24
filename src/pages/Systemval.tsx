import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { CONFIG_VERSION, MAX_QUESTIONS } from "@/lib/systemval/config";
import { answer, contextFor, deriveState, emptyInput, getQuestion, resolveOptions, resolveText, toggleMulti, type DialogInput } from "@/lib/systemval/engine";
import type { ErpResult } from "@/lib/systemval/modules/erp";
import type { SvcResult } from "@/lib/systemval/modules/service";
import SolutionResultView, { type AnswerSummaryItem } from "@/components/systemval/SolutionResultView";
import { buildSolutionPicture } from "@/lib/systemval/solutions";
import { buildSolutionMap } from "@/lib/systemval/solutionMap";
import { buildSystemvalResult, CLARITY_LABEL, type Cta } from "@/lib/systemval/result";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import { ADVISORY_CTA } from "@/lib/advisory";
import { savePlanSolution } from "@/lib/d365Plan";
import type { PoResult } from "@/lib/systemval/modules/projectOperations";
import DeepDialog from "@/components/systemval/DeepDialog";
import DeepResultSection from "@/components/systemval/DeepResultSection";
import { DEEP_VERSION, deriveDeep, evaluateDeep } from "@/lib/systemval/deep";
import { trackSystemval } from "@/lib/systemval/analytics";
import { clearSystemvalContext, saveSystemvalContext, toSystemvalContext } from "@/lib/systemvalHandoff";

const STORAGE_KEY = "d365_systemval_v1";
const DEEP_KEY = "d365_systemval_deep_v1";
const HANDOVER_KEY = "d365_systemval_handover_v1";
const loadDeep = (): Record<string, string[]> => {
  try { const p = JSON.parse(localStorage.getItem(DEEP_KEY) ?? "null"); return p?.version === DEEP_VERSION ? p.answers : {}; } catch { return {}; }
};

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
  const [deepAnswers, setDeepAnswers] = useState<Record<string, string[]>>({});
  const [deepMode, setDeepMode] = useState<null | { startAt?: number }>(null);
  useEffect(() => { setDeepAnswers(loadDeep()); }, []);
  useEffect(() => { try { localStorage.setItem(DEEP_KEY, JSON.stringify({ version: DEEP_VERSION, answers: deepAnswers })); } catch { /* ignore */ } }, [deepAnswers]);

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
  const svc = state.moduleResults.service as SvcResult | undefined;
  const picture = useMemo(() => (question ? null : buildSolutionPicture(state, erp)), [question, state, erp]);
  const solutionMap = useMemo(() => (picture ? buildSolutionMap(state, picture) : null), [picture, state]);
  const result = useMemo(() => (picture && solutionMap ? buildSystemvalResult(state, picture, solutionMap) : null), [picture, solutionMap, state]);
  const fromResult = useRef(false);
  const po = state.moduleResults.projects as PoResult | undefined;
  const summary: AnswerSummaryItem[] = useMemo(() => state.path.map((id, index) => {
    const q = getQuestion(id);
    if (!q) return null;
    const c = contextFor(input, id);
    const opts = resolveOptions(q, c);
    const vals = state.activeAnswers[id] ?? [];
    return { index, question: resolveText(q, c), answer: vals.map((v) => opts.find((o) => o.id === v)?.label ?? v).join(", ") };
  }).filter(Boolean) as AnswerSummaryItem[], [state, input]);
  const resultKey = result ? `${result.clarity}|${result.primaryTracks.map((t) => t.id).join(",")}|${result.primaryCTA.kind}` : "";
  useEffect(() => {
    if (!result) return;
    // Endast id:n och enumvärden, inga svarskombinationer eller personuppgifter.
    trackSystemval("solution_result_shown", { clarity: result.clarity, primary: result.primaryTracks.map((t) => t.id).join(","), cta: result.primaryCTA.kind,
      alternatives: result.alternativeTracks.length, complements: result.complementaryTracks.length, later: result.laterPhaseTracks.length });
  }, [resultKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const onCta = (c: Cta, primary: boolean) => {
    trackSystemval(primary ? "primary_cta_clicked" : "secondary_cta_clicked", { kind: c.kind, destination: c.destinationId });
    if (c.kind === "partners") trackSystemval("partner_selection_started");
    if (c.transfer && result) {
      // Överför endast nödvändig sammanfattning till den lokala D365-planen.
      savePlanSolution({
        areaLabel: result.primaryTracks.map((t) => t.label).join(" och ") || "Systemval",
        knownProduct: result.selectedStartingPoint?.label,
        insufficient: result.clarity === "limited",
        primary: result.primaryTracks[0] ? { label: result.primaryTracks[0].label, reason: result.primaryTracks[0].why[0] ?? "" } : undefined,
        complements: [...result.complementaryTracks.map((x) => ({ label: x.label, reason: x.need })), ...result.alternativeTracks.map((a) => ({ label: a.labels.join(" eller "), reason: "Alternativ att jämföra" }))],
        explore: [], openQuestions: result.unresolvedQuestions, nextSteps: [],
      }, state.needs);
      trackSystemval("plan_started");
    }
  };
  const deepState = useMemo(() => (picture ? deriveDeep(picture, state, deepAnswers) : null), [picture, state, deepAnswers]);
  const deepResult = useMemo(() => (picture && deepState && !deepState.next && deepState.path.length ? evaluateDeep(picture, state, erp, deepState.answers) : null), [picture, deepState, state, erp]);
  useEffect(() => { if (deepResult) { try { localStorage.setItem(HANDOVER_KEY, JSON.stringify(deepResult.handover)); } catch { /* ignore */ } } }, [deepResult]);
  // Kort sammanfattning till produktsidor och kalkylatorer (inga svarskombinationer).
  useEffect(() => { if (result) saveSystemvalContext(toSystemvalContext(result, deepResult?.handover ?? null)); }, [resultKey, deepResult]); // eslint-disable-line react-hooks/exhaustive-deps
  const tracked = useRef({ started: false, guide: false, shown: "", result: "" });
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
    if (!tracked.current.guide) { tracked.current.guide = true; trackSystemval("guide_started"); }
    const prev = input.answers[questionId];
    if (prev && prev.join() !== values.join()) trackSystemval("answer_changed", { question: questionId });
    if (question?.module === "erp") trackSystemval("erp_question_answered", { question: questionId });
    const nextInput = answer(input, questionId, values);
    setInput(nextInput);
    if (fromResult.current) {
      // Ändrat svar från resultatet: hoppa till nästa obesvarade fråga eller tillbaka till omräknat resultat.
      fromResult.current = false;
      trackSystemval("answer_changed_from_result", { question: questionId });
      setCursor(deriveState(nextInput).path.length);
    } else setCursor(pos + 1);
  };
  const back = () => setCursor(Math.max(0, pos - 1));
  const restart = () => { setInput(emptyInput()); setCursor(0); setDeepAnswers({}); setDeepMode(null); clearSystemvalContext(); };

  const isEntry = questionId === "entry";
  const shownNumber = state.path.slice(0, pos).filter((id) => getQuestion(id)?.countsTowardBudget).length + 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Vi står inför ett systemval | Behovsguide | d365.se"
        description="Ett kort första samtal om era behov inför ett systemval med Dynamics 365."
        canonicalPath="/kom-igang/"
      />
      <Navbar />
      <main className="flex-1 pt-32 sm:pt-36 pb-16">
        <div className={`mx-auto w-full px-4 sm:px-6 ${question && options.length > 4 ? "max-w-5xl" : "max-w-3xl"}`}>
          <p className="text-sm font-medium text-accent mb-2">Vi står inför ett systemval</p>

          {question && (
            <section aria-labelledby="q-title">
              {!isEntry && (
                <p className="text-xs text-muted-foreground mb-2">
                  Fråga {shownNumber} · {question.type === "multi" ? "Välj ett eller flera alternativ" : "Välj ett alternativ"}
                </p>
              )}
              <h1 id="q-title" className="text-2xl sm:text-[28px] font-semibold text-foreground text-balance mb-1">
                {ctx ? resolveText(question, ctx) : ""}
              </h1>
              {question.help && <p className="text-muted-foreground mb-4">{question.help}</p>}

              <div role={question.type === "multi" ? "group" : "radiogroup"} aria-labelledby="q-title" className={`mt-4 grid gap-2.5 ${options.length > 4 ? "sm:grid-cols-2" : ""}`}>
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
                      className={`w-full text-left rounded-xl border px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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

          {!question && picture && deepMode && (
            <DeepDialog
              picture={picture}
              state={state}
              answers={deepAnswers}
              startAt={deepMode.startAt}
              onAnswer={(id, v) => setDeepAnswers((p) => ({ ...p, [id]: v }))}
              onExit={() => setDeepMode(null)}
              onDone={() => { setDeepMode(null); trackSystemval("deep_completed"); }}
            />
          )}

          {!question && picture && result && !deepMode && (
            <SolutionResultView
              onDeepen={() => { trackSystemval("deep_started"); setDeepMode({}); }}
              deepSlot={deepResult ? <DeepResultSection result={deepResult} onEdit={() => setDeepMode({ startAt: 0 })} onNextStep={(kind) => trackSystemval("next_step_clicked", { kind, deep: true })} /> : undefined}
              picture={picture}
              result={result!}
              onCta={onCta}
              onWhyOpened={() => trackSystemval("why_opened")}
              erp={erp}
              answers={summary}
              onEdit={(i) => { fromResult.current = true; setCursor(i); }}
              onRestart={restart}
            />
          )}

          {!question && picture && result && !deepMode && (
            <AdvisoryOffer
              className="mt-10"
              variant="inline"
              placement="needs_guide"
              pageType="tool"
              cta={ADVISORY_CTA.needs_guide}
              heading={result.clarity === "clear" ? "Vill ni pröva bedömningen innan ni går vidare?" : "Vill ni ha hjälp att tolka resultatet?"}
              text="Gå igenom behovsanalysen med en rådgivare på köparens sida. Ni får hjälp att väga alternativen och reda ut de öppna frågorna, utan att någon partner deltar."
              sections={[
                { key: "behovsguide_resultat", label: "Resultat från behovsguiden", lines: [
                  `Bedömning: ${CLARITY_LABEL[result.clarity]}`,
                  ...result.primaryTracks.map((t) => `Huvudspår: ${t.label}`),
                  ...result.alternativeTracks.map((x) => `Alternativ: ${x.labels.join(" eller ")}`),
                  ...result.complementaryTracks.map((x) => `Komplettering: ${x.label}`),
                  ...(result.selectedStartingPoint ? [`Utgångspunkt: ${result.selectedStartingPoint.label}`] : []),
                ] },
                ...(result.unresolvedQuestions.length ? [{ key: "behovsguide_oppna", label: "Öppna frågor", lines: result.unresolvedQuestions.slice(0, 5) }] : []),
              ]}
              metadata={{ clarity: result.clarity, primary: result.primaryTracks.map((t) => t.id).join(",") }}
            />
          )}

          {!deepMode && (
            <aside aria-labelledby="nasta-steg-partner" className="mt-12 flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p id="nasta-steg-partner" className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent mb-1">Nästa steg</p>
                <p className="text-sm sm:text-[15px] leading-relaxed text-foreground">
                  Söker ni en partner för rådgivning eller införande? Hitta och jämför i vår partnerväljare.
                </p>
              </div>
              <Button asChild variant="outline" className="min-h-11 shrink-0">
                <Link to="/valjdynamics365partner/" onClick={() => trackSystemval("next_step_clicked", { kind: "partner_selector_box" })}>
                  <span>Hitta <span className="whitespace-nowrap">Dynamics&nbsp;365-partner</span></span>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </aside>
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
                service: svc ? {
                  customerServiceSignals: svc.customerServiceSignals, contactCenterSignals: svc.contactCenterSignals,
                  fieldServiceSignals: svc.fieldServiceSignals, integrationSignals: svc.integrationSignals,
                  combinationSignals: svc.combinationSignals, uncertainties: svc.uncertainties, activatedRules: svc.activatedRules,
                  nextQuestion: state.nextQuestionId, reasonForNextQuestion: state.nextReason,
                  preliminaryOutcome: svc.preliminaryOutcome, clarity: svc.clarity, rulesVersion: svc.rulesVersion,
                } : "Servicemodulen inte aktiverad",
                deep: deepState ? { path: deepState.path, next: deepState.next, handover: deepResult?.handover ?? null } : null,
                projects: po ? { projectOperationsSignals: po.projectOperationsSignals.map((x) => x.rule), projectLifecycleSignals: po.projectLifecycleSignals.map((x) => x.rule), resourcePlanningSignals: po.resourcePlanningSignals.map((x) => x.rule), projectErpOverlap: po.projectErpOverlap, projectSalesDependency: po.projectSalesDependency, keepExistingTool: po.keepExistingTool, preliminaryOutcome: po.preliminaryOutcome, rulesVersion: po.rulesVersion } : "Project Operations-modulen inte aktiverad",
                solutionMap: solutionMap?.debug ?? null,
                result: result?.debug ?? null,
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
