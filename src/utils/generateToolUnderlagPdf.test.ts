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
import { defaultToolNote } from "./generateToolUnderlagPdf";
import { describe as d2, it as i2, expect as e2 } from "vitest";
d2("standardtext i PDF", () => {
  i2("kalkylatorer behåller texten om indikativa beräkningar", () => {
    for (const t of ["roi_sales", "roi_bc", "implementation", "affarsnytta"]) e2(defaultToolNote(t)).toMatch(/indikativa/);
  });
  i2("behovsanalyser, kravspecifikationer och matchningstester nämner inga beräkningar", () => {
    for (const t of ["behov_erp", "behov_crm", "behov_service", "krav_erp", "krav_sales", "krav_marketing", "krav_service", "match_bc", "match_fscm", "match_sales"]) {
      e2(defaultToolNote(t)).not.toMatch(/indikativa/);
      e2(defaultToolNote(t)).toContain("inga beräkningar");
    }
  });
});
