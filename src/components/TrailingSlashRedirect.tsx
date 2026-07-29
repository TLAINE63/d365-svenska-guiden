import { useLocation, Navigate } from "react-router-dom";

/**
 * Canonical URL policy: every non-root path MUST end with a trailing slash.
 *
 * - Matches sitemap.xml (all entries are `…/`)
 * - Matches every `<link rel="canonical">` emitted via SEOHead / Helmet
 * - Matches what GitHub Pages serves (it 301s `/crm` → `/crm/` for any
 *   directory with an index.html, which our SSG prerender writes for
 *   every route)
 *
 * This client-side guard handles in-app SPA navigations and any external
 * link that lands on `/crm` after the SPA has already booted – we replace
 * the URL with the trailing-slash variant so Google never sees two
 * canonicalised variants from internal navigation.
 *
 * Skips:
 *   - the root path "/"
 *   - paths that look like a file (contain a "." in the last segment),
 *     so things like `/sitemap.xml` or `/robots.txt` aren't rewritten
 */
const TrailingSlashRedirect = () => {
  const { pathname, search, hash } = useLocation();

  if (pathname === "/" || pathname.endsWith("/")) return null;

  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) return null;

  return <Navigate to={pathname + "/" + search + hash} replace />;
};

export default TrailingSlashRedirect;
