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

/**
 * Geografin beskriver var konsulten kan arbeta på plats hos kunden,
 * inte var partnern har kontor. Regionerna och orterna definieras i
 * competenceGeography.ts.
 */
export {
  COMPETENCE_REGIONS as REGION_OPTIONS,
  CITIES_BY_REGION,
  ALL_CITIES,
  regionsForCities,
  onsiteSummary,
} from "./competenceGeography";

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
    title: "Projektledare",
    shortTitle: "Projektledare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-projektledare: roll och kontroll",
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
    title: "Testledare",
    shortTitle: "Testledare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-testledare: ansvar och kontroll",
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
    title: "Solution Architect",
    shortTitle: "Solution Architect",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365 Solution Architect: roll och ansvar",
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
    title: "Förvaltningsledare",
    shortTitle: "Förvaltningsledare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-förvaltningsledare: ansvar i drift",
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
    slug: "dynamics-365-applikationskonsult",
    title: "Applikationskonsult",
    shortTitle: "Applikationskonsult",
    type: "role",
    status: "draft",
    seoTitle: "Applikationskonsult inom Dynamics 365: roll och kompetens",
    seoDescription:
      "Vad en Dynamics 365 Applikationskonsult arbetar med, när rollen behövs och vad ni bör kontrollera. Välj produkt i filtret för Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service eller andra Dynamics 365-applikationer.",
    cardDescription:
      "Konfiguration, processstöd och användarstöd inom vald Dynamics 365-applikation. Välj produkt i filtret.",
    intro:
      "En applikationskonsult arbetar hands-on med inställningar, processer och användarstöd i Dynamics 365. Rollen kan vara inriktad på ekonomi, logistik, produktion, försäljning, marknad eller kundservice, men det gemensamma är att förstå verksamhetens behov och översätta dem till rätt konfiguration i systemet. Välj produkt i filtret för att se partners med erfarenhet av just den applikationen.",
    whatTheRoleDoes: [
      "Kartlägger verksamhetens processer och behov tillsammans med beställaren.",
      "Konfigurerar inställningar, mallar, flöden och rapporter i Dynamics 365.",
      "Stödjer användare i det dagliga arbetet och vid införandet.",
      "Dokumenterar lösningar och bidrar till utbildning av nyckelanvändare.",
    ],
    whenNeeded: [
      "Vid införande eller uppgradering av en Dynamics 365-applikation.",
      "När processer eller rutiner behöver justeras i systemet.",
      "När användarna behöver hjälp med specifika funktioner eller arbetsflöden.",
      "När ni vill säkerställa att konfigurationen följer verksamhetens krav.",
    ],
    responsibilities: [
      "Kartläggning och kravställning utifrån verksamhetens processer.",
      "Konfiguration av applikationen enligt överenskommen design.",
      "Stöd till användare och nyckelanvändare.",
      "Dokumentation av inställningar och rutiner.",
      "Uppföljning och justering efter driftsättning.",
    ],
    buyerChecklist: [
      "Har konsulten erfarenhet av er produkt och er bransch?",
      "Hur arbetar konsulten med kravställning och dokumentation?",
      "Vilken metodik används för konfiguration och test?",
      "Hur säkerställs att användarna förstår och tar till sig lösningen?",
      "Vad ingår i överlämningen till er egen organisation eller förvaltning?",
    ],
    risks: [
      {
        risk: "Konfigurationen speglar inte verksamhetens faktiska processer.",
        mitigation: "Kräv att processerna dokumenteras innan konfigurationen påbörjas.",
      },
      {
        risk: "Kunskapen stannar hos konsulten istället för hos er.",
        mitigation: "Säkerställ dokumentation och kompetensöverföring som en fast del av uppdraget.",
      },
      {
        risk: "Användarna får för lite stöd vid övergången.",
        mitigation: "Planera för coachning och nyckelanvändarstöd i samband med driftsättning.",
      },
    ],
  },
  {
    slug: "dynamics-365-utvecklare",
    title: "Utvecklare/Developer",
    shortTitle: "Utvecklare/Developer",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics\u00A0365 - Utvecklare/Developer: kompetens och krav",
    seoDescription:
      "Vad en Dynamics 365-utvecklare/Developer arbetar med, när kompetensen behövs och vad ni bör kontrollera. Utvecklingsspråket skiljer sig åt mellan produktområden.",
    cardDescription:
      "Tillägg, anpassningar och integrationer i det språk som gäller för vald produkt. Välj produkt i filtret.",
    intro:
      "En utvecklare/Developer bygger det som standard inte täcker: tillägg, integrationer, rapporter och anpassningar. Utvecklingsspråket skiljer sig åt mellan produktområdena, till exempel AL i Business Central, X++ i Finance och Supply Chain Management, och JavaScript/TypeScript eller C#-plugins i Sales, Customer Insights, Customer Service och andra Power Platform-baserade applikationer. Välj därför produkt i filtret för att se partners med rätt erfarenhet.",
    whatTheRoleDoes: [
      "Utvecklar tillägg och anpassningar i produktens teknik, till exempel AL, X++ eller JavaScript/TypeScript/C#-plugins.",
      "Bygger integrationer via API:er och tjänster.",
      "Tar fram rapporter och utskrifter utöver standard.",
      "Anpassar egen kod vid Microsofts uppdateringar.",
    ],
    whenNeeded: [
      "När ett affärskrav inte löses av standard eller färdiga tillägg.",
      "Vid integrationer mot webbshop, PIM eller andra system.",
      "När äldre anpassningar ska byggas om eller förvaltas.",
      "Vid migrering av data från äldre system.",
    ],
    responsibilities: [
      "Teknisk design, utveckling och test av anpassningar.",
      "Integrationer, API:er och datautbyten.",
      "Versionshantering och kodgranskning.",
      "Teknisk dokumentation och överlämning.",
      "Uppgraderingsanpassning av egen kod.",
    ],
    buyerChecklist: [
      "Har partnern erfarenhet av er produkts teknik och språk, till exempel AL, X++ eller JavaScript/TypeScript/C#-plugins?",
      "Hur säkerställs att koden klarar Microsofts uppdateringar?",
      "Vem äger koden, och kan en annan partner ta över den?",
      "Finns dokumentation och testrutiner för tilläggen?",
      "Hur prissätts utvecklingsarbete, och vad ingår i förvaltningen?",
    ],
    risks: [
      {
        risk: "Omfattande egna tillägg gör uppdateringar kostsamma.",
        mitigation: "Pröva alltid standard och färdiga tillägg först.",
      },
      {
        risk: "Kunskapen om anpassningarna finns bara hos en person.",
        mitigation: "Krav på dokumentation och delad åtkomst till kodförråd.",
      },
      {
        risk: "Integrationer byggs utan ägare på er sida.",
        mitigation: "Utse en förvaltningsansvarig innan utvecklingen startar.",
      },
    ],
  },
  {
    slug: "dynamics-365-support-och-servicedesk",
    title: "Support & servicedesk",
    shortTitle: "Support & servicedesk",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-support: kompetens och krav",
    seoDescription:
      "Vad support och servicedesk för Dynamics 365 omfattar, när det behövs och vad ni bör kontrollera i avtalet.",
    cardDescription:
      "Löpande användarstöd, felhantering och servicedesk för era Dynamics 365-applikationer.",
    intro:
      "Efter go-live behövs löpande stöd för användare, felhantering och mindre justeringar. Omfattningen varierar med antal användare, applikationer och hur kritisk lösningen är för verksamheten.",
    whatTheRoleDoes: [
      "Tar emot och hanterar felanmälningar och användarfrågor.",
      "Löser eller eskalerar ärenden till rätt kompetens.",
      "Gör mindre konfigurationsändringar inom överenskommet ramverk.",
      "Följer upp ärendevolymer och återkommande problem.",
    ],
    whenNeeded: [
      "När systemet är i drift och användarna behöver löpande stöd.",
      "När interna supportresurser saknar Dynamics 365-kompetens.",
      "Vid övergång från införandeprojekt till förvaltning.",
      "När servicenivåer ska regleras i avtal.",
    ],
    responsibilities: [
      "Ärendemottagning, prioritering och återkoppling.",
      "Felsökning och åtgärd inom definierade servicenivåer.",
      "Eskalering till partnerns specialister eller Microsoft.",
      "Rapportering av ärendestatistik och förbättringsförslag.",
      "Stöd vid Microsofts uppdateringar och release-fönster.",
    ],
    buyerChecklist: [
      "Vilka servicenivåer (svarstid, lösningsmål) erbjuds i avtalet?",
      "Hur nås supporten, via portal, telefon eller e-post?",
      "Vad ingår i fastpriset och vad debiteras löpande?",
      "Hur hanteras akuta stoppärenden utanför kontorstid?",
      "Hur rapporteras ärendevolymer och återkommande fel?",
    ],
    risks: [
      {
        risk: "Oklar avgränsning mellan support och förvaltning skapar merkostnader.",
        mitigation: "Definiera vad som ingår i supportavtalet kontra debiterbart arbete.",
      },
      {
        risk: "Akuta ärenden hanteras för långsamt.",
        mitigation: "Avtala eskalationsvägar och responstider per prioritet.",
      },
      {
        risk: "Samma fel återkommer utan åtgärd.",
        mitigation: "Krav på analys av återkommande ärenden och förebyggande åtgärder.",
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
