// Service-modulen (Sprint 4): Customer Service, Contact Center och Field Service.
// Deterministisk och regelbaserad. Utgår från hur kunden arbetar, inte från produktnamn.
// Grundregler: telefon ≠ Contact Center, e-post ≠ Customer Service, arbete ute hos
// kund ≠ Field Service, informationsbehov ≠ ny Dynamics-produkt, befintligt CRM ≠ systembyte.

import type { DialogContext, NeedModule, Option, Question } from "../config";

export const SVC_RULES_VERSION = "svc-rules-1.0.0";

export const SQ = {
  SV1: "SV1_SERVICEARBETE",
  CS1: "SV2_CS_ARENDEN",
  CC1: "SV3_CC_KANALER",
  CC2: "SV4_CC_DIALOG",
  FS1: "SV5_FS_ARBETE",
  FS2: "SV6_FS_SVARIGHETER",
  HO: "SV7_OVERLAMNING",
  NOW: "SV8_NULAGE",
  FSDATA: "SV9_FS_DATA",
} as const;

export type Track = "cs" | "cc" | "fs";
const SVC_NEEDS = ["customer_service", "contact_center", "field_service"] as const;
const SVC_PROBLEMS = ["cases_email", "channels", "technicians"];
const NORMAL_CEILING = 8;

const opt = (id: string, label: string, exclusive = false): Option => ({ id, label, ...(exclusive ? { exclusive } : {}) });
const a = (c: DialogContext, q: string) => c.answers[q] ?? [];
const has = (c: DialogContext, q: string, ...ids: string[]) => ids.some((id) => a(c, q).includes(id));
const answered = (c: DialogContext, q: string) => q in c.answers;
const onlyUnknown = (c: DialogContext, q: string) => a(c, q).length > 0 && a(c, q).every((v) => v === "unknown");

// ---------- Aktivering ----------

export function svcActivationReasons(c: DialogContext): string[] {
  const r: string[] = [];
  for (const n of SVC_NEEDS) if (c.needs.includes(n)) r.push(`need:${n}`);
  for (const p of c.problems) if (SVC_PROBLEMS.includes(p)) r.push(`problem:${p}`);
  if (c.productStart === "cs" || c.productStart === "cc" || c.productStart === "fs") r.push(`product:${c.productStart}`);
  return r;
}
export const svcActive = (c: DialogContext) => svcActivationReasons(c).length > 0;
/** Sekundärt när ett icke-serviceområde uttryckligen prioriterats. */
const svcSecondary = (c: DialogContext) => !!c.primaryNeed && !(SVC_NEEDS as readonly string[]).includes(c.primaryNeed);

// ---------- Frågebank ----------

