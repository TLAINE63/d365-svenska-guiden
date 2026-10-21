# src/lib rules

- Min D365-plan reuses buyerProfile and buyerContext, with d365Plan storing only local priorities and investigation area; keeps anonymous persistence without server data.
- Optional buyer accounts mirror the localStorage keys in accountSync.ts to buyer_saved_state (own-row RLS); server wins on login, so tools stay account-unaware.
- Requirement specs (ERP/Sales/Service/Marketing) restore and save industry, size and areas via useKravProfileSync in kravProfile.ts; URL/test prefill wins, profile is the fallback, so context survives any entry path.
- Systemval hands off to product pages and calculators only via a short local summary (systemvalHandoff.ts: track ids, clarity, complexity, integration count) rendered by SystemvalHandoffNote after mount; calculators receive only URL params they already read, so no raw answers leave the guide.
- Calculators hand off to the product-matched requirement spec only via calcToKrav.ts URL params (bransch/storlek/omraden/produkt + kalla=kalkyl) that the specs already read; ambiguous calculator industries and user counts for ERP (asks employees) are never mapped, so prefill is never guessed.
- Existing-customer diagnosis (existingDiagnosis.ts) is deterministic with 7 needs, asks a follow-up only when it changes the next step, never auto-opens contact, and passes only a known product to partner search via ?apps=, so nothing is guessed.
- Second opinion (/second-opinion/) reuses PlanContactDialog advisory mode via a ContactTopic; diagnosis passes only a known need via ?behov= (unknown values ignored), so no parallel lead flow exists.
- Basic-profile SEO title/description come from partnerSeo.ts, shared by PartnerBasicProfile and the prerender fallback, so crawlers and visitors see identical metadata within 60/155 chars.
