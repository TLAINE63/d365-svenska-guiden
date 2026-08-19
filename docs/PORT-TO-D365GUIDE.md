# Porteringsspec: d365.se → d365guide.com (global + /no)

Syfte: bygga över de funktioner som finns på d365.se men saknas på d365guide.com,
med krav på att varje funktion fungerar i **två lokaler**:

- `d365guide.com/` – global (engelska, EUR/lokala valutor, ingen svensk myndighetstext)
- `d365guide.com/no/` – norsk (bokmål, NOK, norska bransch-/regionnamn)

Allt nedan är formulerat som: *vad som ska byggas* + *referenskod i d365.se* + *vad som
måste lokaliseras*.

---

## 0. Lokaliseringsgrund (gör detta först)

Ingen av funktionerna nedan bör porteras med hårdkodad svenska. Basen:

1. **Route-prefix**: `/` = global (en), `/no/` = norska. Alla interna länkar går via en
   `localePath(path)`-helper som prefixar `/no` när aktiv locale är `no`.
2. **Strängkatalog**: `src/i18n/en.ts` och `src/i18n/no.ts` med samma nycklar.
   Regel: komponenter innehåller *inga* litterala UI-strängar.
3. **Datafält per locale**: partner-/ISV-texter som idag är en kolumn (`ai_summary_short`,
   `delivery_profile` m.m.) behöver antingen suffix-kolumner (`_en`, `_no`) eller en
   JSONB `{ en: "...", no: "..." }`. Rekommenderat: JSONB, samma mönster som
   `product_filters` redan använder i d365.se.
4. **SEO**: hreflang `en` / `no` / `x-default` per sida, egen `<title>`/description per
   locale, separata sitemap-sektioner, canonical som självrefererar rätt locale-URL.
   Referens: `src/components/SEOHead.tsx`, `src/lib/seoTitle.ts` (60-teckenskapning),
   `vite-prerender-plugin.ts`.
5. **Prerender**: varje route prerendras två gånger (en + no). Referens:
   `vite-prerender-plugin.ts` + `partnerRoutes.json`-generering.
6. **Valuta/enheter**: alla priser går genom en formatterare (SEK → EUR/NOK), inga
   hårdkodade "kr". Referens: `src/lib/productPriceFormat.ts`, `src/data/costBreakdown.ts`.

---

## 1. Verifierad vs Basic-modellen

**Vad**: två partnernivåer med tydlig visuell och funktionell skillnad. Verifierad =
full profil, kontaktflöde till partnern. Basic = neutralt kort, kontakt går till
redaktionen istället för partnern.

**Referenskod (d365.se)**
- `src/components/VerifiedPartnerBadge.tsx`, `src/components/BasicPartnerBadge.tsx`
- `src/components/PartnerBasicCard.tsx`, `src/components/BasicPartnerInquiryDialog.tsx`
- `src/lib/partnerVisibility.ts`, `src/lib/basicPartnerMatch.ts`
- `src/components/VerifiedOnlyToggle.tsx` (filter)
- DB: `partners.is_featured` (verifierad), vy `partners_basic_public`
- Edge: `track-contact-blocked`

**Lokalisering**: badge-text ("Verifierad" → "Verified"/"Verifisert"), dialogtext,
mottagaradress för Basic-förfrågningar per marknad (global inbox vs norsk inbox).

---

## 2. Utökade kompetenser: Power Platform / Copilot & AI / Copilot Studio & agenter

**Vad**: trepelarmodell med nivåskala (Ej verifierad → Ledande kompetens), visad som
sektion på partnerprofil, chips på partnerkort, samt exponerad som JSON-LD.

**Referenskod**
- `src/lib/extendedCompetencies.ts` (nivåer + etiketter)
- `src/components/ExtendedCompetenciesSection.tsx` (profil + JSON-LD)
- `ExtendedCompetencyInputSection` i `src/pages/PartnerUpdate.tsx` (partnerns underlag)
- Nivåsättning i `src/pages/AdminDashboard.tsx`
- Matchning: `supabase/functions/match-partners`
- DB: `partners.extended_competencies` (JSONB)

**Lokalisering**: nivåetiketter och hjälptexter i strängkatalogen; underlagstexten som
partnern skriver lagras per locale (partnern skriver på ett språk, AI översätter/
sammanfattar till det andra — se punkt 3).

---

## 3. AI-lagret: insikter, leveransprofil, autofill

