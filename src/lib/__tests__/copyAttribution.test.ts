import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { withAttribution, attributionText, COPY_ATTRIBUTION_MIN_CHARS } from "@/lib/copyAttribution";

const long = "x".repeat(COPY_ATTRIBUTION_MIN_CHARS + 1);

describe("källhänvisning vid kopiering", () => {
  it("lägger till källrad med sidans d365.se-adress när mer än 150 tecken kopieras", () => {
    const out = withAttribution(long, `<p>${long}</p>`, "/guider/valja-dynamics-365-partner");
    expect(out?.text).toBe(`${long}\n\nKälla: D365.SE Köpguide, https://d365.se/guider/valja-dynamics-365-partner/`);
    expect(out?.html).toContain('<a href="https://d365.se/guider/valja-dynamics-365-partner/">');
  });
  it("lämnar korta kopieringar och interna sidor orörda", () => {
    expect(withAttribution("x".repeat(COPY_ATTRIBUTION_MIN_CHARS), "", "/kostnad/")).toBeNull();
    expect(withAttribution(long, "", "/admin")).toBeNull();
    expect(withAttribution(long, "", "/redaktion/")).toBeNull();
  });
  it("använder aldrig ordet oberoende och ingen em dash", () => {
    expect(attributionText("/")).not.toMatch(/oberoende|—/i);
  });
});

describe("robots.txt", () => {
  const robots = readFileSync("public/robots.txt", "utf8");
  const block = (ua: string) => robots.split(/\n\s*\n/).find((b) => b.split("\n").some((l) => l.trim() === `User-agent: ${ua}`)) || "";
  it("spärrar kända datainsamlare", () => {
    for (const ua of ["CCBot", "Bytespider", "Diffbot"]) expect(block(ua)).toMatch(/^Disallow: \/$/m);
  });
  it("låter sökmotorer läsa sajten", () => {
    for (const ua of ["Googlebot", "Bingbot", "*"]) {
      expect(block(ua)).toMatch(/^Allow: \/$/m);
      expect(block(ua)).not.toMatch(/^Disallow: \/$/m);
    }
  });
});
