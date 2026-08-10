/**
 * Business Central – Matchningstest
 * Funktionsorienterat behovstest. Resultatet klassificerar identifierade behov i:
 *  - essentials   : ingår i BC Essentials (standard)
 *  - premium      : kräver BC Premium (tillverkning, service mm.)
 *  - config       : kräver konfiguration eller anpassning av BC
 *  - isv          : kräver ISV-tillägg (AppSource) ovanpå BC
 *  - outside      : ligger utanför BC – annan plattform/produkt
 *
 * Branching styrs av q_segment (steg 2) och i förekommande fall q_sub_industry (steg 3).
 */

export type BcClassification = "essentials" | "premium" | "config" | "isv" | "outside";

export type BcAnswerValue = string | string[];
export type BcAnswers = Record<string, BcAnswerValue>;

export interface BcSignal {
  area: string;
  classification: BcClassification;
  note?: string;
}

export interface BcOption {
  value: string;
  label: string;
  signals?: BcSignal[];
}

export interface BcQuestion {
  id: string;
  block: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  help?: string;
  multi?: boolean;
  options: BcOption[];
  showIf?: (a: BcAnswers) => boolean;
}

export const BC_BLOCKS: Record<1 | 2 | 3 | 4 | 5 | 6, { title: string; description: string }> = {
  1: { title: "Storlek och segment", description: "Övergripande bild av verksamheten." },
  2: { title: "Bransch", description: "Vilken bransch ni tillhör inom valt segment." },
  3: { title: "Juridik och geografi", description: "Bolagsstruktur, geografi, rapportering och nuvarande system." },
  4: { title: "Branschspecifika behov", description: "Funktionella krav i er bransch." },
  5: { title: "Nuläge och utmaningar", description: "Vad fungerar och vad fungerar inte i dag." },
  6: { title: "Integrationer och brådska", description: "Systemlandskap, masterdata och tidshorisont." },
};

// ---------- helpers ----------
const seg = (a: BcAnswers, ...values: string[]) => values.includes(a.q_segment as string);
const has = (a: BcAnswers, qid: string, val: string) => {
  const v = a[qid];
  if (Array.isArray(v)) return v.includes(val);
  return v === val;
};

// ============================================================
// STEG 1 – Allmänt
// ============================================================
const STEP1: BcQuestion[] = [
  {
    id: "q_employees",
    block: 1,
    text: "Hur många anställda har ni?",
    options: [
      { value: "u20", label: "Under 20" },
      { value: "20-100", label: "20–100" },
      { value: "100-300", label: "100–300" },
      { value: "300-500", label: "300–500", signals: [{ area: "Bolagsstorlek nära BC:s övre gräns", classification: "config", note: "Vid 300–500 anställda bör man jämföra mot Finance & Supply Chain Management." }] },
      { value: "o500", label: "Över 500", signals: [{ area: "Bolagsstorlek över BC:s typiska målgrupp", classification: "outside", note: "Vid > 500 anställda är Finance & Supply Chain Management ofta mer rätt." }] },
    ],
  },
  {
    id: "q_segment",
    block: 1,
    text: "Vilket segment beskriver er verksamhet bäst?",
    options: [
      { value: "tillverkning", label: "Tillverkning och industri" },
      { value: "grossist", label: "Grossist, handel och distribution" },
      { value: "bygg", label: "Bygg och fastighet" },
      { value: "tjanste", label: "Tjänste- och projektbolag" },
      { value: "offentlig", label: "Offentlig sektor och non-profit" },
      { value: "finans", label: "Finans och försäkring" },
    ],
  },
];

// ============================================================
// STEG 2 – Bransch (visas beroende på segment)
// ============================================================
const STEP2: BcQuestion[] = [
  {
    id: "q_sub_tillverkning",
    block: 2,
    text: "Vilken bransch stämmer bäst?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "tillverkningsindustri", label: "Tillverkningsindustri" },
      { value: "livsmedel", label: "Livsmedel & Processindustri" },
      { value: "lifescience", label: "Life Science / Medtech" },
      { value: "jordbruk", label: "Jordbruk & Skogsbruk" },
      { value: "energi", label: "Energi & Utilities" },
    ],
  },
  {
    id: "q_sub_grossist",
    block: 2,
    text: "Vilken bransch stämmer bäst?",
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "grossist", label: "Grossist & Distribution" },
      { value: "retail", label: "Retail & E-handel" },
      { value: "mode", label: "Mode, Sport & Textil" },
      { value: "transport", label: "Transport & Logistik" },
      { value: "medtech-dist", label: "Medtech-distribution" },
    ],
  },
  {
    id: "q_sub_bygg",
    block: 2,
    text: "Vilken bransch stämmer bäst?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "bygg", label: "Bygg, Entreprenad & Installation" },
      { value: "fastighet", label: "Fastighet & Förvaltning" },
    ],
  },
  {
    id: "q_sub_tjanste",
    block: 2,
    text: "Vilken bransch stämmer bäst?",
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "konsult", label: "Konsulttjänster" },
      { value: "telekom", label: "Telekom & IT-tjänster" },
      { value: "uthyrning", label: "Uthyrningsverksamhet" },
    ],
  },
  {
    id: "q_sub_offentlig",
    block: 2,
    text: "Vilken organisation stämmer bäst?",
    showIf: (a) => seg(a, "offentlig"),
    options: [
      { value: "offentlig", label: "Offentlig sektor" },
      { value: "medlem", label: "Medlemsorganisationer" },
    ],
  },
];

