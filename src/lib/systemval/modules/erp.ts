// ERP-modulen (Sprint 2): Business Central kontra Finance & Supply Chain Management.
// Helt konfigurationsdriven och deterministisk. Inga storleks-, lands-, NAV/AX-
// eller "produktion = SCM"-tumregler: varje svar ger spårbara signaler och
// resultatet bygger på vilka regler som aktiverats, konflikter och saknat underlag.

import type { DialogContext, NeedModule, Option, Question } from "../config";

export const ERP_RULES_VERSION = "erp-rules-1.0.0";

export const Q = {
  ERP1: "ERP1_PROCESSER",
  ERP2: "ERP2_EKONOMI",
  ERP3: "ERP3_LAGER_LOGISTIK",
  ERP4: "ERP4_PRODUKTION",
  ERP5: "ERP5_STRUKTUR",
  ERP6: "ERP6_NULAGE",
  ERP7: "change_intent", // Återanvänd gemensam fråga från Sprint 1.
  ERP8: "ERP8_AVGORANDE_FOLJDFRAGA",
} as const;

const ERP_NEEDS = ["erp", "supply_chain", "production"] as const;
const ERP_PROBLEMS = ["closing", "inventory", "production_manual", "project_margin", "duplicate_entry"];

// ---------- Aktivering ----------

export function erpActivationReasons(c: DialogContext): string[] {
  const r: string[] = [];
  for (const n of ERP_NEEDS) if (c.needs.includes(n)) r.push(`need:${n}`);
  if (c.productStart === "bc" || c.productStart === "fscm") r.push(`product:${c.productStart}`);
  for (const p of c.problems) if (ERP_PROBLEMS.includes(p)) r.push(`problem:${p}`);
  return r;
}
export const erpActive = (c: DialogContext) => erpActivationReasons(c).length > 0;

/** ERP är sekundärt när ett annat (icke-ERP) område uttryckligen prioriterats. */
const erpSecondary = (c: DialogContext) =>
  !!c.primaryNeed && !(ERP_NEEDS as readonly string[]).includes(c.primaryNeed);

/** Normal vägs tak: kontextfrågor (prioritet 3–4) ställs inte efter 8 frågor. */
const NORMAL_CEILING = 8;

const a = (c: DialogContext, q: string) => c.answers[q] ?? [];
const has = (c: DialogContext, q: string, ...ids: string[]) => ids.some((id) => a(c, q).includes(id));
const answered = (c: DialogContext, q: string) => q in c.answers;

// ---------- Frågebank ----------

const opt = (id: string, label: string, exclusive = false): Option => ({ id, label, ...(exclusive ? { exclusive } : {}) });

const ERP1_OPTIONS: Option[] = [
  opt("finance", "Ekonomi och redovisning"),
  opt("purchasing", "Inköp och leverantörer"),
  opt("sales_orders", "Försäljningsorder och fakturering"),
  opt("warehouse", "Lager"),
  opt("logistics", "Logistik och distribution"),
  opt("production", "Produktion"),
  opt("projects", "Projekt och projektekonomi"),
  opt("service", "Service och eftermarknad"),
  opt("multi_company", "Flera bolag eller verksamhetsenheter"),
  opt("adv_finance", "Främst avancerad ekonomistyrning"),
  opt("unknown", "Vet inte", true),
];
const ERP2_OPTIONS: Option[] = [
  opt("basic", "Grundläggande redovisning och ekonomiadministration"),
  opt("multi_similar", "Flera bolag med relativt likartade processer"),
  opt("multi_different", "Flera bolag med olika processer eller styrmodeller"),
  opt("multi_country", "Verksamhet i flera länder"),
  opt("intercompany", "Omfattande koncerninterna flöden"),
  opt("adv_control", "Avancerad ekonomistyrning och uppföljning"),
  opt("dimensions", "Komplexa dimensioner, fördelningar eller interna strukturer"),
  opt("standardization", "Omfattande krav på standardisering och central styrning"),
  opt("unknown", "Vet inte", true),
];
const ERP3_OPTIONS: Option[] = [
  opt("simple", "Ett eller några relativt enkla lager"),
  opt("multi_warehouse", "Flera lager eller lagerplatser"),
  opt("adv_picking", "Mer avancerade lager- och plockprocesser"),
  opt("automation", "Lagerautomation"),
  opt("transport", "Transport- och distributionsplanering"),
  opt("traceability", "Batch-, serie- eller spårbarhetskrav"),
  opt("three_pl", "Samarbete med 3PL eller externa lager"),
  opt("complex_flows", "Komplexa flöden mellan lager, bolag eller länder"),
  opt("high_volume", "Hög transaktionsvolym eller mycket stora varuflöden"),
  opt("unknown", "Vet inte", true),
];
const ERP4_OPTIONS: Option[] = [
  opt("simple", "Enklare tillverkning eller montering"),
  opt("discrete", "Diskret produktion i flera steg"),
  opt("capacity", "Kapacitets- och resursplanering"),
  opt("multi_site", "Produktion över flera anläggningar"),
  opt("process_batch", "Process-, recept- eller batchbaserad produktion"),
  opt("quality", "Kvalitetsstyrning och spårbarhet"),
  opt("adv_planning", "Avancerad produktionsplanering"),
  opt("combination", "Kombination av flera produktionsmodeller"),
  opt("unknown", "Vet inte", true),
];
const ERP5_OPTIONS: Option[] = [
  opt("single", "Ett bolag"),
  opt("se_similar", "Flera bolag i Sverige med likartade arbetssätt"),
  opt("different", "Flera bolag med olika arbetssätt"),
  opt("intl_uniform", "Bolag i flera länder med relativt enhetliga arbetssätt"),
  opt("intl_different", "Bolag i flera länder med olika processer, regelverk eller system"),
  opt("decentralized", "Koncern med flera affärsmodeller eller decentraliserad styrning"),
  opt("unknown", "Vet inte", true),
];
const ERP6_OPTIONS: Option[] = [
  opt("bc", "Business Central"),
  opt("nav", "Dynamics NAV"),
  opt("fscm", "Dynamics\u00A0365 Finance eller Supply Chain Management"),
  opt("ax", "Dynamics AX"),
  opt("other", "Annat affärssystem"),
  opt("several", "Flera olika affärssystem"),
  opt("excel", "Främst Excel eller manuella lösningar"),
  opt("unknown", "Vet inte", true),
];

