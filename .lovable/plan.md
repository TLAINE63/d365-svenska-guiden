# ISV-katalog: flera produkter per leverantör

## Mål
Hantera leverantörer som har många lösningar, för både Business Central och Finance & Supply Chain Management, utan att tappa sökbarheten per lösning.

Tre delar:
1. Katalogen grupperar korten visuellt per leverantör.
2. Katalogen täcker hela Dynamics 365, inte bara BC, med produktfilter.
3. Nya lösningar kan läggas in direkt i admin (databas) istället för i kod.

## 1. Gruppering per leverantör
Varje lösning förblir en egen post och ett eget kort – ingen sammanslagning.

- I katalogen läggs ett läge "Gruppera per leverantör" till (på som standard när en leverantör har fler än en lösning).
- Leverantörer med flera lösningar visas under en rubrikrad: leverantörsnamn, antal lösningar, länk till leverantörens webbplats.
- Leverantörer med en enda lösning visas som idag, i ett avsnitt "Övriga lösningar", så listan inte fylls av enradsrubriker.
- Leverantörsnamnet tas från det uppdaterade namnet i admin när det finns, annars katalogens standardnamn.

## 2. Gemensam Dynamics 365-tilläggskatalog
- Ett produktfilter överst: Business Central, Finance & Supply Chain, Sales, Customer Service, Field Service, Project Operations, Commerce, Human Resources, Customer Insights.
- Varje lösning har redan ett produktfält; lösningar utan angivna produkter tolkas som Business Central så inget försvinner ur dagens vy.
- Nuvarande URL `/kunskapscenter/business-central-tillagg` behålls oförändrad och är förfiltrerad på Business Central (viktigt för SEO och befintliga länkar).
- Ny sida `/kunskapscenter/dynamics-365-tillagg` visar hela katalogen med produktfiltret öppet. Egen title, meta description och strukturerad data.
- Interna länkar från F&SCM-sidorna och kunskapscentret pekar till den nya vyn förfiltrerad på F&SCM.

## 3. Skapa lösningar i admin
Idag ligger själva lösningarna i kod och bara texterna i databasen. Det byggs om så att nya lösningar kan skapas utan kodändring.

- Admin → Leads & Partners → ISV-katalog får knappen "Ny lösning" med fälten: namn, leverantör, kort beskrivning, kategori, typ, produkter, branscher, webbplats, återförsäljare.
- Nya lösningar sparas i databasen och slås ihop med den befintliga kodkatalogen vid visning. Kodposterna rörs inte.
- Lösningar kan döljas/avpubliceras i admin i stället för att raderas.
- Profileringslänkar fungerar likadant för nya lösningar: en länk per lösning, kontaktuppgifter per lösning (enligt tidigare beslut).
- Praktiskt arbetsflöde för en leverantör med tio produkter: lägg upp lösningarna i admin, skicka sedan en profileringslänk per lösning till samma kontaktperson.

## Teknisk detalj
- Databas: ny tabell `isv_solutions` för admin-skapade lösningar (samma fältnamn som `IsvSolution`), med publikt läsbara rader och skrivning endast via edge-funktion. Befintlig `isv_solution_overrides` behålls för texter på kodkatalogens poster.
- `useIsvSolutions` utökas till att slå ihop `BC_ISV_SOLUTIONS` + `isv_solutions` + overrides. Statisk katalog är fortsatt fallback så SSG-renderingen inte tappar innehåll.
- `manage-isv-solutions` får `create`, `update` och `toggle_published` utöver dagens `save`/`reset`.
- `BcIsvCatalog` får produktfilter och grupperingsvy; komponenten återanvänds av båda sidorna med olika förvalt filter.
- `_shared/isv-context.ts` (AI-sök och chatbot) läser samma sammanslagna lista så nya lösningar automatiskt blir sökbara.
- Sitemap och prerender-rutter kompletteras med den nya katalog-URL:en.
