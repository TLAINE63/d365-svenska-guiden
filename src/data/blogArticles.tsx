import { ReactNode } from "react";
import aiErpRiskbildHero from "@/assets/articles/ai-erp-riskbild-hero.jpg";
import partnervaletAvgorHero from "@/assets/articles/partnervalet-avgor-hero.jpg";
import ownedIntelligenceHero from "@/assets/articles/owned-intelligence-hero.jpg";
import ownedIntelligenceSkiljelinje from "@/assets/articles/owned-intelligence-skiljelinje.jpg";
import releaseWave1Hero from "@/assets/articles/d365-release-wave-1-2026-hero.jpg";
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
  /** Big 5 FAQ — visas som fast modul längst ner i branschartiklar */
  bigFiveFaq?: { question: string; answer: string }[];
}

const THOMAS_LAINE: BlogArticleAuthor = {
  name: "Thomas Laine",
  role: "Senior rådgivare inom Microsoft Dynamics 365",
  url: "https://d365.se/kontakt/",
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "dynamics-365-release-wave-1-2026",
    title: "Dynamics 365 Release Wave 1 2026 — vad som faktiskt kommer, per produkt",
    metaTitle: "Dynamics 365 Release Wave 1 2026: nyheter per produkt | d365.se",
    metaDescription:
      "Oberoende sammanställning av Microsofts Release Wave 1 2026 för Dynamics 365. Per produkt: vad som rullas ut april–september 2026, och vad som redan finns inom AI, Copilot och agenter.",
    summary:
      "Microsoft publicerade Release Wave 1 2026 den 18 mars. Här är d365.se:s oberoende genomgång — per produkt: vad som rullas ut mellan april och september, och vad som redan är på plats inom AI, Copilot och agenter.",
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
    featured: true,
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          Microsoft publicerade Release Wave 1 2026 för Dynamics 365 den{" "}
          <strong>18 mars 2026</strong>. Planen omfattar uppdateringar som rullas
          ut mellan 1 april och september 2026. Här är en oberoende
          sammanställning per produkt — både det som kommer och det som redan
          finns inom AI, Copilot och agenter.
        </p>

        <aside className="my-10 rounded-md border border-[#9CC2E5] bg-[#DEEBF7] px-7 py-6">
          <p className="!text-[1.25rem] !font-bold !text-[#1F4E79] !mb-3 !mt-0">
            Nyckeldatum
          </p>
          <ul className="!my-0 !pl-7 !space-y-2 list-disc marker:text-[#1F4E79] !text-foreground/90">
            <li>18 mars 2026 — release-planer publicerade</li>
            <li>1 april 2026 — General Availability startar regionalt</li>
            <li>3 april 2026 — plan tillgänglig på svenska</li>
            <li>September 2026 — slutpunkt för Release Wave 1</li>
          </ul>
        </aside>

        <h2>Genomgående tema i RW1 2026</h2>
        <ul>
          <li>
            <strong>Agentic experiences</strong> — autonoma agenter över Sales,
            Service, Finance, Supply Chain och fler.
          </li>
          <li>
            <strong>Djupare Copilot-integration</strong> i alla appar och i
            Microsoft 365.
          </li>
          <li>
            <strong>Model Context Protocol (MCP)</strong> — agenter får direkt
            access till D365-data.
          </li>
          <li>
            <strong>Enhetlig data via Customer Insights</strong> som grund för
            CRM-Copilots.
          </li>
        </ul>

        <h2>Dynamics 365 Sales</h2>
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Utökad Copilot på data från CRM och Microsoft 365 — mejl, mötesreferat och kalendrar.</li>
          <li>AI-rekommendationer som hjälper säljare bygga pipeline, berika opportunities och accelerera avslut.</li>
          <li>Proaktiva notiser med tydligt nästa steg.</li>
          <li>Enhetlig Copilot-upplevelse mellan Dynamics 365 och Microsoft 365-appar.</li>
          <li>Sales Agent i M365 Copilot utvecklas till säljarens dagliga kommandocentral (Sales Chat, Sales Home).</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> record summarization, sammanfattningar i lead- och opportunity-formulär, mötesförberedelse, e-postassistans, nyhetssammanfattningar.</p>
        <p><strong>Agenter:</strong> Sales Qualification Agent, Sales Close Agent (Research &amp; Engage), Sales Research Agent.</p>

        <h2>Dynamics 365 Customer Service</h2>
        <h3>Nyheter — RW1 2026</h3>
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
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Agentic contact center med djupare automation och högre containment.</li>
          <li>Stöd för framväxande kanaler utöver röst och chatt.</li>
          <li>Förbättrade supervisor-insikter i realtid.</li>
          <li>Custom Neural Voices — egna märkesröster för text-till-tal.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> realtidssammanfattning av röst och chatt, ask a question, svarsmejl-drafter, resolutionsanteckningar, kunskapsartiklar från cases.</p>
        <p><strong>Agenter:</strong> Customer Intent Agent for voice, Quality Evaluation Agent, Case Management Agent, Customer Knowledge Management Agent, agent insights dashboard.</p>

        <h2>Dynamics 365 Field Service</h2>
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Förbättrad mobil användbarhet för tekniker i fält.</li>
          <li>Intelligent schemaläggning via Scheduling Operations Agent.</li>
          <li>End-to-end execution över tillgångar, projekt och finansiella flöden.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> naturligt språk mot Field Service-data, AI-uppdatering av work orders via tal/text, on-demand work order-sammanfattningar, inspektionsmallar från PDF/bild.</p>
        <p><strong>Agenter:</strong> Scheduling Operations Agent — optimerar schema, hanterar avbokningar och förseningar utan manuell omplanering.</p>

        <h2>Customer Insights (Data + Journeys)</h2>
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Data: AI-färdig datakärna som grund för CRM-Copilots och agenter.</li>
          <li>Data: realtids unified customer profiles.</li>
          <li>Journeys: skapa kundresor via naturligt språk, query assist, AI-genererad content.</li>
        </ul>
        <h3>Agenter idag</h3>
        <p>Conversational journeys som kombinerar Customer Insights – Journeys, Contact Center och agenter byggda i Copilot Studio.</p>

        <h2>Dynamics 365 Finance</h2>
        <h3>Nyheter — RW1 2026</h3>
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
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Demand and supply planning med price-demand correlation.</li>
          <li>Capacity-to-promise (CTP) date protection.</li>
          <li>AI-drivet plock i lagret och automatisk inventory rebalancing.</li>
          <li>Förbättrad leverantörskommunikation.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> analysera demand plans, workload insights i Warehouse Management mobile app, chat with finance and operations data.</p>
        <p><strong>Agenter:</strong> Supplier Communications Agent — automatiserar leverantörsuppföljning och inköpsorderhantering.</p>

        <h2>Dynamics 365 Project Operations</h2>
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Stöd för change orders och smartare projektplanering.</li>
          <li>Smidigare flöden för offert, budget och kontrakt.</li>
          <li>Mobile expense management och subscription billing.</li>
        </ul>
        <h3>Agenter idag</h3>
        <p>Time Entry Agent, Expense Agent, Approvals Agent — autoutkast och förgranskning mot policy.</p>

        <h2>Dynamics 365 Commerce</h2>
        <h3>Nyheter — RW1 2026</h3>
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
        <h3>Nyheter — RW1 2026</h3>
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
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Förstärkta AI-agenter som automatiserar sales- och purchase-scenarios.</li>
          <li>Acceleration mot agentic ERP — fler autonoma flöden.</li>
          <li>Förbättrad AL-testning och debugging för utvecklare.</li>
          <li>Copilot-extensibility — bygg egna Copilot-upplevelser.</li>
        </ul>
        <h3>AI, Copilot och agenter idag</h3>
        <p><strong>Copilot:</strong> bankkontoavstämning, föreslå rader på säljdokument, alternativa artiklar vid lagerbrist, nummerserier, record-sammanfattningar.</p>
        <p><strong>Agenter:</strong> Sales Order Agent (fångar order från inkommande e-post), Payables Agent (analyserar leverantörsfakturor).</p>

        <h2>Microsoft Sustainability Manager</h2>
        <h3>Nyheter — RW1 2026</h3>
        <ul>
          <li>Mer intuitiv navigering.</li>
          <li>Advanced calculation versioning och granular data-locking.</li>
          <li>Utökad integration mot finans.</li>
        </ul>
        <p><strong>Copilot:</strong> query data, find facts (ESG-disclosures), modelldrivna appkapabiliteter. Agent feed i preview; inga produktspecifika autonoma agenter idag.</p>

        <h2>Vad d365.se tar med sig</h2>
        <p>
          Två observationer värda att lyfta: <strong>agenter går från demo till
          leverans</strong> i den här vågen — flera av dem är redan i
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
              Microsoft Dynamics 365 — 2026 release wave 1 plan
            </a>
          </li>
          <li>Microsoft Dynamics 365-bloggen — 2026 release wave 1 plans (18 mars 2026).</li>
          <li>Produktspecifika release wave-översikter på learn.microsoft.com.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "owned-intelligence-dynamics-365",
    title: "Owned Intelligence — vad Microsofts senaste rapport säger till Dynamics 365-köpare",
    metaTitle: "Owned Intelligence: Microsofts rapport och Dynamics 365 | d365.se",
    metaDescription:
      "Microsofts Work Trend Index 2026 lyfter Owned Intelligence som den verkliga konkurrensfördelen. Vad innebär det för dig som står inför ett Dynamics 365-val?",
    summary:
      "Microsofts Work Trend Index 2026 introducerar begreppet Owned Intelligence — den institutionella kunskap som inte kan kopieras. Här är vad det betyder för Dynamics 365-köpare när agenter tar över mer av exekveringen.",
    category: "Strategi",
    tags: ["dynamics365", "ai", "agenter", "copilot", "upphandling", "owned intelligence"],
    products: ["Business Central", "Finance & SCM", "Sales", "Customer Service", "AI/Copilot/Agents"],
    publishedAt: "2026-05-12",
    author: THOMAS_LAINE,
    heroImage: ownedIntelligenceHero,
    readingTimeMinutes: 8,
    featured: false,
    content: (
      <>
        <p className="!text-[1.15rem] md:!text-[1.25rem] !leading-[1.7] italic text-foreground/85 !mb-8">
          I maj släppte Microsoft sin Work Trend Index 2026 — en omfattande
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
              Frågan är inte "bygga själv eller köpa färdigt" — utan var
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
          För Dynamics 365-köpare är det här mer relevant än det låter — och det
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
          Microsoft kallar "Frontier-zonen" — där både individuell förmåga och
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
          Microsofts bild kompletteras intressant av oberoende analytiker.
          Gartner konstaterar i sin 2026 Hype Cycle att endast 17 procent av
          organisationer faktiskt har deployat AI-agenter, även om över 60
          procent säger sig planera det inom två år. Än mer påtagligt: Gartner
          förutspår att <strong>över 40 procent av alla agentic AI-projekt
          kommer avbrytas till slutet av 2027</strong> — ofta för att kostnader
          skenar, affärsvärdet inte blir tillräckligt tydligt eller för att
          governance och riskkontroller inte hinner byggas i samma takt som
          tekniken.
        </p>
        <p>
          McKinseys State of AI-rapport pekar i samma riktning: 88 procent av
          organisationer använder AI i någon funktion, men bara 6 procent
          kvalificerar som "AI high performers" med mätbar EBIT-effekt. Resten
          har piloter, demos och initiativ — men inte transformation.
        </p>
        <p>
          Det här är samma fenomen sett från olika håll. Microsoft kallar det
          Transformationsparadoxen, Gartner talar om gapet mellan ambition och
          leverans, McKinsey beskriver "pilot purgatory". Alla pekar på samma
          sak: organisationer har tillgång till verktygen, men har inte byggt
          om det runt omkring — och då stannar värdet ute.
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
          När Copilot eller agenter kommer upp visas möjligheten — att man kan
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
          lätt som att man måste bygga allt själv — egna agenter, egna
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
          vill att kunden ska bli starkare — men det behöver göras till en
          uttalad del av upplägget, inte något man hoppas ska "hända av sig
          själv".
        </p>
        <p>
          Det här ligger nära en av rapportens starkaste statistiska
          observationer: organisatoriska faktorer som kultur, chefsstöd och
          kompetensutveckling står för ungefär <strong>67 procent</strong> av
          AI:s reella påverkan, medan individuell mindset och beteende står för
          cirka 32 procent. Med andra ord — det är inte i första hand de
          enskilda medarbetarnas AI-kunskaper som avgör utfallet. Det är hur
          organisationen som helhet är riggad för att fånga upp och bygga
          vidare på det som agenter producerar.
        </p>
        <p>
          McKinsey publicerade i januari 2026 en analys specifikt om AI-agenter
          och ERP som kommer till en näraliggande slutsats. Deras rekommendation
          är att köparen tydligt skiljer på två saker: standardiserade
          kapaciteter som kan köpas in färdigt — och egen utveckling som
          reserveras för de områden där bolagets domänspecifika logik eller
          egna processer faktiskt skapar en konkurrensfördel. Det är samma
          princip som ligger bakom Owned Intelligence, formulerad från
          ERP-perspektivet. Värdet ligger inte i att bygga allt själv, och inte
          i att köpa allt färdigt — utan i att veta var skiljelinjen ska gå.
        </p>

        <figure className="my-10">
          <img
            src={ownedIntelligenceSkiljelinje}
            alt="Diagram som visar lager av eget, delvis eget och standard med etiketter Owned Intelligence, Implementation och Plattform"
            className="w-full rounded-lg shadow-md"
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
          Bolag som väljer att bygga mycket själva — egna agenter, egna
          automationsflöden i Power Automate, egna integrationer — kan snabbt
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
          än man tror — inte för att partnern saknar vilja, utan för att
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
          Flera delar av organisationen behöver vara med — IT, verksamheten,
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
          Här finns intern IT:s verkliga värde — insikten i den befintliga
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
          från köparsidan — och tidigt nog för att påverka hur projektet
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
            Hur ser vår egen organisation ut under och efter projektet — vilka
            roller behöver vi, och vilken mandatstruktur?
          </li>
          <li>
            Vilken plan finns för att intern IT och verksamhet ska kunna
            fortsätta utveckla lösningen efter go-live, även utan partnerns
            dagliga närvaro?
          </li>
          <li>
            Vilken kompetensöverföring är inplanerad — inte som en bisak i
            slutet, utan som en löpande del av projektet?
          </li>
        </ul>
        <p>
          Frågorna är inte tänkta att misstro partnern. De är tänkta att
          tydliggöra ansvar och kunskapsflöde tidigt — något som gynnar både
          köpare och partner.
        </p>
        <p>
          För köparen är detta i grunden den fråga som avgör vad upphandlingen
          faktiskt resulterar i på fem års sikt. Ett system, eller en förmåga.
        </p>
        <p>
          Microsofts rapport ger en bra anledning att lyfta in den frågan
          tidigt — innan funktioner och integrationer har lagt sig som ramen
          för hela diskussionen.
        </p>

        <aside
          aria-label="Källor"
          className="mt-12 p-6 rounded-xl border border-border bg-secondary/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Källor
          </p>
          <ul className="!my-0 !pl-5 !space-y-2 text-sm text-muted-foreground list-disc">
            <li>
              Microsoft Work Trend Index 2026 — <em>Agents, human agency, and
              the opportunity for every organization</em> (maj 2026).
            </li>
            <li>
              Gartner — Hype Cycle for Artificial Intelligence, 2026
              (agent-adoption samt prognos om avbrutna agentic AI-projekt till
              slutet av 2027).
            </li>
            <li>
              McKinsey — The State of AI in 2026 (Global Survey) (andel "AI
              high performers" och koppling till mätbar EBIT-effekt).
            </li>
            <li>
              McKinsey — analys om AI-agenter och ERP (januari 2026)
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
              Köparsidig vägledning, rätt frågor i säljprocessen och en
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
  {
    slug: "dynamics-365-retail-ehandel",
    title: "Dynamics 365 för Retail & e-handel",
    metaTitle: "Branschguide: retail & e-handel i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en objektiv genomgång av listade partners för svensk retail och e-handel.",
    summary:
      "Branschguide för retail och e-handel: arbetsprocesser, systemstöd i Dynamics 365 och en objektiv genomgång av listade partners på d365.se.",
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
          en konsekvent upplevelse oavsett kanal — det är inte längre
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
          ordercykeln — från inköpsorder och inleverans till fakturering och
          bokföring — i ett och samma flöde.
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
          faktiskt beteende — inte antaganden.
        </p>
        <ul>
          <li>Samling av kunddata från alla kanaler till en enhetlig profil</li>
          <li>Segmentering och personaliserade erbjudanden baserade på köphistorik</li>
          <li>Kampanjautomation och mätning av marknadsföringseffekt</li>
        </ul>
        <p>
          Dynamics 365 Sales används av handelsföretag med en mer komplex
          B2B-försäljning — till exempel grossister eller varumärken som säljer
          direkt till återförsäljare — där pipeline-hantering och
          relationsuppföljning är centralt.
        </p>

        <h3>Customer Service &amp; Contact Center: Ärenden, returer och kundlojalitet</h3>
        <p>
          En välhanterad kundservice är i detaljhandeln direkt kopplad till
          lojalitet och återköp. Dynamics 365 Customer Service och Contact
          Center ger kundtjänstteamet en samlad bild av kundens historia oavsett
          kontaktväg — telefon, e-post, chatt eller sociala medier.
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
          <strong>Evidi</strong><br />
          <em>Spetskompetens: Business Central | AI Integration Partner</em>
        </p>
        <p>
          Evidi levererar Business Central-lösningar till retail- och
          e-handelsföretag med fokus på optimerad kundupplevelse och
          digitaliserade processer. Som certifierad AI Integration Partner har
          de en tydlig profil kring hur AI-funktionalitet integreras i
          affärssystemet för att stödja beslutsfattande och automation.
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
          tydligt ansvar för att lösningen fungerar i praktiken — inte enbart i
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

        <p>
          <strong>Sopra Steria</strong><br />
          <em>
            Spetskompetens: Business Central, Finance, Supply Chain Management |
            AI Enabled
          </em>
        </p>
        <p>
          Sopra Steria arbetar process- och effektorienterat snarare än
          systeminriktat. Deras styrka ligger i att förstå kundens verksamhet i
          sin helhet och säkerställa att systemlösningen faktiskt speglar hur
          arbetet utförs. AI Enabled-certifieringen indikerar att de aktivt
          integrerar AI-funktionalitet i sina leveranser.
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
          hantera hela plattformen — inklusive marknadsföring och försäljning —
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
          plattformssatsning — där ERP, CRM och kontaktcenter ska hänga samman —
          erbjuder Nexer kapacitet att hålla ihop hela arkitekturen. Som AI
          Integration Partner har de även ett tydligt fokus på nästa generations
          systemleveranser.
        </p>

        <p>
          <strong>Cepheo</strong><br />
          <em>
            Spetskompetens: BC, Finance, SCM, Sales, Customer Insights, Customer
            Service, Field Service, Contact Center, HR
          </em>
        </p>
        <p>
          Cepheo är en av Nordens mest heltäckande Microsoft Dynamics
          365-partners och täcker samtliga relevanta produktområden för retail
          och e-handel. Deras specifika erfarenhet av omnichannel-integrationer
          — där e-handel, fysisk butik och back-office ska hänga samman i
          realtid — gör dem relevanta för kedjor med komplex kanalstruktur. Med
          hela bredden av applikationer i portföljen är Cepheo ett naturligt
          alternativ när organisationen planerar en plattform som ska växa över
          tid.
        </p>

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
          centrallager. Frågan är inte bara vilket system — utan vilken partner
          som faktiskt har gjort det du planerar att göra, i en organisation som
          liknar din.
        </p>
        <p>
          På d365.se kan du filtrera partners per produktområde, läsa deras
          branschbeskrivningar och jämföra kompetenser sida vid sida.
          Plattformen är köparsidig — vägledningen är skriven utifrån köparens
          perspektiv och inga partners betalar för att synas högre eller
          beskrivas mer fördelaktigt.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/retail-ehandel/">d365.se/branscher/retail-ehandel</a>
        </p>
      </>
    ),
  },
  {
    slug: "dynamics-365-tillverkningsindustri",
    title: "Dynamics 365 för tillverkningsindustrin",
    metaTitle: "Branschguide: tillverkningsindustri i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk tillverkningsindustri.",
    summary:
      "Branschguide för tillverkningsindustrin: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Svensk tillverkningsindustri är bred — diskret produktion,
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
          SCADA — det ställer helt andra krav på affärssystemet än vad som
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
          <li>Produktionsplanering med MRP/MPS — materialbehovsplanering och kapacitetsplanering i ett sammanhållet flöde</li>
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
          För tillverkande företag som vill växa sin serviceaffär — serviceavtal,
          förebyggande underhåll, fältservicetekniker, reservdelshantering — är
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
          <li>Offerthantering med produktkonfigurator (CPQ — Configure, Price, Quote)</li>
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
          partner för hela plattformen — inklusive sälj och kundinsikt — är
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
          plattformssatsning — där ERP, eftermarknad och CRM ska hänga samman —
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
          — och som redan har eller planerar ett separat ERP — är Sirocco ett
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
          <strong>Cegeka</strong><br />
          <em>Finance, SCM, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources</em>
        </p>
        <p>
          Cegeka har en av de bredaste kompetensportföljerna i listan och
          täcker hela Dynamics 365-plattformen inklusive HR. Som internationell
          partner med stark F&amp;SCM-kompetens är de relevanta för större
          tillverkningskoncerner med komplexa krav på produktionsplanering,
          supply chain och personalprocesser.
        </p>

        <p>
          <strong>Cepheo</strong><br />
          <em>Business Central, Finance, SCM, Sales, Customer Insights, Human Resources</em>
        </p>
        <p>
          Cepheo är en av Nordens mest heltäckande Microsoft-partners med djup
          erfarenhet av Industri 4.0-implementationer. Deras kompetens spänner
          från BC och F&amp;SCM till CRM och HR, vilket gör dem relevanta för
          tillverkande organisationer som planerar en bred plattformssatsning
          med långsiktig förvaltning.
        </p>

        <p>
          <strong>COSMO CONSULT</strong><br />
          <em>Business Central, Sales, Customer Insights</em>
        </p>
        <p>
          COSMO CONSULT kombinerar BC med CRM-funktionalitet och har
          branschspecifika lösningar för tillverkning byggda ovanpå Dynamics
          365. Relevant för tillverkare som söker ett system med inbyggd
          branschlogik och inte vill bygga allt från standard.
        </p>

        <p>
          <strong>Enqore AB</strong><br />
          <em>Business Central, Finance, SCM, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations</em>
        </p>
        <p>
          Enqore täcker hela Dynamics 365-plattformen och arbetar med
          tillverkande företag i hela komplexitetsspannet. Relevant som
          helhetsleverantör för organisationer som vill ha en partner med
          kapacitet inom samtliga applikationsområden.
        </p>

        <p>
          <strong>Evidi</strong><br />
          <em>Business Central | AI Integration Partner</em>
        </p>
        <p>
          Evidi är en BC-specialist med AI Integration Partner-certifiering.
          Fokus på SMB-segmentet inom tillverkning med en tydlig profil kring
          digitalisering och AI-integration i affärssystemet.
        </p>

        <p>
          <strong>Implema AB</strong><br />
          <em>Finance, Supply Chain Management, Project Operations, Commerce, Human Resources</em>
        </p>
        <p>
          Implema har ett tydligt F&amp;SCM-fokus kompletterat med Project
          Operations och HR — en kombination som passar tillverkande företag
          med projektbaserade leveranser eller engineer-to-order-processer.
          Deras motto "snabbt, säkert och redo för framtiden" speglar en
          leveransmodell inriktad på standardnära implementationer.
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
          <strong>Navcite</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Navcite är en BC-specialist med bred branschräckvidd. Passar
          tillverkande SMB-företag som vill ha en etablerad BC-partner med
          lång erfarenhet av Dynamics-plattformen.
        </p>

        <p>
          <strong>Navet AB</strong><br />
          <em>Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center</em>
        </p>
        <p>
          Navet kombinerar BC med ett brett CRM- och serviceuttag och täcker
          därmed både ERP och kundrelationssidan. Relevant för tillverkare som
          vill samla affärssystem och kundservice hos en och samma partner.
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

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Tillverkningsindustrin är d365.se:s bransch med flest listade
          partners — 19 totalt. Det speglar att branschen är komplex, bred och
          har höga krav på systemstöd. Men fler alternativ innebär inte ett
          enklare val.
        </p>
        <p>
          Avgörande frågor att ställa: Vilken tillverkningsprincip är
          dominerande i er verksamhet — diskret, process, projektbaserad? Hur
          ser behovet av eftermarknad och service ut? Är ERP det primära
          behovet eller behöver CRM och sälj hanteras parallellt? Hur många
          juridiska entiteter och länder berörs?
        </p>
        <p>
          Svaren på de frågorna styr valet av applikation — och därmed vilka
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
  },
  {
    slug: "dynamics-365-livsmedel-processindustri",
    title: "Dynamics 365 för livsmedel & processindustri",
    metaTitle: "Branschguide: livsmedel & processindustri i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk livsmedels- och processindustri.",
    summary:
      "Branschguide för livsmedel & processindustri: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Svensk livsmedels- och processindustri verkar i en av de mest reglerade
          och konkurrensutsatta branscherna. Marginalerna pressas av volatila
          råvarupriser och internationell konkurrens, samtidigt som konsumenternas
          krav på transparens, lokalt producerade varor och hållbarhet ständigt
          ökar. Att hantera allt detta kräver systemstöd som är byggt för
          branschens verklighet — inte ett generellt affärssystem med påklistrade
          anpassningar.
        </p>
        <p>
          Det som skiljer processflöden från diskret tillverkning är fundamentalt:
          recept snarare än stycklistor, batchhantering snarare än serienummer,
          hållbarhetstider som styr lagerlogiken, och produktionsplanering som tar
          hänsyn till sanitering och allergenhantering. En återkallelse måste kunna
          hanteras inom timmar — med full spårbarhet från råvara till slutkund.
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
          <li>Kalkylering med stöd för viktsvinn, utbyte och processvariation — grunden för korrekt marginalanalys</li>
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
          distributörer eller restauranger — och som söker en partner med djup
          CRM-kompetens snarare än ERP — är Sirocco ett relevant alternativ. De
          hanterar kundrelationer, fältservice och kontaktcenter på Dynamics
          365-plattformen.
        </p>


        <p>
          <strong>Cegeka</strong><br />
          <em>Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources</em>
        </p>
        <p>
          Cegeka har ett uttalat fokus på processindustri och livsmedel och täcker
          hela Dynamics 365-plattformen. För medelstora till stora
          livsmedelskoncerner med komplexa krav på produktion, kvalitet, supply
          chain och personalhantering är Cegeka ett av de mest heltäckande
          alternativen i listan.
        </p>

        <p>
          <strong>Cepheo</strong><br />
          <em>Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Human Resources</em>
        </p>
        <p>
          Cepheo täcker hela ERP-spannet från BC till F&amp;SCM och kombinerar det
          med CRM och HR. Som en av Nordens större Microsoft-partners har de
          kapacitet för komplexa implementationer och långsiktig förvaltning,
          vilket är relevant för livsmedelsföretag som planerar en bred
          plattformssatsning.
        </p>

        <p>
          <strong>COSMO CONSULT</strong><br />
          <em>Business Central, Sales, Customer Insights</em>
        </p>
        <p>
          COSMO CONSULT kombinerar BC med CRM och erbjuder branschspecifika
          lösningar för processindustri och livsmedel. För SMB-aktörer som söker
          ett system med inbyggd branschlogik — snarare än ett generiskt BC som
          kräver anpassning — är COSMO CONSULT ett relevant alternativ.
        </p>

        <p>
          <strong>Enqore AB</strong><br />
          <em>Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations</em>
        </p>
        <p>
          Enqore täcker hela Dynamics 365-plattformen med ett tydligt fokus på
          datadrivna och AI-stödda processer. Deras profil — att koppla ihop
          affärssystem med analys för att gå från reaktiv till prediktiv drift —
          är direkt relevant för livsmedelsföretag som vill nyttja produktionsdata
          för bättre beslut kring planering, spårbarhet och kvalitet.
        </p>

        <p>
          <strong>Implema AB</strong><br />
          <em>Finance, Supply Chain Management, Project Operations, Commerce, Human Resources</em>
        </p>
        <p>
          Implema har ett renodlat F&amp;SCM-fokus med standardnära
          implementationsmetodik. För livsmedels- och processföretag med komplexa
          supply chain-krav och behov av snabb men robust leverans är Implema ett
          relevant alternativ. Project Operations-kompetensen passar bolag med
          projektbaserade processer vid exempelvis nya produktionslinjer eller
          anläggningar.
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

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Livsmedels- och processindustrin är en bransch där partnerns
          branscherfarenhet väger tyngre än i de flesta andra segment. Krav på
          spårbarhet, FEFO-styrning, kvalitetsdokumentation och certifieringsstöd
          (BRC, IFS) är inte standardfunktioner i alla system — de kräver antingen
          djupare konfiguration eller branschspecifika tillägg som partnern måste
          behärska.
        </p>
        <p>
          Med åtta listade partners är urvalet mer avgränsat jämfört med exempelvis
          tillverkning. Skillnaderna mellan dem är tydliga: några har
          processtillverkning som kärnkompetens, andra är breda plattformspartners
          med livsmedelserfarenhet som ett av flera segment. En relevant fråga att
          ställa till varje partner är hur många livsmedelsimplementationer de
          genomfört — och om de kan visa referenskunder med liknande produktionsform
          och komplexitet.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/livsmedel-processindustri/">d365.se/branscher/livsmedel-processindustri</a>
        </p>
      </>
    ),
  },
  {
    slug: "dynamics-365-grossist-distribution",
    title: "Dynamics 365 för grossist & distribution",
    metaTitle: "Branschguide: grossist & distribution i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk grossist- och distributionshandel.",
    summary:
      "Branschguide för grossist & distribution: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Grossist- och distributionshandeln binder samman producenter med
          återförsäljare och slutkunder och är en bransch med konstant press på
          marginalerna. Kundernas förväntningar på snabba, precisa och spårbara
          leveranser är en hygienfaktor snarare än ett konkurrensmedel — det är
          vad som krävs bara för att vara med i spelet.
        </p>
        <p>
          Digitaliseringen har accelererat förändringen. B2B e-handel har
          transformerat hur affärer görs och skapat nya krav på självservice,
          realtidsdata och omnikanalsförsäljning. Manuella flöden och
          silobaserade system bromsar tillväxt och lönsamhet. Affärssystemet är
          ryggraden som håller ihop inköp, lager, logistik, orderhantering och
          ekonomi — och i en distributionsverksamhet märks det direkt i
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
          Grossistföretag med ett komplext säljled — KAM-relationer,
          avtalsförhandlingar, kategoriutveckling mot handelskedjor — drar nytta
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
          Distributionsföretag med en aktiv kundtjänst — frågor om orderstatus,
          leveransavvikelser och returer — behöver ett system som ger
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
          partner för hela plattformen — inklusive sälj och kundinsikt — är
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
          fungerar i praktiken — inte bara i projektplanen. För medelstora
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
          — där ERP, kundservice och CRM ska hänga samman i realtid — erbjuder
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
          operativa krav som präglar distributionsverksamheter — lagerflöden,
          orderhantering och prissättning. Relevant för medelstora
          distributionsföretag i SMB-segmentet som söker en hands-on BC-partner
          med god branschförståelse.
        </p>

        <p>
          <strong>Evidi</strong><br />
          <em>Business Central | AI Integration Partner</em>
        </p>
        <p>
          Evidi är en BC-specialist med AI Integration Partner-certifiering och
          ett tydligt fokus på standardnära implementationer med integrerade
          AI-funktioner. För grossist- och distributionsföretag som vill
          kombinera en solid BC-implementation med ett aktivt fokus på AI-driven
          automation och beslutstöd är Evidi ett relevant alternativ i
          SMB-segmentet.
        </p>

        <p>
          <strong>Implema AB</strong><br />
          <em>Finance, Supply Chain Management, Project Operations, Commerce, Human Resources</em>
        </p>
        <p>
          Implema har ett renodlat F&amp;SCM-fokus och arbetar med standardnära
          implementationer under mottot "snabbt, säkert och redo för framtiden".
          För distributionsföretag med avancerade supply chain-krav och behov av
          snabb men robust leverans av ett komplext ERP är Implema ett relevant
          alternativ. Commerce-kompetensen är ett mervärde för grossister som
          hanterar direktförsäljning parallellt.
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
          data, AI och intelligenta arbetsflöden — med målet att koppla samman
          affärssystem och analys för bättre beslut och effektivare processer.
          AI Enabled-certifieringen understryker att de aktivt arbetar med
          AI-integration i sina leveranser. Relevant för medelstora till stora
          distributörer med komplexa supply chain-krav.
        </p>

        <p>
          <strong>Navcite</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Navcite implementerar Business Central för företag inom distribution,
          projektstyrning och tillverkning och har lång erfarenhet av
          Dynamics-plattformen. De arbetar med att integrera BC mot Microsofts
          övriga ekosystem och erbjuder stöd från implementation till löpande
          vidareutveckling och support. Passar grossist- och distributionsföretag
          som söker en etablerad BC-partner med bred plattformserfarenhet och
          stabil leveransmodell.
        </p>

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Grossist och distribution är en bransch där affärssystemet är direkt
          kopplat till verksamhetens lönsamhet — fel lagernivåer, bristande
          leveransprecision eller manuella flöden syns omedelbart på marginalen.
          Det ställer höga krav på att partnern förstår distributionslogik: hur
          inköpsplanering, WMS, prissättning och orderflöden hänger samman.
        </p>
        <p>
          Med tolv listade partners spänner urvalet brett — från renodlade
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
  },
  {
    slug: "dynamics-365-jordbruk-skogsbruk",
    title: "Dynamics 365 för jordbruk & skogsbruk",
    metaTitle: "Branschguide: jordbruk & skogsbruk i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk jordbruks- och skogsbrukssektor.",
    summary:
      "Branschguide för jordbruk & skogsbruk: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Den svenska jordbruks- och skogsbrukssektorn är en bransch som
          kombinerar tradition med ett växande behov av digitalisering.
          Precisionsodling, skogsbruksplanering, maskinuppkoppling och krav på
          spårbarhet från producent till konsument driver på behovet av modernare
          systemstöd. Fragmenterade och isolerade system — ett för ekonomi, ett
          för lager, ett för maskinuppföljning — skapar ineffektivitet och
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
          system — och skalas från ett litet lantbruksföretag på Business Central
          till en stor skogsbrukskoncern på Finance &amp; Supply Chain Management.
          Plattformens öppenhet mot externa system möjliggör även integration av
          IoT-data från maskiner och sensorer via anpassade lösningar.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central: Ekonomi, lager och grundläggande verksamhetsstyrning</h3>
        <p>
          Business Central passar små och medelstora företag inom jordbruk och
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
          underhåll, schemaläggning av tekniker och arbetsorder — och ger
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
          och skogsindustri. De täcker hela applikationsportföljen — från BC och
          F&amp;SCM för ekonomi och supply chain till Sales, Customer Service och
          Field Service för kundrelationer och serviceorganisation, samt HR för
          personalprocesser. Som AI Integration Partner arbetar de aktivt med att
          integrera AI i sina leveranser. Deras erfarenhet av industri, process
          och skog gör dem relevanta för jordbruks- och skogsbruksföretag som
          söker en partner med bred plattformskapacitet och dokumenterad
          förståelse för branschens specifika processer.
        </p>

        <p>
          <strong>Navcite</strong><br />
          <em>Business Central</em>
        </p>
        <p>
          Navcite implementerar Business Central för företag inom distribution,
          projektstyrning och tillverkning, och har lång erfarenhet av
          Dynamics-plattformen. De arbetar med integration mot Microsofts övriga
          ekosystem och erbjuder stöd från implementation till löpande
          vidareutveckling och support. Passar mindre till medelstora jordbruks-
          och skogsbruksföretag som söker en etablerad BC-partner med stabil
          leveransmodell och god processförståelse för ekonomi, lager och inköp.
        </p>

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Jordbruk och skogsbruk är en av de branscher på d365.se med färst
          listade partners — vilket speglar att det är ett specialiserat segment
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
          angränsande branscher som tillverkning eller livsmedel — och utvärdera
          deras erfarenhet av jordbruks- och skogsbruksnära processer.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/jordbruk-skogsbruk/">d365.se/branscher/jordbruk-skogsbruk</a>
        </p>
      </>
    ),
  },
  {
    slug: "dynamics-365-bygg-entreprenad",
    title: "Dynamics 365 för bygg & entreprenad",
    metaTitle: "Branschguide: bygg & entreprenad i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk bygg- och entreprenadbransch.",
    summary:
      "Branschguide för bygg & entreprenad: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Bygg- och entreprenadbranschen är projektdriven till sin natur — och
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
          komplex intressentbild. Fragmenterad projektdata — kalkyl i ett
          system, planering i ett annat, ekonomi i ett tredje — är en av de
          vanligaste orsakerna till att projekt tappar kontrollen. Utan
          realtidsöversikt av kostnader mot budget är det svårt att agera i
          tid. Och i en bransch med ÄTA-hantering, underentreprenörer och
          succesiv vinstavräkning är systemstödets precision direkt kopplad
          till lönsamheten.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska bygg- och
          entreprenadföretag för att samla hela projektkedjan — från anbud och
          kalkyl till projektuppföljning, inköp, resursstyrning och ekonomisk
          rapportering — i ett gemensamt system. Plattformen kan kompletteras
          med branschspecifika tillägg och integreras mot specialiserade
          kalkylprogram och mätningssystem.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central: Projektledning och ekonomi för SMB-entreprenadet</h3>
        <p>
          Business Central är grunden för små och medelstora bygg- och
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
          För bygg- och entreprenadföretag med en serviceaffär vid sidan av
          nyproduktion — till exempel installations- eller teknikföretag med
          serviceavtal — hanterar Field Service schemaläggning av tekniker,
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
          de ett system med inbyggd branschlogik från start — projekthantering,
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
          profil — att koppla samman affärssystem med analys för att gå från
          reaktiv till prediktiv drift — konkret värde i projektuppföljning
          och avvikelsedetektering. De kombinerar ERP-kompetens med CRM och
          fältservice, vilket gör dem relevanta för entreprenaföretag som
          hanterar både projekt och en löpande serviceaffär.
        </p>

        <h3>Navcite</h3>
        <p className="!text-sm text-muted-foreground !mb-2">Business Central</p>
        <p>
          Navcite implementerar Business Central för företag inom projekt,
          tillverkning och distribution och har lång erfarenhet av
          Dynamics-plattformen. I bygg- och entreprenadbranschen fokuserar de
          på projektstyrning, resursplanering och ekonomiuppföljning, och
          arbetar med integration mot Microsofts övriga ekosystem för en
          sammanhållen digital arbetsmiljö. De erbjuder stöd från
          implementation till löpande vidareutveckling — ett stabilt alternativ
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
          och bättre beslut — inte bara stödja befintliga processer. Passar
          medelstora bygg- och entreprenadföretag som söker en partner med
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

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Bygg och entreprenad är en bransch där systemets förmåga att hantera
          projektlogik — ÄTA, successiv vinstavräkning, resursstyrning per
          projekt, inköp kopplat till projektbudget — är avgörande. Det är en
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
          En relevant fråga att ställa varje partner: hur många bygg- och
          entreprenadprojekt har ni genomfört, och kan ni visa referenskunder
          med liknande projekttyper och komplexitetsnivå som er verksamhet?
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/bygg-entreprenad/">d365.se/branscher/bygg-entreprenad</a>
        </p>
      </>
    ),
  },
  {
    slug: "dynamics-365-energi-utilities",
    title: "Dynamics 365 för energi & utilities",
    metaTitle: "Branschguide: energi & utilities i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk energi- och utilitysektor.",
    summary:
      "Branschguide för energi & utilities: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
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
          kundtjänst en 360-gradersvy av kunden — avtalsstatus, mätdata,
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
          sina leveranser — relevant för energibolag som vill nyttja driftsdata
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
          metodiskt för att säkerställa affärsnytta — inte bara teknisk
          leverans. Kombinationen av BC/F&amp;SCM-kompetens med ett av Sveriges
          större CRM-team ger dem kapacitet att täcka hela kundresan, från
          back-office till kundservice. Det globala nätverket med
          specialistkompetens inom förändringsledning och analys är ett
          mervärde vid större digitaliseringsprogram.
        </p>

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
          på partners listade under angränsande branscher — exempelvis Vivicta
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
  },
  {
    slug: "dynamics-365-konsultbolag-tjansteforetag",
    title: "Dynamics 365 för konsultbolag & tjänsteföretag",
    metaTitle: "Branschguide: konsultbolag & tjänsteföretag i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svenska konsult- och tjänsteföretag.",
    summary:
      "Branschguide för konsultbolag & tjänsteföretag: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Konsultbranschen är kunskapsintensiv och marginaldriven. Det som
          avgör lönsamheten är inte produktionsvolym utan beläggningsgrad,
          faktureringsprecision och förmågan att leverera projekt inom budget.
          Det är en enkel ekvation i teorin — men komplex att styra i praktiken
          när man hanterar dussintals projekt, hundratals konsulter och en
          pipeline som ständigt förändras.
        </p>
        <p>
          Det vanligaste problemet är fragmentering: tidrapportering i ett
          system, projektplanering i ett annat, ekonomi i ett tredje och CRM i
          ett fjärde. Informationsglapp mellan sälj och leverans leder till
          felaktiga förväntningar och resursbrist. Utan realtidsinsikt i
          projektens ekonomi är det svårt att identifiera avvikelser i tid. Och
          komplexa faktureringsmodeller — fastpris, löpande räkning, a conto,
          retainers — hanteras manuellt med alla de felkällor det innebär.
        </p>
        <p>
          Microsoft Dynamics 365 används av svenska konsultföretag för att
          koppla samman hela kedjan från första kundkontakt till slutfaktura i
          ett sammanhållet system. Plattformen täcker CRM och säljstöd, resurs-
          och kompetensplanering, projektledning, tid- och utläggsrapportering,
          projektredovisning och fakturering — och kan kompletteras med
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
          komplexitet — fler enheter, internationell verksamhet, avancerade
          krav på koncernredovisning — erbjuder Fellowmind kapacitet att följa
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
          levererar BC förstärkt med Progressus Advanced Projects — ett
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
          båda fram detta alternativ — vilket är ett tecken på att de mött
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
  },
  {
    slug: "dynamics-365-finans-forsakring",
    title: "Dynamics 365 för finans & försäkring",
    metaTitle: "Branschguide: finans & försäkring i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk finans- och försäkringsbransch.",
    summary:
      "Branschguide för finans & försäkring: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Finans- och försäkringsbranschen är hårt reglerad, dataintensiv och
          under konstant transformationstryck. FinTech-utmanare, nya
          kundförväntningar på digital service och ett regulatoriskt landskap
          som kontinuerligt förändras — IFRS 17, Solvens II, MiFID II, AML —
          ställer höga krav på systemstödets flexibilitet och spårbarhet.
          Äldre, isolerade kärnsystem är en av de största bromsklossarna: de är
          kostsamma att underhålla, svåra att integrera och producerar inte den
          realtidsdata som krävs för att styra verksamheten.
        </p>
        <p>
          Utmaningen är inte att hitta ett system som löser allt — det finns
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
          rätt information vid rätt tidpunkt — oavsett kanal.
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
          kunden och ärendet — oavsett vilken kanal kunden kontaktar bolaget
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
          data från olika källor — transaktionssystem, CRM, kundservice — till
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
          ett relevant alternativ. Deras portfölj täcker hela kundresan — från
          marknadsföring och försäljning till ärendehantering och kontaktcenter
          — i ett sammanhållet Dynamics 365-ekosystem.
        </p>

        <h3>Enqore AB</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Business Central, Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations
        </p>
        <p>
          Enqore täcker hela Dynamics 365-plattformen med ett tydligt fokus på
          datadrivna och AI-stödda processer. I finansbranschen — där stora
          datamängder finns men insikterna ofta kommer för sent — är deras
          profil direkt relevant: de kopplar samman affärssystem med analys och
          AI för att möjliggöra prediktivt beslutsfattande snarare än reaktivt.
          Relevant för finansbolag som vill nyttja sin data mer aktivt för
          riskhantering, kundbearbetning och processautomation.
        </p>

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
          Ingen av dem är en renodlad finansspecialist — de är alla bredare
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
  },
  {
    slug: "dynamics-365-offentlig-sektor",
    title: "Dynamics 365 för offentlig sektor",
    metaTitle: "Branschguide: offentlig sektor i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk offentlig sektor.",
    summary:
      "Branschguide för offentlig sektor: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Offentlig sektor i Sverige befinner sig mitt i en digital
          transformation som drivs av två parallella krafter: ökade
          medborgarförväntningar på tillgänglighet och effektivitet, och ett
          konstant krav på ansvarsfull förvaltning av skattemedel. Det gör
          it-investeringar i offentlig sektor fundamentalt annorlunda än i
          privat: det räcker inte att ett system är effektivt — det måste också
          vara rättssäkert, spårbart och upphandlat i enlighet med LOU.
        </p>
        <p>
          De vanligaste problemen är välkända: ärendehantering och ekonomi i
          separata system utan koppling, silobaserad information som försvårar
          helhetsbild och samarbete mellan förvaltningar, och ett
          systemlandskap med inbyggd komplexitet som härstammar från decennier
          av punktlösningar. Därtill hanterar kommuner och myndigheter ofta
          parallella logiker i samma organisation — skattefinansierad
          kärnverksamhet och avgiftsfinansierade tjänster som VA, renhållning
          och barnomsorg — vilket ställer krav på systemets flexibilitet.
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
          medborgarfrågor och felanmälningar oavsett kanal — telefon, e-post,
          webb eller sociala medier — och kopplar ärendet till rätt funktion i
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
          hantera komplexa transformationsprogram — vilket ofta är verkligheten
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
          fokusområden, och de kombinerar bred applikationskapacitet — ERP,
          CRM, kundservice, fältservice och HR — med Power Platform och
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
          datadrivna och AI-stödda processer. Deras profil — att koppla samman
          affärssystem med analys och AI för att gå från reaktiv till prediktiv
          verksamhetsstyrning — är relevant för offentliga organisationer som
          vill nyttja sin data mer aktivt för resursoptimering, ärendeanalys
          och proaktiv service. Relevant för organisationer som vill kombinera
          Dynamics 365 med ett starkare analyslager.
        </p>

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
  },
  {
    slug: "dynamics-365-life-science-medtech",
    title: "Dynamics 365 för Life Science & Medtech",
    metaTitle: "Branschguide: Life Science & Medtech i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk Life Science- och Medtech-bransch.",
    summary:
      "Branschguide för Life Science & Medtech: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Life Science och Medtech är en av de mest krävande branscherna för
          affärssystemsval. Det är inte primärt processernas komplexitet som
          gör det svårt — det är de regulatoriska kraven som omgärdar dem.
          MDR, IVDR, ISO 13485, GxP, FDA 21 CFR Part 11: alla ställer krav på
          fullständig spårbarhet, audit trails, kontrollerad dokumenthantering
          och i många fall validering av systemförändringar. Det innebär att
          ett systemval i Life Science inte bara handlar om funktionalitet
          utan om förmågan att validera och underhålla regelefterlevnad över
          tid.
        </p>
        <p>
          Svenska Life Science-företag spänner över ett brett spektrum — från
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
          lagerhantering med utgångsdatum, och distribution — med full
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
          tillägg — exempelvis för batchhantering, kvalitetssäkring och UDI —
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
          kalibrering och löpande underhåll är Field Service kritiskt — och i
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
          — en regulatorisk skyldighet som kräver systematisk insamling och
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
          — däribland Yaveon 365 Lot Management för avancerad batchhantering,
          spårbarhet och lagerflöden. De täcker också kundrelationssidan med
          Sales, Customer Service och Field Service, vilket gör dem relevanta
          för Medtech-bolag som hanterar både supply chain och
          serviceorganisation. Sedan 2023 ingår Navet i Aderian Group med ett
          bredare nordiskt IT-erbjudande. Som AI Integration Partner arbetar
          de aktivt med AI i sina leveranser.
        </p>

        <h3>Cegeka</h3>
        <p className="!text-sm text-muted-foreground !mb-2">
          Finance, Supply Chain Management, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Project Operations, Human Resources | AI Advanced
        </p>
        <p>
          Cegeka är den mest branschspecialiserade partnern i listan för Life
          Science och Medtech. Deras förkonfigurerade lösning Cegeka Pharma
          &amp; Life Sciences for Dynamics 365 innehåller över 660
          fördefinierade processer, varav mer än 200 är GxP-processer, och har
          stöd för Computer System Validation (CSV) enligt GAMP5 samt
          efterlevnad av 21 CFR Part 11, 21 CFR Part 820 och EudraLex. De har
          även en Quality Impact Recall Agent för strukturerade
          återkallningsprocesser med full spårbarhet. År 2025 utsågs Cegeka
          till global vinnare av Microsoft Dynamics 365 Supply Chain Partner
          of the Year. Deras AI Advanced-status och djupa branschfokus gör
          dem till det starkaste alternativet för Life Science-bolag med
          komplexa regulatoriska krav och internationell verksamhet.
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
          branschspecialist inom Life Science — de saknar dedikerade Life
          Science-tillägg — men är ett relevant alternativ för organisationer
          vars primära behov är avancerad supply chain och projektredovisning
          snarare än regulatorisk valideringsstöd.
        </p>

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Life Science och Medtech är den bransch på d365.se där skillnaden
          mellan partners är som störst. Cegeka erbjuder en förkonfigurerad
          branschlösning med inbyggd GxP-compliance och valideringsstöd —
          vilket är fundamentalt annorlunda än en standardimplementation med
          branschanpassning. Det reducerar implementationsrisk och
          valideringsbörda markant, men är sannolikt dimensionerat för
          medelstora till stora aktörer snarare än startups.
        </p>
        <p>
          COSMO CONSULT och Navet AB erbjuder BC med branschspecifika tillägg
          för UDI, batchhantering och kvalitetssäkring — relevant för
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
  },
  {
    slug: "dynamics-365-telekom-it-tjanster",
    title: "Dynamics 365 för telekom & IT-tjänster",
    metaTitle: "Branschguide: Telekom & IT-tjänster i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk telekom- och IT-tjänstebransch.",
    summary:
      "Branschguide för Telekom & IT-tjänster: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Telekom- och IT-tjänstebranschen har genomgått en strukturell
          förändring i affärsmodellen: från engångsleveranser och projekttimmar
          mot prenumerationsbaserade tjänster, managerade driftlösningar och
          paketerade erbjudanden som kombinerar hårdvara, mjukvara, support och
          konsulttjänster i ett abonnemang. Det ställer systemstödet inför en
          ny typ av komplexitet — inte teknisk, utan kommersiell.
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
          projektleverans i ett sammanhållet flöde — en kritisk integration för
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
          erbjudanden och långa säljcykler — relevant för IT-bolag som säljer
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
          erbjudanden med hårdvara, mjukvara och konsulttjänster — och täcker
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
          IT-bolag som driver en bredare digital transformation — exempelvis en
          övergång från projektbaserad till prenumerationsbaserad affärsmodell
          som kräver processomstrukturering snarare än bara ett nytt system.
        </p>

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
          Konsulttjänster — många av dem har dokumenterad erfarenhet av
          IT-tjänstebolag och prenumerationsmodeller.
        </p>
        <p>
          Läs mer och jämför partners:{" "}
          <a href="/branscher/telekom-it-tjanster/">d365.se/branscher/telekom-it-tjanster</a>
        </p>
      </>
    ),
  },
  {
    slug: "dynamics-365-uthyrning",
    title: "Dynamics 365 för uthyrningsverksamhet",
    metaTitle: "Branschguide: Uthyrning i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk uthyrningsverksamhet.",
    summary:
      "Branschguide för Uthyrning: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Uthyrningsbranschen i Sverige växer, drivet av ökad efterfrågan på
          flexibla lösningar och ett hållbarhetsperspektiv där företag väljer
          att hyra istället för att äga. Maskiner, fordon, verktyg,
          eventutrustning — gemensamt för alla uthyrningssegment är att
          lönsamheten styrs av beläggningsgraden, och att beläggningsgraden
          kräver realtidsöversikt över varje tillgångs status, var den befinner
          sig och när den behöver service.
        </p>
        <p>
          Det är en annan affärslogik än handel eller tillverkning. Systemet
          måste hantera tillgångars livscykel som det centrala objektet — från
          inköp och avskrivning via bokning, leverans och retur till service
          och slutligen utrangering — och koppla det till ekonomi,
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
          returinspektion — kräver vanligen ett branschspecifikt tillägg för
          att systemet ska fungera optimalt.
        </p>

        <h2>Centrala arbetsprocesser och systemstöd</h2>

        <h3>Business Central med uthyrningslösning: Kärnan i systemstödet</h3>
        <p>
          BC är basen för de flesta uthyrningsföretag i SMB-segmentet. Systemet
          täcker ekonomi, lager och grundläggande kundhantering, men behöver
          kompletteras med ett uthyrningsspecifikt tillägg för att hantera
          branschens kärnprocesser fullt ut. EQM 365 Rental är ett exempel på
          ett sådant tillägg — en ISV-lösning byggd på BC som tillhandahåller
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
          direkt kopplat till beläggningsgrad och lönsamhet — ett objekt som är
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
          fullständig hyreshistorik, aktiva avtal och kommunikation — vilket
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
          flöde. Det är en relevant distinktion — det innebär att Navet inte
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
          bedriver — maskiner och fordon kräver annan systemlogik än
          eventutrustning eller verktyg — kan det vara värt att titta bredare
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
  },
  {
    slug: "dynamics-365-mode-sport-textil",
    title: "Dynamics 365 för mode, sport & textil",
    metaTitle: "Branschguide: Mode, sport & textil i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk mode-, sport- och textilbransch.",
    summary:
      "Branschguide för Mode, sport & textil: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Mode, sport och textil är en bransch med ett systemlandskap som
          ställer helt egna krav. Variantkomplexiteten — varje artikel i
          storlek, färg och modell — skapar en SKU-flora som generella
          affärssystem inte hanterar väl ur lådan. Lägg till säsongslogik,
          kollektion- och inköpsplanering mot globala leverantörer med långa
          ledtider, snabba markdowns när säsongen vänder, och omnichannel-krav
          där lager, priser och kampanjer behöver vara konsekventa oavsett om
          kunden köper i butik, via e-handel eller på marketplace — och det är
          tydligt varför branschspecifik konfiguration är ett minimum, och ett
          branschspecifikt tillägg ofta nödvändigt.
        </p>
        <p>
          Svenska mode- och sportbolag i SMB-segmentet har historiskt haft ett
          smalt utbud av relevanta affärssystemslösningar. Dynamics 365
          Business Central med branschanpassningar är ett alternativ som
          används av en del aktörer, men konkurrensen om plattformsval är hård
          — specialiserade modeERP-system utmanar. Det avgörande valet är inte
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
          Commerce är Microsoft Dynamics-svaret på omnichannel retail — en
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
          på mode, sport och textil — det är inte ett av flera segment utan
          deras primära marknad. De arbetar med digitalisering av
          informationsflöden och affärsprocesser för bolag i branschen, med
          specifik kompetens inom produktlivscykelhantering, kollektionshantering,
          lageroptimering, distributionskedja och integration mot
          e-handelsplattformar och logistikpartners. För ett mode- eller
          sportbolag som väljer BC som systemplattform är adbriq det enda
          alternativet i listan med den kombinationen av branschdjup och
          plattformsspecialisering. Att de är den enda listade partnern för
          branschen gör dem till det naturliga första samtalet — men det
          innebär också att en bred partnerutvärdering bör inkludera aktörer
          utanför d365.se:s lista.
        </p>

        <h2>Att välja rätt partner för din organisation</h2>
        <p>
          Mode, sport och textil är den bransch på d365.se med minst listade
          partners — en partner. Det är ett utpräglat nischsegment där
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
          Retail &amp; E-handel-segmentet på d365.se — flera av dem, som
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
  },
  {
    slug: "dynamics-365-fastighet-forvaltning",
    title: "Dynamics 365 för fastighet & förvaltning",
    metaTitle: "Branschguide: Fastighet & Förvaltning i Dynamics 365 | d365.se",
    metaDescription:
      "Arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners för svensk fastighets- och förvaltningsbransch.",
    summary:
      "Branschguide för Fastighet & Förvaltning: arbetsprocesser, systemstöd i Dynamics 365 och en genomgång av listade partners — skriven ur köparens perspektiv.",
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
          Arbetsprocesser, systemstöd och en genomgång av listade partners — skriven ur köparens perspektiv.
        </p>

        <h2>Branschens verklighet</h2>
        <p>
          Fastighets- och förvaltningsbranschen arbetar med tillgångsstyrning i
          en helt annan skala och tidshorisont än de flesta branscher.
          Fastigheter är kapitalintensiva och långsiktiga investeringar, och
          förvaltningens kvalitet är direkt kopplad till fastighetsvärdet. Det
          ställer krav på systemstöd som kan hantera allt från hyresadministration
          och underhållsplanering till investeringsprojekt och
          hållbarhetsrapportering — ofta över en portfölj med många fastigheter
          och olika ägarstrukturer.
        </p>
        <p>
          Den typiska systemsmärtan i branschen är fragmentering: ett system
          för ekonomi, ett för hyresadministration, ett för felanmälan och
          arbetsorder, och ett separat för hyresgästkommunikation. Det skapar
          informationssiloer, manuella flöden och bristande helhetsbild.
          Proptech-utvecklingen — IoT, digitala nyckelhanteringssystem, smarta
          mätare — driver på behovet av ett back-office system som kan ta emot
          och agera på data från fastigheternas tekniska infrastruktur.
        </p>
        <p>
          Microsoft Dynamics 365 kan fungera som det sammanhållande lagret för
          ekonomistyrning, hyresadministration, underhåll, fältservice och
          hyresgästkommunikation. Systemet integreras med branschspecifika
          fastighetssystem via öppna API:er — det är inte en fullständig
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
          tekniker och dokumenterar utfört arbete — och kopplar kostnaden
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
          ärendehantering i ett enhetligt gränssnitt — oavsett om hyresgästen
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
          fastighetssystem — Vitec Fastighet, MRI Software, Raindance och
          liknande — traditionellt dominerat hyresadministrationen. Dynamics
          365 konkurrerar i detta segment primärt som ett ekonomi- och
          processystem som integrerar med dessa specialistsystem, snarare än
          som en komplett fastighetslösning ur lådan.
        </p>
        <p>
          Med en enda listad partner är urvalsprocessen på d365.se begränsad.
          Fellowmind är ett välkänt alternativ med god plattformsbredd, men en
          gedigen partnerutvärdering för ett fastighetsbolag bör inkludera
          partners utanför listan — exempelvis aktörer med specifika
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
          "Licenskostnaden styrs av val av plattform och antal användare. Business Central Essentials ligger på cirka 850 kr/användare/månad och Premium på cirka 1 215 kr/användare/månad. Finance kostar cirka 1 950 kr/användare/månad och Supply Chain Management cirka 2 050 kr/användare/månad — relevant för större fastighetsbolag med komplex ekonomi och investeringsprojekt. Field Service ligger på cirka 1 250 kr/användare/månad och Customer Service Enterprise på cirka 1 050 kr/användare/månad.\n\nTill licenserna tillkommer implementationskostnaden, som för ett medelstort fastighetsbolag typiskt landar i intervallet 800 000 – 3 000 000 kr beroende på omfattning, integrationer mot hyresadministration (Vitec, MRI, Raindance) och behov av branschspecifika tillägg. Räkna också med löpande förvaltningskostnad på 10–20 % av implementationen per år.",
      },
      {
        question: "Vilka problem stöter fastighetsbolag på i en Dynamics 365-implementation?",
        answer:
          "De vanligaste fallgroparna är (1) underskattad integration mot befintligt hyresadministrationssystem — datamodeller och avtalslogik skiljer sig markant; (2) otydlig rolldelning mellan D365 och specialistsystem, vilket leder till dubbla register; (3) felanmälansflödet från hyresgäst till tekniker som inte kopplas hela vägen tillbaka till ekonomi för kostnadsallokering per fastighet; och (4) bristfällig hantering av anläggningsregister och avskrivningar när fastighetsportföljen växer eller omstruktureras.\n\nDet är också vanligt att proptech-data (IoT, smarta mätare) hamnar i en separat silo istället för att triggas in i D365 som automatiserade arbetsorder eller avvikelser.",
      },
      {
        question: "Dynamics 365 vs Vitec, MRI Software och Raindance — vad ska vi välja?",
        answer:
          "Det är inte ett antingen-eller. Vitec, MRI och Raindance är specialiserade fastighetssystem som dominerar hyresadministrationen i Sverige med djup branschfunktionalitet ur lådan. Dynamics 365 är en bredare affärsplattform för ekonomi, projekt, fältservice och kundrelationer.\n\nDen vanligaste arkitekturen i större fastighetsbolag är att behålla specialistsystemet för hyresadministration och låta Dynamics 365 vara back-office för ekonomi, anläggningsregister, investeringsprojekt och servicelogik — med integration däremellan. För mindre bolag eller bolag med okomplicerad portfölj kan Business Central räcka som helhetslösning. Frågan att ställa: hur mycket av hyresadministrationens särlogik klarar en D365-implementation utan att bli kostsam särutveckling?",
      },
      {
        question: "Vad säger andra fastighetsbolag som infört Dynamics 365?",
        answer:
          "Erfarenheterna varierar med scope. Bolag som använt D365 som ekonomi- och projektplattform med integration mot ett specialiserat fastighetssystem rapporterar generellt god utväxling — särskilt på investeringsuppföljning, koncernredovisning och fältservice. Bolag som försökt ersätta hela hyresadministrationen med D365 utan branschtillägg har oftare stött på dyr särutveckling och förlängda projekt.\n\nEn återkommande lärdom är att tidigt involvera både ekonomi-, förvaltnings- och driftorganisationen i kravarbetet, och att be partnern uppvisa konkreta referenscase med liknande portföljstorlek och systemlandskap.",
      },
      {
        question: "Vilken Dynamics 365-partner är bäst för fastighet & förvaltning?",
        answer:
          "På d365.se är Fellowmind den enda listade partnern för branschen. De har bred plattformsbredd över BC, F&SCM, Sales och Customer Insights och stor europeisk leveranskapacitet, men fastighet är ett av flera segment snarare än uttalat primärfokus. För en gedigen utvärdering bör ni därför komplettera med partners utanför listan som har dokumenterade ISV-lösningar eller egna fastighetstillägg på BC eller F&SCM.\n\nVår rekommendation är att utvärdera 2–3 partners och be om: (1) konkreta referenscase i fastighetsförvaltning av jämförbar storlek, (2) integrationsmodell mot ert hyresadministrationssystem och (3) en tydlig avgränsning av vad D365 ska göra respektive vad specialistsystemet behåller.",
      },
    ],
  },
];


export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined =>
  BLOG_ARTICLES.find((a) => a.slug === slug);
