import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
// @ts-ignore - plain JS script without types
import { validate404Html } from "../../scripts/check-prerender-seo.mjs";


const GOOD_404 = `<!doctype html><html lang="sv"><head>
<title>Sidan hittades inte | d365.se</title>
<meta name="robots" content="noindex, follow" />
</head><body><div id="root">404</div></body></html>`;

describe("404 SEO regression", () => {
  it("accepts a clean noindex 404 page", () => {
    expect(validate404Html(GOOD_404).errors).toEqual([]);
  });

  it("fails when robots meta is missing", () => {
    const html = GOOD_404.replace(/<meta name="robots"[^>]*\/>/, "");
    expect(validate404Html(html).errors.join(" ")).toMatch(/robots/i);
  });

  it("fails when robots meta is indexable", () => {
    const html = GOOD_404.replace("noindex, follow", "index, follow");
    expect(validate404Html(html).errors.join(" ")).toMatch(/not noindex/i);
  });

  it("fails when a canonical points at another page (soft 404)", () => {
    const html = GOOD_404.replace(
      "</head>",
      '<link rel="canonical" href="https://d365.se/" /></head>',
    );
    expect(validate404Html(html).errors.join(" ")).toMatch(/soft 404/i);
  });

  it("fails when og:url points at another page", () => {
    const html = GOOD_404.replace(
      "</head>",
      '<meta property="og:url" content="https://d365.se/" /></head>',
    );
    expect(validate404Html(html).errors.join(" ")).toMatch(/og:url/i);
  });

  it("fails when indexable JSON-LD leaks onto the 404 page", () => {
    const html = GOOD_404.replace(
      "</head>",
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"d365.se"}</script></head>',
    );
    expect(validate404Html(html).errors.join(" ")).toMatch(/indexable JSON-LD/i);
  });

  it("fails on invalid JSON-LD", () => {
    const html = GOOD_404.replace(
      "</head>",
      '<script type="application/ld+json">{oops}</script></head>',
    );
    expect(validate404Html(html).errors.join(" ")).toMatch(/invalid JSON-LD/i);
  });

  const distFile = resolve(process.cwd(), "dist/404.html");
  it.skipIf(!existsSync(distFile))("validates the built dist/404.html", () => {
    expect(validate404Html(readFileSync(distFile, "utf-8")).errors).toEqual([]);
  });
});
