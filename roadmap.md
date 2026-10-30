# Roadmap – tydligare skillnad Grundprofil / Partnerverifierad profil

## Köparvägar i hero (2026-10-30)
- [x] Sprint 0.9: ny ingress, fyra kort, rådgivarlänk, kort-id och klassificering i mätningen
- [x] Sprint 1.0: kompetenskortet frågar först "Vad söker ni?" (partner, expert/konsult, osäker); ersätter tidigare Sprint 1.1 Kompetensfunneln
- [x] Sprint 1.1: partnersökningen (behov, filter, neutral ordning, två utgångar, mätning)
- [x] Sprint 1.1b: informationsstatus (tre nivåer, filter, sortering), uppdragstyp/leveransform/kompetens, Besök partnern, Standard kostnadsfri på Partnerprogram
- [x] Sprint 1.7: Buyer Assessment Light (resultat före kontakt, Diskutera bedömningen med d365.se, Fortsätt utforska själv, mätning)
- [x] Sprint 1.6: Fortsätt er utvärdering (pilot på 6 sidor, metadata, Få hjälp att bedöma nästa steg, mätning)
- [x] Sprint 1.5: kostnadsresa (Vad påverkar er faktiska kostnad?, Vad vill ni göra härnäst?, Få hjälp att bedöma kostnadsbilden, mätning)
- [x] Sprint 1.4: CRM- eller affärssystem (ERP) börjar med verksamhetsbehov, Det här kan vara relevant att utforska, Få en första bedömning, Prata med d365.se, mätning
- [x] Sprint 1.3: befintlig Dynamics 365 (sex val, Prata med d365.se, Utvärdera partnersamarbetet, mätning)
- [x] Sprint 1.2: expertvägen (kompetens, behov, värde före kontakt, kompetensbehov till d365.se, mätning)

## WP1 Rådgivningsledd partnerintroduktion (2026-10-23)
- [x] Inventera CTA, bokning (PlanContactDialog advisory → submit-inquiry), admin, mätning
- [x] Datamodell: bokning (inquiries), rådgivningsärende, partnerintroduktion, relationer, spärrar
- [x] Gemensam rådgivningskomponent (compact/inline) med transparens och delningsförhandsvisning
- [x] Fyra placeringar: jämförelse, partnerbytesanalys, behovsguide, kalkylator/kravspec
- [x] Adminflik Rådgivning (ärenden, bokningar, introduktioner, relaterade ärenden)
- [x] Mätning: view/click/booking/meeting/introduction, direkta förfrågningar separat
- [x] Tester, webbläsarkontroll, slutrapport (WP2 byggs inte)

## Aktuellt: ett enda arbetsbord i /redaktion/ (2026-10-22)
- [x] Fliken efter Artiklar, kön med Förhandsgranska/Redigera/Publicera/Ignorera
- [x] Publicering i ett beslut med intygad faktakontroll, databasens spärr kvar
- [x] Visa var artikeln sprids automatiskt; block även på /priser/ och /affarssystem/

## Publicering och indexering (2026-10-22)
- [x] Publicera korta beskrivningar och rensad sajtkarta, skicka sajtkartan till Bing
- [x] Skicka sajtkartan till Google Search Console och kontrollera Googles läge


## WP1 Aktuellt (2026-10-22)
- [x] Inventera redaktionen och rapportera återanvändningsplan
- [x] Utöka artikelregistret med Aktuellt-fält, intern bedömningstabell och publiceringsspärr
- [x] Backendfunktion: länkimport, AI-bedömning, granskning/status, framtida kandidatintag
- [x] Flik Aktuellt i /redaktion/ med kö, publicerade, alla, ignorerade/arkiverade
- [x] Publik /aktuellt/ och /aktuellt/:slug med förgenerering och sitemap
- [x] Kontextuellt block (max två) på produkt-, AI- och branschsidor
- [x] Partnernytt-H1 och publik navigation
- [x] Tester, webbläsarkontroll och slutrapport (WP2 byggs inte)

## Second opinion (2026-10-20)
- [x] Egen sida /second-opinion/ med befintligt rådgivningsformulär, diagnoskontext och anonym mätning
- [ ] Samlad end-to-end-QA av båda huvudresorna inkl. slutförd kravspec → partner, före publicering

## F&SCM-pilot: laddning och mobilläsbarhet (2026-10-19)
- [x] Kontrollera sidans laddning, stabilitet och mobilöverbredd
- [x] Kontrollera kort svar, snabbfakta, källor och tre huvudvägar i webbläsaren
- [x] Dokumentera resultat utan publicering eller obekräftade expertuppgifter
Verifierat: mobil 390 px och dator 1280 px utan överbredd eller runtimefel, inga trasiga laddade bilder efter skrollning. Alla tre huvudknappar visar rätt destinationssida efter avslutat sidbyte. Lokal indikativ LCP 1,65/1,46 sekunder och CLS under 0,001, inte produktions-CWV. Dokumenterat i docs/FSCM-MOBILE-QA-2026-10-19.md; inga sidändringar behövdes och inget publicerades.