// ============================================================
// STEG 3 – Juridik och geografi (generellt)
// ============================================================
const STEP3: BcQuestion[] = [
  {
    id: "q_companies",
    block: 3,
    text: "Hur många juridiska bolag behöver ni hantera?",
    options: [
      { value: "1", label: "Ett bolag", signals: [{ area: "Ett bolag", classification: "essentials" }] },
      { value: "2-5", label: "2–5 bolag", signals: [{ area: "Multi-bolag (2–5)", classification: "essentials", note: "Hanteras i BC med intercompany-funktioner i standard." }] },
      { value: "6-15", label: "6–15 bolag", signals: [{ area: "Multi-bolag (6–15) och konsolidering", classification: "config", note: "Kräver tydlig kontoplansstrategi och ev. konsolideringsverktyg." }] },
      { value: "15+", label: "Fler än 15 bolag", signals: [{ area: "Koncern med > 15 bolag", classification: "outside", note: "Ofta för komplext för BC – F&SCM eller separat konsolideringsverktyg är mer rimligt." }] },
    ],
  },
  {
    id: "q_geo",
    block: 3,
    text: "Har ni verksamhet i flera länder?",
    options: [
      { value: "se", label: "Nej, enbart Sverige", signals: [{ area: "Endast Sverige", classification: "essentials" }] },
      { value: "norden", label: "Ja, i Norden", signals: [{ area: "Multi-land Norden", classification: "essentials", note: "Lokaliseringar finns för alla nordiska länder." }] },
      { value: "europa", label: "Ja, i Europa utanför Norden", signals: [{ area: "Europa utanför Norden", classification: "config", note: "Lokaliseringar varierar i mognad – kräver utvärdering per land." }] },
      { value: "global", label: "Ja, globalt på flera kontinenter", signals: [{ area: "Global verksamhet", classification: "outside", note: "Global rollout med många lokaliseringar passar oftare F&SCM." }] },
    ],
  },
  {
    id: "q_reporting",
    block: 3,
    text: "Vilka rapporteringskrav har ni?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    options: [
      { value: "monad", label: "Månadsrapport per bolag", signals: [{ area: "Månadsrapport per bolag", classification: "essentials" }] },
      { value: "koncern", label: "Konsoliderad koncernredovisning", signals: [{ area: "Konsoliderad koncernredovisning", classification: "config", note: "BC har grundläggande konsolidering, men ofta behövs Jet Reports/Power BI eller ISV." }] },
      { value: "ifrs", label: "IFRS-rapportering", signals: [{ area: "IFRS-rapportering", classification: "isv", note: "Kräver oftast tilläggsverktyg eller manuella mappningar." }] },
      { value: "dim", label: "Dimensionsanalys (avdelning, projekt, kostnadsbärare)", signals: [{ area: "Dimensionsanalys flera nivåer", classification: "essentials", note: "BC har starkt dimensionsstöd i standard." }] },
      { value: "budget", label: "Avancerad budgetering och rullande prognoser", signals: [{ area: "Avancerad budget och prognos", classification: "isv", note: "BC har enkel budget – för rullande prognoser används oftast Jedox, Solver eller liknande." }] },
    ],
  },
  {
    id: "q_ap",
    block: 3,
    text: "Hur hanterar ni leverantörsfakturor idag?",
    options: [
      { value: "manuellt", label: "Manuellt – vi skriver in eller e-postar vidare", signals: [{ area: "AP-automation saknas", classification: "isv", note: "Continia Document Capture eller ExFlow rekommenderas i BC-projekt." }] },
      { value: "skanning", label: "Vi skannar och läser av", signals: [{ area: "Skanningslösning för leverantörsfakturor", classification: "isv" }] },
      { value: "automation-byta", label: "Vi har AP-automation men vill byta", signals: [{ area: "Befintlig AP-automation ska ersättas", classification: "isv" }] },
      { value: "ok", label: "Det fungerar okej som det är" },
    ],
  },
  {
    id: "q_current_system",
    block: 3,
    text: "Vilket system kör ni idag?",
    options: [
      { value: "fortnox-visma", label: "Fortnox, Visma eller liknande ekonomisystem", signals: [{ area: "Migration från SMB-ekonomisystem", classification: "essentials", note: "Klassisk uppgradering till BC – välbeprövat scenario." }] },
      { value: "old-dynamics", label: "Äldre Dynamics (NAV, GP, AX)", signals: [{ area: "Uppgradering från äldre Dynamics", classification: "config", note: "NAV-uppgradering har tydliga migrationsverktyg; AX/GP är mer omfattande." }] },
      { value: "sap-oracle", label: "SAP eller Oracle", signals: [{ area: "Byte från SAP/Oracle", classification: "outside", note: "Om SAP/Oracle valts av storleksskäl är det inte säkert att BC räcker – utvärdera F&SCM." }] },
      { value: "egen", label: "Egenutvecklat system", signals: [{ area: "Migration från egenutvecklat system", classification: "config", note: "Kräver tydlig kartläggning av befintliga processer." }] },
      { value: "inget", label: "Inget sammanhållet system ännu", signals: [{ area: "Första ERP-implementationen", classification: "essentials" }] },
    ],
  },
];

// ============================================================
// STEG 4 – Branschspecifika frågor
// ============================================================

