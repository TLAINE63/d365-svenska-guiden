/**
 * Configuration for /kunskapscenter/<slug>/ hub pages.
 *
 * Each hub is a fully SSR-prerendered topical landing page that lists
 * all relevant resources (deep-dive articles, blog articles, tools,
 * videos) in plain HTML for crawlers and AI search engines.
 *
 * Filters are pure functions evaluated at render time – no async data.
 */

import { ALL_DEEP_DIVE_ARTICLES } from "./bcArticles";
import { BLOG_ARTICLES } from "./blogArticles";
import { KNOWLEDGE_VIDEOS } from "./knowledgeVideos";
import {
  ERP_COMPARISONS,
  getComparisonsByProduct,
  type ProductKey,
} from "./erpComparisons";

export interface HubResourceCard {
  id: string;
  type: "fordjupning" | "artikel" | "verktyg" | "video" | "guide" | "tillagg";
  title: string;
  description: string;
  url: string;
  isExternal?: boolean;
  date?: string | null;
  category?: string;
}

export interface KnowledgeHubConfig {
  slug: string;
  /** Page <title> */
  metaTitle: string;
  /** Page meta description */
  metaDescription: string;
  /** Visible H1 */
  h1: string;
  /** Intro paragraph (rendered above grid) */
  intro: string;
  /** Crumb label */
  breadcrumbLabel: string;
  /** Curated resource cards in plain JSON (no React) */
  resources: HubResourceCard[];
}

// ── Helpers ──────────────────────────────────────────────────────────

const deepDiveBySlug = (productSlugs: string[]): HubResourceCard[] =>
  ALL_DEEP_DIVE_ARTICLES
    .filter((a) => productSlugs.includes(a.productSlug))
    .map((a) => ({
      id: `dd-${a.productSlug}-${a.slug}`,
      type: (a.slug.startsWith("tillagg-") || a.slug === "isv-tillaggsapplikationer"
        ? "tillagg"
        : "fordjupning") as HubResourceCard["type"],
      title: a.title,
      description: a.description,
      url: `/kunskapscenter/${a.productSlug}/${a.slug}/`,
      category: a.product,
    }));

const blogByProduct = (productNames: string[]): HubResourceCard[] =>
  BLOG_ARTICLES
    .filter((b) => b.products.some((p) => productNames.includes(p)))
    .map((b) => ({
      id: `blog-${b.slug}`,
      type: "artikel" as const,
      title: b.title,
      description: b.summary,
      url: `/artiklar/${b.slug}/`,
      date: b.publishedAt,
      category: b.category,
    }));

const blogByCategory = (categories: string[]): HubResourceCard[] =>
  BLOG_ARTICLES
    .filter((b) => categories.includes(b.category))
    .map((b) => ({
      id: `blog-${b.slug}`,
      type: "artikel" as const,
      title: b.title,
      description: b.summary,
      url: `/artiklar/${b.slug}/`,
      date: b.publishedAt,
      category: b.category,
    }));

const videosByProductTag = (tags: string[]): HubResourceCard[] =>
  KNOWLEDGE_VIDEOS
    .filter((v: any) =>
      Array.isArray(v.products)
        ? v.products.some((p: string) => tags.includes(p))
        : true
    )
    .map((v: any) => ({
      id: `video-${v.slug}`,
      type: "video" as const,
      title: v.title,
      description: v.description || "",
      url: `/kunskapscenter/video/${v.slug}/`,
      category: "Video",
    }));

const erpComparisonsAsResources = (): HubResourceCard[] =>
  ERP_COMPARISONS.map((c) => ({
    id: `jamfor-${c.slug}`,
    type: "guide" as const,
    title: `${c.productShort} vs ${c.competitor}`,
    description: c.intro,
    url: `/jamfor/${c.slug}/`,
    category: "Konkurrentjämförelse",
  }));

