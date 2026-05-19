import { ReactNode } from "react";
import { Link } from "react-router-dom";
import bcOverviewImg from "@/assets/images/business-central-overview.png";
import valjaPartnerImg from "@/assets/articles/valja-partner-overview.jpg";
import ekonomiImg from "@/assets/articles/ekonomi-overview.png";
import lagerImg from "@/assets/articles/lager-overview.jpg";
import forsaljningImg from "@/assets/articles/forsaljning-overview.jpg";
import produktionImg from "@/assets/articles/produktion-overview.jpg";
import inkopImg from "@/assets/articles/inkop-overview.jpg";
import projektImg from "@/assets/articles/projekt-overview.jpg";
import aiCopilotImg from "@/assets/articles/ai-copilot-overview.jpg";
import licenserImg from "@/assets/articles/licenser-overview.jpg";

export interface DeepDiveArticle {
  slug: string;
  title: string;
  description: string;
  product: string;
  productSlug: string;
  parentPath: string;
  parentLabel: string;
  headerLabel?: string;
  image?: string;
  bannerImage?: string;
  content: ReactNode;
}

export const BC_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "introduktion",
    headerLabel: "BC – Introduktion",
    title: "Vad är Microsoft Dynamics 365 Business Central?",
    description: "En introduktion till ett av Sveriges populäraste affärssystem för SMB.",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
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
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Business Central samlar alla affärsprocesser runt en gemensam kärna.
          </figcaption>
        </figure>
        <p>
          <strong>En komplett introduktion till Sveriges populäraste affärssystem för små och medelstora företag.</strong> Microsoft Dynamics 365 Business Central är ett molnbaserat affärssystem (ERP) utvecklat för att ge små och medelstora företag full kontroll över sin verksamhet — från ekonomi och inköp till lager, produktion och försäljning. Det är en modern efterföljare till det välkända Dynamics NAV (Navision) och ingår i Microsofts breda Dynamics 365-svit.
        </p>

        <h2>Varför väljer svenska företag Business Central?</h2>
        <p>
          Business Central är idag ett av de snabbast växande affärssystemen i Sverige. Varje dag implementerar ett antal svenska företag Business Central som sin primära affärsplattform. Systemet kombinerar bred funktionalitet med en bekant Microsoft-miljö och integrerar sömlöst med verktyg som Outlook, Excel, Teams och Power BI som många medarbetare redan använder dagligen. Globalt förlitar sig över 50 000 företag i mer än 170 länder på Business Central.
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
          Systemet passar företag med ungefär 10–500 anställda som vill ha ett professionellt affärssystem utan den komplexitet som traditionella enterprise-lösningar medför. Det är flexibelt nog för de flesta branscher — handel, tillverkning, tjänster och distribution. Business Central implementeras av certifierade Microsoft-partners i Sverige. Du hittar mer information och kan hitta en passande partner här: <Link to="/businesscentral/" className="text-primary underline hover:text-primary/80">Business Central pris – Licenser &amp; partners | d365.se</Link>
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Business Central?</h3>
          <p className="text-muted-foreground mb-4">Kontakta oss för en kostnadsfri genomgång av hur Business Central kan passa din verksamhet.</p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett kostnadsfritt rådgivningsmöte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "ekonomi-redovisning",
    title: "Business Central för ekonomi och redovisning",
    description: "Så ger Business Central din ekonomiavdelning full kontroll — i realtid",
    headerLabel: "Ekonomi & redovisning",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: ekonomiImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={ekonomiImg}
            alt="Ekonomimodulen i Business Central: Redovisning, Kundreskontra, Leverantörsreskontra, Bankintegration, Kassaflöde, Dimensioner, Konsolidering och Power BI"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Ekonomimodulen täcker hela flödet — från transaktion till beslutsunderlag.
          </figcaption>
        </figure>

        <p>
          <strong>Så ger Business Central din ekonomiavdelning full kontroll — i realtid.</strong> För många företag är ekonomiavdelningen hjärtat i verksamheten. Microsoft Dynamics 365 Business Central är byggt med ekonomifunktioner i centrum och ger ekonomiteamet kraftfulla verktyg för att arbeta effektivt, träffsäkert och i realtid.
        </p>

        <h2>Redovisning och bokföring</h2>
        <p>
          Business Central hanterar hela redovisningscykeln — från dagliga transaktioner och periodisering till månads- och årsbokslut. Du kan sätta upp kontoplaner, kostnadsdimensioner och bokföringsmallar som speglar exakt hur din verksamhet är organiserad. Systemet stöder automatisk kontering, vilket minskar manuella fel och sparar tid.
        </p>

        <h2>Kund- och leverantörsreskontra</h2>
        <p>
          Hantera fakturor, betalningar och påminnelser i ett sammanhängande flöde. Business Central kan automatisera stora delar av fakturaprocessen — från att skicka kundpåminnelser till att matcha inkommande bankbetalningar mot öppna poster.
        </p>

        <h2>Kassaflöde och likviditetsstyrning</h2>
        <p>
          Med den inbyggda kassaflödesprognosen kan ekonomichefen se kommande in- och utbetalningar och planera likviditeten proaktivt. Systemet samlar data från försäljning, inköp och lager för att ge en realistisk bild av det framtida kassaflödet.
        </p>

        <h2>Koncernkonsolidering</h2>
        <p>
          Har ni flera bolag? Business Central stöder koncernkonsolidering, där dotterbolag och intressebolag sammanfogas i en gemensam finansiell rapport. Ni sätter upp ett separat konsolideringsbolag och kan hämta in data från övriga bolag automatiskt.
        </p>

        <h2>Dimensioner och rapportering</h2>
        <p>
          En av systemets styrkor är möjligheten att analysera data i flera dimensioner — till exempel avdelning, projekt, kostnadsställe eller geografi. Med Excel-integrationen och Power BI skapar ni skräddarsydda rapporter som uppdateras i realtid.
        </p>

        <h2>Regelefterlevnad och revision</h2>
        <p>
          Business Central uppfyller svenska bokföringskrav och stöder momshantering, SIE-export och elektroniska fakturaformat. Systemets revisionslogg ger full spårbarhet för alla transaktioner, vilket förenklar internrevision och externa granskningar.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Få kontroll över er ekonomi</h3>
          <p className="text-muted-foreground mb-4">
            Vi hjälper er att komma igång — från implementation till löpande support.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "lager-logistik",
    title: "Lager och logistik i Business Central",
    description: "Optimera din lagerhantering och minska kostnaderna med smarta verktyg",
    headerLabel: "Lager & logistik",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: lagerImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={lagerImg}
            alt="Lager- och logistikflöde i Business Central: Inleverans, Lagerstyrning med zoner och AI-prognos, Utleverans"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Hela flödet från leverantör till kund i ett system.
          </figcaption>
        </figure>

        <p>
          <strong>Optimera din lagerhantering och minska kostnaderna med smarta verktyg.</strong> Effektiv lagerhantering är avgörande för lönsamheten — för mycket lager binder kapital, för lite leder till förlorad försäljning. Microsoft Dynamics 365 Business Central ger dig precis rätt verktyg för att hitta den optimala balansen.
        </p>

        <h2>Lagerstyrning i realtid</h2>
        <p>
          Business Central ger dig alltid en aktuell bild av lagernivåerna, oavsett om du har ett eller flera lagerställen. Du kan spåra artiklar med serie- eller partinummer, hantera olika lagerplatser och se exakt var varje artikel befinner sig i kedjan.
        </p>

        <h2>Automatisk påfyllning med AI-stöd</h2>
        <p>
          Med inbyggd AI och efterfrågeprognoser kan Business Central föreslå när och hur mycket som behöver beställas hem — baserat på historisk försäljning, säsongsvariation och aktuell lagernivå. Det eliminerar gissningar och minskar risken för både överlager och brist.
        </p>

        <h2>Godsmottagning och utleveranser</h2>
        <p>
          Systemet hanterar hela flödet från inleverans till utleverans. Ni kan registrera godsmottagning mot inköpsorder, genomföra kvalitetskontroller och märka upp artiklar. Vid utleverans genereras plocklistor, fraktsedlar och leveransdokument automatiskt.
        </p>

        <h2>Flera lagerplatser och lagerstrukturer</h2>
        <p>
          Oavsett om ni har ett centrallager, flera regionala lager eller ett komplext lagerupplägg med zoner och hyllplatser — Business Central hanterar det. Ni kan konfigurera lagerstrukturen exakt som ert fysiska lager ser ut och styra plockordning efter era egna regler.
        </p>

        <h2>Integration med transportlösningar</h2>
        <p>
          Via tillägg i AppSource kan Business Central integreras med transportbolag som PostNord och nShift, vilket gör det möjligt att skapa fraktavier, boka upphämtning och spåra försändelser direkt från affärssystemet.
        </p>

        <h2>Montering och enkel produktion</h2>
        <p>
          Business Central stöder monteringsorder — perfekt för företag som sätter ihop produkter från komponenter. Systemet håller koll på materialåtgång och kostnad per monteringsorder.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Optimera ert lager med Business Central</h3>
          <p className="text-muted-foreground mb-4">
            Vi hjälper er att sätta upp en lösning som passar era flöden — från dag ett.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "forsaljning-crm",
    title: "Försäljning och CRM i Business Central",
    description: "Från offert till betalad faktura — hela säljprocessen i ett system",
    headerLabel: "Försäljning & CRM",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: forsaljningImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={forsaljningImg}
            alt="Säljprocessen i Business Central: Kontakt, Offert, Order, Leverans, Faktura med Outlook-integration, Kampanjer och Power BI"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Hela säljflödet hanteras i ett och samma system.
          </figcaption>
        </figure>

        <p>
          <strong>Från offert till betalad faktura — hela säljprocessen i ett system.</strong> Att ha full koll på säljprocesser och kundrelationer är avgörande för tillväxt. Microsoft Dynamics 365 Business Central innehåller inbyggd CRM-funktionalitet och ett komplett flöde för försäljning — från den första kontakten med en prospekt till att fakturan är betald.
        </p>

        <h2>Kontakt- och kundhantering</h2>
        <p>
          I Business Central registrerar du alla dina kontakter och kopplar dem till kunder, leverantörer och affärsmöjligheter. Du får en samlad bild av varje kunds köphistorik, öppna ordrar och utestående betalningar direkt på kundkortet.
        </p>

        <h2>Offert och orderflöde</h2>
        <p>
          Säljarna kan enkelt skapa offerter, konvertera dem till ordrar och följa dem hela vägen till leverans och fakturering — utan att behöva byta system. Prissättning, rabatter och betalningsvillkor hanteras per kund eller kundgrupp.
        </p>

        <h2>Marknadsföring och kampanjer</h2>
        <p>
          Business Central har stöd för att segmentera din kundbas, skapa kampanjer och följa upp aktiviteter. Du kan registrera interaktioner — samtal, möten, e-post — direkt kopplade till kontakter och affärsmöjligheter.
        </p>

        <h2>Realtidsinsikter för säljaren</h2>
        <p>
          Varje säljare har tillgång till sin egen dashboard med nyckeltal — öppna ordrar, vunna affärer, utestående offerter och prognoser. Med Power BI-integrationen kan dessa insikter visualiseras i interaktiva rapporter.
        </p>

        <h2>Integration med Outlook och Teams</h2>
        <p>
          Tack vare den inbyggda Outlook-integrationen kan säljarna hantera kundkommunikation direkt från sin e-postklient. E-posthistorik, offerter och ordrar syns direkt i Outlook-vyn utan att behöva logga in i affärssystemet separat.
        </p>

        <h2>Skalbar CRM-funktionalitet</h2>
        <p>
          Behöver ni mer avancerad CRM — leadhantering, pipeline-styrning eller marknadsautomatisering — kan Business Central kombineras med Dynamics 365 Sales för ett komplett säljstödsystem.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Stärk er säljprocess</h3>
          <p className="text-muted-foreground mb-4">
            Se hur Business Central kan hjälpa ert säljteam att arbeta smartare och stänga fler affärer.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "produktion",
    title: "Produktion i Business Central",
    description: "Styr din tillverkning med full kontroll — från produktionsorder till färdig produkt",
    headerLabel: "Produktion",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: produktionImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={produktionImg}
            alt="Produktionscykel i Business Central: Stycklistor, Kapacitetsplanering, Produktionsorder, Materialåtgång, Spårbarhet, Kostnadskalkyl"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Tre parallella spår: planering, utförande och kostnad.
          </figcaption>
        </figure>

        <p>
          <strong>Styr din tillverkning med full kontroll — från produktionsorder till färdig produkt.</strong> För tillverkande företag är förmågan att planera, genomföra och följa upp produktionen avgörande. Microsoft Dynamics 365 Business Central erbjuder en komplett uppsättning produktionsfunktioner som täcker hela tillverkningscykeln.
        </p>

        <h2>Produktstruktur och stycklistor</h2>
        <p>
          Grundstenen i produktionsmodulen är stycklistorna (BOM – Bill of Materials). Här definierar ni exakt vilka material och komponenter som ingår i varje produkt, i vilka mängder och i vilken ordning. Business Central stöder flera nivåer av stycklistor — perfekt för komplexa sammansatta produkter.
        </p>

        <h2>Produktionsplanering och kapacitetsstyrning</h2>
        <p>
          Med inbyggda planeringsverktyg kan ni schemalägga produktionsordrar baserat på tillgänglig maskin- och personalkapacitet. Systemet tar hänsyn till ledtider, kapacitetsbegränsningar och befintliga ordrar för att optimera produktionsflödet.
        </p>

        <h2>Produktionsordrar och utförande</h2>
        <p>
          Från planeringsförslaget skapas produktionsordrar som styr det dagliga arbetet i produktionen. Operatörer kan registrera förbrukning av material och tid direkt mot ordern, vilket ger en realtidsbild av produktionsstatus och materialåtgång.
        </p>

        <h2>Kostnadskalkylering</h2>
        <p>
          Business Central beräknar produktionskostnaden baserat på materialåtgång, maskintid och direkt lön. Ni kan jämföra faktisk kostnad mot standardkostnad och analysera avvikelser — ett viktigt verktyg för att förbättra lönsamheten.
        </p>

        <h2>Montering vid beställning</h2>
        <p>
          För företag som anpassar produkter efter kundorder (ATO – Assemble to Order) stöder Business Central ett flexibelt monteringsflöde direkt kopplat till försäljningsordern. Kunden kan välja varianter och tillval, och monteringsorder skapas automatiskt.
        </p>

        <h2>Spårbarhet och kvalitet</h2>
        <p>
          Med stöd för serie- och partinummer kan ni spåra enskilda artiklar och råvarupartier genom hela tillverkningskedjan — viktigt för kvalitetskontroll, återkallelser och spårbarhetskrav i reglerade branscher.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Effektivisera er produktion</h3>
          <p className="text-muted-foreground mb-4">
            Låt oss visa hur Business Central passar ert tillverkningsflöde.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "inkop-leverantorer",
    title: "Inköp och leverantörsstyrning i Business Central",
    description: "Effektivisera inköpsprocessen och stärk relationen med dina leverantörer",
    headerLabel: "Inköp & leverantörsstyrning",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: inkopImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={inkopImg}
            alt="Inköpsflöde i Business Central: Behov, Inköpsförslag, Inköpsorder, Godsmottagning, Betalning med E-faktura och Leverantörsanalys"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Inköpsflödet från behov till betalad leverantör.
          </figcaption>
        </figure>

        <p>
          <strong>Effektivisera inköpsprocessen och stärk relationen med dina leverantörer.</strong> En välskött inköpsprocess sparar pengar, säkrar leveranser och stärker leverantörsrelationerna. Microsoft Dynamics 365 Business Central ger inköpsavdelningen kraftfulla verktyg för att hantera hela flödet från behovsidentifiering till leverantörsbetalning.
        </p>

        <h2>Leverantörsregister och avtalshantering</h2>
        <p>
          I Business Central samlar ni all leverantörsinformation på ett ställe — kontaktuppgifter, betalningsvillkor, valuta, prisavtal och köphistorik. Ni kan sätta upp leverantörsspecifika priser och rabatter som tillämpas automatiskt vid beställning.
        </p>

        <h2>Inköpsförslag och behovsstyrning</h2>
        <p>
          Systemet genererar automatiska inköpsförslag baserade på aktuella lagernivåer, försäljningsprognoser och minimigränser. Inköparen granskar förslaget, justerar vid behov och konverterar till inköpsorder med ett knapptryck — utan manuell beräkning.
        </p>

        <h2>Inköpsorder och godsmottagning</h2>
        <p>
          Inköpsorder skapas och skickas direkt till leverantören från Business Central. Vid godsmottagning matchas leveransen mot ordern, och systemet hanterar avvikelser i kvantitet eller pris, vilket möjliggör exakt lagervärdering och korrekt leverantörsskuld.
        </p>

        <h2>Elektronisk fakturahantering</h2>
        <p>
          Via tillägg som Continia Document Capture kan Business Central ta emot och tolka elektroniska leverantörsfakturor (e-faktura, PDF eller skannade dokument) och automatiskt matcha dem mot inköpsorder och godsmottagning — vilket radikalt minskar manuellt arbete och fel.
        </p>

        <h2>Återkommande inköp</h2>
        <p>
          För artiklar som köps regelbundet kan ni sätta upp återkommande inköpsrader, vilket förenklar processen för inköp av förbrukningsmaterial, tjänster och abonnemang.
        </p>

        <h2>Inköpsanalys och leverantörsutvärdering</h2>
        <p>
          Business Central ger full insyn i inköpshistorik, ledtider och prisutveckling per leverantör. Det ger ett bra underlag för leverantörsutvärderingar och prisförhandlingar.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Effektivisera ert inköp</h3>
          <p className="text-muted-foreground mb-4">
            Se hur Business Central kan automatisera er inköpsprocess från behov till betalning.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "projekthantering",
    title: "Projekthantering i Business Central",
    description: "Styr projekt lönsamt från start till faktura",
    headerLabel: "Projekthantering",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: projektImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={projektImg}
            alt="Projektets livscykel i Business Central: Planering, Utförande, Uppföljning och Fakturering med Teams och mobilapp"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Projektets livscykel — från planering till faktura.
          </figcaption>
        </figure>

        <p>
          <strong>Styr projekt lönsamt från start till faktura.</strong> Projektbaserade företag — konsultfirmor, bygg- och anläggningsbolag, ingenjörsföretag och IT-bolag — har särskilda krav på sina affärssystem. Microsoft Dynamics 365 Business Central har en dedikerad projektmodul som täcker hela projektlivscykeln.
        </p>

        <h2>Projektstruktur och budgetering</h2>
        <p>
          Varje projekt i Business Central har sin egen struktur med faser, aktiviteter och resurser. Ni sätter upp budget för tid och material redan i planeringsfasen, vilket skapar en tydlig basplan att följa upp mot under projektets gång.
        </p>

        <h2>Tidrapportering och resursplanering</h2>
        <p>
          Konsulter och projektmedarbetare rapporterar tid direkt i Business Central — per projekt och aktivitet. Systemet visar resursbelastning och tillgänglighet, vilket underlättar planeringen av nästa projekt och förhindrar överbookning.
        </p>

        <h2>PIA och projektredovisning</h2>
        <p>
          Business Central stöder pågående arbeten (PIA), vilket är avgörande för att redovisa projektintäkter korrekt enligt K3 och IFRS 15. Systemet beräknar automatiskt hur mycket av ett projekts intäkter som ska periodiseras baserat på färdigställandegrad.
        </p>

        <h2>Utfall mot budget</h2>
        <p>
          Projektledaren har alltid tillgång till en realtidsvy över hur projektet förhåller sig till budget — för tid, material och övriga kostnader. Avvikelser identifieras tidigt, vilket ger möjlighet att korrigera kursen innan kostnaderna skenar.
        </p>

        <h2>Fakturering av projekt</h2>
        <p>
          Business Central stöder olika faktureringsmodeller: fast pris, löpande räkning och milstolpefakturering. Fakturor skapas direkt från projektet och kopplas automatiskt till redovisningen.
        </p>

        <h2>Integration med Microsoft 365</h2>
        <p>
          Projektteamet kan registrera tid och följa upp projekt via Teams och mobilappar, utan att behöva logga in i affärssystemet på en stationär dator. Det ökar följsamheten i tidrapportering och håller projektstatus uppdaterat i realtid.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Driv era projekt mer lönsamt</h3>
          <p className="text-muted-foreground mb-4">
            Vi hjälper er att konfigurera Business Central för era unika projektflöden.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "ai-copilot",
    title: "Business Central och AI — Copilot i affärssystemet",
    description: "Hur artificiell intelligens gör Business Central smartare varje dag",
    headerLabel: "AI & Copilot",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: aiCopilotImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={aiCopilotImg}
            alt="Copilot i Business Central: Orderhantering, Produkttexter, Lagerprognoser, Leverantörsfaktura, Datainsikter och Ny funktionalitet"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Copilot i centrum — sex konkreta användningsområden.
          </figcaption>
        </figure>

        <p>
          <strong>Hur artificiell intelligens gör Business Central smartare varje dag.</strong> Artificiell intelligens är inte längre framtidsmusik i affärssystem — det är verklighet. Microsoft har integrerat AI djupt i Dynamics 365 Business Central via sin Copilot-teknik, och det förändrar hur användarna arbetar med allt från ordrar till lagerstyrning.
        </p>

        <h2>Vad är Copilot i Business Central?</h2>
        <p>
          Copilot är Microsofts AI-assistent som är inbyggd direkt i Business Central. Den kan hjälpa användare att utföra uppgifter snabbare, generera innehåll automatiskt och fatta bättre beslut baserat på data — allt utan att lämna affärssystemet.
        </p>

        <h2>Automatisering av försäljningsordrar</h2>
        <p>
          En av de mest efterfrågade Copilot-funktionerna är automatisk orderhantering. Copilot kan tolka en inkommande e-post med beställningsinformation och automatiskt föreslå en försäljningsorder med rätt artiklar, kvantiteter och priser — vilket sparar säljaren ett betydande handpåläggning.
        </p>

        <h2>AI-genererade produkttexter</h2>
        <p>
          Business Central kan med hjälp av AI automatiskt generera beskrivande produkttexter baserade på artikelns egenskaper och attribut. Perfekt för företag som säljer via e-handel och behöver hålla produktinformation aktuell och välskriven.
        </p>

        <h2>Smarta lagerprognoser</h2>
        <p>
          Med AI-drivna efterfrågeprognoser analyserar Business Central historisk försäljningsdata och räknar fram när och hur mycket av varje artikel som behöver fyllas på. Det minskar risken för brist och överlager, och optimerar det bundna kapitalet i lagret.
        </p>

        <h2>Automatisering av leverantörsreskontra</h2>
        <p>
          Copilot kan matcha inkommande leverantörsfakturor mot inköpsorder och godsmottagning automatiskt — och flagga avvikelser för manuell hantering. Det frigör tid för ekonomiavdelningen och minskar risken för felaktiga betalningar.
        </p>

        <h2>Kontinuerlig AI-utveckling</h2>
        <p>
          Microsoft investerar kraftigt i att utöka Copilots kapabilitet i Business Central. Varje halvår lanseras nya AI-funktioner, och eftersom systemet är molnbaserat får ni tillgång till dem automatiskt utan uppgradering. Er investering i Business Central är alltid framåtblickande.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Utnyttja AI i ert affärssystem</h3>
          <p className="text-muted-foreground mb-4">
            Låt oss visa hur Copilot kan automatisera era vardagsrutiner i Business Central.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "licenser-priser",
    title: "Licensmodellen för Business Central — Essential, Premium och Team Member",
    description: "Förstå hur licenserna fungerar och välj rätt nivå för din verksamhet",
    headerLabel: "Licensmodellen",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: licenserImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={licenserImg}
            alt="Licensmodellen i Business Central: Team Member, Essential, Premium och Device — från enklare roll till fler funktioner"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            De fyra licensnivåerna — välj rätt för varje användare.
          </figcaption>
        </figure>

        <p>
          <strong>Förstå hur licenserna fungerar och välj rätt nivå för din verksamhet.</strong> En vanlig fråga för företag som överväger Business Central är: vilken licens behöver vi? Microsoft erbjuder flera licensnivåer anpassade för olika roller och behov inom organisationen.
        </p>

        <h2>Essential-licensen</h2>
        <p>
          Essential är grundlicensen för fullständiga användare och inkluderar kärnfunktionalitet för de flesta verksamheter: ekonomihantering och redovisning, försäljning och orderhantering, inköp och leverantörsreskontra, lagerhantering och logistik, grundläggande projekthantering, bankhantering och kassaflöde samt CRM-funktionalitet. Essential passar de flesta medarbetare som arbetar aktivt i affärssystemet — ekonomer, inköpare, lagermedarbetare och säljare.
        </p>

        <h2>Premium-licensen</h2>
        <p>
          Premium inkluderar allt i Essential plus de mer avancerade modulerna för produktion (produktionsordrar, kapacitetsplanering och kostnadskalkylering) och servicehantering (serviceordrar, avtal och garantihantering). Premium-licensen är relevant för tillverkande företag och serviceorganisationer med behov av dessa specifika moduler.
        </p>

        <h2>Team Member-licensen</h2>
        <p>
          Team Member är en begränsad licens för användare som behöver läsa information, delta i godkännandeflöden och göra enklare registreringar — men inte arbeta aktivt i systemet. Det är en kostnadseffektiv lösning för exempelvis chefer som godkänner inköp eller anställda som rapporterar tid.
        </p>

        <h2>Device-licensen</h2>
        <p>
          Device-licensen kopplas till en specifik enhet (till exempel en terminal i lagret) snarare än en namngiven användare. Flera medarbetare kan dela enheten och ändå ha tillgång till systemets Essential-funktionalitet.
        </p>

        <h2>Prismodellen</h2>
        <p>
          Business Central prissätts som en prenumeration per användare och månad. Det innebär inga stora investeringar i licenser upp front, och ni kan enkelt skala upp eller ned i takt med att verksamheten förändras. Era Microsoft-licenser samlas i ett och samma avtal via er Business Central-partner.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Osäker på vilken licens ni behöver?</h3>
          <p className="text-muted-foreground mb-4">
            Vi hjälper er att hitta den optimala licensmixen för er organisation.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "valja-partner",
    title: "Att välja Business Central-partner i Sverige — vad ska man tänka på?",
    description: "Rätt partner är lika viktig som rätt system",
    headerLabel: "Att välja partner",
    product: "Business Central",
    productSlug: "business-central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    image: valjaPartnerImg,
    content: (
      <>
        <figure className="my-8">
          <img
            src={valjaPartnerImg}
            alt="Att välja partner — sex kriterier att bedöma: Support efter go-live, Referenser, Geografisk närvaro, Certifiering, Branschkunnande och Leveransmodell"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            Att välja partner — vad ska man bedöma?
          </figcaption>
        </figure>

        <p>
          <em>Sex kriterier att bedöma när du väljer partner.</em>
        </p>

        <p>
          <strong>Rätt partner är lika viktig som rätt system.</strong> Att välja Microsoft Dynamics 365 Business Central som affärssystem är ett klokt beslut för många svenska företag. Men valet av implementeringspartner är minst lika viktigt — kanske viktigare. En erfaren och engagerad partner ser till att implementeringen lyckas, att systemet anpassas efter era unika behov och att ni får värde av er investering långsiktigt.
        </p>

        <h2>Vad gör en Business Central-partner?</h2>
        <p>
          Business Central säljs och implementeras uteslutande via Microsofts partnernätverk. En certifierad partner hjälper er med behovsanalys och kravspecifikation, implementering, konfiguration och datamigration, integration mot befintliga system, utbildning av användare, löpande support och förvaltning samt uppgraderingar och vidareutveckling.
        </p>

        <h2>Certifieringar och erfarenhet</h2>
        <p>
          Välj en partner som är certifierad Microsoft Solutions Partner for Business Applications och som har dokumenterad erfarenhet av Business Central-implementeringar i er bransch. Certifieringen garanterar att partnern uppfyller Microsofts krav på kompetens och kundnöjdhet.
        </p>

        <h2>Branschkunnande</h2>
        <p>
          En partner som förstår er bransch — handel, tillverkning, tjänster, distribution — kan hjälpa er att identifiera bästa praxis och undvika onödiga anpassningar. Branscherfarenhet innebär kortare projekttid och bättre resultat.
        </p>

        <h2>Leveransmodell</h2>
        <p>
          Fråga hur partnern genomför implementeringen. Bra partners har en tydlig och beprövad metod — gärna agil — som ger er insyn och kontroll under hela projektet. Fråga om de erbjuder fast pris eller löpande räkning, och vad som händer om projektet drar ut på tiden.
        </p>

        <h2>Stöd efter go-live</h2>
        <p>
          Implementeringen är bara början. Välj en partner som erbjuder förvaltning, support och löpande vidareutveckling av er lösning. Fråga om svarstider, SLA-nivåer och om supporten är lokalt förankrad i Sverige.
        </p>

        <h2>Be om referenser</h2>
        <p>
          Be om att få prata med befintliga kunder som liknar er verksamhet. Det ger den bästa bilden av vad ni kan förvänta er — hur partnern hanterar utmaningar, håller tidplaner och kommunicerar under projektet.
        </p>

        <h2>Svenska partners med stark kompetens</h2>
        <p>
          Sverige har ett antal välrenommerade Business Central-partners. Sök gärna partners i Business Central-menyn{" "}
          <Link to="/valj-partner/" className="text-primary hover:underline">här</Link>.
        </p>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Är vi rätt partner för er?</h3>
          <p className="text-muted-foreground mb-4">
            Ta ett förutsättningslöst möte med oss och se om vi är rätt match för er verksamhet.
          </p>
          <p>
            <Link to="/kontakt/" className="font-semibold text-primary hover:underline">
              Boka ett möte → d365.se/kontakt
            </Link>
          </p>
        </div>
      </>
    ),
  },
];

import { FSC_ARTICLES } from "./fscArticles";
import { SALES_ARTICLES } from "./salesArticles";
import { CI_ARTICLES } from "./ciArticles";
import { CS_ARTICLES } from "./csArticles";
import { CC_ARTICLES } from "./ccArticles";
import { FS_ARTICLES } from "./fsArticles";
import { COPILOT_ARTICLES } from "./copilotArticles";
import { AGENTS_ARTICLES } from "./agentsArticles";

// All deep-dive articles across products
export const ALL_DEEP_DIVE_ARTICLES: DeepDiveArticle[] = [
  ...BC_ARTICLES,
  ...FSC_ARTICLES,
  ...SALES_ARTICLES,
  ...CI_ARTICLES,
  ...CS_ARTICLES,
  ...CC_ARTICLES,
  ...FS_ARTICLES,
  ...COPILOT_ARTICLES,
  ...AGENTS_ARTICLES,
];