**Vad**:
- d365.se:s analys per partner: kort + full sammanfattning, "Passar bäst för",
  "Mindre lämplig för", AI-taggar.
- Leveransprofil per produktområde (typiska kunder, projekt, leverans, förvaltning,
  vidareutveckling, AI) → AI-genererad neutral sammanfattning.
- AI-autofill av tomma fält i profileringslänken.

**Referenskod**
- `src/components/PartnerAiInsights.tsx`, `src/lib/aiProfile.ts`
- `DeliveryProfileEditor` + `supabase/functions/generate-partner-delivery-summary`
- `supabase/functions/generate-partner-insights`
- `supabase/functions/autofill-partner-profile`
- Redigering + "Regenerera" i `src/pages/AdminDashboard.tsx` och `PartnerUpdate.tsx`

**Lokalisering (viktigast här)**: prompten måste ta `locale` som parameter och generera
engelska respektive norska texter. Lagra resultatet per locale. Kör generering två gånger
per partner (en/no) — inte maskinöversättning i frontend. Tonläge: neutralt, aldrig
"oberoende".

---

## 4. Lead-motorn

**Vad**: PDF-grind (namn/företag/e-post innan nedladdning), exit-intent-erbjudande,
snabb leadform, blockering av gratis e-postdomäner, lead-attribution mot nyheter/events.

**Referenskod**
- `src/components/GatedPdfDownload.tsx`, `QuickLeadForm.tsx`, `ExitIntentOffer.tsx`,
  `EbookBanner.tsx`, `LeadCTA.tsx`
- `src/lib/validateBusinessEmail.ts`, `src/lib/leadContext.ts`, `funnelTracking.ts`
- Edge: `submit-lead`, `enrich-lead`, `send-lead-followup`, `track-funnel-event`

**Lokalisering**: formulärtexter, GDPR-/personvern-text (norsk variant), e-postmallar
per locale, avsändaradress och kontaktperson per marknad, samt landsspecifika
fritt-e-postdomäner i blockeringslistan.

---

## 5. Partnernytt (nyhets- och eventflöde)

**Vad**: publicerade partnerinlägg + events i ett gemensamt flöde med typ- och
källfilter, artikelsida, visning på hemsida, produktsidor och partnerprofil.

**Referenskod**
- `src/pages/Partnernytt.tsx`, `src/pages/PartnerNewsDetail.tsx`
- `src/components/HomePartnerNewsSection.tsx`, `ProductPartnerNewsSection`,
  `PartnernyttEventsSection.tsx`
- Admin: `AdminPartnerNewsTab.tsx`, `AdminPartnerFeedsTab.tsx`,
  `AdminPartnerNewsPerformanceTab.tsx`
- Edge: `ingest-partner-feeds`, `manage-partner-news`, `manage-partner-feeds`,
  `partner-news-performance`
- DB: `partner_news`, `partner_news_feeds`

**Lokalisering**: nyheter är källspråkliga (partnerns eget språk). Modell: visa
originaltexten men lokalisera *ramverket* (rubriker, typetiketter, datumformat) och
generera en AI-sammanfattning på sidans locale. Filtrera flödet per marknad
(global vs Norge) via ett `market`-fält på partnern.

---

## 6. Sökresultatkort och filter

**Vad**: filter ovanför korten med sammanfattningsrad, kort med bedömningsbox
(bedömning + erfarenhet), storleks-/omsättningsfilter globalt, verifierad-filter.

**Referenskod**
- `src/components/SearchResultSummary.tsx`, `PartnerCard.tsx`, `FilterButtons.tsx`,
  `FilteredListActions.tsx`
- `src/lib/partnerResultCard.ts`, `partnerCardSummary.ts`, `segmentRange.ts`,
  `industryFilters.ts`

**Lokalisering**: branschtaxonomin måste mappas (svenska 20 branscher → engelsk och
norsk namngivning, samma nycklar). Regioner: svenska regioner ersätts av norska fylken/
regioner respektive land för global. Storleks-/omsättningsintervall i lokal valuta.

---

## 7. Partnerrapporter och statistik

**Vad**: månadsrapport till partner med **anonymiserad** besöksdata (bransch + storlek,
aldrig företagsnamn), klick-/visningsstatistik, exkludering av intern trafik.

**Referenskod**
- Edge: `manage-partner-reports`, `send-partner-monthly-report`,
  `partner-performance-report`, `partner-public-stats`
