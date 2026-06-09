import { ReactNode } from "react";
import aiErpRiskbildHero from "@/assets/articles/ai-erp-riskbild-hero.jpg";
import partnervaletAvgorHero from "@/assets/articles/partnervalet-avgor-hero.jpg";
import ownedIntelligenceHero from "@/assets/articles/owned-intelligence-hero.jpg";
import ownedIntelligenceSkiljelinje from "@/assets/articles/owned-intelligence-skiljelinje.jpg";
import releaseWave1Hero from "@/assets/articles/d365-release-wave-1-2026-hero.jpg";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelImg from "@/assets/industries/livsmedel.webp";

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
          Nedan presenteras de sju partners som är listade för branschen på
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
          Nedan presenteras de 19 partners som är listade för branschen på
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
];

export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined =>
  BLOG_ARTICLES.find((a) => a.slug === slug);
