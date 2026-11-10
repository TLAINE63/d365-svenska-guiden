import type { DialogState } from "./engine";
import type { SolutionPicture } from "./solutions";

/**
 * Förutsättningar för en AI-agent eller automation, kopplad till ett konkret behov i behovsguiden.
 * Ren och deterministisk: ingen poäng visas, inget AI-anrop, inga kontaktuppgifter.
 * Ett högt läge är aldrig en rekommendation att bygga egen agent, standard och tillägg jämförs först.
 */

export type ReadinessAnswer = "yes" | "partly" | "no" | "unknown";
export type ReadinessQuestionId = "process" | "data" | "ownership" | "control";
export type ReadinessAnswers = Partial<Record<ReadinessQuestionId, ReadinessAnswer>>;
export type ReadinessMode = "pilot" | "promising" | "foundation";

export interface ReadinessQuestion { id: ReadinessQuestionId; question: string; help: string; options: { id: ReadinessAnswer; label: string }[] }

const opts = (yes: string, partly: string, no: string) => [
  { id: "yes" as const, label: yes },
  { id: "partly" as const, label: partly },
  { id: "no" as const, label: no },
  { id: "unknown" as const, label: "Vet inte" },
];

export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  { id: "process", question: "Hur tydligt och återkommande är arbetsmomentet?", help: "Till exempel samma steg varje vecka, med kända undantag.",
    options: opts("Tydligt och återkommande", "Återkommande men görs olika", "Varierar från gång till gång") },
  { id: "data", question: "Finns informationen som behövs i system ni känner till, i användbart skick?", help: "Till exempel kund-, order- eller ärendedata som är någorlunda komplett.",
    options: opts("Ja, i kända system", "Delvis, en del finns i Excel eller mejl", "Nej, data saknas eller är opålitlig") },
  { id: "ownership", question: "Är det klart vem som äger processen, behörigheterna och förvaltningen efteråt?", help: "Någon som beslutar, ger åtkomst och tar hand om lösningen i drift.",
    options: opts("Ja, namngivna ansvariga", "Delvis, men inte för drift", "Nej, ingen tydlig ägare") },
  { id: "control", question: "Går resultatet att kontrollera, följa upp och rätta?", help: "Till exempel att en person godkänner viktiga steg och att fel syns.",
    options: opts("Ja, vi kan granska och rätta", "Delvis", "Nej, svårt att följa upp") },
];

/** Behov där en agent eller automation är ett rimligt alternativ att pröva. */
export function readinessRelevant(picture: SolutionPicture): boolean {
  const ids = [...picture.primary, ...picture.complementary, ...picture.investigate].map((x) => x.id);
  return ids.includes("automate") || ids.includes("copilot") || picture.aiNotes.length > 0;
}

/** Återanvänder svar från behovsguiden för att beskriva vilket behov bedömningen gäller. */
export function readinessContext(state: DialogState, picture: SolutionPicture): string[] {
  const probs = (state.answers?.problems ?? []) as string[];
  const out: string[] = [];
  if (probs.includes("duplicate_entry")) out.push("Ni har angett att information registreras flera gånger i olika system.");
  if (probs.includes("closing")) out.push("Ni har angett att bokslut och ekonomiarbete tar för mycket tid.");
  if (probs.includes("cases_email")) out.push("Ni har angett att kundärenden hamnar i mejl eller olika system.");
  if (out.length === 0 && picture.primary[0]) out.push(`Bedömningen gäller arbetsmoment inom ${picture.primary[0].label}.`);
  return out.slice(0, 2);
}

const LABEL: Record<ReadinessQuestionId, string> = { process: "Processen", data: "Data", ownership: "Ansvar och förvaltning", control: "Kontroll och uppföljning" };
const ANSWER_TEXT: Record<ReadinessAnswer, string> = { yes: "tydligt", partly: "delvis på plats", no: "saknas", unknown: "okänt" };