- `src/hooks/useVisitorTracking.ts`, edge `track-visitor`, `track-partner-view`,
  `track-partner-click`
- Admin: `AdminPartnerReportsTab.tsx`, `AdminVisitorStatsTab.tsx`

**Lokalisering**: rapport-PDF och e-post per locale, tidszon/datumformat, samt
juridisk text (GDPR i EU, personopplysningsloven-formulering för NO).

---

## 8. Kalkylatorer och kostnadsdata

**Vad**: implementationskalkylator med PDF-export och sparade utkast, kostnadssidan med
intervall per produkt och storlek, kontaktformulär.

**Referenskod**
- `src/pages/ImplementationCalculator.tsx`, `CalculatorDrafts.tsx`, `CalculatorCompare.tsx`
- `src/data/costBreakdown.ts`, `src/lib/implementationEstimate.ts`
- `src/utils/pdfLayout.ts` (brandad PDF), `src/components/CostContactForm.tsx`

**Lokalisering**: prisintervall per marknad (svenska tkr-intervall gäller inte rakt av i
NO/global), valutaformat, licenspriser hämtade per marknad, PDF-mall med rätt språk och
juridisk disclaimer.

---

## 9. Partnerprogram-sidan

**Vad**: konverteringsdriven landningssida med benchmark, "Se er profil idag"-analys,
social proof, konkreta åtaganden, ansökan om profileringslänk.

**Referenskod**
- `src/pages/Partnerprogram.tsx`, `src/components/PartnerProgramBenchmark.tsx`,
  `PartnerProfileCheck.tsx`, `ContactFormDialog.tsx`

**Lokalisering**: benchmark-exempelpartner måste väljas per marknad (svenska
referenspartners är irrelevanta globalt/i Norge), prissättning per marknad, deadlines
och mottagaradress per marknad.

---

## 10. ISV-katalog

**Vad**: ISV-lösningar med admin-CRUD, sortering på lösning/leverantör, sektion per
produktsida, endast av ISV:n valda partners visas.

**Referenskod**
- `src/pages/D365TillaggKatalog.tsx`, `IsvProfile.tsx`, `IsvCompare.tsx`
- `src/components/ProductIsvSection.tsx`, `IsvPartnerPicker.tsx`, `AdminIsvCatalogTab.tsx`
- Edge: `manage-isv-solutions`, `isv-profile`, `manage-isv-invitations`

**Lokalisering**: lösningsbeskrivningar per locale (JSONB), leverantörsnamn oförändrade,
kategorinamn i strägkatalogen.

---

## 11. SEO-/SSG-infrastruktur

**Vad**: prerender av alla publika rutter, korrekt 404 (ingen soft-404), titel-kapning,
sitemaps, hreflang.

**Referenskod**
- `vite-prerender-plugin.ts`, `src/entry-server.tsx`, `scripts/check-prerender-seo.mjs`
- `src/lib/seoTitle.ts`, `metaTitle.ts`, `metaDescription.ts`, `publicUrl.ts`
- Edge: `refresh-sitemaps`

**Lokalisering**: dubbla rutter i prerender-listan, `sitemap-en.xml` + `sitemap-no.xml`
under ett sitemapindex, hreflang-par på varje sida, `/no/`-varianter i robots/sitemap.
Ta höjd för publiceringstaket (max 50 000 filer): antal rutter × 2 locales.

---

## Föreslagen ordning

1. Lokaliseringsgrunden (0) — annars byggs teknisk skuld in i varje punkt.
2. Verifierad/Basic (1) + sökresultatkort/filter (6) — störst effekt på upplevelsen.
3. Utökade kompetenser (2) + AI-lagret (3) — differentieringen.
4. Lead-motorn (4) + partnerprogram (9) — intäkten.
5. Partnernytt (5), rapporter (7), kalkylatorer (8), ISV (10).
6. SEO/SSG (11) löpande, men verifiera efter varje etapp.

## Datamodell-checklista per porterad tabell

- [ ] `market` eller `locales`-fält så innehåll kan filtreras global vs NO
- [ ] Textkolumner → JSONB `{ en, no }` där innehållet är redaktionellt
- [ ] RLS + GRANT för `anon`/`authenticated`/`service_role` i samma migration
- [ ] Interna fält (fakturering, admin-anteckningar) aldrig i publika vyer/selects
