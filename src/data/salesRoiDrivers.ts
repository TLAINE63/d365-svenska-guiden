// Branschspecifika effektiviseringsdrivare för Dynamics 365 Sales ROI-kalkylatorn.
// Sales-fokus: pipeline-kvalitet, vinstgrad, säljcykel, prognossäkerhet,
// säljarproduktivitet och ramp-up. Estimaten är konservativa och skalas
// med antal säljare (sublinjärt) i kalkylatorn.

export type SalesIndustry =
  | "B2B-tjänster"
  | "Tillverkning"
  | "Distribution & grossist"
  | "Tech & SaaS"
  | "Finans & försäkring"
  | "Bygg & installation"
  | "Annan";

export interface SalesRoiDriver {
  id: string;
  label: string;
  hint: string;
  /** Längre förklaring av drivaren: var nyttan kommer ifrån och hur estimatet är räknat. */
  detail: string;
  /** Returnerar uppskattad årlig nytta i SEK utifrån omsättning och antal säljare. */
  savings: (revenue: number, sellers: number) => number;
  /** Engångskostnad som läggs på implementation om drivaren är aktiv. */
  implCost: number;
  defaultOn?: boolean;
}

const perSeller = (sek: number) => (_rev: number, sellers: number) => sek * sellers;
const pctOfRev = (pct: number, cap = Infinity) => (rev: number) =>
  Math.min(cap, Math.max(0, rev) * pct);
// Blandad: liten andel av omsättning + bonus per säljare, för pipeline/win-rate-effekter.
const revAndSeller = (pct: number, cap: number, perSellerSek: number) =>
  (rev: number, sellers: number) =>
    Math.min(cap, Math.max(0, rev) * pct) + perSellerSek * sellers;

