import type { ProductQACategory } from "@/components/ProductQASection";

export const PRODUCT_QA_DATA: ProductQACategory[] = [
  {
    product: "Business Central",
    description: "Vanliga frågor om Microsoft Dynamics 365 Business Central, funktioner, licenser och partnerval.",
    items: [
      {
        question: "Vad är Microsoft Dynamics 365 Business Central?",
        answer: `Microsoft\u00a0Dynamics\u00a0365 Business Central är ett molnbaserat affärssystem (ERP) för mindre och medelstora företag. Det hanterar bland annat ekonomi, inköp, lager, produktion, projekt och försäljning. Business Central är efterföljaren till Dynamics NAV, även kallat Navision, och ingår i Microsofts Dynamics\u00a0365-familj.\n\nSystemet kan kopplas till Outlook, Excel, Teams och Power BI. Vilka kopplingar och funktioner som används beror på licens, konfiguration och eventuella tillägg.\n\nBusiness Central levereras som en molntjänst via Microsoft Azure och uppdateras löpande av Microsoft. Om systemet passar beror mer på processer, krav och komplexitet än på ett bestämt antal anställda.`,
      },
      {
        question: "Hur fungerar ekonomi och redovisning i Business Central?",
        answer: `Business Central har stöd för redovisning, kund- och leverantörsreskontra, betalningar, periodisering och bokslutsarbete. Kontoplaner, dimensioner och bokföringsmallar kan anpassas efter verksamhetens rapporteringsbehov.\n\nSystemet innehåller även funktioner för kassaflödesprognoser, budget och konsolidering. Data kan analyseras i Excel och Power BI.\n\nVilka svenska lokaliseringsfunktioner som ingår, till exempel SIE och elektronisk fakturering, beror på version, konfiguration och installerade tillägg. Kontrollera därför kraven med den partner som ska införa lösningen.`,
      },
      {
        question: "Hur fungerar lager och logistik i Business Central?",
        answer: `Business Central hanterar artiklar, lagersaldon, flera lagerställen samt spårning med serie- och partinummer. Mer avancerade lagerupplägg kan använda zoner, lagerplatser, plockning och inleveransflöden.\n\nPlaneringsfunktionerna kan föreslå påfyllning utifrån bland annat efterfrågan, ledtider och lagernivåer. För transportbokning och vissa lagerfunktioner används ofta tillägg från Microsofts marknadsplats.\n\nVilket upplägg som behövs beror på antal lager, transaktionsvolym, spårbarhetskrav och kopplingar till transportörer eller andra system.`,
      },
      {
        question: "Hur fungerar försäljning och CRM i Business Central?",
        answer: `Business Central innehåller inbyggd CRM-funktionalitet och ett komplett flöde för försäljning – från den första kontakten med en prospekt till att fakturan är betald.\n\nKontakt- och kundhantering: Registrera alla kontakter och koppla dem till kunder, leverantörer och affärsmöjligheter. Samlad bild av köphistorik, öppna ordrar och utestående betalningar.\n\nOffert och orderflöde: Skapa offerter, konvertera till ordrar och följ hela vägen till leverans och fakturering. Prissättning, rabatter och betalningsvillkor per kund eller kundgrupp.\n\nMarknadsföring och kampanjer: Segmentera kundbasen, skapa kampanjer och följ upp aktiviteter med registrering av interaktioner.\n\nRealtidsinsikter: Dashboard med nyckeltal per säljare – öppna ordrar, vunna affärer, utestående offerter och prognoser med Power BI-integration.\n\nIntegration med Outlook och Teams: Hantera kundkommunikation direkt från e-postklienten utan att logga in separat.\n\nSkalbar CRM: Kan kombineras med Dynamics 365 Sales för mer avancerad leadhantering, pipeline-styrning eller marknadsautomatisering.`,
      },
      {
        question: "Hur fungerar produktion i Business Central?",
        answer: `Business Central erbjuder en komplett uppsättning produktionsfunktioner som täcker hela tillverkningscykeln.\n\nProduktstruktur och stycklistor: Stycklistor (BOM) definierar vilka material och komponenter som ingår i varje produkt. Stöd för flera nivåer av stycklistor för komplexa sammansatta produkter.\n\nProduktionsplanering och kapacitetsstyrning: Schemalägga produktionsordrar baserat på tillgänglig maskin- och personalkapacitet, med hänsyn till ledtider och kapacitetsbegränsningar.\n\nProduktionsordrar och utförande: Från planeringsförslaget skapas produktionsordrar. Operatörer registrerar förbrukning av material och tid direkt mot ordern i realtid.\n\nKostnadskalkylering: Beräkna produktionskostnad baserat på materialåtgång, maskintid och direkt lön. Jämför faktisk kostnad mot standardkostnad.\n\nMontering vid beställning (ATO): Flexibelt monteringsflöde direkt kopplat till försäljningsordern med varianter och tillval.\n\nSpårbarhet och kvalitet: Serie- och partinummer genom hela tillverkningskedjan för kvalitetskontroll och spårbarhetskrav.`,
      },
      {
        question: "Hur fungerar inköp och leverantörsstyrning i Business Central?",
        answer: `Business Central har stöd för leverantörsregister, inköpsorder, godsmottagning och leverantörsfakturor. Inköpsförslag kan tas fram utifrån lagernivåer, efterfrågan och planeringsparametrar.\n\nElektronisk fakturahantering, avtalshantering och kopplingar till externa tjänster kan kräva konfiguration eller tillägg. Kartlägg därför fakturaflöden, attestregler och integrationsbehov innan projektet avgränsas.`,
      },
      {
        question: "Hur fungerar projekthantering i Business Central?",
        answer: `Projektmodulen i Business Central har stöd för projekt, uppgifter, resurser, budget, tid och kostnader. Den kan användas för uppföljning och fakturering, till exempel löpande räkning eller andra upplägg som konfigureras i lösningen.\n\nKrav på intäktsredovisning, resursplanering, mobil tidrapportering och branschspecifika flöden behöver kontrolleras särskilt. Standardfunktionerna räcker inte för alla projektverksamheter, och tillägg kan behövas.`,
      },
      {
        question: "Hur fungerar AI och Copilot i Business Central?",
        answer: `Business Central har Copilot-funktioner som kan hjälpa till med vissa arbetsmoment, till exempel textförslag, analys och registrering av orderuppgifter. Tillgängligheten beror på version, region, språk, licens och aktiverade funktioner.\n\nAI-resultat behöver granskas av en användare. Utvärdera funktionerna mot egna data och processer innan ni räknar in tidsbesparingar i projektets business case. Microsoft ändrar funktioner och villkor löpande, så kontrollera den aktuella dokumentationen.`,
      },
      {
        question: "Hur fungerar licensmodellen för Business Central?",
        answer: `Microsoft erbjuder flera licensnivåer anpassade för olika roller och behov inom organisationen.\n\nEssential ({{price:bc-essentials:exact}}): Grundlicensen för fullständiga användare – ekonomi, försäljning, inköp, lager, projekthantering, bank och CRM. Passar ekonomer, inköpare, lagermedarbetare och säljare.\n\nPremium ({{price:bc-premium:exact}}): Allt i Essential plus produktion (produktionsordrar, kapacitetsplanering, kostnadskalkylering) och servicehantering (serviceordrar, avtal, garantihantering). Relevant för tillverkande företag och serviceorganisationer.\n\nTeam Member ({{price:bc-team-members:exact}}): Begränsad licens för att läsa information, delta i godkännandeflöden och göra enklare registreringar. Kostnadseffektiv för chefer och tidrapporterande medarbetare.\n\nDevice-licens: Kopplas till en specifik enhet (t.ex. lagerterminal) snarare än en namngiven användare. Flera medarbetare kan dela enheten.\n\nPrissätts som prenumeration per användare och månad – inga stora investeringar upp front, och du kan enkelt skala upp eller ned.`,
      },
      {
        question: "Hur väljer man Business Central-partner i Sverige?",
        answer: `Valet av implementeringspartner är minst lika viktigt som valet av system – en erfaren partner ser till att implementeringen lyckas och att du får värde långsiktigt.\n\nVad gör en partner? Business Central säljs och implementeras via Microsofts partnernätverk. En certifierad partner hjälper med behovsanalys, implementering, datamigration, integration, utbildning, support och vidareutveckling.\n\nCertifieringar: Välj en partner som är Microsoft Solutions Partner for Business Applications med dokumenterad erfarenhet i din bransch.\n\nBranschkunnande: En partner som förstår din bransch – handel, tillverkning, tjänster, distribution – kan identifiera bästa praxis och undvika onödiga anpassningar.\n\nLeveransmodell: Fråga hur partnern genomför implementeringen – gärna agil metod med insyn och kontroll. Klargör fast pris eller löpande räkning.\n\nStöd efter go-live: Förvaltning, support och löpande vidareutveckling. Fråga om svarstider och SLA-nivåer.\n\nReferences: Prata med befintliga kunder som liknar din verksamhet för bästa bilden av vad du kan förvänta dig.`,
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
        question: "Licenspriser och projektkostnader för Dynamics 365 Sales?",
        answer: `Dynamics 365 Sales finns i flera licensnivåer. Sales Professional innehåller grundläggande stöd för konton, kontakter, leads och affärsmöjligheter. Sales Enterprise och Premium innehåller fler funktioner för bland annat prognoser, analys och AI-stöd. Se Microsofts aktuella produktvillkor för vad som ingår i respektive licens.\n\nEtt införande uppskattas till cirka 100 000–1 200 000 kr. Ett avgränsat standardprojekt ligger normalt i den lägre delen, medan integrationer, datamigrering, automatisering och utrullning till flera länder ökar kostnaden.`,
      },
      {
        question: "Vilka utmaningar och risker finns med Dynamics 365 Sales?",
        answer: `De vanligaste utmaningarna vid en Sales-implementation är:\n\nLåg adoption hos säljare: Säljare prioriterar affärer framför CRM-uppdateringar. Lös genom att integrera mot Outlook och Teams så registrering sker automatiskt, samt använda Copilot för mötesanteckningar och e-postutkast.\n\nDålig datakvalitet vid migration: Dubbletter, ofullständiga kontakter och inaktuella konton från gamla system. Lös genom dataworkshop, rensning och tydliga ägaransvar innan go-live.\n\nÖveranpassning: Många bygger om standardprocesser i onödan. Håll dig till Microsofts best practice och anpassa endast där affärsvärdet är tydligt.\n\nOtydlig säljprocess: Om processen inte är definierad innan implementation blir CRM ett dyrt arkiv. Definiera stages, exit-kriterier och prognoslogik först.\n\nIntegrationskomplexitet: Kopplingar mot ERP, marketing automation och offerteringsverktyg underskattas ofta. Inkludera dem i scope från början.`,
      },
      {
        question: "Hur jämförs Dynamics 365 Sales mot Salesforce och HubSpot?",
        answer: `Dynamics 365 Sales, Salesforce och HubSpot täcker delvis samma behov, men paketering och arbetssätt skiljer sig.\n\nDynamics 365 Sales kan vara ett naturligt alternativ för organisationer som redan använder Microsoft 365, Power Platform eller ett Dynamics-baserat affärssystem. Salesforce har ett stort ekosystem och används i många komplexa CRM-miljöer. HubSpot är ofta inriktat på ett samlat flöde för marknad och försäljning.\n\nJämför inte bara listpriset. Kontrollera vilka funktioner, AI-tjänster, datamängder, integrationer och partnerinsatser som behövs i varje alternativ. Villkor och paketering ändras, så aktuella priser bör hämtas från respektive leverantör.`,
      },
      {
        question: "Vad säger recensioner och kunder om Dynamics 365 Sales?",
        answer: `Omdömen på externa recensionssidor varierar över tid och mellan olika typer av användare. Läs därför aktuella recensioner och kontrollera datum, företagsstorlek och användningsområde innan du drar slutsatser.\n\nÅterkommande positiva omdömen gäller kopplingarna till Outlook, Teams och Excel. Vanlig kritik gäller mängden inställningar, inlärningströskeln och att avancerad rapportering ofta byggs i Power BI.\n\nBe om referenser från företag med liknande säljprocess, storlek och integrationsbehov. Det ger ett bättre underlag än ett genomsnittligt betyg.`,
      },
      {
        question: "Vilka skäl finns att överväga Dynamics\u00a0365 Sales?",
        answer: `Dynamics\u00a0365 Sales kan vara relevant för organisationer som redan använder Microsoft 365 och vill koppla CRM till Outlook, Teams, Excel eller SharePoint.\n\nCopilot kan bland annat hjälpa till med mötessammanfattningar och e-postutkast. Exakt vilka funktioner som ingår beror på licens och aktuella produktvillkor.\n\nSales kan också kopplas till Business Central, Finance & Supply Chain Management och Power Platform. Värdet av dessa kopplingar beror på er befintliga miljö och hur mycket information som behöver delas mellan systemen. Jämför därför funktion, kostnad och införandebehov med de alternativ ni överväger.`,
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
    items: [
      {
        question: "Licenspriser och projektkostnader för Dynamics 365 Customer Service?",
        answer: `Customer Service Professional och Enterprise har olika omfattning för ärendehantering, kunskapsbas, automatisering och analys. Digitala kanaler och telefoni kan kräva Dynamics 365 Contact Center eller andra tillägg. Kontrollera Microsofts aktuella licensvillkor, eftersom paketeringen ändras över tid.\n\nEtt Customer Service-projekt uppskattas till cirka 150 000–1 200 000 kr. För Contact Center är motsvarande intervall cirka 250 000–2 000 000 kr. Antal kanaler, telefoni, köer, integrationer, datamigrering och krav på rapportering påverkar kostnaden.`,
      },
      {
        question: "Vilka utmaningar och risker finns med Dynamics 365 Customer Service?",
        answer: `De vanligaste utmaningarna i ett Customer Service-projekt är:\n\nFör många kanaler för snabbt: Att aktivera chatt, sociala medier, telefoni och e-post samtidigt skapar kaos. Lös genom att rulla ut kanal för kanal med mätbara mål per steg.\n\nSvag eller saknad kunskapsbas: Utan strukturerade kunskapsartiklar tappar agenterna värdet av Copilot och självbetjäning. Investera i kunskapsstrategi och artikelägarskap från start.\n\nKomplex routing och SLA-design: Köer, kompetensregler och SLA-policyer blir snabbt svåröverskådliga. Börja enkelt och iterera baserat på mätbar data.\n\nMigration av historiska ärenden: Underskattas ofta. Bestäm tidigt vad som faktiskt behöver migreras kontra arkiveras.\n\nIntegration med telefoni och CTI: Voice Channel kräver bra nätverk och tydlig plan för IVR, samtalsflöden och inspelningskrav. Boka in en pilot innan stor utrullning.\n\nAdoption av AI: Agenter litar inte alltid på Copilot-förslag. Lös genom transparenta källhänvisningar och löpande coaching.`,
      },
      {
        question: "Hur jämförs Dynamics 365 Customer Service mot ServiceNow och Zendesk?",
        answer: `Dynamics 365 Customer Service, ServiceNow CSM och Zendesk kan alla hantera kundärenden, men de har olika tyngdpunkter. Dynamics 365 kan vara relevant när kundservice ska kopplas till Microsoft 365, Power Platform eller andra Dynamics-appar. ServiceNow kan passa när kundservice ligger nära befintliga ServiceNow-processer. Zendesk används ofta för mer fokuserad ärendehantering och digital kundservice.\n\nJämför kanalstöd, telefoni, kunskapsbas, automatisering, rapportering och integrationer i det faktiska scenario ni ska införa. Kontrollera också aktuella licensvillkor för AI och omnikanal i stället för att utgå från generella prisjämförelser.`,
      },
      {
        question: "Vad säger recensioner och kunder om Dynamics 365 Customer Service?",
        answer: `Omdömen på externa recensionssidor ändras över tid och påverkas av organisationens storlek, konfiguration och användningsområde. Kontrollera därför aktuella recensioner och läs vad användarna faktiskt har utvärderat.\n\nÅterkommande teman är kopplingen till Microsofts övriga tjänster och möjligheten att samla flera serviceprocesser. Kritik handlar ofta om konfiguration, inlärning och behovet av rätt kompetens vid införandet.\n\nBe om referenser från organisationer med liknande kanalval, ärendevolym och integrationsbehov. Det ger ett mer relevant underlag än ett sammanvägt betyg.`,
      },
      {
        question: "När kan Dynamics 365 Customer Service vara ett relevant val?",
        answer: `Dynamics 365 Customer Service kan vara relevant när kundservice behöver dela kunddata och processer med Sales, Field Service, Microsoft 365 eller Power Platform. Plattformen har stöd för ärendehantering, kunskapsartiklar, köer, SLA:er och automatisering. Fler kanaler och telefoni kan kräva ytterligare licenser eller produkter.\n\nLösningen är inte automatiskt rätt för alla. Ett enklare supportbehov kan lösas med mindre omfattande verktyg, medan avancerade kontaktcenter behöver en noggrann kontroll av kanalstöd, telefoni, integrationer, säkerhet och kostnad.`,
      },
    ],
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
