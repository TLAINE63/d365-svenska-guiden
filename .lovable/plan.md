# Plan: Märkning av Basic-branschinsikt utanför kortet

## Status på det tidigare uppdraget (samma branschinsikt överallt)

Gjort:
1. Central hjälpfunktion `getBasicPartnerIndustries` i `src/lib/basicPartnerMatch.ts` — visning och filtrering delar samma källa.
2. `filterBasicPartners` matchar mot samma trunkerade lista som visas.
3. Produktsidorna (Business Central, Finance & SCM, CRM, ApplicationPartners) använder samma data via `UnprofiledPartnersList`.
4. Urval av max 3 branscher per Basic-partner med prioritet på ovanliga branscher (`display_industries` i `useBasicPartners.ts`) — Tillverkningsindustri minskade från 37 till 16 övriga partners.
5. Även jämförelsesidan och "Partners per bransch" använder samma urval.
6. Verifierat med `tsgo` och Playwright.

Kvar:
- **Konsekvent märkning utanför kortet**: när Basic-partners branscher används i filterlistor/sektioner (t.ex. produktsidornas "Övriga partners"-sektion) visas inte disclaimern "enligt d365.se:s marknadsanalys – ej bekräftad av partnern".

## Ändring (kvarstående del)

1. Lägg till en kort disclaimer-text under/ovanför Basic-partnersektionen i `UnprofiledPartnersList.tsx` (återanvänd `BASIC_COPY.industriesLabel`), så att det framgår att branschfiltreringen bygger på d365.se:s marknadsanalys och inte är partnerverifierad.
2. Motsvarande kort märkning där Basic-branscher visas i "Partners per bransch" om det saknas där.
3. Verifiera med `tsgo` och snabb visuell kontroll på en produktsida.

## Utanför scope
- Ingen ändring av urvals- eller matchningslogiken.
