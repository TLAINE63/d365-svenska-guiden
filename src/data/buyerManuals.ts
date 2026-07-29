// Köparmanual-innehåll per Dynamics 365-produkt.
// Tonen är köparsidig: vad ni ska titta efter innan ni väljer produkt och partner.

export type BuyerManualContent = {
  /** Kort intro som sätter tonen för köparmanualen på sidan. */
  intro?: string;
  /** Scenarion där produkten är fel verktyg eller dåligt köp just nu. */
  notFit: string[];
  /** Områden som regelmässigt underskattas i tid, scope eller komplexitet. */
  underestimated: string[];
  /** Vad totalkostnaden faktiskt består av – utöver listpris. */
  realCost: string[];
  /** Krav att ställa på partnern innan ni skriver på. */
  partnerProof: string[];
};

export const buyerManuals: Record<string, BuyerManualContent> = {
  "business-central": {
    intro:
      "Business Central är ett kompetent ERP för små och medelstora bolag – men 'enkel' är inte samma sak som 'billig' eller 'snabb'. Här är vad ni bör trycka på innan ni väljer produkt och partner.",
    notFit: [
      "Mycket komplex tillverkning, avancerad WMS eller global koncernredovisning – F&SCM är ofta rätt verktyg istället.",
      "Bolag som vill ha minimal förändring och bara byta ut ett fungerande system 'för att det är gammalt'.",
      "Branscher med starkt branschspecifika krav (process, läkemedel, försvar) utan att räkna med en certifierad branschapp ovanpå.",
      "Verksamheter där integration mot 10+ specialistsystem är kärnvärdet – då blir totalkostnaden ofta högre än ett bredare ERP.",
    ],
    underestimated: [
      "Datamigreringen från det gamla systemet – kvaliteten i artiklar, kunder, leverantörer och saldon avgör hela införandet.",
      "Mängden anpassningar (extensions) som krävs för att täcka era verkliga processer, och vad de kostar att förvalta vid uppgraderingar.",
      "Change management och utbildning – Business Central byter UX, rapporter och rutiner samtidigt.",
      "Rapportering och BI – standardrapporter räcker sällan, ni behöver oftast Power BI och en datamodell.",
    ],
    realCost: [
      "Licens (Essentials/Premium) per användare/månad – men implementationen är typiskt 3–10x årslicensen första året.",
      "Branschapp, integrationer, ev. EDI, e-handelskoppling och rapportplattform.",
      "Intern tid: nyckel­personer behöver avlastas 20–50 % under projektet, det syns sällan i offerten.",
      "Förvaltning efter go-live: minst en partner­dag/månad för uppgraderingar, småändringar och support – räkna med 15–25 % av implementations­kostnaden årligen.",
    ],
    partnerProof: [
      "Referenser från bolag i er storlek och bransch som varit live i minst ett bokslut – inte 'gick live förra månaden'.",
      "Konkret införande­metodik: hur kör de design, test, datamigrering, cutover och hyper­care?",
      "Namnen på personerna som faktiskt ska leverera – inte bara säljare och account manager.",
      "Hur de hanterar uppgraderingar (BC är SaaS) och hur deras kunder klarat de senaste två release-vågorna.",
    ],
  },

  "finance-scm": {
    intro:
      "Finance & Supply Chain är Microsofts tunga ERP-plattform. Den klarar väldigt mycket – men är också ett av de mer komplexa systemen ni kan välja. Ställ tuffa frågor innan ni signerar.",
    notFit: [
      "Bolag under ~50 användare eller utan flera juridiska enheter – Business Central räcker oftast och blir betydligt billigare.",
      "Snabba 'lyft och flytta'-projekt – F&SCM kräver gedigen process­design och datakvalitet för att leverera värde.",
      "Verksamheter som inte är beredda att förändra processer för att passa standard – anpassningar i F&SCM är dyra att äga över tid.",
      "Organisationer utan intern projektkapacitet (process­ägare, IT, ekonomi) som kan driva sitt eget införande – partnern kan inte göra det åt er.",
    ],
    underestimated: [
      "Master data management – artiklar, BOM, leverantörer och kunder måste städas i grunden, det är ofta 3–6 månaders arbete i sig.",
      "Integrationer mot WMS, MES, EDI, e-handel, lön och bank – varje integration är ett miniprojekt.",
      "Antalet rapporter och Power BI-modeller som behövs för att ekonomi, inköp och logistik ska kunna styra verksamheten.",
      "Test­arbetet inför go-live – UAT, regressionstester och cutover-rep ska oftast köras i flera omgångar.",
    ],
    realCost: [
      "Licenser per användare/månad (Finance, SCM, Commerce, ev. tillägg) – men implementationen är typiskt 5–15x årslicensen.",
      "Branschvertikal, integrations­plattform (Logic Apps/Power Platform), datamigreringsverktyg och rapport­miljö.",
      "Intern tid på ekonomi, inköp, logistik och IT – 9–24 månader med betydande avlastning av nyckel­personer.",
      "Application Management efter go-live: 10–20 % av implementations­kostnaden årligen för att hantera 2 årliga releaser, nya legala krav och förändringsbehov.",
    ],
    partnerProof: [
      "Minst 3 jämförbara F&SCM-referenser i er bransch som varit live i 12+ månader och som ni får prata med utan partnerns närvaro.",
      "Tydlig metodik för data­migrering, integrationer och cutover – inte bara 'vi följer Sure Step / FastTrack'.",
      "CV på den faktiska leveransorganisationen: lösningsarkitekt, ekonomikonsult, SCM-konsult, tekniker – och deras tillgänglighet under hela projektet.",
      "Hur de hanterar Microsofts två årliga releaser, regressionstester och regulatoriska uppdateringar för er.",
    ],
  },

  "sales": {
    intro:
      "Dynamics 365 Sales är en kompetent CRM-plattform – men ett CRM levererar inte värde av sig självt. Det som avgör om ni får pipeline eller bara ett dyrt system är hur partnern bygger det runt er säljmodell.",
    notFit: [
      "Säljteam under 5–10 personer utan tydlig process – då är HubSpot eller Pipedrive ofta snabbare och billigare att komma igång med.",
      "Rent transaktionellt B2C där en e-handelsplattform räcker.",
      "Organisationer där säljcheferna inte är beredda att kräva CRM-disciplin av säljarna – då adopteras systemet aldrig.",
      "Bolag som vill ha 'CRM ur lådan' utan att designa stadier, kvalifikationskriterier, prognosmodell och uppföljning.",
    ],
    underestimated: [
      "Datakvalitet i kunder, kontakter och historik – ofta är CRM-projektet i praktiken ett städprojekt först.",
      "Integration mot ERP/orderdata, marknadsplattform och e-post – utan dem blir CRM en isolerad ö.",
      "Säljarnas faktiska adoption – utbildning, coaching och chefer som följer upp i systemet är 50 % av framgången.",
      "Anpassning av prognos, pipeline-stadier och Copilot-prompts till er specifika säljmodell.",
    ],
    realCost: [
      "Licens per säljare/månad (Professional/Enterprise/Premium) – Enterprise behövs ofta för Copilot och avancerade flöden.",
      "Implementation: 150–600 kkr för 10–30 säljare beroende på integrationer och anpassningar.",
      "Förvaltning, vidareutveckling och löpande coaching av säljteamet – 50–150 kkr/år är vanligt.",
      "Tilläggsmoduler (Sales Premium, Conversation Intelligence, Customer Insights) som ofta läggs till efter ett år.",
    ],
    partnerProof: [
      "Referenser från säljorganisationer i er modell (B2B-konsult, distributör, SaaS, fält­sälj) – inte bara 'Sverige-kunder generellt'.",
      "Hur de mäter och driver adoption efter go-live, inte bara hur de bygger lösningen.",
      "Konkret förslag på prognos­modell, stadier och Copilot-användning utifrån er försäljning.",
      "Vilka personer som faktiskt leder workshops och konfigurerar – och deras CRM-erfarenhet i ert segment.",
    ],
  },

  "customer-service": {
    intro:
      "Customer Service ger er kraftfull ärende­hantering, omnikanal och Copilot. Men det är processerna, kunskaps­basen och bemanningen som avgör om kundnöjdheten faktiskt går upp.",
    notFit: [
      "Mycket små supportteam (under 5 agenter) med få ärenden – då räcker oftast Outlook + en delad inbox.",
      "Organisationer där det inte finns en ägare för supportprocesser, SLA:er och kunskapsbas.",
      "Bolag som bara vill 'logga ärenden' utan att vilja förändra hur supporten arbetar.",
      "Verksamheter med behov av djup CCaaS-funktionalitet (avancerad röstrouting, WFM) utan att räkna med Contact Center eller specialistsystem.",
    ],
    underestimated: [
      "Bygget av kunskaps­bas – det är ofta 3–6 månaders arbete och en förutsättning för att Copilot ska ge värde.",
      "Integration mot kunddata, order­system och produktinformation så att agenten ser hela bilden i ett gränssnitt.",
      "Routing-, kö- och SLA-design – fel design här ger eskaleringskaos efter go-live.",
      "Adoption: agenter måste utbildas i nytt UI, makro och Copilot-flöden parallellt med löpande ärenden.",
    ],
    realCost: [
      "Licens per agent/månad (Enterprise/Premium) – Premium behövs för Copilot, röst och Customer Insights-koppling.",
      "Implementation: 200–800 kkr beroende på kanaler, integrationer och migration av befintliga ärenden.",
      "Kunskaps­bas, AI-prompts och kontinuerlig förvaltning av makron, vyer och rapporter.",
      "Telefoni/Contact Center-tillägg om ni behöver röst, IVR eller WFM utöver baspaketet.",
    ],
    partnerProof: [
      "Konkreta referenser från support­organisationer i er storlek – gärna med mätbara förbättringar (AHT, FCR, CSAT).",
      "Hur de tar sig an kunskapsbas-projektet och Copilot-konfiguration – inte bara hur de installerar produkten.",
      "Erfarenhet av integration mot era kanaler (web, e-post, chatt, sociala medier, ev. röst).",
      "Plan för adoption, super­användare och förvaltning under första 6–12 månaderna efter go-live.",
    ],
  },

  "contact-center": {
    intro:
      "Contact Center är Microsofts moderna CCaaS-lager ovanpå Customer Service. Den klarar mycket – men telefoni och röst-AI är ett eget hantverk och kräver att partnern faktiskt kan kontaktcenter, inte bara CRM.",
    notFit: [
      "Mindre support­team utan röstkanal eller IVR-behov – Customer Service Enterprise räcker oftast.",
      "Bolag med tung investering i befintlig CCaaS (Genesys, NICE, Five9) utan affärsbehov att byta.",
      "Verksamheter utan tydlig kontaktcenter­chef eller WFM-funktion som kan äga lösningen.",
      "Bolag som vill bygga avancerad outbound-telemarketing – andra plattformar är ofta starkare där.",
    ],
    underestimated: [
      "Nummer­portering, SIP-trunk och telefoni-leverantörsbyte – kan ta längre tid än hela CRM-projektet.",
      "Röst-IVR-design, transkribering och språkmodell för svenska – kräver iteration och tuning.",
      "WFM (schemaläggning, prognos, real-time) som ofta måste hanteras via tillägg eller integration.",
      "Compliance: inspelning, GDPR, samtycken, retention – behöver designas in från start.",
    ],
    realCost: [
      "Licens per agent/månad (Contact Center komplett eller digitalt) – komplett krävs för röst.",
      "Telefoni­kostnader (minuter, nummer, SBC) – separat från Microsoft-licensen.",
      "Implementation av röst, IVR, routing och integration mot ev. WFM/QA – typiskt 300 kkr–1,5 mkr.",
      "Löpande optimering av IVR, AI-modeller, makron och rapporter – kontaktcenter är aldrig 'klart'.",
    ],
    partnerProof: [
      "Riktiga CCaaS-referenser – inte bara CRM-implementationer. Be om bevis på röstprojekt i drift.",
      "Erfarenhet av nummer­portering, SIP-trunkar och svensk telefoni­leverantör.",
      "Konkret plan för IVR-design, röst-AI och rapportering – inte bara 'vi konfigurerar enligt best practice'.",
      "Tydligt ansvar mellan Microsoft-licens, telefoni och WFM så att ni vet vem ni ringer när det brinner.",
    ],
  },

  "field-service": {
    intro:
      "Field Service automatiserar planering, dispatch och tekniker i fält. Den största risken är inte produkten – det är hur väl partnern förstår ert servicelöfte, era SLA:er och era integrationer mot ERP och IoT.",
    notFit: [
      "Färre än ~10 fälttekniker utan komplex planering – då räcker ofta enklare verktyg eller manuellt schema.",
      "Bolag utan tydligt definierade arbets­order­typer, SLA:er och prislogik.",
      "Verksamheter där integration mot ERP (artiklar, lager, fakturering) inte är möjlig på 6–12 månaders sikt.",
      "Organisationer som vill 'bara digitalisera' utan att förändra hur dispatch och tekniker arbetar.",
    ],
    underestimated: [
      "Optimerings­motorn (Resource Scheduling Optimization) kräver realistiska skill-, geo- och tidsdata för att fungera.",
      "Mobil­upplevelsen för tekniker – offline, signaturer, foton, deldelar – kräver gedigen UX-design och testning i fält.",
      "Integration mot ERP/lager för reservdelar och fakturering är ofta projektets största block.",
      "IoT-integrationer (Azure IoT, Connected Field Service) kräver särskild kompetens och ofta separat plattform.",
    ],
    realCost: [
      "Licens per tekniker/månad (Field Service + ev. Frontline Worker) – plus dispatchers och back-office.",
      "Implementation: 400 kkr–2 mkr beroende på integrationer, mobilflöden och optimering.",
      "Mobiltelefoner/surfplattor, MDM och eventuell offline-anpassning.",
      "Förvaltning och vidareutveckling – schema­motorer och mobilappar kräver löpande tuning.",
    ],
    partnerProof: [
      "Live-referenser från service­organisationer i er typ av fältverksamhet (installation, underhåll, leverans, energi).",
      "Erfarenhet av integration mot ert ERP (Business Central, F&SCM eller annat) – inte bara CRM-bakgrund.",
      "Konkret förslag på dispatch-process, SLA-design och optimerings­strategi för era jobbtyper.",
      "Plan för pilot i en region/affärsenhet innan bred utrullning – och hur ni mäter värdet.",
    ],
  },

  "commerce": {
    intro:
      "Commerce är en av Microsofts mest omfattande appar – fysisk butik, e-handel, POS, kundklubb och prismotorn i en plattform. Skillnaden mellan succé och mardröm är partnerns retail-erfarenhet.",
    notFit: [
      "Renodlade D2C-e-handlare utan butik – Shopify eller liknande är ofta snabbare och billigare att komma igång med.",
      "Mindre kedjor (under ~10 butiker) utan stark IT-organisation att driva ett tungt retail-projekt.",
      "Bolag som inte är beredda på 9–18 månaders implementation och betydande processförändring.",
      "Verksamheter där POS-leverantören inte kan bytas inom rimlig tid – då fungerar inte den samlade plattformstanken.",
    ],
    underestimated: [
      "Produkt­katalog, varianter, attribut och prishierarkier – datamodellen måste designas innan ni bygger något.",
      "Integration mot logistik, betalning, lojalitet och 3:e-parts e-handel om ni inte använder Sites Builder.",
      "POS-utrullning i butik – hårdvara, nätverk, utbildning, hyper­care och fallback-rutiner.",
      "Kampanj- och prislogik – tröskelrabatter, kundklubbs­priser, mix-och-matcha kräver gedigen design och test.",
    ],
    realCost: [
      "Licens per användare/månad + Commerce Scale Unit + ev. Cloud Add-ons för transaktions­volym.",
      "Implementation: 2–10 mkr beroende på antal butiker, kanaler och integrationer.",
      "Hårdvara i butik (POS-stationer, kvitto­skrivare, betalterminaler) och nätverk.",
      "Application Management efter go-live – Microsofts två releaser per år kräver regressionstester och uppdateringar.",
    ],
    partnerProof: [
      "Minst 2–3 retail-referenser i er kategori (mode, sport, dagligvaror, konsument­elektronik) som varit live i 12+ månader.",
      "Bevisad kompetens på POS, prismotorn, lojalitet och Sites Builder – inte bara F&SCM.",
      "Konkret pilot­strategi: börja med 1–3 butiker innan bred utrullning.",
      "Tydligt ansvar mellan partner, betaloperatör, logistik och hårdvaru­leverantör.",
    ],
  },

  "project-operations": {
    intro:
      "Project Operations sammanför sälj, leverans, tid, fakturering och projekt­ekonomi. Den största fällan är att tro att det är en projekt­modul – det är ett helt verksamhets­system för projekt­drivna bolag.",
    notFit: [
      "Bolag med få och enkla projekt – Sales + ett tidrapporterings­verktyg räcker ofta.",
      "Renodlade tillverkare där projekt bara är order­hantering – F&SCM räcker.",
      "Konsult­bolag utan tydlig projekt­modell, prislogik eller leverans­process – verktyget förstärker bara den oreda som finns.",
      "Verksamheter som inte är beredda på att förändra hur konsulter rapporterar tid och hur fakturering går till.",
    ],
    underestimated: [
      "Resurs- och kapacitets­planering – kräver att roller, skills och tillgänglighet hålls aktuella.",
      "Integration mot ekonomi (BC eller F&SCM) för intäkts­avräkning och projekt­ekonomi.",
      "Anpassning av prislogik, kontrakts­typer (T&M, fixed price, milestone) och intäkts­modeller.",
      "Adoption hos konsulter och projekt­ledare – utan disciplin i tidrapport och prognos faller hela värdet.",
    ],
    realCost: [
      "Licens per användare/månad (PO + ev. Resource Scheduling, Sales) – olika roller har olika licensbehov.",
      "Implementation: 400 kkr–2 mkr beroende på integrationer och anpassad prislogik.",
      "ERP-integration och rapport­plattform (Power BI för utnyttjandegrad, marginal, prognos).",
      "Förvaltning och vidare­utveckling – projekt­modellen ändras över tid och systemet ska följa med.",
    ],
    partnerProof: [
      "Referenser från projekt­drivna bolag i er bransch (konsult, bygg, ingenjör, IT-tjänster).",
      "Konkret förslag på kontrakts­typer, prislogik och intäkts­avräkning utifrån er affär.",
      "Plan för integration mot er ekonomi (BC eller F&SCM) och Power BI-modell.",
      "Erfarenhet av att driva adoption hos konsulter – inte bara teknisk implementation.",
    ],
  },

  "human-resources": {
    intro:
      "Dynamics 365 Human Resources samlar medarbetar­data, organisations­hierarkier, kompensation och frånvaro i samma plattform som ekonomi och projekt. Värdet är störst för medel­stora och stora bolag med flera juridiska enheter – annars finns ofta snabbare alternativ.",
    notFit: [
      "Bolag under ~200 anställda utan internationell verksamhet – fristående HR-system är ofta snabbare att införa.",
      "Verksamheter som redan har en stark Workday/SAP SuccessFactors-arkitektur de inte vill röra.",
      "Bolag där lön och tidrapportering ska ligga i HR-modulen – det gör de inte; lön kräver separat leverantör.",
      "Organisationer utan HR-resurs som kan driva master­data, processer och kompensations­band.",
    ],
    underestimated: [
      "Integration mot lön, tid- och frånvaro­system samt benefit­leverantörer.",
      "Kompensations­band, befattnings­strukturer och positions­budgetar – kräver gedigen design.",
      "Datamigrering från befintligt HR-system och Excel-baserade register.",
      "GDPR- och compliance-design för medarbetardata och historik.",
    ],
    realCost: [
      "Licens per anställd/månad + ev. Talent-tillägg (Attract, Onboard).",
      "Implementation: 300 kkr–1,5 mkr beroende på antal länder och integrationer.",
      "Löne- och tidsystem­integration som ofta är separat projekt.",
      "Förvaltning och löpande uppdateringar – regelverk, kompensations­band och organisations­förändringar.",
    ],
    partnerProof: [
      "Live-referenser från HR-implementationer i er storlek – inte bara F&SCM-projekt där HR ingick som biroll.",
      "Tydlig erfarenhet av integration mot er löne­leverantör (Hogia, Visma, ADP, etc.).",
      "Konkret förslag på master­data, positions­struktur och kompensations­design.",
      "Plan för GDPR, behörigheter och historik­hantering.",
    ],
  },

  "marketing": {
    intro:
      "Customer Insights (Journeys + Data) är Microsofts marknads­plattform. Den är kraftfull – men kräver att ni har en marknadsorganisation som kan segment, kampanjer och datakvalitet, annars blir det en dyr e-postmotor.",
    notFit: [
      "Mindre B2B-bolag med få kampanjer per år – Mailchimp/HubSpot Starter är ofta tillräckligt.",
      "Bolag utan dedikerad marknadsfunktion som kan äga segment, journeys och innehåll.",
      "Verksamheter där säljteamet inte är intresserat av lead­scoring eller MQL/SQL-överlämning.",
      "Bolag utan tydlig data­strategi – Customer Insights Data kräver källsystem och datakvalitet för att leverera.",
    ],
    underestimated: [
      "Data­modellen i Customer Insights Data – att förena kunddata från CRM, ERP, web och e-handel är ett eget projekt.",
      "Segment-, kampanj- och content-design – verktyget gör inte marknadsföringen åt er.",
      "GDPR, samtycken och preferens­hantering – måste designas in från start.",
      "Integration mot säljteam (Dynamics 365 Sales) och rapportering på pipeline-bidrag.",
    ],
    realCost: [
      "Licens (Customer Insights Journeys + ev. Data) – prissatt på kontakter och interaktioner, kan skena vid hög volym.",
      "Implementation: 200 kkr–1,5 mkr beroende på källsystem och kampanj­komplexitet.",
      "Content-, mall- och kampanj­produktion som ofta är större kostnad än själva plattformen.",
      "Förvaltning och löpande optimering – A/B-test, segment­tuning, datakvalitet.",
    ],
    partnerProof: [
      "Marknads­förings­referenser – inte bara CRM-implementationer. Be om exempel på kampanjer i drift.",
      "Erfarenhet av Customer Insights Data om ni vill bygga CDP – det är en helt egen kompetens.",
      "Konkret förslag på lead­scoring, MQL-definition och överlämning till sälj.",
      "Plan för GDPR, samtyckes­hantering och rapportering på affärsbidrag.",
    ],
  },

  "copilot": {
    intro:
      "Copilot och AI-agenter i Dynamics 365 är kraftfulla – men värdet uppstår inte automatiskt. Det är datakvalitet, processer, prompts och adoption som avgör om Copilot blir produktivitet eller bara en kul demo.",
    notFit: [
      "Bolag som inte är live på Dynamics 365 eller har dålig datakvalitet i CRM/ERP – Copilot förstärker bara det som redan finns.",
      "Verksamheter utan tydlig use case – 'vi vill ha AI' är inte ett affärsmål.",
      "Organisationer utan AI-policy, datasäkerhets­arbete eller compliance-process för generativ AI.",
      "Bolag som vill bygga djupa egna agenter utan att räkna med Copilot Studio och tillhörande utvecklings­arbete.",
    ],
    underestimated: [
      "Datakvalitet och behörigheter – Copilot ser det användaren ser, inklusive känslig data om behörigheter slarvats.",
      "Prompt-design och anpassning till era processer – out-of-the-box är ofta för generiskt.",
      "Adoption och utbildning – utan löpande coaching faller användandet snabbt.",
      "Mätning av faktisk produktivitets­vinst – utan baseline går det inte att bevisa värdet.",
    ],
    realCost: [
      "Copilot ingår i Sales/Service Enterprise & Premium, men avancerade scenarier (Copilot Studio, agents, M365 Copilot) är separat licens.",
      "Implementation av use cases, prompts och anpassade agenter – typiskt 100–500 kkr per större use case.",
      "Datakvalitet, behörigheter och säkerhets­arbete som ofta är förutsättning för att Copilot ska få användas.",
      "Löpande utbildning, coaching och optimering – AI-användning är ingen 'install once'-aktivitet.",
    ],
    partnerProof: [
      "Konkreta use case-referenser i drift – inte bara demo­miljöer eller pilot­projekt.",
      "Erfarenhet av Copilot Studio och egna agenter om ni har ambition utöver standard­Copilot.",
      "Plan för datakvalitet, behörigheter och GDPR/AI-policy innan ni rullar ut brett.",
      "Konkret förslag på mät­metod för produktivitets­vinst och adoption.",
    ],
  },
};
