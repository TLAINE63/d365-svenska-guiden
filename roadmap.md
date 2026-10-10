# Roadmap – tydligare skillnad Grundprofil / Partnerverifierad profil

## Sammanhängande premiumdesign på partnerprofiler (2026-10-07)
- [x] Behåll godkänd inledning och samordna följdsektionernas bredd, marginaler och typografi
- [x] Använd ljusa, sammanhängande sektioner utan att ändra innehåll eller funktioner
- [x] Kontrollera profilen och befintliga interaktioner i webbläsaren

Verifierat på Vivicta: inledning, köparöversikt, analys, källor och produktdel har identiska 1152 px innehållsramar vid 1280 px. Mobil 390 px utan sidöverbredd. Analys öppnas, produktflik byts och introduktionsformulär öppnas utan att något skickas. Grundprofil saknar premiumramen. Två riktade tester godkända, automatisk byggkontroll godkänd och inga runtimefel. Ingen publicering.

## Premiuminledning på publicerade partnerprofiler (2026-10-07)
- [x] Välj färger, typografi och upplägg samt tre visuella förslag (förslagen avböjdes, byggt direkt från önskemålet)
- [x] Utforma de två första skärmbilderna med köparens viktigaste beslutsunderlag
- [x] Behåll partneruppgifter, källskillnader och befintliga köpresesteg samt verifiera resultatet

Verifierat: alla 17 publicerade profiladresser visar inledningen utan runtimefel. Shortlist består efter omladdning, jämförelseval uppdateras, frågeknapp går till /fraga/ och introduktionsknappen öppnar befintligt formulär (ingen förfrågan skickad). Grundprofilen Enqore oförändrad. Dator och mobil 390 px kontrollerade utan överbredd i inledningen. Två nya översiktstester godkända; tre äldre PartnerQuickFacts-tester fallerar i den oförändrade komponenten. Ingen publicering.

## Kontextuell köpresa och Min D365-plan (2026-10-04)
- [x] Anpassa nästa steg efter ERP/CRM, produktjämförelse, partner och migration
- [x] Samla befintliga val i Min D365-plan med produktområde, bransch, storlek, behov och nästa steg
- [x] Gör befintliga Fit Models användbara för egen behovskartläggning utan automatiska poäng
- [x] Behåll neutrala ERP/CRM-vägar och verifiera sparade val, nästa steg och mobil/dator

Verifierat: verkliga bransch-, storleks-, produkt-, integrations- och migrationssvar samt mål sparas och läses tillbaka. ERP/CRM och produktjämförelsen behåller neutrala nästa steg trots tidigare produktval. Partnerjämförelsen förifylls, rensning består efter omladdning och modellprioriteringar sparas även på mobil. Playwright vid 1280/390 px utan runtimefel; ingen sidöverbredd i planen. Ingen publicering.

## Människan först i köpguiden (2026-10-04)
- [x] Integrera kort svar, bedömning och avsändare med diskretare gemensam presentation
- [x] Behåll modeller, tabeller, källor och semantik utan att de dominerar läsflödet
- [x] Kontrollera befintliga nästa steg samt läsbarhet på dator och mobil

Verifierat: 48 riktade tester godkända; ERP, CRM, Business Central och partnerkatalogen kontrollerade vid 1280/390 px utan runtimefel. Alla tre modeller öppnas och stängs med mus/tangentbord och tabellerna finns kvar i HTML, med lokal horisontell skrollning på mobil. Business Central-knappen öppnar Kom igång med produktförval och synlig branschfråga utan e-postkrav. Källblocken och avsändaren finns kvar där de fanns tidigare. Automatisk byggkontroll godkänd. Ingen publicering.

## Frågebaserad rubrikarkitektur (2026-10-04)
- [x] Frågebaserad H1 och Kort svar i viktiga guider
- [x] Tydliga H2/H3 för val, jämförelse, risker, kompetens och nästa steg
- [x] Testa rubrikhierarki och kontrollera dator/mobil; artikelarkivet lämnas oförändrat

Verifiering: 20 riktade regressionstester godkända; 14 guider kontrollerade vid 1280 och 390 px utan runtimefel. Befintligt mobilöverflöde på ERP och Business Central kvarstår; även F&O har observerat överflöde utanför de nya rubrikerna. Partnerlistornas ankare, filter och kontaktflöden bevarade. Ingen publicering utförd.

## Källor och metod i guider (2026-10-04)
- [x] Återanvändbart källblock med extern fakta, partnerunderlag och redaktionell analys
- [x] Integrera i guider och artikelmallar utifrån befintliga hänvisningar
- [x] Verifiera källor, tomt underlag och synlig visning

