# Samlad pris- och kostnadsguide på /kostnad/

Bygg ut den befintliga sidan `/kostnad/` till sajtens kompletta guide för vad Dynamics 365 kostar – både licens (abonnemang) och implementationsprojekt – med en snabb offertfråga som ger ett direkt kostnadsspann och kan skickas vidare till 2–3 matchande partners. ROI-kalkylatorerna länkas in per produkt.

## Vad besökaren möter

1. **Hero + de tre kostnadsdelarna** (finns idag): abonnemang, implementation, löpande kostnader. Kompletteras med en kort innehållsförteckning.
2. **Licenskostnad (nytt på sidan)**: sammanfattande tabell över listpriser per applikation, hämtad från det centrala prisregistret så admin-uppdateringar slår igenom. Källruta med datum. Länk vidare till `/priser/` för hela listan (den sidan behålls – den rankar redan).
3. **Snabb offertfråga (nytt)**: ett kort formulär högt upp på sidan och repeterat längre ner:
   - produkt/applikation, antal användare, bolagsstorlek, komplexitet, om integrationer/migrering ingår
   - visar direkt på skärmen: uppskattad licenskostnad per år + implementationsspann + projekttid
   - därefter kontaktuppgifter (namn, företag, jobbmejl) för att få underlaget som PDF och/eller skicka till 2–3 matchande partners
4. **Per produkt (finns idag)**: implementationsintervall S/M/L, kostnadsdrivare, löpande kostnader, projektexempel. Kompletteras med en rad "Licens från X kr/användare/mån" och en tydlig länk till respektive **ROI-kalkylator** där sådan finns.
5. **FAQ + kontaktformulär** (finns idag, behålls).

## Teknisk lösning

- **Estimatlogik**: återanvänd `src/lib/implementationEstimate.ts` (`SOLUTIONS`, `COMPLEXITY_OPTIONS`, `estimateImplementation`) så att guidens snabbestimat och `/implementationskalkylator/` alltid ger samma siffror. Ny komponent `src/components/QuickQuoteEstimator.tsx` med en förenklad delmängd av fälten; "Vill du gå djupare?" länkar till den fulla kalkylatorn.
- **Licenspriser**: `usePriceMap()` + `formatPriceByKey` (befintligt), ny komponent `src/components/LicenseCostTable.tsx`. Inga hårdkodade priser.
- **Lead + partners**: återanvänd befintlig kedja – `submit-lead` för leadet och edge-funktionen `send-underlag-to-partners` för utskicket, med underlaget som PDF via `src/utils/pdfLayout.ts` (samma branding som övriga PDF:er). Partnerurval via `src/lib/suggestPartners.ts` med produkt, bransch och storlek, avtalspartners först.
- **Validering**: zod-schema klientsidan (längdgränser, jobbmejl via `validateBusinessEmail`), plus befintlig serverside-validering och blockering av fria e-postdomäner i edge-funktionen.
- **ROI-länkar**: mappa produktnyckel → ROI-route (`PRODUCT_ROI_PAGES` + BC/Sales-sidorna) i en liten hjälpfunktion; länk visas bara när kalkylator finns.
- **SEO**: uppdatera titel/meta till att täcka både licens och implementation, komplettera FAQ-schemat med licensfrågor, `SourceNote` på alla nya sifferpåståenden, interna länkar till `/priser/`, `/implementationskalkylator/`, ROI-sidorna och `/valjdynamics365partner/`. Sidan är prerenderad – nya sektioner renderas serverside, formuläret är klientinteraktivt.

## Avgränsningar

- `/priser/` och `/implementationskalkylator/` behålls som egna sidor och länkas in; inga redirects.
- ROI räknas inte om i guiden – bara länkar per produkt.
- Inga nya priser hittas på; allt kommer från prisregistret och befintliga kostnadsintervall.