export interface ReadinessResult {
  mode: ReadinessMode;
  /** Underlaget räcker inte, visa vad som ska undersökas i stället för en säker bedömning. */
  insufficient: boolean;
  title: string;
  summary: string;
  basis: string[];
  toInvestigate: string[];
  nextSteps: { label: string; href?: string; advisory?: boolean }[];
}

const TITLES: Record<ReadinessMode, string> = {
  pilot: "Redo att undersöka en avgränsad pilot",
  promising: "Lovande, men vissa förutsättningar behöver lösas först",
  foundation: "Börja med process, data eller ansvar innan agentutveckling",
};

const INVESTIGATE: Record<ReadinessQuestionId, string> = {
  process: "Beskriv stegen och undantagen i arbetsmomentet, och hur ofta det sker.",
  data: "Ta reda på var informationen finns och hur komplett och korrekt den är.",
  ownership: "Utse en ägare för processen, behörigheterna och förvaltningen i drift.",
  control: "Bestäm var en person ska godkänna och hur fel upptäcks och rättas.",
};

export function evaluateReadiness(a: ReadinessAnswers): ReadinessResult {
  const ids = READINESS_QUESTIONS.map((q) => q.id);
  const v = (id: ReadinessQuestionId) => a[id] ?? "unknown";
  const unknown = ids.filter((id) => v(id) === "unknown");
  const no = ids.filter((id) => v(id) === "no");
  const partly = ids.filter((id) => v(id) === "partly");
  const insufficient = unknown.length >= 2;

  let mode: ReadinessMode;
  if (v("process") === "no" || v("data") === "no" || no.length >= 2) mode = "foundation";
  else if (no.length === 0 && unknown.length === 0 && partly.length <= 1 && v("process") === "yes" && v("data") === "yes") mode = "pilot";
  else mode = "promising";

  const basis = ids.map((id) => `${LABEL[id]}: ${ANSWER_TEXT[v(id)]}.`);
  const gaps = [...no, ...unknown, ...partly];
  const toInvestigate = gaps.map((id) => INVESTIGATE[id]);

  const compare = { label: "Jämför med Copilot och agenter som redan finns i Dynamics\u00A0365", href: "/copilot/" };
  const isv = { label: "Se om ett färdigt tillägg redan löser behovet", href: "/kunskapscenter/dynamics-365-tillagg/" };
  const advisory = { label: "Boka ett kostnadsfritt 20-minuterssamtal för en personlig bedömning", advisory: true };

  let nextSteps: ReadinessResult["nextSteps"];
  if (insufficient) nextSteps = [{ label: toInvestigate[0] }, { label: toInvestigate[1] }, advisory];
  else if (mode === "pilot") nextSteps = [compare, isv, { label: "Avgränsa en pilot med ett mätbart mål och en ansvarig person." }];
  else if (mode === "promising") nextSteps = [{ label: toInvestigate[0] }, compare, advisory];
  else nextSteps = [{ label: toInvestigate[0] }, ...(toInvestigate[1] ? [{ label: toInvestigate[1] }] : []), isv].slice(0, 3);

  const summary = insufficient
    ? "Flera förutsättningar är ännu okända, så vi kan inte göra en säker bedömning. Börja med att ta reda på punkterna nedan."
    : mode === "pilot"
      ? "Förutsättningarna ser goda ut för att pröva en liten, avgränsad pilot. Det betyder inte att ni ska bygga en egen agent: jämför först med det som redan finns i Dynamics\u00A0365 och färdiga tillägg."
      : mode === "promising"
        ? "Behovet passar för automation eller en agent, men några förutsättningar behöver lösas innan en pilot blir meningsfull."
        : "Grunden behöver komma på plats först. En agent förstärker en tydlig process med bra data, den ersätter dem inte.";

  return { mode, insufficient, title: insufficient ? "Underlaget räcker inte ännu" : TITLES[mode], summary, basis, toInvestigate: toInvestigate.slice(0, 3), nextSteps: nextSteps.slice(0, 3) };
}

export const READINESS_DISCLAIMER = "Bedömningen är en vägledning utifrån era svar. Den är ingen säkerhetsgranskning, teknisk certifiering eller garanti för lönsamhet.";