- Verifierat: 4 komponenttester; 12 representativa sidor i webbläsare utan runtimefel; mobilblock 390 px utan överflöde.
- Full testsuite: 780 godkända, 118 underkända, 2 hoppade över. Underkända kontroller gäller andra områden (bl.a. SEO-texter, legacy-redirect och partnerfakta); inte ändrade inom detta uppdrag.

## Förklarande partnerlistor och D365.SE-modeller (2026-10-04)
- [x] Gemensam urvalsförklaring ovanför publika partnerlistor
- [x] Strukturerade partneruppgifter utifrån befintliga belägg
- [x] Partner Fit Model, ERP Fit Model och CRM Fit Model som transparenta matriser
- [x] Kontrollera urval, modeller och kort på dator och mobil

Verifiering: fem faktatester passerar; automatisk byggkontroll godkänd. Webbläsarkontroll på startsida, partnerkatalog, CRM, ERP och Business Central i 1280 och 390 px utan sidfel. Katalog, startsida och CRM utan horisontellt överflöde; ERP och BC har kvar tidigare rapporterat mobilöverflöde utanför den här ändringen. Hela testsamlingen är inte grön: 776 passerade, 118 misslyckades och två hoppades över, bland annat äldre SEO-, redirect- och situationskortstester. Ingen publicering utförd.

## D365.SE:s bedömning (2026-10-04)
- [x] Sidvisa köparslutsatser på ERP, CRM, Business Central, F&O och kostnadsguiden
- [x] Enhetlig synlig avsändare och kontroll på dator och mobil

## Tydlig avsändare (2026-10-04)
- [x] Gemensam avsändarmodul på redaktionella guider, partnerguider, jämförelser och branschsidor
- [x] Visa verkliga uppdateringsdatum och markera saknade granskningsuppgifter
- [x] Kontrollera täckning, semantisk HTML och läsbarhet på dator och mobil

## Månadsbrev i Redaktion (2026-10-01)
- [x] Ta bort besöksstatistiken för d365guide.com ur septemberbrevet
- [x] Beskriv d365guide.com endast som en ny nordisk sajt
- [x] Lägg månadsbrevets testutskick som en egen flik på `/redaktion`
- [x] Förhandsgranskning och testutskick fungerar även med redaktörsinloggning (expertutskick förblir admin-only)

## Förenklad BizApps-profil (2026-09-29)
- [x] Slå ihop Copilot Studio och AI-agenter till en tvärgående förmåga
- [x] Slå ihop projekttyper och leveransmodeller till en fråga med endast särskiljande val
- [x] Ta bort fem gemensamma ERP-basval från BC och F&SCM
- [x] Samla Power Apps, Power Automate, Power Pages och Dataverse under Power Platform
- [x] Bevara historik och verifieringsmetadata vid sammanslagningen
- [x] Uppdatera profileringsflöde, förifyllning och dokumentation

- [x] Basickort: rubrik "GRUNDPROFIL – EJ PARTNERVERIFIERAD" + ny förklaring
- [x] Basickort: ny text för partner-CTA ("Granska, korrigera och komplettera profilen…")
- [x] Partnerverifierad profil: rubrik + förklaring om profileringsavtal, ingen kvalitetscertifiering, ingen köpt fördel
- [x] Partnerprofil: tydlig avsändare – "Partnerns information" vs "d365.se:s analys"
- [x] Basic-profiler: redaktionella regler i AI-prompter + adminvarning (superlativ, namngivna konkurrenter)
- [x] /agande-och-intressen: ta bort "valt att delta"/"deltagaravgift", ny modelltext
- [x] /partnerprogram: konsekvent terminologi + rankingformulering
- [x] Rankinglogik: ingen dold vikt för verified/paid/profiled
- [x] "Alla relevanta partners" → säkrare formuleringar
- [x] Dataskyddspolicy: avsnitt om kontaktpersoner/experter hos partners
- [x] Footer: Företagsinformation (bolag, org.nr, moms, adress, e-post, telefon)
- [x] Microsoft-disclaimer bevarad/förstärkt
- [x] Global sökning efter gamla formuleringar

Öppet: org.nr, momsreg.nr och postadress för Dynamic Factory saknas i koden – behöver fyllas i.

## Uppdatering 2026-09-03 (transparenspaket)
- [x] Basic-CTA/body till "Granska, korrigera och komplettera profilen ..."
- [x] Partnerverifierad-förklaring på partnerprofil + källmärkning av d365.se:s analys
- [x] Partnerprogram: terminologi, ranking-formulering, kartläggningstext
- [x] Global textsökning verifierad/alla relevanta – ersatt
- [x] Rankinglogik: agreement_signed-bonus borttagen i suggestPartners.ts och crmMatchingPartners.ts
- [x] Dataskyddspolicy: nytt avsnitt om kontaktpersoner/experter
- [x] Footer: Företagsinformation (org.nr/VAT/postadress renderas när värden fylls i organization.ts)
- [ ] Saknas: faktiskt organisationsnummer, momsregistreringsnummer och postadress för Dynamic Factory

