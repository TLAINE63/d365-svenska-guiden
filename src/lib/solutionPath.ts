import type { BusinessNeedKey } from "@/lib/solutionNeeds";

/**
 * Lösningsvägval: deterministisk bedömning av hur ett konkret behov bör lösas
 * (standard, ISV, agent/automation, egenutveckling eller kombination).
 * Ingen poäng visas, ingen partnerstatus påverkar och osäkert underlag sägs rakt ut.
 */
export type PathKey = "standard" | "isv" | "automation" | "custom" | "combination";

export const PROCESS_TYPES = [
  { value: "common", label: "Vanlig process som många företag har" },
  { value: "industry", label: "Branschspecifik eller styrd av särskilda regler" },
  { value: "unique", label: "Unik för oss och en del av vår konkurrensfördel" },
] as const;
export const TASK_TYPES = [
  { value: "repetitive", label: "Återkommande, regelstyrda moment (t.ex. registrering, avstämning, sortering)" },
  { value: "judgement", label: "Kräver bedömning av människor" },
  { value: "mixed", label: "Både och" },
] as const;
export const CRITICALITY = [
  { value: "low", label: "Låg, stödjande process" },
  { value: "medium", label: "Viktig men inte verksamhetskritisk" },
  { value: "high", label: "Verksamhetskritisk (fakturering, leverans, regelefterlevnad)" },
] as const;
export const SYSTEMS = [
  { value: "none", label: "Bara Dynamics 365" },
  { value: "few", label: "1–2 andra system" },
  { value: "many", label: "Flera system eller externa parter" },
] as const;
export const APPROVAL = [
  { value: "yes", label: "Ja, en människa ska godkänna" },
  { value: "no", label: "Nej, det kan ske automatiskt" },
  { value: "unknown", label: "Vet inte" },
] as const;
export const OWNERSHIP = [
  { value: "partner", label: "En partner eller leverantör" },
  { value: "internal", label: "Egen IT eller utvecklare" },
  { value: "unknown", label: "Inte bestämt" },
] as const;

type V<T extends readonly { value: string }[]> = T[number]["value"];
export interface PathInput {
  need?: string;
  areas?: BusinessNeedKey[];
  processType?: V<typeof PROCESS_TYPES>;
  taskType?: V<typeof TASK_TYPES>;
  criticality?: V<typeof CRITICALITY>;
  systems?: V<typeof SYSTEMS>;
  approval?: V<typeof APPROVAL>;
  ownership?: V<typeof OWNERSHIP>;
}

export interface PathLink { label: string; href: string }
export interface PathResult {
  sufficient: boolean;
  primary: PathKey | null;
  why: string[];
  alternatives: PathKey[];
  verify: string[];
  links: PathLink[];
}

export const PATH_LABELS: Record<PathKey, string> = {
  standard: "Befintlig standardfunktionalitet i Dynamics 365",
  isv: "Etablerad ISV-lösning (tillägg)",
  automation: "Agent eller automation",
  custom: "Egenutvecklad app eller funktion",
  combination: "Kombination: standard som grund, kompletterad",
};

const ERP: BusinessNeedKey[] = ["ekonomi", "supply_chain", "tillverkning", "projekt"];
const CRM: BusinessNeedKey[] = ["forsaljning", "service"];

export function answeredCount(i: PathInput): number {
  return [i.processType, i.taskType, i.criticality, i.systems, i.approval, i.ownership].filter(Boolean).length;
}

