import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { NEXT_STEP_PAGES, nextStepOptions, nextStepPage } from "@/lib/nextSteps";

const app = readFileSync("src/App.tsx", "utf8");

describe("Fortsätt er utvärdering, Sprint 1.6", () => {
  it("visar högst fyra alternativ med personlig hjälp sist", () => {
    for (const page of Object.values(NEXT_STEP_PAGES)) {
      const opts = nextStepOptions(page);
      expect(opts.length).toBeLessThanOrEqual(4);
      expect(opts.at(-1)?.label).toBe("Få hjälp att bedöma nästa steg");
      expect(opts.at(-1)?.recipient).toBe("d365");
    }
  });

  it("inget steg går direkt till partner eller ISV", () => {
    for (const page of Object.values(NEXT_STEP_PAGES)) for (const o of nextStepOptions(page)) expect(["none", "d365"]).toContain(o.recipient);
  });

  it("alla länkar går till sidor som finns och pilotsidorna finns i routningen", () => {
    for (const [path, page] of Object.entries(NEXT_STEP_PAGES)) {
      expect(app).toContain(`path="${path.replace(/\/$/, "")}"`);
      for (const o of page.steps) if (o.to) expect(app).toContain(`path="${o.to.split("#")[0].replace(/\/$/, "")}"`);
    }
  });

  it("piloten är begränsad och okända sidor visar inget block", () => {
    expect(Object.keys(NEXT_STEP_PAGES).length).toBeLessThanOrEqual(6);
    expect(nextStepPage("/guider/optimera-dynamics-365/")).toBeNull();
    expect(nextStepPage("/crm")).not.toBeNull();
  });
});
