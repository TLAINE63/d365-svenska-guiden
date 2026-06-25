// Registry över ISV-jämförelser. Slug → vilka lösningar som jämförs sida vid sida.
// Lösnings-ID:n refererar till BC_ISV_SOLUTIONS i src/data/bcIsvSolutions.ts.

export interface IsvComparison {
  slug: string;
  title: string;
  intro: string;
  solutionIds: string[];
  category: string;        // matchar SolutionCategory – styr "tillbaka till artikel"-länken
  parentArticleSlug: string; // bcTillaggArticles slug
}

export const ISV_COMPARISONS: IsvComparison[] = [
  {
    slug: "continia-vs-exflow",
    title: "Continia vs ExFlow (Truvio)",
    intro:
      "De två ledande AP automation-sviterna för Business Central i Sverige. Skillnaden ligger i bredd, attestmodell och hur djupt processen styrs i BC.",
    solutionIds: ["continia", "exflow"],
    category: "AP automation",
    parentArticleSlug: "tillagg-fakturahantering",
  },
  {
    slug: "swebase-vs-smart-swedish-vat",
    title: "Swebase vs Smart Swedish VAT",
    intro:
      "Båda kompletterar BC:s svenska lokalisering. Swebase är bredare praktiskt ekonomistöd; Smart Swedish VAT är dedikerat för svensk momsrapportering.",
    solutionIds: ["swebase", "smart-swedish-vat"],
    category: "Lokalisering",
    parentArticleSlug: "tillagg-svensk-lokalisering",
  },
  {
    slug: "tasklet-vs-ongoing",
    title: "Tasklet Mobile WMS vs Ongoing WMS",
    intro:
      "Tasklet körs inuti BC och passar interna lager. Ongoing är ett separat system som ofta används vid 3PL eller när lagret ska leva utanför BC.",
    solutionIds: ["tasklet-wms", "ongoing-wms"],
    category: "WMS",
    parentArticleSlug: "tillagg-wms-lager",
  },
  {
    slug: "golden-edi-vs-truecommerce",
    title: "Golden EDI vs TrueCommerce EDI",
    intro:
      "Golden EDI är förstahandsvalet i svenska BC-affärer. TrueCommerce är vanligare för bolag med större internationella handelsflöden och många trading partners.",
    solutionIds: ["golden-edi", "truecommerce-edi"],
    category: "EDI / e-faktura",
    parentArticleSlug: "tillagg-edi-efaktura",
  },
  {
    slug: "peppol720-vs-continia-edocs",
    title: "Peppol720 vs Continia e-dokument",
    intro:
      "Båda hanterar Peppol och e-faktura. Peppol720 är fokuserat på själva Peppol-flödet. Continia e-dokument är naturligt om ni redan kör Continias svit.",
    solutionIds: ["peppol720", "continia-edocs"],
    category: "EDI / e-faktura",
    parentArticleSlug: "tillagg-edi-efaktura",
  },
  {
    slug: "nshift-vs-shipmondo-vs-sendcloud-vs-cargoson",
    title: "nShift vs Shipmondo vs Sendcloud vs Cargoson",
    intro:
      "Valet av TA-system styrs av transportörsmix, volym, etiketter, returer och hur djup integration mot BC ni behöver.",
    solutionIds: ["nshift", "shipmondo", "sendcloud", "cargoson"],
    category: "Frakt & TA",
    parentArticleSlug: "tillagg-frakt-ta",
  },
  {
    slug: "sana-vs-dynamicweb-vs-shopify",
    title: "Sana Commerce vs Dynamicweb vs Shopify-connector",
    intro:
      "Sana och Dynamicweb integrerar djupt mot BC. Shopify används som extern frontend när ni vill ha en lättare e-handelsplattform och låta BC vara backend.",
    solutionIds: ["sana-commerce", "dynamicweb", "shopify-connector"],
    category: "E-handel",
    parentArticleSlug: "tillagg-ehandel",
  },
  {
    slug: "ls-central-vs-shopify-pos",
    title: "LS Central vs Shopify POS + BC",
    intro:
      "LS Central är en samlad retailplattform på BC. Shopify POS med BC som backend är en modulär lösning där butik och ekonomi körs separat men integrerat.",
    solutionIds: ["ls-central", "shopify-connector"],
    category: "Retail / POS",
    parentArticleSlug: "tillagg-retail-pos",
  },
  {
    slug: "aptean-vs-trimit-vs-pebblestone-vs-cosmo",
    title: "Aptean vs TRIMIT vs Pebblestone vs COSMO",
    intro:
      "Branschpaket ovanpå BC. Aptean för food, TRIMIT och Pebblestone för mode, COSMO för tillverkning. Valet styrs av bransch och hur djupt paketet täcker era processer.",
    solutionIds: ["aptean-food", "trimit-fashion", "pebblestone", "cosmo-manufacturing"],
    category: "Branschpaket",
    parentArticleSlug: "tillagg-branschpaket",
  },
  {
    slug: "4ps-vs-cosmo-projektproduktion",
    title: "4PS Construct vs COSMO (bygg & projektproduktion)",
    intro:
      "4PS är specialiserat på bygg, installation och service. COSMO Project är bredare projektproduktion. Båda lever ovanpå BC.",
    solutionIds: ["4ps-construct", "cosmo-manufacturing"],
    category: "Branschpaket",
    parentArticleSlug: "tillagg-branschpaket",
  },
  {
    slug: "lasernet-vs-continia-output",
    title: "Lasernet vs Continia Document Output",
    intro:
      "Lasernet är en bred dokumentplattform för design, transformation och distribution. Continia Document Output är naturligt om ni redan kör Continias svit.",
    solutionIds: ["lasernet", "continia-output"],
    category: "Dokument & output",
    parentArticleSlug: "tillagg-dokument-output",
  },
  {
    slug: "jet-vs-bizview-vs-solver",
    title: "Jet Reports vs Bizview vs Solver",
    intro:
      "Jet är klassisk Excel-rapportering nära BC. Bizview täcker finansiell rapportering, budget och prognos. Solver är dedikerat FP&A.",
    solutionIds: ["jet-reports", "bizview", "solver"],
    category: "Rapportering / FP&A",
    parentArticleSlug: "tillagg-rapportering-budget",
  },
];

export const getComparisonBySlug = (slug: string) =>
  ISV_COMPARISONS.find((c) => c.slug === slug);

export const getComparisonsForArticle = (articleSlug: string) =>
  ISV_COMPARISONS.filter((c) => c.parentArticleSlug === articleSlug);
