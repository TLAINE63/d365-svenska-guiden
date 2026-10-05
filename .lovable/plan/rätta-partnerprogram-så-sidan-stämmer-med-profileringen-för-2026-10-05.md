# Rätta /partnerprogram så sidan stämmer med profileringen för BC, F&SCM och CRM

## Vad som inte stämmer idag

1. **CRM-området beskrivs olika.** Sidan säger ibland "Sales och Customer Service", ibland även Field Service. I profileringen hör Customer Service, Field Service och Contact Center ihop i samma CRM-grupp, och Marketing finns också med.
2. **"Uppdateringar genomförs inom 3 arbetsdagar".** Publicerade partners ändringar syns direkt (ditt beslut 2026-09-29). Bara opublicerade partners väntar på granskning.
3. **"Kompetens, branscherfarenhet och kundcase är granskade".** Eftersom publicerade partners ändringar publiceras direkt stämmer "granskade" inte helt. Det ska stå att partnern själv har verifierat uppgifterna.
4. **"Vilka projekt ni är bäst lämpade för".** Frågan om särskilda projekt och leveransformer ställs inte längre i profileringen. Texten ändras till att handla om typiska kunder och projekt i partnerns egen beskrivning, alltså det som faktiskt efterfrågas.
5. **Produktlistorna nämner Power Platform och Copilot** som om de vore egna produktområden. I profileringen är de förmågor som läggs till ovanpå BC, F&SCM eller CRM. De ska inte räknas som produktområden i priset.
6. **Pris (behöver ditt svar).** Sidan säger 995 / 1 595 / 1 995 kr för 1 / 2 / 3 produktområden. En äldre anteckning säger 1 990 kr per produktområde. Jag ändrar ingenting här förrän du bekräftat vilket pris som gäller.

## Ändringar

- Samma beskrivning av de tre produktområdena överallt på sidan: **Business Central**, **Finance & Supply Chain Management (F&O)** och **CRM (Sales, Customer Service, Field Service, Contact Center och Marketing)**. Power Platform, Copilot och AI-agenter beskrivs som förmågor man kan lägga till.
- Under Så går det till och Ingår: "Publicerade partners ändringar syns direkt. Nya profiler granskas av d365.se innan de publiceras." Raden om 3 arbetsdagar tas bort.
- Under Partners med partnerverifierad profil: "kompetens, branscherfarenhet och kundcase är verifierade av partnern själv".
- Formuleringen om projekt ändras enligt punkt 4.
- Svaret under Vad kostar ... ändras till "CRM räknas som ett produktområde", men bara om priset gäller.

## Tekniska detaljer

- Bara texter i `src/pages/Partnerprogram.tsx` ändras (frågor och svar, produktlistorna kring rad 367, 469, 478 och 544, steg och Ingår kring rad 680 till 703, rad 726).
- Listan över verifierade partners hämtas redan automatiskt från de publicerade partnerna och ändras inte.
- Inga em dash, och "Dynamics 365" hålls på samma rad.
