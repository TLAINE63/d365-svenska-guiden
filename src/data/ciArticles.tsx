import { Link } from "react-router-dom";
import type { DeepDiveArticle } from "./bcArticles";

import ci01 from "@/assets/articles/ci-01-kundprofil.png";
import ci02 from "@/assets/articles/ci-02-segmentering.png";
import ci03 from "@/assets/articles/ci-03-churn.png";
import ci04 from "@/assets/articles/ci-04-clv.png";
import ci05 from "@/assets/articles/ci-05-personalisering.png";
import ci06 from "@/assets/articles/ci-06-journeys.png";
import ci07 from "@/assets/articles/ci-07-gdpr.png";
import ci08 from "@/assets/articles/ci-08-roi.png";
import ci09 from "@/assets/articles/ci-09-b2b.png";
import ci10 from "@/assets/articles/ci-10-api.png";

import ci01banner from "@/assets/articles/ci-01-kundprofil-banner.png";
import ci02banner from "@/assets/articles/ci-02-segmentering-banner.png";
import ci03banner from "@/assets/articles/ci-03-churn-banner.png";
import ci04banner from "@/assets/articles/ci-04-clv-banner.png";
import ci05banner from "@/assets/articles/ci-05-personalisering-banner.png";
import ci06banner from "@/assets/articles/ci-06-journeys-banner.png";
import ci07banner from "@/assets/articles/ci-07-gdpr-banner.png";
import ci08banner from "@/assets/articles/ci-08-roi-banner.png";
import ci09banner from "@/assets/articles/ci-09-b2b-banner.png";
import ci10banner from "@/assets/articles/ci-10-api-banner.png";

