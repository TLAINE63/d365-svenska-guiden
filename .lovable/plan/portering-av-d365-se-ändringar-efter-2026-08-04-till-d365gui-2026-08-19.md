# Portering av d365.se-ändringar (efter 2026-08-04) till D365Guide

D365Guide är en nära kopia av d365.se men med flerspråkslager (sv/no/dk/fi/en) via `LocaleContext`, `HreflangTags` och `i18n/*.json`. Allt fram till 2026-08-04 är gemensamt. Det som saknas där är i praktiken det som byggts här sedan dess.

Viktigt: arbetet kan inte köras härifrån — D365Guide måste öppnas som aktivt projekt. Den här planen är arbetsordningen att följa där, och koden hämtas från d365.se som referens.

## Bekräftad skillnad (läst i snapshot av D365Guide)

Saknas i D365Guide:
- 9 edge functions: `autofill-partner-profile`, `generate-partner-insights`, `generate-partner-delivery-summary`, `enrich-lead`, `send-lead-followup`, `partner-performance-report`, `isv-profile`, `manage-isv-invitations`, `manage-isv-solutions`
- 45 källfiler, bl.a. `lib/extendedCompetencies.ts`, `lib/basicPartnerMatch.ts`, `lib/segmentRange.ts`, `lib/leadContext.ts`, `lib/partnerResultCard.ts`, `partner/ExtendedCompetenciesSection.tsx`, `ExtendedCompetencyInputSection.tsx`, `DeliveryProfileEditor.tsx`, `PartnerAiInsights.tsx`, `SearchResultSummary.tsx`, `ProductDeliveryProfile.tsx`, `ProductBasicPartnersSection.tsx`, `VerifiedPartnerBadge.tsx`, `BasicPartnerBadge.tsx`, `VerifiedOnlyToggle.tsx`, `BasicPartnerInquiryDialog.tsx`, `HomeVerifiedPartnersGrid.tsx`, `QuickLeadForm.tsx`, `GatedPdfDownload.tsx`, `ExitIntentOffer.tsx`, `PageOfferBanner.tsx`, `PartnernyttEventsSection.tsx`, `ProductIsvSection.tsx`, `ProductDeepDiveLink.tsx`, `CostContactForm.tsx`, `CostProjectExamples.tsx`, ISV-admin-flikarna och `AdminPartnerPerformanceTab.tsx`
- Sidor: `/partnerprogram`, `/kunskapcenter/dynamics-365-tillagg` (ISV-katalog), `IsvProfile`, `TackNedladdning`

## Arbetsordning i D365Guide

### Steg 1 – Databas
Migrationer för det som tillkommit: kolumnerna `extended_competencies`, `extended_competency_evidence`, `extended_competency_input`, `delivery_profile`, `product_profiles`, `ai_summary_full`, `best_fit_for`, `ai_tags`, `extended_summary`, `profile_level`, `hide_basic_card`, `observed_*` på `partners` (och motsvarande på `partner_submissions`), samt tabellerna `isv_solutions`, `isv_solution_overrides`, `isv_invitations`, `isv_submissions`, `partner_report_drafts`, `partner_performance_reports`, `partner_filter_exposures`, `contact_attempt_blocked`. Vyn `partners_public` uppdateras med de nya publika fälten. GRANT + RLS enligt d365.se:s migrationer.

### Steg 2 – Backend (edge functions)
Kopieras i stort sett rakt av (Deno-kod är identisk i struktur): först `generate-partner-insights`, `generate-partner-delivery-summary`, `autofill-partner-profile` (AI-fälten), sedan ISV-funktionerna, sedan lead-/rapportfunktionerna. Deploya och rökttesta varje funktion direkt efter deploy.

### Steg 3 – Kompetensmodellen (kärnan)
`lib/extendedCompetencies.ts` + `ExtendedCompetenciesSection` på partnerprofilen, `ExtendedCompetencyInputSection` i profileringslänken (ersätter gamla AI-sektionen), nivåväljare och underlagsvy i admin, filter i partnerguiden samt rankingjustering där Dynamics-kompetens förblir primär. JSON-LD `knowsAbout` följer med.

### Steg 4 – Partnerpresentation
Verifierad vs Basic: badges, `basicPartnerMatch`, verifierat-filter, neutrala basickort, `BasicPartnerInquiryDialog` (kontakt via plattformen), nya sökresultatkort med d365.se-bedömning, `SearchResultSummary`, leveransprofil per produktområde, `segmentRange` för anställda/omsättning.

### Steg 5 – ISV-katalog
Datamodell, publik katalogsida, produktsidosektion, ISV-profileringslänk och adminflikar med sortering.

### Steg 6 – Leadsmotorn
QuickLeadForm, PDF-grind, exit intent, `useCtaTracking`, `leadContext`, `enrich-lead`, `send-lead-followup`, kontaktformulär på kostnadssidan, partnerrapporter (anonymiserad besöksstatistik).

### Steg 7 – Innehåll, SEO och sidor
`/partnerprogram` med benchmarks, kostnadsintervall (`costBreakdown`), Partnernytt med events i typfiltret, SEO-uppdateringar i `SEOHead`/`StructuredData`, sitemap-generering och prerender-rutter.

### Steg 8 – Lokalisering (/no m.fl.)
Varje ny sträng läggs i `i18n/*.json` i stället för hårdkodad svenska, nya rutter registreras i lokalsystemet (`useLocalizedPath`, `LocaleSlugRedirect`), och norska översättningar tas fram för alla nya sidor/sektioner. Nya datafiler får `.no`-varianter enligt befintligt mönster (`costBreakdown.no.ts`, `industryPages.no.json`). AI-genererade partnertexter genereras separat på norska för norska profiler. Hreflang och sitemaps uppdateras för de nya rutterna.

## Tekniska noteringar
- Båda projekten kör React Router och samma stack, så komponentkod är i princip direkt överförbar — men allt som renderar text måste gå via i18n-lagret i D365Guide.
- Edge functions och SQL är direkt överförbara; hemligheter (`LOVABLE_API_KEY`, SMTP m.m.) måste finnas i D365Guides egen backend.
- Partnerdata är separat per projekt: `partnerData.json`/`partnerRoutes.json` genereras om i D365Guide efter migrationerna.
- Ordningen är viktig: DB före edge functions före UI, annars går inget att testa.

## Så gör du praktiskt
Öppna D365Guide och be om steg 1. Jag kan då läsa d365.se som referensprojekt och implementera steg för steg där.
