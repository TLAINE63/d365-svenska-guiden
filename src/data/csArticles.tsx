import type { DeepDiveArticle } from "./bcArticles";
import cs01 from "@/assets/articles/cs-01-omnikanal.png";
import cs02 from "@/assets/articles/cs-02-ai-copilot.png";
import cs03 from "@/assets/articles/cs-03-kunskapsbas.png";
import cs04 from "@/assets/articles/cs-04-sla.png";
import cs05 from "@/assets/articles/cs-05-sjalvservice.png";
import cs06 from "@/assets/articles/cs-06-workforce.png";
import cs07 from "@/assets/articles/cs-07-voc.png";
import cs08 from "@/assets/articles/cs-08-analytics.png";
import cs09 from "@/assets/articles/cs-09-iot.png";
import cs10 from "@/assets/articles/cs-10-qa.png";

export const CS_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "omnikalanarenden-i-en-inkorg",
    title: "Omnikanalärenden i en inkorg",
    description: "Telefon, chatt, e-post och sociala medier samlade på ett ställe.",
    product: "Dynamics 365 Customer Service",
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Omnikanal",
    image: cs01,
    content: (
      <>
        <p>
          <em>
            Kundtjänstmedarbetare tappar värdefull tid när de hoppar mellan system för olika kanaler. 
            Dynamics 365 Customer Service samlar alla kanaler i en enda arbetsyta — med fullständig 
            kontexthistorik oavsett var kunden senast kontaktade.
          </em>
        </p>

        <h2>Unified Routing och intelligent köhantering</h2>
        <p>
          Ärenden från alla kanaler — telefon, chatt, e-post, WhatsApp, Facebook Messenger — dirigeras 
          automatiskt till rätt handläggare baserat på kompetens, arbetsbelastning och ärendets art.
        </p>
        <p>
          Intelligent routing minskar feldirigering med upp till 80 %, vilket innebär att kunden 
          slipper bli vidarekopplad och handläggaren slipper ärenden utanför sin kompetens.
        </p>

        <h2>Agentens arbetsyta (Unified Agent Desktop)</h2>
        <p>
          En enda skärm visar kundprofilen, ärendehistoriken, kunskapsbasen och AI-förslag simultant. 
          Handläggaren behöver aldrig växla system för att lösa ett ärende.
        </p>
        <p>
          Arbetsytan är fullt anpassningsbar — varje team kan konfigurera vilka paneler och 
          datakällor som visas baserat på deras specifika arbetsflöde.
        </p>

        <h2>Kanalspecifika kapaciteter</h2>
        <p>
          Varje kanal har optimerade arbetsflöden: chatt med snabbsvar-mallar, telefon med CTI 
          (Computer-Integrated Telephony) och e-post med AI-genererade svarsutkast.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Copilot & AI",
    image: cs02,
    content: (
      <>
        <p>
          <em>
            Copilot i Dynamics 365 Customer Service är handläggarens AI-assistent som i realtid 
            analyserar kundens fråga, söker i kunskapsbasen och föreslår svarsutkast — så handläggaren 
            kan fokusera på relationen, inte informationssökningen.
          </em>
        </p>

        <h2>Copilot och generativa svarsutkast</h2>
        <p>
          Copilot analyserar kundfrågans kontext och historik, söker automatiskt i kunskapsbasen 
          och genererar ett svarsutkast som handläggaren kan redigera och skicka med ett klick.
        </p>
        <p>
          Utkastet är baserat på faktainformation från kunskapsbasen, inte hallucination — 
          vilket ger hög tillförlitlighet och konsekvent kvalitet i svaren.
        </p>

        <h2>Realtids-transkription och ärendesammanfattning</h2>
        <p>
          Under röstsamtal transkriberas konversationen i realtid med AI-driven sammanfattning 
          som visas i handläggarens arbetsyta.
        </p>
        <p>
          Vid ärendeöverföring läser mottagaren den kompakta sammanfattningen istället för 
          hela historiken — vilket sparar tid och minskar risken att viktig information missas.
        </p>

        <h2>Sentimentanalys och eskaleringsstöd</h2>
        <p>
          AI mäter kundens sentimentutveckling under samtalet och varnar handläggaren vid 
          negativ trend. Automatisk eskalering till senior handläggare eller chef triggas 
          vid kritiska situationer.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Kunskapsbas",
    image: cs03,
    content: (
      <>
        <p>
          <em>
            En välskött kunskapsbas är den effektivaste investeringen i kundservice — rätt svar 
            på rätt ställe minskar ärendevolymen med upp till 40 %. Customer Service Knowledge Management 
            integrerar skapande, godkännande och leverans i ett flöde.
          </em>
        </p>

        <h2>AI-assisterat innehållsskapande</h2>
        <p>
          Copilot analyserar lösta ärenden och identifierar kunskapsluckor — kategorier där 
          handläggare ofta löser liknande problem utan att det finns en artikel.
        </p>
        <p>
          AI genererar ett utkast till kunskapsartikel baserat på ärendehistoriken, som 
          sedan granskas och publiceras av teamet.
        </p>

        <h2>Godkännandeflöde och versionshantering</h2>
        <p>
          Kunskapsartiklar genomgår ett definierat granskningsflöde innan publicering. 
          Versionering säkerställer att gamla svar inte visas efter produktuppdateringar.
        </p>

        <h2>Omnikanal-leverans</h2>
        <p>
          Samma kunskapsbas driver handläggarens sökning, kundportalen och Copilot-chatboten 
          — en källa till sanning för hela organisationen.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – SLA-styrning",
    image: cs04,
    content: (
      <>
        <p>
          <em>
            Brutna SLA-löften skadar kundrelationer och kan ha kontraktuella konsekvenser. 
            Customer Service SLA-motorn säkerställer att varje ärende hanteras inom avtalad tid 
            — med automatiska eskaleringar innan det är för sent.
          </em>
        </p>

        <h2>SLA-definition och prioritering</h2>
        <p>
          SLA-regler definieras per ärendekategori, kundnivå och prioritet. En premium-kunds 
          kritiska ärende har en annan SLA än ett standardärende.
        </p>
        <p>
          Systemet hanterar detta automatiskt baserat på kundprofilen — ingen manuell 
          bedömning av prioritet behövs vid ärendeskapning.
        </p>

        <h2>Automatisk eskalering och varningsflöden</h2>
        <p>
          När ett ärende riskerar att bryta SLA skickas automatisk varning till handläggaren, 
          sedan till teamledaren och slutligen till chefen — med fördefinierade tidsintervall.
        </p>
        <p>
          Varje eskalering dokumenteras i ärendet, vilket ger full spårbarhet för 
          kvalitetsuppföljning och processförbättring.
        </p>

        <h2>SLA-rapportering och kontinuerlig förbättring</h2>
        <p>
          Realtidsrapporter visar SLA-uppfyllnad per kanal, team, handläggare och ärendekategori. 
          Trender identifieras för kapacitetsplanering och resursallokering.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Självservice & Chatbot",
    image: cs05,
    content: (
      <>
        <p>
          <em>
            Kunder föredrar att lösa problem själva om det går snabbt och enkelt. Customer Service 
            självserviceportal och AI-chatbot ger kunder tillgång till rätt information och handlingar 
            dygnet runt — och minskar behovet av mänsklig handläggning markant.
          </em>
        </p>

        <h2>Power Pages kundportal</h2>
        <p>
          Kundportalen ger inloggade kunder tillgång till sin ärendehistorik, statusuppdateringar, 
          fakturavisning och möjlighet att skicka in nya ärenden.
        </p>
        <p>
          Portalen är fullt anpassningsbar utan kod via Power Pages, vilket gör det enkelt 
          att matcha företagets visuella profil och erbjuda relevanta tjänster.
        </p>

        <h2>Copilot-chatbot med generativ AI</h2>
        <p>
          Chatboten drivs av Copilot Studio och använder generativ AI för att svara på komplexa 
          frågor baserade på kunskapsbasen — inte bara enkel FAQ-matchning.
        </p>
        <p>
          Omskolning krävs inte vid produktuppdateringar — chatboten lär sig automatiskt 
          från uppdaterade kunskapsartiklar.
        </p>

        <h2>Eskalering och smidig övergång till handläggare</h2>
        <p>
          När chatboten inte kan lösa ärendet överförs samtalet sömlöst till en mänsklig 
          handläggare — med hela konversationshistoriken medföljande.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Workforce Management",
    image: cs06,
    content: (
      <>
        <p>
          <em>
            Underbemannade perioder skapar missnöjda kunder; överbemannade perioder skapar onödiga kostnader. 
            Customer Service Workforce Management förutser ärendevolymer och optimerar bemanningen för att 
            maximera kundnöjdhet till lägsta kostnad.
          </em>
        </p>

        <h2>AI-baserad volymprognos</h2>
        <p>
          Systemet analyserar historiska ärendemönster, säsongseffekter, kampanjkalendrar och externa 
          faktorer för att förutse ärendevolymer per kanal och timme.
        </p>
        <p>
          Noggrannheten överstiger 90 % för tvåveckorsprognoser, vilket ger god framförhållning 
          för schemaplanering.
        </p>

        <h2>Automatisk schemaläggning</h2>
        <p>
          Baserat på volymprognos och kompetenskrav genereras optimerade scheman automatiskt 
          med hänsyn till arbetstidsregler, semestrar och kompetensnivåer.
        </p>
        <p>
          Handläggare ser sina scheman i mobilappen och kan enkelt hantera byten 
          och önskemål direkt.
        </p>

        <h2>Realtidsövervakning och intradag-justering</h2>
        <p>
          Under dagen jämförs faktisk ärendevolym mot prognos. Vid avvikelse kan scheman 
          justeras i realtid — pauser omplaneras, övertid aktiveras eller trafik omdirigeras 
          till andra kanaler.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Voice of Customer",
    image: cs07,
    content: (
      <>
        <p>
          <em>
            CSAT-poäng är ett genomsnitt som döljer mer än det avslöjar. Customer Service 
            VoC-verktyg fångar feedback vid varje kontaktpunkt, analyserar öppen text med AI 
            och identifierar systematiska förbättringsområden.
          </em>
        </p>

        <h2>Omnikanalsurveys och NPS</h2>
        <p>
          Automatiska enkäter skickas efter avslutade ärenden via rätt kanal: SMS efter 
          telefonsamtal, e-post efter e-postärende, in-app efter chattsession.
        </p>
        <p>
          Svarsfrekvensen optimeras med timing-algoritmer som identifierar bästa tidpunkt 
          och kanal för varje enskild kund.
        </p>

        <h2>AI-analys av öppen text</h2>
        <p>
          Fritextkommentarer analyseras med NLP för att identifiera teman, känslor och 
          produktnämnanden. Systemet kategoriserar automatiskt feedback i 
          Positive/Neutral/Negative per ämnesområde.
        </p>

        <h2>Closed-loop feedback och förbättringscykler</h2>
        <p>
          Kunder med låg NPS-poäng kontaktas automatiskt av en senior handläggare 
          inom 24 timmar för att adressera missnöjet proaktivt.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Analytics & BI",
    image: cs08,
    content: (
      <>
        <p>
          <em>
            Kundservicechefer behöver snabba, tillförlitliga insikter för att fatta rätt beslut 
            om bemanning, utbildning och processförbättringar. Customer Service Analytics levererar 
            realtidsdashboards och historisk analys i ett integrerat verktyg.
          </em>
        </p>

        <h2>Operativa realtidsdashboards</h2>
        <p>
          Supervisorer ser ärendeköer, handläggarstatus, SLA-tickar och kundväntetider i realtid. 
          Trafikljusindikatorer highlightar områden som kräver omedelbar uppmärksamhet.
        </p>

        <h2>Historisk analys och trendidentifiering</h2>
        <p>
          Djupanalys av ärendetyper, lösningstider, kanalpreferenser och handläggarproduktivitet 
          över tid. Trender identifieras för kapacitetsplanering och utbildningsinsatser.
        </p>
        <p>
          Med historisk data kan chefer förutse säsongsbetonade toppar och förbereda 
          bemanningen i förväg.
        </p>

        <h2>Benchmarking och prestandamål</h2>
        <p>
          Prestandamål (KPI) sätts per team och individ. Handläggare ser sin egen scorecard 
          med mål och historisk trend — vilket skapar transparens och motivation.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – IoT & Proaktiv service",
    image: cs09,
    content: (
      <>
        <p>
          <em>
            Den bästa kundservicen är den kunden aldrig behöver kontakta. Genom IoT-integration 
            kan Customer Service detektera problem i anslutna produkter och initiera serviceärenden 
            automatiskt — innan kunden ens märkt av problemet.
          </em>
        </p>

        <h2>IoT-signaler och automatisk ärendeskapning</h2>
        <p>
          Anslutna enheter — produkter, maskiner, fordon — sänder telemetridata till Azure IoT Hub. 
          Avvikande mätvärden triggar automatiskt ett serviceärende i Customer Service med 
          diagnostikinformation bifogad.
        </p>

        <h2>Prediktivt underhåll</h2>
        <p>
          Maskininlärningsmodeller analyserar telemetrimönster och förutser komponentfel 
          dagar eller veckor i förväg.
        </p>
        <p>
          Servicebesök kan planeras under kundbekväma tider istället för i krisläge 
          — vilket ökar kundnöjdheten och minskar akutkostnader.
        </p>

        <h2>Fältservice-integration</h2>
        <p>
          IoT-ärenden kopplas direkt till Field Service för automatisk tekniker-dispatching 
          och reservdelsleverans.
        </p>

        <h3>Viktiga funktioner</h3>
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
    productSlug: "d365customerservice",
    parentPath: "/d365customerservice/",
    parentLabel: "Dynamics 365 Customer Service",
    headerLabel: "CS – Kvalitet & Coaching",
    image: cs10,
    content: (
      <>
        <p>
          <em>
            Konsekvent servicekvalitet är avgörande för kundförtroende. Customer Service 
            Quality Management ger supervisorer verktyg för strukturerad granskning, objektiv 
            coaching och kontinuerlig kompetensutveckling.
          </em>
        </p>

        <h2>AI-driven kvalitetspoängsättning</h2>
        <p>
          AI granskar 100 % av ärenden mot definierade kvalitetskriterier: ton, lösningsnoggrannhet, 
          procedurföljning och empati.
        </p>
        <p>
          Endast avvikande ärenden flaggas för manuell granskning av supervisorn — vilket 
          sparar tid och säkerställer att inget viktigt missas.
        </p>

        <h2>Strukturerade coachningssessioner</h2>
        <p>
          Supervisorer bokar coachningssessioner direkt i systemet med fördefinierad agenda 
          baserad på AI-identifierade förbättringsområden för handläggaren.
        </p>
        <p>
          Coachningshistorik dokumenteras och kopplas till kvalitetstrender, 
          så att effekten av varje insats kan mätas.
        </p>

        <h2>Utbildnings- och certifieringsspårning</h2>
        <p>
          Koppling till LMS-systemet möjliggör spårning av slutförda utbildningar, 
          certifieringsstatus och deras påverkan på kvalitetspoäng.
        </p>

        <h3>Viktiga funktioner</h3>
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
