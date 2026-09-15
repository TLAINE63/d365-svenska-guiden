# Publicera våg 2 i tilläggskatalogen

Målet: de 59 lösningar som idag ligger i vänteläge (`wave_2`) flyttas till `now` och blir synliga på d365.se.

## Vad kontrollen visar

Alla 59 är aktiva produkter och alla har en kort beskrivning och minst ett produktområde, så de kan visas i katalogen. Två saker saknas på en del av dem:

- 37 saknar den längre texten "Vad lösningen gör".
- 50 saknar länk till leverantörens webbplats.
- 12 har en intern notering om att något bör verifieras först (produktnamn, ägare, aktuell produktsida).

Inga av de 59 är avvecklade, de tre avvecklade ligger separat i vänteläge och rörs inte.

## Förslag: publicera i två steg

**Steg 1, publicera nu (47 lösningar)**
Alla utan verifieringsnotering flyttas till `now` och publiceras. De visas direkt i katalogen, i kravspecifikationen och i jämförelser.

**Steg 2, granska först (12 lösningar)**
De med notering om att verifiera namn, ägare eller produktsida flyttas till `now` men hålls opublicerade tills du gått igenom dem i admin. De listas för dig så du kan bocka av dem.

Vill du hellre publicera alla 59 på en gång gör vi det istället, säg bara till.

## Efter publicering

- Saknad leverantörslänk och saknad längre beskrivning gör att korten blir tunnare men bryter inget. Jag tar fram en lista på de som saknar uppgifter så du kan fylla på efter hand.
- Katalogen växer från 146 till 193 publicerade lösningar.

## Tekniskt

- Enda ändringen är en datauppdatering i `isv_solutions`: `publication_wave` sätts till `now` för de 59 raderna, och `is_published` sätts till true för de 47 utan verifieringsnotering.
- Inga schemaändringar, ingen kodändring. Katalogsidorna läser redan `is_published = true`.
- Statiska sidor byggs om vid nästa publicering av sajten så att de nya lösningarna kommer med i sitemap och sökindex.
