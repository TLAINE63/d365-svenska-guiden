import { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { DeepDiveArticle } from "./bcArticles";

import fsc01 from "@/assets/articles/fsc-01-konsolidering.png";
import fsc02 from "@/assets/articles/fsc-02-mrp.png";
import fsc03 from "@/assets/articles/fsc-03-fakturering.png";
import fsc04 from "@/assets/articles/fsc-04-wms.png";
import fsc05 from "@/assets/articles/fsc-05-commerce.png";
import fsc06 from "@/assets/articles/fsc-06-prismotorn.png";
import fsc07 from "@/assets/articles/fsc-07-hr-medarbetarresan.png";
import fsc08 from "@/assets/articles/fsc-08-hr-sjalvservice.png";
import fsc09 from "@/assets/articles/fsc-09-po-lonsamhet.png";
import fsc10 from "@/assets/articles/fsc-10-po-resursoptimering.png";

export const FSC_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "finansiell-konsolidering",
    title: "Finansiell konsolidering i realtid",
    description: "Hur Dynamics 365 Finance samlar alla juridiska enheter i en sanningskälla med automatisk intercompany-eliminering.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "Finance – Konsolidering",
    image: fsc01,
    content: (
      <>
        <p>
          <strong>I en multinationell organisation är finansiell konsolidering en av de mest komplexa och tidskrävande processerna.</strong> Dynamics 365 Finance förenklar detta radikalt genom automatisk intercompany-eliminering och realtidsrapportering.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">80%</p>
            <p className="text-sm text-muted-foreground">Minskning av manuellt arbete</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">Realtid</p>
            <p className="text-sm text-muted-foreground">Uppdatering av konsoliderade data</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">130+</p>
            <p className="text-sm text-muted-foreground">Valutor som stöds</p>
          </div>
        </div>

        <h2>Vad är finansiell konsolidering?</h2>
        <p>
          Konsolidering innebär att slå ihop bokföringen från flera juridiska enheter — dotterbolag, filialer, affärsenheter — till en sammanhållen rapport för koncernen. Traditionellt är detta en manuell process med Excel-filer, felkällor och fördröjningar på dagar eller veckor.
        </p>

        <h2>Intercompany-eliminering</h2>
        <p>
          En av de viktigaste funktionerna är automatisk eliminering av transaktioner mellan koncernbolag. Om Enhet A säljer till Enhet B ska denna intäkt och kostnad tas bort i konsoliderade siffrorna. Dynamics 365 hanterar detta regelbaserat — inga manuella justeringsposter behövs.
        </p>
        <p>
          Systemet stöder flera konsolideringsmetoder: proportionell konsolidering, kapitalandelsmetoden och fullständig konsolidering — allt konfigureras per enhet och period.
        </p>

        <h2>Valutaomräkning</h2>
        <p>
          Med verksamhet i flera länder krävs daglig valutaomräkning. Finance hämtar automatiskt valutakurser och tillämpar rätt omräkningsmetod (transaktionskurs, stängningskurs eller genomsnittskurs) per konto och enhet enligt IFRS och lokala GAAP-regler.
        </p>

        <h2>Dimensionsanalys i realtid</h2>
        <p>
          Finansiella dimensioner — som affärsenhet, kostnadsställe och projekt — flödar igenom hela konsolideringen. Ledningen kan borra ned i realtidsdata utan att vänta på månadsrapporter.
        </p>
        <ul>
          <li>Inbyggd Financial Reporter för interaktiva rapporter</li>
          <li>Power BI-integration för avancerad visualisering</li>
          <li>Automatiserade avvikelserapporter mot budget</li>
          <li>Revisionsspår för alla justeringsposter</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Dynamics 365 Finance?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "intelligent-lagerplanering-mrp",
    title: "Intelligent lagerplanering med MRP",
    description: "Master Resource Planning i Supply Chain Management – rätt vara på rätt plats i rätt tid.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "SCM – Lagerplanering",
    image: fsc02,
    content: (
      <>
        <p>
          <strong>Att ha rätt vara på rätt plats i rätt tid är kärnan i supply chain.</strong> MRP-motorn i Dynamics 365 SCM beräknar exakt vad som behöver köpas in eller tillverkas — och när — baserat på efterfrågan, lagernivåer och ledtider.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-25%</p>
            <p className="text-sm text-muted-foreground">Lagerbindning</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-40%</p>
            <p className="text-sm text-muted-foreground">Bristsituationer</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">98%</p>
            <p className="text-sm text-muted-foreground">Leveransprecision</p>
          </div>
        </div>

        <h2>Hur MRP fungerar</h2>
        <p>
          Material Requirements Planning analyserar aktuell lagernivå, bekräftade kundorder, prognoser och produktionsscheman för att beräkna nettobehov. Resultatet är föreslagna inköpsorder och produktionsorder med exakta datum och kvantiteter.
        </p>

        <h2>Planeringshorisonter och täckningsregler</h2>
        <p>
          Varje artikel konfigureras med en täckningsstrategi: krav-till-krav (make-to-order), minimax, fast orderkvantitet eller ekonomisk orderkvantitet (EOQ). Systemet respekterar ledtider, säkerhetslager och kalendrar automatiskt.
        </p>
        <p>
          Planning Optimization — Dynamics 365:s molnbaserade planeringsmotor — kan köra en fullständig MRP-beräkning för tusentals artiklar på minuter istället för timmar.
        </p>

        <h2>Efterfrågeprognoser med maskininlärning</h2>
        <p>
          Azure Machine Learning integreras direkt för att generera statistiska prognoser baserade på historisk försäljning, säsongsvariationer och externa faktorer. Planerare kan justera prognoserna manuellt och systemet lär sig av avvikelserna.
        </p>
        <ul>
          <li>Inbyggt stöd för DDMRP (Demand Driven MRP)</li>
          <li>Interaktiv planeringsarbetsyta för undantagshantering</li>
          <li>Realtidsintegration med lager, inköp och produktion</li>
          <li>ATP (Available to Promise) och CTP (Capable to Promise)</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Supply Chain Management?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "automatiserad-leverantorsfakturering",
    title: "Automatiserad leverantörsfakturering",
    description: "AI-driven OCR och godkännandeflöden i Dynamics 365 Finance för touchless-fakturering.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "Finance – Fakturering",
    image: fsc03,
    content: (
      <>
        <p>
          <strong>Leverantörsfakturering är en av de mest resurskrävande processerna i ekonomiavdelningen.</strong> Med AI-assisterad automatisering kan organisationer bearbeta 10 gånger fler fakturor med samma personalstyrka — från inkommen faktura till bokförd post på under 2 minuter.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">85%</p>
            <p className="text-sm text-muted-foreground">Touchless-rate</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">2 min</p>
            <p className="text-sm text-muted-foreground">Genomsnittlig cykeltid</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-60%</p>
            <p className="text-sm text-muted-foreground">Hanteringskostnad</p>
          </div>
        </div>

        <h2>Intelligent dokumenttolkning</h2>
        <p>
          Document Intelligence (AI Builder) extraherar automatiskt leverantörsnamn, fakturanummer, belopp, moms och radposter från inkomna PDF-fakturor — oavsett format. Noggrannheten överstiger 95% redan från start och förbättras kontinuerligt.
        </p>

        <h2>Trevägsmatchning</h2>
        <p>
          Systemet matchar automatiskt fakturan mot inköpsorder och produktinleveransen (trevägsmatchning). Om pris, kvantitet och leverantör stämmer överens godkänns fakturan utan manuell åtgärd.
        </p>
        <p>
          Toleransregler konfigureras per leverantör och belopp — en avvikelse på 2% på en liten faktura kräver inte samma godkännandeprocess som en avvikelse på 0,1% på en stor.
        </p>

        <h2>Godkännandeflöden och eskalering</h2>
        <p>
          Power Automate-flöden hanterar godkännandeprocesser med SLA-styrda eskaleringer. Godkännare får pushnotiser i Teams och kan godkänna direkt från mobilen utan att öppna systemet.
        </p>
        <ul>
          <li>Inbyggd bedrägeridetektion med anomalianalys</li>
          <li>Automatisk momsavstämning och rapportering</li>
          <li>Early Payment Discount-hantering</li>
          <li>Komplett revisionsspår för alla åtgärder</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Dynamics 365 Finance?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "lagerstyrning-wms",
    title: "Lagerstyrning med WMS",
    description: "Avancerad lagerhantering och plockoptimering med Warehouse Management System i Dynamics 365 SCM.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "SCM – Lagerstyrning",
    image: SupplyChainIcon,
    content: (
      <>
        <p>
          <strong>Warehouse Management System i Dynamics 365 SCM ger fullständig kontroll över lagerprocesser</strong> — från mottagning och inlagring till plockning, packning och leverans. Varje pall och låda spåras i realtid.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">99.9%</p>
            <p className="text-sm text-muted-foreground">Lagernoggrannhet</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">+30%</p>
            <p className="text-sm text-muted-foreground">Plockproduktivitet</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-50%</p>
            <p className="text-sm text-muted-foreground">Sökfeltid</p>
          </div>
        </div>

        <h2>Platsstyrd lagerhantering</h2>
        <p>
          WMS arbetar med en hierarkisk lagerstruktur: lagerställe → byggnad → gång → hylla → position. Varje artikel tilldelas en eller flera lagringsplatser baserat på artikel, dimension, vikt och omsättningshastighet (ABC-klassning).
        </p>

        <h2>Vågstyrda processer och RF-terminaler</h2>
        <p>
          Systemet genererar plocklistor baserade på order och lastuppbyggnad. Lageroperatörer får steg-för-steg-instruktioner på handhållna RF-terminaler eller glasögon. Klusterplockning optimerar rutter för att minimera förflyttning.
        </p>
        <p>
          License Plate (LP) tracking ger spårbarhet ner till pallnivå — varje förflyttning registreras med tid, användare och position.
        </p>

        <h2>Cross-docking och återfyllnad</h2>
        <p>
          Direktflöden (cross-dock) möjliggörs automatiskt när inkommande gods matchas mot väntande utleveranser. Systemet genererar återfyllnadsorder till plockzoner när tröskelnivåer underskrids.
        </p>
        <ul>
          <li>Stöd för catch-weight och variabla måttenheter</li>
          <li>Integrerat våghanteringssystem</li>
          <li>Containerisering och lastbyggnad</li>
          <li>Fullständig integration med TMS (Transport Management)</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Supply Chain Management?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "omnikanalhandel-commerce",
    title: "Omnikanalhandel med Commerce",
    description: "En sömlös kundupplevelse över alla kanaler med Dynamics 365 Commerce.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "Commerce – Omnikanal",
    image: CommerceIcon,
    content: (
      <>
        <p>
          <strong>Dynamics 365 Commerce samlar butik, webb och mobil i en plattform</strong> med en gemensam produktkatalog, prismotorn och kundprofil. Resultatet är konsekventa upplevelser och markant effektivare drift.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">360°</p>
            <p className="text-sm text-muted-foreground">Kundvy i alla kanaler</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">Realtid</p>
            <p className="text-sm text-muted-foreground">Lagersaldo alla kanaler</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">+22%</p>
            <p className="text-sm text-muted-foreground">Konverteringsökning</p>
          </div>
        </div>

        <h2>En plattform, alla kanaler</h2>
        <p>
          Traditionella detaljhandelsystem har separata databaser för fysisk butik och e-handel. Commerce löser detta med Commerce Scale Unit — en central dataplattform som synkar produkter, priser, lagersaldon och kunddata i realtid över alla kanaler.
        </p>

        <h2>Modern Point of Sale (MPOS/CPOS)</h2>
        <p>
          Commerce POS är en modern kassalösning som fungerar offline och synkroniserar när anslutning återupprättas. Kassörer ser hela kundhistoriken, kan reservera artiklar på andra butiker och genomföra köp-online-hämta-i-butik-flöden (BOPIS).
        </p>
        <p>
          Ship from Store är en inbyggd funktion som optimerar lagertillgänglighet och minskar leveranskostnader med upp till 30%.
        </p>

        <h2>E-handel med headless commerce</h2>
        <p>
          Commerce Sites Builder är ett drag-and-drop-verktyg för att skapa och hantera e-handelsupplevelser utan kod. För avancerade behov stöds headless-arkitektur med öppna API:er mot React/Next.js frontends.
        </p>
        <ul>
          <li>Personaliserade produktrekommendationer via Azure AI</li>
          <li>Dynamisk prissättning och kampanjmotorn</li>
          <li>Lojalitetsprogram med poäng, nivåer och belöningar</li>
          <li>Inbyggd SEO-optimering och A/B-testning</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Dynamics 365 Commerce?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "prismotorn-och-kampanjhantering",
    title: "Prismotorn och kampanjhantering",
    description: "Komplexa prisregler utan ett enda kalkylblad — realtidsprisberäkning i alla kanaler.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "Commerce – Prismotor",
    image: CommerceIcon,
    content: (
      <>
        <p>
          <strong>Priset är detaljhandelns mest kraftfulla verktyg.</strong> Dynamics 365 Commerce prismotorn hanterar miljontals prisuträkningar per dag med sub-millisekund svarstider — och replikerar kampanjförändringar i realtid till alla kanaler.
        </p>

        <h2>Prioriterad prisregelmotor</h2>
        <p>Prismotorn arbetar med prioriterade regler: kundspecifika priser slår kampanjpriser som slår prislistor som slår baslistpris. För varje köptillfälle beräknas bästa möjliga pris automatiskt baserat på kundens tillhörighet, tidpunkt och kanalval.</p>

        <h2>Kampanjtyper och kombinationsregler</h2>
        <p>Commerce stöder köp-N-betala-M, tröskelrabatter (köp för 500 kr — få 10 % rabatt), mix-och-matcha-kampanjer och kombinationsrabatter. Concurrency-regler styr om kampanjer kan kombineras eller om bästa priset väljs. Affinity-baserade kampanjer riktas mot kundsegment definierade i Customer Insights.</p>

        <h2>Realtidsuppdatering</h2>
        <p>Prisändringar och nya kampanjer publiceras omedelbart i Commerce Headquarters och replikeras till POS-terminaler, e-handelssajten och mobila kanaler på sekunder — inga nattliga prisuppdateringar behövs.</p>
        <ul>
          <li>Inbyggt stöd för clearance-prissättning och markdowns</li>
          <li>Automatiska prisaviseringar till kunder (önskelista)</li>
          <li>Kampanjkalender med schemalagd aktivering</li>
          <li>Komplett prissättningshistorik per artikel och kanal</li>
        </ul>

        <div className="mt-8 p-4 bg-secondary/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Tillbaka till produktsidan:</strong>{" "}
            <Link to="/finance-supply-chain/" className="text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "medarbetarresan-hr",
    title: "Medarbetarresan i Dynamics 365 HR",
    description: "Från rekrytering till pensionering i ett system – en komplett HCM-plattform.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "HR – Medarbetarresan",
    image: HRIcon,
    content: (
      <>
        <p>
          <strong>Dynamics 365 Human Resources är en komplett HCM-plattform</strong> som stöder hela medarbetarresan — från det första jobbannonsen till pensionering — med data-driven beslutsfattning och automation i varje steg.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-40%</p>
            <p className="text-sm text-muted-foreground">Time-to-hire</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">+35%</p>
            <p className="text-sm text-muted-foreground">Onboarding-NPS</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">98%</p>
            <p className="text-sm text-muted-foreground">Compliance-täckning</p>
          </div>
        </div>

        <h2>Integrerad rekrytering och onboarding</h2>
        <p>
          HR integreras med LinkedIn Talent Solutions och Attract för att hantera hela rekryteringsprocessen: jobbannonsering, kandidatspårning, intervjuplanering och erbjudandehantering. När anställningsbeslutet fattas triggas automatiskt onboarding-checklistan med arbetsuppgifter för HR, IT och närmsta chef.
        </p>

        <h2>Kompetensutveckling och utbildning</h2>
        <p>
          Kompetensmatriser kopplar roller till kompetenskrav. Medarbetare ser sina kompetensgap och kan anmäla sig till kurser direkt i Employee Self-Service. Integration med LinkedIn Learning ger tillgång till 16 000+ kurser — avslutade utbildningar uppdaterar automatiskt medarbetarens kompetensprofil.
        </p>

        <h2>Prestandahantering och succession</h2>
        <p>
          Mål kopplas till organisationens strategiska mål (OKR-stöd), nedbrutet på team och individ. Löpande feedback ersätter de traditionella årssamtalen.
        </p>
        <ul>
          <li>360-graders feedback och peer reviews</li>
          <li>Kompensationshantering kopplad till prestation</li>
          <li>Successionsplanering med high-potential-identifiering</li>
          <li>Avancerad people analytics med Power BI</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Dynamics 365 Human Resources?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "sjalvservice-chefer-medarbetare",
    title: "Självservice för chefer och medarbetare",
    description: "Eliminera HR-administration med Employee Self-Service och Manager Self-Service.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "HR – Självservice",
    image: HRIcon,
    content: (
      <>
        <p>
          <strong>Employee Self-Service och Manager Self-Service minskar HR-administrationens arbetsbörda med upp till 70%</strong> — medarbetare och chefer hanterar det dagliga utan att belasta HR-avdelningen, dygnet runt via mobil eller dator.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-70%</p>
            <p className="text-sm text-muted-foreground">HR-adminärenden</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">24/7</p>
            <p className="text-sm text-muted-foreground">Tillgänglighet</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">Mobile</p>
            <p className="text-sm text-muted-foreground">First-upplevelse</p>
          </div>
        </div>

        <h2>Vad kan medarbetaren göra själv?</h2>
        <p>
          ESS-portalen ger medarbetare direkt tillgång till sin personliga information, lönehistorik, förmåner och dokument. Vanliga ärenden hanteras helt utan HR-inblandning: ledighetsansökan, adressändring, bankkontouppgifter och signering av policydokument.
        </p>

        <h2>Chefsportalen MSS</h2>
        <p>
          Manager Self-Service ger chefer ett komplett team-dashboard: närvaro, ledighetskalender, prestationsstatus och kompensationsöversikt. Chefer kan godkänna ledigheter, starta kompensationsrevisioner och initiera positionsförändringar direkt i portalen.
        </p>
        <p>
          Microsoft Teams-integrationen gör att godkännanden kan hanteras direkt i Teams.
        </p>

        <h2>Chatbot och AI-assistans</h2>
        <p>
          En inbyggd AI-chatbot (Power Virtual Agents) svarar på vanliga HR-frågor som semesterdagar, föräldraledighetspolicy och pensionsregler — dygnet runt och på medarbetarens språk.
        </p>
        <ul>
          <li>Lönespecifikationer och skatteunderlag i PDF</li>
          <li>Utbildningshistorik och certifikatregister</li>
          <li>Benefits-val och öppen anmälning (open enrollment)</li>
          <li>Digital signering av anställningsavtal</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Dynamics 365 Human Resources?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "projektlonsamhet-realtid",
    title: "Projektlönsamhet i realtid",
    description: "Från offert till intäktsredovisning i Dynamics 365 Project Operations.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "Project Ops – Lönsamhet",
    image: ProjectOpsIcon,
    content: (
      <>
        <p>
          <strong>Project Operations förenar projektledning, resurshantering, tidrapportering och ekonomi i en plattform.</strong> Projektledare och ekonomichefer ser alltid samma siffror — i realtid — från offert till bokförd intäkt.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">Realtid</p>
            <p className="text-sm text-muted-foreground">P&L per projekt</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-45%</p>
            <p className="text-sm text-muted-foreground">Faktureringsfördröjning</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">+18%</p>
            <p className="text-sm text-muted-foreground">Marginalförbättring</p>
          </div>
        </div>

        <h2>Quote-to-Cash-processen</h2>
        <p>
          Project Operations täcker hela affärscykeln: offert med kostnadskalkyl, kontraktshantering med faktureringsmilepälar, leverans med tidrapportering, fakturering och slutligen intäktsredovisning. Varje steg är sammankopplat utan manuella dataöverföringar.
        </p>

        <h2>Tidrapportering och kostnadsredovisning</h2>
        <p>
          Konsulter rapporterar tid och utlägg direkt i Project Operations eller via mobilappen. Tid kopplas automatiskt till projektfas och uppgift. Intelligent tidsinregistrering med AI-förslag baserade på kalender, Teams-möten och tidigare tidrapporter minskar den administrativa bördan markant.
        </p>

        <h2>Intäktsredovisning enligt IFRS 15</h2>
        <p>
          Project Operations automatiserar intäktsredovisning enligt IFRS 15 och US GAAP: fast pris, tid och material eller milstolpebaserad redovisning. Revenue recognition schedules genereras och bokförs automatiskt.
        </p>
        <ul>
          <li>WBS (Work Breakdown Structure) med Gantt-diagram</li>
          <li>Riskhantering och change order-process</li>
          <li>Intercompany-projektfakturering</li>
          <li>Inbyggd integration med Microsoft Project</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Project Operations?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "resursoptimering-kapacitetsplanering",
    title: "Resursoptimering och kapacitetsplanering",
    description: "Rätt person på rätt projekt vid rätt tidpunkt med AI-matchning i Project Operations.",
    product: "Finance & Supply Chain",
    productSlug: "finance-supply-chain",
    parentPath: "/finance-supply-chain/",
    parentLabel: "Finance & Supply Chain Management",
    headerLabel: "Project Ops – Resursplanering",
    image: ProjectOpsIcon,
    content: (
      <>
        <p>
          <strong>I tjänsteföretag är medarbetarna den viktigaste resursen.</strong> Project Operations resursplanering balanserar efterfrågan och kapacitet med precision — och AI-matchning hittar rätt konsult för varje uppdrag på sekunder.
        </p>

        <div className="my-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">+12%</p>
            <p className="text-sm text-muted-foreground">Beläggningsgrad</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">-60%</p>
            <p className="text-sm text-muted-foreground">Planeringsfördröjning</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-2xl font-bold text-primary">AI</p>
            <p className="text-sm text-muted-foreground">Matchning av resurser</p>
          </div>
        </div>

        <h2>Resursplanering och bokning</h2>
        <p>
          Project Operations använder en rollbaserad resursmodell: projektledaren definierar behovet (senior konsult, 40h, vecka 12–14) och resurschefen matchar mot tillgängliga resurser. Bokningar kan vara hård (confirmed) eller mjuk (tentativ) med automatisk notifiering vid konflikter.
        </p>

        <h2>Kompetensbaserad matchning</h2>
        <p>
          AI-motorn matchar projektbehov mot kompetensprofiler, certifieringsnivåer, plats, preferenser och befintliga åtaganden. Resurschefen får en rankad lista av kandidater med förklaring till matchningen — och kan boka med ett klick.
        </p>
        <p>
          Universal Resource Scheduling (URS) används som planeringsmotor.
        </p>

        <h2>Kapacitetsplanering och prognos</h2>
        <p>
          Resurschefer ser rullande kapacitetsprognoser 4–12 veckor framåt med trafiklus-indikatorer för under-, normal- och överbeläggning. Gap-analyser triggar rekryteringsbeslut eller initiering av sub-contractor-processer.
        </p>
        <ul>
          <li>Tidsregistrering i mobil med offline-stöd</li>
          <li>Semesterkalendar och frånvarohantering integrerat</li>
          <li>Lönsamhetsanalys per resurs och kompetens</li>
          <li>Integration med LinkedIn och externa resurspooler</li>
        </ul>

        <div className="my-10 p-8 bg-secondary/50 rounded-xl text-center border border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Vill du veta mer om Project Operations?</h3>
          <p className="text-muted-foreground mb-4">
            Läs mer om licenspriser och hitta en certifierad partner.
          </p>
          <p>
            <Link to="/finance-supply-chain/" className="font-semibold text-primary hover:underline">
              Till Finance & Supply Chain-sidan →
            </Link>
          </p>
        </div>
      </>
    ),
  },
];
