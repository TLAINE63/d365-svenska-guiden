# Rensa bort skräplänkar från backlänksidan

## Mål
Den publika sidan /lankar-till-d365 ska bara visa trovärdiga länkande webbplatser. Uppenbara skräpdomäner (länknätverk, blogspot-sidor, domäner med auktoritet nära noll) döljs, och du får ett enkelt verktyg i redaktionen för att granska och rensa.

## Så blir det

### 1. Automatisk skräpflagga
Varje länkande domän bedöms mot enkla regler:
- Auktoritetspoäng under 5
- Gratisbloggplattformar och typiska skräpdomäner (blogspot.com, .sbs, .xyz, .top, .buzz och liknande)
- Orimligt många länkar från en enda svag domän (t.ex. över 20 länkar med auktoritet under 5)

Domäner som träffas får en tydlig markering "Misstänkt skräp" i redaktionen.

### 2. Dolda som standard på publika sidan
Nyupptäckta skräpdomäner döljs automatiskt från den publika listan. Du kan alltid visa en enskild domän igen med ett klick.

### 3. Rensningsvy i redaktionens flik "Backlänkar"
- Filter: Alla / Visas publikt / Dolda / Misstänkt skräp
- Knapp "Dölj alla misstänkta" och "Återställ alla"
- Räknare högst upp: hur många domäner som visas publikt respektive är dolda

### 4. Publika siffror blir ärliga
På /lankar-till-d365 visas fortsatt totalsiffrorna från Semrush, men topplistan innehåller bara de domäner som inte är dolda. En kort notering förklarar att listan visar utvalda länkande webbplatser.

## Teknisk detalj
- Ny hjälpfunktion `isLikelySpam(domain, authority, backlinks)` i `supabase/functions/manage-backlink-stats/index.ts`, används vid `action=fetch` för att förifylla `hidden_domains` (befintliga manuella val behålls) och returneras som fältet `suspected` per domän vid `action=list`.
- `action=hide` utökas med stöd för att sätta hela listan (finns redan) samt ett läge `mode: "hide-suspected"` som lägger till alla flaggade domäner.
- `src/components/RedaktionBacklinksTab.tsx`: filterknappar, skräpbadge, massåtgärder, räknare.
- `src/components/BacklinkStatsSection.tsx`: kort notering under topplistan. Inga ändringar i datamodellen krävs, `hidden_domains` finns redan.
- Efter implementering körs en hämtning så att listan uppdateras direkt.
