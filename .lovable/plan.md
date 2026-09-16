# Sök publika källor per partner

## Så fungerar det idag

Sektionen "Publikt innehåll identifierat" fylls bara när du klickar på knappen i admin för en enskild partner. Underlaget hämtas idag enbart från material som redan finns på d365.se (partnernyheter och event). Ingen sökning görs utåt, och inget uppdateras av sig självt.

## Det här byggs

1. **Sökning på webben per partner**
   Knappen på partnern gör en riktig genomsökning: partnerns egen webbplats kartläggs (artiklar, blogg, nyheter, kundcase, webinarier) och kompletteras med en öppen webbsökning på partnerns namn. Det som hittas räknas och sparas som identifierat innehåll med titel, datum och länk till originalkällan, och används som underlag när marknadsprofilen, fokusområdena och ämneslistan skrivs.

2. **Knapp för alla partners**
   I redaktionen läggs en knapp "Uppdatera alla" som kör igenom partnerlistan en i taget, med synlig räknare och resultat per partner. Du kan avbryta mitt i. Partners utan webbadress hoppas över.

3. **Publiceras direkt**
   Resultatet syns på partnerprofilen så snart sammanställningen är klar. Du kan fortfarande redigera eller rensa texten i admin efteråt.

Partnerns egna uppgifter, beskrivning, produkter, branscher och kontaktpersoner rörs aldrig.

## Behövs från dig

Genomsökningen kräver tjänsten Firecrawl, som inte är kopplad till projektet än. När planen är godkänd visar jag en kopplingsruta i chatten där du väljer eller skapar kopplingen. Utan den kan bara dagens interna källor användas.

## Tekniska detaljer

- `generate-partner-public-profile` utökas: Firecrawl `map` + `scrape` mot partnerns `website`, plus `search` på partnernamn, med tak på antal sidor per körning. Resultat normaliseras till `latest_content` (kind/title/date/url) och räknare för artiklar, webinarier, kundcase. Interna `partner_news`/`partner_events` slås ihop med de externa träffarna och dedupliceras på URL.
- Klassificering av träffar (artikel/webinarium/kundcase) sker via URL-mönster och sidtitel, med AI-fallback i samma Lovable AI Gateway-anrop som redan skriver marknadsprofilen.
- Fältet `public_profile_sources` fylls med de faktiska käll-URL:erna (max 20).
- Ny action i funktionen: `partnerId` (en partner) eller `slugs`/`all` som kör en partner per anrop; klienten i redaktionen loopar och visar progress, så inget anrop blir långlivat.
- Ny flik/knapp i `RedaktionPartnerLinksTab.tsx` (eller Statistik-fliken) för massuppdatering, samt oförändrad knapp i `AdminDashboard.tsx`.
- Skrivning sker till `partner_public_insights` (upsert på `partner_id`) och till `public_profile_*`-kolumnerna på `partners`. Inga andra partnerkolumner skrivs.
- Firecrawl anropas serverside i edge-funktionen; läget (gateway eller direkt API) avgörs av kopplingens `uses_connector_gateway`.
