/**
 * CRM-produkternas matchningstester (Sales, Customer Service, Marketing/Customer Insights,
 * Field Service, Contact Center). Funktionsorienterat matchningstest – inte mognadsbetyg.
 * Ton: köparsidig, produktneutral. Delar en gemensam scoring-motor.
 */

export type AnswerValue = string;
export type Answers = Record<string, AnswerValue>;

export interface Option {
  value: string;
  label: string;
  points: number;
}

export interface Question {
  id: string;
  blockIndex: number;
  text: string;
  help?: string;
  options: Option[];
  /** Vilken profil poängen bidrar till. */
  profile: string;
}

export interface Block {
  title: string;
  description: string;
}

export interface Profile {
  key: string;
  label: string;
  weight: number; // andel av totalpoängen
  /** Frivillig disqualifier: om predikatet returnerar true blir profilen "not_applicable". */
  notApplicableIf?: (a: Answers) => boolean;
  /** Copy: vad profilen står för när den är stark. */
  strongCopy: string;
  /** Copy: vad partnern bör kunna leverera. */
  partnerHint: string;
}

export interface LevelCopy {
  headline: string;
  body: string;
}

export interface ProductConfig {
  key: "sales" | "customer-service" | "marketing" | "field-service" | "contact-center";
  productName: string;
  eyebrow: string;
  h1: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  ogImage: string;
  keywords: string;
  storageKey: string;
  assessmentType: string;
  productPagePath: string;
  needsAnalysisPath: string;
  partnerFilterPath: string;
  blocks: Block[];
  profiles: Profile[];
  questions: Question[];
  levelCopy: Record<"strong" | "partial" | "oversized", LevelCopy>;
  oversizedAlternative?: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaTo: string;
  };
  furtherReading: { label: string; to: string }[];
}

// Helper – standardpoäng: 0/1/2/3
const scale = (profile: string, id: string, blockIndex: number, text: string, help?: string): Question => ({
  id,
  blockIndex,
  text,
  help,
  profile,
  options: [
    { value: "0", label: "Inte alls / ej relevant", points: 0 },
    { value: "1", label: "I begränsad omfattning", points: 1 },
    { value: "2", label: "I ganska stor omfattning", points: 2 },
    { value: "3", label: "I mycket stor omfattning", points: 3 },
  ],
});

const yn = (
  profile: string,
  id: string,
  blockIndex: number,
  text: string,
  yesPts = 3,
  help?: string,
): Question => ({
  id,
  blockIndex,
  text,
  help,
  profile,
  options: [
    { value: "yes", label: "Ja", points: yesPts },
    { value: "no", label: "Nej", points: 0 },
    { value: "unsure", label: "Vet inte", points: Math.round(yesPts / 3) },
  ],
});

