// Utökade kompetensområden (Power Platform, Copilot & AI, Copilot Studio & agenter).
// Nivåerna sätts av d365.se – aldrig av partnern själv.

import type { AiProfile } from "@/lib/aiProfile";

export const COMPETENCY_LEVELS = [
  "unverified",
  "documented_competence",
  "documented_delivery",
  "leading_competence",
] as const;

export type CompetencyLevel = (typeof COMPETENCY_LEVELS)[number];

export type CompetencyArea = "power_platform" | "copilot_ai" | "copilot_studio_agents";

export interface ExtendedCompetencies {
  power_platform?: CompetencyLevel | null;
  copilot_ai?: CompetencyLevel | null;
  copilot_studio_agents?: CompetencyLevel | null;
}

/** Internt bedömningsunderlag per område – visas aldrig publikt. */
export type ExtendedCompetencyEvidence = Partial<Record<CompetencyArea, string>>;

export const COMPETENCY_AREAS: Array<{
  key: CompetencyArea;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    key: "power_platform",
    label: "Power Platform",
    shortLabel: "Power Platform",
    description:
      "Förmåga att använda Power Platform som en del av Dynamics 365-lösningen – appar, automation, Dataverse, rapportering och processutveckling.",
  },
  {
    key: "copilot_ai",
    label: "Copilot & AI",
    shortLabel: "Copilot & AI",
    description:
      "Förmåga att implementera och använda Microsofts inbyggda Copilot- och AI-funktioner i Dynamics 365 och integrera dem i verksamhetsprocesser.",
  },
  {
    key: "copilot_studio_agents",
    label: "Copilot Studio & agenter",
    shortLabel: "Copilot Studio",
    description:
      "Förmåga att utveckla egna agenter, bygga lösningar i Copilot Studio och automatisera processer med AI-agenter kopplade till Dynamics 365.",
  },
];

export const LEVEL_META: Record<
  CompetencyLevel,
  { label: string; shortLabel: string; rank: number; description: string; className: string; dot: string }
> = {
  unverified: {
    label: "Ej verifierad",
    shortLabel: "Ej verifierad",
    rank: 1,
    description: "Partnern uppger kompetens men d365.se har inte kunnat verifiera den.",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
  },
  documented_competence: {
    label: "Dokumenterad kompetens",
    shortLabel: "Dok. kompetens",
    rank: 2,
    description:
      "Kompetensen stöds av erbjudanden, expertområden, certifieringar eller dokumenterad specialistkunskap.",
    className: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-900",
    dot: "bg-sky-500",
  },
  documented_delivery: {
    label: "Dokumenterad leverans",
    shortLabel: "Dok. leverans",
    rank: 3,
    description:
      "Det finns dokumenterade kundprojekt, referenser, kundcase eller verifierade implementationer.",
    className:
      "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-900",
    dot: "bg-orange-500",
  },
  leading_competence: {
    label: "Ledande kompetens",
    shortLabel: "Ledande",
    rank: 4,
    description:
      "Omfattande erfarenhet, flera dokumenterade leveranser, referenser, thought leadership och tydlig marknadsposition inom området.",
    className:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900",
    dot: "bg-emerald-500",
  },
};

export const ASSESSMENT_DISCLAIMER =
  "Bedömningen baseras på partnerns uppgifter, dokumenterade erbjudanden, kundprojekt och publikt tillgängligt underlag.";

export function normalizeCompetencies(raw: unknown): ExtendedCompetencies {
  const out: ExtendedCompetencies = {};
  if (!raw || typeof raw !== "object") return out;
  for (const area of COMPETENCY_AREAS) {
    const value = (raw as Record<string, unknown>)[area.key];
    if (typeof value === "string" && (COMPETENCY_LEVELS as readonly string[]).includes(value)) {
      out[area.key] = value as CompetencyLevel;
    }
  }
  return out;
}

export function levelRank(level?: CompetencyLevel | null): number {
  return level ? LEVEL_META[level].rank : 0;
}

export function hasAnyCompetency(c?: ExtendedCompetencies | null): boolean {
  if (!c) return false;
  return COMPETENCY_AREAS.some((a) => !!c[a.key]);
}

/** Uppfyller partnern minst den efterfrågade nivån inom området? */
export function meetsLevel(
  c: ExtendedCompetencies | null | undefined,
  area: CompetencyArea,
  minLevel: CompetencyLevel,
): boolean {
  return levelRank(c?.[area]) >= LEVEL_META[minLevel].rank;
}

/**
 * Sekundär rankingsignal (0–100 skala i mindre steg) – Dynamics-kompetens
 * (produkt + bransch) ska alltid väga tyngre och beräknas separat.
 */
export function competencyRankBonus(
  c: ExtendedCompetencies | null | undefined,
  requested: Partial<Record<CompetencyArea, CompetencyLevel>>,
): number {
  let bonus = 0;
  for (const [area, min] of Object.entries(requested) as Array<[CompetencyArea, CompetencyLevel]>) {
    if (!min) continue;
    const rank = levelRank(c?.[area]);
    if (rank === 0) continue;
    bonus += Math.max(0, rank - LEVEL_META[min].rank + 1) * 2;
  }
  return Math.min(12, bonus);
}

