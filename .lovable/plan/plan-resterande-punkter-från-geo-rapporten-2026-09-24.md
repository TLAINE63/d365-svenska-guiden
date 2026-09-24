# Plan: Resterande punkter från GEO-rapporten

Punkten om Schema.org-märkning är redan åtgärdad och syns i rapporten efter publicering. Den här planen gäller de fyra punkter som är kvar, plus den svagaste kategorin (Innehållsrikedom, 33 %). Alla ändringar gäller startsidan.

## 1. Läsbarhet (meningslängd), hög prioritet
- Jag delar meningar på mer än cirka 20 ord i den synliga texten och i den text som AI-motorer läser. Det gäller hero, situationskort, FAQ-svar och ingressen.
- Budskap, siffror och sökord ändras inte. Textreglerna gäller som vanligt: inga långa tankestreck och "Dynamics 365" alltid på samma rad.

## 2. Källhänvisningar och externa länkar, medel
- Jag lägger till en kort ruta "Källor" med 3 till 5 länkar till Microsofts egna officiella sidor: Microsoft Learn för Dynamics 365, Microsofts prislista och Microsofts partnerkatalog.
- Befintliga sifferpåståenden på startsidan, till exempel "Business Central från 765 kr", får en källhänvisning.
- Länkar till partners webbplatser läggs inte till, enligt regeln om förmedlad kontakt.

## 3. Innehållsfärskhet, medel
- Jag lägger till en synlig rad "Senast uppdaterad ÅÅÅÅ-MM-DD" på startsidan.
- Samma datum läggs in som dateModified i sidans strukturerade data. Datumet ändras manuellt vid innehållsändringar, så det signalerar inte falsk färskhet.

## 4. Innehållsrikedom (33 %)
- Jag lägger till en kompakt jämförelsetabell med ERP- och CRM-apparna: app, typ av företag och startpris med källa. En tabell är lätt för AI att citera.
- Befintliga ikoner och bilder får beskrivande alt-texter.

## Utanför planen
- Punkterna Innehållsdjup och Auktoritet kräver mer text eller omnämnanden från andra sajter. Jag tar dem i en senare runda om du vill.

## Tekniskt
- Filer: src/pages/Index.tsx, NoscriptSEO-texten, homeFaqs och SEOHead (stöd för dateModified).
- Källrutan använder SourceNote och uppgifterna i src/data/organization.ts, enligt befintlig konvention.
- Kontroll: sidan hämtas lokalt efter ändringarna. Jag kontrollerar att inga meningar är längre än 25 ord och att dateModified och de externa länkarna finns. Typkontroll körs.
