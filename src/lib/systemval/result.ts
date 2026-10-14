// Sprint 6: gemensam resultatmodell för "Vi står inför ett systemval".
// Ren och deterministisk: läser endast Sprint 3-lösningsbilden och Sprint 5-lösningskartan.
// Bygger ingen egen bedömning; väljer konfigurerade texter, en primär CTA och högst två sekundära
// från ett register över verifierade destinationer. Ingen fri AI, inga poäng.

import type { DialogState } from "./engine";
import type { ErpResult } from "./modules/erp";
import { SOLUTION_INFO, type SolutionId, type SolutionPicture } from "./solutions";
import type { Dependency, MapClarity, SolutionMap } from "./solutionMap";
import { SOLUTION_MAP_VERSION } from "./solutionMap";

export const RESULT_VERSION = "result-1.0.0";
const D = "Dynamics\u00A0365";
const short = (id: SolutionId) => SOLUTION_INFO[id].label.replace(`${D} `, "");

// ---------- Destinationsregister (inventerat mot routerna i App.tsx) ----------

export type DestinationId =
  | "compare_erp" | "plan" | "needs_analysis"
  | `product_${SolutionId}` | `match_${SolutionId}` | `partners_${SolutionId}`;
export interface Destination {
  destinationId: DestinationId;
  route: string;
  /** Parametrar som mottagande sida faktiskt läser. Inga påhittade filter. */
  supportedParameters: string[];
  /** Hur svar kan följa med: "local_plan" = sparas lokalt i Min D365-plan, "none" = ingen överföring. */
  supportedStateTransfer: "local_plan" | "none";
  eligibilityConditions: string;
  fallbackDestination: DestinationId | null;
  verified: boolean;
}

const PRODUCT_ROUTE: Partial<Record<SolutionId, string>> = {
  bc: "/businesscentral/", finance: "/finance-supply-chain/", scm: "/finance-supply-chain/", fscm: "/finance-supply-chain/",
  sales: "/d365sales/", ci: "/d365marketing/", cs: "/d365customerservice/", cc: "/d365contactcenter/", fs: "/d365fieldservice/", po: "/d365projectoperations/",
};
const MATCH_ROUTE: Partial<Record<SolutionId, string>> = {
  bc: "/businesscentral/matchningstest/", finance: "/finance-supply-chain-management/matchningstest/", scm: "/finance-supply-chain-management/matchningstest/",
  fscm: "/finance-supply-chain-management/matchningstest/", sales: "/d365sales/matchningstest/", ci: "/d365marketing/matchningstest/",
  cs: "/d365customerservice/matchningstest/", cc: "/d365contactcenter/matchningstest/", fs: "/d365fieldservice/matchningstest/",
  // Project Operations saknar matchningstest: fallback till behovsanalys.
};
const PARTNER_ROUTE: Partial<Record<SolutionId, string>> = {
  bc: "/business-central-partners-sverige/", finance: "/finance-supply-chain-partners-sverige/", scm: "/finance-supply-chain-partners-sverige/",
  fscm: "/finance-supply-chain-partners-sverige/", sales: "/dynamics-365-sales-partners-sverige/", ci: "/dynamics-365-marketing-partners-sverige/",
  cs: "/dynamics-365-customer-service-partners-sverige/", cc: "/dynamics-365-contact-center-partners-sverige/", fs: "/dynamics-365-field-service-partners-sverige/",
  // Project Operations saknar egen partnersida: fallback till alla partners.
};

export function getDestination(id: DestinationId): Destination {
  const base = { supportedParameters: [] as string[], supportedStateTransfer: "none" as const, fallbackDestination: null, verified: true };
  if (id === "compare_erp") return { ...base, destinationId: id, route: "/affarssystem/", eligibilityConditions: "BC och F&SCM är alternativ" };
  if (id === "plan") return { ...base, destinationId: id, route: "/underlag/", supportedStateTransfer: "local_plan", eligibilityConditions: "Flera områden eller beslutsunderlag" };
  if (id === "needs_analysis") return { ...base, destinationId: id, route: "/behovsanalys/", eligibilityConditions: "Begränsat underlag utan matchningstest" };
  const [kind, sid] = id.split("_") as [string, SolutionId];
  const table = kind === "product" ? PRODUCT_ROUTE : kind === "match" ? MATCH_ROUTE : PARTNER_ROUTE;
  const route = table[sid];
  const fallback: DestinationId = kind === "partners" ? "plan" : kind === "match" ? "needs_analysis" : "needs_analysis";
  if (!route) {
    const fb = kind === "partners" ? { route: "/alla-d365-partners/" } : getDestination(fallback);
    return { ...base, destinationId: id, route: fb.route, eligibilityConditions: "Saknad destination, fallback används", fallbackDestination: kind === "partners" ? null : fallback, verified: false };
  }
  return { ...base, destinationId: id, route, eligibilityConditions: kind === "partners" ? "Tydlig lösningsbild och köpresa mot partnerval" : "Identifierat spår", fallbackDestination: fallback };
}

