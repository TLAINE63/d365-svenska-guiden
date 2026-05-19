import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import path from "path";

const PHRASE = "Oberoende vägledning inför val av Dynamics 365 och partner";
const PAGES_DIR = path.resolve(__dirname, "..", "pages");

// Dynamiska sidor som bygger SEOHead-props i runtime (utan litterala strängar).
// Dessa testas inte här – deras SEO byggs upp baserat på data och täcks separat.
const DYNAMIC_PAGES = new Set([
  "BlogArticle.tsx",
  "DeepDiveArticle.tsx",
  "EventDetail.tsx",
  "IndustryPage.tsx",
  "PartnerProfile.tsx",
]);

// Sidor som inte ska indexeras (admin, partnerverktyg m.m.) – exkluderas.
const NON_PUBLIC_PAGES = new Set([
  "AdminDashboard.tsx",
  "AskAi.tsx",
  "NotFound.tsx",
  "PartnerAgreement.tsx",
  "PartnerEvents.tsx",
  "PartnerStats.tsx",
  "PartnerUpdate.tsx",
  "PrivacyPolicy.tsx",
  "SmartSearch.tsx",
]);

type PageBlock = {
  file: string;
  index: number;
  title: string;
  description: string;
};

function collectPublicSeoBlocks(): PageBlock[] {
  const out: PageBlock[] = [];
  for (const f of readdirSync(PAGES_DIR)) {
    if (!f.endsWith(".tsx")) continue;
    if (DYNAMIC_PAGES.has(f) || NON_PUBLIC_PAGES.has(f)) continue;
    const src = readFileSync(path.join(PAGES_DIR, f), "utf8");
    const blocks = [...src.matchAll(/<SEOHead[\s\S]*?\/>/g)]
      .map((m) => m[0])
      .filter((b) => !/noIndex/.test(b));
    blocks.forEach((b, i) => {
      const title = b.match(/title="([^"]+)"/)?.[1];
      const description = b.match(/description="([^"]+)"/)?.[1];
      if (title && description) {
        out.push({ file: f, index: i, title, description });
      }
    });
  }
  return out;
}

const blocks = collectPublicSeoBlocks();

describe("SEO – publika undersidor", () => {
  it("hittar SEOHead-block i flera sidor", () => {
    expect(blocks.length).toBeGreaterThanOrEqual(20);
  });

  describe.each(blocks)("$file [#$index]", ({ title, description }) => {
    it("har en metabeskrivning som innehåller den nya formuleringen", () => {
      expect(description).toContain(PHRASE);
    });

    it("har en metabeskrivning inom rekommenderad längd (50–160 tecken)", () => {
      expect(description.length).toBeGreaterThanOrEqual(50);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it("har en title inom rimlig längd (<= 80 tecken)", () => {
      expect(title.length).toBeLessThanOrEqual(80);
      expect(title.length).toBeGreaterThanOrEqual(10);
    });
  });

  it("alla metabeskrivningar är unika mellan sidor", () => {
    const descs = blocks.map((b) => b.description);
    const dupes = descs.filter((d, i) => descs.indexOf(d) !== i);
    expect(dupes).toEqual([]);
  });

  it("alla titles är unika mellan sidor (samma fil får dela title)", () => {
    // Flera SEOHead-block i samma fil är villkorade alternativ – de delar title.
    const perFile = new Map<string, string>();
    for (const b of blocks) {
      if (!perFile.has(b.file)) perFile.set(b.file, b.title);
    }
    const titles = [...perFile.values()];
    const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
    expect(dupes).toEqual([]);
  });
});
