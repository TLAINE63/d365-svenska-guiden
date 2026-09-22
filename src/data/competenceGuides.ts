/**
 * Kompetensguider: redaktionellt innehåll för funktionen
 * "Hitta rätt Dynamics 365-kompetens".
 *
 * Innehållet ligger i repot så att det finns i rå HTML vid sidladdning
 * (sajten prerenderas vid build). Partnerkorten hämtas på klientsidan.
 *
 * Status "draft" betyder att sidan renderas men är noindex och inte ligger
 * i sitemap. Sätts till "published" först efter redaktionell granskning.
 */

export type GuideStatus = "draft" | "published" | "archived";
export type GuideType = "role" | "product";
export type DeliveryMode = "onsite" | "hybrid" | "remote";

export const DELIVERY_MODES: { value: DeliveryMode; label: string }[] = [
  { value: "onsite", label: "På plats" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Distans" },
];

export const deliveryModeLabel = (v: string) =>
  DELIVERY_MODES.find((d) => d.value === v)?.label ?? v;

/** Samma regionindelning som partnerprofilerna redan använder. */
export const REGION_OPTIONS = [
  "Storstockholm / Mälardalen",
  "Syd / Sydväst",
  "Väst",
  "Sydost",
  "Mellansverige",
  "Norr",
] as const;

export const PRODUCT_OPTIONS = [
  "Business Central",
  "Finance",
  "Supply Chain Management",
  "Sales",
  "Customer Insights",
  "Customer Service",
  "Field Service",
  "Contact Center",
  "Project Operations",
] as const;

export interface GuideRisk {
  risk: string;
  mitigation: string;
}

export interface CompetenceGuide {
  slug: string;
  /** H1 */
  title: string;
  /** Kort namn i kort och filter */
  shortTitle: string;
  type: GuideType;
  /** Endast för produktkompetensguider: låst produktval. */
  productArea?: (typeof PRODUCT_OPTIONS)[number];
  status: GuideStatus;
  seoTitle: string;
  seoDescription: string;
  cardDescription: string;
  intro: string;
  whatTheRoleDoes: string[];
  whenNeeded: string[];
  responsibilities: string[];
  buyerChecklist: string[];
  risks: GuideRisk[];
}

export const SELECTION_TEXT =
  "De partners som visas här är profilerade partners på d365.se. En uppdragsprofil publiceras först när d365.se har kontrollerat underlag för den erfarenhet som beskrivs. Ordningen i listan styrs enbart av hur väl profilen matchar era val.";

export const DISCLAIMER_TEXT =
  "Partners som visas här har lämnat information om relevant erfarenhet inom området. Informationen innebär inte att partnern har en namngiven konsult eller omedelbar kapacitet tillgänglig. Aktuell bemanning, erfarenhet och möjlighet till leverans behöver bekräftas i dialog med partnern.";

export const COMPETENCE_GUIDES: CompetenceGuide[] = [
  {
    slug: "dynamics-365-projektledare",
    title: "Dynamics 365-projektledare",
    shortTitle: "Projektledare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-projektledare: vad rollen gör och vad du bör kontrollera",
    seoDescription:
      "Vad en Dynamics 365-projektledare ansvarar för, när rollen behövs och vad ni bör kontrollera vid utvärdering. Hitta profilerade partners med relevant erfarenhet.",
    cardDescription:
      "Leder införandet, håller ihop leverantör, verksamhet och tidplan. Produktoberoende roll.",
    intro:
      "En projektledare håller ihop ett Dynamics 365-införande från beslut till driftsättning. Rollen är produktoberoende, men förutsättningarna skiljer sig mycket mellan ett Business Central-projekt och ett större Finance- eller Supply Chain-program. Den här sidan beskriver vad rollen gör, när den behövs och vad ni bör kontrollera innan ni väljer.",
    whatTheRoleDoes: [
      "Planerar och följer upp projektets omfattning, tidplan och budget.",
      "Håller ihop arbetet mellan er verksamhet, partnern och eventuella andra leverantörer.",
      "Driver beslutspunkter så att projektet inte stannar på öppna frågor.",
      "Rapporterar status, risker och avvikelser till styrgruppen.",
    ],
    whenNeeded: [
      "Vid ett nytt införande eller en större uppgradering.",
      "När flera leverantörer eller system är inblandade.",
      "När ett pågående projekt har tappat tidplan eller styrning.",
      "När er egen organisation saknar tid eller erfarenhet av systemprojekt.",
    ],
    responsibilities: [
      "Projektplan, milstolpar och resursbehov.",
      "Styrgruppsmaterial och beslutsunderlag.",
      "Risk- och ändringshantering.",
      "Plan för test, utbildning och driftsättning.",
      "Överlämning till förvaltning.",
    ],
    buyerChecklist: [
      "Har partnern lett projekt av liknande storlek och komplexitet?",
      "Vilken metodik används, och hur anpassas den till er?",
      "Hur hanteras ändringar i omfattning, och vad kostar de?",
      "Hur ofta rapporteras status, och till vem?",
      "Vem ansvarar för att er egen organisation hinner med sin del?",
      "Hur ser överlämningen till förvaltning ut?",
    ],
    risks: [
      {
        risk: "Projektledaren blir en administratör utan mandat.",
        mitigation: "Beskriv mandatet skriftligt och koppla det till styrgruppens beslutsordning.",
      },
      {
        risk: "Omfattningen växer utan att tidplanen ändras.",
        mitigation: "Kräv en enkel ändringsprocess där varje tillägg får pris och tidspåverkan.",
      },
      {
        risk: "Kundens egen tid underskattas.",
        mitigation: "Be om en uppskattning av era timmar per roll och period redan i offertskedet.",
      },
    ],
  },
  {
    slug: "dynamics-365-testledare",
    title: "Dynamics 365-testledare",
    shortTitle: "Testledare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-testledare: ansvar, leveranser och kontrollpunkter",
    seoDescription:
      "Vad en testledare gör i ett Dynamics 365-projekt, vilka leveranser rollen ansvarar för och vad ni bör kontrollera. Hitta profilerade partners med relevant erfarenhet.",
    cardDescription:
      "Planerar och leder testarbetet så att fel hittas före driftsättning, inte efter.",
    intro:
      "Testledaren ansvarar för att det finns en plan för hur lösningen kontrolleras innan den tas i drift, och för att planen faktiskt följs. Rollen blir tydligast i projekt med många integrationer, flera bolag eller hög regulatorisk exponering.",
    whatTheRoleDoes: [
      "Tar fram teststrategi och testplan utifrån verksamhetens processer.",
      "Organiserar testfall, testdata och testmiljöer.",
      "Leder acceptanstest tillsammans med verksamheten.",
      "Följer upp fel, prioriterar dem och bevakar att de åtgärdas.",
    ],
    whenNeeded: [
      "Vid införande med flera integrationer eller dataflöden.",
      "Vid migrering från ett äldre affärssystem.",
      "När verksamheten har krav på spårbarhet eller regelefterlevnad.",
      "När tidigare driftsättningar har gett många fel i produktion.",
    ],
    responsibilities: [
      "Teststrategi och testplan.",
      "Testfall kopplade till verksamhetens processer.",
      "Plan för testdata och testmiljöer.",
      "Felrapportering och statusuppföljning.",
      "Underlag för go eller no go inför driftsättning.",
    ],
    buyerChecklist: [
      "Hur kopplas testfallen till era processer, inte bara till systemfunktioner?",
      "Vem tar fram testdata, och hur hanteras personuppgifter i testmiljön?",
      "Hur mycket tid förväntas era medarbetare lägga på acceptanstest?",
      "Vilka kriterier gäller för godkänd driftsättning?",
      "Hur testas integrationer mot omgivande system?",
    ],
    risks: [
      {
        risk: "Testet blir en formalitet sent i projektet.",
        mitigation: "Lägg in testplanering redan vid designen och boka verksamhetens tid tidigt.",
      },
      {
        risk: "Testdata speglar inte verkligheten.",
        mitigation: "Kräv en plan för representativ och lagligt hanterad testdata.",
      },
      {
        risk: "Fel prioriteras utan verksamhetens medverkan.",
        mitigation: "Låt verksamheten äga prioriteringen av fel som påverkar processer.",
      },
    ],
  },
  {
    slug: "dynamics-365-solution-architect",
    title: "Dynamics 365 Solution Architect",
    shortTitle: "Solution Architect",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365 Solution Architect: ansvar och kontrollpunkter",
    seoDescription:
      "Vad en Solution Architect ansvarar för i ett Dynamics 365-införande, när rollen behövs och vad ni bör kontrollera vid utvärdering.",
    cardDescription:
      "Ansvarar för lösningens helhet: processer, systemlandskap, integrationer och anpassningar.",
    intro:
      "Solution Architect ansvarar för att lösningen hänger ihop. Rollen översätter verksamhetens krav till en struktur som fungerar över tid, och håller emot anpassningar som gör framtida uppgraderingar dyra. I internationella införanden är rollen ofta avgörande.",
    whatTheRoleDoes: [
      "Omsätter verksamhetskrav till en sammanhållen lösningsdesign.",
      "Beslutar vad som löses med standardfunktion, tillägg eller anpassning.",
      "Beskriver integrationer och dataflöden mot omgivande system.",
      "Bevakar prestanda, säkerhet och uppgraderbarhet.",
    ],
    whenNeeded: [
      "Vid införande i flera bolag eller länder.",
      "När många integrationer eller stora datavolymer är inblandade.",
      "När verksamheten har processer som inte täcks av standard.",
      "När tidigare anpassningar gör uppgraderingar svåra.",
    ],
    responsibilities: [
      "Lösningsöversikt och designbeslut med motivering.",
      "Integrationskarta och datamodell på övergripande nivå.",
      "Ställningstagande till anpassningar och tillägg.",
      "Underlag för licens- och miljöval.",
      "Tekniska riktlinjer till utvecklingsteamet.",
    ],
    buyerChecklist: [
      "Kan arkitekten visa hur besluten dokumenteras och motiveras?",
      "Hur hanteras avvägningen mellan standard och anpassning?",
      "Vilken erfarenhet finns av flerbolags- eller flerlandsinföranden?",
      "Hur säkras uppgraderbarhet över tid?",
      "Hur samarbetar arkitekten med era egna IT-ansvariga?",
    ],
    risks: [
      {
        risk: "Designen dokumenteras bara i presentationer.",
        mitigation: "Be om en kortfattad men uppdaterad lösningsbeskrivning som leverans.",
      },
      {
        risk: "Anpassningar införs utan bedömning av långsiktig kostnad.",
        mitigation: "Kräv att varje anpassning motiveras mot standardalternativet.",
      },
      {
        risk: "Arkitekten är bara med i inledningen.",
        mitigation: "Avtala om närvaro även under bygg, test och driftsättning.",
      },
    ],
  },
  {
    slug: "dynamics-365-forvaltningsledare",
    title: "Dynamics 365-förvaltningsledare",
    shortTitle: "Förvaltningsledare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-förvaltningsledare: ansvar efter driftsättning",
    seoDescription:
      "Vad en förvaltningsledare ansvarar för efter driftsättning av Dynamics 365, när rollen behövs och vad ni bör kontrollera i förvaltningsavtalet.",
    cardDescription:
      "Håller ihop support, vidareutveckling och Microsofts releaser efter driftsättning.",
    intro:
      "Efter driftsättningen avgörs värdet av hur systemet förvaltas. Förvaltningsledaren prioriterar ärenden och förbättringar, planerar för Microsofts två årliga releaser och håller ihop dialogen mellan verksamheten och leverantören.",
    whatTheRoleDoes: [
      "Prioriterar supportärenden och förbättringar tillsammans med verksamheten.",
      "Planerar och följer upp Microsofts releaser.",
      "Följer upp avtalade servicenivåer och kostnader.",
      "Håller en backlogg som speglar verksamhetens behov.",
    ],
    whenNeeded: [
      "När projektet avslutas och systemet går i drift.",
      "När ärenden hanteras ad hoc utan prioritering.",
      "När vidareutveckling stannar av efter införandet.",
      "När flera leverantörer delar ansvar för lösningen.",
    ],
    responsibilities: [
      "Förvaltningsplan och prioriterad backlogg.",
      "Rutin för ärendehantering och eskalering.",
      "Releaseplanering och regressionstest.",
      "Uppföljning av servicenivåer och kostnad.",
      "Dokumentation som hålls aktuell.",
    ],
    buyerChecklist: [
      "Hur prioriteras ärenden, och vem beslutar?",
      "Vad ingår i avtalet och vad debiteras separat?",
      "Hur hanteras Microsofts två årliga releaser?",
      "Vilken svarstid gäller, och hur mäts den?",
      "Hur ser planen ut för att minska antalet ärenden över tid?",
    ],
    risks: [
      {
        risk: "Förvaltning blir enbart felavhjälpning.",
        mitigation: "Avsätt en fast andel av förvaltningen till förbättringar.",
      },
      {
        risk: "Releaser hanteras reaktivt.",
        mitigation: "Lägg in releasefönster och regressionstest i årsplaneringen.",
      },
      {
        risk: "Kunskapen sitter hos en enda person.",
        mitigation: "Kräv dokumentation och namngiven ersättare i avtalet.",
      },
    ],
  },
  {
    slug: "dynamics-365-finance-konsult",
    title: "Dynamics 365 Finance-konsult",
    shortTitle: "Finance-konsult",
    type: "product",
    productArea: "Finance",
    status: "draft",
    seoTitle: "Dynamics 365 Finance-konsult: kompetens och kontrollpunkter",
    seoDescription:
      "Vad en Dynamics 365 Finance-konsult arbetar med, när kompetensen behövs och vad ni bör kontrollera. Hitta profilerade partners med relevant erfarenhet.",
    cardDescription:
      "Ekonomiprocesser i Dynamics 365 Finance: redovisning, koncern, rapportering och regelverk.",
    intro:
      "En Finance-konsult arbetar med ekonomiprocesserna i Dynamics 365 Finance: redovisning, reskontror, anläggningar, koncernstruktur och rapportering. Kompetensen behövs både i införandeprojekt och vid förändringar i en befintlig lösning.",
    whatTheRoleDoes: [
      "Sätter upp kontoplan, dimensioner och redovisningsregler.",
      "Konfigurerar leverantörs- och kundreskontra samt betalflöden.",
      "Anpassar rapportering och periodavslut till verksamhetens behov.",
      "Stödjer krav som följer av lag, revision och koncernrapportering.",
    ],
    whenNeeded: [
      "Vid införande eller byte av affärssystem.",
      "Vid ny koncernstruktur, förvärv eller ny juridisk enhet.",
      "När periodavslut tar för lång tid.",
      "När rapporteringen kräver manuellt arbete i kalkylblad.",
    ],
    responsibilities: [
      "Kontoplan, dimensionsmodell och redovisningsuppsättning.",
      "Flöden för kund- och leverantörsfakturor.",
      "Periodavslut och avstämningar.",
      "Rapportpaket och underlag till koncernrapportering.",
      "Utbildning av ekonomifunktionen.",
    ],
    buyerChecklist: [
      "Har konsulten arbetat med svenska redovisningsregler och rapportkrav?",
      "Finns erfarenhet av er koncernstruktur och antal bolag?",
      "Hur hanteras integration mot bank, lön och eventuella förskedssystem?",
      "Hur mycket av rapporteringen löses i standard?",
      "Vem ansvarar för utbildning av ekonomiteamet?",
    ],
    risks: [
      {
        risk: "Dimensionsmodellen sätts för snävt.",
        mitigation: "Utgå från rapporteringsbehovet, inte från den gamla kontoplanen.",
      },
      {
        risk: "Periodavslut planeras först vid driftsättning.",
        mitigation: "Testa ett fullständigt avslut innan driftsättning.",
      },
      {
        risk: "Rapporter byggs utanför systemet.",
        mitigation: "Bestäm tidigt vilken rapportering som ska ligga i standard.",
      },
    ],
  },
  {
    slug: "dynamics-365-supply-chain-konsult",
    title: "Dynamics 365 Supply Chain-konsult",
    shortTitle: "Supply Chain-konsult",
    type: "product",
    productArea: "Supply Chain Management",
    status: "draft",
    seoTitle: "Dynamics 365 Supply Chain-konsult: kompetens och kontrollpunkter",
    seoDescription:
      "Vad en Supply Chain-konsult arbetar med i Dynamics 365, när kompetensen behövs och vad ni bör kontrollera vid utvärdering.",
    cardDescription:
      "Inköp, lager, produktion och logistik i Dynamics 365 Supply Chain Management.",
    intro:
      "En Supply Chain-konsult arbetar med flödena från inköp och lager till produktion och utleverans. Behovet ser olika ut i tillverkning, partihandel och projektdriven verksamhet, så erfarenheten bör matcha er typ av flöde.",
    whatTheRoleDoes: [
      "Konfigurerar inköps-, lager- och produktionsprocesser.",
      "Sätter upp planering, prognos och materialstyrning.",
      "Arbetar med spårbarhet, batch- och serienummer där det krävs.",
      "Stödjer lagerlayout, plockflöden och terminalstöd.",
    ],
    whenNeeded: [
      "Vid införande i tillverkande eller distribuerande verksamhet.",
      "När lagersaldon eller leveransprecision inte är tillförlitliga.",
      "Vid nytt lager, ny produktionslinje eller ny marknad.",
      "När planeringen sker i kalkylblad utanför systemet.",
    ],
    responsibilities: [
      "Processuppsättning för inköp, lager och produktion.",
      "Planeringsparametrar och materialstyrning.",
      "Spårbarhet och kvalitetskontroller.",
      "Integration mot lagerutrustning och transportörer.",
      "Utbildning av lager- och planeringspersonal.",
    ],
    buyerChecklist: [
      "Finns erfarenhet av just er typ av produktion eller distribution?",
      "Hur hanteras spårbarhet och eventuella branschkrav?",
      "Vilken erfarenhet finns av integration mot lager- och transportsystem?",
      "Hur testas flödena med verkliga volymer?",
      "Hur utbildas personal som inte arbetar vid en dator dagligen?",
    ],
    risks: [
      {
        risk: "Planeringsparametrar sätts en gång och följs aldrig upp.",
        mitigation: "Avtala om en uppföljning efter några månaders drift.",
      },
      {
        risk: "Lagerflöden testas bara i liten skala.",
        mitigation: "Genomför volymtest på de mest frekventa flödena.",
      },
      {
        risk: "Produktionsdata är ofullständig vid start.",
        mitigation: "Planera datakvalitetsarbetet som en egen aktivitet.",
      },
    ],
  },
  {
    slug: "business-central-konsult",
    title: "Business Central-konsult",
    shortTitle: "Business Central-konsult",
    type: "product",
    productArea: "Business Central",
    status: "draft",
    seoTitle: "Business Central-konsult: kompetens och kontrollpunkter",
    seoDescription:
      "Vad en Business Central-konsult arbetar med, när kompetensen behövs och vad ni bör kontrollera vid utvärdering av partner.",
    cardDescription:
      "Införande och vidareutveckling av Dynamics 365 Business Central i mindre och medelstora bolag.",
    intro:
      "En Business Central-konsult arbetar ofta brett: ekonomi, inköp, försäljning och lager i samma uppdrag. I mindre bolag kan samma person täcka flera områden, vilket ställer krav på att ni förstår var konsultens tyngdpunkt ligger.",
    whatTheRoleDoes: [
      "Konfigurerar ekonomi, försäljning, inköp och lager i standard.",
      "Anpassar med tillägg från AppSource när standard inte räcker.",
      "Migrerar data från tidigare system.",
      "Utbildar användare och stödjer vid driftsättning.",
    ],
    whenNeeded: [
      "Vid byte från ett äldre eller egenutvecklat system.",
      "Vid tillväxt som gör manuella rutiner för tunga.",
      "När befintlig lösning har många anpassningar.",
      "Vid behov av vidareutveckling efter införandet.",
    ],
    responsibilities: [
      "Processuppsättning i standard.",
      "Val och införande av tillägg.",
      "Datamigrering och avstämning.",
      "Användarutbildning och driftsättningsstöd.",
      "Överlämning till förvaltning.",
    ],
    buyerChecklist: [
      "Var ligger konsultens tyngdpunkt: ekonomi, logistik eller försäljning?",
      "Hur mycket löses i standard och hur mycket med tillägg?",
      "Vilka tillägg föreslås, och vad kostar de per år?",
      "Hur hanteras Microsofts två årliga uppdateringar?",
      "Vem tar över efter driftsättning?",
    ],
    risks: [
      {
        risk: "Anpassningar byggs där ett tillägg redan finns.",
        mitigation: "Be om en motivering till varför standard eller tillägg valts bort.",
      },
      {
        risk: "Datamigrering underskattas.",
        mitigation: "Planera minst två testmigreringar med avstämning.",
      },
      {
        risk: "Utbildning sker för nära driftsättning.",
        mitigation: "Lägg utbildningen nära testet så att kunskapen används direkt.",
      },
    ],
  },
  {
    slug: "dynamics-365-crm-konsult",
    title: "Dynamics 365 CRM-konsult",
    shortTitle: "CRM-konsult",
    type: "product",
    productArea: "Sales",
    status: "draft",
    seoTitle: "Dynamics 365 CRM-konsult: kompetens och kontrollpunkter",
    seoDescription:
      "Vad en CRM-konsult arbetar med i Dynamics 365 Sales och Customer Insights, när kompetensen behövs och vad ni bör kontrollera.",
    cardDescription:
      "Säljprocess, kunddata och marknadsföring i Dynamics 365 Sales och Customer Insights.",
    intro:
      "En CRM-konsult arbetar med säljprocessen och kunddatan: hur affärer följs upp, hur data hålls ren och hur marknad och sälj arbetar i samma underlag. Kompetensen skiljer sig mellan komplex B2B-försäljning och volymdriven försäljning.",
    whatTheRoleDoes: [
      "Sätter upp säljprocess, pipeline och uppföljning.",
      "Strukturerar kund- och kontaktdata.",
      "Kopplar ihop marknadsaktiviteter med säljarbetet.",
      "Bygger rapporter och prognoser för säljledningen.",
    ],
    whenNeeded: [
      "När pipelinen inte går att lita på.",
      "Vid införande av ett gemensamt arbetssätt i säljorganisationen.",
      "När marknad och sälj arbetar i skilda system.",
      "Vid integration mellan CRM och affärssystem.",
    ],
    responsibilities: [
      "Säljprocess och uppföljningsmodell.",
      "Datastruktur för kunder, kontakter och affärer.",
      "Integration mot affärssystem och e-post.",
      "Rapporter och prognoser.",
      "Utbildning av säljare och säljledning.",
    ],
    buyerChecklist: [
      "Har konsulten arbetat med er typ av försäljning?",
      "Hur säkras att säljarna faktiskt använder systemet?",
      "Hur hanteras dubbletter och datakvalitet?",
      "Hur kopplas CRM till affärssystemet?",
      "Vilken uppföljning finns efter införandet?",
    ],
    risks: [
      {
        risk: "Systemet byggs för ledningens rapporter, inte för säljarnas arbete.",
        mitigation: "Låt säljare delta i designen och testa arbetsflödet tidigt.",
      },
      {
        risk: "För många obligatoriska fält.",
        mitigation: "Börja enkelt och lägg till fält först när de används.",
      },
      {
        risk: "Marknadsdelen införs utan ägare.",
        mitigation: "Utse ansvarig för marknadsaktiviteter innan införandet.",
      },
    ],
  },
  {
    slug: "dynamics-365-customer-service-konsult",
    title: "Dynamics 365 Kundservice- och Contact Center-konsult",
    shortTitle: "Kundservice-konsult",
    type: "product",
    productArea: "Customer Service",
    status: "draft",
    seoTitle: "Dynamics 365 Customer Service-konsult: kompetens och kontrollpunkter",
    seoDescription:
      "Vad en kundservice- och Contact Center-konsult arbetar med i Dynamics 365, när kompetensen behövs och vad ni bör kontrollera.",
    cardDescription:
      "Ärendehantering, kanaler och självbetjäning i Dynamics 365 Customer Service och Contact Center.",
    intro:
      "En kundservicekonsult arbetar med ärendeflöden, kanaler och kunskapsstöd. Behovet varierar med volym, antal kanaler och hur mycket som ska lösas utan mänsklig hantering.",
    whatTheRoleDoes: [
      "Sätter upp ärendetyper, köer och servicenivåer.",
      "Konfigurerar kanaler som telefoni, chatt och e-post.",
      "Bygger kunskapsbank och självbetjäning.",
      "Följer upp lösningsgrad och svarstider.",
    ],
    whenNeeded: [
      "När ärenden hanteras i delade e-postlådor.",
      "Vid införande av fler kanaler.",
      "När svarstider eller lösningsgrad behöver förbättras.",
      "Vid behov av gemensam kundbild över sälj och service.",
    ],
    responsibilities: [
      "Ärendemodell, köer och eskalering.",
      "Kanaluppsättning och bemanningslogik.",
      "Kunskapsartiklar och självbetjäning.",
      "Rapportering av servicenivåer.",
      "Utbildning av handläggare och ledning.",
    ],
    buyerChecklist: [
      "Finns erfarenhet av er ärendevolym och era kanaler?",
      "Hur hanteras telefoni, och vilken lösning föreslås?",
      "Hur byggs kunskapsbanken, och vem underhåller den?",
      "Hur mäts lösningsgrad och kundnöjdhet?",
      "Hur införs eventuella automatiserade svar utan att kvaliteten sjunker?",
    ],
    risks: [
      {
        risk: "Kanaler införs snabbare än bemanningen klarar.",
        mitigation: "Inför en kanal i taget och mät belastningen.",
      },
      {
        risk: "Kunskapsbanken saknar ägare.",
        mitigation: "Avsätt tid för underhåll i förvaltningen.",
      },
      {
        risk: "Automatisering döljer verkliga problem.",
        mitigation: "Följ upp vilka ärenden som återkommer och åtgärda orsaken.",
      },
    ],
  },
];

export const guideBySlug = (slug: string) =>
  COMPETENCE_GUIDES.find((g) => g.slug === slug);

export const guidePath = (slug: string) => `/kompetens/${slug}/`;

export const PUBLISHED_GUIDES = COMPETENCE_GUIDES.filter(
  (g) => g.status === "published"
);
