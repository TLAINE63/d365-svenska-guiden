import { DeepDiveArticle } from "./bcArticles";
import SalesIcon from "@/assets/icons/Sales.svg";
import sales01Img from "@/assets/articles/sales-01-pipeline.png";
import sales02Img from "@/assets/articles/sales-02-leadscoring.png";
import sales03Img from "@/assets/articles/sales-03-offert.png";
import sales04Img from "@/assets/articles/sales-04-coaching.png";
import sales05Img from "@/assets/articles/sales-05-prognoser.png";
import sales06Img from "@/assets/articles/sales-06-konto.png";
import sales07Img from "@/assets/articles/sales-07-mobil.png";
import sales08Img from "@/assets/articles/sales-08-linkedin.png";
import sales09Img from "@/assets/articles/sales-09-kanal.png";
import sales10Img from "@/assets/articles/sales-10-analytik.png";

export const SALES_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "saljpipelinen-som-aldrig-sover",
    title: "Säljpipelinen som aldrig sover",
    description: "Realtidsöversikt och AI-drivna nästa steg i varje affär med Dynamics 365 Sales.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Pipeline-hantering",
    image: sales01Img,
    content: (
      <>
        <p>
          <em>
            En välskött pipeline är grunden för förutsägbar tillväxt. Dynamics 365 Sales ger säljchefer 
            och säljare en gemensam sanningskälla med AI-prioriterade leads och automatiserade uppföljningar 
            — så att ingen affär faller mellan stolarna.
          </em>
        </p>

        <h2>Pipeline-hantering i realtid</h2>
        <p>
          Dynamics 365 Sales samlar alla affärsmöjligheter i en strukturerad pipeline med anpassade säljsteg. 
          Säljchefer ser i realtid var varje affär befinner sig, sannolikheten för avslut och det prognostiserade 
          värdet — utan att behöva fråga säljarna.
        </p>
        <p>
          Visuella vyer gör det enkelt att identifiera flaskhalsar och stagnerade affärer. Drag-and-drop 
          mellan säljsteg uppdaterar automatiskt prognoser och aktivitetsplaner.
        </p>

        <h2>Copilot och AI-prioritering</h2>
        <p>
          Sales Copilot analyserar e-post, möten och aktivitetshistorik för att identifiera vilka affärer 
          som behöver omedelbar uppmärksamhet. AI-modellen beräknar win probability baserat på hundratals 
          signaler och föreslår konkreta nästa steg för varje affärsmöjlighet.
        </p>
        <p>
          Resultatet är att säljare spenderar sin tid på de affärer som har störst potential — 
          inte de som råkar vara senast uppdaterade.
        </p>

        <h2>Aktivitetsautomation och sekvenser</h2>
        <p>
          Säljsekvenser automatiserar uppföljningsprocessen: rätt e-post, samtal eller LinkedIn-meddelande 
          vid rätt tidpunkt — utan att säljaren behöver komma ihåg.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Inbyggd integration med Outlook och Teams</li>
          <li>LinkedIn Sales Navigator-koppling</li>
          <li>Automatiska påminnelser vid inaktivitet</li>
          <li>Aktivitetsinloggning via röst och mobil</li>
        </ul>
      </>
    ),
  },
  {
    slug: "prediktiv-leadscoring-med-ai",
    title: "Prediktiv lead-scoring med AI",
    description: "Fokusera säljarnas tid på de leads som faktiskt konverterar med AI-driven scoring.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Lead-scoring",
    image: sales02Img,
    content: (
      <>
        <p>
          <em>
            Säljteam drunknar ofta i leads utan tydlig prioritering. AI-driven lead scoring i 
            Dynamics 365 Sales analyserar hundratals beteendesignaler och historiska mönster 
            för att ranka varje lead — så säljaren vet exakt var de ska börja.
          </em>
        </p>

        <h2>Hur lead scoring fungerar</h2>
        <p>
          Modellen tränas automatiskt på din organisations historiska data — vilka leads som 
          konverterade, vilka som inte gjorde det, och vilka attribut som skilde dem åt.
        </p>
        <p>
          Poängen uppdateras i realtid när ny information tillkommer. Det innebär att ett lead 
          som plötsligt börjar besöka prissidan eller ladda ned en whitepaper omedelbart 
          stiger i prioritet.
        </p>

        <h2>Beteendesignaler och firmografik</h2>
        <p>
          Systemet väger samman en bred uppsättning faktorer för att skapa en sammansatt poäng 
          med tydlig förklaring av varje bidragande faktor.
        </p>
        <p>
          Exempel på signaler som påverkar poängen inkluderar webbplatsbesök, e-postöppningar, 
          formulärifyllningar, LinkedIn-aktivitet, företagsstorlek, bransch och tillväxttakt.
        </p>

        <h2>Segmentering och routning</h2>
        <p>
          Högt scorade leads kan automatiskt tilldelas rätt säljare baserat på territorium, 
          branschspecialisering eller kapacitet. Det säkerställer snabb responstid på de 
          viktigaste affärsmöjligheterna.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Automatisk lead-routning med Round Robin eller territoriumregler</li>
          <li>Notifikation till säljare vid plötslig score-ökning</li>
          <li>A/B-testning av scoringmodeller</li>
          <li>Integration med Marketing för nurture-program</li>
        </ul>
      </>
    ),
  },
  {
    slug: "offertsystemet-som-vinner-affarer",
    title: "Offertsystemet som vinner affärer",
    description: "CPQ-funktionalitet och dynamiska prismodeller direkt i CRM.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – CPQ & Offerter",
    image: sales03Img,
    content: (
      <>
        <p>
          <em>
            Komplexa produktkonfigurationer och prisregler saktar ned säljprocessen och skapar fel. 
            Med Configure-Price-Quote i Dynamics 365 Sales kan säljare skapa felfria, varumärkesprofilerade 
            offerter på minuter — direkt från affärsmöjligheten.
          </em>
        </p>

        <h2>Produktkatalog och konfigurationsregler</h2>
        <p>
          Produktkatalogen definierar tillåtna kombinationer, obligatoriska tillval och beroenden. 
          Systemet guidar säljaren genom konfigurationen steg för steg och förhindrar ogiltiga kombinationer.
        </p>
        <p>
          Det innebär att inga felaktiga order skickas till leverans, och att säljaren kan fokusera 
          på kundrelationen istället för att dubbelkolla tekniska specifikationer.
        </p>

        <h2>Dynamisk prissättning och godkännandeflöden</h2>
        <p>
          Prisregler, rabattnivåer och prissättningshierarkier konfigureras centralt. Säljare ser 
          alltid rätt pris baserat på kundavtal, volymer och kampanjer.
        </p>
        <p>
          Offerter som överstiger säljarnivåns mandat dirigeras automatiskt till rätt godkännare 
          innan de skickas till kunden — inga manuella eskaleringar behövs.
        </p>

        <h2>Digital offert och e-signering</h2>
        <p>
          Offerter genereras som professionella PDF-dokument eller interaktiva webbofferter. 
          Kunden kan godkänna och signera digitalt, och systemet uppdaterar affärsmöjligheten automatiskt.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Versionshantering av offerter</li>
          <li>Automatisk påminnelse vid utgångsdatum</li>
          <li>Integration med Word-mallar för varumärkesprofil</li>
          <li>Koppling till ERP för lagerkontroll och leveransdatum</li>
        </ul>
      </>
    ),
  },
  {
    slug: "saljcoachning-med-konversationsanalys",
    title: "Säljcoachning med konversationsanalys",
    description: "Förvandla varje säljsamtal till ett coachningstillfälle med Conversation Intelligence.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Conversation Intelligence",
    image: sales04Img,
    content: (
      <>
        <p>
          <em>
            De bästa säljcheferna coachar baserat på fakta, inte magkänsla. Conversation Intelligence 
            i Dynamics 365 Sales transkriberar, analyserar och betygsätter varje säljsamtal — 
            och identifierar vad de bästa säljarna gör annorlunda.
          </em>
        </p>

        <h2>Automatisk transkription och analys</h2>
        <p>
          Alla säljsamtal via Teams transkriberas automatiskt med talare-identifiering. AI analyserar 
          samtalsstruktur, talets känsla, konkurrentnämnanden och kundinvändningar.
        </p>
        <p>
          Systemet identifierar även om säljaren pratade mer än kunden — en vanlig indikator 
          på att lyssningsförmågan kan förbättras.
        </p>

        <h2>Nyckelord och konkurrentinsikter</h2>
        <p>
          Chefer konfigurerar ord och fraser att övervaka — produktnamn, konkurrenter och 
          prisrelaterade fraser. Systemet visar hur ofta dessa nämns och i vilket sammanhang.
        </p>
        <p>
          Aggregerade insikter över hela säljteamet avslöjar trender som enskilda samtal 
          inte visar: ökar konkurrent X i nämnanden? Nämns prisinvändningar oftare denna månad?
        </p>

        <h2>Personlig coaching och benchmarking</h2>
        <p>
          Varje säljare får en personlig scorecard med nyckeltal jämfört mot teamet 
          och toppresterarna. Coachningen blir objektiv och datadrivet istället för subjektiv.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Talkvotsanalys (säljarens andel av samtalet)</li>
          <li>Identifiering av framgångsrika invändningshanteringar</li>
          <li>Automatisk loggning av åtaganden gjorda i samtal</li>
          <li>Integration med LinkedIn Sales Navigator</li>
        </ul>
      </>
    ),
  },
  {
    slug: "forsaljningsprognoser-och-kvothantering",
    title: "Försäljningsprognoser och kvothantering",
    description: "Förutsäg nästa kvartals intäkter med maskininlärning och AI-justerade prognoser.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Prognoser & Kvoter",
    image: sales05Img,
    content: (
      <>
        <p>
          <em>
            Manuella Excel-prognoser är opålitliga och tidskrävande. Dynamics 365 Sales 
            automatiserar prognostisering med AI som väger affärsdata, historiska mönster 
            och säljarnas egna bedömningar — för en prognos du faktiskt kan lita på.
          </em>
        </p>

        <h2>Hierarkisk prognosstruktur</h2>
        <p>
          Prognoser byggs nerifrån och upp: säljare → team → region → global. Varje nivå 
          kan justera siffror och lägga till egna bedömningar.
        </p>
        <p>
          Rollup-beräkningar sker automatiskt i realtid, vilket innebär att en uppdatering 
          på säljarnivå omedelbart reflekteras i regionchefens prognos.
        </p>

        <h2>AI-justerad prognos</h2>
        <p>
          Systemet jämför säljarnas egna bedömningar mot AI-modellens förutsägelse och 
          flaggar när de avviker markant.
        </p>
        <p>
          Chefer får insikt i om enskilda säljare tenderar att överskatta eller underskatta 
          sina affärer historiskt — en ovärderlig signal vid kvartalsslut.
        </p>

        <h2>Kvothantering och uppföljning</h2>
        <p>
          Kvoter tilldelas per säljare, produkt, region och period. Realtidsdashboard visar 
          attainment mot kvot med tydliga trafikljusindikatorer.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Scenario-analys (best case / commit / pipeline)</li>
          <li>Automatisk kvartalsrapport till ledningen</li>
          <li>Integration med Power BI för djupanalys</li>
          <li>Historisk prognosnoggrannhetsrapport per säljare</li>
        </ul>
      </>
    ),
  },
  {
    slug: "kontohantering-och-relationskartan",
    title: "Kontohantering och relationskartan",
    description: "Förstå beslutsstrukturer och bygg starka kundrelationer i komplexa B2B-affärer.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Account Management",
    image: sales06Img,
    content: (
      <>
        <p>
          <em>
            Komplexa B2B-affärer involverar flera beslutsfattare med olika roller och agenda. 
            Dynamics 365 Sales relationsverktyg hjälper säljare att kartlägga, förstå och 
            bearbeta hela köparorganisationen strategiskt.
          </em>
        </p>

        <h2>Stakeholder-kartläggning</h2>
        <p>
          Varje konto kan ha en strukturerad kontaktkarta med roller som ekonomisk beslutsfattare, 
          teknikchef och slutanvändare. Säljaren ser omedelbart vem som behöver bearbetas 
          och vem som redan är en stark förespråkare.
        </p>
        <p>
          Kartläggningen visualiseras grafiskt, vilket gör det enkelt att identifiera luckor 
          i bearbetningen — exempelvis om ingen i säljteamet har kontakt med den ekonomiska beslutsfattaren.
        </p>

        <h2>Relationship Intelligence</h2>
        <p>
          AI analyserar e-posthistorik, mötesaktivitet och LinkedIn-kopplingar för att beräkna 
          relationsstyrkan mellan säljteamet och varje kontakt.
        </p>
        <p>
          Systemet identifierar relationsrisker när aktiviteten minskar — och föreslår 
          proaktiva åtgärder innan relationen svalnar.
        </p>

        <h2>Account planning och strategiska mål</h2>
        <p>
          Strukturerade account planer med mål, initiativ och risker kopplas direkt till 
          affärsmöjligheter och aktiviteter. Hela säljteamet arbetar mot samma bild.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Automatisk varning vid nyckelpersonsbyte (LinkedIn-signal)</li>
          <li>Organisationsdiagram med beslutsstrukturer</li>
          <li>Gemensam account plan för säljteam</li>
          <li>Integration med LinkedIn Sales Navigator för nyheter</li>
        </ul>
      </>
    ),
  },
  {
    slug: "mobilt-saljstod-med-offlinekapacitet",
    title: "Mobilt säljstöd med offline-kapacitet",
    description: "Fullt CRM-stöd oavsett var säljaren befinner sig med offlinesynk och röstloggning.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Mobilt säljstöd",
    image: sales07Img,
    content: (
      <>
        <p>
          <em>
            Säljare är sällan vid skrivbordet. Dynamics 365 Sales mobilapp ger full tillgång 
            till kunddata, affärsmöjligheter och aktiviteter oavsett uppkoppling — 
            och loggningen tar sekunder, inte minuter.
          </em>
        </p>

        <h2>Offline-synkronisering och smart cache</h2>
        <p>
          Appen laddar automatiskt ned relevant kunddata, senaste aktiviteter och kommande 
          möten till enheten. Säljaren arbetar obehindrat även utan internetuppkoppling.
        </p>
        <p>
          Ändringar görs offline och synkroniseras automatiskt när uppkoppling återupprättas 
          — utan konflikter eller dubbletter.
        </p>

        <h2>Röstloggning och snabbregistrering</h2>
        <p>
          Efter ett kundmöte kan säljaren diktera en sammanfattning som transkriberas och 
          kopplas till rätt kontakt och affärsmöjlighet automatiskt.
        </p>
        <p>
          AI extraherar åtaganden från dikteringen och skapar uppföljningsaktiviteter 
          — så ingenting glöms bort på vägen tillbaka till kontoret.
        </p>

        <h2>Visitkortsskanning och kontaktskapande</h2>
        <p>
          Kameran skannar visitkort och skapar nya kontakter automatiskt med alla fält ifyllda, 
          inklusive LinkedIn-verifiering av kontaktuppgifterna.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Integrerad karta med kundbesöksplanering</li>
          <li>Push-notifikationer för prioriterade leads</li>
          <li>Snabb uppdatering av affärssteget via swipe</li>
          <li>Business card scanning med AI-extraktion</li>
        </ul>
      </>
    ),
  },
  {
    slug: "saljintegrationen-med-linkedin",
    title: "Säljintegrationen med LinkedIn",
    description: "LinkedIn Sales Navigator direkt i CRM-flödet för smartare prospektering.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – LinkedIn-integration",
    image: SalesIcon,
    content: (
      <>
        <p>
          <em>
            LinkedIn är säljares viktigaste prospekteringsverktyg. Integrationen mellan 
            Dynamics 365 Sales och LinkedIn Sales Navigator eliminerar kontextbyten och ger 
            rika kontaktinsikter direkt i CRM utan att lämna flödet.
          </em>
        </p>

        <h2>Inbyggd LinkedIn-panel i CRM</h2>
        <p>
          I varje kontakt- och leadvy visas en inbyggd LinkedIn-panel med aktuell jobbtitel, 
          bolagsinfo, gemensamma kopplingar och nyheter — utan att öppna en ny flik.
        </p>
        <p>
          Kontaktinformation hålls uppdaterad automatiskt, vilket eliminerar risken för 
          föråldrade uppgifter i CRM-systemet.
        </p>

        <h2>Smart links och icebreakers</h2>
        <p>
          AI föreslår personaliserade samtalsstartare baserade på gemensamma intressen, 
          nyheter om kontaktens bolag och delade LinkedIn-kopplingar.
        </p>
        <p>
          Rätt kontakt, rätt budskap, rätt tidpunkt — det är receptet för högre svarsfrekvens 
          och bättre första intryck.
        </p>

        <h2>TeamLink och varma introduktioner</h2>
        <p>
          TeamLink visar om någon i det egna bolaget har en relation med målkontakten — 
          och möjliggör varma introduktioner som ökar svarsfrekvensen markant jämfört med kalla utskick.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Automatisk synkronisering av kontaktdata</li>
          <li>Saved leads och account alerts från LinkedIn</li>
          <li>InMail-skickning direkt från CRM</li>
          <li>Import av LinkedIn-leads till Dynamics 365</li>
        </ul>
      </>
    ),
  },
  {
    slug: "partner-och-kanalforsaljning",
    title: "Partner- och kanalförsäljning",
    description: "Hantera återförsäljarnätverk och gemensam pipeline direkt i CRM.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Kanalförsäljning",
    image: SalesIcon,
    content: (
      <>
        <p>
          <em>
            Indirekta försäljningskanaler multiplicerar räckvidden men skapar komplexitet. 
            Dynamics 365 Sales Partner Portal ger återförsäljare ett eget CRM-gränssnitt 
            med gemensam pipeline-synlighet och lead distribution.
          </em>
        </p>

        <h2>Deal registration och lead distribution</h2>
        <p>
          Partners registrerar affärsmöjligheter direkt i portalen för att skydda sin investering. 
          Systemet validerar mot befintlig pipeline och förhindrar dubbelregistreringar.
        </p>
        <p>
          Automatiskt tilldelade stödresurser som pre-sales och demo-support säkerställer 
          att partnern har bästa möjliga förutsättningar att stänga affären.
        </p>

        <h2>Gemensam pipeline och co-selling</h2>
        <p>
          Säljchefer ser partnerns pipeline i realtid och kan stödja affärer proaktivt. 
          Co-selling möjliggörs genom delade affärsmöjligheter med tydlig rollfördelning 
          och intäktsdelning.
        </p>

        <h2>Utbildning och certifiering</h2>
        <p>
          Partnerportalen inkluderar ett LMS för produktutbildning med automatisk 
          certifieringsspårning — viktigt för att upprätthålla partnernivåer och 
          säkerställa konsekvent kvalitet i kundmöten.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>MDF (Market Development Fund) hantering</li>
          <li>Partner scorecard och nivåklassning</li>
          <li>Automatisk provisionsberäkning</li>
          <li>Integration med Microsoft Cloud-marknadsplatsen</li>
        </ul>
      </>
    ),
  },
  {
    slug: "saljanalytik-och-revenue-intelligence",
    title: "Säljanalytik och Revenue Intelligence",
    description: "Databaserad försäljningsstrategi med inbyggd BI och Power BI-integration.",
    product: "Dynamics 365 Sales",
    productSlug: "d365-sales",
    parentPath: "/d365-sales/",
    parentLabel: "Dynamics 365 Sales",
    headerLabel: "Sales – Revenue Intelligence",
    image: SalesIcon,
    content: (
      <>
        <p>
          <em>
            Data utan insikter är bara brus. Revenue Intelligence i Dynamics 365 Sales förvandlar 
            CRM-data till handlingsbara insikter om vad som driver tillväxt — och var det 
            finns risker i pipeline.
          </em>
        </p>

        <h2>Inbyggda försäljningsdashboards</h2>
        <p>
          Standarddashboards täcker pipeline-hälsa, aktivitetsnivåer, win/loss-analys, 
          genomsnittlig affärsstorlek och säljcykellängd.
        </p>
        <p>
          Alla mätvärden bryts ned per säljare, team, produkt och tidsperiod — 
          vilket ger chefer möjlighet att snabbt identifiera var insatser behövs.
        </p>

        <h2>Win/loss-analys och konkurrensintelligens</h2>
        <p>
          Systemet analyserar förlorade affärer och identifierar mönster: förlorades 
          affärer mot en viss konkurrent, i en viss bransch, eller vid en viss affärsstorlek?
        </p>
        <p>
          Dessa insikter driver produktstrategi och säljträning — och hjälper teamet 
          att undvika samma misstag nästa gång.
        </p>

        <h2>Power BI och anpassad analytik</h2>
        <p>
          Dynamics 365 Sales innehåller inbyggda Power BI-rapporter och en semantisk 
          modell för att bygga egna dashboards utan dataexport. För organisationer som 
          vill gå djupare finns full integration med Power BI Desktop.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Cohort-analys av leadkvalitet per källa</li>
          <li>Prognostiserad intäkt per produkt och region</li>
          <li>Aktivitetseffektivitetsanalys</li>
          <li>Exportfunktion till Excel och Power BI Desktop</li>
        </ul>
      </>
    ),
  },
];