## Business Central: komplett basresa (2026-10-19)
- [x] Inventera och återanvänd befintliga tester, jämförelser, kostnadsverktyg och partnerfunktioner
- [x] Samla förståelse, passform, jämförelse, kostnad och partner i en tydlig sidordning
- [x] Lägg businesscentral.se som frivillig fördjupning längre ned och samla avslutningen
- [x] Återanvänd anonym mätning och verifiera egna köpresesteg på dator och mobil utan publicering
Verifierat: passformsankare, BC-testets första fråga, jämförelse direkt till #comparison, egen kalkyl med ändrat antal användare och sparknapp samt egen partnerlista. Dator 1280 px och mobil 390 px utan överbredd eller runtimefel. 21 riktade tester godkända, automatisk byggkontroll godkänd. Inga partneruppgifter, ranking eller SEO-adresser ändrade. Inget publicerat; mottagning av nya händelser i den externa portalen inte liveverifierad, förhandsvisningsorigin nekas fortfarande.

## Customer Service: köparresa (2026-10-19)
- [x] Tydliggör ärendehantering, kontaktcenter, självservice och kombinationer tidigt
- [x] Samla tre ingångar och befintliga behovs-, krav-, kostnads- och partnervägar
- [x] Ta bort upprepningar och samla avslutningen utan ändrad partnerdata
- [x] Kontrollera länkar och verkligt flöde på dator och mobil, utan publicering

## F&SCM-pilot: köparrelevans (2026-10-18)
- [x] Visa upp till tre verkliga produktkopplade kundexempel i befintliga partnerkort, utan platshållare
- [x] Verifiera F&SCM-stöd och visa ett relevant urval ur den sammanslagna ISV-katalogen
- [x] Samla sidans avslutning till en huvudväg med jämförelse och kostnad som sekundära vägar
- [x] Testa regler och kontrollera verkliga länkar samt mobil/dator utan publicering

## Heroräknare (2026-10-23)
- [x] 139 000+ visningar, 3 300+ unika besökare, 20+ partners, 450+ guider; no-store i räknarfunktionen

## Word-artiklar och egna YouTube-videor i /redaktion (2026-10-26)
- [x] Ladda upp Word-fil i fliken Artiklar → utkast med text, bilder, ingress och SEO-fält; publiceras först när redaktören väljer det
- [x] Publika sidan /artiklar/<adress>/ visar Word-artiklar med samma utseende som övriga artiklar, förgenereras och kommer med i sajtkartan
- [x] Flik Videor i /redaktion med "Lägg till video via länk" (granska och publicera själv)
- [x] Lägg in uppladdade bygg/installation-artikeln som utkast

## Sprint 1.9 ISV-leverantörer och produkter (2026-10-30)
- [x] Leverantör och produkt med var sin källa, bekräftelse, verifiering och publik status (startläge: alla Sammanställd)
- [x] Statusfilter (förval Alla), statusmärke på kort och i lösningsrutan, leverantörens status separat
- [x] Exit A "Besök produktens webbplats" och Exit B "Få hjälp att bedöma om lösningen passar" (internt ärende, inget till leverantören)
- [x] Självservice per leverantör: korrigera/bekräfta profil, uppdatera produkter, lägga till och skicka produkt för publicering, allt via granskning
- [x] Admin: leverantörsinbjudan, granskning per inskickstyp, statuspanel för verifiering, Premium, avtal och publiceringsmål
- [x] Anonym mätning med de fem isv_*-händelserna och ISV-väg i köpvägsrapporten

## Sprint 2.0 Business Central-syndikering av ISV-produkter (2026-10-30)
- [x] Publik lista för businesscentral.se ur samma produktpost (bara Verifierad, publicerad, aktiv, BC-relevant, markerad)
- [x] Alla 83 aktiva BC-tillägg markerade för businesscentral.se
- [x] Egen adress, ingress, SEO-text, redaktionell kontext och use case per tillägg i admin
- [x] Hjälpförfrågan och mätning tar emot anrop från businesscentral.se, märkta med sajt
- [ ] Bygga visningen i businesscentral.se-projektet (väntar: görs i det projektet, instruktion i docs/BC-ISV-SYNDIKERING.md)

## Hjälpärenden i admin och /redaktion (2026-10-30)
- [x] Gemensam ärendevy för alla hjälpvägar med valt behov, Dynamics 365-produkt, sajt, status, bokning, nästa steg och anteckningar
- [x] Nya ärenden sparar besökarens val strukturerat

## Sprint 2.1 No Dead Ends (2026-10-30)
- [x] Nästa steg per sidtyp med fallback, global "Osäker på vad som är rätt nästa steg?" ovanför sidfoten
- [x] Fortsätt er utvärdering på artiklar, alla guider, grundprofiler, AI-chatt, videosidor, Aktuellt och tre produktsidor
- [x] Tomma resultat med ändra filter, bredda, närliggande och hjälp (katalog, partnerlistor, jämförelse, startsida, sök)
- [x] 404 med fyra huvudvägar och sök; kalkylatorer "Vad vill ni göra härnäst?"; INSIDE med köparnästa steg
- [x] Mätning dead_end_* i köpvägsrapporten; leveransrapport docs/NO-DEAD-ENDS-2.1.md
