// Branschspecifika effektiviseringsdrivare för BC ROI-kalkylatorn.
// Estimat baserade på Microsofts Business Value Assessment (oktober 2025)
// + svenska partnerbenchmarks. Värden är medvetet konservativa och skalas
// mjukt med omsättning där det är relevant.

export type Industry = "Handel" | "Distribution" | "Tillverkning" | "Tjänster" | "Annan";

export interface RoiDriver {
  id: string;
  label: string;
  hint: string;
  /** Längre förklaring: vad drivaren faktiskt gör, var nyttan kommer ifrån och hur estimatet är räknat. */
  detail: string;
  /** Returnerar uppskattad årlig nytta i SEK. */
  savings: (revenue: number) => number;
  /** Engångskostnad som läggs på implementation om drivaren är aktiv. */
  implCost: number;
  /** Vilka ISV-kategorier denna drivare gör mer relevanta (för rekommendationer). */
  isvCategories?: string[];
  defaultOn?: boolean;
}

const flat = (sek: number) => () => sek;
const pctOfRev = (pct: number, cap = Infinity) => (rev: number) =>
  Math.min(cap, Math.max(0, rev) * pct);

export const INDUSTRY_DRIVERS: Record<Industry, RoiDriver[]> = {
  Handel: [
    {
      id: "order-entry",
      label: "Snabbare orderregistrering",
      hint: "Färre manuella order, integrerad webshop & EDI",
      detail:
        "Order från webb, e-post och EDI landar direkt i BC istället för att tangentas in. Nyttan kommer av sparad tid hos ordermottagning (typiskt 0,5–1 FTE i medelstora bolag) och färre felorder som annars genererar krediteringar och kundtjänstärenden. Estimat: ~57 000 kr/år som baseline, skalas med antal användare.",
      savings: flat(57_000),
      implCost: 60_000,
      isvCategories: ["EDI / e-faktura", "Integration / iPaaS"],
      defaultOn: true,
    },
    {
      id: "ecommerce",
      label: "Integrerad e-handel",
      hint: "Webshop kopplad till BC – färre fel, högre uplift",
      detail:
        "Lagersaldo, priser och kundvillkor synkas mot webbutiken; ordern flödar tillbaka utan dubbelregistrering. Effekten är mätbar genom färre översålda artiklar, snabbare leverans och en typisk konverteringsuplift på 1–3 % när korrekta saldon visas live. Estimat: 0,5 % av omsättning, takat vid 400 000 kr/år.",
      savings: pctOfRev(0.005, 400_000),
      implCost: 150_000,
      isvCategories: ["E-handel", "PIM"],
      defaultOn: true,
    },
    {
      id: "warehouse-light",
      label: "Lager- & plockeffektivitet",
      hint: "Streckkod/handdator, färre felplock",
      detail:
        "Streckkodsplock via handdator minskar felplock från typiska 1–2 % till under 0,3 % och höjer plockproduktiviteten med 15–25 %. Nyttan består av mindre returer/krediteringar, lägre svinn och färre timmar i lagret. Estimat: 0,3 % av omsättning, takat vid 250 000 kr/år.",
      savings: pctOfRev(0.003, 250_000),
      implCost: 100_000,
      isvCategories: ["WMS"],
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning mot inköpsorder",
      detail:
        "Pappers- och PDF-fakturor läses in via OCR, matchas automatiskt mot inköpsorder och attesteras digitalt. En typisk ekonomiavdelning sparar 10–20 minuter per faktura och får färre dröjsmålsräntor. Estimat: ~80 000 kr/år för ett bolag med 200–500 leverantörsfakturor i månaden.",
      savings: flat(80_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "pos",
      label: "Kassa-/POS-integration",
      hint: "Realtidsförsäljning in i BC, snabbare bokslut",
      detail:
        "Försäljning från butikskassor bokförs i BC samma dag istället för via filimport och manuell avstämning. Det ger korrekt lagersaldo i webshop, snabbare månadsbokslut (2–4 dagar kortare) och mindre kassadifferenser. Estimat: ~60 000 kr/år i sparad tid och minskat svinn.",
      savings: flat(60_000),
      implCost: 120_000,
      isvCategories: ["POS / Retail"],
      defaultOn: false,
    },
    {
      id: "price-currency",
      label: "Pris- & valutahantering",
      hint: "Lägre marginal-läckage på prisändringar",
      detail:
        "Strukturerade prislistor, valutakursuppdateringar och rabattregler minskar 'marginal-läckage' – när säljare ger fel pris eller valuta växlas på fel kurs. Typisk effekt är 0,1–0,3 % av omsättningen i återvunnen marginal. Estimat: 0,15 % av omsättning, takat vid 120 000 kr/år.",
      savings: pctOfRev(0.0015, 120_000),
      implCost: 30_000,
      defaultOn: false,
    },
  ],

  Distribution: [
    {
      id: "wms",
      label: "Avancerat lager (WMS)",
      hint: "Plockoptimering, zon-/vågplock, batchhantering",
      detail:
        "Riktigt WMS i BC (zon-/vågplock, putaway-strategier, batch-/serienummer) ger 20–40 % högre plockproduktivitet och nästan eliminerar felplock i högvolymslager. Effekten räknas på sparade lagertimmar, mindre returer och lägre kapitalbindning. Estimat: 0,6 % av omsättning, takat vid 600 000 kr/år.",
      savings: pctOfRev(0.006, 600_000),
      implCost: 200_000,
      isvCategories: ["WMS"],
      defaultOn: true,
    },
    {
      id: "edi",
      label: "EDI & e-faktura",
      hint: "Automatiska kundorder, leveransbesked, fakturor",
      detail:
        "EDI med kedjor och stora kunder innebär att order, ordererkännanden, ASN och fakturor utbyts utan handpåläggning. En distributör med 20+ EDI-partners sparar typiskt 1–2 FTE i ordermottagning samt undviker viten för missade SLA. Estimat: ~120 000 kr/år.",
      savings: flat(120_000),
      implCost: 90_000,
      isvCategories: ["EDI / e-faktura"],
      defaultOn: true,
    },
    {
      id: "tms",
      label: "Transport- & 3PL-integration",
      hint: "Fraktbokning och spårning direkt från BC",
      detail:
        "Fraktbokning, etikettutskrift och tracking sker från BC mot DHL/Schenker/Postnord eller 3PL. Resultatet är ~5–10 minuter sparat per försändelse, färre felfrakter och bättre fraktprisjämförelser. Estimat: ~90 000 kr/år för bolag med några hundra sändningar/månad.",
      savings: flat(90_000),
      implCost: 80_000,
      isvCategories: ["Frakt / TMS", "3PL"],
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning mot inköpsorder",
      detail:
        "OCR-tolkning + tre-vägsmatchning (faktura/order/ankomst) gör att de flesta fakturor bokförs utan manuella tag. Sparar tid på ekonomi och tidigarelägger period­avsluten. Estimat: ~80 000 kr/år.",
      savings: flat(80_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "order-entry",
      label: "Snabbare orderregistrering",
      hint: "Mindre manuell handpåläggning, färre felorder",
      detail:
        "Kundportal, e-postparsing och mallar kapar tiden per order. Räknat på 10–15 minuter sparat per manuell order × några tusen order/år blir det en betydande post. Estimat: ~57 000 kr/år i baseline.",
      savings: flat(57_000),
      implCost: 40_000,
      defaultOn: true,
    },
    {
      id: "forecast",
      label: "Bättre prognos & inköp",
      hint: "Lägre kapitalbindning, färre brister",
      detail:
        "Bättre statistisk prognos och inköpsplanering minskar både överlager (lägre kapitalbindning, mindre kuranskostnad) och bristsituationer (mindre missad försäljning). Typisk effekt: 5–10 % lägre lagervärde och 1–2 % högre fyllnadsgrad. Estimat: 0,2 % av omsättning, takat vid 200 000 kr/år.",
      savings: pctOfRev(0.002, 200_000),
      implCost: 60_000,
      defaultOn: false,
    },
  ],

  Tillverkning: [
    {
      id: "production",
      label: "Produktionsplanering",
      hint: "Bättre beläggning, kortare ledtid",
      detail:
        "Strukturerad körplanering och kapacitetsuppföljning ger högre beläggning, kortare ledtid och färre brådskande omställningar. Typisk effekt: 5–10 % högre OEE och 10–20 % kortare genomloppstid. Estimat: 0,4 % av omsättning, takat vid 500 000 kr/år.",
      savings: pctOfRev(0.004, 500_000),
      implCost: 200_000,
      isvCategories: ["Tillverkning (advanced MFG)", "MES"],
      defaultOn: true,
    },
    {
      id: "quality",
      label: "Kvalitet & spårbarhet",
      hint: "Lot/serie-spårning, färre kassationer",
      detail:
        "Lot-/serienummerspårning genom hela kedjan ger snabbare återkallelser, mindre kassationer och bättre underlag vid reklamationer/garantier. Krav i många regulatoriska branscher (livsmedel, medtech). Estimat: 0,25 % av omsättning, takat vid 250 000 kr/år.",
      savings: pctOfRev(0.0025, 250_000),
      implCost: 120_000,
      isvCategories: ["Kvalitet / QA", "Tillverkning (advanced MFG)"],
      defaultOn: true,
    },
    {
      id: "wms",
      label: "Lager (WMS)",
      hint: "Råvaror, mellanlager, färdigvaror",
      detail:
        "WMS för råvaror, PIA och färdigvaror minskar leta-tid på golvet, ger korrekta saldon mot MRP och kortar inventerings­arbetet rejält. Estimat: 0,3 % av omsättning, takat vid 300 000 kr/år.",
      savings: pctOfRev(0.003, 300_000),
      implCost: 150_000,
      isvCategories: ["WMS"],
      defaultOn: true,
    },
    {
      id: "mrp",
      label: "MRP & inköp",
      hint: "Bättre materialplanering, lägre brist & överlager",
      detail:
        "Korrekt MRP minskar både brist (stopp i produktion, expressfrakter) och överlager (kapitalbindning). En tillverkare kan typiskt frigöra 5–15 % av lagervärdet och samtidigt höja leveransprecisionen. Estimat: 0,3 % av omsättning, takat vid 300 000 kr/år.",
      savings: pctOfRev(0.003, 300_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning mot inköpsorder",
      detail:
        "Tre-vägsmatchning av råvaru­fakturor mot inköpsorder och ankomstrapport. Sparar tid på ekonomi och fångar prisavvikelser tidigt. Estimat: ~80 000 kr/år.",
      savings: flat(80_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "service-after",
      label: "Eftermarknad & service",
      hint: "Reservdelar, garantier, fältservice",
      detail:
        "Strukturerad reservdels-, garanti- och fältservice­hantering frigör ny återkommande intäkt och minskar 'läckande' garantijobb. Värdefullt för tillverkare med installerad bas. Estimat: ~120 000 kr/år.",
      savings: flat(120_000),
      implCost: 100_000,
      defaultOn: false,
    },
  ],

  Tjänster: [
    {
      id: "project-time",
      label: "Projekt & tidrapportering",
      hint: "Mindre svinn, bättre debiterbarhet",
      detail:
        "När konsulter rapporterar tid samma dag (mobil/Teams) försvinner 'tidsvinnet' – timmar som annars glöms eller skrivs ned. En typisk effekt är 2–5 % högre debiteringsgrad. Estimat: 0,8 % av omsättning, takat vid 600 000 kr/år.",
      savings: pctOfRev(0.008, 600_000),
      implCost: 120_000,
      isvCategories: ["Projekt / PSA", "Tidrapportering"],
      defaultOn: true,
    },
    {
      id: "tm-billing",
      label: "Tid- & materialfakturering",
      hint: "Snabbare fakturering, färre missade timmar",
      detail:
        "Automatiserad T&M-fakturering kortar tiden från rapporterad timme till faktura från veckor till dagar – bättre kassaflöde och färre tvister. Estimat: 0,4 % av omsättning, takat vid 300 000 kr/år.",
      savings: pctOfRev(0.004, 300_000),
      implCost: 60_000,
      isvCategories: ["Projekt / PSA"],
      defaultOn: true,
    },
    {
      id: "resource",
      label: "Resursplanering & beläggning",
      hint: "Högre nyttjandegrad konsulter/specialister",
      detail:
        "Visuell beläggning gör att fler konsulttimmar säljs istället för att hamna i 'bench'. Att lyfta nyttjandegraden med 2–4 procentenheter ger stora effekter i tjänstebolag. Estimat: 0,5 % av omsättning, takat vid 400 000 kr/år.",
      savings: pctOfRev(0.005, 400_000),
      implCost: 80_000,
      isvCategories: ["Projekt / PSA"],
      defaultOn: true,
    },
    {
      id: "subscription",
      label: "Avtal & abonnemang",
      hint: "Återkommande fakturering, MRR-koll",
      detail:
        "Återkommande fakturering på avtal/abonnemang med pris­justering, proration och uppsägning hanterat i BC ger korrekt MRR-redovisning och mindre intäktsläckage. Estimat: ~120 000 kr/år.",
      savings: flat(120_000),
      implCost: 80_000,
      isvCategories: ["Subscription / Recurring billing"],
      defaultOn: false,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + attestflöde",
      detail:
        "OCR + mobilt attestflöde gör att underkonsult- och kostnadsfakturor hanteras utan papperslöp. Estimat: ~60 000 kr/år.",
      savings: flat(60_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "expense",
      label: "Utlägg & reseräkningar",
      hint: "Mobil app, automatisk kontering",
      detail:
        "Utlägg fotograferas i mobil, kategoriseras automatiskt och bokförs mot rätt projekt/kund. Mindre admin för konsulter och färre missade vidarefaktureringar. Estimat: ~40 000 kr/år.",
      savings: flat(40_000),
      implCost: 30_000,
      isvCategories: ["Expense"],
      defaultOn: false,
    },
  ],

  Annan: [
    {
      id: "manual-process",
      label: "Automatisering av manuella processer",
      hint: "Order, fakturor, bokföring",
      detail:
        "Samlad effekt av att flytta order, fakturor, bokföring och rapportering från Excel/e-post in i BC. Räknat brett som en andel av omsättning eftersom bredden av processer varierar. Estimat: 0,6 % av omsättning, takat vid 400 000 kr/år.",
      savings: pctOfRev(0.006, 400_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning",
      detail:
        "OCR-tolkning och automatiserat attestflöde för leverantörsfakturor. Sparar tid och fångar dubbletter/felaktigheter. Estimat: ~70 000 kr/år.",
      savings: flat(70_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "reporting",
      label: "Rapportering & beslutsstöd",
      hint: "Snabbare bokslut, bättre prognoser",
      detail:
        "Power BI/Jet på BC ger ledningen färska siffror utan månatlig Excel-export. Effekt: snabbare bokslut (2–5 dagar kortare) och beslut grundade i samma data. Estimat: ~80 000 kr/år.",
      savings: flat(80_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "integration",
      label: "Systemintegration",
      hint: "Färre dubbelregistreringar mellan system",
      detail:
        "Integration mot kringsystem (CRM, lön, webshop, branschsystem) eliminerar dubbel­registrering och avstämningsarbete. Estimat: ~60 000 kr/år per integrerad domän.",
      savings: flat(60_000),
      implCost: 40_000,
      isvCategories: ["Integration / iPaaS"],
      defaultOn: false,
    },
  ],
};

export const defaultEnabledDrivers = (industry: Industry): string[] =>
  INDUSTRY_DRIVERS[industry].filter((d) => d.defaultOn).map((d) => d.id);