export function assessSolutionPath(i: PathInput): PathResult {
  const erp = (i.areas || []).some((a) => ERP.includes(a));
  const crm = (i.areas || []).some((a) => CRM.includes(a));
  const links: PathLink[] = [];
  const addLink = (l: PathLink) => { if (!links.some((x) => x.href === l.href)) links.push(l); };

  // Kräver minst processtyp + två andra svar för en rekommendation.
  const sufficient = !!i.processType && answeredCount(i) >= 3;

  const verify: string[] = [];
  if (i.criticality === "high") verify.push("Hur lösningen hanterar fel, spårbarhet och reservrutiner, eftersom processen är verksamhetskritisk.");
  if (i.systems === "many") verify.push("Vilka integrationer som behövs och vem som äger dem.");
  if (i.ownership === "unknown" || !i.ownership) verify.push("Vem som ska förvalta lösningen efter driftstart och vad det kostar per år.");
  if (i.approval === "unknown") verify.push("Om ett mänskligt godkännande krävs, till exempel av regel- eller attestskäl.");

  if (!sufficient) {
    verify.unshift("Om processen är vanlig, branschspecifik eller unik för er, det styr vägvalet mest.");
    addLink({ label: "Fortsätt med behovsguiden", href: "/kom-igang/" });
    addLink({ label: "Vad kostar Dynamics 365?", href: "/kostnad/" });
    return { sufficient, primary: null, why: ["Underlaget räcker inte för en rekommendation ännu. Svara på fler frågor eller ta en personlig genomgång."], alternatives: [], verify: verify.slice(0, 4), links };
  }

  const why: string[] = [];
  let primary: PathKey;
  const alternatives: PathKey[] = [];
  const autoFit = i.taskType === "repetitive" || i.taskType === "mixed";

  if (i.processType === "common") {
    primary = "standard";
    why.push("Vanliga processer täcks oftast av standardfunktionaliteten, som Microsoft förvaltar och uppdaterar.");
    if (autoFit) { alternatives.push("automation"); why.push("Återkommande moment kan sedan effektiviseras med automation ovanpå standard."); }
    alternatives.push("isv");
  } else if (i.processType === "industry") {
    primary = "isv";
    why.push("Branschspecifika krav och regler löses ofta av etablerade tillägg som redan används av andra företag.");
    alternatives.push("standard", "combination");
    verify.push("Om tillägget är aktivt utvecklat för den Dynamics 365-version ni använder och har svenska referenser.");
  } else if (autoFit && i.criticality !== "high") {
    primary = "automation";
    why.push("Processen är unik men består av regelstyrda moment, där en agent eller automation kan göra jobbet utan en helt egen app.");
    if (i.approval === "yes") why.push("Låt agenten förbereda och en människa godkänna, så att ansvaret blir tydligt.");
    alternatives.push("custom", "standard");
  } else {
    primary = "custom";
    why.push("När processen är unik och en del av er konkurrensfördel kan en egen app eller funktion vara motiverad.");
    if (i.ownership !== "internal") verify.push("Egenutveckling kräver långsiktig förvaltning. Bekräfta vem som tar det ansvaret.");
    alternatives.push("combination", "isv");
  }

  if (i.systems === "many") {
    why.push("Med flera berörda system blir lösningen i praktiken ofta en kombination, där standard är grunden.");
    if (!alternatives.includes("combination")) alternatives.unshift("combination");
  }
  if (primary === "automation" && i.criticality === "medium" && i.approval !== "no") {
    verify.push("Vilka beslut agenten får fatta själv och vilka som kräver godkännande.");
  }
  if (primary === "custom" && i.criticality === "high") {
    verify.push("Om en etablerad lösning ändå täcker huvuddelen, så att egen kod bara behövs för det unika.");
  }

  const all = [primary, ...alternatives];
  if (all.includes("standard")) {
    if (erp || !crm) addLink({ label: "Affärssystem (ERP) i Dynamics 365", href: "/affarssystem/" });
    if (crm || !erp) addLink({ label: "CRM i Dynamics 365", href: "/crm/" });
  }
  if (all.includes("isv") || all.includes("combination")) {
    if (erp || !crm) addLink({ label: "Tillägg för Business Central", href: "/business-central/tillagg/" });
    if (crm || !erp) addLink({ label: "Tillägg för CRM (Customer Engagement)", href: "/customer-engagement/tillagg/" });
  }
  if (all.includes("automation") || all.includes("custom")) {
    addLink({ label: "Exempel på AI och agenter i Dynamics 365", href: "/ai/exempel/" });
    addLink({ label: "Copilot och agenter", href: "/copilot/" });
  }
  addLink({ label: "Hitta en partner", href: "/valjdynamics365partner/" });

  return { sufficient, primary, why, alternatives: Array.from(new Set(alternatives)).filter((a) => a !== primary).slice(0, 3), verify: Array.from(new Set(verify)).slice(0, 5), links: links.slice(0, 6) };
}
