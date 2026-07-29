import type { StandardSectionsData } from "@/components/product/StandardProductSections";

export const PRODUCT_STANDARD_SECTIONS: Record<string, StandardSectionsData> = {
  "business-central": {
    buyerNeeds: [
      "Vi har vuxit ur Visma, Fortnox eller ett annat instegssystem och behöver ett ERP som klarar lager, produktion eller flera bolag.",
      "Vi vill konsolidera flera bolag eller länder i ett gemensamt ekonomisystem.",
      "Vi behöver bättre koppling mellan ekonomi, lager och försäljning utan integrationsspagetti.",
      "Vi vill flytta från lokalt NAV/AX till molnet och få ett tydligt uppgraderingsspår.",
      "Vi behöver branschfunktionalitet (livsmedel, partihandel, tillverkning) som standardsystem inte täcker.",
    ],
    whatItSolves: [
      "Samlar ekonomi, inköp, lager, försäljning och projekt i ett system med en gemensam datamodell.",
      "Hanterar koncerner med flera bolag, valutor och momsregler i samma plattform.",
      "Möjliggör tillägg via ISV-appar i Microsoft Marketplace utan tung specialutveckling.",
      "Levererar löpande uppdateringar i molnet – slut på stora uppgraderingsprojekt vart femte år.",
      "Ger inbyggd Copilot-funktionalitet för bankavstämning, produkttexter och datasökning.",
    ],
    partnerMatters: {
      processDesign: "Hur ni hanterar order-till-faktura, inköp och lager sätter ramen för hela implementationen. Fel processdesign märks först efter go-live.",
      integrations: "Koppling till e-handel, WMS, lönesystem, EDI och Power BI varierar kraftigt mellan partners – fråga efter konkreta referenser.",
      dataModel: "Artikel-, kund- och dimensionsstruktur är svår att ändra senare. Partnern bör utmana er på detta tidigt.",
      reporting: "Standardrapporter räcker sällan. Hur partnern sätter upp dimensioner, jobbqueue och Power BI avgör beslutsstödet.",
      changeManagement: "Användaradoption är största risken. Partners med strukturerad utbildning och superuser-program lyckas oftare.",
      industryKnowledge: "Livsmedel, partihandel, tillverkning och fastighet kräver olika ISV-appar – och alla partners är inte certifierade för dem.",
    },
    pitfalls: [
      "Man väljer Business Central för att det är billigast – och upptäcker senare att F&SCM hade varit rätt för verksamhetens komplexitet.",
      "Man underskattar datakvaliteten i artikel- och kundregistret och tar med skräp in i nya systemet.",
      "Man jämför partners på licenspris i stället för på implementationskostnad och branscherfarenhet.",
      "Man väljer partner utan referenser från liknande bransch – och betalar för att de ska lära sig på er bekostnad.",
    ],
  },

  "finance-supply-chain": {
    buyerNeeds: [
      "Vi har vuxit ur AX/Axapta, Jeeves, IFS eller liknande och behöver enterprise-funktionalitet.",
      "Vi expanderar internationellt och behöver flerbolags-, flervaluta- och flerregelverksstöd.",
      "Vi har komplex tillverkning, supply chain eller lagerlogik som standard-ERP inte täcker.",
      "Vi behöver djupare integration mellan finance, supply chain, warehouse och production.",
      "Vi vill samla en koncern på en gemensam ERP-plattform med tydlig governance.",
    ],
    whatItSolves: [
      "Enterprise-ERP för komplexa supply chains, avancerad tillverkning och global redovisning.",
      "Stöd för flerbolag, flera juridiska enheter, koncernkonsolidering och lokala regelverk.",
      "Avancerad lagerstyrning (WMS), transport (TMS) och produktion (MES-integration) inbyggt.",
      "Power Platform och Azure i botten för utbyggnad, dataflöden och AI-funktionalitet.",
      "Copilot och AI-agenter för avvikelser i leveranskedjan, kreditbedömning och prognoser.",
    ],
    partnerMatters: {
      processDesign: "F&SCM-implementationer faller eller står på processkartläggningen. Partners som hoppar över detta levererar dyra projekt som inte används.",
      integrations: "EDI, MES, lager, e-handel, koncernsystem och rapporteringsverktyg – komplexiteten är hög och kräver erfarna integrationsarkitekter.",
      dataModel: "Legal entity-struktur, dimensioner och produktstruktur måste sättas rätt från början. Att ändra senare är extremt dyrt.",
      reporting: "Financial reporting, dimensioner och Fabric/Power BI-uppsättning skiljer en bra implementation från en oanvändbar.",
      changeManagement: "F&SCM påverkar hundratals användare. Partners utan tydlig adoption-metodik underskattar nästan alltid utbildningsbehovet.",
      industryKnowledge: "Tillverkning, life science, retail och distribution kräver olika partnerprofiler – många partners säger sig kunna allt men har djup i en eller två branscher.",
    },
    pitfalls: [
      "Man väljer F&SCM när Business Central hade räckt – och betalar för komplexitet man inte använder.",
      "Man underskattar tiden för datamigrering och masterdata-städning.",
      "Man jämför partners på timpris i stället för på leveranserfarenhet i samma bransch.",
      "Man väljer partner med tunna referenser i sin egen vertical – och blir pilotkund utan att veta om det.",
    ],
  },

  "sales": {
    buyerNeeds: [
      "Vi har Excel-pipeline eller ett gammalt CRM som ingen säljare faktiskt använder.",
      "Vi behöver gemensam kunddata över sälj, marknad och kundservice.",
      "Vi vill koppla CRM till Business Central eller F&SCM för att se hela kundresan.",
      "Vi vill använda Copilot för mötessammanfattningar, e-postutkast och pipeline-insikter.",
      "Vi behöver bättre prognoser och uppföljning på säljaktivitet.",
    ],
    whatItSolves: [
      "Strukturerar pipeline, leads, kontakter och affärer i en gemensam modell.",
      "Kopplar säljdata till marknadsföring (Customer Insights) och kundservice för full kundbild.",
      "Inbyggd Copilot för mötesnoteringar, e-postförslag och nästa-steg-rekommendationer.",
      "Integrerar med Teams, Outlook och LinkedIn Sales Navigator för säljaren i flödet.",
      "Power BI och Sales Insights för pipeline-analys och prognoser.",
    ],
    partnerMatters: {
      processDesign: "Säljprocess, leadkvalificering och pipeline-stadier måste matcha hur ni faktiskt säljer – inte hur Microsofts demo ser ut.",
      integrations: "Outlook, Teams, LinkedIn, ERP, marketing automation och offertverktyg – uppsättningen avgör om säljaren faktiskt använder systemet.",
      dataModel: "Konto/kontakt/lead-modellen ser olika ut för B2B-långa cykler vs transaktionsförsäljning. Partnern måste förstå er affär.",
      reporting: "Pipeline-rapporter, prognoser och säljchefs-dashboards skiljer ett aktivt CRM från en datakyrkogård.",
      changeManagement: "Säljare adopterar inte CRM frivilligt. Partners utan tydlig adoption-plan levererar system som ingen loggar in i.",
      industryKnowledge: "Komplex B2B, försäkring, fastighet, ideell sektor och retail har olika säljlogik – branscherfaren partner kortar implementationen rejält.",
    },
    pitfalls: [
      "Man köper CRM för att 'ha ett CRM' utan att definiera vad säljarna ska göra annorlunda.",
      "Man bygger för komplext för säljarna och får låg adoption.",
      "Man integrerar inte med ERP och får dubbla kundregister.",
      "Man väljer partner utan CRM-djup – implementationen blir teknisk i stället för affärsdriven.",
    ],
  },

  "customer-insights": {
    buyerNeeds: [
      "Vi har kunddata utspridd i ERP, CRM, e-handel och support – ingen vet vad som är sant.",
      "Vi vill köra segmenterade kampanjer baserat på faktiskt beteende, inte gissningar.",
      "Vi behöver journey-flöden över e-post, SMS och in-app utan flera olika verktyg.",
      "Vi vill mäta marknads-ROI hela vägen från lead till affär.",
      "Vi behöver flytta från det gamla Dynamics 365 Marketing till Customer Insights.",
    ],
    whatItSolves: [
      "Customer Insights – Data (CDP) konsoliderar kunddata från flera källor till en kundprofil.",
      "Customer Insights – Journeys (tidigare Marketing) hanterar kampanjer, journeys och triggers över kanaler.",
      "AI-segmentering och churn-prediktion direkt på samlad data.",
      "Tät integration med Sales och Customer Service – samma kundbild i hela flödet.",
      "Prissatt på kontaktvolym/profilvolym snarare än per användare.",
    ],
    partnerMatters: {
      processDesign: "Vilka journeys, vilka triggers, vilken kvalificering till sälj – designen avgör om plattformen levererar affärsvärde eller bara skickar fler e-postutskick.",
      integrations: "Webb, e-handel, transaktionssystem, ERP och support måste mata CDP:n med korrekt data – utan det blir segmenten värdelösa.",
      dataModel: "Entitetsmodell, unified profile-regler och consent-hantering är komplext och GDPR-känsligt.",
      reporting: "Attribution, kampanj-ROI och pipeline-bidrag kräver att data är rätt kopplad redan från start.",
      changeManagement: "Marknadsteam, säljteam och e-handelsteam behöver enas om definitioner och processer – partnern måste leda detta arbete.",
      industryKnowledge: "B2B, B2C, retail, prenumeration och medlemsorganisationer har helt olika behov av journeys och segmentering.",
    },
    pitfalls: [
      "Man köper Customer Insights – Journeys utan att först ha rätt data i Customer Insights – Data.",
      "Man underskattar GDPR-, consent- och datastrukturarbetet.",
      "Man räknar fel på licenskostnad eftersom prissättningen är kontaktvolymbaserad.",
      "Man väljer partner med stark Sales-erfarenhet men tunn marketing/CDP-kompetens.",
    ],
  },

  "customer-service": {
    buyerNeeds: [
      "Vår support hanterar ärenden i e-post och Excel – vi behöver struktur och spårbarhet.",
      "Vi vill samla kanaler (e-post, telefon, chatt, sociala medier) i en agentvy.",
      "Vi behöver SLA-uppföljning och rapportering på supportkvalitet.",
      "Vi vill använda Copilot och AI-agenter för att avlasta agenterna.",
      "Vi behöver kunskapsbas, självservice och community för att minska ärendetrycket.",
    ],
    whatItSolves: [
      "Ärendehantering med köer, SLA, eskalering och routing.",
      "Omnikanal – e-post, telefon, chatt, WhatsApp, sociala medier i en agentvy.",
      "Kunskapsbas, självservice-portal och AI-agenter för avlastning.",
      "Inbyggd Copilot för svarsförslag, ärendesammanfattning och nästa steg.",
      "Integration med Sales (samma kundbild) och Field Service (vid utryckning).",
    ],
    partnerMatters: {
      processDesign: "Köer, SLA, routing-regler och eskaleringsvägar måste matcha er supportorganisation – annars blir systemet ett hinder i stället för stöd.",
      integrations: "Telefoni, e-post, chatt, sociala kanaler, ERP, fältservice och kunskapsbas – uppsättningen avgör hela agentupplevelsen.",
      dataModel: "Ärende-, kontakt- och kontomodell måste fungera ihop med Sales och Marketing – annars hamnar ni i datasilos igen.",
      reporting: "SLA-uppföljning, NPS, first-call-resolution och agentproduktivitet kräver rätt fältdesign från början.",
      changeManagement: "Agenter är snabba att överge dåliga system. Partners utan tydlig adoption-plan tappar daglig användning inom månader.",
      industryKnowledge: "B2B-support, konsumentsupport, fastighet, energi och offentlig sektor har helt olika SLA-krav och kanalmix.",
    },
    pitfalls: [
      "Man bygger för komplext routing och får eskaleringar som hänger sig.",
      "Man integrerar inte telefoni eller chatt och tappar omnikanal-värdet.",
      "Man hoppar över kunskapsbasen – Copilot blir då lika svag som er dokumentation.",
      "Man väljer partner som mest gör Sales-implementationer och saknar djup i Customer Service.",
    ],
  },

  "field-service": {
    buyerNeeds: [
      "Vi schemalägger tekniker manuellt och tappar tid på fel-körning och dubbla bokningar.",
      "Vi behöver mobilt stöd för tekniker ute hos kund – med arbetsorder, checklistor och bilder.",
      "Vi vill koppla service till garanti, avtal och försäljning av reservdelar.",
      "Vi behöver förebyggande underhåll baserat på IoT-data från utrustning.",
      "Vi vill ha bättre uppföljning på SLA, första-besök-lösning och teknikerproduktivitet.",
    ],
    whatItSolves: [
      "Arbetsordrar, schemaläggning och resursoptimering med AI-driven dispatching.",
      "Mobilapp för tekniker med offline-stöd, checklistor, bilder och reservdelshantering.",
      "Förebyggande underhåll, IoT-integration och Connected Field Service.",
      "Integration med Customer Service (ärenden), Sales (offerter) och ERP (reservdelar, fakturering).",
      "Remote Assist via HoloLens/mobil för expertstöd på distans.",
    ],
    partnerMatters: {
      processDesign: "Schemaläggningsregler, kompetensmatchning och SLA-hantering måste designas efter er verksamhet – annars blir AI-dispatchern värdelös.",
      integrations: "ERP för reservdelar, ekonomi för fakturering, telefoni, IoT-plattform och mobilappar – uppsättningen avgör hela teknikerflödet.",
      dataModel: "Tillgångar, installationer, garantier och avtal måste struktureras rätt för att förebyggande underhåll ska fungera.",
      reporting: "Teknikerproduktivitet, första-besök-lösning, SLA och reservdelsmarginal kräver rätt fält från start.",
      changeManagement: "Tekniker i fält är de svåraste användarna att ändra arbetssätt hos. Partners utan field service-erfarenhet underskattar detta.",
      industryKnowledge: "Hiss, kyla, fastighet, energi, medicinteknik och industriunderhåll har helt olika service-logik och regelverk.",
    },
    pitfalls: [
      "Man köper Field Service utan att först ha tillgångar och installationer korrekt registrerade.",
      "Man underskattar förändringen för teknikerna – mobilappen används inte konsekvent.",
      "Man integrerar inte med ERP och får dubbel fakturering och reservdelshantering.",
      "Man väljer partner utan field service-referenser och blir pilotkund.",
    ],
  },

  "contact-center": {
    buyerNeeds: [
      "Vi har en separat callcenter-plattform som inte pratar med vårt CRM eller vår support.",
      "Vi vill samla röst, chatt, e-post och sociala medier i en agentvy.",
      "Vi behöver AI-agenter och IVR för avlastning av enkla ärenden.",
      "Vi vill mäta call-volymer, AHT och kundnöjdhet i ett samlat verktyg.",
      "Vi är redan på Dynamics 365 Customer Service och vill bygga ut med röst.",
    ],
    whatItSolves: [
      "Modernt omnikanal-contact center med röst, chatt, SMS, e-post och sociala medier.",
      "Inbyggd AI och Copilot för svarsförslag, ärendesammanfattning och självservice.",
      "Tät integration med Customer Service, Sales och Customer Insights.",
      "Realtids-dashboards för supervisorer och AHT/NPS-rapportering.",
      "Bygger på Azure Communication Services för skalbar global röstinfrastruktur.",
    ],
    partnerMatters: {
      processDesign: "IVR-flöden, routing och eskalering måste matcha er supportorganisation – fel design ger fler eskaleringar, inte färre.",
      integrations: "Telefonioperatör, CRM, support, kunskapsbas och WFM – uppsättningen avgör hela kontaktcentrets funktion.",
      dataModel: "Samtal, kontakter, ärenden och uppföljning måste hänga ihop med övriga D365-modulerna – annars uppstår nya silos.",
      reporting: "AHT, FCR, NPS, abandoned rate och supervisor-dashboards kräver rätt datapunkter från start.",
      changeManagement: "Agenter och supervisorer behöver utbildas på både teknik och nya arbetssätt – partners utan contact center-vana underskattar detta.",
      industryKnowledge: "B2C-support, finansiella tjänster, försäkring, offentlig sektor och retail har helt olika compliance-krav på samtalsinspelning och konsent.",
    },
    pitfalls: [
      "Man köper Contact Center utan en tydlig plan för IVR och självservice – agenttrycket minskar inte.",
      "Man underskattar telefoni-integrationen och får sämre kvalitet än med befintlig lösning.",
      "Man hoppar över kunskapsbas och Copilot-träning – AI-värdet uteblir.",
      "Man väljer partner utan röst-/telefoni-erfarenhet och får tekniska överraskningar i drift.",
    ],
  },

  "project-operations": {
    buyerNeeds: [
      "Vi hanterar projekt, tidrapportering och fakturering i Excel och fakturasystem som inte pratar med varandra.",
      "Vi behöver bättre koppling mellan offert, projekt, leverans, tid och fakturering.",
      "Vi vill ha resursplanering med kompetenser, beläggning och tillgänglighet.",
      "Vi behöver projektredovisning enligt successive vinstavräkning eller pågående arbete.",
      "Vi är konsultbolag eller projektorganisation och vill ha allt i Dynamics 365.",
    ],
    whatItSolves: [
      "Hanterar offert-till-faktura för projektbaserade verksamheter i en sammanhängande process.",
      "Resursplanering med kompetensmatris, beläggning och tillgänglighet.",
      "Tid- och utläggsrapportering med godkännandeflöden.",
      "Projektredovisning, intäktsföring och WIP-hantering kopplat till Finance eller Business Central.",
      "Integration med Sales (offert), Customer Service (ärenden) och ERP (fakturering, redovisning).",
    ],
    partnerMatters: {
      processDesign: "Projektmodell, faseringar, godkännandeflöden och faktureringsregler måste designas efter er affär – annars blir systemet ett hinder.",
      integrations: "Sales för offert, ekonomisystem för fakturering och redovisning, HR för resurser, BI för uppföljning.",
      dataModel: "Projekt-, kund-, kontrakt- och resursstruktur är svår att ändra senare – partnern måste utmana er tidigt.",
      reporting: "Beläggningsgrad, projektresultat, WIP och prognoser kräver rätt fältdesign från start.",
      changeManagement: "Konsulter och projektledare har låg tolerans för dåligt designade system. Partners utan projektorganisation-erfarenhet missar detta.",
      industryKnowledge: "Konsultverksamhet, bygg, IT-leverans, ingenjörstjänster och kreativa byråer har olika projektlogik och fakturerings­modeller.",
    },
    pitfalls: [
      "Man köper Project Operations utan att först ha tydliga projekt- och faktureringsprocesser.",
      "Man integrerar inte med ekonomisystem och får dubbel registrering.",
      "Man underskattar resursplaneringsmodulen och fortsätter använda Excel parallellt.",
      "Man väljer partner utan referenser från liknande projektorganisationer.",
    ],
  },
};
