import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  LEGACY_REDIRECTS,
  buildRedirectHtml,
} from "@/lib/legacy-redirects";

/**
 * SEO contract for renamed pages.
 *
 * The two legacy URLs must:
 *   1. Carry a canonical pointing at the new URL (trailing slash, https://d365.se).
 *   2. Be marked `noindex,follow` so they drop out of Google's index while
 *      still passing link equity through to the new target.
 *   3. Mirror the canonical in `og:url` so social cards point at the new page.
 *   4. NOT appear in the SSG `routes` list (which feeds the sitemap), so
 *      crawlers are never invited back to the old paths.
 *   5. NOT be re-allowed for indexing via any sitewide robots.txt entry.
 *
 * These assertions exist separately from the status-code test so an SEO
 * regression (someone drops noindex, or adds the legacy URL back to the
 * sitemap routes) fails loudly and points at the SEO concern directly.
 */

const SEO_EXPECTATIONS: Array<{ from: string; to: string }> = [
  { from: "/behovsanalys",              to: "/ERPbehovsanalys" },
  { from: "/salj-marknad-behovsanalys", to: "/CRMbehovsanalys" },
];

const SITE_ORIGIN = "https://d365.se";

describe("Legacy URL SEO (canonical + noindex)", () => {
  for (const want of SEO_EXPECTATIONS) {
    describe(`${want.from}`, () => {
      const entry = LEGACY_REDIRECTS.find((r) => r.from === want.from);
      const html = entry ? buildRedirectHtml(entry) : "";
      const targetWithSlash = `${want.to}/`;
      const canonicalUrl = `${SITE_ORIGIN}${targetWithSlash}`;

      it("is registered in LEGACY_REDIRECTS with the renamed target", () => {
        expect(entry, `missing ${want.from} in registry`).toBeDefined();
        expect(entry!.to).toBe(want.to);
      });

      it("declares exactly one canonical, pointing to the new URL", () => {
        const matches = html.match(/<link\s+rel="canonical"[^>]*>/g) ?? [];
        expect(matches).toHaveLength(1);
        expect(matches[0]).toContain(`href="${canonicalUrl}"`);
      });

      it("canonical includes a trailing slash (matches sitemap convention)", () => {
        expect(html).toContain(`href="${SITE_ORIGIN}${targetWithSlash}"`);
        // Guard against a regression that drops the slash on the canonical only.
        expect(html).not.toMatch(
          new RegExp(`href="${escapeRe(SITE_ORIGIN + want.to)}"(?!/)`)
        );
      });

      it("is marked noindex,follow (drops from index, passes link equity)", () => {
        const robots = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/);
        expect(robots, "missing robots meta").not.toBeNull();
        const value = robots![1].toLowerCase().replace(/\s+/g, "");
        expect(value).toContain("noindex");
        expect(value).toContain("follow");
        // Defensive: must not accidentally re-allow indexing.
        expect(value).not.toContain("index,");
        expect(value).not.toMatch(/(^|,)index($|,)/);
      });

      it("og:url mirrors the canonical so social previews point at the new page", () => {
        const og = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/);
        expect(og, "missing og:url").not.toBeNull();
        expect(og![1]).toBe(canonicalUrl);
      });

      it("the new (canonical) target page exists in the SSG routes list", () => {
        const entryServer = readFileSync(
          resolve(process.cwd(), "src/entry-server.tsx"),
          "utf-8"
        );
        // The renamed page must be a sitemapped route, otherwise canonical
        // points at a URL Google can't find via the sitemap.
        const re = new RegExp(
          `path:\\s*['"]${escapeRe(want.to)}['"]`
        );
        expect(entryServer).toMatch(re);
      });
    });
  }

  it("legacy paths are NOT present in the SSG routes list (no sitemap entry)", () => {
    const entryServer = readFileSync(
      resolve(process.cwd(), "src/entry-server.tsx"),
      "utf-8"
    );
    for (const want of SEO_EXPECTATIONS) {
      const re = new RegExp(`path:\\s*['"]${escapeRe(want.from)}['"]`);
      expect(
        entryServer,
        `legacy path ${want.from} must NOT be a sitemap route`
      ).not.toMatch(re);
    }
  });

  it("robots.txt does not Allow or Sitemap-list any legacy path", () => {
    const robots = readFileSync(
      resolve(process.cwd(), "public/robots.txt"),
      "utf-8"
    );
    for (const want of SEO_EXPECTATIONS) {
      // The legacy path may be unmentioned (current state) or Disallow'd, but
      // it must never appear in an Allow: or Sitemap: directive that would
      // invite crawlers back to it.
      const allowRe = new RegExp(`^\\s*Allow:\\s*${escapeRe(want.from)}\\b`, "mi");
      const sitemapRe = new RegExp(`^\\s*Sitemap:.*${escapeRe(want.from)}`, "mi");
      expect(robots, `Allow: ${want.from} found in robots.txt`).not.toMatch(allowRe);
      expect(robots, `Sitemap mention of ${want.from} found`).not.toMatch(sitemapRe);
    }
  });
});

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
