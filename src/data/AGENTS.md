# data

- Calculator inputs share calculatorDefaults.ts and CalculatorIndustryPicker (standardIndustries); exact industry names feed existing broad ROI models via explicit mappings and survive requirement-spec links, so no new industry estimates are invented.
- ROI calculators share RoiCostControls and roiProjectCosts; a nullable total-cost override preserves automatic estimates until edited, and the selected annual support percentage applies only from year two, so results and PDF assumptions agree.

- Public partner counts (verified, basic, total) come only from partnerCounts.ts (build-time partner data); keeps prerendered HTML, hydrated pages and the market report identical.
- Business Central project-cost figures mirror businesscentral.se's day-rate model and industry spans via bcProjectEstimates.ts, so both sites show the same estimates.
- CRM pages lead with the buyer problem (BuyerFitSection from crmBuyerFit.ts, generic guides in crmCategoryGuides.ts) before Microsoft product detail; CRM market figures are computed at build by scripts/generate-crm-market-data.mjs from published partners only, so numbers stay sourced and SSG-safe.
- AI example library (/ai/exempel/) is data-driven from src/data/aiExamples.ts with no React deps; only examples with status VERIFIED, PUBLISHED or UPDATE_NEEDED that also have a Microsoft source and verification date (vx() creates VERIFIED ones) are exported as AI_EXAMPLES and rendered/prerendered, other statuses stay in ALL_AI_EXAMPLES, so unverified capabilities are never shown as fact and BC entries can be reused by businesscentral.se.
