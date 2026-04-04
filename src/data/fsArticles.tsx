import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import type { DeepDiveArticle } from "./bcArticles";

import fsSchemalagningImg from "@/assets/articles/fs-schemalagning.jpg";
import fsMobilappImg from "@/assets/articles/fs-mobilapp.jpg";
import fsUnderhallImg from "@/assets/articles/fs-underhall.jpg";
import fsIotImg from "@/assets/articles/fs-iot.jpg";
import fsRemoteAssistImg from "@/assets/articles/fs-remote-assist.jpg";
import fsReservdelarImg from "@/assets/articles/fs-reservdelar.jpg";
import fsKundkommunikationImg from "@/assets/articles/fs-kundkommunikation.jpg";
import fsProduktivitetImg from "@/assets/articles/fs-produktivitet.jpg";
import fsHallbarhetImg from "@/assets/articles/fs-hallbarhet.jpg";
import fsIntegrationImg from "@/assets/articles/fs-integration.jpg";

export const FS_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "intelligent-teknikerschemalagning",
    title: "Intelligent teknikerschemaläggning",
    description: "AI-optimerad dispatching som matchar rätt tekniker med rätt kompetens till rätt jobb.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Schemaläggning",
    image: fsSchemalagningImg,
    content: (
      <>
        <p>
          <em>
            Manuell schemaläggning av fälttekniker är tidskrävande och suboptimal. Field Service 
            Schedule Assistant och AI-optimering matchar rätt tekniker med rätt kompetens till rätt jobb 
            — och minimerar restid och koldioxidutsläpp.
          </em>
        </p>

        <h2>Schedule Board och Resource Scheduling Optimization</h2>
        <p>
          Schedule Board ger dispatchers en visuell realtidsöversikt av alla teknikerers positioner, 
          kapacitet och scheman.
        </p>
        <p>
          RSO (Resource Scheduling Optimization) kör automatisk omoptimering av hela dagsschemat 
          när nya jobb tillkommer eller störningar uppstår — utan manuell intervention.
        </p>

        <h2>Kompetensbaserad matchning</h2>
        <p>
          Varje jobb kräver specifika kompetenser, certifieringar och verktyg. Systemet matchar 
          automatiskt mot teknikerprofiler och säkerställer att rätt person skickas.
        </p>
        <p>
          Ingen manuell kontroll av kompetensdatabaser behövs — systemet hanterar 
          detta automatiskt.
        </p>

        <h2>Realtidsövervakning och dynamisk ombokning</h2>
        <p>
          Teknikerernas GPS-position uppdateras kontinuerligt. Vid försening ombokas automatiskt 
          nästa jobb om nödvändigt — kunden notifieras proaktivt med ny beräknad ankomsttid.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Heatmaps för jobbdensitet och tekniker-coverage</li>
          <li>Preferensbaserad kundbokning</li>
          <li>Integration med trafikdata för realtidsskovsoptimering</li>
          <li>Kapacitetsplanering 4–8 veckor framåt</li>
        </ul>
      </>
    ),
  },
  {
    slug: "mobil-faltapp-och-offlinekapacitet",
    title: "Mobil fältapp och offline-kapacitet",
    description: "Full funktionalitet för tekniker oavsett uppkoppling — med automatisk synkronisering.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Mobilappen",
    image: fsMobilappImg,
    content: (
      <>
        <p>
          <em>
            Fälttekniker arbetar i källare, serverhallar och avlägsna platser utan mobilnät. 
            Field Service mobilappen ger full jobbinformation, checklistor och reservdelsinformation 
            offline — och synkroniserar automatiskt när uppkoppling återupprättas.
          </em>
        </p>

        <h2>Jobbinformation och arbetsordrar offline</h2>
        <p>
          Tekniker laddar ned jobbdetaljer, kundhistorik, installerade produkter, servicemanualer 
          och checklister till enheten. Allt tillgängligt utan internet — fullständig jobbkontext i fickan.
        </p>

        <h2>Checklistor, inspektioner och fotodokumentation</h2>
        <p>
          Digitala checklistor ersätter pappersformulär. Tekniker fotograferar arbete och 
          komponenter direkt i appen — foton kopplas automatiskt till serviceordern.
        </p>
        <p>
          Kundunderskrift samlas in digitalt på plats, vilket eliminerar behovet 
          av pappersbaserade kvitteringar.
        </p>

        <h2>Reservdels- och lagerhantering</h2>
        <p>
          Tekniker ser sin fordonslagerstatus, kan rekvirera reservdelar och registrera 
          materialförbrukning i appen. Lagerpositioner uppdateras i realtid.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Barkodsläsning för reservdelsregistrering</li>
          <li>Mixed Reality-stöd (Remote Assist via HoloLens)</li>
          <li>Röstkommandon för hands-free-användning</li>
          <li>Automatisk tidrapportering och reselogg</li>
        </ul>
      </>
    ),
  },
  {
    slug: "forebyggande-underhall-och-serviceavtal",
    title: "Förebyggande underhåll och serviceavtal",
    description: "Från reaktiv till proaktiv servicemodell med automatiserade underhållsplaner.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Underhåll & Serviceavtal",
    image: fsUnderhallImg,
    content: (
      <>
        <p>
          <em>
            Reaktiv service är dyr — nödleveranser, övertid och missnöjda kunder. Field Service 
            servicekontrakt och underhållsplaner möjliggör systematiskt förebyggande underhåll 
            som minskar haverier med upp till 70 %.
          </em>
        </p>

        <h2>Servicekontraktshantering</h2>
        <p>
          Serviceavtal definierar vad som ingår, SLA-krav och faktureringsmodell. Systemet 
          spårar avtalets utnyttjande och varnar vid överkostnader.
        </p>
        <p>
          Faktureringsunderlag genereras automatiskt baserat på kontraktsvillkor, 
          vilket eliminerar manuellt administrationsarbete.
        </p>

        <h2>Underhållsplaner och automatiska arbetsordrar</h2>
        <p>
          Underhållsplaner baserade på tid (kvartalsvis), drifttimmar eller mätarvärden 
          genererar automatiskt arbetsordrar med rätt resursallokering och reservdelsbehov 
          — i god tid för planering.
        </p>

        <h2>Kundkommunikation och portaltillgång</h2>
        <p>
          Kunder kan se sina serviceavtal, kommande planerat underhåll och servicehistorik 
          via en kundportal.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Garanti- och kontraktsuppföljning per enhet</li>
          <li>Automatisk förnyelsepåminnelse</li>
          <li>SLA-spårning per servicekontrakt</li>
          <li>Profitabilitetsanalys per kontraktstyp</li>
        </ul>
      </>
    ),
  },
  {
    slug: "connected-field-service-med-iot",
    title: "Connected Field Service med IoT",
    description: "Ansluten utrustning som skapar serviceärenden och dispatchar tekniker automatiskt.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – IoT & Connected",
    image: fsIotImg,
    content: (
      <>
        <p>
          <em>
            Varje minut av oplanerat produktionsstopp kostar pengar. Connected Field Service 
            kopplar ihop Dynamics 365 med Azure IoT Hub för att detektera anomalier i ansluten 
            utrustning och dispatcha teknikern automatiskt — innan kunden rapporterar problemet.
          </em>
        </p>

        <h2>IoT-signaler och anomalidetektering</h2>
        <p>
          Azure IoT Hub tar emot telemetridata från anslutna enheter. Regler och ML-modeller 
          identifierar avvikelser — temperatur utanför normalintervall, vibration över threshold, 
          spänningsvariationer.
        </p>
        <p>
          Vid avvikelse skapas automatiskt ett serviceärende med all diagnostikinformation 
          bifogad.
        </p>

        <h2>Fjärrdiagnostik och remote commands</h2>
        <p>
          Tekniker och specialister kan fjärrstyra enheter, genomföra diagnostik och i många 
          fall lösa problemet utan platsbesök. Fjärrlösningsgraden minskar kostnader och 
          ökar tillgängligheten.
        </p>

        <h2>Prediktivt underhåll med maskininlärning</h2>
        <p>
          Historiska feldata tränar ML-modeller att förutse framtida haverier. Tekniker 
          dispatchas för förebyggande åtgärd i god tid.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Digital twin-integration via Azure Digital Twins</li>
          <li>Realtids-telemetridashboard för driftsövervakning</li>
          <li>Eskalering från IoT till Field Service till Customer Service</li>
          <li>Automatisk garantikontroll vid IoT-alert</li>
        </ul>
      </>
    ),
  },
  {
    slug: "remote-assist-och-mixed-reality",
    title: "Remote Assist och Mixed Reality",
    description: "Experthjälp på distans med HoloLens och mobilkamera i realtid.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Remote Assist",
    image: fsRemoteAssistImg,
    content: (
      <>
        <p>
          <em>
            Att flyga ut en specialist kostar tid och pengar. Remote Assist i Field Service 
            låter en expert guida en fälttekniker via HoloLens eller smartphone — med annotations 
            och diagrams projicerade direkt i teknikerns synfält.
          </em>
        </p>

        <h2>HoloLens och mobil Remote Assist</h2>
        <p>
          Tekniker sätter på sig HoloLens eller håller upp sin smartphone mot utrustningen. 
          Experten ser i realtid exakt vad tekniker ser.
        </p>
        <p>
          Experten kan rita annotations, peka på komponenter och visa reparationssteg 
          direkt i teknikerns synfält — som att ha specialisten bredvid sig.
        </p>

        <h2>Integration med arbetsordrar och kunskapsbas</h2>
        <p>
          Remote Assist-sessioner länkas direkt till serviceordern. Inspelningar och screenshots 
          sparas automatiskt som dokumentation och kan återanvändas i kunskapsbasen.
        </p>

        <h2>Guides och steg-för-steg-instruktioner</h2>
        <p>
          Dynamics 365 Guides skapar holografiska arbetsanvisningar kopplade till specifika 
          utrustningar. Nya tekniker kan lära sig komplexa reparationer utan att ha en expert 
          vid sin sida.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Teams-integration för videosamtal med expert</li>
          <li>Automatisk sessionsinspelning och transkription</li>
          <li>QR-kod-baserade utrustningskopplingar</li>
          <li>Offline-instruktioner för nätverksfria miljöer</li>
        </ul>
      </>
    ),
  },
  {
    slug: "reservdelslogistik-och-lageroptimering",
    title: "Reservdelslogistik och lageroptimering",
    description: "Rätt reservdel på rätt plats i rätt tid — för maximal first-time fix rate.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Reservdelar & Lager",
    image: fsReservdelarImg,
    content: (
      <>
        <p>
          <em>
            Reservdelsbrist är den vanligaste orsaken till missade servicejobb och second visits. 
            Field Service integrerar lager-, inköps- och logistikhantering för att säkerställa 
            att teknikern alltid har vad som behövs — inte mer, inte mindre.
          </em>
        </p>

        <h2>Fordonslagerstyrning</h2>
        <p>
          Varje teknikerfordon är ett rörligt lagerställe med definierat min/max per artikel. 
          Systemet spårar förbrukning i realtid.
        </p>
        <p>
          Påfyllnadsorder genereras automatiskt när miniminivåer underskrids — 
          teknikern behöver aldrig själv bevaka lagernivåer.
        </p>

        <h2>Jobbspecifik reservdelsplanering</h2>
        <p>
          Baserat på arbetsorderns typ och installerade enheter föreslår systemet vilka 
          reservdelar tekniker sannolikt behöver. Förslag baseras på historisk 
          reparationsstatistik för samma utrustningstyp.
        </p>

        <h2>Returhantering och garantiadministration</h2>
        <p>
          Defekta delar returneras systematiskt med rätt klassificering: garantiersättning, 
          reparation eller skrotning. Garantikrav hanteras automatiskt mot leverantör.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Integration med SCM för inköpsautomation</li>
          <li>Reservdelstillgänglighet i realtid per tekniker</li>
          <li>Deponeringshantering och lagerkonsolidering</li>
          <li>Prognosstyrd lageroptimering</li>
        </ul>
      </>
    ),
  },
  {
    slug: "kundkommunikation-och-bokningsupplevelse",
    title: "Kundkommunikation och bokningsupplevelse",
    description: "Transparens och proaktiv kommunikation som ökar kundnöjdheten.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Kundkommunikation",
    image: fsKundkommunikationImg,
    content: (
      <>
        <p>
          <em>
            Den vanligaste klagomålet i fältservice är inte den tekniska lösningen — det är 
            kommunikationen. Field Service kundkommunikationsmodul skapar proaktiva, transparenta 
            kundupplevelser från bokning till avslutat jobb.
          </em>
        </p>

        <h2>Kundbokningsportal och tidsfönsterval</h2>
        <p>
          Kunder bokar servicetid via en självserviceportal med tillgängliga tidsfönster. 
          Realtidskalender visar teknikerens faktiska tillgänglighet — inga tomma löften 
          om tider som inte håller.
        </p>

        <h2>Proaktiva notifikationer och "on my way"</h2>
        <p>
          Automatiska SMS skickas vid jobbreservation, dagen innan besöket och när tekniker 
          är 30 minuter bort.
        </p>
        <p>
          Kunden ser teknikerns position på en karta i realtid — liksom Uber för service.
        </p>

        <h2>Kundunderskrift och digital feedback</h2>
        <p>
          Tekniker samlar in kundunderskrift på slutfört jobb direkt i appen. Omedelbart efter 
          avslutat besök skickas en kort NPS-enkät — svarsfrekvensen är markant högre 
          direkt efter besöket.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Anpassningsbara notifikationsmallar</li>
          <li>Flerspråkig kommunikation</li>
          <li>Integration med Outlook-kalender för kundbokning</li>
          <li>Möjlighet till direktsamtal med tekniker via appen</li>
        </ul>
      </>
    ),
  },
  {
    slug: "teknikerproduktivitet-och-prestationsmatning",
    title: "Teknikerproduktivitet och prestationsmätning",
    description: "Mät, förbättra och belöna fälttjänstexcellens med KPI:er i realtid.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Produktivitet & KPI",
    image: fsProduktivitetImg,
    content: (
      <>
        <p>
          <em>
            Fältservicechefer behöver tydliga KPI:er för att driva kontinuerlig förbättring. 
            Field Service Analytics ger en komplett bild av teknikerproduktivitet, servicekvalitet 
            och kostnadseffektivitet — per individ, team och region.
          </em>
        </p>

        <h2>Produktivitets-KPI:er i realtid</h2>
        <p>
          Dashboard visar i realtid: antal jobb per dag, genomsnittlig jobbtid, reseprocent, 
          first-time fix rate och kundnöjdhet per tekniker.
        </p>
        <p>
          Supervisorer ser omedelbart om en tekniker behöver stöd eller om ett team 
          överträffar sina mål.
        </p>

        <h2>Kostnadsanalys per jobb och kontraktstyp</h2>
        <p>
          Faktisk kostnad per jobb beräknas automatiskt (arbetstid, material, resekostnad) 
          och jämförs mot budgeterat. Olönsamma kontraktstyper identifieras.
        </p>

        <h2>Prestationsbaserade belöningsprogram</h2>
        <p>
          Teknikers prestationspoäng kan kopplas till bonusprogram. Transparenta KPI:er 
          skapar rättvisa och motivation.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Benchmarking mot branschstandarder (TSIA-data)</li>
          <li>Träningsbehov identifierat via prestandadata</li>
          <li>Geografisk analys av jobbdensitet</li>
          <li>Utrustningsspecifik felfrekvensanalys</li>
        </ul>
      </>
    ),
  },
  {
    slug: "hallbarhet-och-gron-faltservice",
    title: "Hållbarhet och grön fältservice",
    description: "Minska koldioxidavtrycket med AI-optimerade rutter och elfordonsstöd.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Hållbarhet & Miljö",
    image: fsHallbarhetImg,
    content: (
      <>
        <p>
          <em>
            Fältserviceoperationer med hundratals fordon i daglig rörelse har ett betydande 
            klimatavtryck. Field Service hållbarhetsmodul mäter, rapporterar och aktivt minskar 
            koldioxidutsläpp via intelligent ruttoptimering och elfordonsstöd.
          </em>
        </p>

        <h2>Koldioxidspårning och rapportering</h2>
        <p>
          Systemet beräknar koldioxidutsläpp per körning baserat på fordonstyp, bränsletyp 
          och körsträcka.
        </p>
        <p>
          Månadsvis koldioxidrapport genereras automatiskt för ESG-rapportering 
          — inga manuella beräkningar behövs.
        </p>

        <h2>Ruttoptimering för lägst utsläpp</h2>
        <p>
          RSO-algoritmen kan konfigureras för att prioritera lägst koldioxidavtryck (inte 
          bara kortast tid) vid optimering av teknikerscheman.
        </p>
        <p>
          Tradeoff-analys visar kostnaden i tid kontra miljövinsten, 
          så att ledningen kan fatta informerade beslut.
        </p>

        <h2>Elfordonsstöd och laddningsplanering</h2>
        <p>
          Elfordon kräver laddningsplanering som en del av schemaläggningen. Field Service 
          hanterar laddningsstopp, räckviddsberäkning och optimerar scheman med hänsyn 
          till batterikapacitet.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Flottmixanalys för elfordonsövergång</li>
          <li>Integration med laddningsstationsdata</li>
          <li>Målsättning och progress mot CO₂-reduktion</li>
          <li>Automatisk ESG-rapportering per kvartal</li>
        </ul>
      </>
    ),
  },
  {
    slug: "field-service-integration-med-finance-och-scm",
    title: "Field Service-integration med Finance och SCM",
    description: "Slut loopar från servicejobb till intäktsredovisning med sömlös integration.",
    product: "Dynamics 365 Field Service",
    productSlug: "d365-field-service",
    parentPath: "/d365-field-service/",
    parentLabel: "Dynamics 365 Field Service",
    headerLabel: "FS – Finance & SCM-integration",
    image: fsIntegrationImg,
    content: (
      <>
        <p>
          <em>
            Fältserviceoperationer genererar fakturor, förbrukar lager och driver garantikrav 
            — data som måste flöda sömlöst till Finance och Supply Chain. Den inbyggda integrationen 
            eliminerar manuell dataöverföring och säkerställer korrekt redovisning.
          </em>
        </p>

        <h2>Automatisk fakturering och intäktsredovisning</h2>
        <p>
          Avslutade serviceordrar genererar automatiskt fakturaunderlag i Finance baserat 
          på kontraktsvillkor: tid och material, fast pris eller abonnemang.
        </p>
        <p>
          Ingen manuell handpåläggning krävs för standardjobb — vilket sparar tid 
          och eliminerar felkällor.
        </p>

        <h2>Lagerintegrering med SCM</h2>
        <p>
          Reservdelsförbrukning i Field Service uppdaterar lagersaldon i Supply Chain Management 
          i realtid. Inköpsorder genereras automatiskt vid påfyllnadsbehov baserat på konsumtion.
        </p>

        <h2>Garantihantering och kreditnotor</h2>
        <p>
          Garantikrav hanteras som kreditnotor mot kund eller inköpskrav mot leverantör 
          — med automatisk koppling till Financial-modulen för korrekt redovisning.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Projektbaserad fakturering för komplexa serviceuppdrag</li>
          <li>Intercompany-fakturering vid regionöverskridande service</li>
          <li>Realtidskostnadsuppföljning per arbetsorder</li>
          <li>Integration med Treasury för valutahantering</li>
        </ul>
      </>
    ),
  },
];
