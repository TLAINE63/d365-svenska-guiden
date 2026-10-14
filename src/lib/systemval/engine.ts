// Dialogmotor för "Vi står inför ett systemval" (Sprint 1).
// Deterministisk: samma svar + konfigurationsversion ger samma väg.
// Ingen produktbedömning görs här.

import {
  CONFIG_VERSION,
  MAX_QUESTIONS,
  MODULES,
  PROBLEM_OPTIONS,
  QUESTIONS,
  type DialogContext,
  type EntryKey,
  type NeedArea,
  type NeedModule,
  type Option,
  type ProductKey,
  type Question,
} from "./config";

export interface HistoryEvent {
  questionId: string;
  values: string[];
  at: number;
}

/** Persistenta indata. Allt annat härleds. */
export interface DialogInput {
  version: string;
  /** Senaste svar per fråga (även för frågor som blivit irrelevanta). */
  answers: Record<string, string[]>;
  /** Alla interaktioner, påverkar aldrig budgeten. */
  interactionHistory: HistoryEvent[];
  /** Endast för test/debug: tvinga fram gemensamma frågor. */
  debugRequestCommon?: string[];
}

/** Förberedd struktur för framtida resultatmotor. Fylls inte i Sprint 1. */
export interface FutureResult {
  needsInterpretation: string | null;
  mainTrack: string[];
  alternatives: string[];
  complements: string[];
  laterPhase: string[];
  openQuestions: string[];
  recommendedNextStep: string | null;
}

export interface DialogState {
  version: string;
  entry?: EntryKey;
  needs: NeedArea[];
  primaryNeed?: NeedArea;
  secondaryNeeds: NeedArea[];
  prioritySetting?: "primary" | "equal" | "unknown";
  productStart?: ProductKey | "unsure";
  problems: string[];
  activeAnswers: Record<string, string[]>;
  inactiveAnswers: Record<string, string[]>;
  /** Frågor på aktuell giltig väg, i ordning (inkl. startvalet). */
  path: string[];
  currentPathQuestionCount: number;
  nextQuestionId: string | null;
  budgetReached: boolean;
  activeModules: string[];
  interactionHistory: HistoryEvent[];
  result: FutureResult;
}

export const emptyInput = (): DialogInput => ({ version: CONFIG_VERSION, answers: {}, interactionHistory: [] });

function allQuestions(modules: NeedModule[]): Question[] {
  return [...QUESTIONS, ...modules.flatMap((m) => m.questions)];
}

export function resolveOptions(q: Question, ctx: DialogContext): Option[] {
  return typeof q.options === "function" ? q.options(ctx) : q.options;
}

/** Bygg kontext enbart från svar på aktuell väg. */
function buildContext(known: Record<string, string[]>, modules: NeedModule[], debugCommon: string[]): DialogContext {
  const entry = known.entry?.[0] as EntryKey | undefined;
  const productStart = known.product_start?.[0] as DialogContext["productStart"];
  const problems = (known.problems ?? []).filter((p) => p !== "unsure");

  const needs: NeedArea[] = [];
  const add = (n: NeedArea) => { if (!needs.includes(n)) needs.push(n); };
  for (const p of problems) PROBLEM_OPTIONS.find((o) => o.id === p)?.needs?.forEach(add);
  for (const n of known.needs_areas ?? []) if (n !== "unknown") add(n as NeedArea);

  const pr = known.priority?.[0];
  const prioritySetting: DialogContext["prioritySetting"] =
    pr === undefined ? undefined : pr === "equal" ? "equal" : pr === "unknown" ? "unknown" : "primary";
  const primaryNeed = prioritySetting === "primary" && needs.includes(pr as NeedArea) ? (pr as NeedArea) : undefined;

  const ctx: DialogContext = {
    entry, needs, primaryNeed, prioritySetting, productStart, problems,
    answers: known,
    requestedCommon: new Set(debugCommon),
  };
  for (const m of modules) if (m.activeIf(ctx)) m.requestsCommon?.(ctx).forEach((q) => ctx.requestedCommon.add(q));
  return ctx;
}

