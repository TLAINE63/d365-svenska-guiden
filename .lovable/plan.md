# Komplettera köpresan: kvarvarande luckor

Det mesta i instruktionen finns redan (Min D365-plan, kontextuella CTA:er för ERP, CRM, jämförelse, partner och migrering, interaktiva Fit Models, neutrala ERP/CRM-vägar). Planen fyller bara luckorna och river inte upp något.

## Vad som läggs till

1. **Tre nya kontextuella nästa steg**
   - Branschsidor: "Se vilka lösningar som passar er verksamhet" (sparar branschen i planen, leder till Min D365-plan med ERP-läge).
   - Kompetenssidor: "Beskriv vilken kompetens ni behöver" (leder till befintlig kompetensförfrågan).
   - Hög köpintention (plan med område, bransch, storlek och sparade partners): "Få hjälp att matcha rätt partner" (befintligt förmedlat kontaktflöde, aldrig direkt till partnerwebbplats).

2. **Planen som checklista**
   "Er plan just nu" visar bockade och obockade rader: område, bransch, storlek, viktiga behov, "Lösning ej vald", "Partner ej vald", samt ett enda rekommenderat nästa steg.

3. **Ett primärt nästa steg per strategisk sida**
   Gå igenom strategiska sidor och säkerställ att bara en primär knapp (orange) visas; övriga blir diskreta textlänkar.

4. **Mätning av köpresan**
   Samla händelserna i befintlig anonym funnelmätning: startat test, slutfört test, jämfört alternativ, besökt partnerprofil, skapat Min D365-plan, startat behovsanalys, partnerförfrågan, kompetensförfrågan, kontakt. Visas i befintlig köpresestatistik i Admin och /redaktion.

## Avgränsning
- Ingen ändring av partnerdata, urval, ranking eller sökmetadata.
- Ingen ny copy utöver CTA-texterna ovan; inga nya FAQ:er eller AI-märkningar.
- Ingen publicering.

## Teknisk sammanfattning
- `ctaJourney.ts`: källor `industry:*`, `competence:*` och en hög-intention-regel baserad på `d365Plan` + shortlist.
- `PlanSummary.tsx`: checklisteläge med `planNextStep` som enda primära steg.
- Händelser via befintliga `trackFunnelEvent`/`funnelTracking`, nya händelsenamn mappas in i AdminUnderlagFunnel.
- Vitest för journey-reglerna, Playwright 1280/390 px på bransch-, kompetens-, ERP- och partnersida.