// --- Tillverkning ---
const STEP4_T: BcQuestion[] = [
  {
    id: "qt_typ",
    block: 4,
    text: "Vilken typ av tillverkning beskriver er bäst?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "diskret", label: "Diskret – vi monterar identifierbara enheter", signals: [{ area: "Diskret tillverkning", classification: "premium", note: "Kräver BC Premium (Manufacturing)." }] },
      { value: "process", label: "Processindustri – recept/formler", signals: [{ area: "Processindustri med recept/formler", classification: "isv", note: "BC har ingen renodlad processtillverkning – kräver ISV som SI Foodware, LS Central Food eller liknande." }] },
      { value: "repetitiv", label: "Repetitiv – hög volym standardprodukter", signals: [{ area: "Repetitiv produktion med hög volym", classification: "premium" }] },
      { value: "eto", label: "Projektbaserad / kundspecifik (ETO/CTO)", signals: [{ area: "ETO/CTO-tillverkning", classification: "isv", note: "BC Premium klarar enkel projekttillverkning – avancerad ETO kräver ISV." }] },
      { value: "ravara", label: "Vi förädlar råvaror (jordbruk, skog)", signals: [{ area: "Råvaruförädling", classification: "isv" }] },
    ],
  },
  {
    id: "qt_bom",
    block: 4,
    text: "Hur komplex är er produktstruktur?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "enkla", label: "Enkla artiklar utan strukturer", signals: [{ area: "Inga BOM-strukturer", classification: "essentials" }] },
      { value: "bom1", label: "Enkel BOM – en nivå", signals: [{ area: "Enkel produktstruktur (1-nivå BOM)", classification: "premium" }] },
      { value: "bomN", label: "Flernivå-BOM med komponenter och halvfabrikat", signals: [{ area: "Flernivå-BOM", classification: "premium" }] },
      { value: "konfig", label: "Produktkonfigurator – kunden väljer varianter som styr BOM och kalkyl", signals: [{ area: "Produktkonfigurator", classification: "isv", note: "BC har ingen avancerad konfigurator i standard – Experlogix, To-Increase eller liknande." }] },
      { value: "recept", label: "Recept och formler med samprodukter eller biprodukter", signals: [{ area: "Recept med sam-/biprodukter", classification: "isv" }] },
    ],
  },
  {
    id: "qt_mrp",
    block: 4,
    text: "Hur hanterar ni produktionsplanering och MRP idag?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "excel", label: "Excel eller inget formellt system", signals: [{ area: "Behov av MRP", classification: "premium" }] },
      { value: "separat", label: "Planeringsverktyg frikopplat från ekonomin", signals: [{ area: "MRP integrerat med ekonomi", classification: "premium" }] },
      { value: "mrp", label: "Vi behöver MRP/MPS integrerat i ERP", signals: [{ area: "MRP/MPS integrerat i ERP", classification: "premium", note: "Ingår i BC Premium." }] },
      { value: "aps", label: "Vi behöver avancerad kapacitets- och resursoptimering (APS)", signals: [{ area: "Avancerad APS-planering", classification: "isv", note: "BC har ingen riktig APS – kräver ISV som Netronic eller Insight Works." }] },
    ],
  },
  {
    id: "qt_track",
    block: 4,
    text: "Krävs spårbarhet på batch- eller serienummernivå?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "inkop", label: "Ja, på inköpta komponenter", signals: [{ area: "Spårbarhet på inköpta komponenter", classification: "essentials" }] },
      { value: "fardig", label: "Ja, på färdiga produkter", signals: [{ area: "Spårbarhet på färdiga produkter", classification: "premium" }] },
      { value: "regulatorisk", label: "Ja, fullständig spårbarhet – regulatoriska krav (GMP, UDI, ISO)", signals: [{ area: "Regulatorisk spårbarhet (GMP/UDI/ISO)", classification: "isv", note: "Kräver branschspecifika ISV som Aptean, SI Foodware eller validerings­paket för Life Science." }] },
    ],
  },
  {
    id: "qt_sites",
    block: 4,
    text: "Hur många produktionssiter har ni?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "1", label: "1" },
      { value: "2-3", label: "2–3", signals: [{ area: "Multi-site produktion (2–3)", classification: "premium" }] },
      { value: "4-10", label: "4–10", signals: [{ area: "Multi-site produktion (4–10)", classification: "config", note: "Hanterbart i BC men kräver tydlig dimensionsstrategi." }] },
      { value: "10+", label: "Fler än 10", signals: [{ area: "10+ produktionssiter", classification: "outside", note: "Vid > 10 siter brukar F&SCM ge bättre stöd." }] },
      { value: "ingen", label: "Ingen egen produktion – vi styr tillverkning externt", signals: [{ area: "Legotillverkning utan egen produktion", classification: "config" }] },
    ],
  },
  {
    id: "qt_warehouses",
    block: 4,
    text: "Hur många lager- eller distributionsanläggningar har ni?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "1", label: "1" },
      { value: "2-3", label: "2–3", signals: [{ area: "Multi-lager (2–3)", classification: "essentials" }] },
      { value: "4-10", label: "4–10", signals: [{ area: "Multi-lager (4–10)", classification: "premium" }] },
      { value: "10+", label: "Fler än 10", signals: [{ area: "10+ lager", classification: "outside" }] },
      { value: "3pl", label: "Inga egna lager – allt via 3PL", signals: [{ area: "3PL-integration", classification: "isv" }] },
    ],
  },
  {
    id: "qt_service",
    block: 4,
    text: "Hanterar ni eftermarknad, service eller reservdelar?",
    showIf: (a) => seg(a, "tillverkning"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "delar", label: "Ja, vi säljer reservdelar", signals: [{ area: "Reservdelsförsäljning", classification: "essentials" }] },
      { value: "service", label: "Ja, serviceorganisation med arbetsorder och avtal", signals: [{ area: "Service Management (avtal, arbetsorder)", classification: "premium", note: "BC Premium innehåller Service Management." }] },
      { value: "falt", label: "Ja, fälttekniker ute hos kund", signals: [{ area: "Field Service", classification: "outside", note: "Avancerad fälttekniker­hantering ligger i Dynamics 365 Field Service, inte i BC." }] },
    ],
  },
];

