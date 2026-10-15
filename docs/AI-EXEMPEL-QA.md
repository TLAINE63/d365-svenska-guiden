# AI-exempelbiblioteket: intern QA (2026-10-15)

Intern sammanfattning efter sprint 4–5. Visas inte för besökare.

## Status
- Publiceringsklara (VERIFIED, källa + datum): 51
  - Business Central 11, Sales 7, Customer Service 7, Finance 8, Supply Chain 5, Field Service 6, Project Operations 7
- REVIEW (dolda, ej publicerade): 4
  - `bc-agent-repetitiv`: dubblett av `bc-sales-order-agent` (vidarekoppling dit)
  - `finance-hitta-ekonomisk-information`: dubblett av `finance-fraga-data` (vidarekoppling dit)
  - `fscm-forsta-affarsdata`: ingen Microsoft-källa för budgetavvikelser (vidarekoppling till biblioteket)
  - `fscm-analysera-data`: ingen Microsoft-källa för leverantörsanalys (vidarekoppling till `scm-efterfragan`)
- DRAFT: 0. USE_CASE: 0.

## Källor
- Alla publicerade exempel har källa på Microsoft Learn (sv-se) och lastVerified 2026-10-15. Alla länkar svarade 200 vid kontrollen.
- Videor är inte granskade, bara skriftlig dokumentation.
- Leverantörsagenten och arbetsbelastningsinsikter i lagret har Microsofts översiktssida som källa (den specifika sidan svarade 404).

## Bilder
- 51 av 51 saknar bild. Datamodellen stöder imageUrl, imageAlt, imageCaption, imageSource, imageSourceUrl.
- Inga generiska AI-bilder används som ersättning. Blockerare: officiella Microsoft-skärmbilder med tydlig källa och rätt att använda dem.

## Nedtonade eller rättade påståenden
- "Vad förändras?" omskrivet för 43 exempel till konkreta arbetsmoment i stället för "snabbare/mindre tid".
- Customer Service, nästa steg: "utan att först eskalera" borttaget.
- Project Operations, tidagent: "färre missade tidrapporter" ersatt med vad medarbetaren faktiskt gör.
- Sales, pipeline: beskrivs som allmänna frågor om pipelinen, inte detaljerade urval.
- Förhandsversioner (Immersive Home, Account Reconciliation Agent, Time/Expense/Approvals Agent, leverantörsagenten, uppdatering av arbetsorder) anges som förhandsversion i texten.
- Inbyggda funktioner och agenter visar "Så kommer du åt det" i stället för påhittade frågor.

## Kvarvarande blockerare
- Produktbilder (se ovan).
- Svenska exempelfrågor är egna formuleringar; Microsofts dokumentation beskriver funktionerna på engelska.
- Business Central + MCP saknar verifierad källa och har inte lagts till.