const SV1_OPTIONS: Option[] = [
  opt("cases", "Hantera kundärenden strukturerat"),
  opt("knowledge", "Ge medarbetare bättre kunskapsstöd"),
  opt("sla", "Hantera SLA, prioritering och eskalering"),
  opt("selfservice", "Erbjuda självservice"),
  opt("multichannel", "Hantera kunddialog från flera kanaler"),
  opt("queues", "Styra köer och fördela inkommande kontakter"),
  opt("phone", "Hantera telefonbaserad kundservice"),
  opt("field_plan", "Planera och styra tekniker ute hos kund"),
  opt("install_repair", "Hantera installation, underhåll eller reparation"),
  opt("equipment", "Hålla reda på kundens utrustning och servicehistorik"),
  opt("unknown", "Vet inte", true),
];
const CS1_OPTIONS: Option[] = [
  opt("overview", "Samlad överblick över kundärenden"),
  opt("routing", "Prioritering och fördelning"),
  opt("sla", "SLA och eskalering"),
  opt("knowledge", "Kunskapsartiklar och stöd till medarbetarna"),
  opt("history", "Kundhistorik"),
  opt("selfservice", "Självservice"),
  opt("handover", "Överlämning mellan olika team"),
  opt("reporting", "Rapportering och uppföljning"),
  opt("unknown", "Vet inte", true),
];
const CC1_OPTIONS: Option[] = [
  opt("phone", "Telefon"),
  opt("email", "E-post"),
  opt("chat", "Chatt"),
  opt("digital", "Andra digitala kanaler"),
  opt("portal", "Kundportal eller självservice"),
  opt("several", "Flera av dessa"),
  opt("unknown", "Vet inte", true),
];
const CC2_OPTIONS: Option[] = [
  opt("queues", "Gemensamma köer och routing"),
  opt("skills", "Fördelning utifrån kompetens eller tillgänglighet"),
  opt("overview", "Bättre överblick över inkommande kontakter"),
  opt("capacity", "Kapacitet och uppföljning"),
  opt("omni", "Sammanhängande dialog över flera kanaler"),
  opt("crm_integration", "Integration med befintligt CRM"),
  opt("better_cases", "Vi behöver främst bättre ärendehantering"),
  opt("unknown", "Vet inte", true),
];
const FS1_OPTIONS: Option[] = [
  opt("install", "Installationer"),
  opt("preventive", "Förebyggande underhåll"),
  opt("repair", "Akuta reparationer"),
  opt("inspection", "Inspektioner"),
  opt("workorders", "Arbetsorder"),
  opt("contracts", "Serviceavtal"),
  opt("equipment", "Kundens utrustning eller installerade produkter"),
  opt("parts", "Reservdelar"),
  opt("unknown", "Vet inte", true),
];
const FS2_OPTIONS: Option[] = [
  opt("match", "Matcha rätt tekniker med rätt uppdrag"),
  opt("geo", "Geografisk planering"),
  opt("replan", "Akuta omplaneringar"),
  opt("parts", "Tillgång till reservdelar"),
  opt("mobile", "Mobil användning ute hos kund"),
  opt("offline", "Arbete där uppkoppling saknas"),
  opt("equipment_info", "Information om kundens utrustning"),
  opt("reporting", "Återrapportering från genomfört arbete"),
  opt("unknown", "Vet inte", true),
];
const HO_OPTIONS: Option[] = [
  opt("case_to_wo", "Vissa kundärenden ska kunna bli arbetsorder"),
  opt("cs_sees_status", "Kundservice behöver se status på servicebesök"),
  opt("tech_sees_cases", "Tekniker behöver se kundens tidigare ärenden"),
  opt("shared_history", "Servicehistoriken behöver vara gemensam"),
  opt("separate", "Processerna kan hanteras separat", true),
  opt("unknown", "Vet inte", true),
];
const NOW_OPTIONS: Option[] = [
  opt("d365", "Dynamics\u00A0365"),
  opt("other_crm", "Annat CRM- eller servicesystem"),
  opt("cc_platform", "En contact center-plattform"),
  opt("special", "Ett specialsystem"),
  opt("email_tools", "E-post och andra separata verktyg"),
  opt("several", "Flera olika system"),
  opt("unknown", "Vet inte", true),
];
const FSDATA_OPTIONS: Option[] = [
  opt("erp_other", "I ett annat affärssystem"),
  opt("erp_d365", "I ett affärssystem från Dynamics\u00A0365"),
  opt("separate", "I separata system eller register"),
  opt("excel", "Främst i Excel eller manuellt"),
  opt("unknown", "Vet inte", true),
];

// ---------- Signaler ----------

export interface SvcSignal { track: Track | "integration" | "combination"; rule: string; strength: "supporting" | "relevant" | "strong"; reason: string }

/** Kandidater: områden där frågan kan behöva ställas (inte bedömning). */
const csCandidate = (c: DialogContext) => has(c, SQ.SV1, "cases", "knowledge", "sla", "selfservice") || has(c, SQ.CC2, "better_cases") || c.productStart === "cs";
const ccCandidate = (c: DialogContext) => has(c, SQ.SV1, "multichannel", "queues", "phone") || c.productStart === "cc";
const fsCandidate = (c: DialogContext) => has(c, SQ.SV1, "field_plan", "install_repair", "equipment") || c.productStart === "fs";