// ============================================================================
// SALES – Dynamics 365 Sales
// ============================================================================
const salesConfig: ProductConfig = {
  key: "sales",
  productName: "Dynamics 365 Sales",
  eyebrow: "Dynamics 365 Sales",
  h1: "Matchar Dynamics 365 Sales dina behov?",
  intro:
    "Ett funktionsorienterat matchningstest – inte ett mognadsbetyg. Vi tittar på hur du säljer i dag och visar ärligt om Dynamics 365 Sales matchar dina behov – eller om ett enklare CRM räcker.",
  seoTitle: "Matchar Dynamics 365 Sales dina behov? – Matchningstest | d365.se",
  seoDescription:
    "10 minuter, 12 frågor. Funktionsorienterat matchningstest som visar om Dynamics 365 Sales passar er säljorganisation.",
  canonicalPath: "/d365sales/matchningstest",
  ogImage: "https://d365.se/og-sales.png",
  keywords: "Dynamics 365 Sales matchningstest, CRM behovsanalys, säljverktyg utvärdering",
  storageKey: "d365_sales_matchningstest_v1",
  assessmentType: "sales_matchningstest",
  productPagePath: "/d365sales/",
  needsAnalysisPath: "/CRMbehovsanalys",
  partnerFilterPath: "/dynamics-365-sales-partners-sverige/",
  blocks: [
    { title: "Säljprocess och pipeline", description: "Hur strukturerad och komplex er säljprocess är i dag." },
    { title: "Volym, team och struktur", description: "Storlek på säljteamet och komplexitet i organisationen." },
    { title: "AI, integration och analys", description: "Hur viktigt AI-stöd, Copilot och integration mot andra system är." },
  ],
  profiles: [
    {
      key: "pipeline",
      label: "Pipeline- och processkomplexitet",
      weight: 0.4,
      strongCopy:
        "Strukturerad B2B-försäljning med flera säljsteg, långa cykler och behov av tydliga forecasts",
      partnerHint:
        "Här ger Dynamics 365 Sales störst nytta. Partnern bör ha erfarenhet av att konfigurera säljprocesser, forecasts och dashboards – gärna med referenscase från din bransch.",
    },
    {
      key: "org",
      label: "Team- och organisationskomplexitet",
      weight: 0.25,
      strongCopy:
        "Större säljteam, flera säljroller (KAM, inside sales, partners) och behov av territoriehantering",
      partnerHint:
        "Roller, säkerhetsroller och territoriemodell bör designas tidigt. Fråga partnern om deras erfarenhet av att skala Dynamics 365 Sales för större team.",
    },
    {
      key: "ai",
      label: "AI, Copilot och integration",
      weight: 0.35,
      strongCopy:
        "Behov av Copilot for Sales, samtalsanalys, Sales Insights och tät integration mot Outlook/Teams/ERP",
      partnerHint:
        "Dynamics 365 Sales Premium och Copilot for Sales är där det mesta av innovationen sker. Välj partner med konkret erfarenhet av AI-agenter i säljflödet – inte bara Copilot-demos.",
    },
  ],
  questions: [
    scale("pipeline", "s1", 0, "Har du en definierad säljprocess med tydliga steg från lead till avslut?"),
    scale("pipeline", "s2", 0, "Behöver du forecast och pipeline-uppföljning över kvartal/år?"),
    scale("pipeline", "s3", 0, "Har du långa säljcykler (över 1 månad) med flera intressenter per affär?"),
    yn("pipeline", "s4", 0, "Arbetar du med offerter, konfigurerade produkter eller prislistor?", 2),
    scale("org", "s5", 1, "Hur många personer i säljorganisationen ska använda systemet?", "0 = under 5, 3 = över 50."),
    scale("org", "s6", 1, "Har du flera säljteam, territorier eller landsuppdelningar att hantera?"),
    yn("org", "s7", 1, "Säljer du via återförsäljare eller partners där lead-registrering krävs?", 2),
    scale("ai", "s8", 2, "Hur viktigt är AI-stöd (Copilot, samtalsanalys, nästa-bäst-åtgärd) i säljarbetet?"),
    yn("ai", "s9", 2, "Ska CRM integreras djupt med Outlook, Teams och kalender?", 2),
    yn("ai", "s10", 2, "Ska CRM integreras med ditt affärssystem (order, fakturor, kunddata)?", 3),
    scale("ai", "s11", 2, "Har du behov av rapportering, dashboards och analys på säljdata?"),
    yn("ai", "s12", 2, "Är LinkedIn Sales Navigator ett verktyg du använder eller planerar att införa?", 2),
  ],
  levelCopy: {
    strong: {
      headline: "Stark matchning",
      body:
        "Dina svar pekar på en B2B-säljorganisation där Dynamics 365 Sales, gärna med Sales Premium och Copilot for Sales, är ett rimligt val att utvärdera på allvar. Det är fortfarande värt att jämföra mot HubSpot Sales Hub och Salesforce Sales Cloud för att pressa pris och funktion.",
    },
    partial: {
      headline: "Delvis matchning",
      body:
        "Vissa delar av er säljprocess talar för Dynamics 365 Sales, andra pekar mot ett enklare CRM. Fokusera utvärderingen på det som är dimensionerande – integration mot Microsoft-stacken, AI-behov och volym – snarare än checklistor.",
    },
    oversized: {
      headline: "Sannolikt överdimensionerat",
      body:
        "Dina svar pekar på en säljorganisation där ett enklare CRM (t.ex. HubSpot Sales Hub eller Pipedrive) troligen täcker behoven väl. Dynamics 365 Sales blir mest motiverat när du har djup Microsoft-integration, större team eller tydliga AI-behov.",
    },
  },
  oversizedAlternative: {
    heading: "Är ett enklare CRM ett bättre alternativ?",
    body:
      "Dina svar pekar på att Dynamics 365 Sales sannolikt är överdimensionerat för dig i dag. Enklare alternativ som HubSpot Sales Hub eller Pipedrive täcker normalt motsvarande behov till lägre kostnad och kortare implementationstid. Om Microsoft-integration och AI blir viktigare framöver är det lätt att byta upp sig.",
    ctaLabel: "Läs om Dynamics 365 Sales",
    ctaTo: "/d365sales/",
  },
  furtherReading: [
    { label: "Dynamics 365 Sales – översikt", to: "/d365sales/" },
    { label: "CRM – översikt", to: "/crm/" },
    { label: "Se Microsoft-partners inom Sales", to: "/dynamics-365-sales-partners-sverige/" },
  ],
};

