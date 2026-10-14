import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { CONFIG_VERSION, MAX_QUESTIONS, NEED_AREAS, PRODUCTS, PROBLEM_OPTIONS } from "@/lib/systemval/config";
import { answer, contextFor, deriveState, emptyInput, getQuestion, resolveOptions, toggleMulti, type DialogInput } from "@/lib/systemval/engine";

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

const needLabel = (id: string) => NEED_AREAS.find((a) => a.id === id)?.label ?? id;

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

  const commit = (values: string[]) => {
    if (!questionId) return;
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
                {question.text}
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

          {!question && (
            <section aria-labelledby="done-title">
              <h1 id="done-title" className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">Det här har ni berättat</h1>
              <p className="text-muted-foreground mb-5">
                Det här är en sammanfattning av era svar, inte en rekommendation. Fördjupningsfrågorna för varje område läggs till stegvis.
              </p>
              <ul className="space-y-2 text-foreground">
                {state.productStart && state.productStart !== "unsure" && (
                  <li><strong>Er valda utgångspunkt:</strong> {PRODUCTS.find((p) => p.id === state.productStart)?.label}</li>
                )}
                {state.problems.length > 0 && (
                  <li><strong>Problem ni känner igen:</strong> {state.problems.map((p) => PROBLEM_OPTIONS.find((o) => o.id === p)?.label).join("; ")}</li>
                )}
                {state.needs.length > 0 && (
                  <li><strong>Områden:</strong> {state.needs.map(needLabel).join(", ")}</li>
                )}
                {state.primaryNeed && <li><strong>Viktigast att börja med:</strong> {needLabel(state.primaryNeed)}</li>}
                {state.prioritySetting === "equal" && <li><strong>Prioritering:</strong> Flera är lika viktiga</li>}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={back}><ArrowLeft className="h-4 w-4 mr-1" />Ändra svar</Button>
                <Button asChild><Link to="/kom-igang/">Fortsätt i behovsguiden</Link></Button>
                <Button variant="ghost" onClick={restart}><RotateCcw className="h-4 w-4 mr-1" />Börja om</Button>
              </div>
            </section>
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
                interactionHistory: state.interactionHistory.length,
              }, null, 2)}</pre>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
