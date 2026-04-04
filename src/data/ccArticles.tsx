import type { DeepDiveArticle } from "./bcArticles";
import cc01 from "@/assets/articles/cc-01-plattformen.png";
import cc02 from "@/assets/articles/cc-02-copilot.png";
import cc03 from "@/assets/articles/cc-03-voicebots.png";
import cc04 from "@/assets/articles/cc-04-routing.png";
import cc05 from "@/assets/articles/cc-05-wem.png";
import cc06 from "@/assets/articles/cc-06-analytik.png";
import cc07 from "@/assets/articles/cc-07-digital.png";
import cc08 from "@/assets/articles/cc-08-sakerhet.png";
import cc09 from "@/assets/articles/cc-09-conversational.png";
import cc10 from "@/assets/articles/cc-10-integration.png";

export const CC_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "den-moderna-contactcenterplattformen",
    title: "Den moderna contactcenter-plattformen",
    description: "Molnbaserad omnikanalplattform med inbyggd AI byggd på Azure Communication Services.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Plattformen",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Dynamics 365 Contact Center är Microsofts nästa generations molnbaserade contactcenter-lösning 
            — byggd på Azure Communication Services och integrerad med Copilot AI för varje interaktion, 
            i varje kanal.
          </em>
        </p>

        <h2>Azure Communication Services som grund</h2>
        <p>
          Contact Center är byggt på Azure Communication Services — Microsofts molnbaserade 
          kommunikationsplattform. Det innebär global räckvidd, elastisk skalbarhet och inbyggd 
          säkerhet utan on-premise-hårdvara.
        </p>

        <h2>Kanalöversikt och omnikanalhantering</h2>
        <p>
          Plattformen stöder röst, video, chatt, e-post, SMS, WhatsApp, Facebook Messenger och 
          Twitter direkt ur boxen. Alla interaktioner landar i ett enhetligt ärendesystem med 
          komplett korskanal-historik.
        </p>

        <h2>Microsoft Teams-integration</h2>
        <p>
          Contact Center integreras nativt med Microsoft Teams för intern kommunikation, 
          experteskalering och supervisor-coaching — utan att behöva separata telefonisystem.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Elastisk skalning vid kampanjperioder</li>
          <li>Inbyggd redundans och disaster recovery</li>
          <li>GDPR-kompatibel datalagring i EU-region</li>
          <li>Single tenant eller multi-tenant-alternativ</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-varje-kundinteraktion",
    title: "Copilot i varje kundinteraktion",
    description: "Generativ AI som förvandlar handläggarupplevelsen med realtidsassistans.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Copilot & AI",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Copilot är inte ett tillägg till Contact Center — det är inbyggt i plattformens kärna. 
            Varje samtal, chatt och e-post assisteras av generativ AI som minskar hanteringstiden, 
            ökar First Contact Resolution och förbättrar kundupplevelsen.
          </em>
        </p>

        <h2>Realtids-samtalstranskription och assistans</h2>
        <p>
          Varje samtal transkriberas i realtid. Copilot analyserar konversationens kontext och 
          föreslår relevanta svarsmöjligheter, kunskapsartiklar och nästa steg direkt i 
          handläggarens arbetsyta.
        </p>
        <p>
          Handläggaren behöver aldrig söka manuellt — rätt information presenteras 
          automatiskt baserat på vad kunden berättar.
        </p>

        <h2>Generativa svarsutkast</h2>
        <p>
          Vid chatt och e-post genererar Copilot ett komplett svarsutkast baserat på kundens 
          fråga och relevant kunskapsbasinformation. Handläggaren granskar, justerar och skickar 
          — processen tar sekunder, inte minuter.
        </p>

        <h2>Ärendesammanfattning och dokumentation</h2>
        <p>
          Vid samtalsslut genererar Copilot en strukturerad ärendesammanfattning med orsak, 
          åtgärder och resolution — ett klick dokumenterar hela interaktionen.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Automatisk ärendekategorisering</li>
          <li>Nästa-bästa-åtgärd-förslag</li>
          <li>Copilot-driven kvalitetsgranskning</li>
          <li>Stöd för 100+ språk med realtidsöversättning</li>
        </ul>
      </>
    ),
  },
  {
    slug: "voicebots-och-ivr-med-generativ-ai",
    title: "Voicebots och IVR med generativ AI",
    description: "Naturliga telefonsamtal som löser ärenden utan handläggare.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Voicebots & IVR",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Traditionella IVR-system frustrerar kunder med rigida menyer. Contact Centers 
            AI-drivna voicebot förstår naturligt tal, hanterar komplexa frågor och löser ärenden 
            självständigt — och eskalerar sömlöst till handläggare när det behövs.
          </em>
        </p>

        <h2>Naturlig språkförståelse och dialog</h2>
        <p>
          Voiceboten drivs av Azure Cognitive Services och generativ AI. Kunden behöver inte 
          välja siffror i menyer — de beskriver sitt ärende naturligt och boten förstår, 
          klarifierar och agerar.
        </p>

        <h2>Kontoidentifiering och säkerhet</h2>
        <p>
          Röstautentisering och flerfaktorsverifiering integreras sömlöst i voicebotens flöde. 
          Kunden autentiseras naturligt utan att behöva säkerhetsord i separata system.
        </p>

        <h2>Sömlös övergång till mänsklig handläggare</h2>
        <p>
          När voiceboten når sin kompetensgräns eller kunden begär mänsklig hjälp sker 
          övergången sömlöst — hela konversationshistoriken och autentiseringsresultatet medföljer.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Anpassningsbara botflöden i Copilot Studio</li>
          <li>Stöd för 70+ språk och dialekter</li>
          <li>Emotion detection och eskaleringsregler</li>
          <li>A/B-testning av botdialogvarianter</li>
        </ul>
      </>
    ),
  },
  {
    slug: "intelligent-routing-och-kooptimering",
    title: "Intelligent routing och köoptimering",
    description: "Rätt handläggare, rätt ärende, rätt tidpunkt — varje gång med AI-matchning.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Routing & Köer",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Suboptimal routing orsakar längre väntetider, feldirigerade ärenden och frustration 
            för både kund och handläggare. Contact Centers Unified Routing engine använder AI 
            för att matcha varje ärende med bäst lämpade tillgängliga resurs.
          </em>
        </p>

        <h2>Unified Routing och AI-matchning</h2>
        <p>
          Unified Routing analyserar ärendets kanal, ämne, kundprofil, historik och sentimentpoäng 
          för att välja rätt handläggare.
        </p>
        <p>
          Kompetens, erfarenhet, workload och kundrelation vägs samman i matchningsalgoritmen 
          — vilket ger bättre resultat än enkel round-robin-fördelning.
        </p>

        <h2>Prioriterade köer och VIP-hantering</h2>
        <p>
          Kunder med hög CLV eller premium-kontrakt prioriteras automatiskt i kön och kan 
          erbjudas callback-alternativ för att undvika väntan.
        </p>
        <p>
          VIP-kunder kopplas till dedikerade handläggare med full historik och relationskontext.
        </p>

        <h2>Prognosstyrd kapacitetsplanering</h2>
        <p>
          Routing-engine kommunicerar med WFM-systemet för att säkerställa att prognostiserade 
          volymer matchas med schemalagd kapacitet per kompetensgrupp.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Skill-based routing med kompetensnivåer</li>
          <li>Preferred agent routing för VIP-kunder</li>
          <li>Automatic overflow till backup-köer</li>
          <li>Realtids-dashboard för kö-KPI:er</li>
        </ul>
      </>
    ),
  },
  {
    slug: "workforce-engagement-management",
    title: "Workforce Engagement Management",
    description: "Maximera handläggarengagemang och operativ effektivitet med AI-driven WFM.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – WEM",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Personalomkostnaderna är den största kostnadsposten i ett contact center. 
            Workforce Engagement Management optimerar schemaläggning, coaching och engagemang 
            för att maximera kvalitet och effektivitet simultant.
          </em>
        </p>

        <h2>AI-driven WFM och schemaoptimering</h2>
        <p>
          Volymprognos baserad på historiska mönster, kampanjkalender och säsong styr automatisk 
          schemaoptimering. Systemet balanserar krav, preferenser och lagstadgade arbetstidsregler.
        </p>

        <h2>Quality Management och coaching</h2>
        <p>
          AI granskar 100 % av interaktioner mot definierade kvalitetskriterier. Supervisorer 
          ser automatiserade quality scores och kan prioritera coachningsinsatser mot handläggare 
          med störst förbättringspotential.
        </p>

        <h2>Gamification och handläggarengagemang</h2>
        <p>
          Prestationsbaserade utmaningar, achievements och topplistor driver motivation 
          utan att öka trycket negativt.
        </p>
        <p>
          Transparenta mätetal gör att handläggare själva kan följa sin utveckling 
          och identifiera förbättringsområden.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Flexibel schemaläggning via mobilapp</li>
          <li>Shift-byte och intresseanmälan för övertid</li>
          <li>Personligt prestandadashboard för handläggare</li>
          <li>Integration med LMS för utbildningsspårning</li>
        </ul>
      </>
    ),
  },
  {
    slug: "realtidsanalytik-och-supervisordashboard",
    title: "Realtidsanalytik och supervisor-dashboard",
    description: "Fullständig operativ synlighet i varje ögonblick med AI-anomalidetektering.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Realtidsanalytik",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Supervisorer i ett contact center behöver omedelbar situationsöverblick för att agera 
            snabbt vid kapacitetsproblem, kvalitetsavvikelser eller stora händelser. Contact Centers 
            realtidsdashboard ger en komplett bild av operationsläget.
          </em>
        </p>

        <h2>Supervisor-dashboard och wallboard</h2>
        <p>
          Anpassningsbara dashboards visar köstatus, handläggarstatus, SLA-tick, genomsnittliga 
          väntetider och sentimentdistribution i realtid.
        </p>
        <p>
          Wallboard-vyn visas på skärmar i contact centret för teamöverblick — så att alla 
          ser det aktuella läget.
        </p>

        <h2>Whisper coaching och live monitoring</h2>
        <p>
          Supervisorer kan lyssna på pågående samtal och "whisper" (viska råd) till handläggaren 
          utan att kunden hör. Vid kritiska situationer kan supervisorn ta över samtalet direkt.
        </p>

        <h2>AI-driven anomalidetektering</h2>
        <p>
          Systemet detekterar automatiskt ovanliga mönster: plötslig ökning av en viss ärendetyp, 
          ovanligt lång kötid för ett segment, kraftigt försämrat sentiment.
        </p>
        <p>
          Supervisorn notifieras omedelbart med kontextuell information om vad som avviker 
          och förslag på åtgärder.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Tröskelbaserade larmregler per KPI</li>
          <li>Historisk trendanalys med drill-down</li>
          <li>Exportfunktion till Power BI</li>
          <li>Cross-team och cross-site aggregering</li>
        </ul>
      </>
    ),
  },
  {
    slug: "digital-first-och-chatbaserade-kanaler",
    title: "Digital-first och chatbaserade kanaler",
    description: "Möt kunder på deras föredragna digitala plattformar med samma AI-kvalitet.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Digitala kanaler",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Kunder föredrar alltmer asynkron digital kommunikation framför telefonsamtal. 
            Contact Center stöder chatt, e-post, SMS, WhatsApp och sociala kanaler med samma 
            AI-kvalitet och routing-intelligens som röstkanalen.
          </em>
        </p>

        <h2>Proaktiv chatt och beteendetriggers</h2>
        <p>
          Webbchatt-boten kan proaktivt initieras när en besökare uppvisar hjälpbehov-signaler: 
          lång tid på kassasida, flera misslyckade sökningar eller upprepade sidbesök.
        </p>
        <p>
          Rätt erbjudande i rätt ögonblick ökar konverteringen och minskar avhopp 
          i köpprocessen.
        </p>

        <h2>Asynkrona kanaler och konversationshantering</h2>
        <p>
          WhatsApp och SMS-konversationer är asynkrona — kunden skickar när det passar dem. 
          Systemet håller konversationskontexten aktiv i dagar och möjliggör sömlösa återupptag.
        </p>

        <h2>Social Service och sentimentövervakning</h2>
        <p>
          Twitter/X och Facebook-omnämnanden av varumärket övervakas och kan automatiskt 
          skapa ärenden vid negativa omnämnanden.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Co-browse-funktion för skärmdelning</li>
          <li>Asynkrona video-meddelanden</li>
          <li>Rich media-stöd (bilder, dokument, kartor)</li>
          <li>Chatbot-till-handläggare eskalering med full historik</li>
        </ul>
      </>
    ),
  },
  {
    slug: "sakerhet-compliance-och-inspelning",
    title: "Säkerhet, compliance och inspelning",
    description: "Hantera regulatoriska krav utan operativ komplexitet — GDPR, PCI DSS och mer.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Säkerhet & Compliance",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Contact centers hanterar känslig kunddata och lyder under strikta regulatoriska krav 
            — GDPR, PCI DSS, MiFID II och branschspecifika regler. Contact Centers compliance-funktioner 
            hanterar krav utan att påverka operativ effektivitet.
          </em>
        </p>

        <h2>Samtalsinspelning och arkivering</h2>
        <p>
          Alla samtal och chattinteraktioner spelas in automatiskt och arkiveras krypterat 
          med konfigurerbara lagringstider.
        </p>
        <p>
          Sökbara transkript möjliggör effektiv ärendehantering och juridisk granskning 
          vid behov.
        </p>

        <h2>PCI DSS och betalningsdata</h2>
        <p>
          Vid betalningsinmatning pausas inspelningen automatiskt och handläggarens skärm 
          döljer kortuppgifter. DTMF-tonbaserad betalning möjliggör korttransaktioner utan 
          att handläggaren ser uppgifterna.
        </p>

        <h2>Åtkomststyrning och auditlogg</h2>
        <p>
          Rollbaserad åtkomst styr vem som kan lyssna på inspelningar, exportera data 
          och ändra konfiguration.
        </p>
        <p>
          Komplett auditlogg dokumenterar alla åtkomster för regulatorisk rapportering 
          och intern revision.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>ISO 27001-certifierad infrastruktur</li>
          <li>Data Residency-val per region</li>
          <li>Automatisk PII-redaktion i transkript</li>
          <li>eDiscovery-stöd för juridiska förfrågningar</li>
        </ul>
      </>
    ),
  },
  {
    slug: "conversational-intelligence-och-insikter",
    title: "Conversational Intelligence och insikter",
    description: "Förvandla samtalsdata till strategisk affärsintelligens med AI-analys.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – Conversational Intelligence",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Tusentals kundsamtal innehåller ovärderlig information om produktproblem, konkurrenter, 
            kundsentiment och marknadsinsikter. Contact Centers Conversation Intelligence omvandlar 
            denna rådata till handlingsbara insikter för hela organisationen.
          </em>
        </p>

        <h2>Ämnesidentifiering och trendanalys</h2>
        <p>
          NLP-modeller analyserar transkriberade samtal och identifierar återkommande ämnen, 
          produktnämnanden, konkurrentnämnanden och kundklagomål.
        </p>
        <p>
          Resultaten aggregeras och visualiseras per vecka, månad och kvartal — 
          så att trender blir tydliga.
        </p>

        <h2>Sentimentkartläggning per ämne</h2>
        <p>
          Sentimentet kopplas till specifika ämnen: kunder är nöjda med leveranshastigheten 
          men missnöjda med monteringsinstruktionerna. Specificitet är nyckeln till handlingsbarhet.
        </p>

        <h2>Insiktsdelning till produktutveckling och marknad</h2>
        <p>
          Automatiserade insiktsrapporter skickas till produktteamet, marknadsavdelningen 
          och kundservicechefen — var vecka — baserade på vad kunderna faktiskt säger.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Automatisk FAQ-identifiering från samtalsdata</li>
          <li>Konkurrentnämnande-tracker</li>
          <li>Säsongsanalys av ärendetrender</li>
          <li>Integration med Power BI för självbetjäningsanalys</li>
        </ul>
      </>
    ),
  },
  {
    slug: "contact-center-integration-med-dynamics-365",
    title: "Contact Center-integration med Dynamics 365",
    description: "Komplett CRM-kontext i varje kundinteraktion med djup Dynamics 365-integration.",
    product: "Dynamics 365 Contact Center",
    productSlug: "d365-contact-center",
    parentPath: "/d365-contact-center/",
    parentLabel: "Dynamics 365 Contact Center",
    headerLabel: "CC – CRM-integration",
    image: ContactCenterIcon,
    content: (
      <>
        <p>
          <em>
            Ett contact center isolerat från CRM-systemet ger handläggare halvt blinda. 
            Contact Centers djupa integration med Dynamics 365 Sales, Customer Service och 
            Customer Insights ger handläggaren fullständig kundkontext — automatiskt och i realtid.
          </em>
        </p>

        <h2>Screen-pop och automatisk kontextladdning</h2>
        <p>
          När ett inkommande samtal identifieras via ANI (Automatic Number Identification) 
          laddas automatiskt kundens fullständiga CRM-profil, ärendehistorik, aktiva 
          affärsmöjligheter och senaste köp i handläggarens arbetsyta.
        </p>
        <p>
          Allt sker innan handläggaren ens svarar — så att de kan hälsa kunden vid namn 
          och vara redo med rätt kontext.
        </p>

        <h2>Integration med Customer Insights</h2>
        <p>
          Handläggaren ser kundens CLV-score, churn-risk, segmentstillhörighet och AI-genererade 
          Next Best Action direkt i arbetsytan. Detta möjliggör proaktiva retentionssamtal 
          och upsell-möjligheter.
        </p>

        <h2>Ärendecreation och CRM-uppdatering</h2>
        <p>
          Ärenden skapas, uppdateras och stängs direkt i CRM-systemet utan att lämna 
          contact center-arbetsytan. Alla interaktioner loggas automatiskt mot rätt kund och ärende.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Koppling till Sales för lead-skapande vid intressesignaler</li>
          <li>Integration med Field Service för tekniker-dispatch</li>
          <li>Real-time customer profile API</li>
          <li>Power Automate för automatiserade eftersamtals-flöden</li>
        </ul>
      </>
    ),
  },
];
