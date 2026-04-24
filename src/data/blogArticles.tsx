import { ReactNode } from "react";
import aiErpRiskbildHero from "@/assets/articles/ai-erp-riskbild-hero.jpg";

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
];

export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined =>
  BLOG_ARTICLES.find((a) => a.slug === slug);
