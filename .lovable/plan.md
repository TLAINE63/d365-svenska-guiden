# Harmoniera CRM-sidorna med ERP-sidornas nya struktur

## Nuläge (verifierat i koden)

**Business Central (1023 rader)** och **F&SCM (810 rader)** har efter senaste ändringarna:
- Hero med 3–4 CTA-knappar (BC: Jämför partners, Kravspecifikation, TCO/ROI-kalkyl, Filtrera fram partner)
- ShortAnswer + EditorialAssessment direkt under heron
- Snabbfakta-tabell, jämförelsetabell mot alternativ, licenstabell (BC)
- StandardProductSections, BuyerManual, CostBreakdown, ComparisonQuickLinks, ProductRoiCta
- Partnerfiltersektion med WhyTheseResults + UnprofiledPartnersList
- ProductIsvSection, RelatedPages, PageOfferBanner, ContextualCta
- EditorialSource + SourcesAndMethod längst ner, BasicProfilesDirectory

**CRM.tsx (621 rader)** saknar:
- Hero har bara 2 CTA:er (Jämför CRM-partners, Kravspecifikation) — ingen ROI-kalkyl, ingen filterknapp
- Ingen snabbfakta-tabell, ingen jämförelsetabell, ingen licenstabell
- Inget StandardProductSections, BuyerManual, CostBreakdown, ComparisonQuickLinks, ProductRoiCta
- Ingen ProductIsvSection
- FAQ använder emojis (❓) i rubrikerna — ERP-sidorna har frågebaserade rubriker utan emojis

**D365Sales.tsx (352 rader)** saknar dessutom:
- EditorialAssessment, SourcesAndMethod, UnprofiledPartnersList
- Ingen egen partnerfiltersektion med WhyTheseResults
- EditorialSource ligger efter BasicProfilesDirectory (inkonsekvent placering)

## Förslag

### 1. CRM.tsx (/crm)
- Hero: lägg till tertiary "Gör en estimerad TCO/ROI-kalkyl" (→ /d365sales/roi-kalkylator/ eller CRM-motsvarighet) och quaternary "Filtrera fram en passande CRM-partner" (→ #partners), samma mönster som BC
- Ny snabbfakta-sektion "Vad avgör valet av Dynamics 365 CRM?" med tabell (applikationer, passar, licenspriser från product_prices, implementeringskostnad, införandetid, AI/Copilot, vanliga alternativ)
- Jämförelsetabell mot vanliga alternativ (Salesforce, HubSpot, Zendesk, Lime, SuperOffice) med länkar till befintliga /jamfor/-sidor
- Licenstabell (Sales Professional/Enterprise/Premium, Customer Service, Field Service, Customer Insights) med resolvePriceTokens
- Ta bort ❓-emojis ur FAQ-rubrikerna
- Lägg till BuyerManual, CostBreakdown, ComparisonQuickLinks, ProductRoiCta, ProductIsvSection där produktdata finns
- Behåll FitModel och EditorialAssessment som de är

### 2. D365Sales.tsx (/d365sales)
- Lägg till EditorialAssessment (nyckel "sales" — nytt manuellt skrivet utkast, ej autogenererat)
- Lägg till SourcesAndMethod längst ner
- Flytta EditorialSource till konsekvent placering (ovanför SourcesAndMethod, före BasicProfilesDirectory)
- Lägg till UnprofiledPartnersList om partnersektion finns

### 3. F&SCM — liten justering
- Lägg till quaternary-knapp "Filtrera fram en passande F&SCM-partner" (→ #partners) så heron matchar BC:s fyra knappar; ändra primary "Jämför F&SCM-partners" till länk mot /finance-supply-chain-partners-sverige/ (samma mönster som BC)

### 4. Kontroll
- Inga hårdkodade priser — resolvePriceTokens överallt
- "Dynamics 365" aldrig radbrutet, inga em dash, datum YYYY-MM-DD
- Verifiera med tsgo + Playwright på dator och mobil

## Tekniska detaljer
- Filer: `src/pages/CRM.tsx`, `src/pages/D365Sales.tsx`, `src/pages/FinanceSupplyChain.tsx`, ev. `src/data/editorialAssessments.ts` (ny "sales"-nyckel), `src/data/productStandardSections.ts`
- CRM-sidan täcker flera applikationer — snabbfakta/licenstabell hålls på svitnivå, detaljer per app ligger kvar på D365Sales/D365CustomerService/D365FieldService
- Inget publiceras förrän du publicerar
