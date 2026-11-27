import { expect, it } from "vitest";
import { toolsForSharedSections } from "@/lib/toolContext";
const tools = ["roi_bc", "roi_sales"].map(tool => ({ tool, label: tool, at: "2026-11-27", values: { Kostnad: "100" } }));
it("endast markerade verktygsunderlag får följa med", () => {
  expect(toolsForSharedSections(tools, ["tool:roi_bc"]).map(t => t.tool)).toEqual(["roi_bc"]);
});
it("ett avmarkerat underlag skickas inte i dold verktygskontext", () => {
  expect(toolsForSharedSections(tools, ["sammanhang"])).toEqual([]);
});