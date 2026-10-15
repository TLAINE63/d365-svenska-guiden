# data

- Public partner counts (verified, basic, total) come only from partnerCounts.ts (build-time partner data); keeps prerendered HTML, hydrated pages and the market report identical.
- Business Central project-cost figures mirror businesscentral.se's day-rate model and industry spans via bcProjectEstimates.ts, so both sites show the same estimates.
- CRM pages lead with the buyer problem (BuyerFitSection from crmBuyerFit.ts, generic guides in crmCategoryGuides.ts) before Microsoft product detail; CRM market figures are computed at build by scripts/generate-crm-market-data.mjs from published partners only, so numbers stay sourced and SSG-safe.
- AI example library (/ai/exempel/) is data-driven from src/data/aiExamples.ts with no React deps; entries stay verified=false until source+date are checked, so unverified Copilot capabilities are never shown as fact and BC entries can be reused by businesscentral.se.