// ERP8: konfigurerade skiljefrågemallar kopplade till specifika osäkerheter.
export type Erp8Area = "finance" | "production" | "warehouse" | "intl" | "project";
export const ERP8_TEMPLATES: Record<Erp8Area, { text: string; options: Option[] }> = {
  finance: {
    text: "Är behovet främst bättre ekonomiadministration, eller krävs mer avancerad gemensam styrning över flera bolag och verksamheter?",
    options: [opt("finance_basic", "Främst bättre ekonomiadministration"), opt("finance_advanced", "Mer avancerad gemensam styrning över flera bolag och verksamheter"), opt("finance_unknown", "Vet inte", true)],
  },
  production: {
    text: "Är produktionsbehovet främst enklare tillverkning, eller krävs avancerad planering över flera resurser eller anläggningar?",
    options: [opt("production_basic", "Främst enklare tillverkning"), opt("production_advanced", "Avancerad planering över flera resurser eller anläggningar"), opt("production_unknown", "Vet inte", true)],
  },
  warehouse: {
    text: "Är lagerbehovet främst grundläggande lagerhantering, eller krävs avancerad styrning av plock, automation och komplexa flöden?",
    options: [opt("warehouse_basic", "Främst grundläggande lagerhantering"), opt("warehouse_advanced", "Avancerad styrning av plock, automation och komplexa flöden"), opt("warehouse_unknown", "Vet inte", true)],
  },
  intl: {
    text: "Är processerna i olika länder huvudsakligen enhetliga, eller behöver systemet hantera väsentligt olika processer, regelverk och systemmiljöer?",
    options: [opt("intl_basic", "Huvudsakligen enhetliga processer"), opt("intl_advanced", "Väsentligt olika processer, regelverk och systemmiljöer"), opt("intl_unknown", "Vet inte", true)],
  },
  project: {
    text: "Behöver ni främst projektekonomi i affärssystemet, eller en sammanhängande process från projektförsäljning och resursplanering till leverans och fakturering?",
    options: [opt("project_basic", "Främst projektekonomi i affärssystemet"), opt("project_advanced", "En sammanhängande projektprocess: försäljning, resursbemanning, tid och utlägg, leverans, marginal och fakturering"), opt("project_unknown", "Vet inte", true)],
  },
};

// ---------- Regelmodell ----------

export type Category =
  | "BC_RELEVANCE" | "FINANCE_RELEVANCE" | "SCM_RELEVANCE" | "COMPARISON_REQUIRED"
  | "LIMITED_EVIDENCE" | "CURRENT_SYSTEM_CONTEXT" | "PROJECT_OPERATIONS_SIGNAL" | "CONTEXT";
export type Strength = "supporting" | "relevant" | "strong" | "decisive" | "conflicting" | "unknown";
export type Area = "finance" | "warehouse" | "production" | "intl" | "project" | "structure" | "system" | "general";

export interface Rule {
  rule_id: string;
  category: Category;
  /** Fråga + svarsalternativ som aktiverar regeln (supporting_answers). */
  question: string;
  option: string;
  /** Extra villkor utöver svaret. */
  conditions?: (c: DialogContext) => boolean;
  target_track: "bc" | "finance" | "scm" | "comparison" | "context" | "po" | "limited";
  strength: Strength;
  area: Area;
  /** Användarvänlig motivering (visas i "Varför?"). */
  explanation: string;
  uncertainty?: string;
  exceptions?: string;
  possible_follow_up_question?: string;
  /** ERP8-svar som avfärdar osäkerhet inom ett område. */
  resolves?: Area;
}

const R = (r: Rule) => r;
const opsChosen = (c: DialogContext) => has(c, Q.ERP1, "warehouse", "logistics", "production");

