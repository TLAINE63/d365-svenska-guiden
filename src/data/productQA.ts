import type { ProductQACategory } from "@/components/ProductQASection";

export const PRODUCT_QA_DATA: ProductQACategory[] = [
  {
    product: "Business Central",
    description: "Allt du behöver veta om Microsoft Dynamics 365 Business Central – från funktioner till licenspriser.",
    items: [
      {
        question: "Vad är Microsoft Dynamics 365 Business Central?",
        answer: `Microsoft Dynamics 365 Business Central är ett molnbaserat affärssystem (ERP) utvecklat för att ge små och medelstora företag full kontroll över sin verksamhet — från ekonomi och inköp till lager, produktion och försäljning. Det är en modern efterföljare till det välkända Dynamics NAV (Navision) och ingår i Microsofts breda Dynamics 365-svit.\n\nBusiness Central är idag ett av de snabbast växande affärssystemen i Sverige. Systemet kombinerar bred funktionalitet med en bekant Microsoft-miljö och integrerar sömlöst med verktyg som Outlook, Excel, Teams och Power BI. Globalt förlitar sig över 130 000 företag i mer än 40 länder på Business Central.\n\nVad ingår? Ekonomi och redovisning, inköp och leverantörskedja, försäljning och kundhantering, lager och logistik, produktion, projekt, service samt rapportering och BI. Systemet levereras som molntjänst (SaaS) via Microsoft Azure — ni har alltid tillgång till de senaste funktionerna utan kostsamma uppgraderingsprojekt. Det passar företag med ungefär 10–500 anställda som vill ha ett professionellt affärssystem utan den komplexitet som traditionella enterprise-lösningar medför.`,
      },
      {
        question: "Hur fungerar ekonomi och redovisning i Business Central?",
        answer: `Business Central är byggt med ekonomifunktioner i centrum och ger ekonomiteamet kraftfulla verktyg för att arbeta effektivt, träffsäkert och i realtid.\n\nRedovisning och bokföring: Systemet hanterar hela redovisningscykeln — från dagliga transaktioner och periodisering till månads- och årsbokslut. Du kan sätta upp kontoplaner, kostnadsdimensioner och bokföringsmallar. Systemet stöder automatisk kontering.\n\nKund- och leverantörsreskontra: Hantera fakturor, betalningar och påminnelser i ett sammanhängande flöde med automatisering av fakturaprocessen.\n\nKassaflöde och likviditetsstyrning: Den inbyggda kassaflödesprognosen samlar data från försäljning, inköp och lager för att ge en realistisk bild av det framtida kassaflödet.\n\nKoncernkonsolidering: Stöd för att sammanfoga dotterbolag och intressebolag i gemensam finansiell rapport.\n\nDimensioner och rapportering: Analysera data i flera dimensioner med Excel-integration och Power BI.\n\nRegelefterlevnad: Uppfyller svenska bokföringskrav med stöd för momshantering, SIE-export och elektroniska fakturaformat.`,
      },
      {
        question: "Hur fungerar lager och logistik i Business Central?",
        answer: `Business Central ger dig precis rätt verktyg för att optimera lagerhanteringen och minska kostnaderna.\n\nLagerstyrning i realtid: Alltid en aktuell bild av lagernivåerna, oavsett om du har ett eller flera lagerställen. Spåra artiklar med serie- eller partinummer och hantera olika lagerplatser.\n\nAutomatisk påfyllning med AI-stöd: Inbyggd AI och efterfrågeprognoser föreslår när och hur mycket som behöver beställas baserat på historisk försäljning, säsongsvariation och aktuell lagernivå.\n\nGodsmottagning och utleveranser: Hela flödet från inleverans till utleverans — registrera godsmottagning mot inköpsorder, genomför kvalitetskontroller, generera plocklistor och fraktsedlar automatiskt.\n\nFlera lagerplatser och lagerstrukturer: Hantera centrallager, regionala lager eller komplexa lagerupplägg med zoner och hyllplatser.\n\nIntegration med transportlösningar: Via AppSource kan ni integrera med transportbolag som PostNord och nShift.\n\nMontering och enkel produktion: Stöd för monteringsorder — perfekt för företag som sätter ihop produkter från komponenter.`,
      },
      {
        question: "Hur fungerar försäljning och CRM i Business Central?",
        answer: `Business Central innehåller inbyggd CRM-funktionalitet och ett komplett flöde för försäljning — från den första kontakten med en prospekt till att fakturan är betald.\n\nKontakt- och kundhantering: Registrera alla kontakter och koppla dem till kunder, leverantörer och affärsmöjligheter. Samlad bild av köphistorik, öppna ordrar och utestående betalningar.\n\nOffert och orderflöde: Skapa offerter, konvertera till ordrar och följ hela vägen till leverans och fakturering. Prissättning, rabatter och betalningsvillkor per kund eller kundgrupp.\n\nMarknadsföring och kampanjer: Segmentera kundbasen, skapa kampanjer och följ upp aktiviteter med registrering av interaktioner.\n\nRealtidsinsikter: Dashboard med nyckeltal per säljare — öppna ordrar, vunna affärer, utestående offerter och prognoser med Power BI-integration.\n\nIntegration med Outlook och Teams: Hantera kundkommunikation direkt från e-postklienten utan att logga in separat.\n\nSkalbar CRM: Kan kombineras med Dynamics 365 Sales för mer avancerad leadhantering, pipeline-styrning eller marknadsautomatisering.`,
      },
      {
        question: "Hur fungerar produktion i Business Central?",
        answer: `Business Central erbjuder en komplett uppsättning produktionsfunktioner som täcker hela tillverkningscykeln.\n\nProduktstruktur och stycklistor: Stycklistor (BOM) definierar vilka material och komponenter som ingår i varje produkt. Stöd för flera nivåer av stycklistor för komplexa sammansatta produkter.\n\nProduktionsplanering och kapacitetsstyrning: Schemalägga produktionsordrar baserat på tillgänglig maskin- och personalkapacitet, med hänsyn till ledtider och kapacitetsbegränsningar.\n\nProduktionsordrar och utförande: Från planeringsförslaget skapas produktionsordrar. Operatörer registrerar förbrukning av material och tid direkt mot ordern i realtid.\n\nKostnadskalkylering: Beräkna produktionskostnad baserat på materialåtgång, maskintid och direkt lön. Jämför faktisk kostnad mot standardkostnad.\n\nMontering vid beställning (ATO): Flexibelt monteringsflöde direkt kopplat till försäljningsordern med varianter och tillval.\n\nSpårbarhet och kvalitet: Serie- och partinummer genom hela tillverkningskedjan för kvalitetskontroll och spårbarhetskrav.`,
      },
      {
        question: "Hur fungerar inköp och leverantörsstyrning i Business Central?",
        answer: `Business Central ger inköpsavdelningen kraftfulla verktyg för att hantera hela flödet från behovsidentifiering till leverantörsbetalning.\n\nLeverantörsregister och avtalshantering: All leverantörsinformation på ett ställe — kontaktuppgifter, betalningsvillkor, valuta, prisavtal och köphistorik med automatiska leverantörsspecifika priser och rabatter.\n\nInköpsförslag och behovsstyrning: Automatiska inköpsförslag baserade på lagernivåer, försäljningsprognoser och minimigränser. Konvertera till inköpsorder med ett knapptryck.\n\nInköpsorder och godsmottagning: Skapas och skickas direkt till leverantören. Vid godsmottagning matchas leveransen mot ordern med hantering av avvikelser.\n\nElektronisk fakturahantering: Via tillägg som Continia Document Capture — ta emot och tolka e-faktura, PDF eller skannade dokument och matcha automatiskt mot inköpsorder.\n\nÅterkommande inköp: Sätt upp återkommande inköpsrader för förbrukningsmaterial, tjänster och abonnemang.\n\nInköpsanalys: Full insyn i inköpshistorik, ledtider och prisutveckling per leverantör.`,
      },
      {
        question: "Hur fungerar projekthantering i Business Central?",
        answer: `Business Central har en dedikerad projektmodul som täcker hela projektlivscykeln — perfekt för konsultfirmor, bygg- och anläggningsbolag, ingenjörsföretag och IT-bolag.\n\nProjektstruktur och budgetering: Varje projekt har sin egen struktur med faser, aktiviteter och resurser. Budget för tid och material sätts upp i planeringsfasen.\n\nTidrapportering och resursplanering: Konsulter rapporterar tid direkt per projekt och aktivitet. Systemet visar resursbelastning och tillgänglighet.\n\nPIA och projektredovisning: Stöd för pågående arbeten (PIA) enligt K3 och IFRS 15 med automatisk beräkning av intäktsperiodisering baserat på färdigställandegrad.\n\nUtfall mot budget: Realtidsvy över hur projektet förhåller sig till budget — för tid, material och övriga kostnader.\n\nFakturering av projekt: Fast pris, löpande räkning och milstolpefakturering. Fakturor kopplas automatiskt till redovisningen.\n\nIntegration med Microsoft 365: Registrera tid och följ upp via Teams och mobilappar utan att logga in i affärssystemet.`,
      },
      {
        question: "Hur fungerar AI och Copilot i Business Central?",
        answer: `Microsoft har integrerat AI djupt i Business Central via Copilot-teknik, och det förändrar hur användarna arbetar med allt från ordrar till lagerstyrning.\n\nVad är Copilot? Microsofts AI-assistent inbyggd direkt i Business Central som hjälper användare utföra uppgifter snabbare, generera innehåll automatiskt och fatta bättre beslut baserat på data.\n\nAutomatisering av försäljningsordrar: Copilot tolkar inkommande e-post med beställningsinformation och föreslår automatiskt en försäljningsorder med rätt artiklar, kvantiteter och priser.\n\nAI-genererade produkttexter: Automatiskt genererade beskrivande produkttexter baserade på artikelns egenskaper och attribut — perfekt för e-handel.\n\nSmarta lagerprognoser: AI-drivna efterfrågeprognoser analyserar historisk försäljningsdata och räknar fram optimala påfyllningsnivåer.\n\nAutomatisering av leverantörsreskontra: Copilot matchar inkommande leverantörsfakturor mot inköpsorder och flaggar avvikelser.\n\nKontinuerlig AI-utveckling: Microsoft lanserar nya AI-funktioner varje halvår som ni får tillgång till automatiskt utan uppgradering.`,
      },
      {
        question: "Hur fungerar licensmodellen för Business Central?",
        answer: `Microsoft erbjuder flera licensnivåer anpassade för olika roller och behov inom organisationen.\n\nEssential (764,70 kr/användare/månad): Grundlicensen för fullständiga användare — ekonomi, försäljning, inköp, lager, projekthantering, bank och CRM. Passar ekonomer, inköpare, lagermedarbetare och säljare.\n\nPremium (1 051,40 kr/användare/månad): Allt i Essential plus produktion (produktionsordrar, kapacitetsplanering, kostnadskalkylering) och servicehantering (serviceordrar, avtal, garantihantering). Relevant för tillverkande företag och serviceorganisationer.\n\nTeam Member (76,50 kr/användare/månad): Begränsad licens för att läsa information, delta i godkännandeflöden och göra enklare registreringar. Kostnadseffektiv för chefer och tidrapporterande medarbetare.\n\nDevice-licens: Kopplas till en specifik enhet (t.ex. lagerterminal) snarare än en namngiven användare. Flera medarbetare kan dela enheten.\n\nPrissätts som prenumeration per användare och månad — inga stora investeringar upp front, och ni kan enkelt skala upp eller ned.`,
      },
      {
        question: "Hur väljer man Business Central-partner i Sverige?",
        answer: `Valet av implementeringspartner är minst lika viktigt som valet av system — en erfaren partner ser till att implementeringen lyckas och att ni får värde långsiktigt.\n\nVad gör en partner? Business Central säljs och implementeras via Microsofts partnernätverk. En certifierad partner hjälper med behovsanalys, implementering, datamigration, integration, utbildning, support och vidareutveckling.\n\nCertifieringar: Välj en partner som är Microsoft Solutions Partner for Business Applications med dokumenterad erfarenhet i er bransch.\n\nBranschkunnande: En partner som förstår er bransch — handel, tillverkning, tjänster, distribution — kan identifiera bästa praxis och undvika onödiga anpassningar.\n\nLeveransmodell: Fråga hur partnern genomför implementeringen — gärna agil metod med insyn och kontroll. Klargör fast pris eller löpande räkning.\n\nStöd efter go-live: Förvaltning, support och löpande vidareutveckling. Fråga om svarstider och SLA-nivåer.\n\nReferences: Prata med befintliga kunder som liknar er verksamhet för bästa bilden av vad ni kan förvänta er.`,
      },
    ],
  },
  {
    product: "Finance & SCM",
    description: "Fördjupning i Dynamics 365 Finance och Supply Chain Management för medelstora och stora organisationer.",
    items: [],
  },
  {
    product: "Sales",
    description: "Vanliga frågor om Dynamics 365 Sales – CRM-funktionalitet, licenser och integrationer.",
    items: [
      {
        question: "Vad är Microsoft Dynamics 365 Sales?",
        answer: `Dynamics 365 Sales är Microsofts CRM-lösning för säljorganisationer. Systemet hjälper säljteam att hantera leads, affärsmöjligheter, kontakter, konton och pipeline i ett samlat gränssnitt — med djup integration mot Outlook, Teams, Excel och LinkedIn Sales Navigator.\n\nKärnfunktioner: Lead- och opportunityhantering, pipeline-styrning, prognoser, offert- och orderhantering, aktivitetsuppföljning, kund- och kontaktregister samt rapportering via inbyggda dashboards och Power BI.\n\nMålgrupp: Allt från små säljteam (5–10 säljare) upp till globala säljorganisationer med tusentals användare. Konfigurerbart utan kod via Power Platform.\n\nIntegration: Sömlös koppling till Microsoft 365, Teams (mötesinsikter), LinkedIn Sales Navigator (för social selling) och Business Central eller Finance & SCM för helhetsflöde från lead till faktura.`,
      },
      {
        question: "Vad kostar Dynamics 365 Sales – pris per användare?",
        answer: `Dynamics 365 Sales finns i tre licensnivåer:\n\nSales Professional: ca 615 kr/användare/månad — grundläggande CRM med kontakter, konton, leads, opportunities och offerthantering. Passar mindre säljteam som behöver standardfunktionalitet.\n\nSales Enterprise: ca 1 020 kr/användare/månad — full CRM med avancerad pipeline-styrning, prognoser, anpassningsbara processer, säljspel och Copilot AI inkluderat.\n\nSales Premium: ca 1 450 kr/användare/månad — Sales Enterprise plus avancerade AI-funktioner som relationsinsikter, förutsägande lead- och opportunityscoring samt samtalsanalys.\n\nUtöver licens tillkommer implementeringskostnad — räkna med 200 000–800 000 kr för en standardimplementation beroende på integrationsbehov och anpassningar.`,
      },
      {
        question: "Hur fungerar Copilot AI i Dynamics 365 Sales?",
        answer: `Microsoft Copilot är inbyggt i Sales Enterprise och Premium utan extra licensavgift och förändrar säljarens vardag på flera sätt.\n\nMötessammanfattningar: Copilot lyssnar på Teams-möten, sammanfattar diskussionen, identifierar action items och uppdaterar CRM automatiskt med nästa steg.\n\nE-postutkast: Generera personliga uppföljningsmejl baserade på opportunityns kontext — Copilot drar in relevant information om kund, produkt och tidigare kommunikation.\n\nLeadprioritering: AI-driven scoring rankar leads och opportunities efter sannolikhet att stänga, så säljaren fokuserar på rätt affärer.\n\nKontoinsikter: Copilot sammanfattar kundens hela historik — möten, mejl, ärenden, ordrar — på sekunder inför ett kundmöte.\n\nSamtalsanalys: Premium-licensen analyserar säljsamtal, identifierar lyckade beteenden och ger coaching till hela teamet.`,
      },
      {
        question: "Hur skiljer sig Dynamics 365 Sales från Salesforce och HubSpot?",
        answer: `Båda är ledande CRM-plattformar, men det finns viktiga skillnader att överväga.\n\nMicrosoft-integration: Dynamics 365 Sales är djupt integrerat med Microsoft 365 — Outlook, Teams, Excel och SharePoint fungerar nativt. Salesforce kräver tilläggslicenser och tredjepartskonnektorer.\n\nLicenspris: Sales Enterprise (ca 1 020 kr/mån) är ofta 30–40 % billigare än Salesforce Sales Cloud Enterprise (motsvarande nivå). HubSpot Sales Hub Professional ligger i samma prisklass men har mindre djup för komplexa B2B-processer.\n\nAI-funktioner: Copilot ingår i Sales Enterprise utan extra kostnad. Salesforce Einstein och HubSpot Breeze är ofta tilläggslicenser.\n\nERP-koppling: D365 Sales integreras sömlöst med Business Central och Finance & SCM för komplett lead-till-cash-flöde — något varken Salesforce eller HubSpot kan leverera utan komplexa integrationer.\n\nFlexibilitet: Power Platform gör det enklare och billigare att anpassa D365 utan kod jämfört med Apex/Lightning på Salesforce.`,
      },
      {
        question: "Hur lång tid tar en implementation av Dynamics 365 Sales?",
        answer: `Tidsåtgången beror på komplexitet, men följande riktvärden gäller för svenska implementationer:\n\nStartpaket (5–15 säljare): 6–10 veckor för standardprocesser, datamigration från befintligt system, integration mot Outlook och utbildning. Pris ca 200 000–400 000 kr.\n\nMedelstor implementation (15–50 säljare): 3–5 månader med anpassade säljprocesser, integration mot ERP eller marketingsystem, dashboards och rapporter. Pris ca 400 000–800 000 kr.\n\nStor implementation (50+ säljare, flera länder): 6–12 månader med globala säljprocesser, flera språk, komplexa integrationer, prognosmodeller och Copilot Premium-funktioner. Pris från 800 000 kr.\n\nFramgångsfaktorer: Engagerad sponsor i ledningen, en stark intern projektledare, tydligt definierade säljprocesser från början och realistisk plan för datamigration. Välj en partner med dokumenterad CRM-erfarenhet.`,
      },
    ],
  },
  {
    product: "Customer Insights",
    description: "Frågor och svar om Dynamics 365 Customer Insights (Marketing) – kampanjer, segmentering och priser.",
    items: [],
  },
  {
    product: "Customer Service",
    description: "Fördjupning i Dynamics 365 Customer Service – ärendehantering, kunskapsbas och licensmodeller.",
    items: [],
  },
  {
    product: "Field Service",
    description: "Allt om Dynamics 365 Field Service – fältservicehantering, schemaläggning och mobilitet.",
    items: [],
  },
  {
    product: "Contact Center",
    description: "Frågor och svar om Dynamics 365 Contact Center – omnikanal, röst och AI-stöd.",
    items: [],
  },
];
