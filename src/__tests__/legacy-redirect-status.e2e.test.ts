import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  LEGACY_REDIRECTS,
  buildRedirectHtml,
  type LegacyRedirect,
} from "@/lib/legacy-redirects";

/**
 * E2E verification that legacy URLs (/behovsanalys, /salj-marknad-behovsanalys)
 * emit a redirect with the correct intended HTTP status (301).
 *
 * Lovable's static hosting cannot set HTTP-level redirect headers, so the
 * prerender plugin writes a static HTML file at each legacy path with the
 * strongest combination of signals Google treats as a permanent 301:
 *
 *   - <meta http-equiv="refresh" content="0; url=…">
 *   - <link rel="canonical" href="…">
 *   - <meta name="robots" content="noindex,follow">
 *   - <meta name="x-redirect-status" content="301">   ← machine-readable intent
 *   - <script>window.location.replace(…)</script>
 *
 * This test asserts (a) the two required entries exist in the registry with
 * status 301 and the renamed targets, and (b) the generated HTML for each
 * legacy path contains every required signal.
 */

const REQUIRED: LegacyRedirect[] = [
  { from: "/behovsanalys",              to: "/ERPbehovsanalys", intendedStatus: 301 },
  { from: "/salj-marknad-behovsanalys", to: "/CRMbehovsanalys", intendedStatus: 301 },
];

describe("Legacy redirect HTTP status", () => {
  for (const want of REQUIRED) {
    describe(`${want.from} → ${want.to}`, () => {
      const entry = LEGACY_REDIRECTS.find((r) => r.from === want.from);

      it("is registered with intendedStatus 301", () => {
        expect(entry, `missing redirect ${want.from} in LEGACY_REDIRECTS`).toBeDefined();
        expect(entry!.to).toBe(want.to);
        expect(entry!.intendedStatus).toBe(301);
      });

      const html = entry ? buildRedirectHtml(entry) : "";
      const targetWithSlash = `${want.to}/`;

      it("declares machine-readable x-redirect-status = 301", () => {
        expect(html).toMatch(
          /<meta\s+name="x-redirect-status"\s+content="301"\s*\/?>/
        );
      });

      it("contains an immediate meta refresh to the target", () => {
        const re = new RegExp(
          `<meta\\s+http-equiv="refresh"\\s+content="0;\\s*url=${escapeRe(targetWithSlash)}"\\s*/?>`
        );
        expect(html).toMatch(re);
      });

      it("declares canonical pointing to the new URL", () => {
        const re = new RegExp(
          `<link\\s+rel="canonical"\\s+href="https://d365\\.se${escapeRe(targetWithSlash)}"\\s*/?>`
        );
        expect(html).toMatch(re);
      });

      it("is marked noindex so the legacy URL drops from the index", () => {
        expect(html).toMatch(/<meta\s+name="robots"\s+content="noindex,follow"\s*\/?>/);
      });

      it("performs an immediate JS fallback redirect", () => {
        expect(html).toContain(`window.location.replace("${targetWithSlash}")`);
      });
    });
  }

  it("plugin wires LEGACY_REDIRECTS + buildRedirectHtml into the prerender pipeline", () => {
    const plugin = readFileSync(
      resolve(process.cwd(), "vite-prerender-plugin.ts"),
      "utf-8"
    );
    expect(plugin).toMatch(/LEGACY_REDIRECTS/);
    expect(plugin).toMatch(/buildRedirectHtml\(redirect\)/);
    // Confirms the legacy HTML is written under the build outDir at <from>/index.html.
    expect(plugin).toMatch(/redirect\.from\.replace\(\/\^\\\/\/, ''\)/);
  });

  it("entry-server re-exports the redirect registry for the SSR bundle", () => {
    const src = readFileSync(
      resolve(process.cwd(), "src/entry-server.tsx"),
      "utf-8"
    );
    expect(src).toMatch(/export\s*\{\s*LEGACY_REDIRECTS\s*,\s*buildRedirectHtml\s*\}\s+from\s+['"]\.\/lib\/legacy-redirects['"]/);
  });
});

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
