# Backlänkar på d365.se: publik ruta + intern vy

Vad det betyder i praktiken: Semrush vet hur många andra webbplatser som länkar till d365.se (just nu 196 domäner och 381 länkar). I dag matar du in de siffrorna för hand i admin. Förslaget är att hämta dem direkt från Semrush med ett knapptryck, spara dem och visa dem både publikt och internt.

## Vad du får

**1. Publik sida `/lankar-till-d365`**
- Två stora tal: antal länkande webbplatser och antal länkar totalt, plus auktoritetspoäng.
- Kort förklaring på svenska av vad siffrorna betyder, i saklig ton utan superlativ.
- Lista över de mest tongivande webbplatser som länkar hit (domän + antal länkar), max 20.
- Datum för senaste uppdatering, format ÅÅÅÅ-MM-DD, och en källhänvisning till Semrush.
- Länkas från sidfoten under befintlig grupp med sajtinformation.

**2. Liten publik ruta som kan återanvändas**
- Kompakt variant av samma siffror, att lägga på sidan om ägande och intressen eller i partnerkommunikationen.
- Ingår i samma komponent, ingen extra sida.

**3. Ny flik "Backlänkar" i /redaktion**
- Knapp "Hämta från Semrush" som uppdaterar siffrorna direkt.
- Tabell över länkande domäner med auktoritet och antal länkar.
- Historik: varje hämtning sparas, så du ser utvecklingen över tid i en enkel lista och en liten graf.
- Knapp för att dölja enskilda domäner från den publika listan, om någon källa inte passar att visa.

## Uppdatering

Manuell knapp i redaktionen, precis som du valde. Ingen schemaläggning. Den publika sidan visar alltid den senast sparade hämtningen, så besökare ser aldrig en tom sida mellan uppdateringarna.

## Teknisk genomförandebeskrivning

- Ny tabell `site_backlink_snapshots`: `id`, `domain`, `captured_at`, `referring_domains`, `backlinks`, `authority_score`, `follows`, `nofollows`, `top_domains` (jsonb), `hidden_domains` (text[]). RLS på, publik SELECT, full åtkomst för service_role, GRANT till anon och authenticated.
- Ny edge function `manage-backlink-stats`:
  - `action=fetch` (POST, kräver HMAC-token med roll admin eller editor): anropar Semrush via connector-gateway, `/backlinks/backlinks_overview` och `/backlinks/backlinks_refdomains` med `target=d365.se`, `target_type=root_domain`, sparar en ny rad.
  - `action=list` (GET, intern): historik.
  - `action=public` (GET, ingen token): senaste raden, med dolda domäner bortfiltrerade.
  - Kvotfel från Semrush (`TOTAL LIMIT EXCEEDED`) översätts till ett tydligt svenskt meddelande i stället för ett generiskt fel.
  - `verify_jwt = false`, validering i koden som i övriga funktioner.
- Frontend:
  - `src/components/BacklinkStatsSection.tsx` med `variant="full" | "compact"`, hämtar publika siffror.
  - `src/pages/Backlankar.tsx` på rutten `/lankar-till-d365`, SEO-taggar och prerender-rutt i sitemap-genereringen.
  - `src/components/RedaktionBacklinksTab.tsx`, kopplas in som ny flik i `src/pages/Redaktion.tsx`.
- Semrush-kopplingen finns redan (`SEMRUSH_API_KEY` används i `semrush-daily-rankings`), ingen ny koppling behövs.
- Befintliga `semrush_monthly_stats` och admin-fliken rörs inte.
