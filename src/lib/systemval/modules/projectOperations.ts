// Project Operations-modulen (Sprint 5). Deterministisk och regelbaserad.
// Grundregler: att arbeta i projekt ≠ Project Operations, enbart projektekonomi ≠
// Project Operations, interna projekt ≠ Project Operations, avancerad resursplanering
// är en signal men aldrig ensam ett produktbeslut, befintligt projektverktyg får behållas.

import type { DialogContext, NeedModule, Option, Question } from "../config";
import { Q as EQ } from "./erp";

export const PO_RULES_VERSION = "po-rules-1.0.0";

export const PQ = {
  TYPE: "PO1_PROJEKTTYP",
  SCOPE: "PO2_PROCESS",
  RES: "PO3_RESURSER",
  SALES: "PO4_SALES",
  NOW: "PO5_NULAGE",
} as const;

const NORMAL_CEILING = 8;
const opt = (id: string, label: string, exclusive = false): Option => ({ id, label, ...(exclusive ? { exclusive } : {}) });
const a = (c: DialogContext, q: string) => c.answers[q] ?? [];
const has = (c: DialogContext, q: string, ...ids: string[]) => ids.some((id) => a(c, q).includes(id));
const answered = (c: DialogContext, q: string) => q in c.answers;
const onlyUnknown = (c: DialogContext, q: string) => a(c, q).length > 0 && a(c, q).every((v) => v === "unknown");

// ---------- Aktivering ----------

export function poActivationReasons(c: DialogContext): string[] {
  const r: string[] = [];
  if (c.needs.includes("projects")) r.push("need:projects");
  if (c.problems.includes("project_margin")) r.push("problem:project_margin");
  if (c.productStart === "po") r.push("product:po");
  // ERP-spåret: endast när projektbehovet uttryckts som mer än projektekonomi.
  if (has(c, EQ.ERP1, "projects") && has(c, EQ.ERP8, "project_advanced")) r.push("erp:project_advanced");
  return r;
}
export const poActive = (c: DialogContext) => poActivationReasons(c).length > 0;
/** Sekundärt när projekt inte är huvudbehovet och aktiveringen bara kommer från ERP-spåret. */
const poFromErpOnly = (c: DialogContext) => poActivationReasons(c).every((r) => r.startsWith("erp:"));

// ---------- Frågebank ----------

const TYPE_OPTIONS: Option[] = [
  opt("consulting", "Konsult- och tjänsteprojekt"),
  opt("time_expense", "Kundprojekt med tid och utlägg"),
  opt("material", "Kundprojekt med material eller produkter"),
  opt("fixed", "Fastprisprojekt eller milstolpebaserade projekt"),
  opt("long_delivery", "Långsiktiga leveransprojekt"),
  opt("internal", "Interna projekt"),
  opt("shared_resources", "Projekt där resurser delas mellan flera uppdrag"),
  opt("finance_follow", "Främst ekonomisk projektuppföljning"),
  opt("unknown", "Vi vet inte", true),
];
const SCOPE_OPTIONS: Option[] = [
  opt("sales_quote", "Försäljning och offert"),
  opt("estimate", "Kalkyl och planering"),
  opt("staffing", "Resursbemanning"),
  opt("capacity", "Kompetens- och kapacitetsplanering"),
  opt("time", "Tid och utlägg"),
  opt("delivery", "Projektleverans"),
  opt("milestones", "Milstolpar"),
  opt("margin", "Projektmarginal och uppföljning"),
  opt("billing", "Fakturering och intäktsredovisning"),
  opt("finance_handover", "Överlämning till ekonomi"),
  opt("unknown", "Vi vet inte", true),
];
const RES_OPTIONS: Option[] = [
  opt("availability", "Tillgänglighet och kapacitet"),
  opt("skills", "Kompetens och erfarenhet"),
  opt("multi_project", "Bemanning mellan flera projekt"),
  opt("utilization", "Beläggning"),
  opt("geo", "Geografisk placering"),
  opt("subcontractors", "Underleverantörer"),
  opt("forecast", "Prognos över framtida resursbehov"),
  opt("none", "Vi har inget avancerat resursbehov", true),
  opt("unknown", "Vi vet inte", true),
];
const SALES_OPTIONS: Option[] = [
  opt("won_to_project", "Vunna affärer ska övergå till projekt"),
  opt("quote_estimate", "Offert och projektkalkyl behöver hänga ihop"),
  opt("sales_sees_status", "Säljare behöver se projektstatus och lönsamhet"),
  opt("project_needs_sales", "Projektorganisationen behöver information från säljprocessen"),
  opt("separate", "Processerna kan hanteras separat", true),
  opt("unknown", "Vi vet inte", true),
];
const NOW_OPTIONS: Option[] = [
  opt("erp", "I vårt affärssystem"),
  opt("crm", "I vårt CRM-system"),
  opt("separate_tool", "I ett separat projekt- eller resursplaneringssystem"),
  opt("several", "I flera olika verktyg"),
  opt("excel", "Främst i Excel"),
  opt("manual", "Manuellt"),
  opt("unknown", "Vi vet inte", true),
];

