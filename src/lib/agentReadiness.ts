import type { PathInput, PathResult } from "@/lib/solutionPath";

/**
 * Förutsättningar för agent/automation, en del av Lösningsvägvalet (solutionPath.ts).
 * Återanvänder vägvalets svar (arbetstyp, godkännande, förvaltning, kritikalitet) och lägger till
 * högst tre egna frågor. Deterministisk, ingen poäng visas, inga kontaktuppgifter krävs.
 * Ett högt läge är aldrig en rekommendation att bygga egen agent: standard och tillägg jämförs först.
 */

export type ReadyAnswer = "yes" | "partly" | "no" | "unknown";
export interface ReadinessInput { steps?: ReadyAnswer; data?: ReadyAnswer; followUp?: ReadyAnswer }
export type ReadinessMode = "pilot" | "promising" | "foundation";

const o = (yes: string, partly: string, no: string) => [
  { value: "yes" as const, label: yes },
  { value: "partly" as const, label: partly },
  { value: "no" as const, label: no },
  { value: "unknown" as const, label: "Vet inte" },
];

export const READINESS_QUESTIONS: { key: keyof ReadinessInput; label: string; options: { value: ReadyAnswer; label: string }[] }[] = [
  { key: "steps", label: "Är stegen och undantagen i arbetsmomentet kända?", options: o("Ja, vi kan beskriva dem", "Delvis, det görs olika", "Nej, det varierar mycket") },
  { key: "data", label: "Finns informationen som behövs i kända system, i användbart skick?", options: o("Ja, i kända system", "Delvis, en del i Excel eller mejl", "Nej, saknas eller är opålitlig") },
  { key: "followUp", label: "Går resultatet att testa, följa upp och rätta?", options: o("Ja", "Delvis", "Nej, svårt att se fel") },
];

/** Visas bara när agent/automation är aktuellt i vägvalet. */
export function readinessRelevant(r: PathResult | null): boolean {
  return !!r?.primary && (r.primary === "automation" || r.alternatives.includes("automation"));
}

type Dim = "process" | "data" | "ownership" | "control" | "followUp";
const DIM_LABEL: Record<Dim, string> = {
  process: "Processen", data: "Data och datakällor", ownership: "Ansvar för drift och förvaltning",
  control: "Mänsklig kontroll", followUp: "Test och uppföljning",
};
const STATE_TEXT: Record<ReadyAnswer, string> = { yes: "på plats", partly: "delvis på plats", no: "saknas", unknown: "okänt" };
const FIX: Record<Dim, string> = {
  process: "Beskriv stegen, undantagen och hur ofta momentet sker, innan något automatiseras.",
  data: "Ta reda på var informationen finns och hur komplett och korrekt den är.",
  ownership: "Utse en ägare för processen, behörigheterna och förvaltningen i drift.",
  control: "Bestäm vilka steg en person ska godkänna innan agenten får agera.",
  followUp: "Bestäm hur ni mäter resultatet och hur fel upptäcks och rättas.",
};

export interface ReadinessStep { label: string; href?: string; advisory?: boolean }
export interface ReadinessResult {
  mode: ReadinessMode;
  insufficient: boolean;
  title: string;
  summary: string;
  basis: string[];
  nextSteps: ReadinessStep[];
}

export const READINESS_TITLES: Record<ReadinessMode, string> = {
  pilot: "Redo att undersöka en avgränsad pilot",
  promising: "Lovande, men vissa förutsättningar behöver lösas först",
  foundation: "Börja med process, data eller ansvar innan agentutveckling",
};

export function evaluateReadiness(path: PathInput, a: ReadinessInput): ReadinessResult {
  // Processen: vägvalets arbetstyp och de nya frågorna om steg.
  const process: ReadyAnswer = path.taskType === "judgement" ? (a.steps === "yes" ? "partly" : "no") : (a.steps ?? "unknown");
  const ownership: ReadyAnswer = path.ownership === "partner" || path.ownership === "internal" ? "yes" : "unknown";
  // Mänsklig kontroll: kritisk process utan godkännande är en brist.
  const control: ReadyAnswer = path.approval === "yes" ? "yes"
    : path.approval === "no" ? (path.criticality === "high" ? "no" : "yes") : "unknown";
  const v: Record<Dim, ReadyAnswer> = { process, data: a.data ?? "unknown", ownership, control, followUp: a.followUp ?? "unknown" };
  const dims = Object.keys(v) as Dim[];
  const by = (s: ReadyAnswer) => dims.filter((d) => v[d] === s);
  const no = by("no"), unknown = by("unknown"), partly = by("partly");
  const insufficient = unknown.length >= 3;

  let mode: ReadinessMode;
  if (v.process === "no" || v.data === "no" || no.length >= 2) mode = "foundation";
  else if (no.length === 0 && unknown.length === 0 && partly.length <= 1 && v.process === "yes" && v.data === "yes") mode = "pilot";
  else mode = "promising";

  const basis = dims.map((d) => `${DIM_LABEL[d]}: ${STATE_TEXT[v[d]]}.`);
  const fixes = [...no, ...unknown, ...partly].map((d) => FIX[d]);
  const compare: ReadinessStep = { label: "Jämför med Copilot och agenter som redan finns i Dynamics 365", href: "/copilot/" };
  const isv: ReadinessStep = { label: "Se om ett färdigt tillägg redan löser behovet", href: "/kunskapscenter/dynamics-365-tillagg/" };
  const advisory: ReadinessStep = { label: "Boka ett kostnadsfritt 20-minuterssamtal för en personlig bedömning", advisory: true };

  let nextSteps: ReadinessStep[];
  if (insufficient) nextSteps = [{ label: fixes[0] }, { label: fixes[1] }, advisory];
  else if (mode === "pilot") nextSteps = [compare, isv, { label: "Avgränsa en pilot med ett mätbart mål, en ansvarig person och ett slutdatum." }];
  else if (mode === "promising") nextSteps = [{ label: fixes[0] }, compare, advisory];
  else nextSteps = [{ label: fixes[0] }, ...(fixes[1] ? [{ label: fixes[1] }] : []), isv];

  const summary = insufficient
    ? "Flera förutsättningar är ännu okända, så vi gör ingen säker bedömning. Ta reda på punkterna nedan först."
    : mode === "pilot"
      ? "Förutsättningarna ser goda ut för att pröva en liten, avgränsad pilot. Det betyder inte att ni ska bygga en egen agent: jämför först med det som redan finns i Dynamics 365 och färdiga tillägg."
      : mode === "promising"
        ? "Behovet passar för automation eller en agent, men några förutsättningar behöver lösas innan en pilot blir meningsfull."
        : "Grunden behöver komma på plats först. En agent förstärker en tydlig process med bra data, den ersätter dem inte.";

  return { mode, insufficient, title: insufficient ? "Underlaget räcker inte ännu" : READINESS_TITLES[mode], summary, basis, nextSteps: nextSteps.slice(0, 3) };
}

export const READINESS_DISCLAIMER = "Bedömningen är en vägledning utifrån era svar, inte en säkerhetsgranskning, teknisk certifiering eller garanti för lönsamhet.";
