import { describe, expect, it } from "vitest";
import { productCustomerExamples } from "../productCustomerExamples";
import type { ProductFilterInput } from "@/hooks/usePartners";

const filter = (customerExamples: string[], customerCaseLinks: string[] = []) =>
  ({ customerExamples, customerCaseLinks } as ProductFilterInput);

describe("product-scoped customer evidence", () => {
  it("shows at most three actual customer names", () => {
    expect(productCustomerExamples(filter(["Swecon", "Stena Recycling", "Ponsse", "Fourth"])).map(x => x.name))
      .toEqual(["Swecon", "Stena Recycling", "Ponsse"]);
  });
  it("excludes Implema placeholders without inventing customers from case URLs", () => {
    expect(productCustomerExamples(filter(["Vi berättar gärna mer om våra implementationer", "hör av er till oss"], ["https://implema.se/camfil", "https://implema.se/atlas"]))).toEqual([]);
  });
  it("never falls back to another product or partner-wide examples", () => {
    expect(productCustomerExamples(undefined)).toEqual([]);
  });
  it("preserves case index after removing empty entries", () => {
    expect(productCustomerExamples(filter(["", "Swecon"], ["https://example.com/empty", "https://example.com/swecon"]))[0].url).toBe("https://example.com/swecon");
  });
  it("does not mismatch Vivicta's eight names and three case URLs", () => {
    expect(productCustomerExamples(filter(["KomatsForest", "Södraskogsägarna", "Caljan", "FläktGroup", "Lyse", "StoraEnso", "Lindab", "PMC"], ["https://example.com/caljan", "er-stories/wibax", "https://example.com/sodra"])).every(x => x.url === undefined)).toBe(true);
  });
  it("rejects unsafe case URLs", () => {
    expect(productCustomerExamples(filter(["Customer"], ["javascript:alert(1)"]))[0].url).toBeUndefined();
  });
});