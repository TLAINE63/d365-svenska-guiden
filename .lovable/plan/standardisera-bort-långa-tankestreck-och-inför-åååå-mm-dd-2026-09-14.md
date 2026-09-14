# Standardisera bort långa tankestreck och inför ÅÅÅÅ-MM-DD

## Innehåll
1. Ersätt alla `—` (em dash/långt tankestreck) i publicerat innehåll och UI-text med kontextanpassad ersättare: komma, punkt, kort tankstreck eller parentes. Fokus på artiklar, partnerdata, guider och sidkomponenter.
2. Skapa eller återanvänd en central datumhjälpare som alltid returnerar `ÅÅÅÅ-MM-DD`, och byt ut publika datumvisningar i artiklar, Kunskapscenter, event, partnernyheter, videor, deep dives och PDF-export.
3. Uppdatera projektminnet med två regler: förbud mot em dash och krav på `ÅÅÅÅ-MM-DD`.

## Platser att åtgärda (urval)
- Innehåll: `src/data/blogArticles.tsx`, `src/data/partnerData.json`, guideartiklar, FAQ m.m.
- UI: `src/pages/BlogArticle.tsx`, `src/pages/DeepDiveArticle.tsx`, `src/pages/Kunskapscenter.tsx`, `src/pages/KunskapscenterHub.tsx`, `src/pages/Events.tsx`, `src/pages/EventDetail.tsx`, `src/pages/PartnerEvents.tsx`, `src/pages/PartnerNewsDetail.tsx`, `src/components/VideoCard.tsx`, `src/components/PartnernyttEventsSection.tsx`.
- Datumhjälpare: `src/lib/contentFreshness.ts` (`formatLongDateSv`), egna formatfunktioner i flera filer.
- PDF/export: `src/utils/generateRequirementsSpec.ts`, `src/utils/generateRoiPdf.ts`, `src/utils/generateImplementationPdf.ts`, `src/pages/AIReadiness.tsx`, `src/pages/SalesMarketingNeedsAnalysis.tsx`, `src/pages/NeedsAnalysis.tsx`.
- Admin i mån av tid: `AdminDashboard`, `AdminKnowledgeArticlesTab`, `Admin404Tab`, `AdminAllVisitorsTab`, `AdminFeaturedArticleTab`, `AdminEventsTab`, `AdminPartnerRequestsTab`, `AdminEmailLogTab`.

## Undantag / försiktighet
- Kodkommentarer och reguljära uttryck som använder `—` för att dela upp text (t.ex. `partnerResultCard.ts`) justeras så de inte bryts.
- Datum i backend/API lämnas som ISO; bara visningsformatet ändras.
- Adminverktyg som använder `date-fns` för interna tidsstämplar får behålla klockslag i detaljvyn, men det datumbärande fältet ska visas som `ÅÅÅÅ-MM-DD`.

## Kontroll
- Kör `npx tsgo --noEmit`.
- Kontrollera att inga `—` kvarstår i publicerat innehåll/UI med `rg -n "—" src/`.
- Kontrollera att inga kvarvarande svenska datumformat finns med `rg -n "toLocaleDateString" src/` och justera dem.
- Verifiera artiklar, Kunskapscenter, event och partnernyheter med Playwright.
