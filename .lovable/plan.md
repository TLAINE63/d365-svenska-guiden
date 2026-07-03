# Justera löftet i profileringsmallen (PartnerUpdate)

## Vad som stämmer idag
Profileringsmallens sektioner motsvarar vad som faktiskt visas publikt:
- **Dynamics 365-produkter, Övriga produkter, Branschpitcar, Branschapplikationer, Events, AI/Copilot, Grundinfo, Beslutsprofil** → syns på PartnerCard (highlights) och PartnerProfile (fullständigt).
- **Övriga kommentarer** → intern, syns ej publikt.

Data som fylls i används alltså inte enbart för matchning – den publiceras rakt av på partnerkortet och partnerprofilen.

## Vad löftet säger idag (missvisande)
Två ställen i `src/pages/PartnerUpdate.tsx` beskriver bara matchning + synlighet, inte att texten publiceras:

1. **Rad 1144–1148** – "Progress & Value"-boxen:
   > "Din profil används för att matcha er med rätt kunder. Ju tydligare och mer komplett den är – desto bättre synlighet får ni."

2. **Rad 1180–1181** – Info-boxen ovanför produktvalet:
   > "Denna information används för att matcha er med rätt kunder. Ju tydligare ni beskriver er spets, desto bättre träffsäkerhet."

3. **Rad 1315** – Progress-hint:
   > "Komplettera {n} fält för att öka er synlighet och matchning."

Ingen av texterna nämner att innehållet publiceras direkt på d365.se.

## Ändring
Uppdatera de tre texterna så det tydligt framgår att inmatad information är **underlag för publicering** på sajten (partnerkort + partnerprofil), utöver matchning:

1. **Progress & Value-boxen** (rad 1146–1148):
   > "Informationen ni fyller i publiceras direkt på ert partnerkort och er partnerprofil på d365.se – och används för att matcha er med rätt kunder. Ju tydligare och mer komplett profilen är, desto starkare framträder ni för besökarna."

2. **Produkt-info-boxen** (rad 1180–1181):
   > "Det ni skriver här publiceras på ert partnerkort och er partnerprofil, och är underlag för matchningen mot kundernas sökningar. Ju tydligare ni beskriver er spets, desto bättre träffsäkerhet och framtoning."

3. **Progress-hint** (rad 1315):
   > "Komplettera {n} fält för att stärka hur ni publiceras på sajten och öka matchningen."

Behåller den redan tydliga "Så här visas ni för kunder"-knappen (rad 1121–1125) som redan pekar på live-profilen – ingen ändring där.

## Filer som ändras
- `src/pages/PartnerUpdate.tsx` (tre textblock)

Ingen logikändring, ingen ny data, inga migrations.
