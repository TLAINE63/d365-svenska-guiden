// Sprint 4: frivillig fördjupning efter resultatet. Egen kort dialog, styrd av
// lösningsbilden från Sprint 3 + Behovsguidens svar. Ändrar aldrig grundguiden.
// Deterministisk: inga fria AI-texter, inga partnerval, ingen ranking.

import type { Option } from "./config";
import type { DialogState } from "./engine";
import type { ErpResult } from "./modules/erp";
import { Q } from "./modules/erp";
import { SOLUTION_INFO, type SolutionId, type SolutionPicture } from "./solutions";

export const DEEP_VERSION = "deep-1.0.0";
export const DEEP_MAX = 8;

export interface DeepContext {
  ids: Set<SolutionId>;          // primära + kompletterande
  primary: SolutionId[];
  base: Record<string, string[]>; // aktiva svar från Behovsguiden
  answers: Record<string, string[]>;
}
export interface DeepQuestion {
  id: string;
  group: "context" | "combo" | "product" | "ai" | "impl";
  text: string | ((c: DeepContext) => string);
  help?: string;
  type: "single" | "multi";
  options: Option[] | ((c: DeepContext) => Option[]);
  showIf: (c: DeepContext) => boolean;
}

const o = (id: string, label: string, exclusive = false): Option => ({ id, label, ...(exclusive ? { exclusive } : {}) });
const UNK = o("unknown", "Vet inte", true);
const ERP: SolutionId[] = ["bc", "finance", "scm", "fscm"];
const CRM: SolutionId[] = ["sales", "ci", "cs", "cc", "fs"];
const any = (c: DeepContext, xs: SolutionId[]) => xs.some((x) => c.ids.has(x));
const prim = (c: DeepContext, xs: SolutionId[]) => xs.some((x) => c.primary.includes(x));
/** Produktspår intervjuas bara om det är primärt, eller enda området. Undviker tre kompletta intervjuer. */
const focus = (c: DeepContext, xs: SolutionId[]) => prim(c, xs) || (c.ids.size === 1 && any(c, xs));
const bHas = (c: DeepContext, q: string, ...v: string[]) => v.some((x) => (c.base[q] ?? []).includes(x));
const dHas = (c: DeepContext, q: string, ...v: string[]) => v.some((x) => (c.answers[q] ?? []).includes(x));

