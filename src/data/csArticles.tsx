import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import type { DeepDiveArticle } from "./bcArticles";

export const CS_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "omnikalanarenden-i-en-inkorg",
    title: "Omnikanalärenden i en inkorg",
    description: "Telefon, chatt, e-post och sociala medier samlade på ett ställe.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Omnikanal",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Kundtjänstmedarbetare tappar värdefull tid när de hoppar mellan system för olika kanaler. Dynamics 365 Customer Service samlar alla kanaler i en enda arbetsyta — med fullständig kontexthistorik oavsett var kunden senast kontaktade.</em>
        </p>

        <h2>Unified Routing och intelligent köhantering</h2>
        <p>
          Ärenden från alla kanaler — telefon, chatt, e-post, WhatsApp, Facebook Messenger — dirigeras automatiskt till rätt handläggare baserat på kompetens, arbetsbelastning och ärendets art. Intelligent routing minskar feldirigering med upp till 80 %.
        </p>

        <h2>Agentens arbetsyta (Unified Agent Desktop)</h2>
        <p>
          En enda skärm visar kundprofilen, ärendehistoriken, kunskapsbasen och AI-förslag simultant. Handläggaren behöver aldrig växla system för att lösa ett ärende.
        </p>

        <h2>Kanalspecifika kapaciteter</h2>
        <p>
          Varje kanal har optimerade arbetsflöden: chatt med snabbsvar-mallar, telefon med CTI (Computer-Integrated Telephony) och e-post med AI-genererade svarsutkast.
        </p>
        <ul>
          <li>Inbyggd röstsamtals-integration (Azure Communication Services)</li>
          <li>WhatsApp Business API-koppling</li>
          <li>Social Listening-integration</li>
          <li>Sentimentanalys i realtid under samtal</li>
        </ul>
      </>
    ),
  },
  {
    slug: "ai-assistans-och-copilot-for-handlaggare",
    title: "AI-assistans och Copilot för handläggare",
    description: "Generativ AI som förkortar lösningstiden med hälften.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Copilot & AI",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Copilot i Dynamics 365 Customer Service är handläggarens AI-assistent som i realtid analyserar kundens fråga, söker i kunskapsbasen och föreslår svarsutkast — så handläggaren kan fokusera på relationen, inte informationssökningen.</em>
        </p>

        <h2>Copilot och generativa svarsutkast</h2>
        <p>
          Copilot analyserar kundfrågans kontext och historik, söker automatiskt i kunskapsbasen och genererar ett svarsutkast som handläggaren kan redigera och skicka med ett klick. Utkastet är baserat på faktainformation, inte hallucination.
        </p>

        <h2>Realtids-transkription och ärendesammanfattning</h2>
        <p>
          Under röstsamtal transkriberas konversationen i realtid med AI-driven sammanfattning som visas i handläggarens arbetsyta. Vid ärendeöverföring läser mottagaren sammanfattningen istället för hela historiken.
        </p>

        <h2>Sentimentanalys och eskaleringsstöd</h2>
        <p>
          AI mäter kundens sentimentutveckling under samtalet och varnar handläggaren vid negativ trend. Automatisk eskalering till senior handläggare eller chef triggas vid kritiska situationer.
        </p>
        <ul>
          <li>AI-driven kategorisering och routing av ärenden</li>
          <li>Automatisk ärendesammanfattning för kvalitetsgranskning</li>
          <li>Copilot-stöd för kunskapsskapande</li>
          <li>Proaktivt förslag på lösningsartiklar</li>
        </ul>
      </>
    ),
  },
  {
    slug: "kunskapsbasen-som-driver-sjalvservice",
    title: "Kunskapsbasen som driver självservice",
    description: "Bygg och underhåll en kunskapsbas som minskar ärendevolymen med 40 %.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Kunskapsbas",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>En välskött kunskapsbas är den effektivaste investeringen i kundservice — rätt svar på rätt ställe minskar ärendevolymen med upp till 40 %. Customer Service Knowledge Management integrerar skapande, godkännande och leverans i ett flöde.</em>
        </p>

        <h2>AI-assisterat innehållsskapande</h2>
        <p>
          Copilot analyserar lösta ärenden och identifierar kunskapsluckor — kategorier där handläggare ofta löser liknande problem utan att det finns en artikel. AI genererar ett utkast till kunskapsartikel baserat på ärendehistoriken.
        </p>

        <h2>Godkännandeflöde och versionshantering</h2>
        <p>
          Kunskapsartiklar genomgår ett definierat granskningsflöde innan publicering. Versionering säkerställer att gamla svar inte visas efter produktuppdateringar.
        </p>

        <h2>Omnikanal-leverans</h2>
        <p>
          Samma kunskapsbas driver handläggarens sökning, kundportalen och Copilot-chatboten — en källa till sanning för hela organisationen.
        </p>
        <ul>
          <li>Semantisk sökning med AI (inte bara nyckelord)</li>
          <li>Feedback-loop: handläggare betygsätter artiklarnas hjälpsamhet</li>
          <li>Artikelanvändnings-analytics för kontinuerlig förbättring</li>
          <li>Stöd för multimedia-artiklar (video, GIF)</li>
        </ul>
      </>
    ),
  },
  {
    slug: "arendehantering-och-sla-styrning",
    title: "Ärendehantering och SLA-styrning",
    description: "Träffa servicenivåer konsekvent med automatiserade eskaleringar.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – SLA-styrning",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Brutna SLA-löften skadar kundrelationer och kan ha kontraktuella konsekvenser. Customer Service SLA-motorn säkerställer att varje ärende hanteras inom avtalad tid — med automatiska eskaleringar innan det är för sent.</em>
        </p>

        <h2>SLA-definition och prioritering</h2>
        <p>
          SLA-regler definieras per ärendekategori, kundnivå och prioritet. En premium-kunds kritiska ärende har en annan SLA än ett standardärende — systemet hanterar detta automatiskt baserat på kundprofilen.
        </p>

        <h2>Automatisk eskalering och varningsflöden</h2>
        <p>
          När ett ärende riskerar att bryta SLA skickas automatisk varning till handläggaren, sedan till teamledaren och slutligen till chefen — med fördefinierade tidsintervall. Eskalering dokumenteras i ärendet.
        </p>

        <h2>SLA-rapportering och kontinuerlig förbättring</h2>
        <p>
          Realtidsrapporter visar SLA-uppfyllnad per kanal, team, handläggare och ärendekategori. Trender identifieras för kapacitetsplanering.
        </p>
        <ul>
          <li>Paustid-hantering för ärenden i vänteläge</li>
          <li>OLA (Operational Level Agreement) per team</li>
          <li>Automatisk triage för brådskande ärenden</li>
          <li>Kundfacing SLA-status i kundportalen</li>
        </ul>
      </>
    ),
  },
  {
    slug: "sjalvserviceportalen-och-chatboten",
    title: "Självserviceportalen och chatboten",
    description: "Lös 60 % av ärenden utan mänsklig handläggare — dygnet runt.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Självservice & Chatbot",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Kunder föredrar att lösa problem själva om det går snabbt och enkelt. Customer Service självserviceportal och AI-chatbot ger kunder tillgång till rätt information och handlingar dygnet runt — och minskar behovet av mänsklig handläggning markant.</em>
        </p>

        <h2>Power Pages kundportal</h2>
        <p>
          Kundportalen ger inloggade kunder tillgång till sin ärendehistorik, statusuppdateringar, fakturavisning och möjlighet att skicka in nya ärenden. Portalen är fullt anpassningsbar utan kod via Power Pages.
        </p>

        <h2>Copilot-chatbot med generativ AI</h2>
        <p>
          Chatboten drivs av Copilot Studio och använder generativ AI för att svara på komplexa frågor baserade på kunskapsbasen — inte bara enkel FAQ-matchning. Omskolning krävs inte vid produktuppdateringar.
        </p>

        <h2>Eskalering och smidig övergång till handläggare</h2>
        <p>
          När chatboten inte kan lösa ärendet överförs samtalet sömlöst till en mänsklig handläggare — med hela konversationshistoriken medföljande.
        </p>
        <ul>
          <li>Autentisering via Microsoft-konto eller e-post</li>
          <li>Ärendestatus-spårning i realtid</li>
          <li>Proaktiva notifikationer vid ärendeuppdateringar</li>
          <li>Mobiloptimerat gränssnitt</li>
        </ul>
      </>
    ),
  },
  {
    slug: "workforce-management-och-schemalagning",
    title: "Workforce Management och schemaläggning",
    description: "Rätt antal handläggare på rätt kanal vid rätt tidpunkt med AI-volymprognos.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Workforce Management",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Underbemannade perioder skapar missnöjda kunder; överbemannade perioder skapar onödiga kostnader. Customer Service Workforce Management förutser ärendevolymer och optimerar bemanningen för att maximera kundnöjdhet till lägsta kostnad.</em>
        </p>

        <h2>AI-baserad volymprognos</h2>
        <p>
          Systemet analyserar historiska ärendemönster, säsongseffekter, kampanjkalendrar och externa faktorer för att förutse ärendevolymer per kanal och timme. Noggrannheten överstiger 90 % för tvåveckorsprognoser.
        </p>

        <h2>Automatisk schemaläggning</h2>
        <p>
          Baserat på volymprognos och kompetenskrav genereras optimerade scheman automatiskt med hänsyn till arbetstidsregler, semestrar och kompetensnivåer. Handläggare ser sina scheman i mobilappen.
        </p>

        <h2>Realtidsövervakning och intradag-justering</h2>
        <p>
          Under dagen jämförs faktisk ärendevolym mot prognos. Vid avvikelse kan scheman justeras i realtid — pauser omplaneras, övertid aktiveras eller trafik omdirigeras till andra kanaler.
        </p>
        <ul>
          <li>Kompetensbaserad schemaoptimering</li>
          <li>Byte-funktion för handläggare</li>
          <li>Adhoc-rapportering per dygn och vecka</li>
          <li>Integration med HR-systemet för frånvarohantering</li>
        </ul>
      </>
    ),
  },
  {
    slug: "kundnojdhetsmatning-och-voice-of-customer",
    title: "Kundnöjdhetsmätning och Voice of Customer",
    description: "Förstå kundupplevelsen på djupet med strukturerad feedback och AI-analys.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Voice of Customer",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>CSAT-poäng är ett genomsnitt som döljer mer än det avslöjar. Customer Service VoC-verktyg fångar feedback vid varje kontaktpunkt, analyserar öppen text med AI och identifierar systematiska förbättringsområden.</em>
        </p>

        <h2>Omnikanalsurveys och NPS</h2>
        <p>
          Automatiska enkäter skickas efter avslutade ärenden via rätt kanal: SMS efter telefonsamtal, e-post efter e-postärende, in-app efter chattsession. Svarsfrekvensen optimeras med timing-algoritmer.
        </p>

        <h2>AI-analys av öppen text</h2>
        <p>
          Fritextkommentarer analyseras med NLP för att identifiera teman, känslor och produktnämnanden. Systemet kategoriserar automatiskt feedback i Positive/Neutral/Negative per ämnesområde.
        </p>

        <h2>Closed-loop feedback och förbättringscykler</h2>
        <p>
          Kunder med låg NPS-poäng kontaktas automatiskt av en senior handläggare inom 24 timmar för att adressera missnöjet proaktivt.
        </p>
        <ul>
          <li>Realtids-dashboard för CSAT per handläggare och team</li>
          <li>Trendanalys av återkommande klagomål</li>
          <li>Integration med Customer Insights för kundprofilkoppling</li>
          <li>Benchmarking mot branschstandarder</li>
        </ul>
      </>
    ),
  },
  {
    slug: "arendeanalytics-och-produktivitetsinsikter",
    title: "Ärende-analytics och produktivitetsinsikter",
    description: "Data-driven kundservice med inbyggd Power BI och realtidsdashboards.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Analytics & BI",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Kundservicechefer behöver snabba, tillförlitliga insikter för att fatta rätt beslut om bemanning, utbildning och processförbättringar. Customer Service Analytics levererar realtidsdashboards och historisk analys i ett integrerat verktyg.</em>
        </p>

        <h2>Operativa realtidsdashboards</h2>
        <p>
          Supervisorer ser ärendeköer, handläggarstatus, SLA-tickar och kundväntetider i realtid. Trafikljusindikatorer highlightar områden som kräver omedelbar uppmärksamhet.
        </p>

        <h2>Historisk analys och trendidentifiering</h2>
        <p>
          Djupanalys av ärendetyper, lösningstider, kanalpreferenser och handläggarproduktivitet över tid. Trender identifieras för kapacitetsplanering och utbildningsinsatser.
        </p>

        <h2>Benchmarking och prestandamål</h2>
        <p>
          Prestandamål (KPI) sätts per team och individ. Handläggare ser sin egen scorecard med mål och historisk trend.
        </p>
        <ul>
          <li>First Contact Resolution (FCR) per kanal</li>
          <li>Average Handle Time (AHT) per ärendekategori</li>
          <li>Backlog-analys och aging-rapport</li>
          <li>Exportfunktion till Power BI och Excel</li>
        </ul>
      </>
    ),
  },
  {
    slug: "proaktiv-kundservice-med-iot",
    title: "Proaktiv kundservice med IoT",
    description: "Lös problem innan kunden märker dem med IoT-integration och prediktivt underhåll.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – IoT & Proaktiv service",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Den bästa kundservicen är den kunden aldrig behöver kontakta. Genom IoT-integration kan Customer Service detektera problem i anslutna produkter och initiera serviceärenden automatiskt — innan kunden ens märkt av problemet.</em>
        </p>

        <h2>IoT-signaler och automatisk ärendeskapning</h2>
        <p>
          Anslutna enheter — produkter, maskiner, fordon — sänder telemetridata till Azure IoT Hub. Avvikande mätvärden triggar automatiskt ett serviceärende i Customer Service med diagnostikinformation bifogad.
        </p>

        <h2>Prediktivt underhåll</h2>
        <p>
          Maskininlärningsmodeller analyserar telemetrimönster och förutser komponentfel dagar eller veckor i förväg. Servicebesök kan planeras under kundbekväma tider istället för i krisläge.
        </p>

        <h2>Fältservice-integration</h2>
        <p>
          IoT-ärenden kopplas direkt till Field Service för automatisk tekniker-dispatching och reservdelsleverans.
        </p>
        <ul>
          <li>Remote diagnostik och fjärrstyrning</li>
          <li>Automatisk garantistatus-kontroll</li>
          <li>Kundnotifikation vid proaktivt servicebesök</li>
          <li>Integration med Connected Field Service</li>
        </ul>
      </>
    ),
  },
  {
    slug: "kvalitetssakring-och-handlaggarcoaching",
    title: "Kvalitetssäkring och handläggarcoaching",
    description: "Systematisk kvalitetsgranskning med AI-stöd och strukturerad coaching.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365-customer-service",
    parentPath: "/d365-customer-service/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "Fördjupning – Kvalitet & Coaching",
    image: CustomerServiceIcon,
    content: (
      <>
        <p>
          <em>Konsekvent servicekvalitet är avgörande för kundförtroende. Customer Service Quality Management ger supervisorer verktyg för strukturerad granskning, objektiv coaching och kontinuerlig kompetensutveckling.</em>
        </p>

        <h2>AI-driven kvalitetspoängsättning</h2>
        <p>
          AI granskar 100 % av ärenden mot definierade kvalitetskriterier: ton, lösningsnoggrannhet, procedurföljning och empati. Endast avvikande ärenden flaggas för manuell granskning av supervisorn.
        </p>

        <h2>Strukturerade coachningssessioner</h2>
        <p>
          Supervisorer bokar coachningssessioner direkt i systemet med fördefinierad agenda baserad på AI-identifierade förbättringsområden för handläggaren. Coachningshistorik dokumenteras.
        </p>

        <h2>Utbildnings- och certifieringsspårning</h2>
        <p>
          Koppling till LMS-systemet möjliggör spårning av slutförda utbildningar, certifieringsstatus och deras påverkan på kvalitetspoäng.
        </p>
        <ul>
          <li>Kalibreringssessioner för konsekvent bedömning</li>
          <li>Automatisk feedback till handläggaren efter granskning</li>
          <li>Trendanalys av kvalitetspoäng per team</li>
          <li>Benchmarking mot branschstandarder</li>
        </ul>
      </>
    ),
  },
];
