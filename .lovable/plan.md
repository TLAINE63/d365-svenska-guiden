# Verifiering av canonicalPath på SEOHead

## Sammanfattning

Alla `<SEOHead />`-instanser i `src/pages/**` och `src/components/**` har antingen en explicit `canonicalPath` som pekar på sin egen rutt, eller är markerade `noIndex` (för admin/verktyg som inte ska indexeras). Inga produktionssidor saknar `canonicalPath`.

## Kontrollerade nyckelsidor

| Sida | Rutt (App.tsx) | canonicalPath | Self-referencing |
|---|---|---|---|
| `AIOverview.tsx` | `/aioversikt` (och legacy `/ai-oversikt` → 302) | `"/aioversikt"` | Ja |
| `PartnerEvents.tsx` | `/partner-events/:token` | `` `/partner-events/${token}` `` | Ja (dynamiskt per token) |

## Metod

1. Regex-sökning över hela `src/**/*.tsx` efter `<SEOHead …/>`-block utan `canonicalPath` och utan `noIndex`.
   - Resultat: 0 träffar i produktionskod. Endast fyra träffar i `src/__tests__/legacy-redirects.e2e.test.tsx` som är testfixturer.
2. Manuell verifiering av `AIOverview` och `PartnerEvents` (de rutter användaren specifikt nämner).
3. `SEOHead` bygger canonical som `https://d365.se${canonicalPath}/` (lägger alltid på trailing slash), vilket matchar policyn i `TrailingSlashRedirect` och sitemap-URL:erna — kanonisk URL blir alltså identisk med sidans egen slutliga URL.
4. Bygg-tidsregressionsskyddet `scripts/check-prerender-seo.mjs` + `src/__tests__/prerender-seo.test.ts` failar redan CI om en prerenderad sida saknar/har fel canonical, och kör mot ett CRITICAL_ROUTES-set.

## Åtgärd

Inga kodändringar behövs. Om du vill kan jag som en frivillig förstärkning:
- Utöka `CRITICAL_ROUTES` i `scripts/check-prerender-seo.mjs` med `/aioversikt` så att AI-översikten också täcks av CI-regressionen (den ligger inte i listan idag).

Säg till om jag ska göra den tilläggsförbättringen, annars är verifieringen klar.
