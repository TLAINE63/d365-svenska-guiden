# Två saker: publicera våg 2, och nyheter via profileringslänken

## Del 1: Publicera våg 2 i tilläggskatalogen

Kontrollen av de 59 lösningarna i vänteläge visar:

- Alla är aktiva produkter, alla har kort beskrivning och minst ett produktområde.
- 37 saknar den längre texten "Vad lösningen gör".
- 50 saknar länk till leverantörens webbplats.
- 12 har en intern notering om att något bör verifieras först (produktnamn, ägare, aktuell produktsida).

Förslag i två steg:

**Steg 1, publicera nu (47 lösningar)** Alla utan verifieringsnotering flyttas till `now` och publiceras. De syns direkt i katalogen, i kravspecifikationen och i jämförelser.

**Steg 2, granska först (12 lösningar)** De med verifieringsnotering flyttas till `now` men hålls opublicerade tills du gått igenom dem i admin. Du får listan.

Vill du hellre publicera alla 59 direkt gör vi det istället, säg bara till.

Efter publicering växer katalogen från 146 till 193 publicerade lösningar. Saknad leverantörslänk och längre beskrivning gör korten tunnare men bryter inget, jag tar fram en ifyllnadslista.

## Del 2: Nyhet eller inlägg via profileringslänken

Partnern ska kunna skicka in en nyhet direkt i samma formulär där de uppdaterar sin profil, precis som de redan kan lägga in event.

Nytt avsnitt "Nyhet till Partnernytt" i profileringsformuläret med:

- Rubrik och sammanfattning
- Länk till källa (partnerns egen sida eller pressrelease)
- Datum, produktområde, nyhetstyp och eventuell bransch
- Bild, valfritt
- Lista över partnerns tidigare inskickade nyheter med status

Allt som skickas in hamnar som **väntar på granskning**, inget publiceras automatiskt. Du godkänner eller avslår i admin under Partnernytt, precis som idag. En tydlig text i formuläret förklarar att redaktionen granskar innan publicering.

## Tekniskt

Del 1: bara en datauppdatering i `isv_solutions` (`publication_wave` till `now` för 59 rader, `is_published` till true för 47). Inga schema- eller kodändringar. Statiska sidor byggs om vid nästa publicering av sajten.

Del 2: följer samma mönster som event i profileringslänken.

- `manage-partner-news`: nya åtgärder `invitation-list-news`, `invitation-save-news`, `invitation-delete-news`, som validerar token mot `partner_invitations` (giltig, ej utgången, kopplad partner) på samma sätt som `manage-events` gör.
- Nya rader i `partner_news` får `status = 'pending'`, `ingest_method = 'partner_submitted'`, `partner_id` från inbjudan. Ingen ändring av `is_published`-flöden i admin.
- Bilduppladdning återanvänder befintlig `upload-image`-logik i samma funktion.
- `src/pages/PartnerUpdate.tsx`: nytt avsnitt i samma stil som eventavsnittet, med eget "klart"-läge i förloppsindikatorn.
- Inga databasändringar behövs, `partner_news` har redan alla fält.