// ---------- Resultatmodell ----------

export interface TrackCard { id: SolutionId; label: string; explanation: string; why: string[]; validate: string }
export interface AlternativeCard { labels: string[]; whyBoth: string; differences: string[]; missingAnswer: string }
export interface ComplementCard { id: SolutionId; label: string; need: string; whyNotMain: string; timing: string }
export interface Cta { label: string; destinationId: DestinationId; route: string; kind: string; transfer: boolean }
export const DEP_LABEL: Record<Dependency["kind"], string> = {
  integration: "Integrationsbehov", process: "Processöverlämning", system_boundary: "Systemgräns att utreda", keep_existing: "Befintligt system",
};

export interface SystemvalResult {
  needsInterpretation: string;
  selectedStartingPoint: { label: string; differs: boolean } | null;
  primaryTracks: TrackCard[];
  alternativeTracks: AlternativeCard[];
  complementaryTracks: ComplementCard[];
  moreTracks: ComplementCard[];
  laterPhaseTracks: { label: string; text: string }[];
  phasingNote: string | null;
  integrationDependencies: Dependency[];
  processDependencies: Dependency[];
  unresolvedQuestions: string[];
  clarity: MapClarity;
  clarityText: string;
  methodologyExplanation: string[];
  primaryCTA: Cta;
  secondaryCTAs: Cta[];
  ctaReason: string;
  disclaimer: string;
  ruleVersion: string;
  debug: Record<string, unknown>;
}

export const CLARITY_LABEL: Record<MapClarity, string> = { clear: "Tydlig riktning", multiple: "Flera möjliga vägar", limited: "Begränsat underlag" };
const CLARITY_TEXT: Record<MapClarity, string> = {
  clear: "De avgörande behoven är belysta och pekar åt samma håll. Detaljerna behöver fortfarande valideras.",
  multiple: "Mer än en väg framstår som realistisk. En jämförelse eller prioritering behövs innan valet.",
  limited: "Flera avgörande frågor saknar svar, så vi gissar inte. Börja med att fördjupa underlaget.",
};

const EXPLAIN: Partial<Record<SolutionId, string>> = {
  bc: "Ett sammanhållet affärssystem för ekonomi, order, inköp, lager och projekt i små och medelstora verksamheter.",
  fscm: "Ett mer omfattande affärssystem för komplex ekonomistyrning, flera bolag och länder samt avancerade lager- och produktionsflöden.",
  finance: "Den ekonomidelen av Finance & Supply Chain Management, för komplex ekonomistyrning i flera bolag och länder.",
  scm: "Supply chain-delen av Finance & Supply Chain Management, för avancerade lager-, logistik- och produktionsflöden.",
  sales: "Stöd för leads, affärsmöjligheter, kundrelationer och säljprognoser.",
  ci: "Stöd för kunddata, segmentering, kundresor och kommunikation.",
  cs: "Stöd för strukturerad ärendehantering, SLA, eskalering och kunskapsartiklar.",
  cc: "Stöd för kanalhantering, köer och routing av inkommande kontakter.",
  fs: "Stöd för arbetsorder, planering av tekniker och arbete ute hos kund.",
  po: "Stöd för projektlivscykeln: projektförsäljning, resursbemanning, tid, leverans och fakturering.",
};
const VALIDATE: Partial<Record<SolutionId, string>> = {
  bc: "Validera att lager-, produktions- och bolagsstrukturen ryms i standard och vilka tillägg som behövs.",
  fscm: "Validera att komplexiteten motiverar en större lösning, och vad den innebär i tid och kostnad.",
  finance: "Validera vilka krav på ekonomistyrning som är avgörande.",
  scm: "Validera hur avancerade lager- och produktionsprocesserna behöver vara.",
  sales: "Validera hur säljprocessen ser ut och vilka kopplingar som behövs till andra system.",
  ci: "Validera vilka kunddatakällor som finns och vem som äger kundresorna.",
  cs: "Validera vilka ärendetyper och kanaler som ska ingå från start.",
  cc: "Validera om kanalerna behöver köer och routing eller om enklare kanalhantering räcker.",
  fs: "Validera hur planering, reservdelar och återrapportering ska fungera ute hos kund.",
  po: "Validera om projektprocessen omfattar resursbemanning och leverans eller främst ekonomisk uppföljning.",
};
const NEED_TEXT: Partial<Record<SolutionId, string>> = {
  sales: "säljprocessen", ci: "marknadsföring och kunddata", cs: "ärendehanteringen", cc: "kanalhanteringen",
  fs: "arbetet ute hos kund", po: "projektlivscykeln", bc: "affärssystemet", fscm: "affärssystemet", finance: "ekonomin", scm: "verksamhetsflödena",
};
const INTENT_TEXT: Record<string, string> = {
  introduce: "Ni vill införa systemstöd som saknas idag.",
  replace: "Ni vill ersätta ett befintligt system.",
  consolidate: "Ni vill samla flera system i en gemensammare lösning.",
  improve: "Ni vill förbättra eller modernisera nuvarande lösning.",
  integrate: "Ni vill koppla ihop system som ska finnas kvar.",
};
const PRODUCT_START_LABEL: Record<string, string> = {
  bc: "Business Central", fscm: "Finance & Supply Chain Management", sales: "Sales", ci: "Customer Insights",
  cs: "Customer Service", cc: "Contact Center", fs: "Field Service", po: "Project Operations",
};