## Månadsrapport v2 (partner) – 2026-09-03
- [ ] Steg 0: inventering av rapportkod (redovisad, inväntar godkännande)
- [ ] Steg 1: nya beräkningar (aktiva profiler, median/snitt/placering/andel, 6 mån historik, förändring, besökande företag SE/övriga, företagsantal från tabellen)
- [ ] Steg 1b ANONYMITET: inga företagsnamn/domän/IP/ort i JSON eller HTML; grova storleksintervall (1-50/51-200/201-1000/1000+); undertryck rader med <2 företag → "Övriga branscher"; ta bort senaste besöksdatum; bransch från fast kodlista; fast integritetstext ovanför blocket
- [ ] Steg 2: ny layout A–H (ingress, huvudsiffra, urvalstratt, utveckling, jämförelsetabell utan "Alla profiler (summa)", företagsblock, synlighetsråd, "Det här hände på d365.se")
- [ ] Steg 3: dölj sektioner utan data (aldrig synliga nollor)
- [ ] Steg 4: server-side verifiering med curl/jq/grep + PDF-format

## Basicutskick v2 (2026-09-03)
- [x] Steg 0: inventering av basicutskick (redovisad, väntar godkännande)
- [ ] Steg 1: nya beräkningar (missade matchningar, basickortstrafik, referensvärden, nisch, profiltext, nedräkning)
- [ ] Steg 2: ny layout A-I
- [ ] Steg 3: felsäkring/skipped-status
- [ ] Steg 4: curl-verifiering + json/html/pdf-format
- [x] PDF av partnerkort Fellowmind + Accigo

## ISV-tillägg i verktygen (2026-09-07)
- [x] CE-underlag importerat i den gemensamma katalogen
- [x] ISV-tillägg valbara i kravspecifikation (ERP, Sales, Customer Service, Customer Insights) – följer med i PDF och underlag till partners
- [x] ISV-tillägg valbara i behovsanalysen – egen sida i PDF
- [x] Förslag baserat på produkt, bransch och valda funktionsområden (src/lib/isvSuggestions.ts)
- [x] ISV-tillägg med i jämförelsen BC vs F&SCM

## Köpresa och partnerjämförelse på startsidan (2026-09-08)
- [x] Förbättra hero med resultatinriktad ingress och dynamiska förtroendepunkter
- [x] Bygg om befintligt processblock med ikoner och placera det före statistiken
- [x] Förtydliga partnergridet som kortlistebyggare
- [x] Förfina sticky jämförelsepanel för 1–3 valda partners
- [x] Lägg avslutningsblock direkt efter partnerlistan
- [x] Uppdatera relevant mikrocopy på startsidan och verifiera mobil/desktop

## Expertkompetensutskick (2026-09-24)
- [x] Gör "Expertkompetensprofiler" till en egen, större och fet rad i mejlet
- [x] Skicka ett separat mejl för varje verifierad partner till thomas.laine@dynamicfactory.se

## Kom igång på startsidan (2026-09-24)
- [x] Lyft den interaktiva Kom igång-guiden direkt efter startsidans första del
- [x] Kontrollera desktop, mobil och direktlänken till /kom-igang/

## Kom igång som primär konverteringsmotor (2026-09-24)
- [x] Förval och mätning i Kom igång-flödet
- [x] Primär Kom igång-ingång i desktop- och mobilmenyn
- [x] Resultat med Jämför, Fråga d365.se och Be om introduktion
- [x] Samma tre beslutsvägar på partnerprofiler
- [x] Kontextuell CTA på produkt-, bransch-, jämförelse- och partnerlistsidor
- [x] Kontextuell CTA i guider och kunskapscenterartiklar
- [x] Mobil-, desktop- och flödeskontroll utan dubbla CTA:er

## Kompaktare Kom igång-steg (2026-09-29)
- [x] Bredda alla valsteg och rym branschvalen utan skrollning på vanlig dator
- [x] Kontrollera samtliga steg på dator och mobil
- [x] Låt Ändra urval öppna steg ett högst upp
- [x] Visa sju branscher per rad och håll samma frågeformat med sidfoten under skärmen

## Partnerns målgrupp i AI-bedömningar (2026-09-28)
- [x] Låt partnerns egen text om typiska kunder styra segmentetiketten i snabböversikten
- [x] Lägg samma källprioritet i AI-underlagen för sammanfattning, lämplighet och avgränsning
- [x] Synka befintliga publicerade målgruppsbedömningar mot partnernas egna texter
- [x] Verifiera Implema på mobil och dator samt kontrollera källunderlag för publicerade BC-, F&SCM- och CRM-profiler

