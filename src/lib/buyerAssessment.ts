import { BUSINESS_NEEDS, COST_LINK, businessNeedByKey, type BusinessNeedKey, type ExploreLink } from "@/lib/solutionNeeds";

/**
 * Sprint 1.7: Buyer Assessment Light. Frivillig, deterministisk bedömning som visas för besökaren
 * innan några kontaktuppgifter efterfrågas. Ingen poäng, ingen Opportunity Type och ingen
 * produktrekommendation; resultatet beskriver läget, öppna frågor och vägar att utforska.
 */
export const ASSESSMENT_PHASES = [
  "Tidig utvärdering",
  "Förstudie eller kravarbete",
  "Offertfas",
  "Har redan Dynamics 365",
] as const;

export const ASSESSMENT_SIZES = ["Under 50 anställda", "50–249 anställda", "250–999 anställda", "1 000 anställda eller fler", "Vet inte"] as const;
export const ASSESSMENT_HORIZONS = ["Inom 6 månader", "Inom 6–12 månader", "Senare än 12 månader", "Ingen bestämd tidpunkt"] as const;

export interface AssessmentInput {
  change?: string;
  currentSystem?: string;
  areas?: BusinessNeedKey[];
  size?: string;
  phase?: string;
  horizon?: string;
}

export interface AssessmentResult {
  situation: string[];
  questions: string[];
  paths: ExploreLink[];
  nextStep: { label: string; text: string; to?: string; continueGuide?: boolean };
}

const ERP_AREAS: BusinessNeedKey[] = ["ekonomi", "supply_chain", "tillverkning", "projekt"];
const CRM_AREAS: BusinessNeedKey[] = ["forsaljning", "service"];

/** Bedömningen kräver bara att något av fälten är ifyllt. */
export function hasAssessmentInput(i: AssessmentInput): boolean {
  return !!(i.change?.trim() || i.currentSystem?.trim() || i.areas?.length || i.size || i.phase || i.horizon);
}

export function assessBuyer(i: AssessmentInput): AssessmentResult {
  const areas = (i.areas || []).filter((k) => businessNeedByKey(k));
  const labels = areas.map((k) => businessNeedByKey(k)!.label.toLowerCase());
  const erp = areas.some((k) => ERP_AREAS.includes(k));
  const crm = areas.some((k) => CRM_AREAS.includes(k));
  const system = i.currentSystem?.trim();
  const existing = i.phase === "Har redan Dynamics 365";

  const situation: string[] = [];
  if (i.change?.trim()) situation.push(`Ni vill förändra: ${i.change.trim()}`);
  if (labels.length) situation.push(`Berörda områden: ${labels.join(", ")}.`);
  if (system) situation.push(`I dag används ${system}.`);
  if (i.size && i.size !== "Vet inte") situation.push(`Organisationen har ${i.size.toLowerCase()}.`);
  if (i.phase) situation.push(`Ni befinner er i: ${i.phase.toLowerCase()}.`);
  if (i.horizon) situation.push(`Tidshorisont: ${i.horizon.toLowerCase()}.`);

  const questions: string[] = [];
  if (areas.length > 1) questions.push("Vilket område som ska komma först, och hur områdena hänger ihop.");
  if (erp) questions.push("Om Business Central räcker eller om Finance & Supply Chain Management behövs, utifrån bolag, länder och hur avancerade processerna är.");
  if (crm) questions.push("Vilka säljprocesser, kanaler och kundärenden CRM ska stödja från start.");
  if (erp && crm) questions.push("Hur affärssystem (ERP) och CRM ska dela kund-, order- och artikeldata.");
  if (system) questions.push(`Vilken data och vilka integrationer från ${system} som ska följa med.`);
  else if (!existing) questions.push("Vilka arbetssätt och system som ska ersättas, till exempel Excel eller äldre system.");
  if (!i.size || i.size === "Vet inte") questions.push("Hur många användare och bolag som berörs, eftersom det styr licens och omfattning.");
  if (i.horizon === "Inom 6 månader") questions.push("Om tidplanen är realistisk med tanke på datamigrering, test och utbildning.");
  if (i.phase === "Tidig utvärdering" || i.phase === "Förstudie eller kravarbete") questions.push("Vad som ska ingå i en första fas och vad som kan vänta.");
  if (i.phase === "Offertfas") questions.push("Hur offerterna ska jämföras på samma underlag, inklusive integrationer och egen tid.");
  if (existing) questions.push("Om behovet gäller vidareutveckling, förvaltning eller partnersamarbetet, snarare än ett nytt system.");
  if (!questions.length) questions.push("Vilket verksamhetsområde förändringen främst gäller.");

  const seen = new Set<string>();
  const paths: ExploreLink[] = [];
  const add = (l: ExploreLink) => { if (!seen.has(l.href)) { seen.add(l.href); paths.push(l); } };
  for (const k of areas) for (const l of businessNeedByKey(k)!.areas) add(l);
  if (!areas.length) for (const l of BUSINESS_NEEDS.find((n) => n.key === "vet_inte")!.areas) add(l);
  if (existing) add({ label: "Redan Dynamics 365-kund: nästa steg", href: "/befintlig-kund/" });
  add(COST_LINK);
  add({ label: "Jämför alternativ", href: "/jamfor/" });

  let nextStep: AssessmentResult["nextStep"];
  if (existing) nextStep = { label: "Utforska nästa steg för befintliga kunder", text: "Vidareutveckling, AI, förvaltning eller partnersamarbetet, utan att anta att något måste bytas.", to: "/befintlig-kund/" };
  else if (i.phase === "Offertfas") nextStep = { label: "Jämför offerterna på samma underlag", text: "Se vad offerterna bör innehålla och hur ni jämför dem.", to: "/upphandlingsguiden/" };
  else if (i.phase === "Förstudie eller kravarbete") nextStep = { label: "Samla kraven i ett underlag", text: "Gör en kravspecifikation som ni kan använda mot flera leverantörer.", to: "/kravspecifikation/" };
  else nextStep = { label: "Fortsätt med behovsguiden", text: "Några frågor om era processer ger en mer underbyggd bild av vilka lösningar som kan passa.", continueGuide: true };

  return { situation, questions: questions.slice(0, 6), paths: paths.slice(0, 6), nextStep };
}

/** Rader som följer med om besökaren väljer att diskutera bedömningen med d365.se. */
export function assessmentSummaryLines(i: AssessmentInput, r: AssessmentResult): { key: string; label: string; lines: string[] }[] {
  return [
    ...(r.situation.length ? [{ key: "situation", label: "Er situation", lines: r.situation }] : []),
    { key: "fragor", label: "Frågor att reda ut", lines: r.questions },
    { key: "nasta_steg", label: "Rekommenderat nästa steg", lines: [r.nextStep.label] },
  ];
}
