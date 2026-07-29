## Mål
Byta amerikanska em-streck (—) mot svenskt tankstreck (– med mellanslag runt) i all **publik svensk copy** på sajten. Em-strecket är inte svensk typografisk standard och är ett välkänt AI-tell, särskilt i löpande meningar som "Välj område — så får ni...". Svensk konvention är en-streck (–) med mellanslag: "Välj område – så får ni...".

## Omfattning

**Inkluderas** (publik copy som besökare/leads ser):
- Sidor i `src/pages/` (t.ex. `Index.tsx`, `Branschlosningar.tsx`, `Priser.tsx`, produktsidor, artikelsidor)
- Presentationskomponenter i `src/components/` som renderas publikt (hero, kort, banners, footer, nyhetssektion, jämförelse-CTA, etc.)
- Artikel- och datafiler med publik text: `src/data/blogArticles.tsx` (~400 träffar), `src/data/buyerManuals.ts` (~101), `src/data/productStandardSections.ts` (~36), `src/data/salesArticles.tsx`, `bcArticles.tsx`, `agentsArticles.tsx`, `copilotArticles.tsx`, `csArticles.tsx`, `fsArticles.tsx`, `fscArticles.tsx`, `ccArticles.tsx`, `ciArticles.tsx`, `bcTillaggArticles.tsx`, `bcIsvSolutions.ts`, `productQA.ts`, `beslutsmognadQuestions.ts`, `bcMatchningstest.ts`, m.fl.
- Publika e-postmallar och PDF-strängar (`supabase/functions/send-analysis-email/`, `send-partner-monthly-report/`, `submit-lead/`, `src/utils/generate*Pdf.ts` – men bara textinnehåll, inte layoutkonstanter)

**Undantas** (enligt ditt val "endast publik svensk copy"):
- Admin-tabellernas platshållare `{value || "—"}` i `src/components/Admin*.tsx` (t.ex. `AdminAllVisitorsTab`, `AdminGscTab`, `AdminSalesKpiTab`, `AdminAgreementTab`, `AdminCompetitorInsightsTab`, `AdminProductPricesTab`, `AdminUnprofiledPartnersTab`, `AdminPartnerNewsTab`, `AdminEventsTab`, `AdminSemrush*`, `AdminSeoRankingsTab`, `AdminKeywordTrendsTab`, `AdminPartnerAgreementTab`) – lämnas orörda
- Rubriker på admin-flikar (t.ex. "Konkurrentinsikter — vad gör de...")
- JS/TS-kommentarer (`// SECTION 1 — HERO`, `/* ... */`)
- Tekniska strängar, loggar, testfixturer (`src/pages/__tests__/`, `src/lib/__tests__/`)
- Engelska strängar (ovanliga men förekommer i vissa util-filer)

## Regel för ersättning
- ` — ` (mellanslag-em-mellanslag) → ` – ` (mellanslag-en-mellanslag)
- `—` intill ord utan mellanslag (t.ex. `ord—ord`) → `ord – ord`
- Undantag: värdet är exakt `"—"` som platshållare → behålls (men förekommer bara i admin, som redan är exkluderat)

## Genomförande
1. **Kartlägg publika filer.** Bygg en explicit filjobblista utifrån de kategorier ovan (allt i `src/pages/` + `src/data/*Articles*` + publika komponenter + publika edge-functions/e-postmallar). Exkludera `src/components/Admin*.tsx` och `__tests__/`.
2. **Kör riktade `sed`-ersättningar per fil** (inte globalt, för att inte träffa admin/tester).
3. **Manuell granskning** av ~10 slumpade träffar via `rg -n ' – '` efteråt för att bekräfta att kontexten läser rätt.
4. **Bygg + snabb visuell verifiering** av hero, en artikelsida och en produktsida via Playwright-screenshot för att säkerställa att inget textflöde ser trasigt ut.
5. **Ingen ändring av CSS, ingen logikändring.** Rent copy-jobb.

## Teknisk not
- Både `—` (U+2014) och `–` (U+2013) är rena Unicode-tecken i källkod; ingen escape behövs och byggkedjan hanterar dem oförändrat.
- SEO: inga URL-, title- eller strukturerade data-fält ändras semantiskt; endast tecknet i description/title-strängar (om det förekommer där) byts.
- Diff-omfång: uppskattningsvis ~700–900 ändrade rader fördelat över ~40–60 filer. Inga funktionella tester påverkas.

## Utanför scope
- Admin-UI:s platshållare
- Kodkommentarer
- Byte av andra typografiska tecken (t.ex. rak citation → typografisk), skiljetecken, mellanslag före `%`, o.s.v. – kan tas som separat städ senare om du vill.