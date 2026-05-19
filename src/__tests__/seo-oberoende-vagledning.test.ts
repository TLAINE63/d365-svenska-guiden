import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const PHRASE = "Oberoende vägledning inför val av Dynamics 365 och partner";

function readPage(rel: string): string {
  return readFileSync(path.resolve(__dirname, "..", "pages", rel), "utf8");
}

function extractSeoHead(src: string): string {
  // Match the first <SEOHead ... /> block (the public, non-noIndex one)
  const matches = [...src.matchAll(/<SEOHead[\s\S]*?\/>/g)];
  const publicBlock = matches.find((m) => !/noIndex/.test(m[0]));
  if (!publicBlock) throw new Error("No public SEOHead found");
  return publicBlock[0];
}

function getProp(block: string, prop: string): string {
  const m = block.match(new RegExp(`${prop}="([^"]+)"`));
  if (!m) throw new Error(`Prop ${prop} not found`);
  return m[1];
}

describe("SEO – Oberoende vägledning inför val av Dynamics 365 och partner", () => {
  describe("/ (Index.tsx)", () => {
    const block = extractSeoHead(readPage("Index.tsx"));
    const title = getProp(block, "title");
    const description = getProp(block, "description");

    it("har en title som innehåller den nya formuleringen", () => {
      expect(title).toContain(PHRASE);
    });

    it("har en metabeskrivning som innehåller den nya formuleringen", () => {
      expect(description).toContain(PHRASE);
    });

    it("har en rimlig titel-längd (<= 80 tecken)", () => {
      expect(title.length).toBeLessThanOrEqual(80);
    });
  });

  describe("/kontakt (ContactUs.tsx)", () => {
    const block = extractSeoHead(readPage("ContactUs.tsx"));
    const title = getProp(block, "title");
    const description = getProp(block, "description");

    it("har en title som innehåller den nya formuleringen", () => {
      expect(title).toContain(PHRASE);
    });

    it("har en metabeskrivning som innehåller den nya formuleringen", () => {
      expect(description).toContain(PHRASE);
    });

    it("har canonicalPath /kontakt", () => {
      expect(getProp(block, "canonicalPath")).toBe("/kontakt");
    });
  });
});