export const RULES: Rule[] = [
  // ERP1
  R({ rule_id: "ERP1_ADV_FINANCE", category: "FINANCE_RELEVANCE", question: Q.ERP1, option: "adv_finance", target_track: "finance", strength: "relevant", area: "finance", explanation: "Ni uppger att avancerad ekonomistyrning är det centrala behovet." }),
  R({ rule_id: "ERP1_PROJECTS", category: "PROJECT_OPERATIONS_SIGNAL", question: Q.ERP1, option: "projects", target_track: "context", strength: "supporting", area: "project", explanation: "Projekt och projektekonomi ska hållas ihop i affärssystemet.", exceptions: "Skapar ingen Project Operations-signal på egen hand." }),
  R({ rule_id: "ERP1_UNKNOWN", category: "LIMITED_EVIDENCE", question: Q.ERP1, option: "unknown", target_track: "limited", strength: "unknown", area: "general", explanation: "Det är ännu oklart vilka processer systemet ska hålla ihop.", uncertainty: "Vilka processer som ska ingå är inte kartlagt.", possible_follow_up_question: "Vilka processer ska det nya affärssystemet hålla ihop från start, och vilka kan vänta?" }),
  // ERP2
  R({ rule_id: "ERP2_BASIC", category: "BC_RELEVANCE", question: Q.ERP2, option: "basic", target_track: "bc", strength: "supporting", area: "finance", explanation: "Ekonomibehovet gäller främst grundläggande redovisning och administration.", exceptions: "Ensamt inte tillräckligt för att rekommendera Business Central." }),
  R({ rule_id: "ERP2_MULTI_SIMILAR", category: "CONTEXT", question: Q.ERP2, option: "multi_similar", target_track: "context", strength: "supporting", area: "structure", explanation: "Flera bolag med likartade processer, något Business Central också kan hantera." }),
  R({ rule_id: "ERP2_MULTI_DIFFERENT", category: "FINANCE_RELEVANCE", question: Q.ERP2, option: "multi_different", target_track: "finance", strength: "strong", area: "finance", explanation: "Flera bolag med olika processer eller styrmodeller behöver styras gemensamt.", possible_follow_up_question: "Hur mycket ska bolagens processer och styrmodeller harmoniseras i det nya systemet?" }),
  R({ rule_id: "ERP2_MULTI_COUNTRY", category: "CONTEXT", question: Q.ERP2, option: "multi_country", target_track: "context", strength: "supporting", area: "intl", explanation: "Verksamheten finns i flera länder.", exceptions: "Flera länder väljer inte produkt på egen hand." }),
  R({ rule_id: "ERP2_INTERCOMPANY", category: "FINANCE_RELEVANCE", question: Q.ERP2, option: "intercompany", target_track: "finance", strength: "strong", area: "finance", explanation: "Omfattande koncerninterna flöden behöver hanteras." }),
  R({ rule_id: "ERP2_ADV_CONTROL", category: "FINANCE_RELEVANCE", question: Q.ERP2, option: "adv_control", target_track: "finance", strength: "strong", area: "finance", explanation: "Ekonomin kräver avancerad styrning och uppföljning." }),
  R({ rule_id: "ERP2_DIMENSIONS", category: "FINANCE_RELEVANCE", question: Q.ERP2, option: "dimensions", target_track: "finance", strength: "relevant", area: "finance", explanation: "Komplexa dimensioner, fördelningar eller interna strukturer behövs." }),
  R({ rule_id: "ERP2_STANDARDIZATION", category: "FINANCE_RELEVANCE", question: Q.ERP2, option: "standardization", target_track: "finance", strength: "relevant", area: "finance", explanation: "Omfattande krav på standardisering och central styrning." }),
  R({ rule_id: "ERP2_UNKNOWN", category: "LIMITED_EVIDENCE", question: Q.ERP2, option: "unknown", target_track: "limited", strength: "unknown", area: "finance", explanation: "Ekonomifunktionens krav är ännu inte kartlagda.", uncertainty: "Ekonomisk komplexitet okänd (tolkas inte som låg).", possible_follow_up_question: ERP8_TEMPLATES.finance.text }),
  // ERP3
  R({ rule_id: "ERP3_SIMPLE", category: "BC_RELEVANCE", question: Q.ERP3, option: "simple", target_track: "bc", strength: "supporting", area: "warehouse", explanation: "Lagerbehovet gäller ett eller några relativt enkla lager." }),
  R({ rule_id: "ERP3_MULTI_WAREHOUSE", category: "CONTEXT", question: Q.ERP3, option: "multi_warehouse", target_track: "context", strength: "supporting", area: "warehouse", explanation: "Flera lager eller lagerplatser.", exceptions: "Väljer inte SCM på egen hand." }),
  R({ rule_id: "ERP3_ADV_PICKING", category: "SCM_RELEVANCE", question: Q.ERP3, option: "adv_picking", target_track: "scm", strength: "strong", area: "warehouse", explanation: "Mer avancerade lager- och plockprocesser." }),
  R({ rule_id: "ERP3_AUTOMATION", category: "SCM_RELEVANCE", question: Q.ERP3, option: "automation", target_track: "scm", strength: "relevant", area: "warehouse", explanation: "Lagerautomation, vilket också ställer krav på integrationer eller tillägg." }),
  R({ rule_id: "ERP3_TRANSPORT", category: "SCM_RELEVANCE", question: Q.ERP3, option: "transport", target_track: "scm", strength: "relevant", area: "warehouse", explanation: "Transport- och distributionsplanering." }),
  R({ rule_id: "ERP3_TRACEABILITY", category: "COMPARISON_REQUIRED", question: Q.ERP3, option: "traceability", target_track: "comparison", strength: "relevant", area: "warehouse", explanation: "Krav på batch-, serie- eller spårbarhet.", exceptions: "Spårbarhet väljer inte SCM på egen hand.", possible_follow_up_question: "Hur detaljerade är kraven på spårbarhet, och finns branschkrav som styr dem?" }),
  R({ rule_id: "ERP3_3PL", category: "CONTEXT", question: Q.ERP3, option: "three_pl", target_track: "context", strength: "supporting", area: "warehouse", explanation: "Samarbete med 3PL eller externa lager (integrationsfråga).", possible_follow_up_question: "Vilka flöden behöver kopplas till 3PL eller externa lager, och hur ofta?" }),
  R({ rule_id: "ERP3_COMPLEX_FLOWS", category: "SCM_RELEVANCE", question: Q.ERP3, option: "complex_flows", target_track: "scm", strength: "strong", area: "warehouse", explanation: "Komplexa flöden mellan lager, bolag eller länder." }),
  R({ rule_id: "ERP3_HIGH_VOLUME", category: "SCM_RELEVANCE", question: Q.ERP3, option: "high_volume", target_track: "scm", strength: "relevant", area: "warehouse", explanation: "Hög transaktionsvolym eller mycket stora varuflöden (uttryckt verksamhetskrav)." }),
  R({ rule_id: "ERP3_UNKNOWN", category: "LIMITED_EVIDENCE", question: Q.ERP3, option: "unknown", target_track: "limited", strength: "unknown", area: "warehouse", explanation: "Lager- och logistikkraven är ännu inte kartlagda.", uncertainty: "Lagerkomplexitet okänd (tolkas inte som enkelt lager).", possible_follow_up_question: ERP8_TEMPLATES.warehouse.text }),
  // ERP4
  R({ rule_id: "ERP4_SIMPLE", category: "BC_RELEVANCE", question: Q.ERP4, option: "simple", target_track: "bc", strength: "supporting", area: "production", explanation: "Produktionen gäller enklare tillverkning eller montering.", exceptions: "Produktion innebär inte automatiskt SCM." }),
  R({ rule_id: "ERP4_DISCRETE", category: "COMPARISON_REQUIRED", question: Q.ERP4, option: "discrete", target_track: "comparison", strength: "relevant", area: "production", explanation: "Diskret produktion i flera steg, som behöver bedömas tillsammans med planering och anläggningar.", possible_follow_up_question: ERP8_TEMPLATES.production.text }),
  R({ rule_id: "ERP4_CAPACITY", category: "SCM_RELEVANCE", question: Q.ERP4, option: "capacity", target_track: "scm", strength: "relevant", area: "production", explanation: "Kapacitets- och resursplanering i produktionen." }),
  R({ rule_id: "ERP4_MULTI_SITE", category: "SCM_RELEVANCE", question: Q.ERP4, option: "multi_site", target_track: "scm", strength: "strong", area: "production", explanation: "Produktion över flera anläggningar." }),
  R({ rule_id: "ERP4_PROCESS_BATCH", category: "SCM_RELEVANCE", question: Q.ERP4, option: "process_batch", target_track: "scm", strength: "strong", area: "production", explanation: "Process-, recept- eller batchbaserad produktion (kan även kräva branschlösning)." }),
  R({ rule_id: "ERP4_QUALITY", category: "COMPARISON_REQUIRED", question: Q.ERP4, option: "quality", target_track: "comparison", strength: "relevant", area: "production", explanation: "Kvalitetsstyrning och spårbarhet i produktionen.", exceptions: "Avgör inte på egen hand." }),
  R({ rule_id: "ERP4_ADV_PLANNING", category: "SCM_RELEVANCE", question: Q.ERP4, option: "adv_planning", target_track: "scm", strength: "strong", area: "production", explanation: "Avancerad produktionsplanering." }),
  R({ rule_id: "ERP4_COMBINATION", category: "SCM_RELEVANCE", question: Q.ERP4, option: "combination", target_track: "scm", strength: "strong", area: "production", explanation: "Kombination av flera produktionsmodeller." }),
  R({ rule_id: "ERP4_UNKNOWN", category: "LIMITED_EVIDENCE", question: Q.ERP4, option: "unknown", target_track: "limited", strength: "unknown", area: "production", explanation: "Produktionens krav är ännu inte kartlagda.", uncertainty: "Produktionskomplexitet okänd (tolkas inte som enkel produktion).", possible_follow_up_question: ERP8_TEMPLATES.production.text }),
  // ERP5
  R({ rule_id: "ERP5_SINGLE", category: "CONTEXT", question: Q.ERP5, option: "single", target_track: "context", strength: "supporting", area: "structure", explanation: "Ett bolag.", exceptions: "Väljer inte Business Central på egen hand." }),
  R({ rule_id: "ERP5_SE_SIMILAR", category: "CONTEXT", question: Q.ERP5, option: "se_similar", target_track: "context", strength: "supporting", area: "structure", explanation: "Flera bolag i Sverige med likartade arbetssätt." }),
  R({ rule_id: "ERP5_DIFFERENT", category: "FINANCE_RELEVANCE", question: Q.ERP5, option: "different", target_track: "finance", strength: "relevant", area: "finance", explanation: "Flera bolag med olika arbetssätt ställer krav på styrning och arkitektur." }),
  R({ rule_id: "ERP5_INTL_UNIFORM", category: "CONTEXT", question: Q.ERP5, option: "intl_uniform", target_track: "context", strength: "supporting", area: "intl", explanation: "Bolag i flera länder med relativt enhetliga arbetssätt.", exceptions: "Väljer inte F&SCM på egen hand." }),
  R({ rule_id: "ERP5_INTL_DIFFERENT", category: "FINANCE_RELEVANCE", question: Q.ERP5, option: "intl_different", target_track: "finance", strength: "strong", area: "intl", explanation: "Bolag i flera länder med olika processer, regelverk eller system." }),
  R({ rule_id: "ERP5_INTL_DIFFERENT_OPS", category: "SCM_RELEVANCE", question: Q.ERP5, option: "intl_different", conditions: opsChosen, target_track: "scm", strength: "relevant", area: "intl", explanation: "Olika processer mellan länder påverkar även lager, logistik eller produktion." }),
  R({ rule_id: "ERP5_DECENTRALIZED", category: "FINANCE_RELEVANCE", question: Q.ERP5, option: "decentralized", target_track: "finance", strength: "strong", area: "finance", explanation: "Koncern med flera affärsmodeller eller decentraliserad styrning." }),
  R({ rule_id: "ERP5_UNKNOWN", category: "LIMITED_EVIDENCE", question: Q.ERP5, option: "unknown", target_track: "limited", strength: "unknown", area: "structure", explanation: "Verksamhetsstrukturen är oklar.", uncertainty: "Bolags- och landsstruktur okänd.", possible_follow_up_question: ERP8_TEMPLATES.intl.text }),
  // ERP6 (nuläge, väljer aldrig produkt)
  R({ rule_id: "ERP6_BC", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "bc", target_track: "context", strength: "supporting", area: "system", explanation: "Ni använder Business Central idag.", exceptions: "Betyder inte att BC automatiskt ska behållas eller ersättas." }),
  R({ rule_id: "ERP6_NAV", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "nav", target_track: "context", strength: "supporting", area: "system", explanation: "Ni använder Dynamics NAV idag, så migrering behöver planeras.", exceptions: "NAV innebär inte automatiskt Business Central.", possible_follow_up_question: "Vilka anpassningar i NAV behöver föras vidare, och vilka kan ersättas av standard?" }),
  R({ rule_id: "ERP6_FSCM", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "fscm", target_track: "context", strength: "supporting", area: "system", explanation: "Ni använder Finance eller Supply Chain Management idag.", exceptions: "Betyder inte automatiskt att samma lösning ska behållas." }),
  R({ rule_id: "ERP6_AX", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "ax", target_track: "context", strength: "supporting", area: "system", explanation: "Ni använder Dynamics AX idag, så migrering behöver planeras.", exceptions: "AX innebär inte automatiskt F&SCM.", possible_follow_up_question: "Vilka processer i AX är verksamhetskritiska framåt, och vilka har ni vuxit ifrån?" }),
  R({ rule_id: "ERP6_OTHER", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "other", target_track: "context", strength: "supporting", area: "system", explanation: "Ett annat affärssystem ska ersättas eller integreras." }),
  R({ rule_id: "ERP6_SEVERAL", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "several", target_track: "context", strength: "supporting", area: "system", explanation: "Flera affärssystem idag, vilket ger frågor om konsolidering och integration.", possible_follow_up_question: "Vilka av dagens system ska ersättas och vilka ska finnas kvar och integreras?" }),
  R({ rule_id: "ERP6_EXCEL", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "excel", target_track: "context", strength: "supporting", area: "system", explanation: "Idag främst Excel eller manuella lösningar, så grundläggande systemstöd behövs.", exceptions: "Väljer inte Business Central på egen hand." }),
  R({ rule_id: "ERP6_UNKNOWN", category: "CURRENT_SYSTEM_CONTEXT", question: Q.ERP6, option: "unknown", target_track: "context", strength: "unknown", area: "system", explanation: "Nuvarande system är oklart.", uncertainty: "Nuläge okänt.", possible_follow_up_question: "Vilka system används idag för ekonomi, order och lager?" }),
  // ERP8 skiljefrågor
  ...(["finance", "production", "warehouse", "intl"] as const).flatMap((ar) => [
    R({ rule_id: `ERP8_${ar.toUpperCase()}_BASIC`, category: "BC_RELEVANCE", question: Q.ERP8, option: `${ar}_basic`, target_track: "bc", strength: "strong", area: ar, resolves: ar, explanation: ({ finance: "Ekonomibehovet gäller främst bättre ekonomiadministration.", production: "Produktionsbehovet gäller främst enklare tillverkning.", warehouse: "Lagerbehovet gäller främst grundläggande lagerhantering.", intl: "Processerna i olika länder är huvudsakligen enhetliga." })[ar] }),
    R({ rule_id: `ERP8_${ar.toUpperCase()}_ADVANCED`, category: ar === "finance" || ar === "intl" ? "FINANCE_RELEVANCE" : "SCM_RELEVANCE", question: Q.ERP8, option: `${ar}_advanced`, target_track: ar === "finance" || ar === "intl" ? "finance" : "scm", strength: "strong", area: ar, explanation: ({ finance: "Mer avancerad gemensam styrning krävs över flera bolag och verksamheter.", production: "Avancerad planering krävs över flera resurser eller anläggningar.", warehouse: "Avancerad styrning av plock, automation och komplexa flöden krävs.", intl: "Systemet behöver hantera väsentligt olika processer, regelverk och systemmiljöer." })[ar] }),
    R({ rule_id: `ERP8_${ar.toUpperCase()}_UNKNOWN`, category: "LIMITED_EVIDENCE", question: Q.ERP8, option: `${ar}_unknown`, target_track: "limited", strength: "unknown", area: ar, explanation: "Den avgörande skiljefrågan är obesvarad.", uncertainty: "Skiljefrågan kunde inte besvaras.", possible_follow_up_question: ERP8_TEMPLATES[ar].text }),
  ]),
  R({ rule_id: "ERP8_PROJECT_BASIC", category: "CONTEXT", question: Q.ERP8, option: "project_basic", target_track: "context", strength: "supporting", area: "project", explanation: "Projektbehovet gäller främst projektekonomi i affärssystemet." }),
  R({ rule_id: "ERP8_PROJECT_ADVANCED", category: "PROJECT_OPERATIONS_SIGNAL", question: Q.ERP8, option: "project_advanced", target_track: "po", strength: "relevant", area: "project", explanation: "Ni behöver en sammanhängande projektprocess från försäljning och resursbemanning till leverans och fakturering." }),
  R({ rule_id: "ERP8_PROJECT_UNKNOWN", category: "LIMITED_EVIDENCE", question: Q.ERP8, option: "project_unknown", target_track: "context", strength: "unknown", area: "project", explanation: "Projektbehovets omfattning är oklar.", uncertainty: "Projektprocessens omfattning okänd.", possible_follow_up_question: ERP8_TEMPLATES.project.text }),
];

