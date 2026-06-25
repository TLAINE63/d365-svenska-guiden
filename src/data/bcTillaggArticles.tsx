import { Link } from "react-router-dom";
import type { DeepDiveArticle } from "./bcArticles";

const parent = {
  product: "Business Central",
  productSlug: "businesscentral",
  parentPath: "/businesscentral/",
  parentLabel: "Affärssystem (ERP) – Business Central",
} as const;

const Disclaimer = () => (
  <p className="text-sm text-muted-foreground italic">
    Vi skriver medvetet "offentligt listad av ISV:n som partner" snarare än "auktoriserad återförsäljare". Aktuell
    partnerstatus, certifieringsnivå, version och svensk lokalisering bör alltid verifieras direkt med ISV:n och er
    BC-partner inför en affär.
  </p>
);

const BackToOverview = () => (
  <p className="mt-8 text-sm">
    ←{" "}
    <Link to="/kunskapscenter/business-central/isv-tillaggsapplikationer/" className="text-primary underline hover:text-primary/80">
      Tillbaka till översikten av BC-tilläggskategorier
    </Link>
  </p>
);

const CTA = () => (
  <div className="my-10 p-8 bg-secondary/50 rounded text-center border border-border">
    <h3 className="text-xl font-bold text-foreground mb-2">Vill ni jämföra BC-partners för detta tillägg?</h3>
    <p className="text-muted-foreground mb-4">
      Många BC-partners är specialiserade på vissa ISV-lösningar. Vi hjälper er hitta partners som matchar er
      kombination av bransch, processer och tilläggsbehov.
    </p>
    <p>
      <Link to="/valjdynamics365partner/" className="font-semibold text-primary hover:underline">
        Hitta Business Central-partners → d365.se/valjdynamics365partner
      </Link>
    </p>
  </div>
);