const AREA_PHRASE: Record<CompetencyArea, Record<CompetencyLevel, string>> = {
  power_platform: {
    unverified:
      "uppger kompetens inom Power Platform, men den är ännu inte verifierad av d365.se",
    documented_competence:
      "har dokumenterad kompetens inom Power Platform med appar, automation och Dataverse som del av Dynamics 365-lösningen",
    documented_delivery:
      "har dokumenterade kundleveranser där Power Platform används för appar, automation och processutveckling kopplat till Dynamics 365",
    leading_competence:
      "har en ledande position inom Power Platform med omfattande erfarenhet av appar, automation, Dataverse och rapportering i Dynamics 365-projekt",
  },
  copilot_ai: {
    unverified:
      "uppger erfarenhet av Copilot och AI i Dynamics 365, men den är ännu inte verifierad av d365.se",
    documented_competence:
      "har dokumenterad kompetens inom Microsofts inbyggda Copilot- och AI-funktioner i Dynamics 365",
    documented_delivery:
      "har dokumenterad erfarenhet av att implementera Microsoft Copilot- och AI-funktioner i Dynamics 365 och koppla dem till verksamhetsprocesser",
    leading_competence:
      "har en ledande position inom Copilot och AI i Dynamics 365 med flera dokumenterade leveranser och tydlig marknadsnärvaro",
  },
  copilot_studio_agents: {
    unverified:
      "uppger erfarenhet av Copilot Studio och AI-agenter, men den är ännu inte verifierad av d365.se",
    documented_competence:
      "har dokumenterad kompetens inom Copilot Studio och agentlösningar kopplade till Dynamics 365",
    documented_delivery:
      "har dokumenterade kundprojekt där egna agenter och lösningar i Copilot Studio automatiserar processer i Dynamics 365",
    leading_competence:
      "har en ledande position inom Copilot Studio och AI-agenter med flera dokumenterade leveranser kopplade till Dynamics 365",
  },
};

/** Genererar en löpande, neutral text utifrån nivåerna. */
export function competencyNarrative(
  c: ExtendedCompetencies | null | undefined,
  partnerName?: string,
): string {
  if (!hasAnyCompetency(c)) return "";
  const subject = partnerName?.trim() || "Partnern";
  const ordered = COMPETENCY_AREAS.map((a) => ({ area: a.key, level: c![a.key] }))
    .filter((x): x is { area: CompetencyArea; level: CompetencyLevel } => !!x.level)
    .sort((a, b) => levelRank(b.level) - levelRank(a.level));

  const phrases = ordered.map((x) => AREA_PHRASE[x.area][x.level]);
  if (phrases.length === 1) return `${subject} ${phrases[0]}.`;
  const first = phrases[0];
  const rest = phrases.slice(1);
  const restText =
    rest.length === 1 ? rest[0] : `${rest.slice(0, -1).join(", ")} och ${rest[rest.length - 1]}`;
  return `${subject} ${first}. Därutöver ${restText}.`;
}

/**
 * Föreslår nivåer per område utifrån partnerns ai_profile (capabilities,
 * erfarenhet, evidens, projektantal) och eventuell egen beskrivning (input).
 * Syftet är en utgångspunkt som d365.se granskar och justerar i admin – inte ett
 * slutgiltigt betyg. Konservativ: utan underlag lämnas området obedömt (null).
 */
export function suggestExtendedCompetencies(
  ai?: AiProfile | null,
  input?: ExtendedCompetencyEvidence | null,
): ExtendedCompetencies {
  const caps = ai?.capabilities || [];
  const exp = ai?.experience_level || "";
  const ev = ai?.evidence_level || [];
  const proj = ai?.project_count_range || "";

  const strongEv = ev.some((e) =>
    ["public-case", "reviewed", "reference-on-request"].includes(e),
  );
  const deliveryExp = ["delivered", "multiple", "packaged", "established"].includes(exp);
  const someExp = !!exp;
  const hasCap = (codes: string[]) => caps.some((c) => codes.includes(c));
  const inputText = (area: CompetencyArea) => (input?.[area]?.trim() || "");
  const hasInput = (area: CompetencyArea) => inputText(area).length > 80;

  const levelFor = (area: CompetencyArea, capCodes: string[]): CompetencyLevel | null => {
    const capPresent = hasCap(capCodes);
    const claimed = capPresent || hasInput(area);
    if (!claimed) return null;
    // Ledande: etablerad leveransmodell + stark evidens + flera projekt
    if (exp === "established" && strongEv && ["6-10", "10+"].includes(proj)) {
      return "leading_competence";
    }
    // Dokumenterad leverans: kundprojekt påvisade
    if (deliveryExp || strongEv) return "documented_delivery";
    // Dokumenterad kompetens: erfarenhet angiven (rådgivning/pilot räknas)
    if (someExp) return "documented_competence";
    // Uppger kompetens men saknar verifierbar erfarenhet
    return "unverified";
  };

  return {
    power_platform: levelFor("power_platform", ["power-platform"]),
    copilot_ai: levelFor("copilot_ai", ["standard-copilot", "azure-ai", "fabric-bi"]),
    copilot_studio_agents: levelFor("copilot_studio_agents", ["copilot-studio"]),
  };
}
