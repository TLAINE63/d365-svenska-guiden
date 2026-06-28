// Konkurrentjämförelser – Business Central vs lokala svenska ERP-system.
// Köparsidig ton. Inga betygsättningar – endast strukturerad jämförelse.

export interface ComparisonRow {
  area: string;
  bc: string;
  competitor: string;
}

export interface ErpComparison {
  slug: string; // /jamfor/{slug}/
  competitor: string;
  competitorUrl?: string;
  title: string; // <title> + H1
  metaDescription: string;
  intro: string;
  bcSummary: string;
  competitorSummary: string;
  /** Korta bullets – vilka köpare matchar respektive sida bäst */
  bestFor: { bc: string[]; competitor: string[] };
  /** Strukturerad tabell – samma rader för alla jämförelser */
  rows: ComparisonRow[];
  /** När passar inte BC? */
  bcLimits: string[];
  /** När passar inte konkurrenten? */
  competitorLimits: string[];
  /** FAQ för FAQPage-schema */
  faqs: { q: string; a: string }[];
}

const COMMON_ROWS = (
  comp: {
    arkitektur: string;
    licensModell: string;
    implTid: string;
    implKostnad: string;
    isvEko: string;
    integration: string;
    ai: string;
    lokalRedovisning: string;
    internationell: string;
    partnerEko: string;
  }
): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    bc: "Molnbaserad SaaS (Microsoft-driven). On-prem möjligt men ovanligt i nya projekt.",
    competitor: comp.arkitektur,
  },
  {
    area: "Licensmodell",
    bc: "Per användare/månad – Essentials ~1 100 kr, Premium ~1 580 kr, Team Member ~110 kr.",
    competitor: comp.licensModell,
  },
  {
    area: "Typisk implementationstid",
    bc: "8–20 veckor för standardprojekt, längre vid omfattande tillverkning eller integrationer.",
    competitor: comp.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    bc: "250 000–1 500 000 kr beroende på komplexitet, antal användare och bransch.",
    competitor: comp.implKostnad,
  },
  {
    area: "ISV- & tilläggsekosystem",
    bc: "Microsoft Marketplace + svenska ISV: Continia, Tabellae, Bitlog, BrightCom (Excitec), Storm Commerce m.fl.",
    competitor: comp.isvEko,
  },
  {
    area: "Integration mot Microsoft 365",
    bc: "Inbyggt: Outlook, Teams, Excel, Power Platform, Copilot. Edge & djup integration är BC:s starkaste sida.",
    competitor: comp.integration,
  },
  {
    area: "AI & Copilot",
    bc: "Copilot inbyggt: bankavstämning, försäljningsförslag, e-postförslag, rapportförklaring.",
    competitor: comp.ai,
  },
  {
    area: "Svensk redovisning & rapportering",
    bc: "Klarar svensk redovisning via lokalisering + ISV (Continia, Tabellae). SIE, e-faktura, Skatteverket-rapportering.",
    competitor: comp.lokalRedovisning,
  },
  {
    area: "Internationell skalbarhet",
    bc: "Stark – flera bolag, valutor, lokalisering i 100+ länder via Microsoft.",
    competitor: comp.internationell,
  },
  {
    area: "Partnerekosystem i Sverige",
    bc: "20+ aktiva svenska BC-partners (se /businesscentral#partners).",
    competitor: comp.partnerEko,
  },
];

