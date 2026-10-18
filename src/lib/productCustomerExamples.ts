import type { ProductFilterInput } from "@/hooks/usePartners";

/** Only the selected product's registered examples; never infer customers from URLs. */
export function productCustomerExamples(filter?: ProductFilterInput | null, limit = 3) {
  const seen = new Set<string>();
  const names = filter?.customerExamples || [];
  const links = filter?.customerCaseLinks || [];
  // Unequal arrays are not reliable index mappings (legacy profiles can contain these).
  const aligned = names.length === links.length;
  return names.flatMap((raw, index) => {
    const name = raw.trim();
    const key = name.toLocaleLowerCase("sv");
    if (!name || /vi berättar gärna|hör av er|på förfrågan|kontakta oss/i.test(name) || seen.has(key)) return [];
    seen.add(key);
    let url: string | undefined;
    if (aligned && links[index]) {
      try {
        const parsed = new URL(links[index]);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") url = parsed.href;
      } catch { /* Invalid or relative links are not case evidence. */ }
    }
    return [{ name, url }];
  }).slice(0, Math.max(0, limit));
}