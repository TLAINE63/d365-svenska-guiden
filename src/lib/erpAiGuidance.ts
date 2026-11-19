/**
 * Paket 4: AI i affärssystemen (F&SCM och Business Central).
 * Ren redaktionell data, inga poäng och ingen ny bedömningsmotor. Exempel hämtas från
 * AI_EXAMPLES (verifierade mot Microsoft Learn) via slug; kontrollfrågorna återanvänds
 * från agentReadiness.ts. Status (preview, aktivering, förbrukning) är faktagranskad
 * mot Microsoft Learn 2026-11-19 och anges per funktion, aldrig som generellt löfte.
 */
import { AI_EXAMPLES, type AiExample } from "@/data/aiExamples";
import { READINESS_QUESTIONS } from "@/lib/agentReadiness";

export const VERIFIED_AT = "2026-11-19";

/** Fyra kontrollnivåer i F&SCM. Beskriver roller, aldrig hela processer som alltid autonoma eller manuella. */
export const FSCM_CONTROL_LEVELS = [
  { key: "analyze", title: "AI analyserar och föreslår", text: "Copilot sammanfattar kunder, fordringar, attestflöden och efterfrågeplaner. Människan avgör vad som händer sedan.", examples: ["finance-forsta-kund", "finance-indrivning", "scm-efterfragan"] },
  { key: "act", title: "AI utför handlingar inom givna ramar", text: "Agenter kan utföra avgränsade arbetsmoment, till exempel avstämning, med de behörigheter och regler organisationen har satt upp.", examples: ["finance-avstamning-agent", "scm-bekraftade-inkopsorder"] },
  { key: "approve", title: "Handlingar som behöver godkännande", text: "Var gränsen går beror på belopp, risk, regelverk och intern kontroll. Samma moment kan vara självgående i ett bolag och kräva attest i ett annat.", examples: ["finance-attestflode"] },
  { key: "erp", title: "Affärssystemets ansvar", text: "Data, behörigheter, transaktioner och spårbarhet ligger kvar i affärssystemet. Det är där revision och uppföljning sker, oavsett vem eller vad som utförde handlingen.", examples: [] },
] as const;

/** Faktorer som avgör lämplig kontrollnivå. */
export const FSCM_CONTROL_FACTORS = ["Risk och belopp", "Behörigheter och rollfördelning", "Regelverk och revision", "Hur väl processen är beskriven"];

/** Fyra separata dimensioner per funktion; en funktion bär flera markeringar samtidigt. */
export type BcLicense = "included" | "credits" | "partner";
export type BcMaturity = "ga" | "preview";
export const BC_LICENSE_LABEL: Record<BcLicense, string> = {
  included: "Ingår i licensen",
  credits: "Kräver Copilot Credits",
  partner: "Partner- eller ISV-licens kan tillkomma",
};
export const BC_MATURITY_LABEL: Record<BcMaturity, string> = { ga: "Allmänt tillgänglig (GA)", preview: "Förhandsversion (Preview)" };
export const BC_ACTIVATION_LABEL = "Kräver administratörsaktivering";

export interface BcCapability {
  title: string; text: string;
  license: BcLicense[];
  /** true bara när Microsoft Learn anger att en administratör måste slå på funktionen. */
  requiresActivation: boolean;
  /** Utelämnas när mognadsgraden inte är en fast egenskap (t.ex. partnerlösningar). */
  maturity?: BcMaturity;
  example?: string; sourceUrl?: string;
}

/** Business Central: status per funktion enligt Microsoft Learn (VERIFIED_AT). */
export const BC_CAPABILITIES: BcCapability[] = [
  { title: "Produkt- och marknadstexter", text: "Copilot föreslår texter för artiklar. En administratör aktiverar funktionen.", license: ["included"], requiresActivation: true, maturity: "ga", example: "bc-skapa-produkttext", sourceUrl: "https://learn.microsoft.com/sv-se/dynamics365/business-central/item-marketing-text" },
  { title: "Bankavstämning med Copilot", text: "Copilot föreslår matchningar mellan bankrader och poster. Användaren granskar innan bokföring.", license: ["included"], requiresActivation: true, maturity: "preview", example: "bc-bankavstamning", sourceUrl: "https://learn.microsoft.com/sv-se/dynamics365/business-central/bank-reconciliation-with-copilot" },
  { title: "Analys av listor med naturligt språk", text: "Beskriv analysen med egna ord. Kräver aktivering och behörighet till analysläget.", license: ["included"], requiresActivation: true, maturity: "preview", example: "bc-analysera-lista", sourceUrl: "https://learn.microsoft.com/sv-se/dynamics365/business-central/analysis-assist" },
  { title: "Chatt med Copilot i Business Central", text: "Fråga efter kunder, order, fakturor och hur processer fungerar.", license: ["included"], requiresActivation: false, maturity: "preview", example: "bc-hitta-faktura", sourceUrl: "https://learn.microsoft.com/sv-se/dynamics365/business-central/chat-with-copilot" },
  { title: "Sales Order Agent", text: "Agenten tolkar kundförfrågningar och skapar orderutkast. Utgående meddelanden granskas av en användare. Användningen debiteras med Copilot Credits.", license: ["credits"], requiresActivation: true, example: "bc-sales-order-agent", sourceUrl: "https://learn.microsoft.com/sv-se/dynamics365/business-central/sales-order-agent" },
  { title: "Egna agenter och branschtillägg", text: "Agenter för era egna processer byggs av partner eller ISV, ofta med Copilot Studio. Licens och förbrukning beror på lösningen.", license: ["partner", "credits"], requiresActivation: false },
];

/** Kontrollfrågorna återanvänds ordagrant från agentReadiness.ts. */
export const BC_READINESS_QUESTIONS = READINESS_QUESTIONS.map((q) => q.label);

export const exampleBySlug = (slug: string): AiExample | undefined => AI_EXAMPLES.find((e) => e.slug === slug);
export const isPreviewExample = (e: AiExample) => e.productStatus === "preview";