export const DEEP_QUESTIONS: DeepQuestion[] = [
  {
    id: "role", group: "context", type: "single",
    text: "Vilken roll har ni i utvärderingen?",
    options: [o("management", "Ledning eller VD"), o("finance", "Ekonomi"), o("it", "IT"), o("sales_marketing", "Försäljning eller marknad"),
      o("service", "Kundservice eller service"), o("operations", "Verksamhet, lager eller produktion"), o("other", "Annan roll")],
    showIf: () => true,
  },
  {
    id: "stage", group: "context", type: "single",
    text: "Hur långt har ni kommit i arbetet?",
    options: [o("orienting", "Vi orienterar oss"), o("evaluating", "Vi utvärderar alternativ"), o("procuring", "Vi förbereder upphandling eller partnerval"), o("decided", "Lösningen är i stort sett vald")],
    showIf: () => true,
  },
  // ---- Kombinationer ----
  {
    id: "customer_master", group: "combo", type: "single",
    text: "Var ska den gemensamma kundinformationen ägas?",
    help: "Avgör ansvarsfördelning och integration mellan affärssystem och CRM.",
    options: [o("erp", "I affärssystemet"), o("crm", "I CRM-lösningen"), o("both", "I båda, synkroniserat"), UNK],
    showIf: (c) => any(c, ERP) && any(c, CRM),
  },
  {
    id: "crm_handover", group: "combo", type: "multi",
    text: "Vilka övergångar mellan områdena behöver fungera smidigt?",
    options: (c) => [
      ...(c.ids.has("ci") && c.ids.has("sales") ? [o("lead_to_sales", "Från marknad till försäljning (leads)")] : []),
      ...(c.ids.has("sales") && any(c, ERP) ? [o("quote_to_order", "Från offert till order och faktura")] : []),
      ...(c.ids.has("cs") && c.ids.has("fs") ? [o("case_to_workorder", "Från ärende till arbetsorder")] : []),
      ...(c.ids.has("cs") && c.ids.has("cc") ? [o("channel_to_case", "Från kanal till ärende")] : []),
      ...(c.ids.has("po") && any(c, ERP) ? [o("project_to_finance", "Från projekt till ekonomi och fakturering")] : []),
      UNK,
    ],
    showIf: (c) => {
      const pairs = [c.ids.has("ci") && c.ids.has("sales"), c.ids.has("sales") && any(c, ERP), c.ids.has("cs") && c.ids.has("fs"), c.ids.has("cs") && c.ids.has("cc"), c.ids.has("po") && any(c, ERP)];
      return pairs.some(Boolean);
    },
  },
  {
    id: "integrations", group: "combo", type: "multi",
    text: "Vilka andra system behöver kopplas till den nya lösningen?",
    options: [o("ecommerce", "E-handel eller webb"), o("payroll", "Lön eller HR"), o("bank", "Bank och betalningar"), o("bi", "Rapportering eller BI"),
      o("industry", "Branschsystem"), o("logistics", "3PL, transport eller WMS"), o("documents", "Dokumenthantering"), o("none", "Inga kända", true), UNK],
    showIf: () => true,
  },
  // ---- Affärssystem ----
  {
    id: "bc_focus", group: "product", type: "multi",
    text: "Vad i affärssystemet behöver ni förstå bättre innan ni går vidare?",
    options: (c) => [
      o("finance", "Ekonomi och rapportering"),
      ...(bHas(c, Q.ERP1, "multi_company") || bHas(c, Q.ERP2, "multi_similar", "multi_country") ? [o("companies", "Hantering av flera bolag")] : []),
      ...(bHas(c, Q.ERP1, "sales_orders", "purchasing") ? [o("orders", "Order och inköp")] : []),
      ...(bHas(c, Q.ERP1, "warehouse", "logistics") ? [o("warehouse", "Lagerprocesserna")] : []),
      ...(bHas(c, Q.ERP1, "production") ? [o("production", "Produktionen")] : []),
      ...(bHas(c, Q.ERP1, "projects") ? [o("projects", "Projekten")] : []),
      UNK,
    ],
    showIf: (c) => focus(c, ["bc"]),
  },
  {
    id: "bc_warehouse", group: "product", type: "single",
    text: "Hur hanteras lagret idag?",
    options: [o("simple", "Enkla lagerplatser, manuell plock"), o("scanning", "Streckkod eller skanning"), o("zones", "Zoner, plockvågor eller lagerautomation"), UNK],
    showIf: (c) => focus(c, ["bc"]) && dHas(c, "bc_focus", "warehouse"),
  },
  {
    id: "bc_production", group: "product", type: "single",
    text: "Hur planeras produktionen idag?",
    options: [o("orders", "Mot kundorder, enkel planering"), o("stock", "Mot lager med prognos"), o("advanced", "Med kapacitets- eller detaljplanering"), UNK],
    showIf: (c) => focus(c, ["bc"]) && dHas(c, "bc_focus", "production"),
  },
  {
    id: "fscm_rollout", group: "product", type: "single",
    text: "Hur ser ni på införande över bolag eller länder?",
    options: [o("all", "Alla samtidigt"), o("phased", "Stegvis per bolag eller land"), o("pilot", "Pilot i ett bolag först"), UNK],
    showIf: (c) => focus(c, ["finance", "scm", "fscm"]),
  },
  {
    id: "fscm_scm", group: "product", type: "multi",
    text: "Vilka delar av försörjningskedjan är mest komplexa?",
    options: [o("wms", "Lagerstyrning (WMS)"), o("planning", "Planering och prognos"), o("production", "Produktion"), o("transport", "Transport"), o("intercompany", "Flöden mellan bolag"), UNK],
    showIf: (c) => focus(c, ["scm", "fscm"]) || (focus(c, ["finance"]) && bHas(c, Q.ERP1, "warehouse", "production", "logistics")),
  },
  // ---- CRM ----
  {
    id: "sales_process", group: "product", type: "multi",
    text: "Vilka delar av säljprocessen behöver bli bättre?",
    options: [o("leads", "Leads och kvalificering"), o("pipeline", "Affärsmöjligheter och pipeline"), o("quotes", "Offerter"), o("forecast", "Prognoser"), o("accounts", "Kundansvar och aktiviteter"), UNK],
    showIf: (c) => focus(c, ["sales"]),
  },
  {
    id: "sales_adoption", group: "product", type: "single",
    text: "Hur arbetar säljarna i system idag?",
    options: [o("crm", "I ett CRM som används konsekvent"), o("partial", "I ett CRM som används ojämnt"), o("excel", "Främst i Excel, mejl och anteckningar"), UNK],
    showIf: (c) => focus(c, ["sales"]),
  },
  {
    id: "ci_scope", group: "product", type: "multi",
    text: "Vad vill ni kunna göra inom marknadsföring?",
    options: [o("segments", "Segmentering"), o("journeys", "Kundresor"), o("email", "Utskick och nyhetsbrev"), o("events", "Event"), o("unified_data", "Samla kunddata från flera källor"), o("consent", "Samtycken"), UNK],
    showIf: (c) => focus(c, ["ci"]),
  },
  {
    id: "service_channels", group: "product", type: "multi",
    text: "I vilka kanaler hör kunderna av sig?",
    options: [o("email", "Mejl"), o("phone", "Telefon"), o("chat", "Chatt"), o("social", "Sociala medier"), o("portal", "Kundportal eller självservice"), UNK],
    showIf: (c) => focus(c, ["cs", "cc"]),
  },
  {
    id: "service_sla", group: "product", type: "single",
    text: "Hur styrs ärendena idag?",
    options: [o("sla", "Med avtalade svarstider (SLA)"), o("queue", "Med köer men utan SLA"), o("ad_hoc", "Utan tydlig styrning"), UNK],
    showIf: (c) => focus(c, ["cs", "cc"]),
  },
  {
    id: "fs_work", group: "product", type: "multi",
    text: "Vilka delar av servicearbetet vill ni stödja?",
    options: [o("workorders", "Arbetsorder"), o("scheduling", "Planering av tekniker"), o("install", "Installation"), o("maintenance", "Förebyggande underhåll"), o("parts", "Reservdelar och material"), o("mobile", "Mobil app för tekniker"), UNK],
    showIf: (c) => focus(c, ["fs"]),
  },
  {
    id: "po_scope", group: "product", type: "multi",
    text: "Vad i projektarbetet behöver hänga ihop?",
    options: [o("sales", "Projektförsäljning och offert"), o("resources", "Resursplanering"), o("time", "Tidrapportering"), o("costs", "Kostnadsuppföljning"), o("billing", "Projektfakturering"), UNK],
    showIf: (c) => focus(c, ["po"]),
  },
  // ---- AI ----
  {
    id: "ai_use", group: "ai", type: "multi",
    text: (c) => `Hur vill ni använda AI inom ${aiArea(c)}?`,
    help: "AI ses som en del av lösningen, inte ett eget projekt.",
    options: [o("assist", "AI-assistans i det dagliga arbetet"), o("automation", "Automatisering av rutinmoment"), o("analysis", "Analys och uppföljning"),
      o("search", "Informationssökning"), o("decision", "Beslutsstöd"), o("not_now", "Inte prioriterat just nu", true)],
    showIf: () => true,
  },
  // ---- Införande ----
  {
    id: "impl_concerns", group: "impl", type: "multi",
    text: "Vad ser ni som största utmaningen inför ett införande?",
    options: [o("data", "Datakvalitet och migrering"), o("adoption", "Att användarna tar till sig lösningen"), o("process", "Processförändringar"),
      o("integration", "Integrationer"), o("resources", "Tid och interna resurser"), o("none", "Inget särskilt just nu", true)],
    showIf: () => true,
  },
];

