/**
 * Steg 3 (2026-11-04): besökaren kan få sitt verktygsresultat mejlat till sig,
 * tillsammans med tre frågor att ställa till leverantörer. Thomas får bara veta
 * om det när besökaren själv kryssat i att han får höra av sig.
 */
export type ResultSummaryTool = "kostnad" | "behovsguide";

export const RESULT_SUMMARY_MAX_LINES = 15;
export const RESULT_SUMMARY_MAX_LINE_LENGTH = 200;

/** Tar bort tomma rader, kortar långa rader och begränsar antalet. */
export function cleanSummaryLines(lines: unknown): string[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .filter((l): l is string => typeof l === "string")
    .map((l) => l.replace(/\s+/g, " ").trim().slice(0, RESULT_SUMMARY_MAX_LINE_LENGTH))
    .filter(Boolean)
    .slice(0, RESULT_SUMMARY_MAX_LINES);
}
