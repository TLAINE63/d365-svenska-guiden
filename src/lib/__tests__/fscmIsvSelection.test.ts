import { describe, expect, it } from "vitest";
import type { IsvSolution } from "@/data/bcIsvSolutions";
import { selectFscmIsvs } from "../fscmIsvSelection";
const solution = (id: string, products = ["Finance & Supply Chain Management"], lifecycleStatus = "active") => ({ id, products, lifecycleStatus } as IsvSolution);
describe("F&SCM reviewed existing catalog selection", () => {
  it("selects four reviewed IDs across invoicing, EDI, maintenance and documents", () => {
    const ids = ["truvio-exflow-ap", "staedean-edi-studio", "dynaway-advanced-asset-management", "lasernet-lasernet-document-report-creation"];
    expect(selectFscmIsvs(ids.map(id => solution(id))).map(s => s.id)).toEqual(ids);
  });
  it("never relabels BC-only solutions to populate the page", () => {
    expect(selectFscmIsvs([solution("truvio-exflow-ap", ["Business Central"])])).toEqual([]);
  });
  it("never invents unavailable catalog entries", () => { expect(selectFscmIsvs([])).toEqual([]); });
  it("excludes discontinued products", () => { expect(selectFscmIsvs([solution("truvio-exflow-ap", undefined, "discontinued")])).toEqual([]); });
});