// ---------- Signaler ----------

export type PoSignalKind = "lifecycle" | "resource" | "finance" | "internal" | "sales_dependency" | "context";
export interface PoSignal { kind: PoSignalKind; rule: string; strength: "supporting" | "relevant" | "strong"; reason: string }

const CUSTOMER_TYPES = ["consulting", "time_expense", "material", "fixed", "long_delivery", "shared_resources"];
const FINANCE_SCOPE = ["time", "margin", "billing", "finance_handover"];

function signals(c: DialogContext): PoSignal[] {
  const s: PoSignal[] = [];
  const add = (kind: PoSignalKind, rule: string, strength: PoSignal["strength"], reason: string) => s.push({ kind, rule, strength, reason });

  if (has(c, PQ.TYPE, "consulting", "time_expense", "material")) add("lifecycle", "PO1_CUSTOMER", "relevant", "Ni driver affärsdrivna kundprojekt.");
  if (has(c, PQ.TYPE, "fixed", "long_delivery")) add("lifecycle", "PO1_PRICING", "relevant", "Projekten har olika prismodeller eller långa leveranser.");
  if (has(c, PQ.TYPE, "shared_resources")) add("resource", "PO1_SHARED", "relevant", "Resurser delas mellan flera uppdrag.");
  if (has(c, PQ.TYPE, "internal")) add("internal", "PO1_INTERNAL", "supporting", "Ni driver interna projekt (skapar ingen produktsignal på egen hand).");
  if (has(c, PQ.TYPE, "finance_follow")) add("finance", "PO1_FINANCE", "supporting", "Främst ekonomisk projektuppföljning efterfrågas.");

  if (has(c, PQ.SCOPE, "sales_quote", "estimate")) add("lifecycle", "PO2_FRONT", "strong", "Försäljning, offert och projektkalkyl behöver hänga ihop med leveransen.");
  if (has(c, PQ.SCOPE, "staffing", "capacity")) add("resource", "PO2_RESOURCES", "strong", "Resursbemanning och kapacitetsplanering ingår i projektprocessen.");
  if (has(c, PQ.SCOPE, "delivery", "milestones")) add("lifecycle", "PO2_DELIVERY", "strong", "Projektleverans och milstolpar behöver styras.");
  if (has(c, PQ.SCOPE, ...FINANCE_SCOPE)) add("finance", "PO2_FINANCE", "relevant", "Tid, utlägg, marginal och fakturering behöver följas upp.");

  const adv = a(c, PQ.RES).filter((v) => !["none", "unknown"].includes(v));
  if (adv.length >= 2) add("resource", "PO3_ADVANCED", "relevant", "Resursplaneringen behöver hantera kompetens, beläggning eller bemanning över flera projekt.");
  else if (adv.length === 1) add("resource", "PO3_BASIC", "supporting", "Visst behov av resursplanering finns.");

  if (has(c, PQ.SALES, "won_to_project", "quote_estimate", "sales_sees_status", "project_needs_sales"))
    add("sales_dependency", "PO4_LINKED", "relevant", "Vunna affärer och projektleverans behöver hänga ihop.");
  if (has(c, EQ.ERP8, "project_advanced")) add("lifecycle", "ERP8_PROJECT_ADVANCED", "relevant", "Projektbehovet i affärssystemet omfattar mer än projektekonomi.");
  return s;
}

// ---------- Resultat ----------

