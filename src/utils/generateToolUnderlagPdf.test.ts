import { describe, expect, it } from "vitest";
import { createToolUnderlagPdf, toolPdfFilename } from "./generateToolUnderlagPdf";

describe("tool result PDF", () => {
  it("creates a real PDF instead of a Word document", async () => {
    const doc = await createToolUnderlagPdf({ tool: "roi_bc", label: "ROI-kalkyl Business Central", at: "2026-11-17", values: { "Nytta per år": "641 tkr" } }, "2026-11-17");
    expect(doc.output().startsWith("%PDF-")).toBe(true);
    expect(toolPdfFilename("roi_bc", "2026-11-17")).toBe("d365-underlag-roi_bc-2026-11-17.pdf");
  });
  it("continues oversized result rows across pages", async () => {
    const doc = await createToolUnderlagPdf({ tool: "krav", label: "Kravspecifikation", at: "2026-11-17", values: { "Valda krav": "Lagerhantering och spårbarhet. ".repeat(600) } }, "2026-11-17");
    expect(doc.getNumberOfPages()).toBeGreaterThan(2);
  });
});