const WEIGHT: Record<Strength, number> = { supporting: 0, relevant: 1, strong: 2, decisive: 3, conflicting: 0, unknown: 0 };
/** Tröskel för "tydligt uttryckt" avancerad komplexitet inom en dimension. */
const CLEAR = 4;
const DECISIVE_QS: string[] = [Q.ERP1, Q.ERP2, Q.ERP3, Q.ERP4, Q.ERP5, Q.ERP8];

// ---------- Visningsvillkor ----------

const showERP2 = (c: DialogContext) =>
  c.productStart === "fscm" ||
  has(c, Q.ERP1, "finance", "adv_finance", "multi_company") ||
  (has(c, Q.ERP1, "unknown") && (c.needs.includes("erp") || c.problems.includes("closing")));
const showERP3 = (c: DialogContext) =>
  has(c, Q.ERP1, "warehouse", "logistics") ||
  (has(c, Q.ERP1, "unknown") && (c.needs.includes("supply_chain") || c.problems.includes("inventory") || c.productStart === "fscm"));
const showERP4 = (c: DialogContext) =>
  has(c, Q.ERP1, "production") ||
  (has(c, Q.ERP1, "unknown") && (c.needs.includes("production") || c.problems.includes("production_manual")));
const showERP5 = (c: DialogContext) =>
  !erpSecondary(c) &&
  (has(c, Q.ERP2, "multi_country") ||
    (has(c, Q.ERP1, "multi_company") && !has(c, Q.ERP2, "multi_similar", "multi_different")));

