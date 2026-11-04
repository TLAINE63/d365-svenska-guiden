import { describe, expect, it } from "vitest";
import { cleanSummaryLines, RESULT_SUMMARY_MAX_LINES } from "./resultSummary";

describe("cleanSummaryLines", () => {
  it("skickar högst 15 rader", () => {
    const lines = Array.from({ length: 30 }, (_, i) => `Rad ${i}`);
    expect(cleanSummaryLines(lines)).toHaveLength(RESULT_SUMMARY_MAX_LINES);
    expect(RESULT_SUMMARY_MAX_LINES).toBe(15);
  });
  it("kortar rader till 200 tecken och tar bort tomma", () => {
    const out = cleanSummaryLines(["x".repeat(300), "  ", 5, "ok"]);
    expect(out).toEqual(["x".repeat(200), "ok"]);
  });
});
