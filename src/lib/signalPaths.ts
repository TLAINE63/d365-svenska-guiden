/**
 * Signaladresser (tack-, resultat- och nedladdningsadresser) ska ha noindex, follow redan
 * i den HTML servern levererar. Regeln används av prerender-pluginet; listan anger vilka
 * kända adresser som får en egen statisk HTML-fil.
 */
// Speglar THANKS_KINDS i thanksPages.ts (importeras inte: filen används av byggskriptet utan DOM).
const THANKS_KINDS = ["radgivning", "second-opinion", "partnermatchning", "kompetens", "skicka-underlag", "underlag", "kontakt"];

export const SIGNAL_ROBOTS_META = '<meta name="robots" content="noindex, follow" />';

/** Innehåller /resultat/ eller börjar med /tack/, /forfragan/tack/ eller /hamtat/. */
export function isSignalPath(path: string): boolean {
  const p = path.endsWith("/") ? path : `${path}/`;
  return p.includes("/resultat/") || p.startsWith("/tack/") || p.startsWith("/forfragan/tack/") || p.startsWith("/hamtat/");
}

const RESULT_BASES = [
  "/nav-till-business-central", "/businesscentral/matchningstest", "/crm/matchningstest",
  "/finance-supply-chain-management/matchningstest", "/d365sales/matchningstest",
  "/d365customerservice/matchningstest", "/d365marketing/matchningstest",
  "/d365fieldservice/matchningstest", "/d365contactcenter/matchningstest",
  "/ai-readiness", "/befintlig-kund", "/ERPbehovsanalys", "/kom-igang", "/kom-igang/snabbguide",
  "/CRMbehovsanalys", "/kundservice-behovsanalys", "/kostnad", "/kravspecifikation",
  "/kravspecifikation-sales", "/kravspecifikation-marketing", "/kravspecifikation-kundservice",
  "/beslutsmognad",
];

const DOWNLOAD_SLUGS = [
  "kopparguide-2026", "implementationskalkyl", "partnerguide", "e-bok-partnervalet", "ai-mognad",
  "kravspec-erp", "kravspec-sales", "kravspec-marketing", "kravspec-kundservice",
  "roi-businesscentral", "roi-d365sales", "roi-finance-scm", "roi-customer-service",
  "roi-customer-insights", "roi-contact-center", "roi-field-service",
];

/** Kända signaladresser med avslutande snedstreck. */
export const SIGNAL_PATHS: string[] = [
  ...THANKS_KINDS.map((k) => `/tack/${k}/`),
  "/forfragan/tack/",
  ...DOWNLOAD_SLUGS.map((s) => `/hamtat/${s}/`),
  ...RESULT_BASES.map((b) => `${b}/resultat/`),
];

/** Lägger till noindex, follow i <head> och tar bort andra robots-taggar. */
export function withSignalNoindex(html: string): string {
  const cleaned = html.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, "");
  return cleaned.replace("</head>", `    ${SIGNAL_ROBOTS_META}\n  </head>`);
}