const comparisonsAsResources = (productKey: ProductKey): HubResourceCard[] =>
  getComparisonsByProduct(productKey).map((c) => ({
    id: `jamfor-${c.slug}`,
    type: "guide" as const,
    title: `${c.productShort} vs ${c.competitor}`,
    description: c.intro,
    url: `/jamfor/${c.slug}/`,
    category: "Konkurrentjämförelse",
  }));

// Tool entries are hand-curated (small set, easier to keep on-brand than auto-filter)
const tools = {
  behovsanalysErp: {
    id: "tool-behovsanalys-erp",
    type: "verktyg" as const,
    title: "Behovsanalys ERP (Affärssystem)",
    description: "Kartlägg dina behov för ett nytt affärssystem och få en AI-driven analys med rekommendationer.",
    url: "/ERPbehovsanalys/",
    category: "Behovsanalys",
  },
  bcMatchningstest: {
    id: "tool-bc-matchningstest",
    type: "verktyg" as const,
    title: "Business Central matchningstest",
    description: "Sex frågor med branschspecifik fördjupning. Få en bedömning om Business Central matchar dina behov – och var du eventuellt behöver ISV-tillägg eller annan plattform.",
    url: "/businesscentral/matchningstest/",
    category: "Behovsanalys",
  },
  bcRoiKalkylator: {
    id: "tool-bc-roi-kalkylator",
    type: "verktyg" as const,
    title: "ROI- & TCO-kalkylator för Business Central",
    description: "Räkna ut licens, implementation, 5-årig TCO och payback. Branschspecifika effektiviseringsdrivare för Handel, Distribution, Tillverkning och Tjänster.",
    url: "/businesscentral/roi-kalkylator/",
    category: "Kalkylator",
  },
  behovsanalysCrm: {
    id: "tool-behovsanalys-crm",
    type: "verktyg" as const,
    title: "Behovsanalys Sälj & Marknad (CRM)",
    description: "Analysera dina behov inom sälj och marknad för att hitta rätt CRM-lösning.",
    url: "/CRMbehovsanalys/",
    category: "Behovsanalys",
  },
  behovsanalysService: {
    id: "tool-behovsanalys-service",
    type: "verktyg" as const,
    title: "Behovsanalys Kundservice & Field Service",
    description: "Utvärdera dina servicebehov och få matchning mot rätt Dynamics 365-lösning.",
    url: "/kundservice-behovsanalys/",
    category: "Behovsanalys",
  },
  aiReadiness: {
    id: "tool-ai-readiness",
    type: "verktyg" as const,
    title: "AI Readiness Assessment",
    description: "Testa din organisations mognad för AI och Copilot – få konkreta rekommendationer.",
    url: "/ai-readiness/",
    category: "AI",
  },
  branschjamforelse: {
    id: "tool-branschjamforelse",
    type: "guide" as const,
    title: "Branschjämförelse: Business Central vs Finance & SCM",
    description: "Jämför BC och F&SCM utifrån bransch, storlek och geografi.",
    url: "/erp/#branschjamforelse",
    category: "Guide",
  },
  kravspecErp: {
    id: "tool-kravspec-erp",
    type: "verktyg" as const,
    title: "Kravspecifikation ERP",
    description: "Skapa en skräddarsydd kravspecifikation för ditt ERP-projekt.",
    url: "/kravspecifikation/",
    category: "Kravspec",
  },
  kravspecSales: {
    id: "tool-kravspec-sales",
    type: "verktyg" as const,
    title: "Kravspecifikation Sälj",
    description: "Generera en kravspecifikation anpassad för din säljavdelning.",
    url: "/kravspecifikation-sales/",
    category: "Kravspec",
  },
  kravspecMarketing: {
    id: "tool-kravspec-marketing",
    type: "verktyg" as const,
    title: "Kravspecifikation Marknad",
    description: "Skapa en kravspecifikation för din marknadsavdelning.",
    url: "/kravspecifikation-marketing/",
    category: "Kravspec",
  },
  kravspecKundservice: {
    id: "tool-kravspec-kundservice",
    type: "verktyg" as const,
    title: "Kravspecifikation Kundservice",
    description: "Generera en detaljerad kravspecifikation för kundserviceavdelningen.",
    url: "/kravspecifikation-kundservice/",
    category: "Kravspec",
  },
  upphandlingsguiden: {
    id: "tool-upphandlingsguiden",
    type: "guide" as const,
    title: "Upphandlingsguiden",
    description: "Steg-för-steg-guide för en lyckad ERP- eller CRM-upphandling.",
    url: "/upphandlingsguiden/",
    category: "Upphandling",
  },
  upphandlingsresan: {
    id: "tool-upphandlingsresan",
    type: "guide" as const,
    title: "Den typiska upphandlingsresan – 7 stadier",
    description: "Var i systemlivscykeln står du? Upptäck de sju stadierna i en typisk upphandlingsresa.",
    url: "/kunskapscenter/upphandlingsresan/",
    category: "Upphandling",
  },
  ebookPartnerval: {
    id: "tool-ebook-partnerval",
    type: "guide" as const,
    title: "E-bok: Det viktiga partnervalet",
    description: "20 sidor med statistik, insikter och en praktisk modell för att välja rätt Microsoftpartner.",
    url: "/ebooks/det-viktiga-partnervalet.pdf",
    isExternal: true,
    category: "E-bok",
  },
  guideValjPartner: {
    id: "tool-guide-valj-partner",
    type: "guide" as const,
    title: "Så väljer du rätt Dynamics 365-partner",
    description: "En komplett guide med checklistor och tips för att utvärdera och välja rätt implementeringspartner.",
    url: "/valjdynamics365partner/#guide",
    category: "Partnerval",
  },
  valjPartner: {
    id: "tool-valj-partner",
    type: "guide" as const,
    title: "Hitta rätt Dynamics 365-partner",
    description: "Sök, filtrera och jämför Dynamics 365-partners i Sverige utifrån produkt, bransch och storlek.",
    url: "/valjdynamics365partner/",
    category: "Partnerval",
  },
  branscher: {
    id: "tool-branscher",
    type: "guide" as const,
    title: "Branschlösningar – Dynamics 365 per bransch",
    description: "Översikt över hur Dynamics 365 används i 20 svenska branscher.",
    url: "/branscher/",
    category: "Bransch",
  },
  partnersPerBransch: {
    id: "tool-partners-per-bransch",
    type: "guide" as const,
    title: "Partners per bransch",
    description: "Se vilka partners som specialiserar sig på din bransch.",
    url: "/partners-per-bransch/",
    category: "Partnerval",
  },
  allaPartners: {
    id: "tool-alla-partners",
    type: "guide" as const,
    title: "Alla D365-partners i Sverige",
    description: "Komplett lista över Microsoft Dynamics 365-partners i Sverige.",
    url: "/alla-d365-partners/",
    category: "Partnerval",
  },
};

