# Plan: Åtgärda bristerna från GEO-rapporten (80 %, betyg B)

## Vad rapporten säger
Rapporten har 3 underkända punkter och 6 varningar. Skärmdumpen namnger bara två av dem:
1. Schema.org-märkning
2. Läsbarhet (meningslängd)

## Uppmätt på d365.se i dag
Startsidan har strukturerad data, men flera delar finns dubbelt: 4 Organization och 2 WebSite. Dubbletter och motstridiga uppgifter är en vanlig orsak till anmärkningen om schema.

## Steg
1. **Rensa den strukturerade datan på startsidan.** Kvar blir en Organization och en WebSite, var och en med ett fast id som övriga delar hänvisar till. Samma uppgifter som i dag (namn, kontakt, logotyp). Jag kontrollerar också att LocalBusiness inte krockar med Organization. Om den gör det slås de ihop.
2. **Korta långa meningar i startsidans texter.** Jag delar meningar på mer än cirka 25 ord. Innehållet ändras inte, och jag följer alla textregler: inga långa tankestreck och "Dynamics 365" alltid på samma rad.
3. **Övriga brister och varningar.** De åtgärdas när du har skickat resten av rapporten. Jag gissar inte vad de gäller.
4. **Kontroll.** Jag hämtar sidan efter bygget och räknar typerna igen (1 Organization, 1 WebSite). Sedan kör jag Googles test för strukturerad data på den publicerade sidan.

## Tekniskt
- Jag letar upp varje ställe som skriver ut Organization och WebSite (SEO-komponenter och index.html) och ser till att de bara skrivs ut på ett ställe.
- Ändringarna syns i GEO-kontrollen först efter publicering.
