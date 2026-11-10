import type { ContentTheme, PublicWebinar } from "@/lib/webinars";

export interface InviteArticle {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  slug: string | null;
  theme: ContentTheme | null;
  published_at: string | null;
  created_at: string;
}

export interface ContentInviteData {
  webinars: PublicWebinar[];
  articles: InviteArticle[];
}

export const CONTENT_INVITE_THEMES: { value: ContentTheme; label: string }[] = [
  { value: "partnerval", label: "Partnerval" },
  { value: "pris", label: "Pris och kostnad" },
  { value: "migrering", label: "Migrering" },
  { value: "business-central", label: "Business Central" },
  { value: "fscm", label: "Finance & Supply Chain Management" },
  { value: "crm", label: "CRM" },
  { value: "ai", label: "AI, Copilot och agenter" },
];

const EXCLUDED_PREFIXES = [
  "/admin", "/redaktion", "/tack/", "/forfragan/tack/", "/hamtat/", "/webinar/", "/nyhetsbrev/",
  "/kontakt/", "/partner-update/", "/partner-events/", "/konto/", "/bekrafta-", "/forfragan/svar/", "/partnersvar/",
];
const FORM_PREFIXES = [
  "/erpbehovsanalys/", "/crmbehovsanalys/", "/kundservice-behovsanalys/", "/kravspecifikation",
  "/beslutsmognadsdiagnostik/", "/kom-igang/",
];

function normalized(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return path.endsWith("/") ? path.toLowerCase() : `${path.toLowerCase()}/`;
}

function starts(path: string, route: string): boolean {
  return path.startsWith(normalized(route));
}

export function contentInviteAllowed(pathname: string): boolean {
  const path = normalized(pathname);
  if (EXCLUDED_PREFIXES.some((route) => starts(path, route))) return false;
  if (FORM_PREFIXES.some((route) => starts(path, route))) return false;
  if (path.split("/").filter(Boolean).includes("resultat")) return false;
  return true;
}

/** Maps actual public routes, including canonical replacements for the paths in the original brief. */
export function contentThemeForPath(pathname: string): ContentTheme | null {
  const path = normalized(pathname);
  if (!contentInviteAllowed(path)) return null;
  const segments = path.split("/").filter(Boolean);

  if (["/partners/", "/partner/", "/alla-d365-partners/", "/jamfor-partners/", "/kortlista/", "/valjdynamics365partner/", "/guider/byta-dynamics-partner/"].some((route) => starts(path, route))) return "partnerval";
  if (path.includes("pris") || ["/kostnad/", "/implementationskalkylator/"].some((route) => starts(path, route)) || path.includes("roi-kalkylator")) return "pris";
  if (["/nav-till-business-central/", "/befintlig-kund/"].some((route) => starts(path, route)) || segments.some((segment) => ["nav", "ax", "gp"].includes(segment) || /^(?:nav|ax|gp)-/.test(segment))) return "migrering";
  if (["/businesscentral/", "/business-central/"].some((route) => starts(path, route))) return "business-central";
  if (["/finance-supply-chain-management/", "/finance-supply-chain/"].some((route) => starts(path, route))) return "fscm";
  if (["/crm/", "/d365sales/", "/d365customerservice/", "/d365fieldservice/", "/d365contactcenter/", "/d365marketing/"].some((route) => starts(path, route))) return "crm";
  if (["/ai-readiness/", "/copilot/", "/agents/", "/aioversikt/", "/ai/"].some((route) => starts(path, route))) return "ai";
  return null;
}

export interface ResolvedInvite {
  kind: "webinar" | "article";
  title: string;
  sentence: string;
  href: string;
  cta: string;
}

export function resolveContentInvite(theme: ContentTheme, data: ContentInviteData, now = new Date()): ResolvedInvite | null {
  const webinar = data.webinars
    .filter((item) => item.theme === theme && item.status === "publicerad" && new Date(item.starts_at).getTime() > now.getTime())
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0];
  if (webinar) {
    return {
      kind: "webinar",
      title: webinar.title,
      sentence: `${new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(webinar.starts_at))}. Webinar, ${webinar.duration_min} minuter, kostnadsfritt.`,
      href: `/webinar/${webinar.slug}/`,
      cta: "Anmäl dig",
    };
  }
  const article = data.articles
    .filter((item) => item.theme === theme && (item.url || item.slug))
    .sort((a, b) => (b.published_at || b.created_at).localeCompare(a.published_at || a.created_at))[0];
  if (!article) return null;
  const description = (article.description || "").replace(/\s+/g, " ").trim();
  const firstSentence = description.match(/^.*?[.!?](?=\s|$)/)?.[0] || description || "Läs artikeln i Kunskapscentret på d365.se.";
  return {
    kind: "article",
    title: article.title,
    sentence: firstSentence,
    href: article.url || `/artiklar/${article.slug}/`,
    cta: "Läs artikeln",
  };
}