function signals(c: DialogContext): SvcSignal[] {
  const s: SvcSignal[] = [];
  const add = (track: SvcSignal["track"], rule: string, strength: SvcSignal["strength"], reason: string) => s.push({ track, rule, strength, reason });

  // Customer Service: strukturerad ärendehantering.
  if (has(c, SQ.SV1, "cases")) add("cs", "SV1_CASES", "strong", "Ni vill hantera kundärenden strukturerat.");
  if (has(c, SQ.SV1, "sla")) add("cs", "SV1_SLA", "strong", "Ni behöver SLA, prioritering och eskalering.");
  if (has(c, SQ.SV1, "knowledge")) add("cs", "SV1_KNOWLEDGE", "relevant", "Medarbetarna behöver bättre kunskapsstöd.");
  if (has(c, SQ.SV1, "selfservice")) add("cs", "SV1_SELFSERVICE", "relevant", "Ni vill erbjuda självservice.");
  const csStrong = ["overview", "routing", "sla", "handover"].filter((o) => has(c, SQ.CS1, o));
  const csRel = ["knowledge", "history", "selfservice", "reporting"].filter((o) => has(c, SQ.CS1, o));
  if (csStrong.length) add("cs", "CS1_PROCESS", "strong", "Ärendeprocessen behöver överblick, fördelning, SLA eller överlämning mellan team.");
  if (csRel.length) add("cs", "CS1_SUPPORT", "relevant", "Kunskap, kundhistorik eller uppföljning kring ärendena behöver stärkas.");
  if (has(c, SQ.CC2, "better_cases")) add("cs", "CC2_BETTER_CASES", "strong", "Ni behöver främst bättre ärendehantering bakom kanalerna.");

  // Contact Center: kanaler, routing och köer. Telefon ensamt räcker inte.
  const channels = a(c, SQ.CC1).filter((v) => v !== "unknown");
  const multiChannel = channels.includes("several") || channels.length >= 2;
  if (has(c, SQ.SV1, "queues")) add("cc", "SV1_QUEUES", "strong", "Ni vill styra köer och fördela inkommande kontakter.");
  if (has(c, SQ.SV1, "multichannel") && multiChannel) add("cc", "SV1_MULTICHANNEL", "strong", "Kunddialogen sker i flera kanaler som behöver hållas ihop.");
  else if (has(c, SQ.SV1, "multichannel")) add("cc", "SV1_MULTICHANNEL_OPEN", "supporting", "Ni nämner flera kanaler, men vilka är ännu oklart.");
  if (has(c, SQ.SV1, "phone")) add("cc", "SV1_PHONE", "supporting", "Telefon är en viktig kanal (räcker inte ensamt för Contact Center).");
  const ccStrong = ["queues", "skills", "omni"].filter((o) => has(c, SQ.CC2, o));
  const ccRel = ["overview", "capacity"].filter((o) => has(c, SQ.CC2, o));
  if (ccStrong.length) add("cc", "CC2_ROUTING", "strong", "Ni behöver köer, routing eller sammanhängande dialog över kanaler.");
  if (ccRel.length) add("cc", "CC2_OVERVIEW", "relevant", "Ni behöver överblick, kapacitet och uppföljning av inkommande kontakter.");
  if (has(c, SQ.CC2, "crm_integration")) add("integration", "CC2_CRM", "relevant", "Kunddialogen behöver kopplas till befintligt CRM.");

  // Field Service: planering och styrning av serviceleverans.
  if (has(c, SQ.SV1, "field_plan")) add("fs", "SV1_FIELD_PLAN", "strong", "Ni vill planera och styra tekniker ute hos kund.");
  if (has(c, SQ.SV1, "install_repair")) add("fs", "SV1_INSTALL_REPAIR", "supporting", "Ni utför installation, underhåll eller reparation.");
  if (has(c, SQ.SV1, "equipment")) add("fs", "SV1_EQUIPMENT", "supporting", "Ni behöver hålla reda på kundens utrustning och servicehistorik.");
  if (has(c, SQ.FS1, "workorders", "preventive", "contracts")) add("fs", "FS1_STRUCTURED", "strong", "Arbetsorder, förebyggande underhåll eller serviceavtal behöver styras.");
  if (has(c, SQ.FS1, "install", "repair", "inspection")) add("fs", "FS1_JOBS", "supporting", "Arbetet ute hos kund omfattar installationer, reparationer eller inspektioner.");
  if (has(c, SQ.FS2, "match", "geo", "replan")) add("fs", "FS2_PLANNING", "strong", "Planeringen av tekniker, geografi eller omplaneringar är svår idag.");
  if (has(c, SQ.FS2, "mobile", "offline", "reporting", "equipment_info")) add("fs", "FS2_EXECUTION", "supporting", "Teknikerna behöver mobilt stöd och information på plats.");

  // Integration: informationsbehov, aldrig en ny produkt i sig.
  if (has(c, SQ.FS1, "parts") || has(c, SQ.FS2, "parts")) add("integration", "FS_PARTS", "relevant", "Reservdelar och lagersaldo behöver hämtas från affärssystemet.");
  if (has(c, SQ.FSDATA, "erp_other", "erp_d365")) add("integration", "FS_ERP", "relevant", "Kundinformation, reservdelar och fakturering finns i ett affärssystem som serviceflödet behöver kopplas till.");
  if (has(c, SQ.HO, "case_to_wo", "cs_sees_status", "shared_history")) add("combination", "HO_LINKED", "strong", "Kundärenden och servicebesök behöver hänga ihop.");
  return s;
}