export const RESULT_DISCLAIMER = "Detta är en preliminär vägledning utifrån era svar, inte ett systembeslut eller en kravspecifikation. Vilken lösning som passar behöver valideras tillsammans med er verksamhet.";

export function buildSystemvalResult(state: DialogState, p: SolutionPicture, m: SolutionMap): SystemvalResult {
  const erp = state.moduleResults.erp as ErpResult | undefined;
  const intent = state.activeAnswers.change_intent?.[0];
  const byId = new Map(p.primary.concat(p.complementary).map((s) => [s.id, s]));

  // A. Tolkning: 2–4 meningar från konfigurerade block.
  const sentences = p.interpretation.split(/(?<=\.)\s+/).filter(Boolean).slice(0, 2);
  if (intent && INTENT_TEXT[intent]) sentences.push(INTENT_TEXT[intent]);
  if (m.start.length && m.complements.length && state.prioritySetting === "primary")
    sentences.push(`${m.complements.map((c) => short(c.id as SolutionId)).join(" och ")} framstår som kompletterande behov snarare än utgångspunkten.`);
  const needsInterpretation = sentences.slice(0, 4).join(" ");

  // Utgångspunkt (produktsnabbspåret)
  const ps = state.productStart && state.productStart !== "unsure" ? state.productStart : null;
  const startIds = m.start.map((t) => t.id as SolutionId);
  const covered = (sp: string) => startIds.includes(sp as SolutionId) || (sp === "fscm" && startIds.some((x) => ["finance", "scm"].includes(x)));
  const selectedStartingPoint = ps ? { label: PRODUCT_START_LABEL[ps], differs: !covered(ps) } : null;

  // B. Huvudspår
  const alternativeIds = new Set(m.alternatives.flatMap((a) => a.options.map((o) => o.id)));
  const primaryTracks: TrackCard[] = startIds.filter((id) => !(m.alternatives.some((a) => a.need === "affärssystem") && alternativeIds.has(id))).map((id) => ({
    id, label: SOLUTION_INFO[id].label, explanation: EXPLAIN[id] ?? "",
    why: byId.get(id)?.reasons ?? [], validate: VALIDATE[id] ?? "",
  }));

  // C. Alternativ
  const alternativeTracks: AlternativeCard[] = m.alternatives.map((a) => a.need === "affärssystem"
    ? {
      labels: a.options.map((o) => o.label),
      whyBoth: "Era krav inom ekonomi och verksamhetsflöden ligger i gränslandet, så båda lösningarna är fortfarande möjliga.",
      differences: ["Hur komplex ekonomistyrning och bolagsstruktur är", "Hur avancerade lager-, logistik- och produktionsflöden behöver vara", "Vad införande och drift innebär i tid och kostnad"],
      missingAnswer: erp?.openQuestions[0] ?? "Vilka krav inom ekonomi och verksamhetsflöden som är avgörande.",
    }
    : {
      labels: a.options.map((o) => o.label),
      whyBoth: "Projektbehovet går längre än enkel projektekonomi, men inte tydligt så långt att ett eget projektsystem krävs.",
      differences: ["Om resursbemanning och kapacitetsplanering behöver ingå", "Om försäljning, leverans och fakturering ska hänga ihop i ett flöde", "Var systemgränsen mot affärssystemet bör gå"],
      missingAnswer: a.why,
    });

  // D. Komplement (högst tre framträdande)
  const depKeys = m.dependencies.map((d) => d.key);
  const toComp = (t: { id: string }): ComplementCard => {
    const id = t.id as SolutionId;
    const linked = depKeys.some((k) => k.includes(id) || (["bc", "fscm", "finance", "scm"].includes(id) && k.includes("erp")));
    return {
      id, label: SOLUTION_INFO[id].label,
      need: `Stödjer ett separat uttryckt behov kring ${NEED_TEXT[id] ?? "ett annat område"}.`,
      whyNotMain: state.primaryNeed ? "Det är inte det område ni prioriterade högst." : "Behovet framstår som kompletterande till huvudspåret.",
      timing: linked ? "Bör utvärderas samtidigt, eftersom det finns ett samband med huvudspåret." : "Kan utvärderas samtidigt eller senare.",
    };
  };
  const comps = m.complements.map(toComp);

  // E. Senare etapp
  const startNames = startIds.map(short).join(" och ");
  const laterPhaseTracks = m.later.map((t) => ({
    label: t.label,
    text: `Börja med ${startNames || "det prioriterade området"}. Utvärdera därefter ${short(t.id as SolutionId)} när de första flödena är definierade.`,
  }));

  // F. Beroenden
  const integrationDependencies = m.dependencies.filter((d) => d.kind !== "process");
  const processDependencies = m.dependencies.filter((d) => d.kind === "process");

  // Metodförklaring (användarspråk, inga regel-id)
  const method: string[] = [];
  if (state.primaryNeed) method.push("Huvudspåret utgår från det område ni angav som viktigast.");
  else if (state.prioritySetting === "equal") method.push("Ni angav flera områden som lika viktiga, därför visas flera parallella huvudspår.");
  for (const t of primaryTracks) if (t.why[0]) method.push(`${short(t.id)}: ${t.why[0]}`);
  if (alternativeTracks.length) method.push("Alternativ visas när två lösningar kan stödja samma behov och era svar ännu inte skiljer dem åt.");
  if (comps.length) method.push("Komplement visas bara när ni uttryckt ett separat behov som de stödjer.");
  if (m.later.length) method.push("Senare etapp föreslås för det ni inte prioriterade och som saknar processberoende till starten.");
  if (m.dependencies.length) method.push("Beroenden visas separat och leder inte i sig till fler produkter.");
  if (selectedStartingPoint) method.push(selectedStartingPoint.differs
    ? `Er valda utgångspunkt var ${selectedStartingPoint.label}. Vår preliminära bedömning utgår från de behov ni beskrivit och skiljer sig därför.`
    : `Er valda utgångspunkt var ${selectedStartingPoint.label}, och era svar stödjer den.`);

  // ---------- CTA-val ----------
  const p0 = (primaryTracks[0]?.id ?? startIds[0]) as SolutionId | undefined;
  const breadth = startIds.length + m.complements.length + m.later.length;
  const cta = (destinationId: DestinationId, label: string, kind: string): Cta => {
    const d = getDestination(destinationId);
    return { label, destinationId, route: d.route, kind, transfer: d.supportedStateTransfer === "local_plan" };
  };
  let primaryCTA: Cta; let ctaReason: string;
  if (m.clarity === "limited") {
    const anyId = (p0 ?? (p.investigate[0]?.id as SolutionId | undefined));
    const md = anyId ? getDestination(`match_${anyId}`) : getDestination("needs_analysis");
    primaryCTA = md.verified && anyId ? cta(`match_${anyId}`, "Fortsätt till en mer detaljerad behovsanalys", "deepen_analysis") : cta("needs_analysis", "Fortsätt till en mer detaljerad behovsanalys", "deepen_analysis");
    ctaReason = "Begränsat underlag: fördjupning före partnerval.";
  } else if (m.alternatives.some((a) => a.need === "affärssystem")) {
    primaryCTA = cta("compare_erp", "Jämför Business Central och Finance & Supply Chain Management", "compare");
    ctaReason = "Två verkliga ERP-alternativ.";
  } else if (m.alternatives.length) {
    primaryCTA = cta("product_po", "Läs om Project Operations och var gränsen mot affärssystemet går", "deepen_product");
    ctaReason = "Gränsfall ERP-projekt/Project Operations; ingen verifierad jämförelsesida finns, produktsidan används.";
  } else if (breadth >= 3 || startIds.length >= 2) {
    primaryCTA = cta("plan", "Fortsätt till er D365-plan", "plan");
    ctaReason = "Flera verksamhetsområden behöver hållas ihop.";
  } else if (m.clarity === "clear" && ["replace", "consolidate"].includes(intent ?? "") && p0 && getDestination(`partners_${p0}`).verified) {
    primaryCTA = cta(`partners_${p0}`, `Hitta relevanta ${D}-partners`, "partners");
    ctaReason = "Tydligt spår och avsikt att ersätta eller samla system.";
  } else if (p0) {
    primaryCTA = cta(`product_${p0}`, `Läs mer om ${short(p0)}`, "deepen_product");
    ctaReason = "Tydligt produktspår i en utforskande köpresa.";
  } else {
    primaryCTA = cta("needs_analysis", "Fortsätt till en mer detaljerad behovsanalys", "deepen_analysis");
    ctaReason = "Inget huvudspår: fallback till behovsanalys.";
  }

  const secondary: Cta[] = [];
  const pushSec = (c: Cta) => { if (secondary.length < 2 && c.route !== primaryCTA.route && !secondary.some((s) => s.route === c.route)) secondary.push(c); };
  if (primaryCTA.kind !== "plan") pushSec(cta("plan", "Spara i er D365-plan", "plan"));
  if (p0 && primaryCTA.kind !== "deepen_product") pushSec(cta(`product_${p0}`, `Läs om ${short(p0)}`, "deepen_product"));
  if (m.clarity === "clear" && p0 && primaryCTA.kind !== "partners" && getDestination(`partners_${p0}`).verified) pushSec(cta(`partners_${p0}`, "Se relevanta partners", "partners"));

  const transferred = ["needs", "primaryNeed", "primaryTracks", "alternatives", "complements", "openQuestions", "changeIntent"];
  const omitted = ["debug", "inactiveAnswers", "interactionHistory", "activatedRules", "signals", "personalData"];

  return {
    needsInterpretation,
    selectedStartingPoint,
    primaryTracks,
    alternativeTracks,
    complementaryTracks: comps.slice(0, 3),
    moreTracks: comps.slice(3),
    laterPhaseTracks,
    phasingNote: m.phasingNote,
    integrationDependencies,
    processDependencies,
    unresolvedQuestions: m.openQuestions.slice(0, 3),
    clarity: m.clarity,
    clarityText: CLARITY_TEXT[m.clarity],
    methodologyExplanation: method,
    primaryCTA,
    secondaryCTAs: secondary,
    ctaReason,
    disclaimer: RESULT_DISCLAIMER,
    ruleVersion: `${RESULT_VERSION}/${SOLUTION_MAP_VERSION}`,
    debug: {
      finalNeedsInterpretation: needsInterpretation,
      finalPrimaryTracks: primaryTracks.map((t) => t.id),
      finalAlternativeTracks: alternativeTracks.map((a) => a.labels),
      finalComplementaryTracks: comps.map((c) => c.id),
      finalLaterPhaseTracks: m.later.map((t) => t.id),
      finalIntegrationDependencies: integrationDependencies.map((d) => d.key),
      finalProcessDependencies: processDependencies.map((d) => d.key),
      finalUnresolvedQuestions: m.openQuestions,
      finalClarity: m.clarity,
      selectedPrimaryCTA: primaryCTA.kind,
      secondaryCTAs: secondary.map((s) => s.destinationId),
      CTASelectionReason: ctaReason,
      destinationId: primaryCTA.destinationId,
      destinationVerified: getDestination(primaryCTA.destinationId).verified,
      transferredStateFields: primaryCTA.transfer ? transferred : [],
      omittedStateFields: omitted,
      reasonForClassification: m.debug.reasonForClassification,
      resultRuleVersion: `${RESULT_VERSION}/${SOLUTION_MAP_VERSION}`,
    },
  };
}
