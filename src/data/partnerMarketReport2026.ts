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
    label: "Övriga partners",
    value: 84,
    note: "Företag som aktivt levererar Dynamics 365 på den svenska marknaden.",
    group: "overblick",
  },
  {
    label: "Partnerverifierade profiler",
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
    a: "d365.se har identifierat 84 partners som aktivt levererar Dynamics 365 på den svenska marknaden. 17 av dem har en partnerverifierad profil där de själva granskat uppgifterna.",
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
  {
    q: "Vilka datakällor används i kartläggningen?",
    a: "Kartläggningen bygger på tre typer av källor: (1) Microsofts officiella partnerkatalog och lösningsregister, (2) publika källor som företagssajter, årsredovisningar, pressmeddelanden och LinkedIn, samt (3) uppgifter som partners själva lämnar när de verifierar sin profil på d365.se. För partnerverifierade profiler väger vi självrapporterad information högst eftersom den är granskad och godkänd av partnern. För övriga partners bygger vi på externa källor och observation av faktiska leveranser på marknaden.",
  },
  {
    q: "Vad är skillnaden mellan grundprofiler och partnerverifierade profiler?",
    a: "Övriga partners är företag som d365.se har kartlagt utifrån publika källor och som bedöms leverera Dynamics 365 i Sverige. Partners med partnerverifierad profil har därtill gått in på d365.se, granskat sin profil, fyllt i leveransprofil per produktområde, uppgivit referenser och bekräftat sin AI-erfarenhet. Endast partners med partnerverifierad profil kan kontaktas direkt via plattformen; för övriga partners sker kontakt genom d365.se som mellanhand.",

  },
  {
    q: "Hur räknas en partner in i ett produktområde?",
    a: "En partner räknas in i ett produktområde (t.ex. Business Central eller CRM) om de har dokumenterad leverans av den produkten i Sverige – antingen genom uppgifter i Microsofts partnerkatalog, referenser på den egna sajten eller genom att partnern själv har markerat produkten i sin partnerverifierade profil. Detta betyder att en partner kan räknas i flera produktområden samtidigt, vilket är varför summan av produktkategorierna överstiger det totala antalet partners.",
  },
  {
    q: "Hur mäts branschtillhörighet?",
    a: "Varje partner kan ange upp till tre primära fokusbranscher och ett antal sekundära branscher i sin profil. I rapporten räknas en partner in i en bransch om den är uppgiven som primär fokusbransch. Branschindelningen följer en standardiserad lista på 20 branscher för att säkerställa jämförbarhet mellan partners.",
  },
  {
    q: "Hur definieras små specialistpartners och stora globala partners?",
    a: "Små specialistpartners definieras som bolag med typiskt under ca 50 Dynamics 365-konsulter i Sverige och en tydlig nisch inom ett eller två produktområden. Stora globala partners är internationella aktörer med flera hundra konsulter och en global leveransmodell. Mittpartners – medelstora svenska bolag med 50–200 konsulter – utgör en implicit tredje kategori men redovisas inte separat i denna rapport.",
  },
  {
    q: "Hur ofta uppdateras siffrorna?",
    a: "Kartläggningen uppdateras löpande i takt med att nya partners identifieras och profiler verifieras. Siffrorna i rapporten hämtas live från d365.se:s partnerdatabas och stämpeln \"uppdaterad\" visar datum för senaste stora revision. Mindre justeringar sker kontinuerligt utan att datumet ändras.",
  },
  {
    q: "Varför stämmer inte summan av kategorierna överens med totalen?",
    a: "Eftersom en partner kan räknas i flera produktområden och branscher samtidigt blir summan av underkategorierna alltid större än det totala antalet partners. Detta är en egenskap hos datan, inte ett fel – det speglar att många partners är breda och arbetar över flera områden.",
  },
  {
    q: "Kan jag använda siffrorna i min egen rapport eller presentation?",
    a: "Ja, du får referera till siffrorna med källhänvisning till d365.se. Ladda ner datan som PDF eller CSV ovan och ange källan som \"d365.se – Dynamics 365 Partner Landscape Sweden 2026\". Om du behöver mer detaljerade uppgifter eller en skräddarsydd analys kan du kontakta oss via behovsanalysen.",
  },
];
