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
  { from: "/behovsanalys",              to: "/ERPbehovsanalys", intendedStatus: 301 },
  { from: "/salj-marknad-behovsanalys", to: "/CRMbehovsanalys", intendedStatus: 301 },
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
