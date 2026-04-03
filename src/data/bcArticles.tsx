import { ReactNode } from "react";
import bcOverviewImg from "@/assets/images/business-central-overview.png";

export interface DeepDiveArticle {
  slug: string;
  title: string;
  description: string;
  product: string;
  productSlug: string;
  parentPath: string;
  parentLabel: string;
  image?: string;
  content: ReactNode;
}

export const BC_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "introduktion",
    title: "Vad är Microsoft Dynamics 365 Business Central?",
    description: "En introduktion till ett av Sveriges populäraste affärssystem för SMB.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    image: bcOverviewImg,
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <figure className="my-6">
          <img
            src={bcOverviewImg}
            alt="Översikt över Business Central-moduler: Ekonomi, Försäljning, Inköp, Lager, Produktion, Projekt, Service och Rapportering"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            Business Central samlar alla affärsprocesser runt en gemensam kärna.
          </figcaption>
        </figure>
        <p>
          En introduktion till ett av Sveriges populäraste affärssystem för SMB. Microsoft Dynamics 365 Business Central är ett molnbaserat affärssystem (ERP) utvecklat för att ge små och medelstora företag full kontroll över sin verksamhet — från ekonomi och inköp till lager, produktion och försäljning. Det är en modern efterföljare till det välkända Dynamics NAV (Navision) och ingår i Microsofts breda Dynamics 365-svit.
        </p>

        <h2>Varför väljer svenska företag Business Central?</h2>
        <p>
          Business Central är idag ett av de snabbast växande affärssystemen i Sverige. Varje dag implementerar ett antal svenska företag Business Central som sin primära affärsplattform. Systemet kombinerar bred funktionalitet med en bekant Microsoft-miljö och integrerar sömlöst med verktyg som Outlook, Excel, Teams och Power BI som många medarbetare redan använder dagligen. Globalt förlitar sig över 130 000 företag i mer än 40 länder på Business Central.
        </p>

        <h2>Vad ingår i Business Central?</h2>
        <ul>
          <li><strong>Ekonomi och redovisning</strong> – Kassa, bank, kund- och leverantörsreskontra, kostnadsredovisning och kassaflöde.</li>
          <li><strong>Inköp och leverantörskedja</strong> – Orderbearbetning, inköpsförslag och lagerkalkyler.</li>
          <li><strong>Försäljning och kundhantering</strong> – Offerter, ordrar, prissättning och CRM-funktioner.</li>
          <li><strong>Lager och logistik</strong> – Godshantering, lagerjournaler och montering.</li>
          <li><strong>Produktion</strong> – Produktionsplanering, kapacitetsstyrning och kostnadskalkylering.</li>
          <li><strong>Projekt</strong> – Tidrapportering, resursplanering och utfallsanalys mot budget.</li>
          <li><strong>Service</strong> – Serviceordrar, prishantering och avtalshantering.</li>
          <li><strong>Rapportering och BI</strong> – Realtidsinsikter och integration med Power BI.</li>
        </ul>

        <h2>Molnbaserat och alltid uppdaterat</h2>
        <p>
          Business Central levereras som molntjänst (SaaS) via Microsoft Azure — ni har alltid tillgång till de senaste funktionerna utan kostsamma uppgraderingsprojekt. Microsoft släpper löpande uppdateringar med nya funktioner och AI-drivna verktyg som Copilot.
        </p>

        <h2>För vem passar Business Central?</h2>
        <p>
          Systemet passar företag med ungefär 10–500 anställda som vill ha ett professionellt affärssystem utan den komplexitet som traditionella enterprise-lösningar medför. Det är flexibelt nog för de flesta branscher — handel, tillverkning, tjänster och distribution. Business Central implementeras av certifierade Microsoft-partners i Sverige.
        </p>
      </>
    ),
  },
  {
    slug: "ekonomi-redovisning",
    title: "Ekonomi och redovisning i Business Central",
    description: "Hur hanterar Business Central bokföring, reskontra, kassaflöde och koncernkonsolidering?",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>
          Business Central är byggt med ekonomifunktioner i centrum och ger ekonomiteamet kraftfulla verktyg för att arbeta effektivt, träffsäkert och i realtid.
        </p>

        <h2>Redovisning och bokföring</h2>
        <p>
          Systemet hanterar hela redovisningscykeln — från dagliga transaktioner och periodisering till månads- och årsbokslut. Du kan sätta upp kontoplaner, kostnadsdimensioner och bokföringsmallar. Systemet stöder automatisk kontering.
        </p>

        <h2>Kund- och leverantörsreskontra</h2>
        <p>
          Hantera fakturor, betalningar och påminnelser i ett sammanhängande flöde med automatisering av fakturaprocessen.
        </p>

        <h2>Kassaflöde och likviditetsstyrning</h2>
        <p>
          Den inbyggda kassaflödesprognosen samlar data från försäljning, inköp och lager för att ge en realistisk bild av det framtida kassaflödet.
        </p>

        <h2>Koncernkonsolidering</h2>
        <p>
          Stöd för att sammanfoga dotterbolag och intressebolag i gemensam finansiell rapport.
        </p>

        <h2>Dimensioner och rapportering</h2>
        <p>
          Analysera data i flera dimensioner med Excel-integration och Power BI.
        </p>

        <h2>Regelefterlevnad</h2>
        <p>
          Uppfyller svenska bokföringskrav med stöd för momshantering, SIE-export och elektroniska fakturaformat.
        </p>
      </>
    ),
  },
  {
    slug: "lager-logistik",
    title: "Lager och logistik i Business Central",
    description: "Lagerstyrning, automatisk påfyllning, utleveranser och integration med transportlösningar.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>
          Business Central ger dig precis rätt verktyg för att optimera lagerhanteringen och minska kostnaderna.
        </p>
        <h2>Lagerstyrning i realtid</h2>
        <p>Alltid en aktuell bild av lagernivåerna, oavsett om du har ett eller flera lagerställen. Spåra artiklar med serie- eller partinummer och hantera olika lagerplatser.</p>
        <h2>Automatisk påfyllning med AI-stöd</h2>
        <p>Inbyggd AI och efterfrågeprognoser föreslår när och hur mycket som behöver beställas baserat på historisk försäljning, säsongsvariation och aktuell lagernivå.</p>
        <h2>Godsmottagning och utleveranser</h2>
        <p>Hela flödet från inleverans till utleverans — registrera godsmottagning mot inköpsorder, genomför kvalitetskontroller, generera plocklistor och fraktsedlar automatiskt.</p>
        <h2>Flera lagerplatser och lagerstrukturer</h2>
        <p>Hantera centrallager, regionala lager eller komplexa lagerupplägg med zoner och hyllplatser.</p>
        <h2>Integration med transportlösningar</h2>
        <p>Via AppSource kan ni integrera med transportbolag som PostNord och nShift.</p>
        <h2>Montering och enkel produktion</h2>
        <p>Stöd för monteringsorder — perfekt för företag som sätter ihop produkter från komponenter.</p>
      </>
    ),
  },
  {
    slug: "forsaljning-crm",
    title: "Försäljning och CRM i Business Central",
    description: "Kontakthantering, offertflöde, Outlook-integration och skalbar CRM-funktionalitet.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>Business Central innehåller inbyggd CRM-funktionalitet och ett komplett flöde för försäljning — från den första kontakten med en prospekt till att fakturan är betald.</p>
        <h2>Kontakt- och kundhantering</h2>
        <p>Registrera alla kontakter och koppla dem till kunder, leverantörer och affärsmöjligheter. Samlad bild av köphistorik, öppna ordrar och utestående betalningar.</p>
        <h2>Offert och orderflöde</h2>
        <p>Skapa offerter, konvertera till ordrar och följ hela vägen till leverans och fakturering. Prissättning, rabatter och betalningsvillkor per kund eller kundgrupp.</p>
        <h2>Marknadsföring och kampanjer</h2>
        <p>Segmentera kundbasen, skapa kampanjer och följ upp aktiviteter med registrering av interaktioner.</p>
        <h2>Realtidsinsikter</h2>
        <p>Dashboard med nyckeltal per säljare — öppna ordrar, vunna affärer, utestående offerter och prognoser med Power BI-integration.</p>
        <h2>Integration med Outlook och Teams</h2>
        <p>Hantera kundkommunikation direkt från e-postklienten utan att logga in separat.</p>
        <h2>Skalbar CRM</h2>
        <p>Kan kombineras med Dynamics 365 Sales för mer avancerad leadhantering, pipeline-styrning eller marknadsautomatisering.</p>
      </>
    ),
  },
  {
    slug: "produktion",
    title: "Produktion i Business Central",
    description: "Produktionsplanering, kapacitetsstyrning, kostnadskalkylering och spårbarhet.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>Business Central erbjuder en komplett uppsättning produktionsfunktioner som täcker hela tillverkningscykeln.</p>
        <h2>Produktstruktur och stycklistor</h2>
        <p>Stycklistor (BOM) definierar vilka material och komponenter som ingår i varje produkt. Stöd för flera nivåer av stycklistor för komplexa sammansatta produkter.</p>
        <h2>Produktionsplanering och kapacitetsstyrning</h2>
        <p>Schemalägga produktionsordrar baserat på tillgänglig maskin- och personalkapacitet, med hänsyn till ledtider och kapacitetsbegränsningar.</p>
        <h2>Produktionsordrar och utförande</h2>
        <p>Från planeringsförslaget skapas produktionsordrar. Operatörer registrerar förbrukning av material och tid direkt mot ordern i realtid.</p>
        <h2>Kostnadskalkylering</h2>
        <p>Beräkna produktionskostnad baserat på materialåtgång, maskintid och direkt lön. Jämför faktisk kostnad mot standardkostnad.</p>
        <h2>Montering vid beställning (ATO)</h2>
        <p>Flexibelt monteringsflöde direkt kopplat till försäljningsordern med varianter och tillval.</p>
        <h2>Spårbarhet och kvalitet</h2>
        <p>Serie- och partinummer genom hela tillverkningskedjan för kvalitetskontroll och spårbarhetskrav.</p>
      </>
    ),
  },
  {
    slug: "inkop-leverantorer",
    title: "Inköp och leverantörsstyrning i Business Central",
    description: "Inköpsförslag, e-fakturahantering, avtalshantering och leverantörsanalys.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>Business Central ger inköpsavdelningen kraftfulla verktyg för att hantera hela flödet från behovsidentifiering till leverantörsbetalning.</p>
        <h2>Leverantörsregister och avtalshantering</h2>
        <p>All leverantörsinformation på ett ställe — kontaktuppgifter, betalningsvillkor, valuta, prisavtal och köphistorik med automatiska leverantörsspecifika priser och rabatter.</p>
        <h2>Inköpsförslag och behovsstyrning</h2>
        <p>Automatiska inköpsförslag baserade på lagernivåer, försäljningsprognoser och minimigränser. Konvertera till inköpsorder med ett knapptryck.</p>
        <h2>Inköpsorder och godsmottagning</h2>
        <p>Skapas och skickas direkt till leverantören. Vid godsmottagning matchas leveransen mot ordern med hantering av avvikelser.</p>
        <h2>Elektronisk fakturahantering</h2>
        <p>Via tillägg som Continia Document Capture — ta emot och tolka e-faktura, PDF eller skannade dokument och matcha automatiskt mot inköpsorder.</p>
        <h2>Återkommande inköp</h2>
        <p>Sätt upp återkommande inköpsrader för förbrukningsmaterial, tjänster och abonnemang.</p>
        <h2>Inköpsanalys</h2>
        <p>Full insyn i inköpshistorik, ledtider och prisutveckling per leverantör.</p>
      </>
    ),
  },
  {
    slug: "projekthantering",
    title: "Projekthantering i Business Central",
    description: "Tidrapportering, resursplanering, PIA-redovisning och projektfakturering.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>Business Central har en dedikerad projektmodul som täcker hela projektlivscykeln — perfekt för konsultfirmor, bygg- och anläggningsbolag, ingenjörsföretag och IT-bolag.</p>
        <h2>Projektstruktur och budgetering</h2>
        <p>Varje projekt har sin egen struktur med faser, aktiviteter och resurser. Budget för tid och material sätts upp i planeringsfasen.</p>
        <h2>Tidrapportering och resursplanering</h2>
        <p>Konsulter rapporterar tid direkt per projekt och aktivitet. Systemet visar resursbelastning och tillgänglighet.</p>
        <h2>PIA och projektredovisning</h2>
        <p>Stöd för pågående arbeten (PIA) enligt K3 och IFRS 15 med automatisk beräkning av intäktsperiodisering baserat på färdigställandegrad.</p>
        <h2>Utfall mot budget</h2>
        <p>Realtidsvy över hur projektet förhåller sig till budget — för tid, material och övriga kostnader.</p>
        <h2>Fakturering av projekt</h2>
        <p>Fast pris, löpande räkning och milstolpefakturering. Fakturor kopplas automatiskt till redovisningen.</p>
        <h2>Integration med Microsoft 365</h2>
        <p>Registrera tid och följ upp via Teams och mobilappar utan att logga in i affärssystemet.</p>
      </>
    ),
  },
  {
    slug: "ai-copilot",
    title: "AI och Copilot i Business Central",
    description: "Automatisering, AI-genererade produkttexter, smarta lagerprognoser och fakturahantering.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>Microsoft har integrerat AI djupt i Business Central via Copilot-teknik, och det förändrar hur användarna arbetar med allt från ordrar till lagerstyrning.</p>
        <h2>Vad är Copilot?</h2>
        <p>Microsofts AI-assistent inbyggd direkt i Business Central som hjälper användare utföra uppgifter snabbare, generera innehåll automatiskt och fatta bättre beslut baserat på data.</p>
        <h2>Automatisering av försäljningsordrar</h2>
        <p>Copilot tolkar inkommande e-post med beställningsinformation och föreslår automatiskt en försäljningsorder med rätt artiklar, kvantiteter och priser.</p>
        <h2>AI-genererade produkttexter</h2>
        <p>Automatiskt genererade beskrivande produkttexter baserade på artikelns egenskaper och attribut — perfekt för e-handel.</p>
        <h2>Smarta lagerprognoser</h2>
        <p>AI-drivna efterfrågeprognoser analyserar historisk försäljningsdata och räknar fram optimala påfyllningsnivåer.</p>
        <h2>Automatisering av leverantörsreskontra</h2>
        <p>Copilot matchar inkommande leverantörsfakturor mot inköpsorder och flaggar avvikelser.</p>
        <h2>Kontinuerlig AI-utveckling</h2>
        <p>Microsoft lanserar nya AI-funktioner varje halvår som ni får tillgång till automatiskt utan uppgradering.</p>
      </>
    ),
  },
  {
    slug: "licenser-priser",
    title: "Licensmodellen för Business Central",
    description: "Essential, Premium och Team Member – priser, skillnader och vad som passar din organisation.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>Microsoft erbjuder flera licensnivåer anpassade för olika roller och behov inom organisationen.</p>
        <h2>Essential (764,70 kr/användare/månad)</h2>
        <p>Grundlicensen för fullständiga användare — ekonomi, försäljning, inköp, lager, projekthantering, bank och CRM. Passar ekonomer, inköpare, lagermedarbetare och säljare.</p>
        <h2>Premium (1 051,40 kr/användare/månad)</h2>
        <p>Allt i Essential plus produktion (produktionsordrar, kapacitetsplanering, kostnadskalkylering) och servicehantering (serviceordrar, avtal, garantihantering). Relevant för tillverkande företag och serviceorganisationer.</p>
        <h2>Team Member (76,50 kr/användare/månad)</h2>
        <p>Begränsad licens för att läsa information, delta i godkännandeflöden och göra enklare registreringar. Kostnadseffektiv för chefer och tidrapporterande medarbetare.</p>
        <h2>Device-licens</h2>
        <p>Kopplas till en specifik enhet (t.ex. lagerterminal) snarare än en namngiven användare. Flera medarbetare kan dela enheten.</p>
        <h2>Prenumerationsmodell</h2>
        <p>Prissätts som prenumeration per användare och månad — inga stora investeringar upp front, och ni kan enkelt skala upp eller ned.</p>
      </>
    ),
  },
  {
    slug: "valja-partner",
    title: "Hur väljer man Business Central-partner i Sverige?",
    description: "Certifieringar, branschkunnande, leveransmodell och vad du bör kräva av din implementeringspartner.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/business-central/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <p>Valet av implementeringspartner är minst lika viktigt som valet av system — en erfaren partner ser till att implementeringen lyckas och att ni får värde långsiktigt.</p>
        <h2>Vad gör en partner?</h2>
        <p>Business Central säljs och implementeras via Microsofts partnernätverk. En certifierad partner hjälper med behovsanalys, implementering, datamigration, integration, utbildning, support och vidareutveckling.</p>
        <h2>Certifieringar</h2>
        <p>Välj en partner som är Microsoft Solutions Partner for Business Applications med dokumenterad erfarenhet i er bransch.</p>
        <h2>Branschkunnande</h2>
        <p>En partner som förstår er bransch — handel, tillverkning, tjänster, distribution — kan identifiera bästa praxis och undvika onödiga anpassningar.</p>
        <h2>Leveransmodell</h2>
        <p>Fråga hur partnern genomför implementeringen — gärna agil metod med insyn och kontroll. Klargör fast pris eller löpande räkning.</p>
        <h2>Stöd efter go-live</h2>
        <p>Förvaltning, support och löpande vidareutveckling. Fråga om svarstider och SLA-nivåer.</p>
        <h2>Referenser</h2>
        <p>Prata med befintliga kunder som liknar er verksamhet för bästa bilden av vad ni kan förvänta er.</p>
      </>
    ),
  },
];

// All deep-dive articles across products
export const ALL_DEEP_DIVE_ARTICLES: DeepDiveArticle[] = [
  ...BC_ARTICLES,
];
