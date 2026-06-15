/**
 * Mappning mellan URL-vänliga produkt-slugs och de produktnamn som
 * PartnerProfile internt arbetar med (samma värden som tidigare skickades
 * via ?product=…).
 *
 * Används för canonical URL-formatet:
 *   /partner/<partner-slug>/<product-slug>/
 *
 * Den gamla query-varianten (?product=Field+Service) redirectas till
 * motsvarande slug-URL för SEO-konsolidering.
 */

export type PartnerProductSlug =
  | "business-central"
  | "finance-supply-chain"
  | "sales"
  | "customer-insights"
  | "customer-service"
  | "field-service"
  | "contact-center"
  | "project-operations"
  | "commerce"
  | "human-resources";

/** Slug → kanoniskt produktnamn (samma värde som tidigare ?product=). */
export const SLUG_TO_PRODUCT_NAME: Record<PartnerProductSlug, string> = {
  "business-central": "Business Central",
  "finance-supply-chain": "Finance & SCM",
  "sales": "Sales",
  "customer-insights": "Customer Insights (Marketing)",
  "customer-service": "Customer Service",
  "field-service": "Field Service",
  "contact-center": "Contact Center",
  "project-operations": "Project Operations",
  "commerce": "Commerce",
  "human-resources": "Human Resources",
};

/** Generera en URL-slug från ett produktnamn (case-insensitive). */
export function productNameToSlug(name: string): PartnerProductSlug | null {
  if (!name) return null;
  const v = name.toLowerCase().trim();

  // Exakta/aliasade träffar först
  if (v.includes("business central")) return "business-central";
  if (v.includes("finance") || v.includes("supply") || v === "fsc" || v === "f&scm") {
    return "finance-supply-chain";
  }
  if (v.includes("customer insights") || v.includes("marketing")) return "customer-insights";
  if (v.includes("field service")) return "field-service";
  if (v.includes("contact center")) return "contact-center";
  if (v.includes("customer service")) return "customer-service";
  if (v.includes("project operations") || v.includes("projectops")) return "project-operations";
  if (v.includes("commerce")) return "commerce";
  if (v.includes("human resources") || v === "hr") return "human-resources";
  if (v === "sales" || v.includes("sales")) return "sales";

  return null;
}

/** Slå upp produkt-displaynamnet från en slug i URL. */
export function slugToProductName(slug: string | undefined | null): string | null {
  if (!slug) return null;
  const normalized = slug.toLowerCase() as PartnerProductSlug;
  return SLUG_TO_PRODUCT_NAME[normalized] ?? null;
}

/** Bygg den nya canonical-URL:en för partner+produkt. */
export function buildPartnerProductPath(
  partnerSlug: string,
  productNameOrSlug?: string | null,
): string {
  if (!productNameOrSlug) return `/partner/${partnerSlug}/`;
  const productSlug =
    SLUG_TO_PRODUCT_NAME[productNameOrSlug.toLowerCase() as PartnerProductSlug]
      ? (productNameOrSlug.toLowerCase() as PartnerProductSlug)
      : productNameToSlug(productNameOrSlug);
  return productSlug
    ? `/partner/${partnerSlug}/${productSlug}/`
    : `/partner/${partnerSlug}/`;
}

/** Lista över alla giltiga produkt-slugs (för validering/prerender). */
export const ALL_PARTNER_PRODUCT_SLUGS: PartnerProductSlug[] = Object.keys(
  SLUG_TO_PRODUCT_NAME,
) as PartnerProductSlug[];