// ── Hub configs ──────────────────────────────────────────────────────

export const KNOWLEDGE_HUBS: KnowledgeHubConfig[] = [
  {
    slug: "business-central",
    metaTitle: "Business Central – kunskap, guider och fördjupningar | d365.se",
    metaDescription:
      "Allt om Microsoft Dynamics 365 Business Central: produktfördjupningar, artiklar, behovsanalys och kravspecifikation. Köparsidig vägledning.",
    h1: "Business Central – kunskap, guider och fördjupningar",
    intro:
      "Här hittar du alla våra resurser om Microsoft Dynamics 365 Business Central – från korta produktfördjupningar till djuplodande artiklar, behovsanalyser och kravspecifikationer. Allt är skrivet ur köparens perspektiv och uppdateras löpande.",
    breadcrumbLabel: "Business Central",
    resources: [
      tools.behovsanalysErp,
      tools.bcMatchningstest,
      tools.bcRoiKalkylator,
      tools.kravspecErp,
      tools.branschjamforelse,
      ...comparisonsAsResources("bc"),
      ...deepDiveBySlug(["businesscentral"]),
      ...blogByProduct(["Business Central"]),
    ],
  },
  {
    slug: "business-central-tillagg",
    metaTitle: "Tillägg till Business Central – komplett guide till ISV i Sverige",
    metaDescription:
      "Se alla viktiga tillägg till Microsoft Dynamics Business Central i Sverige – från AP automation och WMS till retail, EDI och branschlösningar.",
    h1: "Tillägg och ISV-ekosystem för Business Central",
    intro:
      "Business Central räcker långt – men i nästan alla affärer kompletteras BC med ett antal ISV-tillägg. Här är de tio vanligaste kategorierna på svenska marknaden, vilka ISV:er som dominerar och vilka BC-partners som är offentligt listade. Skriven ur köparens perspektiv.",
    breadcrumbLabel: "BC-tilläggsapplikationer",
    resources: [
      tools.bcMatchningstest,
      tools.behovsanalysErp,
      ...ALL_DEEP_DIVE_ARTICLES
        .filter((a) => a.productSlug === "businesscentral" && (a.slug.startsWith("tillagg-") || a.slug === "isv-tillaggsapplikationer"))
        .map((a) => ({
          id: `dd-${a.productSlug}-${a.slug}`,
          type: "tillagg" as const,
          title: a.title,
          description: a.description,
          url: `/kunskapscenter/${a.productSlug}/${a.slug}/`,
          category: a.product,
        })),
    ],
  },
  {
    slug: "finance-supply-chain",
    metaTitle: "Finance & Supply Chain – kunskap, guider och fördjupningar | d365.se",
    metaDescription:
      "Allt om Dynamics 365 Finance & Supply Chain Management: produktfördjupningar, artiklar, behovsanalys och branschjämförelse mot Business Central.",
    h1: "Finance & Supply Chain – kunskap, guider och fördjupningar",
    intro:
      "Allt material om Dynamics 365 Finance & Supply Chain Management (F&SCM) samlat på ett ställe. Jämför mot Business Central, läs produktfördjupningar och påbörja en behovsanalys.",
    breadcrumbLabel: "Finance & Supply Chain",
    resources: [
      tools.behovsanalysErp,
      tools.kravspecErp,
      tools.branschjamforelse,
      ...comparisonsAsResources("fscm"),
      ...deepDiveBySlug(["financesupplychain"]),
      ...blogByProduct(["Finance & SCM"]),
    ],
  },
  {
    slug: "sales",
    metaTitle: "Sales & CRM – kunskap, guider och fördjupningar | d365.se",
    metaDescription:
      "Allt om Dynamics 365 Sales och Customer Insights: produktfördjupningar, artiklar, behovsanalys CRM och kravspecifikationer för sälj och marknad.",
    h1: "Sales & CRM – kunskap, guider och fördjupningar",
    intro:
      "Här hittar du allt vi publicerat om Dynamics 365 Sales och Customer Insights (marknad). Behovsanalyser, kravspecar, produktfördjupningar och artiklar – samlat för dig som utvärderar CRM.",
    breadcrumbLabel: "Sales & CRM",
    resources: [
      tools.behovsanalysCrm,
      tools.kravspecSales,
      tools.kravspecMarketing,
      ...comparisonsAsResources("sales"),
      ...comparisonsAsResources("customer-insights"),
      ...deepDiveBySlug(["d365sales", "d365marketing"]),
      ...blogByProduct(["Sales", "Customer Insights"]),
    ],
  },
  {
    slug: "customer-service",
    metaTitle: "Kundservice & Field Service – kunskap, guider och fördjupningar | d365.se",
    metaDescription:
      "Allt om Dynamics 365 Customer Service, Field Service och Contact Center: produktfördjupningar, behovsanalys och kravspecifikation för kundservice.",
    h1: "Kundservice & Field Service – kunskap, guider och fördjupningar",
    intro:
      "Allt om Dynamics 365 Customer Service, Field Service och Contact Center. Behovsanalyser, kravspecar och produktfördjupningar samlat för dig som bygger eller utvärderar kundservicelösningar.",
    breadcrumbLabel: "Kundservice & Field Service",
    resources: [
      tools.behovsanalysService,
      tools.kravspecKundservice,
      ...comparisonsAsResources("customer-service"),
      ...comparisonsAsResources("contact-center"),
      ...comparisonsAsResources("field-service"),
      ...deepDiveBySlug(["d365customerservice", "d365fieldservice", "d365contactcenter"]),
      ...blogByProduct(["Customer Service", "Field Service", "Contact Center"]),
    ],
  },
  {
    slug: "copilot",
    metaTitle: "Copilot & AI-agenter – kunskap, guider och fördjupningar | d365.se",
    metaDescription:
      "Allt om Microsoft Copilot och AI-agenter i Dynamics 365: produktfördjupningar, AI Readiness Assessment och artiklar om AI för ERP och CRM.",
    h1: "Copilot & AI-agenter – kunskap, guider och fördjupningar",
    intro:
      "Köparsidig vägledning om Microsoft Copilot och AI-agenter i Dynamics 365. Här hittar du AI Readiness Assessment, produktfördjupningar om Copilot och Agents samt artiklar om AI:s roll i ERP och CRM.",
    breadcrumbLabel: "Copilot & AI",
    resources: [
      tools.aiReadiness,
      ...deepDiveBySlug(["copilot", "agents"]),
      ...blogByProduct(["AI/Copilot/Agents"]),
    ],
  },
  {
    slug: "upphandling",
    metaTitle: "Upphandling av ERP och CRM – guider, kravspecar och e-bok | d365.se",
    metaDescription:
      "Allt om upphandling av Dynamics 365: upphandlingsguiden, 7 stadier i upphandlingsresan, kravspecifikationer och e-bok om partnerval.",
    h1: "Upphandling av ERP och CRM – guider, kravspecar och e-bok",
    intro:
      "Samlade resurser för dig som ska upphandla ett nytt affärssystem eller CRM. Förstå upphandlingsresans 7 stadier, skapa en kravspecifikation och läs vår e-bok om det viktiga partnervalet.",
    breadcrumbLabel: "Upphandling",
    resources: [
      tools.upphandlingsguiden,
      tools.upphandlingsresan,
      tools.kravspecErp,
      tools.kravspecSales,
      tools.kravspecMarketing,
      tools.kravspecKundservice,
      tools.behovsanalysErp,
      tools.behovsanalysCrm,
      tools.behovsanalysService,
      tools.ebookPartnerval,
      tools.guideValjPartner,
      ...blogByCategory(["Strategi", "Governance", "Partnerval"]),
    ],
  },
  {
    slug: "partners",
    metaTitle: "Partnerval – guider, branschguides och e-bok om Dynamics 365-partners | d365.se",
    metaDescription:
      "Allt om val av Microsoft Dynamics 365-partner: partnerväljare, branschguides, e-bok om partnerval och artiklar om hur du utvärderar leverantörer.",
    h1: "Partnerval – guider, branschguides och e-bok",
    intro:
      "Samlade resurser för dig som väljer Dynamics 365-partner. Använd vår partnerväljare, läs branschguides per industri eller fördjupa dig i e-boken Det viktiga partnervalet.",
    breadcrumbLabel: "Partnerval",
    resources: [
      tools.valjPartner,
      tools.partnersPerBransch,
      tools.allaPartners,
      tools.branscher,
      tools.guideValjPartner,
      tools.ebookPartnerval,
      ...blogByCategory(["Branschguide", "Partnerval"]),
    ],
  },
];

export const HUB_BY_SLUG: Record<string, KnowledgeHubConfig> = Object.fromEntries(
  KNOWLEDGE_HUBS.map((h) => [h.slug, h])
);
