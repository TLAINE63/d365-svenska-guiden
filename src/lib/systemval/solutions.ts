// Sprint 3: deterministisk lösningsbild ovanpå dialogmotorn.
// Läser endast härlett state + modulresultat; ändrar aldrig routingen.
// Inte "högst poäng vinner": primärt styrs av huvudbehovet, övriga områden
// sorteras i kompletterande / bör undersökas utifrån signalens typ.

import { NEED_AREAS, type NeedArea } from "./config";
import type { DialogState } from "./engine";
import type { ErpResult } from "./modules/erp";
import { Q } from "./modules/erp";
import type { SvcResult } from "./modules/service";

export const SOLUTIONS_VERSION = "solutions-1.0.0";

export type SolutionId =
  | "bc" | "finance" | "scm" | "fscm" | "sales" | "ci" | "cs" | "cc" | "fs" | "po" | "commerce" | "hr"
  | "powerbi" | "powerapps" | "automate" | "copilot" | "fabric";

const D = "Dynamics\u00A0365";
export const SOLUTION_INFO: Record<SolutionId, { label: string; href: string; cta: string; platform?: boolean }> = {
  bc: { label: `${D} Business Central`, href: "/businesscentral/", cta: "Utforska Business Central" },
  finance: { label: `${D} Finance`, href: "/finance-supply-chain/", cta: "Utforska Finance" },
  scm: { label: `${D} Supply Chain Management`, href: "/finance-supply-chain/", cta: "Utforska Supply Chain Management" },
  fscm: { label: `${D} Finance & Supply Chain Management`, href: "/finance-supply-chain/", cta: "Utforska Finance & Supply Chain Management" },
  sales: { label: `${D} Sales`, href: "/d365sales/", cta: `Läs om ${D} Sales` },
  ci: { label: `${D} Customer Insights`, href: "/d365marketing/", cta: "Läs om Customer Insights" },
  cs: { label: `${D} Customer Service`, href: "/d365customerservice/", cta: "Läs om Customer Service" },
  cc: { label: `${D} Contact Center`, href: "/d365contactcenter/", cta: "Läs om Contact Center" },
  fs: { label: `${D} Field Service`, href: "/d365fieldservice/", cta: "Läs om Field Service" },
  po: { label: `${D} Project Operations`, href: "/d365projectoperations/", cta: "Läs om Project Operations" },
  commerce: { label: `${D} Commerce`, href: "/d365commerce/", cta: "Läs om Commerce" },
  hr: { label: `${D} Human Resources`, href: "/d365humanresources/", cta: "Läs om Human Resources" },
  powerbi: { label: "Power BI", href: "/aioversikt/", cta: "Läs mer", platform: true },
  powerapps: { label: "Power Apps", href: "/aioversikt/", cta: "Läs mer", platform: true },
  automate: { label: "Power Automate", href: "/aioversikt/", cta: "Läs mer", platform: true },
  copilot: { label: "Copilot och AI", href: "/copilot/", cta: "Läs om Copilot", platform: true },
  fabric: { label: "Microsoft Fabric", href: "/aioversikt/", cta: "Läs mer", platform: true },
};

/** core = direkt uttryckt behov, cross = korsbehov i svaren, hint = indikation utan tillräckligt underlag. */
type Kind = "core" | "cross" | "hint";
interface Signal { id: SolutionId; kind: Kind; weight: number; reason: string; need?: NeedArea; fromSvc?: boolean }

export interface SolutionItem { id: SolutionId; label: string; href: string; cta: string; reasons: string[]; text?: string }
export interface NextStep { label: string; href: string; reason: string; kind: "compare" | "deepen_product" | "plan" | "partners" | "deepen_analysis" }

export interface SolutionPicture {
  interpretation: string;
  primary: SolutionItem[];
  /** Två huvudspår som behöver jämföras (BC kontra F&SCM). */
  comparePrimary: boolean;
  complementary: SolutionItem[];
  investigate: SolutionItem[];
  addOn: { areas: string[] } | null;
  aiNotes: string[];
  openQuestions: string[];
  nextStep: NextStep;
  signals: Signal[];
  version: string;
}