// ============================================================================
// CUSTOMER SERVICE – Dynamics 365 Customer Service
// ============================================================================
const customerServiceConfig: ProductConfig = {
  key: "customer-service",
  productName: "Dynamics 365 Customer Service",
  eyebrow: "Dynamics 365 Customer Service",
  h1: "Matchar Dynamics 365 Customer Service dina behov?",
  intro:
    "Funktionsorienterat matchningstest av ditt supportbehov. Vi tittar på volym, kanaler, självbetjäning och AI-behov – och visar ärligt om Dynamics 365 Customer Service matchar dig, eller om ett enklare helpdesk-verktyg räcker.",
  seoTitle: "Matchar Dynamics 365 Customer Service dina behov? – Matchningstest | d365.se",
  seoDescription:
    "10 minuter, 12 frågor. Funktionsorienterat matchningstest som visar om Dynamics 365 Customer Service passar din kundserviceorganisation.",
  canonicalPath: "/d365customerservice/matchningstest",
  ogImage: "https://d365.se/og-customer-service.png",
  keywords: "Dynamics 365 Customer Service matchningstest, helpdesk utvärdering, kundservice CRM",
  storageKey: "d365_customerservice_matchningstest_v1",
  assessmentType: "customer_service_matchningstest",
  productPagePath: "/d365customerservice/",
  needsAnalysisPath: "/kundservice-behovsanalys",
  partnerFilterPath: "/dynamics-365-customer-service-partners-sverige/",
  blocks: [
    { title: "Ärendevolym och kanaler", description: "Hur många ärenden du hanterar och via vilka kanaler." },
    { title: "Kunskap, SLA och struktur", description: "Kunskapsdatabas, SLA-hantering och organisatorisk struktur." },
    { title: "AI, självbetjäning och integration", description: "Copilot, virtuella agenter, portaler och integration mot andra system." },
  ],
  profiles: [
    {
      key: "volume",
      label: "Ärendevolym och multikanal",
      weight: 0.4,
      strongCopy:
        "Hög ärendevolym med flera kanaler (e-post, chatt, telefon, social) och behov av samlad omnikanal-vy",
      partnerHint:
        "Här ger Dynamics 365 Customer Service tydlig nytta. Partnern bör ha erfarenhet av omnikanal-konfiguration, routing och rapportering i större supportmiljöer.",
    },
    {
      key: "sla",
      label: "SLA, kunskap och organisation",
      weight: 0.25,
      strongCopy:
        "Formella SLA:er, kunskapsartiklar, eskaleringsflöden och flera supportteam som samarbetar",
      partnerHint:
        "SLA-motor och kunskapsartiklar bör designas tidigt. Be partnern visa hur de arbetar med kunskapsartiklar, ärendeklassificering och rapportering i praktiken.",
    },
    {
      key: "ai",
      label: "AI, självbetjäning och integration",
      weight: 0.35,
      strongCopy:
        "Copilot for Service, virtuella agenter, självbetjäningsportaler och integration mot ERP/order",
      partnerHint:
        "Copilot for Service och Microsoft 365 Copilot Studio är där mycket av innovationen sker. Välj partner med konkret erfarenhet av att bygga och drifta AI-agenter, inte bara demos.",
    },
  ],
  questions: [
    scale("volume", "cs1", 0, "Hur stor är din årliga ärendevolym?", "0 = under 500, 3 = över 20 000."),
    scale("volume", "cs2", 0, "Hur många kanaler tar du emot ärenden via (e-post, chatt, telefon, sociala medier, formulär)?"),
    yn("volume", "cs3", 0, "Behöver du realtidschatt och integrerad telefoni?", 3),
    scale("volume", "cs4", 0, "Hur viktigt är en enhetlig agent-vy över kanaler (omnikanal)?"),
    scale("sla", "cs5", 1, "Har du formella SLA:er som måste följas per kundsegment eller ärendetyp?"),
    yn("sla", "cs6", 1, "Använder du – eller vill använda – en strukturerad kunskapsdatabas för agenterna?", 3),
    scale("sla", "cs7", 1, "Har du flera supportteam eller nivåer (1st, 2nd, 3rd line) som samarbetar på samma ärende?"),
    yn("ai", "cs8", 2, "Är det viktigt med AI-stöd (Copilot for Service, förslag på svar, sammanfattningar) för agenterna?", 3),
    yn("ai", "cs9", 2, "Vill du erbjuda en självbetjäningsportal eller virtuell agent för kunderna?", 3),
    yn("ai", "cs10", 2, "Ska Customer Service integreras med ditt affärssystem (order, leveranser, fakturor)?", 3),
    scale("ai", "cs11", 2, "Hur viktigt är avancerad rapportering, dashboards och kvalitetsuppföljning?"),
    yn("ai", "cs12", 2, "Använder eller ska du använda Dynamics 365 Sales eller Field Service parallellt?", 2),
  ],
  levelCopy: {
    strong: {
      headline: "Stark matchning",
      body:
        "Dina svar pekar på en supportorganisation där Dynamics 365 Customer Service – gärna med omnikanal-tillägg och Copilot for Service – är ett rimligt val att utvärdera på allvar. Det är fortfarande värt att jämföra mot Zendesk och ServiceNow för pris och användarvänlighet.",
    },
    partial: {
      headline: "Delvis matchning",
      body:
        "Vissa delar av din support talar för Dynamics 365 Customer Service, andra pekar mot ett enklare helpdesk-verktyg. Fokusera utvärderingen på volym, kanalmix och grad av integration – det är där skillnaden i totalkostnad blir störst.",
    },
    oversized: {
      headline: "Sannolikt överdimensionerat",
      body:
        "Dina svar pekar på ett supportbehov där ett enklare helpdesk-verktyg (t.ex. Zendesk Suite eller Freshdesk) troligen täcker behoven väl. Dynamics 365 Customer Service blir mest motiverat när du har hög volym, omnikanal och tät Microsoft-integration.",
    },
  },
  oversizedAlternative: {
    heading: "Är ett enklare helpdesk-verktyg ett bättre alternativ?",
    body:
      "Dina svar pekar på att Dynamics 365 Customer Service sannolikt är överdimensionerat i dag. Enklare alternativ som Zendesk Suite eller Freshdesk täcker normalt motsvarande behov till lägre kostnad och snabbare införande. Om du senare växer in i omnikanal, AI och Microsoft-integration är det möjligt att byta upp sig.",
    ctaLabel: "Läs om Dynamics 365 Customer Service",
    ctaTo: "/d365customerservice/",
  },
  furtherReading: [
    { label: "Dynamics 365 Customer Service – översikt", to: "/d365customerservice/" },
    { label: "Dynamics 365 Contact Center", to: "/d365contactcenter/" },
    { label: "Se Microsoft-partners inom Customer Service", to: "/dynamics-365-customer-service-partners-sverige/" },
  ],
};

