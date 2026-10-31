# Business Central-syndikering av ISV-produkter (Sprint 2.0)

businesscentral.se läser BC-relevanta tilläggslösningar live från den publika vyn `bc_isv_products_v1` (schema 1.0) i d365.se:s backend, med den publika nyckeln. Det finns ingen separat produktmaster.

## Publiceringsregel (beslut 2026-10-30)
En produkt visas bara när allt detta gäller:
- publicerad och aktiv (inte end of sale/legacy)
- byggd för Business Central (eller saknar angiven produkt, som räknas som BC)
- `publish_businesscentral` är markerad (startläge: alla 83 aktiva BC-tillägg)
- produktens informationsstatus är **Verifierad av d365.se**

Sammanställda eller enbart leverantörsbekräftade produkter visas inte. Leverantörens status påverkar inte produkten.

## Samma masterdata
`product_id`, `vendor_id`, kompatibilitet (`compatible_products`), `information_status` och kärndata kommer från samma post som på d365.se. Dessa dupliceras aldrig i businesscentral.se.

## Egen presentation på businesscentral.se
Redigeras i d365.se admin → ISV → Informationsstatus → Produkter → "Text för businesscentral.se":
`bc_slug` (URL, faller tillbaka på product_id), `bc_intro`, `bc_seo_title`, `bc_seo_description`, `bc_editorial_context`, `use_case` (härleds ur kategori om inget valts).

Use case-nycklar: wms, scanning, manufacturing, planning, edi, ap-automation, expense, payroll, banking, tax, document-management, e-commerce, shipping, reporting-bi, integration, localization, industry, other. Etikett finns i `use_case_label`.

## Informationsstatus och filter
Visa samma tre etiketter som d365.se (Verifierad av d365.se, Bekräftad av leverantören, Automatiskt sammanställd) och samma filterlogik med "Alla" som förval. Filtret ändrar bara urvalet, aldrig ordningen. Med nuvarande regel är alla produkter i vyn verifierade.

## Conversion exits
- Självservice: "Besök produktens webbplats →" till `product_website` med `utm_source=businesscentral.se&utm_medium=referral&utm_campaign=isv-katalog`. Inga besökaruppgifter följer med.
- Hjälp: "Få hjälp att bedöma om lösningen passar →" via `submit-inquiry` med `advisory: true` och `advisory_context.placement = "isv_product_help"` (`help_placement` i vyn). Mottagare är d365.se; ärendet får `source_site = businesscentral.se` och skickas aldrig till leverantören.

## Mätning
`track-funnel-event` tar emot anrop från businesscentral.se med `event_type: "isv"` och samma händelser: `isv_vendor_viewed`, `isv_product_viewed`, `isv_verification_filter_applied`, `isv_product_selfservice_clicked`, `isv_product_help_requested`. Servern sätter `metadata.source_site`.

## Premium
`premium_product`/`premium_vendor` får bara påverka presentationen, aldrig ordning, relevans eller status.
