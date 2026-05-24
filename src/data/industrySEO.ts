/**
 * Automatisk SEO-metadata per bransch.
 *
 * Används som fallback i IndustryPage när admin inte har fyllt i
 * meta_title / meta_description / h1 manuellt i industry_pages-tabellen.
 *
 * Innehåll är skrivet för svensk D365-publik och inkluderar:
 *  - branschspecifik svensk vokabulär
 *  - relevanta Dynamics 365-applikationer (BC, F&SCM, Sales, CS, FS, CC, AI/Copilot)
 *  - sökord som verkliga köpare använder
 *
 * Längdregler (Google):
 *  - title:        ~50–60 tecken
 *  - description:  ~140–160 tecken
 *  - h1:           kort, max ~70 tecken
 */

export interface IndustrySEO {
  /** <title> – sätts i SEOHead */
  title: string;
  /** <meta name="description"> */
  description: string;
  /** H1 i hero – om tom används industryName */
  h1: string;
}

export const INDUSTRY_SEO: Record<string, IndustrySEO> = {
  tillverkning: {
    title: "Dynamics 365 för tillverkningsindustrin i Sverige",
    description:
      "Microsoft Dynamics 365 för svensk tillverkningsindustri: produktionsplanering, MRP, kvalitet och spårbarhet med F&SCM och Business Central.",
    h1: "Dynamics 365 för tillverkningsindustrin",
  },
  "livsmedel-processindustri": {
    title: "Dynamics 365 för livsmedel & processindustri",
    description:
      "Receptstyrning, batch- och lotspårning, kvalitetskontroll och HACCP – så stödjer Dynamics 365 F&SCM och Business Central svensk livsmedels- och processindustri.",
    h1: "Dynamics 365 för livsmedel & processindustri",
  },
  "grossist-distribution": {
    title: "Dynamics 365 för grossister & distribution",
    description:
      "Lager, inköp, prissättning och B2B-försäljning för grossister: hur Dynamics 365 Business Central, F&SCM och Sales stödjer hela distributionskedjan.",
    h1: "Dynamics 365 för grossist & distribution",
  },
  "retail-ehandel": {
    title: "Dynamics 365 för retail & e-handel i Sverige",
    description:
      "Omnikanalförsäljning, POS, lager, kundklubb och e-handel: så används Dynamics 365 Commerce, Business Central och Customer Insights inom svensk retail.",
    h1: "Dynamics 365 för retail & e-handel",
  },
  konsulttjanster: {
    title: "Dynamics 365 för konsultbolag & tjänsteföretag",
    description:
      "Tids- och projektredovisning, fakturering, beläggning och CRM för konsultbolag – med Dynamics 365 Project Operations, Business Central och Sales.",
    h1: "Dynamics 365 för konsultbolag & tjänsteföretag",
  },
  "bygg-entreprenad": {
    title: "Dynamics 365 för bygg- & entreprenadbolag",
    description:
      "Projektredovisning, kalkyl, ÄTA, underentreprenörer och fält­service: hur Dynamics 365 Business Central, F&SCM och Field Service stödjer svenska byggbolag.",
    h1: "Dynamics 365 för bygg & entreprenad",
  },
  "fastighet-forvaltning": {
    title: "Dynamics 365 för fastighet & förvaltning",
    description:
      "Hyresadministration, förvaltning, fastighetsekonomi och underhåll i Dynamics 365 Business Central, F&SCM och Field Service för svenska fastighetsbolag.",
    h1: "Dynamics 365 för fastighet & förvaltning",
  },
  "energi-utilities": {
    title: "Dynamics 365 för energi & utilities",
    description:
      "Tillgångsförvaltning, fältservice, kund- och avtalshantering för energi-, el- och utilities­bolag med Dynamics 365 F&SCM, Field Service och Contact Center.",
    h1: "Dynamics 365 för energi & utilities",
  },
  "finans-forsakring": {
    title: "Dynamics 365 för finans & försäkring",
    description:
      "CRM, kundresor, regelefterlevnad och ärendehantering för banker, försäkringsbolag och finansaktörer med Dynamics 365 Sales, Customer Insights och Customer Service.",
    h1: "Dynamics 365 för finans & försäkring",
  },
  "life-science-medtech": {
    title: "Dynamics 365 för Life Science & Medtech",
    description:
      "Validerad ekonomi, kvalitet, spårbarhet och regulatoriska krav (GxP) i Dynamics 365 F&SCM och Business Central för svensk life science- och medtech-industri.",
    h1: "Dynamics 365 för Life Science & Medtech",
  },
  "telekom-it-tjanster": {
    title: "Dynamics 365 för telekom & IT-tjänster",
    description:
      "Abonnemang, ärenden, fältservice och kundupplevelse för telekom- och IT-bolag med Dynamics 365 Sales, Customer Service, Field Service och Contact Center.",
    h1: "Dynamics 365 för telekom & IT-tjänster",
  },
  "logistik-transport": {
    title: "Dynamics 365 för logistik & transport",
    description:
      "Transportplanering, lager (WMS), spårbarhet och fältservice för svenska logistik- och transportbolag i Dynamics 365 F&SCM, Business Central och Field Service.",
    h1: "Dynamics 365 för logistik & transport",
  },
  "media-publishing": {
    title: "Dynamics 365 för media & publishing",
    description:
      "Annons- och prenumerationsförsäljning, CRM och ekonomi för media- och förlagsbolag med Dynamics 365 Sales, Customer Insights och Business Central.",
    h1: "Dynamics 365 för media & publishing",
  },
  "jordbruk-skogsbruk": {
    title: "Dynamics 365 för jordbruk & skogsbruk",
    description:
      "Ekonomi, inköp, lager och fältservice för jordbruks- och skogsbruksföretag med Dynamics 365 Business Central, F&SCM och Field Service.",
    h1: "Dynamics 365 för jordbruk & skogsbruk",
  },
  "halsa-sjukvard": {
    title: "Dynamics 365 för hälsa & sjukvård",
    description:
      "Patient- och ärendehantering, fältservice och ekonomi för vård och hälsa med Dynamics 365 Customer Service, Field Service och Business Central – med fokus på GDPR.",
    h1: "Dynamics 365 för hälsa & sjukvård",
  },
  "nonprofit-organisationer": {
    title: "Dynamics 365 för non-profit & organisationer",
    description:
      "Givar- och medlemshantering, fondredovisning och CRM för ideella organisationer med Dynamics 365 Sales, Customer Insights och Business Central.",
    h1: "Dynamics 365 för non-profit & organisationer",
  },
  medlemsorganisationer: {
    title: "Dynamics 365 för medlemsorganisationer",
    description:
      "Medlemsregister, fakturering, event och kommunikation för svenska medlems­organisationer med Dynamics 365 Sales, Customer Insights och Business Central.",
    h1: "Dynamics 365 för medlemsorganisationer",
  },
  utbildning: {
    title: "Dynamics 365 för utbildning & lärosäten",
    description:
      "Student- och deltagaradministration, ekonomi och kommunikation för utbildnings­aktörer med Dynamics 365 Sales, Customer Insights och Business Central.",
    h1: "Dynamics 365 för utbildning",
  },
  "offentlig-sektor": {
    title: "Dynamics 365 för offentlig sektor i Sverige",
    description:
      "Ärendehantering, medborgar­service och ekonomi för kommuner, regioner och myndigheter med Dynamics 365 Customer Service, Contact Center och Business Central.",
    h1: "Dynamics 365 för offentlig sektor",
  },
  uthyrning: {
    title: "Dynamics 365 för uthyrningsverksamhet",
    description:
      "Utrustnings­hyra, avtal, fakturering och fältservice för svenska uthyrnings­företag med Dynamics 365 Business Central, F&SCM och Field Service.",
    h1: "Dynamics 365 för uthyrning",
  },
};

export const getIndustrySEO = (slug: string | undefined): IndustrySEO | undefined =>
  slug ? INDUSTRY_SEO[slug] : undefined;
