# BizApps Partner Master Model – MVP

Den här planen ersätter den enklare lösningen från förra steget. Då sparades valen direkt på partnern. Nu delas de upp i partner, produktkatalog och produktprofil, med spårbar verifiering. Inget på businesscentral.se ändras. Ingen matchning, ranking, BC-plan eller leadflöde byggs.

## Inventering (nuläge)
- 88 partners, 18 med avtal, 17 publicerade. Varje partner har ett stabilt id och en slug, och profil-URL:erna ändras inte.
- Produktnamnen finns i dag som fritext på partnern: Business Central, F&SCM, Finance, Supply Chain Management, Sales, Customer Service, Field Service, Customer Insights (Marketing), Contact Center, Project Operations, Commerce och Human Resources. Dessutom finns produktvisa filter för bc, fsc och crm.
- Generell information finns redan på partnern (geografi, orter, storlek, omsättning, branscher, verifiering) och återanvänds som den är.
- Redigering sker i dag på två sätt: partnerns profileringslänk och Admin → Partners. Någon inloggad partnerportal finns inte, så ingen sådan byggs nu.

## Vad som byggs
1. **Produktkatalog.** Normaliserade produkter med stabila nycklar, till exempel `business-central`, `finance`, `supply-chain`, `sales`, `customer-service`, `field-service`, `customer-insights`, `contact-center`, `project-operations`, `commerce`, `human-resources`, `power-platform`, `power-bi`, `copilot`, `copilot-studio`. Varje produkt har en kategori, en aktiv/inaktiv-markering och en sorteringsordning. Befintliga namn mappas till nycklarna. "F&SCM" kopplas till både Finance och Supply Chain.
2. **Partnerproduktprofil.** En profil per partner och produkt (dubbletter spärras). Profilen har status, primär ja/nej, publicerad ja/nej, verifieringsstatus, källa, datum och verifierad av. Profilerna skapas automatiskt från partnerns befintliga produkter och läggs in som "Importerad äldre uppgift" och opublicerade. Befintliga texter rörs inte.
3. **Business Central-modul.** Varje val sparas som en egen rad med värde, verifieringsstatus, källa, källänk och datum:
   - Migreringserfarenhet: 10 val.
   - Kompetensområden: 16 val.
   - Typiska projekt: 8 val.
   - Leveransmodell: 7 val.

   Valen följer exakt din lista, med nya nycklar som `nav`, `visma`, `lager_logistik` och så vidare.
4. **Branschlösningar.** Knyts till en produktprofil. Innehåller namn, beskrivning, branscher, typ (egen, tredjepart eller paket), källänk, partnerverifierad, redaktionellt verifierad, datum och publicerad. 4PS och adbriq flyttas inte automatiskt.
5. **Certifieringar.** Tabellen skapas men lämnas tom.
6. **Verifieringsmodell.** Fem källtyper: `partner_verified`, `editorial_verified`, `public_source`, `legacy_import` och `unverified`. Reglerna kontrolleras i databasen:
   - Verifierad status kräver en källa.
   - Partnerverifierad kräver ett datum.
   - Inaktiva produkter kan inte läggas till.
   - Samma val kan inte förekomma två gånger.

   AI kan inte väljas som källa.
7. **Admin.** En ny flik, "Partnerdata (master)", under Leads & Partners:
   - Välj partner och se den generella informationen (endast läsning) och dess produktprofiler.
   - Öppna Business Central-profilen och kryssa i val. Ange status, källa och länk per val, eller för flera val på en gång.
   - Hantera branschlösningar och publicering.

   Ändringarna sparas via en ny skyddad adminfunktion som kräver samma admininloggning som i dag.
8. **Partnerns profileringslänk.** Rutan "Strukturerad profil" från förra steget finns kvar. Partnerns val sparas nu i den nya modellen som opublicerade förslag med status `partner_verified` och dagens datum. Redaktionen publicerar dem. Partnern kan bara ändra sin egen profil, eftersom länken är knuten till partnern.
9. **Migreringsrapport.** En flik som visar de verifierade partnerna. För varje partner visas:
   - Business Central-profilen.
   - Relevanta fritexter (beskrivning, kundexempel, produktpositionering, leveransprofil).
   - Vilka strukturerade fält som saknas.
   - Senast verifierad.

   Ingenting fylls i automatiskt. Rapporten kan exporteras till CSV.
10. **Exportkontrakt v1.0.** Dokumenteras med datatyp, obligatoriskt, källa, filtrering/BC-plan/matchning tillåten och tomvärde för varje fält. Det byggs också en databasvy med endast publicerade uppgifter och inga kontaktuppgifter, som bara redaktionen kan läsa. Ingen integration byggs.
11. **Städning.** Uppgifter som redan fyllts i på det gamla sättet flyttas över. Därefter tas de gamla fälten från förra steget bort (i dag är de tomma).

## Tester
- Kontroll i databasen av de tio scenarierna: bara BC, BC + CRM, dubblett spärras, opublicerat syns inte i exporten med flera.
- Playwright: befintliga profiler och URL:er, adminfliken går att spara och läsa tillbaka, och profileringslänken sparar.
- Befintliga tester för partnerlistorna körs.

## Leverans
En rapport enligt din lista (14 punkter) i `docs/PARTNER-MASTER-MODEL.md` samt en sammanfattning i chatten. Därefter stoppar arbetet.

## Tekniskt
- Nya tabeller: `product_catalog`, `partner_product_profiles` (unik partner+produkt), `partner_bc_attributes` (profil, attributtyp, värdenyckel, verifieringsfält, unik profil+typ+värde), `partner_industry_solutions`, `partner_certifications`.
- Tabellerna nås bara via adminfunktioner, och publik läsning är stängd tills vidare. Befintlig frontend läser dem inte.
- Tillåtna värden valideras med tabellbegränsningar och triggers.
- Exportvyn heter `export_bc_partner_v1` (security invoker) och läses via en adminfunktion.
