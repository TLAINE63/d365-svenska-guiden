# Sprint 1: inventering av partnerflödet (2026-10-10)

Flöde: Partnermatchning → Partnerkortlista → Jämförelse → Kontaktförfrågan.

## Nuläge
- Matchning: `/valjdynamics365partner/`, `/kom-igang/`, startsidans partnerfilter och "Bygg er kortlista".
- Kortlista: `/kortlista/` (ShortlistContext, localStorage, max tre).
- Jämförelse: `/jamfor-partners/` (PartnerCompareContext, egen lagring, max tre, sticky PartnerCompareBar).
- Kontakt: InquiryDialog via InquiryContext (max tre, samtycke per partner).

## Observationer (ej åtgärdade, kräver beslut)
1. Två parallella urval: "Lägg till i jämförelse" (PartnerCompareContext) och "Lägg till i kortlista" (ShortlistContext) lagras separat. En besökare kan ha olika partners i jämförelsen och kortlistan. Förslag sprint 4: ett gemensamt urval.
2. Startsidans partnerlista leder till jämförelse men inte direkt till kortlista/förfrågan; steget jämförelse → förfrågan bör kontrolleras så att valda partners följer med utan nya val.
3. Kom igång frågar efter bransch och produkt som besökaren ibland redan valt i startsidans partnerfilter. Förifyllning via URL finns (buildKomIgangUrl) men används inte från alla ingångar.
4. CTA-texter varierar: "Hitta rätt partner", "Visa matchande partners", "Jämför valda partner", "Kontakta valda partners". Bör samlas i `src/data/ctaLabels.ts`.

## Genomfört i sprint 1 (endast UI)
- Upprepade startsidessektioner borttagna; partnerlistan heter "Bygg er kortlista".
- Ingen ändring av partnerdata, matchning, jämförelse, förfrågan eller behovsunderlag.

## Åtgärdat 2026-10-10 (säker UI-rättelse)
- Startsidans "Jämför valda partner" räknade det separata jämförelseurvalet medan korten sparade till kortlistan, så knappen förblev låst. Knappen utgår nu från kortlistan (max tre). Jämförelsesidan och förfrågan är oförändrade.

## Underlag för nästa sprint (efter kvalitetssprinten 2026-10-10)
- Kortlista och jämförelse: ShortlistContext och PartnerCompareContext är fortfarande två urval utanför startsidan. Slå ihop till en urvalsmodell (max tre).
- Behovsanalyser (ERP, CRM, kundservice), implementationskalkylatorn och kravspecifikationen sparar inte till buyerProfile/buyerContext. Koppla dem stegvis till Min D365-plan, med användarens val om vad som sparas.
- Valda produkter och branscher följer inte alltid med till partnerurvalet; kompetensförfrågan förifyller inte vald specialistroll.
- Kravspecifikationens e-postkrav: mät användning och slutförande innan beslut (Thomas 2026-10-10).
- ISV till partner och filter för övertagande/förvaltning kräver verifierad partnerdata först.
- Partnerknappen "Besök partnerns webbplats" i beslutsraden visas bara om webbplats skickas in; ingen anropare gör det i dag.
