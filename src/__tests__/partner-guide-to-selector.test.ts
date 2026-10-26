import { describe, expect, it } from "vitest";
import { GUIDE_CONTENT } from "@/data/partnerGuideContent";

const blocks = GUIDE_CONTENT["valja-dynamics-365-partner"].blocks;
const linksTo = (b: (typeof blocks)[number]) =>
  b.type === "p" ? (b.links ?? []).filter((l) => l.to === "/valjdynamics365partner/") : [];

describe("Partnerguiden leder vidare till partnerväljaren", () => {
  it("har minst två länkar i löpande text till /valjdynamics365partner/", () => {
    expect(blocks.flatMap(linksTo).length).toBeGreaterThanOrEqual(2);
  });
  it("varje ankartext finns ordagrant i sin paragraf", () => {
    for (const b of blocks) if (b.type === "p") for (const l of b.links ?? []) expect(b.text).toContain(l.text);
  });
  it("avslutas med en rekommendation att gå vidare via partnerväljaren", () => {
    expect(linksTo(blocks[blocks.length - 1]).length).toBe(1);
  });
});
