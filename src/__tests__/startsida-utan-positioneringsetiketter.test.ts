import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { SITE_TEXT_DEFAULTS } from "@/data/siteTextDefaults";

// Thomas 2026-10-24: startsidans sök- och delningstexter samt sajtens gemensamma
// beskrivning (som visas i förhandsvisningar och annonsförslag) ska inte använda "köparsidig".
const LABELS = /köpar(sidig|inriktad|orienterad|fokuserad|vänlig)|köparens sida|oberoende|objektiv|opartisk/i;
const root = path.resolve(__dirname, "..", "..");

describe("Startsidans beskrivningar", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");

  it("meta description i index.html saknar positioneringsetikett", () => {
    const d = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
    expect(d.length).toBeGreaterThan(50);
    expect(d).not.toMatch(LABELS);
  });

  it("og:description i index.html saknar positioneringsetikett", () => {
    const d = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] ?? "";
    expect(d.length).toBeGreaterThan(50);
    expect(d).not.toMatch(LABELS);
  });

  it.each(["org.description", "org.schema_description"])("textbankens %s saknar positioneringsetikett", (key) => {
    const entry = SITE_TEXT_DEFAULTS.find((t) => t.key === key);
    expect(entry).toBeDefined();
    expect(entry!.value).not.toMatch(LABELS);
  });
});