const NEED_PRODUCT: Partial<Record<NeedArea, SolutionId>> = {
  sales: "sales", marketing: "ci", customer_service: "cs", contact_center: "cc", field_service: "fs", projects: "po",
};
const ERP_NEEDS: NeedArea[] = ["erp", "supply_chain", "production"];
const needLabel = (n: NeedArea) => NEED_AREAS.find((a) => a.id === n)?.label.toLowerCase() ?? n;
const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} och ${xs[xs.length - 1]}`);

function erpProducts(erp: ErpResult): SolutionId[] {
  if (erp.preliminaryOutcome === "bc") return ["bc"];
  if (erp.preliminaryOutcome === "compare") return ["bc", "fscm"];
  if (erp.preliminaryOutcome === "fscm") return erp.fscmDriver === "finance" ? ["finance"] : erp.fscmDriver === "scm" ? ["scm"] : ["fscm"];
  return [];
}

export function buildSolutionPicture(state: DialogState, erp?: ErpResult, svcArg?: SvcResult): SolutionPicture {
  const svc = svcArg ?? (state.moduleResults.service as SvcResult | undefined);
  const SVC_IDS: SolutionId[] = ["cs", "cc", "fs"];
  const ans = state.activeAnswers;
  const has = (q: string, ...ids: string[]) => ids.some((v) => (ans[q] ?? []).includes(v));
  const needs = state.needs;
  const probs = state.problems;
  const sig: Signal[] = [];
  // Servicemodulen äger bedömningen av Customer Service, Contact Center och Field Service.
  const add = (s: Signal) => { if (!(svc && SVC_IDS.includes(s.id) && !s.fromSvc)) sig.push(s); };

  // --- Kärnbehov från behov/problem ---
  for (const n of needs) {
    const p = NEED_PRODUCT[n];
    if (p) add({ id: p, kind: "core", weight: 3, need: n, reason: `Ni vill förbättra ${needLabel(n)}.` });
  }
  if (probs.includes("pipeline")) add({ id: "sales", kind: "core", weight: 2, need: "sales", reason: "Affärer och prognoser är svåra att överblicka idag." });
  if (probs.includes("leads_lost")) {
    add({ id: "sales", kind: "core", weight: 2, need: "sales", reason: "Leads tappas mellan marknad och försäljning." });
    add({ id: "ci", kind: "core", weight: 2, need: "marketing", reason: "Överlämningen från marknad till försäljning behöver bli tydligare." });
  }
  if (probs.includes("cases_email")) add({ id: "cs", kind: "core", weight: 2, need: "customer_service", reason: "Kundärenden hamnar i mejl eller olika system." });
  if (probs.includes("channels")) add({ id: "cc", kind: "core", weight: 2, need: "contact_center", reason: "Kunddialogen hänger inte ihop mellan kanaler." });
  if (probs.includes("technicians")) add({ id: "fs", kind: "core", weight: 2, need: "field_service", reason: "Tekniker ute hos kund saknar rätt information." });
  if (probs.includes("project_margin")) add({ id: "po", kind: "core", weight: 2, need: "projects", reason: "Projekt och projektmarginaler är svåra att styra." });

  // --- ERP från modulens bedömning ---
  if (erp) {
    const erpNeed = needs.find((n) => ERP_NEEDS.includes(n)) ?? "erp";
    const why = erp.reasons.slice(0, 3);
    for (const id of erpProducts(erp)) add({ id, kind: "core", weight: 3, need: erpNeed, reason: why[0] ?? "Era svar om ekonomi och verksamhetsflöden pekar hit." });
    for (const r of why.slice(1)) for (const id of erpProducts(erp)) add({ id, kind: "core", weight: 0, need: erpNeed, reason: r });

    // Korsbehov från ERP-svaren
    if (erp.projectOperationsSignal) add({ id: "po", kind: "cross", weight: 2, reason: "Projekt, resurser och projektekonomi verkar behöva hänga ihop." });
    else if (has(Q.ERP1, "projects")) add({ id: "po", kind: "hint", weight: 1, reason: "Projekt och projektekonomi ska ingå i affärssystemet." });
    if (has(Q.ERP1, "service")) add({ id: "fs", kind: needs.includes("customer_service") ? "cross" : "hint", weight: needs.includes("customer_service") ? 2 : 1, reason: "Service och eftermarknad ska hållas ihop med affärssystemet." });
    if (has(Q.ERP2, "adv_control", "dimensions")) add({ id: "powerbi", kind: "hint", weight: 1, reason: "Avancerad uppföljning kan behöva rapportering och analys utöver standard." });
    if (has(Q.ERP3, "high_volume") || has(Q.ERP6, "several")) add({ id: "fabric", kind: "hint", weight: 1, reason: "Stora datamängder eller flera system kan kräva en gemensam dataplattform." });
  }

  // --- Service & kunddialog från modulens bedömning ---
  if (svc) {
    const NEED: Record<string, NeedArea> = { cs: "customer_service", cc: "contact_center", fs: "field_service" };
    svc.tracks.forEach((t, i) => {
      const rs = svc.reasons[t].length ? [...new Set(svc.reasons[t])] : ["Era svar om servicearbetet pekar hit."];
      rs.forEach((r, j) => add({ id: t, kind: "core", weight: j === 0 ? (i === 0 ? 4 : 3) : 0, need: NEED[t], reason: r, fromSvc: true }));
    });
    for (const t of svc.investigateTracks) add({ id: t, kind: "hint", weight: 1, reason: svc.reasons[t][0] ?? "Svaren ger en indikation, men inget tydligt behov ännu.", fromSvc: true });
  }

  // --- Korsbehov mellan CRM-områden ---
  if (needs.includes("customer_service") && (needs.includes("field_service") === false) && probs.includes("technicians"))
    add({ id: "fs", kind: "cross", weight: 2, reason: "Kundservice och arbete ute hos kund behöver dela information." });
  if (needs.includes("sales") && !needs.includes("marketing") && probs.includes("leads_lost") === false && needs.length >= 2)
    add({ id: "ci", kind: "hint", weight: 1, reason: "Segmentering och kundresor kan bli aktuellt när försäljningen fått struktur." });
  if (needs.includes("customer_service") && !needs.includes("contact_center"))
    add({ id: "cc", kind: "hint", weight: 1, reason: "Om kunderna hör av sig i flera kanaler kan Contact Center bli aktuellt." });
  if (needs.includes("contact_center") && !needs.includes("customer_service"))
    add({ id: "cs", kind: "cross", weight: 2, reason: "Ärendehantering bakom kanalerna brukar behöva utvärderas samtidigt." });
  if (erp && (needs.includes("sales") || needs.includes("marketing")))
    add({ id: "powerbi", kind: "hint", weight: 1, reason: "Gemensam uppföljning över affärssystem och CRM kan behövas." });

  // --- Integration / automation ---
  const intent = ans.change_intent?.[0];
  if (probs.includes("duplicate_entry") || intent === "integrate" || intent === "consolidate")
    add({ id: "automate", kind: "hint", weight: 1, reason: "Dubbelregistrering och kopplingar mellan system kan automatiseras." });
  if (intent === "integrate") add({ id: "powerapps", kind: "hint", weight: 1, reason: "Kompletterande appar kan behövas runt system som ska finnas kvar." });

  // --- Gruppering ---
  const byId = new Map<SolutionId, Signal[]>();
  for (const s of sig) byId.set(s.id, [...(byId.get(s.id) ?? []), s]);
  const score = (id: SolutionId) => (byId.get(id) ?? []).reduce((t, s) => t + s.weight, 0);
  const item = (id: SolutionId, text?: string): SolutionItem => ({
    id, ...SOLUTION_INFO[id], text,
    reasons: [...new Set((byId.get(id) ?? []).map((s) => s.reason))].slice(0, 3),
  });

  const coreIds = [...byId.keys()].filter((id) => byId.get(id)!.some((s) => s.kind === "core"));
  const coreNeedOf = (id: SolutionId) => byId.get(id)!.find((s) => s.kind === "core")?.need;
  const comparePrimary = erp?.preliminaryOutcome === "compare";
  const erpIds = erp ? erpProducts(erp) : [];

  let primaryIds: SolutionId[];
  if (state.primaryNeed) {
    const pn = state.primaryNeed;
    primaryIds = ERP_NEEDS.includes(pn) ? erpIds : coreIds.filter((id) => coreNeedOf(id) === pn).slice(0, 1);
    if (!primaryIds.length) primaryIds = coreIds.sort((a, b) => score(b) - score(a)).slice(0, 1);
  } else {
    // Ingen tydlig prioritet: ERP-par räknas som ett spår, därefter starkaste kärnbehovet.
    const ranked = coreIds.filter((id) => !erpIds.includes(id)).sort((a, b) => score(b) - score(a));
    primaryIds = erpIds.length ? [...erpIds, ...ranked].slice(0, erpIds.length === 2 ? 2 : 2) : ranked.slice(0, 2);
  }
  // Begränsat ERP-underlag: inget produktspår som primärt.
  primaryIds = [...new Set(primaryIds)];

  const complementary = coreIds.filter((id) => !primaryIds.includes(id))
    .concat([...byId.keys()].filter((id) => !coreIds.includes(id) && !primaryIds.includes(id) && byId.get(id)!.some((s) => s.kind === "cross") && !SOLUTION_INFO[id].platform))
    .sort((a, b) => score(b) - score(a));
  const investigate = [...byId.keys()].filter((id) => !primaryIds.includes(id) && !complementary.includes(id));
  if (erp?.preliminaryOutcome === "limited" && !investigate.includes("bc")) investigate.unshift("bc", "fscm");

  const compText = (id: SolutionId) => {
    const r = byId.get(id)?.[0]?.reason;
    return r ? `${r.replace(/\.$/, "")}, därför bör ${SOLUTION_INFO[id].label} finnas med i den fortsatta utvärderingen.` : undefined;
  };

  // --- Tillägg / ISV ---
  const addOnAreas: string[] = [];
  if (has(Q.ERP4, "process_batch")) addOnAreas.push("process- och batchproduktion");
  if (has(Q.ERP4, "quality") || has(Q.ERP3, "traceability")) addOnAreas.push("spårbarhet och kvalitet");
  if (has(Q.ERP3, "automation")) addOnAreas.push("lagerautomation");
  if (has(Q.ERP3, "three_pl", "transport")) addOnAreas.push("transport och externa lager");
  if (has(Q.ERP1, "service") && !needs.includes("field_service")) addOnAreas.push("service och eftermarknad");

  // --- AI tvärgående ---
  const AI: Partial<Record<SolutionId, string>> = {
    sales: "Inom försäljning kan AI-stöd för säljarbete, till exempel sammanfattningar och förslag, vara värt att undersöka.",
    cs: "Inom kundservice kan AI-stöd för handläggning och kunskapsartiklar vara värt att undersöka.",
    cc: "I kunddialogen kan AI-stöd i kanalerna vara värt att undersöka.",
    fs: "Inom serviceprocesser kan AI-stöd för planering och teknikerns information vara värt att undersöka.",
    po: "Inom projektarbete kan AI-stöd för uppföljning och rapportering vara värt att undersöka.",
    bc: "Inom ekonomiprocesser kan AI och automatisering, till exempel i avstämning och fakturahantering, vara värt att undersöka.",
    finance: "Inom ekonomiprocesser kan AI och automatisering vara värt att undersöka.",
    fscm: "Inom ekonomi och verksamhetsflöden kan AI och automatisering vara värt att undersöka.",
    scm: "Inom planering och logistik kan AI-stöd vara värt att undersöka.",
    ci: "Inom marknadsföring kan AI-stöd för segmentering och innehåll vara värt att undersöka.",
  };
  const aiNotes = [...new Set([...primaryIds, ...complementary].map((id) => AI[id]).filter(Boolean) as string[])].slice(0, 2);

  // --- Att undersöka vidare (2–4, baserat på svar) ---
  const oq: string[] = [];
  const push = (s?: string) => { if (s && !oq.includes(s) && oq.length < 4) oq.push(s); };
  erp?.openQuestions.slice(0, 2).forEach(push);
  svc?.openQuestions.slice(0, 2).forEach(push);
  const all = new Set([...primaryIds, ...complementary]);
  const hasErp = erpIds.length > 0 || !!erp;
  if (hasErp && (all.has("sales") || all.has("ci"))) push("Behöver säljorganisationen ett separat CRM, eller kan behoven hanteras inom den övriga lösningen?");
  if (!svc && all.has("cs") && all.has("cc")) push("Vilka kanaler hör kunderna av sig i idag, och vilka ska ingå från start?");
  if (!svc && all.has("fs")) push("Hur planeras och följs arbetet ute hos kund upp idag?");
  if (all.has("po")) push("Hur stor del av verksamheten är projektbaserad, och hur följs projekten upp idag?");
  if (all.has("ci") && all.has("sales")) push("Hur ska ansvaret mellan marknad och försäljning se ut när ett lead lämnas över?");
  if (addOnAreas.length) push(`Hur långt räcker standardfunktionerna för ${list(addOnAreas)}?`);
  if (probs.includes("duplicate_entry") || intent === "integrate" || intent === "consolidate") push("Vilka befintliga system måste integreras eller ersättas?");
  if (oq.length < 2) push("Vilka befintliga system måste integreras eller ersättas?");
  if (oq.length < 2) push("Hur kan verksamheten komma att förändras de närmaste åren?");

  // --- Tolkning ---
  const labels = needs.map(needLabel);
  const parts: string[] = [];
  if (labels.length) {
    const main = state.primaryNeed ? needLabel(state.primaryNeed) : null;
    const rest = main ? labels.filter((l) => l !== main) : [];
    parts.push(main
      ? `Ni verkar framför allt vilja förbättra ${main}${rest.length ? `, men har även behov kring ${list(rest)}` : ""}.`
      : `Era svar pekar mot behov inom ${list(labels)}.`);
  } else parts.push("Era svar ger ännu ingen tydlig bild av vilket område som är viktigast.");
  if (erp) {
    if (erp.preliminaryOutcome === "compare") parts.push("Kraven inom ekonomi och verksamhetsflöden gör att både ett sammanhållet affärssystem och en mer omfattande lösning bör vägas mot varandra.");
    else if (erp.preliminaryOutcome === "fscm") parts.push("Kraven inom ekonomi eller verksamhetsflöden verkar mer omfattande än ett grundläggande affärssystem.");
    else if (erp.preliminaryOutcome === "bc") parts.push("Affärssystemsbehoven verkar kunna hanteras i ett sammanhållet affärssystem.");
    else parts.push("Underlaget om affärssystemet behöver fördjupas innan ett spår kan pekas ut.");
  }
  if (svc) {
    if (svc.clarity === "limited") parts.push("Underlaget om servicearbetet räcker ännu inte för att peka ut ett spår.");
    else if (svc.keepExistingCrm) parts.push("Kanalhanteringen verkar kunna förbättras med Contact Center samtidigt som ert befintliga CRM behålls.");
    else if (svc.tracks.length > 1) parts.push("Servicebehoven omfattar flera separata delar som kan behöva olika lösningsområden.");
  }
  const crossNames = complementary.filter((id) => byId.get(id)!.some((s) => s.kind === "cross")).map((id) => SOLUTION_INFO[id].label.replace(`${D} `, ""));
  if (crossNames.length) parts.push(`Svaren visar också behov som berör ${list(crossNames)}.`);

  // --- Nästa steg ---
  const limited = (erp?.preliminaryOutcome === "limited") || (!primaryIds.length) || (!!svc && svc.clarity === "limited" && !erp);
  const breadth = primaryIds.length + complementary.length;
  const p0 = primaryIds[0];
  const MATCH: Partial<Record<SolutionId, string>> = {
    bc: "/businesscentral/matchningstest/", fscm: "/finance-supply-chain-management/matchningstest/",
    finance: "/finance-supply-chain-management/matchningstest/", scm: "/finance-supply-chain-management/matchningstest/",
    sales: "/d365sales/matchningstest/", ci: "/d365marketing/matchningstest/", cs: "/d365customerservice/matchningstest/",
    cc: "/d365contactcenter/matchningstest/", fs: "/d365fieldservice/matchningstest/",
  };
  const PARTNERS: Partial<Record<SolutionId, string>> = {
    bc: "/business-central-partners-sverige/", fscm: "/finance-supply-chain-partners-sverige/",
    finance: "/finance-supply-chain-partners-sverige/", scm: "/finance-supply-chain-partners-sverige/",
  };
  let nextStep: NextStep;
  if (comparePrimary) nextStep = { kind: "compare", label: "Jämför Business Central med Finance & Supply Chain Management", href: "/affarssystem/", reason: "Era svar pekar mot båda spåren, så en jämförelse är ett naturligt nästa steg." };
  else if (limited) nextStep = { kind: "deepen_analysis", label: "Fördjupa behovsanalysen", href: (p0 && MATCH[p0]) || "/kom-igang/", reason: "Flera viktiga frågor är ännu öppna, så ett mer detaljerat underlag ger en säkrare bild." };
  else if (breadth >= 3) nextStep = { kind: "plan", label: "Skapa er D365-plan", href: "/underlag/", reason: "Flera områden har identifierats och behöver hållas ihop i en plan." };
  else if (erp?.clarity === "clear" && ["replace", "consolidate"].includes(intent ?? "") && p0 && PARTNERS[p0])
    nextStep = { kind: "partners", label: `Hitta relevanta ${D}-partners`, href: PARTNERS[p0]!, reason: "Lösningsspåret verkar tydligt och ni vill ersätta eller samla system." };
  else nextStep = { kind: "deepen_product", label: `Fördjupa er i ${SOLUTION_INFO[p0].label.replace(`${D} `, "")}`, href: SOLUTION_INFO[p0].href, reason: "Lösningsområdet verkar relativt tydligt utifrån era svar." };

  return {
    interpretation: parts.slice(0, 3).join(" "),
    primary: primaryIds.map((id) => item(id)),
    comparePrimary,
    complementary: complementary.slice(0, 3).map((id) => item(id, compText(id))),
    investigate: investigate.slice(0, 4).map((id) => item(id)),
    addOn: addOnAreas.length ? { areas: addOnAreas } : null,
    aiNotes,
    openQuestions: oq,
    nextStep,
    signals: sig,
    version: SOLUTIONS_VERSION,
  };
}
