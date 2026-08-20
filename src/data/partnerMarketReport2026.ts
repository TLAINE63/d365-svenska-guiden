// Statistik för rapporten "Svenska Dynamics 365-partnermarknaden 2026".
// Siffrorna är framtagna ur d365.se:s partnerdatabas (kartlagda svenska
// Dynamics 365-partners) och uppdateras manuellt när kartläggningen revideras.

export const REPORT_UPDATED = "2026/08/20";

export interface ReportStat {
  label: string;
  value: number;
  suffix?: string;
  note: string;
  group: "overblick" | "produkt" | "bransch" | "storlek";
}

export const REPORT_STATS: ReportStat[] = [
  {
    label: "Identifierade partners",
    value: 84,
    note: "Företag som aktivt levererar Dynamics 365 på den svenska marknaden.",
    group: "overblick",
  },
  {
    label: "Verifierade profiler",
    value: 17,
    note: "Partners som själva granskat och godkänt sin profil på d365.se.",
    group: "overblick",
  },
  {
    label: "Business Central",
    value: 46,
    note: "Partners med dokumenterad leverans av Dynamics 365 Business Central.",
    group: "produkt",
  },
  {
    label: "Finance & Supply Chain",
    value: 37,
    note: "Partners inriktade mot F&SCM och större ERP-implementationer.",
    group: "produkt",
  },
  {
    label: "CRM / Customer Engagement",
    value: 50,
    note: "Sales, Customer Service, Field Service, Contact Center och Customer Insights.",
    group: "produkt",
  },
  {
    label: "Power Platform / AI",
    value: 24,
    note: "Partners med registrerad erfarenhet av Copilot, agenter eller Power Platform.",
    group: "produkt",
  },
  {
    label: "Tillverkning",
    value: 53,
    note: "Partners med tillverkande industri som uttalat fokusområde.",
    group: "bransch",
  },
  {
    label: "Handel & Retail",
    value: 32,
    note: "Partners med parti-, detalj- eller e-handel som fokusområde.",
    group: "bransch",
  },
  {
    label: "Life Science",
    value: 10,
    note: "Partners med läkemedel, medtech eller life science som fokusområde.",
    group: "bransch",
  },
  {
    label: "Små specialistpartners",
    value: 36,
    note: "Nischade bolag, typiskt under ca 50 konsulter i Sverige.",
    group: "storlek",
  },
  {
    label: "Stora globala partners",
    value: 25,
    note: "Internationella aktörer med flera hundra konsulter och global leveransmodell.",
    group: "storlek",
  },
];

export const REPORT_FAQ = [
  {
    q: "Hur många Dynamics 365-partners finns det i Sverige 2026?",
    a: "d365.se har identifierat 84 partners som aktivt levererar Dynamics 365 på den svenska marknaden. 17 av dem har en verifierad profil där de själva granskat uppgifterna.",
  },
  {
    q: "Vilket produktområde har flest partners?",
    a: "CRM/Customer Engagement är bredast med 50 partners, följt av Business Central med 46 och Finance & Supply Chain Management med 37. Många partners täcker flera områden.",
  },
  {
    q: "Hur många partners arbetar med Copilot och AI-agenter?",
    a: "24 partners har registrerad erfarenhet av Copilot, AI-agenter eller Power Platform i sin profilering. Området växer snabbast av alla i kartläggningen.",
  },
  {
    q: "Hur är siffrorna framtagna?",
    a: "Underlaget är d365.se:s löpande kartläggning av svenska Dynamics 365-partners: partnerprofiler, publika källor och uppgifter partners själva lämnat. En partner kan räknas i flera kategorier eftersom många täcker flera produktområden och branscher.",
  },
];