/** Ett spår är relevant med minst en stark signal, eller två relevanta. */
function relevant(sig: SvcSignal[], t: Track): boolean {
  const own = sig.filter((x) => x.track === t);
  return own.some((x) => x.strength === "strong") || own.filter((x) => x.strength === "relevant").length >= 2;
}

// ---------- Resultat ----------

export type SvcClarity = "clear" | "multiple" | "limited";
export interface SvcResult {
  activationReason: string[];
  tracks: Track[];
  /** Spår med svaga signaler som bör undersökas, inte rekommenderas. */
  investigateTracks: Track[];
  keepExistingCrm: boolean;
  existingD365: boolean;
  customerServiceSignals: SvcSignal[];
  contactCenterSignals: SvcSignal[];
  fieldServiceSignals: SvcSignal[];
  integrationSignals: SvcSignal[];
  combinationSignals: SvcSignal[];
  uncertainties: string[];
  activatedRules: string[];
  reasons: Record<Track, string[]>;
  openQuestions: string[];
  preliminaryOutcome: string;
  clarity: SvcClarity;
  selectedProductStartingPoint: Track | null;
  rulesVersion: string;
}

const NEED_OF: Record<Track, string> = { cs: "customer_service", cc: "contact_center", fs: "field_service" };

export function evaluateService(c: DialogContext): SvcResult {
  const sig = signals(c);
  const rel = (["cs", "cc", "fs"] as Track[]).filter((t) => relevant(sig, t));
  const weak = (["cs", "cc", "fs"] as Track[]).filter((t) => !rel.includes(t) && sig.some((x) => x.track === t));

  const start = (["cs", "cc", "fs"] as const).find((t) => c.productStart === t) ?? null;
  const score = (t: Track) => sig.filter((x) => x.track === t).reduce((n, x) => n + (x.strength === "strong" ? 3 : x.strength === "relevant" ? 2 : 1), 0);
  const pn = c.primaryNeed;
  const tracks = [...rel].sort((x, y) => {
    const px = pn === NEED_OF[x] ? 1 : 0, py = pn === NEED_OF[y] ? 1 : 0;
    if (px !== py) return py - px;
    const sx = start === x ? 1 : 0, sy = start === y ? 1 : 0;
    if (sx !== sy) return sy - sx;
    return score(y) - score(x);
  });

  const now = a(c, SQ.NOW);
  const keepExistingCrm = tracks.includes("cc") && !tracks.includes("cs") && now.includes("other_crm");
  const existingD365 = now.includes("d365");

  const unc: string[] = [];
  if (onlyUnknown(c, SQ.SV1)) unc.push("Vilket servicearbete som behöver stöd är ännu oklart.");
  if (onlyUnknown(c, SQ.CS1)) unc.push("Vad som ska förbättras i ärendehanteringen är oklart.");
  if (onlyUnknown(c, SQ.CC1) || onlyUnknown(c, SQ.CC2)) unc.push("Vilka kanaler och vilket stöd kunddialogen behöver är oklart.");
  if (onlyUnknown(c, SQ.FS1) || onlyUnknown(c, SQ.FS2)) unc.push("Hur arbetet ute hos kund planeras och styrs är oklart.");
  if (onlyUnknown(c, SQ.HO)) unc.push("Hur kundärenden och servicebesök ska hänga ihop är oklart.");
  if (has(c, SQ.SV1, "phone") && !rel.includes("cc")) unc.push("Om telefonin behöver köer och routing, eller bara fungerar som en kanal, är inte utrett.");

  const open: string[] = [];
  if (weak.includes("cc")) open.push("Behöver inkommande kontakter fördelas i köer och routas, eller räcker en enklare kanalhantering?");
  if (weak.includes("fs")) open.push("Behöver arbetet ute hos kund planeras och styras i ett system, eller räcker mobil åtkomst till kundinformation?");
  if (weak.includes("cs")) open.push("Behöver ni en strukturerad ärendeprocess, eller räcker nuvarande sätt att hantera kundfrågor?");
  if (tracks.includes("cs") && tracks.includes("fs") && !answered(c, SQ.HO)) open.push("Hur ska kundärenden och servicebesök hänga ihop?");
  if (sig.some((x) => x.track === "integration")) open.push("Vilken information om reservdelar, priser, fakturering och kunddata måste delas med andra system?");
  if (keepExistingCrm) open.push("Hur ska Contact Center kopplas till ert befintliga CRM?");
  if (unc.length && open.length < 3) open.push(unc[0]);

  const clarity: SvcClarity = !tracks.length ? "limited" : (weak.length || unc.length >= 2) ? "multiple" : "clear";
  const reasons = { cs: [], cc: [], fs: [] } as Record<Track, string[]>;
  for (const x of sig) if (x.track === "cs" || x.track === "cc" || x.track === "fs") reasons[x.track].push(x.reason);
  const combo = sig.filter((x) => x.track === "combination");
  for (const x of combo) if (tracks.includes("cs") && tracks.includes("fs")) { reasons.cs.push(x.reason); reasons.fs.push(x.reason); }

  return {
    activationReason: svcActivationReasons(c),
    tracks, investigateTracks: weak, keepExistingCrm, existingD365,
    customerServiceSignals: sig.filter((x) => x.track === "cs"),
    contactCenterSignals: sig.filter((x) => x.track === "cc"),
    fieldServiceSignals: sig.filter((x) => x.track === "fs"),
    integrationSignals: sig.filter((x) => x.track === "integration"),
    combinationSignals: combo,
    uncertainties: unc,
    activatedRules: sig.map((x) => x.rule),
    reasons,
    openQuestions: [...new Set(open)].slice(0, 3),
    preliminaryOutcome: tracks.length ? tracks.join("+") + (keepExistingCrm ? "+keep_crm" : "") : "limited",
    clarity,
    selectedProductStartingPoint: start,
    rulesVersion: SVC_RULES_VERSION,
  };
}

