## Problem

Fliken Månadsrapporter innehåller fem kort som ser likvärdiga ut, trots att bara ett av dem är själva utskicksprocessen:

1. Infoboxen "En enda månadsrapport"
2. `PartnerStatsMatrix` (statistiköversikt)
3. "Redaktionellt innehåll i månadsrapporten" (changelog m.m.)
4. "Företag som besökt partnerprofiler" (Snitcher-utforskare, egen datumperiod)
5. "Månadsrapporter till partners" (utkasten – den faktiska processen)

Kort 2 och 4 är rena granskningsvyer, kort 3 är en inställning. Eftersom kort 4 har sina egna datumfält och en egen "Uppdatera"-knapp ser den ut som ett parallellt rapportspår.

## Lösning: ett arbetsflöde överst, stöd nedanför

**Sektion A – Arbetsflöde (alltid synligt, överst)**
- Slå ihop infoboxen och utkastlistan till ett kort: "Månadsrapport – utkast per partner".
- Stegen 1–4 (Synka Snitcher → Generera → Granska → Skicka) visas som en kompakt stegrad direkt ovanför knapparna, så knapparna hör visuellt ihop med stegen.
- Anonymiseringsrutan blir en kort rad med en "Läs mer"-utfällning i stället för ett eget kort.

**Sektion B – Underlag och inställningar (hopfällda accordions under en rubrik "Stöd och underlag – påverkar inte utskicket")**
- "Redaktionellt innehåll i månadsrapporten" (märkt: *ingår i alla utkast*)
- "Statistik per partner" (`PartnerStatsMatrix`, märkt: *endast för din granskning*)
- "Företag som besökt partnerprofiler" (märkt: *endast admin – namnen skickas aldrig*)

Alla tre är stängda som standard, så fliken öppnar med bara ett synligt arbetsflöde.

## Teknisk detalj

- Ändringarna sker enbart i `src/components/AdminPartnerReportsTab.tsx`; ingen logik, inget datahämtande och inga edge-funktioner ändras.
- Använder befintlig `Accordion` från shadcn för sektion B.
- `PartnerStatsMatrix` och `MonthlyStatsReportCard` behålls som komponenter men renderas inuti accordion-items utan eget `Card`-omslag (eller med `border-none`) så att de inte ser ut som fristående processer.
