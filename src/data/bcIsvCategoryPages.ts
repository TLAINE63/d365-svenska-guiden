// Indexerbara landningssidor för utvalda tilläggskategorier inom Business Central.
// Vi listar bara kategorier med tillräckligt innehåll och tydligt köpintresse –
// inga tunna filterkombinationer.

export interface BcCategoryPage {
  /** URL-segment under /business-central/tillagg/ */
  slug: string;
  /** Kategorier i katalogen som sidan samlar. */
  categories: string[];
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faq: { q: string; a: string }[];
}

export const BC_CATEGORY_PAGES: BcCategoryPage[] = [
  {
    slug: "ap-automation",
    categories: ["AP automation", "Expense management", "Banking & payments"],
    h1: "Fakturahantering och betalflöden för Business Central",
    metaTitle: "AP automation för Business Central – tillägg och urval",
    metaDescription:
      "Vilka tillägg finns för leverantörsfakturor, utlägg och betalningar i Business Central? Se lösningarna, när de passar och vad du bör tänka på.",
    intro:
      "AP automation täcker inläsning och attest av leverantörsfakturor, hantering av utlägg samt bank- och betalfiler. Här samlar vi de tillägg som används i Business Central på den svenska marknaden.",
    faq: [
      {
        q: "Vilka tillägg finns för fakturahantering i Business Central?",
        a: "Det finns både svit-lösningar som täcker faktura, utlägg och betalning och mer specialiserade produkter för enskilda delflöden. Valet styrs oftast av volym, attestregler och hur mycket som ska ske inuti Business Central.",
      },
      {
        q: "Behöver jag ett tillägg eller räcker standard?",
        a: "Standard räcker ofta vid låga fakturavolymer och enkla attestflöden. Vid många fakturor, flera bolag eller krav på tolkning och matchning mot inköpsorder blir ett tillägg snabbt motiverat.",
      },
    ],
  },
  {
    slug: "wms",
    categories: ["WMS"],
    h1: "WMS och lagerlösningar för Business Central",
    metaTitle: "WMS för Business Central – lagerlösningar och alternativ",
    metaDescription:
      "Jämför WMS-lösningar för Business Central: inbyggda tillägg med handdator och fristående lagersystem. Se när respektive alternativ passar.",
    intro:
      "Lagerstöd i Business Central kan lösas antingen med ett tillägg som körs direkt i systemet eller med ett fristående WMS som integreras. Skillnaden märks framför allt i hur avancerad lagerlogiken behöver vara.",
    faq: [
      {
        q: "När räcker Business Centrals egna lagerfunktioner?",
        a: "Vid enklare plock, få lagerplatser och begränsade volymer räcker standardfunktionerna ofta. Vid streckkodsplock, zonstyrning eller höga volymer används ett WMS-tillägg eller ett fristående lagersystem.",
      },
      {
        q: "Inbyggt tillägg eller fristående WMS?",
        a: "Ett tillägg håller all data i Business Central och blir enklare att förvalta. Ett fristående WMS ger mer avancerad lagerlogik men kräver integration och tydlig ansvarsfördelning.",
      },
    ],
  },
  {
    slug: "edi-e-faktura",
    categories: ["EDI / e-faktura", "Integration / iPaaS"],
    h1: "EDI, e-faktura och integration för Business Central",
    metaTitle: "EDI och e-faktura för Business Central – lösningar",
    metaDescription:
      "Vilka lösningar finns för EDI, Peppol och integrationer mot Business Central? Se skillnaden mellan EDI-tjänster och generella integrationsplattformar.",
    intro:
      "EDI, e-faktura och integrationsplattformar hanterar utbytet av order, fakturor och andra dokument mellan Business Central och omvärlden. Här skiljer vi på renodlade EDI-tjänster och bredare integrationslager.",
    faq: [
      {
        q: "Vad skiljer EDI från en integrationsplattform?",
        a: "EDI-tjänster är specialiserade på handelsdokument och etablerade meddelandeformat. En integrationsplattform är bredare och används när flera olika system ska kopplas ihop.",
      },
      {
        q: "Behöver jag ett tillägg för Peppol?",
        a: "Business Central har grundstöd för e-dokument, men många väljer ett tillägg när flödet omfattar fler dokumenttyper, fler mottagare eller krav på övervakning och felhantering.",
      },
    ],
  },
  {
    slug: "ehandel",
    categories: ["E-handel", "PIM", "Retail / POS"],
    h1: "E-handel, PIM och POS för Business Central",
    metaTitle: "E-handel och PIM för Business Central – tillägg",
    metaDescription:
      "Se lösningar som kopplar Business Central till e-handel, produktinformation och butik. Jämför integrerade plattformar och connectorer.",
    intro:
      "Handelsflöden mot Business Central löses med allt från lätta connectorer till plattformar som hämtar artiklar, priser och order i realtid. Produktinformation och butiksförsäljning hanteras ofta av egna lösningar.",
    faq: [
      {
        q: "Connector eller integrerad e-handelsplattform?",
        a: "En connector synkar utvalda data mellan e-handeln och Business Central. En integrerad plattform hämtar i stället data direkt och minskar dubbellagring, men binder samman lösningarna hårdare.",
      },
      {
        q: "När behövs ett PIM?",
        a: "När produktinformationen är rik, flerspråkig eller ska publiceras i flera kanaler räcker sällan artikelregistret i affärssystemet.",
      },
    ],
  },
  {
    slug: "rapportering-fpa",
    categories: ["Rapportering / FP&A", "Finance extensions", "Multi-company", "Subscription billing"],
    h1: "Rapportering, budget och finansiella tillägg för Business Central",
    metaTitle: "Rapportering och FP&A för Business Central – lösningar",
    metaDescription:
      "Vilka lösningar finns för rapportering, budget, prognos, koncern och abonnemangsfakturering i Business Central? Se urvalet och när de passar.",
    intro:
      "Finansiella tillägg spänner från rapport- och budgetverktyg till koncernkonsolidering och abonnemangsfakturering. Behovet styrs ofta av antal bolag, rapportkrav och affärsmodell.",
    faq: [
      {
        q: "Räcker Power BI för finansiell rapportering?",
        a: "Power BI är starkt på visualisering, men budget, prognos och strukturerad ekonomisk rapportering hanteras oftast bättre i ett dedikerat FP&A-verktyg.",
      },
      {
        q: "När behövs stöd för flera bolag?",
        a: "Vid koncernstruktur med interna transaktioner, gemensamma register eller konsolidering blir ett tillägg för multi-company snabbt aktuellt.",
      },
    ],
  },
  {
    slug: "planering-produktion",
    categories: [
      "Planering & produktion",
      "Inventory planning",
      "MES / Shop floor",
      "Quality management",
      "CPQ",
    ],
    h1: "Planering, produktion och kvalitet för Business Central",
    metaTitle: "Produktionsplanering för Business Central – tillägg",
    metaDescription:
      "Se tillägg för produktionsplanering, lagerstyrning, verkstadsgolv, kvalitet och offertkonfiguration i Business Central – och när de behövs.",
    intro:
      "Tillverkande bolag kompletterar ofta Business Central med grafisk planering, behovsstyrd lagerpåfyllnad, rapportering från verkstadsgolvet, kvalitetskontroll och konfiguration av komplexa offerter.",
    faq: [
      {
        q: "När räcker inte standardplaneringen i Business Central?",
        a: "När planeringen behöver visualiseras, omplaneras ofta eller ta hänsyn till kapacitet och beroenden i flera steg används normalt ett planeringstillägg.",
      },
      {
        q: "Vad gör ett CPQ-tillägg i ett ERP-sammanhang?",
        a: "CPQ hanterar regelstyrd konfiguration och prissättning så att offerten kan bli en korrekt order och produktionsstruktur.",
      },
    ],
  },
  {
    slug: "dokument-frakt",
    categories: ["Dokument & output", "Frakt & TA"],
    h1: "Dokumenthantering och frakt för Business Central",
    metaTitle: "Dokument och frakt för Business Central – tillägg",
    metaDescription:
      "Lösningar för dokumentdesign, utskick och distribution samt fraktbokning och transportadministration kopplat till Business Central.",
    intro:
      "Dokument- och outputlösningar styr hur fakturor, följesedlar och etiketter utformas och distribueras. Frakt- och TA-system hanterar bokning, etiketter och spårning mot transportörerna.",
    faq: [
      {
        q: "Behöver jag ett dokumentverktyg?",
        a: "Vid många dokumentmallar, flera språk, olika distributionssätt eller etiketthantering blir standardrapporterna snabbt begränsande.",
      },
      {
        q: "Vad gör ett TA-system?",
        a: "Det samlar transportörer i ett flöde för bokning, fraktetiketter och spårning, i stället för att varje transportör hanteras separat.",
      },
    ],
  },
  {
    slug: "branschlosningar",
    categories: ["Branschpaket", "Projekt", "Field service"],
    h1: "Branschlösningar för Business Central",
    metaTitle: "Branschlösningar för Business Central – paket och urval",
    metaDescription:
      "Se branschpaket byggda på Business Central för livsmedel, mode, tillverkning, bygg, projekt och service – och när ett branschpaket är rätt väg.",
    intro:
      "Ett branschpaket är en färdig påbyggnad på Business Central för en specifik verksamhetstyp. Det kortar ofta införandet, men styr samtidigt en del av lösningens riktning.",
    faq: [
      {
        q: "När är ett branschpaket rätt val?",
        a: "När branschens processer är starkt återkommande och paketet täcker dem, blir det oftast både snabbare och billigare än att bygga motsvarande själv.",
      },
      {
        q: "Vad bör jag tänka på med branschpaket?",
        a: "Kontrollera hur uppgraderingar hanteras, vilka partners som kan leverera lösningen och hur mycket egen anpassning som fortfarande behövs.",
      },
    ],
  },
];

export const findBcCategoryPage = (slug?: string) =>
  BC_CATEGORY_PAGES.find((p) => p.slug === slug);
