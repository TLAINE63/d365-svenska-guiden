import SimpleGuidePage from "@/components/guides/SimpleGuidePage";

const PATH = "/vad-ar-dynamics-365/";
const VadArDynamics365 = () => (
  <SimpleGuidePage
    path={PATH}
    tool="what_is_d365"
    seoTitle="Vad är Microsoft Dynamics 365? ERP, CRM och hur delarna hänger ihop"
    seoDescription="En introduktion till Microsoft Dynamics 365: affärssystem (ERP), CRM-applikationer, Dataverse och Power Platform, och hur ni hittar rätt startpunkt."
    crumbs={[{ name: "Start", url: "/" }, { name: "Vad är Dynamics 365?", url: PATH }]}
    h1="Vad är Microsoft Dynamics 365?"
    shortAnswer="Microsoft Dynamics 365 är en familj av molnbaserade affärsapplikationer. Den täcker affärssystem (ERP) för ekonomi, lager och produktion samt CRM-lösningar för sälj, marknad, kundservice och fältservice. Ni väljer de applikationer ni behöver och kan bygga vidare över tid."
    sections={[
      {
        title: "Affärssystem (ERP)",
        cards: [
          { t: "Business Central", d: "Samlat affärssystem för små och medelstora företag: ekonomi, försäljning, inköp, lager och projekt." },
          { t: "Finance & Supply Chain Management", d: "För större eller mer komplexa verksamheter med flera bolag, länder eller avancerad logistik och produktion." },
        ],
      },
      {
        title: "CRM-lösningar",
        cards: [
          { t: "Sales", d: "Säljstöd: kunder, affärsmöjligheter, prognoser och säljprocess." },
          { t: "Customer Service och Contact Center", d: "Kundservice, ärendehantering och kontaktcenter i flera kanaler." },
          { t: "Field Service", d: "Planering och utförande av service ute hos kund." },
          { t: "Customer Insights", d: "Kunddata och marknadsföring: målgrupper, kundresor och kampanjer." },
        ],
      },
      {
        title: "Dataverse, Power Platform och Copilot",
        intro: "CRM-applikationerna bygger på Dataverse, Microsofts gemensamma dataplattform. Power Platform används för att bygga egna appar, automatiseringar och rapporter runt Dynamics 365, och Copilot ger AI-stöd i applikationerna.",
      },
      {
        title: "Var börjar ni?",
        cards: [
          { t: "Utvärdera nytt system", d: "Osäkra på ERP, CRM eller båda? Systemvalsguiden ger en startpunkt utan poäng." },
          { t: "Välja partner", d: "Vet ni vilken applikation ni behöver kan ni jämföra partners efter bransch och produkt." },
          { t: "Har redan Dynamics 365", d: "Bygg vidare, optimera eller se över förvaltning och partner." },
        ],
      },
    ]}
    next={{
      title: "Hitta rätt startpunkt",
      text: "Välj den väg som passar ert läge. Ni kan alltid gå vidare till en annan del senare.",
      links: [
        { label: "Kom igång", href: "/kom-igang/" },
        { label: "Hitta partner", href: "/valjdynamics365partner/" },
        { label: "Redan Dynamics 365-kund", href: "/befintlig-kund/" },
        { label: "Se priser och licenser för Dynamics 365", href: "/priser/" },
      ],
    }}
    faq={[
      { q: "Måste vi köpa hela Dynamics 365?", a: "Nej. Ni licensierar de applikationer ni behöver och kan lägga till fler senare." },
      { q: "Är Dynamics 365 ERP eller CRM?", a: "Båda. Familjen innehåller både affärssystem (Business Central, Finance & Supply Chain Management) och CRM-applikationer." },
      { q: "Vad kostar Dynamics 365?", a: "Licenser kostar per användare och månad, och till det kommer införande och förvaltning. Se prislistan och kostnadsguiden." },
    ]}
  />
);
export default VadArDynamics365;