export const SALES_INDUSTRY_DRIVERS: Record<SalesIndustry, SalesRoiDriver[]> = {
  "B2B-tjänster": [
    {
      id: "lead-conversion",
      label: "Högre lead-to-opportunity-konvertering",
      hint: "Lead scoring & strukturerad kvalificering",
      detail:
        "Lead scoring, tydliga kvalificeringskriterier (BANT/MEDDIC) och automatisk routing gör att fler leads blir till riktiga affärer istället för att tappas i inkorgen. Typisk effekt är 10–25 % högre lead-to-opp-konvertering. Estimat: 0,4 % av omsättning (takat 350 000 kr) + 18 000 kr per säljare.",
      savings: revAndSeller(0.004, 350_000, 18_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "win-rate",
      label: "Förbättrad vinstgrad i pipeline",
      hint: "Playbooks, sales stages, Copilot-coaching",
      detail:
        "Definierade säljsteg, playbooks per dealtyp och Copilot-coaching på samtal/mejl höjer typiskt vinstgraden 2–5 procentenheter genom bättre disciplin i mid-funnel. Estimat: 0,5 % av omsättning (takat 500 000 kr) + 22 000 kr per säljare.",
      savings: revAndSeller(0.005, 500_000, 22_000),
      implCost: 90_000,
      defaultOn: true,
    },
    {
      id: "seller-productivity",
      label: "Säljarproduktivitet (Outlook/Teams)",
      hint: "Mindre admin – Copilot & inbox-flow",
      detail:
        "Sales i Outlook/Teams + Copilot-summeringar tar bort 3–6 timmar/vecka administration per säljare och flyttar tiden till kundmöten. Estimat: 45 000 kr per säljare och år.",
      savings: perSeller(45_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "forecast",
      label: "Säkrare försäljningsprognos",
      hint: "Pipeline-hygien & predictive forecasting",
      detail:
        "Strukturerad pipeline-hygien och predictive forecasting kortar prognosfel från typiskt 20–30 % till under 10 %. Bättre prognos ger bättre kapacitetsplanering, inköp och kassaflöde. Estimat: 0,2 % av omsättning, takat vid 250 000 kr/år.",
      savings: pctOfRev(0.002, 250_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "quote-config",
      label: "Snabbare offert & avtal",
      hint: "CPQ, mallar, e-signering",
      detail:
        "Mallar, prisregler (CPQ) och e-signering kortar tiden från möte till signerat avtal från veckor till dagar och eliminerar fel i prissättning. Estimat: 25 000 kr per säljare och år.",
      savings: perSeller(25_000),
      implCost: 90_000,
      defaultOn: false,
    },
  ],

  Tillverkning: [
    {
      id: "long-cycle",
      label: "Strukturerad hantering av långa säljcykler",
      hint: "Account planning, multi-stakeholder-spår",
      detail:
        "Långa säljcykler (6–18 månader) med många intressenter kräver strukturerad account planning och spårning av roller (champion, ekonom, tekniker). Vinst i färre tappade affärer på slutrakan. Estimat: 0,4 % av omsättning (takat 600 000 kr) + 25 000 kr per säljare.",
      savings: revAndSeller(0.004, 600_000, 25_000),
      implCost: 120_000,
      defaultOn: true,
    },
    {
      id: "quote-config",
      label: "Offert- & konfigurationshantering (CPQ)",
      hint: "Komplex produktstruktur, marginalkontroll",
      detail:
        "CPQ på komplexa produktstrukturer säkerställer giltiga konfigurationer och rätt marginal i varje offert. Typiskt fångar man 0,5–2 % marginalläckage som annars försvann i 'specialpriser'. Estimat: 0,3 % av omsättning (takat 400 000 kr) + 20 000 kr per säljare.",
      savings: revAndSeller(0.003, 400_000, 20_000),
      implCost: 150_000,
      defaultOn: true,
    },
    {
      id: "channel",
      label: "Partner-/återförsäljarstöd",
      hint: "Distributörsportal, deal registration",
      detail:
        "Strukturerat partnerprogram med deal registration, MDF och portal minskar kanal­konflikter och ökar partner­drivna affärer. Estimat: 0,25 % av omsättning, takat vid 300 000 kr/år.",
      savings: pctOfRev(0.0025, 300_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "service-cross-sell",
      label: "Mer-/eftermarknadsförsäljning",
      hint: "Reservdelar, service-kontrakt, garantier",
      detail:
        "360°-vy av installerad bas låter säljare proaktivt sälja service­kontrakt, reservdelar och uppgraderingar. Eftermarknad har typiskt 2–3× högre marginal än nyförsäljning. Estimat: 35 000 kr per säljare och år.",
      savings: perSeller(35_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "erp-integration",
      label: "Integration mot ERP (order & marginal)",
      hint: "Realtidspris, lager, kreditstatus i CRM",
      detail:
        "Realtidsdata från ERP (pris, lager, kreditstatus, marginalkalkyl) i säljdialogen ger snabbare svar till kund och färre 'jag återkommer'. Estimat: 20 000 kr per säljare och år.",
      savings: perSeller(20_000),
      implCost: 100_000,
      defaultOn: true,
    },
  ],

  "Distribution & grossist": [
    {
      id: "account-coverage",
      label: "Bättre kundtäckning per säljare",
      hint: "Account-plan & besöksplanering",
      detail:
        "Strukturerad besöksplanering, segmentering (A/B/C-kunder) och åtgärdslistor gör att säljare täcker fler kunder per vecka med rätt frekvens. Vanligt utfall: 10–20 % fler kvalitativa kundmöten. Estimat: 40 000 kr per säljare och år.",
      savings: perSeller(40_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "cross-sell",
      label: "Korsförsäljning på befintliga kunder",
      hint: "Produktrekommendationer & nästa-bästa-erbjudande",
      detail:
        "Datadrivna produkt­rekommendationer (vad köper liknande kunder?) och nästa-bästa-erbjudande höjer snittordern och brett­ar sortimentet per kund. Estimat: 0,3 % av omsättning, takat vid 400 000 kr/år.",
      savings: pctOfRev(0.003, 400_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "quote-speed",
      label: "Snabbare offert mot stort sortiment",
      hint: "Pris-/rabattmatriser direkt i CRM",
      detail:
        "Pris-/rabattmatriser direkt i CRM gör att säljaren själv kan kvotera utan att gå till backoffice. Sparar tid och ökar hit-rate genom snabbare svar. Estimat: 22 000 kr per säljare och år.",
      savings: perSeller(22_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "field-sales",
      label: "Mobil/fältsäljarstöd",
      hint: "Offline-besök, orderläggning på plats",
      detail:
        "Mobil app med offline-stöd låter fältsäljare lägga order, se historik och rapportera besök på plats hos kund – istället för efteråt från hemmakontoret. Estimat: 30 000 kr per säljare och år.",
      savings: perSeller(30_000),
      implCost: 90_000,
      defaultOn: false,
    },
    {
      id: "erp-integration",
      label: "Integration mot ERP (lager & marginal)",
      hint: "Realtidsdata in i säljdialogen",
      detail:
        "Lager­saldo, kund­specifika priser och marginal­data realtid i CRM ger korrekta löften till kund och färre returer/krediteringar. Estimat: 18 000 kr per säljare och år.",
      savings: perSeller(18_000),
      implCost: 100_000,
      defaultOn: true,
    },
  ],

  "Tech & SaaS": [
    {
      id: "lead-conversion",
      label: "Marketing-to-Sales-konvertering",
      hint: "Lead scoring, SLA, MQL→SQL-flöde",
      detail:
        "Tight MQL→SQL-process med scoring, SLA på follow-up (< 5 min för web-leads) och tydlig hand­over från marketing till sales höjer konverteringen 20–40 %. Estimat: 0,5 % av omsättning (takat 500 000 kr) + 25 000 kr per säljare.",
      savings: revAndSeller(0.005, 500_000, 25_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "win-rate",
      label: "Högre win-rate via Copilot-coaching",
      hint: "Samtalsanalys, deal-rådgivning i realtid",
      detail:
        "Copilot för Sales analyserar samtal/mejl, föreslår nästa steg och flaggar deal-risk i realtid. Tidiga referensimplementationer visar 3–7 procentenheter högre win-rate. Estimat: 0,6 % av omsättning (takat 800 000 kr) + 30 000 kr per säljare.",
      savings: revAndSeller(0.006, 800_000, 30_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "ramp",
      label: "Snabbare ramp-up av nya säljare",
      hint: "Sales accelerator, playbooks, AI-assistent",
      detail:
        "Sales Accelerator, playbooks och AI-assistent gör att nyanställda säljare når full produktivitet på 3–4 månader istället för 6–9. Vid hög tillväxttakt är detta en av de största hävstängerna. Estimat: 35 000 kr per säljare och år.",
      savings: perSeller(35_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "expansion",
      label: "Expansion & upsell på kundbas",
      hint: "Health score, NRR, upsell-signaler",
      detail:
        "Customer health score, produktanvändnings­data och automatiska upsell-signaler driver Net Revenue Retention. En lyft från 100 % till 115 % NRR är extremt värdeskapande för SaaS. Estimat: 0,5 % av omsättning, takat vid 700 000 kr/år.",
      savings: pctOfRev(0.005, 700_000),
      implCost: 110_000,
      defaultOn: true,
    },
    {
      id: "churn",
      label: "Lägre kundbortfall (kopplat till CS)",
      hint: "Tidig varning & strukturerad förlängning",
      detail:
        "Riskindikatorer (låg användning, support­ärenden, NPS) plus strukturerade förlängnings­processer minskar logo-churn med 1–3 procentenheter. Estimat: 0,4 % av omsättning, takat vid 600 000 kr/år.",
      savings: pctOfRev(0.004, 600_000),
      implCost: 90_000,
      defaultOn: false,
    },
  ],

  "Finans & försäkring": [
    {
      id: "advisor-productivity",
      label: "Rådgivar-/mäklareffektivitet",
      hint: "360°-vy av kund, mindre dubbelarbete",
      detail:
        "Full kundvy (engagemang, produkter, dokument, ärendehistorik) sparar 30–60 minuter per kundmöte och eliminerar att kunder berättar samma sak flera gånger. Estimat: 50 000 kr per rådgivare och år.",
      savings: perSeller(50_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "compliance",
      label: "Strukturerad rådgivning & dokumentation",
      hint: "Spårbarhet & regulatoriska checkar",
      detail:
        "Inbyggda checklistor och dokumentation per rådgivningstillfälle minskar regulatorisk risk (MiFID/IDD) och tid på att hitta underlag i efterhand. Estimat: 25 000 kr per rådgivare och år.",
      savings: perSeller(25_000),
      implCost: 150_000,
      defaultOn: true,
    },
    {
      id: "cross-sell",
      label: "Korsförsäljning på befintliga kunder",
      hint: "Produktrekommendation utifrån livshändelser",
      detail:
        "Triggers på livshändelser (flytt, barn, pension) ger rådgivare proaktiva samtals­ämnen och höjer produkter per kund. Estimat: 0,35 % av omsättning, takat vid 500 000 kr/år.",
      savings: pctOfRev(0.0035, 500_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "lead-conversion",
      label: "Bättre lead-kvalificering",
      hint: "Scoring, automatiserad fördelning",
      detail:
        "Scoring och automatiserad fördelning av inkommande leads till rätt rådgivare/kontor höjer konverteringen och minskar svarstider. Estimat: 0,3 % av omsättning (takat 400 000 kr) + 18 000 kr per rådgivare.",
      savings: revAndSeller(0.003, 400_000, 18_000),
      implCost: 70_000,
      defaultOn: true,
    },
  ],

  "Bygg & installation": [
    {
      id: "project-pipeline",
      label: "Strukturerad projektpipeline",
      hint: "Anbud, vinst-/förlustanalys, beläggning",
      detail:
        "Strukturerad anbudspipeline med vinst-/förlustanalys och kopplad bemanningsplan ger bättre val av vilka jobb man räknar på – och minskar tid lagd på anbud man ändå inte vinner. Estimat: 0,3 % av omsättning (takat 400 000 kr) + 22 000 kr per säljare/KAM.",
      savings: revAndSeller(0.003, 400_000, 22_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "quote-config",
      label: "Anbud & kalkyl",
      hint: "Mallar, marginalkontroll, e-signering",
      detail:
        "Mallbaserade kalkyler med marginal­spärrar och e-signering kortar anbudstiden och fångar dyra kalkylfel innan de når kund. Estimat: 28 000 kr per säljare och år.",
      savings: perSeller(28_000),
      implCost: 90_000,
      defaultOn: true,
    },
    {
      id: "field-sales",
      label: "Mobil för säljare/projektledare",
      hint: "Besök & uppföljning från fält",
      detail:
        "Mobil app för platsbesök, foto­dokumentation och uppföljning från arbetsplats istället för från kontor sparar restid och håller datan färsk. Estimat: 22 000 kr per säljare och år.",
      savings: perSeller(22_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "service-cross-sell",
      label: "Service- & underhållsförsäljning",
      hint: "Återkommande intäkt efter leverans",
      detail:
        "Strukturerad försäljning av service- och underhållsavtal efter leverans bygger återkommande intäkt och hög marginal. Ofta underutnyttjad potential i bygg/installation. Estimat: 0,2 % av omsättning, takat vid 250 000 kr/år.",
      savings: pctOfRev(0.002, 250_000),
      implCost: 70_000,
      defaultOn: false,
    },
  ],

  Annan: [
    {
      id: "seller-productivity",
      label: "Säljarproduktivitet",
      hint: "Mindre admin, mer kundtid – Copilot & 365-flöde",
      detail:
        "Sales-flöde i Outlook/Teams + Copilot-summeringar minskar admin (CRM-loggning, mötesanteckningar) med flera timmar per vecka. Estimat: 40 000 kr per säljare och år.",
      savings: perSeller(40_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "lead-conversion",
      label: "Bättre lead-konvertering",
      hint: "Scoring & strukturerad uppföljning",
      detail:
        "Lead scoring, automatiserad uppföljning och SLA på första kontakt höjer konverteringen och minskar tappade leads. Estimat: 0,4 % av omsättning (takat 350 000 kr) + 15 000 kr per säljare.",
      savings: revAndSeller(0.004, 350_000, 15_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "forecast",
      label: "Säkrare prognos",
      hint: "Pipeline-hygien & predictive insights",
      detail:
        "Bättre prognoshygien och predictive insights gör att ledningen kan agera tidigt på avvikelser istället för att läsa månadsrapporten i efterhand. Estimat: 0,2 % av omsättning, takat vid 200 000 kr/år.",
      savings: pctOfRev(0.002, 200_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "win-rate",
      label: "Högre vinstgrad",
      hint: "Playbooks & Copilot-coaching",
      detail:
        "Playbooks per dealtyp och Copilot-coaching på samtal/mejl höjer vinstgraden i mid-funnel. Estimat: 0,4 % av omsättning (takat 400 000 kr) + 18 000 kr per säljare.",
      savings: revAndSeller(0.004, 400_000, 18_000),
      implCost: 80_000,
      defaultOn: false,
    },
  ],
};

export const defaultEnabledSalesDrivers = (industry: SalesIndustry): string[] =>
  SALES_INDUSTRY_DRIVERS[industry].filter((d) => d.defaultOn).map((d) => d.id);

/** Implementationsfaktor per bransch (multiplicerar baskostnad). */
export const SALES_INDUSTRY_IMPL_FACTOR: Record<SalesIndustry, number> = {
  Tillverkning: 1.3,
  "Finans & försäkring": 1.3,
  "Distribution & grossist": 1.1,
  "Tech & SaaS": 1.0,
  "B2B-tjänster": 0.9,
  "Bygg & installation": 1.0,
  Annan: 1.0,
};
