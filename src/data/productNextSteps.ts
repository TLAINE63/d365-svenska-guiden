/**
 * Manuellt underhållen data för avslutningsmodulen "Nästa steg för ert beslut".
 * Samma struktur för alla produkter, så att BC, F&SCM och CRM-apparna behandlas likvärdigt.
 */
export type NextStepsProductKey = "bc" | "fsc" | "sales" | "service";

export interface ProductNextStepsConfig {
  /** Visningsnamn, hålls ihop med nowrap i UI. */
  label: string;
  /** Nyckel i partnerns product_filters. */
  partnerKey: NextStepsProductKey;
  /** Etikett för klickmätning. */
  application: string;
  calc: { text: string; links: { label: string; href: string }[] };
  questions: [string, string, string];
}

export const productNextSteps: Record<string, ProductNextStepsConfig> = {
  "business-central": {
    label: "Business Central",
    partnerKey: "bc",
    application: "Business Central",
    calc: {
      text: "Räkna på införande, licensmix och nytta över tid innan ni pratar med en partner.",
      links: [
        { label: "ROI-kalkylator för Business Central", href: "/businesscentral/roi-kalkylator/" },
        { label: "Matchningstest: passar Business Central?", href: "/businesscentral/matchningstest/" },
        { label: "Kostnad och TCO", href: "/kostnad/" },
      ],
    },
    questions: [
      "Hur stor andel av era projekt levereras som standard jämfört med anpassningar?",
      "Vilka färdiga tillägg och integrationer rekommenderar ni för vår bransch, och varför?",
      "Hur ser er förvaltning och support ut efter driftstart?",
    ],
  },
  "finance-supply-chain": {
    label: "Finance & Supply Chain",
    partnerKey: "fsc",
    application: "Finance & SCM",
    calc: {
      text: "Bedöm om behoven kräver F&SCM och vad helheten kostar över flera år.",
      links: [
        { label: "ROI-kalkylator för F&SCM", href: "/finance-supply-chain/roi-kalkylator/" },
        { label: "Matchningstest: passar F&SCM?", href: "/finance-supply-chain-management/matchningstest/" },
        { label: "Jämför alternativ", href: "/jamfor/" },
      ],
    },
    questions: [
      "Vilken erfarenhet har ni av utrullning till flera bolag och länder?",
      "Hur hanterar ni datamigrering och prestanda vid stora transaktionsvolymer?",
      "Vilka interna resurser behöver vi avsätta under införandet?",
    ],
  },
  sales: {
    label: "Sales",
    partnerKey: "sales",
    application: "Sales",
    calc: {
      text: "Räkna på säljnytta och ta fram era krav innan ni jämför partners.",
      links: [
        { label: "ROI-kalkylator för Sales", href: "/d365sales/roi-kalkylator/" },
        { label: "Matchningstest för Sales", href: "/d365sales/matchningstest/" },
        { label: "Kravspecifikation för säljstöd", href: "/kravspecifikation-sales/" },
      ],
    },
    questions: [
      "Hur arbetar ni med användaradoption så att säljarna faktiskt använder systemet?",
      "Hur kopplar ni Sales mot vårt affärssystem och andra datakällor?",
      "Hur säkerställer ni datakvalitet och behörigheter från start?",
    ],
  },
  "customer-service": {
    label: "Customer Service",
    partnerKey: "service",
    application: "Customer Service",
    calc: {
      text: "Räkna på effekten i kundservice och samla era krav på ett ställe.",
      links: [
        { label: "ROI-kalkylator för Customer Service", href: "/d365customerservice/roi-kalkylator/" },
        { label: "Matchningstest för Customer Service", href: "/d365customerservice/matchningstest/" },
        { label: "Kravspecifikation för kundservice", href: "/kravspecifikation-kundservice/" },
      ],
    },
    questions: [
      "Hur sätter ni upp ärendeflöden, köer och SLA för en verksamhet som vår?",
      "Vilken erfarenhet har ni av Copilot och kunskapsbas i kundservice?",
      "Hur mäter vi att handläggningstid och kundnöjdhet faktiskt förbättras?",
    ],
  },
  "field-service": {
    label: "Field Service",
    partnerKey: "service",
    application: "Field Service",
    calc: {
      text: "Räkna på planering, körtid och förstagångslösning innan ni väljer partner.",
      links: [
        { label: "ROI-kalkylator för Field Service", href: "/d365fieldservice/roi-kalkylator/" },
        { label: "Matchningstest för Field Service", href: "/d365fieldservice/matchningstest/" },
        { label: "Kostnad och TCO", href: "/kostnad/" },
      ],
    },
    questions: [
      "Hur har ni löst schemaläggning och mobil app för tekniker i liknande uppdrag?",
      "Hur integreras serviceorder med lager, inköp och fakturering i vårt affärssystem?",
      "Hur hanterar ni offline-arbete och uppkopplade enheter (IoT)?",
    ],
  },
  marketing: {
    label: "Customer Insights",
    partnerKey: "sales",
    application: "Customer Insights (Marketing)",
    calc: {
      text: "Räkna på marknadsnytta och ta fram krav för kunddata och kampanjer.",
      links: [
        { label: "ROI-kalkylator för Customer Insights", href: "/d365marketing/roi-kalkylator/" },
        { label: "Matchningstest för Customer Insights", href: "/d365marketing/matchningstest/" },
        { label: "Kravspecifikation för marknad", href: "/kravspecifikation-marketing/" },
      ],
    },
    questions: [
      "Hur samlar ni kunddata från flera källor till en gemensam kundbild?",
      "Hur hanterar ni samtycken och GDPR i kampanjer och kundresor?",
      "Hur ser samarbetet mellan marknad och sälj ut i lösningen?",
    ],
  },
  "contact-center": {
    label: "Contact Center",
    partnerKey: "service",
    application: "Contact Center",
    calc: {
      text: "Räkna på kanaler, volymer och bemanning innan ni jämför partners.",
      links: [
        { label: "ROI-kalkylator för Contact Center", href: "/d365contactcenter/roi-kalkylator/" },
        { label: "Matchningstest för Contact Center", href: "/d365contactcenter/matchningstest/" },
        { label: "Kostnad och TCO", href: "/kostnad/" },
      ],
    },
    questions: [
      "Vilka kanaler (röst, chatt, sociala medier) har ni infört i liknande miljöer?",
      "Hur kopplar ni befintlig telefoni och Teams till lösningen?",
      "Hur använder ni Copilot och automatisering utan att försämra kundupplevelsen?",
    ],
  },
};
