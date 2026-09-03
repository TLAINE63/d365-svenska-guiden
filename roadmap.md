# Roadmap – tydligare skillnad Grundprofil / Partnerverifierad profil

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

Öppet: org.nr, momsreg.nr och postadress för Dynamic Factory AB saknas i koden – behöver fyllas i.

## Uppdatering 2026-09-03 (transparenspaket)
- [x] Basic-CTA/body till "Granska, korrigera och komplettera profilen ..."
- [x] Partnerverifierad-förklaring på partnerprofil + källmärkning av d365.se:s analys
- [x] Partnerprogram: terminologi, ranking-formulering, kartläggningstext
- [x] Global textsökning verifierad/alla relevanta – ersatt
- [x] Rankinglogik: agreement_signed-bonus borttagen i suggestPartners.ts och crmMatchingPartners.ts
- [x] Dataskyddspolicy: nytt avsnitt om kontaktpersoner/experter
- [x] Footer: Företagsinformation (org.nr/VAT/postadress renderas när värden fylls i organization.ts)
- [ ] Saknas: faktiskt organisationsnummer, momsregistreringsnummer och postadress för Dynamic Factory AB

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
