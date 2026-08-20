import { ReactNode } from "react";
import IndustryPartnerListInline from "@/components/IndustryPartnerListInline";
import aiErpRiskbildHero from "@/assets/articles/ai-erp-riskbild-hero.jpg";
import partnervaletAvgorHero from "@/assets/articles/partnervalet-avgor-hero.jpg";
import ownedIntelligenceHero from "@/assets/articles/owned-intelligence-hero.jpg";
import ownedIntelligenceSkiljelinje from "@/assets/articles/owned-intelligence-skiljelinje.jpg";
import releaseWave1Hero from "@/assets/articles/d365-release-wave-1-2026-hero.jpg";
import aiSkiftetBuild2026Hero from "@/assets/articles/ai-skiftet-build-2026-hero.jpg";
import frontierFirmHero from "@/assets/articles/frontier-firm-hero.jpg";
import copilotCoworkHero from "@/assets/articles/copilot-cowork-hero.jpg";
import workIqApisHero from "@/assets/articles/work-iq-apis-hero.jpg";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelImg from "@/assets/industries/livsmedel.webp";
import grossistImg from "@/assets/industries/handel-distribution.webp";
import jordbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import byggImg from "@/assets/industries/bygg-entreprenad.webp";
import energiImg from "@/assets/industries/energi.webp";
import konsultImg from "@/assets/industries/konsultforetag.webp";
import finansImg from "@/assets/industries/finans-forsakring.webp";
import offentligImg from "@/assets/industries/offentlig-sektor.webp";
import lifeScienceImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";
import modeImg from "@/assets/industries/mode-sport-textil.webp";
import fastighetImg from "@/assets/industries/fastigheter.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";

export interface BlogArticleAuthor {
  name: string;
  role: string;
  url?: string;
}

export interface BlogArticle {
  /** URL slug (used in /artiklar/:slug) */
  slug: string;
  /** Visible title (H1) */
  title: string;
  /** SEO meta title (full <title>) */
  metaTitle: string;
  /** SEO meta description */
  metaDescription: string;
  /** Optional override för Open Graph / Twitter-titel (social delning) */
  socialTitle?: string;
  /** Optional override för Open Graph / Twitter-beskrivning (social delning) */
  socialDescription?: string;
  /** Short summary used in cards */
  summary: string;
  /** Primary category (governance, AI, ERP, CRM…) */
  category: string;
  /** Tags / topic keywords */
  tags: string[];
  /** Products this article relates to (used by Kunskapscenter filter) */
  products: string[];
  /** ISO date */
  publishedAt: string;
  /** Author block (used by schema.org Article) */
  author: BlogArticleAuthor;
  /** Cover/hero image */
  heroImage: string;
  /** Estimated reading time in minutes */
  readingTimeMinutes: number;
  /** Article body (JSX) */
  content: ReactNode;
  /** If true, lyfts som "Nytt i Kunskapscentret"-banner på startsidan */
  featured?: boolean;
  /** Big 5 FAQ – visas som fast modul längst ner i branschartiklar */
  bigFiveFaq?: { question: string; answer: string }[];
  /**
   * Aktualitetsstatus. Sätts på äldre AI/Copilot-artiklar för att markera att
   * landskapet har förändrats och länka läsaren vidare till nyare 2026-sidor.
   */
  freshness?: {
    status: "older";
    note?: string;
    newerArticles: { slug: string; label: string }[];
  };
}


