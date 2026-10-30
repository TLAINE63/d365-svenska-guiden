# Roadmap – tydligare skillnad Grundprofil / Partnerverifierad profil

## Köparvägar i hero (2026-10-30)
- [x] Sprint 0.9: ny ingress, fyra kort, rådgivarlänk, kort-id och klassificering i mätningen
- [x] Sprint 1.0: kompetenskortet frågar först "Vad söker ni?" (partner, expert/konsult, osäker); ersätter tidigare Sprint 1.1 Kompetensfunneln
- [ ] Nästa: förbättra partner- respektive expertvägens underresor

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
