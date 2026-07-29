// Konfiguration för den inbäddade ROI/TCO-analysen per produkt.
// Drivare och baslinjer är konservativa, baserade på Microsofts Business Value
// Assessment + svenska partnerbenchmarks. Värden ska ge storleksordning – inte
// ersätta en business case-analys.

export type ProductRoiKey =
  | "business-central"
  | "finance-scm"
  | "sales"
  | "customer-service"
  | "customer-insights"
  | "contact-center"
  | "field-service";

export interface RoiDriverDef {
  id: string;
  label: string;
  hint: string;
  detail: string;
  /** Returnerar uppskattad årlig nytta i SEK för en baslinje på 25 användare. */
  savings: (ctx: { revenue: number }) => number;
  /** Engångskostnad som adderas till implementation om drivaren är aktiv. */
  implCost: number;
  defaultOn?: boolean;
}

export interface LicenseLineDef {
  /** Nyckel i prisregistret (productPricesFallback / usePriceMap). */
  skuKey: string;
  label: string;
  defaultCount: number;
  /** Om SKU prissätts per tenant istället för per user. */
  perTenant?: boolean;
  /** Fallback-pris om SKU saknas, SEK/mån. */
  fallbackPrice?: number;
}

export interface ProductRoiConfig {
  productKey: ProductRoiKey;
  productName: string;
  productShort: string;
  /** Slug-prefix använt i bl.a. pdf filename. */
  fileSlug: string;
  /** SEK för "Medel"-implementation, exkl. drivare/integrationer. */
  baseImplementation: number;
  /** Per‑seat-skalning över baseline (25 användare): +X% per användare. */
  implUserScale: number;
  /** Förvaltningsandel av implementation/år (steady state). */
  supportPctYearly: number;
  /** Förvaltningsandel år 1 (lägre – projektet pågår). */
  supportPctYear1: number;
  /** Default omsättning. */
  defaultRevenue: number;
  /** Nuvarande IT-kostnad/år default. */
  defaultCurrentItCost: number;
  /** Default antal integrationer. */
  defaultIntegrations: number;
  licenseLines: LicenseLineDef[];
  drivers: RoiDriverDef[];
  /** Länk till djup-kalkylator om en sådan finns (BC, Sales). */
  deepDivePath?: string;
  /** Etikett på licens-rubrik. */
  licenseHeading: string;
}

const flat = (sek: number) => () => sek;
const pctOfRev = (pct: number, cap = Infinity) =>
  ({ revenue }: { revenue: number }) =>
    Math.min(cap, Math.max(0, revenue) * pct);