// ---------- Frågor ----------

const base = { module: "customer_service" as const, countsTowardBudget: true, type: "multi" as const };
const ctxOk = (c: DialogContext) => !svcSecondary(c) && c.questionCount < NORMAL_CEILING;

export const SVC_QUESTIONS: Question[] = [
  {
    ...base, id: SQ.SV1, priority: 200,
    text: "Vilket servicearbete behöver ni framför allt bättre stöd för?",
    options: SV1_OPTIONS, showIf: svcActive,
    affects: ["customerServiceSignals", "contactCenterSignals", "fieldServiceSignals"], decisiveFor: ["serviceTrack"],
  },
  {
    ...base, id: SQ.CS1, priority: 210,
    text: "Vad behöver fungera bättre i hanteringen av kundärenden?",
    options: CS1_OPTIONS, showIf: (c) => svcActive(c) && answered(c, SQ.SV1) && csCandidate(c),
    affects: ["customerServiceSignals"], decisiveFor: ["serviceTrack"],
  },
  {
    ...base, id: SQ.CC1, priority: 220,
    text: "Vilka kanaler behöver fungera tillsammans?",
    options: CC1_OPTIONS, showIf: (c) => svcActive(c) && answered(c, SQ.SV1) && ccCandidate(c),
    affects: ["contactCenterSignals"], decisiveFor: ["serviceTrack"],
  },
  {
    ...base, id: SQ.CC2, priority: 230,
    text: "Vad behöver förbättras i hanteringen av kunddialogen?",
    options: CC2_OPTIONS,
    showIf: (c) => svcActive(c) && answered(c, SQ.CC1) && !onlyUnknown(c, SQ.CC1) && ccCandidate(c),
    affects: ["contactCenterSignals", "integrationSignals"], decisiveFor: ["serviceTrack"],
  },
  {
    ...base, id: SQ.FS1, priority: 240,
    text: "Vad behöver ni planera och styra ute hos kund?",
    options: FS1_OPTIONS, showIf: (c) => svcActive(c) && answered(c, SQ.SV1) && fsCandidate(c),
    affects: ["fieldServiceSignals", "integrationSignals"], decisiveFor: ["serviceTrack"],
  },
  {
    ...base, id: SQ.FS2, priority: 250,
    text: "Vad gör planering och genomförande svårt idag?",
    options: FS2_OPTIONS,
    // Behövs bara när FS ännu inte avgjorts av en tydlig signal eller när budget finns.
    showIf: (c) => svcActive(c) && answered(c, SQ.FS1) && !onlyUnknown(c, SQ.FS1) && !svcSecondary(c),
    skipIf: (c) => c.questionCount >= NORMAL_CEILING,
    affects: ["fieldServiceSignals"], decisiveFor: ["serviceTrack"],
  },
  {
    ...base, id: SQ.HO, priority: 260,
    text: "Hur behöver kundärenden och servicebesök hänga ihop?",
    options: HO_OPTIONS,
    showIf: (c) => { const s = signals(c); return svcActive(c) && relevant(s, "cs") && (relevant(s, "fs") || answered(c, SQ.FS1)) && !onlyUnknown(c, SQ.FS1); },
    affects: ["combinationSignals"], decisiveFor: ["combination"],
  },
  {
    ...base, id: SQ.FSDATA, priority: 265,
    text: "Var hanteras kundinformation, reservdelar och fakturering idag?",
    options: FSDATA_OPTIONS,
    showIf: (c) => svcActive(c) && relevant(signals(c), "fs") && (has(c, SQ.FS1, "parts", "equipment") || has(c, SQ.FS2, "parts")) && ctxOk(c),
    affects: ["integrationSignals"],
  },
  {
    ...base, id: SQ.NOW, priority: 270, type: "single",
    text: "Vad använder ni för kundservice och kunddialog idag?",
    options: NOW_OPTIONS,
    // Påverkar bedömningen när Contact Center är aktuellt (kan behålla befintligt CRM) eller vid produktsnabbspår.
    showIf: (c) => { const s = signals(c); return svcActive(c) && ctxOk(c) && (relevant(s, "cc") || has(c, SQ.CC2, "crm_integration") || (c.entry === "product" && ["cs", "cc"].includes(c.productStart ?? ""))); },
    affects: ["keepExistingCrm", "existingD365"],
  },
];

export const serviceModule: NeedModule = {
  id: "service",
  activeIf: svcActive,
  questions: SVC_QUESTIONS,
  evaluate: evaluateService,
};