// --- Grossist/Handel ---
const STEP4_H: BcQuestion[] = [
  {
    id: "qh_modell",
    block: 4,
    text: "Hur ser er affärsmodell ut?",
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "b2b", label: "Grossist – B2B mot återförsäljare eller industri", signals: [{ area: "B2B-grossist", classification: "essentials" }] },
      { value: "b2c", label: "Retail – B2C i butik eller online", signals: [{ area: "B2C-retail", classification: "outside", note: "Renodlad butiks-POS hanteras bäst i LS Central eller Dynamics 365 Commerce." }] },
      { value: "omni", label: "Omnichannel – fysisk butik och e-handel parallellt", signals: [{ area: "Omnichannel butik+e-handel", classification: "outside", note: "Kräver LS Central eller Dynamics 365 Commerce ovanpå BC." }] },
      { value: "3pl", label: "Distribution/3PL – vi lagrar och transporterar åt andra", signals: [{ area: "3PL/distribution", classification: "isv" }] },
      { value: "medtech", label: "Medtech-distribution med regulatoriska krav", signals: [{ area: "Medtech-distribution med regulatoriska krav", classification: "isv", note: "Kräver validerad ISV (t.ex. Aptean Medical)." }] },
    ],
  },
  {
    id: "qh_sortiment",
    block: 4,
    text: "Hur stort är ert artikelsortiment?",
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "u1k", label: "Under 1 000 artiklar", signals: [{ area: "Litet sortiment", classification: "essentials" }] },
      { value: "1k-20k", label: "1 000–20 000 artiklar", signals: [{ area: "Medelstort sortiment", classification: "essentials" }] },
      { value: "20k-100k", label: "20 000–100 000 artiklar", signals: [{ area: "Stort sortiment (20k–100k)", classification: "config" }] },
      { value: "100k+", label: "Över 100 000 artiklar eller varianter (storlek/färg)", signals: [{ area: "Mycket stort sortiment eller komplexa varianter", classification: "isv", note: "Storlek/färg-matriser kräver ofta ISV (t.ex. Anveo, K3 Fashion)." }] },
    ],
  },
  {
    id: "qh_pris",
    block: 4,
    text: "Hur komplex är er prissättning?",
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "ett", label: "Ett pris per artikel", signals: [{ area: "Enkel prissättning", classification: "essentials" }] },
      { value: "kund", label: "Kundspecifika priser och rabatter", signals: [{ area: "Kundspecifik prissättning", classification: "essentials" }] },
      { value: "volym", label: "Volymrabatter, kampanjpriser, avtalsbaserad prissättning", signals: [{ area: "Avancerad prissättning", classification: "config" }] },
      { value: "problem", label: "Kombination – prissättning är ett problemområde idag", signals: [{ area: "Komplex prissättning som problemområde", classification: "isv", note: "Avancerad prissättning kräver ofta ISV (t.ex. Pricing Suite, NORRIQ)." }] },
    ],
  },
  {
    id: "qh_lager",
    block: 4,
    text: "Vilka lagerkrav har ni?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "grund", label: "Grundläggande lagerhantering", signals: [{ area: "Grundläggande lager", classification: "essentials" }] },
      { value: "wms", label: "Streckkods- och scanningstöd (WMS)", signals: [{ area: "WMS med scanning", classification: "premium", note: "Avancerad WMS ingår i BC Premium." }] },
      { value: "multi", label: "Multi-lager eller 3PL-integration", signals: [{ area: "Multi-lager / 3PL", classification: "isv" }] },
      { value: "cross", label: "Cross-docking eller direktleverans", signals: [{ area: "Cross-docking", classification: "isv" }] },
      { value: "batch", label: "Batch-/serienummer eller FEFO", signals: [{ area: "Batch-/serienummer/FEFO", classification: "premium" }] },
    ],
  },
  {
    id: "qh_kanaler",
    block: 4,
    text: "Hur många försäljningskanaler har ni?",
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "1", label: "En kanal" },
      { value: "separata", label: "Flera kanaler men separata – ingen gemensam lagervy", signals: [{ area: "Separata kanaler utan lagersynk", classification: "config" }] },
      { value: "integrerade", label: "Integrerade kanaler med gemensam lagervy och orderbild", signals: [{ area: "Integrerade kanaler med gemensam lagervy", classification: "isv" }] },
    ],
  },
  {
    id: "qh_online",
    block: 4,
    text: "Säljer ni online?",
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "shopify", label: "Ja, via Shopify", signals: [{ area: "Shopify-integration", classification: "isv", note: "Färdiga konnektorer finns från flera ISV." }] },
      { value: "annan", label: "Ja, via annan plattform (Woo, Magento)", signals: [{ area: "E-handelsintegration", classification: "isv" }] },
      { value: "b2bportal", label: "Ja, B2B-kundportal med orderläggning online", signals: [{ area: "B2B-kundportal", classification: "isv", note: "Sana Commerce, Dynamicweb m.fl." }] },
      { value: "omni", label: "Ja, omnichannel med POS och e-handel parallellt", signals: [{ area: "Omnichannel med POS", classification: "outside", note: "LS Central eller Dynamics 365 Commerce." }] },
    ],
  },
  {
    id: "qh_warehouses",
    block: 4,
    text: "Hur många lager- eller distributionsanläggningar har ni?",
    showIf: (a) => seg(a, "grossist"),
    options: [
      { value: "1", label: "1" },
      { value: "2-3", label: "2–3" },
      { value: "4-10", label: "4–10", signals: [{ area: "Multi-lager (4–10)", classification: "premium" }] },
      { value: "10+", label: "Fler än 10", signals: [{ area: "10+ lager", classification: "outside" }] },
      { value: "3pl", label: "Inga egna lager – allt via 3PL", signals: [{ area: "3PL-flöden", classification: "isv" }] },
    ],
  },
];

