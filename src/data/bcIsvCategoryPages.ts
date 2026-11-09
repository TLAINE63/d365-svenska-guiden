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
  /** Valfri rekommendationsruta till en fördjupande guide. */
  guideLink?: { text: string; to: string };
  /** Valfria redaktionella H2-avsnitt som visas före lösningslistan. */
  sections?: {
    id: string;
    h2: string;
    paragraphs: string[];
    links?: { text: string; to: string }[];
  }[];
  /** Valfri rådgivningsruta med Thomas (Bookings + mejl). */
  advisory?: { title: string; text: string };
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
    metaTitle: "Business Central och e-handel – kopplingar och tillägg",
    metaDescription:
      "Business Central och e-handel: Shopify-koppling, connectorer mot Norce, Litium och Centra eller integrerad B2B-shop. Och när Dynamics 365 Commerce passar.",
    intro:
      "Handelsflöden mot Business Central löses med allt från lätta connectorer till e-handelsplattformar som hämtar artiklar, priser och order i realtid. Produktinformation (PIM) och butiksförsäljning hanteras ofta av egna lösningar. För större handelsbolag finns också Microsofts egen handelslösning Dynamics 365 Commerce.",
    sections: [
      {
        id: "tre-vagar-ehandel-business-central",
        h2: "Business Central och e-handel: tre vanliga vägar",
        paragraphs: [
          "1. Inbyggd Shopify-koppling: Microsoft levererar en koppling mellan Business Central och Shopify som synkar artiklar, priser, lagersaldon, kunder och order. Det är ofta den snabbaste starten för bolag som redan säljer via Shopify.",
          "2. Connector mot annan plattform: Säljer ni via till exempel Norce, Litium, Centra eller WooCommerce kopplas e-handeln till Business Central med ett tillägg från Microsoft Marketplace eller en integration som partnern bygger. E-handeln äger kundupplevelsen, Business Central äger order, lager, priser och bokföring.",
          "3. Integrerad B2B-shop: För B2B med kundunika priser, avtal och sortiment väljer många en lösning som Sana Commerce eller Dynamicweb, där affärslogiken hämtas direkt från Business Central i stället för att kopieras.",
          "Oavsett väg: fråga partnern om dokumenterad erfarenhet av just er plattform och hur fel i orderflödet övervakas och rättas.",
        ],
        links: [
          { text: "Läs om Business Central", to: "/businesscentral/" },
          { text: "Jämför Sana, Dynamicweb och Shopify-koppling", to: "/compare/sana-vs-dynamicweb-vs-shopify/" },
        ],
      },
      {
        id: "extern-ehandel-eller-commerce",
        h2: "Extern e-handelsplattform eller Dynamics 365 Commerce?",
        paragraphs: [
          "Det finns två huvudvägar. Den vanligaste för bolag med Business Central är att välja en extern e-handelslösning (e-commerce-plattform), till exempel Norce, Storm eller Litium, och integrera den mot Business Central. Affärssystemet äger då artiklar, lager, priser, kunder och order, medan e-handelsplattformen äger webbupplevelse, kampanjer och kassa. Kopplingen görs med en connector eller via en integrationsplattform.",
          "Den andra vägen är Dynamics 365 Commerce, Microsofts enterprise-lösning för handel i flera kanaler. Commerce bygger på samma plattform som Finance & Supply Chain Management och samlar e-handel, butikskassa (POS), kundtjänst samt centrala sortiments- och prisregler i en lösning. Det är alltså inget tillägg till Business Central, utan ett eget val av plattform.",
          "PIM (Product Information Management) är ofta en tredje pusselbit oavsett väg. När produktinformationen är rik, flerspråkig eller ska publiceras i flera kanaler hanteras texter, bilder och attribut i ett PIM, medan artikelnummer, priser och lagersaldon stannar i affärssystemet.",
          "Tumregel: Business Central med en extern e-handelsplattform passar de flesta små och medelstora handelsbolag. Dynamics 365 Commerce blir aktuellt när butiker, e-handel och centrala handelsregler behöver styras i en gemensam lösning, oftast tillsammans med Finance & Supply Chain Management.",
        ],
        links: [
          { text: "Läs om Dynamics 365 Commerce", to: "/d365commerce/" },
          { text: "Läs om Dynamics 365 Finance & Supply Chain Management", to: "/finance-supply-chain/" },
          { text: "Hitta partner med erfarenhet av handel och e-handel", to: "/valjdynamics365partner/" },
        ],
      },
    ],
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
    guideLink: {
      text: "Läs vår kompletta guide om budget, rullande prognoser och säljplanering i Dynamics 365",
      to: "/guider/budget-prognos-planering-dynamics-365/",
    },
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
    h1: "Frakthantering, transportbokning och TA-system för Business Central",
    metaTitle: "Frakthantering & TA-system i Business Central | d365.se",
    metaDescription:
      "Guide till frakthantering, transportbokning och TA-system (nShift/Consignor, Logtrade m.fl.) integrerat med Microsoft Dynamics 365 Business Central.",
    intro:
      "Ett TA-system (transportadministration) kopplar Business Central till fraktbolagen. Bokning, fraktetiketter, spårningslänkar och tulldokument skapas från order- och lagerflödet, utan att någon behöver skriva in sändningen igen i en separat webbportal. Sidan visar också hur dokumentflöden och EDI hänger ihop med utleveransen.",
    sections: [
      {
        id: "ta-integrationer",
        h2: "TA-integrationer i praktiken: nShift, Logtrade och Unifaun",
        paragraphs: [
          "Ett TA-system samlar transportörerna i ett gemensamt flöde. I Sverige kopplas Business Central ofta till nShift (tidigare Consignor, i Sverige också känt via Unifaun) och Logtrade. Sökningar på \"Dynamics 365 Consignor\" eller \"Consigner\" handlar därför i praktiken oftast om en nShift-koppling.",
          "När ordern plockats och packats skickas sändningsdata (mottagare, kolli, vikt, tjänst och eventuella farligt gods- eller tulluppgifter) från Business Central till TA-tjänsten. Tillbaka kommer fraktetikett, fraktsedel, sändningsnummer och spårningslänk, som sparas på utleveransen och kan skickas till kunden.",
          "För leveranser utanför EU kan TA-tjänsten också skapa tulldokument som proformafaktura och exportdeklarationsunderlag, förutsatt att artiklarna har korrekta varukoder, ursprungsland och vikter i Business Central. Vilka dokument som stöds varierar mellan TA-leverantörer och transportörer, så kontrollera det för era destinationer.",
        ],
      },
      {
        id: "transportbokning",
        h2: "Transportadministration och bokning hos fraktbolagen",
        paragraphs: [
          "Med en TA-integration bokas transporten automatiskt hos fraktbolag som PostNord, DHL, DB Schenker och DSV när utleveransen bokförs eller packas. Ni slipper dubbelarbete i varje transportörs egen webbportal, och samma regler kan välja transportör och tjänst utifrån till exempel land, vikt eller leveranssätt på ordern.",
          "Transportörer som PostNord har även egna integrationer, men med ett TA-system kan ni lägga till eller byta transportör utan att bygga nya kopplingar mot Business Central. Det förenklar också hämtningsbokning, fraktkostnadsuppföljning och avvikelsehantering.",
          "Det som brukar avgöra valet: vilka transportörer och tjänster ni använder, antal sändningar per dag, om ni behöver tulldokument, hur spårningslänkar ska nå kunden och om kopplingen är ett tillägg inuti Business Central eller en separat tjänst som synkar data.",
        ],
      },
      {
        id: "lagerflode",
        h2: "Lagerflöde: pack, plock och TA-systemet",
        paragraphs: [
          "Frakthanteringen fungerar bäst när den sitter ihop med lagret. Med handdatorer eller scanners plockas ordern mot lagerplatser i Business Central, varorna kontrolleras vid packbordet och fraktsedeln skrivs ut direkt när kollit registreras.",
          "Returhantering kan ingå i samma flöde: returetikett skickas med paketet eller skapas på begäran, och returen tas emot mot ursprungsordern. Då hänger lagersaldo, kreditering och kundtjänst ihop.",
          "Vid höga volymer, många lagerställen eller avancerade plockregler räcker inte alltid standardlagret. Då utvärderas ett WMS-tillägg till Business Central, eller Supply Chain Management för större verksamheter med centrallager.",
        ],
        links: [
          { text: "Avancerat WMS och centrallager i Finance & Supply Chain Management", to: "/finance-supply-chain/#lagerstyrning-wms" },
          { text: "WMS och lagerlösningar för Business Central", to: "/business-central/tillagg/wms/" },
          { text: "Hitta partner för implementering och systemintegration", to: "/valjdynamics365partner/" },
        ],
      },
      {
        id: "edi-orderflode",
        h2: "EDI-integrationer och elektroniskt orderflöde",
        paragraphs: [
          "EDI (Electronic Data Interchange) används när order, orderbekräftelser, leveransaviseringar och fakturor ska skickas maskinellt mellan företag. Det är vanligt mot dagligvaruhandel, bygghandel, fordonsindustri och större kedjor, som ofta kräver EDI av sina leverantörer.",
          "Business Central har grundstöd för elektroniska dokument, men ett fullständigt EDI-orderflöde mot handelsaktörer görs normalt via en EDI-leverantör eller ett tillägg. Det översätter mellan handelsformaten, till exempel EDIFACT eller Peppol, och affärssystemets order och fakturor. EDI-leverantörer som SPS Commerce erbjuder kopplingar mot Business Central, och i Norden finns flera EDI- och e-fakturaoperatörer med motsvarande lösningar.",
          "Kravställ per handelspartner: vilka meddelanden som krävs, i vilket format, via vilken kanal (operatör, AS2 eller Peppol) och hur fel och avvikelser ska hanteras i Business Central. Det gör det lättare att jämföra leverantörer och uppskatta införandet.",
        ],
        links: [
          { text: "EDI, e-faktura och integration för Business Central", to: "/business-central/tillagg/edi-e-faktura/" },
          { text: "Hitta partner med erfarenhet av frakt- och EDI-integrationer", to: "/valjdynamics365partner/" },
        ],
      },
    ],
    advisory: {
      title: "Rådgivning kring systemval och arkitektur för lager och logistik",
      text: "Boka 20 minuters kostnadsfri rådgivning med Thomas Laine om TA-system, WMS, EDI och hur lager och frakt ska hänga ihop med Business Central. Ingen partner deltar i samtalet.",
    },
    faq: [
      {
        q: "Fungerar nShift (Consignor) med Business Central?",
        a: "Ja. nShift, tidigare Consignor, kopplas till Business Central via tillägg eller integration så att bokning, etiketter och spårning skapas från utleveransen.",
      },
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
