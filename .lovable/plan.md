# Automatisera Partnernytt – utan att AI skriver om texten

Målet: du ska slippa klippa och klistra manuellt, men publicerad text ska vara partnerns egen ordagranna text. AI används bara för att föreslå kategorisering (produktområde, nyhetstyp, bransch) – aldrig för att skriva om innehållet.

Allt landar som utkast. Inget publiceras utan att du godkänner. Endast partnerverifierade profiler omfattas.

## 1. Snabbimport: klistra in en länk

Ny knapp i admin (Partnernytt): **"Importera från länk"**.

- Du väljer partner och klistrar in URL:en till LinkedIn-inlägget eller webbsidan.
- Systemet hämtar sidan och plockar ut: rubrik, brödtext ordagrant, bild och datum.
- Texten läggs in exakt som den står, med källänk till originalet. Ingen omskrivning, ingen sammanfattning.
- AI föreslår endast: produktområde(n), nyhetstyp och bransch – som förifyllda val du kan ändra.
- Om sidan är låst (LinkedIn kräver ofta inloggning) visas ett fält där du kan klistra in själva inläggstexten i stället, så sköts resten automatiskt.

Detta tar ett inlägg från ~5 minuter till ~15 sekunder.

## 2. Automatiska flöden från partnerns egen webb

Funktionen finns redan i koden men används inte – noll flöden är upplagda idag.

- I admin lägger du en nyhets-/blogg-RSS per partnerverifierad partner, med standardvärden för produktområde och nyhetstyp.
- Ett schemalagt jobb (en gång per dygn) hämtar nya inlägg, hoppar över redan importerade och skapar utkast.
- Kategoriseringsförslag från AI läggs på samma sätt som vid länkimport.
- Nyheter från flöden markeras som "automatiskt inhämtade" i granskningslistan.

## 3. Granskningsvy

En samlad flik "Att granska" i Partnernytt-adminet:

- Lista med alla utkast: partner, rubrik, källa, datum, förifylld kategorisering.
- Per rad: godkänn och publicera, redigera, eller släng.
- Massgodkännande för flera markerade rader.
- Varning om texten saknar källänk eller om samma inlägg redan finns.

## Upphovsrätt och transparens

- Ordagrann text visas som citat med tydlig källa: partnerns namn, datum och länk till originalinlägget.
- Standardregel: kort utdrag plus länk till originalet, inte hela inlägget, när texten är lång. Du kan alltid välja att ta med hela texten manuellt.
- Endast partnerverifierade profiler, dvs. partners som har profileringsavtal, så rätten att återge materialet är reglerad.

## Tekniska detaljer

- Ny edge-funktion `import-partner-news-url`: hämtar sidan via befintlig hämtningsväg, extraherar Open Graph/artikelinnehåll, returnerar rå text + bild + datum. Fallback: manuellt inklistrad text.
- Kategoriseringsförslag via Lovable AI (`google/gemini-3.1-flash-lite`), strikt begränsad till att välja bland befintliga enum-värden och `standardIndustries` – den får aldrig returnera fri text som hamnar i `editorial_title` eller `summary`.
- `manage-partner-news` utökas med `import-from-url` och `bulk-set-status`.
- `ingest-partner-feeds` återanvänds oförändrad i grunden; läggs till kategoriseringsförslag och filter mot `is_featured = true`.
- Dedup via befintlig `source_guid` samt normaliserad `source_url`.
- Cron: ett dygnsjobb för flödesinläsning; inga sub-timmes-jobb.
- Nya kolumner på `partner_news`: `ingest_method` (manual/url/feed) och `verbatim` (bool), med grants och RLS enligt befintligt mönster.
- Adminändringar i `AdminPartnerNewsTab.tsx` och `AdminPartnerFeedsTab.tsx`.

## Ordning

1. Länkimport + granskningsvy (störst tidsbesparing direkt).
2. Kategoriseringsförslag.
3. RSS-flöden per partner + dygnsjobb.