export const BC_TILLAGG_ARTICLES: DeepDiveArticle[] = [
  {
    slug: "tillagg-fakturahantering",
    headerLabel: "BC-tillägg – Fakturahantering",
    title: "Fakturahantering & AP Automation för Business Central",
    description:
      "Continia och SignUp ExFlow är de två dominerande lösningarna för leverantörsfakturor i svenska BC-affärer. Här är ISV:erna och de BC-partners som är offentligt listade.",
    ...parent,
    content: (
      <>
        <p>
          <strong>Två lösningar dominerar svenska BC-affärer:</strong> Continia och SignUp Software ExFlow. Båda är
          byggda inuti Business Central och hanterar fakturaflödet — från inläsning och tolkning till attest, kontering
          och betalning — direkt i BC.
        </p>
        <Disclaimer />

        <h2>Continia</h2>
        <p>
          Continias svit för BC omfattar Document Capture, Expense Management, Document Output, Banking/Payment,
          Collection Management, Continia Finance och OPplus. Continia har egen partnerkatalog med filter för Sverige
          och anger att certifierade Continia-partners också är officiella Business Central-partners.
        </p>
        <p>
          <strong>BC-partners offentligt listade av Continia (urval):</strong> Evidi/NaviPro, NAB Solutions, JMA,
          Flank Speed, dizparc Värnamo ERP, Navet/Aderian, Update.
        </p>

        <h2>SignUp Software ExFlow</h2>
        <p>
          Svensk ISV med stark BC- och F&amp;O-närvaro. ExFlow täcker AP Automation, Data Capture, Travel &amp; Expense
          samt E-invoicing och är byggt direkt i BC.
        </p>
        <p>
          <strong>BC-partners offentligt listade av SignUp Software (urval):</strong> NAB Solutions, Mibusoft,
          4PS by Hilti, Implema, Fellowmind, Niedall, Sherpas, Yellow Solution, THINKNINE.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När volymen leverantörsfakturor och attestkedjor gör manuell hantering i BC kostsam, eller när ni behöver
          starkare stöd för Peppol, e-faktura, kvitto- och reseräkningshantering än standard-BC ger.
        </p>

        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-svensk-lokalisering",
    headerLabel: "BC-tillägg – Lokalisering",
    title: "Svensk lokalisering & moms för Business Central",
    description:
      "Swebase och Smart Swedish VAT är de vanligaste tilläggen när BC:s standardlokalisering inte räcker för svenska krav.",
    ...parent,
    content: (
      <>
        <p>
          För många bolag räcker BC:s standardfunktionalitet långt. När den inte gör det är de vanligaste tilläggen
          <strong> Swebase</strong> och <strong>Smart Swedish VAT</strong>.
        </p>
        <Disclaimer />

        <h2>Swebase (Update AB)</h2>
        <p>
          Svensk BC/NAV-extension för svenska marknadens krav och praktiska ekonomifunktioner som ofta saknas i
          standard. Update är huvudpartner.
        </p>

        <h2>Smart Swedish VAT (SmartApps / NAB Solutions)</h2>
        <p>
          Specifikt tillägg för svensk momsrapportering. SmartApps har även bredare BC-tillägg som Eagle, Spider, Parrot
          och StoryPoint med svenskt/nordiskt stöd. NAB Solutions är huvudutgivare; övriga BC-partners kan ofta leverera
          när de samarbetar med NAB/SmartApps.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När ni har komplex svensk moms (omvänd skattskyldighet, EU-handel, OSS), behöver specifika svenska
          ekonomi- eller rapportflöden, eller vill minimera anpassningar i kärnsystemet.
        </p>

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
      "Tasklet Mobile WMS är den etablerade WMS-lösningen för BC/NAV. Ongoing WMS via Golden EDI används ofta vid extern 3PL.",
    ...parent,
    content: (
      <>
        <p>
          <strong>Tasklet Mobile WMS</strong> (Tasklet Factory) är den etablerade WMS-lösningen för BC/NAV med ett brett
          partnernät. För handels- och lagerbolag med extern 3PL är även <strong>Ongoing WMS</strong> via Golden EDI:s
          connector ett vanligt val.
        </p>
        <Disclaimer />

        <h2>Tasklet Mobile WMS</h2>
        <p>
          Handdatorlösning för plock, pack, inleverans, omlagring och inventering. Tasklet anger globalt partnernät i
          40+ länder och filtrering på Sverige + Business Central.
        </p>
        <p>
          <strong>BC-partners offentligt listade av Tasklet (urval):</strong> Adbriq, Aderian Navet, Azets Sweden,
          Basecloud, Bedege, Bisqo, COSMO CONSULT Sweden, THINKNINE, TietoEVRY Sweden, Update, twoday.
        </p>

        <h2>Ongoing WMS (via Golden EDI)</h2>
        <p>
          Relevant när lagerdriften ligger hos 3PL eller när ni vill köra ett separat WMS-system parallellt med BC.
          Integration sker via Golden EDI:s connector.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När lagervolym, antal artiklar eller plockfrekvens överstiger vad standard-BC klarar effektivt, eller när ni
          behöver streckkods- och handdatorflöden i lagerprocessen.
        </p>

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
      "Golden EDI, TrueCommerce, Peppol720 och Continia e-dokument är de vanligaste valen för EDI och elektroniska affärsdokument.",
    ...parent,
    content: (
      <>
        <p>
          De vanligaste valen i svenska BC-affärer är <strong>Golden EDI</strong>, <strong>TrueCommerce EDI</strong>,
          <strong> Peppol720</strong> och <strong>Continia e-dokument</strong>.
        </p>
        <Disclaimer />

        <h2>Golden EDI</h2>
        <p>
          Svensk/nordisk lösning för EDI, e-faktura och integrationer. Business Central Hub samt Ongoing WMS Connector
          är två centrala komponenter. Levereras direkt eller via BC-partners.
        </p>

        <h2>TrueCommerce EDI for Business Central</h2>
        <p>
          Relevant för bolag med större handelsflöden, EDI-meddelanden och trading partners. Sverige ingår i
          EU-erbjudandet; partner verifieras per land.
        </p>

        <h2>Peppol720 (ON720.COM)</h2>
        <p>
          AppSource-produkt för att skicka och ta emot elektroniska dokument via Peppol med Sverige som stödd marknad.
          Direkt- eller partnerkanal verifieras per affär.
        </p>

        <h2>Continia e-dokument</h2>
        <p>
          Ingår i Continias svit och är ett naturligt val om ni redan kör Continia Document Capture eller Document
          Output.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När ni har återkommande EDI-flöden (ordrar, leveransaviseringar, fakturor) mot kedjor eller leverantörer, eller
          behöver hantera Peppol/e-faktura mot offentlig sektor.
        </p>

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
      "nShift, Shipmondo, Sendcloud och Cargoson är de mest sedda TA-integrationerna för BC i svenska affärer.",
    ...parent,
    content: (
      <>
        <p>
          Flera alternativ finns och valet styrs ofta av transportörer (PostNord, DHL, Bring, DB Schenker), etiketter,
          fraktbokning och returflöden. De mest sedda i svenska BC-affärer är <strong>nShift</strong>,
          <strong> Shipmondo</strong>, <strong>Sendcloud</strong> och <strong>Cargoson</strong>.
        </p>
        <Disclaimer />

        <h2>Integrationer och partners</h2>
        <ul>
          <li><strong>nShift</strong> — BC-partner offentligt kopplad: BrightCom/Exsitec.</li>
          <li><strong>Shipmondo</strong> — BC-partner offentligt kopplad: Abakion.</li>
          <li><strong>Sendcloud / ShipIT 365</strong> — BC-partners offentligt kopplade: IDYN, N.Vision.</li>
          <li><strong>Cargoson</strong> — egen connector och BC-partners.</li>
        </ul>

        <h2>När är det relevant?</h2>
        <p>
          När ni skickar volym mot flera transportörer och behöver automatiserad fraktbokning, etiketter, track &amp;
          trace och returer direkt från BC.
        </p>

        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-ehandel",
    headerLabel: "BC-tillägg – E-handel",
    title: "E-handel B2B/B2C för Business Central",
    description:
      "Sana Commerce Cloud är förstaval när e-handeln ska ligga nära BC-data. För lättare behov finns connector-alternativ.",
    ...parent,
    content: (
      <>
        <p>
          <strong>Sana Commerce Cloud for Business Central</strong> är förstaval när e-handeln ska ligga nära BC-data:
          produkter, lager, priser, kunder och order. För lättare behov finns connector-alternativ till befintliga
          e-handelsplattformar (Shopify, Magento m.fl.).
        </p>
        <Disclaimer />

        <h2>Sana Commerce Cloud</h2>
        <p>
          Sanas AppSource-erbjudande stödjer Sverige och hämtar produkter, priser, kunder, lager och order direkt från
          BC i realtid.
        </p>
        <p>
          <strong>Partner offentligt listad av Sana (exempel):</strong> Update (svensk produktsida).
        </p>

        <h2>Connector-alternativ</h2>
        <p>
          Om ni redan kör Shopify, Magento eller WooCommerce finns flera lättare connector-tillägg på AppSource som
          synkroniserar artiklar, lager och order mot BC. Valet beror på hur djup integration ni behöver.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När e-handeln är affärskritisk och pris-/lagerlogik bor i BC, eller när ni vill konsolidera order- och
          kundhantering till ett system.
        </p>

        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-retail-pos",
    headerLabel: "BC-tillägg – Retail & POS",
    title: "Retail, POS & hospitality för Business Central",
    description:
      "LS Central är den tunga retail-/POS-lösningen på BC-plattformen, med relevant fiskalisering för svenska förhållanden.",
    ...parent,
    content: (
      <>
        <p>
          <strong>LS Central</strong> (LS Retail) är den tunga retail-/POS-lösningen på BC-plattformen, med stöd för
          länder där BC finns och relevant fiskalisering för svenska förhållanden.
        </p>
        <Disclaimer />

        <h2>LS Central</h2>
        <p>
          Täcker POS, butiksdrift, lager, e-handel, lojalitet och hospitality (restaurang, hotell) på samma plattform
          som BC. Skalar från enstaka butik till kedjor.
        </p>
        <p>
          <strong>BC-partners offentligt kopplade till LS Central (urval):</strong> Azets, Unikal / Active,
          RTS Business Solutions.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          För butikskedjor, restaurang- och hotellverksamhet som vill ha kassa, lager och ekonomi på samma plattform.
        </p>

        <CTA />
        <BackToOverview />
      </>
    ),
  },
  {
    slug: "tillagg-branschpaket",
    headerLabel: "BC-tillägg – Branschpaket",
    title: "Branschpaket för Business Central (livsmedel, mode, tillverkning)",
    description:
      "Aptean, TRIMIT och COSMO är de vanligaste branschpaketen ovanpå BC för livsmedel, mode och avancerad tillverkning.",
    ...parent,
    content: (
      <>
        <p>
          Beroende på industri är de vanligaste branschpaketen ovanpå BC <strong>Aptean</strong>, <strong>TRIMIT</strong>
          och <strong>COSMO CONSULT</strong>.
        </p>
        <Disclaimer />

        <h2>Aptean Food &amp; Beverage / Process Manufacturing</h2>
        <p>
          Bra spår för livsmedel, recept, batch, spårbarhet, kvalitet, bäst-före och processflöden ovanpå BC.
        </p>
        <p><strong>BC-partners offentligt kopplade:</strong> Softronic, Fellowmind.</p>

        <h2>TRIMIT Fashion</h2>
        <p>
          Relevant för mode, kollektioner, storlek/färg/variant, PDM och säsongsstyrning.
        </p>
        <p><strong>BC-partner offentligt kopplad:</strong> Adbriq (svensk produktsida och case med TRIMIT och BC).</p>

        <h2>COSMO Project / Process / Discrete Manufacturing</h2>
        <p>
          Branschpaket från COSMO CONSULT ovanpå BC för mer avancerad tillverkning, projektproduktion och processflöden.
        </p>
        <p><strong>BC-partner:</strong> COSMO CONSULT Sweden.</p>

        <h2>När är det relevant?</h2>
        <p>
          När er bransch har specifika krav som standard-BC inte täcker, men där ni vill behålla BC som plattform i
          stället för att byta till ett dedikerat branschsystem.
        </p>

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
    ...parent,
    content: (
      <>
        <p>
          För bolag med stora volymer kunddokument, fakturor, följesedlar, etiketter och dokumentdesign är de vanligaste
          valen <strong>Lasernet for Business Central</strong> (Formpipe / Lasernet Group) och
          <strong> Continia Document Output</strong>.
        </p>
        <Disclaimer />

        <h2>Lasernet for Business Central</h2>
        <p>
          Plattform för dokumentdesign, transformation och distribution. Notera att Lasernet kommunicerar ny/utökad
          BC-satsning — version och SKU bör verifieras i varje affär.
        </p>
        <p>
          <strong>BC-partners offentligt kopplade till Lasernet (urval):</strong> BE-terna, Nexer, Tabellae.
        </p>

        <h2>Continia Document Output</h2>
        <p>
          Naturligt val om ni redan kör Continia Document Capture eller andra delar av Continias svit. Hanterar utskick
          av fakturor, ordererkännanden, leveransaviseringar m.m. via e-post, Peppol eller print.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När ni har många dokumentmallar, varumärkeskrav eller behöver distribuera dokument i olika format till olika
          mottagare (e-post, Peppol, EDI, print).
        </p>

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
    ...parent,
    content: (
      <>
        <p>
          Vanliga komplement till BC:s standardrapportering är <strong>Jet Reports / insightsoftware</strong>,
          <strong> Bizview</strong> och <strong>Solver</strong> för Excel-rapportering, finansiell rapportering, budget
          och prognos. För modernare datadrivna spår är <strong>Power BI</strong> och <strong>Microsoft Fabric</strong>
          ofta förstaval, med eller utan dedikerat FP&amp;A-verktyg ovanpå.
        </p>
        <Disclaimer />

        <h2>Jet Reports &amp; Bizview (insightsoftware)</h2>
        <p>
          Relevant när kunden vill ha bättre Excel-rapportering, finansiell rapportering, budget/prognos och management
          reporting ovanpå BC. Bizview visas som stödd för Sverige. Partnerrelationer bör verifieras i varje affär.
        </p>

        <h2>Solver for Business Central</h2>
        <p>
          xFP&amp;A-lösning för budget och prognos. Levereras av Solver tillsammans med Solver-partners och BC-partners.
          Verifiera svensk partnerstatus per affär.
        </p>

        <h2>Power BI &amp; Microsoft Fabric</h2>
        <p>
          För datadrivna organisationer är Power BI och Fabric ofta förstaval för visualisering, semantisk modell och
          dataplattform. Kan kombineras med ovanstående verktyg eller stå för sig självt.
        </p>

        <h2>När är det relevant?</h2>
        <p>
          När standardrapporter i BC inte räcker, när ni behöver budget-/prognosflöden, eller när rapportering ska
          kombineras med data från andra system.
        </p>

        <CTA />
        <BackToOverview />
      </>
    ),
  },
];
