// Antaganden bakom kostnadsintervallen för ERP och CRM.
// Bygger endast på siffror som redan finns i costBreakdown.ts, bcProjectEstimates.ts
// och priceSources; inga nya belopp. Behov av totalkostnad, integrationer och
// projektavgränsning identifierades i research 2026-10-13 (Systemexperterna, NAB Solutions).

export type CostAssumptions = {
  /** Vad intervallet förutsätter om projektets omfattning. */
  scope: string;
  /** Hur integrationer är räknade. */
  integrations: string;
  /** Kundens egen tid, som inte ingår i partnerns offert. */
  internal: string;
  /** Poster som inte ingår i intervallet och bör offereras separat. */
  excluded: string[];
};

export const COST_ASSUMPTIONS_CHECKED = "2026-10-27";

export const costAssumptions: Record<string, CostAssumptions> = {
  "business-central": {
    scope:
      "Intervallen är konsultdagar × 11 600 kr per dag (samma modell som businesscentral.se). Snabbstart från 50 000 kr gäller ren standard med partnerns mallar; så fort lager, egna rapporter eller anpassade flöden tillkommer räknas projektet som litet projekt (15–40 dagar) eller större.",
    integrations:
      "Litet projekt räknar med 1–2 enkla kopplingar (t.ex. bank), medel 2–4. Varje ytterligare koppling mot e-handel, EDI, lön eller lagerautomation flyttar projektet uppåt i spannet. Be partnern specificera dagar per integration.",
    internal:
      "Ekonomiansvarig, processägare och nyckelanvändare behöver tid till workshops, test och utbildning. Den tiden ingår inte i partnerns pris.",
    excluded: [
      "Licenser (löpande, per användare och månad)",
      "Tilläggsappar från AppSource och deras egna licenser",
      "Tvätt av gammal data innan migrering",
      "Förvaltningsavtal efter go-live",
    ],
  },
  "finance-scm": {
    scope:
      "Intervallen förutsätter en avgränsad första fas: litet projekt = 1 bolag och en geografi, medel = flera bolag eller länder. Roll-outs till fler bolag är egna projekt som bör offereras som separata faser.",
    integrations:
      "Litet projekt räknar med 3–5 integrationer, medel 6–12. WMS, MES och EDI är ofta de tyngsta posterna. Be partnern lista varje integration med riktning, frekvens och ansvar för andra systemets sida.",
    internal:
      "Processägare per område, master data-ansvarig och testteam behövs genom hela projektet. Planera interna resurser innan avtal tecknas.",
    excluded: [
      "Licenser och eventuella tilläggslicenser",
      "Arbete i andra system som integreras (leverantören av WMS, MES, e-handel)",
      "Förändringsledning utöver utbildning",
      "Application Management Services efter go-live (typiskt 10–20 % av projektkostnaden per år)",
    ],
  },
  sales: {
    scope:
      "Litet projekt (75 000–300 000 kr) förutsätter en gemensam säljprocess och migrering från ett befintligt CRM med mallar. Olika processer per team eller affärsområde räknas som medelstort projekt.",
    integrations:
      "Litet projekt räknar med 1–2 integrationer (oftast Outlook/Teams och en enkel koppling). Integration mot affärssystem (ERP) för kunder, order och priser ingår först i medelstort projekt.",
    internal:
      "Säljledning och några säljare behöver vara med i workshops och test. Utan ledningens engagemang används systemet sällan fullt ut, vilket är den vanligaste dolda kostnaden.",
    excluded: [
      "Licenser per säljare och månad",
      "Rensning av dubbletter och gammal kunddata",
      "Marketing automation och offertverktyg om de inte är uttryckligen med",
      "Förvaltning hos partner (typiskt 15–20 % av projektkostnaden per år)",
    ],
  },
  "customer-service": {
    scope:
      "Litet projekt (125 000–300 000 kr) förutsätter en kanal och en enkel kunskapsbas. Omnikanal, telefoni och flera varumärken räknas som medelstort eller stort projekt.",
    integrations:
      "Litet projekt räknar inte med integration mot affärssystem (ERP); den ingår i medelstort projekt. Telefoni kräver röst-tillägg eller Contact Center och bör offereras separat.",
    internal:
      "Teamledare och erfarna agenter behöver tid för att bygga kunskapsbas, köer och SLA. Kunskapsbasens kvalitet avgör hur mycket Copilot och självbetjäning ger.",
    excluded: [
      "Licenser per agent och månad",
      "Innehållsarbete i kunskapsbasen",
      "Telefoniabonnemang och samtalskostnader",
      "Förvaltning hos partner (typiskt 15–20 % av projektkostnaden per år)",
    ],
  },
};