// --- Bygg/Fastighet ---
const STEP4_B: BcQuestion[] = [
  {
    id: "qb_typ",
    block: 4,
    text: "Vad beskriver er verksamhet bäst?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "byggentreprenor", label: "Byggentreprenör – bygg- och anläggningsprojekt", signals: [{ area: "Byggentreprenad", classification: "isv", note: "BC saknar bygg-specifik funktionalitet i standard – kräver ISV som NAVET, Pyramid, EG eller liknande." }] },
      { value: "ue", label: "Underentreprenör eller hantverkare", signals: [{ area: "Underentreprenör / hantverkare", classification: "isv" }] },
      { value: "utvecklare", label: "Fastighetsutvecklare", signals: [{ area: "Fastighetsutveckling", classification: "isv" }] },
      { value: "forvaltning", label: "Fastighetsförvaltning", signals: [{ area: "Fastighetsförvaltning", classification: "isv", note: "Kräver fastighets-ISV (t.ex. To-Increase RE, Vitec)." }] },
      { value: "kombo", label: "Kombination av byggande och förvaltning", signals: [{ area: "Bygg + förvaltning kombinerat", classification: "isv" }] },
    ],
  },
  {
    id: "qb_ata",
    block: 4,
    text: "Hur hanterar ni ÄTA-arbeten?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "informellt", label: "Informellt – Excel eller e-post", signals: [{ area: "ÄTA-hantering saknas", classification: "isv" }] },
      { value: "separat", label: "Vi har ett system frikopplat från ekonomin", signals: [{ area: "ÄTA frikopplat från ekonomi", classification: "isv" }] },
      { value: "problem", label: "ÄTA-hantering är ett av våra största problemområden", signals: [{ area: "ÄTA är kritiskt problemområde", classification: "isv" }] },
    ],
  },
  {
    id: "qb_vinst",
    block: 4,
    text: "Kräver ni successiv vinstavräkning?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "nej", label: "Nej, vi redovisar vid projektavslut" },
      { value: "lopande", label: "Ja, löpande under projektets gång", signals: [{ area: "Successiv vinstavräkning", classification: "config", note: "Möjligt i BC men kräver konfiguration och rutiner." }] },
      { value: "revisor", label: "Ja, och revisorn ställer krav på systemet", signals: [{ area: "Successiv vinstavräkning med revisorkrav", classification: "isv" }] },
    ],
  },
  {
    id: "qb_ue",
    block: 4,
    text: "Arbetar ni med underentreprenörer?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "enstaka", label: "Ja, enstaka", signals: [{ area: "Enkel UE-hantering", classification: "essentials" }] },
      { value: "manga", label: "Ja, många UE parallellt – kontroll mot projektbudget är kritiskt", signals: [{ area: "UE-uppföljning mot projektbudget", classification: "isv" }] },
    ],
  },
  {
    id: "qb_projekt",
    block: 4,
    text: "Hur många aktiva projekt har ni samtidigt?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "u10", label: "Under 10", signals: [{ area: "Få parallella projekt", classification: "premium" }] },
      { value: "10-50", label: "10–50", signals: [{ area: "Medelstor projektportfölj", classification: "premium" }] },
      { value: "50-200", label: "50–200", signals: [{ area: "Stor projektportfölj", classification: "isv" }] },
      { value: "200+", label: "Över 200", signals: [{ area: "Mycket stor projektportfölj", classification: "outside" }] },
    ],
  },
  {
    id: "qb_hyra",
    block: 4,
    text: "Hanterar ni hyreskontrakt och avisering?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "nej", label: "Ej aktuellt" },
      { value: "fa", label: "Ja, ett fåtal hyresgäster", signals: [{ area: "Enkel hyresadministration", classification: "config" }] },
      { value: "manga", label: "Ja, många kontrakt med indexering och automatiserad avisering", signals: [{ area: "Hyresavtal med indexering", classification: "isv" }] },
      { value: "komm", label: "Ja, kommersiella hyresavtal med komplexa villkor", signals: [{ area: "Kommersiella hyresavtal", classification: "isv" }] },
    ],
  },
  {
    id: "qb_bestand",
    block: 4,
    text: "Hur stort är ert fastighetsbestånd?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "na", label: "Ej aktuellt" },
      { value: "u50", label: "Under 50 objekt" },
      { value: "50-500", label: "50–500 objekt", signals: [{ area: "Medelstort fastighetsbestånd", classification: "isv" }] },
      { value: "500-2k", label: "500–2 000 objekt", signals: [{ area: "Stort fastighetsbestånd", classification: "isv" }] },
      { value: "2k+", label: "Över 2 000 objekt", signals: [{ area: "Mycket stort fastighetsbestånd", classification: "outside", note: "Vid > 2 000 objekt brukar specialiserat fastighets­system bli mer rätt." }] },
    ],
  },
  {
    id: "qb_imd",
    block: 4,
    text: "Hanterar ni individuell mätning och debitering (IMD)?",
    showIf: (a) => seg(a, "bygg"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "enkel", label: "Ja, enkel fördelning", signals: [{ area: "Enkel IMD-fördelning", classification: "config" }] },
      { value: "auto", label: "Ja, IMD med mätvärdesinsamling och automatisk debitering", signals: [{ area: "IMD med automatiserad mätvärdesinsamling", classification: "isv" }] },
    ],
  },
];

