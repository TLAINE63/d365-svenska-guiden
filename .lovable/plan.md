# Support, Förvaltning & Vidareutveckling som eget profileringsområde

Idag ligger partnerns text om förvaltning och vidareutveckling begravd som två av sex rutor i "Leveransprofil per produktområde" på partnerprofilen. Den blir svår att hitta och signalerar inte att partnern faktiskt profilerar sig kring livscykeln efter go-live.

Målet: lyft ut detta till en egen, tydlig sektion på partnerprofilen. Ingen filtrering och ingen ändring i matchningslogiken.

## Vad som byggs

### 1. Ny sektion på partnerprofilen
Under respektive produktflik (BC, F&SCM, Sales, Service) får partnern en egen sektion:

**"Support, Förvaltning & Vidareutveckling – {produktområde}"**

Den visar:
- Partnerns egen text om **Förvaltning** (avtalsformer, supportnivåer, uppföljning, releasehantering)
- Partnerns egen text om **Vidareutveckling** (backlogg, beslutsforum, typiska insatser)
- En bedömd nivå satt av d365.se (se punkt 3)
- Kort disclaimer: texten kommer från partnern, nivån är d365.se:s bedömning

Sektionen placeras direkt efter "Leveransprofil", så att projektleverans och livscykel efter go-live läses i rätt ordning.

### 2. Leveransprofilen slimmas
"Leveransprofil" behåller Typiska kunder, Typiska projekt, Leveransprofil och AI och automation. Förvaltning och Vidareutveckling flyttas till den nya sektionen – samma data, ny placering. Inget innehåll går förlorat och partnern fyller i på samma ställe som idag i profileringslänken.

### 3. Bedömd nivå från d365.se
Ett litet nivåbadge per produktområde, satt i admin (inte av partnern), med tre steg i samma anda som "AI, Automation & Power Platform":

- **Projektfokus** – partnern levererar främst projekt, förvaltning i begränsad form
- **Förvaltningserbjudande** – etablerat förvaltningsavtal med definierade supportnivåer
- **Livscykelpartner** – dokumenterad löpande förvaltning och strukturerad vidareutveckling över tid

Nivån visas bara när admin satt den. Saknas nivå visas enbart partnerns text.

### 4. Redigering
- **Partnern**: samma två fält som idag i profileringslänken, men grupperade under egen rubrik med uppdaterad hjälptext så det blir tydligt vad som efterfrågas.
- **Admin**: nivåval per produktområde i partnerredigeringen, tillsammans med övriga produktfältsinställningar.

## Teknisk beskrivning

- Datat ligger redan i `partners.product_filters -> <bc|fsc|sales|service> -> deliveryProfile`. Nivån läggs som ett nytt valfritt fält i samma JSONB-objekt. **Ingen databasmigrering behövs.**
- `src/data/deliveryProfileFields.ts`: dela upp `DELIVERY_PROFILE_FIELDS` i två grupper (leverans respektive support/förvaltning), lägg till nivåtyp + metadata (etikett, beskrivning, färgtoken) enligt mönstret i `src/lib/extendedCompetencies.ts`.
- Ny komponent `src/components/partner/ProductSupportProfile.tsx` renderar den nya sektionen; `ProductDeliveryProfile.tsx` filtrerar bort de två fälten.
- `src/components/partner/PartnerProductTabs.tsx` renderar den nya sektionen efter leveransprofilen och skickar med nivån.
- `DeliveryProfileEditor.tsx` grupperar fälten under två rubriker; admin-nivåväljaren läggs i produktfältsredigeringen i `AdminDashboard.tsx`.
- Semantiska tokens genomgående, inga hårdkodade färger. Neutral ton, inga superlativ.
- Edge-funktionen `generate-partner-delivery-summary` lämnas oförändrad (den läser samma fält).
