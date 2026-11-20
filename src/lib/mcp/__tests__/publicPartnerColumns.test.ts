import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { MCP_PUBLIC_PARTNER_COLUMNS, MCP_FORBIDDEN_PARTNER_COLUMNS, pickPublicPartner } from "../publicPartnerColumns";

describe("MCP partner columns", () => {
  it("allow-list contains no internal columns", () => {
    for (const c of MCP_FORBIDDEN_PARTNER_COLUMNS) expect(MCP_PUBLIC_PARTNER_COLUMNS as readonly string[]).not.toContain(c);
  });
  it("tool selects only use allow-listed columns", () => {
    for (const f of ["get-partner.ts", "search-partners.ts"]) {
      const src = readFileSync(`src/lib/mcp/tools/${f}`, "utf8");
      const m = [...src.matchAll(/\.select\(\s*"([^"]+)"/g)];
      expect(m.length).toBeGreaterThan(0);
      for (const [, cols] of m) for (const c of cols.split(","))
        expect(MCP_PUBLIC_PARTNER_COLUMNS as readonly string[]).toContain(c.trim());
      expect(src).toContain("pickPublicPartner");
    }
  });
  it("strips unknown fields", () => {
    expect(pickPublicPartner({ slug: "a", source_document_text: "x", monthly_fee: 1 })).toEqual({ slug: "a" });
  });
});