// ============================================================================
// MARKETING – Dynamics 365 Customer Insights
// ============================================================================
const marketingConfig: ProductConfig = {
  key: "marketing",
  productName: "Dynamics 365 Customer Insights",
  eyebrow: "Dynamics 365 Customer Insights (Marketing + Data)",
  h1: "Matchar Dynamics 365 Customer Insights dina behov?",
  intro:
    "Funktionsorienterat matchningstest för marknad/CDP. Vi tittar på hur du arbetar med kunddata, journeys och kampanjer – och visar om Customer Insights passar dig, eller om ett enklare marketing automation-verktyg räcker.",
  seoTitle: "Matchar Dynamics 365 Customer Insights dina behov? – Matchningstest | d365.se",
  seoDescription:
    "10 minuter, 12 frågor. Funktionsorienterat matchningstest för Dynamics 365 Customer Insights (Journeys + Data).",
  canonicalPath: "/d365marketing/matchningstest",
  ogImage: "https://d365.se/og-marketing.png",
  keywords: "Customer Insights matchningstest, marketing automation utvärdering, CDP val",
  storageKey: "d365_marketing_matchningstest_v1",
  assessmentType: "marketing_matchningstest",
  productPagePath: "/d365marketing/",
  needsAnalysisPath: "/CRMbehovsanalys",
  partnerFilterPath: "/dynamics-365-marketing-partners-sverige/",
  blocks: [
    { title: "Kunddata och segmentering", description: "Hur du samlar, enar och segmenterar kunddata i dag." },
    { title: "Kampanjer och journeys", description: "Utskicksvolym, kanaler och komplexitet i dina kundresor." },
    { title: "AI, integration och analys", description: "AI-genererat innehåll, prediktion och integration mot CRM/webb." },
  ],
  profiles: [
    {
      key: "data",
      label: "Kunddata och enhetlig profil",
      weight: 0.35,
      strongCopy:
        "Flera datakällor (CRM, webb, e-handel, transaktioner) som behöver enas till en kundprofil – klassiskt CDP-behov",
      partnerHint:
        "Customer Insights – Data är kärnan. Partnern bör ha erfarenhet av datamodellering, matchning och realtidsevent i CDP-projekt.",
    },
    {
      key: "campaigns",
      label: "Kampanjer, journeys och kanaler",
      weight: 0.35,
      strongCopy:
        "Fleretapps-journeys över e-post, SMS, push och webb – gärna trigger-baserade och personaliserade",
      partnerHint:
        "Customer Insights – Journeys ger stor flexibilitet men kräver tydlig design av triggerlogik och samtycken. Fråga efter partnerns erfarenhet av realtidsjourneys.",
    },
    {
      key: "ai",
      label: "AI, integration och analys",
      weight: 0.3,
      strongCopy:
        "AI-genererat innehåll, prediktiv scoring, tät integration mot Dynamics 365 Sales/Service och rapportering",
      partnerHint:
        "Copilot i Customer Insights, Power BI och Sales-integration är där effekten blir störst. Välj partner med konkret marketing-ops-erfarenhet, inte bara CRM.",
    },
  ],
  questions: [
    scale("data", "m1", 0, "Har du behov av att ena kunddata från flera källor (CRM, webb, e-handel, order)?"),
    scale("data", "m2", 0, "Hur viktigt är avancerad segmentering på beteende och transaktioner?"),
    yn("data", "m3", 0, "Behöver du hantera GDPR-samtycken centralt över kanaler?", 2),
    scale("data", "m4", 0, "Har du behov av realtidsevents (t.ex. övergivna varukorgar, webbeteende)?"),
    scale("campaigns", "m5", 1, "Hur många utskick per månad gör du ungefär?", "0 = under 5, 3 = över 50."),
    scale("campaigns", "m6", 1, "Hur många kanaler använder du (e-post, SMS, push, webb, sociala)?"),
    scale("campaigns", "m7", 1, "Hur komplexa är dina kundresor (single-shot vs fleretapps med förgreningar)?"),
    yn("campaigns", "m8", 1, "Vill du kunna göra event- och webinar-hantering integrerat?", 2),
    yn("ai", "m9", 2, "Är AI-genererat innehåll och Copilot viktigt i marknadsarbetet?", 3),
    yn("ai", "m10", 2, "Ska Marketing integreras djupt med Dynamics 365 Sales eller Service?", 3),
    scale("ai", "m11", 2, "Hur viktigt är prediktiv scoring (lead scoring, churn, next best offer)?"),
    yn("ai", "m12", 2, "Använder du Power BI för marknadsrapportering – eller vill göra det?", 2),
  ],
  levelCopy: {
    strong: {
      headline: "Stark matchning",
      body:
        "Dina svar pekar på en marknadsorganisation där Dynamics 365 Customer Insights (Journeys + Data) är ett rimligt val att utvärdera. Jämför gärna mot HubSpot Marketing Hub Enterprise och Salesforce Marketing Cloud för att pressa pris och användarvänlighet.",
    },
    partial: {
      headline: "Delvis matchning",
      body:
        "Vissa delar av marknadsarbetet talar för Customer Insights, andra pekar mot ett enklare marketing automation-verktyg. Fokusera utvärderingen på hur viktig kundprofil-enande (CDP) och Sales-integration faktiskt är för dig.",
    },
    oversized: {
      headline: "Sannolikt överdimensionerat",
      body:
        "Dina svar pekar på ett marknadsbehov där ett enklare verktyg (t.ex. HubSpot Marketing Hub, Mailchimp, ActiveCampaign) troligen täcker behoven. Customer Insights blir mest motiverat vid CDP-behov, större utskicksvolym eller tät Dynamics 365-integration.",
    },
  },
  oversizedAlternative: {
    heading: "Är ett enklare marketing automation-verktyg ett bättre alternativ?",
    body:
      "Dina svar pekar på att Customer Insights sannolikt är överdimensionerat i dag. Enklare alternativ som HubSpot Marketing Hub eller Mailchimp täcker normalt behoven till lägre kostnad. Byt upp dig när CDP-behov eller Sales-integration blir centralt.",
    ctaLabel: "Läs om Customer Insights",
    ctaTo: "/d365marketing/",
  },
  furtherReading: [
    { label: "Dynamics 365 Customer Insights – översikt", to: "/d365marketing/" },
    { label: "CRM – översikt", to: "/crm/" },
    { label: "Se Microsoft-partners inom Marketing", to: "/dynamics-365-marketing-partners-sverige/" },
  ],
};

