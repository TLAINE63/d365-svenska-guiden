import { describe, it, expect } from "vitest";
import { buildSeoTitle, truncateEncodedSeoTitle, TITLE_MAX_LENGTH } from "../seoTitle";

describe("SEO-titlar", () => {
  it("behåller titlar som ryms oförändrade", () => {
    expect(buildSeoTitle("Business Central – pris, funktioner & partners")).toBe(
      "Business Central – pris, funktioner & partners | d365.se",
    );
  });

  it("släpper avslutande deltitel vid avgränsare i stället för att kapa med ellips", () => {
    const t = buildSeoTitle("Dynamics 365 för livsmedel & processindustri – guide 2026");
    expect(t).toBe("Dynamics 365 för livsmedel & processindustri | d365.se");
    expect(t).not.toContain("…");
  });

  it("AI-exempel blir läsbara utan ellips", () => {
    const t = buildSeoTitle("Arbeta med AI vid bankavstämning – AI i Business Central");
    expect(t).toBe("Arbeta med AI vid bankavstämning | d365.se");
  });

  it("använder hela sidtiteln utan suffix när den ryms", () => {
    const body = "Ändra en befintlig analys genom att beskriva ändringen nu";
    expect(buildSeoTitle(body)).toBe(body);
  });

  it("kapar på ordgräns med ellips som sista utväg och håller gränsen", () => {
    const t = buildSeoTitle(
      "Ett mycket långt sidnamn utan några avgränsare som fortsätter och fortsätter ännu längre",
    );
    expect(t.endsWith("… | d365.se")).toBe(true);
    expect(t.length).toBeLessThanOrEqual(TITLE_MAX_LENGTH);
  });

  it("räknar &amp; som ett tecken och bryter aldrig entiteten", () => {
    const encoded = "Dynamics 365 pris 2026 – licenser &amp; prislista i | d365.se";
    expect(truncateEncodedSeoTitle(encoded)).toBe(encoded);
    const long = "Behovsanalys CRM – Dynamics 365 Sales &amp; Customer Insights gratis | d365.se";
    const out = truncateEncodedSeoTitle(long);
    expect(out).not.toMatch(/&amp(?!;)/);
    expect(out).not.toContain("&amp…");
  });
});
