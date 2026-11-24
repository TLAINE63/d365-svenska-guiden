import { ORDER_PRICES, FINDERS_FEE_RATE, FINDERS_FEE_RATE_GRUND } from "@/lib/partnerOrder";

/** Effektiv månadskostnad vid årsbetalning, avrundad till hela kronor. */
export function effectiveMonthly(areas: 1 | 2 | 3): number {
  return Math.round(ORDER_PRICES.year[areas] / 12);
}

/** Affärsvärde där den lägre ersättningen (5 % mot 2,5 %) täcker Premiums årsavgift. */
export function premiumBreakEvenDealValue(areas: 1 | 2 | 3 = 1): number {
  return Math.round(ORDER_PRICES.year[areas] / (FINDERS_FEE_RATE_GRUND - FINDERS_FEE_RATE));
}