function aiArea(c: DeepContext): string {
  const p = c.primary[0];
  if (!p) return "verksamheten";
  if (ERP.includes(p)) return "ekonomi och verksamhetsflöden";
  return ({ sales: "försäljningen", ci: "marknadsföringen", cs: "kundservicen", cc: "kunddialogen", fs: "servicearbetet", po: "projektarbetet" } as Record<string, string>)[p] ?? "verksamheten";
}

export const resolveDeepText = (q: DeepQuestion, c: DeepContext) => (typeof q.text === "function" ? q.text(c) : q.text);
export const resolveDeepOptions = (q: DeepQuestion, c: DeepContext) => (typeof q.options === "function" ? q.options(c) : q.options);

export function deepContext(picture: SolutionPicture, state: DialogState, answers: Record<string, string[]>): DeepContext {
  const primary = picture.primary.map((p) => p.id);
  return { primary, ids: new Set([...primary, ...picture.complementary.map((p) => p.id)]), base: state.activeAnswers, answers };
}

/** Väg genom fördjupningen: giltiga svar på väg + nästa fråga. Ogiltiga svar blir inaktiva. */
export function deriveDeep(picture: SolutionPicture, state: DialogState, stored: Record<string, string[]>) {
  const known: Record<string, string[]> = {};
  const path: string[] = [];
  let next: string | null = null;
  for (const q of DEEP_QUESTIONS) {
    const c = deepContext(picture, state, known);
    if (!q.showIf(c)) continue;
    if (path.length >= DEEP_MAX) break;
    const v = stored[q.id];
    const ids = new Set(resolveDeepOptions(q, c).map((x) => x.id));
    if (!v?.length || !v.every((x) => ids.has(x)) || (q.type === "single" && v.length !== 1)) { next = q.id; break; }
    path.push(q.id); known[q.id] = v;
  }
  return { path, next, answers: known };
}

