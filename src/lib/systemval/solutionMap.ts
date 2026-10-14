// Sprint 5: gemensam preliminär lösningskarta ovanpå lösningsbilden och modulresultaten.
// Ren funktion: klassificerar hur identifierade spår förhåller sig till varandra
// (huvudspår, alternativ, komplement, senare etapp, beroenden, att utreda).
// Ändrar aldrig modulernas grundregler eller routingen; ingen fri AI, inga poäng.

import { NEED_AREAS, type NeedArea } from "./config";
import type { DialogState } from "./engine";
import type { ErpResult } from "./modules/erp";
import type { SvcResult } from "./modules/service";
import { PO_BOUNDARY_TEXT, type PoResult } from "./modules/projectOperations";
import { SOLUTION_INFO, type SolutionId, type SolutionPicture } from "./solutions";

export const SOLUTION_MAP_VERSION = "solution-map-1.0.0";

export type DependencyKind = "integration" | "process" | "system_boundary" | "keep_existing";
export interface Dependency { key: string; kind: DependencyKind; text: string; rule: string }
export interface MapTrack { id: SolutionId | "erp_projects"; label: string; why: string }
export interface MapAlternative { options: MapTrack[]; need: string; why: string }
export type MapClarity = "clear" | "multiple" | "limited";

export interface SolutionMap {
  interpretation: string;
  start: MapTrack[];
  alternatives: MapAlternative[];
  complements: MapTrack[];
  later: MapTrack[];
  /** Motiverad etappindelning finns; annars "Införandeordningen behöver utredas". */
  phasing: { basis: string } | null;
  phasingNote: string | null;
  dependencies: Dependency[];
  openQuestions: string[];
  clarity: MapClarity;
  debug: {
    moduleOutcomes: Record<string, string>;
    identifiedTracks: string[];
    primaryTrack: string[];
    alternativeTracks: string[][];
    complementaryTracks: string[];
    laterPhaseTracks: string[];
    integrationDependencies: string[];
    processDependencies: string[];
    detectedDuplicates: string[];
    detectedConflicts: string[];
    unresolvedQuestions: string[];
    activatedCrossModuleRules: string[];
    solutionMapClarity: MapClarity;
    reasonForClassification: Record<string, string>;
    version: string;
  };
}

const D = "Dynamics\u00A0365";
const short = (id: SolutionId) => SOLUTION_INFO[id].label.replace(`${D} `, "");
const ERP_IDS: SolutionId[] = ["bc", "finance", "scm", "fscm"];
const ERP_NEEDS: NeedArea[] = ["erp", "supply_chain", "production"];
const NEED_OF: Partial<Record<SolutionId, NeedArea>> = { sales: "sales", ci: "marketing", cs: "customer_service", cc: "contact_center", fs: "field_service", po: "projects" };
const needOf = (id: SolutionId): NeedArea | undefined => (ERP_IDS.includes(id) ? "erp" : NEED_OF[id]);
const needLabel = (n: NeedArea) => NEED_AREAS.find((a) => a.id === n)?.label.toLowerCase() ?? n;

