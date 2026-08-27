# Återställ partnerfiltreringen på startsidan

## Diagnos
Sektionen "Sök fram rätt verifierad partner för din bransch" (HomeVerifiedPartnersGrid) finns kvar i koden på `src/pages/Index.tsx` (rad 448-450) och renderas korrekt i test (17 partnerkort, branschkolumn, lösningschips – verifierat i mobilvy 393 px). Problemet är att sektionen **lazy-laddas**: previewens runtime-fel "Importing a module script failed" visar att en öppen flik kan hålla gamla chunk-URL:er efter ombygge. När chunken misslyckas renderar Suspense-fallbacken (ett tomt `py-16`-block) – sektionen "försvinner" utan felmeddelande.

## Plan

1. **Retry med reload vid chunk-fel** (i `App.tsx`/main eller en liten hjälpfunktion `src/lib/lazyWithRetry.ts`):
   - Slå in `lazy()` för startsidans kritiska sektioner (`HomeVerifiedPartnersGrid`, `HomePartnerNewsSection`) i en wrapper som vid "Failed to fetch dynamically imported module" / "Importing a module script failed" gör `window.location.reload()` en gång (skydd mot loop via sessionStorage-flagga).
2. **Begränsa ChunkErrorBoundary**: befintlig `ChunkErrorBoundary` ska fånga samma fel och trigga reload i stället för att visa tyst tom yta.
3. **Verifiering**: kör typecheck + Playwright i mobilvy (393 px): sektionen ska synas med rubrik, branschfilter, lösningschips och partnerkort efter hård reload.

## Tekniska detaljer
- Påverkade filer: `src/pages/Index.tsx` (import av sektioner via ny wrapper), ny `src/lib/lazyWithRetry.ts`, ev. `src/components/ChunkErrorBoundary.tsx`.
- Ingen design- eller layoutändring – sektionen ser ut exakt som tidigare.
- Notering: publicering krävs fortfarande separat för att live-sajten ska få alla väntande ändringar.
