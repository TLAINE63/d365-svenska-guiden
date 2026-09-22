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
    slug: "dynamics-365-finance-konsult",
    title: "Dynamics 365 Finance-konsult",
    shortTitle: "Finance-konsult",
    type: "product",
    productArea: "Finance",
    status: "draft",
    seoTitle: "Dynamics 365 Finance-konsult: kompetens och krav",
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
    seoTitle: "Supply Chain-konsult i Dynamics 365: kompetens",
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
    slug: "business-central-ekonomikonsult",
    title: "Business Central-ekonomikonsult",
    shortTitle: "Ekonomikonsult",
    type: "product",
    productArea: "Business Central",
    status: "draft",
    seoTitle: "Business Central-ekonomikonsult: kompetens och krav",
    seoDescription:
      "Vad en ekonomikonsult i Dynamics 365 Business Central arbetar med, när kompetensen behövs och vad ni bör kontrollera.",
    cardDescription:
      "Redovisning, rapportering och ekonomistyrning i Dynamics 365 Business Central.",
    intro:
      "En ekonomikonsult sätter upp redovisningsplan, dimensioner och rapportering i Business Central. Behovet är störst vid införande, bolagsbildning eller när rapporteringen inte ger den bild ledningen behöver.",
    whatTheRoleDoes: [
      "Sätter upp kontoplan, dimensioner och bokföringsmallar.",
      "Konfigurerar reskontra, fasta kostnader och periodiseringar.",
      "Bygger ekonomiska rapporter och nyckeltal.",
      "Stödjer bokslut, budget och prognosarbete.",
    ],
    whenNeeded: [
      "Vid införande eller byte av ekonomisystem.",
      "När rapporteringen kräver manuellt arbete i Excel.",
      "Vid nya bolag, valutor eller koncernstrukturer.",
      "När budget- och prognosprocessen ska förenklas.",
    ],
    responsibilities: [
      "Ekonomisk grunduppsättning och dimensioner.",
      "Rapportering och nyckeltal.",
      "Stöd vid periodavslut och bokslut.",
      "Utbildning av ekonomiavdelningen.",
    ],
    buyerChecklist: [
      "Har konsulten erfarenhet av er bolagsform och era rapporteringskrav?",
      "Hur hanteras koncern, valutor och elimineringar?",
      "Vilka rapporter ingår, och vilka kräver tillägg?",
      "Hur säkerställs att ekonomiavdelningen kan underhålla uppsättningen själv?",
    ],
    risks: [
      {
        risk: "Kontoplan och dimensioner sätts upp för snabbt utan analys.",
        mitigation: "Genomför en workshop om rapporteringsbehov innan uppsättningen.",
      },
      {
        risk: "Historik följer inte med vid byte av system.",
        mitigation: "Besluta tidigt vad som migreras och vad som arkiveras.",
      },
    ],
  },
  {
    slug: "business-central-logistikkonsult",
    title: "Business Central-logistikkonsult",
    shortTitle: "Logistikkonsult",
    type: "product",
    productArea: "Business Central",
    status: "draft",
    seoTitle: "Business Central-logistikkonsult: kompetens och krav",
    seoDescription:
      "Vad en logistikkonsult i Dynamics 365 Business Central arbetar med, när kompetensen behövs och vad ni bör kontrollera.",
    cardDescription:
      "Inköp, lager och orderflöden i Dynamics 365 Business Central.",
    intro:
      "En logistikkonsult arbetar med inköp, lager, lagerplatser och orderflöden. Behovet växer med antalet artiklar, lagerplatser och kraven på spårbarhet.",
    whatTheRoleDoes: [
      "Sätter upp artiklar, enheter och lagerplatser.",
      "Konfigurerar inköps- och orderflöden med godkännanden.",
      "Arbetar med lagerstyrning, inventering och ombokningar.",
      "Kopplar samman logistikflödet med ekonomi och försäljning.",
    ],
    whenNeeded: [
      "När lagersaldon inte stämmer med verkligheten.",
      "Vid införande av lagerplatser eller streckkodshantering.",
      "När inköpsprocessen saknar struktur och godkännanden.",
      "Vid krav på spårbarhet via serienummer eller batcher.",
    ],
    responsibilities: [
      "Artikel- och lagerplatsstruktur.",
      "Inköps- och orderprocesser.",
      "Lagerstyrning och inventeringsrutiner.",
      "Utbildning av lager- och inköpspersonal.",
    ],
    buyerChecklist: [
      "Har konsulten erfarenhet av er typ av lager (handel, produktion, distribution)?",
      "Hur hanteras streckkoder och mobila enheter, i standard eller med tillägg?",
      "Hur sätts spårbarhet upp för era artiklar?",
      "Vem ansvarar för att lagerdata stäms av innan driftsättning?",
    ],
    risks: [
      {
        risk: "Lagerplatsstrukturen blir mer avancerad än verksamheten kräver.",
        mitigation: "Börja med en enkel struktur och bygg ut stegvis.",
      },
      {
        risk: "Grunddata av dålig kvalitet följer med in i det nya systemet.",
        mitigation: "Avsätt tid för rensning av artikelregister före migrering.",
      },
    ],
  },
  {
    slug: "business-central-produktionskonsult",
    title: "Business Central-produktionskonsult",
    shortTitle: "Produktionskonsult",
    type: "product",
    productArea: "Business Central",
    status: "draft",
    seoTitle: "Business Central-produktionskonsult: kompetens och krav",
    seoDescription:
      "Vad en produktionskonsult i Dynamics 365 Business Central arbetar med, när kompetensen behövs och vad ni bör kontrollera.",
    cardDescription:
      "Produktionsorder, strukturer och kapacitet i Dynamics 365 Business Central.",
    intro:
      "En produktionskonsult sätter upp produktionsorder, artikelstrukturer och kapacitetsplanering. Behovet beror på tillverkningsdjup, antal operationer och hur planeringen görs idag.",
    whatTheRoleDoes: [
      "Sätter upp artikelstrukturer och arbetsgångar.",
      "Konfigurerar produktionsorder och materialuttag.",
      "Arbetar med kapacitet, beläggning och planering.",
      "Kopplar produktion till lager, inköp och ekonomi.",
    ],
    whenNeeded: [
      "Vid införande av tillverkningsmodulen.",
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
      "Har konsulten erfarenhet av ert tillverkningssätt (order-, lager- eller projekttillverkning)?",
      "Räcker Business Central standard, eller behövs tillägg för planering och rapportering?",
      "Hur hanteras kostnadsberäkning och efterkalkyl?",
      "Hur säkerställs att strukturerna hålls uppdaterade efter införandet?",
    ],
    risks: [
      {
        risk: "Produktionsmodulen sätts upp utan stöd i den verkliga planeringen.",
        mitigation: "Involvera produktionsledningen i designen från start.",
      },
      {
        risk: "Förväntningar på planeringsstöd överstiger vad standard levererar.",
        mitigation: "Kartlägg planeringsbehoven tidigt och utvärdera tillägg.",
      },
    ],
  },
  {
    slug: "business-central-utvecklare",
    title: "Business Central-utvecklare",
    shortTitle: "Utvecklare",
    type: "product",
    productArea: "Business Central",
    status: "draft",
    seoTitle: "Business Central-utvecklare: kompetens och krav",
    seoDescription:
      "Vad en utvecklare i Dynamics 365 Business Central arbetar med, när kompetensen behövs och vad ni bör kontrollera.",
    cardDescription:
      "AL-utveckling, integrationer och tillägg i Dynamics 365 Business Central.",
    intro:
      "En Business Central-utvecklare bygger tillägg i AL, integrationer och anpassningar när standard och befintliga AppSource-tillägg inte räcker. Behovet beror på hur mycket er verksamhet avviker från standard.",
    whatTheRoleDoes: [
      "Utvecklar tillägg och anpassningar i AL.",
      "Bygger integrationer via API:er och tjänster.",
      "Tar fram rapporter och utskrifter utöver standard.",
      "Anpassar kod vid Microsofts uppdateringar.",
    ],
    whenNeeded: [
      "När ett affärskrav inte löses av standard eller AppSource-tillägg.",
      "Vid integrationer mot webbshop, PIM eller andra system.",
      "När äldre anpassningar ska byggas om till tillägg.",
      "Vid behov av kundspecifika rapporter.",
    ],
    responsibilities: [
      "Utveckling och test av tillägg i AL.",
      "Integrationer och API-arbete.",
      "Versionshantering och kodgranskning.",
      "Teknisk dokumentation och överlämning.",
    ],
    buyerChecklist: [
      "Hur säkerställs att koden klarar Microsofts två årliga uppdateringar?",
      "Vem äger koden, och kan en annan partner ta över den?",
      "Finns dokumentation och testrutiner för tilläggen?",
      "Hur prissätts utvecklingsarbete, och vad ingår i förvaltningen?",
    ],
    risks: [
      {
        risk: "Omfattande egna tillägg gör uppdateringar kostsamma.",
        mitigation: "Pröva alltid standard och AppSource-tillägg först.",
      },
      {
        risk: "Kunskapen om anpassningarna finns bara hos en person.",
        mitigation: "Krav på dokumentation och delad åtkomst till kodförråd.",
      },
    ],
  },
  {
    slug: "dynamics-365-sales-konsult",
    title: "Dynamics\u00a0365 Sales-konsult",
    shortTitle: "Sales-konsult",
    type: "product",
    productArea: "Sales",
    status: "draft",
    seoTitle: "Dynamics 365 Sales-konsult: kompetens och krav",
    seoDescription:
      "Vad en Dynamics\u00a0365 Sales-konsult arbetar med, när kompetensen behövs och vad ni bör kontrollera vid utvärdering.",
    cardDescription:
      "Säljprocess, pipeline och uppföljning i Dynamics\u00a0365 Sales.",
    intro:
      "En Sales-konsult arbetar med säljprocessen och kunddatan i Dynamics\u00a0365 Sales: hur affärer följs upp, hur data hålls ren och hur säljorganisationen får ett gemensamt arbetssätt. Kompetensen skiljer sig mellan komplex B2B-försäljning och volymdriven försäljning.",
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
      "Hur kopplas Dynamics\u00a0365 Sales till affärssystemet?",
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
    slug: "dynamics-365-customer-insights-marketing-konsult",
    title: "Dynamics\u00a0365 Customer Insights (Marketing)-konsult",
    shortTitle: "Customer Insights-konsult",
    type: "product",
    productArea: "Customer Insights",
    status: "draft",
    seoTitle: "Dynamics 365 Customer Insights-konsult: kompetens och krav",
    seoDescription:
      "Vad en Dynamics\u00a0365 Customer Insights-konsult arbetar med, när marknadsförings- och kunddataplattformen behövs och vad ni bör kontrollera.",
    cardDescription:
      "Kundsegmentering, marknadsaktiviteter och kunddataplattform i Dynamics\u00a0365 Customer Insights.",
    intro:
      "En Customer Insights-konsult arbetar med kunddata, segmentering och automatiserade marknadsaktiviteter i Dynamics\u00a0365 Customer Insights. Rollen kopplar ofta ihop marknad, sälj och kundservice kring en gemensam kundbild.",
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
    slug: "dynamics-365-customer-service-konsult",
    title: "Dynamics 365 Kundservice- och Contact Center-konsult",
    shortTitle: "Kundservice-konsult",
    type: "product",
    productArea: "Customer Service",
    status: "draft",
    seoTitle: "Customer Service-konsult: kompetens och krav",
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
  {
    slug: "dynamics-365-utvecklare",
    title: "Dynamics 365-utvecklare",
    shortTitle: "Utvecklare",
    type: "role",
    status: "draft",
    seoTitle: "Dynamics 365-utvecklare: kompetens och krav",
    seoDescription:
      "Vad en Dynamics 365-utvecklare arbetar med, när kompetensen behövs och vad ni bör kontrollera innan uppstart.",
    cardDescription:
      "Integrationer, anpassningar och tillägg i Dynamics 365, från AL och X++ till Dataverse.",
    intro:
      "En utvecklare bygger det som standardfunktionerna inte täcker: integrationer, anpassningar och tillägg. Behovet beror på vilken applikation ni använder och hur mycket som ska avvika från standard.",
    whatTheRoleDoes: [
      "Bygger integrationer mot andra system och datakällor.",
      "Utvecklar anpassningar och tillägg i respektive applikation.",
      "Tar fram rapporter och vyer utöver standard.",
      "Deltar i kodgranskning och versionshantering.",
    ],
    whenNeeded: [
      "När integrationer mot befintliga system krävs.",
      "När verksamhetskrav inte täcks av standardfunktioner.",
      "Vid migrering av data från äldre system.",
      "När befintliga anpassningar ska förvaltas eller byggas om.",
    ],
    responsibilities: [
      "Teknisk design och utveckling av anpassningar.",
      "Integrationer, API:er och datautbyten.",
      "Enhetstester och stöd vid acceptanstester.",
      "Teknisk dokumentation och överlämning.",
      "Uppgraderingsanpassning av egen kod.",
    ],
    buyerChecklist: [
      "Finns erfarenhet av just er applikation (Business Central, Finance eller Supply Chain)?",
      "Hur arbetar man med versionshantering och kodgranskning?",
      "Vem äger koden, och hur säkerställs att ni kan byta partner?",
      "Hur hanteras Microsofts uppdateringar och uppgraderingar?",
      "Ingår dokumentation och kunskapsöverföring i uppdraget?",
    ],
    risks: [
      {
        risk: "Anpassningar blir en engångslösning som ingen annan kan förvalta.",
        mitigation: "Krav på dokumentation och överlämning i avtalet.",
      },
      {
        risk: "Integrationer byggs utan ägare på er sida.",
        mitigation: "Uppnäm en förvaltningsansvarig innan utvecklingen startar.",
      },
      {
        risk: "Omfattande anpassningar försvårar uppgraderingar.",
        mitigation: "Utmana behovet av varje anpassning mot standardfunktioner.",
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
