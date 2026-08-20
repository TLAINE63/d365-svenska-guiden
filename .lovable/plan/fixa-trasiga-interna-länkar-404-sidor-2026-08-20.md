# Fixa trasiga interna länkar (404-sidor)

`https://d365.se/customer-insights/` visar "Sidan hittades inte" eftersom länken i hero-sektionen pekar på en adress som inte finns. En genomsökning av alla interna länkar mot appens rutter hittade totalt 11 trasiga länkar (sitemapen är däremot ren — inga 404-URL:er där).

## Trasiga länkar som hittats

Startsidans produktval (`src/pages/Index.tsx`):
- `/customer-service/` → ska vara `/d365customerservice/`
- `/field-service/` → ska vara `/d365fieldservice/`
- `/customer-insights/` → ska vara `/d365marketing/`
- `/ai-mognadsanalys/` → ska vara `/ai-readiness/`

Jämförelsedata (`src/data/erpComparisons.ts`, produktkort/länkar på jämförelsesidor):
- `/dynamics365-sales/` → `/d365sales/`
- `/dynamics365-customer-service/` → `/d365customerservice/`
- `/dynamics365-customer-insights/` → `/d365marketing/`
- `/dynamics365-contact-center/` → `/d365contactcenter/`
- `/dynamics365-field-service/` → `/d365fieldservice/`

Relaterade sidor (`src/components/RelatedPages.tsx`):
- `/kravspecifikation-customer-service/` → `/kravspecifikation-kundservice/`

Admin (`src/components/AdminSalesOverview.tsx`) innehåller tre gamla sökvägar (`/behovsanalys-salj-marknad`, `/behovsanalys-kundservice`, `/kravspecifikation-customer-service`) men de används bara som etiketter i statistiken, inte som klickbara länkar. De uppdateras till nuvarande sökvägar så att statistiken grupperas rätt.

## Åtgärder

1. Rätta alla länkar ovan till de faktiska sidorna.
2. Lägg till 301-redirects i `src/lib/legacy-redirects.ts` för de gamla adresserna som kan finnas delade eller indexerade (`/customer-insights`, `/customer-service`, `/field-service`, `/ai-mognadsanalys`, `/dynamics365-*`, `/kravspecifikation-customer-service`), så att besökare och Google leds vidare istället för att möta en 404.
3. Lägg till ett automatiskt regressionstest (`src/__tests__/internal-links.test.ts`) som skannar alla interna länkar i `src/` och failar om någon inte matchar en rutt i `App.tsx`. Då kan samma typ av fel inte smyga sig in igen.

## Teknisk not

Redirect-sidorna prerendreras redan via befintlig mekanism (meta refresh + canonical + noindex), så inga nya hostinginställningar behövs. Testet återanvänder samma rutt-parsning som `scripts/check-prerender-seo.mjs`-mönstret och körs med `vitest`.
