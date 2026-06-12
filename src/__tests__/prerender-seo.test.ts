/**
 * SEO regression test for prerendered HTML.
 *
 * Runs against dist/ after `bun run build`. In CI we run `bun run build`
 * before `bunx vitest run`, so dist/ exists and every critical route is
 * asserted. Locally, when dist/ is absent, the suite is skipped with a
 * clear message rather than silently passing.
 *
 * The intent is to catch regressions like:
 *   - Prerender crashes silently → HTML falls back to SPA shell (empty <title>)
 *   - A route added to the prerender list but missing from the SSR router
 *   - SEOHead removed/broken on a critical page
 */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - plain ESM script, no types
import { CRITICAL_ROUTES, checkRoute } from "../../scripts/check-prerender-seo.mjs";

const distExists = existsSync(resolve(process.cwd(), "dist"));
const d = distExists ? describe : describe.skip;

d("Prerendered SEO tags (dist/)", () => {
  if (!distExists) {
    it.skip("requires dist/ — run `bun run build` first", () => {});
    return;
  }

  for (const route of CRITICAL_ROUTES as string[]) {
    it(`${route} has non-empty title, description, canonical and og:* tags`, () => {
      const result = checkRoute(route);
      expect(result.errors, result.errors.join("; ")).toEqual([]);
    });
  }
});