export type PoOutcome = "po" | "erp_boundary" | "erp_scope" | "none" | "limited";
export interface PoResult {
  activationReason: string[];
  projectOperationsSignals: PoSignal[];
  projectLifecycleSignals: PoSignal[];
  resourcePlanningSignals: PoSignal[];
  /** Projektbehovet kan helt eller delvis ligga i affärssystemet. */
  projectErpOverlap: boolean;
  projectSalesDependency: boolean;
  keepExistingTool: boolean;
  customerProjects: boolean;
  internalOnly: boolean;
  financeOnly: boolean;
  /** Antal delar av projektlivscykeln (front, resurser, leverans, ekonomi). */
  lifecycleBreadth: number;
  uncertainties: string[];
  openQuestions: string[];
  activatedRules: string[];
  reasons: string[];
  preliminaryOutcome: PoOutcome;
  clarity: "clear" | "multiple" | "limited";
  selectedProductStartingPoint: "po" | null;
  rulesVersion: string;
}

export const PO_BOUNDARY_TEXT = "Utred om projektbehovet kan hanteras inom ERP-lösningen eller om Project Operations behöver utvärderas som ett separat spår.";

export function evaluateProjectOperations(c: DialogContext): PoResult {
  const sig = signals(c);
  const types = a(c, PQ.TYPE).filter((v) => v !== "unknown");
  const customerProjects = types.some((t) => CUSTOMER_TYPES.includes(t)) || has(c, EQ.ERP8, "project_advanced");
  const internalOnly = types.length > 0 && types.every((t) => t === "internal");
  const scope = a(c, PQ.SCOPE).filter((v) => v !== "unknown");
  const groups = {
    front: has(c, PQ.SCOPE, "sales_quote", "estimate"),
    resource: has(c, PQ.SCOPE, "staffing", "capacity") || sig.some((x) => x.rule === "PO3_ADVANCED"),
    delivery: has(c, PQ.SCOPE, "delivery", "milestones"),
    finance: has(c, PQ.SCOPE, ...FINANCE_SCOPE),
  };
  const breadth = Object.values(groups).filter(Boolean).length;
  const operational = [groups.front, groups.resource, groups.delivery].filter(Boolean).length;
  const financeOnly = (types.length > 0 && types.every((t) => t === "finance_follow" || t === "internal") && !types.every((t) => t === "internal"))
    || (scope.length > 0 && scope.every((v) => FINANCE_SCOPE.includes(v)));
  const erpInPlay = c.needs.some((n) => ["erp", "supply_chain", "production"].includes(n)) || answered(c, EQ.ERP1);
  const now = a(c, PQ.NOW)[0];
  const intent = c.answers.change_intent?.[0];
  const keepExistingTool = now === "separate_tool" && intent !== "replace" && intent !== "consolidate";
  const projectSalesDependency = sig.some((x) => x.kind === "sales_dependency");

  const unknownMain = onlyUnknown(c, PQ.TYPE) || (!answered(c, PQ.TYPE) && !has(c, EQ.ERP8, "project_advanced"));
  let outcome: PoOutcome;
  if (unknownMain && !answered(c, PQ.SCOPE)) outcome = "limited";
  else if (internalOnly) outcome = "none";
  else if (financeOnly && operational === 0) outcome = erpInPlay ? "erp_scope" : "none";
  else if (customerProjects && operational >= 2) outcome = "po";
  else if (customerProjects && operational === 1) outcome = erpInPlay ? "erp_boundary" : "po";
  else if (onlyUnknown(c, PQ.SCOPE)) outcome = "limited";
  else outcome = erpInPlay ? "erp_boundary" : "limited";
  // Avancerad resursplanering får aldrig ensam avgöra rekommendationen.
  if (outcome === "po" && operational === 1 && groups.resource && !groups.front && !groups.delivery && erpInPlay) outcome = "erp_boundary";

  const unc: string[] = [];
  if (onlyUnknown(c, PQ.TYPE)) unc.push("Vilken typ av projektverksamhet som ska stödjas är oklart.");
  if (onlyUnknown(c, PQ.SCOPE)) unc.push("Vilka delar av projektprocessen som behöver hänga ihop är oklart.");
  if (onlyUnknown(c, PQ.RES)) unc.push("Hur avancerad resursplaneringen behöver vara är oklart.");

  const open: string[] = [];
  if (outcome === "erp_boundary") open.push(PO_BOUNDARY_TEXT);
  if (outcome === "limited") open.push("Hur stor del av verksamheten är projektbaserad, och vilka delar av projektprocessen behöver stöd?");
  if (keepExistingTool) open.push("Kan ert befintliga projektverktyg behållas och integreras, eller behöver det ersättas?");
  if (projectSalesDependency) open.push("Hur ska en vunnen affär lämnas över till projektorganisationen?");
  if (unc.length && open.length < 3) open.push(unc[0]);

  return {
    activationReason: poActivationReasons(c),
    projectOperationsSignals: sig,
    projectLifecycleSignals: sig.filter((x) => x.kind === "lifecycle"),
    resourcePlanningSignals: sig.filter((x) => x.kind === "resource"),
    projectErpOverlap: erpInPlay && (groups.finance || outcome === "erp_boundary" || outcome === "erp_scope"),
    projectSalesDependency,
    keepExistingTool,
    customerProjects,
    internalOnly,
    financeOnly,
    lifecycleBreadth: breadth,
    uncertainties: unc,
    openQuestions: [...new Set(open)].slice(0, 3),
    activatedRules: sig.map((x) => x.rule).concat(keepExistingTool ? ["PO5_KEEP_EXISTING"] : []),
    reasons: [...new Set(sig.filter((x) => x.kind !== "internal").map((x) => x.reason))],
    preliminaryOutcome: outcome,
    clarity: outcome === "po" || outcome === "none" || outcome === "erp_scope" ? "clear" : outcome === "erp_boundary" ? "multiple" : "limited",
    selectedProductStartingPoint: c.productStart === "po" ? "po" : null,
    rulesVersion: PO_RULES_VERSION,
  };
}

