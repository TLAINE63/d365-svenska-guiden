/**
 * Bygger URL till /jamfor-partners med upp till 3 partners förifyllda.
 * Kompatibel med de befintliga query-parametrarna a/b/c som
 * ComparePartners redan läser.
 */
export const buildCompareUrl = (slugs: (string | null | undefined)[]): string => {
  const clean = slugs.filter((s): s is string => !!s && s.length > 0).slice(0, 3);
  if (clean.length === 0) return "/jamfor-partners";
  const params = new URLSearchParams();
  const keys = ["a", "b", "c"] as const;
  clean.forEach((slug, i) => params.set(keys[i], slug));
  return `/jamfor-partners?${params.toString()}`;
};
