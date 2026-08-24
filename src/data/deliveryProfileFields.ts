// Fältdefinitioner för "Leveransprofil per produktområde".
// Texterna beskriver hur partnern engageras under och efter go-live.
// Ingen generell marknadsföring – bara kundtyper, uppdragstyper, arbetsformer
// och dokumenterad erfarenhet.

export const DELIVERY_PROFILE_MIN = 300;
export const DELIVERY_PROFILE_MAX = 500;

export type DeliveryProfileFieldKey =
  | "typicalCustomers"
  | "typicalProjects"
  | "deliveryModel"
  | "managedServices"
  | "furtherDevelopment"
  | "aiAutomation";

/** Vilken publik sektion fältet hör hemma i. */
export type DeliveryProfileGroup = "delivery" | "support";

export interface DeliveryProfileField {
  key: DeliveryProfileFieldKey;
  label: string;
  group: DeliveryProfileGroup;
  /** Kort hjälptext som styr partnern mot faktabeskrivning. */
  help: string;
  placeholder: string;
}


export const DELIVERY_PROFILE_FIELDS: DeliveryProfileField[] = [
  {
    key: "typicalCustomers",
    group: "delivery",
    label: "Typiska kunder",
    help: "Beskriv kundtyper: bransch, storlek, organisationsmognad och geografisk spridning. Inga påståenden om att du är bäst.",
    placeholder:
      "Exempel: Kunderna är främst tillverkande bolag med 100–500 anställda och en till tre produktionsenheter i Norden. Flera har tidigare kört äldre AX-versioner. Kunderna har egen IT-funktion men saknar intern D365-kompetens och köper därför både projekt och löpande förvaltning.",
  },
  {
    key: "typicalProjects",
    group: "delivery",
    label: "Typiska projekt",
    help: "Beskriv uppdragstyper: nyimplementation, uppgradering, rollout, integration, dataflytt. Ange typisk omfattning och längd.",
    placeholder:
      "Exempel: Vanligast är nyimplementation av Finance & Supply Chain Management i 9–14 månader, följt av rollout till ytterligare bolag. Återkommande uppdrag är uppgradering från AX 2012, integration mot lager- och e-handelssystem samt migrering av historiska transaktionsdata.",
  },
  {
    key: "deliveryModel",
    group: "delivery",
    label: "Leveransprofil",
    help: "Beskriv arbetsformer: teamsammansättning, metodik, sprintlängd, andel på plats/distans, kundens egna insats.",
    placeholder:
      "Exempel: Leverans sker i team om fem till åtta konsulter med lösningsarkitekt, projektledare och applikationskonsulter. Arbetet drivs i tvåveckorssprintar enligt Sure Step-anpassad metodik. Kundens verksamhetsrepresentanter deltar i workshops och tester; testledning ligger hos kunden.",
  },
  {
    key: "managedServices",
    group: "support",
    label: "Förvaltning",
    help: "Beskriv hur förvaltning efter go-live fungerar: avtalsformer, supportnivåer, uppföljning, releasehantering.",
    placeholder:
      "Exempel: Efter go-live övergår kunden till förvaltningsavtal med definierad supportnivå och namngiven förvaltningsledare. Ärenden hanteras i gemensamt ärendesystem med månatlig uppföljning. Microsofts två årliga releaser testas i sandbox innan produktionssättning.",
  },
  {
    key: "furtherDevelopment",
    group: "support",
    label: "Vidareutveckling",
    help: "Beskriv hur lösningen utvecklas vidare över tid: backlogg, budgetform, beslutsforum, typiska utvecklingsinsatser.",
    placeholder:
      "Exempel: Vidareutveckling sker via gemensam backlogg som prioriteras kvartalsvis med kundens processägare. Insatserna avser oftast nya bolag i koncernen, ytterligare integrationer och utökad rapportering. Arbetet utförs på löpande timmar inom avtalad månatlig kapacitet.",
  },
  {
    key: "aiAutomation",
    group: "delivery",
    label: "AI och automation",
    help: "Beskriv dokumenterad erfarenhet av Copilot, agenter och automation i levererade lösningar – inte planer.",
    placeholder:
      "Exempel: Genomförda insatser omfattar aktivering av Copilot i Finance för avvikelseanalys samt automatiserad fakturamatchning via Power Automate. I två leveranser har agentflöden byggts för orderbekräftelser. Arbetet görs som avgränsade delprojekt efter att grunddata har kvalitetssäkrats.",
  },
];

export const DELIVERY_FIELDS = DELIVERY_PROFILE_FIELDS.filter((f) => f.group === "delivery");
export const SUPPORT_FIELDS = DELIVERY_PROFILE_FIELDS.filter((f) => f.group === "support");

/**
 * Bedömd nivå för Support, Förvaltning & Vidareutveckling.
 * Sätts alltid av d365.se – aldrig av partnern själv.
 */
export const SUPPORT_LEVELS = ["project_focus", "managed_offering", "lifecycle_partner"] as const;
export type SupportLevel = (typeof SUPPORT_LEVELS)[number];

export const SUPPORT_LEVEL_META: Record<
  SupportLevel,
  { label: string; description: string; className: string; dot: string }
> = {
  project_focus: {
    label: "Projektfokus",
    description:
      "Partnern levererar främst projekt. Förvaltning efter go-live förekommer i begränsad form.",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  managed_offering: {
    label: "Förvaltningserbjudande",
    description:
      "Etablerat förvaltningsavtal med definierade supportnivåer och löpande uppföljning efter go-live.",
    className: "bg-accent/10 text-accent border-accent/30",
    dot: "bg-accent",
  },
  lifecycle_partner: {
    label: "Livscykelpartner",
    description:
      "Dokumenterad löpande förvaltning och strukturerad vidareutveckling av lösningen över tid.",
    className: "bg-primary/10 text-primary border-primary/30",
    dot: "bg-primary",
  },
};

export const SUPPORT_DISCLAIMER =
  "Beskrivningarna kommer från partnern. Nivån är d365.se:s bedömning utifrån tillgängligt underlag.";

export interface DeliveryProfileValue {
  typicalCustomers?: string;
  typicalProjects?: string;
  deliveryModel?: string;
  managedServices?: string;
  furtherDevelopment?: string;
  aiAutomation?: string;
  aiSummary?: string;
  aiSummaryGeneratedAt?: string;
  /** Bedömd nivå för support/förvaltning – sätts av d365.se i admin. */
  supportLevel?: SupportLevel | null;
  suggestions?: DeliveryProfileSuggestions;
}

export const isSupportProfileFilled = (v?: DeliveryProfileValue | null): boolean =>
  !!v &&
  (SUPPORT_FIELDS.some((f) => (v[f.key] || "").trim().length > 0) ||
    !!v.supportLevel);


export const isDeliveryProfileFilled = (v?: DeliveryProfileValue | null): boolean =>
  !!v && DELIVERY_PROFILE_FIELDS.some((f) => (v[f.key] || "").trim().length > 0);