// ---------- Frågor ----------

const base = { module: "projects" as const, countsTowardBudget: true, type: "multi" as const };
const okBudget = (c: DialogContext) => c.questionCount < NORMAL_CEILING;
const notStop = (c: DialogContext) => !onlyUnknown(c, PQ.TYPE) && !(a(c, PQ.TYPE).length > 0 && a(c, PQ.TYPE).every((t) => t === "internal"));

export const PO_QUESTIONS: Question[] = [
  {
    ...base, id: PQ.TYPE, priority: 300,
    text: "Vilken typ av projektverksamhet behöver ni stödja?",
    options: TYPE_OPTIONS,
    showIf: (c) => poActive(c) && !(poFromErpOnly(c)),
    affects: ["projectOperationsSignals"], decisiveFor: ["projectOperations"],
  },
  {
    ...base, id: PQ.SCOPE, priority: 310,
    text: "Vilka delar av projektprocessen behöver fungera tillsammans?",
    options: SCOPE_OPTIONS,
    showIf: (c) => poActive(c) && (poFromErpOnly(c) || (answered(c, PQ.TYPE) && notStop(c))),
    skipIf: (c) => !okBudget(c) && poFromErpOnly(c),
    affects: ["projectLifecycleSignals"], decisiveFor: ["projectOperations", "projectErpOverlap"],
  },
  {
    ...base, id: PQ.RES, priority: 320,
    text: "Vad behöver ni kunna planera och styra kring resurser?",
    options: RES_OPTIONS,
    showIf: (c) => poActive(c) && (has(c, PQ.SCOPE, "staffing", "capacity") || has(c, PQ.TYPE, "shared_resources")) && !poFromErpOnly(c),
    skipIf: (c) => !okBudget(c),
    affects: ["resourcePlanningSignals"],
  },
  {
    ...base, id: PQ.SALES, priority: 330,
    text: "Hur behöver försäljning och projektleverans hänga ihop?",
    options: SALES_OPTIONS,
    showIf: (c) => poActive(c) && c.needs.includes("sales") && (has(c, PQ.SCOPE, "sales_quote") || has(c, PQ.TYPE, "consulting", "fixed", "long_delivery")),
    affects: ["projectSalesDependency"], decisiveFor: ["combination"],
  },
  {
    ...base, id: PQ.NOW, priority: 340, type: "single",
    text: "Hur hanteras projektverksamheten idag?",
    options: NOW_OPTIONS,
    // Nuläget påverkar endast när projektbehovet faktiskt pekar mot ett eget spår.
    showIf: (c) => poActive(c) && answered(c, PQ.SCOPE) && !onlyUnknown(c, PQ.SCOPE) && !poFromErpOnly(c) && notStop(c),
    skipIf: (c) => !okBudget(c),
    affects: ["keepExistingTool"],
  },
];

export const projectOperationsModule: NeedModule = {
  id: "projects",
  activeIf: poActive,
  questions: PO_QUESTIONS,
  evaluate: evaluateProjectOperations,
};
