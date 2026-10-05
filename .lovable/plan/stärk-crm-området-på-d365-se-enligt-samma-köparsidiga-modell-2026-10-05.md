# Stärk CRM-området på d365.se enligt samma köparsidiga modell som ERP

Prioritering: besökarvärde → köpresa → konvertering → SEO/GEO/AIO. Ingen ny parallell funnel och inga tunna sökordssidor.

**Avvikelse från underlaget:** texten använder "oberoende" på flera ställen. Det följer din stående regel att inte använda ordet i publik copy. Vi skriver "köparsidig" i stället.

## Vad som redan finns (återanvänds)
- 14 neutrala CRM-jämförelser under /jamfor/: Sales mot Salesforce och HubSpot, Customer Service mot Zendesk, ServiceNow och Salesforce, Customer Insights mot Salesforce och HubSpot, Contact Center mot Genesys, NICE, Puzzel och Telia ACE samt Field Service mot Salesforce.
- Den nya gemensamma sidan för CRM-partners, CRM-matchningstestet, behovsanalyser, kravspecifikationer, Min D365-plan och de sammanhangsanpassade knapparna.

## 1. /crm/ blir huvudguiden för CRM
- Ny huvudrubrik: "CRM-system – så väljer svenska företag rätt CRM".
- Ny ordning på sidan:
  1. Kort svar
  2. Vilka problem ska CRM lösa?
  3. Typer av CRM-plattformar (sviter, säljfokuserade, marketing-first, kundservice-first)
  4. Vad avgör valet?
  5. Vad kostar CRM typiskt?
  6. När passar Dynamics 365, och när bör ni hellre titta på alternativ?
  7. D365.SE:s bedömning
  8. Dynamics 365-apparna, med en ingång per köparproblem
  9. Jämförelser
  10. Partners
  11. Nästa steg
- Dagens innehåll om produktfamiljen behålls men flyttas längre ner på sidan.

## 2. Produktsidorna utgår från köparens problem
Gäller Sales, Customer Service, Field Service, Customer Insights och Contact Center.
- Varje sida får en ny första del direkt efter det korta svaret:
  - När passar den här typen av lösning, och när passar den inte?
  - Vilka alternativ finns?
  - Vad avgör valet?
  - D365.SE:s bedömning
- Därefter kommer funktioner, kostnad och implementation, partners och nästa steg.
- Rubriker och ingresser får de ord köpare använder, till exempel:
  - Sales: säljsystem, CRM för B2B och säljpipeline
  - Customer Service: kundservicesystem, ärendehantering och omnikanal
  - Field Service: fältservicesystem och teknikerplanering
  - Customer Insights: marketing automation och CDP
  - Contact Center: kontaktcentersystem och CCaaS
- Microsofts produktnamn behålls tydligt.
- Varje sida länkar till sina befintliga jämförelser i en synlig ruta, "Jämför med alternativ".