export function buildSolutionMap(state: DialogState, p: SolutionPicture): SolutionMap {
  const erp = state.moduleResults.erp as ErpResult | undefined;
  const svc = state.moduleResults.service as SvcResult | undefined;
  const po = state.moduleResults.projects as PoResult | undefined;
  const reason: Record<string, string> = {};
  const rules: string[] = [];
  const conflicts: string[] = [];
  const open: string[] = [];
  const pushOpen = (s?: string) => { if (s && !open.includes(s)) open.push(s); };

  const primary = p.primary.map((x) => x.id);
  const compl = p.complementary.map((x) => x.id);
  const all = new Set<SolutionId>([...primary, ...compl]);
  const hasErp = primary.some((id) => ERP_IDS.includes(id)) || compl.some((id) => ERP_IDS.includes(id)) || !!erp;

  // --- Alternativ: endast lösningar som konkurrerar om samma behov ---
  const alternatives: MapAlternative[] = [];
  let start: SolutionId[] = [...primary];
  if (p.comparePrimary) {
    const pair = start.filter((id) => ERP_IDS.includes(id));
    alternatives.push({ need: "affärssystem", options: pair.map((id) => ({ id, label: SOLUTION_INFO[id].label, why: "" })), why: "Båda kan stödja samma affärssystemsbehov och behöver jämföras." });
    rules.push("ALT_BC_FSCM");
    pair.forEach((id) => (reason[id] = "Alternativ: konkurrerar om samma affärssystemsbehov."));
  }
  if (po?.preliminaryOutcome === "erp_boundary" && hasErp) {
    alternatives.push({
      need: "projekt", why: PO_BOUNDARY_TEXT,
      options: [
        { id: "erp_projects", label: "Projektfunktioner i affärssystemet", why: "" },
        { id: "po", label: SOLUTION_INFO.po.label, why: "" },
      ],
    });
    rules.push("ALT_ERP_PROJECTS_PO");
    reason.po = "Alternativ: gränsfall mellan projektfunktioner i ERP och Project Operations.";
  }

  // --- Senare etapp: endast när användaren uttryckligen prioriterat och spåret saknar beroende till starten ---
  const deps: Dependency[] = [];
  const addDep = (key: string, kind: DependencyKind, text: string, rule: string) => {
    if (deps.some((d) => d.key === key)) return;
    deps.push({ key, kind, text, rule });
    rules.push(rule);
  };
  const inMap = (id: SolutionId) => all.has(id);
  const anyErp = ERP_IDS.some(inMap);
  if (anyErp && inMap("sales")) addDep("erp_sales", "integration", "Försäljningen behöver kund-, order- och fakturainformation från affärssystemet.", "X_ERP_SALES");
  if (inMap("sales") && inMap("ci")) addDep("sales_ci", "process", "Leads och kunddata behöver lämnas över mellan marknad och försäljning.", "X_SALES_CI");
  if (inMap("sales") && inMap("cs")) addDep("sales_cs", "integration", "Försäljning och kundservice behöver en gemensam kundbild.", "X_SALES_CS");
  if (inMap("cs") && inMap("cc")) addDep("cs_cc", "process", "Kontakter från kanalerna behöver bli ärenden i ärendeprocessen.", "X_CS_CC");
  if (inMap("cs") && inMap("fs")) addDep("cs_fs", "process", "Vissa kundärenden behöver kunna bli arbetsorder för service ute hos kund.", "X_CS_FS");
  if (inMap("fs") && (anyErp || svc?.integrationSignals.length))
    addDep("erp_fs", "integration", "Service ute hos kund behöver reservdelar, lagersaldo och fakturering från affärssystemet (kräver inte i sig ett nytt affärssystem).", "X_ERP_FS");
  if (svc?.keepExistingCrm) addDep("cc_crm", "keep_existing", "Contact Center kan kopplas till ert befintliga CRM, som kan behållas.", "X_CC_KEEP_CRM");
  if (po && (anyErp || erp) && (inMap("po") || po.preliminaryOutcome === "erp_boundary"))
    addDep("erp_po", "system_boundary", "Systemgränsen mellan projektfunktioner i affärssystemet och Project Operations behöver utredas, liksom vilken ekonomisk information som ska flöda mellan dem.", "X_ERP_PO");
  if (inMap("sales") && inMap("po")) addDep("sales_po", "process", "En vunnen affär behöver kunna lämnas över till projekt.", "X_SALES_PO");
  if (po?.keepExistingTool) addDep("po_keep", "keep_existing", "Ert befintliga projektverktyg kan behållas och integreras, i stället för att ersättas.", "X_PO_KEEP_TOOL");

  const depOf = (a: SolutionId, b: SolutionId) => {
    const keys = deps.map((d) => d.key);
    const k = (x: SolutionId) => (ERP_IDS.includes(x) ? "erp" : x);
    return keys.some((key) => { const [x, y] = key.split("_"); return (x === k(a) && y === k(b)) || (x === k(b) && y === k(a)); });
  };

  const later: SolutionId[] = [];
  let phasingBasis: string | null = null;
  const complements: SolutionId[] = [];
  for (const id of compl) {
    if (id === "po" && alternatives.some((x) => x.need === "projekt")) continue;
    const linked = start.some((s) => depOf(s, id));
    const explicitSecondary = state.prioritySetting === "primary" && state.secondaryNeeds.includes(needOf(id) as NeedArea);
    const coreOwn = p.signals.some((s) => s.id === id && s.kind === "core");
    if (explicitSecondary && coreOwn && !linked) {
      later.push(id);
      reason[id] = `Senare etapp: ni prioriterade ${needLabel(state.primaryNeed!)} och ${short(id)} saknar processberoende till starten.`;
      phasingBasis = "användarens prioritering och avsaknad av processberoende";
      rules.push("PHASE_PRIORITY");
    } else {
      complements.push(id);
      reason[id] = linked ? `Komplement: separat behov med beroende till ${start.map(short).join(", ")}.` : "Komplement: stöds av ett separat uttryckt behov.";
    }
  }
  for (const id of start) reason[id] ??= state.prioritySetting === "equal" ? "Huvudspår: flera områden angavs som lika viktiga." : state.primaryNeed ? `Huvudspår: stödjer det prioriterade behovet (${needLabel(state.primaryNeed)}).` : "Huvudspår: starkast uttryckt behov.";

  // --- Dubbletter: samma lösning med signaler från flera källor slås ihop ---
  const duplicates: string[] = [];
  const bySrc = new Map<SolutionId, Set<string>>();
  for (const s of p.signals) {
    const src = s.fromSvc ? "service" : s.fromPo ? "projects" : ERP_IDS.includes(s.id) ? "erp" : s.kind === "core" ? "needs" : "cross";
    bySrc.set(s.id, (bySrc.get(s.id) ?? new Set()).add(src));
  }
  for (const [id, src] of bySrc) if (src.size > 1 && all.has(id)) duplicates.push(`${id}:${[...src].join("+")}`);
  if (svc?.integrationSignals.some((x) => x.rule === "FS_ERP") && deps.some((d) => d.key === "erp_fs")) duplicates.push("erp_fs:service+cross");

  // --- Konflikter mellan moduler ---
  if (erp?.projectOperationsSignal && po && ["erp_scope", "none"].includes(po.preliminaryOutcome)) {
    conflicts.push("ERP-modulen ser ett bredare projektbehov, men projektfrågorna pekar mot projektekonomi i affärssystemet.");
    pushOpen(PO_BOUNDARY_TEXT);
  }
  if (state.productStart && state.productStart !== "unsure") {
    const sp = state.productStart as SolutionId;
    const covered = all.has(sp) || (sp === "fscm" && ["finance", "scm"].some((x) => all.has(x as SolutionId)));
    if (!covered) conflicts.push(`Er utgångspunkt ${short(sp)} stöds inte tydligt av svaren.`);
  }
  if (state.prioritySetting === "primary" && state.primaryNeed && !start.some((id) => needOf(id) === state.primaryNeed || (ERP_NEEDS.includes(state.primaryNeed!) && ERP_IDS.includes(id))) && start.length)
    conflicts.push(`Det prioriterade området (${needLabel(state.primaryNeed)}) gav inget tydligt spår.`);

  // --- Öppna frågor (högst tre) ---
  for (const a of alternatives) pushOpen(a.why === PO_BOUNDARY_TEXT ? a.why : undefined);
  if (state.prioritySetting === "unknown" && state.needs.length >= 2) pushOpen("Vilket område behöver lösas först?");
  po?.openQuestions.forEach(pushOpen);
  p.openQuestions.forEach(pushOpen);

  const phasingNote = !phasingBasis && start.length + complements.length >= 2 ? "Införandeordningen behöver utredas." : null;

  const limited = !start.length || (erp?.preliminaryOutcome === "limited" && start.every((id) => ERP_IDS.includes(id))) || (po?.preliminaryOutcome === "limited" && state.primaryNeed === "projects");
  const clarity: MapClarity = limited ? "limited" : alternatives.length || conflicts.length || (state.prioritySetting !== "primary" && start.length > 1) ? "multiple" : "clear";

  const track = (id: SolutionId): MapTrack => ({ id, label: SOLUTION_INFO[id].label, why: reason[id] ?? "" });

  return {
    interpretation: p.interpretation,
    start: start.map(track),
    alternatives,
    complements: complements.map(track),
    later: later.map(track),
    phasing: phasingBasis ? { basis: phasingBasis } : null,
    phasingNote,
    dependencies: deps,
    openQuestions: open.slice(0, 3),
    clarity,
    debug: {
      moduleOutcomes: Object.fromEntries([
        erp && ["erp", erp.preliminaryOutcome], svc && ["service", svc.preliminaryOutcome], po && ["projects", po.preliminaryOutcome],
      ].filter(Boolean) as [string, string][]),
      identifiedTracks: [...new Set(p.signals.map((s) => s.id))],
      primaryTrack: start,
      alternativeTracks: alternatives.map((a) => a.options.map((o) => o.id)),
      complementaryTracks: complements,
      laterPhaseTracks: later,
      integrationDependencies: deps.filter((d) => d.kind !== "process").map((d) => d.key),
      processDependencies: deps.filter((d) => d.kind === "process").map((d) => d.key),
      detectedDuplicates: duplicates,
      detectedConflicts: conflicts,
      unresolvedQuestions: open,
      activatedCrossModuleRules: [...new Set(rules)],
      solutionMapClarity: clarity,
      reasonForClassification: reason,
      version: SOLUTION_MAP_VERSION,
    },
  };
}
