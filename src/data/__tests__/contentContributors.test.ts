import { describe, it, expect } from "vitest";
import { contributionsFor, PAGE_CONTRIBUTIONS } from "@/data/contentContributors";

describe("content contributors", () => {
  it("never assigns an expert to a page that has no registered contribution", () => {
    expect(contributionsFor("/om-oss/")).toEqual([]);
  });
  it("credits Thomas Laine as author of Business Central", () => {
    expect(contributionsFor("/businesscentral/")[0].person.name).toBe("Thomas Laine");
  });
  it("credits Thomas Laine as author of F&SCM, reviewed 2026-09-24", () => {
    const [c] = contributionsFor("/finance-supply-chain/");
    expect(c.person.name).toBe("Thomas Laine");
    expect(c.role).toBe("Författare");
    expect(c.date).toBe("2026-09-24");
    expect(c.title).toBe("Redaktör och affärsrådgivare");
  });
  it("returns a contribution only once it is explicitly registered", () => {
    PAGE_CONTRIBUTIONS["/test-page"] = [{ contributorId: "thomas-laine", role: "Faktagranskad av" }];
    expect(contributionsFor("/test-page/")[0].person.name).toBe("Thomas Laine");
    delete PAGE_CONTRIBUTIONS["/test-page"];
  });
});
