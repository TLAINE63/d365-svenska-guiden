# Var tydlig och konsekvent – benchmark av d365.se

Bedömning mot bildens fyra råd, baserat på genomgång av schema, llms.txt, footer, kontaktsidor och artikeldata.

## 1. Säg samma sak överallt – delvis uppfyllt

Verifierade avvikelser i dag:

- Organisationsnamnet skiljer sig mellan ytorna: schema anger `"name": "D365 Guiden"` med `alternateName` "d365.se"/"Dynamic Factory", llms.txt säger "Dynamic Factory AB (ägare Cloud Ahead AB)", footern skriver "© Dynamic Factory". Ingen `legalName` finns.
- E-post: schema (LocalBusiness) och llms.txt anger `info@d365.se`, medan kontaktsidan och rådgivarsidorna bara visar `thomas.laine@dynamicfactory.se` och `michael.uhman@dynamicfactory.se`.
- Telefon: `+46-72-232-40-60` i schema och llms.txt, `+46 72 232 40 60` på rådgivarsidan – samma nummer men olika format, och Michaels nummer saknas i schema.
- Organization-schemat saknar e-post och adress; LocalBusiness har bara `addressCountry: SE`.

Åtgärd: en enda källa för entitetsdata (`src/data/organization.ts`) som schema, footer, kontaktsida och llms.txt läser eller speglar, med samma namn, legalName, e-post, telefonformat och ägarförhållande överallt.

## 2. Använd ett tydligt språk – i huvudsak uppfyllt

Sajten använder du-tilltal och aktiv röst efter den tidigare konverteringen. Åtgärd här är begränsad: säkerställ att det på nyckelsidor uttryckligen framgår vem som gör vad ("d365.se driver plattformen", "partnern levererar", "du väljer"), särskilt i ingresser på pelarsidorna och i rapporten.

## 3. Verifiera påståenden – största luckan

Källhänvisningar finns i delar av artikeldatan (bl.a. marknadsrapporten, kostnadsdata och vissa fördjupningar) men inte konsekvent. Sifferpåståenden om priser, implementationskostnader och partnerantal saknar på flera ställen synlig källa och datum.

Åtgärd:
- Inventera sifferpåståenden på pelarsidor, kostnadssidor och rapporten.
- Lägg till en återanvändbar käll-/metodruta ("Källa, hämtad datum") under sådana avsnitt, med länk till Microsofts prislistor eller till sajtens egen metodbeskrivning.
- Där ingen källa finns: skriv ut att siffran bygger på d365.se:s egna observationer av den svenska marknaden och när den senast uppdaterades – inga ospecificerade siffror.

## 4. Undvik tvetydighet – mindre åtgärd

Hedgande formuleringar ("kanske", "oftast", "ungefär", "i regel") förekommer i ett tjugotal filer, tätast i `erpComparisons.ts`, `buyerManuals.ts`, `blogArticles.tsx` och `bcMatchningstest.ts`.

Åtgärd: gå igenom dessa filer och ersätt vaga ord med antingen ett konkret intervall ("i 100–250 tkr-spannet") eller en tydlig villkorsformulering ("när X gäller"). Behåll hedging endast där osäkerheten är sann och då med angiven anledning.

## Prioritering

1. Entitetskonsistens (punkt 1) – störst effekt på hur AI-system knyter ihop varumärket.
2. Källor och datum vid sifferpåståenden (punkt 3).
3. Språkstädning av vaga formuleringar (punkt 4).
4. Rollklargöranden i ingresser (punkt 2).

## Behöver ditt svar innan start

- Är `info@d365.se` en brevlåda som faktiskt bevakas? Om inte byter jag till `thomas.laine@dynamicfactory.se` överallt i schema och llms.txt.
- Ska det officiella entitetsnamnet vara "d365.se" (varumärke) med "Dynamic Factory AB" som legalName, eller tvärtom?

## Teknisk sammanfattning

- Ny `src/data/organization.ts` som enda källa; `StructuredData.tsx` (Organization + LocalBusiness), `Footer.tsx`, `ContactUs.tsx` och `public/llms.txt` anpassas efter den.
- Ny liten komponent `SourceNote` för käll- och datumrader, används på kostnads-, pris- och rapportavsnitt.
- Textredigering i `src/data/erpComparisons.ts`, `buyerManuals.ts`, `blogArticles.tsx`, `bcMatchningstest.ts` och `productQA.ts`.
- Inga ändringar i analytics, backend eller partnerdata.
