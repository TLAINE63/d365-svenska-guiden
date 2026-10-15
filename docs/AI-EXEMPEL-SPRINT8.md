# AI-exempelbiblioteket: Sprint 8-rapport (2026-10-15)

## Skapade förvaltningsfunktioner
- Livscykel med sju statusar (DRAFT, REVIEW, USE_CASE, VERIFIED, PUBLISHED, UPDATE_NEEDED, ARCHIVED); publikt krävs källa + datum.
- Nya fält: nextReviewDate (+90 dagar), verifiedBy (internt), productStatus, updateReason, archivedAt, replacementUrl.
- Preview: 7 exempel där den verifierade texten anger förhandsversion visar nu "Förhandsversion" publikt. Övriga "unknown" (visas inte).
- Granskningskö (getReviewQueue) och månadsvy i Redaktion → Statistik → "AI-exempelbiblioteket". Kräver inloggning, ingår inte i sökmotorindex, laddas inte för vanliga besökare.
- Egen anonym lagring av ai_*-händelser (utöver Google Analytics) för att vyn ska visa faktisk data. Mätningen startar vid publicering.
- Förvaltningsmodell, prioritering, checklista, kvartalsprocess och backlog: docs/AI-EXEMPEL-FORVALTNING.md.

## Validerade händelser
Alla 13 ai_*-händelser + ai_library_entry_click. Dubbelregistrering förhindras (samma händelse inom 1 s räknas en gång); verifierat i webbläsaren. Ingen prompttext eller persondata skickas; exempeltitel skickas bara till Google Analytics, inte till egen lagring.

## Källkontroll
33 unika källänkar till Microsoft Learn, alla svarar 200 (vissa via Microsofts egna vidarekopplingar). Inga brutna. Inga sekundärkällor eller Tecman-referenser används.

## Uppdatering, sammanslagning, arkivering
- Behöver uppdateras: inga just nu (nästa granskning 2027-01-13).
- Bör slås samman: finance-hitta-ekonomisk-information → finance-fraga-data (redan vidarekopplad, dold).
- Bör arkiveras: inga publicerade. De 4 dolda REVIEW-posterna bör arkiveras om källa inte hittas till 2026-11-15.
- Tunt innehåll: inget publicerat exempel saknar Förr → Nu, ansvar, källa eller nästa steg.

## Innehållsgap
Kan inte bedömas förrän data finns (nollresultat och filterval från första månaden). Kända kandidater i backloggen: BC + MCP, SCM-roll.

## Synonymer
Biblioteket har ingen fritextsökning, bara filter. Ej tillämpligt; inga synliga synonymkategorier skapades.

## MÅSTE ÅTGÄRDAS
- Publicera för att mätningen ska starta (ingen data förrän då).

## KAN OPTIMERAS SENARE
- Skärmbilder (blockerat av bildrättigheter).
- Källor till de 4 dolda exemplen.
- Första innehållsgapsanalysen efter en hel månads data (2026-11-30).
