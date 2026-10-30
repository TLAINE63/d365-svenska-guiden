import SimpleGuidePage from "@/components/guides/SimpleGuidePage";
import GuideCTA from "@/components/guides/GuideCTA";
import D365VsSalesforceMatrix from "@/components/comparisons/D365VsSalesforceMatrix";

/**
 * Övergripande, köparsidig jämförelse Dynamics 365 vs Salesforce.
 * Navet för de fyra modulsidorna under /jamfor/. Ingen vinnare utses,
 * kostnadspåståenden hänvisar till kalkylator och modulsidornas prisuppgifter.
 */
const PATH = "/jamfor/dynamics-365-vs-salesforce/";
const SEO_TITLE = "Dynamics 365 vs Salesforce: Jämförelse, priser & CRM | d365.se";

const Dynamics365VsSalesforce = () => (
  <SimpleGuidePage
    path={PATH}
    tool="d365_vs_salesforce"
    seoTitle={SEO_TITLE}
    seoTitleMaxLength={SEO_TITLE.length}
    seoDescription="Jämför Microsoft Dynamics 365 Sales med Salesforce CRM. Se skillnader i licenspriser, Microsoft 365-integration, Copilot AI och implementering."
    crumbs={[
      { name: "Start", url: "/" },
      { name: "Jämförelser", url: "/jamfor/" },
      { name: "Dynamics 365 vs Salesforce", url: PATH },
    ]}
    h1="Microsoft Dynamics 365 vs Salesforce – Vilken CRM-plattform passar er?"
    shortAnswer="Båda är mogna CRM-plattformar, och valet avgörs sällan av enskilda funktioner. Det avgörs av var ert dagliga arbete sker, om CRM ska dela data med affärssystemet och vad lösningen kostar med de integrationer och tillägg ni faktiskt behöver. Jämför därför per område: sälj, kundservice, marknadsföring och fältservice."
    afterIntro={<D365VsSalesforceMatrix />}
    sections={[
      {
        title: "Helhet eller renodlat CRM?",
        intro: "Den största skillnaden är hur CRM hänger ihop med resten av verksamhetens system.",
        cards: [
          {
            t: "Salesforce",
            d: "Marknadsledande inom fristående CRM, säljstöd och marknadsföring, med ett stort globalt ekosystem (AppExchange). Salesforce har inget eget affärssystem, så ekonomi, lager och ERP hanteras i ett separat system som integreras.",
          },
          {
            t: "Dynamics 365",
            d: "CRM-apparna (Sales, Customer Service m.fl.) bygger på samma plattform och kan dela datamodell med Microsofts affärssystem (Business Central, Finance) och med Microsoft 365 (Teams, Outlook, Excel). Värdet är störst när ni redan arbetar i Microsofts miljö.",
          },
        ],
      },
      {
        title: "Kostnad och licensstruktur",
        intro: "Ingen av plattformarna är generellt billigast. Totalkostnaden avgörs av antal användare och licensnivå, vilka tillägg ni behöver, hur många system som ska integreras och hur mycket som anpassas.",
        list: [
          "Licenser per användare och månad, olika nivåer hos båda.",
          "Tilläggsmoduler, till exempel AI, marknadsföring och analys.",
          "Integrationer mot affärssystem, e-post och andra system.",
          "Implementering, anpassning och löpande förvaltning.",
        ],
        cards: [
          { t: "Räkna på er egen kostnad", d: "Kalkylatorn för Dynamics 365 Sales visar licenser och införande utifrån era uppgifter.", h: "/d365sales/roi-kalkylator/" },
          { t: "Se aktuella Dynamics 365-priser", d: "Microsofts listpriser per användare och månad.", h: "/priser/" },
        ],
      },
      {
        title: "AI: Copilot och Salesforce Einstein",
        intro: "Båda plattformarna bygger in generativ AI. Microsoft Copilot finns i Microsoft 365 och i Dynamics 365-apparna, medan Salesforce motsvarighet heter Einstein och Agentforce. Jämför hur AI-funktionerna licensieras, vilken data de använder och hur de fungerar i ert dagliga arbete.",
      },
      {
        title: "Jämför per område",
        intro: "Fördjupningarna jämför funktioner, licenser, införande och svensk partnernärvaro för respektive område.",
        cards: [
          { t: "Dynamics 365 Sales vs Salesforce Sales Cloud", d: "Säljstöd, pipeline, prognoser och AI för säljteam.", h: "/jamfor/sales-vs-salesforce-sales-cloud/" },
          { t: "Customer Service vs Salesforce Service Cloud", d: "Ärendehantering, kanaler och självservice.", h: "/jamfor/customer-service-vs-salesforce-service-cloud/" },
          { t: "Customer Insights vs Salesforce Marketing Cloud", d: "Kunddata, segmentering och kundresor.", h: "/jamfor/customer-insights-vs-salesforce-marketing-cloud/" },
          { t: "Field Service vs Salesforce Field Service", d: "Arbetsorder, schemaläggning och mobil service.", h: "/jamfor/field-service-vs-salesforce-field-service/" },
        ],
      },
    ]}
    next={{
      title: "Behöver ni rådgivning eller vill utvärdera rätt plattform?",
      text: "Börja med ert behov och jämför sedan partners som kan leverera lösningen i Sverige.",
      links: [
        { label: "Hitta en Microsoft Dynamics 365-partner", href: "/valjdynamics365partner/" },
        { label: "Gör CRM-matchningstestet", href: "/crm/matchningstest/" },
        { label: "Alla jämförelser", href: "/jamfor/" },
      ],
    }}
    afterNext={
      <GuideCTA
        variant="final"
        heading="Utvärderar ni byte mellan Salesforce och Dynamics 365?"
        text="Ett byte innebär datamigrering och ofta en period där båda systemen används parallellt. Fråga partners om deras erfarenhet av just detta och be om referenser."
        buttonLabel="Jämför CRM-partners i partnerväljaren"
        to="/valjdynamics365partner/"
        source={`${PATH}#cta-final`}
        className="!mt-0"
      />
    }
    faq={[
      {
        q: "Är Dynamics 365 eller Salesforce billigast?",
        a: "Det går inte att svara generellt. Kostnaden beror på licensnivå, antal användare, tillägg, integrationer och anpassningar. Räkna på ert eget scenario och be om offerter som bryter ned licens- och införandekostnad separat.",
      },
      {
        q: "Behöver vi byta affärssystem om vi väljer Dynamics 365 för CRM?",
        a: "Nej. Dynamics 365 CRM kan integreras med andra affärssystem. Den delade datamodellen ger störst nytta om ni också använder eller planerar Business Central eller Finance & Supply Chain Management.",
      },
      {
        q: "Vilken plattform har bäst AI?",
        a: "Båda utvecklar sina AI-funktioner snabbt. Jämför hur Copilot respektive Einstein och Agentforce licensieras, vilken data de har tillgång till och hur de stöder era faktiska arbetsmoment.",
      },
    ]}
  />
);

export default Dynamics365VsSalesforce;
