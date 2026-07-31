## Bakgrund

Du har rätt – jag beskrev fel funktion tidigare. Den rapport du ser i förhandsgranskningen byggs av `manage-partner-reports` (funktionen `buildEmailHtml`), och den skickar idag **företagsnamn, klickbar domän, bransch, storlek, land och besökta URL:er** till partnern. Den gamla `send-partner-monthly-report` är den som bara aggregerar.

## Vad som ändras

Mejlet till partner anonymiseras. Varje kort visar i stället:

```text
[ikon]  Tillverkande företag · 51–200 anställda        1 besök
        Sverige
        ✓ Matchade profil-URL:er (2)
          /partner/sherpas-group-ab/
        ANDRA SIDOR DE TITTADE PÅ
          /kunskapscenter/d365sales/  ...
```

Konkret i e-postmallen:
- **Företagsnamn tas bort** ur rubriken – ersätts av bransch (fallback "Identifierat företag" om bransch saknas).
- **Domänen tas bort** helt (både text och länk).
- **Storlek och land behålls** som underrad/pills.
- **Initialbrickan** (som idag visar företagets initialer) byts mot en neutral, generisk ikon.
- **"Andra sidor de tittade på" behålls oförändrat** – inklusive matchade profil-URL:er.
- Förklaringstexten uppdateras: rapporten anger uttryckligen att enskilda företagsnamn inte lämnas ut, bara bransch och storlek.
- Ämnesrad och intro-text ("X identifierade företag") kan vara kvar – de innehåller inga namn.

## Vad som INTE ändras

- **Admin-vyn behåller företagsnamnen.** Du måste kunna se vilka företag som ingår för att kunna bocka av/exkludera rader före utskick. Anonymiseringen sker bara i det mejl som går till partnern.
- Datainsamlingen i `snitcher_visits` rörs inte.
- Den gamla `send-partner-monthly-report` rörs inte.

## Teknisk detalj

- Fil: `supabase/functions/manage-partner-reports/index.ts`, funktionen `buildEmailHtml` (kortrenderingen ca rad 190–255 samt förklaringsrutorna).
- Samma funktion används för både förhandsgranskning, testutskick och skarpt utskick, så en ändring täcker alla tre flöden.
- Redan sparade utkast i `partner_report_drafts` behåller sin `companies`-JSON med namn – renderingen filtrerar bort dem vid utskick, så inga data behöver migreras.
- Funktionen deployas om efter ändringen och jag verifierar med en förhandsgranskning av ett juli-utkast.