export const CI_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "den-enhetliga-kundprofilen",
    title: "Den enhetliga kundprofilen",
    description: "Bryt datasilor och skapa en 360-gradersvy av varje kund med Customer Insights.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – Enhetlig kundprofil",
    image: ci01banner,
    bannerImage: ci01banner,
    content: (
      <>
        <p>
          <em>
            De flesta organisationer har kunddata utspridd i CRM, ERP, e-handel, support 
            och lojalitetssystem. Customer Insights sammanfogar dessa till en enda, rik 
            kundprofil i realtid.
          </em>
        </p>

        <h2>Identity resolution och profilsammanslagning</h2>
        <p>
          Customer Insights identifierar och sammanfogar dubbletter från olika system med hjälp 
          av deterministisk och probabilistisk matchning.
        </p>
        <p>
          E-postadress, telefonnummer, kundnummer och beteendesignaler vägs samman för att 
          skapa en unik Golden Record per kund.
        </p>

        <h2>Datainmatning från 200+ källor</h2>
        <p>
          Inbyggda kopplingar till Salesforce, SAP, Adobe, Shopify, Mailchimp, Azure SQL 
          och hundratals andra system. Data importeras via batch eller realtidsströmmar 
          med automatisk datakvalitetskontroll.
        </p>

        <h2>Beräknade mätvärden och kundattribut</h2>
        <p>
          Utöver rådata beräknas rika attribut: livstidsvärde (CLV), köpfrekvens, 
          produktpreferenser och churn-risk.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Automatisk segmentering baserad på beteende</li>
          <li>Prediktiva poäng för nästa köp och churn</li>
          <li>API för realtidsprofilåtkomst</li>
          <li>Inbyggt dataintegritetsskydd (GDPR)</li>
        </ul>
      </>
    ),
  },
  {
    slug: "ai-driven-segmentering",
    title: "AI-driven segmentering",
    description: "Från statiska listor till dynamiska microsegment med prediktiv AI.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – AI-segmentering",
    image: ci02banner,
    bannerImage: ci02banner,
    content: (
      <>
        <p>
          <em>
            Traditionell segmentering baseras på enkla demografiska filter. Customer Insights AI 
            bygger prediktiva segment som uppdateras automatiskt baserat på realtidsbeteende 
            — och hittar mönster ingen människa skulle se.
          </em>
        </p>

        <h2>Segment Builder och naturspråk</h2>
        <p>
          Marknadsteam skapar segment med ett intuitivt visuellt verktyg eller via naturspråksfrågor: 
          "Kunder som köpt sneakers de senaste 90 dagarna men inte besökt sajten på 30 dagar."
        </p>
        <p>
          Inga SQL-kunskaper krävs — systemet tolkar frågan och bygger segmentet automatiskt.
        </p>

        <h2>Prediktiva och beteendebaserade segment</h2>
        <p>
          AI-segmentering identifierar kunder med hög churn-risk, hög CLV-potential eller 
          benägenhet att köpa en specifik produktkategori — baserat på hundratals beteendesignaler.
        </p>

        <h2>Aktivering i alla kanaler</h2>
        <p>
          Segment aktiveras direkt mot Dynamics 365 Marketing, e-postplattformar, betald 
          annonsering (Facebook, Google) och CDP-integrationer.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Segment-överlappsanalys för kanalkoordinering</li>
          <li>Lookalike-segmentering för prospektering</li>
          <li>Automatisk segmentuppdatering i realtid</li>
          <li>A/B-testning av segmentrespons</li>
        </ul>
      </>
    ),
  },
  {
    slug: "churnprediktion-och-retention",
    title: "Churn-prediktion och retention",
    description: "Identifiera kunder på väg att lämna — innan det händer.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – Churn-prediktion",
    image: ci03banner,
    bannerImage: ci03banner,
    content: (
      <>
        <p>
          <em>
            Det kostar 5–7 gånger mer att skaffa en ny kund än att behålla en befintlig. 
            Customer Insights churn-modell identifierar riskkunderna i god tid för proaktiva 
            retentionsåtgärder.
          </em>
        </p>

        <h2>Automatisk churn-modellträning</h2>
        <p>
          Modellen tränas automatiskt på din organisations historik — vilka kunder lämnade, 
          vilka stannade, och vilka beteendesignaler föregick avhoppen.
        </p>
        <p>
          Modellen uppdateras kontinuerligt och förbättras med mer data — 
          utan manuell intervention.
        </p>

        <h2>Riskfaktorer och förklaring</h2>
        <p>
          Varje churn-poäng kompletteras med förklaring: "Hög risk p.g.a. minskad köpfrekvens, 
          inget svar på senaste kampanj, öppnat support-ärende."
        </p>
        <p>
          Kundtjänst och account managers kan agera med rätt budskap baserat 
          på de specifika riskfaktorerna.
        </p>

        <h2>Retentionsautomation</h2>
        <p>
          Kunder med hög churn-risk kan automatiskt ingå i retentionsflöden: proaktivt samtal, 
          specialerbjudande eller personligt brev från account manager.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Segmentering per churn-risknivå (låg/medium/hög)</li>
          <li>Win-back-flöden för förlorade kunder</li>
          <li>ROI-mätning per retentionsåtgärd</li>
          <li>Integration med Customer Service för proaktivt stöd</li>
        </ul>
      </>
    ),
  },
  {
    slug: "customer-lifetime-value-modellering",
    title: "Customer Lifetime Value-modellering",
    description: "Investera i de kunder som driver långsiktig tillväxt med prediktiv CLV.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – CLV-modellering",
    image: ci04banner,
    bannerImage: ci04banner,
    content: (
      <>
        <p>
          <em>
            Inte alla kunder är lika lönsamma. CLV-modellering i Customer Insights identifierar 
            de kunder som har störst framtida värde — och hjälper organisationen att allokera 
            resurser dit de ger bäst avkastning.
          </em>
        </p>

        <h2>Historisk och prediktiv CLV</h2>
        <p>
          Customer Insights beräknar både historisk CLV (vad kunden hittills genererat) 
          och prediktiv CLV (vad kunden förväntas generera de närmaste 12 månaderna).
        </p>
        <p>
          Prediktionen uppdateras kontinuerligt med ny köpdata — så att segmenteringen 
          alltid är aktuell.
        </p>

        <h2>CLV-segmentering och prioritering</h2>
        <p>
          Kunder segmenteras i CLV-kvartiler: Champions (topp 25 %), Growth (25–50 %), 
          Risk (50–75 %) och Low Value (botten 25 %).
        </p>
        <p>
          Varje segment kräver en helt annan strategi och kommunikation — Champions 
          ska behållas, Growth ska utvecklas.
        </p>

        <h2>CLV-driven kanalallokering</h2>
        <p>
          Integrationen med marknadsföringsverktyg möjliggör budgetallokering baserad på CLV: 
          investera mer i att behålla Champions och driva tillväxt hos Growth-segment.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Produktrekommendationer baserade på CLV</li>
          <li>Förvärvsoptimering med CLV som målvariabel</li>
          <li>Kundservice-prioritering per CLV-nivå</li>
          <li>Automatisk eskalering av Champions till VIP-program</li>
        </ul>
      </>
    ),
  },
  {
    slug: "realtidspersonalisering",
    title: "Realtidspersonalisering",
    description: "Varje kundinteraktion skräddarsydd i millisekunder med realtids-API.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – Personalisering",
    image: ci05banner,
    bannerImage: ci05banner,
    content: (
      <>
        <p>
          <em>
            Kunder förväntar sig relevanta upplevelser i varje kontaktpunkt. Customer Insights 
            realtids-API levererar personaliserade produktrekommendationer, erbjudanden och innehåll 
            på under 50 millisekunder — vid varje webbesök, app-öppning och kassainteraktion.
          </em>
        </p>

        <h2>Realtids-API och händelsedrivet</h2>
        <p>
          Customer Insights erbjuder ett REST API som kan anropas vid varje kundinteraktion. 
          Vid webbbesök skickas kundens profil-ID och API:et returnerar personaliserade 
          produktrekommendationer och anpassade erbjudanden.
        </p>
        <p>
          Allt baseras på realtidsprofilen — så att rekommendationerna reflekterar 
          kundens senaste beteende.
        </p>

        <h2>Rekommendationsmodeller</h2>
        <p>
          Inbyggda rekommendationsmodeller inkluderar: Collaborative Filtering 
          (kunder som du köpte också…), Content-Based (baserat på produktattribut) och Hybrid.
        </p>
        <p>
          Modellerna tränas automatiskt på köphistorik och kräver ingen manuell 
          datascience-insats.
        </p>

        <h2>Personalisering på alla kanaler</h2>
        <p>
          Samma realtidsprofil driver personaliseringen i webbshop, mobilapp, e-post, 
          SMS och i kassasystemet.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>A/B-testning av rekommendationsmodeller</li>
          <li>Kontextuell personalisering (enhet, tid, plats)</li>
          <li>Regelbaserade filter (undanta överkategorier)</li>
          <li>Mätning av personaliserings-lift per kanal</li>
        </ul>
      </>
    ),
  },
  {
    slug: "journeys-och-kundreseautomation",
    title: "Journeys och kundreseautomation",
    description: "Orkestrering av kundupplevelser baserade på realtidsbeteende.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – Journey Automation",
    image: ci06banner,
    bannerImage: ci06banner,
    content: (
      <>
        <p>
          <em>
            Rätt budskap, rätt kanal, rätt tidpunkt — det är löftet med journey automation. 
            Customer Insights Journeys orkestrerar automatiserade kundresor som reagerar på 
            verkliga beteenden i realtid.
          </em>
        </p>

        <h2>Trigger-baserade realtidsjourneys</h2>
        <p>
          En journey startas automatiskt när kunden utför en specifik handling: fyller i 
          ett formulär, överger en varukorg, öppnar ett supportärende eller når en ny CLV-nivå.
        </p>
        <p>
          Systemet reagerar på sekunder och levererar rätt kommunikation — 
          inte dagar senare som i traditionella batch-utskick.
        </p>

        <h2>Journey Canvas och No-Code-byggare</h2>
        <p>
          Marknadsförare bygger komplexa multikanal-journeys i ett visuellt canvas med 
          drag-and-drop. Grenar baseras på kundbeteende, profilattribut och AI-baserade 
          beslutspunkter.
        </p>

        <h2>Kanalkoordinering och undertryckning</h2>
        <p>
          Systemet koordinerar automatiskt utskick för att undvika att samma kund bombas 
          från alla kanaler simultant. Frequency Capping och Quiet Hours respekteras globalt.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>E-post, SMS, push-notiser och WhatsApp</li>
          <li>A/B-testning av journey-varianter</li>
          <li>Sankey-diagram för journey-prestanda</li>
          <li>Integration med Microsoft Teams för B2B-journeys</li>
        </ul>
      </>
    ),
  },
  {
    slug: "gdpr-och-datastyrning",
    title: "GDPR och datastyrning",
    description: "Bygg kundförtroende med inbyggd dataintegritet och samtyckehantering.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – GDPR & Compliance",
    image: ci07banner,
    bannerImage: ci07banner,
    content: (
      <>
        <p>
          <em>
            Kunddata är organisationens mest värdefulla tillgång — och dess största ansvar. 
            Customer Insights hanterar samtycke, rättighetsförfrågningar och dataminimering 
            inbyggt, utan externa lösningar.
          </em>
        </p>

        <h2>Samtyckehantering och preferenscentrum</h2>
        <p>
          Customer Insights håller spår på alla samtycken med källa, datum och kanal. 
          Preferenscentret ger kunder full kontroll över sin data och kommunikationspreferenser.
        </p>
        <p>
          Samtyckesstatus synkroniseras i realtid till alla kampanjsystem — 
          så att inga utskick sker i strid med kundens val.
        </p>

        <h2>Data Subject Rights (DSR)</h2>
        <p>
          Förfrågningar om åtkomst, rättelse och radering hanteras via ett inbyggt arbetsflöde. 
          Systemet identifierar automatiskt all data kopplad till en individ.
        </p>
        <p>
          Svarspaket genereras inom juridiskt krävd tid — utan manuell dataletning 
          i multipla system.
        </p>

        <h2>Dataminimering och retention-policyer</h2>
        <p>
          Automatiska retention-regler raderar eller anonymiserar data efter definierade perioder. 
          Data Residency-inställningar säkerställer att kunddata lagras i rätt geografisk region.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Automatisk dataklassificering</li>
          <li>Audit trail för alla dataåtkomster</li>
          <li>Privacy Impact Assessment-stöd</li>
          <li>Integration med Microsoft Purview för datastyrning</li>
        </ul>
      </>
    ),
  },
  {
    slug: "matning-av-marknadsforing-roi",
    title: "Mätning av marknadsförings-ROI",
    description: "Attributionsmodeller som visar vad som faktiskt driver intäkter.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – Marketing ROI",
    image: ci08banner,
    bannerImage: ci08banner,
    content: (
      <>
        <p>
          <em>
            Marknadsförare kämpar med att bevisa sitt värde. Customer Insights attributionsmodeller 
            kopplar ihop marknadsföringsaktiviteter med faktiska affärsresultat — bortom sista-klick 
            och vanity metrics.
          </em>
        </p>

        <h2>Multi-touch attributionsmodeller</h2>
        <p>
          Systemet erbjuder First Touch, Last Touch, Linear, Time Decay och Data-Driven Attribution.
        </p>
        <p>
          Data-Driven Attribution använder maskininlärning för att fördela intäktskrediten 
          till de kontaktpunkter som faktiskt påverkade köpbeslutet — inte bara den sista.
        </p>

        <h2>Kampanjmätning och experiment</h2>
        <p>
          Varje journey och kampanj kopplas till affärsmål: intäkt, leads, lojalitetspunkter. 
          Kontrollgrupper möjliggör äkta kausal mätning av kampanjeffekten.
        </p>

        <h2>Marknadsföringsbudget-optimering</h2>
        <p>
          Baserat på attributionsdata kan systemet simulera hur omfördelning av budget 
          mellan kanaler påverkar det förväntade intäktsresultatet.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Intäktsmätning per kanal, segment och kampanj</li>
          <li>Kohortanalys för kundanskaffningskostnader (CAC)</li>
          <li>LTV:CAC-ratio per förvärvskälla</li>
          <li>Automatisk kampanjrapport till ledningen</li>
        </ul>
      </>
    ),
  },
  {
    slug: "b2b-kundinsikter-och-kontobaserat",
    title: "B2B-kundinsikter och kontobaserat",
    description: "Account-level intelligence för enterprise-kunder med ABM-integration.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – B2B & ABM",
    image: ci09banner,
    bannerImage: ci09banner,
    content: (
      <>
        <p>
          <em>
            I B2B-försäljning är det hela organisationer — inte enskilda individer — som är kunderna. 
            Customer Insights B2B-läge bygger kontoprofiler som aggregerar alla kontakters beteenden 
            till kontonivå för en komplett bild av köparorganisationen.
          </em>
        </p>

        <h2>Kontoprofiler och hierarkier</h2>
        <p>
          Kontoprofilen aggregerar alla individers aktiviteter, köp och engagemang till kontonivå.
        </p>
        <p>
          Moderbolag-dotterbolag-hierarkier hanteras automatiskt för korrekt global kontoöversikt 
          — viktigt för enterprise-kunder med komplexa strukturer.
        </p>

        <h2>Intent data och köpsignaler</h2>
        <p>
          Integration med externa intent-data-leverantörer (Bombora, G2) visar när en kund 
          aktivt forskar kring lösningar inom din kategori — ett starkt köpsignal för säljteamet.
        </p>

        <h2>ABM-integration och kontobaserad marknadsföring</h2>
        <p>
          Customer Insights B2B driver account-based marketing med personaliserade 
          multikanalskampanjer riktade mot specifika konton och roller.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Whitespace-analys per konto</li>
          <li>Korsförsäljnings- och upsell-rekommendationer</li>
          <li>Automatisk varning vid intentionsökning</li>
          <li>Integration med Dynamics 365 Sales för säljkoordinering</li>
        </ul>
      </>
    ),
  },
  {
    slug: "oppna-apier-och-ekosystemintegration",
    title: "Öppna API:er och ekosystemintegration",
    description: "Customer Insights som navet i din dataplattform med 200+ kopplingar.",
    product: "Dynamics 365 Customer Insights",
    productSlug: "d365marketing",
    parentPath: "/d365marketing/",
    parentLabel: "Customer Insights (Marketing)",
    headerLabel: "CI – API & Integration",
    image: ci10banner,
    bannerImage: ci10banner,
    content: (
      <>
        <p>
          <em>
            Customer Insights är inte ett isolerat system — det är navet i din kunddata-arkitektur. 
            Öppna API:er, Azure-integration och ett rikt partnerekosystem gör det enkelt att koppla 
            ihop befintliga och framtida system.
          </em>
        </p>

        <h2>Dataverse och Microsoft-ekosystemet</h2>
        <p>
          Customer Insights är byggt på Microsoft Dataverse, vilket innebär inbyggd integration 
          med Dynamics 365 Sales, Customer Service, Marketing och Power Platform.
        </p>
        <p>
          Ingen separat API-koppling eller dataduplikation behövs — allt delar samma 
          underliggande dataplattform.
        </p>

        <h2>Azure Synapse och Data Factory</h2>
        <p>
          För avancerade analytik-behov strömmar Customer Insights data till Azure Synapse 
          Analytics via Azure Data Factory.
        </p>
        <p>
          Datascientister kan arbeta med rådata i Synapse och skicka tillbaka modellresultat 
          till Customer Insights — en komplett feedback-loop.
        </p>

        <h2>Tredjepartsintegrationer och ISV-ekosystem</h2>
        <p>
          AppSource-marknadsplatsen innehåller hundratals certifierade integrationslösningar 
          för marknadsföring, e-handel och lojalitet.
        </p>

        <h3>Viktiga funktioner</h3>
        <ul>
          <li>Power Apps för kundvända applikationer</li>
          <li>Power Automate för automatiserade dataflöden</li>
          <li>Azure Machine Learning för anpassade AI-modeller</li>
          <li>Real-time API för webb- och app-personalisering</li>
        </ul>
      </>
    ),
  },
];
