import type { DeepDiveArticle } from "./bcArticles";

import agentsIntroImg from "@/assets/articles/agents-intro.jpg";
import agentsSalesImg from "@/assets/articles/agents-sales.jpg";
import agentsCsImg from "@/assets/articles/agents-cs.jpg";
import agentsScmImg from "@/assets/articles/agents-scm.jpg";
import agentsFinanceImg from "@/assets/articles/agents-finance.jpg";
import agentsHrImg from "@/assets/articles/agents-hr.jpg";
import agentsFieldServiceImg from "@/assets/articles/agents-field-service.jpg";
import agentsPoImg from "@/assets/articles/agents-po.jpg";
import agentsByggImg from "@/assets/articles/agents-bygg.jpg";
import agentsRoiImg from "@/assets/articles/agents-roi.jpg";

export const AGENTS_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "vad-ar-autonoma-agenter-i-dynamics-365",
    title: "Vad är autonoma agenter i Dynamics 365?",
    description: "En introduktion till agenters arkitektur, kapaciteter och säkerhetsmodell.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Vad är agenter?",
    image: agentsIntroImg,
    content: (
      <>
        <p>
          <em>Microsoft Agents är självstyrande AI-program som kan planera, resonera och utföra arbetsuppgifter med minimal mänsklig inblandning. I Dynamics 365-ekosystemet representerar de en fundamentalt ny arbetsmodell där AI inte bara assisterar — den agerar.</em>
        </p>

        <h2>Från assistent till autonom agent</h2>
        <p>
          Traditionell AI — som Copilot — svarar på frågor och genererar innehåll på begäran. Autonoma agenter tar nästa steg: de tar emot ett mål, bryter ned det i delsteg, väljer vilka verktyg och API:er de ska använda, utför handlingarna och utvärderar resultatet — iterativt, utan mänsklig inblandning för varje steg.
        </p>
        <p>
          En agent för orderhantering kan till exempel övervaka inkommande order, kontrollera lagerstatus, initiera inköp vid brist och notifiera kunden — allt autonomt.
        </p>

        <h2>Agenters kärnkomponenter</h2>
        <p>
          Varje agent i Dynamics 365-ekosystemet består av fyra delar: ett Large Language Model (LLM) som driver resonemang och planering, ett verktygsbibliotek (API-kopplingar, Dataverse-åtkomst, webbtjänster), en minnesmodul för kontext och historik, samt en orkestreringsmotor som koordinerar flödet. Microsoft Copilot Studio är byggmiljön där agenter konfigureras utan kodning.
        </p>

        <h2>Säkerhet och mänsklig kontroll</h2>
        <p>
          Autonoma agenter agerar aldrig utanför definierade behörighetsgränser. Rollbaserad åtkomstkontroll (RBAC) styr exakt vad agenten får läsa, skriva och exekvera. Kritiska åtgärder kräver mänskligt godkännande via konfigurerbara "human-in-the-loop"-checkpoints — organisationen bestämmer gränsdragningen.
        </p>

        <ul>
          <li>Copilot Studio som no-code agentkonfigurator</li>
          <li>Azure AI Foundry för avancerade anpassade agenter</li>
          <li>Dataverse som gemensam dataplattform</li>
          <li>Power Automate för processtriggrar och åtgärder</li>
          <li>Microsoft Graph för Office 365-integration</li>
        </ul>
      </>
    ),
  },
  {
    slug: "saljagenten-som-aldrig-vilar",
    title: "Säljagenten som aldrig vilar",
    description: "Autonomt prospektering, kvalificering och uppföljning i Dynamics 365 Sales.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Säljagenten",
    image: agentsSalesImg,
    content: (
      <>
        <p>
          <em>Säljare spenderar uppemot 65 % av sin tid på administrativt arbete och manuell prospektering. Sales Agent i Dynamics 365 tar över repetitiva säljuppgifter och arbetar dygnet runt på att kvalificera leads, boka möten och skriva uppföljningar — så säljaren kan fokusera på relationer och avslut.</em>
        </p>

        <h2>Automatisk leadkvalificering</h2>
        <p>
          Sales Agent övervakar kontinuerligt inkommande leads från alla kanaler — webbformulär, LinkedIn, e-post och events. För varje lead genomför agenten en fullständig kvalificeringsanalys: verifierar företagsdata mot externa databaser, beräknar fit-score baserat på ICP-kriterierna, och enrichar profilen med aktuell firmografik och kontaktinformation — allt utan manuell handpåläggning.
        </p>

        <h2>Personaliserad prospekteringskommunikation</h2>
        <p>
          Agenten skriver personaliserade prospekteringsmeddelanden baserade på mottagarens roll, bransch, nyliga nyheter om deras bolag och delade intresseområden. Meddelanden skickas via rätt kanal (e-post, LinkedIn InMail eller SMS) vid optimal tidpunkt baserat på historiska svarsfrekvenser per segment.
        </p>

        <h2>Affärsövervakning och proaktiva insikter</h2>
        <p>
          Agenten övervakar aktiva affärsmöjligheter och detekterar risksignaler: uteblivna svar, negativ sentimentutveckling, konkurrentnämnanden i kommunikation eller minskad köparsignal. Säljaren notifieras omedelbart med konkreta åtgärdsförslag för att rädda affären.
        </p>

        <ul>
          <li>A/B-testning av ämnesrader och budskapsvinklar</li>
          <li>Automatisk uppföljningssekvens vid uteblivet svar</li>
          <li>Sentimentanalys av svar för prioritering</li>
          <li>Automatisk mötesbokning vid positivt svar</li>
          <li>Loggning av alla aktiviteter i CRM</li>
        </ul>
      </>
    ),
  },
  {
    slug: "kundserviceagenten-som-loser-arenden",
    title: "Kundserviceagenten som löser ärenden",
    description: "Autonom ärendehantering från mottagning till resolution — upp till 80 % utan mänsklig inblandning.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Kundserviceagenten",
    image: agentsCsImg,
    content: (
      <>
        <p>
          <em>Customer Service Agent i Dynamics 365 hanterar inkommande ärenden från alla kanaler autonomt — klassificerar, söker i kunskapsbasen, kommunicerar med kunden och löser upp till 80 % av standardärenden utan mänsklig inblandning. Komplexa ärenden eskaleras sömlöst med full kontext.</em>
        </p>

        <h2>Intelligent ärendemottagning och klassificering</h2>
        <p>
          När ett ärende inkommer via valfri kanal analyserar agenten omedelbart innehållet: identifierar ärendetyp, brådska, kundens sentiment och relevanta produkter. Klassificeringen är mer nyanserad än regelbaserad routing — agenten förstår kontext och intent, inte bara nyckelord.
        </p>

        <h2>Autonom ärendelösning</h2>
        <p>
          För identifierade standardärenden agerar agenten självständigt: söker i kunskapsbasen, hämtar kontospecifik information från CRM, formulerar ett personaliserat svar och genomför eventuella systemåtgärder (återbetalning, lösenordsåterställning, orderändring) — allt inom definierade befogenheter.
        </p>

        <h2>Sömlös övergång till mänsklig handläggare</h2>
        <p>
          När agenten når sin kompetensgräns — tekniskt komplex fråga, missnöjd kund eller okänd situation — sker överlämning till mänsklig handläggare med komplett konversationshistorik, genomförda åtgärder, kundens sentiment och förslag på nästa steg.
        </p>

        <ul>
          <li>Stöd för 100+ vanliga ärendetyper utan konfiguration</li>
          <li>Automatisk eskalering vid låg konfidensnivå</li>
          <li>Realtidsöversättning för globala kundtjänstoperationer</li>
          <li>Proaktiv statusuppdatering till kunden under handläggning</li>
          <li>Komplett revisionsspår för varje åtgärd</li>
        </ul>
      </>
    ),
  },
  {
    slug: "supply-chain-agenten-som-forebygger-storningar",
    title: "Supply Chain-agenten som förebygger störningar",
    description: "Autonom övervakning och åtgärd i leveranskedjan — dygnet runt.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Supply Chain-agenten",
    image: agentsScmImg,
    content: (
      <>
        <p>
          <em>Supply chain-störningar kostar globalt tusentals miljarder kronor årligen. Supply Chain Agent i Dynamics 365 SCM övervakar leveranskedjan dygnet runt, detekterar avvikelser i realtid och vidtar automatiska motåtgärder — ofta innan störningen ens märks av.</em>
        </p>

        <h2>Realtidsövervakning av leveranskedjan</h2>
        <p>
          Agenten integreras med leverantörsportaler, fraktdata, tullsystem och vädertjänster för att kontinuerligt övervaka alla kritiska punkter i kedjan. Avvikelser från förväntade leveranstider, kvalitetsrapporter från leverantörer och geopolitiska riskvarningar bearbetas i realtid.
        </p>

        <h2>Proaktiva motåtgärder</h2>
        <p>
          Vid detekterad risk agerar agenten omedelbart inom definierade mandat: kontaktar alternativa leverantörer, justerar leverantörsallokeringar, initierar säkerhetslageruppbyggnad eller omdirigerar befintligt gods. Åtgärder som överstiger mandatgränsen eskaleras till inköpschef med komplett beslutsunderlag.
        </p>

        <h2>Kontinuerlig leverantörsutvärdering</h2>
        <p>
          Agenten betygsätter löpande leverantörsprestanda mot KPI:er (on-time delivery, kvalitetsavvikelser, priskommunikation) och flaggar leverantörer vars prestanda försämras — i god tid för avtalsomförhandling eller leverantörsbyte.
        </p>

        <ul>
          <li>Automatisk leverantörssubstitution vid brist</li>
          <li>Expedit-orderinitiering vid kritisk lagerbrist</li>
          <li>Ruttoptimering vid transportstörningar</li>
          <li>Automatisk kundnotifiering vid förseningsrisk</li>
          <li>Scenario-analys för beslutsunderlag</li>
        </ul>
      </>
    ),
  },
  {
    slug: "finansagenten-som-stanger-bockerna",
    title: "Finansagenten som stänger böckerna",
    description: "Autonom avstämning, avvikelsedetektering och rapportering i Finance.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Finansagenten",
    image: agentsFinanceImg,
    content: (
      <>
        <p>
          <em>Månadsslut är ekonomiavdelningens mest stressiga period. Finance Agent i Dynamics 365 Finance automatiserar periodavstämningar, detekterar avvikelser, stämmer av intercompany-transaktioner och skapar rapportutkast — och komprimerar månadsslutsprocessen från dagar till timmar.</em>
        </p>

        <h2>Automatiserade periodavstämningar</h2>
        <p>
          Agenten kör nattliga avstämningar av bankkonto mot huvudbok, leverantörsskulder mot åldersanalys och kundfordringar mot utestående fakturor. Avvikelser kategoriseras efter sannolik orsak och presenteras med förslag på bokföringsåtgärder — revisorn godkänner istället för att leta.
        </p>

        <h2>Intercompany-eliminering och konsolidering</h2>
        <p>
          I koncerner med många juridiska enheter är intercompany-elimineringen den mest tidskrävande delen av konsolideringen. Agenten identifierar alla intercompany-transaktioner, verifierar matchning mellan enheter och genererar elimineringsposter automatiskt — med fullständigt revisionsspår.
        </p>

        <h2>Rapportutkast och styrelsepresentationer</h2>
        <p>
          Agenten genererar utkast till månadsrapporter, styrelsepresentationer och regulatoriska rapporter baserade på verifierade siffror och definierade mallar. Ekonomichefen granskar, justerar narrativet och publicerar — rapportarbetet tar timmar, inte dagar.
        </p>

        <ul>
          <li>Automatisk valutaomräkning och revalvering</li>
          <li>Regelbaserad periodiseringsgenerering</li>
          <li>Automatisk kassaflödesklassificering</li>
          <li>Generering av notupplysningar baserade på transaktionsdata</li>
          <li>Proaktiv varning vid budget- eller forecast-avvikelse</li>
        </ul>
      </>
    ),
  },
  {
    slug: "hr-agenten-som-hanterar-medarbetarresan",
    title: "HR-agenten som hanterar hela medarbetarresan",
    description: "Autonom HR-administration från onboarding till offboarding — dygnet runt.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – HR-agenten",
    image: agentsHrImg,
    content: (
      <>
        <p>
          <em>HR-avdelningar lägger stor del av sin tid på administrativa uppgifter som svarar på samma frågor om och om igen. HR Agent i Dynamics 365 Human Resources automatiserar repetitiv HR-administration och ger medarbetare snabba, korrekta svar dygnet runt — på deras eget språk.</em>
        </p>

        <h2>Autonom onboarding-orkestrering</h2>
        <p>
          När en ny anställning bekräftas i systemet startar HR-agenten automatiskt onboarding-processen: skickar välkomstmail, skapar IT-ärendet för utrustning och systemåtkomst, assignar obligatoriska utbildningar, bokar introduktionsmöten med chef och team, och skickar påminnelser om ej slutförda steg till alla inblandade parter.
        </p>

        <h2>Medarbetarservice och FAQ-hantering</h2>
        <p>
          Agenten svarar autonomt på HR-relaterade frågor via Teams, e-post eller HR-portalen: semesterregler, föräldraledighetsprocesser, lönerevisionspolicyer, förmåner och intygsbeställningar. Svaren är alltid uppdaterade mot aktuell policy och personaliserade efter medarbetarens kontrakt och land.
        </p>

        <h2>Compliance-övervakning och rapportering</h2>
        <p>
          Agenten övervakar kontinuerligt efterlevnad av arbetsrättsliga krav: certifieringsförnyelser, obligatoriska utbildningar, arbetstidsregler och diskrimineringslagstiftning. Avvikelser flaggas proaktivt till HR-chef innan de eskalerar till regelbrott.
        </p>

        <ul>
          <li>Automatisk ledighetsansökan och godkännandeflöde</li>
          <li>Utläggsberedning och kvittohantering</li>
          <li>Tidrapportpåminnelser och avvikelsehantering</li>
          <li>Kompetensprofiluppdatering efter avslutad kurs</li>
          <li>Automatisk offboarding-checklista vid avslut</li>
        </ul>
      </>
    ),
  },
  {
    slug: "faltserviceagenten-som-planerar-sig-sjalv",
    title: "Fältserviceagenten som planerar sig själv",
    description: "Autonom schemaläggning, dispatching och kundkommunikation i Field Service.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Fältserviceagenten",
    image: agentsFieldServiceImg,
    content: (
      <>
        <p>
          <em>Manuell schemaläggning av fälttekniker är suboptimal och tidskrävande. Field Service Agent i Dynamics 365 optimerar kontinuerligt hela teknikerstyrkan — ombokar automatiskt vid störningar, kommunicerar proaktivt med kunder och säkerställer att rätt reservdelar finns på plats.</em>
        </p>

        <h2>Kontinuerlig schemaoptimering</h2>
        <p>
          Agenten kör löpande omoptimering av hela teknikerkalendern när nya jobb inkommer, jobb avslutas eller störningar uppstår (sjukdom, trafikstörning, längre jobb). RSO-motorn körs automatiskt var 15:e minut och agenten implementerar optimerade scheman utan manuell dispatcher-inblandning.
        </p>

        <h2>Proaktiv kundkommunikation</h2>
        <p>
          Agenten hanterar all rutin-kundkommunikation autonomt: bokningsbekräftelse, dag-före-påminnelse, realtids-ETA-uppdateringar och "on-my-way"-notifikation med teknikerns position. Vid försening skickas automatisk ursäkt och ny beräknad tid — utan att dispatcher behöver agera.
        </p>

        <h2>IoT-driven proaktiv service</h2>
        <p>
          Agenten övervakar telemetri från anslutna enheter och agerar autonomt vid anomalidetektering: skapar serviceorder, identifierar rätt tekniker, förbeställer troliga reservdelar och bokar servicetid — innan kunden rapporterat något problem.
        </p>

        <ul>
          <li>Automatisk ombokning vid tekniker-sjukdom</li>
          <li>Reservdelsförbeställning baserat på jobbtyp</li>
          <li>Proaktiv eskalering vid SLA-risk</li>
          <li>Automatisk kundundersökning efter avslutat jobb</li>
          <li>Realtidsnotis till supervisor vid kritiska avvikelser</li>
        </ul>
      </>
    ),
  },
  {
    slug: "projektoperationsagenten",
    title: "Projektoperationsagenten",
    description: "Autonom projektövervakning, riskhantering och kundrapportering.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Projektagenten",
    image: agentsPoImg,
    content: (
      <>
        <p>
          <em>Projektledare spenderar oproportionerligt mycket tid på statusrapportering, mötesberedning och eskalationshantering. Project Operations Agent tar över dessa uppgifter och håller alla projekt på spåret — och flaggar avvikelser omedelbart.</em>
        </p>

        <h2>Kontinuerlig projektövervakning</h2>
        <p>
          Agenten analyserar dagligen alla aktiva projekts status mot plan: tidsrapportering vs budget, milstolpar vs faktisk progress, resursutnyttjande och marginalutveckling. Avvikelser kategoriseras och prioriteras — projektledaren ser omedelbart vilka projekt som kräver uppmärksamhet.
        </p>

        <h2>Automatisk statusrapportering</h2>
        <p>
          Varje vecka genererar agenten automatiska statusrapporter till kund och intern styrgrupp baserade på verifierade projektdata. Rapporten innehåller progress, risker, kommande milstolpar och eventuella change requests — projektledaren granskar och publicerar med ett klick.
        </p>

        <h2>Intäktsigenkänning och finansiell övervakning</h2>
        <p>
          Agenten övervakar projektens finansiella position mot kontraktsvillkor och triggar automatisk intäktsigenkänning vid uppfyllda kriterier. Variansanalyser mot budget genereras automatiskt för controllern — utan manuell dataextrahering.
        </p>

        <ul>
          <li>Proaktiv varning vid burnrate-avvikelse</li>
          <li>Automatisk change order-initiering vid scopeändring</li>
          <li>Resurskonfliktdetektering och alternativförslag</li>
          <li>Automatisk faktureringsunderlag vid milstolpsgodkännande</li>
          <li>Lessons learned-sammanställning vid projektavslut</li>
        </ul>
      </>
    ),
  },
  {
    slug: "bygg-och-anpassa-egna-agenter",
    title: "Bygg och anpassa egna agenter",
    description: "Microsoft Copilot Studio och Azure AI Foundry — från no-code till avancerad anpassning.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – Bygg egna agenter",
    image: agentsByggImg,
    content: (
      <>
        <p>
          <em>Standardagenter täcker vanliga affärsprocesser, men varje organisation har unika processer som kräver skräddarsydda lösningar. Copilot Studio och Azure AI Foundry ger en komplett plattform för att bygga, testa, driftsätta och övervaka anpassade agenter utan avancerad AI-kunskap.</em>
        </p>

        <h2>Copilot Studio — no-code agentbyggande</h2>
        <p>
          Copilot Studio erbjuder ett visuellt canvas för att bygga agenter utan kod. Affärsutvecklare definierar agentens mål, väljer vilka datakällor den ska ha tillgång till (Dataverse, SharePoint, externa API:er), konfigurerar triggers och åtgärder, och sätter behörighetsgränser — allt i ett intuitivt drag-and-drop-gränssnitt.
        </p>

        <h2>Azure AI Foundry — avancerade anpassningar</h2>
        <p>
          För komplexa agenter med specialiserade krav erbjuder Azure AI Foundry fullständig kontroll: val av LLM-modell, fine-tuning på organisationens data, anpassade reasoning-strategier och integration med Azure AI Search för kunskapsintensiva agenter.
        </p>

        <h2>Governance och livscykelhantering</h2>
        <p>
          Agenter kräver löpande underhåll: prestandaövervakning, promptoptimering och omträning vid policybyte. Azure AI Foundry erbjuder ett komplett MLOps-ramverk för agentens hela livscykel med automatiserade tester, versionskontroll och rollback-kapacitet.
        </p>

        <ul>
          <li>Val mellan GPT-4o, Phi-3 och specialiserade modeller</li>
          <li>RAG (Retrieval Augmented Generation) med organisationens dokument</li>
          <li>Multi-agent-orkestering för komplexa arbetsflöden</li>
          <li>Inbyggd testmiljö med simulerade scenarier</li>
          <li>Deployment till Azure, on-premise eller hybrid</li>
        </ul>
      </>
    ),
  },
  {
    slug: "agenter-i-praktiken-roi-och-implementation",
    title: "Agenter i praktiken — ROI och implementation",
    description: "Affärsvärde, implementeringsväg och organisatorisk beredskap för agenttransformation.",
    product: "Microsoft Agents – Dynamics 365",
    productSlug: "agents",
    parentPath: "/agents/",
    parentLabel: "Dynamics 365 Agents",
    headerLabel: "Fördjupning – ROI & implementation",
    image: agentsRoiImg,
    content: (
      <>
        <p>
          <em>Agenter lovar dramatisk effektivisering — men hur realiseras värdet i praktiken? Denna artikel beskriver en strukturerad implementeringsmetodik, realistiska ROI-kalkyler och de organisatoriska faktorer som avgör om agenttransformationen lyckas.</em>
        </p>

        <h2>ROI-kalkyl och värderealisering</h2>
        <p>
          Agenter skapar värde längs tre dimensioner: kostnadsreduktion (färre FTE på repetitiva uppgifter), intäktsökning (fler leads bearbetade, kortare säljcykler) och kvalitetsförbättring (färre fel, snabbare svarstider). En typisk implementation i kundservice med 50 handläggare visar 40 % kostnadsminskning och 25 % CSAT-förbättring under 12 månader.
        </p>

        <h2>Implementeringsmetodik: tre faser</h2>
        <p>
          <strong>Fas 1 — Pilot (dag 0–90):</strong> Välj en välavgränsad process med tydliga KPI:er och låg risk. Mät noga.
        </p>
        <p>
          <strong>Fas 2 — Skalning (dag 90–180):</strong> Utöka till fler processer och integrationer baserat på pilotens lärdomar.
        </p>
        <p>
          <strong>Fas 3 — Transformation (dag 180+):</strong> Integrera agenter i kärnprocesserna och etablera löpande förbättringscykler.
        </p>

        <h2>Organisatorisk beredskap och förändringsledning</h2>
        <p>
          Den vanligaste orsaken till misslyckade agentimplementationer är inte tekniken — det är organisationen. Framgångsrika transformationer investerar lika mycket i kommunikation, utbildning och rollomdefiniering som i den tekniska lösningen. Medarbetare behöver förstå hur agenter kompletterar deras arbete, inte ersätter det.
        </p>

        <ul>
          <li>Processinventering och prioriteringsmatris</li>
          <li>Data readiness assessment innan implementation</li>
          <li>Change management-plan för berörda medarbetare</li>
          <li>KPI-ramverk för löpande prestationsmätning</li>
          <li>Center of Excellence för agentstyrning och skalning</li>
        </ul>
      </>
    ),
  },
];