const PENDING_CORE: [string, (c: DialogContext) => boolean][] = [
  [Q.ERP1, () => true], [Q.ERP2, showERP2], [Q.ERP3, showERP3], [Q.ERP4, showERP4], [Q.ERP5, showERP5],
];
const corePending = (c: DialogContext) => PENDING_CORE.some(([id, show]) => show(c) && !answered(c, id));

// ---------- Utvärdering ----------

export interface ErpCore {
  active: Rule[];
  fin: number;
  scm: number;
  comparison: Rule[];
  context: Rule[];
  bc: Rule[];
  unknowns: Rule[];
}

function core(c: DialogContext, includeErp8 = true): ErpCore {
  const active = RULES.filter(
    (r) => (includeErp8 || r.question !== Q.ERP8) && has(c, r.question, r.option) && (r.conditions?.(c) ?? true),
  );
  const resolved = new Set(active.filter((r) => r.resolves).map((r) => r.resolves!));
  const live = active.filter((r) => r.resolves || !resolved.has(r.area) || r.target_track === "bc" || r.target_track === "context");
  const sum = (t: Rule["target_track"]) => live.filter((r) => r.target_track === t).reduce((s, r) => s + WEIGHT[r.strength], 0);
  return {
    active: live,
    fin: sum("finance"),
    scm: sum("scm"),
    comparison: live.filter((r) => r.target_track === "comparison"),
    context: live.filter((r) => r.category === "CONTEXT" && r.question !== Q.ERP1),
    bc: live.filter((r) => r.target_track === "bc"),
    unknowns: live.filter((r) => r.strength === "unknown" && DECISIVE_QS.includes(r.question)),
  };
}

