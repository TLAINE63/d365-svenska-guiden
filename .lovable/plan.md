# Åtgärda felaktiga marknadssiffror i Basic-teasern

## Problem (verifierat)
Skärmdumpen visar 374 besökare både 30 och 90 dagar, samt exakt 1 000 besökta sidor i båda perioderna. Verklig data i `visitor_analytics`: **662 unika sessioner / 1 521 sidvisningar (30 dagar)** och **961 unika sessioner / 3 399 sidvisningar (90 dagar)**.

Orsak: `buildBasicTeaserStats` i `supabase/functions/manage-partner-reports/basicTeaser.ts` hämtar alla rader från `visitor_analytics` (och `partner_filter_exposures`) i en enda förfrågan. Databasens API returnerar max **1 000 rader per anrop**, så:
- `pagesVisited90` blir exakt 1 000 (avkortat)
- Alla hämtade rader råkar ligga inom 30-dagarsfönstret → 30/90-siffrorna blir identiska (374/374, 1000/1000)
- `Partners på branschsidorna` visar "–" eftersom exponeringsraderna också avkortas vid 1 000 och branschsidesexponeringar aldrig når fram

## Åtgärd
I `basicTeaser.ts`:

1. **Besöksstatistik (30/90 dagar):** Sluta hämta rader till klienten. Skapa en säker SQL-funktion (security definer, endast service_role) `teaser_market_stats(start30, start90, end)` som returnerar aggregerat direkt i databasen:
   - unika sessioner 30/90 dagar
   - sidvisningar 30/90 dagar
   - genomsnittlig tid per sidvisning
2. **Partnerexponeringar:** Samma mönster — aggregera antal unika partner-slugs per kategori (`jamfor`/`compare`, `/branscher`, övriga) med en `COUNT(DISTINCT partner_slug)`-gruppering i SQL istället för radhämtning.
3. **Branschsidor "–":** Visa 0 istället för streck om värdet saknas, och efter aggregeringsfixen får branschsidorna rätt antal.
4. **Regenerering:** Efter deploy, kör om utkastsgenereringen för innevarande period. Befintliga utkast (som Avanades) behåller sparade e-postadresser tack vare förra fixen — endast statistiken uppdateras.

## Tekniska detaljer
- Ny migration med två SQL-funktioner + GRANT till `service_role` (inga anon-grants).
- `basicTeaser.ts` anropar `supabase.rpc(...)` istället för `.from(...).limit(200000)`.
- Deploy av edge-funktionen `manage-partner-reports`.
- Verifiera: jämför ny genererad teasers siffror mot direkta SQL-uppräkningar (662/961 sessioner osv.).
