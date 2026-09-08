# Tydligare CTA-struktur och fler partnerleads

Kort omdöme: förslaget är bra och genomförbart. Nästan allt är text-, hierarki- och placeringsarbete i befintliga sidor – ingen ny funktionalitet. En sak kan inte genomföras som skrivet: ordet "oberoende" får inte användas i vår kommersiella text (vi har egna intressen i vissa partnerbolag och har beslutat att alltid vara transparenta). Jag löser det med en formulering som säger samma sak utan att ljuga.

## Vad som görs

### 1. Ett enda namn på partnerfunktionen
Alla knappar och länkar som leder till partnerväljaren får texten **"Hitta rätt partner"**. Det gäller meny (desktop + mobil), hero, artiklar, produktsidor, partnerprofiler, verktyg och sidfot. Nuvarande varianter ("Visa matchande partners", "Partnerväljaren", "Hitta bransch & partner", "Välj partner") ersätts.

Undantag som behålls: menyposten till branschöversikten heter fortsatt "Branscher" (den leder till en översiktssida, inte till partnerväljaren) och jämförelsesidan heter fortsatt "Jämför partners".

Sekundär CTA överallt: **"Starta behovsanalys"**.

### 2. Startsidan – ta bort dubbel navigering
"Vad är ditt nästa steg?" (köparguide / jämförelse / partnerväljare) tas bort från startsidan. "Var står du i processen?" behålls som enda vägvalsblock. Samma innehållsblock finns kvar och används på produkt- och guidesidor där det hör hemma, så inga länkar försvinner för sökmotorerna.

### 3. Hero
- Rubrik: "Hitta rätt Dynamics 365-partner på några minuter"
- Ingress: "Jämför svenska Dynamics 365-partners utifrån bransch, behov, erfarenhet och specialistkompetens. Kostnadsfritt och köparorienterat."
- Filtren blir helt frivilliga med "Alla branscher" / "Alla lösningar" som förval – knappen går alltid vidare, även utan val.
- Primär knapp: "Hitta rätt partner". Sekundärt: "Vet du inte vilken lösning du behöver? Starta behovsanalysen".
- Sifferrutorna och förtroendetexten behålls.

### 4. "Så fungerar det" direkt under hero
Fyra steg: beskriv behovet, få partnerförslag, jämför sida vid sida, kontakta bara dem du själv väljer. Under stegen: "Ingen partner ser dina uppgifter innan du själv väljer att ta kontakt."

### 5. Verktygen avslutas med nästa steg
Behovsanalys (ERP, CRM, kundservice), kravspecifikation, beslutsmognadstest och AI-sök får samma avslutningsblock: "Redo för nästa steg?" med texten om att vi kan hjälpa till att hitta relevanta partners, och knappen "Hitta rätt partner". Där verktyget redan känner till bransch och produkt följer valen med till partnerväljaren.

### 6. Rådgivningen
Rubrik "Kostnadsfri köparrådgivning", knapp "Boka kostnadsfri rådgivning", och punkterna:
- 30 minuter med en rådgivare på köparens sida
- Ingen partner deltar i samtalet
- Ingen försäljning – fokus på ditt behov och dina alternativ

Ordet "oberoende" används inte, eftersom vi har ägarintressen i delar av marknaden och redovisar det öppet.

### 7. Artikelavslut
Ett gemensamt block efter varje artikel i Kunskapscenter och Partnernytt: "Behöver du hjälp att välja Dynamics 365-partner?" med de tre punkterna, primär knapp "Hitta rätt partner" och sekundär "Starta behovsanalys".

### 8. En primär knapp per sida
På varje sida är bara "Hitta rätt partner" fylld/orange. Behovsanalys, jämförelse, AI-sök, guider och rådgivning visas som sekundära knappar eller textlänkar.

## Tekniska noter

- Ny delad komponent `PartnerCtaBlock` (varianter: artikel, verktygsavslut, sidfot) så texten bara finns på ett ställe; befintlig `FunnelCTA` görs om till en tunn wrapper så att alla sidor som redan använder den får den nya texten automatiskt.
- CTA-etiketter och mål-URL:er samlas i en konstantfil (t.ex. `src/data/ctaLabels.ts`) och används av Navbar, Footer, hero, produkt- och verktygssidor.
- `FunnelCTA`-blocket "Vad är ditt nästa steg?" tas bort från `src/pages/Index.tsx` men behålls på övriga sidor.
- Befintlig spårning (`trackFunnelEvent` / `useCtaTracking`) kopplas på det nya blocket med källa per sida, så vi kan mäta om leadsen ökar.
- Inga ändringar i partnerdata, ranking, e-post eller backend.

## Utanför detta uppdrag
Inga nya sidor, ingen ändrad partnerlogik och inga designomtag utöver knapphierarkin.