export type Outcome = "bc" | "fscm" | "compare" | "limited";
export type Driver = "finance" | "scm" | "both" | null;
export type Clarity = "clear" | "multiple" | "limited";

function decide(c: DialogContext, k: ErpCore, unanswered: string[]): { outcome: Outcome; driver: Driver; rules: string[] } {
  const rules: string[] = [];
  if (!answered(c, Q.ERP1)) return { outcome: "limited", driver: null, rules: ["OUT_LIMITED_NO_PROCESSES"] };
  const finClear = k.fin >= CLEAR, scmClear = k.scm >= CLEAR;
  if (finClear || scmClear) {
    const driver: Driver = finClear && scmClear ? "both" : finClear ? "finance" : "scm";
    rules.push(`OUT_FSCM_${driver.toUpperCase()}`);
    return { outcome: "fscm", driver, rules };
  }
  const concreteComplexity = [Q.ERP2, Q.ERP3, Q.ERP4, Q.ERP5].some((q) => a(c, q).some((v) => v !== "unknown"));
  if (k.unknowns.length >= 2 || (has(c, Q.ERP1, "unknown") && !concreteComplexity)) {
    return { outcome: "limited", driver: null, rules: ["OUT_LIMITED_UNKNOWNS"] };
  }
  const breadth = k.comparison.length >= 1 && k.context.length >= 2;
  if (k.fin > 0 || k.scm > 0 || k.comparison.length >= 2 || breadth) {
    if (k.fin > 0) rules.push("CMP_PARTIAL_FINANCE");
    if (k.scm > 0) rules.push("CMP_PARTIAL_SCM");
    if (k.comparison.length >= 2) rules.push("CMP_MULTIPLE_COMPARISON_SIGNALS");
    if (breadth) rules.push("CMP_BREADTH");
    return { outcome: "compare", driver: null, rules };
  }
  if (k.unknowns.length >= 1 || unanswered.length >= 1) return { outcome: "limited", driver: null, rules: ["OUT_LIMITED_OPEN_DECISIVE"] };
  rules.push(k.bc.length > 0 ? "OUT_BC_SUPPORTED" : "OUT_BC_NO_ADVANCED_NEEDS");
  return { outcome: "bc", driver: null, rules };
}

