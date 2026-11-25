// Reservvärden (sidvisningar 90 dagar, 2026-11-25) för förgenererad HTML; sidan hämtar aktuella andelar via public_market_interest.
export type InterestRow = { label: string; count: number };
export const MARKET_INTEREST: { products: InterestRow[]; situations: InterestRow[]; tools: InterestRow[] } = {
  products: [
    { label: "Tilläggslösningar (ISV)", count: 393 },
    { label: "Business Central", count: 332 },
    { label: "CRM", count: 309 },
    { label: "Copilot och AI", count: 200 },
    { label: "Finance & Supply Chain", count: 110 },
  ],
  situations: [
    { label: "Partnerval", count: 1095 },
    { label: "Utveckling", count: 419 },
    { label: "Nytt system", count: 348 },
    { label: "AI", count: 202 },
  ],
  tools: [
    { label: "Kom igång-guiden", count: 158 },
    { label: "Partnersök", count: 141 },
    { label: "Kostnads- och ROI-kalkyler", count: 107 },
    { label: "Jämförelser", count: 105 },
    { label: "Guider", count: 50 },
    { label: "Behovsanalyser", count: 29 },
  ],
};