// ============================================================================
// FIELD SERVICE – Dynamics 365 Field Service
// ============================================================================
const fieldServiceConfig: ProductConfig = {
  key: "field-service",
  productName: "Dynamics 365 Field Service",
  eyebrow: "Dynamics 365 Field Service",
  h1: "Matchar Dynamics 365 Field Service dina behov?",
  intro:
    "Funktionsorienterat matchningstest för fältservice. Vi tittar på tekniker, ruttoptimering, arbetsorderflöde och koppling till kundservice/ERP – och visar om Field Service matchar dig, eller om ett enklare planeringssystem räcker.",
  seoTitle: "Matchar Dynamics 365 Field Service dina behov? – Matchningstest | d365.se",
  seoDescription:
    "10 minuter, 12 frågor. Funktionsorienterat matchningstest för Dynamics 365 Field Service.",
  canonicalPath: "/d365fieldservice/matchningstest",
  ogImage: "https://d365.se/og-field-service.png",
  keywords: "Dynamics 365 Field Service matchningstest, fältservice CRM, arbetsorderplanering",
  storageKey: "d365_fieldservice_matchningstest_v1",
  assessmentType: "field_service_matchningstest",
  productPagePath: "/d365fieldservice/",
  needsAnalysisPath: "/kundservice-behovsanalys",
  partnerFilterPath: "/dynamics-365-field-service-partners-sverige/",
  blocks: [
    { title: "Tekniker och arbetsorder", description: "Antal tekniker, ärendevolym och komplexitet." },
    { title: "Planering och mobilitet", description: "Ruttoptimering, mobilt stöd och avtal/SLA." },
    { title: "AI, IoT och integration", description: "Prediktivt underhåll, IoT, Copilot och integration mot ERP/CRM." },
  ],
  profiles: [
    {
      key: "workforce",
      label: "Tekniker, arbetsorder och volym",
      weight: 0.4,
      strongCopy:
        "Många tekniker i fält, hög arbetsordervolym och behov av tydlig ärendespårning från skapelse till fakturering",
      partnerHint:
        "Field Service kommer till sin rätt först vid tillräcklig volym. Fråga partnern om ärendeflöde, roller och rapportering – gärna med referenscase från din bransch.",
    },
    {
      key: "planning",
      label: "Planering, ruttoptimering och mobilitet",
      weight: 0.35,
      strongCopy:
        "Behov av schemaläggning, ruttoptimering, mobilapp för tekniker och avtals-/SLA-hantering",
      partnerHint:
        "Schema Board och Field Service Mobile kräver konfiguration och change management. Partner bör ha erfarenhet av att införa mobilt arbetssätt hos tekniker – inte bara installation.",
    },
    {
      key: "ai",
      label: "AI, IoT och integration",
      weight: 0.25,
      strongCopy:
        "Prediktivt underhåll, IoT-signaler, Copilot for Field Service och integration mot ERP och kundservice",
      partnerHint:
        "Copilot for Field Service och IoT-flöden är där mycket av innovationen sker. Välj partner med konkret erfarenhet av IoT-integration och AI-agenter i fältflödet.",
    },
  ],
  questions: [
    scale("workforce", "fs1", 0, "Hur många tekniker/fältarbetare ska använda systemet?", "0 = under 10, 3 = över 100."),
    scale("workforce", "fs2", 0, "Hur många arbetsordrar hanterar du per månad?", "0 = under 100, 3 = över 5000."),
    yn("workforce", "fs3", 0, "Har du behov av reservdelshantering och lager per servicebil?", 3),
    scale("workforce", "fs4", 0, "Hur viktigt är att koppla arbetsorder till order/fakturering i ERP?"),
    scale("planning", "fs5", 1, "Hur viktigt är automatisk ruttoptimering och schemaläggning?"),
    yn("planning", "fs6", 1, "Behöver dina tekniker en fullvärdig mobilapp offline?", 3),
    yn("planning", "fs7", 1, "Har du serviceavtal/SLA:er som styr prioritering av ärenden?", 3),
    scale("planning", "fs8", 1, "Hur ofta har du akuta ärenden som kräver omplanering samma dag?"),
    yn("ai", "fs9", 2, "Använder eller ska du använda Dynamics 365 Customer Service parallellt?", 3),
    yn("ai", "fs10", 2, "Har du IoT-utrustning eller sensorer som ska generera ärenden automatiskt?", 3),
    yn("ai", "fs11", 2, "Är AI-stöd (Copilot for Field Service, prediktivt underhåll) viktigt för dig?", 2),
    scale("ai", "fs12", 2, "Hur viktigt är avancerad rapportering på tekniker, SLA och kostnad per ärende?"),
  ],
  levelCopy: {
    strong: {
      headline: "Stark matchning",
      body:
        "Dina svar pekar på en fältserviceorganisation där Dynamics 365 Field Service är ett rimligt val att utvärdera på allvar – särskilt om du redan använder Customer Service eller Business Central. Jämför gärna mot ServiceNow FSM och Salesforce Field Service för att pressa pris och funktion.",
    },
    partial: {
      headline: "Delvis matchning",
      body:
        "Delar av fältservicebehovet talar för Dynamics 365 Field Service, andra pekar mot enklare planeringsverktyg. Fokusera utvärderingen på volym, mobilitet och grad av ERP-/CRM-integration.",
    },
    oversized: {
      headline: "Sannolikt överdimensionerat",
      body:
        "Dina svar pekar på en fältverksamhet där enklare planerings-/serviceverktyg (t.ex. ServiceMax Core, Jobber eller egen planering i Outlook/Teams) troligen räcker. Field Service blir motiverat först vid större teknikerteam, IoT-behov och Microsoft-integration.",
    },
  },
  oversizedAlternative: {
    heading: "Är enklare serviceverktyg ett bättre alternativ?",
    body:
      "Dina svar pekar på att Dynamics 365 Field Service sannolikt är överdimensionerat i dag. Enklare planeringsverktyg kan täcka behoven till lägre kostnad. Byt upp dig när du skalar volym, IoT eller Microsoft-integration.",
    ctaLabel: "Läs om Dynamics 365 Field Service",
    ctaTo: "/d365fieldservice/",
  },
  furtherReading: [
    { label: "Dynamics 365 Field Service – översikt", to: "/d365fieldservice/" },
    { label: "Dynamics 365 Customer Service", to: "/d365customerservice/" },
    { label: "Se Microsoft-partners inom Field Service", to: "/dynamics-365-field-service-partners-sverige/" },
  ],
};