// --- Tjänste/Projekt ---
const STEP4_P: BcQuestion[] = [
  {
    id: "qp_processer",
    block: 4,
    text: "Vilka processer behöver systemet stödja?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "sales", label: "Säljstöd och anbudshantering", signals: [{ area: "Säljstöd / anbud", classification: "outside", note: "Hanteras bättre i Dynamics 365 Sales – integreras mot BC." }] },
      { value: "projekt", label: "Projektstyrning (faser, budget, tidplaner)", signals: [{ area: "Projektstyrning", classification: "premium", note: "Jobs ingår i BC Essentials, projektstruktur i Premium." }] },
      { value: "tid", label: "Tid- och utläggsrapportering", signals: [{ area: "Tid- och utläggsrapportering", classification: "isv", note: "BC har enkel tidrapportering – för konsultverksamhet används oftast Continia Expense, Timeapp eller liknande." }] },
      { value: "fakturering", label: "Projektfakturering", signals: [{ area: "Projektfakturering", classification: "premium" }] },
      { value: "lonsamhet", label: "Projektredovisning och lönsamhetsuppföljning per projekt", signals: [{ area: "Projektlönsamhet per uppdrag", classification: "premium" }] },
      { value: "resurs", label: "Resurs- och beläggningsplanering per konsult/resurs", signals: [{ area: "Resurs- och beläggningsplanering", classification: "isv", note: "Avancerad beläggning kräver ISV (Cinode, TimeLog, Projectum)." }] },
      { value: "avtal", label: "Avtalshantering och ramavtal", signals: [{ area: "Avtals- och ramavtalshantering", classification: "isv" }] },
      { value: "kompetens", label: "Kompetensregister per konsult", signals: [{ area: "Kompetensregister", classification: "outside", note: "Cinode eller liknande HR/Skill-system rekommenderas." }] },
    ],
  },
  {
    id: "qp_fakturering",
    block: 4,
    text: "Hur fakturerar ni era kunder?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "lopande", label: "Löpande räkning (tid och material)", signals: [{ area: "T&M-fakturering", classification: "premium" }] },
      { value: "fast", label: "Fast pris", signals: [{ area: "Fastprisprojekt", classification: "premium" }] },
      { value: "milst", label: "Milstolpebaserat", signals: [{ area: "Milstolpefakturering", classification: "config" }] },
      { value: "abonnemang", label: "Abonnemang eller återkommande avgifter", signals: [{ area: "Abonnemangsfakturering", classification: "isv", note: "Continia Subscription Billing eller liknande." }] },
      { value: "xaas", label: "XaaS eller förbrukningsbaserat (usage billing)", signals: [{ area: "Usage billing / XaaS", classification: "isv" }] },
      { value: "kombo", label: "Kombination", signals: [{ area: "Blandade faktureringsmodeller", classification: "isv" }] },
    ],
  },
  {
    id: "qp_resurs",
    block: 4,
    text: "Är resursplanering och beläggningsstyrning ett aktivt behov?",
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "nej", label: "Nej, vi hanterar det informellt" },
      { value: "excel", label: "Ja, men vi gör det i Excel idag", signals: [{ area: "Resursplanering i Excel idag", classification: "isv" }] },
      { value: "kritiskt", label: "Ja, och bristande beläggningskontroll är ett av våra största problemområden", signals: [{ area: "Beläggning är kritiskt problemområde", classification: "outside", note: "Avancerad beläggning hanteras ofta bäst i Dynamics 365 Project Operations." }] },
    ],
  },
  {
    id: "qp_intakt",
    block: 4,
    text: "Hur hanterar ni intäktsredovisning per projekt?",
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "ingen", label: "Vi redovisar inte per projekt" },
      { value: "excel", label: "Vi gör det manuellt i Excel", signals: [{ area: "Intäktsredovisning manuell", classification: "config" }] },
      { value: "lopande", label: "Vi har krav på löpande intäktsredovisning per projekt eller fas", signals: [{ area: "Löpande intäktsredovisning per projekt", classification: "isv" }] },
    ],
  },
  {
    id: "qp_konsulter",
    block: 4,
    text: "Hur många fakturerbara konsulter eller resurser har ni?",
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "u20", label: "Under 20", signals: [{ area: "Liten konsultorganisation", classification: "premium" }] },
      { value: "20-100", label: "20–100", signals: [{ area: "Medelstor konsultorganisation", classification: "premium" }] },
      { value: "100-500", label: "100–500", signals: [{ area: "Stor konsultorganisation", classification: "outside", note: "Vid > 100 fakturerbara är Project Operations ofta mer rätt." }] },
      { value: "500+", label: "Över 500", signals: [{ area: "Mycket stor konsultorganisation", classification: "outside" }] },
    ],
  },
  {
    id: "qp_uppdrag",
    block: 4,
    text: "Hur många aktiva uppdrag eller projekt har ni samtidigt?",
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "u20", label: "Under 20" },
      { value: "20-100", label: "20–100" },
      { value: "100-500", label: "100–500", signals: [{ area: "Stor uppdragsvolym", classification: "isv" }] },
      { value: "500+", label: "Över 500", signals: [{ area: "Mycket stor uppdragsvolym", classification: "outside" }] },
    ],
  },
  {
    id: "qp_prenumeration",
    block: 4,
    text: "Hur många aktiva prenumerationer eller löpande kontrakt förvaltar ni?",
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "na", label: "Ej aktuellt" },
      { value: "u100", label: "Under 100", signals: [{ area: "Mindre prenumerationsstock", classification: "isv" }] },
      { value: "100-1k", label: "100–1 000", signals: [{ area: "Medelstor prenumerationsstock", classification: "isv" }] },
      { value: "1k+", label: "Över 1 000", signals: [{ area: "Stor prenumerationsstock", classification: "isv", note: "Kräver dedikerat subscription billing-tillägg." }] },
    ],
  },
  {
    id: "qp_underkonsult",
    block: 4,
    text: "Arbetar ni med underkonsulter som ni vidarefakturerar?",
    showIf: (a) => seg(a, "tjanste"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "enstaka", label: "Ja, enstaka – enkla inköpsorder räcker", signals: [{ area: "Enkel underkonsult-hantering", classification: "essentials" }] },
      { value: "vidare", label: "Ja, och vi vidarefakturerar tid och utlägg till kund", signals: [{ area: "Vidarefakturering av tid/utlägg", classification: "isv" }] },
    ],
  },
];

