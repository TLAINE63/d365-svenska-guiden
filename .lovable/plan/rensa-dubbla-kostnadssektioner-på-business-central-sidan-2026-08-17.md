# Rensa dubbla kostnadssektioner på Business Central-sidan

BC-sidan har idag två sektioner om implementationskostnad:

1. **"Implementeringskostnader för Business Central"** – en äldre, handskriven sektion med två kort (150 000–400 000 kr respektive 500 000–1 500 000 kr).
2. **"Vad kostar det – egentligen?"** – den standardiserade `CostBreakdown`-sektionen (prismodell, S/M/L-intervall, kostnadsdrivare, löpande kostnader) som används på alla produktsidor och på kostnadsguiden `/kostnad/`.

De överlappar och säger delvis olika saker om samma sak.

## Förslag

Behåll den standardiserade `CostBreakdown` på produktsidan och ta bort den gamla handskrivna sektionen därifrån. Innehållet i den gamla sektionen (de två projektexemplen) flyttas till Kunskapscentrets kostnadsguide `/kostnad/`, under Business Central-avsnittet, som "Två typexempel på BC-projekt".

Så blir det:

```text
BC-produktsidan:   CostBreakdown (standard) → länk vidare till /kostnad/
/kostnad/ (KC):    Business Central: CostBreakdown + två projektexempel
```

## Tekniskt

- `src/pages/BusinessCentral.tsx`: ta bort sektionen `id="project-cost"` (rad ~574–616). Inga interna länkar pekar på den ankaren, så inget mer behöver ändras.
- `src/components/CostBreakdown.tsx`: gör så att den behåller länken till kostnadsguiden på produktsidan (redan default), inga ändringar krävs.
- `src/pages/Kostnad.tsx`: lägg till en valfri "typexempel"-block per produkt. Enklast: ny liten komponent `CostProjectExamples` med data i `src/data/costBreakdown.ts` (nytt fält `examples?: { title, scope, range, bullets[] }[]`), som renderas under `CostBreakdown` på `/kostnad/`. Fyll i exemplen för `business-central` från den borttagna BC-sektionen; övriga produkter lämnas tomma tills vidare.
- Texten om "Testa gärna under Välj Partner / Branschlösningar" ersätts av de befintliga CTA:erna på /kostnad/.