const THOMAS_LAINE: BlogArticleAuthor = {
  name: "Thomas Laine",
  role: "Grundare, d365.se",
  url: "https://d365.se/om-thomas-laine/",
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "ai-sok-dynamics-365-partners",
    title: "Fem sekunder till svaret, ett år till beslutet",
    metaTitle:
      "AI-sök förändrar hur köpare hittar Dynamics 365-partners | d365.se",
    metaDescription:
      "AI-sök påverkar hur företag hittar, jämför och väljer Dynamics 365-partners. Artikeln visar varför tydliga tredjepartsbeskrivningar, nischad positionering och konkret erfarenhet av Copilot och agenter blir avgörande.",
    summary:
      "AI-sök gör att köpare formar sin bild av Dynamics 365-partners långt innan första mötet. Här är varför nischad positionering, tredjepartsbeskrivningar och konkret Copilot-erfarenhet blir viktigare än traditionell SEO.",
    category: "Strategi",
    tags: [
      "ai-sök",
      "aio",
      "geo",
      "dynamics 365-partner",
      "business central",
      "crm",
      "customer engagement",
      "power platform",
      "copilot",
      "agenter",
      "partnerprofilering",
    ],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "AI/Copilot/Agents",
    ],
    publishedAt: "2026-08-20",
    author: THOMAS_LAINE,
    heroImage: aiSokPartnersHero,
    readingTimeMinutes: 11,
    featured: true,
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] !text-foreground/85 !mb-4 !font-medium">
          Vad AI-driven sökning gör med synligheten för partners inom
          affärssystem, CRM och Copilot
        </p>

        <aside className="my-8 rounded-md border border-[#9CC2E5] bg-[#DEEBF7] px-7 py-6">
          <p className="!text-[1.05rem] !font-bold !text-[#1F4E79] !mb-2 !mt-0">
            AI-sammanfattning
          </p>
          <p className="!my-0 !text-foreground/90">
            AI-sök förändrar hur köpare hittar, jämför och förstår Dynamics
            365-partners. Den här artikeln visar varför
            tredjepartsbeskrivningar, nischad positionering och konkret
            Copilot- och agentkompetens blir viktigare än traditionell SEO när
            beslutsgrupper bygger sina shortlists.
          </p>
        </aside>

        <p>
          En köpare skriver en fråga i en AI-chatt och får ett svar på fem
          sekunder. Tre eller fyra leverantörer, en förklaring av vad som
          skiljer dem, en rekommendation om vad hon borde titta närmare på.
        </p>
        <p>
          Sedan tar projektet vid. Medianen för ERP-projekt ligger enligt
          Panorama på drygt femton månader. Ett CRM-införande går snabbare, men
          sällan under tre, och forskningen på området är obarmhärtig – en
          systematisk översikt anger att omkring 70 procent av
          CRM-implementeringarna inte når sina förväntade mål.
        </p>
        <p>
          Det är i glappet mellan de fem sekunderna och de månader som följer
          som det intressanta händer. Köparen hinner bilda sig en uppfattning,
          förankra den internt och göra den till gruppens gemensamma
          utgångspunkt – allt innan någon leverantör vet att frågan ens
          ställdes.
        </p>
        <p>
          Det här är skrivet för dem som levererar Dynamics 365 i vid mening:
          affärssystem, säljstöd, marketing automation, kundservice och det som
          nu byggs ovanpå i form av Copilot och agenter. Det finns en
          spegelbild för köparen längre ner, och den är minst lika obekväm.
        </p>

        <h2>Vad som faktiskt hänt i köpprocessen</h2>
        <p>
          G2 frågade 1 076 B2B-köpare i mars 2026 hur de gör sin research. 51
          procent inleder numera oftare i en AI-chatt än i Google. Ett år
          tidigare var siffran 29 procent. 71 procent använder en AI-chatt
          någonstans i processen.
        </p>
        <p>
          Sedan kommer siffran som brukar få det tyst i rummet:{" "}
          <strong>
            69 procent valde en annan leverantör än de först tänkt sig
          </strong>
          , efter att AI:n pekat åt annat håll. Var tredje köpte av någon de
          aldrig hört talas om innan.
        </p>
        <p>
          En reservation direkt, eftersom den påverkar hur siffrorna ska läsas.
          Många av de köpen är självbetjänade – man tecknar ett verktyg, loggar
          in och börjar använda det. Ingen partner, inget införandeprojekt,
          ingen förändringsledning. Ett Dynamics-val ser inte ut så, även om
          leveransmodellen är densamma.
        </p>
        <p>
          Skillnaden gör inte siffrorna irrelevanta. Den gör dem ojämnt
          fördelade. Den intressanta frågan är därför inte om AI påverkar, utan
          var i ett partnerlett köp den gör det.
        </p>

        <h2>Varför SEO-logiken inte överförs rakt av</h2>
        <p>
          Ett vanligt antagande är att AIO är SEO under nytt namn. Skriv bra
          innehåll, strukturera det, håll det uppdaterat, så följer synligheten
          med.
        </p>
        <p>
          Delvis stämmer det. Rankning på Google är fortfarande en av vägarna
          in i ett AI-svar. Men bara delvis.
        </p>
        <p>
          Ahrefs analyserade 75 000 varumärken för att se vilka signaler som
          hänger ihop med synlighet i AI-genererade svar:
        </p>
        <ul>
          <li>Omnämnanden av varumärket på andra sajter: 0,664</li>
          <li>Antal backlinks: 0,218</li>
          <li>Antal sidor på den egna webbplatsen: 0,17</li>
        </ul>
        <p>
          Notera vad som ligger sist. Att publicera mer på sin egen sajt har
          nästan inget samband alls med om en AI nämner en. Ahrefs är själva
          tydliga med att korrelation inte är kausalitet, och den reservationen
          är värd att ta på allvar – starka varumärken samlar både omnämnanden
          och synlighet av samma underliggande skäl.
        </p>
        <p>
          Men riktningen är svår att bortse från. Länkgrafen var Googles sätt
          att mäta förtroende. En språkmodell läser text och bygger sin bild av
          ett bolag utifrån hur andra beskriver det, inte utifrån hur bolaget
          beskriver sig självt.
        </p>

        <h2>Vad som är detsamma, oavsett område och segment</h2>

        <h3>Plattformen är välbeskriven. Partnern är det inte.</h3>
        <p>
          Fråga en AI om skillnaden mellan{" "}
          <a href="/businesscentral/">Business Central</a> och Finance &amp;
          Operations, eller mellan Sales och Customer Insights, och du får ett
          rimligt svar. Microsoft har producerat enorma textmängder, på många
          språk, under lång tid. Plattformslagret klarar sig.
        </p>
        <p>
          Fråga sedan vilken partner som passar för ett tillverkande bolag med
          120 anställda, eller vem som faktiskt kan bygga ett fungerande
          säljstöd för en organisation med både direktförsäljning och
          återförsäljarled. Där tar underlaget slut.
        </p>
        <p>
          Slå upp en genomsnittlig svensk Microsoftpartner och räkna vad som
          finns skrivet om dem av någon annan än dem själva. Ofta: en egen
          sajt, en LinkedIn-sida, kanske ett par pressnotiser om en rekrytering
          eller ett förvärv, en katalogpost hos Microsoft. Det är hela
          underlaget en modell har att arbeta med.
        </p>
        <p>
          Vilket betyder att AI-synlighet spelar större roll för en
          implementationspartner än för en produktleverantör. Systemfrågan är
          redan besvarad i modellen. Partnerfrågan är öppen – och det är där
          valet faktiskt avgörs.
        </p>

        <h3>Alla i beslutsgruppen frågar var för sig</h3>
        <p>
          Tio till tretton personer är typiskt involverade. De frågar inte
          tillsammans. Var och en ställer sina frågor privat, från sitt eget
          perspektiv och sin egen oro.
        </p>
        <p>
          Ekonomichefen frågar vad projekt av den här typen brukar kosta och
          varför de spricker. IT-chefen frågar om integrationer, arkitektur och
          inlåsning. Verksamhetschefen frågar vad som brukar gå fel vid
          driftsättning. Säljchefen frågar varför säljare slutar använda CRM
          efter ett halvår. Marknadschefen frågar hur data faktiskt flödar
          mellan marketing automation och säljsystemet. Kundservicechefen
          frågar hur ärendeflöden brukar se ut i praktiken.
        </p>
        <p>
          Skadan för en leverantör är sällan att man missar en shortlist. Det
          är att man aldrig kommer med i det interna samtalet, under de månader
          då gruppen bygger sin gemensamma bild.
        </p>

        <h3>Riskfrågorna är obesatta</h3>
        <p>
          "Vad brukar gå fel i ERP-projekt" och "varför misslyckas
          CRM-införanden" hör till de vanligaste frågorna en beslutsgrupp
          ställer. Svaren domineras av generisk misslyckandestatistik –
          budgetöverdrag, förseningar, låg adoption.
        </p>
        <p>
          Nästan ingen partner är beskriven i termer av hur de hanterar just de
          riskerna. Det är den yta där köparen är mest orolig och där det finns
          minst skrivet. För den som vill bli beskriven av tredje part är det
          den öppnaste dörren som finns.
        </p>

        <h2>Var CRM-sidan beter sig annorlunda</h2>
        <p>
          Mycket är gemensamt, men tre saker skiljer, och de pekar alla åt
          samma håll: AI-svaret väger tyngre på CRM-sidan än på ERP-sidan.
        </p>
        <p>
          För det första är beslutsvägen kortare och mindre formell. Ett
          CRM-initiativ startar ofta hos säljchefen eller marknadschefen, inte
          i en styrgrupp med upphandlingsmall. Färre formella spärrar betyder
          att det första svaret får större genomslag.
        </p>
        <p>
          För det andra är leverantörsbilden rörigare. Ett säljstöd kan
          levereras av en klassisk Microsoftpartner, av en digitalbyrå, av en
          specialist på marketing automation eller av en kombination. En modell
          som ska rekommendera "partner för Dynamics 365 Sales" har svårt att
          skilja aktörstyperna åt, eftersom få har beskrivit skillnaden i text.
        </p>
        <p>
          För det tredje är köparen själv van vid verktygen. Marknadsfunktionen
          tillhör de yrkesgrupper som snabbast tagit till sig AI-sök. De
          utvärderar er i samma verktyg de använder dagligen, och de är bättre
          än de flesta på att se när ett svar bara upprepar en
          marknadsföringstext.
        </p>

        <h3>Copilot och agenter – frågan alla ställer och ingen är beskriven i</h3>
        <p>Det här är det tydligaste exemplet på hela artikelns tes.</p>
        <p>
          Copilot och agenter är den fråga varje köpare ställer just nu.
          Samtidigt är det den yta där partnerbeskrivningarna är som mest
          utbytbara. Ungefär alla säger sig hjälpa till med Copilot. Nästan
          ingen är beskriven i termer av vad de faktiskt har satt i produktion,
          hos vilken typ av kund, med vilket resultat och vilken styrning.
        </p>
        <p>
          Det som skiljer i en AI-genererad jämförelse är precis det som
          saknas: har ni agenter i drift hos kunder, hur arbetar ni med
          datakvalitet som förutsättning snarare än efterhandskorrigering, och
          hur hjälper ni kunden bestämma vad en agent får och inte får göra.
          Det är också de frågor en påläst köpare kommer att ställa, eftersom
          de börjat dyka upp i de svar hon får. Mer om det landskapet finns i{" "}
          <a href="/ai-oversikt/">vår översikt över AI, Copilot och agenter</a>.
        </p>
        <p>
          Det finns ett andra led här som är värt att förbereda sig på. Köparna
          använder inte bara chattar. G2 rapporterar att de vanligaste
          användningsområdena för agenter i köpprocessen är att bedöma total
          ägandekostnad, bygga shortlists, göra research och utvärdera redan
          listade leverantörer. Endast en liten minoritet är beredd att låta en
          agent genomföra själva köpet.
        </p>
        <p>
          En agent klickar sig inte igenom en snygg webbplats. Den hämtar text,
          jämför påståenden mot varandra och letar efter något konkret att
          väga. Är det enda som finns om er ett antal formuleringar om
          engagemang och lång erfarenhet, blir ni svåra att placera i en
          jämförelse – inte bortvalda, bara ohanterliga.
        </p>

        <h2>Vad som skiljer mellan segmenten</h2>

        <h3>Mindre bolag: störst exponering, kortast väg</h3>
        <p>
          Här väger AI-svaret tyngst. Det finns minst intern erfarenhet att
          väga det emot, färre personer att bli oense med, och partnervalet
          görs ofta bland de namn som faktiskt dök upp.
        </p>

        <h3>Mellansegmentet: AI avgör vem som får svara</h3>
        <p>
          Här formas en riktig beslutsgrupp och ofta en formell förfrågan. AI
          avgör sällan valet, men avgör i hög grad vem som bjuds in att svara,
          eftersom longlistan byggs under den period då gruppen orienterar sig
          på egen hand.
        </p>

        <h3>Enterprise: AI påverkar karaktäriseringen, inte inbjudan</h3>
        <p>
          Formell upphandling, ofta en extern rådgivare, etablerade relationer
          och Microsofts egen säljorganisation. Vilka som kommer med styrs av
          annat. Men hur ni karaktäriseras under utvärderingen påverkas, och
          köparen kommer beväpnad med frågor som formulerats någon annanstans.
        </p>

        <h3>Branschdimensionen: där logiken vänds upp och ner</h3>
        <p>
          Traditionell sökmotoroptimering belönade bredd. Ju fler termer man
          täckte, desto mer trafik. Därför positionerar sig de flesta partners
          brett: alla branscher, alla storlekar, hela produktportföljen.
        </p>
        <p>AI inverterar det.</p>
        <p>
          En modell matchar en specifik fråga mot specifika beskrivningar. "Vi
          levererar Dynamics 365 till alla typer av verksamheter" matchar
          ingenting, eftersom det inte utesluter något. "Spårbarhet i
          livsmedelsindustrin, Business Central, bolag med 50–300 anställda"
          matchar en smal men verklig uppsättning frågor. Detsamma gäller
          CRM-sidan: "kundservice i abonnemangsaffärer med hög ärendevolym" är
          matchbart på ett sätt som "modern kundupplevelse" aldrig blir.
        </p>
        <p>
          Konsekvensen är att nischade partners har ett strukturellt övertag i
          AI-synlighet som de aldrig hade i vanlig sökmotoroptimering. Och att
          bred positionering, som var fullt rationell när köparen var en
          människa som bläddrade på en webbplats, numera kostar.
        </p>
        <p>
          Det innebär inte att man ska sluta leverera brett. Det innebär att
          man behöver bli beskriven smalt, på flera ställen, med varje nisch
          för sig. Bredd i leveransen, precision i beskrivningen.
        </p>

        <h2>Språket är både en risk och en öppning</h2>
        <p>
          Den svenska textmassan är liten. För en partner som verkar i Sverige
          betyder det att modellerna har lite att gå på, men också att
          konkurrensen om att vara den som faktiskt är beskriven är
          förhållandevis låg.
        </p>
        <p>
          Räkna samtidigt med att delar av beslutsgruppen ställer sina frågor
          på engelska. Då hamnar ni i en jämförelse där internationella aktörer
          är betydligt bättre beskrivna än ni.
        </p>

        <h2>Vad som faktiskt påverkar</h2>
        <ul>
          <li>
            Bli beskriven av andra, i text som går att citera. Inte omnämnd i
            förbifarten – beskriven: vad ni gör, för vem, med vilket resultat.
          </li>
          <li>
            Var specifik nog att kunna särskiljas. En namngiven bransch, ett
            storleksspann och en konkret processproblematik är matchbart. "Lång
            erfarenhet" är osynligt.
          </li>
          <li>
            Beskriv Copilot- och agentarbete i termer av vad som är i drift,
            inte vad som är möjligt.
          </li>
          <li>
            Låt siffror och källor finnas i själva texten. Den akademiska
            GEO-studien från Princeton, Georgia Tech och IIT Delhi fann att
            tillägg av statistik och källhänvisningar hörde till de metoder som
            höjde synligheten mest.
          </li>
          <li>
            Håll tredjepartsprofilerna levande. G2:s köpare uppger att
            citeringar från recensionssajter är den signal som gör dem tryggast
            med ett AI-svar.
          </li>
          <li>
            Var konsekvent i hur ni beskrivs. Modeller bygger sin bild genom
            upprepning. Fem olika självbeskrivningar blir till slut ingen alls.
          </li>
          <li>
            Räkna med fördröjning. Modeller tränas i cykler och omnämnanden
            behöver tid att ackumuleras.
          </li>
        </ul>

        <h2>Läs statistiken med samma skepsis som allt annat</h2>
        <p>
          Det mesta som skrivs om AIO och GEO produceras av bolag som säljer
          AIO- och GEO-tjänster. Siffrorna är ofta korrekta, men urvalet är
          sällan neutralt och slutsatsen landar påfallande ofta i att man
          behöver köpa en synlighetsplattform.
        </p>
        <p>
          Ahrefs säljer SEO-verktyg. G2 säljer synlighet på en recensionssajt.
          Det gör inte deras data ogiltig, metodiken är redovisad i båda
          fallen, men det påverkar vilka frågor som ställs och vilka som inte
          gör det.
        </p>
        <p>
          Och en nyktrande sak: att synas i ett AI-svar ger inträde, inte
          affär. G2 konstaterar att utvärderingsfasen numera är den längsta
          delen av köpresan för fyra av tio köpare. AI:n kortade vägen till
          listan. Den kortade inte vägen till beslutet – och i ett ERP- eller
          CRM-projekt är det den långa delen som avgör allt.
        </p>

        <h2>Och för köparen</h2>
        <p>
          Jag har tillbringat större delen av mitt yrkesliv på köparens sida av
          bordet, och där finns en spegelbild som är värd att se.
        </p>
        <p>
          Den lista en AI ger er när ni ber om lämpliga Dynamics-partners är
          inte en rankning av vem som är bäst. Det är en rankning av vem som är
          bäst beskriven av tredje part.
        </p>
        <p>
          I en marknad där det skrivs lite om de flesta partners är det två
          olika saker. Den partner som passar er verksamhet bäst kan mycket väl
          vara den som ingen har skrivit om.
        </p>
        <p>
          Använd AI för att bredda listan, inte för att fastställa den. Fråga
          vad rekommendationen bygger på. Och lägg märke till om svaret säger
          något konkret om partnern, eller bara upprepar deras egen
          marknadsföringstext. Det är den typen av fråga jag arbetar med på
          d365.se – bland annat i{" "}
          <a href="/valjdynamics365partner/">
            översikten över svenska Dynamics 365-partners
          </a>
          .
        </p>

        <h2>Slutsats</h2>
        <p>
          Den gamla ordningen belönade den som ägde bäst yta och täckte flest
          termer. Den nya belönar den som andra beskriver tydligast och
          smalast.
        </p>
        <p>
          Det är en obekvämare position, eftersom man inte kontrollerar den.
          Man kan bara förtjäna den, och det tar tid.
        </p>
        <p>
          Fem sekunder räcker för att bilda en uppfattning. Femton månader
          räcker för att ångra den. Det är den första sortens tid som avgör
          vilka som får chansen att bevisa något under den andra.
        </p>

        <aside className="my-10 rounded-md border border-border bg-muted/40 px-7 py-6">
          <p className="!mt-0 !mb-3 !font-semibold">
            Vill du förstå hur din partnerprofil uppfattas av AI-sök och
            beslutsfattare?
          </p>
          <p className="!my-0">
            På d365.se analyserar vi hur Dynamics 365-partners beskrivs,
            jämförs och matchas mot verkliga kundbehov – från affärssystem och
            CRM till Power Platform, Copilot och agenter. Läs mer om{" "}
            <a href="/partnerprogram/">partnerprogrammet</a>.
          </p>
        </aside>

        <h2>Källor</h2>
        <ul>
          <li>
            G2 – The Answer Economy: How AI Search Is Rewiring B2B Software
            Buying (mars 2026, 1 076 B2B-köpare).
          </li>
          <li>
            G2 – 2026 Buyer Behavior Report: The Evaluation Maze.
            Utvärderingsfasen samt agenternas användningsområden i
            köpprocessen.
          </li>
          <li>
            Ahrefs – An Analysis of AI Overview Brand Visibility Factors (75
            000 varumärken) samt uppföljningen Top Brand Visibility Factors in
            ChatGPT, AI Mode, and AI Overviews.
          </li>
          <li>
            Aggarwal m.fl. – GEO: Generative Engine Optimization (Princeton,
            Georgia Tech, IIT Delhi).
          </li>
          <li>Panorama Consulting – ERP Report, projektlängd i median.</li>
          <li>
            Farhan, Abed &amp; Abd Ellatif (2018) – A systematic review for the
            determination and classification of the CRM critical success
            factors. Future Computing and Informatics Journal.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Thomas Laine har arbetat med affärssystem och CRM i snart 40 år,
          varav de senaste knappt 30 med det som i dag är Microsoft Dynamics
          365, Power Platform och Copilot. Han driver d365.se, en guide för
          organisationer som står inför ett Dynamics 365-val.
        </p>
      </>
    ),
  },
  {
    slug: "work-iq-apis-dynamics-365",
    title:
      "Work IQ APIs: vad Microsoft egentligen bygger – och varför det spelar roll om du investerar i Dynamics 365",
    metaTitle:
      "Work IQ APIs och Dynamics 365 – vad AI-First betyder för ditt investeringsbeslut | d365.se",
    metaDescription:
      "Microsofts Work IQ APIs markerar ett skifte mot AI-First. Här är vad det betyder för dig som investerar i Dynamics 365 – från agenter och governance till Copilot Credits och partnerval.",
    summary:
      "Microsofts Work IQ APIs markerar ett viktigt steg mot AI-First: en arbetsmodell där agenter kan förstå kontext, agera över systemgränser och använda information från både Microsoft 365 och Dynamics 365. För dig som investerar i Dynamics 365 är frågan inte bara vilka funktioner som finns, utan om lösningen utvecklats för människor, agenter och nya sätt att utföra arbete.",
    category: "AI & Copilot",
    tags: [
      "work iq",
      "ai-agenter",
      "copilot",
      "microsoft",
      "dynamics365",
      "implementation",
      "governance",
      "partnerval",
    ],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Field Service",
      "AI/Copilot/Agents",
    ],
    publishedAt: "2026-06-25",
    author: THOMAS_LAINE,
    heroImage: workIqApisHero,
    readingTimeMinutes: 9,
    featured: true,
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          Microsofts Work IQ APIs markerar ett viktigt steg mot AI-First: en
          arbetsmodell där agenter kan förstå kontext, agera över systemgränser
          och använda information från både Microsoft 365 och Dynamics 365.
        </p>

        <p>
          För dig som investerar i Dynamics 365 är frågan därför inte bara
          vilka funktioner som finns, utan om lösningen utvecklats för
          människor, agenter och nya sätt att utföra arbete.
        </p>

        <h2>Vad är Work IQ?</h2>
        <p>
          Work IQ är ett intelligenslager i Microsoft 365 som löpande bygger
          upp en semantisk förståelse för hur arbetet faktiskt går till i din
          organisation.
        </p>
        <p>Detta lager:</p>
        <ul>
          <li>kopplar samman signaler från Microsoft 365</li>
          <li>skapar sammanhang över system och människor</li>
          <li>gör kontext tillgänglig för AI-agenter via API</li>
        </ul>

        <h2>Vad förändras med AI-First?</h2>
        <p>
          <strong>Traditionellt:</strong>
        </p>
        <ul>
          <li>användare arbetar i system</li>
          <li>processer är manuella</li>
          <li>systemet reagerar på input</li>
        </ul>
        <p>
          <strong>Med Work IQ:</strong>
        </p>
        <ul>
          <li>agenter kan agera i system</li>
          <li>beslut baseras på kontext från hela organisationen</li>
          <li>
            arbete kan utföras med minimal manuell hantering (beroende på
            governance)
          </li>
        </ul>
        <p>
          Detta är vad Microsoft menar med AI-First: inte AI som en enskild
          funktion, utan AI som en ny arbetsmodell.
        </p>

        <h2>Kopplingen till Dynamics 365</h2>
        <p>Work IQ gör det möjligt att kombinera:</p>
        <ul>
          <li>kunddata från Dynamics 365</li>
          <li>kommunikation från Outlook</li>
          <li>samarbete i Teams</li>
        </ul>
        <p>
          <strong>Exempel:</strong> En agent kan läsa kundhistorik i Dynamics
          365, analysera e-posttrådar, identifiera rätt kontakt internt och
          driva ett ärende vidare. Detta är infrastrukturen som nu etableras.
        </p>

        <h2>Vad det innebär för dig som investerar i Dynamics 365</h2>
        <p>Om du planerar att investera i Dynamics 365 bör du utvärdera:</p>
        <ul>
          <li>Om lösningen designas för agenter – inte bara användare</li>
          <li>Om partnern har kompetens inom Work IQ och Copilot</li>
          <li>Hur datastyrning och governance hanteras</li>
          <li>Hur M365 och D365 kopplas samman</li>
          <li>Hur Copilot Credits påverkar kostnadsbilden</li>
        </ul>

        <h2>Sammanfattning</h2>
        <p>
          <strong>Rekommendation:</strong> Välj en partner som redan tänker i
          agenter – inte bara i användare.
        </p>

        <h2>Work IQ vs traditionell Dynamics 365-implementation</h2>
        <p>
          Skillnaden mellan Work IQ och traditionell implementation handlar
          inte om teknik – utan om hur arbete faktiskt utförs.
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold">Område</th>
                <th className="text-left p-3 font-semibold">Traditionellt</th>
                <th className="text-left p-3 font-semibold">Work IQ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Fokus</td>
                <td className="p-3">Användaren i systemet</td>
                <td className="p-3">Agenten i arbetsflödet</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Process</td>
                <td className="p-3">Manuell</td>
                <td className="p-3">Kontextstyrd</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Data</td>
                <td className="p-3">Dynamics 365</td>
                <td className="p-3">D365 + M365</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">AI-roll</td>
                <td className="p-3">Tillägg</td>
                <td className="p-3">Inbyggd i flödet</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Design</td>
                <td className="p-3">Systemcentrerad</td>
                <td className="p-3">Agentcentrerad</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Fördjupad jämförelse</h3>
        <p>
          <strong>Design:</strong> Traditionellt fokuserar på formulär, vyer
          och roller. Work IQ fokuserar på flöden, beslut och automation.
        </p>
        <p>
          <strong>Arbete:</strong> Traditionellt söker, analyserar och agerar
          användaren själv. Med Work IQ kan en agent hämta kontext, analysera
          och föreslå nästa steg.
        </p>
        <p>
          <strong>Kostnad:</strong> Traditionellt dominerar licens och
          implementation. Med Work IQ behöver även Copilot Credits och
          konsumtionsbaserad AI räknas in.
        </p>
        <p>
          <strong>Risk:</strong> Traditionellt handlar risken ofta om låg
          adoption och komplexa gränssnitt. Med Work IQ flyttas risken mot
          felaktig automatisering och svag governance.
        </p>
        <p>
          <strong>Nyckelinsikt:</strong> Systemet går från att stödja arbete
          till att i högre grad kunna utföra arbete.
        </p>

        <h2>Checklista: Är organisationen redo för Work IQ?</h2>
        <p>
          <strong>Så räknar du poängen:</strong> Välj ett svar för varje
          område. <em>Ja</em> = 0 poäng, <em>Delvis</em> = 1 poäng,{" "}
          <em>Nej</em> = 2 poäng. Summera poängen för alla åtta områden. Ju
          lägre totalpoäng, desto bättre beredskap för Work IQ och AI i
          Dynamics 365.
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold">Område</th>
                <th className="text-left p-3 font-semibold">
                  Vad ska vara på plats?
                </th>
                <th className="text-center p-3 font-semibold w-16">Ja</th>
                <th className="text-center p-3 font-semibold w-20">Delvis</th>
                <th className="text-center p-3 font-semibold w-16">Nej</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1. Datakvalitet", "Kunddata, historik och dubletter är under kontroll"],
                ["2. M365-mognad", "Outlook, Teams och gemensamma arbetssätt används konsekvent"],
                ["3. Processmognad", "Processer, beslutsregler och ansvar är tydliga"],
                ["4. Governance", "AI-policy, behörigheter och agentbeteende är styrda"],
                ["5. Teknik", "Dynamics 365-miljö och integrationer är stabila"],
                ["6. Ekonomi", "Copilot Credits, AI-konsumtion och ROI är medräknade"],
                ["7. Organisation", "Ledning och förändringsledning är på plats"],
                ["8. Partner", "Partnern har AI-kompetens och governance-erfarenhet"],
              ].map(([omrade, krav], i, arr) => (
                <tr key={omrade} className={i < arr.length - 1 ? "border-b border-border/50" : ""}>
                  <td className="p-3 font-medium">{omrade}</td>
                  <td className="p-3">{krav}</td>
                  <td className="p-3 text-center text-muted-foreground">☐</td>
                  <td className="p-3 text-center text-muted-foreground">☐</td>
                  <td className="p-3 text-center text-muted-foreground">☐</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <h3>Snabb tolkning</h3>
        <ul>
          <li>
            <strong>0–4 poäng – Relativt redo.</strong> Fortsätt med
            prioriterade piloter.
          </li>
          <li>
            <strong>5–10 poäng – Delvis redo.</strong> Börja med pilot och
            åtgärdsplan.
          </li>
          <li>
            <strong>11–16 poäng – Inte redo att skala.</strong> Stärk
            grundförmågan först.
          </li>
        </ul>

        <p>
          <strong>Slutsats:</strong> De organisationer som lyckas bäst börjar
          med datakvalitet, processmognad och governance – innan de skalar
          Dynamics 365 och AI.
        </p>

        <aside
          aria-label="Relaterat innehåll"
          className="mt-12 p-6 rounded border border-border bg-secondary/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Relaterat innehåll
          </p>
          <p className="!my-0 text-sm text-muted-foreground">
            <a
              href="/beslutsmognadsindex/"
              className="text-primary hover:underline"
            >
              Beslutsmognadsindex på d365.se
            </a>{" "}
            – en kostnadsfri självskattning som hjälper er bedöma om data,
            processer och organisation är redo för AI-agenter i Dynamics 365.
          </p>
        </aside>
      </>
    ),
  },
  {
    slug: "copilot-cowork-dynamics-365",
    title:
      "Copilot Cowork är här – vad betyder det för företag som använder Dynamics 365?",
    metaTitle:
      "Copilot Cowork och Dynamics 365 – vad GA-lanseringen betyder för CRM- och ERP-val | d365.se",
    metaDescription:
      "Copilot Cowork är nu allmänt tillgängligt. Här är vad det betyder för företag som använder Dynamics 365 – från AI-agenter och datakvalitet till integrationer, governance och valet av rätt partner.",
    summary:
      "Microsoft har gjort Copilot Cowork allmänt tillgängligt. För företag som använder eller utvärderar Dynamics 365 handlar det inte bara om ännu en AI-funktion, utan om ett skifte mot mer agentiska arbetssätt där data, processer, integrationer och governance blir avgörande för affärsvärdet.",
    category: "AI & Copilot",
    tags: [
      "copilot cowork",
      "copilot",
      "ai-agenter",
      "microsoft",
      "dynamics365",
      "erp",
      "crm",
      "governance",
      "partnerval",
    ],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Field Service",
      "AI/Copilot/Agents",
    ],
    publishedAt: "2026-06-17",
    author: THOMAS_LAINE,
    heroImage: copilotCoworkHero,
    readingTimeMinutes: 8,
    featured: true,
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          Microsoft har gjort Copilot Cowork allmänt tillgängligt. För företag
          som använder eller utvärderar Dynamics 365 handlar det inte bara om
          ännu en AI-funktion, utan om ett skifte mot mer agentiska arbetssätt
          där data, processer, integrationer och governance blir avgörande för
          affärsvärdet.
        </p>

        <p>
          Microsoft har nu gjort Copilot Cowork allmänt tillgängligt. Det kan
          låta som ännu en Copilot-lansering i mängden, men för företag som
          använder, utvärderar eller står inför ett byte av CRM- eller
          ERP-system är det här betydligt mer intressant än så.
        </p>
        <p>
          Det handlar inte bara om att AI kan skriva ett utkast, sammanfatta
          ett möte eller hjälpa en användare i ett formulär. Copilot Cowork
          pekar mot nästa steg: AI som kan arbeta över flera system, hantera
          längre arbetsuppgifter och leverera ett faktiskt resultat – inte
          bara ett förslag.
        </p>
        <p>För Dynamics 365 innebär det ett tydligt skifte.</p>
        <p>
          Frågan är inte längre bara:{" "}
          <strong>”Hur bra är Copilot i Dynamics 365?”</strong>
        </p>
        <p>
          Den viktigare frågan blir:{" "}
          <strong>
            ”Är vår Dynamics 365-miljö, vår data och våra processer redo för
            AI-agenter som faktiskt arbetar i verksamheten?”
          </strong>
        </p>

        <h2>Från assistent till medarbetare i processen</h2>
        <p>
          De första åren med Copilot har till stor del handlat om
          produktivitet. Hjälp att formulera e-post, sammanfatta Teams-möten,
          ta fram PowerPoint-utkast eller analysera information i Excel.
        </p>
        <p>Det är värdefullt, men ofta ganska nära individens eget arbete.</p>
        <p>
          Copilot Cowork flyttar perspektivet mot mer verksamhetskritiska
          processer. Microsoft beskriver det som ett sätt att hantera komplexa,
          långvariga uppgifter över flera verktyg. Det innebär att AI inte bara
          hjälper användaren att tänka, skriva eller söka, utan också kan ta
          ett uppdrag, arbeta vidare och återkomma med ett färdigt resultat.
        </p>
        <p>Det är här kopplingen till Dynamics 365 blir intressant.</p>
        <p>
          Dynamics 365 innehåller ofta den information som faktiskt driver
          verksamheten: kunder, affärsmöjligheter, order, avtal, ärenden,
          produkter, leveranser, projekt, ekonomi och servicehistorik. När
          AI-agenter börjar arbeta över Microsoft 365, Dynamics 365, Fabric
          och andra system blir affärssystemet och CRM-systemet inte bara
          systemstöd. De blir en del av den operativa AI-plattformen.
        </p>

        <h2>Vad kan det betyda i praktiken?</h2>
        <p>
          I en Dynamics 365 Sales-miljö kan en agent analysera pipeline,
          identifiera affärer i riskzonen, gå igenom tidigare kommunikation,
          hitta uppföljningar som tappats bort och föreslå nästa åtgärd för
          varje kund.
        </p>
        <p>
          Tänk en säljorganisation som arbetar i Dynamics 365 Sales, Outlook,
          Teams och Power BI. En agent skulle kunna identifiera affärer som
          riskerar att stanna av, analysera tidigare möten och e-post, se om
          rätt beslutsfattare saknas i dialogen, föreslå nästa steg och
          sammanställa ett prioriterat underlag till säljledaren. Då blir AI
          inte bara ett skrivstöd – utan ett stöd i själva säljprocessen.
        </p>
        <p>
          I Customer Service kan en agent analysera ärenden, hitta mönster,
          föreslå nya kunskapsartiklar, identifiera återkommande problem och
          hjälpa organisationen att minska inflödet av liknande ärenden.
        </p>
        <p>
          I Field Service kan agentiska arbetsflöden koppla ihop
          servicehistorik, teknikerplanering, reservdelar, kundavtal och
          tidigare fel för att ge bättre prioritering och högre first-time-fix.
        </p>
        <p>
          I ERP kan motsvarande logik användas för att analysera
          orderavvikelser, lagerproblem, leveransrisker, fakturaflöden,
          prognoser, inköpsbehov eller ekonomiska avvikelser. Inte som en
          isolerad rapport, utan som ett arbetsflöde där agenten samlar in
          information, tolkar samband och föreslår vad som behöver göras.
        </p>
        <p>
          Det här är inte magi. Det bygger på något ganska jordnära: fungerande
          data, tydliga processer och system som hänger ihop.
        </p>

        <h2>AI avslöjar snabbt brister i data och processer</h2>
        <p>
          Det är lätt att fastna i AI-funktionerna. Men den större frågan för
          många företag är om den egna verksamheten är redo.
        </p>
        <p>
          En AI-agent är inte bättre än den kontext den får arbeta med. Om
          kunddata är bristfällig, roller är otydliga, processer är
          inkonsekventa och affärsregler ligger i huvudet på enskilda personer
          blir resultatet därefter.
        </p>
        <p>
          Det är därför Copilot Cowork och liknande lösningar gör Dynamics
          365-frågan mer strategisk. En implementation som bara fokuserar på
          att ersätta dagens system riskerar att missa nästa nivå. Företag
          behöver bygga en plattform där data, processer, säkerhet och
          automation fungerar tillsammans.
        </p>
        <p>
          Det gäller särskilt inom CRM och ERP, där informationen ofta är både
          affärskritisk och tvärfunktionell.
        </p>
        <p>
          Ett säljcase påverkar prognos, leveranskapacitet, avtal, fakturering
          och kundrelation. Ett serviceärende kan påverka retention,
          merförsäljning, produktkvalitet och supportkostnader. En
          orderavvikelse kan bero på lager, inköp, masterdata, produktion,
          transport eller ekonomi.
        </p>
        <p>Det är just sådana samband AI-agenter behöver kunna förstå.</p>

        <h2>Governance och kostnad blir en ledningsfråga</h2>
        <p>
          En annan viktig del i Microsofts lansering är kostnadsstyrning.
          Copilot Cowork bygger på användningsbaserad debitering via Copilot
          Credits. Microsoft lyfter också fram funktioner för budgetar, spend
          limits, användningsrapporter och kontroll på tenant-, grupp- och
          användarnivå.
        </p>
        <p>Det är klokt, och nödvändigt.</p>
        <p>
          När AI går från enskilda prompts till längre agentiska arbetsflöden
          blir kostnadsbilden mer dynamisk. En enkel sammanfattning är en sak.
          En agent som arbetar över flera system, hämtar kontext, använder
          verktyg och kör längre resonemang är något annat.
        </p>
        <p>
          Det innebär att företag behöver styra AI på samma sätt som andra
          verksamhetskritiska resurser: med policy, ansvar, uppföljning och
          mätbar nytta.
        </p>
        <p>
          Frågan är inte bara ”vad kostar Copilot?” utan snarare:
        </p>
        <ul>
          <li>Vilka arbetsflöden är värda att automatisera?</li>
          <li>Vilka roller ska ha tillgång?</li>
          <li>Vilka uppgifter får AI utföra?</li>
          <li>Hur följer vi upp värde, risk och kostnad?</li>
          <li>Vem äger governance mellan IT, verksamhet och ledning?</li>
        </ul>
        <p>
          Det här är frågor som bör komma tidigt i en Dynamics 365-strategi,
          inte som ett efterhandsprojekt.
        </p>

        <h2>Vad bör företag tänka på inför ett Dynamics 365-val?</h2>
        <p>
          För företag som står inför att välja eller uppgradera CRM eller ERP
          blir slutsatsen tydlig: systemvalet måste klara mer än dagens behov.
        </p>
        <p>
          Det räcker inte att jämföra funktioner i traditionell mening. Man
          behöver också bedöma hur väl lösningen stödjer framtida AI-drivna
          arbetssätt.
        </p>
        <p>Några frågor blir särskilt viktiga:</p>

        <h3>Har vi ordning på vår data?</h3>
        <p>
          Kunddata, produktdata, artikeldata, prislistor, avtal, order,
          aktiviteter och ärenden måste vara tillräckligt strukturerade för
          att AI ska kunna skapa värde.
        </p>

        <h3>Är processerna tydliga nog?</h3>
        <p>
          AI-agenter fungerar bäst när det finns definierade arbetssätt,
          ansvar och affärsregler. Otydliga processer blir svåra att
          automatisera.
        </p>

        <h3>Är systemen integrerade?</h3>
        <p>
          Värdet uppstår ofta mellan systemen – inte i ett enskilt formulär.
          Dynamics 365, Microsoft 365, Power Platform, Fabric och
          kringliggande system behöver hänga ihop.
        </p>

        <h3>Finns rätt säkerhet och styrning?</h3>
        <p>
          När AI får mer operativ roll krävs kontroll över behörigheter,
          informationsklassning, datadelning, loggning och uppföljning.
        </p>

        <h3>
          Har partnern erfarenhet av både verksamhetsprocesser och Microsofts
          AI-plattform?
        </h3>
        <p>
          Det räcker inte med teknisk implementation. Rätt partner behöver
          förstå CRM, ERP, data, automation, förändringsledning och hur AI
          faktiskt kan användas i affärsprocesser.
        </p>

        <h2>Valet av Dynamics 365-partner blir viktigare</h2>
        <p>
          Copilot Cowork förstärker en redan tydlig trend: Dynamics 365 är
          inte längre bara ett CRM- eller ERP-val. Det är ett plattformsval.
        </p>
        <p>
          Därför blir också partnerfrågan mer kritisk. En partner som bara
          implementerar funktioner utifrån en kravlista riskerar att missa
          den större möjligheten. En modern Dynamics 365-partner behöver
          kunna hjälpa kunden att bygga en grund för AI-drivet arbete.
        </p>
        <p>
          Det handlar om att förstå verksamheten, prioritera rätt processer,
          skapa datamodeller som håller, bygga integrationer som fungerar och
          samtidigt säkra adoption och governance.
        </p>
        <p>
          Det är inte alltid den största partnern som är bäst. Inte heller den
          som visar flest AI-demos. Det viktiga är att hitta en partner som
          kan koppla ihop affärsnytta, systemarkitektur, data och
          förändringsledning.
        </p>

        <h2>Slutsats</h2>
        <p>
          Copilot Cowork är en tydlig signal om vart Microsofts ekosystem är
          på väg.
        </p>
        <p>
          AI kommer inte att stanna vid att hjälpa användare skriva snabbare
          eller sammanfatta information. Den kommer i allt högre grad att
          arbeta över system, driva processer och ta fram beslutsunderlag som
          tidigare krävde timmar eller dagar av manuellt arbete.
        </p>
        <p>
          För Dynamics 365-kunder innebär det en stor möjlighet. Men bara om
          grunden är rätt. Företag som har ordning på data, processer,
          integrationer och styrning kommer snabbare kunna dra nytta av
          AI-agenter. Företag som har röriga systemmiljöer, svag datakvalitet
          och otydliga arbetssätt kommer först behöva ta tag i grunden.
        </p>
        <p>
          Det gör behovsanalysen viktigare. Det gör kravställningen viktigare.
          Och det gör valet av Dynamics 365-partner viktigare.
        </p>
        <p>
          Därför räcker det inte längre att fråga vilken CRM- eller ERP-lösning
          som har flest funktioner. Den viktigare frågan är vilken plattform
          som ger bäst förutsättningar för AI-drivna arbetssätt – och vilken
          partner som kan hjälpa verksamheten att komma dit.
        </p>

        <p className="text-sm text-muted-foreground !mt-8">
          Källa:{" "}
          <a
            href="https://www.microsoft.com/en-us/microsoft-365/blog/2026/06/16/copilot-cowork-is-now-generally-available/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Copilot Cowork is now generally available
          </a>{" "}
          – Microsoft 365 Blog, 16 juni 2026.
        </p>



        <aside
          aria-label="Relaterat innehåll"
          className="mt-12 p-6 rounded border border-border bg-secondary/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Relaterat innehåll
          </p>
          <p className="!my-0 text-sm text-muted-foreground">
            <a
              href="/beslutsmognadsindex/"
              className="text-primary hover:underline"
            >
              Beslutsmognadsindex på d365.se
            </a>{" "}
            – en kostnadsfri självskattning som hjälper er bedöma om data,
            processer och organisation är redo för AI-agenter i Dynamics 365.
          </p>
        </aside>
      </>
    ),
  },
  {
    slug: "frontier-firm-dynamics-365-erp-crm",
    title:
      "Frontier Firm: vad Microsoft menar – och vad du bör förstå inför valet av ERP eller CRM",
    metaTitle:
      "Frontier Firm och Dynamics 365 – vad Microsoft menar inför ERP- eller CRM-val | d365.se",
    metaDescription:
      "Frontier Firm är Microsofts nya begrepp för framtidens AI-drivna organisation. Läs vad det betyder, hur det påverkar Dynamics 365 och vilka frågor du bör ställa inför valet av ERP eller CRM.",
    summary:
      "Vad menar Microsoft egentligen med Frontier Firm – och varför spelar det roll inför ett ERP- eller CRM-val? Här går vi igenom begreppet, kopplingen till Dynamics 365 och vilka frågor du bör ställa till en partner.",
    category: "Strategi",
    tags: [
      "frontier firm",
      "microsoft",
      "dynamics365",
      "copilot",
      "ai-agenter",
      "erp",
      "crm",
      "work trend index",
      "systemval",
      "partnerval",
    ],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "AI/Copilot/Agents",
    ],
    publishedAt: "2026-06-11",
    author: THOMAS_LAINE,
    heroImage: frontierFirmHero,
    readingTimeMinutes: 7,
    featured: true,
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          Begreppet Frontier Firm dyker nu upp allt oftare i Microsofts budskap
          och i partnerdialoger kring Dynamics 365. För dig som står inför ett
          ERP- eller CRM-beslut är det därför viktigt att förstå vad begreppet
          faktiskt innebär, vad Microsofts egen forskning säger och vilka
          frågor du bör ställa innan AI, Copilot och agenter blir en del av
          lösningen.
        </p>

        <h2>Vad är en Frontier Firm?</h2>
        <p>
          Frontier Firm är Microsofts samlingsbegrepp för en ny typ av
          organisation: en verksamhet som är byggd kring intelligens som
          tjänst, där människor och AI-agenter arbetar sida vid sida i de
          dagliga processerna. Begreppet introducerades i Microsofts{" "}
          <em>Work Trend Index</em> och har sedan dess vuxit till en bredare
          beskrivning av hur Microsoft ser på framtidens företag.
        </p>
        <p>
          Det handlar inte om en specifik produkt. Det handlar om en
          arbetsmodell där tre saker hänger ihop: tillgång till data av god
          kvalitet, AI som kan agera inom tydliga ramar, och en ledning som
          har bestämt vad maskiner får göra och vad människor ska äga.
        </p>

        <h2>Varför pratar Microsoft om det nu?</h2>
        <p>
          Microsofts plattformsstrategi rör sig snabbt från assistenter som
          svarar på frågor till agenter som utför arbete. Frontier Firm är det
          språk Microsoft använder för att beskriva den organisation som drar
          mest nytta av den utvecklingen – och som därför också är den naturliga
          målgruppen för Dynamics 365, Copilot och de nya agentfunktionerna.
        </p>
        <p>
          För er som överväger ett system­byte är detta värt att notera.
          Microsofts produktutveckling, partner­ekosystem och prissättning
          formas av den här ambitionen. Den organisation som väljer Dynamics
          365 i dag väljer också, på sikt, in sig i den riktningen.
        </p>

        <h2>Vad det betyder för valet av ERP eller CRM</h2>
        <p>
          Frontier Firm-tänkandet förändrar några av de frågor som länge har
          dominerat ERP- och CRM-val. Tre förskjutningar är värda att lyfta.
        </p>

        <h3>1. Data blir en förutsättning, inte en bilaga</h3>
        <p>
          I en klassisk upphandling diskuteras data­migrering ofta sent i
          projektet. I en Frontier Firm-logik är data­grunden själva poängen:
          en agent som arbetar mot ett orent kundregister fattar dåliga beslut
          snabbare än någon människa skulle göra. Datakvalitet flyttar därför
          från IT-projektet till verksamhets­agendan.
        </p>

        <h3>2. Processfrågan blir “vad ska automatiseras – och hur långt?”</h3>
        <p>
          Tidigare handlade kravställningen om vilka funktioner systemet skulle
          stödja. Nu tillkommer en ny fråga: vilka delar av processen vill ni
          att en agent ska utföra själv, vilka ska den föreslå, och vilka ska
          en människa alltid äga? Den frågan går inte att outsourca till
          partnern – den måste ledningen själv ta ställning till.
        </p>

        <h3>3. Partnerns roll förskjuts</h3>
        <p>
          När mer av det tekniska standardarbetet automatiseras flyttas en
          implementations­partners värde till annat: att förstå er verksamhet,
          hjälpa er sätta ramar för agenter och bygga styrning som gör att rätt
          saker händer säkert. Antal konsulter och certifieringar säger allt
          mindre om vad ni faktiskt får ut.
        </p>

        <h2>Frågor att ställa till en partner</h2>
        <p>
          Innan ni låter Frontier Firm-retoriken styra ett ERP- eller CRM-val
          är det rimligt att be partnern landa i konkretion. Några frågor som
          brukar skilja:
        </p>
        <ul>
          <li>
            Hur ser en kund hos er ut som faktiskt arbetar i en Frontier
            Firm-modell idag – vad gör agenterna, vad gör människorna?
          </li>
          <li>
            Vilka delar av Dynamics 365 är mogna nog för agentdrift i vår
            bransch, och vilka är ni ärliga med att vänta med?
          </li>
          <li>
            Hur arbetar ni med datakvalitet och styrning som en del av
            införandet, inte som efterhandsprojekt?
          </li>
          <li>
            Hur säkerställer ni att vi behåller kontroll över processer som
            agenter lär sig – även om vi en dag byter leverantör?
          </li>
        </ul>
        <p>
          En partner som svarar konkret på de frågorna har gjort jobbet. En
          partner som svarar med en presentation om AI:s möjligheter har inte
          det.
        </p>

        <h2>Vad ledningen bör göra nu</h2>
        <p>
          Frontier Firm är inget skäl att stressa fram ett systemval – men det
          är ett skäl att höja blicken. Tre saker förtjänar en plats på
          agendan innan en upphandling drar i gång:
        </p>
        <p>
          <strong>Bedöm er egen mognad ärligt.</strong> Var står ni när det
          gäller data, processer, styrning och förändringsförmåga? Ett ERP-
          eller CRM-projekt som drivs i en omogen organisation blir sällan en
          Frontier Firm – oavsett vilken plattform ni väljer.
        </p>
        <p>
          <strong>Bestäm vilken roll AI ska ha hos er.</strong> Stödjande,
          drivande eller verkställande? Svaret påverkar både kravbild,
          partnerprofil och budget.
        </p>
        <p>
          <strong>Använd valet som ett ledningsbeslut, inte ett IT-beslut.</strong>{" "}
          Det är där Frontier Firm-tänkandet faktiskt landar – i hur ni leder,
          inte i vilken licens ni tecknar.
        </p>

        <h2>Slutsats</h2>
        <p>
          Frontier Firm är Microsofts sätt att beskriva den organisation som
          drar verklig nytta av AI i sina kärnprocesser. För er som står inför
          ett ERP- eller CRM-val är begreppet användbart – men bara om ni
          översätter det till era egna förutsättningar i stället för att köpa
          det som färdig bild. Då blir Dynamics 365 ett möjligt verktyg, inte
          ett självändamål, och partnerdialogen handlar om er verksamhet
          snarare än om en plattformsvision.
        </p>

        <aside
          aria-label="Relaterat innehåll"
          className="mt-12 p-6 rounded border border-border bg-secondary/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Relaterat innehåll
          </p>
          <p className="!my-0 text-sm text-muted-foreground">
            <a
              href="/beslutsmognadsindex/"
              className="text-primary hover:underline"
            >
              Beslutsmognadsindex på d365.se
            </a>{" "}
            – en kostnadsfri självskattning för organisationer som vill bedöma
            sin beredskap inför systemval och partnerval.
          </p>
        </aside>
      </>
    ),
  },
  {
    slug: "ai-skiftet-dynamics-365-build-2026",
    title: "AI-skiftet i Dynamics 365 – vad ledningsgruppen behöver förstå efter Microsoft Build 2026",
    metaTitle: "Dynamics 365 efter Build 2026: AI-agenter, data och partnerval",
    metaDescription:
      "Efter Microsoft Build 2026 blir AI-agenter en större del av Dynamics 365. Läs vad det betyder för data, styrning, affärsprocesser och val av partner.",
    socialTitle: "Dynamics 365 efter Build 2026: vad AI-agenter betyder för företag",
    socialDescription:
      "Microsoft gör AI-agenter till en viktigare del av Dynamics 365. Artikeln visar vad företag behöver förstå om datakvalitet, styrning, affärsprocesser och partnerval efter Build 2026.",
    summary:
      "Microsoft Build 2026 blev startskottet för en plattform där AI-agenter inte bara assisterar utan utför arbete i Dynamics 365. Här är vad ledningsgrupper bör göra med data, styrning och partnerval – i lugn och ro, men nu.",
    category: "Strategi",
    tags: ["dynamics365", "ai", "agenter", "copilot", "microsoft build", "ledning"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "AI/Copilot/Agents",
    ],
    publishedAt: "2026-06-10",
    author: THOMAS_LAINE,
    heroImage: aiSkiftetBuild2026Hero,
    readingTimeMinutes: 7,
    featured: false,
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          I början av juni höll Microsoft sin årliga konferens Build.
          Konferensen riktar sig till utvecklare, och mycket av det som
          presenterades var tekniskt. Men bakom tekniken fanns ett besked som
          varje ledningsgrupp med Dynamics 365, eller planer på att införa det,
          bör ta på allvar.
        </p>

        <p>
          Microsofts egen sammanfattning av konferensen finns här:{" "}
          <a
            href="https://blogs.microsoft.com/blog/2026/06/03/microsoft-build-2026-be-yourself-at-work/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Microsoft Build 2026: Be yourself at work
          </a>{" "}
          (Official Microsoft Blog).
        </p>

        <p>
          Beskedet är detta: Microsoft bygger nu om sin plattform kring
          AI-agenter. Inte assistenter som svarar på frågor, utan agenter som
          utför arbete. Och för första gången gör Microsoft det med egna
          AI-modeller, byggda från grunden, i stället för att hyra in teknik
          från andra aktörer.
        </p>
        <p>
          Vad betyder det för er? Inte i morgon, men de kommande åren. Det är
          vad den här artikeln handlar om.
        </p>

        <h2>Från assistent till medarbetare</h2>
        <p>
          De senaste åren har AI i affärssystem mest handlat om Copilot: en
          assistent som sammanfattar, föreslår och svarar på frågor. Användbart,
          men passivt. Människan gör jobbet, AI:n hjälper till.
        </p>
        <p>
          Det Microsoft nu bygger är något annat. Agenter som tar emot en
          uppgift och genomför den: registrerar ordern, följer upp leveransen,
          förbereder kundmötet, hanterar serviceärendet. Människan flyttas från
          att utföra till att besluta och kontrollera.
        </p>
        <p>
          Det är en större förändring än det låter som. Den påverkar hur era
          processer ser ut, vilken kompetens ni behöver och hur ni mäter
          effektivitet. Och den kommer inte som ett stort släpp en viss dag,
          utan gradvis, funktion för funktion, in i det system ni redan
          använder.
        </p>

        <h2>Tre saker som blir viktigare</h2>
        <p>
          Vår bedömning är att tre frågor nu klättrar snabbt i prioritet för
          varje organisation som redan använder Dynamics 365 eller överväger
          att göra det.
        </p>

        <h3>1. Er data avgör resultatet</h3>
        <p>
          En agent är aldrig bättre än den data den arbetar med. Om
          kundregistret innehåller dubbletter, om artikeldata är inkonsekvent
          eller om priser ligger i ett kalkylblad vid sidan av systemet, då
          fattar agenten fel beslut. Snabbare och i större skala än en
          människa skulle göra.
        </p>
        <p>
          Datakvalitet har alltid stått på att-göra-listan. Skillnaden nu är
          att kostnaden för att skjuta upp arbetet blir synlig: organisationer
          med ordning på sin data kan låta agenter ta över rutinarbete, medan
          andra får se investeringen ge betydligt mindre tillbaka.
        </p>
        <p>
          Frågan till er egen organisation är enkel: skulle ni våga låta en ny
          medarbetare fatta beslut enbart utifrån det som står i era system i
          dag? Om svaret är nej har ni hittat ert första projekt.
        </p>

        <h3>2. Någon måste bestämma vad agenterna får göra</h3>
        <p>
          När programvara börjar agera självständigt uppstår frågor som ingen
          IT-avdelning kan svara på ensam. Vilka beslut får en agent fatta utan
          att en människa godkänner? Vem ansvarar när det blir fel? Hur
          upptäcker vi om en agent gör fel saker, fast effektivt?
        </p>
        <p>
          Det här är inte tekniska frågor. Det är lednings- och ansvarsfrågor.
          Microsoft levererar verktygen för att övervaka och begränsa agenter,
          men besluten om var gränserna ska gå måste er organisation fatta
          själv.
        </p>
        <p>
          Vårt råd: vänta inte tills den första agenten är i drift. De
          organisationer som klarar det här bra har resonerat igenom ansvar
          och gränser i förväg, på ledningsnivå, inte i efterhand när något
          redan hänt.
        </p>

        <h3>3. Bindningen till plattformen blir djupare</h3>
        <p>
          En del av det Microsoft visade handlar om agenter som lär sig just
          er verksamhet: era processer, era undantag, ert sätt att arbeta. Ju
          längre de är i drift, desto bättre blir de på er vardag.
        </p>
        <p>
          Det är värdefullt. Men det innebär också att den kunskapen inte
          flyttar med om ni en dag byter plattform. Bindningen till Microsoft,
          som redan är stark genom data och anpassningar, blir starkare.
        </p>
        <p>
          Det är inget skäl att avstå. Men det är ett skäl att gå in med öppna
          ögon, och att väga in det i avtal och arkitekturval redan nu, medan
          handlingsutrymmet finns.
        </p>

        <h2>Vad det betyder för ert partnerval</h2>
        <p>
          Här ser vi kanske den största praktiska konsekvensen, och det är
          också här många utvärderingar fortfarande ställer fel frågor.
        </p>
        <p>
          När mer av det tekniska standardarbetet automatiseras flyttas en
          implementationspartners värde till annat: att förstå vilka av era
          processer som passar för agenter och vilka som inte gör det, att
          hjälpa er få ordning på datagrunden, och att bygga styrning så att
          agenterna gör rätt saker säkert.
        </p>
        <p>
          Det betyder att klassiska urvalskriterier – antal konsulter, antal
          genomförda projekt och certifieringar – säger allt mindre om vad ni
          faktiskt får. De frågor som skiljer agnarna från vetet 2026 låter
          snarare så här:
        </p>
        <ul>
          <li>
            Har ni satt agenter i produktion hos kunder, och vad blev
            resultatet?
          </li>
          <li>
            Hur arbetar ni med datakvalitet som förutsättning, inte som
            efterhandskorrigering?
          </li>
          <li>
            Hur hjälper ni kunden bestämma vad agenter får och inte får göra?
          </li>
        </ul>
        <p>
          En partner som svarar konkret på de frågorna har gjort jobbet. En
          partner som svarar med en presentation om AI:s möjligheter har inte
          det.
        </p>

        <h2>Vad ledningsgruppen bör göra nu</h2>
        <p>
          Inget av detta kräver snabba beslut. Men tre saker förtjänar en
          plats på agendan under hösten.
        </p>
        <p>
          <strong>Gör en ärlig bedömning av er datagrund.</strong> Inte en
          teknisk genomgång, utan en verksamhetsfråga: litar vi på det som
          står i våra system? Om inte, börja där. Allt annat bygger på det.
        </p>
        <p>
          <strong>Bestäm hur ni vill styra agenter innan ni har några.</strong>{" "}
          Vilka typer av beslut kan automatiseras, vilka kräver alltid en
          människa? Ett kort principdokument från ledningen räcker långt och
          sparar svåra diskussioner senare.
        </p>
        <p>
          <strong>Uppdatera kraven på er partner.</strong> Oavsett om ni står
          inför en upphandling eller har en etablerad leverantör: ställ
          agentfrågorna. Svaren säger mycket om vem ni har att göra med.
        </p>

        <h2>Slutsats</h2>
        <p>
          Microsoft Build 2026 blev startskottet för en plattform där
          AI-agenter utför arbete i era affärsprocesser, lär sig hur er
          verksamhet fungerar och behöver styras mer som medarbetare än som
          traditionell programvara. Förändringen kommer gradvis, men
          riktningen är tydlig.
        </p>
        <p>
          Det avgörande för er är inte tekniken i sig. Det är om er data
          håller, om styrningen finns på plats och om er partner faktiskt
          behärskar detta bortom presentationer och löften. De organisationer
          som tar tag i de frågorna i lugn och ro nu har ett tydligt försprång
          när AI-agenter blir en naturlig del av vardagen.
        </p>
        <p>
          Står ni inför ett partnerval, eller vill ni pröva er nuvarande
          leverantörs förmåga på området? Det är precis den typen av beslut
          som d365.se hjälper er att strukturera.
        </p>

        <aside
          aria-label="Källa"
          className="mt-12 p-6 rounded border border-border bg-secondary/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Källa
          </p>
          <ul className="!my-0 !pl-5 !space-y-2 text-sm text-muted-foreground list-disc">
            <li>
              <a
                href="https://blogs.microsoft.com/blog/2026/06/03/microsoft-build-2026-be-yourself-at-work/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Microsoft Build 2026: Be yourself at work
              </a>{" "}
              – The Official Microsoft Blog.
            </li>
          </ul>
        </aside>
      </>
    ),
  },
  {
    slug: "dynamics-365-release-wave-1-2026",
    title: "Dynamics 365 Release Wave 1 2026 – vad som faktiskt kommer, per produkt",
    metaTitle: "Dynamics 365 Release Wave 1 2026: nyheter per produkt | d365.se",
    metaDescription:
      "Köparsidig sammanställning av Microsofts Release Wave 1 2026 för Dynamics 365. Per produkt: vad som rullas ut april–september 2026, och vad som redan finns inom AI, Copilot och agenter.",
    summary:
      "Microsoft publicerade Release Wave 1 2026 den 18 mars. Här är d365.se:s köparsidiga genomgång – per produkt: vad som rullas ut mellan april och september, och vad som redan är på plats inom AI, Copilot och agenter.",
    category: "Produktnyheter",
    tags: ["dynamics365", "release wave", "ai", "copilot", "agenter", "roadmap"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Contact Center",
      "Field Service",
      "Customer Insights",
      "AI/Copilot/Agents",
    ],
    publishedAt: "2026-05-25",
    author: THOMAS_LAINE,
    heroImage: releaseWave1Hero,
    readingTimeMinutes: 10,
    featured: false,
    freshness: {
      status: "older",
      note: "Beskriver Release Wave 1 2026. För det större AI-skiftet i Dynamics 365 efter Microsoft Build 2026 och GA av Copilot Cowork, se de nyare artiklarna nedan.",
      newerArticles: [
        {
          slug: "ai-skiftet-dynamics-365-build-2026",
          label: "AI-skiftet i Dynamics 365 efter Microsoft Build 2026",
        },
        {
          slug: "copilot-cowork-dynamics-365",
          label: "Copilot Cowork är här – vad betyder det för Dynamics 365?",
        },
      ],
    },
    content: (

      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          Microsoft publicerade Release Wave 1 2026 för Dynamics 365 den{" "}
          <strong>18 mars 2026</strong>. Planen omfattar uppdateringar som rullas
          ut mellan 1 april och september 2026. Här är en köparsidig
          sammanställning per produkt – både det som kommer och det som redan
          finns inom AI, Copilot och agenter.
        </p>

        <aside className="my-10 rounded-md border border-[#9CC2E5] bg-[#DEEBF7] px-7 py-6">
          <p className="!text-[1.25rem] !font-bold !text-[#1F4E79] !mb-3 !mt-0">
            Nyckeldatum
          </p>
          <ul className="!my-0 !pl-7 !space-y-2 list-disc marker:text-[#1F4E79] !text-foreground/90">
            <li>18 mars 2026 – release-planer publicerade</li>
            <li>1 april 2026 – General Availability startar regionalt</li>
            <li>3 april 2026 – plan tillgänglig på svenska</li>
            <li>September 2026 – slutpunkt för Release Wave 1</li>
          </ul>
        </aside>

        <h2>Genomgående tema i RW1 2026</h2>
        <ul>
          <li>
            <strong>Agentic experiences</strong> – autonoma agenter över Sales,
            Service, Finance, Supply Chain och fler.
          </li>
          <li>
            <strong>Djupare Copilot-integration</strong> i alla appar och i
            Microsoft 365.
          </li>
          <li>
            <strong>Model Context Protocol (MCP)</strong> – agenter får direkt
            access till D365-data.
          </li>
          <li>
            <strong>Enhetlig data via Customer Insights</strong> som grund för
            CRM-Copilots.
          </li>
        </ul>

        <h2>Dynamics 365 Sales</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Utökad Copilot på data från CRM och Microsoft 365 – mejl, mötesreferat och kalendrar.</li>
          <li>AI-rekommendationer som hjälper säljare bygga pipeline, berika opportunities och accelerera avslut.</li>
          <li>Proaktiva notiser med tydligt nästa steg.</li>
          <li>Enhetlig Copilot-upplevelse mellan Dynamics 365 och Microsoft 365-appar.</li>
          <li>Sales Agent i M365 Copilot utvecklas till säljarens dagliga kommandocentral (Sales Chat, Sales Home).</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> record summarization, sammanfattningar i lead- och opportunity-formulär, mötesförberedelse, e-postassistans, nyhetssammanfattningar.</p>
        <p><strong>Agenter:</strong> Sales Qualification Agent, Sales Close Agent (Research &amp; Engage), Sales Research Agent.</p>

        <h2>Dynamics 365 Customer Service</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Förstärkta agentiska kapabiliteter inom case management, e-post, kundintent, kvalitetsutvärdering och kunskapshantering.</li>
          <li>AI-stärkta admin- och supervisor-upplevelser för snabbare time-to-value.</li>
          <li>Bättre transparens i hur agenter resonerar och agerar.</li>
          <li>Autonoma flöden från intent-identifiering till case-stängning.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> ask a question, konversationssammanfattningar, case-sammanfattningar, e-postdrafter, resolutionsanteckningar, knowledge drafts, supervisor-analytics.</p>
        <p><strong>Agenter:</strong> Case Management Agent, Customer Knowledge Management Agent, Quality Evaluation Agent, Customer Intent Agent, intent-based routing, Rollout Manager.</p>

        <h2>Dynamics 365 Contact Center</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Agentic contact center med djupare automation och högre containment.</li>
          <li>Stöd för framväxande kanaler utöver röst och chatt.</li>
          <li>Förbättrade supervisor-insikter i realtid.</li>
          <li>Custom Neural Voices – egna märkesröster för text-till-tal.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> realtidssammanfattning av röst och chatt, ask a question, svarsmejl-drafter, resolutionsanteckningar, kunskapsartiklar från cases.</p>
        <p><strong>Agenter:</strong> Customer Intent Agent for voice, Quality Evaluation Agent, Case Management Agent, Customer Knowledge Management Agent, agent insights dashboard.</p>

        <h2>Dynamics 365 Field Service</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Förbättrad mobil användbarhet för tekniker i fält.</li>
          <li>Intelligent schemaläggning via Scheduling Operations Agent.</li>
          <li>End-to-end execution över tillgångar, projekt och finansiella flöden.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> naturligt språk mot Field Service-data, AI-uppdatering av work orders via tal/text, on-demand work order-sammanfattningar, inspektionsmallar från PDF/bild.</p>
        <p><strong>Agenter:</strong> Scheduling Operations Agent – optimerar schema, hanterar avbokningar och förseningar utan manuell omplanering.</p>

        <h2>Customer Insights (Data + Journeys)</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Data: AI-färdig datakärna som grund för CRM-Copilots och agenter.</li>
          <li>Data: realtids unified customer profiles.</li>
          <li>Journeys: skapa kundresor via naturligt språk, query assist, AI-genererad content.</li>
        </ul>
        <h3>Agenter idag</h3>
        <p>Conversational journeys som kombinerar Customer Insights – Journeys, Contact Center och agenter byggda i Copilot Studio.</p>

        <h2>Dynamics 365 Finance</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Global scale-förbättringar för stora och internationella organisationer.</li>
          <li>Ökad finansiell automation över hela close-cykeln.</li>
          <li>Stärkt global regulatorisk compliance.</li>
          <li>Förbättrad planning och analytics.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> chat with finance and operations data, generative help and guidance.</p>
        <p><strong>Agenter:</strong> Account Reconciliation Agent, Finance Agent i M365 Copilot (Outlook och Excel).</p>

        <h2>Dynamics 365 Supply Chain Management</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Demand and supply planning med price-demand correlation.</li>
          <li>Capacity-to-promise (CTP) date protection.</li>
          <li>AI-drivet plock i lagret och automatisk inventory rebalancing.</li>
          <li>Förbättrad leverantörskommunikation.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> analysera demand plans, workload insights i Warehouse Management mobile app, chat with finance and operations data.</p>
        <p><strong>Agenter:</strong> Supplier Communications Agent – automatiserar leverantörsuppföljning och inköpsorderhantering.</p>

        <h2>Dynamics 365 Project Operations</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Stöd för change orders och smartare projektplanering.</li>
          <li>Smidigare flöden för offert, budget och kontrakt.</li>
          <li>Mobile expense management och subscription billing.</li>
        </ul>
        <h3>Agenter idag</h3>
        <p>Time Entry Agent, Expense Agent, Approvals Agent – autoutkast och förgranskning mot policy.</p>

        <h2>Dynamics 365 Commerce</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>B2B: multi-outlet ordering, enhetlig sign-in, outlet-specifika kataloger.</li>
          <li>B2B: inbyggd credit management.</li>
          <li>Moderniserade order management-flöden.</li>
        </ul>
        <p>
          Inga Commerce-specifika Copilot-funktioner eller agenter listade idag.
          Använder gemensamma F&amp;O-kapabiliteter via plattformen och MCP-server.
        </p>

        <h2>Dynamics 365 Human Resources</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Vidareutveckling av rekrytering och onboarding.</li>
          <li>Förbättrad rapportering och integrerad workforce management.</li>
          <li>Utökade regionala payroll-samarbeten.</li>
        </ul>
        <p>
          Inga HR-specifika agenter listade idag. Egna HR-agenter byggs via
          Copilot Studio och Dynamics 365 ERP MCP-servern.
        </p>

        <h2>Dynamics 365 Business Central</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Förstärkta AI-agenter som automatiserar sales- och purchase-scenarios.</li>
          <li>Acceleration mot agentic ERP – fler autonoma flöden.</li>
          <li>Förbättrad AL-testning och debugging för utvecklare.</li>
          <li>Copilot-extensibility – bygg egna Copilot-upplevelser.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> bankkontoavstämning, föreslå rader på säljdokument, alternativa artiklar vid lagerbrist, nummerserier, record-sammanfattningar.</p>
        <p><strong>Agenter:</strong> Sales Order Agent (fångar order från inkommande e-post), Payables Agent (analyserar leverantörsfakturor).</p>

        <h2>Microsoft Sustainability Manager</h2>
        <h3>Nyheter – RW1 2026</h3>
        <ul>
          <li>Mer intuitiv navigering.</li>
          <li>Advanced calculation versioning och granular data-locking.</li>
          <li>Utökad integration mot finans.</li>
        </ul>
        <p><strong>Copilot:</strong> query data, find facts (ESG-disclosures), modelldrivna appkapabiliteter. Agent feed i preview; inga produktspecifika autonoma agenter idag.</p>

        <h2>Vad d365.se tar med sig</h2>
        <p>
          Två observationer värda att lyfta: <strong>agenter går från demo till
          leverans</strong> i den här vågen – flera av dem är redan i
          produktionsmogen förhandsversion eller GA. Och{" "}
          <strong>MCP-servern</strong> som ger agenter direkt access till
          D365-data är den arkitektoniska förändring som mest sannolikt påverkar
          hur framtida lösningar designas, snarare än enskilda Copilot-funktioner.
        </p>
        <p>
          Som alltid: release-planen är ett levande dokument. Microsoft justerar
          funktioner och tidpunkter löpande. Verifiera mot Release Planner före
          beslut, och låt inte en kommande funktion ensam motivera ett
          plattformsval.
        </p>

        <h3>Källor</h3>
        <ul>
          <li>
            <a
              href="https://learn.microsoft.com/dynamics365/release-plan/2026wave1/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Dynamics 365 – 2026 release wave 1 plan
            </a>
          </li>
          <li>Microsoft Dynamics 365-bloggen – 2026 release wave 1 plans (18 mars 2026).</li>
          <li>Produktspecifika release wave-översikter på learn.microsoft.com.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "owned-intelligence-dynamics-365",
    title: "Owned Intelligence – vad Microsofts senaste rapport säger till Dynamics 365-köpare",
    metaTitle: "Owned Intelligence: Microsofts rapport och Dynamics 365 | d365.se",
    metaDescription:
      "Microsofts Work Trend Index 2026 lyfter Owned Intelligence som den verkliga konkurrensfördelen. Vad innebär det för dig som står inför ett Dynamics 365-val?",
    summary:
      "Microsofts Work Trend Index 2026 introducerar begreppet Owned Intelligence – den institutionella kunskap som inte kan kopieras. Här är vad det betyder för Dynamics 365-köpare när agenter tar över mer av exekveringen.",
    category: "Strategi",
    tags: ["dynamics365", "ai", "agenter", "copilot", "upphandling", "owned intelligence"],
    products: ["Business Central", "Finance & SCM", "Sales", "Customer Service", "AI/Copilot/Agents"],
    publishedAt: "2026-05-12",
    author: THOMAS_LAINE,
    heroImage: ownedIntelligenceHero,
    readingTimeMinutes: 8,
    featured: false,
    freshness: {
      status: "older",
      note: "Skriven i maj 2026 utifrån Microsofts Work Trend Index. Den bredare AI-bilden i Dynamics 365 har förtydligats genom Build 2026 och GA av Copilot Cowork – läs vidare där.",
      newerArticles: [
        {
          slug: "ai-skiftet-dynamics-365-build-2026",
          label: "AI-skiftet i Dynamics 365 efter Microsoft Build 2026",
        },
        {
          slug: "copilot-cowork-dynamics-365",
          label: "Copilot Cowork är här – vad betyder det för Dynamics 365?",
        },
        {
          slug: "frontier-firm-dynamics-365-erp-crm",
          label: "Frontier Firm – vad ERP- och CRM-köpare behöver göra nu",
        },
      ],
    },
    content: (

      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          I maj släppte Microsoft sin Work Trend Index 2026 – en omfattande
          rapport baserad på 20 000 enkätsvar i tio länder och biljoner
          anonymiserade signaler från Microsoft 365. Ett begrepp sticker ut och
          är värt att stanna upp vid: <strong>Owned Intelligence</strong>.
        </p>

        <aside className="my-10 rounded-md border border-[#9CC2E5] bg-[#DEEBF7] px-7 py-6">
          <p className="!text-[1.25rem] !font-bold !text-[#1F4E79] !mb-3 !mt-0">
            I korthet
          </p>
          <ul className="!my-0 !pl-7 !space-y-2 list-disc marker:text-[#1F4E79] !text-foreground/90">
            <li>
              Owned Intelligence är den institutionella kunskap som byggs över
              tid, är unik för bolaget och svår att kopiera.
            </li>
            <li>
              Frågan är inte "bygga själv eller köpa färdigt" – utan var
              skiljelinjen mellan standardkapacitet och egen utveckling ska gå.
            </li>
            <li>
              Två extremfall är båda riskabla: eget bygge som blir personberoende,
              eller total partnerlutning som tappar fart.
            </li>
          </ul>
        </aside>

        <p>
          Microsoft beskriver Owned Intelligence som institutionell kunskap som
          byggs upp över tid, är unik för bolaget och svår att kopiera. Det är
          där, enligt rapporten, den långsiktiga konkurrensfördelen ligger när
          agenter tar över allt mer av exekveringen.
        </p>
        <p>
          För Dynamics 365-köpare är det här mer relevant än det låter – och det
          rör vid en fråga som de flesta upphandlingsprocesser idag inte är
          riktigt byggda för att hantera.
        </p>

        <h2>Var marknaden står just nu</h2>
        <p>
          Dynamics 365 är inne i en intressant fas. Copilot är inbäddat i hela
          produktportföljen. Agenter kan skapas direkt i applikationerna eller
          via Copilot Studio. Microsoft släpper nya AI-funktioner i en takt som
          många kunder har svårt att hänga med i.
        </p>
        <p>
          Samtidigt visar Microsofts egen rapport en obekväm sak: bara{" "}
          <strong>19 procent</strong> av AI-användarna befinner sig i det
          Microsoft kallar "Frontier-zonen" – där både individuell förmåga och
          organisatorisk beredskap är på plats. 65 procent är oroliga för att
          hamna efter, men 45 procent tycker det känns säkrare att fokusera på
          nuvarande mål än att designa om arbetet. Endast 13 procent säger att
          de belönas för att förändra hur arbetet utförs.
        </p>
        <p>
          Det är denna spänning rapporten kallar <em>Transformationsparadoxen</em>.
          Det är inte ett tekniskt problem. Det är ett organisatoriskt problem.
          Och det syns extra tydligt i ERP- och CRM-projekt.
        </p>
        <p>
          Microsofts bild kompletteras intressant av fristående analytiker.
          Gartner konstaterar i sin 2026 Hype Cycle att endast 17 procent av
          organisationer faktiskt har deployat AI-agenter, även om över 60
          procent säger sig planera det inom två år. Än mer påtagligt: Gartner
          förutspår att <strong>över 40 procent av alla agentic AI-projekt
          kommer avbrytas till slutet av 2027</strong> – ofta för att kostnader
          skenar, affärsvärdet inte blir tillräckligt tydligt eller för att
          governance och riskkontroller inte hinner byggas i samma takt som
          tekniken.
        </p>
        <p>
          McKinseys State of AI-rapport pekar i samma riktning: 88 procent av
          organisationer använder AI i någon funktion, men bara 6 procent
          kvalificerar som "AI high performers" med mätbar EBIT-effekt. Resten
          har piloter, demos och initiativ – men inte transformation.
        </p>
        <p>
          Det här är samma fenomen sett från olika håll. Microsoft kallar det
          Transformationsparadoxen, Gartner talar om gapet mellan ambition och
          leverans, McKinsey beskriver "pilot purgatory". Alla pekar på samma
          sak: organisationer har tillgång till verktygen, men har inte byggt
          om det runt omkring – och då stannar värdet ute.
        </p>

        <h3>Utvärderingsdialogen idag</h3>
        <p>
          I de upphandlingar jag följer hamnar diskussionen snabbt i ett
          välbekant spår. Funktionalitet, användargränssnitt, integrationer.
          Det är där upphandlingsmallarna landar, och det är där både partner
          och köpare har gemensam terräng att stå på. Det är ett bra, beprövat
          sätt att jämföra alternativ.
        </p>
        <p>
          När Copilot eller agenter kommer upp visas möjligheten – att man kan
          bygga egna agenter, att Copilot kan kopplas in i flöden, att Power
          Platform står redo för utveckling. Men diskussionen blir lätt "light"
          och glider tillbaka till grundfunktionaliteten i systemet. Det är
          inte konstigt. Det är där värdet är konkret, mätbart och
          presenterbart. Det är där en demo känns trygg.
        </p>
        <p>
          Det är ingen kritik mot någon part. Det är så samtalet ser ut idag.
          Men det är inte där den ägda intelligensen byggs upp.
        </p>

        <h2>Det är inte en fråga om att bygga själv eller köpa färdigt</h2>
        <p>
          Här ligger en vanlig missuppfattning. "Owned Intelligence" tolkas
          lätt som att man måste bygga allt själv – egna agenter, egna
          integrationer, eget AI-team. Det är inte vad det handlar om.
        </p>
        <p>Den verkliga frågan är förmåga.</p>
        <p>
          Har bolaget en intern kapacitet att förstå vad som byggs, varför, och
          hur det ska utvecklas vidare? Eller står man utanför i takt med att
          lösningen växer? Kan organisationen själv identifiera nya områden där
          agenter och Copilot skulle göra skillnad, eller måste den frågan
          alltid komma från partnern?
        </p>
        <p>
          En lösning som är fullt utvecklad av partnern kan vara teknisk
          excellent. Men om förståelsen för hur den fungerar och hur den ska
          vidareutvecklas i praktiken uteslutande sitter externt, är det
          svårare att bygga den långsiktiga intelligensen i bolaget. Här vill
          jag vara tydlig: många partners är duktiga på kompetensöverföring och
          vill att kunden ska bli starkare – men det behöver göras till en
          uttalad del av upplägget, inte något man hoppas ska "hända av sig
          själv".
        </p>
        <p>
          Det här ligger nära en av rapportens starkaste statistiska
          observationer: organisatoriska faktorer som kultur, chefsstöd och
          kompetensutveckling står för ungefär <strong>67 procent</strong> av
          AI:s reella påverkan, medan individuell mindset och beteende står för
          cirka 32 procent. Med andra ord – det är inte i första hand de
          enskilda medarbetarnas AI-kunskaper som avgör utfallet. Det är hur
          organisationen som helhet är riggad för att fånga upp och bygga
          vidare på det som agenter producerar.
        </p>
        <p>
          McKinsey publicerade i januari 2026 en analys specifikt om AI-agenter
          och ERP som kommer till en näraliggande slutsats. Deras rekommendation
          är att köparen tydligt skiljer på två saker: standardiserade
          kapaciteter som kan köpas in färdigt – och egen utveckling som
          reserveras för de områden där bolagets domänspecifika logik eller
          egna processer faktiskt skapar en konkurrensfördel. Det är samma
          princip som ligger bakom Owned Intelligence, formulerad från
          ERP-perspektivet. Värdet ligger inte i att bygga allt själv, och inte
          i att köpa allt färdigt – utan i att veta var skiljelinjen ska gå.
        </p>

        <figure className="my-10">
          <img
            src={ownedIntelligenceSkiljelinje}
            alt="Diagram som visar lager av eget, delvis eget och standard med etiketter Owned Intelligence, Implementation och Plattform"
            className="w-full rounded-lg "
            loading="lazy"
          />
          <figcaption className="text-sm text-muted-foreground italic mt-3 text-center">
            Skiljelinjen mellan standardiserade kapaciteter och Owned
            Intelligence i en Dynamics 365-lösning.
          </figcaption>
        </figure>

        <h2>Två risker som ofta missas</h2>
        <p>
          När jag pratar med kunder som står inför ett större Dynamics 365-val
          finns det två obekväma observationer värda att lyfta.
        </p>

        <h3>Risk 1: Eget bygge som blir personberoende</h3>
        <p>
          Bolag som väljer att bygga mycket själva – egna agenter, egna
          automationsflöden i Power Automate, egna integrationer – kan snabbt
          få fram värde. Men risken finns att kapaciteten samlas hos ett par
          nyckelpersoner internt. När en av dem byter jobb försvinner stora
          delar av förståelsen med dem. Dokumentationen halkar efter,
          lösningarna blir svåra att underhålla, och bolaget hamnar i en
          obekväm position. Det är en reell sårbarhet, särskilt i bolag där
          IT-organisationen redan är slimmad.
        </p>

        <h3>Risk 2: Total partnerlutning som tappar fart</h3>
        <p>
          Lutar man sig helt mot partnern kan utvecklingstakten ändå bli lägre
          än man tror – inte för att partnern saknar vilja, utan för att
          köparens interna prioriteringar lätt fylls av vardagsbehov som
          uppgraderingar, säkerhet och support. Om det saknas en gemensam
          roadmap, tydliga produktägare på köparsidan och en finansierad
          utvecklingsrytm (oavsett om den drivs av partnern, internt eller
          tillsammans), stannar Copilot- och agentarbetet ofta av. När
          initiativet ligger utanför den egna organisationen är det också lätt
          att insikterna om processer, data och beslutspunkter inte landar
          internt på samma sätt. Bolaget har lösningen, men riskerar att inte
          bygga den växande förståelsen av den.
        </p>
        <p>
          Inget av extremfallen är hållbart över tid. Verkligheten är en
          kombination, och frågan är hur den balansen designas redan från
          start.
        </p>

        <h2>Vad karaktäriserar de köpare som lyckas</h2>
        <p>
          I min erfarenhet återkommer tre saker hos de bolag som hanterar det
          här bra.
        </p>

        <h3>Bredd i engagemanget</h3>
        <p>
          Det räcker inte att en eller två eldsjälar driver frågan internt.
          Flera delar av organisationen behöver vara med – IT, verksamheten,
          ledningen. Annars blir den ägda intelligensen i praktiken ett par
          personers projekt, inte bolagets. Microsofts rapport bekräftar detta
          indirekt: bara 26 procent av AI-användarna säger att deras ledning är
          tydligt och konsekvent samkörda kring AI. Det är en av de starkaste
          indikatorerna i hela materialet på var organisationer fastnar.
        </p>

        <h3>Intern projektstruktur som speglar partnerns</h3>
        <p>
          Partnern arbetar i en projektstruktur med tydliga roller, leveranser
          och ansvarspunkter. Den strukturen behöver speglas på köparens sida.
          En motpart med tydliga roller, mandat och rutiner. Inte en ad
          hoc-grupp som möts när det brinner. När bägge sidor jobbar i
          parallella strukturer blir överlämningar tydligare, beslut tas
          snabbare, och kunskapen får en plats att landa i på köparens sida.
        </p>

        <h3>Insikt i den befintliga miljön</h3>
        <p>
          Här finns intern IT:s verkliga värde – insikten i den befintliga
          miljön, i historiska beslut, i hur verksamheten faktiskt fungerar i
          praktiken. Den kunskapen är inte något en partner kan ta med sig in i
          projektet. Den måste bäras av köparen, oavsett hur kompetent partnern
          är. Det är också där köparen alltid har ett strukturellt övertag som
          ofta underskattas i ett projekts tidiga fas.
        </p>
        <p>
          När dessa tre delar finns på plats blir det som byggs något bolaget
          faktiskt äger. Inte bara en lösning man har, utan en kapacitet man
          kan utveckla över tid.
        </p>

        <h2>Frågan köparen behöver ställa själv</h2>
        <p>
          I en typisk upphandling presenteras lösningar och utvärderingen
          handlar om funktion, ekonomi och leveransförmåga. Det är en bra och
          beprövad struktur, men frågan om var den långsiktiga intelligensen
          ska byggas upp ställer sig inte själv i den ramen. Den behöver komma
          från köparsidan – och tidigt nog för att påverka hur projektet
          faktiskt sätts upp.
        </p>
        <p>
          Några konkreta frågor som är värda att ta med in i diskussionen:
        </p>
        <ul>
          <li>
            Vilka delar av lösningen ska byggas av partnern, och vilka delar
            ska byggas tillsammans?
          </li>
          <li>
            Hur dokumenteras agenter, flöden och anpassningar så att kunskapen
            finns kvar hos oss?
          </li>
          <li>
            Hur ser vår egen organisation ut under och efter projektet – vilka
            roller behöver vi, och vilken mandatstruktur?
          </li>
          <li>
            Vilken plan finns för att intern IT och verksamhet ska kunna
            fortsätta utveckla lösningen efter go-live, även utan partnerns
            dagliga närvaro?
          </li>
          <li>
            Vilken kompetensöverföring är inplanerad – inte som en bisak i
            slutet, utan som en löpande del av projektet?
          </li>
        </ul>
        <p>
          Frågorna är inte tänkta att misstro partnern. De är tänkta att
          tydliggöra ansvar och kunskapsflöde tidigt – något som gynnar både
          köpare och partner.
        </p>
        <p>
          För köparen är detta i grunden den fråga som avgör vad upphandlingen
          faktiskt resulterar i på fem års sikt. Ett system, eller en förmåga.
        </p>
        <p>
          Microsofts rapport ger en bra anledning att lyfta in den frågan
          tidigt – innan funktioner och integrationer har lagt sig som ramen
          för hela diskussionen.
        </p>

        <aside
          aria-label="Källor"
          className="mt-12 p-6 rounded border border-border bg-secondary/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Källor
          </p>
          <ul className="!my-0 !pl-5 !space-y-2 text-sm text-muted-foreground list-disc">
            <li>
              Microsoft Work Trend Index 2026 – <em>Agents, human agency, and
              the opportunity for every organization</em> (maj 2026).
            </li>
            <li>
              Gartner – Hype Cycle for Artificial Intelligence, 2026
              (agent-adoption samt prognos om avbrutna agentic AI-projekt till
              slutet av 2027).
            </li>
            <li>
              McKinsey – The State of AI in 2026 (Global Survey) (andel "AI
              high performers" och koppling till mätbar EBIT-effekt).
            </li>
            <li>
              McKinsey – analys om AI-agenter och ERP (januari 2026)
              (rekommendationen att skilja på standardkapacitet vs.
              domänspecifik utveckling).
            </li>
          </ul>
        </aside>
      </>
    ),
  },
  {
    slug: "ai-i-erp-riskbild",
    title: "När AI gör jobbet i ERP: ett skifte i riskbild",
    metaTitle: "AI i ERP: när automatisering blir en affärsrisk | d365.se",
    metaDescription:
      "När AI går från assistans till agerande i ERP förändras riskbilden. Vad krävs av styrning, data och kontroll innan AI får fatta affärsnära beslut?",
    summary:
      "AI i affärssystem byter karaktär – från att svara på frågor till att utföra uppgifter. I ERP är det inte bara teknik, utan ett skifte i riskbild som kräver ny governance.",
    category: "Governance",
    tags: ["erp", "ai", "dynamics365", "governance", "agenter", "riskhantering"],
    products: ["Business Central", "Finance & SCM", "AI/Copilot/Agents"],
    publishedAt: "2026-04-24",
    author: THOMAS_LAINE,
    heroImage: aiErpRiskbildHero,
    readingTimeMinutes: 6,
    freshness: {
      status: "older",
      note: "Skriven i april 2026, innan Build 2026 och GA av Copilot Cowork. Resonemanget om riskbild och governance håller, men senare 2026-sidor ger en uppdaterad bild av hur AI-agenter nu landar i Dynamics 365.",
      newerArticles: [
        {
          slug: "ai-skiftet-dynamics-365-build-2026",
          label: "AI-skiftet i Dynamics 365 efter Microsoft Build 2026",
        },
        {
          slug: "copilot-cowork-dynamics-365",
          label: "Copilot Cowork är här – vad betyder det för Dynamics 365?",
        },
      ],
    },
    content: (

      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          AI i affärssystem är på väg att byta karaktär – från att svara på
          frågor till att utföra uppgifter. I ERP är det inte bara en teknisk
          utveckling. Det är ett skifte i riskbild som förändrar vad god
          styrning måste omfatta.
        </p>

        <aside className="my-10 rounded-md border border-[#9CC2E5] bg-[#DEEBF7] px-7 py-6">
          <p className="!text-[1.25rem] !font-bold !text-[#1F4E79] !mb-3 !mt-0">
            I korthet
          </p>
          <ul className="!my-0 !pl-7 !space-y-2 list-disc marker:text-[#1F4E79] !text-foreground/90">
            <li>AI i ERP går från assistans till att agera inom givna ramar.</li>
            <li>
              Felmarginalen i ERP är liten: misstag kan slå mot ekonomi, leverans
              och compliance.
            </li>
            <li>
              Governance, datakvalitet och behörigheter blir avgörande långt innan
              affärsvärdet.
            </li>
          </ul>
        </aside>

        <p>AI i affärssystem är på väg att byta karaktär.</p>
        <p>
          Det handlar inte längre bara om assistenter som hjälper en användare
          att skriva, söka eller sammanfatta. Nästa steg är att AI får ett
          tydligare uppdrag i själva verksamhetslogiken: att kvalificera,
          föreslå, trigga, följa upp och i vissa fall agera inom givna ramar.
        </p>
        <p>Det låter som en teknisk utveckling. I praktiken är det också ett skifte i riskbild.</p>
        <p>
          När systemet börjar agera förändras inte bara vad ERP-plattformen kan
          göra. Det förändrar också vilka frågor som måste ställas innan det
          sker. Den här artikeln handlar om just det skiftet – vad det innebär,
          varför ERP är ett särfall och vilka tre områden som avgör om
          agentbaserad AI blir en kontrollerad förbättring eller en ny
          riskkälla.
        </p>

        <h2>Steget alla missar: från assistent till agent</h2>
        <p>Den första vågen av generativ AI i affärssystem har i stort handlat om assistans.</p>
        <ul>
          <li>Sammanfatta ett kundmöte.</li>
          <li>Föreslå en formulering.</li>
          <li>Ta fram en rapport.</li>
          <li>Förklara ett fält.</li>
          <li>Sök fram nästa steg.</li>
        </ul>
        <p>
          Nyttigt, absolut. Men grundlogiken har varit densamma: användaren ber
          om hjälp, AI svarar.
        </p>
        <p>
          Det som nu håller på att växa fram är något annat. AI används inte
          bara för att stötta en individ, utan för att driva uppgifter mot ett
          mål inom ramen för processer, data och regler. Den kan bryta ned ett
          uppdrag i delmoment, arbeta mot levande affärsdata och återkomma när
          mänskligt omdöme krävs.
        </p>

        <aside className="my-10 rounded-md border border-[#9CC2E5] bg-[#DEEBF7] px-7 py-6">
          <p className="!text-[1.25rem] !font-bold !text-[#1F4E79] !mb-3 !mt-0">
            Exempel: agentbaserat beteende i ERP
          </p>
          <p className="!my-0 !text-foreground/90 leading-[1.75]">
            En agent kan övervaka avvikelser i order och leverans, föreslå
            korrigeringar, trigga en uppgift till rätt roll och – om ni tillåter
            det – skapa ett utkast till kreditnota, uppdatera leveransdatum eller
            initiera en attestkedja. Poängen är inte att den <em>kan</em> göra
            det, utan vad den <em>får</em> göra utan mänskligt beslut.
          </p>
        </aside>

        <p>Det är där frågan blir mer intressant.</p>
        <p>
          För när AI flyttar närmare själva exekveringen räcker det inte längre
          att prata om funktionalitet. Då måste man också prata om kontroll.
        </p>

        <h2>Varför ERP inte tål ”AI på chans”</h2>
        <p>
          Det är lätt att tala om AI generellt, som om samma logik gäller
          överallt. I ERP gör den inte det.
        </p>
        <p>
          ERP är ett särfall därför att felmarginalen är så mycket mindre. Ett
          misstag i ett affärssystem stannar sällan vid ett felaktigt svar på en
          skärm. Det kan slå mot redovisning, leveransflöden, efterlevnad,
          betalningar, lager, attestkedjor eller kundrelationer.
        </p>
        <p>
          Det gör att agentbaserad AI i ERP inte i första hand är en fråga om
          hur mycket som går att automatisera. Det är en fråga om vad som{" "}
          <em>får</em> automatiseras, under vilka villkor och med vilka spärrar.
        </p>
        <p>
          Skillnaden är inte liten. I en Office-miljö är konsekvensen av ett
          dåligt AI-förslag oftast ett dåligt dokument. I ett ERP-system är
          konsekvensen av ett felaktigt beslut något som syns i balansräkningen,
          leveransprecisionen eller revisionsspåret.
        </p>
        <p>
          Det är också därför god styrning runt agentbaserad AI i ERP inte är en
          biprodukt. Det är grundförutsättningen.
        </p>

        <h2>Governance är inte en bilaga – det är själva leveransen</h2>
        <p>
          När AI börjar agera i eller runt ERP blir governance inte en bilaga
          till projektet. Den blir en del av själva leveransen.
        </p>
        <p>
          Här är tre områden som avgör om agentbaserad AI blir en kontrollerad
          förbättring eller en ny riskkälla.
        </p>

        <h3>1) Vad får agenten faktiskt göra?</h3>
        <p>
          I många ERP-nära flöden kommer principen länge att behöva vara enkel:
          agenten föreslår, människan godkänner. Särskilt i processer nära
          ekonomi, moms, betalningar, masterdata och andra områden där små fel
          kan få oproportionerligt stora konsekvenser.
        </p>
        <p>
          Det avgörande är inte vilka funktioner som är tekniskt möjliga. Det
          avgörande är var gränserna går och vem som äger dem.
        </p>

        <h3>2) Håller datan för mer automation?</h3>
        <p>
          Agentbaserad AI blir aldrig bättre än de strukturer den får arbeta
          med. Dubbletter, fritext där det borde finnas attribut, lokala
          specialvarianter och svag masterdata är inte bara irritationsmoment.
          De förskjuter hela nyttologiken.
        </p>
        <p>
          Många bolag kommer att upptäcka att värdet i AI inte främst bromsas av
          modellen, utan av att deras datagrund inte är tillräckligt användbar
          för att bära mer handlande automation.
        </p>

        <h3>3) Vilka behörigheter får agenten – i praktiken?</h3>
        <p>
          Behörigheter har länge varit en kontrollfråga. I en agentbaserad
          kontext blir de också en AI-säkerhetsfråga. En agent ser och agerar
          med de rättigheter den tilldelas. Ärvt för bred åtkomst, generösa
          integrationskonton och slapp struktur i åtkomstmodellen blir snabbt
          ett större problem när ett mer aktivt lager kopplas ovanpå.
        </p>
        <p>
          Det här är inte tekniska detaljer i periferin. Det är frågor som går
          rakt in i affärsrisk, ansvar och beslutskvalitet.
        </p>

        <h2>Skiftet förändrar också vad ett bra partnerval måste innehålla</h2>
        <p>
          Ett skifte av den här typen syns inte bara i tekniken. Det syns i hur
          ERP-projekt måste utformas, styras och följas upp över tid – och
          därmed också i vad ni ska kräva av den partner som bygger lösningen åt
          er.
        </p>
        <p>
          Partnerfrågan är inte ett separat spår vid sidan av AI-diskussionen.
          Den är en del av den. I nästa artikel tittar vi på vad det konkret
          betyder: vilka frågor som avslöjar om partnern förstått skiftet,
          varför partnervalet är en del av affärscaset och varför ”vi väntar”
          kan bli en dyrare position än den låter.
        </p>
      </>
    ),
  },
  {
    slug: "partnervalet-avgor-erp-crm-projekt",
    title: "Den största risken sitter sällan i systemet. Den sitter i partnern.",
    metaTitle: "Partnervalet avgör ERP- och CRM-projekt | d365.se",
    metaDescription:
      "I ERP- och CRM-projekt ligger den största risken sällan i produkten – utan i partnern. Så strukturerar du partnervalet för att skydda budget, adoption och beslut.",
    summary:
      "Produktvalet får mest tid i upphandlingen. Men det är partnern som avgör om Dynamics 365-projektet håller budget, får adoption och blir möjligt att försvara i efterhand.",
    category: "Partnerval",
    tags: ["partnerval", "upphandling", "erp", "crm", "dynamics365", "governance"],
    products: ["Business Central", "Finance & SCM", "Sales", "Customer Service"],
    publishedAt: "2026-05-05",
    author: THOMAS_LAINE,
    heroImage: partnervaletAvgorHero,
    readingTimeMinutes: 7,

    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          I många upphandlingar läggs den största delen av tiden på produktvalet.
          Men när ERP- eller CRM-projekt inte levererar som tänkt handlar det
          oftast mindre om produkten – och mer om genomförandet. Och
          genomförandet avgörs i hög grad av partnern.
        </p>

        <aside className="my-10 rounded-md border border-[#9CC2E5] bg-[#DEEBF7] px-7 py-6">
          <p className="!text-[1.25rem] !font-bold !text-[#1F4E79] !mb-3 !mt-0">
            I korthet
          </p>
          <ul className="!my-0 !pl-7 !space-y-2 list-disc marker:text-[#1F4E79] !text-foreground/90">
            <li>Partnervalet görs ofta för sent och för grunt i upphandlingen.</li>
            <li>
              Tre risker dominerar: kostnaden drar iväg, systemet används inte
              som tänkt, beslutet blir svårt att försvara.
            </li>
            <li>
              Köparsidig vägledning, rätt frågor i säljprocessen och en
              strukturerad utvärdering minskar risken markant.
            </li>
          </ul>
        </aside>

        <p>
          Vilket affärssystem passar bäst? Hur står sig Dynamics 365 mot
          alternativen? Vilka moduler behövs? Vilka funktioner är kritiska – och
          vilka är egentligen bara nice-to-have?
        </p>
        <p>
          Demos bokas. Jämförelsematriser fylls i. Referensbesök genomförs. Det
          är inte fel arbete. Men det är sällan där den största risken ligger.
        </p>
        <p>
          Två organisationer kan välja exakt samma plattform och ändå få helt
          olika utfall. Skillnaden ligger i genomförandet: vem som ställer rätt
          frågor tidigt, vem som vågar säga ifrån när scope växer av fel skäl —
          och vem som faktiskt har gjort den här typen av projekt i den här
          typen av verksamhet förut.
        </p>
        <p>
          Partnerjämförelse görs förstås. Men ofta för sent. Och ofta för grunt.
          När produkten väl är vald jämförs ofta två eller tre partners, främst
          på pris, säljpresentation och känslan i rummet. Det är en jämförelse —
          men inte alltid en utvärdering som gör partners verkligt jämförbara.
        </p>
        <p>Och det är där risken börjar.</p>

        <h2>1. Kostnaden drar iväg</h2>
        <p>
          I större ERP- och CRM-projekt är budget- och tidsavvikelser sällan
          marginella när scope, integrationer, datamigrering och kundanpassningar
          börjar växa.
        </p>
        <p>Drivkrafterna är välkända:</p>
        <ul>
          <li>krav som inte var tillräckligt tydliga vid avtalsskrivning</li>
          <li>ett anbud som bygger på underskattat scope</li>
          <li>svag förändringshantering hos beställaren</li>
          <li>
            en partnerorganisation som inte bemannar projektet som man uppfattade
            i säljfasen
          </li>
          <li>
            för många anpassningar som smyger sig in innan standardprocesserna
            ens har prövats
          </li>
        </ul>
        <p>
          Här blir prisjämförelsen i upphandlingen lätt missvisande. Ett lågt
          anbud kan se attraktivt ut i beslutsunderlaget, men bli dyrt när
          projektet väl rullar. Ett högre anbud kan i praktiken vara billigare
          om det bygger på bättre förståelse för omfattning, risker och
          nödvändig bemanning.
        </p>
        <p>
          Engagemang i säljfasen säger heller inte alltid särskilt mycket om
          leveransförmågan. Det viktiga är inte bara vad partnern lovar. Det är
          hur partnern arbetar när verkligheten börjar störa planen.
        </p>
        <p>
          Det finns sätt att skydda sig redan innan projektet startar. Tydligt
          definierat scope. Fasade leveranser med beslutspunkter. En
          förändringsprocess där båda parter har incitament att hålla ramen. Och
          en partner som vågar säga nej till önskemål som inte hör hemma i
          första leveransen.
        </p>
        <p>
          Avtalet sätter ramen. Men det är partnerns arbetssätt som avgör om
          ramen håller.
        </p>

        <h2>2. Systemet införs – men används inte som tänkt</h2>
        <p>
          Det dyraste systemet är inte alltid det med högst licenskostnad. Det
          är systemet som köps in, implementeras – och sedan inte används som
          det var tänkt.
        </p>
        <p>
          Det syns inte alltid direkt. Säljteamet fortsätter föra egna
          anteckningar vid sidan av CRM. Ekonomi kör fortfarande rapporter
          manuellt. Kundservice bygger egna undantag utanför processen. Operativ
          data blir fragmenterad. Ledningen får inte den överblick som
          investeringen skulle skapa.
        </p>
        <p>
          Adoption är sällan ett tekniskt problem i första hand. Det är en följd
          av hur projektet har drivits från start.
        </p>
        <p>
          Har partnern förstått hur verksamheten faktiskt arbetar? Har
          processerna utmanats – eller bara ritats av? Har slutanvändarna
          involverats tidigt nog? Har utbildningen kopplats till verkliga
          arbetsflöden, eller bara till funktioner i systemet?
        </p>
        <p>
          En partner som behandlar adoption som en aktivitet i slutet av
          projektet har redan tappat för mycket. Adoption byggs inte vid
          go-live. Den byggs i varje beslut som tas långt innan dess.
        </p>

        <h2>3. Beslutet blir svårt att försvara</h2>
        <p>
          Det här är den dimension som sällan syns i en business case-mall. Men
          den finns alltid i rummet.
        </p>
        <p>
          CFO:n som godkände investeringen. CIO:n som rekommenderade
          arkitekturen. VD:n som drev igenom beslutet. Projektägaren som stod
          bakom partnerrekommendationen.
        </p>
        <p>
          När ett ERP- eller CRM-projekt inte levererar ska det förklaras. I
          ledningen. I styrelsen. Ibland även inför ägare. Då handlar frågan
          inte bara om vad som gick fel. Den handlar också om hur beslutet togs.
        </p>
        <p>
          Fanns en strukturerad utvärdering? Fanns relevanta referenser? Fanns
          en tydlig koppling mellan partnerns erfarenhet och verksamhetens
          behov? Fanns neutralt underlag – eller byggde valet mest på pris,
          relationer och presentationer?
        </p>
        <p>
          Ett genomarbetat val som ändå går snett kan förklaras. Ett val som i
          praktiken byggde på lägsta pris och bäst säljmöte är betydligt svårare
          att försvara.
        </p>
        <p>
          Det är därför partnervalet inte bara är en inköpsfråga. Det är en
          ledningsfråga.
        </p>

        <h2>Hur risken minskar</h2>
        <p>
          Poängen är inte att välja "rätt" partner på känsla – utan att göra
          partnervalet jämförbart tidigt. Risken i ett ERP- eller CRM-val går
          inte att eliminera. Men den går att hantera. Tre saker gör störst
          skillnad.
        </p>

        <h3>Köparsidig vägledning tidigt i processen</h3>
        <p>
          Partnerlandskapet är svårt att överblicka för den som bara gör den här
          typen av val vart tionde eller femtonde år.
        </p>
        <p>
          Vilka partners är starka inom Business Central? Vilka kan Finance &
          Supply Chain på riktigt? Vilka har erfarenhet från tillverkning,
          distribution, retail, tjänstebolag eller offentlig verksamhet? Vilka
          är starka på CRM, kundservice, fältservice eller contact center?
        </p>
        <p>
          När kartläggningen görs av någon som inte själv vill vinna
          implementationen blir bilden ofta klarare. Inte perfekt. Men mindre
          färgad.
        </p>

        <h3>Rätt frågor i säljprocessen</h3>
        <p>
          Det räcker inte att fråga efter pris, tidplan och referenser. Man
          behöver förstå hur partnern faktiskt arbetar.
        </p>
        <p>
          Hur ser metodiken ut? Vilka personer sätts på projektet? Vilken
          erfarenhet har de av liknande verksamheter? Det säger något om
          leveransförmågan.
        </p>
        <p>
          Hur hanteras scopeförändringar? Vad ingår inte i offerten? När
          rekommenderar partnern att kunden inte ska anpassa? Det säger något om
          hur partnern arbetar när verkligheten möter planen.
        </p>
        <p>
          Det är ofta i svaren på de frågorna som skillnaden mellan partners
          blir synlig. Inte i standardpresentationen.
        </p>

        <h3>Strukturerad utvärdering</h3>
        <p>
          En bra utvärdering handlar inte om poängmatriser för poängmatrisens
          skull. Den handlar om att tvinga fram jämförbarhet. Mellan partners.
          Mellan arbetssätt. Mellan erfarenhet. Mellan faktisk leveransförmåga
          och säljlöften.
        </p>
        <p>
          Utan struktur glider besluten lätt mot det som känns enklast att
          motivera i stunden: lägst pris, starkast relation eller mest
          övertygande presentation. Men ERP- och CRM-projekt avgörs inte i
          presentationen. De avgörs i genomförandet.
        </p>

        <h2>Produktvalet är viktigt. Men partnervalet avgör vad det blir av det.</h2>
        <p>
          Dynamics 365, Business Central, Finance & Supply Chain, Sales,
          Customer Service och andra moderna affärsplattformar kan skapa stort
          värde. Men plattformen realiserar inte värdet av sig själv.
        </p>
        <p>
          Det görs genom rätt avgränsningar, rätt metodik, rätt bemanning, rätt
          förändringsledning och rätt förståelse för verksamheten.
        </p>
        <p>
          Därför bör partnervalet inte behandlas som nästa steg efter
          systemvalet. Det bör vara en central del av beslutet från början.
        </p>
        <p>
          På d365.se erbjuder vi köparsidigt stöd för att strukturera valet av
          Dynamics 365-partner – utifrån lösningsområde, bransch, erfarenhet och
          faktiskt leveransupplägg.
        </p>
        <p>
          Målet är att beslutet inte bara ska kännas rätt i upphandlingen – utan
          också vara möjligt att förklara och försvara när projektet möter
          verkligheten.
        </p>
      </>
    ),
  },
  {
    slug: "dynamics-365-retail-ehandel",
    title: "Dynamics 365 för Retail & e-handel",
    metaTitle: "Dynamics 365 för retail & e-handel – guide & partners",
    metaDescription:
      "Dynamics 365 för retail & e-handel ger POS, lager, omnikanal och kunddata i en plattform. Köparsidig guide med kostnad, fallgropar och svenska partners.",
    summary:
      "Dynamics 365 (BC, F&SCM och Commerce) fungerar som back-office för retail- och e-handelsbolag – ekonomi, lager, kund och kanal i samma plattform. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["retail", "e-handel", "dynamics365", "business central", "commerce", "customer insights"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Insights",
      "Customer Service",
      "Contact Center",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: detaljhandelImg,
    readingTimeMinutes: 9,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Retail & E-handel
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och vägledning om listade partners.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Svensk detaljhandel och e-handel befinner sig mitt i en strukturell
          omvandling. Gränsen mellan fysisk butik och digital kanal suddas ut,
          och kundernas förväntningar sätter press på hela värdekedjan. Snabba
          leveranser, rätt lagersaldo i realtid, personaliserade erbjudanden och
          en konsekvent upplevelse oavsett kanal – det är inte längre
          differentiering utan ett grundkrav.
        </p>
        <p>
          Den tekniska komplexiteten ökar i takt med ambitionerna. Äldre system
          klarar inte av att hantera den mängd kanaler, dataflöden och
          integrationer som en modern handelsverksamhet kräver. Det är i det
          gapet som behovet av ett modernt affärssystem uppstår.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska retail- och
          e-handelsföretag som vill samla ERP och CRM i en gemensam plattform —
          från inköp och lager till försäljning, kundservice och marknadsföring.
          Systemet är modulärt, vilket innebär att organisationen kan börja med
          det mest akuta behovet och bygga ut successivt.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>
        <p>
          Nedan beskrivs de arbetsprocesser som är mest relevanta för branschen,
          och vilket systemstöd Dynamics 365 erbjuder.
        </p>

        <h3>Business Central: Ekonomi, lager och grundläggande handelsflöden</h3>
        <p>
          Dynamics 365 Business Central är det naturliga valet för små och
          medelstora handelsföretag som behöver ett sammanhållet system för
          ekonomi, inköp, lagerstyrning och försäljning. Systemet hanterar hela
          ordercykeln – från inköpsorder och inleverans till fakturering och
          bokföring – i ett och samma flöde.
        </p>
        <ul>
          <li>Orderhantering från flera kanaler med koppling till lager och ekonomi</li>
          <li>Lagerstyrning med realtidssynlighet över flera lagerställen</li>
          <li>Kampanj- och prishantering integrerat med försäljningsflödet</li>
          <li>Ekonomisk rapportering och marginalkontroll per kanal eller produktkategori</li>
        </ul>
        <p>
          BC passar handelsföretag som vill ha ett brett allt-i-ett-system utan
          att investera i den komplexitet som en F&amp;SCM-implementation
          innebär.
        </p>

        <h3>Finance &amp; Supply Chain Management: Avancerad logistik och ekonomistyrning</h3>
        <p>
          För större retail-kedjor med komplexa logistikflöden, flera bolag och
          höga krav på prognosticering och lagerstyrning är Dynamics 365
          Finance &amp; Supply Chain Management rätt nivå. Systemet hanterar
          hela supply chain-kedjan med precision.
        </p>
        <ul>
          <li>Efterfrågeprognoser och automatiserad lagerpåfyllnad</li>
          <li>Avancerad lagerhantering med WMS-funktionalitet</li>
          <li>Ekonomistyrning över flera bolag och valutor</li>
          <li>Commerce-modul med stöd för kassasystem (POS) och omnichannel-flöden</li>
        </ul>
        <p>
          F&amp;SCM och Commerce-modulen är det naturliga valet för kedjor som
          vill samla fysisk butik och e-handel i ett gemensamt systemlandskap,
          med realtidsdata om lager, kund och kampanj i varje kassamiljö.
        </p>

        <h3>Sales &amp; Customer Insights: Kunddata, segmentering och personalisering</h3>
        <p>
          Retail och e-handel är branscher där kunddata är en strategisk
          tillgång. Dynamics 365 Customer Insights aggregerar kunddata från
          butik, webb och kundtjänst till en enhetlig kundprofil. Det möjliggör
          segmentering, lojalitetsprogram och riktade kampanjer baserade på
          faktiskt beteende – inte antaganden.
        </p>
        <ul>
          <li>Samling av kunddata från alla kanaler till en enhetlig profil</li>
          <li>Segmentering och personaliserade erbjudanden baserade på köphistorik</li>
          <li>Kampanjautomation och mätning av marknadsföringseffekt</li>
        </ul>
        <p>
          Dynamics 365 Sales används av handelsföretag med en mer komplex
          B2B-försäljning – till exempel grossister eller varumärken som säljer
          direkt till återförsäljare – där pipeline-hantering och
          relationsuppföljning är centralt.
        </p>

        <h3>Customer Service &amp; Contact Center: Ärenden, returer och kundlojalitet</h3>
        <p>
          En välhanterad kundservice är i detaljhandeln direkt kopplad till
          lojalitet och återköp. Dynamics 365 Customer Service och Contact
          Center ger kundtjänstteamet en samlad bild av kundens historia oavsett
          kontaktväg – telefon, e-post, chatt eller sociala medier.
        </p>
        <ul>
          <li>Ärendehantering med koppling till kundprofil och orderhistorik</li>
          <li>Returhantering (RMA) integrerat med lager och ekonomi</li>
          <li>Intelligent dirigering av kontakter vid hög ärendevolym</li>
        </ul>
        <p>
          Returhantering är en av de mest kostnadsdrivande processerna inom
          e-handel. Partners med djup erfarenhet av att konfigurera RMA-flöden
          och integrera dessa med lagerprocesser skapar påvisbar operativ
          besparing.
        </p>

        <h2>Listade partners inom Retail &amp; E-handel</h2>
        <p>
          Nedan presenteras de åtta partners som är listade för branschen på
          d365.se, med en kort beskrivning av deras profil och vad de framförallt
          är kända för inom det aktuella produktområdet.
        </p>

        <h3>Business Central</h3>

        <p>
          <strong>adbriq</strong><br />
          <em>Spetskompetens: Business Central | Fokus: mode, sport och textil</em>
        </p>
        <p>
          adbriq är en nischad partner med djup förståelse för handelsföretag
          inom mode, sport och textil. Deras styrka är att kombinera
          branschspecifik proceskunskap med Business Central-implementationer
          som faktiskt matchar hur handelsföretag inom dessa segment arbetar —
          sortimentslogik, säsongsvariationer och leverantörsrelationer
          inkluderade.
        </p>

        <p>
          <strong>Goodfellows</strong><br />
          <em>
            Spetskompetens: Business Central | AI Integration Partner | Fokus:
            förutsägbar leverans
          </em>
        </p>
        <p>
          Goodfellows profilerar sig på trygghet och kontroll i leveransen.
          Deras erfarenhet från handel, produktion och distribution gör dem till
          ett relevant val för handelsföretag som prioriterar en partner som tar
          tydligt ansvar för att lösningen fungerar i praktiken – inte enbart i
          projektplanen.
        </p>

        <h3>Finance &amp; Supply Chain Management</h3>

        <p>
          <strong>BE-terna</strong><br />
          <em>Spetskompetens: Finance, Supply Chain Management, Commerce</em>
        </p>
        <p>
          BE-terna är en av de partners i listan som tydligast kombinerar
          F&amp;SCM med Commerce-modulen. Deras fokus på detaljhandel och
          e-handel inkluderar lösningar för kedjor som vill samla kassasystem
          och back-office i ett gemensamt Microsoft-ekosystem. Rätt val för
          organisationer med komplex logistik och krav på realtidsdata i
          butiksmiljö.
        </p>

        <h3>Breda partners med kompetens inom flera produktområden</h3>

        <p>
          <strong>Fellowmind</strong><br />
          <em>Spetskompetens: Business Central, Finance, SCM, Sales, Customer Insights</em>
        </p>
        <p>
          Fellowmind är en av de större europeiska Microsoft-partnerna och en
          av få i listan som täcker hela spektret från ERP till CRM. För
          retail-organisationer som vill ha en enda partner med kapacitet att
          hantera hela plattformen – inklusive marknadsföring och försäljning —
          är Fellowmind ett relevant alternativ. Styrkan ligger i bredd och
          geografisk täckning.
        </p>

        <p>
          <strong>Nexer</strong><br />
          <em>
            Spetskompetens: BC, Finance, SCM, Sales, Customer Insights, Customer
            Service, Contact Center | AI Integration Partner
          </em>
        </p>
        <p>
          Nexer har den bredaste kompetensportföljen av de listade partners och
          täcker samtliga relevanta Dynamics 365-applikationer för branschen.
          För retail-organisationer som planerar en mer ambitiös
          plattformssatsning – där ERP, CRM och kontaktcenter ska hänga samman —
          erbjuder Nexer kapacitet att hålla ihop hela arkitekturen. Som AI
          Integration Partner har de även ett tydligt fokus på nästa generations
          systemleveranser.
        </p>

        <IndustryPartnerListInline industry="Retail & E-handel" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Dynamics 365 är en bred plattform och alla listade partners har en
          relevant grundkompetens. Det som skiljer dem åt är djupet inom
          specifika produktområden, branscherfarenhet och leveransmodell.
        </p>
        <p>
          En BC-implementation för ett medelstort handelsbolag med 50 miljoner
          i omsättning ställer andra krav på partner än en F&amp;SCM-
          implementation med Commerce för en kedja med 30 butiker och ett
          centrallager. Frågan är inte bara vilket system – utan vilken partner
          som faktiskt har gjort det du planerar att göra, i en organisation som
          liknar din.
        </p>
        <p>
          På d365.se kan du filtrera partners per produktområde, läsa deras
          branschbeskrivningar och jämföra kompetenser sida vid sida.
          Plattformen är köparsidig – vägledningen är skriven utifrån köparens
          perspektiv och inga partners betalar för att synas högre eller
          beskrivas mer fördelaktigt.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/retail-ehandel/">d365.se/branscher/retail-ehandel</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för en retail- eller e-handelsverksamhet?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}}, Supply Chain Management {{price:supply-chain-management:short}} och Commerce {{price:commerce:short}} – relevant för retailkedjor med POS och omnikanal. Customer Insights ligger på {{price:customer-insights:default}}.\n\nImplementationskostnaden för ett medelstort retail- eller e-handelsbolag landar typiskt i intervallet 800 000 – 4 000 000 kr beroende på POS-integrationer, antal butiker, e-handelsplattform och behov av branschtillägg. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter retail- och e-handelsbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) underskattad integration mot POS, e-handelsplattform (Shopify, Magento, Centra) och marknadsplatser; (2) lager- och prislogik som inte synkroniseras i realtid mellan kanaler vilket skapar översålda artiklar; (3) returflöden och lojalitetshantering som inte modelleras tidigt; och (4) att masterdata för artiklar, varianter och kampanjpriser hanteras i olika system.\n\nDet är också vanligt att man underskattar förändringsarbetet i butiksleden – kassapersonal behöver utbildning och tydliga processer för det nya systemet.",
      },
      {
        question: "Dynamics 365 Commerce vs Shopify, Centra och specialiserade retail-system – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade e-handelsplattformar (Shopify, Centra, Litium) och retail-POS (LS Retail, K3, Tasklet) har djup branschfunktionalitet och kommer ofta snabbare i drift. Dynamics 365 Commerce är en bredare plattform som täcker hela kedjan från lager och ekonomi till POS, e-handel och CRM i ett gemensamt dataekosystem.\n\nDen vanligaste arkitekturen i medelstora retailbolag är att behålla en specialiserad e-handelsplattform och låta D365 (BC eller F&SCM) vara back-office för ekonomi, lager och kund – med integration däremellan. För större kedjor med många butiker och behov av enhetlig POS är D365 Commerce eller LS Central (BC-baserat) ofta motiverat. Frågan att ställa: hur mycket av kanalspecifik logik klarar D365 utan kostsam särutveckling?",
      },
      {
        question: "Vad säger andra retail- och e-handelsbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope. Bolag som infört D365 som back-office med specialiserad e-handel och POS framför rapporterar generellt god utväxling – särskilt på lager, inköp, ekonomi och kunddata. Bolag som försökt täcka hela kedjan inklusive POS och e-handel direkt i D365 utan branschtillägg har oftare stött på dyr särutveckling och förlängda projekt.\n\nEn återkommande lärdom är att tidigt definiera vilken systemkomponent som äger artikeldata, pris och lager, och att be partnern uppvisa konkreta referenscase från retail eller e-handel med liknande volym, kanalmix och butiksantal.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för retail & e-handel?",
        answer:
          "Det beror på er kanalmix och storlek. På d365.se listar vi flera partners inom retail och e-handel – vissa är specialiserade på BC med LS Central för butikskedjor, andra arbetar med F&SCM och Commerce för större aktörer, och andra fokuserar på CRM och Customer Insights för att förstå kundbeteende över kanaler.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i retail eller e-handel av jämförbar storlek, (2) vilka POS- och e-handelsintegrationer de genomfört och mot vilka system, och (3) en tydlig arkitekturskiss över vad D365 ska göra respektive vad specialistsystemen behåller.",
      },
    ],
  },
  {
    slug: "dynamics-365-tillverkningsindustri",
    title: "Dynamics 365 för tillverkningsindustrin",
    metaTitle: "Dynamics 365 för tillverkningsindustri – guide & partners",
    metaDescription:
      "Dynamics 365 för tillverkning täcker MRP, BOM, kvalitet, spårbarhet och MES-integration. Köparsidig guide med kostnad, fallgropar och svenska partners.",
    summary:
      "Dynamics 365 (F&SCM eller BC Premium) är ryggraden för svenska tillverkningsbolag – planering, inköp, lager, kvalitet och ekonomi i en plattform, kompletterad med MES och PLM. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["tillverkning", "industri", "dynamics365", "business central", "finance scm", "field service"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Field Service",
      "Sales",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: tillverkningImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Tillverkningsindustri
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Svensk tillverkningsindustri är bred – diskret produktion,
          processtillverkning, projektbaserad tillverkning, make-to-order,
          engineer-to-order. Det som är gemensamt är att komplexiteten är hög
          och att konsekvenserna av ett affärssystem som inte håller måttet
          syns direkt: i felaktiga kalkyler, produktionsstopp, leveransförseningar
          och bundet kapital.
        </p>
        <p>
          Branschen befinner sig mitt i en strukturell omvandling. Industri 4.0
          är inte längre ett framtidsbegrepp utan ett konkurrenskrav. Uppkopplade
          produktionsmiljöer, realtidsdata från golvet, integration mot MES och
          SCADA – det ställer helt andra krav på affärssystemet än vad som
          gällde för tio år sedan. Samtidigt pressas marginaler av volatila
          råvarupriser och störningar i leverantörskedjor, vilket kräver
          snabbare beslut och bättre prognoser.
        </p>
        <p>
          Microsoft Dynamics 365 används av tillverkande företag i hela spannet —
          från medelstora verkstadsföretag på Business Central till stora
          internationella koncerner på Finance &amp; Supply Chain Management.
          Plattformen täcker hela värdekedjan från inköp och produktionsplanering
          till eftermarknad och service, med möjlighet att integrera mot externa
          system via öppna API:er.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>
        <p>
          Nedan beskrivs de arbetsprocesser som bär störst vikt i branschen,
          och vilket systemstöd Dynamics 365 erbjuder per produktområde.
        </p>

        <h3>Finance &amp; Supply Chain Management: Produktionsplanering, logistik och ekonomistyrning</h3>
        <p>
          F&amp;SCM är standardvalet för medelstora till stora tillverkande
          företag med komplexa krav. Systemet hanterar hela produktionsflödet
          med hög precision och stödjer alla vanliga tillverkningsprinciper.
        </p>
        <ul>
          <li>Produktionsplanering med MRP/MPS – materialbehovsplanering och kapacitetsplanering i ett sammanhållet flöde</li>
          <li>Avancerad lagerhantering (WMS) med stöd för serienummer- och batchspårbarhet genom hela kedjan</li>
          <li>Kvalitetskontroll med obligatoriska kontrollpunkter, avvikelsehantering och karantänlager</li>
          <li>Produktkonfiguration för komplexa varianter (Configure-to-Order) och korrekta för- och efterkalkyler</li>
          <li>Ekonomistyrning med produkter i arbete (PIA), projektredovisning och konsoliderad finansiell rapportering</li>
          <li>Integration mot MES och SCADA via standardiserade API:er för realtidsdata från produktionsgolvet</li>
        </ul>

        <h3>Business Central: ERP för mindre och medelstora tillverkare</h3>
        <p>
          Business Central passar tillverkande SMB-företag som behöver ett
          brett och hanterbart system utan F&amp;SCM:s komplexitet och
          kostnadsnivå. Systemet täcker hela flödet från inköp till produktion
          och leverans.
        </p>
        <ul>
          <li>Produktionsorder, stycklistor (BOM) och enkla till medelkomplexa produktionsflöden</li>
          <li>Lagerstyrning med realtidssynlighet och grundläggande spårbarhet</li>
          <li>Inköpsprocessen från behov till betalning med leverantörshantering</li>
          <li>Ekonomi, fakturering och grundläggande projektredovisning i ett system</li>
        </ul>

        <h3>Field Service: Eftermarknad och serviceaffär</h3>
        <p>
          För tillverkande företag som vill växa sin serviceaffär – serviceavtal,
          förebyggande underhåll, fältservicetekniker, reservdelshantering – är
          Field Service det naturliga valet. Systemet hanterar hela serviceflödet
          från ärendeskapande till fakturering.
        </p>
        <ul>
          <li>Schemaläggning och optimering av fältservicetekniker</li>
          <li>Serviceavtal och förebyggande underhåll med automatiserade triggers</li>
          <li>Reservdelshantering kopplad till lager och inköp</li>
          <li>Mobil åtkomst för tekniker i fält med realtidsinformation om kund och utrustning</li>
        </ul>

        <h3>Sales &amp; Customer Insights: Komplex B2B-försäljning och kunddata</h3>
        <p>
          Tillverkande företag med långa säljcykler, konfigurerbara produkter
          och nyckelkundsrelationer behöver mer än ett enkelt CRM. Dynamics 365
          Sales hanterar pipeline, offerthantering (CPQ) och KAM-relationer.
          Customer Insights samlar kunddata för segmentering och
          marknadskommunikation.
        </p>
        <ul>
          <li>Offerthantering med produktkonfigurator (CPQ – Configure, Price, Quote)</li>
          <li>Pipeline-hantering och aktivitetsuppföljning för långa säljcykler</li>
          <li>Kunddata aggregerad från flera källor för segmentering och riktad kommunikation</li>
        </ul>

        <h2>Listade partners inom Tillverkningsindustri</h2>
        <p>
          Nedan presenteras de 20 partners som är listade för branschen på
          d365.se, i den ordning de förekommer i partnerkatalogen.
        </p>

        

        <p>
          <strong>BE-terna</strong><br />
          <em>Finance, Supply Chain Management, Commerce</em>
        </p>
        <p>
          BE-terna har F&amp;SCM som kärnkompetens och är en av de partners i
          listan med tydligast fokus på tung tillverknings-ERP. Deras styrka
          ligger i komplexa produktionsflöden, avancerad lagerstyrning och
          ekonomistyrning för medelstora till stora tillverkande företag.
          Commerce-kompetensen är relevant för tillverkare som även hanterar
          direktförsäljning.
        </p>

        <p>
          <strong>Fellowmind</strong><br />
          <em>Business Central, Finance, Supply Chain Management, Sales, Customer Insights</em>
        </p>
        <p>
          Fellowmind täcker hela spannet från BC till F&amp;SCM och kombinerar
          ERP-kompetens med CRM. För tillverkande företag som vill ha en enda
          partner för hela plattformen – inklusive sälj och kundinsikt – är
          Fellowmind ett relevant alternativ. Styrkan är bred portfölj och
          europeisk leveranskapacitet.
        </p>

        <p>
          <strong>Goodfellows</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Goodfellows profilerar sig på trygg och förutsägbar BC-leverans med
          djup branschförståelse för tillverkning, produktion och distribution.
          Rätt val för medelstora tillverkare som prioriterar en partner som
          tar tydligt ägandeskap för att lösningen fungerar i praktiken.
        </p>

        <p>
          <strong>NAB Solutions</strong><br />
          <em>Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center</em>
        </p>
        <p>
          NAB Solutions kombinerar BC med ett brett CRM- och serviceuttag.
          För tillverkare med en växande serviceaffär och behov av att koppla
          samman ERP med kundservice och fältservice är NAB Solutions ett av få
          alternativ i listan som täcker hela den kombinationen.
        </p>

        <p>
          <strong>Nexer</strong><br />
          <em>BC, Finance, SCM, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations</em>
        </p>
        <p>
          Nexer har en av de bredaste kompetensportföljerna i listan och
          täcker samtliga relevanta Dynamics 365-applikationer för branschen.
          För tillverkande organisationer som planerar en ambitiös
          plattformssatsning – där ERP, eftermarknad och CRM ska hänga samman —
          erbjuder Nexer kapacitet att hålla ihop hela arkitekturen. AI
          Integration Partner-certifieringen indikerar ett aktivt fokus på
          nästa generations systemleveranser.
        </p>

        <p>
          <strong>Sherpas Group AB</strong><br />
          <em>Business Central, Finance, Supply Chain Management</em>
        </p>
        <p>
          Sherpas Group täcker hela ERP-spannet från BC till F&amp;SCM med
          fokus på tillverkning, energi och bygg. För tillverkande företag som
          värderar en partner med gedigen ERP-erfarenhet och tydlig
          branschorientering är Sherpas ett relevant alternativ, särskilt i
          segment med komplexa logistik- och ekonomiflöden.
        </p>

        <p>
          <strong>Sirocco Group</strong><br />
          <em>Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations</em>
        </p>
        <p>
          Sirocco Group är en tydlig CRM- och servicespecialist i listan.
          För tillverkande företag som hanterar komplex
          B2B-försäljning, eftermarknadsservice och projektbaserade leveranser
          – och som redan har eller planerar ett separat ERP – är Sirocco ett
          relevant val för CRM- och servicesidan av plattformen.
        </p>

        <p>
          <strong>Yellow Solution AB</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Yellow Solution är en BC-fokuserad partner med erfarenhet från
          tillverkning. Passar mindre till medelstora tillverkare som söker en
          partner med tydlig BC-specialisering och utan behov av
          F&amp;SCM-komplexitet.
        </p>

        

        <p>
          <strong>Bisqo AB</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Bisqo är en BC-partner med fokus på medelstora företag. Relevant för
          tillverkare i SMB-segmentet som söker en hands-on partner med god
          lokal närvaro.
        </p>

        <p>
          <strong>InBiz</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          InBiz är en BC-partner med erfarenhet från tillverkning och
          distribution. Passar medelstora tillverkare som söker ett
          kostnadseffektivt BC-upplägg med god processförståelse.
        </p>

        <p>
          <strong>Knowit</strong><br />
          <em>Finance, Supply Chain Management | AI Enabled</em>
        </p>
        <p>
          Knowit har ett renodlat F&amp;SCM-fokus med djup ERP-kompetens för
          tillverknings- och distributionsbranschen. Som AI Enabled-certifierad
          partner kombinerar de klassisk ERP-kompetens med ett aktivt fokus på
          AI-integration i produktionsprocesser. Relevant för medelstora till
          stora tillverkare med komplexa supply chain-krav.
        </p>

        <p>
          <strong>Vivicta</strong><br />
          <em>Business Central, Finance, SCM, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources</em>
        </p>
        <p>
          Vivicta täcker hela Dynamics 365-plattformen inklusive HR och
          Project Operations. Som internationellt verksam partner med bred
          applikationsportfölj är de relevanta för tillverkande koncerner med
          komplexa och tvärfunktionella krav.
        </p>

        <IndustryPartnerListInline industry="Tillverkningsindustri" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Tillverkningsindustrin är d365.se:s bransch med flest listade
          partners – 19 totalt. Det speglar att branschen är komplex, bred och
          har höga krav på systemstöd. Men fler alternativ innebär inte ett
          enklare val.
        </p>
        <p>
          Avgörande frågor att ställa: Vilken tillverkningsprincip är
          dominerande i er verksamhet – diskret, process, projektbaserad? Hur
          ser behovet av eftermarknad och service ut? Är ERP det primära
          behovet eller behöver CRM och sälj hanteras parallellt? Hur många
          juridiska entiteter och länder berörs?
        </p>
        <p>
          Svaren på de frågorna styr valet av applikation – och därmed vilka
          partners som är relevanta. En BC-implementation för ett medelstort
          verkstadsföretag ställer helt andra krav än en F&amp;SCM-implementation
          för en tillverkningskoncern med tio bolag i fyra länder.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/tillverkning/">d365.se/branscher/tillverkning</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett tillverkningsföretag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Premium (som inkluderar tillverkning) ligger på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – relevant för större tillverkare med avancerad MES-, kvalitets- och spårbarhetslogik. Field Service ligger på {{price:field-service:short}}.\n\nImplementationskostnaden för ett medelstort tillverkningsföretag landar typiskt i intervallet 1 200 000 – 5 000 000 kr beroende på antal anläggningar, integrationer mot MES, PLM och CAD samt behov av branschspecifika tillägg. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter tillverkningsföretag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) underskattad komplexitet i produktstrukturer (BOM) med varianter och konfigurationer; (2) integration mot MES, maskindata och PLM som lämnas till slutet av projektet; (3) kvalitets- och spårbarhetslogik som inte byggs in från start; och (4) planering i flera nivåer (MPS, MRP, capacity) som inte stöds av masterdata med tillräcklig kvalitet.\n\nDet är också vanligt att man underskattar förändringsarbetet i produktion – operatörer behöver enkla gränssnitt för rapportering, annars blir datakvaliteten lidande.",
      },
      {
        question: "Dynamics 365 vs specialiserade MES- och PLM-system – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade MES-system (t.ex. Siemens Opcenter, Aptean) och PLM-system (PTC, Siemens Teamcenter) har djup verkstadsgolv- och produktdatafunktionalitet som Dynamics 365 inte fullt ut levererar ur lådan. Dynamics 365 (F&SCM eller BC Premium) är en bredare affärsplattform för ekonomi, planering, inköp, lager och kund.\n\nDen vanligaste arkitekturen i medelstora till större tillverkningsbolag är att behålla MES för maskindata och realtidsproduktion och låta D365 vara back-office för planering, ekonomi och supply chain – med integration däremellan. För mindre eller mer standardiserade tillverkare kan BC Premium med integration mot ett mindre MES räcka. Frågan att ställa: hur mycket av verkstadsgolvets realtidsstyrning klarar D365 utan kostsam särutveckling?",
      },
      {
        question: "Vad säger andra tillverkningsföretag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope. Bolag som använt D365 som planerings- och ekonomiplattform med integration mot specialiserade MES- och PLM-system rapporterar generellt god utväxling – särskilt på MRP, leveransprecision och kostnadsuppföljning per order. Bolag som försökt täcka all verkstadsgolvslogik direkt i D365 utan branschtillägg har oftare stött på dyr särutveckling och förlängda projekt.\n\nEn återkommande lärdom är att börja med masterdata och planering, och att be partnern uppvisa konkreta referenscase med jämförbar produkttyp (diskret, process, varianter) och produktionsupplägg.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för tillverkningsindustri?",
        answer:
          "Det beror på er produkttyp och storlek. På d365.se listar vi flera partners med tillverkningsfokus – vissa är specialiserade på BC Premium för medelstora diskreta tillverkare, andra arbetar med F&SCM och avancerad supply chain för större aktörer, och andra har dokumenterade ISV-tillägg för specifika tillverkningsnischer.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i tillverkningsindustri med liknande produkt- och produktionsupplägg, (2) vilka MES- och PLM-integrationer de genomfört, och (3) en tydlig arkitekturskiss över vad D365 ska göra respektive vad specialistsystemen behåller.",
      },
    ],
  },
  {
    slug: "dynamics-365-livsmedel-processindustri",
    title: "Dynamics 365 för livsmedel & processindustri",
    metaTitle: "Dynamics 365 för livsmedel & processindustri – guide",
    metaDescription:
      "Dynamics 365 för livsmedel & processindustri hanterar batch, recept, HACCP och spårbarhet från råvara till färdig produkt. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 (F&SCM eller BC Premium med livsmedelstillägg) stödjer batch, recept, hållbarhet, HACCP och spårbarhet från råvara till färdig produkt. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["livsmedel", "processindustri", "dynamics365", "business central", "finance scm", "spårbarhet"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Field Service",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: livsmedelImg,
    readingTimeMinutes: 10,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Livsmedel &amp; Processindustri
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Svensk livsmedels- och processindustri verkar i en av de mest reglerade
          och konkurrensutsatta branscherna. Marginalerna pressas av volatila
          råvarupriser och internationell konkurrens, samtidigt som konsumenternas
          krav på transparens, lokalt producerade varor och hållbarhet ständigt
          ökar. Att hantera allt detta kräver systemstöd som är byggt för
          branschens verklighet – inte ett generellt affärssystem med påklistrade
          anpassningar.
        </p>
        <p>
          Det som skiljer processflöden från diskret tillverkning är fundamentalt:
          recept snarare än stycklistor, batchhantering snarare än serienummer,
          hållbarhetstider som styr lagerlogiken, och produktionsplanering som tar
          hänsyn till sanitering och allergenhantering. En återkallelse måste kunna
          hanteras inom timmar – med full spårbarhet från råvara till slutkund.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska livsmedels- och processföretag
          som vill samla ERP, kvalitet, supply chain och kundrelationer i en
          gemensam plattform. Modulerna Finance &amp; Supply Chain Management och
          Business Central täcker olika komplexitetsnivåer i branschen, och kan
          kompletteras med CRM och serviceapplikationer för en heltäckande lösning.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Processtillverkning, spårbarhet och kvalitet</h3>
        <p>
          F&amp;SCM är kärnan för större livsmedels- och processföretag med
          avancerade krav. Systemet hanterar hela produktionsflödet med den
          precision som branschen kräver och som myndigheter och
          certifieringsstandarder ställer.
        </p>
        <ul>
          <li>Recept- och formelhantering med versionskontroll, skalning och stöd för råvaruvarianter</li>
          <li>Full batchspårbarhet från inleverans av råvara, genom alla produktionssteg, till utleverans och slutkund</li>
          <li>Kvalitetskontroller med obligatoriska kontrollpunkter vid ankomst, under produktion och på färdigvaror</li>
          <li>Lagerstyrning med hållbarhetstider och FEFO-plockstrategi (First-Expired, First-Out)</li>
          <li>Produktionsplanering med hänsyn till kapacitet, materialtillgång och saniterings- eller rengöringsintervall</li>
          <li>Kalkylering med stöd för viktsvinn, utbyte och processvariation – grunden för korrekt marginalanalys</li>
          <li>Integration mot produktionsutrustning (MES/SCADA) via standardiserade API:er för realtidsdata</li>
        </ul>

        <h3>Business Central: ERP för mindre och medelstora aktörer</h3>
        <p>
          Business Central passar livsmedels- och processföretag i SMB-segmentet.
          Systemet täcker ekonomi, tillverkning, lager och försäljning i ett och
          kan kompletteras med branschspecifika tillägg från partners för djupare
          processtöd.
        </p>
        <ul>
          <li>Produktionsorder med recepthantering och grundläggande batchspårbarhet</li>
          <li>Lagerstyrning med hållbarhetsdatum och FEFO-stöd</li>
          <li>Inköp, leverantörshantering och ekonomi i ett sammanhållet system</li>
          <li>Möjlighet att bygga på med branschspecifika tillägg för djupare livsmedelsfunktionalitet</li>
        </ul>

        <h3>Sales: B2B-relationer mot handelskedjor och grossister</h3>
        <p>
          Livsmedelsföretag med komplex försäljning mot dagligvarukedjor,
          restauranger eller grossister behöver systemstöd för avtalshantering,
          prissättning och kampanjuppföljning. Dynamics 365 Sales hanterar dessa
          relationer och ger säljorganisationen ett sammanhållet verktyg för
          pipeline och kunduppföljning.
        </p>
        <ul>
          <li>Avtals- och prishantering mot stora kedjekunder</li>
          <li>Pipeline-hantering för nya produktlanseringar och kundpenetrering</li>
          <li>Kampanjplanering och uppföljning av handelsaktiviteter</li>
        </ul>

        <h3>Field Service &amp; Customer Service: Underhåll och kundrelationer</h3>
        <p>
          För livsmedelsföretag som tillverkar och underhåller processutrustning
          hos kunder, eller som behöver strukturerad ärendehantering mot sin
          kundtjänst, är Field Service och Customer Service relevanta komplement.
          Field Service hanterar schemaläggning av servicetekniker och förebyggande
          underhåll; Customer Service samlar kundärenden i ett enhetligt flöde.
        </p>

        <h2>Listade partners inom Livsmedel &amp; Processindustri</h2>
        <p>
          Åtta partners är listade för branschen på d365.se. Nedan presenteras de
          i den ordning de förekommer på branschsidan.
        </p>


        <p>
          <strong>BE-terna</strong><br />
          <em>Finance, Supply Chain Management, Commerce</em>
        </p>
        <p>
          BE-terna har F&amp;SCM som kärnkompetens och är ett av de tydligaste
          alternativen för livsmedels- och processföretag med komplexa
          produktionsflöden och avancerade supply chain-krav. Deras erfarenhet av
          processtillverkning och distribution gör dem relevanta för medelstora
          till stora aktörer i branschen. Commerce-kompetensen tillkommer för
          bolag med direktförsäljningskanaler.
        </p>

        <p>
          <strong>Sirocco Group</strong><br />
          <em>Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations</em>
        </p>
        <p>
          Sirocco Group är en renodlad CRM- och servicespecialist. För
          livsmedelsföretag med komplex B2B-försäljning mot handelskedjor,
          distributörer eller restauranger – och som söker en partner med djup
          CRM-kompetens snarare än ERP – är Sirocco ett relevant alternativ. De
          hanterar kundrelationer, fältservice och kontaktcenter på Dynamics
          365-plattformen.
        </p>

        <p>
          <strong>InBiz</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          InBiz är en Uppsala-baserad BC-specialist med lång erfarenhet av
          Dynamics-plattformen, certifierad Microsoft-partner sedan 2005. De
          levererar heltäckande BC-lösningar där hela flödet från inköp och
          produktion till lagerhantering och fakturering hanteras i ett system.
          För livsmedels- och processföretag i SMB-segmentet som söker en
          hands-on partner med tydligt ägandeskap för leveransen är InBiz ett
          relevant alternativ.
        </p>

        <IndustryPartnerListInline industry="Livsmedel & Processindustri" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Livsmedels- och processindustrin är en bransch där partnerns
          branscherfarenhet väger tyngre än i de flesta andra segment. Krav på
          spårbarhet, FEFO-styrning, kvalitetsdokumentation och certifieringsstöd
          (BRC, IFS) är inte standardfunktioner i alla system – de kräver antingen
          djupare konfiguration eller branschspecifika tillägg som partnern måste
          behärska.
        </p>
        <p>
          Med åtta listade partners är urvalet mer avgränsat jämfört med exempelvis
          tillverkning. Skillnaderna mellan dem är tydliga: några har
          processtillverkning som kärnkompetens, andra är breda plattformspartners
          med livsmedelserfarenhet som ett av flera segment. En relevant fråga att
          ställa till varje partner är hur många livsmedelsimplementationer de
          genomfört – och om de kan visa referenskunder med liknande produktionsform
          och komplexitet.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/livsmedel-processindustri/">d365.se/branscher/livsmedel-processindustri</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett livsmedels- eller processindustribolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Premium ligger på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – i princip standardvalet för livsmedel och processindustri med batch-, spårbarhets- och HACCP-krav.\n\nImplementationskostnaden för ett medelstort livsmedels- eller processindustribolag landar typiskt i intervallet 1 500 000 – 6 000 000 kr beroende på antal anläggningar, integrationer mot vågsystem, MES och laboratorier samt behov av branschspecifika tillägg (t.ex. ToIncrease Food, Aptean, LS Central Food). Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter livsmedels- och processindustribolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) underskattad komplexitet i batch-, recept- och hållbarhetslogik; (2) spårbarhet (forward/backward) som inte byggs in i hela kedjan från råvara till färdig produkt; (3) HACCP, kvalitetstester och avvikelsehantering som lämnas i parallella system; och (4) integration mot vågsystem, MES, etiketteringssystem och kund-EDI som underskattas.\n\nDet är också vanligt att man underskattar regelefterlevnaden – märkning, allergener, ursprung och spårbarhet kräver att datamodellen byggs rätt från start.",
      },
      {
        question: "Dynamics 365 vs specialiserade livsmedelssystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade livsmedelssystem (Aptean Process, CSB, Infor M3 Food) har djup branschfunktionalitet ur lådan. Dynamics 365 (F&SCM eller BC Premium med ToIncrease Food eller LS Central Food) är en bredare plattform som med rätt branschtillägg täcker batch, recept, spårbarhet och HACCP – och kompletteras med Microsofts ekosystem för analys, kund och AI.\n\nDen vanligaste vägen för medelstora till större livsmedelsbolag är att välja D365 + ISV-tillägg snarare än ett renodlat specialistsystem, för att få plattformsbredden. Frågan att ställa: vilket ISV-tillägg rekommenderar partnern, och vilka konkreta livsmedelsreferenser har de på just det tillägget?",
      },
      {
        question: "Vad säger andra livsmedels- och processindustribolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med val av ISV-tillägg och scope. Bolag som infört D365 + ett etablerat livsmedelstillägg rapporterar generellt god utväxling – särskilt på batch-spårbarhet, hållbarhetshantering och rapportering till myndigheter och kunder. Bolag som försökt täcka all branschspecifik logik med standard-D365 utan tillägg har oftare stött på dyr särutveckling och brister i spårbarhet.\n\nEn återkommande lärdom är att kravarbetet ska involvera både produktion, kvalitet, ekonomi och försäljning – och att tidigt validera branschtillägget mot verkliga processer, inte bara demo.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för livsmedel & processindustri?",
        answer:
          "Det beror på vilket ISV-tillägg ni väljer och er storlek. På d365.se listar vi flera partners med livsmedelsfokus – vissa är specialiserade på BC med LS Central Food eller ToIncrease Food, andra arbetar med F&SCM för större process- och livsmedelstillverkare.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i livsmedel eller processindustri med liknande produkttyp och spårbarhetskrav, (2) vilka livsmedelstillägg de arbetar med och varför, och (3) hur de hanterar batch, recept, hållbarhet och HACCP i sin lösning.",
      },
    ],
  },
  {
    slug: "dynamics-365-grossist-distribution",
    title: "Dynamics 365 för grossist & distribution",
    metaTitle: "Dynamics 365 för grossist & distribution – guide & partners",
    metaDescription:
      "Dynamics 365 för grossist & distribution stöttar lager, WMS, prislogik och EDI i en plattform. Köparsidig guide med kostnad, fallgropar och svenska partners.",
    summary:
      "Dynamics 365 (BC Premium eller F&SCM) är en stark ryggrad för svenska grossister och distributörer – ekonomi, lager, prislogik, EDI och kund i samma plattform. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["grossist", "distribution", "dynamics365", "business central", "finance scm", "wms"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Insights",
      "Customer Service",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: grossistImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Grossist &amp; Distribution
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Grossist- och distributionshandeln binder samman producenter med
          återförsäljare och slutkunder och är en bransch med konstant press på
          marginalerna. Kundernas förväntningar på snabba, precisa och spårbara
          leveranser är en hygienfaktor snarare än ett konkurrensmedel – det är
          vad som krävs bara för att vara med i spelet.
        </p>
        <p>
          Digitaliseringen har accelererat förändringen. B2B e-handel har
          transformerat hur affärer görs och skapat nya krav på självservice,
          realtidsdata och omnikanalsförsäljning. Manuella flöden och
          silobaserade system bromsar tillväxt och lönsamhet. Affärssystemet är
          ryggraden som håller ihop inköp, lager, logistik, orderhantering och
          ekonomi – och i en distributionsverksamhet märks det direkt i
          verksamheten när det brister.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska grossist- och
          distributionsföretag för att automatisera flöden, optimera lagernivåer
          och fatta datadrivna beslut. Plattformen täcker hela kedjan från
          inköpsplanering och WMS till kundrelationer och ekonomistyrning, i en
          modulär struktur som gör det möjligt att börja med det mest akuta och
          bygga vidare.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central: Komplett ERP för medelstora grossister</h3>
        <p>
          Business Central är standardvalet för svenska grossist- och
          distributionsföretag i SMB-segmentet. Systemet samlar ekonomi, inköp,
          lager och försäljning i ett flöde och ger full överblick från
          orderläggning till fakturering.
        </p>
        <ul>
          <li>Orderhantering med stöd för komplexa prislistor, kundspecifika rabattstrukturer och avtalsvillkor</li>
          <li>Lagerhantering med realtidssynlighet, optimerade plockrundor och integration mot handdatorer</li>
          <li>Inköpsplanering med automatiserade inköpsförslag baserade på historik, säkerhetslager och ledtider</li>
          <li>Returhantering (RMA) från registrering och mottagande till kreditering</li>
          <li>Ekonomi och reskontra med automatiserad fakturering, kreditkontroll och betalningsuppföljning</li>
          <li>Integration mot transportadministrativa system och B2B e-handelsplattformar via öppna API:er</li>
        </ul>

        <h3>Finance &amp; Supply Chain Management: Avancerad WMS och supply chain</h3>
        <p>
          F&amp;SCM är rätt nivå för större och mer komplexa distributionsföretag
          med avancerade krav på lagerstyrning, prognostisering och
          internationella finanser. Systemet erbjuder marknadens mest avancerade
          WMS-funktionalitet för Dynamics 365-plattformen.
        </p>
        <ul>
          <li>Avancerad lagerhantering (WMS) med styrd inlagring, optimerade plockrundor och integration mot lagerautomatik</li>
          <li>Efterfrågeprognoser och automatiserad lagerpåfyllnad med hänsyn till säsongsvariation och kampanjer</li>
          <li>Transportplanering och integration mot TMS-system för effektiv last mile-hantering</li>
          <li>Ekonomistyrning över flera bolag, valutor och länder med konsoliderad finansiell rapportering</li>
          <li>Commerce-modul för grossister som hanterar direktförsäljning eller B2B-portaler</li>
        </ul>

        <h3>Sales &amp; Customer Insights: Kundrelationer och segmentering</h3>
        <p>
          Grossistföretag med ett komplext säljled – KAM-relationer,
          avtalsförhandlingar, kategoriutveckling mot handelskedjor – drar nytta
          av Dynamics 365 Sales för strukturerad pipeline- och kundhantering.
          Customer Insights samlar kunddata för segmentering och personaliserade
          kampanjer.
        </p>
        <ul>
          <li>Pipeline- och säljmöjlighetshantering med koppling till orderhistorik och marginaldata</li>
          <li>Offert- och avtalshantering med automatisk tillämpning av kundspecifika villkor</li>
          <li>Kunddata aggregerad för segmentering, kampanjplanering och uppföljning av handelsaktiviteter</li>
        </ul>

        <h3>Customer Service: Ärende- och returhantering</h3>
        <p>
          Distributionsföretag med en aktiv kundtjänst – frågor om orderstatus,
          leveransavvikelser och returer – behöver ett system som ger
          kundtjänstteamet direkt åtkomst till order- och leveransinformation.
          Customer Service hanterar ärenden från alla kanaler i ett enhetligt
          flöde och kopplar dem till relevant ERP-data.
        </p>

        <h2>Listade partners inom Grossist &amp; Distribution</h2>
        <p>
          Tolv partners är listade för branschen på d365.se. Nedan presenteras de
          i den ordning de förekommer på branschsidan.
        </p>

        <p>
          <strong>BE-terna</strong><br />
          <em>Finance, Supply Chain Management, Commerce</em>
        </p>
        <p>
          BE-terna har F&amp;SCM som kärnkompetens och är ett av de tydligaste
          alternativen för medelstora till stora distributionsföretag med
          komplexa supply chain-krav. Deras erfarenhet av avancerad lagerstyrning,
          transportflöden och finansiell styrning över flera entiteter gör dem
          relevanta för grossister med höga krav på WMS-precision och ekonomisk
          kontroll. Commerce-kompetensen tillkommer för bolag med
          direktförsäljningskanaler.
        </p>

        <p>
          <strong>Fellowmind</strong><br />
          <em>Business Central, Finance, Supply Chain Management, Sales, Customer Insights</em>
        </p>
        <p>
          Fellowmind täcker hela spannet från BC till F&amp;SCM och kombinerar
          ERP-kompetens med CRM. För distributionsföretag som vill ha en enda
          partner för hela plattformen – inklusive sälj och kundinsikt – är
          Fellowmind ett relevant alternativ. Styrkan är bred portfölj,
          dokumenterad erfarenhet från grossist och distribution, och europeisk
          leveranskapacitet för bolag med internationell verksamhet.
        </p>

        <p>
          <strong>Goodfellows</strong><br />
          <em>Business Central | AI Integration Partner</em>
        </p>
        <p>
          Goodfellows är en BC-specialist med djup erfarenhet från handel,
          distribution och produktion. Deras profil är tydlig: förutsägbar
          leverans, nära samarbete med kundens team och fokus på att lösningen
          fungerar i praktiken – inte bara i projektplanen. För medelstora
          grossister med komplexa lagerflöden, avancerad prissättning och krav
          på leveranssäkerhet är Goodfellows ett starkt alternativ bland
          BC-partnerna.
        </p>

        <p>
          <strong>NAB Solutions</strong><br />
          <em>Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center</em>
        </p>
        <p>
          NAB Solutions kombinerar BC med ett brett CRM- och serviceuttag och har
          ett uttalat fokus på processindustri och grossistverksamhet. För
          distributionsföretag som vill koppla samman ERP med kundservice,
          fältservice och kontaktcenter i ett sammanhållet ekosystem är NAB
          Solutions ett av få partners i listan som täcker hela den
          kombinationen.
        </p>

        <p>
          <strong>Nexer</strong><br />
          <em>Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations</em>
        </p>
        <p>
          Nexer har en av de bredaste kompetensportföljerna i listan och täcker
          samtliga relevanta Dynamics 365-applikationer för branschen. För
          distributionsorganisationer som planerar en ambitiös plattformssatsning
          – där ERP, kundservice och CRM ska hänga samman i realtid – erbjuder
          Nexer kapacitet att hålla ihop hela arkitekturen. AI Integration
          Partner-certifieringen pekar mot ett aktivt fokus på nästa generations
          systemleveranser.
        </p>

        <p>
          <strong>Yellow Solution AB</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Yellow Solution är en BC-specialist med ett tydligt fokus på att
          maximera affärsnyttan av affärssystemsinvesteringen. Deras
          leveransmodell kombinerar lång erfarenhet med personligt engagemang och
          en ambition att BC inte bara ska stödja verksamheten utan aktivt bidra
          till ökad effektivitet. Passar medelstora grossist- och
          distributionsföretag som söker en partner med djup BC-kompetens och
          stark lokal närvaro.
        </p>

        <p>
          <strong>Bisqo AB</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Bisqo är en BC-partner med erfarenhet från grossist och distribution.
          Deras fokus ligger på att leverera anpassade BC-lösningar som möter de
          operativa krav som präglar distributionsverksamheter – lagerflöden,
          orderhantering och prissättning. Relevant för medelstora
          distributionsföretag i SMB-segmentet som söker en hands-on BC-partner
          med god branschförståelse.
        </p>

        <p>
          <strong>InBiz</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          InBiz är en Uppsala-baserad BC-specialist, certifierad Microsoft-partner
          sedan 2005, med lång erfarenhet av distribution och lagerhantering.
          Deras lösningar täcker hela flödet från inköp och lageroptimering till
          försäljning och fakturering, och de arbetar med egna tillägg för att
          möta specifika distributionsbehov. Passar medelstora grossistföretag
          som söker en stabil och erfaren BC-partner med tydligt ägandeskap för
          leveransen.
        </p>

        <p>
          <strong>Knowit</strong><br />
          <em>Finance, Supply Chain Management | AI Enabled</em>
        </p>
        <p>
          Knowit har ett renodlat F&amp;SCM-fokus med djup ERP-kompetens för
          grossist och distribution. Deras leveransmodell integrerar ERP med
          data, AI och intelligenta arbetsflöden – med målet att koppla samman
          affärssystem och analys för bättre beslut och effektivare processer.
          AI Enabled-certifieringen understryker att de aktivt arbetar med
          AI-integration i sina leveranser. Relevant för medelstora till stora
          distributörer med komplexa supply chain-krav.
        </p>

        <IndustryPartnerListInline industry="Grossist & Distribution" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Grossist och distribution är en bransch där affärssystemet är direkt
          kopplat till verksamhetens lönsamhet – fel lagernivåer, bristande
          leveransprecision eller manuella flöden syns omedelbart på marginalen.
          Det ställer höga krav på att partnern förstår distributionslogik: hur
          inköpsplanering, WMS, prissättning och orderflöden hänger samman.
        </p>
        <p>
          Med tolv listade partners spänner urvalet brett – från renodlade
          BC-specialister för SMB-segmentet till partners med F&amp;SCM-kapacitet
          för komplexa distributionskoncerner. En central fråga är om BC räcker
          för er komplexitet, eller om ni behöver F&amp;SCM:s avancerade WMS och
          supply chain-funktionalitet. Svaret på den frågan styr vilka partners
          som är relevanta att gå vidare med.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/grossist-distribution/">d365.se/branscher/grossist-distribution</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett grossist- och distributionsbolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – relevant för större grossister med avancerad lager- (WMS) och prislogik.\n\nImplementationskostnaden för ett medelstort grossist- och distributionsbolag landar typiskt i intervallet 800 000 – 3 500 000 kr beroende på antal lager, EDI-integrationer mot kunder och leverantörer samt komplexitet i pris- och rabattlogik. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter grossist- och distributionsbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) komplex pris- och rabattlogik (kundavtal, volym, kampanj) som inte modelleras tillräckligt; (2) WMS- och plocklogik som inte täcks av standard utan kräver tillägg eller integration; (3) EDI mot stora kunder och leverantörer som underskattas i tid och kostnad; och (4) artikelmaster med många leverantörer, varianter och prisstrukturer som inte städas inför migrering.\n\nDet är också vanligt att returflöden, kreditfakturor och kvalitetsavvikelser inte modelleras tidigt – vilket skapar manuella processer efter golive.",
      },
      {
        question: "Dynamics 365 vs specialiserade WMS- och grossistsystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade WMS-system (Astro, Consafe Logistics, Manhattan) och grossistplattformar har djup branschfunktionalitet ur lådan. Dynamics 365 (F&SCM eller BC Premium) är en bredare plattform med solid funktionalitet för grossistlogik och WMS som ofta räcker – särskilt med rätt branschtillägg.\n\nDen vanligaste arkitekturen i medelstora grossister är att låta D365 vara hela ryggraden, kompletterad med tilläggsmoduler för WMS eller EDI. För större aktörer med komplexa flöden och hög volym kan ett separat WMS vara motiverat. Frågan att ställa: hur mycket av lager- och plocklogiken klarar D365 utan särutveckling eller separat WMS?",
      },
      {
        question: "Vad säger andra grossist- och distributionsbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna är generellt positiva när scope hålls realistiskt. Bolag som använt D365 som hel ryggrad med BC Premium eller F&SCM rapporterar god utväxling – särskilt på orderhantering, lager, EDI och kunduppföljning. Bolag som inte städat masterdata (artiklar, kunder, leverantörer) inför migrering har oftare brottats med långa stabiliseringsfaser efter golive.\n\nEn återkommande lärdom är att lägga tid på masterdata- och prislogik tidigt, och att be partnern uppvisa konkreta referenscase i grossist- och distributionsbranschen med liknande volym, sortiment och kundstruktur.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för grossist & distribution?",
        answer:
          "Det beror på er storlek och komplexitet. På d365.se listar vi flera partners med grossist- och distributionsfokus – vissa är specialiserade på BC för medelstora aktörer, andra arbetar med F&SCM och avancerad supply chain för större distributörer, och andra har dokumenterade ISV-tillägg för WMS, EDI eller branschspecifika prislogiker.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i grossist eller distribution av jämförbar storlek, (2) hur de hanterar komplex pris- och rabattlogik samt EDI, och (3) en tydlig arkitekturskiss över vilka delar D365 äger respektive vad eventuella tilläggssystem behåller.",
      },
    ],
  },
  {
    slug: "dynamics-365-jordbruk-skogsbruk",
    title: "Dynamics 365 för jordbruk & skogsbruk",
    metaTitle: "Dynamics 365 för jordbruk & skogsbruk – guide & partners",
    metaDescription:
      "Dynamics 365 för jordbruk & skogsbruk täcker säsong, maskinpark, lager, fältservice och avräkning. Köparsidig guide med kostnad och svenska partners.",
    summary:
      "Dynamics 365 fungerar som back-office för svenska jord- och skogsbruksbolag – ekonomi, anläggningsregister, fältservice och kund, integrerat med branschens specialistsystem. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["jordbruk", "skogsbruk", "dynamics365", "business central", "finance scm", "field service"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Field Service",
      "Sales",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: jordbrukImg,
    readingTimeMinutes: 9,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Jordbruk &amp; Skogsbruk
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Den svenska jordbruks- och skogsbrukssektorn är en bransch som
          kombinerar tradition med ett växande behov av digitalisering.
          Precisionsodling, skogsbruksplanering, maskinuppkoppling och krav på
          spårbarhet från producent till konsument driver på behovet av modernare
          systemstöd. Fragmenterade och isolerade system – ett för ekonomi, ett
          för lager, ett för maskinuppföljning – skapar ineffektivitet och
          bristande beslutsunderlag.
        </p>
        <p>
          Branschen präglas av utmaningar som få andra segment delar:
          väderberoende och säsongsvariationer som gör planering svår, volatila
          priser på insatsvaror och slutprodukter, komplexa regelverk med
          subventionssystem som kräver noggrann dokumentation, och ett
          underhållsbehov för en kostsam maskinpark. Dessa faktorer ställer höga
          krav på systemets flexibilitet och rapporteringsförmåga.
        </p>
        <p>
          Microsoft Dynamics 365 erbjuder en integrerad plattform som kan samla
          ekonomi, lager, inköp, försäljning och service i ett sammanhållet
          system – och skalas från ett litet lantbruksföretag på Business Central
          till en stor skogsbrukskoncern på Finance &amp; Supply Chain Management.
          Plattformens öppenhet mot externa system möjliggör även integration av
          IoT-data från maskiner och sensorer via anpassade lösningar.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central: Ekonomi, lager och grundläggande verksamhetsstyrning</h3>
        <p>
          Business Central passar mindre och medelstora företag inom jordbruk och
          skogsbruk som behöver ett sammanhållet system för ekonomi, inköp, lager
          och försäljning utan att investera i F&amp;SCM-komplexiteten.
        </p>
        <ul>
          <li>Ekonomi och redovisning med hantering av intäkter, kostnader, fakturering och leverantörsreskontra</li>
          <li>Lager- och inventariehantering för råvaror, förnödenheter och insatsvaror med spårbarhet</li>
          <li>Inköpsprocess från behovsidentifiering till betalning med leverantörsstyrning</li>
          <li>Försäljning och orderhantering för produkter som spannmål, virke, kött eller förädlade produkter</li>
          <li>Grundläggande projekthantering för säsongsprojekt eller investeringsprojekt</li>
        </ul>

        <h3>Finance &amp; Supply Chain Management: Komplex logistik och finansiell styrning</h3>
        <p>
          F&amp;SCM är relevant för större jordbruks- och skogsbruksföretag med
          komplexa krav på logistik, försörjningskedjestyrning och finansiell
          rapportering över flera bolag eller enheter.
        </p>
        <ul>
          <li>Avancerad supply chain-planering med hänsyn till säsongsvariationer och kapacitetsbegränsningar</li>
          <li>Logistikhantering för transport av råvaror och färdiga produkter med spårbarhet i kedjan</li>
          <li>Ekonomistyrning över flera juridiska entiteter med konsoliderad finansiell rapportering</li>
          <li>Stöd för hantering av subventioner och EU-stöd via flexibla redovisnings- och rapporteringsfunktioner</li>
        </ul>

        <h3>Field Service: Maskinunderhåll och serviceorganisation</h3>
        <p>
          För jordbruks- och skogsbruksföretag med en intern eller extern
          serviceorganisation för maskinpark och utrustning är Field Service ett
          viktigt komplement. Systemet hanterar planerat och avhjälpande
          underhåll, schemaläggning av tekniker och arbetsorder – och ger
          fältpersonal tillgång till relevant information via mobila enheter.
        </p>
        <ul>
          <li>Planering av förebyggande underhåll för lantbruksmaskiner och skogsbruksutrustning</li>
          <li>Arbetsorderhantering från felanmälan till utförd åtgärd och fakturering</li>
          <li>Mobil åtkomst till underhållsscheman, reservdelslistor och instruktioner i fält</li>
          <li>Servicehistorik per maskin för bättre underhållsplanering och investeringsbeslut</li>
        </ul>

        <h3>Sales &amp; Customer Insights: Kundrelationer och försäljning</h3>
        <p>
          För jordbruks- och skogsbruksföretag med direktförsäljning till
          industri, handel eller slutkonsument ger Dynamics 365 Sales stöd för
          kundrelationshantering, offerthantering och säljuppföljning. Customer
          Insights möjliggör segmentering och riktad kommunikation för
          verksamheter med ett bredare kundregister.
        </p>

        <h2>Listade partners inom Jordbruk &amp; Skogsbruk</h2>
        <p>
          Två partners är listade för branschen på d365.se. Nedan presenteras de
          i den ordning de förekommer på branschsidan.
        </p>

        <p>
          <strong>Vivicta</strong><br />
          <em>Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources | AI Integration Partner</em>
        </p>
        <p>
          Vivicta är en partner med ett helhetsåtagande inom Dynamics
          365-plattformen och ett branschfokus som explicit inkluderar process-
          och skogsindustri. De täcker hela applikationsportföljen – från BC och
          F&amp;SCM för ekonomi och supply chain till Sales, Customer Service och
          Field Service för kundrelationer och serviceorganisation, samt HR för
          personalprocesser. Som AI Integration Partner arbetar de aktivt med att
          integrera AI i sina leveranser. Deras erfarenhet av industri, process
          och skog gör dem relevanta för jordbruks- och skogsbruksföretag som
          söker en partner med bred plattformskapacitet och dokumenterad
          förståelse för branschens specifika processer.
        </p>

        <IndustryPartnerListInline industry="Jordbruk & Skogsbruk" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Jordbruk och skogsbruk är en av de branscher på d365.se med färst
          listade partners – vilket speglar att det är ett specialiserat segment
          där få partners aktivt profilerar sig. Det begränsade antalet
          alternativ innebär att urvalsprocessen ser annorlunda ut jämfört med
          exempelvis tillverkning eller distribution.
        </p>
        <p>
          Med bara två listade partners är den centrala frågan inte vilket av
          dem man ska välja, utan snarare om de listade alternativen matchar er
          komplexitet och era specifika processbehov. Vivicta erbjuder hela
          plattformens bredd och ett uttalat branschfokus på skog och
          processindustri. Navcite är en renodlad BC-specialist med lång
          plattformserfarenhet. För organisationer med mer komplexa krav kan det
          också vara värt att titta bredare på partners som är listade under
          angränsande branscher som tillverkning eller livsmedel – och utvärdera
          deras erfarenhet av jordbruks- och skogsbruksnära processer.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/jordbruk-skogsbruk/">d365.se/branscher/jordbruk-skogsbruk</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett jordbruks- eller skogsbruksbolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – relevant för större aktörer med komplex lager-, säsongs- och maskinparkslogik. Field Service ligger på {{price:field-service:short}}.\n\nImplementationskostnaden för ett medelstort jordbruks- eller skogsbruksbolag landar typiskt i intervallet 700 000 – 3 000 000 kr beroende på integrationer mot maskinsystem, vägning, IoT-sensorer och branschspecifika tillägg. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter jordbruks- och skogsbruksbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) säsongs- och väderberoende processer som inte modelleras i standardlogiken; (2) maskinpark, fordon och utrustning vars underhåll och driftekonomi inte kopplas mot affärssystemet; (3) spårbarhet från jord/skog till leverans som kräver branschspecifika tillägg; och (4) integration mot vägning, terminalsystem och avräkning som underskattas.\n\nDet är också vanligt att man underskattar förändringsarbetet i fält – operatörer och förare behöver enkla mobila gränssnitt, annars blir datakvaliteten lidande.",
      },
      {
        question: "Dynamics 365 vs specialiserade jordbruks- och skogsbrukssystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade system (Pyrocco, Dataväxt, Näsgård, skogsbrukets terminalsystem) har djup branschfunktionalitet för säsong, växtföljd, virkesmätning och avräkning. Dynamics 365 är en bredare affärsplattform för ekonomi, inköp, lager, fältservice och kund.\n\nDen vanligaste arkitekturen är att behålla specialistsystem för operativ branschlogik och låta D365 vara back-office för ekonomi, projekt, anläggningsregister och kund – med integration däremellan. Frågan att ställa: hur mycket av den specifika jord- eller skogsbrukslogiken klarar D365 utan kostsam särutveckling?",
      },
      {
        question: "Vad säger andra jordbruks- och skogsbruksbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope. Bolag som använt D365 som ekonomi- och projektplattform med integration mot specialiserade branschsystem rapporterar generellt god utväxling – särskilt på ekonomistyrning, maskinparksunderhåll och kundhantering. Bolag som försökt täcka all operativ branschlogik direkt i D365 utan branschtillägg har oftare stött på dyr särutveckling.\n\nEn återkommande lärdom är att tidigt definiera vad D365 äger respektive vad specialistsystemet behåller – och att be partnern uppvisa konkreta referenscase i branschen med liknande verksamhetsprofil.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för jordbruk & skogsbruk?",
        answer:
          "Jordbruk och skogsbruk är ett nischsegment på d365.se med få listade partners. Vår rekommendation är att utvärdera de partners som finns listade på branschsidan och komplettera med partners utanför listan som har dokumenterad erfarenhet av branschens specifika system och processer.\n\nBe partnern uppvisa: (1) konkreta referenscase i jordbruk eller skogsbruk av jämförbar storlek, (2) hur de hanterar integration mot vägning, maskindata och avräkning, och (3) en tydlig avgränsning av vad D365 ska göra respektive vad eventuella specialistsystem behåller.",
      },
    ],
  },
  {
    slug: "dynamics-365-bygg-entreprenad",
    title: "Dynamics 365 för bygg, entreprenad & installation",
    metaTitle: "Affärssystem för byggföretag 2026 – projektredovisning & ÄTA",
    metaDescription:
      "Projektredovisning, ÄTA, underentreprenörer och mobil tidrapportering i Dynamics 365 för byggföretag. Se vad BC, F&SCM och Project Operations kostar – och vilka svenska partners som kan bygg.",
    summary:
      "Dynamics 365 (Project Operations + BC Premium eller F&SCM) stödjer projektredovisning, ÄTA, underentreprenörer och kostnadskontroll för svenska bygg-, entreprenad- och installationsbolag. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["bygg", "entreprenad", "dynamics365", "business central", "finance scm", "field service", "projektredovisning"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Field Service",
      "Sales",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: byggImg,
    readingTimeMinutes: 10,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Bygg &amp; Entreprenad
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <div className="!mb-10 rounded-lg border border-border bg-muted/40 p-5">
          <p className="!mt-0 !mb-3 !font-semibold">Kort svar för dig som ska välja system</p>
          <ul className="!mb-0">
            <li>
              <strong>Projektredovisning:</strong> budget, prognos och successiv
              vinstavräkning per projekt – i BC Premium för mindre bolag, i F&amp;SCM
              för koncerner med flera bolag.
            </li>
            <li>
              <strong>ÄTA-hantering:</strong> ändrings- och tilläggsarbeten
              dokumenteras, prissätts och faktureras kopplat till projektet i stället
              för i lösa kalkylark.
            </li>
            <li>
              <strong>Underentreprenörer:</strong> inköp, attest av
              leverantörsfakturor och avstämning mot projektbudget i samma flöde.
            </li>
            <li>
              <strong>Mobil tid- och materialrapportering:</strong> tid, material och
              maskintimmar rapporteras från arbetsplatsen och når ekonomin samma dag.
            </li>
            <li>
              <strong>Kostnad:</strong> licens från ca 765 kr/användare och månad för
              Business Central Essentials, mer för Premium, F&amp;SCM och Project
              Operations – implementationen är den större posten.
            </li>
          </ul>
        </div>


        <h2>Branschens verklighet</h2>
        <p>
          Bygg- och entreprenadbranschen är projektdriven till sin natur – och
          det ställer helt andra krav på affärssystemet än vad som gäller för
          produktions- eller handelsföretag. Varje projekt är unikt: eget scope,
          egna resurser, egna leverantörer och sin egen ekonomi. Att hålla koll
          på lönsamhet per projekt i realtid, hantera ändrings- och
          tilläggsarbeten strukturerat och säkerställa korrekt projektredovisning
          är centrala utmaningar som ett generellt affärssystem sällan löser
          utan djupare konfiguration.
        </p>
        <p>
          Branschen präglas av långa projektcykler, små marginaler och en
          komplex intressentbild. Fragmenterad projektdata – kalkyl i ett
          system, planering i ett annat, ekonomi i ett tredje – är en av de
          vanligaste orsakerna till att projekt tappar kontrollen. Utan
          realtidsöversikt av kostnader mot budget är det svårt att agera i
          tid. Och i en bransch med ÄTA-hantering, underentreprenörer och
          succesiv vinstavräkning är systemstödets precision direkt kopplad
          till lönsamheten.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska bygg- och
          entreprenadföretag för att samla hela projektkedjan – från anbud och
          kalkyl till projektuppföljning, inköp, resursstyrning och ekonomisk
          rapportering – i ett gemensamt system. Plattformen kan kompletteras
          med branschspecifika tillägg och integreras mot specialiserade
          kalkylprogram och mätningssystem.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central: Projektledning och ekonomi för SMB-entreprenadet</h3>
        <p>
          Business Central är grunden för mindre och medelstora bygg- och
          entreprenadföretag. Systemet täcker hela flödet från projektbudget
          och inköp till ekonomiuppföljning och fakturering, och kan
          kompletteras med branschspecifika tillägg för djupare
          projekthanteringsfunktionalitet.
        </p>
        <ul>
          <li>Projekthantering med budget, prognos och realtidsuppföljning av kostnader och intäkter per projekt</li>
          <li>ÄTA-hantering för strukturerad dokumentation, prissättning och uppföljning av tilläggsarbeten</li>
          <li>Inköp kopplat till specifika projekt med leverantörsfakturaattest och kostnadskontroll</li>
          <li>Resurs- och maskinplanering för optimerad beläggning över parallella projekt</li>
          <li>Successiv vinstavräkning för korrekt finansiell rapportering i långa projekt</li>
          <li>Tidrapportering och attestflöden för personal och underentreprenörer, även via mobila enheter</li>
        </ul>

        <h3>Finance &amp; Supply Chain Management: Komplex projektredovisning och logistik</h3>
        <p>
          F&amp;SCM passar större entreprenadföretag med komplexa krav på
          projektredovisning, logistikstyrning och ekonomisk styrning över
          flera bolag. Systemet erbjuder avancerad projektmodul med stöd för
          långa projekt, delfinansiering och koncernrapportering.
        </p>
        <ul>
          <li>Avancerad projektredovisning med stöd för successiv vinstavräkning, projektkostnadspooler och interndebitering</li>
          <li>Logistikstyrning för byggmaterial och maskiner med inköpsplanering kopplad till projektbehov</li>
          <li>Ekonomistyrning över flera juridiska entiteter med konsoliderad finansiell rapportering</li>
          <li>Budgetering, prognostisering och avvikelseanalys per projekt och affärsområde</li>
        </ul>

        <h3>Field Service: Service- och underhållsverksamhet</h3>
        <p>
          För bygg-, entreprenad- och installationsföretag med en serviceaffär vid sidan av
          nyproduktion – till exempel installations- eller teknikföretag med
          serviceavtal – hanterar Field Service schemaläggning av tekniker,
          serviceorder och förebyggande underhåll. Mobilapp för tekniker i
          fält är inbyggd.
        </p>
        <ul>
          <li>Serviceavtal och förebyggande underhåll med automatiserade triggers och arbetsorderhantering</li>
          <li>Schemaläggning och optimering av serviceresurser över geografiska områden</li>
          <li>Mobil åtkomst till arbetsorder, ritningar och instruktioner för tekniker på plats</li>
        </ul>

        <h3>Sales: Anbudsprocess och kundrelationer</h3>
        <p>
          Dynamics 365 Sales strukturerar anbudsprocessen och
          kundrelationshanteringen för företag med komplex försäljning mot
          offentliga beställare, bostadsutvecklare eller industriella kunder.
          Systemet ger en samlad pipeline-vy och kopplar affärsmöjligheter
          till projektstart när kontrakt tecknas.
        </p>
        <ul>
          <li>Anbuds- och offerthantering med koppling till kalkyldata och projektbudget</li>
          <li>Pipeline-hantering för uppföljning av affärsmöjligheter och vinstfrekvens</li>
          <li>Kundrelationshantering för KAM-arbete mot återkommande beställare</li>
        </ul>

        <h2>Listade partners inom Bygg &amp; Entreprenad</h2>
        <p>
          Fem partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>4PS Construction Software AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">Business Central</p>
        <p>
          4PS är en specialiserad ERP-leverantör vars lösning 4PS Construct är
          byggd direkt på Business Central och utvecklad specifikt för bygg-,
          installations- och serviceföretag. Det gör dem unika i listan: i
          stället för ett generellt BC som konfigureras för branschen levererar
          de ett system med inbyggd branschlogik från start – projekthantering,
          ÄTA, resursplanering, service och ekonomi i ett sammanhållet flöde
          med realtidssynlighet per projekt. Rätt val för bygg- och
          installationsföretag som prioriterar branschanpassad funktionalitet
          utan att behöva bygga upp det från standard.
        </p>

        <h3>Enqore AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer
          Insights, Customer Service, Field Service, Contact Center, Project
          Operations
        </p>
        <p>
          Enqore täcker hela Dynamics 365-plattformen med ett tydligt fokus på
          datadrivna och AI-stödda processer. För byggföretag innebär deras
          profil – att koppla samman affärssystem med analys för att gå från
          reaktiv till prediktiv drift – konkret värde i projektuppföljning
          och avvikelsedetektering. De kombinerar ERP-kompetens med CRM och
          fältservice, vilket gör dem relevanta för entreprenaföretag som
          hanterar både projekt och en löpande serviceaffär.
        </p>

        <h3>Navcite</h3>
        <p className="!text-sm text-muted-foreground !mb-2">Business Central</p>
        <p>
          Navcite implementerar Business Central för företag inom projekt,
          tillverkning och distribution och har lång erfarenhet av
          Dynamics-plattformen. I bygg-, entreprenad- och installationsbranschen fokuserar de
          på projektstyrning, resursplanering och ekonomiuppföljning, och
          arbetar med integration mot Microsofts övriga ekosystem för en
          sammanhållen digital arbetsmiljö. De erbjuder stöd från
          implementation till löpande vidareutveckling – ett stabilt alternativ
          för SMB-entreprenadet som söker en erfaren BC-partner med tydligt
          leveransansvar.
        </p>

        <h3>Yellow Solution AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">Business Central</p>
        <p>
          Yellow Solution är en BC-specialist med ett tydligt fokus på att
          leverera konkret affärsnytta av systemsinvesteringen. Deras
          leveransmodell kombinerar lång erfarenhet med personligt engagemang
          och en ambition att systemet ska bidra aktivt till ökad effektivitet
          och bättre beslut – inte bara stödja befintliga processer. Passar
          medelstora bygg-, entreprenad- och installationsföretag som söker en partner med
          djup BC-kompetens, stabil leverans och ett hands-on förhållningssätt
          till implementation och förvaltning.
        </p>

        <h3>Sherpas Group AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management | AI Integration Partner
        </p>
        <p>
          Sherpas Group täcker hela ERP-spannet från BC till F&amp;SCM och
          kombinerar det med ett aktivt AI Integration Partner-fokus. I bygg-
          och entreprenadbranschen arbetar de med projektstyrning,
          resursallokering, ekonomiuppföljning och materiallogistik. Deras
          kombination av bred ERP-kapacitet och AI-integration gör dem
          relevanta för byggföretag som vill ha ett system som både hanterar
          projektens komplexitet idag och kan växa med organisationens behov
          av datadriven styrning framöver.
        </p>

        <IndustryPartnerListInline industry="Bygg, Entreprenad & Installation" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Bygg och entreprenad är en bransch där systemets förmåga att hantera
          projektlogik – ÄTA, successiv vinstavräkning, resursstyrning per
          projekt, inköp kopplat till projektbudget – är avgörande. Det är en
          annan typ av komplexitet än lager- eller produktionsstyrning, och
          det kräver en partner som faktiskt förstår hur byggprojekt fungerar
          i praktiken.
        </p>
        <p>
          Det mest distinkta alternativet i listan är 4PS med sin
          branschspecifika lösning byggd på BC. De övriga fyra partnerna
          levererar BC eller F&amp;SCM med konfiguration och eventuella
          tillägg för branschen. Valet handlar delvis om hur pass
          branschanpassad lösningen behöver vara från start kontra hur mycket
          standardnära implementation ni kan hantera med rätt konfiguration.
        </p>
        <p>
          En relevant fråga att ställa varje partner: hur många bygg-, entreprenad- och
          installationsprojekt har ni genomfört, och kan ni visa referenskunder
          med liknande projekttyper och komplexitetsnivå som er verksamhet?
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/bygg-entreprenad/">Bygg, Entreprenad & Installation</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett bygg-, entreprenad- och installationsbolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Premium ligger på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}}, Supply Chain Management {{price:supply-chain-management:short}} och Project Operations {{price:project-operations:short}} – central för projektredovisning, ÄTA och underentreprenörer.\n\nImplementationskostnaden för ett medelstort bygg-, entreprenad- och installationsbolag landar typiskt i intervallet 1 000 000 – 4 000 000 kr beroende på antal projekt parallellt, integrationer mot kalkyl- och tidrapporteringssystem samt branschspecifika tillägg. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter bygg-, entreprenad- och installationsbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) projektredovisning och ÄTA-hantering som inte modelleras tillräckligt detaljerat; (2) underentreprenörshantering, avtal och avrop som lämnas i parallella system; (3) tidrapportering från fält som inte integreras hela vägen till löneunderlag och projektkostnad; och (4) integration mot kalkylsystem (Bidcon, Sterling, MAP) som underskattas.\n\nDet är också vanligt att man underskattar förändringsarbetet – platschefer och projektledare behöver enkla mobila gränssnitt och tydliga processer för att adoptera systemet.",
      },
      {
        question: "Dynamics 365 vs specialiserade byggsystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade byggsystem (Vitec/Entré, Mercur, Hogia Bygg, Next) har djup branschfunktionalitet för svensk byggekonomi, ÄTA och underentreprenörer. Dynamics 365 (Project Operations + BC Premium eller F&SCM) är en bredare affärsplattform med stark projektredovisning som kompletteras med Microsofts ekosystem för CRM, fältservice och AI.\n\nDen vanligaste vägen för medelstora byggbolag är att utvärdera D365 + ISV-tillägg mot ett renodlat byggsystem. Frågan att ställa: vilken ISV eller branschanpassning rekommenderar partnern, och hur löser de underentreprenörshantering, ÄTA och förskottsfakturering i sin lösning?",
      },
      {
        question: "Vad säger andra bygg-, entreprenad- och installationsbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope och tilläggsval. Bolag som infört D365 med Project Operations och ett byggspecifikt tillägg rapporterar generellt god utväxling – särskilt på projektredovisning, kostnadskontroll och kundhantering. Bolag som försökt täcka all branschspecifik logik med standard-D365 har oftare stött på dyr särutveckling.\n\nEn återkommande lärdom är att tidigt involvera ekonomi, projektledning och inköp i kravarbetet, och att be partnern uppvisa konkreta referenscase i bygg, entreprenad eller installation med liknande projekttyp och storlek.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för bygg, entreprenad & installation?",
        answer:
          "Det beror på er projektprofil och storlek. På d365.se listar vi flera partners med erfarenhet av bygg, entreprenad och installation – vissa är specialiserade på Project Operations + BC, andra arbetar med F&SCM för större aktörer, och andra har dokumenterade ISV-tillägg för svensk byggekonomi.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i bygg, entreprenad eller installation av jämförbar storlek, (2) hur de hanterar ÄTA, underentreprenörer och projektredovisning, och (3) vilka kalkyl- och tidrapporteringssystem de integrerat mot tidigare.",
      },
    ],
  },
  {
    slug: "dynamics-365-energi-utilities",
    title: "Dynamics 365 för energi & utilities",
    metaTitle: "Dynamics 365 för energi & utilities – guide & partners",
    metaDescription:
      "Dynamics 365 för energi & utilities stöttar fältservice, ärenden, projekt och kund med CIS/MDM-integration. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 fungerar som plattform för svenska energi- och utilitiesbolag – ekonomi, projekt, fältservice och kund, integrerat med CIS/MDM och GIS/NIS. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["energi", "utilities", "el", "fjärrvärme", "vatten", "dynamics365", "business central", "finance scm", "field service"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Field Service",
      "Customer Service",
      "Contact Center",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: energiImg,
    readingTimeMinutes: 10,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Energi &amp; Utilities
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Svensk energisektor befinner sig i en fundamental omställning.
          Elektrifiering av industri och transporter, övergången till förnybar
          produktion och ökad fokus på försörjningstrygghet skapar ett nytt
          marknadslandskap för el-, fjärrvärme-, vatten- och återvinningsbolag.
          Kraven på systemstöd har förändrats i grunden: det räcker inte längre
          med ett ekonomisystem och ett underhållssystem som pratar dåligt med
          varandra.
        </p>
        <p>
          Branschen hanterar kritisk infrastruktur med höga krav på
          driftsäkerhet, och kombinerar tunga tillgångsinvesteringar med löpande
          underhåll, komplexa regulatoriska rapporteringskrav och ett
          kundgränssnitt som förväntas vara digitalt och proaktivt. Det som
          tidigare var separata system för drift (OT) och administration (IT)
          behöver i allt högre grad kopplas samman för att möjliggöra
          prediktivt underhåll, bättre kapacitetsplanering och faktabaserade
          investeringsbeslut.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska energibolag som vill samla
          ekonomistyrning, anläggningsförvaltning, projektstyrning, fältservice
          och kundservice i en gemensam plattform. Systemet integrerar med
          branschspecifika ISV-lösningar för mätvärdeshantering och avräkning,
          samt med GIS- och SCADA-system via öppna API:er.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Anläggningsförvaltning och ekonomistyrning</h3>
        <p>
          F&amp;SCM är kärnan för större energibolag med komplexa krav på
          anläggningsregister, projektredovisning och ekonomistyrning. Systemet
          hanterar hela livscykeln för tillgångar från investering till
          avyttring, och ger underlag för de myndighetskrav på rapportering som
          präglar reglerade verksamheter.
        </p>
        <ul>
          <li>Anläggningsregister med full tillgångsspårning, avskrivningar och underhållshistorik</li>
          <li>Projektredovisning för infrastrukturinvesteringar med budget, prognos och kostnadskontroll</li>
          <li>Ekonomistyrning med stöd för att separera reglerad och avreglerad verksamhet via finansiella dimensioner</li>
          <li>Regelefterlevnad och rapportering till myndigheter som Energimarknadsinspektionen</li>
          <li>Inköp och logistik för material till underhåll och nyanslutningar</li>
        </ul>

        <h3>Business Central: ERP för medelstora energibolag och tjänsteföretag</h3>
        <p>
          Business Central passar medelstora energibolag och specialiserade
          tjänsteföretag som behöver ett sammanhållet system för ekonomi,
          projekt och service utan F&amp;SCM:s komplexitet. Systemet täcker
          grundläggande behov av finansiell styrning, projektuppföljning och
          inköp i ett hanterbart format.
        </p>
        <ul>
          <li>Ekonomi, fakturering och reskontra i ett integrerat flöde</li>
          <li>Projektstyrning för nät- och anläggningsprojekt med budgetuppföljning</li>
          <li>Inköp och leverantörshantering för material och tjänster</li>
          <li>Integration mot Microsofts ekosystem för analys och rapportering via Power BI</li>
        </ul>

        <h3>Field Service: Fältservice och underhållsoptimering</h3>
        <p>
          Field Service är kritiskt för energibolag med en geografiskt spridd
          teknikerstyrka som hanterar underhåll, akuta reparationer och
          nyanslutningar. Systemet optimerar schemaläggning och ruttplanering,
          ger tekniker mobil åtkomst till arbetsordrar och anläggningsinformation,
          och stänger slingan tillbaka till ekonomi och anläggningsregister när
          arbetet är utfört.
        </p>
        <ul>
          <li>Automatisk schemaläggning av förebyggande underhåll baserat på anläggningsdata och intervaller</li>
          <li>Optimering av teknikerrutter för minimerade körningar och kortare svarstider vid avbrott</li>
          <li>Mobil åtkomst till arbetsordrar, ritningar och historik för tekniker i fält</li>
          <li>Integration mot SCADA för automatisk skapande av arbetsorder vid larm och avvikelser</li>
        </ul>

        <h3>Customer Service &amp; Contact Center: Kundärenden och driftstörningskommunikation</h3>
        <p>
          Energibolag med direktkundkontakt behöver ett system som ger
          kundtjänst en 360-gradersvy av kunden – avtalsstatus, mätdata,
          fakturahistorik och pågående ärenden. Customer Service och Contact
          Center hanterar ärenden från alla kanaler och möjliggör proaktiv
          kommunikation vid planerade och oplanerade driftstörningar.
        </p>
        <ul>
          <li>Enhetlig ärendehantering för avtalsfrågor, flytt, fakturafrågor och driftstörningar</li>
          <li>Intelligent dirigering av inkommande kontakter baserat på ärendetyp och kundsegment</li>
          <li>AI-stöd för agenter med förslag på svar och tillgång till relevant kunddata i realtid</li>
        </ul>

        <h2>Listade partners inom Energi &amp; Utilities</h2>
        <p>
          Två partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>Sherpas Group AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management | AI Integration Partner
        </p>
        <p>
          Sherpas Group bistår energibolag inom el, fjärrvärme, vatten och
          återvinning med implementering av Dynamics 365 Business Central och
          F&amp;SCM. Deras fokus ligger på finansiell styrning, logistik och
          försörjningskedjor, och de arbetar med systemstöd för att hantera de
          processer som är specifika för tillgångstunga, reglerade verksamheter.
          Som AI Integration Partner arbetar de aktivt med att integrera AI i
          sina leveranser – relevant för energibolag som vill nyttja driftsdata
          för prediktivt underhåll och bättre kapacitetsplanering.
        </p>

        <h3>Sopra Steria</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management | AI Enabled
        </p>
        <p>
          Sopra Steria är en etablerad partner med erfarenhet av komplexa
          implementationsprojekt i energisektorn. Deras styrka är förmågan att
          se verksamheten ur ett process- och effektperspektiv och arbeta
          metodiskt för att säkerställa affärsnytta – inte bara teknisk
          leverans. Kombinationen av BC/F&amp;SCM-kompetens med ett av Sveriges
          större CRM-team ger dem kapacitet att täcka hela kundresan, från
          back-office till kundservice. Det globala nätverket med
          specialistkompetens inom förändringsledning och analys är ett
          mervärde vid större digitaliseringsprogram.
        </p>

        <IndustryPartnerListInline industry="Energi & Utilities" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Energi och utilities är en av de mer specialiserade branscherna på
          d365.se, och med bara två listade partners är urvalet begränsat.
          Båda täcker samma ERP-applikationer (BC och F&amp;SCM), men
          profilerna är tydligt åtskilda: Sherpas Group med ett aktivt AI
          Integration-fokus och branscherfarenhet från energiinfrastruktur,
          Sopra Steria med ett mer processorienterat och metoddrivet
          angreppssätt och ett bredare tjänsteutbud mot kundservice och CRM.
        </p>
        <p>
          För energibolag med komplexa krav kan det också vara värt att titta
          på partners listade under angränsande branscher – exempelvis Vivicta
          under Jordbruk &amp; Skogsbruk, som explicit nämner process- och
          skogsindustri som branschfokus. Frågan att ställa till varje partner
          är hur många energibolag av liknande typ och storlek de har
          implementerat hos, och om de kan visa på konkreta referenskunder i
          branschen.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/energi-utilities/">d365.se/branscher/energi-utilities</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett energi- eller utilitiesbolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – i princip standardvalet för större energi- och utilitiesbolag. Field Service ligger på {{price:field-service:short}} och Customer Service Enterprise på {{price:customer-service-enterprise:short}}.\n\nImplementationskostnaden för ett medelstort energi- eller utilitiesbolag landar typiskt i intervallet 1 500 000 – 6 000 000 kr beroende på integrationer mot mätvärdesinsamling (CIS/MDM), nätinformationssystem (GIS/NIS) och fakturering. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter energi- och utilitiesbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) komplex faktureringslogik för energi, nät och tilläggstjänster som inte fullt ut täcks av standard utan branschtillägg; (2) integration mot mätvärdes- och nätinformationssystem som underskattas; (3) fältservice för nätunderhåll och anslutningsärenden som inte kopplas hela vägen till ekonomi och kund; och (4) regelefterlevnad mot Ei och elmarknadens roller som kräver att datamodellen byggs rätt.\n\nDet är också vanligt att man underskattar förändringsarbetet – fältpersonal och kundtjänst behöver enkla gränssnitt och tydliga processer för att adoptera systemet.",
      },
      {
        question: "Dynamics 365 vs specialiserade energi- och utilitiessystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade energi- och utilitiessystem (CIS/MDM som Mecoms, Tieto/Tietoevry, Hansen) har djup branschfunktionalitet för mätvärdeshantering, avräkning och fakturering enligt elmarknadens regler. Dynamics 365 är en bredare affärsplattform för ekonomi, fältservice, kund och projekt.\n\nDen vanligaste arkitekturen är att behålla specialistsystem för mätvärden och fakturering och låta D365 vara back-office för ekonomi, fältservice, kund och projekt – med integration däremellan. Frågan att ställa: hur mycket av branschspecifik fakturerings- och avräkningslogik klarar D365 utan kostsam särutveckling?",
      },
      {
        question: "Vad säger andra energi- och utilitiesbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna är generellt positiva när scope hålls realistiskt. Bolag som använt D365 som ekonomi-, fältservice- och kundplattform med integration mot specialiserade CIS/MDM rapporterar god utväxling – särskilt på fältservice, kundhantering och projektredovisning för investeringar i nät och produktion. Bolag som försökt täcka all branschspecifik fakturering direkt i D365 utan tillägg har oftare stött på dyr särutveckling.\n\nEn återkommande lärdom är att tidigt definiera vad D365 äger respektive vad branschsystemen behåller, och att be partnern uppvisa konkreta referenscase i energi- och utilitiesbranschen.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för energi & utilities?",
        answer:
          "Det beror på er roll i värdekedjan (produktion, nät, försäljning) och er storlek. På d365.se listar vi flera partners med erfarenhet av energi och utilities – vissa är specialiserade på Field Service och Customer Service för nät- och kundärenden, andra arbetar med F&SCM för större aktörer med komplex ekonomi och projektportfölj.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i energi eller utilities av jämförbar storlek, (2) vilka CIS/MDM- och GIS/NIS-integrationer de genomfört, och (3) hur de hanterar elmarknadens roller och regelefterlevnad.",
      },
    ],
  },
  {
    slug: "dynamics-365-konsultbolag-tjansteforetag",
    title: "Dynamics 365 för konsultbolag & tjänsteföretag",
    metaTitle: "Dynamics 365 för konsultbolag & tjänsteföretag – guide",
    metaDescription:
      "Dynamics 365 för konsultbolag (Project Operations + BC) ger tid, projekt, prognoser, sälj och ekonomi i samma plattform. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 (Project Operations + BC eller F&SCM) är en stark plattform för svenska konsult- och tjänsteföretag – tid, projekt, prognoser, sälj och ekonomi i samma datamiljö. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["konsult", "tjänsteföretag", "projekt", "dynamics365", "business central", "finance scm", "sales", "progressus"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: konsultImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Konsultbolag &amp; Tjänsteföretag
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Konsultbranschen är kunskapsintensiv och marginaldriven. Det som
          avgör lönsamheten är inte produktionsvolym utan beläggningsgrad,
          faktureringsprecision och förmågan att leverera projekt inom budget.
          Det är en enkel ekvation i teorin – men komplex att styra i praktiken
          när man hanterar dussintals projekt, hundratals konsulter och en
          pipeline som ständigt förändras.
        </p>
        <p>
          Det vanligaste problemet är fragmentering: tidrapportering i ett
          system, projektplanering i ett annat, ekonomi i ett tredje och CRM i
          ett fjärde. Informationsglapp mellan sälj och leverans leder till
          felaktiga förväntningar och resursbrist. Utan realtidsinsikt i
          projektens ekonomi är det svårt att identifiera avvikelser i tid. Och
          komplexa faktureringsmodeller – fastpris, löpande räkning, a conto,
          retainers – hanteras manuellt med alla de felkällor det innebär.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska konsultföretag för att
          koppla samman hela kedjan från första kundkontakt till slutfaktura i
          ett sammanhållet system. Plattformen täcker CRM och säljstöd, resurs-
          och kompetensplanering, projektledning, tid- och utläggsrapportering,
          projektredovisning och fakturering – och kan kompletteras med
          branschspecifika tillägg för djupare projekthanteringsfunktionalitet.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central: Projektledning, ekonomi och fakturering</h3>
        <p>
          Business Central är grunden för de flesta svenska konsultföretag i
          SMB-segmentet. Systemet täcker hela projektflödet från budget och
          resursplanering till tidrapportering, fakturering och ekonomisk
          uppföljning. Kan kompletteras med tredjepartstillägg som Progressus
          Advanced Projects för djupare projekthanteringsfunktionalitet.
        </p>
        <ul>
          <li>Projekthantering med budget, faser och realtidsuppföljning av kostnader, intäkter och marginaler</li>
          <li>Resurs- och kompetensplanering med visuell beläggningsöversikt och tillgänglighetshantering</li>
          <li>Tid- och utläggsrapportering via webb och mobil, kopplad direkt till projekt och aktiviteter</li>
          <li>Projektfakturering med stöd för fastpris, löpande räkning, a conto och retainermodeller</li>
          <li>Intäktsavräkning och projektredovisning för korrekt finansiell rapportering</li>
          <li>Avtalshantering för kundavtal, ramavtal och prissättningsvillkor</li>
        </ul>

        <h3>Finance &amp; Supply Chain Management: Komplex projektredovisning för större organisationer</h3>
        <p>
          F&amp;SCM passar större konsultorganisationer med komplexa krav på
          finansiell styrning, koncernredovisning och detaljerad
          projektredovisning. Systemet hanterar avancerad intäktsavräkning,
          interndebitering och finansiell rapportering över flera juridiska
          entiteter.
        </p>
        <ul>
          <li>Avancerad projektredovisning med stöd för successiv vinstavräkning och projektbokföring</li>
          <li>Ekonomistyrning över flera bolag och valutor med konsoliderad finansiell rapportering</li>
          <li>Likviditetsprognoser baserade på pipeline och pågående projekt</li>
          <li>Detaljerade analyser av projektlönsamhet, efterkalkyler och beläggningsnyckeltal</li>
        </ul>

        <h3>Sales: Pipeline, offerter och överlämning till leverans</h3>
        <p>
          Dynamics 365 Sales hanterar hela säljcykeln för konsultföretag —
          från lead och offert till vunnet uppdrag och överlämning till
          leveransorganisationen. En sömlös integration mellan sälj och projekt
          minskar informationsglapp och säkerställer att rätt resurser är
          bokade när projektet startar.
        </p>
        <ul>
          <li>Pipeline-hantering med prognos för framtida intäkter och resursbehov</li>
          <li>Offerthantering med resursestimat och prissättning kopplad till kompetensregister</li>
          <li>Överlämningsprocess från vunnet kontrakt till projektstart med bibehållen kontextdata</li>
          <li>360-gradersvy av kunden med kontakthistorik, projekthistorik och affärsmöjligheter</li>
        </ul>

        <h2>Listade partners inom Konsulttjänster</h2>
        <p>
          Sex partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>NAB Solutions</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center
        </p>
        <p>
          NAB Solutions har arbetat med Microsoft Dynamics sedan 2001 och
          kombinerar djup BC-kompetens med ett brett CRM- och serviceuttag.
          För konsultföretag som vill koppla samman projektledning och ekonomi
          med säljstöd, marknadsföring och kundservice i ett gemensamt
          ekosystem är NAB Solutions ett av få partners i listan som täcker
          hela den bredden. Deras långa erfarenhet av att digitalisera
          tjänsteföretag ger dem god förståelse för de processer som är
          specifika för konsultaffären.
        </p>

        <h3>Fellowmind</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights
        </p>
        <p>
          Fellowmind täcker hela spannet från BC till F&amp;SCM och kombinerar
          ERP-kompetens med CRM. För konsultorganisationer som växer i
          komplexitet – fler enheter, internationell verksamhet, avancerade
          krav på koncernredovisning – erbjuder Fellowmind kapacitet att följa
          med. Deras europeiska leveranskapacitet och breda portfölj gör dem
          till ett relevant alternativ för konsultföretag med ambitiösa
          tillväxtplaner.
        </p>

        <h3>Sopra Steria</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management | AI Enabled
        </p>
        <p>
          Sopra Steria arbetar metodiskt och processorienterat och lyfter
          explicit fram Progressus Advanced Projects som ett komplement till BC
          för konsultföretag med komplexa projektbehov. Kombinationen av
          ERP-kompetens med ett av Sveriges större CRM-team ger dem kapacitet
          att täcka hela kundresan. Det globala nätverket med specialister
          inom förändringsledning och analys är ett mervärde för konsultföretag
          som driver ett större digitaliseringsprogram.
        </p>

        <h3>Goodfellows</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central | AI Integration Partner
        </p>
        <p>
          Goodfellows har ett uttalat fokus på konsult- och projektbolag och
          levererar BC förstärkt med Progressus Advanced Projects – ett
          integrerat tillägg för djupare projekthantering från Pryme. Deras
          erbjudande täcker tidrapportering, resursplanering, projektekonomi
          och fakturering i ett sammanhållet flöde. Leveransmodellen är tydlig
          och förutsägbar med bibehållna konsulter från förstudie till
          förvaltning, vilket minskar riskerna i implementationen. För
          konsultföretag där projekt är verksamhetens kärna är Goodfellows ett
          av de mest specialiserade alternativen i listan.
        </p>

        <h3>Bisqo AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">Business Central</p>
        <p>
          Bisqo är en BC-specialist med erfarenhet från tjänsteföretag och
          konsultverksamhet. Deras fokus ligger på att leverera anpassade
          BC-lösningar som stödjer projektflöden, ekonomistyrning och
          kundhantering för medelstora konsultföretag. Passar organisationer
          som söker en hands-on BC-partner med god processförståelse och
          tydligt leveransansvar.
        </p>

        <h3>InBiz</h3>
        <p className="!text-sm text-muted-foreground !mb-2">Business Central</p>
        <p>
          InBiz är en Uppsala-baserad BC-specialist, certifierad
          Microsoft-partner sedan 2005, med erfarenhet av tjänsteföretag och
          projektstyrning. De levererar heltäckande BC-lösningar där ekonomi,
          projekthantering och kundrelationer hanteras i ett sammanhållet
          system, och arbetar med egna tillägg för att möta specifika
          verksamhetsbehov. Passar konsultföretag som söker en stabil och
          erfaren BC-partner med tydligt leveransansvar och god lokal närvaro.
        </p>

        <IndustryPartnerListInline industry="Konsulttjänster" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Konsulttjänster är en bransch där valet mellan partners i hög grad
          handlar om djup kontra bredd. Goodfellows och NAB Solutions har
          tydliga profiler mot konsult- och tjänsteföretag. Fellowmind och
          Sopra Steria erbjuder bredare plattformskapacitet med konsulttjänster
          som ett av flera segment.
        </p>
        <p>
          En central fråga för konsultföretag är om BC räcker som projektsystem,
          eller om ni behöver ett dedikerat projekthanteringstillägg som
          Progressus Advanced Projects. Goodfellows och Sopra Steria lyfter
          båda fram detta alternativ – vilket är ett tecken på att de mött
          konsultföretag vars projektbehov överskrider BC-standardens kapacitet.
        </p>
        <p>
          En annan relevant fråga: hur viktig är kopplingen mellan sälj och
          leverans? Om er pipeline direkt styr resursbeläggning och ni vill ha
          ett sammanhållet flöde från offert till projektavslut är
          Sales-kompetensen hos partnern lika viktig som ERP-kompetensen.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/konsulttjanster/">d365.se/branscher/konsulttjanster</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett konsult- eller tjänsteföretag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Project Operations kostar {{price:project-operations:short}} och är central för tid-, projekt- och faktureringsstyrning. Sales Enterprise ligger på {{price:sales-enterprise:short}}. Finance kostar {{price:finance:short}} – relevant för större konsultbolag.\n\nImplementationskostnaden för ett medelstort konsultbolag landar typiskt i intervallet 500 000 – 2 500 000 kr beroende på antal användare, integrationer mot lön/HR och komplexitet i prismodell och utlandsverksamhet. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter konsult- och tjänsteföretag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) tidrapporterings- och godkännandeflöden som inte är friktionsfria för konsulterna; (2) komplexa prismodeller (fastpris, löpande, retainer, prenumeration) som inte modelleras tillräckligt; (3) projektprognoser och beläggning som inte uppdateras i realtid; och (4) integration mot HR/lön, expense management och kund-CRM som underskattas.\n\nDet är också vanligt att man underskattar förändringsarbetet – om tidrapporteringen är klumpig sker den för sent och projektekonomin blir oprecis.",
      },
      {
        question: "Dynamics 365 vs Maconomy, Visma.net Project och Cinode – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade PSA-system (Maconomy, Visma.net Project, Certinia, Cinode för kompetenshantering) har djup branschfunktionalitet ur lådan och kommer ofta snabbare i drift. Dynamics 365 (Project Operations + BC eller F&SCM) är en bredare plattform med stark projekt- och tidlogik som kompletteras med Microsofts ekosystem för CRM, Office, Teams och AI.\n\nValet styrs av ambitionsnivå: behöver ni främst PSA är ett specialistsystem ofta tillräckligt. Behöver ni ett gemensamt dataekosystem där sälj, leverans, ekonomi och kund ligger i samma plattform – och där ni vill bygga vidare med automation och Copilot – är D365 motiverat. Frågan att ställa: hur mycket utöver PSA vill ni att plattformen ska göra de närmaste 3–5 åren?",
      },
      {
        question: "Vad säger andra konsult- och tjänsteföretag som infört Dynamics 365?",
        answer:
          "Erfarenheterna är generellt positiva när scope hålls realistiskt. Bolag som infört Project Operations + BC eller F&SCM rapporterar god utväxling – särskilt på beläggning, projektprognoser, fakturering och kundhantering. Bolag som försökt ersätta även HR/lön och avancerad kompetenshantering med D365 direkt har oftare stött på begränsningar och kompletterat med specialistsystem i efterhand.\n\nEn återkommande lärdom är att börja med tid, projekt och fakturering, säkra adoption hos konsulterna, och därefter bygga ut med sälj, prognoser och AI-stöd.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för konsult- och tjänsteföretag?",
        answer:
          "Det beror på er storlek och prismodell. På d365.se listar vi flera partners med erfarenhet av konsultbolag – vissa är specialiserade på Project Operations + BC för medelstora aktörer, andra arbetar med F&SCM för större internationella konsultkoncerner, och andra har djup CRM- och Customer Insights-profil för säljdrivna konsultbolag.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i konsult- eller tjänsteföretag av jämförbar storlek, (2) hur de modellerar er prismodell (fastpris, löpande, retainer), och (3) hur de säkrar adoption av tidrapportering hos konsulterna.",
      },
    ],
  },
  {
    slug: "dynamics-365-finans-forsakring",
    title: "Dynamics 365 för finans & försäkring",
    metaTitle: "Dynamics 365 för finans & försäkring – guide & partners",
    metaDescription:
      "Dynamics 365 för finans & försäkring stöttar distribution, CRM, kundtjänst och Customer Insights mot kärnsystem. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 stödjer svenska finans- och försäkringsbolag på CRM-sidan – distribution, kundtjänst, Customer Insights och compliance – med integration mot bank- och försäkringskärnsystem. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["finans", "försäkring", "bank", "dynamics365", "business central", "finance scm", "customer insights", "compliance"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Customer Insights",
      "Contact Center",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: finansImg,
    readingTimeMinutes: 10,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Finans &amp; Försäkring
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Finans- och försäkringsbranschen är hårt reglerad, dataintensiv och
          under konstant transformationstryck. FinTech-utmanare, nya
          kundförväntningar på digital service och ett regulatoriskt landskap
          som kontinuerligt förändras – IFRS 17, Solvens II, MiFID II, AML —
          ställer höga krav på systemstödets flexibilitet och spårbarhet.
          Äldre, isolerade kärnsystem är en av de största bromsklossarna: de är
          kostsamma att underhålla, svåra att integrera och producerar inte den
          realtidsdata som krävs för att styra verksamheten.
        </p>
        <p>
          Utmaningen är inte att hitta ett system som löser allt – det finns
          inget sådant. Dynamics 365 fungerar typiskt som ett övergripande skal
          för CRM, ekonomistyrning och kundservice, integrerat med befintliga
          kärnsystem för portföljhantering, skadehantering eller avräkning. Det
          ger en enhetlig bild av kunden och automatiserade processer för
          regelefterlevnad och rapportering, utan att kräva att hela
          systemlandskapet byts ut på en gång.
        </p>
        <p>
          För banker, försäkringsbolag och finansiella rådgivningsföretag är
          den centrala affärsnyttan densamma: en 360-gradersvy av kunden,
          automatiserade compliance-flöden, och ett kundservicesystem som ger
          rätt information vid rätt tidpunkt – oavsett kanal.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Regulatorisk rapportering och finansiell styrning</h3>
        <p>
          F&amp;SCM är relevant för finansbolag och försäkringsbolag med
          komplexa krav på finansiell konsolidering, regulatorisk rapportering
          och koncernredovisning. Systemet kan konfigureras för att stödja
          specifika rapporteringsstandarder och separera reglerad från
          avreglerad verksamhet via finansiella dimensioner.
        </p>
        <ul>
          <li>Finansiell konsolidering och rapportering anpassad för branschspecifika standarder som IFRS och Solvens II</li>
          <li>Separering av reglerad och avreglerad verksamhet inom samma system via finansiella dimensioner</li>
          <li>Automatiserade avstämningar och revisionsloggar för intern kontroll och externa revisioner</li>
          <li>Budgetering, prognostisering och likviditetsplanering med realtidsunderlag</li>
        </ul>

        <h3>Sales: Rådgivningsprocesser och komplex B2B/B2C-försäljning</h3>
        <p>
          Dynamics 365 Sales stödjer finansiella rådgivare och affärsutvecklare
          med strukturerad pipeline-hantering, dokumentation av kunddialog och
          spårbarhet i rådgivningsprocessen. I en bransch med strikta
          dokumentationskrav är den automatiska loggningen av kundinteraktioner
          ett direkt compliance-stöd.
        </p>
        <ul>
          <li>Pipeline-hantering för komplexa produkter med långa säljcykler</li>
          <li>Dokumentation av rådgivningstillfällen med spårbarhet för regelefterlevnad</li>
          <li>360-gradersvy av kunden med innehav, historik och kommunikation</li>
          <li>Offert- och avtalshantering för finansiella produkter och tjänster</li>
        </ul>

        <h3>Customer Service &amp; Contact Center: Skadehantering och kundservice</h3>
        <p>
          Customer Service ger kundtjänst och skadereglerare en enhetlig bild av
          kunden och ärendet – oavsett vilken kanal kunden kontaktar bolaget
          via. Contact Center optimerar dirigering av inkommande kontakter
          baserat på ärendetyp och ger agenter AI-stöd i realtid. Tillsammans
          skapar de ett kundserviceflöde som möter branschens krav på snabb,
          korrekt och spårbar ärendehantering.
        </p>
        <ul>
          <li>Ärendehantering för skadeanmälningar, avtalsfrågor och rådgivningsförfrågningar</li>
          <li>Automatiserade arbetsflöden för skadehantering från registrering till reglering</li>
          <li>Intelligent dirigering av inkommande kontakter baserat på ärendetyp och kundsegment</li>
          <li>AI-stöd för agenter med förslag på svar och tillgång till relevant kunddata</li>
        </ul>

        <h3>Customer Insights: Kunddata och personalisering</h3>
        <p>
          I en bransch med stora datamängder men ofta fragmenterade kundbilder
          är Customer Insights en strategisk komponent. Applikationen aggregerar
          data från olika källor – transaktionssystem, CRM, kundservice – till
          en enhetlig kundprofil som möjliggör segmentering, proaktiv service
          och personaliserade erbjudanden.
        </p>
        <ul>
          <li>Enhetlig kundprofil aggregerad från transaktionssystem, CRM och kundservice</li>
          <li>Segmentering baserad på beteende, innehav och riskprofil</li>
          <li>Proaktiv kommunikation vid livshändelser eller portföljförändringar</li>
        </ul>

        <h2>Listade partners inom Finans &amp; Försäkring</h2>
        <p>
          Tre partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>Sopra Steria</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management | AI Enabled
        </p>
        <p>
          Sopra Steria arbetar processorienterat och metoddrivet med ett
          uttalat fokus på att varje implementation ska ge mätbar affärsnytta.
          I finans- och försäkringsbranschen kombinerar de ERP-kompetens med
          ett av Sveriges större CRM-team, vilket ger dem kapacitet att täcka
          både back-office-processer och kundrelationssidan. Det globala
          nätverket med specialister inom förändringsledning, analys och
          compliance är ett mervärde för finansbolag som driver komplexa
          moderniseringsprogram med höga regulatoriska krav.
        </p>

        <h3>NAB Solutions</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center
        </p>
        <p>
          NAB Solutions har arbetat med Microsofts plattform sedan 2001 och
          kombinerar BC med ett brett CRM- och serviceuttag. För finansbolag
          och försäkringsförmedlare som prioriterar kundrelationer,
          rådgivningsdokumentation och effektiv kundservice är NAB Solutions
          ett relevant alternativ. Deras portfölj täcker hela kundresan – från
          marknadsföring och försäljning till ärendehantering och kontaktcenter
          – i ett sammanhållet Dynamics 365-ekosystem.
        </p>

        <h3>Enqore AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations
        </p>
        <p>
          Enqore täcker hela Dynamics 365-plattformen med ett tydligt fokus på
          datadrivna och AI-stödda processer. I finansbranschen – där stora
          datamängder finns men insikterna ofta kommer för sent – är deras
          profil direkt relevant: de kopplar samman affärssystem med analys och
          AI för att möjliggöra prediktivt beslutsfattande snarare än reaktivt.
          Relevant för finansbolag som vill nyttja sin data mer aktivt för
          riskhantering, kundbearbetning och processautomation.
        </p>

        <IndustryPartnerListInline industry="Finans & Försäkring" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Finans och försäkring är en bransch där systemval och partnerval
          ställs inför ett komplext krav: kombinationen av strikta
          regulatoriska krav, känslig kunddata och ett befintligt
          systemlandskap av äldre kärnsystem som inte kan ersättas i ett svep.
          Det ställer höga krav på partnerns förståelse för
          integrationskomplexitet och compliance-aspekter.
        </p>
        <p>
          Med tre listade partners är urvalet begränsat, och profilerna är
          tydligt åtskilda: Sopra Steria med processorienterad metodstyrning
          och global specialistkompetens, NAB Solutions med djup CRM- och
          servicefokus, Enqore med datadrivet och AI-orienterat angreppssätt.
          Ingen av dem är en renodlad finansspecialist – de är alla bredare
          Dynamics 365-partners som arbetar i branschen.
        </p>
        <p>
          En relevant fråga att ställa varje partner är hur de hanterar
          integration mot befintliga kärnsystem, och om de har referenskunder i
          finansbranschen med liknande regulatorisk komplexitet som er
          verksamhet.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/finans-forsakring/">d365.se/branscher/finans-forsakring</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett finans- eller försäkringsbolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Sales Enterprise ligger på {{price:sales-enterprise:short}}, Customer Service Enterprise på {{price:customer-service-enterprise:short}} och Customer Insights (Data + Journeys) på {{price:customer-insights:default}}. Finance kostar {{price:finance:short}} – relevant för intern ekonomistyrning. Contact Center kostar {{price:contact-center-komplett:short}}.\n\nImplementationskostnaden för ett medelstort finans- eller försäkringsbolag landar typiskt i intervallet 1 000 000 – 5 000 000 kr beroende på integrationer mot kärnsystem (försäkrings-/banksystem), KYC/AML-system samt regulatoriska rapporteringskrav. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter finans- och försäkringsbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) compliance, KYC och AML som inte byggs in tidigt nog i kundprocesserna; (2) integration mot kärnsystem (försäkringssystem, banksystem) som underskattas; (3) regulatorisk rapportering till Finansinspektionen som inte modelleras i datamodellen; och (4) data- och rollsegregation som krävs för att uppfylla GDPR och branschens säkerhetsregler.\n\nDet är också vanligt att man underskattar arkitekturkraven – finans och försäkring har högre krav på spårbarhet, åtkomstkontroll och dataskydd än de flesta branscher.",
      },
      {
        question: "Dynamics 365 vs Salesforce Financial Services Cloud och specialiserade försäkringssystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade försäkrings- och bankkärnsystem hanterar produkthantering, försäkringsmatematik och regulatorisk logik. Dynamics 365 och Salesforce Financial Services Cloud är CRM-plattformar för kundhantering, distribution, säljstöd och kundtjänst.\n\nValet mellan D365 och Salesforce styrs ofta av integration mot övrig IT-miljö: är ni Microsoft-tunga med Azure, Microsoft 365 och Teams är D365 en naturlig matchning. Salesforce har starkare branschspecifika moduler men kräver ett separat ekosystem. Frågan att ställa: hur väl integrerar plattformen med vår befintliga arkitektur, och vilka regulatoriska krav uppfylls ur lådan?",
      },
      {
        question: "Vad säger andra finans- och försäkringsbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna är generellt positiva när scope hålls till CRM, distribution och kundtjänst, med integration mot kärnsystemen. Bolag som infört D365 som distribution- och kundplattform rapporterar god utväxling – särskilt på distributionseffektivitet, kundservice och kampanjautomation. Bolag som försökt täcka även produkthantering eller försäkringsmatematik direkt i D365 har oftare stött på begränsningar.\n\nEn återkommande lärdom är att tidigt klargöra rollfördelningen mellan D365 och kärnsystemen, samt att involvera compliance och dataskydd från start i kravarbetet.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för finans & försäkring?",
        answer:
          "Det beror på er verksamhetstyp (bank, försäkring, fondförvaltning) och storlek. På d365.se listar vi flera partners med erfarenhet av finans och försäkring – vissa är specialiserade på CRM, distribution och Customer Insights, andra har bredare plattformskompetens med F&SCM för internationella aktörer.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i finans eller försäkring av jämförbar storlek, (2) hur de hanterar integration mot ert kärnsystem och compliance-krav, och (3) erfarenhet av regulatorisk rapportering och dataskydd.",
      },
    ],
  },
  {
    slug: "dynamics-365-offentlig-sektor",
    title: "Dynamics 365 för offentlig sektor",
    metaTitle: "Dynamics 365 för offentlig sektor – guide & partners",
    metaDescription:
      "Dynamics 365 för offentlig sektor stöttar ärenden, fältservice, projekt och medborgarkontakt med diarie-integration. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 är en plattform för svenska kommuner, regioner och myndigheter – ärendehantering, fältservice, projekt och medborgarkontakt, integrerat med diariesystem och ekonomi. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["offentlig sektor", "kommun", "myndighet", "dynamics365", "business central", "finance scm", "customer service", "lou"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Customer Service",
      "Contact Center",
      "Field Service",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: offentligImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Offentlig sektor
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Offentlig sektor i Sverige befinner sig mitt i en digital
          transformation som drivs av två parallella krafter: ökade
          medborgarförväntningar på tillgänglighet och effektivitet, och ett
          konstant krav på ansvarsfull förvaltning av skattemedel. Det gör
          it-investeringar i offentlig sektor fundamentalt annorlunda än i
          privat: det räcker inte att ett system är effektivt – det måste också
          vara rättssäkert, spårbart och upphandlat i enlighet med LOU.
        </p>
        <p>
          De vanligaste problemen är välkända: ärendehantering och ekonomi i
          separata system utan koppling, silobaserad information som försvårar
          helhetsbild och samarbete mellan förvaltningar, och ett
          systemlandskap med inbyggd komplexitet som härstammar från decennier
          av punktlösningar. Därtill hanterar kommuner och myndigheter ofta
          parallella logiker i samma organisation – skattefinansierad
          kärnverksamhet och avgiftsfinansierade tjänster som VA, renhållning
          och barnomsorg – vilket ställer krav på systemets flexibilitet.
        </p>
        <p>
          Microsoft Dynamics 365 används av offentliga aktörer som vill samla
          ekonomistyrning, ärendehantering, medborgardialog och fältservice i
          en sammanhållen plattform. Systemet kan integreras med nationell
          infrastruktur via öppna API:er och kompletteras med Power Platform
          för lågkod-anpassningar som möter specifika verksamhetsbehov utan att
          kompromissa med uppgraderbarhet.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Ekonomistyrning och offentlig upphandling</h3>
        <p>
          F&amp;SCM är relevant för kommuner och myndigheter med komplexa krav
          på budgetering, redovisning, uppföljning och offentlig upphandling.
          Systemet hanterar hela flödet från anslags- och budgethantering till
          leverantörsfaktura och rapportering, och kan separera
          skattefinansierad och avgiftsfinansierad verksamhet via finansiella
          dimensioner.
        </p>
        <ul>
          <li>Budgetering och anslagsfördelning med uppföljning mot utfall per förvaltning och kostnadsställe</li>
          <li>Ekonomisk rapportering anpassad för offentlig redovisning och externa krav</li>
          <li>Upphandlings- och inköpsprocess från behovsanalys till avtalshantering och fakturaattest</li>
          <li>Separering av skattefinansierad och avgiftsfinansierad verksamhet i samma system</li>
          <li>Anläggningsregister och investeringsuppföljning för infrastruktur och fastigheter</li>
        </ul>

        <h3>Business Central: ERP för kommunala bolag och mindre myndigheter</h3>
        <p>
          Business Central passar kommunala bolag, mindre myndigheter och
          specialiserade verksamheter som behöver ett sammanhållet system för
          ekonomi, projekt och inköp utan F&amp;SCM:s komplexitet. Systemet
          täcker grundläggande behov i ett hanterbart format med god
          integrationspotential mot kommunens övriga system.
        </p>

        <h3>Customer Service &amp; Contact Center: Ärendehantering och medborgardialog</h3>
        <p>
          Customer Service ger handläggare ett strukturerat stöd för
          ärendehantering med spårbarhet från inkommen handling till beslut och
          arkivering. Contact Center optimerar dirigeringen av inkommande
          medborgarfrågor och felanmälningar oavsett kanal – telefon, e-post,
          webb eller sociala medier – och kopplar ärendet till rätt funktion i
          organisationen.
        </p>
        <ul>
          <li>Ärendehantering med konfigurerbara handläggningsflöden per ärendetyp och förvaltning</li>
          <li>Spårbarhet och dokumentation för rättssäker handläggning och revisionslogg</li>
          <li>Medborgare kan följa sina ärenden via självserviceportal</li>
          <li>Intelligent dirigering av inkommande kontakter med AI-stöd till handläggare</li>
          <li>Flerkanalsstöd för telefon, e-post, webb och sociala medier i ett sammanhållet system</li>
        </ul>

        <h3>Field Service: Teknisk förvaltning och fältservice</h3>
        <p>
          För tekniska förvaltningar med fältpersonal inom gata, park, VA och
          fastighet optimerar Field Service planering och utförande av
          underhålls- och serviceuppdrag. Systemet hanterar arbetsorder,
          schemaläggning och mobilåtkomst för fältpersonal, och stänger
          slingan tillbaka till ekonomi och anläggningsregister när arbetet är
          utfört.
        </p>
        <ul>
          <li>Planerat och avhjälpande underhåll för offentlig infrastruktur och fastigheter</li>
          <li>Optimering av fältpersonalens rutter och scheman</li>
          <li>Mobil åtkomst till arbetsorder, ritningar och historik för tekniker i fält</li>
          <li>Felanmälningshantering med automatisk ärendegenerering och statusuppdatering</li>
        </ul>

        <h2>Listade partners inom Offentlig sektor</h2>
        <p>
          Tre partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>Sopra Steria</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management | AI Enabled
        </p>
        <p>
          Sopra Steria kombinerar ERP-kompetens med ett av Sveriges större
          CRM-team och arbetar processorienterat med fokus på mätbar
          affärsnytta. I offentlig sektor bidrar de med kartläggning av
          verksamhetsprocesser och anpassning av systemstödet mot krav på
          rättssäkerhet, transparens och tillgänglighet. Det globala nätverket
          med specialister inom förändringsledning och analys ger kapacitet att
          hantera komplexa transformationsprogram – vilket ofta är verkligheten
          när offentliga organisationer byter ut sina kärnsystem.
        </p>

        <h3>Vivicta</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources | AI Integration Partner
        </p>
        <p>
          Vivicta täcker hela Dynamics 365-plattformen med ett helhetsåtagande
          från rådgivning och lösningsdesign till implementering och
          förvaltning. Offentlig sektor är ett av deras uttalade
          fokusområden, och de kombinerar bred applikationskapacitet – ERP,
          CRM, kundservice, fältservice och HR – med Power Platform och
          Azure-integrationer för automatisering och koppling mot befintliga
          system. Som AI Integration Partner arbetar de aktivt med att
          integrera AI i sina leveranser. Passar offentliga organisationer som
          söker en partner med brett plattformsdjup och uttalad
          sektorsförståelse.
        </p>

        <h3>Enqore AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations
        </p>
        <p>
          Enqore täcker hela plattformsspannet med ett tydligt fokus på
          datadrivna och AI-stödda processer. Deras profil – att koppla samman
          affärssystem med analys och AI för att gå från reaktiv till prediktiv
          verksamhetsstyrning – är relevant för offentliga organisationer som
          vill nyttja sin data mer aktivt för resursoptimering, ärendeanalys
          och proaktiv service. Relevant för organisationer som vill kombinera
          Dynamics 365 med ett starkare analyslager.
        </p>

        <IndustryPartnerListInline industry="Offentlig sektor" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Offentlig sektor ställer ett antal krav som inte är självklara i en
          partnerutvärdering: erfarenhet av LOU-upphandlad it, förståelse för
          den rättsliga kontexten kring ärendehantering och OSL, och förmågan
          att hantera integrationer mot nationell infrastruktur och befintliga
          verksamhetssystem. Dessa frågor bör stå högt på agendan i en
          partner-RFI oavsett vilket av de tre alternativen ni utvärderar.
        </p>
        <p>
          Vivicta är den partner med bredast applikationstäckning och ett
          uttalat branschfokus på offentlig sektor. Sopra Steria erbjuder
          processmognad och global specialistkompetens för komplexa
          transformationer. Enqore för in ett datadrivet perspektiv som är
          differentierat men kräver att organisationen är redo att investera i
          analyslager utöver systemet självt.
        </p>
        <p>
          Det begränsade antalet listade partners speglar att offentlig sektor
          är ett specialiserat segment där relativt få Dynamics 365-partners
          aktivt profilerar sig. Det är ett argument för att bredda
          urvalsprocessen och titta på referenskunder hos respektive partner —
          konkret: vilka kommuner eller myndigheter har de implementerat hos,
          och med vilket resultat?
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/offentlig-sektor/">d365.se/branscher/offentlig-sektor</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för en offentlig organisation?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – relevant för större offentliga organisationer med upphandlings- och anläggningsregister. Customer Service Enterprise ligger på {{price:customer-service-enterprise:short}}, Field Service på {{price:field-service:short}} och Customer Insights (Data + Journeys) på {{price:customer-insights:default}}. Microsoft erbjuder särskild prissättning för offentlig sektor.\n\nImplementationskostnaden för en medelstor offentlig organisation landar typiskt i intervallet 1 000 000 – 5 000 000 kr beroende på integrationer mot diariesystem, ekonomisystem, e-arkiv och behov av branschspecifika tillägg. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter offentliga organisationer på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) integration mot befintliga diariesystem (Public360, W3D3, Lex) och e-arkiv som underskattas; (2) krav på offentlighet, diarieföring och bevarande som inte byggs in tidigt; (3) upphandling enligt LOU som påverkar både inköp och leverantörshantering; och (4) GDPR och informationssäkerhet med särskilda krav på spårbarhet och åtkomstkontroll.\n\nDet är också vanligt att man underskattar förändringsarbetet – offentliga organisationer har ofta starka silos och formella processer som kräver tydligt mandat och stegvis införande.",
      },
      {
        question: "Dynamics 365 vs UBW (Agresso), Public360 och specialiserade offentliga system – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade offentliga ekonomi- och diariesystem (UBW/Agresso, Public360, W3D3, Lex, Visma) har djup branschfunktionalitet för svensk offentlig förvaltning. Dynamics 365 är en bredare plattform med fokus på ärendehantering, fältservice, kund/medborgare och projekt.\n\nDen vanligaste arkitekturen i offentlig sektor är att behålla diarie- och ekonomisystem och låta D365 vara plattform för medborgar-/kundärenden, fältservice för förvaltningar (gata/park/fastighet) och projektportföljer – med integration däremellan. Frågan att ställa: hur väl integrerar partnern D365 med era befintliga diarier och ekonomisystem?",
      },
      {
        question: "Vad säger andra offentliga organisationer som infört Dynamics 365?",
        answer:
          "Erfarenheterna är generellt positiva när scope hålls till medborgarärenden, fältservice och kundnära processer, med integration mot befintliga kärnsystem. Organisationer som infört D365 som ärende- och fältserviceplattform rapporterar god utväxling – särskilt på ärendeflöden, mobil tillgång för fältpersonal och spårbarhet. Organisationer som försökt täcka även diarieföring eller komplex offentlig ekonomi direkt i D365 har oftare stött på regulatoriska och funktionella begränsningar.\n\nEn återkommande lärdom är att tidigt involvera arkivansvarig, dataskyddsombud och verksamhetsledning i kravarbetet.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för offentlig sektor?",
        answer:
          "Det beror på er typ av organisation (kommun, region, myndighet, statligt bolag) och storlek. På d365.se listar vi flera partners med erfarenhet av offentlig sektor – vissa är specialiserade på ärende- och medborgarprocesser med Customer Service och Field Service, andra arbetar med F&SCM för större statliga aktörer med komplex ekonomi.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta referenscase i offentlig sektor av jämförbar storlek, (2) hur de hanterar integration mot diariesystem, e-arkiv och ekonomisystem, och (3) erfarenhet av LOU-anpassade upphandlingsprocesser och offentlighetslagstiftning.",
      },
    ],
  },
  {
    slug: "dynamics-365-life-science-medtech",
    title: "Dynamics 365 för Life Science & Medtech",
    metaTitle: "Dynamics 365 för Life Science & Medtech – guide & partners",
    metaDescription:
      "Dynamics 365 för Life Science & Medtech hanterar GxP, validering, spårbarhet och kvalitetsstyrning med ISV-tillägg. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 (F&SCM eller BC Premium med life science-tillägg) hanterar GxP, validering, spårbarhet och kvalitetsstyrning för svenska life science- och medtech-bolag. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["life science", "medtech", "läkemedel", "dynamics365", "business central", "finance scm", "gxp", "mdr", "udi", "validering"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Field Service",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: lifeScienceImg,
    readingTimeMinutes: 12,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Life Science &amp; Medtech
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Life Science och Medtech är en av de mest krävande branscherna för
          affärssystemsval. Det är inte primärt processernas komplexitet som
          gör det svårt – det är de regulatoriska kraven som omgärdar dem.
          MDR, IVDR, ISO 13485, GxP, FDA 21 CFR Part 11: alla ställer krav på
          fullständig spårbarhet, audit trails, kontrollerad dokumenthantering
          och i många fall validering av systemförändringar. Det innebär att
          ett systemval i Life Science inte bara handlar om funktionalitet
          utan om förmågan att validera och underhålla regelefterlevnad över
          tid.
        </p>
        <p>
          Svenska Life Science-företag spänner över ett brett spektrum – från
          globala läkemedelsbolag med komplexa tillverkningsprocesser och
          internationella leveranskedjor till nischade Medtech-startups som
          säljer medicinteknisk utrustning som kräver service, kalibrering och
          Post-Market Surveillance. Systembehoven ser fundamentalt olika ut
          beroende på var i detta spektrum man befinner sig, vilket gör
          partnervalet lika viktigt som systemvalet.
        </p>
        <p>
          Microsoft Dynamics 365 används i branschen både som ERP-kärna för
          ekonomi, supply chain och produktion, och som plattform för CRM och
          fältservice. Systemet kan valideras för regulatoriska krav och
          integreras med specialiserade QMS-system via öppna API:er. Flera
          partners i listan har utvecklat branschspecifika tillägg och
          förkonfigurerade lösningar som signifikant reducerar
          valideringsarbetet och implementationstiden.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Spårbarhet, produktion och global logistik</h3>
        <p>
          F&amp;SCM är relevant för medelstora till större Life Science- och
          Medtech-företag med komplexa krav på batch/serienummerspårbarhet,
          produktionsplanering och global supply chain. Systemet hanterar hela
          kedjan från inköp av råvaror och komponenter till produktion,
          lagerhantering med utgångsdatum, och distribution – med full
          spårbarhet för UDI-krav och återkallningsprocesser.
        </p>
        <ul>
          <li>Avancerad lagerhantering med batch- och serienummerspårning från leverantör till kund</li>
          <li>Spårbarhet enligt UDI (Unique Device Identification) genom hela värdekedjan</li>
          <li>Produktionsplanering för medicintekniska tillverkare med kvalitetskontrollpunkter</li>
          <li>Global supply chain-hantering med tullhantering, temperaturkontroll och leverantörsgodkännanden</li>
          <li>Finansiell styrning och projektredovisning för FoU-projekt och kliniska studier</li>
          <li>Stöd för återkallningsprocesser med fullständig spårning och myndighetsdokumentation</li>
        </ul>

        <h3>Business Central: ERP för SMB i Life Science</h3>
        <p>
          Business Central passar små till medelstora Life Science-företag och
          Medtech-bolag som behöver ett sammanhållet system för ekonomi, lager
          och logistik utan F&amp;SCM:s komplexitet. Med rätt branschspecifika
          tillägg – exempelvis för batchhantering, kvalitetssäkring och UDI —
          kan BC möta branschkraven för de flesta SMB-aktörer i sektorn.
        </p>
        <ul>
          <li>Ekonomi, inköp och lagerstyrning i ett sammanhållet flöde</li>
          <li>Batchhantering och spårbarhet via branschspecifika tillägg</li>
          <li>Integration mot externa QMS-system via öppna API:er</li>
          <li>Projekthantering för FoU och kliniska studier i mindre skala</li>
        </ul>

        <h3>Field Service: Medicinteknisk utrustning i fält</h3>
        <p>
          För Medtech-företag som säljer utrustning som kräver installation,
          kalibrering och löpande underhåll är Field Service kritiskt – och i
          en regulatorisk kontext är det inte valfritt. Servicehistorik,
          kalibreringsprotokoll och underhållsdokumentation är en del av
          regelefterlevnaden, och Field Service tillhandahåller det digitala
          spåret som krävs vid inspektion.
        </p>
        <ul>
          <li>Servicekontrakt och förebyggande underhållsscheman för medicinteknisk utrustning</li>
          <li>Digital dokumentation av kalibrering och serviceåtgärder med fullständig spårbarhet</li>
          <li>Mobil åtkomst för fälttekniker med tillgång till servicehistorik och instruktioner</li>
          <li>Koppling till kvalitetssystem för avvikelsehantering och Post-Market Surveillance</li>
        </ul>

        <h3>Customer Service &amp; Sales: Kommersiell sida och Post-Market Surveillance</h3>
        <p>
          Försäljning i Life Science är komplex: långa säljcykler mot sjukhus
          och regioner, upphandlingsprocesser och avtalsstyrning kräver ett
          strukturerat CRM-stöd. Customer Service hanterar därtill
          reklamationer och avvikelser som en del av Post-Market Surveillance
          – en regulatorisk skyldighet som kräver systematisk insamling och
          dokumentation av produktfeedback från fält.
        </p>

        <h2>Listade partners inom Life Science &amp; Medtech</h2>
        <p>
          Fyra partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>COSMO CONSULT</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Sales, Customer Insights
        </p>
        <p>
          COSMO CONSULT är en global Microsoft-partner med specialiserade
          branschlösningar för Life Science och Medtech byggda på Business
          Central. De har egenutvecklade tilläggsmoduler specifikt för
          branschen: COSMO UDI för spårbarhet och UDI-hantering enligt MDR,
          och COSMO Quality Assurance för kvalitetstesthantering i BC.
          Kombinationen av global räckvidd (1 600+ medarbetare i 21 länder)
          och lokal närvaro (40 kollegor på 4 orter i Sverige) med djup
          BC-kompetens och branschspecifika tillägg gör dem till ett av de
          mest specialiserade alternativen i listan för SMB-segmentet i Life
          Science.
        </p>

        <h3>Navet AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center | AI Integration Partner
        </p>
        <p>
          Navet AB kombinerar BC med branschspecifika tillägg för Life Science
          – däribland Yaveon 365 Lot Management för avancerad batchhantering,
          spårbarhet och lagerflöden. De täcker också kundrelationssidan med
          Sales, Customer Service och Field Service, vilket gör dem relevanta
          för Medtech-bolag som hanterar både supply chain och
          serviceorganisation. Sedan 2023 ingår Navet i Aderian Group med ett
          bredare nordiskt IT-erbjudande. Som AI Integration Partner arbetar
          de aktivt med AI i sina leveranser.
        </p>


        <h3>Implema AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Finance, Supply Chain Management, Project Operations, Commerce, Human Resources
        </p>
        <p>
          Implema är en F&amp;SCM-specialist med fokus på ekonomi, supply
          chain, projekthantering och handel. För Life Science-bolag som
          behöver stöd för komplexa logistikkedjor, projektstyrning av FoU och
          ekonomisk kontroll i en reglerad miljö erbjuder de gedigen
          F&amp;SCM-kompetens. Deras profil är mer generalist än
          branschspecialist inom Life Science – de saknar dedikerade Life
          Science-tillägg – men är ett relevant alternativ för organisationer
          vars primära behov är avancerad supply chain och projektredovisning
          snarare än regulatorisk valideringsstöd.
        </p>

        <IndustryPartnerListInline industry="Life Science / Medtech" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Life Science och Medtech är den bransch på d365.se där skillnaden
          mellan partners är som störst. Skillnaden mellan en förkonfigurerad
          branschlösning med inbyggd GxP-compliance och valideringsstöd och en
          standardimplementation med branschanpassning är fundamental – den
          första reducerar implementationsrisk och valideringsbörda markant,
          men är sannolikt dimensionerat för medelstora till stora aktörer
          snarare än startups.
        </p>
        <p>
          COSMO CONSULT och Navet AB erbjuder BC med branschspecifika tillägg
          för UDI, batchhantering och kvalitetssäkring – relevant för
          SMB-segmentet. Implema har djup F&amp;SCM-kompetens men utan
          dedikerade Life Science-tillägg.
        </p>
        <p>
          En central fråga i er partnerutvärdering bör vara: hur hanterar
          partnern systemvalidering, och kan de uppvisa referenskunder som
          framgångsrikt genomfört en CSV-process för en Dynamics
          365-implementation i en GxP-reglerad miljö? Det är den frågan som
          tydligast separerar Life Science-specialister från
          generalistkompetens.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/life-science-medtech/">d365.se/branscher/life-science-medtech</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett life science- eller medtech-bolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Premium ligger på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – i princip standardvalet för bolag med GxP-krav, spårbarhet och kvalitetsstyrning. Sales Enterprise ligger på {{price:sales-enterprise:short}} och Field Service på {{price:field-service:short}}.\n\nImplementationskostnaden för ett medelstort life science- eller medtech-bolag landar typiskt i intervallet 1 500 000 – 7 000 000 kr beroende på GxP-validering, integrationer mot LIMS/QMS samt branschspecifika tillägg. Räkna också med löpande förvaltning på 10–20 % av implementationen per år samt revalideringskostnader.",
      },
      {
        question: "Vilka problem stöter life science- och medtech-bolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) underskattad valideringsinsats för GxP-miljöer (IQ/OQ/PQ) som påverkar både tidsplan och kostnad; (2) spårbarhet i hela kedjan från råvara till patient som inte byggs in från start; (3) integration mot LIMS, QMS och elektroniska signaturer som lämnas sent i projektet; och (4) regulatorisk rapportering till EMA, FDA och andra myndigheter som inte modelleras tidigt.\n\nDet är också vanligt att man underskattar dokumentationskraven – varje förändring i ett validerat system kräver formell change control.",
      },
      {
        question: "Dynamics 365 vs SAP, Oracle och specialiserade life science-system – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. SAP, Oracle och specialiserade life science-system (Veeva, BatchMaster, Aptean) har djup branschfunktionalitet ur lådan och ett etablerat ekosystem av valideringsexpertis. Dynamics 365 (F&SCM eller BC Premium med life science-tillägg) är en bredare plattform som med rätt branschtillägg och valideringspartner täcker GxP-kraven.\n\nValet styrs ofta av storlek och internationell närvaro: globala läkemedelsbolag väljer ofta SAP, medan medtech-bolag och nordiska life science-aktörer alltmer väljer D365 + branschtillägg. Frågan att ställa: vilken erfarenhet har partnern av GxP-validering, och vilka konkreta referenser har de i life science eller medtech?",
      },
      {
        question: "Vad säger andra life science- och medtech-bolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med valideringsansats och scope. Bolag som infört D365 med rätt life science-tillägg och en erfaren valideringspartner rapporterar generellt god utväxling – särskilt på spårbarhet, kvalitetsstyrning och regulatorisk rapportering. Bolag som underskattat valideringsinsatsen har oftare stött på förlängda projekt och oväntade kostnader.\n\nEn återkommande lärdom är att tidigt involvera kvalitets- och regulatoriskt ansvarig i kravarbetet, och att be partnern uppvisa konkreta GxP-validerade referenscase i life science eller medtech.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för life science & medtech?",
        answer:
          "Det beror på er verksamhetstyp (läkemedel, medtech, diagnostik) och storlek. På d365.se listar vi flera partners med erfarenhet av life science och medtech – vissa är specialiserade på F&SCM med GxP-validering, andra arbetar med BC Premium + branschtillägg för mindre och medelstora bolag.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och be om: (1) konkreta GxP-validerade referenscase i life science eller medtech av jämförbar storlek, (2) hur de hanterar validering, spårbarhet och change control, och (3) vilka branschspecifika tillägg de arbetar med och varför.",
      },
    ],
  },
  {
    slug: "dynamics-365-telekom-it-tjanster",
    title: "Dynamics 365 för telekom & IT-tjänster",
    metaTitle: "Dynamics 365 för telekom & IT-tjänster – guide & partners",
    metaDescription:
      "Dynamics 365 för telekom & IT-tjänster stöttar abonnemang, CPQ, ärenden och SLA mot fakturasystem. Köparsidig guide med kostnad och svenska partners.",
    summary:
      "Dynamics 365 fungerar som ryggrad för svenska telekom- och IT-tjänsteföretag – sälj, leverans, ärenden, SLA och ekonomi, integrerat med abonnemangs- och faktureringssystem. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["telekom", "it-tjänster", "prenumeration", "arr", "dynamics365", "business central", "finance scm", "project operations", "ifrs15"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Field Service",
      "Project Operations",
      "Contact Center",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: itTechImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Telekom &amp; IT-tjänster
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Telekom- och IT-tjänstebranschen har genomgått en strukturell
          förändring i affärsmodellen: från engångsleveranser och projekttimmar
          mot prenumerationsbaserade tjänster, managerade driftlösningar och
          paketerade erbjudanden som kombinerar hårdvara, mjukvara, support och
          konsulttjänster i ett abonnemang. Det ställer systemstödet inför en
          ny typ av komplexitet – inte teknisk, utan kommersiell.
        </p>
        <p>
          Att hantera en blandning av ARR-baserade prenumerationer, löpande
          projekt, förbrukningsbaserade avgifter och engångsintäkter i samma
          system, med korrekt intäktsperiodisering och automatiserad
          fakturering, är en utmaning som de flesta generella affärssystem inte
          löser utan konfiguration. Lägg därtill behovet av en enhetlig
          kundbild som kopplar samman sälj, leverans, support och fakturering —
          och man förstår varför fragmenterade system är branschens vanligaste
          systemsmärta.
        </p>
        <p>
          Microsoft Dynamics 365 används av telekom- och IT-tjänsteföretag för
          att samla hela affärscykeln i en plattform: från offert och
          kontraktshantering via projektleverans och resursplanering till
          prenumerationsfakturering och ärendehantering. Systemets modulära
          uppbyggnad gör det möjligt att kombinera ERP och CRM i ett ekosystem
          och integrera mot branschspecifika system för provisionering och
          övervakning via öppna API:er.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Prenumerationsfakturering och intäktsredovisning</h3>
        <p>
          F&amp;SCM är relevant för telekom- och IT-tjänsteföretag med komplexa
          krav på automatiserad prenumerationsfakturering, intäktsperiodisering
          och finansiell rapportering. Systemet hanterar blandade
          intäktsströmmar och säkerställer korrekt redovisning enligt IFRS 15 —
          en central utmaning för bolag med fleråriga servicekontrakt och
          paketerade erbjudanden.
        </p>
        <ul>
          <li>Prenumerationsfakturering med automatisering för månads-, kvartals- och årsabonnemang</li>
          <li>Intäktsperiodisering och redovisning av bundlade erbjudanden enligt IFRS 15</li>
          <li>Hantering av prisjusteringar, uppgraderingar, nedgraderingar och avtalsförnyelser</li>
          <li>Projektredovisning för leveransprojekt parallellt med löpande serviceintäkter</li>
          <li>Finansiell rapportering med nyckeltal som ARR, MRR och kundlivstidsvärde</li>
        </ul>

        <h3>Business Central: ERP för medelstora IT-bolag</h3>
        <p>
          Business Central passar medelstora telekom- och IT-tjänsteföretag som
          behöver ett sammanhållet system för ekonomi, projekthantering och
          enklare prenumerationshantering utan F&amp;SCM:s komplexitet. Med
          rätt konfiguration och eventuella tillägg täcker BC grundläggande
          behov av fakturaautomatisering och projektuppföljning.
        </p>

        <h3>Project Operations: Från sälj till projektleverans</h3>
        <p>
          Project Operations kopplar samman säljpipeline, resursplanering och
          projektleverans i ett sammanhållet flöde – en kritisk integration för
          IT-konsultbolag och managerade tjänster där rätt resurs vid rätt
          tidpunkt direkt påverkar lönsamheten. Systemet hanterar
          tidrapportering, resursoptimering och projektekonomin från
          budgeterat till fakturerat.
        </p>
        <ul>
          <li>Resurs- och kompetensplanering med visuell beläggningsöversikt</li>
          <li>Tidrapportering kopplad direkt till projekt och faktureringsunderlag</li>
          <li>Projektbudget, prognos och realtidsuppföljning av marginaler</li>
          <li>Sömlös överlämning från vunnet CRM-ärende till projektstart</li>
        </ul>

        <h3>Sales &amp; Customer Service: Komplexa offerter och SLA-styrning</h3>
        <p>
          Dynamics 365 Sales hanterar komplexa offertprocesser med paketerade
          erbjudanden och långa säljcykler – relevant för IT-bolag som säljer
          mot enterprise-kunder. Customer Service säkerställer SLA-efterlevnad
          och ger supportteamet en 360-gradersvy av kunden med komplett
          ärendehistorik, kontraktsstatus och faktureringsinformation.
        </p>
        <ul>
          <li>CPQ-stöd för konfigurering av komplexa offerter med produkter, tjänster och licenser</li>
          <li>Pipelinehantering med ARR-prognostisering och churnsignalering</li>
          <li>SLA-styrning och ärendehantering med automatiserade eskaleringsregler</li>
          <li>Enhetlig kundbild som kopplar samman kontrakt, ärenden och fakturahistorik</li>
        </ul>

        <h3>Field Service &amp; Contact Center: Fälttekniker och flerkanalssupport</h3>
        <p>
          För telekom- och IT-bolag med fältorganisation hanterar Field Service
          schemaläggning och ruttoptimering för tekniker vid installation,
          underhåll och felavhjälpning. Contact Center samlar inkommande
          kontakter från alla kanaler i ett gränssnitt och ger agenterna
          AI-stöd i realtid.
        </p>

        <h2>Listade partners inom Telekom &amp; IT-tjänster</h2>
        <p>
          Två partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>Vivicta</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources | AI Integration Partner
        </p>
        <p>
          Vivicta täcker hela Dynamics 365-plattformen med ett helhetsåtagande
          som explicit inkluderar telekom och IT-tjänster som branschfokus. De
          hanterar prenumerationsbaserade affärsmodeller och paketerade
          erbjudanden med hårdvara, mjukvara och konsulttjänster – och täcker
          hela kedjan från ERP och projekthantering via CRM och kundservice
          till HR och Power Platform-integrationer. Som AI Integration Partner
          arbetar de aktivt med att bygga in AI i sina leveranser. Passar
          IT-bolag som söker en partner med bred plattformskapacitet och
          uttalad förståelse för branschens affärsmodellkomplexitet.
        </p>

        <h3>Sopra Steria</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management | AI Enabled
        </p>
        <p>
          Sopra Steria är en processorienterad partner med ett metoddrivet
          angreppssätt och ett av Sveriges större CRM-team. I telekom och
          IT-tjänster bidrar de med kompetens inom ekonomistyrning,
          prenumerationshantering och kundrelationer. Det globala nätverket med
          specialister inom förändringsledning och analys är ett mervärde för
          IT-bolag som driver en bredare digital transformation – exempelvis en
          övergång från projektbaserad till prenumerationsbaserad affärsmodell
          som kräver processomstrukturering snarare än bara ett nytt system.
        </p>

        <IndustryPartnerListInline industry="Telekom & IT-tjänster" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Telekom och IT-tjänster är en av de branscher på d365.se med färst
          listade partners, och de som finns är tydligt åtskilda i profil:
          Vivicta med bred plattformstäckning och uttalat branschfokus, Sopra
          Steria med processmognad och global specialistkompetens.
        </p>
        <p>
          Den viktigaste vägledande frågan för er organisation är vilken del av
          verksamheten som driver systembehovet. Om det primärt handlar om
          prenumerationsfakturering och intäktsredovisning är F&amp;SCM-kompetensen
          central. Om det handlar om att koppla samman sälj, projektleverans
          och kundservice i ett sammanhållet flöde är CRM och Project
          Operations lika viktiga. De flesta IT-bolag behöver egentligen båda —
          och en partner som förstår hur de hänger samman.
        </p>
        <p>
          Det begränsade urvalet är också ett argument för att bredda sökningen
          och titta på partners listade i angränsande branscher som
          Konsulttjänster – många av dem har dokumenterad erfarenhet av
          IT-tjänstebolag och prenumerationsmodeller.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/telekom-it-tjanster/">d365.se/branscher/telekom-it-tjanster</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett telekom- eller IT-tjänsteföretag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Project Operations kostar {{price:project-operations:short}} och Sales Enterprise {{price:sales-enterprise:short}}. Customer Service Enterprise ligger på {{price:customer-service-enterprise:short}} och Field Service på {{price:field-service:short}} – central för installations- och fältarbete.\n\nImplementationskostnaden för ett medelstort telekom- eller IT-tjänsteföretag landar typiskt i intervallet 800 000 – 3 500 000 kr beroende på integrationer mot CPQ, faktureringssystem för abonnemang och ärendesystem. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter telekom- och IT-tjänsteföretag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) komplex abonnemangs- och prenumerationslogik som inte modelleras tillräckligt (uppgraderingar, periodiseringar, terminering); (2) CPQ för paketerade erbjudanden med hårdvara, mjukvara och tjänster som lämnas i parallella system; (3) ärende- och SLA-hantering som inte kopplas till abonnemangs- och avtalsdata; och (4) integration mot Microsoft 365/Azure-marketplace, betalningstjänster och kund-portaler som underskattas.\n\nDet är också vanligt att man underskattar förändringsarbetet – säljare, leverans och kundtjänst behöver gemensam datamodell för att kunna agera på abonnemangshändelser.",
      },
      {
        question: "Dynamics 365 vs Salesforce och specialiserade abonnemangssystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade abonnemangssystem (Zuora, Stripe Billing, Chargebee) har djup funktionalitet för komplex prenumerationsfakturering. Dynamics 365 (BC eller F&SCM + Sales + Customer Service) är en bredare plattform där prenumerationslogiken konfigureras eller hanteras via tillägg.\n\nDen vanligaste arkitekturen är att behålla ett specialiserat abonnemangssystem för fakturering och låta D365 vara ryggrad för sälj, leverans, ekonomi och kund. För mindre bolag med standardiserade prenumerationer kan D365 räcka som helhetslösning. Frågan att ställa: hur mycket av abonnemangslogiken klarar D365 utan kostsam särutveckling?",
      },
      {
        question: "Vad säger andra telekom- och IT-tjänsteföretag som infört Dynamics 365?",
        answer:
          "Erfarenheterna är generellt positiva när scope hålls realistiskt. Bolag som infört D365 som ryggrad för sälj, leverans, ärendehantering och ekonomi – med integration mot ett specialiserat abonnemangssystem – rapporterar god utväxling. Bolag som försökt täcka all komplex abonnemangsfakturering direkt i D365 utan tillägg har oftare stött på dyr särutveckling.\n\nEn återkommande lärdom är att tidigt definiera datamodellen för kunder, abonnemang, avtal och ärenden, och att be partnern uppvisa konkreta referenscase i telekom eller IT-tjänster med liknande affärsmodell.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för telekom & IT-tjänster?",
        answer:
          "Det beror på er affärsmodell och storlek. På d365.se listar vi flera partners med erfarenhet av IT-tjänster och prenumerationsmodeller – vissa är specialiserade på Project Operations + BC för IT-konsultbolag, andra arbetar med F&SCM och Sales för större telekom- och MSP-aktörer.\n\nVår rekommendation är att utvärdera 2–3 partners från branschsidan och bredda sökningen till partners i Konsulttjänster – många har dokumenterad erfarenhet av IT-tjänstebolag och prenumerationsmodeller. Be om: (1) konkreta referenscase i telekom eller IT-tjänster av jämförbar storlek, (2) hur de hanterar abonnemangs- och CPQ-logik, och (3) integrationsstrategi mot ert faktureringssystem.",
      },
    ],
  },
  {
    slug: "dynamics-365-uthyrning",
    title: "Dynamics 365 för uthyrningsverksamhet",
    metaTitle: "Dynamics 365 för uthyrningsverksamhet – guide & partners",
    metaDescription:
      "Dynamics 365 för uthyrning hanterar hyresavtal, beläggning, underhåll och fältservice med branschtillägg. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 (BC eller F&SCM med uthyrningstillägg) stödjer hyresavtal, beläggning, underhåll och fältservice för svenska uthyrningsbolag – maskiner, fordon, verktyg och event. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["uthyrning", "rental", "eqm 365", "dynamics365", "business central", "field service", "tillgångshantering"],
    products: [
      "Business Central",
      "Sales",
      "Customer Service",
      "Field Service",
      "Customer Insights",
      "Contact Center",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: uthyrningImg,
    readingTimeMinutes: 10,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Uthyrningsverksamhet
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Uthyrningsbranschen i Sverige växer, drivet av ökad efterfrågan på
          flexibla lösningar och ett hållbarhetsperspektiv där företag väljer
          att hyra istället för att äga. Maskiner, fordon, verktyg,
          eventutrustning – gemensamt för alla uthyrningssegment är att
          lönsamheten styrs av beläggningsgraden, och att beläggningsgraden
          kräver realtidsöversikt över varje tillgångs status, var den befinner
          sig och när den behöver service.
        </p>
        <p>
          Det är en annan affärslogik än handel eller tillverkning. Systemet
          måste hantera tillgångars livscykel som det centrala objektet – från
          inköp och avskrivning via bokning, leverans och retur till service
          och slutligen utrangering – och koppla det till ekonomi,
          kundrelationer och fältservice i ett sammanhållet flöde. Manuella
          processer för bokning, fakturering och underhållsplanering är de
          vanligaste källorna till ineffektivitet och intäktsläckage.
        </p>
        <p>
          Microsoft Dynamics 365 används av uthyrningsföretag som plattform för
          att samla tillgångshantering, kundrelationer, service och ekonomi.
          Standardfunktionaliteten i Business Central täcker grundläggande
          ekonomi och lagerstyrning, men den specifika uthyrningslogiken —
          bokningskalendrar, periodisk fakturering, tillgänglighetsstyrning och
          returinspektion – kräver vanligen ett branschspecifikt tillägg för
          att systemet ska fungera optimalt.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central med uthyrningslösning: Kärnan i systemstödet</h3>
        <p>
          BC är basen för de flesta uthyrningsföretag i SMB-segmentet. Systemet
          täcker ekonomi, lager och grundläggande kundhantering, men behöver
          kompletteras med ett uthyrningsspecifikt tillägg för att hantera
          branschens kärnprocesser fullt ut. EQM 365 Rental är ett exempel på
          ett sådant tillägg – en ISV-lösning byggd på BC som tillhandahåller
          dedikerad funktionalitet för avtal, tillgänglighet, logistik, service
          och fakturering inom uthyrning.
        </p>
        <ul>
          <li>Boknings- och avtalshantering med visuell kalender för tillgänglighet per objekt och kategori</li>
          <li>Tillgångsstyrning med full livscykelspårning per hyresobjekt: status, plats, servicehistorik och avskrivning</li>
          <li>Periodisk fakturering för långtidshyra med automatiserade faktureringsplaner</li>
          <li>Komplex prissättning med stafflade priser per hyreslängd, kundsegment och säsong</li>
          <li>Logistikhantering för ut- och inleveranser med planering och ruttoptimering</li>
          <li>Returhantering med inspektion och skadedokumentation</li>
        </ul>

        <h3>Field Service: Underhåll och service av uthyrningsobjekt</h3>
        <p>
          Förebyggande och avhjälpande underhåll av en tillgångsflotta är
          direkt kopplat till beläggningsgrad och lönsamhet – ett objekt som är
          på oplanerad reparation är ett objekt som inte genererar hyresintäkt.
          Field Service hanterar underhållsscheman, serviceorder och
          teknikerplanering, och kopplar servicehistoriken tillbaka till
          tillgångsregistret i BC.
        </p>
        <ul>
          <li>Förebyggande underhållsscheman per tillgång med automatisk generering av serviceorder vid servicegräns</li>
          <li>Akut felavhjälpning med snabb mobilisering av tekniker och reservdelshantering</li>
          <li>Mobil åtkomst för tekniker med servicehistorik, manualer och arbetsordrar i fält</li>
          <li>Koppling till tillgångsregister för löpande dokumentation av servicehistorik och kostnader</li>
        </ul>

        <h3>Sales &amp; Customer Service: Kundrelationer och ärendehantering</h3>
        <p>
          Sales ger uthyrnings- och säljpersonal en samlad bild av kunden med
          fullständig hyreshistorik, aktiva avtal och kommunikation – vilket
          underlättar merförsäljning och avtalsförnyelse. Customer Service
          hanterar inkommande ärenden kring skador, leveransavvikelser och
          fakturaärenden.
        </p>
        <ul>
          <li>360-gradersvy av kunden med hyreshistorik, aktiva avtal och serviceärenden</li>
          <li>Offerthantering med koppling till tillgänglighetskalender för korrekt prissättning</li>
          <li>Ärendehantering för skade- och leveransavvikelser med spårbarhet</li>
        </ul>

        <h2>Listade partners inom Uthyrningsverksamhet</h2>
        <p>
          Två partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>Navet AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center | AI Integration Partner
        </p>
        <p>
          Navet AB är den partner i listan med ett konkret uthyrningsspecifikt
          tillägg: EQM 365 Rental för Business Central, som hanterar avtal,
          tillgänglighet, logistik, service och fakturering i ett sammanhållet
          flöde. Det är en relevant distinktion – det innebär att Navet inte
          enbart konfigurerar standard-BC för uthyrningslogik utan levererar
          ett beprövat branschlager ovanpå plattformen. Navet ingår sedan 2023
          i Aderian Group med ett bredare nordiskt IT-erbjudande. Som AI
          Integration Partner arbetar de aktivt med att integrera AI i sina
          leveranser.
        </p>

        <h3>NAB Solutions</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center
        </p>
        <p>
          NAB Solutions har arbetat med Microsofts plattform sedan 2001 och
          levererar BC kombinerat med CRM och fältservice för
          uthyrningsföretag. Deras erfarenhet av att digitalisera tjänsteföretag
          och koppla samman ekonomi med kundrelationer och fältservice är
          relevant för uthyrningsbolag som vill ha ett sammanhållet ekosystem.
          Deras profil är bredare och mindre branschspecifik än Navets för
          uthyrning, men de täcker samma applikationsmix och har lång
          Dynamics-erfarenhet.
        </p>

        <IndustryPartnerListInline industry="Uthyrningsverksamhet" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Den viktigaste frågan i ett partnerval för uthyrning är om partnern
          har implementerat en dedikerad uthyrningslösning eller om de
          konfigurerar standard-BC för uthyrningslogik. Det är en reell
          skillnad i implementationsrisk, tid till go-live och systemets
          förmåga att hantera branschspecifika flöden som bokningskalendrar,
          returinspektion och periodisk fakturering.
        </p>
        <p>
          Navet är tydlig med att de erbjuder EQM 365 Rental som branschlösning.
          Det är ett konkret argument för att kontakta dem tidigt i en
          utvärdering och be om referenskunder inom uthyrning som nyttjar den
          lösningen. NAB Solutions är ett bredare Dynamics 365-alternativ med
          lång erfarenhet och god plattformskapacitet.
        </p>
        <p>
          Det begränsade antalet listade partners speglar att uthyrning är ett
          nischsegment på d365.se. Beroende på vilken typ av uthyrning ni
          bedriver – maskiner och fordon kräver annan systemlogik än
          eventutrustning eller verktyg – kan det vara värt att titta bredare
          och utvärdera om det finns specialiserade uthyrningssystem som
          integrerar mot Dynamics 365 snarare än system som löser allt inom
          samma plattform.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/uthyrning/">d365.se/branscher/uthyrning</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för en uthyrningsverksamhet?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – relevant för större uthyrare med komplex hyresekonomi och underhållsplanering. Field Service ligger på {{price:field-service:short}} och är central för fordon, maskiner och underhåll.\n\nImplementationskostnaden för ett medelstort uthyrningsbolag landar typiskt i intervallet 700 000 – 3 000 000 kr beroende på integrationer mot eventuella specialiserade uthyrningssystem och behov av branschspecifika tillägg. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter uthyrningsbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) hyresavtals- och beläggningslogik som inte fullt ut täcks av standard utan branschtillägg; (2) underhåll och kontroll av uthyrningsobjekt mellan uppdrag som inte modelleras tidigt; (3) komplex prissättning (dagshyra, dygnshyra, periodpris, försäkring, frakt) som lämnas till särutveckling; och (4) integration mot bokningsportaler, GPS/telematik och fakturering som underskattas.\n\nDet är också vanligt att retur- och skadehantering inte byggs in från start, vilket skapar manuella processer efter golive.",
      },
      {
        question: "Dynamics 365 vs specialiserade uthyrningssystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade uthyrningssystem (Wynne Systems, MCS Rental Software, Hire Track, Husky Software) har djup branschfunktionalitet för beläggning, kontrollistor, prissättning och underhåll. Dynamics 365 är en bredare plattform där uthyrningslogik konfigureras eller hanteras via branschtillägg (t.ex. To-Increase, Dynaway).\n\nValet styrs av uthyrningsobjektets karaktär: maskiner och fordon med komplext underhåll matchar ofta specialistsystem bättre, medan event- och verktygsuthyrning ofta klaras med D365 + branschtillägg. Frågan att ställa: vilket branschtillägg rekommenderar partnern, och vilka konkreta uthyrningsreferenser har de på det?",
      },
      {
        question: "Vad säger andra uthyrningsbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med val av branschtillägg och scope. Bolag som infört D365 med ett etablerat uthyrningstillägg rapporterar generellt god utväxling – särskilt på beläggning, prissättning och integrerad ekonomi. Bolag som försökt täcka uthyrningslogiken med standard-D365 utan tillägg har oftare stött på dyr särutveckling.\n\nEn återkommande lärdom är att kravarbetet ska involvera både uthyrning, verkstad/underhåll och ekonomi, och att be partnern uppvisa konkreta referenscase i samma typ av uthyrning som ni bedriver.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för uthyrningsverksamhet?",
        answer:
          "Uthyrning är ett nischsegment på d365.se med få listade partners. Vår rekommendation är att utvärdera de partners som finns på branschsidan och komplettera med utvärdering av specialiserade uthyrningssystem – beroende på vilken typ av uthyrning ni bedriver kan ett specialistsystem med D365-integration vara ett bättre alternativ än D365 som hel ryggrad.\n\nBe partnern uppvisa: (1) konkreta referenscase i uthyrning av samma typ (maskiner, fordon, verktyg, event) och storlek, (2) vilket uthyrningstillägg de arbetar med och varför, och (3) hur de hanterar beläggning, prissättning, kontrollistor och underhåll.",
      },
    ],
  },
  {
    slug: "dynamics-365-mode-sport-textil",
    title: "Dynamics 365 för mode, sport & textil",
    metaTitle: "Dynamics 365 för mode, sport & textil – guide & partners",
    metaDescription:
      "Dynamics 365 för mode, sport & textil hanterar storlek/färg-matriser, säsong, kollektion och kanal med ISV-tillägg. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 med modetillägg (Bisqo, K3 Pebblestone, LS Retail Fashion) hanterar storlek/färg-matriser, säsong, kollektion och kanal för svenska mode-, sport- och textilbolag. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["mode", "sport", "textil", "fashion", "dynamics365", "business central", "commerce", "omnichannel", "sku"],
    products: [
      "Business Central",
      "Commerce",
      "Finance & SCM",
      "Sales",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: modeImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Mode, sport &amp; textil
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Mode, sport och textil är en bransch med ett systemlandskap som
          ställer helt egna krav. Variantkomplexiteten – varje artikel i
          storlek, färg och modell – skapar en SKU-flora som generella
          affärssystem inte hanterar väl ur lådan. Lägg till säsongslogik,
          kollektion- och inköpsplanering mot globala leverantörer med långa
          ledtider, snabba markdowns när säsongen vänder, och omnichannel-krav
          där lager, priser och kampanjer behöver vara konsekventa oavsett om
          kunden köper i butik, via e-handel eller på marketplace – och det är
          tydligt varför branschspecifik konfiguration är ett minimum, och ett
          branschspecifikt tillägg ofta nödvändigt.
        </p>
        <p>
          Svenska mode- och sportbolag i SMB-segmentet har historiskt haft ett
          smalt utbud av relevanta affärssystemslösningar. Dynamics 365
          Business Central med branschanpassningar är ett alternativ som
          används av en del aktörer, men konkurrensen om plattformsval är hård
          – specialiserade modeERP-system utmanar. Det avgörande valet är inte
          bara vilket system utan vilken partner som faktiskt förstår
          branschens processer: inköpsplanering per kollektion, allokering per
          butik, retur- och cirkulationsflöden och integration mot Shopify,
          Centra eller Magento.
        </p>
        <p>
          Dynamics 365 Commerce är den mer kompletta Microsoft-lösningen för
          butikskedjor och omnichannel-aktörer med integrerat POS,
          lojalitetsprogram och unified commerce. Business Central är mer
          relevant för renodlade grossister, importörer och varumärken utan
          egen butikskedja.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central med mode-/textilanpassning: Kärnan för SMB</h3>
        <p>
          BC täcker ekonomi, inköp, lager och grundläggande försäljning, men
          behöver branschspecifik konfiguration och vanligen tillägg för att
          hantera mode- och textillogikens kärnkrav på ett ändamålsenligt sätt.
        </p>
        <ul>
          <li>Style/SKU-hantering med storlek- och färgmatriser per artikel, inklusive separata lagersaldon, streckkoder och priser per variant</li>
          <li>Kollektions- och inköpsplanering per säsong med budgetering mot historik och marginalmål</li>
          <li>Inköpsorder mot globala leverantörer med ledtidshantering, prognoser och kvalitetskontroll</li>
          <li>Lager- och butiksallokering med stöd för omfördelning av varor mellan butiker och e-handel</li>
          <li>Kampanjer, reor och planerade markdowns per kanal, kundgrupp och period</li>
          <li>Returhantering för e-handel och butik med bedömning, kreditering och åter till sortiment</li>
        </ul>

        <h3>Dynamics 365 Commerce: Omnichannel för butikskedjor</h3>
        <p>
          Commerce är Microsoft Dynamics-svaret på omnichannel retail – en
          plattform som integrerar POS, e-handel, lojalitetsprogram,
          lagerstyrning och kunddata i ett ekosystem. Relevant för modeaktörer
          med egna butikskedjor som vill ha en enhetlig plattform snarare än
          att integrera separata POS- och e-handelssystem mot ett back-office
          ERP.
        </p>
        <ul>
          <li>Integrerat POS för butik med mobil kassa och clienteling</li>
          <li>E-handelsstorefronts med gemensamma priser, kampanjer och lagerinformation</li>
          <li>Lojalitetsprogram och kundklubbar med köphistorik från alla kanaler</li>
          <li>Centralstyrda kampanjer och markdowns som rullas ut till alla kanaler simultant</li>
          <li>Orderhantering med stöd för click-and-collect, leverans från butik och ship-from-store</li>
        </ul>

        <h3>Finance &amp; Supply Chain: Större kedjor med komplex global sourcing</h3>
        <p>
          F&amp;SCM är relevant för större modeaktörer med internationell
          närvaro, komplex global supply chain och avancerade krav på
          finansiell styrning och logistik. Systemet hanterar inköp från
          leverantörer i flera länder, multi-currency, konsoliderad redovisning
          och avancerad lagerstyrning i ett sammanhållet flöde.
        </p>

        <h3>Customer Insights &amp; Sales: Kunddata och B2B</h3>
        <p>
          Customer Insights samlar köpdata från e-handel, POS och lojalitet
          till enhetliga kundprofiler för segmentering, personalisering och
          riktad kommunikation. Sales är relevant för modevarumärken med
          B2B-försäljning mot återförsäljare, agents och nyckelkunder.
        </p>

        <h2>Listad partner inom Mode, Sport &amp; Textil</h2>
        <p>En partner är listad för branschen på d365.se.</p>

        <h3>adbriq</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central
        </p>
        <p>
          adbriq är en BC-specialist med ett uttalat och exklusivt branschfokus
          på mode, sport och textil – det är inte ett av flera segment utan
          deras primära marknad. De arbetar med digitalisering av
          informationsflöden och affärsprocesser för bolag i branschen, med
          specifik kompetens inom produktlivscykelhantering, kollektionshantering,
          lageroptimering, distributionskedja och integration mot
          e-handelsplattformar och logistikpartners. För ett mode- eller
          sportbolag som väljer BC som systemplattform är adbriq det enda
          alternativet i listan med den kombinationen av branschdjup och
          plattformsspecialisering. Att de är den enda listade partnern för
          branschen gör dem till det naturliga första samtalet – men det
          innebär också att en bred partnerutvärdering bör inkludera aktörer
          utanför d365.se:s lista.
        </p>

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Mode, sport och textil är den bransch på d365.se med minst listade
          partners – en partner. Det är ett utpräglat nischsegment där
          relativt få Dynamics 365-partners aktivt profilerar sig, och där
          konkurrensen om systemplattformsval är bredare: specialiserade
          modeERP-system som Apparel21, Infor M3, Futura och liknande är
          etablerade alternativ som används av svenska modeföretag.
        </p>
        <p>
          Valet att gå på Dynamics 365 Business Central för ett modeföretag är
          ett aktivt val som kräver en partner med genuin branschkompetens.
          adbriq har den profilen och är ett naturligt startläge för en
          BC-utvärdering. Utöver dem kan det vara värt att titta på partners i
          Retail &amp; E-handel-segmentet på d365.se – flera av dem, som
          Cepheo och Bisqo, arbetar med BC för handelsföretag och kan ha
          relevant erfarenhet av mode- och textilprocesser.
        </p>
        <p>
          En central fråga att ställa varje partner oavsett val: hur hanterar
          de storlek/färg-matriser, och vilka branschspecifika tillägg
          rekommenderar de för att täcka mode- och textillogikens krav?
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/mode-sport-textil/">d365.se/branscher/mode-sport-textil</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett mode-, sport- eller textilbolag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Premium ligger på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}}, Supply Chain Management {{price:supply-chain-management:short}} och Commerce {{price:commerce:short}} – relevant för aktörer med egna butiker, e-handel och POS.\n\nImplementationskostnaden för ett medelstort mode-, sport- eller textilbolag landar typiskt i intervallet 1 000 000 – 4 500 000 kr beroende på storlek på sortiment, säsongsplanering, integrationer mot PLM/leverantörsportaler och behov av branschspecifika tillägg (Bisqo, K3 Pebblestone, LS Retail Fashion). Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter mode-, sport- och textilbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) storlek/färg-matriser (variantkomplexitet) som inte hanteras av standard utan branschtillägg; (2) säsongs-, kollektion- och inköpsplanering mot långa ledtider från globala leverantörer; (3) returflöden och nedmarkeringscykler som inte modelleras tidigt; och (4) integration mot PLM, designsystem och e-handel som underskattas.\n\nDet är också vanligt att masterdata för artiklar med säsong, kollektion, leverantör och variant inte städas inför migrering, vilket skapar långa stabiliseringsfaser efter golive.",
      },
      {
        question: "Dynamics 365 vs specialiserade mode- och textilsystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade mode- och textilsystem (Centric PLM, Itera, Bsmart) och branschtillägg på D365 (K3 Pebblestone, Bisqo, LS Retail Fashion) hanterar variantkomplexitet, säsong och kollektion. Dynamics 365 utan branschtillägg räcker sällan för en renodlad modeverksamhet.\n\nDen vanligaste vägen är D365 + branschtillägg snarare än renodlat D365 eller helt fristående system. Frågan att ställa: vilket branschtillägg rekommenderar partnern, och har de konkreta referenser i mode, sport eller textil på just det tillägget?",
      },
      {
        question: "Vad säger andra mode-, sport- och textilbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med val av branschtillägg och scope. Bolag som infört D365 + ett etablerat modetillägg (K3 Pebblestone, Bisqo, LS Retail Fashion) rapporterar generellt god utväxling – särskilt på variant- och säsongshantering, inköpsplanering och integrerad e-handel/POS. Bolag som försökt täcka modelogiken med standard-D365 har oftare stött på dyr särutveckling.\n\nEn återkommande lärdom är att kravarbetet ska involvera inköp, design, lager och försäljning, och att validera branschtillägget mot verkliga processer tidigt.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för mode, sport & textil?",
        answer:
          "Det beror på er storlek och kanalmix. På d365.se listar vi få partners specifikt inom mode, sport och textil – det kan vara värt att också titta på partners i Retail & E-handel-segmentet (t.ex. Cepheo och Bisqo) som arbetar med BC för handelsföretag och kan ha relevant erfarenhet av mode- och textilprocesser.\n\nVår rekommendation är att utvärdera 2–3 partners och be om: (1) konkreta referenscase i mode, sport eller textil av jämförbar storlek, (2) hur de hanterar storlek/färg-matriser och säsong, och (3) vilket branschtillägg de rekommenderar och varför.",
      },
    ],
  },
  {
    slug: "dynamics-365-fastighet-forvaltning",
    title: "Dynamics 365 för fastighet & förvaltning",
    metaTitle: "Dynamics 365 för fastighet & förvaltning – guide & partners",
    metaDescription:
      "Dynamics 365 för fastighet & förvaltning täcker ekonomi, anläggningsregister, fältservice och hyresgästkontakt. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 (BC eller F&SCM + Field Service) hanterar ekonomi, anläggningsregister, underhåll och hyresgästkontakt för svenska fastighets- och förvaltningsbolag – integrerat med specialiserade hyresadministrationssystem. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["fastighet", "förvaltning", "proptech", "dynamics365", "business central", "finance scm", "field service", "hyresadministration"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Field Service",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: fastighetImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Fastighet &amp; Förvaltning
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Fastighets- och förvaltningsbranschen arbetar med tillgångsstyrning i
          en helt annan skala och tidshorisont än de flesta branscher.
          Fastigheter är kapitalintensiva och långsiktiga investeringar, och
          förvaltningens kvalitet är direkt kopplad till fastighetsvärdet. Det
          ställer krav på systemstöd som kan hantera allt från hyresadministration
          och underhållsplanering till investeringsprojekt och
          hållbarhetsrapportering – ofta över en portfölj med många fastigheter
          och olika ägarstrukturer.
        </p>
        <p>
          Den typiska systemsmärtan i branschen är fragmentering: ett system
          för ekonomi, ett för hyresadministration, ett för felanmälan och
          arbetsorder, och ett separat för hyresgästkommunikation. Det skapar
          informationssiloer, manuella flöden och bristande helhetsbild.
          Proptech-utvecklingen – IoT, digitala nyckelhanteringssystem, smarta
          mätare – driver på behovet av ett back-office system som kan ta emot
          och agera på data från fastigheternas tekniska infrastruktur.
        </p>
        <p>
          Microsoft Dynamics 365 kan fungera som det sammanhållande lagret för
          ekonomistyrning, hyresadministration, underhåll, fältservice och
          hyresgästkommunikation. Systemet integreras med branschspecifika
          fastighetssystem via öppna API:er – det är inte en fullständig
          ersättning för specialiserade hyresadministrationssystem utan en
          plattform som kan samla data och processer i ett enhetligt
          ekosystem.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Ekonomistyrning och anläggningsregister</h3>
        <p>
          F&amp;SCM passar större fastighetsbolag och förvaltare med komplexa
          krav på ekonomistyrning, koncernredovisning och anläggningsregister
          för fastighetsportföljen. Systemet hanterar investeringsuppföljning
          för nybyggnation och ombyggnadsprojekt, avskrivningar och
          anläggningsvärdering.
        </p>
        <ul>
          <li>Ekonomistyrning med konsoliderad redovisning för fastighetsportföljer med flera bolag</li>
          <li>Anläggningsregister med avskrivningar, underhållshistorik och investeringsuppföljning per fastighet</li>
          <li>Projektredovisning för nybyggnation, ombyggnad och större underhållsprojekt med budget och kostnadskontroll</li>
          <li>Upphandlings- och inköpsprocesser för fastighets- och underhållstjänster</li>
          <li>Hyresintäktsredovisning och periodisering för kommersiella fastigheter</li>
        </ul>

        <h3>Business Central: ERP för medelstora fastighetsbolag</h3>
        <p>
          Business Central passar medelstora fastighetsbolag och förvaltare som
          behöver ett sammanhållet system för ekonomi, projekt och
          grundläggande hyresadministration. Systemet täcker kärnbehoven och
          kan integreras mot specialiserade fastighetssystem för mer avancerad
          hyresadministration.
        </p>
        <ul>
          <li>Ekonomi, fakturering och leverantörsreskontra i ett integrerat flöde</li>
          <li>Hyresfakturering och enklare avtalshantering för bostads- och lokalfastigheter</li>
          <li>Projekthantering för underhålls- och investeringsprojekt med budgetuppföljning</li>
          <li>Integration mot externa fastighetssystem för hyresadministration och mätvärdeshantering</li>
        </ul>

        <h3>Field Service: Underhåll och driftservice</h3>
        <p>
          Field Service är centralt för fastighetsbolag med intern
          driftorganisation eller egna tekniker. Systemet hanterar
          felanmälningar från hyresgäster, skapar arbetsorder, schemalägger
          tekniker och dokumenterar utfört arbete – och kopplar kostnaden
          tillbaka till respektive fastighet i ekonomisystemet.
        </p>
        <ul>
          <li>Felanmälningshantering från hyresgäster via portal, telefon eller app till automatisk arbetsordergenering</li>
          <li>Planerat och förebyggande underhåll med servicescheman per fastighet och anläggning</li>
          <li>Schemaläggning och optimering av drifttekniker och servicepersonal</li>
          <li>Mobil åtkomst för tekniker med arbetsorder, ritningar och fastighetshistorik i fält</li>
          <li>Koppling till ekonomi för kostnadsallokering per fastighet och uppdrag</li>
        </ul>

        <h3>Customer Service &amp; Sales: Hyresgästkommunikation och uthyrning</h3>
        <p>
          Customer Service strukturerar hyresgästkommunikation och
          ärendehantering i ett enhetligt gränssnitt – oavsett om hyresgästen
          kontaktar förvaltaren via telefon, e-post eller portal. Sales stödjer
          uthyrningsprocessen med pipeline-hantering för vakanta lokaler och
          hyresgästprospektering.
        </p>
        <ul>
          <li>Enhetlig ärendehantering för felanmälningar, fakturaärenden och hyresgästfrågor</li>
          <li>360-gradersvy av hyresgästen med avtalshistorik, serviceärenden och kommunikation</li>
          <li>Uthyrningspipeline för vakanta bostäder och lokaler med hantering av intressenter och visningar</li>
        </ul>

        <h2>Listad partner inom Fastighet &amp; Förvaltning</h2>
        <p>En partner är listad för branschen på d365.se.</p>

        <h3>Fellowmind</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights
        </p>
        <p>
          Fellowmind är en av de större europeiska Microsoft-partnerna med
          närvaro i fem länder och över 2 500 kunder. De täcker hela
          ERP-spannet från BC till F&amp;SCM och kombinerar det med Sales och
          Customer Insights. Deras styrka är bred plattformskapacitet, djup
          Microsoft-kompetens och förmåga att hantera komplexa implementationer
          med europeisk leveranskapacitet. För fastighetsbolag som söker en
          etablerad partner med bred D365-kompetens och kapacitet att växa med
          organisationen är Fellowmind ett relevant alternativ.
          Fastighetsverksamhet är ett av flera segment de arbetar i, snarare än
          ett uttalat primärfokus.
        </p>

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Fastighet och förvaltning är en bransch där specialiserade
          fastighetssystem – Vitec Fastighet, MRI Software, Raindance och
          liknande – traditionellt dominerat hyresadministrationen. Dynamics
          365 konkurrerar i detta segment primärt som ett ekonomi- och
          processystem som integrerar med dessa specialistsystem, snarare än
          som en komplett fastighetslösning ur lådan.
        </p>
        <p>
          Med en enda listad partner är urvalsprocessen på d365.se begränsad.
          Fellowmind är ett välkänt alternativ med god plattformsbredd, men en
          gedigen partnerutvärdering för ett fastighetsbolag bör inkludera
          partners utanför listan – exempelvis aktörer med specifika
          fastighetstillägg eller ISV-lösningar byggda på BC eller F&amp;SCM
          för fastighetsförvaltning.
        </p>
        <p>
          En central fråga att ställa: hur hanterar partnern integrationen mot
          ert befintliga hyresadministrationssystem, och har de referenskunder
          inom fastighetsförvaltning av liknande storlek och portföljtyp som er
          organisation?
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/fastighet-forvaltning/">d365.se/branscher/fastighet-forvaltning</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett fastighetsbolag?",
        answer:
          "Licenskostnaden styrs av val av plattform och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – relevant för större fastighetsbolag med komplex ekonomi och investeringsprojekt. Field Service ligger på {{price:field-service:short}} och Customer Service Enterprise på {{price:customer-service-enterprise:short}}.\n\nTill licenserna tillkommer implementationskostnaden, som för ett medelstort fastighetsbolag typiskt landar i intervallet 800 000 – 3 000 000 kr beroende på omfattning, integrationer mot hyresadministration (Vitec, MRI, Raindance) och behov av branschspecifika tillägg. Räkna också med löpande förvaltningskostnad på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter fastighetsbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) underskattad integration mot befintligt hyresadministrationssystem – datamodeller och avtalslogik skiljer sig markant; (2) otydlig rolldelning mellan D365 och specialistsystem, vilket leder till dubbla register; (3) felanmälansflödet från hyresgäst till tekniker som inte kopplas hela vägen tillbaka till ekonomi för kostnadsallokering per fastighet; och (4) bristfällig hantering av anläggningsregister och avskrivningar när fastighetsportföljen växer eller omstruktureras.\n\nDet är också vanligt att proptech-data (IoT, smarta mätare) hamnar i en separat silo istället för att triggas in i D365 som automatiserade arbetsorder eller avvikelser.",
      },
      {
        question: "Dynamics 365 vs Vitec, MRI Software och Raindance – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Vitec, MRI och Raindance är specialiserade fastighetssystem som dominerar hyresadministrationen i Sverige med djup branschfunktionalitet ur lådan. Dynamics 365 är en bredare affärsplattform för ekonomi, projekt, fältservice och kundrelationer.\n\nDen vanligaste arkitekturen i större fastighetsbolag är att behålla specialistsystemet för hyresadministration och låta Dynamics 365 vara back-office för ekonomi, anläggningsregister, investeringsprojekt och servicelogik – med integration däremellan. För mindre bolag eller bolag med okomplicerad portfölj kan Business Central räcka som helhetslösning. Frågan att ställa: hur mycket av hyresadministrationens särlogik klarar en D365-implementation utan att bli kostsam särutveckling?",
      },
      {
        question: "Vad säger andra fastighetsbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope. Bolag som använt D365 som ekonomi- och projektplattform med integration mot ett specialiserat fastighetssystem rapporterar generellt god utväxling – särskilt på investeringsuppföljning, koncernredovisning och fältservice. Bolag som försökt ersätta hela hyresadministrationen med D365 utan branschtillägg har oftare stött på dyr särutveckling och förlängda projekt.\n\nEn återkommande lärdom är att tidigt involvera både ekonomi-, förvaltnings- och driftorganisationen i kravarbetet, och att be partnern uppvisa konkreta referenscase med liknande portföljstorlek och systemlandskap.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för fastighet & förvaltning?",
        answer:
          "På d365.se är Fellowmind den enda listade partnern för branschen. De har bred plattformsbredd över BC, F&SCM, Sales och Customer Insights och stor europeisk leveranskapacitet, men fastighet är ett av flera segment snarare än uttalat primärfokus. För en gedigen utvärdering bör ni därför komplettera med partners utanför listan som har dokumenterade ISV-lösningar eller egna fastighetstillägg på BC eller F&SCM.\n\nVår rekommendation är att utvärdera 2–3 partners och be om: (1) konkreta referenscase i fastighetsförvaltning av jämförbar storlek, (2) integrationsmodell mot ert hyresadministrationssystem och (3) en tydlig avgränsning av vad D365 ska göra respektive vad specialistsystemet behåller.",
      },
    ],
  },
  {
    slug: "dynamics-365-transport-logistik",
    title: "Dynamics 365 för transport & logistik",
    metaTitle: "Dynamics 365 för transport & logistik – guide & partners",
    metaDescription:
      "Dynamics 365 för transport & logistik stöttar WMS, uppdragsekonomi, fakturering och TMS-integration. Köparsidig guide med kostnad och svenska partners.",
    summary:
      "Dynamics 365 (F&SCM eller BC) är ekonomi- och operativt nav för svenska transport- och logistikbolag – WMS, uppdragsekonomi, fakturering och fältservice, integrerat med specialiserade TMS-system. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["transport", "logistik", "tms", "wms", "dynamics365", "business central", "finance scm", "supply chain"],
    products: [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Field Service",
      "Customer Insights",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: transportLogistikImg,
    readingTimeMinutes: 11,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Transport &amp; Logistik
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Transport- och logistikbranschen är en infrastrukturnäring som präglas
          av hård prispress, tunna marginaler och ett konstant krav på operativ
          effektivitet. Konkurrensen är global, kundförväntningarna på
          transparens och leveransprecision ökar, och hållbarhetskraven – att
          mäta och rapportera CO2 per transport – lägger ytterligare ett lager
          av systemkrav ovanpå en redan komplex verksamhet.
        </p>
        <p>
          Det vanligaste systemproblemet är fragmentering: transportplaneringen
          lever i ett system, lagerstyrningen i ett annat, ekonomin i ett
          tredje, och kundkommunikationen hanteras manuellt. Det skapar dålig
          visibilitet i supply chain, sena insikter om uppdragsekonomin och
          tidskrävande faktureringsprocesser. För att veta om ett enskilt
          transportuppdrag är lönsamt behöver man kunna tagga intäkter och
          kostnader – bränsle, vägtullar, förarlön, underleverantör – mot just
          det uppdraget i realtid.
        </p>
        <p>
          Microsoft Dynamics 365 fungerar som det ekonomiska och operativa
          navet i ett logistikföretags systemlandskap. F&amp;SCM med WMS och
          TMS-funktionalitet täcker avancerad lager- och transporthantering för
          större aktörer. BC är relevant för medelstora transport- och
          logistikföretag med mer standardiserade behov. Systemet integreras
          mot specialiserade TMS-lösningar för ruttoptimering, fordonsdatorer,
          GPS-system och tullhantering via öppna API:er.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Finance &amp; Supply Chain Management: Lager, transport och uppdragsekonomi</h3>
        <p>
          F&amp;SCM är kärnan för större logistik- och transportföretag med
          avancerade krav på lagerstyrning, transportplanering och finansiell
          uppföljning per uppdrag. Systemets WMS-modul hanterar hela lagerflödet
          från inleverans till utleverans, medan transportmodulen täcker
          grundläggande frakthantering och kan integreras mot specialiserade
          TMS-lösningar.
        </p>
        <ul>
          <li>Avancerad lagerstyrning (WMS) med streckkod/RFID, plock och pack, zonhantering och pallhantering</li>
          <li>Transportplanering och fraktdokumentation med integration mot externa TMS-lösningar för ruttoptimering</li>
          <li>Dimensionsbaserad redovisning för lönsamhetsuppföljning per uppdrag, rutt, fordon och kund</li>
          <li>Fakturering av komplexa prisavtal med bränsletillägg, volymbaserade priser och tilläggstjänster</li>
          <li>Avräkning mot åkerier och underleverantörer med matchning mot utförda uppdrag</li>
          <li>Tull- och regelefterlevnad för gränsöverskridande transporter via integrationer</li>
        </ul>

        <h3>Business Central: ERP för medelstora transport- och logistikföretag</h3>
        <p>
          BC passar medelstora transport- och logistikföretag med mer
          standardiserade behov av ekonomi, orderhantering och enklare
          lagerhantering. Systemet täcker grundläggande flöden och kan
          integreras mot branschspecifika lösningar för transportplanering och
          fordonsstyrning.
        </p>
        <ul>
          <li>Ekonomi, fakturering och leverantörsreskontra med uppdragsbaserad kostnadsspårning</li>
          <li>Order- och frakthantering med grundläggande dokumentation och kundkommunikation</li>
          <li>Enklare lagerhantering för terminaler och distributionscentra</li>
          <li>Integration mot fordonsdatorer, GPS och transportplaneringssystem</li>
        </ul>

        <h3>Sales &amp; Customer Service: Kundrelationer och ärendehantering</h3>
        <p>
          Sales stödjer säljprocessen av transport- och logistiktjänster med
          pipeline-hantering och avtalsuppföljning mot nyckelkunder. Customer
          Service hanterar reklamationer, leveransavvikelser och spårningsfrågor
          med spårbarhet och en 360-gradersvy av kunden.
        </p>
        <ul>
          <li>Pipelinehantering för försäljning av frakttjänster, ramavtal och nyckelkundsrelationer</li>
          <li>Ärendehantering för reklamationer, skadeärenden och leveransavvikelser</li>
          <li>360-gradersvy av kunden med avtalshistorik, fraktvolymer och kommunikation</li>
        </ul>

        <h3>Field Service: Mobila resurser och fordonsservice</h3>
        <p>
          Field Service kan användas för att schemalägga och hantera mobila
          resurser – budbilsförare, installationstekniker eller servicepersonal
          – och för fordonsunderhåll i företag med egna verkstäder.
        </p>

        <h2>Listade partners inom Transport &amp; Logistik</h2>
        <p>
          Tre partners är listade för branschen på d365.se. Nedan presenteras
          de i den ordning de förekommer på branschsidan.
        </p>

        <h3>Enqore AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations
        </p>
        <p>
          Enqore täcker hela plattformsspannet med ett tydligt fokus på
          datadrivna och AI-stödda processer. I transport och logistik – där
          stora datamängder finns men insikterna ofta kommer för sent – är
          deras profil direkt relevant: de kopplar samman affärssystem med
          analys och AI för att möjliggöra prediktiv verksamhetsstyrning. Det
          innebär konkret att de kan hjälpa logistikföretag att gå från reaktiv
          avvikelsehantering till proaktiv optimering av rutter, lager och
          resurser. Relevant för transport- och logistikföretag som vill nyttja
          sin operativa data mer aktivt för beslutsfattande.
        </p>

        <h3>Nexer</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations
        </p>
        <p>
          Nexer är ett globalt techbolag med bred Dynamics 365-kompetens och
          erfarenhet av komplexa ERP-implementationer för tillverknings- och
          distributionsföretag. I transport och logistik täcker de hela
          plattformsspannet från BC till F&amp;SCM med supply chain och WMS.
          Deras kapacitet som ett större techbolag med global leveransförmåga
          passar logistikföretag med internationell närvaro, komplexa
          integrationskrav eller behov av ett bredare teknologierbjudande
          utöver affärssystemet.
        </p>

        <h3>Vivicta</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources | AI Integration Partner
        </p>
        <p>
          Vivicta erbjuder ett helhetsåtagande inom Dynamics 365 med ett brett
          branschfokus som inkluderar handel och service. De täcker hela
          plattformen – ERP, CRM, fältservice och HR – och kompletterar med
          Power Platform och Azure-integrationer. Som AI Integration Partner
          arbetar de aktivt med att bygga in AI i sina leveranser. Passar
          logistikföretag som söker en partner med bred plattformskapacitet och
          ett tydligt helhetsansvar från rådgivning till förvaltning.
        </p>

        <IndustryPartnerListInline industry="Transport & Logistik" />

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Transport och logistik är en bransch där systemets förmåga att
          integrera mot externa TMS-, WMS- och fordonssystem är lika viktig som
          dess interna funktionalitet. Ingen av de tre listade partnerna är en
          renodlad transportspecialist – de är alla bredare Dynamics
          365-partners som arbetar i branschen. Det innebär att frågan om
          integrationskompetens och erfarenhet av branschspecifika
          tredjepartssystem är central i en partnerutvärdering.
        </p>
        <p>
          En relevant fråga att ställa varje partner: vilka TMS- och
          WMS-integrationer har de genomfört, och mot vilka system? Och kan de
          visa referenskunder i transport- och logistikbranschen med liknande
          volym, geografisk räckvidd och systemkomplexitet som er verksamhet?
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/logistik-transport/">d365.se/branscher/logistik-transport</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för ett transport- och logistikföretag?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. Business Central Essentials ligger på {{price:bc-essentials:short}} och Premium på {{price:bc-premium:short}}. Finance kostar {{price:finance:short}} och Supply Chain Management {{price:supply-chain-management:short}} – relevant för större logistikbolag med WMS- och uppdragsekonomi-behov. Field Service ligger på {{price:field-service:short}} och Customer Service Enterprise på {{price:customer-service-enterprise:short}}.\n\nImplementationskostnaden för ett medelstort transport- eller logistikföretag landar typiskt i intervallet 1 000 000 – 4 000 000 kr beroende på antal integrationer mot TMS, WMS, fordonsdatorer och tullsystem. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter transport- och logistikföretag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) underskattad integration mot specialiserade TMS- och ruttoptimeringssystem; (2) otydlig modell för uppdragsekonomi – vilka kostnader (bränsle, vägtullar, förarlön, underentreprenör) ska taggas mot vilket uppdrag och i vilket system; (3) avräkning mot åkerier och underleverantörer som inte matchas mot utförda uppdrag i realtid; och (4) tull- och regelefterlevnad för gränsöverskridande transporter som ofta kräver branschspecifika tillägg.\n\nDet är också vanligt att data från fordonsdatorer och GPS hamnar i en separat silo istället för att triggas in i D365 som händelser för fakturering eller avvikelsehantering.",
      },
      {
        question: "Dynamics 365 vs specialiserade TMS- och WMS-system – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade TMS- och WMS-system (t.ex. Memnon, Hogia Transport, Astro, Manhattan) har djup branschfunktionalitet för ruttoptimering, lagerlogik och fordonsstyrning som Dynamics 365 inte fullt ut levererar ur lådan. Dynamics 365 är en bredare affärsplattform för ekonomi, uppdragsekonomi, kundrelationer och fältservice.\n\nDen vanligaste arkitekturen i medelstora till större logistikbolag är att behålla specialistsystemen för transport- och lagerlogik och låta D365 vara back-office för ekonomi, uppdragslönsamhet och kund. För mindre eller mer standardiserade verksamheter kan Business Central med integration mot ett mindre TMS räcka. Frågan att ställa: hur mycket av den operativa transportlogiken klarar D365 utan kostsam särutveckling?",
      },
      {
        question: "Vad säger andra transport- och logistikföretag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope. Bolag som använt D365 som ekonomi- och uppdragsplattform med integration mot ett specialiserat TMS rapporterar generellt god utväxling – särskilt på uppdragslönsamhet, automatiserad fakturering med komplexa prisavtal och avräkning mot underleverantörer. Bolag som försökt täcka all operativ transportlogik direkt i D365 utan branschtillägg har oftare stött på dyr särutveckling och förlängda projekt.\n\nEn återkommande lärdom är att tidigt definiera vilken systemkomponent som äger vilken process – och att be partnern uppvisa konkreta referenscase med liknande volym, geografisk räckvidd och integrationslandskap.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för transport & logistik?",
        answer:
          "På d365.se är Enqore, Nexer och Vivicta listade för branschen. Enqore har en tydlig profil mot data och AI och passar bolag som vill lyfta sin operativa data till prediktiv styrning. Nexer är ett större globalt techbolag som passar logistikföretag med internationell närvaro och komplexa integrationskrav. Vivicta erbjuder ett brett helhetsåtagande med AI-integration och passar bolag som söker en partner med totalansvar.\n\nIngen av dem är dock en renodlad transportspecialist. Vår rekommendation är att utvärdera 2–3 partners och be om: (1) konkreta referenscase i transport och logistik av jämförbar storlek, (2) vilka TMS- och WMS-integrationer de genomfört och mot vilka system, och (3) en tydlig avgränsning av vad D365 ska göra respektive vad specialistsystemen behåller.",
      },
    ],
  },
  {
    slug: "dynamics-365-medlemsorganisationer",
    title: "Dynamics 365 för medlemsorganisationer",
    metaTitle: "Dynamics 365 för medlemsorganisationer – guide & partners",
    metaDescription:
      "Dynamics 365 för medlemsorganisationer stöttar medlemsresan, segmentering, kommunikation och avgiftshantering. Köparsidig guide med svenska partners.",
    summary:
      "Dynamics 365 (Sales + Customer Insights + Customer Service, ev. BC för avgifter) hanterar medlemsresan, segmentering, kommunikation och service för svenska fackförbund, branschorganisationer och föreningar. Guiden går igenom arbetsprocesser, systemstöd och listade partners – skriven ur köparens perspektiv.",
    category: "Branschguide",
    tags: ["medlemsorganisationer", "fackförbund", "branschorganisationer", "dynamics365", "sales", "customer insights", "customer service", "business central"],
    products: [
      "Sales",
      "Customer Insights",
      "Customer Service",
      "Contact Center",
      "Business Central",
      "Finance & SCM",
    ],
    publishedAt: "2026-06-09",
    author: THOMAS_LAINE,
    heroImage: medlemsorganisationerImg,
    readingTimeMinutes: 10,
    content: (
      <>
        <p className="!text-sm uppercase tracking-wider !text-primary !font-semibold !mb-2">
          Kunskapscenter &nbsp;|&nbsp; Branschguide
        </p>
        <p className="!text-xs uppercase tracking-wider text-muted-foreground !mb-6">
          Medlemsorganisationer
        </p>
        <p className="italic text-foreground/85 !mb-8">
          Arbetsprocesser, systemstöd och en genomgång av listade partners – skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Medlemsorganisationer – fackförbund, branschorganisationer,
          intresseföreningar och ideella stiftelser – har ett systemstödbehov
          som liknar företagens i struktur men skiljer sig fundamentalt i
          logik. Fokus är inte på att sälja produkter utan på att leverera och
          kommunicera medlemsnytta. Systemet behöver hantera en relation, inte
          en transaktion: från rekrytering och onboarding via löpande
          engagemang, kommunikation och evenemang till förnyelse och retention.
        </p>
        <p>
          Det vanligaste problemet är fragmentering: ett system för ekonomi och
          avgiftshantering, ett för e-postutskick, ett för evenemangsbokningar
          och ett separat för ärendehantering. Ingen del av organisationen har
          en fullständig bild av en enskild medlems aktivitet, engagemang och
          historik. Det försvårar riktad kommunikation, proaktiv retention och
          datadrivet arbete för att bevisa och öka medlemsnyttan.
        </p>
        <p>
          Microsoft Dynamics 365 kan fungera som den sammanhållande
          plattformen för medlemshantering, kommunikation, evenemang och
          service. Systemet är inte ett specialiserat medlemssystem – det är en
          generell CRM- och ERP-plattform som konfigureras för organisationens
          logik. Det innebär flexibilitet, men också att implementationen
          kräver en partner med förståelse för hur medlemsorganisationer
          faktiskt fungerar.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Sales: Medlemsresan från rekrytering till förnyelse</h3>
        <p>
          Dynamics 365 Sales används i medlemsorganisationskontext för att
          hantera hela relationen med varje medlem – från första kontakt som
          potentiell medlem via onboarding, löpande engagemang och förnyelse.
          Terminologin lånas från B2B-försäljning men logiken är densamma: en
          strukturerad process med pipeline-vy och uppföljning av varje enskild
          relation.
        </p>
        <ul>
          <li>Rekrytering av nya medlemmar med leadhantering och strukturerat onboarding-flöde</li>
          <li>360-gradersvy av varje medlem med komplett historik: kommunikation, evenemang, ärenden och avgiftsstatus</li>
          <li>Automatiserade påminnelser vid avgiftsförnyelse och uppföljningsflöden vid uteblivet svar</li>
          <li>Analys av engagemang och riskidentifiering för medlemmar med sjunkande aktivitet</li>
        </ul>

        <h3>Customer Insights: Segmentering och personaliserad kommunikation</h3>
        <p>
          Customer Insights aggregerar data från alla kontaktpunkter —
          e-postöppningar, evenemangsnärvaro, ärendehistorik, avgiftsstatus —
          till enhetliga medlemsprofiler. Det möjliggör avancerad segmentering
          för riktad kommunikation och datadrivet arbete med att bevisa och
          kommunicera medlemsnyttan.
        </p>
        <ul>
          <li>Enhetlig medlemsprofil kombinerad från CRM, e-post, evenemang och ekonomi</li>
          <li>Segmentering baserad på engagemang, bransch, geografi, medlemstyp och aktivitetsmönster</li>
          <li>Automatiserade kommunikationsflöden för nyhetsbrev, inbjudningar och förnyelse</li>
          <li>GDPR-hantering med centraliserad samtyckesinsamling och dokumentation</li>
          <li>Analys av medlemsnöjdhet och retentionsnyckeltal</li>
        </ul>

        <h3>Customer Service &amp; Contact Center: Medlemsservice och ärendehantering</h3>
        <p>
          Customer Service strukturerar hanteringen av inkommande frågor och
          ärenden från medlemmar – oavsett kanal – i ett enhetligt gränssnitt
          med spårbarhet och servicenivåuppföljning. Contact Center optimerar
          dirigeringen av inkommande kontakter och ger handläggarna ett
          fullständigt sammanhang för varje medlem direkt vid kontakt.
        </p>
        <ul>
          <li>Ärendehantering för medlemsfrågor, fakturaärenden och serviceförfrågningar med spårbarhet</li>
          <li>Kunskapsdatabas för handläggare med svar på vanliga frågor och processbeskrivningar</li>
          <li>Servicenivåuppföljning och ärenderapportering för att identifiera förbättringsområden</li>
        </ul>

        <h3>Business Central / Finance &amp; Supply Chain: Ekonomi och avgiftshantering</h3>
        <p>
          Avgiftshanteringen – avisering, betalningsuppföljning,
          reskontradhantering och bokföring – hanteras vanligen i ERP-delen av
          plattformen. BC passar medelstora organisationer, F&amp;SCM de med
          mer komplex ekonomistyrning. Integrationen mot CRM-sidan skapar ett
          sammanhållet flöde där avgiftsstatus är synlig direkt i
          medlemskortet.
        </p>
        <ul>
          <li>Automatiserad avgiftsavisering med konfigurerbara betalningsplaner och påminnelsecykler</li>
          <li>Reskontradhantering med integration mot bokföring och rapportering</li>
          <li>Projektredovisning för evenemang och utbildningar med budget och kostnadsuppföljning</li>
        </ul>

        <h2>Listad partner inom Medlemsorganisationer</h2>
        <p>En partner är listad för branschen på d365.se.</p>

        <h3>B3 Elevate</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Sales, Customer Insights, Customer Service, Field Service, Contact Center
        </p>
        <p>
          B3 Elevate är ett specialistföretag inom B3 Consulting Group med
          fokus på kundupplevelser och CRM-lösningar byggda på Dynamics 365 och
          Power BI. De arbetar med AI-baserade molnlösningar och har erfarenhet
          av hur digitala verktyg kan anpassas för att hantera medlemsresor,
          segmentering, kommunikation och ärendehantering. Deras
          applikationsprofil är uteslutande CRM-orienterad – Sales, Customer
          Insights, Customer Service och Contact Center – utan ERP-komponent
          (BC eller F&amp;SCM). Det innebär att de passar organisationer vars
          primära behov är att modernisera medlems- och relationshanteringen,
          medan avgiftsadministrationen och ekonomin hanteras i ett befintligt
          eller separat ekonomisystem.
        </p>

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Medlemsorganisationer har ett systemstödbehov som spänner över två
          domäner: CRM (medlemsrelationer, kommunikation, evenemang, service)
          och ERP (avgiftshantering, ekonomi, redovisning). B3 Elevate täcker
          CRM-sidan med hög specialistkompetens. Om er organisation också
          behöver ett nytt eller integrerat ekonomisystem bör
          partnerutvärderingen inkludera en ERP-kompetent partner, alternativt
          en partner som täcker båda delarna.
        </p>
        <p>
          Det finns också ett relevant alternativ till standardkonfiguration av
          Dynamics 365 för medlemshantering: specialiserade medlemssystem som
          Lime CRM, SuperOffice och liknande har inbyggd medlemslogik och kan
          vara ett snabbare alternativ att komma igång med. Valet att gå på
          Dynamics 365 motiveras primärt av bredden i plattformen – om
          organisationen vill ha ett ekosystem som även täcker evenemang,
          kommunikation, service och ekonomi i en gemensam datamiljö.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/medlemsorganisationer/">d365.se/branscher/medlemsorganisationer</a>
        </p>
      </>
    ),
    bigFiveFaq: [
      {
        question: "Vad kostar Dynamics 365 för en medlemsorganisation?",
        answer:
          "Licenskostnaden styrs av plattformsval och antal användare. På CRM-sidan ligger Sales Enterprise på {{price:sales-enterprise:short}}, Customer Service Enterprise på {{price:customer-service-enterprise:short}} och Customer Insights (Data + Journeys) på {{price:customer-insights:default}}. På ERP-sidan kostar Business Central Essentials {{price:bc-essentials:short}} och Premium {{price:bc-premium:short}} – relevant om avgiftshantering och ekonomi ska ligga i samma plattform.\n\nImplementationskostnaden för en medelstor medlemsorganisation landar typiskt i intervallet 600 000 – 2 500 000 kr beroende på om både CRM och ERP ingår, integrationer mot e-postplattformar, evenemangssystem och befintligt ekonomisystem. Räkna också med löpande förvaltning på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter medlemsorganisationer på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) att man försöker tvinga in medlemslogik i en standardkonfiguration av Sales utan att modellera medlemsresan tydligt; (2) att avgiftshanteringen lämnas i ett separat ekonomisystem utan integration, så avgiftsstatus inte syns på medlemskortet; (3) GDPR-hantering med samtycken och dataminimering som inte byggs in från start; och (4) att evenemangs- och kommunikationsdata aldrig aggregeras till en enhetlig medlemsprofil – vilket var hela poängen med plattformsbytet.\n\nDet är också vanligt att man underskattar förändringsarbetet – terminologi och processer från B2B-försäljning behöver översättas till organisationens språk för att kansli och handläggare ska adoptera systemet.",
      },
      {
        question: "Dynamics 365 vs Lime CRM, SuperOffice och specialiserade medlemssystem – vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Specialiserade medlemssystem (eller Lime CRM/SuperOffice med medlemstillägg) har inbyggd medlemslogik och kommer ofta snabbare i drift med lägre initialkostnad. Dynamics 365 är en bredare plattform där medlemslogiken konfigureras – det tar längre tid men ger ett sammanhållet ekosystem för CRM, ERP, kommunikation, service och analys.\n\nValet styrs av ambitionsnivå: behöver ni främst ett medlemsregister med kommunikationsstöd är ett specialistsystem ofta tillräckligt och billigare. Behöver ni ett gemensamt dataekosystem där medlemsdata, ekonomi, evenemang och service ligger i samma plattform – och där ni vill bygga vidare med automation, AI och Copilot – är D365 motiverat. Frågan att ställa: hur mycket utöver grundläggande medlemshantering vill ni att plattformen ska göra de närmaste 3–5 åren?",
      },
      {
        question: "Vad säger andra medlemsorganisationer som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope. Organisationer som infört D365 som ett samlat CRM med Customer Insights för segmentering rapporterar generellt god utväxling – särskilt på riktad kommunikation, förnyelseprocesser och att kunna mäta engagemang över tid. Organisationer som försökt täcka både CRM, ERP och evenemangslogik i ett enda första steg har oftare stött på förlängda projekt och justerat scope under vägen.\n\nEn återkommande lärdom är att börja med medlemskortet och 360-gradersvyn, säkra GDPR-hanteringen, och därefter bygga ut med segmentering, automation och eventuellt ERP. Be partnern uppvisa konkreta referenscase från fackförbund, branschorganisationer eller intresseföreningar av jämförbar storlek.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för medlemsorganisationer?",
        answer:
          "På d365.se är B3 Elevate den enda listade partnern med en tydlig profil mot branschen. De är CRM-specialiserade på Sales, Customer Insights, Customer Service och Contact Center, med erfarenhet av medlemsresor och segmentering – men de täcker inte ERP (BC eller F&SCM). Behöver ni även avgiftshantering och ekonomi i samma plattform behöver utvärderingen kompletteras med en ERP-kompetent partner eller en partner som täcker båda domänerna.\n\nVår rekommendation är att utvärdera 2–3 partners och be om: (1) konkreta referenscase från medlemsorganisationer av jämförbar storlek, (2) hur de modellerar medlemsresan i Sales och Customer Insights, och (3) en tydlig plan för integration mellan CRM och ert ekonomi-/avgiftssystem.",
      },
    ],
  },
];


export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined =>
  BLOG_ARTICLES.find((a) => a.slug === slug);
