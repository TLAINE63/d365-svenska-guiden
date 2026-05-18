## Mål
Ersätt 30/90-dagarsfönster i admin-statistik med "totalt sedan start" som standard, i linje med ändringen vi gjorde i partner-sales-summary.

## Vyer som påverkas

1. **AdminStatsSummary.tsx** — `dateRange` default "30", väljare 7/30/90 → lägg till "Totalt" + sätt som default.
2. **AdminSalesOverview.tsx** — `dateRange` default "30" + hårdkodade 90-dagars säljunderlag-boxar → väljare med "Totalt" som default; "Säljunderlag – senaste 90 dagar"-blocket byter rubrik och query till totalt.
3. **AdminSalesKpiTab.tsx** — har redan `"all"`-läge, default "90" → ändra default till `"all"` och döp om "all tid" → "Totalt".
4. **AdminPartnerDashboardTab.tsx** — tabs 7/30/90, default 30 → lägg till "Totalt"-tab + sätt som default. Edge function `partner-dashboard` måste stötta `days: null` / `all`.
5. **AdminFunnelTab.tsx** — väljare 7/30/90, default 30 → lägg till "Totalt" + sätt som default. Edge function `funnel-analytics` måste stötta `days: null`.
6. **AdminPartnerReportsTab.tsx** — `days` default 30 i partner-report-draft + 90 dagar default i Explore-vyn → behåller datumväljare (rapporter är per period), men sätt Explore-default till bredare fönster (365 dagar) som "i praktiken allt".

## Edge functions

- `partner-dashboard` — acceptera `days: null` → ingen `gte("...", since)`-filtrering.
- `funnel-analytics` — samma.
- `visitor-stats` (anropas i AdminSalesOverview/AdminStatsSummary) — acceptera `startDate: null` → ingen tidsfilter.

## Etiketter

"Totalt" / "Sedan start" istället för "all tid". Periodtext på sidor blir "sedan start" när Totalt är valt.

## Utanför scope

- `AdminPartnerReportsTab` rapport-genereringen (per-period är poängen).
- `AdminAllVisitorsTab` (har egna datumväljare, ej 30/90-knappar).
- `sync-snitcher-visits` daysBack-parameter (handlar om API-sync, inte visning).

## Risker

- Stora aggregat över hela perioden kan vara tunga på `visitor_analytics` och `funnel_events`. Edge functions returnerar redan aggregerade siffror, så det bör klara sig.