// ============================================================================
// CONTACT CENTER – Dynamics 365 Contact Center
// ============================================================================
const contactCenterConfig: ProductConfig = {
  key: "contact-center",
  productName: "Dynamics 365 Contact Center",
  eyebrow: "Dynamics 365 Contact Center",
  h1: "Matchar Dynamics 365 Contact Center dina behov?",
  intro:
    "Funktionsorienterat matchningstest för AI-drivet kontaktcenter. Vi tittar på volym, kanaler, telefoni och AI-behov – och visar om Contact Center är rätt för dig, eller om du klarar dig med Customer Service eller ett annat CCaaS-verktyg.",
  seoTitle: "Matchar Dynamics 365 Contact Center dina behov? – Matchningstest | d365.se",
  seoDescription:
    "10 minuter, 12 frågor. Funktionsorienterat matchningstest för Dynamics 365 Contact Center.",
  canonicalPath: "/d365contactcenter/matchningstest",
  ogImage: "https://d365.se/og-contact-center.png",
  keywords: "Dynamics 365 Contact Center matchningstest, CCaaS utvärdering, AI kontaktcenter",
  storageKey: "d365_contactcenter_matchningstest_v1",
  assessmentType: "contact_center_matchningstest",
  productPagePath: "/d365contactcenter/",
  needsAnalysisPath: "/kundservice-behovsanalys",
  partnerFilterPath: "/dynamics-365-contact-center-partners-sverige/",
  blocks: [
    { title: "Volym, kanaler och telefoni", description: "Storlek på kontaktcenter, kanalmix och telefonibehov." },
    { title: "Bemanning och struktur", description: "Antal agenter, skift, kvalitet och WFM." },
    { title: "AI, virtuella agenter och integration", description: "Copilot, IVR, virtuella agenter och integration mot CRM." },
  ],
  profiles: [
    {
      key: "volume",
      label: "Volym, kanaler och telefoni",
      weight: 0.4,
      strongCopy:
        "Hög samtals-/interaktionsvolym över telefoni, chatt, e-post och sociala kanaler med behov av inbyggd telefoni",
      partnerHint:
        "Contact Center kommer till sin rätt vid tillräcklig volym. Fråga partnern om telefoni-integration, routing och rapportering – gärna med referenscase från större kontaktcenter.",
    },
    {
      key: "workforce",
      label: "Bemanning, WFM och kvalitet",
      weight: 0.25,
      strongCopy:
        "Många agenter, skiftplanering, kvalitetsuppföljning och avancerad rapportering",
      partnerHint:
        "WFM och kvalitet kräver tydliga processer. Be partnern visa hur de arbetar med skift, kvalitetsuppföljning och rapportering i praktiken – inte bara i demo.",
    },
    {
      key: "ai",
      label: "AI, virtuella agenter och integration",
      weight: 0.35,
      strongCopy:
        "Virtuella agenter, IVR, realtidsstöd till agenter (Copilot for Service) och integration mot CRM/ERP",
      partnerHint:
        "Copilot for Service och Microsoft Copilot Studio är där mycket av innovationen sker. Välj partner med konkret erfarenhet av att bygga och drifta AI-agenter i kontaktcenter.",
    },
  ],
  questions: [
    scale("volume", "cc1", 0, "Hur många interaktioner (samtal, chatt, mejl) hanterar du per månad?", "0 = under 2 000, 3 = över 50 000."),
    scale("volume", "cc2", 0, "Hur många kanaler tar du emot interaktioner via?"),
    yn("volume", "cc3", 0, "Behöver du inbyggd telefoni med IVR och köhantering?", 3),
    yn("volume", "cc4", 0, "Ska du hantera sociala kanaler (WhatsApp, Messenger, Apple Business Chat)?", 2),
    scale("workforce", "cc5", 1, "Hur många agenter ska använda systemet?", "0 = under 20, 3 = över 200."),
    yn("workforce", "cc6", 1, "Behöver du skiftplanering och workforce management (WFM) integrerat?", 3),
    yn("workforce", "cc7", 1, "Är kvalitetsuppföljning (samtalsinspelning, scoring) viktigt för dig?", 2),
    scale("workforce", "cc8", 1, "Hur viktigt är realtidsdashboards för teamledare?"),
    yn("ai", "cc9", 2, "Vill du använda virtuella agenter/röstbotar för self-service?", 3),
    yn("ai", "cc10", 2, "Är realtidsstöd till agenten (Copilot for Service, förslag på svar) viktigt?", 3),
    yn("ai", "cc11", 2, "Ska Contact Center integreras djupt med Dynamics 365 Customer Service eller Sales?", 3),
    scale("ai", "cc12", 2, "Hur viktigt är sentimentanalys och AI-driven kvalitetsuppföljning?"),
  ],
  levelCopy: {
    strong: {
      headline: "Stark matchning",
      body:
        "Dina svar pekar på ett kontaktcenter där Dynamics 365 Contact Center är ett rimligt val att utvärdera på allvar. Jämför gärna mot Genesys Cloud, NICE CXone och Amazon Connect för att pressa pris och funktion.",
    },
    partial: {
      headline: "Delvis matchning",
      body:
        "Vissa delar av kontaktcenter-behovet talar för Dynamics 365 Contact Center, andra pekar mot Dynamics 365 Customer Service eller ett dedikerat CCaaS-verktyg. Fokusera utvärderingen på telefoni, AI-behov och grad av CRM-integration.",
    },
    oversized: {
      headline: "Sannolikt överdimensionerat",
      body:
        "Dina svar pekar på ett servicebehov där Dynamics 365 Customer Service (utan Contact Center) eller ett enklare CCaaS-verktyg troligen räcker. Contact Center blir motiverat först vid större volym, inbyggd telefoni och tydliga AI-behov.",
    },
  },
  oversizedAlternative: {
    heading: "Är Customer Service ensamt ett bättre alternativ?",
    body:
      "Dina svar pekar på att Dynamics 365 Contact Center sannolikt är överdimensionerat. Dynamics 365 Customer Service utan Contact Center-tillägg – eller ett dedikerat CCaaS-verktyg – kan räcka till lägre kostnad. Byt upp dig när volym, AI-behov eller telefoni-integration ökar.",
    ctaLabel: "Läs om Dynamics 365 Contact Center",
    ctaTo: "/d365contactcenter/",
  },
  furtherReading: [
    { label: "Dynamics 365 Contact Center – översikt", to: "/d365contactcenter/" },
    { label: "Dynamics 365 Customer Service", to: "/d365customerservice/" },
    { label: "Se Microsoft-partners inom Contact Center", to: "/dynamics-365-contact-center-partners-sverige/" },
  ],
};

export const CRM_MATCHNINGSTEST_CONFIGS: Record<ProductConfig["key"], ProductConfig> = {
  sales: salesConfig,
  "customer-service": customerServiceConfig,
  marketing: marketingConfig,
  "field-service": fieldServiceConfig,
  "contact-center": contactCenterConfig,
};

export const getCrmMatchningstestConfig = (key: ProductConfig["key"]): ProductConfig =>
  CRM_MATCHNINGSTEST_CONFIGS[key];
