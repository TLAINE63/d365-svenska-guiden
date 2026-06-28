## Mål

Utvidga konkurrentjämförelserna från enbart Business Central till samtliga D365-produkter där det finns relevanta konkurrenter. Återanvänd befintlig sidmall (`ErpComparisonPage.tsx`) och hubbstruktur, men generalisera datamodellen så den fungerar för alla produkter.

## Nya jämförelser som ska byggas (13 st)

| Produkt | Konkurrenter |
|---|---|
| Finance & SCM | SAP S/4HANA, Infor M3 |
| Sales | Salesforce Sales Cloud, HubSpot Sales Hub |
| Customer Service | Zendesk, ServiceNow CSM, Salesforce Service Cloud |
| Customer Insights | Salesforce Marketing Cloud / Data Cloud, HubSpot Marketing Hub |
| Contact Center | Genesys Cloud CX, NICE CXone, Puzzel, Telia ACE |
| Field Service | Salesforce Field Service |

## Teknisk lösning

### 1. Generalisera datamodellen
Döp om `src/data/erpComparisons.ts` → `src/data/productComparisons.ts` och refaktorera:
- Byt fältnamn `bc` / `bcSummary` / `bcLimits` → `product` / `productSummary` / `productLimits`
- Lägg till fält: `productKey` (`'bc' | 'fscm' | 'sales' | 'customer-service' | 'customer-insights' | 'contact-center' | 'field-service'`), `productName`, `productPath` (länk tillbaka till produktsidan)
- Behåll `COMMON_ROWS`-helpern men en variant per produkt (priser/implementationstid skiljer sig markant mellan t.ex. BC och F&SCM)

### 2. Slug-konvention
Behåll `/jamfor/{slug}/` – nya slugar t.ex.:
`fscm-vs-sap`, `fscm-vs-infor-m3`, `sales-vs-salesforce`, `sales-vs-hubspot`, `customer-service-vs-zendesk`, `customer-service-vs-servicenow`, `customer-service-vs-salesforce-service-cloud`, `customer-insights-vs-salesforce-marketing-cloud`, `customer-insights-vs-hubspot`, `contact-center-vs-genesys`, `contact-center-vs-nice-cxone`, `contact-center-vs-puzzel`, `contact-center-vs-telia-ace`, `field-service-vs-salesforce-field-service`.

### 3. Uppdatera sidor
- `ErpComparisonPage.tsx`: Använd dynamisk produktreferens (titel, summary, "Tillbaka till {produkt}"-länk). Disclaimer + 7 000-tilläggsraden behålls (men ISV-meningen anpassas per produkt – Salesforce AppExchange osv. skrivs in på konkurrentsidan).
- `ErpComparisonsHub.tsx`: Gruppera kort per produkt (sektioner: ERP / Sales / Customer Service / Marketing / Contact Center / Field Service).
- Döp om `/jamfor/` (ErpComparisonsHub) `title` + intro till "D365-jämförelser" istället för ERP-specifik.

### 4. Kunskapscenter-integration
I `src/data/knowledgeHubs.ts`:
- Behåll BC-hubbens 6 ERP-jämförelser
- Lägg till motsvarande "Konkurrentjämförelse"-block i hubbarna för Sales, Customer Service, Customer Insights, Contact Center, Field Service och F&SCM
- Helper `erpComparisonsAsResources` generaliseras till `comparisonsAsResources(productKey)`

### 5. Routing & sitemap
- `App.tsx`: route `/jamfor/:slug/` finns redan, träffar nya slugar automatiskt
- SSG: lägg till nya slugar i `partnerRoutes.json` / motsvarande prerender-lista
- `sitemap-jamfor.xml`-generatorn plockar upp alla från `productComparisons.ts`

### 6. Innehållskvalitet
Varje jämförelse innehåller (oförändrat mot dagens struktur):
- Köparsidig intro
- "Bäst för"-bullets för båda sidor
- 10 strukturerade tabellrader (arkitektur, licens, impl-tid, impl-kostnad, ISV, MS365-integration, AI, lokal redovisning/lokalisering, internationell, partnernätverk)
- "När passar inte X" för båda
- 4–6 FAQ:s (driver FAQPage-schema)
- Disclaimer-block (priser/funktioner ändras över tid)

För **Puzzel** och **Telia ACE** noteras särskilt nordiskt/svenskt fokus, lokal support och eventuell PTS/myndighetspositionering – det är deras huvudsakliga differentiator vs Microsoft.

### 7. Disclaimers
Alla nya sidor får samma disclaimer som BC-jämförelserna idag. För Contact Center och Field Service läggs en extra notering om att Microsoft fortfarande utvecklar produkterna snabbt (Contact Center är ung; Field Service har genomgått stora UI-omarbetningar).

## Arbetsordning (i en följd, ingen mellandialog)

1. Refaktorera datamodellen + befintliga 6 BC-jämförelser till nya fältnamn (rent omdöp – ingen innehållsförändring).
2. Lägg till alla 13 nya jämförelser i `productComparisons.ts`.
3. Uppdatera `ErpComparisonPage.tsx` + `ErpComparisonsHub.tsx` (gruppering per produkt, dynamiska "tillbaka till produkt"-länkar).
4. Lägg till comparisons i 5 nya kunskapscenter-hubbar.
5. Verifiera build.

## Omfattning

Stort innehållsarbete – ca 13 × (10 rader + 4–6 FAQ + intro/limits) ≈ 2 000–2 500 rader ny data. Inga nya beroenden, ingen DB-migration, endast frontend/SSG.
