/**
 * Kopplar CRM-matchningstestens resultat till konkreta partnerförslag.
 * Bygger ovanpå den generiska filterAndSortPartners-motorn och skiktar sedan
 * på de starkaste behovsprofilerna (t.ex. AI/Copilot, volym, omni-kanal).
 */

import type { DatabasePartner } from "@/hooks/usePartners";
import { filterAndSortPartners, type ProductKey } from "@/hooks/usePartnerFilters";
import type { ProductConfig } from "@/data/crmMatchningstestConfigs";
import type { CrmScoreResult } from "@/lib/crmMatchingScoring";
import type { PartnerProductSlug } from "@/lib/partnerProductSlug";

/** Map CRM-testets produktnyckel → intern partner-filter-nyckel. */
export const CRM_TEST_TO_PRODUCT_KEY: Record<ProductConfig["key"], ProductKey> = {
  sales: "sales",
  "customer-service": "service",
  marketing: "sales",
  "field-service": "service",
  "contact-center": "service",
};

/** Map CRM-testets produktnyckel → slug som används i /partner/<slug>/<produkt>/-URL:er. */
export const CRM_TEST_TO_PARTNER_SLUG: Record<
  ProductConfig["key"],
  PartnerProductSlug
> = {
  sales: "sales",
  "customer-service": "customer-service",
  marketing: "customer-insights",
  "field-service": "field-service",
  "contact-center": "contact-center",
};

/** Vilka profilnycklar från testet indikerar AI-tyngd. */
const AI_PROFILE_KEYS = new Set(["ai"]);

const isAiHeavy = (score: CrmScoreResult): boolean => {
  const aiProfile = score.perProfile.find((p) => AI_PROFILE_KEYS.has(p.key));
  return (
    !!aiProfile &&
    typeof aiProfile.score === "number" &&
    aiProfile.score >= 60
  );
};

const partnerHasAiCapability = (
  partner: DatabasePartner,
  productKey: ProductKey,
): boolean => {
  const pf = partner.product_filters?.[productKey];
  if (!pf) return false;
  const caps = pf.aiCapabilities ?? [];
  return caps.length > 0 || !!pf.hasBuiltAgents;
};

export interface CrmPartnerRecommendation {
  partner: DatabasePartner;
  reasons: string[];
}

/**
 * Rangordna partners givet ett testresultat.
 * - Filtrerar först på att partnern täcker produktområdet (sales/service).
 * - Skiktar därefter agreement_signed före övriga och lyfter partners med
 *   uttalad AI-leverans om användaren har hög AI-profil.
 * - Returnerar topp N med korta motiveringar.
 */
export function recommendCrmPartners(
  partners: DatabasePartner[],
  config: ProductConfig,
  score: CrmScoreResult,
  limit = 3,
): CrmPartnerRecommendation[] {
  const productKey = CRM_TEST_TO_PRODUCT_KEY[config.key];
  // Base: alla partners med produkten. Ingen bransch/geo/storlek här – den
  // filtreringen sker på jämförelse-sidan där användaren styr dropdowns.
  const base = filterAndSortPartners(partners, productKey, null, null, null, null, true);

  const aiHeavy = isAiHeavy(score);

  const scored = base.map((p) => {
    let bonus = 0;
    const reasons: string[] = [];

    if (p.agreement_signed) {
      bonus += 2;
      reasons.push("Avtalspartner på d365.se");
    }

    if (aiHeavy && partnerHasAiCapability(p, productKey)) {
      bonus += 3;
      reasons.push("Har levererat AI- eller Copilot-projekt");
    }

    const pf = p.product_filters?.[productKey];
    if (pf?.customerExamples && pf.customerExamples.length > 0) {
      bonus += 1;
      reasons.push(`${pf.customerExamples.length} refererade kunder`);
    }

    if (pf?.whyChoose && pf.whyChoose.trim().length > 0) {
      bonus += 1;
    }

    return { partner: p, bonus, reasons };
  });

  scored.sort((a, b) => b.bonus - a.bonus);

  return scored.slice(0, limit).map(({ partner, reasons }) => ({
    partner,
    reasons: reasons.slice(0, 2),
  }));
}
