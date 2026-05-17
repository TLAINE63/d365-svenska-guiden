/**
 * Canonical source of truth for the `product` value stored inside
 * `partners.industry_pitches[].product`.
 *
 * The editor (`PartnerIndustryPitchesEditor`) saves the partner's product
 * variant using the human-readable label from `productSections[].label`
 * (e.g. "Business Central", "Sales & Customer Insights").
 *
 * The public renderer (`PartnerCard`) only has the short `productKey`
 * from the route/filter context (e.g. "bc", "crm", "sales") and must
 * resolve it back to the exact same label to find the override.
 *
 * Both sides MUST agree. This file is the single place to keep them in sync.
 *
 * If you ever rename a productSection label, update `PRODUCT_KEY_TO_PITCH_LABEL`
 * here AND any product key that maps to it. The dev-time consistency check
 * (`assertPitchLabelsConsistency`) called from AdminDashboard and PartnerUpdate
 * will warn loudly if drift sneaks in.
 */

/** All productKey values that can appear in PartnerCard's `productKey` prop. */
export const PITCH_PRODUCT_KEYS = ["bc", "fsc", "sales", "service", "crm"] as const;
export type PitchProductKey = (typeof PITCH_PRODUCT_KEYS)[number];

/**
 * Maps every public `productKey` to the exact label the editor stores in
 * `industry_pitches[].product`. Note: `sales` and `crm` both map to the
 * same label because the editor only owns the `sales` section.
 */
export const PRODUCT_KEY_TO_PITCH_LABEL: Record<PitchProductKey, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain",
  sales: "Sales & Customer Insights",
  crm: "Sales & Customer Insights",
  service: "Customer Service / Field Service / Contact Center",
};

/** Unique labels used in stored pitches — useful for validation. */
export const PITCH_PRODUCT_LABELS: readonly string[] = Array.from(
  new Set(Object.values(PRODUCT_KEY_TO_PITCH_LABEL)),
);

/**
 * Resolve a productKey to the canonical pitch label, or null if no
 * mapping exists for the given key.
 */
export function getPitchLabelForKey(key: string | null | undefined): string | null {
  if (!key) return null;
  return (PRODUCT_KEY_TO_PITCH_LABEL as Record<string, string>)[key] ?? null;
}

export type PitchLabelMismatch = {
  key: string;
  expected: string;
  actual: string;
};

/**
 * Return any productSections entries whose label doesn't match the
 * canonical mapping. Empty array means everything is in sync.
 */
export function getPitchLabelMismatches(
  sections: ReadonlyArray<{ key: string; label: string }>,
): PitchLabelMismatch[] {
  const mismatches: PitchLabelMismatch[] = [];
  for (const section of sections) {
    const expected = (PRODUCT_KEY_TO_PITCH_LABEL as Record<string, string>)[section.key];
    if (!expected) continue;
    if (expected !== section.label) {
      mismatches.push({ key: section.key, expected, actual: section.label });
    }
  }
  return mismatches;
}

/**
 * Dev-time guard. Logs a console.warn (does not throw) if a mismatch is
 * found, so the app keeps running but the drift is visible in dev /
 * preview builds.
 */
export function assertPitchLabelsConsistency(
  sections: ReadonlyArray<{ key: string; label: string }>,
  source = "productSections",
): void {
  if (typeof import.meta !== "undefined" && (import.meta as any).env?.PROD) {
    return;
  }
  for (const { key, expected, actual } of getPitchLabelMismatches(sections)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[pitchProductMapping] Label mismatch for key "${key}" in ${source}: ` +
        `editor stores "${actual}" but PartnerCard expects "${expected}". ` +
        `Update src/data/pitchProductMapping.ts so the public renderer can find the override.`,
    );
  }
}