export const ERP_COMPARISONS: ErpComparison[] = [
  {
    slug: "business-central-vs-monitor-erp",
    competitor: "Monitor ERP",
    competitorUrl: "https://www.monitorerp.com/sv",
    title: "Business Central vs Monitor ERP – jämförelse för svenska tillverkare",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Monitor ERP. Funktioner, pris, implementationstid, AI och partnerekosystem för svenska tillverkande bolag.",
    intro:
      "Monitor ERP är ett svenskt affärssystem byggt för diskret tillverkning. Business Central är Microsofts molnbaserade ERP för små och medelstora bolag i alla branscher. Båda är reella val för svenska tillverkare – frågan är vad ni värdesätter mest: bransch-djup eller bredd och Microsoft-ekosystem.",
    bcSummary:
      "Business Central är bredare och starkare i ekonomi, integration mot Microsoft 365 och Copilot. Vid komplex tillverkning kompletteras BC ofta med ISV som Bitlog (WMS), Continia (ekonomi) eller branschapp från svensk partner.",
    competitorSummary:
      "Monitor ERP är djupt specialiserat på diskret tillverkning – MPS, kapacitetsplanering, arbetsorderhantering. För svenska verkstadsbolag som vill ha ett komplett tillverkningssystem 'ur lådan' är det ett starkt val.",
    bestFor: {
      bc: [
        "Tillverkare som också driver tjänsteförsäljning, e-handel eller flera bolag.",
        "Företag som redan är djupt inne i Microsoft 365 / Azure / Copilot.",
        "Internationella bolag som behöver lokalisering i flera länder.",
      ],
      competitor: [
        "Renodlade svenska verkstadsbolag med fokus på diskret tillverkning.",
        "Bolag som vill ha MPS, kapacitetsplanering och produktionsuppföljning i grunden.",
        "Företag som värdesätter en svensk leverantör med svensk support.",
      ],
    },
    rows: COMMON_ROWS({
      arkitektur: "Molnbaserat (Monitor G5 SaaS) eller on-prem. Egen plattform.",
      licensModell: "Per användare/månad – publiceras inte öppet. Kontakt med Monitor krävs för offert.",
      implTid: "12–26 veckor är typiskt för svensk tillverkning. Längre vid flera bolag.",
      implKostnad: "Oftast 500 000–2 000 000 kr inkl. anpassningar.",
      isvEko: "Mindre och nationellt. Få tredjepartsappar – Monitor täcker det mesta själva.",
      integration: "Standardintegrationer mot Office finns men inte lika djup som BC:s native-integration.",
      ai: "AI-funktioner finns men begränsade jämfört med Copilot.",
      lokalRedovisning: "Mycket stark – byggt för svensk redovisning och tillverkning från grunden.",
      internationell: "Begränsad – fokus på Norden. Internationella rollouts ovanliga.",
      partnerEko: "Levereras främst av Monitor själva, mindre ekosystem av tredjepartspartners.",
    }),
    bcLimits: [
      "Om ni har djup, komplex svensk verkstadstillverkning utan vilja att lägga ISV ovanpå.",
      "Om ni vill ha en svensk leverantör med svensk support i hela kedjan.",
    ],
    competitorLimits: [
      "Om ni har process- eller livsmedelstillverkning – Monitor är optimerat för diskret tillverkning.",
      "Om ni har e-handel, B2C eller komplex tjänsteförsäljning utöver tillverkningen.",
      "Om Microsoft 365 / Copilot är centralt i er digitaliseringsstrategi.",
    ],
    faqs: [
      {
        q: "Är Business Central eller Monitor ERP billigare?",
        a: "Total kostnad beror på antal användare och anpassningar. Som tumregel ligger BC:s licensmodell öppet redovisad (1 100–1 580 kr/användare/månad), medan Monitor är offertbaserad. Implementationen är ofta i samma intervall men Monitor tenderar att bli något dyrare vid komplex svensk tillverkning.",
      },
      {
        q: "Kan Business Central hantera MPS och produktion lika bra som Monitor?",
        a: "BC Premium har grundläggande MPS och produktionsorder, men för djup verkstadsstyrning behövs ofta ISV som Bitlog, Insight Works eller en svensk branschapp. Monitor är mer komplett 'ur lådan' för diskret tillverkning.",
      },
      {
        q: "Vilka partners arbetar med vardera lösningen i Sverige?",
        a: "Monitor levereras främst av Monitor själva. Business Central finns hos 20+ svenska Microsoft-partners – se /businesscentral#partners för aktuell lista per bransch.",
      },
    ],
  },
  {
    slug: "business-central-vs-visma-net",
    competitor: "Visma.net ERP",
    competitorUrl: "https://www.visma.se/erp/visma-net/",
    title: "Business Central vs Visma.net – jämförelse för svenska SMB",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Visma.net ERP. Funktioner, pris, implementationstid och AI för svenska små och medelstora bolag.",
    intro:
      "Visma.net ERP riktar sig till svenska små och medelstora bolag som söker ett tydligt, nordiskt affärssystem. Business Central är Microsofts motsvarighet med bredare internationell räckvidd och djupare Microsoft 365-integration.",
    bcSummary:
      "Business Central står starkast när bolaget redan kör Microsoft 365, vill ha Copilot, internationell skalbarhet eller mer avancerad lager- och tillverkningsfunktionalitet.",
    competitorSummary:
      "Visma.net är ett rent moln-ERP med stark förankring i Norden, enkelt onboarding och tät koppling till Visma Lön, Visma eEkonomi och övriga Visma-tjänster.",
    bestFor: {
      bc: [
        "Bolag i tillväxt som behöver bredd: ekonomi, lager, projekt, tillverkning i samma plattform.",
        "Företag som driver Microsoft 365, Teams och Copilot dagligen.",
        "Bolag som planerar internationell expansion eller flera bolag.",
      ],
      competitor: [
        "Renodlade tjänste- eller handelsbolag med fokus på Sverige/Norden.",
        "Företag som redan använder Vismas löne- och redovisningssystem.",
        "Bolag som vill ha ett enklare, mindre konfigurerbart ERP.",
      ],
    },
    rows: COMMON_ROWS({
      arkitektur: "Rent moln-SaaS, ingen on-prem-variant. Multi-tenant nordisk drift.",
      licensModell: "Per användare/månad. Prissättning offert, men ofta i samma härad som BC Essentials.",
      implTid: "6–14 veckor är vanligt – mindre konfigurerbart innebär snabbare uppstart.",
      implKostnad: "150 000–600 000 kr för standardimplementationer.",
      isvEko: "Mindre globalt ekosystem men stark integration mot övriga Visma-produkter.",
      integration: "Bra integration mot Visma-familjen, mindre djup mot Microsoft 365.",
      ai: "Visma har egna AI-funktioner (Visma AI Assistant) men ingen Copilot-integration.",
      lokalRedovisning: "Mycket stark svensk/nordisk redovisning, byggt för svensk standard.",
      internationell: "Främst Norden. Begränsad räckvidd utanför Skandinavien.",
      partnerEko: "Egen direktförsäljning + ett mindre nät av nordiska partners.",
    }),
    bcLimits: [
      "Om ni vill ha ett enkelt, färdigt system utan stora val eller anpassningar.",
      "Om ni redan kör Visma Lön och vill ha en sömlös lön/ekonomi-koppling.",
    ],
    competitorLimits: [
      "Om ni har internationell verksamhet eller flera bolag i olika valutor.",
      "Om ni behöver tillverkning, projekt eller djup lagerstyrning utöver standardekonomi.",
      "Om Microsoft 365 / Copilot är en strategisk plattform.",
    ],
    faqs: [
      {
        q: "Är Visma.net billigare än Business Central?",
        a: "Licenspriserna ligger ofta i samma härad. Visma.net har lägre implementationskostnad eftersom det är mindre konfigurerbart – men det blir dyrare om ni senare måste byta plattform när ni växer.",
      },
      {
        q: "Vilket system är bäst för internationell expansion?",
        a: "Business Central – Microsoft erbjuder lokalisering i 100+ länder och en global partnerkanal. Visma.net är primärt nordiskt.",
      },
      {
        q: "Kan Visma.net hantera tillverkning?",
        a: "Visma.net har grundläggande produktionsstöd men inte i samma djup som BC Premium med MPS, produktionsorder och kapacitetsplanering.",
      },
    ],
  },
  {
    slug: "business-central-vs-jeeves",
    competitor: "Jeeves ERP",
    competitorUrl: "https://www.jeeves.se/",
    title: "Business Central vs Jeeves ERP – jämförelse för svenska tillverkare & distributörer",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Jeeves ERP. Funktioner, pris, implementationstid och svensk branschanpassning för tillverkning och distribution.",
    intro:
      "Jeeves ERP är ett svenskt affärssystem med stark förankring i tillverkning, distribution och tjänstebolag. Business Central är Microsofts molnbaserade ERP med bredare internationell räckvidd och Copilot-integration.",
    bcSummary:
      "Business Central står starkast när bolaget vill bygga på en global plattform, ha Copilot inbyggt och nyttja Microsoft 365 fullt ut. Vid tillverkning kompletteras BC ofta med ISV eller en svensk branschpartner.",
    competitorSummary:
      "Jeeves är djupt anpassat för svenska tillverkare och distributörer. Branschmoduler för fordon, livsmedel, läkemedel, grossist och tjänsteproducerande bolag finns inbyggda eller via ekosystemet.",
    bestFor: {
      bc: [
        "Bolag som vill bygga på en global plattform med stark molnstrategi.",
        "Bolag som redan kör Microsoft 365 och vill ha Copilot i affärsprocesserna.",
        "Bolag i tjänstebranscher eller med flera bolag i flera länder.",
      ],
      competitor: [
        "Svenska tillverkande och distribuerande bolag som vill ha djup branschfunktionalitet ur lådan.",
        "Bolag som söker en svensk leverantör med svensk support och svensk juridik.",
        "Bolag i specifika nischer (livsmedel, läkemedel, grossist) där Jeeves har färdiga branschmoduler.",
      ],
    },
    rows: COMMON_ROWS({
      arkitektur: "Jeeves Selected (modernare moln) eller Jeeves Universal (etablerad on-prem/hostad). Två spår.",
      licensModell: "Per användare. Prissättning offert – ofta i samma härad som BC Premium.",
      implTid: "16–30 veckor är vanligt för svensk tillverkning/distribution.",
      implKostnad: "600 000–2 500 000 kr beroende på branschmoduler och anpassningar.",
      isvEko: "Mindre och nationellt, men starkt med svenska branschmoduler.",
      integration: "Standardintegrationer mot Office finns. Inte lika djup som BC:s native Microsoft 365-integration.",
      ai: "AI-funktioner är under utveckling men inte i samma djup som Copilot.",
      lokalRedovisning: "Mycket stark – byggt för svensk redovisning och svensk lagstiftning.",
      internationell: "Begränsad – fokus på Sverige och Norden.",
      partnerEko: "Levereras främst av Jeeves själva och ett mindre nät av svenska partners.",
    }),
    bcLimits: [
      "Om ni har en mycket specifik svensk branschnisch där Jeeves har färdig modul.",
      "Om ni vill ha en svensk leverantör med svensk support i hela kedjan.",
    ],
    competitorLimits: [
      "Om ni har internationell verksamhet eller flera bolag i olika länder/valutor.",
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha stort utbud av globala tilläggsappar via marketplace.",
    ],
    faqs: [
      {
        q: "Är Jeeves dyrare än Business Central?",
        a: "Jeeves tenderar att hamna något högre i total implementationskostnad eftersom branschanpassningarna är mer omfattande. Licenskostnaden ligger ofta i samma härad som BC Premium.",
      },
      {
        q: "Kan Business Central hantera samma branschdjup som Jeeves?",
        a: "BC i sig är bredare men mindre branschspecifikt. För att nå Jeeves-nivå på t.ex. livsmedel eller grossist används ISV och svenska branschpartners ovanpå BC.",
      },
      {
        q: "Vilket system är bäst för internationell expansion?",
        a: "Business Central – Microsoft erbjuder lokalisering i 100+ länder och en global partnerkanal. Jeeves är primärt svenskt/nordiskt.",
      },
    ],
  },
];

export const getErpComparison = (slug: string): ErpComparison | undefined =>
  ERP_COMPARISONS.find((c) => c.slug === slug);
