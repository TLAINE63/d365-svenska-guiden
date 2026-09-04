# Plan: Märkning av Basic-branschinsikt utanför kortet – footnote-stil

## Bakgrund

Basic-partners branschinriktning bygger på d365.se:s marknadsanalys och är inte partnerverifierad. Denna information visas redan på Basic-korten, men när samma branscher används i filter eller grupperade listor utanför kortet behöver det framgå tydligt att källan är vår analys.

## Stilval

Användaren har valt **diskret footnote**: mindre text i italic med info-ikon, placerad under introtexten utan att ta visuell överhand.

## Genomförande

1. **Skapa en återanvändbar footnote-komponent** för Basic-branschdisclaimern.
   - Text: `Branschinriktning enligt d365.se:s marknadsanalys. Ej bekräftad av partnern.`
   - Mindre italic-stil, dämpad färg, liten info-ikon.
   - Använd semantiska färgtokens (text-muted-foreground, border-border).

2. **Applicera footnoten på aktuella ytor**
   - `src/components/UnprofiledPartnersList.tsx`: under introtexten när en bransch är vald.
   - `src/pages/PartnersPerBransch.tsx`: under introtexten för Basic-partner-sektionen.
   - Ersätt nuvarande inline/disclaimer-ruta med den nya footnote-komponenten.

3. **Säkerställ konsekvens**
   - Samma text och stil på alla ställen där Basic-branscher visas utanför själva Basic-kortet.
   - Ingen ändring av urvals- eller matchningslogik.

4. **Verifiera**
   - Kör `tsgo`.
   - Kontrollera visuellt på `/businesscentral/` med branschfilter vald och på `/partners-per-bransch/`.

## Utanför scope

- Ändra inte hur branscher väljs eller filtreras.
- Lägg inte till nya datakällor eller backendändringar.
