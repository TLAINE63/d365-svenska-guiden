import type { DeepDiveArticle } from "./bcArticles";

import copilot01 from "@/assets/articles/copilot-01-vad-ar.png";
import copilot02 from "@/assets/articles/copilot-02-sales.png";
import copilot03 from "@/assets/articles/copilot-03-cs.png";
import copilot04 from "@/assets/articles/copilot-04-finance.png";
import copilot05 from "@/assets/articles/copilot-05-scm.png";
import copilot06 from "@/assets/articles/copilot-06-field-service.png";
import copilot07 from "@/assets/articles/copilot-07-ci.png";
import copilot08 from "@/assets/articles/copilot-08-hr.png";
import copilot09 from "@/assets/articles/copilot-09-po.png";
import copilot10 from "@/assets/articles/copilot-10-adoption.png";

export const COPILOT_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "vad-ar-copilot-i-dynamics-365",
    title: "Vad är Copilot i Dynamics 365?",
    description: "Generativ AI inbyggd i varje affärsapplikation — arkitektur, datasäkerhet och naturspråk som gränssnitt.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Vad är Copilot?",
    image: copilot01,
    content: (
      <>
        <p>
          <em>Microsoft Copilot i Dynamics 365 är inte ett separat verktyg — det är generativ AI inbyggd direkt i gränssnittet för Finance, Sales, Customer Service, Field Service och alla andra moduler. Copilot förstår kontexten av det du arbetar med och erbjuder intelligenta förslag, sammanfattningar och automatiserade åtgärder.</em>
        </p>

        <h2>Copilots arkitektur i Dynamics 365</h2>
        <p>
          Copilot i Dynamics 365 är byggt på Azure OpenAI Service med GPT-4o som underliggande modell. Det som gör det unikt är kopplingen till Dataverse — Copilot har direkt åtkomst till organisationens data och kan svara på frågor, sammanfatta information och vidta åtgärder baserade på faktisk affärsdata, inte generisk träningsdata.
        </p>

        <h2>Responsible AI och datasäkerhet</h2>
        <p>
          Copilot i Dynamics 365 respekterar exakt samma behörighetsstruktur som användaren — en säljare som inte har tillgång till ett kundkonto kan inte heller fråga Copilot om det kontot. Data skickas aldrig till OpenAI för träning. Organisationens data förblir i EU-regionen (för EU-kunder) och Microsoft använder aldrig kunddata för att träna globala modeller.
        </p>

        <h2>Naturspråk som gränssnitt</h2>
        <p>
          Copilot gör det möjligt att interagera med Dynamics 365 via naturspråk. Istället för att navigera i menyer och fylla i filter kan användare ställa frågor som "Visa mig alla affärer med mer än 1 miljon i pipeline som inte har haft aktivitet de senaste 14 dagarna" — och få svaret omedelbart som ett filtrerat resultat.
        </p>

        <ul>
          <li>Rollbaserad åtkomstkontroll (RBAC) respekteras fullt ut</li>
          <li>Ingen dataanvändning för modellträning</li>
          <li>EU Data Boundary för europiska kunder</li>
          <li>Komplett auditlogg av Copilot-interaktioner</li>
          <li>Administratörskontroller för aktivering per roll och modul</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-sales",
    title: "Copilot i Dynamics 365 Sales",
    description: "AI-assistans som förkortar säljcykeln med mötesförberedelse, uppföljningsmejl och pipeline-analys.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i Sales",
    image: copilot02,
    content: (
      <>
        <p>
          <em>Copilot i Sales ger säljare en intelligent assistent som sammanfattar kundmöten, skriver uppföljningsmejl, analyserar affärsmöjligheters hälsa och förbereder kundmöten med aktuell information — i realtid, direkt i CRM-flödet.</em>
        </p>

        <h2>Mötesförberedelse på sekunder</h2>
        <p>
          Inför ett kundmöte sammanfattar Copilot automatiskt: senaste interaktioner, öppna ärenden, pipelinestatus, kontaktens LinkedIn-profil och nyheter om kundens bolag — allt presenterat i en kompakt briefing direkt i Teams-mötesinbjudan. Säljaren är alltid förberedd, oavsett hur länge sedan senaste kundkontakten var.
        </p>

        <h2>Uppföljningsmejl och kommunikationsassistans</h2>
        <p>
          Efter ett möte genererar Copilot ett uppföljningsmejl baserat på mötets agenda, diskuterade punkter och åtaganden som registrerats i Conversation Intelligence. Säljaren justerar tonen och skickar — processen tar minuter istället för en halvtimme.
        </p>

        <h2>Pipeline-analys och riskidentifiering</h2>
        <p>
          Copilot analyserar hela säljarens pipeline och identifierar affärer med hög risk: ingen aktivitet de senaste 14 dagarna, stagnat stadium, kontrakt nära utgångsdatum eller konkurrentnämnande i kommunikation. Säljaren ser en prioriterad actionlista varje morgon — inte ett statiskt CRM-flöde.
        </p>

        <ul>
          <li>AI-genererade sammanfattningar av e-postkonversationer</li>
          <li>Förslag på nästa bästa åtgärd per affärsmöjlighet</li>
          <li>Automatisk CRM-uppdatering efter möten</li>
          <li>Win/loss-förklaringar baserade på liknande historiska affärer</li>
          <li>Personaliserade kundinsikter från Customer Insights</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-customer-service",
    title: "Copilot i Dynamics 365 Customer Service",
    description: "Generativ AI som halverar handläggningstiden med realtidsassistans och svarsutkast.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i Customer Service",
    image: copilot03,
    content: (
      <>
        <p>
          <em>Handläggare spenderar mer tid på att söka information och formulera svar än på faktisk kundinteraktion. Copilot i Customer Service tar över informationssökningen och genererar svarsutkast i realtid — handläggaren kan fokusera helt på kunden.</em>
        </p>

        <h2>Realtids-ärendeassistans</h2>
        <p>
          Under pågående interaktion analyserar Copilot kontinuerligt konversationens kontext och söker proaktivt i kunskapsbasen. Relevanta artiklar visas i sidopanelen utan att handläggaren behöver söka manuellt — rätt information vid rätt tidpunkt, varje gång.
        </p>

        <h2>Generativa svarsutkast</h2>
        <p>
          För chatt- och e-postärenden genererar Copilot ett komplett svarsutkast baserat på kundens fråga, ärendehistoriken och kunskapsbasen. Utkastet är faktabaserat och tonaliserat för varumärket — handläggaren granskar, personaliserar och skickar.
        </p>

        <h2>Ärendesammanfattning och dokumentation</h2>
        <p>
          Vid ärendestängning genererar Copilot automatiskt en strukturerad sammanfattning med orsak, vidtagna åtgärder och resolution. Sammanfattningen loggas i CRM och kan användas för kvalitetsgranskning, rapportering och kunskapsbasutveckling.
        </p>

        <ul>
          <li>Svarsutkast på 30+ språk med korrekt ton</li>
          <li>Automatisk ärendesammanfattning vid stängning</li>
          <li>Copilot-assisterad kunskapsartikelgenerering</li>
          <li>Sentiment-analys och eskaleringssignal</li>
          <li>Contextual next-best-action rekommendationer</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-finance",
    title: "Copilot i Dynamics 365 Finance",
    description: "Generativ AI för ekonomiavdelningen — naturspråksfrågor, avvikelseanalys och prognoser.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i Finance",
    image: copilot04,
    content: (
      <>
        <p>
          <em>Ekonomiavdelningens arbete är informationsintensivt: sammanfatta rapporter, analysera avvikelser, förbereda styrelseunderlag och svara på ad hoc-frågor. Copilot i Finance gör ekonomispecialisten snabbare, mer analytisk och mindre beroende av manuell databearbetning.</em>
        </p>

        <h2>Naturspråksfrågor mot finansdata</h2>
        <p>
          Ekonomichefen kan fråga Copilot: "Vad är vår faktiska kostnadsutveckling mot budget för Q3 per affärsenhet, och vilka tre kostnadsställen avviker mest negativt?" — och få ett strukturerat svar med siffror, procentuell avvikelse och en förklarande text på sekunder, utan att öppna ett enda rapport-flöde.
        </p>

        <h2>Automatisk avvikelseanalys och narrativ</h2>
        <p>
          Copilot analyserar periodresultat mot budget och föregående år och genererar automatiskt ett narrativ som förklarar de viktigaste avvikelserna. Ekonomichefen editerar och lägger till bedömningar — månadskommentarerna skrivs på en bråkdel av den normala tiden.
        </p>

        <h2>Finansiell planering och prognoser</h2>
        <p>
          Copilot assisterar i budget- och prognosprocessen: identifierar historiska mönster, föreslår antaganden baserade på aktuella trender och hjälper ekonomiteamet att bygga mer precisa modeller på kortare tid.
        </p>

        <ul>
          <li>Automatisk kassaflödesprognos-uppdatering</li>
          <li>AI-assisterad budgetscenario-analys</li>
          <li>Generering av skatteunderlag och noter</li>
          <li>Förklaring av komplexa kontospecifikationer</li>
          <li>Copilot-assisterad revision av leverantörsfakturor</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-supply-chain",
    title: "Copilot i Dynamics 365 Supply Chain",
    description: "Intelligent assistans för planering, inköp och logistik med AI-driven scenarioanalys.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i Supply Chain",
    image: copilot05,
    content: (
      <>
        <p>
          <em>Supply chain-beslut är komplexa och dataintensiva. Copilot i SCM hjälper planerare, inköpare och logistikansvariga att snabbt förstå situationen, utvärdera alternativ och fatta välgrundade beslut — med AI som analyserar tusentals variabler simultant.</em>
        </p>

        <h2>Intelligent planeringsassistans</h2>
        <p>
          Planeraren kan fråga Copilot: "Vilka artiklar riskerar brist de närmaste 4 veckorna baserat på aktuella order och leveransstatus, och vad är rekommenderad åtgärd per artikel?" — Copilot analyserar plan, prognos, lagerstatus och leverantörsinformation och presenterar en prioriterad åtgärdslista.
        </p>

        <h2>Inköpsassistans och leverantörsutvärdering</h2>
        <p>
          Vid inköpsbeslut sammanfattar Copilot leverantörernas historiska prestanda, jämför offerter, flaggar avvikelser mot ramavtal och rekommenderar bästa leverantör per artikel baserat på definierade kriterier (pris, ledtid, kvalitetshistorik, risk).
        </p>

        <h2>Störningshantering och scenarioanalys</h2>
        <p>
          Vid en supply chain-störning hjälper Copilot att snabbt utvärdera alternativ: "Om leveransen från leverantör X försenas 3 veckor, vilken är den ekonomiska påverkan och vilka alternativa källor finns?" — Copilot presenterar scenario-analysen på minuter.
        </p>

        <ul>
          <li>Automatisk RFQ-sammanfattning och jämförelse</li>
          <li>Kontraktsavvikelse-detektering vid fakturamatchning</li>
          <li>Naturspråksbaserade MRP-förklaringar</li>
          <li>AI-assisterad transportplanering och ruttvärdering</li>
          <li>Copilot-stöd för tulldokumentation och compliance</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-field-service",
    title: "Copilot i Dynamics 365 Field Service",
    description: "AI-assistans för tekniker, dispatchers och servicechefer i fält.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i Field Service",
    image: copilot06,
    content: (
      <>
        <p>
          <em>Fältservice genererar enorma mängder information: servicerapporter, manualer, felsökningsguider och kundhistorik. Copilot i Field Service ger tekniker och dispatchers omedelbar tillgång till rätt information — i rätt ögonblick.</em>
        </p>

        <h2>Teknikerassistans i fält</h2>
        <p>
          Tekniker kan fråga Copilot i mobilappen: "Den här enheten visar felkod E-47, vad betyder det och hur löser jag det?" — Copilot söker i teknisk dokumentation, liknande historiska serviceordrar och tillverkarens servicemanual och presenterar en steg-för-steg-lösning anpassad till den specifika enhetsmodellen och installationshistoriken.
        </p>

        <h2>Dispatcher-assistans och schemaoptimering</h2>
        <p>
          Dispatchers kan be Copilot: "Vilken tekniker ska jag skicka på det nya akuta jobbet i Kista, med hänsyn till kompetens, position och befintliga åtaganden?" — Copilot utvärderar alla relevanta faktorer och presenterar rankade rekommendationer med motivering.
        </p>

        <h2>Servicechef-dashboards och insikter</h2>
        <p>
          Servicechefer kan ställa naturspråksfrågor om driftsprestandan: "Vilka tekniker har lägst first-time fix rate de senaste 90 dagarna, och vad är de vanligaste orsakerna till återbesök?" — Copilot analyserar data och presenterar handlingsbara insikter.
        </p>

        <ul>
          <li>AI-assisterad arbetsorderskapning från kundbeskrivning</li>
          <li>Copilot-stöd för servicerapportskrivning</li>
          <li>Automatisk reservdelsidentifiering från felkodsbeskrivning</li>
          <li>Realtids-ETA-beräkning med trafikintegration</li>
          <li>AI-assisterad garantibedömning</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-customer-insights",
    title: "Copilot i Dynamics 365 Customer Insights",
    description: "Naturspråk som gränssnitt mot kunddata — segmentbyggare, insikter och what-if-analys.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i Customer Insights",
    image: copilot07,
    content: (
      <>
        <p>
          <em>Marknadsteam och analytiker behöver inte längre SQL-kunskaper för att extrahera insikter ur Customer Insights. Copilot gör det möjligt att ställa komplexa analytiska frågor på naturspråk och få omedelbara, visualiserade svar.</em>
        </p>

        <h2>Naturspråksbaserad segmentbyggare</h2>
        <p>
          Istället för att konfigurera komplexa filterregler kan marknadsteamet be Copilot: "Skapa ett segment av kunder i Stockholm som köpt barnskor de senaste 6 månaderna, har ett CLV över 5000 kr och inte svarade på senaste kampanjen." — Copilot bygger segmentet, visar storleken och ger en sammanfattning av segmentets egenskaper.
        </p>

        <h2>Insiktssammanfattningar och rapportgenerering</h2>
        <p>
          Copilot kan sammanfatta komplexa kundanalysrapporter på sekunder: "Sammanfatta de viktigaste insikterna från förra kvartalets kampanjanalys och identifiera de tre segmenten med bäst och sämst ROI." Resultatet presenteras i tydlig prosa med relevanta nyckeltal.
        </p>

        <h2>Prediktiva frågor och what-if-analys</h2>
        <p>
          Marknadschefen kan fråga: "Om vi ökar retentionsbudgeten med 20 % och fokuserar på churn-riskkunderna i Premium-segmentet, vad är den förväntade CLV-påverkan?" — Copilot kör beräkningen baserat på historiska retentionsdata och presenterar scenariot.
        </p>

        <ul>
          <li>Copilot-assisterad journey-designsparrning</li>
          <li>AI-genererad insiktspresentation för ledningsgruppen</li>
          <li>Naturspråksfrågor om churn-riskpopulationen</li>
          <li>Automatisk kampanjprestationsberättelse</li>
          <li>Copilot-stöd för A/B-testanalys</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-human-resources",
    title: "Copilot i Dynamics 365 Human Resources",
    description: "AI-assistans för HR-specialister, chefer och medarbetare — från rekrytering till kompetensanalys.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i HR",
    image: copilot08,
    content: (
      <>
        <p>
          <em>Copilot i HR förvandlar Human Resources från ett administrativt stödsystem till en proaktiv strategisk partner. HR-specialister får AI-assistans i rekrytering, kompetensanalys och people analytics — chefer och medarbetare hanterar HR-ärenden enklare än någonsin.</em>
        </p>

        <h2>Rekryteringsassistans</h2>
        <p>
          Copilot assisterar i hela rekryteringsprocessen: genererar jobbannonsutkast baserade på rollbeskrivning och organisationens ton-of-voice, analyserar CV:n mot kravprofilen och rankar kandidater, och föreslår intervjufrågor baserade på rollen och kandidatens bakgrund.
        </p>

        <h2>Kompetensanalys och successionsplanering</h2>
        <p>
          HR-chefen kan fråga: "Vilka av våra seniormedarbetare inom finans har kompetensprofiler som matchar Finance Director-rollen, och vilka kompetensgap behöver adresseras?" — Copilot analyserar kompetensprofiler, identifierar de bästa kandidaterna och genererar individuella utvecklingsplaner.
        </p>

        <h2>Medarbetarservice och HR-chatbot</h2>
        <p>
          Medarbetare interagerar med HR via Copilot i Teams: ställer frågor om policy, beställer intyg, ansöker om ledighet och får personaliserade svar baserade på deras specifika kontrakt och situation — utan att involvera HR-avdelningen för standardfrågor.
        </p>

        <ul>
          <li>AI-assisterad medarbetarsamtalsförberedelse</li>
          <li>Copilot-stöd för kompensationsanalys och benchmarking</li>
          <li>Naturspråksfrågor om organisationens kompetensstatus</li>
          <li>Automatisk generering av utvecklingsplan</li>
          <li>People analytics med conversational interface</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilot-i-dynamics-365-project-operations",
    title: "Copilot i Dynamics 365 Project Operations",
    description: "AI-assistans för projektledare, resursplanerare och controllers med riskidentifiering.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Copilot i Project Operations",
    image: copilot09,
    content: (
      <>
        <p>
          <em>Projektledning kräver balansering av resurser, tidplan, budget och kundrelationer simultant. Copilot i Project Operations ger projektledare ett intelligent stöd som identifierar risker tidigt, föreslår resursalternativ och genererar kundkommunikation på minuter.</em>
        </p>

        <h2>Projektstatusanalys och riskidentifiering</h2>
        <p>
          Copilot analyserar projektets aktuella status och identifierar risker som kanske inte är uppenbara: "Projektets burnrate är 15 % högre än planerat, och baserat på historiska mönster för liknande projekt är risken för kostnadsöverskridning 70 % om inte åtgärder vidtas."
        </p>

        <h2>Kundkommunikation och rapportgenerering</h2>
        <p>
          Copilot genererar utkast till kundstatusrapporter, styrelsepresentationer och change request-dokument baserade på aktuell projektdata. Projektledaren reviewar, justerar och publicerar — kommunikationen håller hög kvalitet utan proportionerlig tidsinsats.
        </p>

        <h2>Resursplanering och kompetensmatchning</h2>
        <p>
          Resursplaneraren kan fråga: "Jag behöver en senior konsult med finansmodulerfarenhet för ett projekt i Stockholm med start om 3 veckor. Vem är ledig och passar bäst?" — Copilot analyserar kompetensmatriser, bokningsstatus och senioritetsnivåer och presenterar rankade alternativ.
        </p>

        <ul>
          <li>Automatisk veckostatusrapport baserad på timrapporter</li>
          <li>AI-assisterade change order-motiveringar</li>
          <li>Resursoptimerings-förslag baserade på kompetens och tillgänglighet</li>
          <li>Lessons learned-syntes från avslutade projekt</li>
          <li>Copilot-stöd för offert- och kostnadskalkyler</li>
        </ul>
      </>
    ),
  },
  {
    slug: "copilotstrategi-och-adoptionsplanering",
    title: "Copilot-strategi och adoptionsplanering",
    description: "Maximera värdet av Copilot med champions-program, mätning och kontinuerlig optimering.",
    product: "Microsoft Copilot – Dynamics 365",
    productSlug: "copilot",
    parentPath: "/copilot/",
    parentLabel: "Copilot i Dynamics 365",
    headerLabel: "Fördjupning – Adoption & strategi",
    image: copilot10,
    content: (
      <>
        <p>
          <em>Copilot-licenser skapar inte värde av sig självt — användning gör det. En strukturerad adoptionsstrategi är skillnaden mellan en AI-investering som ger 10x avkastning och en som samlar damm.</em>
        </p>

        <h2>Adoption-ramverk för Copilot</h2>
        <p>
          Framgångsrik Copilot-adoption bygger på tre pelare: relevans (Copilot löser ett verkligt problem för användaren), tillgänglighet (Copilot är enkelt att använda i det naturliga arbetsflödet) och förtroende (användaren litar på att Copilots svar är korrekta och säkra). Alla tre måste adresseras simultant.
        </p>

        <h2>Champions-program och community of practice</h2>
        <p>
          Organisationer med starka champions-program ser 65 % högre adoption. Champions är "first movers" i varje team som provar Copilot tidigt, delar användbara prompt-recept med kollegorna och ger feedback till projektteamet. Community of practice-möten (månadsvis) delar best practices och driver kontinuerlig förbättring.
        </p>

        <h2>Mätning och kontinuerlig optimering</h2>
        <p>
          Copilot-värdet mäts längs tre dimensioner: tidsbesparingar (hur mycket tid sparar användarna per vecka), kvalitetsförbättring (är dokumenten bättre, svarstiderna kortare, kundnöjdheten högre?) och strategisk påverkan (vilka affärsmål stödjer Copilot-användningen?). Mät, dela och iterera varje kvartal.
        </p>

        <ul>
          <li>Prompt-bibliotek för vanliga arbetsuppgifter per roll</li>
          <li>Onboarding-program för nya Copilot-användare</li>
          <li>Mätning av adoption per team och roll med Power BI</li>
          <li>Regelbundna produktivitetsworkshops med champions</li>
          <li>Feedback-kanal för Copilot-förbättringsförslag</li>
        </ul>
      </>
    ),
  },
];