## 3. Få men starka generiska ingångar
Ett tunt sidträd byggs inte. I stället:
- **/crm/** täcker CRM-system, CRM för B2B och CRM för försäljning.
- **Ny guide: /kundservicesystem/**, "Hur väljer ni kundservicesystem?". Den täcker kundservice, ärendehantering och kontaktcenter, och leder vidare till Customer Service och Contact Center.
- **Ny guide: /faltservicesystem/**, "Hur väljer ni fältservicesystem?". Den leder vidare till Field Service.
- Marketing automation och CDP täcks av Customer Insights-sidan, som skrivs om för det köparproblemet. Ingen egen sida.

## 4. Jämförelserna lyfts fram
- Jämförelsesidan /jamfor/ får en egen CRM-sektion, grupperad efter köparproblem.
- Befintliga jämförelser kompletteras där de saknar något av följande:
  - var Dynamics 365 är svagare
  - integrationskonsekvenser
  - hur komplex implementationen är
  - partner- och ekosystemfrågor
- Inga nya jämförelser i den här omgången.

## 5. Menyn
- "Marknad, Sälj & Service" byter namn till **"CRM – Sälj, Marknad & Service"**, både på dator och mobil.
- Menyn länkar CRM-guiden överst, därefter de två nya guiderna och apparna.

## 6. Källattribuering
- Avsändarmodulen, "D365.SE:s bedömning" och "Källor och metod" läggs på alla CRM-sidor som saknar dem. Bara verkliga datum används.
- Bedömningarna skrivs manuellt per sida, aldrig automatiskt.
- Inga AI-märken och ingen upprepning av varumärket.

## 7. Egen marknadsdata: "Svenska Dynamics 365 CRM-marknaden"
- En ny sektion på CRM-partnersidan räknas fram ur partnerdatan när sajten byggs, inte när sidan visas:
  - antal verifierade partners per app (Sales, Customer Service, Field Service, Customer Insights, Contact Center)
  - vanligaste branscherna
  - typisk kundstorlek
  - geografisk täckning
  - stöd för implementation och förvaltning
- Siffrorna visas i en HTML-tabell med metodtext och datum.
- Samma siffror finns som maskinläsbar data (Dataset) och som en JSON-fil.
- Underlaget är bara publicerade partners. Det anges tydligt, så att siffrorna inte ser ut att täcka hela marknaden.

## 8. Koppling till befintlig köpresa
Knapparna anpassas efter sida, utan nya flöden:

| Sida | Knapp | Leder till |
|---|---|---|
| /crm/ | "Se vilken typ av CRM som passar er" | CRM-matchningstest |
| Sales | "Bedöm om Dynamics 365 Sales passar ert behov" | Sales-behovsanalys |
| Customer Service | "Bedöm ert kundservicebehov" | Kundservice-behovsanalys |
| CRM-partnersidan | "Jämför CRM-partners för ert behov" | |
| Sidor med hög köpintention | "Få hjälp att hitta rätt partner" | |

Svar som besökaren redan gett i Min D365-plan återanvänds som idag.

## Innehåll som behöver din granskning
Jag skriver ett utkast till följande. Det är redaktionella texter, så läs dem innan du publicerar:
- nya texter på /crm/
- de två nya guiderna
- avsnitten om när en lösning passar och när den inte passar
- bedömningarna

Inga priser eller siffror hittas på. Priser hämtas från den befintliga prislistan och marknadssiffror från partnerdatan.

## Tekniska detaljer
- `src/pages/CRM.tsx`: ny sektionsordning och ny huvudrubrik. Rubrikerna styrs via `guideHeadings.ts`.
- `D365Sales`, `D365CustomerService`, `D365FieldService`, `D365Marketing` och `D365ContactCenter`: ett gemensamt komponentblock, `BuyerFitSection`, med fyra delar: passar, passar inte, alternativ och vad som avgör. Innehållet ligger i en ny datafil, `crmBuyerFit.ts`.
- Nya sidor `Kundservicesystem.tsx` och `Faltservicesystem.tsx` får routes i App och entry-server, plus sitemap, kritisk SEO-check och Footer.
- `editorialAssessments.ts`: nya nycklar för service, field, insights, contact och crm-guiden.
- `scripts/generate-crm-market-data.mjs` körs i prebuild och läser partnerData.json. Det skriver `src/data/crmMarket.json` och `public/data/crm-marknaden.json`. Komponenten `CrmMarketSection` lägger till Dataset-schema.
- `ErpComparisonsHub`: CRM-gruppering. Jämförelsetexterna i `erpComparisons.ts` kompletteras.
- `Navbar.tsx`: ny etikett och länkordning. Etiketten "CRM-partners" behålls i sidfoten.
- Kontextuella knappar via `ctaJourney.ts` och `ContextualCta`-props.
- Regeln läggs in i AGENTS.md: CRM-sidor följer köparproblem först och produkt sedan.
