import { ReactNode } from "react";
import aiErpRiskbildHero from "@/assets/articles/ai-erp-riskbild-hero.jpg";
import partnervaletAvgorHero from "@/assets/articles/partnervalet-avgor-hero.jpg";
import ownedIntelligenceHero from "@/assets/articles/owned-intelligence-hero.jpg";
import ownedIntelligenceSkiljelinje from "@/assets/articles/owned-intelligence-skiljelinje.jpg";

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
}

const THOMAS_LAINE: BlogArticleAuthor = {
  name: "Thomas Laine",
  role: "Senior rådgivare inom Microsoft Dynamics 365",
  url: "https://d365.se/kontakt/",
};

export const BLOG_ARTICLES: BlogArticle[] = [
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
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          AI i affärssystem är på väg att byta karaktär — från att svara på
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
          sker. Den här artikeln handlar om just det skiftet — vad det innebär,
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
            korrigeringar, trigga en uppgift till rätt roll och — om ni tillåter
            det — skapa ett utkast till kreditnota, uppdatera leveransdatum eller
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

        <h2>Governance är inte en bilaga — det är själva leveransen</h2>
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

        <h3>3) Vilka behörigheter får agenten — i praktiken?</h3>
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
          ERP-projekt måste utformas, styras och följas upp över tid — och
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
          oftast mindre om produkten — och mer om genomförandet. Och
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
              Oberoende vägledning, rätt frågor i säljprocessen och en
              strukturerad utvärdering minskar risken markant.
            </li>
          </ul>
        </aside>

        <p>
          Vilket affärssystem passar bäst? Hur står sig Dynamics 365 mot
          alternativen? Vilka moduler behövs? Vilka funktioner är kritiska — och
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
          är systemet som köps in, implementeras — och sedan inte används som
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
          processerna utmanats — eller bara ritats av? Har slutanvändarna
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
          behov? Fanns oberoende underlag — eller byggde valet mest på pris,
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

        <h3>Oberoende vägledning tidigt i processen</h3>
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
          På d365.se erbjuder vi oberoende stöd för att strukturera valet av
          Dynamics 365-partner – utifrån lösningsområde, bransch, erfarenhet och
          faktiskt leveransupplägg.
        </p>
        <p>
          Målet är att beslutet inte bara ska kännas rätt i upphandlingen — utan
          också vara möjligt att förklara och försvara när projektet möter
          verkligheten.
        </p>
      </>
    ),
  },
];

export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined =>
  BLOG_ARTICLES.find((a) => a.slug === slug);
