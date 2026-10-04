# Bevakning av sökpositioner mot konkurrenter (Semrush, månadsvis)

## Vad du får
En ny vy "Sökpositioner" i Admin (statistikdelen) som visar, för 55 sökfraser i 10 grupper, var d365.se och de fyra konkurrenterna ligger i svensk Google, vilken sida som rankar, sökvolym och förändring mot förra månaden.

- Fraser utan träff visas som **"ej topp 100"**, aldrig 0 eller tomt.
- Fraser utan volymdata visas som **"okänd volym"** och ligger kvar.
- Varje månad sparas som en egen körning, så du kan jämföra över tid.
- Filtrering per grupp (Generiska, Produkt, Partner, Kostnad, Migrering, Bransch, m.fl.) och per domän.

## Viktig begränsning: gränsen på 10 hämtningar per dag
Semrush tillåter högst 25 fras-villkor per filtrerad hämtning. 55 fraser kräver därför 3 hämtningar per domän, alltså 15 hämtningar för fem domäner, vilket överstiger 10 per dag. Lösningen:
- Månadskörningen delas upp över **två dagar** (t.ex. den 1:a och 2:a): max 9 hämtningar per dag.
- En räknare i databasen stoppar körningen om dagens hämtningar når 10, och fortsätter nästa dag där den slutade.
- En körning räknas som komplett först när alla 5 domäner har alla 55 rader.

## Domäner och fraser
Exakt enligt din lista: d365.se, affarssystemguiden.se, businesswith.se, crm-systemguiden.se, herbertnathan.com och de 55 fraserna med gruppnamn som tagg. Listorna går att ändra i efterhand i vyn (lägg till/ta bort fras eller domän), med varning om hur många hämtningar ändringen kostar.

## Verifiering (innan vyn byggs klart)
1. Kör första hämtningen och visa att d365.se har rader med fras, position och URL.
2. Kontrollera att alla fem domäner har en körning denna månad (kan kräva dag 2 p.g.a. gränsen).
3. Kontrollera att varje domän har exakt 55 rader, med "ej topp 100" där träff saknas.
Resultatet av varje kontroll rapporteras innan nästa steg.

## Tekniska detaljer
- Tabeller: `serp_watch_domains`, `serp_watch_phrases` (phrase, group_tag), `serp_watch_runs` (month, domain, status, calls_used), `serp_watch_results` (run_id, phrase_id, position null = ej topp 100, volume null = okänd, url, fetched_at), `serp_watch_api_usage` (datum, antal). RLS på, läsning/skrivning endast via service role i edge function.
- Ny edge function `serp-watch` (admin-JWT, samma mönster som `competitor-insights`): actions `run` (fortsätter pågående månadskörning inom dagskvoten), `latest?domain=`, `compare` (två månader), `config` (CRUD fraser/domäner).
- Semrush-anrop: `domain_organic`, database `se`, `display_filter` med upp till 25 `+|Ph|Eq|<fras>`-villkor per anrop (OR), kolumner Ph,Po,Nq,Ur. Fraser som saknas i svaret sparas med position null. Volym för fraser utan rankning hämtas inte separat (sparar kvot) och visas som "okänd volym" om ingen domän rankar.
- Schemaläggning: pg_cron dag 1 och 2 varje månad anropar `run`; knapp "Kör nu" i vyn för manuell fortsättning.
- Ny komponent `AdminSerpWatchTab.tsx` i befintlig statistikdel; utvecklingspilar mot föregående körning.
- AGENTS.md: regel om att bevakningen körs månadsvis och kvotstyrt.