export const PRODUCT_ROI_CONFIGS: Record<ProductRoiKey, ProductRoiConfig> = {
  "business-central": {
    productKey: "business-central",
    productName: "Business Central",
    productShort: "BC",
    fileSlug: "bc",
    baseImplementation: 500_000,
    implUserScale: 0.012,
    supportPctYearly: 0.18,
    supportPctYear1: 0.08,
    defaultRevenue: 45_000_000,
    defaultCurrentItCost: 300_000,
    defaultIntegrations: 3,
    licenseHeading: "Licenser (BC)",
    deepDivePath: "/businesscentral/roi-kalkylator/",
    licenseLines: [
      { skuKey: "bc-essentials", label: "Essentials full users", defaultCount: 25 },
      { skuKey: "bc-team-members", label: "Team Members", defaultCount: 10 },
    ],
    drivers: [
      {
        id: "ap-automation",
        label: "Automatiserad leverantörsfaktura",
        hint: "OCR + matchning mot inköpsorder",
        detail:
          "Pappers-/PDF-fakturor läses in via OCR, matchas mot inköpsorder och attesteras digitalt. En typisk ekonomiavdelning sparar 10–20 min per faktura och får färre dröjsmålsräntor.",
        savings: flat(80_000),
        implCost: 50_000,
        defaultOn: true,
      },
      {
        id: "stock-accuracy",
        label: "Lagerprecision & plockeffektivitet",
        hint: "Streckkod/handdator, färre felplock",
        detail:
          "Plock via handdator minskar felplock från 1–2 % till under 0,3 % och höjer plockproduktiviteten 15–25 %. Mindre returer, lägre svinn och färre timmar i lagret.",
        savings: pctOfRev(0.003, 250_000),
        implCost: 100_000,
        defaultOn: true,
      },
      {
        id: "month-end",
        label: "Snabbare bokslut",
        hint: "Avstämningar och rapporter direkt i BC",
        detail:
          "Integrerad redovisning, automatiska periodiseringar och Power BI förkortar månadsbokslut med 2–4 dagar. Frigör 0,2–0,5 FTE på ekonomi.",
        savings: flat(120_000),
        implCost: 40_000,
        defaultOn: true,
      },
      {
        id: "reporting",
        label: "Beslutsstöd & Power BI",
        hint: "Realtidsrapporter ersätter Excel-arbete",
        detail:
          "Standardrapporter och Power BI-dashboards mot BC ersätter manuella Excel-utdrag. Bättre beslut, mindre 'rapport-tisdag'-arbete.",
        savings: pctOfRev(0.002, 200_000),
        implCost: 60_000,
      },
    ],
  },

  "finance-scm": {
    productKey: "finance-scm",
    productName: "Finance & Supply Chain Management",
    productShort: "F&SCM",
    fileSlug: "fscm",
    baseImplementation: 2_500_000,
    implUserScale: 0.010,
    supportPctYearly: 0.18,
    supportPctYear1: 0.08,
    defaultRevenue: 800_000_000,
    defaultCurrentItCost: 2_500_000,
    defaultIntegrations: 6,
    licenseHeading: "Licenser (Finance & SCM)",
    licenseLines: [
      { skuKey: "finance", label: "Finance full users", defaultCount: 40 },
      { skuKey: "supply-chain-management", label: "SCM full users", defaultCount: 60 },
    ],
    drivers: [
      {
        id: "supply-planning",
        label: "Bättre supply-/MPS-planering",
        hint: "Lägre lagernivåer, högre leveransprecision",
        detail:
          "Planning Optimization och MPS sänker säkerhetslager 10–20 % och höjer leveransprecision 3–5 %. Frigör rörelsekapital och minskar uteblivna order.",
        savings: pctOfRev(0.006, 6_000_000),
        implCost: 400_000,
        defaultOn: true,
      },
      {
        id: "finance-close",
        label: "Koncernbokslut & avstämning",
        hint: "Multi-bolag och valuta i en finance-instans",
        detail:
          "Konsolidering, intercompany och periodiseringar automatiseras. Bolag med 5–15 dotterbolag sparar typiskt 2–4 veckor per år på bokslutsarbete.",
        savings: flat(900_000),
        implCost: 350_000,
        defaultOn: true,
      },
      {
        id: "procurement",
        label: "Inköp & leverantörsstyrning",
        hint: "Avtalsefterlevnad och bättre villkor",
        detail:
          "Sourcing, avtalsstyrning och PO-flöden ger 1–3 % lägre inköpskostnader på adresserbar spend genom bättre efterlevnad och förhandlingsläge.",
        savings: pctOfRev(0.004, 5_000_000),
        implCost: 300_000,
        defaultOn: true,
      },
      {
        id: "warehouse",
        label: "Avancerat WMS",
        hint: "Vågning, wave-plock, slotting",
        detail:
          "Inbyggt WMS med wave-plock och slotting höjer plockproduktivitet 15–25 % och sänker fellevereanser. Ger märkbar effekt i lager med 20+ medarbetare.",
        savings: pctOfRev(0.003, 3_000_000),
        implCost: 500_000,
      },
      {
        id: "compliance",
        label: "Regelefterlevnad & spårbarhet",
        hint: "Audit trail, SoX/ISO, e-fakturering",
        detail:
          "Spårbarhet, attestflöden och Peppol/e-fakturering reducerar revisionskostnader och böter. Värdet växer med juridisk exponering (export, FDA, GxP).",
        savings: flat(400_000),
        implCost: 250_000,
      },
    ],
  },

  sales: {
    productKey: "sales",
    productName: "Dynamics 365 Sales",
    productShort: "Sales",
    fileSlug: "sales",
    baseImplementation: 600_000,
    implUserScale: 0.010,
    supportPctYearly: 0.16,
    supportPctYear1: 0.07,
    defaultRevenue: 250_000_000,
    defaultCurrentItCost: 600_000,
    defaultIntegrations: 3,
    licenseHeading: "Licenser (Sales)",
    deepDivePath: "/d365sales/roi-kalkylator/",
    licenseLines: [
      { skuKey: "sales-enterprise", label: "Sales Enterprise", defaultCount: 25 },
    ],
    drivers: [
      {
        id: "win-rate",
        label: "Högre vinstandel",
        hint: "Pipeline-hygien + AI-scoring",
        detail:
          "Lead/opportunity scoring, nästa-bästa-aktion och bättre pipeline-hygien ger 2–5 procentenheter högre vinstandel. Estimeras som % av påverkbar pipeline.",
        savings: pctOfRev(0.008, 6_000_000),
        implCost: 150_000,
        defaultOn: true,
      },
      {
        id: "admin-time",
        label: "Mindre admin för säljare",
        hint: "Outlook-/Teams-integration, Copilot",
        detail:
          "Copilot summerar möten, drafts e-post och uppdaterar CRM. Säljarna får tillbaka 3–5 h/vecka – motsvarande 8–12 % effektivare team.",
        savings: flat(450_000),
        implCost: 80_000,
        defaultOn: true,
      },
      {
        id: "forecast",
        label: "Bättre prognoser",
        hint: "Forecast-vyer och AI-insikter",
        detail:
          "Tydliga prognosvyer på säljare/team minskar 'sandbagging' och prognosmissar. Ledningen får bättre beslutsunderlag inför rekrytering och kapacitet.",
        savings: flat(300_000),
        implCost: 60_000,
        defaultOn: true,
      },
      {
        id: "marketing-handover",
        label: "Tydlig MQL→SQL-överlämning",
        hint: "Marketing/Customer Insights kopplat till Sales",
        detail:
          "Gemensam datamodell mellan marknad och sälj minskar leadläckage och förbättrar konvertering. Tydligast effekt vid 3+ marknadsföringskampanjer/år.",
        savings: pctOfRev(0.003, 2_500_000),
        implCost: 120_000,
      },
    ],
  },

  "customer-service": {
    productKey: "customer-service",
    productName: "Dynamics 365 Customer Service",
    productShort: "CS",
    fileSlug: "customer-service",
    baseImplementation: 700_000,
    implUserScale: 0.011,
    supportPctYearly: 0.17,
    supportPctYear1: 0.07,
    defaultRevenue: 200_000_000,
    defaultCurrentItCost: 500_000,
    defaultIntegrations: 3,
    licenseHeading: "Licenser (Customer Service)",
    licenseLines: [
      { skuKey: "customer-service-enterprise", label: "Customer Service Enterprise", defaultCount: 25 },
    ],
    drivers: [
      {
        id: "deflection",
        label: "Ärendedeflektering via självservice",
        hint: "Kunskapsbas, portal och chatbot",
        detail:
          "Kunskapsartiklar, portal och AI-chatbot deflekterar 15–30 % av enkla ärenden. Sparar agenttid och ger snabbare svar för kund.",
        savings: flat(900_000),
        implCost: 120_000,
        defaultOn: true,
      },
      {
        id: "aht",
        label: "Kortare handläggningstid",
        hint: "Copilot för sammanfattning & svarsförslag",
        detail:
          "Copilot summerar ärendet, föreslår svar och skapar kunskapsutkast. Typisk effekt: 10–20 % kortare handläggningstid och bättre kvalitet.",
        savings: flat(750_000),
        implCost: 80_000,
        defaultOn: true,
      },
      {
        id: "omnichannel",
        label: "Omnikanal & smart routing",
        hint: "Chat/SMS/e-post i samma kö",
        detail:
          "En ärendekö över alla kanaler, skill-based routing och tydlig SLA-uppföljning. Minskar manuell triage och höjer first-contact-resolution.",
        savings: flat(500_000),
        implCost: 150_000,
        defaultOn: true,
      },
      {
        id: "csat",
        label: "Högre kundnöjdhet & retention",
        hint: "Bättre upplevelse → mindre churn",
        detail:
          "Lägre svarstider och konsekvent kvalitet ökar CSAT/NPS och minskar churn. Värdet skalas med årlig återkommande intäkt.",
        savings: pctOfRev(0.003, 2_500_000),
        implCost: 80_000,
      },
    ],
  },

  "customer-insights": {
    productKey: "customer-insights",
    productName: "Dynamics 365 Customer Insights",
    productShort: "CI",
    fileSlug: "customer-insights",
    baseImplementation: 800_000,
    implUserScale: 0.008,
    supportPctYearly: 0.17,
    supportPctYear1: 0.07,
    defaultRevenue: 300_000_000,
    defaultCurrentItCost: 700_000,
    defaultIntegrations: 4,
    licenseHeading: "Licenser (Customer Insights)",
    licenseLines: [
      {
        skuKey: "customer-insights-attach",
        label: "Customer Insights (attach)",
        defaultCount: 1,
        perTenant: true,
      },
    ],
    drivers: [
      {
        id: "segmentation",
        label: "Bättre segmentering & träffsäkerhet",
        hint: "Enad kundprofil + AI-segment",
        detail:
          "Unified profile + AI-driven segmentering höjer kampanjkonvertering 15–30 %. Mindre 'spray-and-pray', mer relevant kommunikation.",
        savings: pctOfRev(0.006, 5_000_000),
        implCost: 200_000,
        defaultOn: true,
      },
      {
        id: "journeys",
        label: "Automatiserade resor (Journeys)",
        hint: "Realtidsresor på events & beteende",
        detail:
          "Realtidsresor reagerar på beteende (klick, besök, signaler) och flyttar leads framåt utan manuell hantering. Höjer MQL→SQL-konvertering.",
        savings: flat(700_000),
        implCost: 180_000,
        defaultOn: true,
      },
      {
        id: "churn",
        label: "Churn-prediktion & retention",
        hint: "AI flaggar risk innan kunden lämnar",
        detail:
          "Out-of-the-box prediktioner pekar ut kunder i riskzonen så CS/Sales kan agera. Värdet är störst vid återkommande affär (SaaS, abonnemang).",
        savings: pctOfRev(0.004, 4_000_000),
        implCost: 150_000,
      },
      {
        id: "unified-data",
        label: "Enad kunddata (CDP-värde)",
        hint: "Ersätter delar av tredjepartsverktyg",
        detail:
          "Inbyggd CDP-funktionalitet kan ersätta separata segmenterings-/profilverktyg (typ ~150–600 k kr/år) och minskar dubbeldatahållning.",
        savings: flat(400_000),
        implCost: 100_000,
      },
    ],
  },

  "contact-center": {
    productKey: "contact-center",
    productName: "Dynamics 365 Contact Center",
    productShort: "CC",
    fileSlug: "contact-center",
    baseImplementation: 900_000,
    implUserScale: 0.010,
    supportPctYearly: 0.18,
    supportPctYear1: 0.08,
    defaultRevenue: 250_000_000,
    defaultCurrentItCost: 1_200_000,
    defaultIntegrations: 4,
    licenseHeading: "Licenser (Contact Center)",
    licenseLines: [
      { skuKey: "contact-center-komplett", label: "Contact Center (komplett)", defaultCount: 30 },
    ],
    drivers: [
      {
        id: "voice-deflection",
        label: "Röst- & digital deflektering",
        hint: "Voice bot + IVR + chatbot",
        detail:
          "AI-driven voice bot och chatbot tar enklare ärenden utan agent. Typiskt 10–25 % deflektering i mogna implementationer.",
        savings: flat(1_200_000),
        implCost: 250_000,
        defaultOn: true,
      },
      {
        id: "agent-assist",
        label: "Agent assist & Copilot",
        hint: "Sammanfattning, nästa-bästa-svar",
        detail:
          "Copilot i agentgränssnittet ger sammanfattning, intent-detection och svarsförslag. 10–15 % kortare handläggningstid och bättre kvalitet.",
        savings: flat(750_000),
        implCost: 120_000,
        defaultOn: true,
      },
      {
        id: "platform-consolidation",
        label: "Konsolidera kontaktcenter­plattform",
        hint: "Ersätta separat telefoni/IVR/CRM-bridge",
        detail:
          "En plattform för röst, digital och CRM ersätter typiskt 2–3 separata verktyg (telefoni, IVR, ärendehanterare). Frigör IT-budget och förenklar drift.",
        savings: flat(900_000),
        implCost: 200_000,
        defaultOn: true,
      },
      {
        id: "workforce",
        label: "Workforce management & analytics",
        hint: "Bättre bemanning & coaching",
        detail:
          "Realtidsanalys på köer, SLA och samtal hjälper teamledare att bemanna rätt och coacha agenter. Reducerar övertid och förbättrar NPS.",
        savings: flat(450_000),
        implCost: 120_000,
      },
    ],
  },

  "field-service": {
    productKey: "field-service",
    productName: "Dynamics 365 Field Service",
    productShort: "FS",
    fileSlug: "field-service",
    baseImplementation: 650_000,
    implUserScale: 0.011,
    supportPctYearly: 0.17,
    supportPctYear1: 0.07,
    defaultRevenue: 180_000_000,
    defaultCurrentItCost: 450_000,
    defaultIntegrations: 3,
    licenseHeading: "Licenser (Field Service)",
    licenseLines: [
      { skuKey: "field-service", label: "Field Service technicians", defaultCount: 20 },
      { skuKey: "field-service-contractor", label: "Contractor-licenser", defaultCount: 5 },
    ],
    drivers: [
      {
        id: "first-time-fix",
        label: "Högre first-time-fix",
        hint: "Rätt tekniker, rätt delar, rätt info",
        detail:
          "Smart schemaläggning och Copilot-stöd höjer first-time-fix 5–15 procentenheter. Färre återbesök, lägre kostnad och nöjdare kunder.",
        savings: flat(900_000),
        implCost: 150_000,
        defaultOn: true,
      },
      {
        id: "route-optimization",
        label: "Ruttoptimering",
        hint: "Färre kilometer, fler jobb/dag",
        detail:
          "Resource Scheduling Optimization minskar körtid 10–20 % och adderar 0,5–1 jobb per tekniker och dag. Direkt effekt på intäkt och CO₂.",
        savings: flat(700_000),
        implCost: 180_000,
        defaultOn: true,
      },
      {
        id: "remote-assist",
        label: "Remote Assist & guidade arbetsorder",
        hint: "Expert på distans via HoloLens/Teams",
        detail:
          "Expert kan koppla upp sig till tekniker på plats och guida via video/AR. Reducerar resor för komplexa ärenden och kortar lärotid för juniorer.",
        savings: flat(400_000),
        implCost: 120_000,
        defaultOn: true,
      },
      {
        id: "inventory-truck",
        label: "Lager på servicebil",
        hint: "Realtidssaldo och påfyllnad",
        detail:
          "Spårning av delar på servicebilar minskar svinn och säkerställer rätt delar för planerade jobb. Mindre brådordrar och färre stillestånd.",
        savings: pctOfRev(0.0025, 1_500_000),
        implCost: 100_000,
      },
    ],
  },
};

export const defaultEnabledDrivers = (key: ProductRoiKey): string[] =>
  PRODUCT_ROI_CONFIGS[key].drivers.filter((d) => d.defaultOn).map((d) => d.id);
