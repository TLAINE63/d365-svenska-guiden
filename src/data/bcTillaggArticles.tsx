import { Link } from "react-router-dom";
import type { DeepDiveArticle } from "./bcArticles";
import { getComparisonsForArticle } from "./isvComparisons";

const CompareLinks = ({ articleSlug }: { articleSlug: string }) => {
  const comparisons = getComparisonsForArticle(articleSlug);
  if (comparisons.length === 0) return null;
  return (
    <aside className="comparison-links my-10 p-6 rounded border border-border bg-card not-prose">
      <h3 className="text-base font-semibold text-foreground mb-1">Jämför lösningar</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Sida vid sida – vad respektive lösning är, när den passar och vilka BC-partners som är offentligt
        kopplade.
      </p>
      <ul className="space-y-2 text-sm">
        {comparisons.map((c) => (
          <li key={c.slug}>
            <Link to={`/compare/${c.slug}/`} className="text-primary font-medium hover:underline">
              {c.title} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};



const Disclaimer = () => (
  <aside className="my-8 p-5 rounded border-l-4 border-muted bg-muted/30 not-prose">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      Om terminologin
    </p>
    <p className="text-sm leading-relaxed text-foreground/80">
      Vi skriver medvetet <em>"offentligt listad av ISV:n som partner"</em> snarare än
      <em> "auktoriserad återförsäljare"</em>. Aktuell partnerstatus, certifieringsnivå, version
      och svensk lokalisering bör alltid verifieras direkt med ISV:n och er BC-partner inför en affär.
    </p>
  </aside>
);

const BackToOverview = () => (
  <p className="mt-8 text-sm">
    ←{" "}
    <Link to="/kunskapscenter/business-central-tillagg/" className="text-primary underline hover:text-primary/80">
      Tillbaka till översikten: BC-tilläggsapplikationer (ISV)
    </Link>
  </p>
);

const CTA = () => (
  <div className="my-10 p-8 bg-secondary/50 rounded text-center border border-border not-prose">
    <h3 className="text-xl font-bold text-foreground mb-2">Vill ni jämföra BC-partners för detta tillägg?</h3>
    <p className="text-muted-foreground mb-4">
      Många BC-partners är specialiserade på vissa ISV-lösningar. Vi hjälper er hitta partners som matchar er
      kombination av bransch, processer och tilläggsbehov.
    </p>
    <p>
      <Link to="/businesscentral#partners" className="font-semibold text-primary hover:underline">
        Hitta Business Central-partners → d365.se/businesscentral#partners
      </Link>
    </p>
  </div>
);

const PartnerList = ({ source, partners }: { source: string; partners: string[] }) => (
  <>
    <p><strong>BC-partners offentligt listade av {source} (urval):</strong></p>
    <ul>
      {partners.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  </>
);

const Lead = ({ children }: { children: React.ReactNode }) => (
  <p className="text-lg md:text-xl leading-[1.7] text-foreground font-light mb-8 not-prose">
    {children}
  </p>
);

export const BC_TILLAGG_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "tillagg-fakturahantering",
    headerLabel: "BC-tillägg – Fakturahantering",
    title: "Fakturahantering & AP Automation i Business Central",
    description:
      "Välj mellan Continia och ExFlow (Truvio) – de två ledande lösningarna i Sverige. Skillnaden avgör hur mycket du automatiserar och hur processen styrs i BC.",
    seoTitle: "Fakturahantering i Business Central – Continia vs ExFlow",
    seoDescription:
      "Jämför Continia och ExFlow – de två ledande lösningarna för leverantörsfakturor i Business Central i Sverige. Se skillnader, use cases och vilket val som passar bäst.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          Två lösningar dominerar svenska BC-affärer: <strong>Continia</strong> och
          <strong> ExFlow (Truvio)</strong>.
        </Lead>
        <p>
          Båda är byggda inuti Business Central och hanterar fakturaflödet – från inläsning och
          tolkning till attest, kontering och betalning – direkt i BC.
        </p>
        <Disclaimer />

        <h2>Continia</h2>
        <p>
          Continias svit för BC omfattar Document Capture, Expense Management, Document Output,
          Banking/Payment, Collection Management, Continia Finance och OPplus.
        </p>
        <p>
          Continia har egen partnerkatalog med filter för Sverige och anger att certifierade
          Continia-partners också är officiella Business Central-partners.
        </p>
        <PartnerList
          source="Continia"
          partners={[
            "Evidi / NaviPro",
            "NAB Solutions",
            "JMA",
            "Flank Speed",
            "dizparc Värnamo ERP",
            "Navet / Aderian",
            "Programekonomi",
          ]}
        />

        <h2>ExFlow (Truvio)</h2>
        <p>
          Svensk ISV med stark BC- och F&amp;O-närvaro. ExFlow täcker AP Automation, Data Capture,
          Travel &amp; Expense samt E-invoicing och är byggt direkt i BC.
        </p>
        <PartnerList
          source="Truvio"
          partners={[
            "NAB Solutions",
            "Mibusoft",
            "4PS by Hilti",
            "Implema",
            "Fellowmind",
            "Niedall",
            "Sherpas",
            "Yellow Solution",
            "THINKNINE",
          ]}
        />

        <h2>När är det relevant?</h2>
        <p>
          När volymen leverantörsfakturor och attestkedjor gör manuell hantering i BC kostsam.
        </p>
        <p>
          Eller när ni behöver starkare stöd för Peppol, e-faktura samt kvitto- och
          reseräkningshantering än vad standard-BC ger.
        </p>

        <CompareLinks articleSlug="tillagg-fakturahantering" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-svensk-lokalisering",
    headerLabel: "BC-tillägg – Lokalisering",
    title: "Svensk lokalisering i Business Central",
    description:
      "Swebase (Aritma) och SmartApps är standard i svenska BC-projekt. De kompletterar moms, betalningar och ekonomiflöden som inte täcks av standard.",
    seoTitle: "Svensk moms & lokalisering i Business Central – Swebase vs SmartApps",
    seoDescription:
      "Vilka tillägg behövs för svensk moms och ekonomi i Business Central? Jämför Swebase och SmartApps och se vad som krävs i svenska implementationer.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          För många bolag räcker BC:s standardfunktionalitet långt. När den inte gör det är de
          vanligaste tilläggen <strong>Swebase</strong> och <strong>Smart Swedish VAT</strong>.
        </Lead>
        <Disclaimer />

        <h2>Swebase (Programekonomi)</h2>
        <p>
          Svensk BC/NAV-extension för svenska marknadens krav och praktiska ekonomifunktioner
          som ofta saknas i standard.
        </p>
        <p>Programekonomi är leverantör av lösningen.</p>

        <h2>Smart Swedish VAT (SmartApps)</h2>
        <p>Specifikt tillägg för svensk momsrapportering.</p>
        <p>
          SmartApps har även bredare BC-tillägg som Eagle, Spider, Parrot och StoryPoint med
          svenskt/nordiskt stöd.
        </p>
        <p>
          NAB Solutions är huvudutgivare. Övriga BC-partners kan ofta leverera när de samarbetar
          med NAB/SmartApps.
        </p>

        <h2>När är det relevant?</h2>
        <ul>
          <li>När ni har komplex svensk moms (omvänd skattskyldighet, EU-handel, OSS).</li>
          <li>När ni behöver specifika svenska ekonomi- eller rapportflöden.</li>
          <li>När ni vill minimera anpassningar i kärnsystemet.</li>
        </ul>

        <CompareLinks articleSlug="tillagg-svensk-lokalisering" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-wms-lager",
    headerLabel: "BC-tillägg – WMS",
    title: "WMS, lager & handdatorer för Business Central",
    description:
      "Tasklet används för interna lager medan Ongoing används vid 3PL. Valet avgör om lagret körs i BC eller som extern lösning.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          <strong>Tasklet Mobile WMS</strong> är den etablerade WMS-lösningen för BC/NAV med ett
          brett partnernät.
        </Lead>
        <p>
          För handels- och lagerbolag med extern 3PL är även <strong>Ongoing WMS</strong> via
          Golden EDI:s connector ett vanligt val.
        </p>
        <Disclaimer />

        <h2>Tasklet Mobile WMS</h2>
        <p>
          Handdatorlösning för plock, pack, inleverans, omlagring och inventering.
        </p>
        <p>
          Tasklet anger globalt partnernät i 40+ länder och filtrering på Sverige + Business
          Central.
        </p>
        <PartnerList
          source="Tasklet"
          partners={[
            "Adbriq",
            "Aderian Navet",
            "Azets Sweden",
            "Basecloud",
            "Bedege",
            "Bisqo",
            "COSMO CONSULT Sweden",
            "THINKNINE",
            "TietoEVRY Sweden",
            "Programekonomi",
            "twoday",
          ]}
        />

        <h2>Ongoing WMS (via Golden EDI)</h2>
        <p>
          Relevant när lagerdriften ligger hos 3PL eller när ni vill köra ett separat WMS-system
          parallellt med BC.
        </p>
        <p>Integration sker via Golden EDI:s connector.</p>

        <h2>När är det relevant?</h2>
        <ul>
          <li>När lagervolym, antal artiklar eller plockfrekvens överstiger vad standard-BC klarar effektivt.</li>
          <li>När ni behöver streckkods- och handdatorflöden i lagerprocessen.</li>
        </ul>

        <CompareLinks articleSlug="tillagg-wms-lager" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-edi-efaktura",
    headerLabel: "BC-tillägg – EDI",
    title: "EDI & e-faktura för Business Central",
    description:
      "Golden EDI är standard i svenska BC-affärer och används för att koppla kunder, leverantörer och 3PL via EDI och integrationsflöden.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          De vanligaste valen i svenska BC-affärer är <strong>Golden EDI</strong>,
          <strong> TrueCommerce EDI</strong>, <strong>Peppol720</strong> och
          <strong> Continia e-dokument</strong>.
        </Lead>
        <Disclaimer />

        <h2>Golden EDI</h2>
        <p>
          Svensk/nordisk lösning för EDI, e-faktura och integrationer.
        </p>
        <p>
          Business Central Hub samt Ongoing WMS Connector är två centrala komponenter. Levereras
          direkt eller via BC-partners.
        </p>

        <h2>TrueCommerce EDI for Business Central</h2>
        <p>
          Relevant för bolag med större handelsflöden, EDI-meddelanden och trading partners.
        </p>
        <p>Sverige ingår i EU-erbjudandet. Partner verifieras per land.</p>

        <h2>Peppol720 (ON720.COM)</h2>
        <p>
          AppSource-produkt för att skicka och ta emot elektroniska dokument via Peppol med
          Sverige som stödd marknad.
        </p>
        <p>Direkt- eller partnerkanal verifieras per affär.</p>

        <h2>Continia e-dokument</h2>
        <p>
          Ingår i Continias svit och är ett naturligt val om ni redan kör Continia Document
          Capture eller Document Output.
        </p>

        <h2>När är det relevant?</h2>
        <ul>
          <li>När ni har återkommande EDI-flöden (ordrar, leveransaviseringar, fakturor) mot kedjor eller leverantörer.</li>
          <li>När ni behöver hantera Peppol/e-faktura mot offentlig sektor.</li>
        </ul>

        <CompareLinks articleSlug="tillagg-edi-efaktura" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-frakt-ta",
    headerLabel: "BC-tillägg – Frakt & TA",
    title: "Frakt, transport & TA-system för Business Central",
    description:
      "Logtrade och nShift hanterar transportbokning och etiketter. Valet påverkar integration, transportörer och arbetsflöde.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          Valet av TA-system styrs ofta av transportörer (PostNord, DHL, Bring, DB Schenker),
          etiketter, fraktbokning och returflöden.
        </Lead>
        <p>
          De mest sedda i svenska BC-affärer är <strong>nShift</strong>, <strong>Shipmondo</strong>,
          <strong> Sendcloud</strong> och <strong>Cargoson</strong>.
        </p>
        <Disclaimer />

        <h2>Integrationer och partners</h2>
        <ul>
          <li><strong>nShift</strong> – BC-partner offentligt kopplad: BrightCom / Exsitec.</li>
          <li><strong>Shipmondo</strong> – BC-partner offentligt kopplad: Abakion.</li>
          <li><strong>Sendcloud / ShipIT 365</strong> – BC-partners offentligt kopplade: IDYN, N.Vision.</li>
          <li><strong>Cargoson</strong> – egen connector och BC-partners.</li>
        </ul>

        <h2>När är det relevant?</h2>
        <p>
          När ni skickar volym mot flera transportörer och behöver automatiserad fraktbokning,
          etiketter, track &amp; trace och returer direkt från BC.
        </p>

        <CompareLinks articleSlug="tillagg-frakt-ta" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-ehandel",
    headerLabel: "BC-tillägg – E-handel",
    title: "E-handel B2B/B2C i Business Central",
    description:
      "Sana och Dynamicweb används nära BC. Shopify används som extern frontend i mer flexibla lösningar.",
    seoTitle: "E-handel i Business Central – Sana vs Shopify vs Dynamicweb",
    seoDescription:
      "Hur bygger man e-handel med Business Central? Jämför Sana, Dynamicweb och Shopify som frontend – och hitta rätt arkitektur.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          <strong>Sana Commerce Cloud for Business Central</strong> är förstaval när e-handeln ska
          ligga nära BC-data: produkter, lager, priser, kunder och order.
        </Lead>
        <p>
          För lättare behov finns connector-alternativ till befintliga e-handelsplattformar
          (Shopify, Magento m.fl.).
        </p>
        <Disclaimer />

        <h2>Sana Commerce Cloud</h2>
        <p>
          Sanas AppSource-erbjudande stödjer Sverige och hämtar produkter, priser, kunder, lager
          och order direkt från BC i realtid.
        </p>
        <p>
          <strong>Partner offentligt listad av Sana (exempel):</strong> Update (svensk produktsida).
        </p>

        <h2>Connector-alternativ</h2>
        <p>
          Om ni redan kör Shopify, Magento eller WooCommerce finns flera lättare connector-tillägg
          på AppSource som synkroniserar artiklar, lager och order mot BC.
        </p>
        <p>Valet beror på hur djup integration ni behöver.</p>

        <h2>När är det relevant?</h2>
        <ul>
          <li>När e-handeln är affärskritisk och pris-/lagerlogik bor i BC.</li>
          <li>När ni vill konsolidera order- och kundhantering till ett system.</li>
        </ul>

        <CompareLinks articleSlug="tillagg-ehandel" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-retail-pos",
    headerLabel: "BC-tillägg – Retail & POS",
    title: "Retail, POS & butikssystem i Business Central",
    description:
      "LS Central är en komplett retailplattform. Alternativt används Shopify POS i en mer modulär lösning med BC som backend.",
    seoTitle: "Retail & POS i Business Central – LS Central vs Shopify",
    seoDescription:
      "Välj rätt retailsetup i Business Central. Jämför LS Central (allt-i-ett) med Shopify POS som extern lösning för butik och e-handel.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          <strong>LS Central</strong> (LS Retail) är den tunga retail-/POS-lösningen på
          BC-plattformen, med stöd för länder där BC finns och relevant fiskalisering för svenska
          förhållanden.
        </Lead>
        <Disclaimer />

        <h2>LS Central</h2>
        <p>
          Täcker POS, butiksdrift, lager, e-handel, lojalitet och hospitality (restaurang, hotell)
          på samma plattform som BC.
        </p>
        <p>Skalar från enstaka butik till kedjor.</p>
        <PartnerList
          source="LS Retail för LS Central"
          partners={["Azets", "Unikal / Active", "RTS Business Solutions"]}
        />

        <h2>När är det relevant?</h2>
        <p>
          För butikskedjor, restaurang- och hotellverksamhet som vill ha kassa, lager och ekonomi
          på samma plattform.
        </p>

        <CompareLinks articleSlug="tillagg-retail-pos" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-branschpaket",
    headerLabel: "BC-tillägg – Branschpaket",
    title: "Branschlösningar i Business Central",
    description:
      "Aptean (food), TRIMIT och Pebblestone (mode) samt COSMO (tillverkning) är de vanligaste branschlösningarna ovanpå BC.",
    seoTitle: "Branschlösningar i Business Central – Food, mode & tillverkning",
    seoDescription:
      "Se de vanligaste branschlösningarna i Business Central: Aptean Food, TRIMIT, Pebblestone och COSMO – och när de används.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          Beroende på industri är de vanligaste branschpaketen ovanpå BC <strong>Aptean</strong>,
          <strong> TRIMIT</strong>, <strong>COSMO CONSULT</strong> och <strong>4PS</strong>.
        </Lead>
        <Disclaimer />

        <h2>Aptean Food &amp; Beverage / Process Manufacturing</h2>
        <p>
          Bra spår för livsmedel, recept, batch, spårbarhet, kvalitet, bäst-före och processflöden
          ovanpå BC.
        </p>
        <p><strong>BC-partners offentligt kopplade:</strong> Softronic, Fellowmind.</p>

        <h2>TRIMIT Fashion</h2>
        <p>
          Relevant för mode, kollektioner, storlek/färg/variant, PDM och säsongsstyrning.
        </p>
        <p>
          <strong>BC-partner offentligt kopplad:</strong> Adbriq (svensk produktsida och case med
          TRIMIT och BC).
        </p>

        <h2>COSMO Project / Process / Discrete Manufacturing</h2>
        <p>
          Branschpaket från COSMO CONSULT ovanpå BC för mer avancerad tillverkning,
          projektproduktion och processflöden.
        </p>
        <p><strong>BC-partner:</strong> COSMO CONSULT Sweden.</p>

        <h2>4PS Construct</h2>
        <p>
          Branschpaket ovanpå BC för bygg-, installations- och serviceföretag – projektstyrning,
          resursplanering, servicekontrakt och underentreprenörer i realtid.
        </p>
        <p><strong>BC-partner:</strong> 4PS Construction Software AB.</p>

        <h2>När är det relevant?</h2>
        <p>
          När er bransch har specifika krav som standard-BC inte täcker, men där ni vill behålla
          BC som plattform i stället för att byta till ett dedikerat branschsystem.
        </p>

        <CompareLinks articleSlug="tillagg-branschpaket" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-dokument-output",
    headerLabel: "BC-tillägg – Dokument & output",
    title: "Dokument, rapportlayout & output management för Business Central",
    description:
      "Lasernet och Continia Document Output är de vanligaste valen för dokumentdesign och utskick av kunddokument från BC.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          För bolag med stora volymer kunddokument, fakturor, följesedlar, etiketter och
          dokumentdesign är de vanligaste valen <strong>Lasernet for Business Central</strong> och
          <strong> Continia Document Output</strong>.
        </Lead>
        <Disclaimer />

        <h2>Lasernet for Business Central</h2>
        <p>
          Plattform för dokumentdesign, transformation och distribution.
        </p>
        <p>
          Lasernet kommunicerar ny/utökad BC-satsning – version och SKU bör verifieras i varje
          affär.
        </p>
        <PartnerList
          source="Lasernet"
          partners={["BE-terna", "Nexer", "Tabellae"]}
        />

        <h2>Continia Document Output</h2>
        <p>
          Naturligt val om ni redan kör Continia Document Capture eller andra delar av Continias
          svit.
        </p>
        <p>
          Hanterar utskick av fakturor, ordererkännanden, leveransaviseringar m.m. via e-post,
          Peppol eller print.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När ni har många dokumentmallar, varumärkeskrav eller behöver distribuera dokument i
          olika format till olika mottagare (e-post, Peppol, EDI, print).
        </p>

        <CompareLinks articleSlug="tillagg-dokument-output" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-rapportering-budget",
    headerLabel: "BC-tillägg – Rapportering & budget",
    title: "Rapportering, budget & FP&A för Business Central",
    description:
      "Jet Reports/insightsoftware, Bizview, Solver samt Power BI och Microsoft Fabric är de vanligaste komplementen till BC:s standardrapportering.",
    productSlug: "businesscentral",
    product: "Business Central",
    parentPath: "/businesscentral/",
    parentLabel: "Affärssystem (ERP) – Business Central",
    content: (
      <>
        <Lead>
          Vanliga komplement till BC:s standardrapportering är <strong>Jet Reports / insightsoftware</strong>,
          <strong> Bizview</strong> och <strong>Solver</strong> för Excel-rapportering, finansiell
          rapportering, budget och prognos.
        </Lead>
        <p>
          För modernare datadrivna spår är <strong>Power BI</strong> och
          <strong> Microsoft Fabric</strong> ofta förstaval, med eller utan dedikerat FP&amp;A-verktyg
          ovanpå.
        </p>
        <Disclaimer />

        <h2>Jet Reports &amp; Bizview (insightsoftware)</h2>
        <p>
          Relevant när kunden vill ha bättre Excel-rapportering, finansiell rapportering,
          budget/prognos och management reporting ovanpå BC.
        </p>
        <p>
          Bizview visas som stödd för Sverige. Partnerrelationer bör verifieras i varje affär.
        </p>

        <h2>Solver for Business Central</h2>
        <p>xFP&amp;A-lösning för budget och prognos.</p>
        <p>
          Levereras av Solver tillsammans med Solver-partners och BC-partners. Verifiera svensk
          partnerstatus per affär.
        </p>

        <h2>Power BI &amp; Microsoft Fabric</h2>
        <p>
          För datadrivna organisationer är Power BI och Fabric ofta förstaval för visualisering,
          semantisk modell och dataplattform.
        </p>
        <p>Kan kombineras med ovanstående verktyg eller stå för sig självt.</p>

        <h2>När är det relevant?</h2>
        <ul>
          <li>När standardrapporter i BC inte räcker.</li>
          <li>När ni behöver budget-/prognosflöden.</li>
          <li>När rapportering ska kombineras med data från andra system.</li>
        </ul>

        <CompareLinks articleSlug="tillagg-rapportering-budget" />
        <CTA />
        <BackToOverview />
      </>
    ),
  },
];
