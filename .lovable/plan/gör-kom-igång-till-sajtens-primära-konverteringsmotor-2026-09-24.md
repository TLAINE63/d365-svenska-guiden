# Gör Kom igång till sajtens primära konverteringsmotor

## Mål
Samla den publika köpresan kring ett tydligt huvudflöde:

```text
Relevant innehåll → Kom igång → personlig kortlista → jämför → fråga d365.se → be om introduktion
```

Besökare som redan vet vad de söker ska fortfarande kunna gå direkt till produkt-, bransch- och partnerlistor.

## 1. Förbättra och exponera Kom igång

### Primära ingångar
- Byt den orange huvudknappen i desktopmenyn från **Få hjälp att välja partner** till **Kom igång** och länka till `/kom-igang/`.
- Lägg **Kom igång** först under **Verktyg & guider** och tydligt i mobilmenyn.
- Behåll startsidans nya framhävda Kom igång-block och den direkta partnerfiltreringen för besökare med ett färdigt val.
- Låt gemensamma köpar-CTA:er på sajten använda Kom igång som standardmål. Specialiserade analyser och kalkylatorer finns kvar som fördjupning när sidans fråga motiverar det.

### Kontext från sidan följer med
- Stöd förval i `/kom-igang/` via interna parametrar för bransch, produkt, mål och källa.
- Produkt-, bransch-, jämförelse- och guidesidor skickar med den kontext de redan känner till.
- Guiden öppnar på rätt steg med relevanta val förifyllda, men användaren kan alltid ändra dem.

### Resultatsidan
- Behåll hårda filter för produkt och bransch samt nuvarande prioritering och AI-rankning.
- Ta bort direktlänkar till partnerwebbplats och direkt e-postkontakt från resultatkorten.
- Ge varje föreslagen partner tre fortsättningar: **Jämför**, **Fråga d365.se** och **Be om introduktion**.
- Jämförelseval sparas i den befintliga jämförelsekontexten. Frågan till d365.se förifylls med partner och valda behov. Introduktionen går via den befintliga förmedlade kontaktfunktionen.

### Mätning
- Mät ingångskälla, start, varje slutfört steg, avhopp, visat resultat, jämförelseval, fråga och introduktionsförfrågan.
- Använd den befintliga anonyma händelsespårningen. Ingen ny extern analystjänst införs.

## 2. Renodla partnerprofilerna till beslutsstöd

### Ny primär handlingsrad
- Ersätt nuvarande blandning av shortlist, demo, direktkontakt och kostnadsfråga med:
  1. **Jämför**: lägger till partnern och öppnar jämförelsen när minst två är valda.
  2. **Fråga d365.se**: öppnar köparstödet med partner, aktiv produkt och eventuella filter som kontext.
  3. **Be om introduktion**: öppnar den befintliga säkra förfrågan till vald partner.
- Placera handlingsraden tidigt på profilen och gör den återkommande flytande raden konsekvent med samma tre val.

### Rensa motstridiga vägar
- Ta bort **Boka Demo/Genomgång**, **Boka första möte**, direkt e-post/telefon som handling och andra konkurrerande huvudknappar på den publika partnerprofilen.
- Partnerns kontaktperson kan fortsatt visas som information, men kontaktförmedlingen sker via d365.se.
- Partnerns egna uppgifter, kundcase och källor behålls som beslutsunderlag. Inga nya direkta partnerlänkar läggs till.
- Återanvänd `PartnerCompareContext`, `PartnerRequestDialog` och befintlig leadspårning. Ingen ändring av partnerdata eller ranking.

## 3. Kontextuell CTA i läsflödet

### Gemensam modell
- Skapa en återanvändbar kontextuell CTA med rubrik, kort svar, primär handling, sekundär handling, källa samt förval till Kom igång.
- CTA:n använder sajtens befintliga korta, redaktionella form. Den blir en del av läsflödet, inte en generell slutbanner.
- Flytta CTA-data till ett gemensamt register så sidfamiljer får konsekvent mål och mätning utan kopierad logik.

### Första täckningen
1. **Produkt- och pelarsidor**: Business Central, Finance & Supply Chain, ERP, CRM, Sales, Customer Insights, Customer Service, Field Service och Contact Center. CTA:n svarar exempelvis på ”Passar lösningen oss?” och öppnar Kom igång med rätt produkt.
2. **Branschsidor**: CTA:n svarar på ”Vilka lösningar och partner passar vår bransch?” och skickar med aktuell bransch.
3. **Systemjämförelser**: CTA:n placeras efter jämförelsetabellen och svarar på ”Vilket alternativ passar vårt faktiska behov?”. Aktuell Dynamics 365-produkt skickas med.
4. **Partnerlistor per produkt**: CTA:n hjälper besökaren att kortlista partner för just den aktuella produkten.
5. **Partner- och kompetensguider**: befintliga CTA:er i mitten återanvänds men får kontextuell copy och Kom igång som huvudväg där användaren ännu inte gjort ett urval.
6. **Kunskapscenterartiklar och fördjupningar**: CTA bestäms av artikelns kategori och taggar. Pris leder till relevant kalkylator, produkt- och branschfrågor leder till förifylld Kom igång, komplexa frågor kan leda till Fråga d365.se.

### Placering och dubblering
- Placera CTA:n efter sidans första huvudsvar eller centrala jämförelse, före relaterade länkar och FAQ.
- Ta bort eller ersätt den generella `FunnelCTA` längst ned när samma sida får en kontextuell CTA.
- Rensa särskilt branschsidan som i dag har två närliggande slut-CTA:er.
- Behåll högst en fylld orange huvudknapp per CTA-block.

## Tekniska detaljer
- Berör främst `KomIgang`, `Navbar`, `PartnerProfile`, partnerprofilens sticky-rad och produktflikar samt ett nytt gemensamt CTA-register och CTA-block.
- Sidmallarna uppdateras familjevis, inte genom manuell specialkod på varje enskild URL.
- Alla färger och kontroller använder befintliga designtokens och knappkomponenter.
- `Dynamics 365` hålls samman på en rad. Inga långa tankstreck används i ny copy.
- Ingen backendmigration, ny rankinglogik eller automatisk partnerdistribution ingår.

## Genomförande i verifierbara steg
1. Bygg kontextparametrar, mätning och den gemensamma CTA-modellen.
2. Uppdatera Kom igång-ingångar och resultatets tre fortsättningar.
3. Renodla partnerprofilens tre handlingsvägar och kontrollera den förmedlade kontakten från början till slut.
4. Rulla ut kontextuell CTA till produkt-, bransch-, jämförelse- och partnerlistsmallar.
5. Rulla ut samma modell till guider och artiklar, med kategori- och taggbaserat mål.
6. Kontrollera desktop och mobil, direktvägar, förval, sexstegsflödet, jämförelse med två och tre partner, fråga med kontext samt introduktionsformuläret.
7. Kontrollera att inga berörda sidor har dubbla CTA-block, direkt partnerkontakt eller kvarvarande demo-knappar.