// --- Offentlig/Non-profit ---
const STEP4_O: BcQuestion[] = [
  {
    id: "qo_typ",
    block: 4,
    text: "Vad beskriver er organisation bäst?",
    showIf: (a) => seg(a, "offentlig"),
    options: [
      { value: "kommun", label: "Kommunal eller regional förvaltning", signals: [{ area: "Kommunal/regional förvaltning", classification: "outside", note: "Kommun/region kräver oftast specialiserade ekonomisystem (UBW, Visma)." }] },
      { value: "kommunalt-bolag", label: "Kommunalt bolag", signals: [{ area: "Kommunalt bolag", classification: "config" }] },
      { value: "stat", label: "Statlig myndighet", signals: [{ area: "Statlig myndighet", classification: "outside" }] },
      { value: "stiftelse", label: "Ideell organisation eller stiftelse", signals: [{ area: "Ideell/stiftelse", classification: "isv" }] },
      { value: "branschorg", label: "Bransch- eller intresseorganisation", signals: [{ area: "Branschorganisation", classification: "isv" }] },
      { value: "medlem", label: "Medlemsorganisation med kontingenthantering", signals: [{ area: "Medlemsorganisation med kontingent", classification: "isv" }] },
    ],
  },
  {
    id: "qo_lou",
    block: 4,
    text: "Omfattas ni av LOU?",
    showIf: (a) => seg(a, "offentlig"),
    options: [
      { value: "ja", label: "Ja, fullt ut", signals: [{ area: "LOU-krav", classification: "config", note: "BC kan användas men inköpsprocess kan behöva ISV för avrop mot ramavtal." }] },
      { value: "delvis", label: "Ja, delvis", signals: [{ area: "Partiella LOU-krav", classification: "config" }] },
      { value: "nej", label: "Nej" },
    ],
  },
  {
    id: "qo_ekonomi",
    block: 4,
    text: "Vilka ekonomiska särkrav har ni?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    showIf: (a) => seg(a, "offentlig"),
    options: [
      { value: "anslag", label: "Anslagsredovisning och budgetkontroll per anslag", signals: [{ area: "Anslagsredovisning", classification: "isv" }] },
      { value: "bidrag", label: "Projektredovisning per bidrag eller finansieringskälla", signals: [{ area: "Bidragsredovisning per finansiär", classification: "isv" }] },
      { value: "fond", label: "Fond- och bidragsredovisning med återrapporteringskrav", signals: [{ area: "Fond-/bidragsredovisning", classification: "isv" }] },
      { value: "bas-k", label: "Kontoplan kopplad till BAS-K eller offentlig standard", signals: [{ area: "BAS-K eller offentlig kontoplan", classification: "config" }] },
      { value: "frii", label: "90-konto och FRII-krav", signals: [{ area: "90-konto / FRII", classification: "isv" }] },
    ],
  },
  {
    id: "qo_medlem",
    block: 4,
    text: "Hanterar ni medlemmar, kontingenter eller volontärer?",
    showIf: (a) => seg(a, "offentlig"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "enkel", label: "Ja, enkel medlemshantering", signals: [{ area: "Enkel medlemshantering", classification: "isv" }] },
      { value: "komplex", label: "Ja, komplexa avgiftsmodeller med automatiserad fakturering", signals: [{ area: "Komplex kontingenthantering", classification: "isv" }] },
      { value: "vol", label: "Ja, och vi hanterar volontärer och förtroendemannaregister", signals: [{ area: "Volontär-/förtroendemannaregister", classification: "outside", note: "Hanteras oftast bättre i medlems-CRM (t.ex. Lime, Membit)." }] },
    ],
  },
  {
    id: "qo_volym",
    block: 4,
    text: "Hur många medlemmar eller bidragsmottagare hanterar ni?",
    showIf: (a) => seg(a, "offentlig"),
    options: [
      { value: "na", label: "Ej aktuellt" },
      { value: "u500", label: "Under 500" },
      { value: "500-5k", label: "500–5 000" },
      { value: "5k-50k", label: "5 000–50 000", signals: [{ area: "Stor medlemsvolym", classification: "isv" }] },
      { value: "50k+", label: "Över 50 000", signals: [{ area: "Mycket stor medlemsvolym", classification: "outside" }] },
    ],
  },
  {
    id: "qo_portal",
    block: 4,
    text: "Har ni krav på Mina Sidor eller självserviceportal?",
    showIf: (a) => seg(a, "offentlig"),
    options: [
      { value: "nej", label: "Nej" },
      { value: "enkel", label: "Ja, enkel portal", signals: [{ area: "Självserviceportal", classification: "isv" }] },
      { value: "arende", label: "Ja, självservice med ärendehantering och betalning online", signals: [{ area: "Ärendehantering med betalning", classification: "outside" }] },
    ],
  },
];

// --- Finans/Försäkring ---
const STEP4_F: BcQuestion[] = [
  {
    id: "qf_typ",
    block: 4,
    text: "Vad beskriver er verksamhet bäst?",
    showIf: (a) => seg(a, "finans"),
    options: [
      { value: "bank", label: "Bank eller kreditinstitut", signals: [{ area: "Bank/kreditinstitut", classification: "outside", note: "Kärnverksamhet kräver branschsystem – BC kan användas för intern ekonomi." }] },
      { value: "forsakring", label: "Försäkringsbolag", signals: [{ area: "Försäkringsbolag", classification: "outside" }] },
      { value: "kap", label: "Kapitalförvaltning", signals: [{ area: "Kapitalförvaltning", classification: "outside" }] },
      { value: "fintech", label: "Finansiellt tjänstebolag (leasing, factoring, fintech)", signals: [{ area: "Finansiellt tjänstebolag", classification: "isv" }] },
      { value: "byra", label: "Redovisnings- eller revisionsbyrå", signals: [{ area: "Redovisnings-/revisionsbyrå", classification: "essentials", note: "BC fungerar för byråns egen ekonomi och projekt." }] },
    ],
  },
  {
    id: "qf_crm_erp",
    block: 4,
    text: "Är er primära systemutmaning inom CRM eller ERP?",
    showIf: (a) => seg(a, "finans"),
    options: [
      { value: "crm", label: "Primärt CRM – kundhantering, pipeline, KYC/AML", signals: [{ area: "CRM-utmaning (KYC/AML)", classification: "outside", note: "Hör hemma i Dynamics 365 Sales/Customer Insights, inte i BC." }] },
      { value: "erp", label: "Primärt ERP – ekonomi, rapportering, interna processer", signals: [{ area: "ERP-fokus internt", classification: "essentials" }] },
      { value: "bade", label: "Bådadera", signals: [{ area: "Både CRM och ERP", classification: "config" }] },
    ],
  },
  {
    id: "qf_reg",
    block: 4,
    text: "Har ni regulatoriska systemkrav?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    showIf: (a) => seg(a, "finans"),
    options: [
      { value: "ifrs17", label: "IFRS 17", signals: [{ area: "IFRS 17", classification: "outside" }] },
      { value: "solvens", label: "Solvens II", signals: [{ area: "Solvens II", classification: "outside" }] },
      { value: "mifid", label: "MiFID II eller liknande", signals: [{ area: "MiFID II", classification: "outside" }] },
      { value: "dora", label: "DORA", signals: [{ area: "DORA-efterlevnad", classification: "config" }] },
      { value: "kyc", label: "KYC/AML-processer i systemet", signals: [{ area: "KYC/AML i systemet", classification: "outside" }] },
    ],
  },
];

// ============================================================
// STEG 5 – Nuläge (per segment, förenklat)
// ============================================================
const supportOpts = (label: string): BcOption[] => [
  { value: "bra", label: "Mycket bra – systemet täcker det vi behöver" },
  { value: "ok", label: "Acceptabelt men med tydliga luckor", signals: [{ area: `Tydliga luckor i nuvarande ${label}`, classification: "config" }] },
  { value: "daligt", label: "Otillräckligt – stora brister", signals: [{ area: `Stora brister i nuvarande ${label}`, classification: "outside", note: "Bör driva på ett snabbare byte." }] },
];