// ---------- Fördjupad behovsbild ----------

export type AddOnCategory = "industry" | "warehouse" | "production" | "documents" | "projects" | "ecommerce" | "integration" | "reporting";
export const ADDON_LABEL: Record<AddOnCategory, string> = {
  industry: "Branschlösning", warehouse: "Lager och logistik", production: "Produktion", documents: "Dokumenthantering",
  projects: "Projekt", ecommerce: "E-handel", integration: "Integration", reporting: "Rapportering och planering",
};

export interface DeepResult {
  direction: { id: SolutionId; label: string }[];
  complementary: { id: SolutionId; label: string }[];
  clear: string[];
  decisions: string[];
  openQuestions: string[];
  addOns: { category: AddOnCategory; label: string; reason: string }[];
  implementation: string[];
  aiNote: string | null;
  nextStep: { label: string; href: string; kind: "plan" | "compare" | "addons" | "partners" };
  handover: Handover;
}

/** Strukturerad överlämning till Min D365-plan, partnermatchning och behovsunderlag (Sprint 5+). */
export interface Handover {
  version: string;
  entry: string | null;
  role: string | null;
  buyingStage: string | null;
  needs: string[];
  primaryNeed: string | null;
  problems: string[];
  currentSystem: string | null;
  changeIntent: string | null;
  companyStructure: string | null;
  recommended: SolutionId[];
  complementary: SolutionId[];
  investigate: SolutionId[];
  aiNeeds: string[];
  integrations: string[];
  addOnNeeds: AddOnCategory[];
  complexity: "low" | "medium" | "high" | "unknown";
  implementationConcerns: string[];
  openDecisions: string[];
  areaAnswers: Record<string, string[]>;
}