## Nya grundprofiler (2026-09-28)
- [x] Lägg till Bedege från företagets publika information
- [x] Lägg till Effekt från företagets publika information
- [x] Verifiera att båda visas bland partners och på egna grundprofiler

## Rika delningsförhandsvisningar (2026-09-28)
- [x] Behåll full Open Graph- och Twitter-metadata för bloggartiklar och kunskapsartiklar
- [x] Förgenerera publicerade Partnernytt-artiklar med egen titel, beskrivning, URL och bild
- [x] Förgenerera events med eventets titel, beskrivning, arrangör, datum och bild
- [x] Verifiera metadataregler, typkontroll och byggstatus
- [ ] Publicera ändringen (inväntar att projektet publiceras)

## Premiumkort för verifierade partners i branschfilter (2026-09-29)
- [x] Separera partnerns egna uppgifter, belagda styrkor och d365.se:s AI-bedömning
- [x] Lägg till branschspecifik relevans, kontrollpunkt, produktområden, leveransområde och tydlig profillänk
- [x] Verifiera kortet på dator och mobil

## Gemensamt profilkort för verifierade partners (2026-09-29)
- [x] Visa produkter och särskilda styrkor på `/partners-per-bransch/`
- [x] Visa samma korttyp på `/alla-d365-partners/`
- [x] Visa samma korttyp på startsidan i ”Så hittar du rätt partner”
- [x] Kontrollera de tre ytorna på dator och mobil

## Premiumkort på produktsidor (2026-09-29)
- [x] Visa gemensamt premiumkort på Business Central-sidan
- [x] Visa gemensamt premiumkort på Finance & Supply Chain-sidan
- [x] Visa gemensamt premiumkort på CRM-sidan
- [x] Ge alla premiumkort CTA för profil, shortlist och introduktion
- [x] Kontrollera produktsidorna och CTA-flödena på dator och mobil

## Rollstyrd vägledning under Guider (2026-09-29)
- [x] Lägg Välj din roll under Guider i dator- och mobilmenyn
- [x] Skapa `/roller/` med VD, CFO, COO och IT-chef
- [x] Återanvänd befintliga områden, guider och partnerlistor
- [x] Mät visningar, rollval och vidare klick anonymt
- [x] Kontrollera alla fyra roller på dator och mobil

## Månadsbrev ersätter partnerrapporter (2026-10-01)
- [x] Ett utskick med bara nyhetsbrevets innehåll, förhandsgranskning per partner och testutskick till Thomas
- [x] Sökpositioner: Semrush-API pausat (kräver Business-plan + separata API-enheter), körningar kvar som "partial"
- [x] Sökprestanda: GSC (Sverige, dygn) + Bing (veckovis) hämtas dagligen kl 05:40 UTC, grupp-tagging mot fraslistan, verifierat 2026-10-04
- [x] Sökprestanda: Admin-flik "Sökprestanda" (SEO & Konkurrens) med trend per grupp/månad, frasjämförelse mot konkurrenter och CSV-uppladdning (Semrush Organic Positions, kvartalsvis)

- [x] Startsidan "Så hittar du rätt partner": tre faktatexter dolda (Produktområde/Bransch/Storlek/Geografi kvar), verifierat i webbläsare
- [ ] Publicera (grundprofil-länkar + startsidesfix)

## Sprint 1 kortlista till förfrågan (2026-10-08)
- [x] Visa e-post, telefon och webbplatslänk överst på partnerprofilen
- [x] Sprint 1: förfrågan, kortlista, tre profilknappar, mätning, hero, metabeskrivning
- [ ] Sitemap lastmod per sida (redovisat, ej ändrat)

## Sprint 1: startsida och navigation (2026-10-09)
- [x] Ersätt trappan i fyra steg med fyra fristående ingångar på startsidan
- [x] Bygg interaktiv beslutsmodell med fyra hörn och gemensamt beslutsunderlag i mitten
- [x] Flytta beslutsmodellen till sidans första sektion och befintliga hero:n ett steg ned
- [x] AI-bubblan döljs första skärmen så rubriken hålls läsbar på mobil
- [x] Kontrollera startsidan i webbläsaren på dator och mobil
- [ ] Publicera (ändringarna syns på d365.se först efter publicering)

## Sprint 1 del 2 (2026-10-10)
- [x] Konsoliderade startsidan (fyra upprepade sektioner + slut-CTA borttagna)
- [x] Hero utan "Mitt Dynamics-projekt", fyra kort i rad
- [x] Ny huvudmeny + mobilmeny
- [x] "Vad vill ni förbättra?"
- [x] Partnerflödet inventerat (docs/SPRINT1-PARTNERFLODE.md)
- [ ] Publicering (Thomas)