/** Ett svar är giltigt om det fortfarande matchar frågans aktuella alternativ. */
function validAnswer(q: Question, values: string[] | undefined, ctx: DialogContext): boolean {
  if (!values || values.length === 0) return false;
  const ids = new Set(resolveOptions(q, ctx).map((o) => o.id));
  if (!values.every((v) => ids.has(v))) return false;
  return q.type === "multi" || values.length === 1;
}

export function deriveState(input: DialogInput, modules: NeedModule[] = MODULES): DialogState {
  const debugCommon = input.debugRequestCommon ?? [];
  const known: Record<string, string[]> = {};
  const path: string[] = [];
  let ctx = buildContext(known, modules, debugCommon);
  let next: string | null = null;
  let count = 0;
  let budgetReached = false;

  const order = allQuestions(modules);
  // Iterativ routing: välj nästa relevanta fråga utifrån det som är känt hittills.
  for (let guard = 0; guard < 50; guard++) {
    const activeMods = modules.filter((m) => m.activeIf(ctx));
    const pool = [...QUESTIONS, ...activeMods.flatMap((m) => m.questions)];
    const candidates = pool
      .filter((q) => !path.includes(q.id) && q.showIf(ctx) && !(q.skipIf?.(ctx)))
      .sort((a, b) => a.priority - b.priority || order.indexOf(a) - order.indexOf(b));
    const q = candidates[0];
    if (!q) break;
    if (q.countsTowardBudget && count >= MAX_QUESTIONS) { budgetReached = true; break; }
    const ans = input.answers[q.id];
    if (!validAnswer(q, ans, ctx)) { next = q.id; break; }
    path.push(q.id);
    if (q.countsTowardBudget) count++;
    known[q.id] = ans!;
    ctx = buildContext(known, modules, debugCommon);
  }

  const inactive: Record<string, string[]> = {};
  for (const [id, v] of Object.entries(input.answers)) if (!(id in known)) inactive[id] = v;

  return {
    version: input.version,
    entry: ctx.entry,
    needs: ctx.needs,
    primaryNeed: ctx.primaryNeed,
    secondaryNeeds: ctx.primaryNeed ? ctx.needs.filter((n) => n !== ctx.primaryNeed) : [],
    prioritySetting: ctx.prioritySetting,
    productStart: ctx.productStart,
    problems: ctx.problems,
    activeAnswers: known,
    inactiveAnswers: inactive,
    path,
    currentPathQuestionCount: count,
    nextQuestionId: next,
    budgetReached,
    activeModules: modules.filter((m) => m.activeIf(ctx)).map((m) => m.id),
    interactionHistory: input.interactionHistory,
    result: { needsInterpretation: null, mainTrack: [], alternatives: [], complements: [], laterPhase: [], openQuestions: [], recommendedNextStep: null },
  };
}

/** Kontext för att rendera en fråga på given position (svar före den på vägen). */
export function contextFor(input: DialogInput, questionId: string, modules: NeedModule[] = MODULES): DialogContext {
  const state = deriveState(input, modules);
  const known: Record<string, string[]> = {};
  for (const id of state.path) { if (id === questionId) break; known[id] = state.activeAnswers[id]; }
  return buildContext(known, modules, input.debugRequestCommon ?? []);
}

export function answer(input: DialogInput, questionId: string, values: string[]): DialogInput {
  return {
    ...input,
    answers: { ...input.answers, [questionId]: values },
    interactionHistory: [...input.interactionHistory, { questionId, values, at: Date.now() }],
  };
}

/** Flervalslogik: exklusiva alternativ avmarkerar övriga och tvärtom. */
export function toggleMulti(current: string[], option: Option, options: Option[]): string[] {
  if (current.includes(option.id)) return current.filter((v) => v !== option.id);
  if (option.exclusive) return [option.id];
  const exclusive = new Set(options.filter((o) => o.exclusive).map((o) => o.id));
  return [...current.filter((v) => !exclusive.has(v)), option.id];
}

export function getQuestion(id: string, modules: NeedModule[] = MODULES): Question | undefined {
  return allQuestions(modules).find((q) => q.id === id);
}