/** Välj skiljefrågans mall utifrån osäkerhet (utan ERP8-svaret). Fast områdesordning. */
export function erp8Area(c: DialogContext): Erp8Area | null {
  if (!erpActive(c) || corePending(c)) return null;
  const k = core(c, false);
  const d = decide(c, k, []);
  const areaHas = (ar: Area) =>
    k.active.some((r) => r.area === ar && (r.target_track === "finance" || r.target_track === "scm" || r.target_track === "comparison" || r.strength === "unknown"));
  const candidates: Erp8Area[] = [];
  if (d.outcome === "fscm") {
    // Avgör om F&SCM drivs av Finance, SCM eller båda.
    if (d.driver === "finance" && k.scm > 0) candidates.push(areaHas("production") ? "production" : "warehouse");
    if (d.driver === "scm" && k.fin > 0) candidates.push("finance");
  } else if (d.outcome === "compare" || d.outcome === "limited" || k.comparison.length > 0) {
    for (const ar of ["finance", "production", "warehouse", "intl"] as const) if (areaHas(ar)) candidates.push(ar);
    if (candidates.length === 0 && has(c, Q.ERP2, "multi_country") && !answered(c, Q.ERP5)) candidates.push("intl");
  }
  if (candidates[0]) return candidates[0];
  if (has(c, Q.ERP1, "projects") && !erpSecondary(c) && c.questionCount < NORMAL_CEILING) return "project";
  return null;
}

export interface ErpResult {
  activated: boolean;
  activationReason: string[];
  selectedProductStartingPoint: string | null;
  processNeeds: string[];
  financialComplexity: string[];
  operationalComplexity: string[];
  warehouseNeeds: string[];
  logisticsNeeds: string[];
  productionNeeds: string[];
  companyStructure: string | null;
  currentSystem: string | null;
  changeIntent: string | null;
  projectOperationsSignal: boolean;
  existingSolutionInvestigation: boolean;
  bcSignals: string[];
  financeSignals: string[];
  scmSignals: string[];
  comparisonSignals: string[];
  uncertainties: string[];
  unansweredDecisiveQuestions: string[];
  activatedRules: string[];
  preliminaryOutcome: Outcome;
  fscmDriver: Driver;
  clarity: Clarity;
  /** Användarvänliga motiveringar (utan rule_id). */
  reasons: string[];
  /** 1–3 personliga, obesvarade frågor. */
  openQuestions: string[];
  rulesVersion: string;
}

const LOGISTICS = ["transport", "three_pl", "complex_flows"];

export function evaluateErp(c: DialogContext): ErpResult {
  const k = core(c);
  const unanswered = ERP_MODULE_QUESTIONS.filter(
    (q) => DECISIVE_QS.includes(q.id) && !answered(c, q.id) && q.showIf(c) && !(q.skipIf?.(c)),
  ).map((q) => q.id);
  const d = decide(c, k, unanswered);
  const ids = (t: Rule["target_track"]) => k.active.filter((r) => r.target_track === t).map((r) => r.rule_id);

  const po = k.active.some((r) => r.target_track === "po");
  const sys = a(c, Q.ERP6)[0] ?? null;
  const intent = a(c, Q.ERP7)[0] ?? null;
  const existing = !!sys && ["bc", "nav", "fscm", "ax"].includes(sys) && !!intent && ["improve", "integrate"].includes(intent);

  const uncertainties = [...new Set(k.active.filter((r) => r.uncertainty).map((r) => r.uncertainty!))];
  for (const id of unanswered) uncertainties.push(`Obesvarad avgörande fråga: ${id}`);

  // Varför: aktiva behov och regler i verksamhetsspråk.
  const reasons = k.active
    .filter((r) => r.strength !== "unknown" && r.category !== "CURRENT_SYSTEM_CONTEXT")
    .sort((x, y) => WEIGHT[y.strength] - WEIGHT[x.strength])
    .map((r) => r.explanation);

  // Personliga, obesvarade frågor (max 3).
  const open: string[] = [];
  const push = (s?: string) => { if (s && !open.includes(s) && open.length < 3) open.push(s); };
  for (const r of k.active) if (r.strength === "unknown") push(r.possible_follow_up_question);
  if (d.outcome === "compare") {
    const asked = a(c, Q.ERP8)[0]?.split("_")[0];
    for (const ar of ["finance", "production", "warehouse", "intl"] as const) {
      if (ar === asked) continue;
      if (k.active.some((r) => r.area === ar && ["finance", "scm", "comparison"].includes(r.target_track))) push(ERP8_TEMPLATES[ar].text);
    }
  }
  for (const r of k.active) if (r.strength !== "unknown") push(r.possible_follow_up_question);
  if (unanswered.includes(Q.ERP8)) { const ar = erp8Area(c); if (ar) push(ERP8_TEMPLATES[ar].text); }

  const clarity: Clarity = d.outcome === "compare" ? "multiple" : d.outcome === "limited" ? "limited" : "clear";

  return {
    activated: true,
    activationReason: erpActivationReasons(c),
    selectedProductStartingPoint: c.productStart && c.productStart !== "unsure" ? c.productStart : null,
    processNeeds: a(c, Q.ERP1),
    financialComplexity: a(c, Q.ERP2),
    operationalComplexity: [...a(c, Q.ERP3), ...a(c, Q.ERP4)].filter((v) => v !== "unknown"),
    warehouseNeeds: a(c, Q.ERP3).filter((v) => !LOGISTICS.includes(v)),
    logisticsNeeds: a(c, Q.ERP3).filter((v) => LOGISTICS.includes(v)),
    productionNeeds: a(c, Q.ERP4),
    companyStructure: a(c, Q.ERP5)[0] ?? null,
    currentSystem: sys,
    changeIntent: intent,
    projectOperationsSignal: po,
    existingSolutionInvestigation: existing,
    bcSignals: ids("bc"),
    financeSignals: ids("finance"),
    scmSignals: ids("scm"),
    comparisonSignals: ids("comparison"),
    uncertainties,
    unansweredDecisiveQuestions: unanswered,
    activatedRules: [...k.active.map((r) => r.rule_id), ...d.rules, ...(po ? ["PO_SIGNAL"] : []), ...(existing ? ["EXISTING_SOLUTION_FIRST"] : [])],
    preliminaryOutcome: d.outcome,
    fscmDriver: d.driver,
    clarity,
    reasons: [...new Set(reasons)],
    openQuestions: open,
    rulesVersion: ERP_RULES_VERSION,
  };
}

