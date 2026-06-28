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
    bc: "Per användare/månad (Microsofts officiella listpris exkl. moms) – Essentials ~765 kr, Premium ~1 050 kr, Team Member ~77 kr.",
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
    bc: "Microsoft Marketplace + över 7 000 certifierade tilläggsappar. Svenska ISV: Continia, Tabellae, Bitlog, BrightCom (Excitec), Storm Commerce m.fl.",
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
        "Företag som värdesätter en svenskägd produktleverantör med svensk juridik och produktutveckling i Sverige.",
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
      "Om det är avgörande att hela leverantörskedjan – inklusive produktägaren – är svensk (Business Centrals produktägare är Microsoft, även om svenska partners står för implementation och support).",
    ],
    competitorLimits: [
      "Om ni har process- eller livsmedelstillverkning – Monitor är optimerat för diskret tillverkning.",
      "Om ni har e-handel, B2C eller komplex tjänsteförsäljning utöver tillverkningen.",
      "Om Microsoft 365 / Copilot är centralt i er digitaliseringsstrategi.",
    ],
    faqs: [
      {
        q: "Är Business Central eller Monitor ERP billigare?",
        a: "Total kostnad beror på antal användare och anpassningar. Som tumregel ligger BC:s licensmodell öppet redovisad (765 kr Essentials / 1 050 kr Premium per användare/månad, exkl. moms), medan Monitor är offertbaserad. Implementationen är ofta i samma intervall men Monitor tenderar att bli något dyrare vid komplex svensk tillverkning.",
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
        "Bolag som värdesätter en svenskägd produktleverantör med svensk juridik och produktutveckling i Sverige.",
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
  {
    slug: "business-central-vs-sap-business-one",
    competitor: "SAP Business One",
    competitorUrl: "https://www.sap.com/sweden/products/business-one.html",
    title: "Business Central vs SAP Business One – jämförelse för svenska SMB",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med SAP Business One. Funktioner, pris, implementationstid, AI och partnerekosystem för svenska små och medelstora bolag.",
    intro:
      "SAP Business One är SAP:s ERP för små och medelstora bolag — inte att förväxla med SAP S/4HANA som riktar sig till storföretag. Business Central är Microsofts motsvarighet och är ofta den tydligaste konkurrenten i SMB-segmentet i Sverige.",
    bcSummary:
      "Business Central står starkast när bolaget redan kör Microsoft 365, vill ha Copilot inbyggt och söker en bred, modern molnplattform med stort svenskt partnernätverk.",
    competitorSummary:
      "SAP Business One har djup ekonomi- och lagerfunktionalitet och passar bolag som vill ha SAP-varumärket, internationell SAP-konsolidering eller redan har SAP i moderbolaget.",
    bestFor: {
      bc: [
        "Bolag som vill ha Microsoft 365, Teams och Copilot djupt integrerat i affärsprocesserna.",
        "Bolag som söker bred lokalisering i Sverige med många konkurrerande partners.",
        "Bolag i tillväxt som vill kunna växa till F&SCM utan att byta plattform.",
      ],
      competitor: [
        "Dotterbolag till SAP-koncerner som behöver konsolidera mot S/4HANA eller ECC.",
        "Bolag som har starka SAP-kompetenser internt eller via befintlig partner.",
        "Bolag som värdesätter SAP-ekosystemet och dess globala räckvidd.",
      ],
    },
    rows: COMMON_ROWS({
      arkitektur: "Moln (SAP Business One Cloud) eller on-prem. HANA eller MS SQL Server som databas.",
      licensModell: "Per användare/månad. Professional ~1 600–2 200 kr, Limited ~600–900 kr (offert).",
      implTid: "10–24 veckor för standardprojekt; längre vid SAP-koncernintegration.",
      implKostnad: "400 000–1 800 000 kr beroende på komplexitet och anpassningar.",
      isvEko: "Globalt SAP-ekosystem (Boyum, Beas, Produmex m.fl.). Mindre svenskt utbud än BC.",
      integration: "Standardintegrationer mot Office finns men inte i samma djup som BC:s native-integration.",
      ai: "SAP Joule rullas ut stegvis i Business One. Mindre moget än Microsoft Copilot idag.",
      lokalRedovisning: "Svensk lokalisering finns, men kräver oftare partnerinsats än BC:s standardstöd.",
      internationell: "Stark – SAP har lokalisering i 50+ länder och är ett naturligt val för SAP-koncerner.",
      partnerEko: "Mindre svenskt partnernät (handfull aktiva), större internationellt.",
    }),
    bcLimits: [
      "Om ni är dotterbolag i en SAP-koncern där koncernen kräver SAP i hela kedjan.",
      "Om ni har starkt SAP-kompetensberoende internt och vill behålla det.",
    ],
    competitorLimits: [
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha brett urval av svenska partners att jämföra och förhandla med.",
      "Om ni söker en modern molnförst-arkitektur utan beroende av on-prem-historik.",
    ],
    faqs: [
      {
        q: "Är SAP Business One samma sak som SAP S/4HANA?",
        a: "Nej. Business One är SAP:s SMB-ERP (10–500 användare). S/4HANA är för storföretag. Det är Business One — inte S/4HANA — som är reell konkurrent till Business Central.",
      },
      {
        q: "Är SAP Business One dyrare än Business Central?",
        a: "Licenspriserna ligger ofta något över BC Premium. Implementationen blir typiskt 20–40 % dyrare i Sverige, främst eftersom partnerutbudet är mindre och timpriserna högre.",
      },
      {
        q: "Vilket system har starkare AI?",
        a: "Microsoft Copilot är idag mer moget i Business Central än SAP Joule i Business One. SAP investerar tungt men ligger 12–24 månader efter Microsoft i SMB-segmentet.",
      },
    ],
  },
  {
    slug: "business-central-vs-netsuite",
    competitor: "Oracle NetSuite",
    competitorUrl: "https://www.netsuite.com/portal/se/home.shtml",
    title: "Business Central vs Oracle NetSuite – jämförelse för svenska bolag",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Oracle NetSuite. Funktioner, pris, implementationstid, AI och svensk lokalisering för SaaS-baserade ERP-val.",
    intro:
      "Oracle NetSuite är ett av världens mest etablerade moln-ERP och vanligt val i tech-bolag, e-handel och bolag med USA-kopplingar. Business Central är Microsofts motsvarighet med tydligare svensk förankring och Microsoft 365-integration.",
    bcSummary:
      "Business Central står starkast när bolaget vill ha djup Microsoft 365- och Copilot-integration, svensk lokalisering ur lådan och ett brett svenskt partnernät att välja från.",
    competitorSummary:
      "NetSuite är ett moget, multitenancy-baserat moln-ERP med stark funktionalitet för flerbolag, intercompany, revenue recognition och USA-baserade redovisningsregler. Vanligt i scale-ups och bolag med amerikanska investerare.",
    bestFor: {
      bc: [
        "Bolag med svenskt huvudkontor som söker stark lokalisering och svenskt partnernät.",
        "Bolag som redan kör Microsoft 365 / Azure / Copilot.",
        "Bolag som vill ha valfrihet mellan många konkurrerande implementationspartners.",
      ],
      competitor: [
        "Bolag med amerikanska ägare eller US-baserad finansieringsstruktur (VC, PE).",
        "Internationella scale-ups med många bolag, valutor och intercompany-flöden.",
        "Bolag som vill ha advanced revenue recognition (ASC 606 / IFRS 15) inbyggt.",
      ],
    },
    rows: COMMON_ROWS({
      arkitektur: "Rent moln-SaaS (multitenancy). Oracle-driven, ingen on-prem-variant.",
      licensModell: "Per användare/månad – från ca 1 000 kr (Limited) till 1 800+ kr (Full). Plattformsavgift ~10 000–25 000 kr/mån.",
      implTid: "16–36 veckor; ofta längre i Sverige p.g.a. begränsat lokalt partnerutbud.",
      implKostnad: "600 000–3 000 000 kr beroende på antal bolag, integrationer och svensk lokalisering.",
      isvEko: "Stort globalt ekosystem (SuiteApps). Mindre svenskt utbud.",
      integration: "Integrationer mot Microsoft 365 finns via SuiteApps men inte native som i BC.",
      ai: "NetSuite AI och text enhance finns; mindre moget än Microsoft Copilot idag.",
      lokalRedovisning: "Begränsad svensk lokalisering – ofta krävs egen anpassning eller SuiteApp.",
      internationell: "Mycket stark – NetSuite OneWorld är byggt för multinationella koncerner.",
      partnerEko: "Få NetSuite-partners i Sverige (handfull). Direktförsäljning från Oracle vanligt.",
    }),
    bcLimits: [
      "Om ni har komplex internationell konsolidering med 20+ bolag i många valutor.",
      "Om amerikansk redovisning (ASC 606) och revenue recognition är kärnkrav.",
    ],
    competitorLimits: [
      "Om ni har svenskt huvudkontor och vill ha stark lokal redovisning ur lådan.",
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha brett urval av svenska partners att jämföra och förhandla med.",
    ],
    faqs: [
      {
        q: "Är NetSuite dyrare än Business Central i Sverige?",
        a: "I de flesta fall ja. Plattformsavgiften (10–25 k kr/mån) tillkommer ovanpå användarlicenser. Implementationen blir ofta 30–60 % dyrare än motsvarande BC-projekt eftersom svenskt partnerutbud är begränsat.",
      },
      {
        q: "När är NetSuite ett bättre val än Business Central?",
        a: "Vid amerikanska ägare som kräver NetSuite, vid komplex internationell intercompany-konsolidering, eller om ni behöver advanced revenue recognition (ASC 606) inbyggt.",
      },
      {
        q: "Finns det svensk support för NetSuite?",
        a: "Ja, men begränsat. Ett fåtal svenska partners arbetar med NetSuite och Oracle har svensk säljorganisation. BC har avsevärt fler aktiva svenska partners.",
      },
    ],
  },
  {
    slug: "business-central-vs-odoo",
    competitor: "Odoo",
    competitorUrl: "https://www.odoo.com/sv_SE",
    title: "Business Central vs Odoo – jämförelse för svenska SMB och scale-ups",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Odoo. Funktioner, pris, implementationstid, AI, svensk lokalisering och öppen källkod – för köpare i SMB-segmentet.",
    intro:
      "Odoo är ett snabbväxande, modulärt ERP med öppen källkod-historik och låg startkostnad. Business Central är Microsofts molnbaserade ERP med djup Microsoft 365-integration och svenskt partnernät. Två tydligt olika filosofier för samma SMB-segment.",
    bcSummary:
      "Business Central står starkast när bolaget värdesätter ett moget Microsoft-ekosystem, stark svensk lokalisering, Copilot och ett brett svenskt partnernät.",
    competitorSummary:
      "Odoo är prisvärt, mycket modulärt och har bred funktionalitet (ERP, CRM, e-handel, HR, MRP, projekt). Passar bolag som vill bygga upp stegvis och har tekniskt mognad internt eller via partner.",
    bestFor: {
      bc: [
        "Bolag som vill ha en stabil, etablerad plattform med tydlig roadmap och stark global support.",
        "Bolag som redan kör Microsoft 365 och vill ha Copilot inbyggt.",
        "Bolag som värdesätter stort svenskt partnerutbud och svensk redovisning ur lådan.",
      ],
      competitor: [
        "Bolag med stark teknisk profil eller IT-team som vill ha kontroll på källkod och anpassningar.",
        "Bolag som vill starta smalt (t.ex. bara ekonomi + CRM) och växa stegvis.",
        "Bolag med stark prispress där låg licenskostnad är centralt.",
      ],
    },
    rows: COMMON_ROWS({
      arkitektur: "Moln (Odoo Online / Odoo.sh) eller on-prem. Open Source Community + kommersiell Enterprise.",
      licensModell: "Per användare/månad – från ~250 kr (One App Free) till ~450–550 kr (Standard) eller ~700–900 kr (Custom).",
      implTid: "6–20 veckor är vanligt; kortare för smala uppstarter, längre för full ERP-svit.",
      implKostnad: "100 000–800 000 kr beroende på moduler, anpassningar och svensk lokalisering.",
      isvEko: "Stort globalt community + Odoo Apps Store. Mindre svenskt utbud av certifierade lösningar.",
      integration: "Integrationer mot Office finns men inte i samma djup som BC:s native Microsoft 365-integration.",
      ai: "Odoo AI-funktioner finns (text/automation) men är mindre mogna än Microsoft Copilot.",
      lokalRedovisning: "Svensk lokalisering finns (BAS-kontoplan, SIE) men kräver ofta partneranpassning för full täckning.",
      internationell: "Stark – global plattform med community-lokalisering i 100+ länder.",
      partnerEko: "Växande svenskt partnernät (handfull aktiva Odoo Gold/Silver-partners). Mindre än BC.",
    }),
    bcLimits: [
      "Om ni har stark teknisk profil internt och värdesätter öppen källkod-arkitektur.",
      "Om ni har begränsad budget och vill starta smalt med låg licenskostnad.",
      "Om ni vill ha full kontroll på databas och möjlighet till on-prem-drift.",
    ],
    competitorLimits: [
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha brett svenskt partnerutbud och svensk redovisning ur lådan.",
      "Om ni är ett medelstort/större bolag med komplexa krav på revision, kontroll och SLA.",
    ],
    faqs: [
      {
        q: "Är Odoo gratis?",
        a: "Odoo Community är öppen källkod och kan användas gratis, men kräver egen drift och anpassning. Odoo Enterprise (det som de flesta bolag faktiskt kör) är licensierat per användare/månad och tillkommer drift- och implementationskostnader.",
      },
      {
        q: "Vilket är billigare över 5 år – Odoo eller Business Central?",
        a: "Odoo har lägre licenskostnad men ofta högre anpassnings- och förvaltningskostnad i Sverige p.g.a. mindre standardiserad svensk lokalisering. På 5 år hamnar TCO ofta i samma härad för medelstora bolag.",
      },
      {
        q: "Är Odoo mogen nog för svenska SMB?",
        a: "Ja, för många bolag – särskilt tjänste-, handels- och e-handelsbolag. För djup svensk redovisning, lön och tillverkningsstyrning är BC eller svenska alternativ (Visma, Jeeves, Monitor) ofta tryggare val.",
      },
    ],
  },
];

export const getErpComparison = (slug: string): ErpComparison | undefined =>
  ERP_COMPARISONS.find((c) => c.slug === slug);