const masterDataOpts: BcOption[] = [
  { value: "bra", label: "God struktur och aktuell data" },
  { value: "ok", label: "Fungerar men kräver manuellt underhåll", signals: [{ area: "Masterdata kräver manuellt arbete", classification: "config" }] },
  { value: "daligt", label: "Stora brister – data är spridd, inaktuell eller duplicerad", signals: [{ area: "Masterdata har stora brister", classification: "config", note: "Bör adresseras tidigt – höjer både projektrisk och kostnad." }] },
];

const STEP5: BcQuestion[] = [
  {
    id: "n1",
    block: 5,
    text: "Hur väl stödjer nuvarande system er verksamhet?",
    options: supportOpts("systemstöd"),
  },
  {
    id: "n4",
    block: 5,
    text: "Hur fungerar er masterdata (kunder, artiklar, avtal etc.)?",
    options: masterDataOpts,
  },
];

// ============================================================
// STEG 6 – Integrationer och brådska (generellt)
// ============================================================
const STEP6: BcQuestion[] = [
  {
    id: "i1",
    block: 6,
    text: "Vilka kringliggande system använder ni idag?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    options: [
      { value: "mes", label: "MES / produktionsuppföljning", signals: [{ area: "MES-integration", classification: "isv" }] },
      { value: "plm", label: "PLM / PDM", signals: [{ area: "PLM/PDM-integration", classification: "isv" }] },
      { value: "wms", label: "WMS / lager (separat system)", signals: [{ area: "Separat WMS", classification: "isv" }] },
      { value: "tms", label: "TMS / transport", signals: [{ area: "TMS-integration", classification: "isv" }] },
      { value: "edi", label: "EDI", signals: [{ area: "EDI-flöden", classification: "isv" }] },
      { value: "ehandel", label: "E-handel / kundportal", signals: [{ area: "E-handel/portal", classification: "isv" }] },
      { value: "crm", label: "CRM (D365 Sales eller liknande)", signals: [{ area: "CRM-integration", classification: "config" }] },
      { value: "bi", label: "BI / datalager", signals: [{ area: "BI/datalager", classification: "config" }] },
      { value: "plan", label: "Planeringsverktyg (separat från ERP)", signals: [{ area: "Separat planeringsverktyg", classification: "isv" }] },
      { value: "kvalitet", label: "Kvalitetssystem", signals: [{ area: "Kvalitetssystem-integration", classification: "isv" }] },
      { value: "uh", label: "Underhållssystem", signals: [{ area: "Underhållssystem", classification: "isv" }] },
      { value: "excel", label: "Excel som primärt processverktyg", signals: [{ area: "Excel som processverktyg idag", classification: "config" }] },
      { value: "inga", label: "Inga större kringliggande system" },
    ],
  },
  {
    id: "i2",
    block: 6,
    text: "Vilka system behöver integreras med nytt ERP?",
    help: "Flerval – välj alla som stämmer.",
    multi: true,
    options: [
      { value: "lon", label: "Lönehantering (Hogia, Visma Lon, etc.)", signals: [{ area: "Lönesystem-integration", classification: "config" }] },
      { value: "hr", label: "HR-system", signals: [{ area: "HR-integration", classification: "config" }] },
      { value: "bi", label: "BI/analysverktyg", signals: [{ area: "BI-integration", classification: "config" }] },
      { value: "crm", label: "CRM (D365 Sales eller liknande)", signals: [{ area: "CRM-integration", classification: "config" }] },
      { value: "3pl", label: "Tredjepartslogistik (3PL)", signals: [{ area: "3PL-integration", classification: "isv" }] },
      { value: "edi", label: "EDI mot kunder eller leverantörer", signals: [{ area: "EDI mot motpart", classification: "isv" }] },
      { value: "ehandel", label: "E-handelsplattform", signals: [{ area: "E-handelsintegration", classification: "isv" }] },
      { value: "inget", label: "Inget särskilt integrationsbehov" },
    ],
  },
  {
    id: "i3",
    block: 6,
    text: "Hur komplex är integrationsbilden?",
    options: [
      { value: "enkel", label: "Enkelt – filöverföring eller manuell synk räcker" },
      { value: "mellan", label: "Mellannivå – ett par realtidsintegrationer mot viktiga system", signals: [{ area: "Realtidsintegrationer mot några system", classification: "config" }] },
      { value: "komplex", label: "Komplext – många system i realtid, affärskritiska flöden", signals: [{ area: "Komplex integrationsbild i realtid", classification: "isv", note: "Bör adresseras med tydlig integrationsplattform." }] },
    ],
  },
  {
    id: "i5",
    block: 6,
    text: "Hur brådskande är behovet av förändring?",
    options: [
      { value: "lag", label: "Låg brådska – vi planerar långsiktigt" },
      { value: "12-18", label: "Viktigt men inte akut – inom 12–18 månader" },
      { value: "6", label: "Brådskande – vi behöver agera inom 6 månader", signals: [{ area: "Brådskande tidsplan (< 6 mån)", classification: "config", note: "Korta tidsramar minskar utrymme för avancerade ISV-anpassningar." }] },
      { value: "kritisk", label: "Affärskritiskt – nuvarande situation är ohållbar", signals: [{ area: "Affärskritisk situation", classification: "config" }] },
    ],
  },
];

// ============================================================
// All questions
// ============================================================
export const BC_QUESTIONS: BcQuestion[] = [
  ...STEP1,
  ...STEP2,
  ...STEP3,
  ...STEP4_T,
  ...STEP4_H,
  ...STEP4_B,
  ...STEP4_P,
  ...STEP4_O,
  ...STEP4_F,
  ...STEP5,
  ...STEP6,
];

export const bcVisibleQuestions = (a: BcAnswers): BcQuestion[] =>
  BC_QUESTIONS.filter((q) => !q.showIf || q.showIf(a));

export { has };