export function evaluateDeep(picture: SolutionPicture, state: DialogState, erp: ErpResult | undefined, answers: Record<string, string[]>): DeepResult {
  const a = (q: string) => answers[q] ?? [];
  const h = (q: string, ...v: string[]) => v.some((x) => a(q).includes(x));
  const b = state.activeAnswers;
  const bh = (q: string, ...v: string[]) => v.some((x) => (b[q] ?? []).includes(x));
  const ids = new Set([...picture.primary, ...picture.complementary].map((p) => p.id));
  const hasErp = ERP.some((x) => ids.has(x));
  const hasCrm = CRM.some((x) => ids.has(x));
  const stage = a("stage")[0] ?? null;

  // Tydligt
  const clear: string[] = [];
  if (erp && erp.clarity === "clear") clear.push("Affärssystemsbehovet och huvudsaklig riktning");
  if (hasCrm && picture.primary.some((p) => CRM.includes(p.id))) clear.push("CRM-behovet inom " + picture.primary.filter((p) => CRM.includes(p.id)).map((p) => p.label.replace("Dynamics\u00A0365 ", "")).join(" och "));
  if (picture.primary.length && !picture.comparePrimary && !clear.length) clear.push("Huvudsaklig lösningsriktning");

  // Beslut
  const dec: string[] = [];
  const pd = (s: string) => { if (!dec.includes(s) && dec.length < 5) dec.push(s); };
  if (picture.comparePrimary) pd("Välj mellan Business Central och Finance & Supply Chain Management utifrån de krav som skiljer dem åt.");
  if (h("customer_master", "both", "unknown")) pd("Bestäm vilket system som ska äga kundinformationen.");
  else if (hasErp && hasCrm) pd("Bekräfta ansvarsfördelningen mellan affärssystem och CRM.");
  if (h("fscm_rollout", "phased", "pilot", "unknown")) pd("Bestäm i vilken ordning bolag eller länder ska införas.");
  if (h("bc_warehouse", "zones") || h("fscm_scm", "wms")) pd("Avgör om lagerstyrningen ska ske i affärssystemet eller i ett separat WMS.");
  if (h("sales_adoption", "excel", "partial")) pd("Besluta hur säljprocessen ska se ut innan systemet konfigureras.");
  if (h("ci_scope", "unified_data")) pd("Bestäm vilka kunddatakällor som ska samlas och i vilken ordning.");
  if (h("service_channels") && a("service_channels").length >= 3) pd("Bestäm vilka kanaler som ska ingå i första etappen.");
  if (h("fs_work", "parts")) pd("Bestäm hur reservdelar och material ska hanteras mellan service och lager.");
  if (h("po_scope", "billing", "costs") && hasErp) pd("Bestäm var projektekonomi och fakturering ska hanteras.");
  if (a("integrations").filter((x) => !["none", "unknown"].includes(x)).length) pd("Prioritera vilka integrationer som behövs från start.");
  if (dec.length < 3) pd("Bestäm vad som ska ingå i första etappen och vad som kan vänta.");
  if (dec.length < 3) pd("Bestäm vem som äger projektet internt och vilka som ska delta i utvärderingen.");
  if (dec.length < 3) pd(stage === "procuring" || stage === "decided" ? "Bestäm hur ni ska välja implementeringspartner." : "Bestäm hur och när ni ska ta fram ett mer detaljerat behovsunderlag.");

  // Öppna frågor: endast verkliga osäkerheter
  const open: string[] = [];
  const po = (s: string) => { if (!open.includes(s) && open.length < 4) open.push(s); };
  erp?.openQuestions.forEach(po);
  for (const q of DEEP_QUESTIONS) if (a(q.id).includes("unknown")) po(`${resolveDeepText(q, deepContext(picture, state, answers)).replace(/\?$/, "")} är ännu inte klarlagt.`);

  // Tillägg
  const add: DeepResult["addOns"] = [];
  const pa = (category: AddOnCategory, reason: string) => { if (!add.some((x) => x.category === category)) add.push({ category, label: ADDON_LABEL[category], reason }); };
  if (bh(Q.ERP4, "process_batch") || bh(Q.ERP3, "traceability")) pa("industry", "Batch, recept eller spårbarhet styrs ofta av branschkrav.");
  if (h("bc_warehouse", "zones") || h("fscm_scm", "wms") || bh(Q.ERP3, "automation")) pa("warehouse", "Avancerad lagerstyrning eller automation.");
  if (h("bc_production", "advanced") || bh(Q.ERP4, "adv_planning")) pa("production", "Detaljerad produktionsplanering.");
  if (h("integrations", "documents")) pa("documents", "Dokumenthantering ska kopplas till lösningen.");
  if (h("bc_focus", "projects") && !ids.has("po")) pa("projects", "Projektstyrning utöver standard kan behövas.");
  if (h("integrations", "ecommerce")) pa("ecommerce", "E-handel eller webb ska kopplas till lösningen.");
  if (h("integrations", "industry", "logistics")) pa("integration", "Kopplingar till branschsystem eller logistikpartner.");
  if (h("integrations", "bi") || h("ai_use", "analysis")) pa("reporting", "Rapportering och analys utöver standard.");

  // Införande
  const impl: string[] = [];
  if (h("impl_concerns", "data") || ["replace", "consolidate"].includes(b.change_intent?.[0] ?? "")) impl.push("Datamigrering och datakvalitet: vilka data ska flyttas och vem ansvarar för att de är korrekta?");
  if (h("impl_concerns", "integration") || a("integrations").filter((x) => !["none", "unknown"].includes(x)).length >= 2) impl.push("Integrationsarkitektur: hur ska systemen kopplas ihop och vem förvaltar kopplingarna?");
  if (h("impl_concerns", "adoption") || h("sales_adoption", "excel", "partial")) impl.push("Användaracceptans: planera utbildning och stöd så att lösningen faktiskt används.");
  if (h("impl_concerns", "process")) impl.push("Processförändringar: bestäm vilka arbetssätt som ska ändras innan systemet anpassas.");
  if (h("impl_concerns", "resources")) impl.push("Interna resurser: avsätt tid för nyckelpersoner under projektet.");
  if (h("fscm_rollout", "phased", "pilot")) impl.push("Införandestrategi: en stegvis utrullning kräver en tydlig mall som kan återanvändas.");

  // AI
  const ai = a("ai_use").filter((x) => x !== "not_now");
  const AI_LBL: Record<string, string> = { assist: "AI-assistans", automation: "automatisering", analysis: "analys", search: "informationssökning", decision: "beslutsstöd" };
  const aiNote = ai.length ? `Ni är intresserade av ${ai.map((x) => AI_LBL[x]).join(", ")} inom ${aiArea(deepContext(picture, state, answers))}. Kontrollera vilka funktioner som ingår i licenserna och vad som kräver Copilot Studio eller separata tillägg.` : null;

  // Komplexitet
  const heavy = (erp?.financeSignals.length ?? 0) + (erp?.scmSignals.length ?? 0) + (add.length >= 2 ? 1 : 0) + (ids.size >= 3 ? 1 : 0);
  const complexity: Handover["complexity"] = !picture.primary.length ? "unknown" : heavy >= 3 ? "high" : heavy >= 1 || ids.size >= 2 ? "medium" : "low";

  // CTA
  let nextStep: DeepResult["nextStep"];
  const p0 = picture.primary[0]?.id;
  const PARTNERS: Partial<Record<SolutionId, string>> = { bc: "/business-central-partners-sverige/", fscm: "/finance-supply-chain-partners-sverige/", finance: "/finance-supply-chain-partners-sverige/", scm: "/finance-supply-chain-partners-sverige/" };
  if (picture.comparePrimary) nextStep = { kind: "compare", label: "Jämför Business Central och Finance & Supply Chain Management", href: "/affarssystem/" };
  else if (add.length >= 2) nextStep = { kind: "addons", label: "Utforska relevanta tilläggslösningar", href: "/kunskapscenter/dynamics-365-tillagg/" };
  else if ((stage === "procuring" || stage === "decided") && open.length <= 1) nextStep = { kind: "partners", label: "Hitta partners som passar behovet", href: (p0 && PARTNERS[p0]) || "/alla-d365-partners/" };
  else nextStep = { kind: "plan", label: "Skapa Min D365-plan", href: "/underlag/" };

  const handover: Handover = {
    version: DEEP_VERSION,
    entry: state.entry ?? null,
    role: a("role")[0] ?? null,
    buyingStage: stage,
    needs: state.needs,
    primaryNeed: state.primaryNeed ?? null,
    problems: state.problems,
    currentSystem: erp?.currentSystem ?? null,
    changeIntent: b.change_intent?.[0] ?? null,
    companyStructure: erp?.companyStructure ?? null,
    recommended: picture.primary.map((p) => p.id),
    complementary: picture.complementary.map((p) => p.id),
    investigate: picture.investigate.map((p) => p.id),
    aiNeeds: ai,
    integrations: a("integrations").filter((x) => !["none", "unknown"].includes(x)),
    addOnNeeds: add.map((x) => x.category),
    complexity,
    implementationConcerns: a("impl_concerns").filter((x) => x !== "none"),
    openDecisions: dec,
    areaAnswers: answers,
  };

  return {
    direction: picture.primary.map((p) => ({ id: p.id, label: SOLUTION_INFO[p.id].label })),
    complementary: picture.complementary.map((p) => ({ id: p.id, label: SOLUTION_INFO[p.id].label })),
    clear, decisions: dec, openQuestions: open, addOns: add, implementation: impl.slice(0, 4), aiNote, nextStep, handover,
  };
}
