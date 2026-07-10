#!/usr/bin/env node
/**
 * SEO regression check for the prerendered dist/.
 *
 * Validates that critical routes have:
 *   - non-empty <title>
 *   - non-empty <meta name="description">
 *   - <link rel="canonical"> pointing at the right URL
 *   - non-empty og:title / og:description / og:url
 *
 * Exits 1 on any failure. Run after `bun run build`.
 *
 * Add new critical routes to CRITICAL_ROUTES below when shipping a new
 * prerendered page so SEO regressions (empty <title>, SPA fallback,
 * silent prerender crash) fail loudly in CI.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const DIST = resolve(process.cwd(), "dist");
const ORIGIN = "https://d365.se";
const PARTNER_DATA = resolve(process.cwd(), "src/data/partnerData.json");

export const CRITICAL_ROUTES = [
  "/",
  "/erp",
  "/affarssystem",
  "/businesscentral",
  "/priser",
  "/kom-igang",
  "/kunskapscenter",
  "/kunskapscenter/upphandling",
  "/kunskapscenter/upphandlingsresan",
  "/upphandlingsguiden",
  "/kravspecifikation",
  "/kravspecifikation-sales",
  "/kravspecifikation-marketing",
  "/kravspecifikation-kundservice",
  "/ERPbehovsanalys",
  "/CRMbehovsanalys",
  "/valjdynamics365partner",
  "/alla-d365-partners",
  "/partners-per-bransch",
];

function htmlPathFor(route) {
  const clean = route === "/" ? "" : route.replace(/^\//, "");
  return clean ? join(DIST, clean, "index.html") : join(DIST, "index.html");
}

function htmlSiblingPathFor(route) {
  const clean = route.replace(/^\//, "");
  return join(DIST, `${clean}.html`);
}

function pick(html, re, group = 1) {
  const m = html.match(re);
  return m ? m[group].trim() : "";
}

export function validateHtml(route, html) {
  const errors = [];
  const expectedUrl = `${ORIGIN}${route === "/" ? "/" : route.endsWith("/") ? route : `${route}/`}`;

  const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!title) errors.push("empty <title>");

  const desc = pick(
    html,
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
  ) || pick(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  if (!desc) errors.push("missing/empty meta description");

  const canonical = pick(
    html,
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
  ) || pick(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (!canonical) errors.push("missing canonical");
  else if (!canonical.startsWith(ORIGIN)) errors.push(`canonical not on ${ORIGIN}: ${canonical}`);
  else if (canonical !== expectedUrl) errors.push(`canonical does not self-reference ${expectedUrl}: ${canonical}`);

  const ogTitle = pick(
    html,
    /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i,
  );
  if (!ogTitle) errors.push("missing/empty og:title");

  const ogDesc = pick(
    html,
    /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']*)["']/i,
  );
  if (!ogDesc) errors.push("missing/empty og:description");

  const ogUrl = pick(
    html,
    /<meta[^>]+property=["']og:url["'][^>]*content=["']([^"']+)["']/i,
  );
  if (!ogUrl) errors.push("missing og:url");
  else if (ogUrl !== expectedUrl) errors.push(`og:url does not self-reference ${expectedUrl}: ${ogUrl}`);

  return { route, errors, title, canonical };
}

export function checkRoute(route) {
  const file = htmlPathFor(route);
  if (!existsSync(file)) {
    return { route, errors: [`prerendered HTML missing: ${file}`] };
  }
  const html = readFileSync(file, "utf-8");
  return validateHtml(route, html);
}

export function checkRouteHtmlSibling(route) {
  const file = htmlSiblingPathFor(route);
  if (!existsSync(file)) {
    return { route, errors: [`no-slash HTML sibling missing: ${file}`] };
  }
  const html = readFileSync(file, "utf-8");
  return validateHtml(route, html);
}

export function partnerRoutes() {
  if (!existsSync(PARTNER_DATA)) return [];
  const partners = JSON.parse(readFileSync(PARTNER_DATA, "utf-8"));
  return partners
    .filter((p) => p?.slug && p?.is_featured !== false)
    .map((p) => `/partner/${p.slug}`);
}

export function checkAll(routes = CRITICAL_ROUTES) {
  return routes.map(checkRoute);
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!existsSync(DIST)) {
    console.error(`❌ dist/ not found at ${DIST}. Run \`bun run build\` first.`);
    process.exit(1);
  }
  const results = checkAll();
  const failed = results.filter((r) => r.errors.length > 0);
  for (const r of results) {
    if (r.errors.length === 0) {
      console.log(`✅ ${r.route}  →  "${r.title.slice(0, 60)}"`);
    } else {
      console.error(`❌ ${r.route}`);
      for (const e of r.errors) console.error(`     - ${e}`);
    }
  }
  if (failed.length > 0) {
    console.error(`\nSEO prerender check failed for ${failed.length}/${results.length} route(s).`);
    process.exit(1);
  }

  const partnerSiblingResults = partnerRoutes().map(checkRouteHtmlSibling);
  const failedPartnerSiblings = partnerSiblingResults.filter((r) => r.errors.length > 0);
  for (const r of partnerSiblingResults) {
    if (r.errors.length === 0) {
      console.log(`✅ ${r.route}  →  no-slash HTML sibling OK`);
    } else {
      console.error(`❌ ${r.route} no-slash HTML sibling`);
      for (const e of r.errors) console.error(`     - ${e}`);
    }
  }
  if (failedPartnerSiblings.length > 0) {
    console.error(`\nPartner no-slash prerender check failed for ${failedPartnerSiblings.length}/${partnerSiblingResults.length} route(s).`);
    process.exit(1);
  }

  console.log(`\n✓ All ${results.length} critical routes and ${partnerSiblingResults.length} partner no-slash variants have valid SEO tags.`);
}
