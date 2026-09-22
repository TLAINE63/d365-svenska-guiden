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
    title: "Dynamics 365-testledare",
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
    title: "Dynamics 365 Solution Architect",
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
    title: "Dynamics 365-förvaltningsledare",
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
    slug: "dynamics-365-ekonomikonsult",
    title: "Ekonomikonsult inom Dynamics 365",
    shortTitle: "Ekonomikonsult",
    type: "role",
    status: "draft",
    seoTitle: "Ekonomikonsult Dynamics 365: kompetens och krav",
    seoDescription:
      "Vad en ekonomikonsult inom Dynamics 365 arbetar med, när kompetensen behövs och vad ni bör kontrollera. Välj produkt i filtret för Business Central eller Finance.",
    cardDescription:
      "Redovisning, reskontror, periodavslut och rapportering. Välj produkt i filtret, Business Central eller Finance.",
    intro:
      "En ekonomikonsult sätter upp kontoplan, dimensioner, reskontror och rapportering. Arbetssättet är likartat oavsett produkt, men djupet skiljer sig mellan Business Central och Finance. Välj produkt i filtret så visas partners med erfarenhet av just den lösningen.",
    whatTheRoleDoes: [
      "Sätter upp kontoplan, dimensioner och bokföringsregler.",
      "Konfigurerar kund- och leverantörsreskontra samt betalflöden.",
      "Bygger rapportering, nyckeltal och stöd för periodavslut.",
      "Stödjer krav från lag, revision och koncernrapportering.",
    ],
    whenNeeded: [
      "Vid införande eller byte av affärssystem.",
      "Vid nya bolag, valutor, förvärv eller ny koncernstruktur.",
      "När periodavslut tar för lång tid.",
      "När rapporteringen kräver manuellt arbete i kalkylblad.",
    ],
    responsibilities: [
      "Ekonomisk grunduppsättning och dimensionsmodell.",
      "Flöden för kund- och leverantörsfakturor.",
      "Periodavslut, avstämningar och bokslutsstöd.",
      "Rapportpaket och underlag till koncernrapportering.",
      "Utbildning av ekonomifunktionen.",
    ],
    buyerChecklist: [
      "Har konsulten arbetat med svenska redovisningsregler och era rapportkrav?",
      "Finns erfarenhet av er koncernstruktur och antal bolag?",
      "Hur hanteras integration mot bank, lön och förskedssystem?",
      "Hur mycket av rapporteringen löses i standard?",
      "Hur säkerställs att ekonomiavdelningen kan underhålla uppsättningen själv?",
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
    slug: "dynamics-365-logistikkonsult",
    title: "Logistikkonsult inom Dynamics 365",
    shortTitle: "Logistikkonsult",
    type: "role",
    status: "draft",
    seoTitle: "Logistikkonsult Dynamics 365: kompetens och krav",
    seoDescription:
      "Vad en logistikkonsult inom Dynamics 365 arbetar med, när kompetensen behövs och vad ni bör kontrollera. Välj produkt i filtret.",
    cardDescription:
      "Inköp, lager, orderflöden och distribution. Välj produkt i filtret, Business Central eller Supply Chain Management.",
    intro:
      "En logistikkonsult arbetar med inköp, lager, lagerplatser och orderflöden, i vissa fall hela vägen ut till transport och spårbarhet. Behovet växer med antal artiklar, lagerplatser och krav på spårbarhet. Välj produkt i filtret för att se partners med rätt produkterfarenhet.",
    whatTheRoleDoes: [
      "Sätter upp artiklar, enheter, lagerplatser och lagerstyrning.",
      "Konfigurerar inköps- och orderflöden med godkännanden.",
      "Arbetar med planering, materialstyrning och inventering.",
      "Stödjer spårbarhet, batch- och serienummer samt plockflöden.",
    ],
    whenNeeded: [
      "När lagersaldon eller leveransprecision inte är tillförlitliga.",
      "Vid införande av lagerplatser eller streckkodshantering.",
      "Vid nytt lager, ny marknad eller ny distributionsmodell.",
      "När planeringen sker i kalkylblad utanför systemet.",
    ],
    responsibilities: [
      "Artikel- och lagerplatsstruktur.",
      "Inköps- och orderprocesser.",
      "Planeringsparametrar och materialstyrning.",
      "Integration mot lagerutrustning och transportörer.",
      "Utbildning av lager- och inköpspersonal.",
    ],
    buyerChecklist: [
      "Har konsulten erfarenhet av er typ av lager, handel, produktion eller distribution?",
      "Hur hanteras streckkoder och mobila enheter, i standard eller med tillägg?",
      "Hur sätts spårbarhet upp för era artiklar?",
      "Hur testas flödena med verkliga volymer?",
      "Vem ansvarar för att lagerdata stäms av före driftsättning?",
    ],
    risks: [
      {
        risk: "Lagerstrukturen blir mer avancerad än verksamheten kräver.",
        mitigation: "Börja med en enkel struktur och bygg ut stegvis.",
      },
      {
        risk: "Grunddata av dålig kvalitet följer med in i det nya systemet.",
        mitigation: "Avsätt tid för rensning av artikelregister före migrering.",
      },
      {
        risk: "Lagerflöden testas bara i liten skala.",
        mitigation: "Genomför volymtest på de mest frekventa flödena.",
      },
    ],
  },
  {
    slug: "dynamics-365-produktionskonsult",
    title: "Produktionskonsult inom Dynamics 365",
    shortTitle: "Produktionskonsult",
    type: "role",
    status: "draft",
    seoTitle: "Produktionskonsult Dynamics 365: kompetens och krav",
    seoDescription:
      "Vad en produktionskonsult inom Dynamics 365 arbetar med, när kompetensen behövs och vad ni bör kontrollera. Välj produkt i filtret.",
    cardDescription:
      "Produktionsorder, strukturer, kapacitet och efterkalkyl. Välj produkt i filtret.",
    intro:
      "En produktionskonsult sätter upp artikelstrukturer, arbetsgångar, produktionsorder och kapacitetsplanering. Behovet beror på tillverkningsdjup, antal operationer och hur planeringen görs idag. Välj produkt i filtret för Business Central eller Supply Chain Management.",
    whatTheRoleDoes: [
      "Sätter upp artikelstrukturer och arbetsgångar.",
      "Konfigurerar produktionsorder och materialuttag.",
      "Arbetar med kapacitet, beläggning och planering.",
      "Kopplar produktion till lager, inköp och ekonomi.",
    ],
    whenNeeded: [
      "Vid införande av tillverkningsfunktionerna.",
      "När planering sker i kalkylblad vid sidan av systemet.",
      "Vid behov av kostnadsberäkning per produkt.",
      "När manuell rapportering av produktion tar för mycket tid.",
    ],
    responsibilities: [
      "Strukturer, arbetsgångar och kapaciteter.",
      "Produktionsorder och rapportering av utfall.",
      "Planeringsstöd och materialbehov.",
      "Utbildning av produktionsledning och operatörer.",
    ],
    buyerChecklist: [
      "Har konsulten erfarenhet av ert tillverkningssätt, order-, lager- eller projekttillverkning?",
      "Räcker standard, eller behövs tillägg för planering och rapportering?",
      "Hur hanteras kostnadsberäkning och efterkalkyl?",
      "Hur säkerställs att strukturerna hålls uppdaterade efter införandet?",
    ],
    risks: [
      {
        risk: "Produktionsuppsättningen speglar inte den verkliga planeringen.",
        mitigation: "Involvera produktionsledningen i designen från start.",
      },
      {
        risk: "Förväntningar på planeringsstöd överstiger vad standard levererar.",
        mitigation: "Kartlägg planeringsbehoven tidigt och utvärdera tillägg.",
      },
    ],
  },
  {
    slug: "dynamics-365-saljkonsult",
    title: "Säljkonsult inom Dynamics 365",
    shortTitle: "Säljkonsult",
    type: "role",
    status: "draft",
    seoTitle: "Säljkonsult Dynamics 365: kompetens och krav",
    seoDescription:
      "Vad en säljkonsult inom Dynamics\u00a0365 arbetar med, när kompetensen behövs och vad ni bör kontrollera vid utvärdering.",
    cardDescription:
      "Säljprocess, pipeline och uppföljning, framför allt i Dynamics\u00a0365 Sales.",
    intro:
      "En säljkonsult arbetar med säljprocessen och kunddatan: hur affärer följs upp, hur data hålls ren och hur säljorganisationen får ett gemensamt arbetssätt. Kompetensen skiljer sig mellan komplex B2B-försäljning och volymdriven försäljning. Välj produkt i filtret om ni vet vilken lösning ni använder.",
    whatTheRoleDoes: [
      "Sätter upp säljprocess, pipeline och uppföljning.",
      "Strukturerar kund- och kontaktdata.",
      "Bygger rapporter och prognoser för säljledningen.",
      "Kopplar säljverktyget till affärssystem och kommunikationskanaler.",
    ],
    whenNeeded: [
      "När pipelinen inte går att lita på.",
      "Vid införande av ett gemensamt arbetssätt i säljorganisationen.",
      "När säljarna arbetar i olika system eller kalkylblad.",
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
      "Hur kopplas säljlösningen till affärssystemet?",
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
        risk: "Integrationen mot affärssystemet blir eftersatt.",
        mitigation: "Ta fram datamodell och ägarskap för integrationen redan vid uppstart.",
      },
    ],
  },
  {
    slug: "dynamics-365-marknadskonsult",
    title: "Marknadskonsult inom Dynamics 365",
    shortTitle: "Marknadskonsult",
    type: "role",
    status: "draft",
    seoTitle: "Marknadskonsult Dynamics 365: kompetens och krav",
    seoDescription:
      "Vad en marknadskonsult inom Dynamics\u00a0365 arbetar med, när kunddata och marknadsautomation behövs och vad ni bör kontrollera.",
    cardDescription:
      "Kundsegmentering, kundresor och marknadsaktiviteter, framför allt i Customer Insights.",
    intro:
      "En marknadskonsult arbetar med kunddata, segmentering och automatiserade marknadsaktiviteter. Rollen kopplar ofta ihop marknad, sälj och kundservice kring en gemensam kundbild. Välj produkt i filtret om ni vet vilken lösning arbetet gäller.",
    whatTheRoleDoes: [
      "Sätter upp kundprofiler och segment utifrån data från flera källor.",
      "Bygger automatiserade marknadsaktiviteter och kundresor.",
      "Kopplar samman marknadsaktiviteter med säljarbetet.",
      "Stöttar mätning av leadgenerering och kampanjresultat.",
    ],
    whenNeeded: [
      "När marknad och sälj arbetar i skilda system.",
      "Vid behov av segmentering utifrån kundbeteende och data.",
      "När leadhantering och uppföljning ska automatiseras.",
      "Vid införande av en gemensam kundbild över flera system.",
    ],
    responsibilities: [
      "Kunddatamodell och segmentering.",
      "Uppbyggnad av kundresor och automatiserade aktiviteter.",
      "Integration mot CRM, webb och eventverktyg.",
      "Rapportering av leads, konvertering och kampanjresultat.",
      "Säkerställande av samtycke och datalagstiftning.",
    ],
    buyerChecklist: [
      "Har konsulten erfarenhet av er typ av marknadsautomation?",
      "Hur kopplas kunddata från olika system utan att skapa dubbletter?",
      "Vilken datagrund krävs för segmenteringen?",
      "Hur mäts resultatet av marknadsaktiviteter?",
      "Hur hanteras samtycke och lagring av personuppgifter?",
    ],
    risks: [
      {
        risk: "Kunddatan är för splittrad för att bygga meningsfulla segment.",
        mitigation: "Gör en datainventering innan segmenteringen sätts upp.",
      },
      {
        risk: "Marknadsdelen införs utan ägare.",
        mitigation: "Utse ansvarig för marknadsaktiviteter och kunddata innan införandet.",
      },
      {
        risk: "Automatiserade resor skickar kommunikation till fel målgrupper.",
        mitigation: "Testa segment och resor stegvis med en begränsad grupp först.",
      },
    ],
  },
  {
    slug: "dynamics-365-kundservicekonsult",
    title: "Kundservicekonsult inom Dynamics 365",
    shortTitle: "Kundservicekonsult",
    type: "role",
    status: "draft",
    seoTitle: "Kundservicekonsult Dynamics 365: kompetens",
    seoDescription:
      "Vad en kundservicekonsult inom Dynamics 365 arbetar med, när kompetensen behövs och vad ni bör kontrollera vid utvärdering.",
    cardDescription:
      "Ärendehantering, kanaler och självbetjäning, framför allt i Customer Service och Contact Center.",
    intro:
      "En kundservicekonsult arbetar med ärendeflöden, kanaler och kunskapsstöd. Behovet varierar med volym, antal kanaler och hur mycket som ska lösas utan mänsklig hantering. Välj produkt i filtret om ni vet vilken lösning arbetet gäller.",
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
  {
    slug: "dynamics-365-utvecklare",
    title: "Utvecklare inom Dynamics 365",
    shortTitle: "Utvecklare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-utvecklare: kompetens och krav",
    seoDescription:
      "Vad en utvecklare inom Dynamics 365 arbetar med, när kompetensen behövs och vad ni bör kontrollera. Välj produkt i filtret för AL eller X++.",
    cardDescription:
      "Tillägg, anpassningar och integrationer. Välj produkt i filtret, AL för Business Central eller X++ för Finance och Supply Chain.",
    intro:
      "En utvecklare bygger det som standard inte täcker: tillägg, integrationer, rapporter och anpassningar. Tekniken skiljer sig mellan produkterna, AL i Business Central och X++ i Finance och Supply Chain Management, så välj produkt i filtret för att se partners med rätt erfarenhet.",
    whatTheRoleDoes: [
      "Utvecklar tillägg och anpassningar i AL eller X++.",
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
      "Finns erfarenhet av just er produkt och teknik, AL eller X++?",
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
    title: "Dynamics 365-support och servicedesk",
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