// ---------- Frågor ----------

const base = { module: "erp" as const, countsTowardBudget: true, type: "multi" as const };

export const ERP_MODULE_QUESTIONS: Question[] = [
  {
    ...base, id: Q.ERP1, priority: 100,
    text: "Vilka delar av verksamheten behöver det nya affärssystemet framför allt hålla ihop?",
    options: ERP1_OPTIONS, showIf: erpActive,
    affects: ["processNeeds", "projectOperationsSignal"], decisiveFor: ["mainTrack"],
  },
  {
    ...base, id: Q.ERP2, priority: 110,
    text: "Vad behöver ekonomifunktionen kunna hantera?",
    options: ERP2_OPTIONS, showIf: (c) => erpActive(c) && answered(c, Q.ERP1) && showERP2(c),
    affects: ["financialComplexity", "financeSignals"], decisiveFor: ["mainTrack", "fscmDriver"],
  },
  {
    ...base, id: Q.ERP4, priority: 120,
    text: "Vilken typ av produktion behöver systemet stödja?",
    options: ERP4_OPTIONS, showIf: (c) => erpActive(c) && answered(c, Q.ERP1) && showERP4(c),
    affects: ["productionNeeds", "scmSignals"], decisiveFor: ["mainTrack", "fscmDriver"],
  },
  {
    ...base, id: Q.ERP3, priority: 130,
    text: "Vad behöver lager och logistik kunna hantera?",
    options: ERP3_OPTIONS, showIf: (c) => erpActive(c) && answered(c, Q.ERP1) && showERP3(c),
    affects: ["warehouseNeeds", "logisticsNeeds", "scmSignals"], decisiveFor: ["mainTrack", "fscmDriver"],
  },
  {
    ...base, id: Q.ERP5, priority: 140, type: "single",
    text: "Hur ser verksamhetsstrukturen ut?",
    options: ERP5_OPTIONS, showIf: (c) => erpActive(c) && answered(c, Q.ERP1) && showERP5(c),
    affects: ["companyStructure"], decisiveFor: ["mainTrack"],
  },
  {
    ...base, id: Q.ERP8, priority: 150, type: "single",
    text: (c) => { const ar = erp8Area(c); return ar ? ERP8_TEMPLATES[ar].text : ""; },
    options: (c) => { const ar = erp8Area(c); return ar ? ERP8_TEMPLATES[ar].options : []; },
    showIf: (c) => erp8Area(c) !== null,
    affects: ["comparisonSignals", "projectOperationsSignal"], decisiveFor: ["mainTrack", "fscmDriver"],
  },
  {
    ...base, id: Q.ERP6, priority: 160, type: "single",
    text: "Vilket affärssystem använder ni huvudsakligen idag?",
    options: ERP6_OPTIONS,
    showIf: (c) =>
      erpActive(c) && !corePending(c) && !erpSecondary(c) &&
      (c.entry === "product" || has(c, Q.ERP7, "replace", "improve", "integrate", "consolidate")),
    skipIf: (c) => c.questionCount >= NORMAL_CEILING,
    affects: ["currentSystem"],
  },
];

export const erpModule: NeedModule = {
  id: "erp",
  activeIf: erpActive,
  // Förändringsavsikten (ERP7) begärs först när huvudspåret belysts och budget finns.
  requestsCommon: (c) =>
    answered(c, Q.ERP1) && !corePending(c) && !erpSecondary(c) && c.questionCount < NORMAL_CEILING &&
    (erp8Area(c) === null || answered(c, Q.ERP8))
      ? ["change_intent"]
      : [],
  questions: ERP_MODULE_QUESTIONS,
  evaluate: evaluateErp,
};
