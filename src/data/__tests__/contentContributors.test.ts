import { describe, it, expect } from "vitest";
import { contributionsFor, PAGE_CONTRIBUTIONS } from "@/data/contentContributors";

describe("content contributors", () => {
  it("never assigns an expert to a page that has no registered contribution", () => {
    expect(contributionsFor("/finance-supply-chain/")).toEqual([]);
  });
  it("returns a contribution only once it is explicitly registered", () => {
    PAGE_CONTRIBUTIONS["/test-page"] = [{ contributorId: "thomas-laine", role: "Faktagranskad av" }];
    expect(contributionsFor("/test-page/")[0].person.name).toBe("Thomas Laine");
    delete PAGE_CONTRIBUTIONS["/test-page"];
  });
});
