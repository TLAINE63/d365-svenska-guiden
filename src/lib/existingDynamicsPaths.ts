/**
 * Sprint 1.3: nästa steg för befintliga Dynamics 365-kunder.
 * Valen antar aldrig att lösningen eller partnern måste bytas. Avsikten är intern,
 * visas aldrig publikt och skapar ingen affärsmöjlighet automatiskt.
 */
export type ExistingOptionKey = "vidareutveckla" | "ai" | "support" | "kompetens" | "partnersamarbete" | "annat";

export type ExistingIntent =
  | "ExistingDevelopment"
  | "ExistingAI"
  | "ExistingSupport"
  | "CompetenceSearch"
  | "PartnerChange"
  | "ExistingOther";

export interface ExistingOption {
  key: ExistingOptionKey;
  label: string;
  text: string;
  intent: ExistingIntent;
  links: { label: string; href: string }[];
}

export const EXISTING_OPTIONS: ExistingOption[] = [
  {
    key: "vidareutveckla",
    label: "Utveckla lösningen vidare",
    text: "Bygg vidare på det ni redan har: fler processer, fler applikationer, integrationer eller bättre användning.",
    intent: "ExistingDevelopment",
    links: [
      { label: "Optimera och vidareutveckla Dynamics 365", href: "/guider/optimera-dynamics-365/" },
      { label: "Affärssystem (ERP): Business Central och F&SCM", href: "/affarssystem/" },
      { label: "CRM: sälj, marknad och kundservice", href: "/crm/" },
    ],
  },
  {
    key: "ai",
    label: "Utforska AI och nya möjligheter",
    text: "Copilot och AI-agenter kan ofta tas i bruk i den lösning ni redan har. Börja med en konkret arbetsuppgift.",
    intent: "ExistingAI",
    links: [{ label: "AI och Copilot i Dynamics 365", href: "/aioversikt/" }],
  },
  {
    key: "support",
    label: "Förbättra support och förvaltning",
    text: "Tydligare supportnivåer, bättre hantering av uppdateringar och en plan för vidareutveckling.",
    intent: "ExistingSupport",
    links: [{ label: "Guide: support och förvaltning", href: "/guider/dynamics-365-support-forvaltning/" }],
  },
  {
    key: "kompetens",
    label: "Hitta Dynamics 365-kompetens",
    text: "En partner för ett avgränsat uppdrag, eller en specifik expert eller konsult som förstärker ert team.",
    intent: "CompetenceSearch",
    links: [],
  },
  {
    key: "partnersamarbete",
    label: "Utvärdera partnersamarbetet",
    text: "Bedöm vad som fungerar och vad som behöver förbättras. Det betyder inte att ni måste byta partner eller system.",
    intent: "PartnerChange",
    links: [
      { label: "Guide: utvärdera och förändra partnersamarbetet", href: "/guider/byta-dynamics-partner/" },
      { label: "Second opinion på lösning eller offert", href: "/second-opinion/" },
    ],
  },
  {
    key: "annat",
    label: "Annat behov",
    text: "Beskriv kort vad ni behöver så hjälper d365.se er att hitta rätt nästa steg.",
    intent: "ExistingOther",
    links: [],
  },
];

export const PARTNER_REVIEW_HELP = [
  "Bedöma hur samarbetet fungerar i dag",
  "Förbättra samarbetet med nuvarande partner",
  "Second opinion på lösning eller offert",
  "Undersöka alternativa partners",
] as const;

export const PARTNER_REVIEW_HORIZON = [
  "Inom 3 månader",
  "Inom 3–6 månader",
  "Inom 6–12 månader",
  "Ingen bestämd tidpunkt",
] as const;

export interface PartnerReviewDraft {
  product?: string;
  works?: string;
  improve?: string;
  help?: string;
  horizon?: string;
}

/** Rader som visas och skickas med i utvärderingen av partnersamarbetet. Bara ifyllda fält. */
export function partnerReviewLines(d: PartnerReviewDraft): string[] {
  const rows: [string, string | undefined][] = [
    ["Dynamics-produkt", d.product],
    ["Det här fungerar", d.works?.trim()],
    ["Det här behöver förbättras", d.improve?.trim()],
    ["Önskad hjälp", d.help],
    ["Tidshorisont", d.horizon],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]).map(([l, v]) => `${l}: ${v}`);
}

export function optionByKey(key: string | null | undefined): ExistingOption | undefined {
  return EXISTING_OPTIONS.find((o) => o.key === key);
}
