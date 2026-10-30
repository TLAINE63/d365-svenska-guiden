/**
 * WP1 – rådgivningsledd partnerintroduktion.
 * Logisk modell: Advisory Booking (inquiries med is_advisory), Advisory Case och Partner Introduction.
 * Samma regler upprätthålls i databasen (triggers); här används de för att förklara läget i admin innan man sparar.
 */

export const ADVISORY_CTA = {
  compare: "Boka genomgång av mina valda partners",
  partner_switch: "Få en second opinion",
  needs_guide: "Diskutera vår behovsanalys",
  tool_result: "Boka genomgång av resultatet",
} as const;

export const PLACEMENT_LABEL: Record<string, string> = {
  compare: "Partnerjämförelse",
  partner_switch: "Partnerbytesanalys",
  needs_guide: "Behovsguidens resultat",
  tool_result: "Kalkylator/kravspecifikation",
  second_opinion: "Second opinion-sidan",
  plan: "Min D365-plan",
  home: "Startsidan",
  partner_search: "Partnersökningen",
};

export const CASE_STATUSES = [
  ["ny", "Ny"],
  ["mote_bokat", "Möte bokat"],
  ["mote_genomfort", "Möte genomfört"],
  ["introduktion", "Introduktion pågår"],
  ["avslutad", "Avslutad"],
] as const;

export const BOOKING_STATUSES = [
  ["forfragan", "Förfrågan"],
  ["bokad", "Bokad"],
  ["genomford", "Genomförd"],
  ["avbokad", "Avbokad"],
  ["uteblev", "Uteblev"],
] as const;

export const INTRO_STATUSES = [
  ["forberedd", "Förberedd (ej skickad)"],
  ["introducerad", "Introducerad"],
  ["dialog", "Dialog"],
  ["kvalificerad", "Kvalificerad möjlighet"],
  ["vunnen", "Vunnen"],
  ["forlorad", "Förlorad"],
  ["okand", "Okänd"],
] as const;
export type IntroStatus = (typeof INTRO_STATUSES)[number][0];

export const PARTNER_RESPONSES = [
  ["vantar", "Inväntar svar"],
  ["accepterad", "Accepterat dialog"],
  ["avbojd", "Avböjt"],
] as const;

/** Vad kunden kan godkänna att dela med en specifik partner. */
export const CONSENT_SCOPE_OPTIONS = [
  ["kontaktuppgifter", "Kontaktuppgifter"],
  ["behovssammanfattning", "Behovssammanfattning"],
  ["kopresans_underlag", "Underlag från köpresan"],
  ["budget_tidplan", "Budget och tidplan"],
] as const;

export interface IntroRuleInput {
  consent_given: boolean;
  consent_at: string | null;
  consent_scope: string[];
  introduced_at: string | null;
  partner_response: string;
  next_step: string | null;
  business_status: string;
}

/** Introduktionen får skickas först när kundens godkännande och delningsomfång är dokumenterade. */
export function sendBlockers(i: Pick<IntroRuleInput, "consent_given" | "consent_at" | "consent_scope">): string[] {
  const out: string[] = [];
  if (!i.consent_given) out.push("Kundens godkännande är inte dokumenterat");
  if (!i.consent_at) out.push("Datum för godkännandet saknas");
  if (!i.consent_scope.length) out.push("Det är inte angivet vilken information kunden godkänt att dela");
  return out;
}

/** "Kvalificerad möjlighet": konkret behov + partnern har accepterat + konkret nästa steg. Budget/tidplan krävs inte. */
export function qualificationGaps(caseNeed: string | null, i: Pick<IntroRuleInput, "partner_response" | "next_step">): string[] {
  const out: string[] = [];
  if (!caseNeed?.trim()) out.push("Inget konkret kundbehov är dokumenterat i ärendet");
  if (i.partner_response !== "accepterad") out.push("Partnern har inte accepterat dialogen");
  if (!i.next_step?.trim()) out.push("Inget konkret nästa steg är registrerat");
  return out;
}

/** Vilka statusar som är tillåtna just nu, givet regler ovan. */
export function allowedStatuses(caseNeed: string | null, i: IntroRuleInput): IntroStatus[] {
  if (!i.introduced_at) return ["forberedd"];
  const all = INTRO_STATUSES.map(([v]) => v).filter((v) => v !== "forberedd") as IntroStatus[];
  return qualificationGaps(caseNeed, i).length ? all.filter((v) => v !== "kvalificerad") : all;
}

/** Konverteringstyp – hålls isär i både data och mätning. */
export type ConversionType = "direct_partner_request" | "advisory_with_introduction" | "advisory_without_introduction";
export function caseConversionType(introCount: number): ConversionType {
  return introCount > 0 ? "advisory_with_introduction" : "advisory_without_introduction";
}
