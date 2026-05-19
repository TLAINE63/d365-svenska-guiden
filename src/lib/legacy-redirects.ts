/**
 * Legacy URL redirect registry.
 *
 * Lovable's static hosting does NOT expose HTTP-header redirects, so we cannot
 * literally emit a `301 Moved Permanently` response. Instead, for each legacy
 * path we prerender a tiny HTML file that combines the strongest signals
 * Google treats as a permanent redirect:
 *
 *   - `<meta http-equiv="refresh" content="0; url=…">`  (Googlebot: 301-equivalent)
 *   - `<link rel="canonical" href="…">`                 (consolidates ranking)
 *   - `<meta name="robots" content="noindex,follow">`   (drop legacy from index)
 *   - `<script>location.replace(…)</script>`            (instant client redirect)
 *   - `<meta name="x-redirect-status" content="301">`   (documented intent / test hook)
 *
 * The matching `<Route path="…" element={<Navigate replace />} />` in
 * `App.tsx` + `entry-server.tsx` covers the SPA fallback case where a user
 * navigates client-side after the bundle is loaded.
 *
 * `intendedStatus` is the HTTP status we WOULD return on a host that supports
 * it (Vercel/Netlify/etc.). Used by tests to assert intent and to render the
 * documentation marker.
 */
export type LegacyRedirect = {
  from: string;
  to: string;
  /** Documented intent — 301 (permanent) for renamed canonical URLs. */
  intendedStatus: 301 | 308;
};

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  // Renamed needs-analysis tools
  { from: "/behovsanalys",              to: "/ERPbehovsanalys", intendedStatus: 301 },
  { from: "/salj-marknad-behovsanalys", to: "/CRMbehovsanalys", intendedStatus: 301 },

  // Hyphenated → canonical non-hyphenated product URLs
  { from: "/business-central",          to: "/businesscentral",     intendedStatus: 301 },
  { from: "/ai-oversikt",               to: "/aioversikt",          intendedStatus: 301 },
  { from: "/d365-sales",                to: "/d365sales",           intendedStatus: 301 },
  { from: "/d365-marketing",            to: "/d365marketing",       intendedStatus: 301 },
  { from: "/d365-customer-service",     to: "/d365customerservice", intendedStatus: 301 },
  { from: "/d365-field-service",        to: "/d365fieldservice",    intendedStatus: 301 },
  { from: "/d365-contact-center",       to: "/d365contactcenter",   intendedStatus: 301 },

  // Partnerväljare aliases
  { from: "/valj-partner",              to: "/valjdynamics365partner", intendedStatus: 301 },
  { from: "/partner",                   to: "/valjdynamics365partner", intendedStatus: 301 },

  // Branscher (gammalt namn)
  { from: "/branschlosningar",          to: "/branscher",           intendedStatus: 301 },

  // Tidigare admin-paths
  { from: "/partner-admin",             to: "/admin",               intendedStatus: 301 },
  { from: "/lead-admin",                to: "/admin",               intendedStatus: 301 },

  // Kontakt
  { from: "/kontakta-oss",              to: "/kontakt",             intendedStatus: 301 },

  // Sekretess
  { from: "/sekretesspolicy",           to: "/dataskydd",           intendedStatus: 301 },

  // Sök
  { from: "/sok",                       to: "/AIsok",               intendedStatus: 301 },
  { from: "/search",                    to: "/AIsok",               intendedStatus: 301 },

  // Events / nyheter
  { from: "/nyheter",                   to: "/events",              intendedStatus: 301 },
  { from: "/evenemang",                 to: "/events",              intendedStatus: 301 },
  { from: "/aktuellt",                  to: "/events",              intendedStatus: 301 },

  // Tidigare hemsidesidor som konsoliderats till /
  { from: "/start",                     to: "/",                    intendedStatus: 301 },
  { from: "/om-oss",                    to: "/",                    intendedStatus: 301 },
  { from: "/vara-tjanster",             to: "/",                    intendedStatus: 301 },
  { from: "/konfigurator",              to: "/",                    intendedStatus: 301 },
  { from: "/projektpaket",              to: "/",                    intendedStatus: 301 },
  { from: "/dynamics-365-introduktion", to: "/",                    intendedStatus: 301 },
  { from: "/dynamics-365-demos",        to: "/",                    intendedStatus: 301 },

  // Tidigare produktlandningssidor
  { from: "/dynamics-365-customer-engagement-crm", to: "/crm",            intendedStatus: 301 },
  { from: "/dynamics-365-erp-business-central",    to: "/businesscentral", intendedStatus: 301 },
];

const SITE_ORIGIN = "https://d365.se";

/** Always ensure trailing slash for canonical URLs (matches sitemap convention). */
function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Build the static HTML for a legacy redirect page. Shared between the
 * prerender plugin (build-time emission) and the E2E test (verification).
 */
export function buildRedirectHtml(redirect: LegacyRedirect): string {
  const targetPath = withTrailingSlash(redirect.to);
  const canonical = `${SITE_ORIGIN}${targetPath}`;
  const status = redirect.intendedStatus;

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flyttad: ${redirect.from} → ${redirect.to} | d365.se</title>
  <meta name="robots" content="noindex,follow" />
  <meta name="x-redirect-status" content="${status}" />
  <meta http-equiv="refresh" content="0; url=${targetPath}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:url" content="${canonical}" />
  <script>window.location.replace(${JSON.stringify(targetPath)});</script>
</head>
<body>
  <p>Den här sidan har flyttat till <a href="${targetPath}">${targetPath}</a>.</p>
</body>
</html>
`;
}
