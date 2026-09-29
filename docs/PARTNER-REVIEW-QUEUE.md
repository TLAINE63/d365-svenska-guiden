# Partner Review Queue (MVP)

Datakvalitet och partnerverifiering ovanpå partnermastermodellen. Ingen matchning, ranking, lead-routing, publika profiler eller exportändringar.

## 1. Review Queue (Admin → Leads & Partners → Partnergranskning)
Alla verifierade partner (avtal): namn, senast verifierad, antal A/B/C, profilstatus
(Komplett / Partnerbekräftelse krävs / Ofullständig / Väntar på redaktionen). "Visa" ger alla uppgifter med klass, datakvalitet och källa.

## 2. Förifyllningsregler
Knappen "Förifyll alla" / "Kör förifyllning". Explicita textregler (regex) per val i `_shared/partner-review.ts`, t.ex.
"migrera från NAV" → Migrering: NAV, "Proof of Concept" → Proof of Concept, "EDI" → EDI, "Power BI" → Power BI.
Källor: partnerbeskrivning, partnerns egna BC-produkttexter (ej AI-genererade), leveransprofil, kundexempel och styrkor endast om partnern skrivit dem.
Sparas som opublicerat förslag (Importerad äldre uppgift, källa Tidigare partnerprofil, med textutdrag). Befintliga val skrivs aldrig över; val som partnern tagit bort föreslås inte igen. Inget matchar → fältet lämnas tomt. Vanlig implementation, migrering, uppgradering, successiv implementation, förvaltning och support efterfrågas inte. Bara särskiljande projekt- och leveransformer visas. Managed Services betyder proaktivt helhetsansvar med löpande övervakning, förbättring och optimering, inte ett vanligt supportavtal.

## 3. Partnervy (profileringslänken)
Befintliga partners ser "Granska er Business Central-profil" i stället för hela kryssformuläret:
Bekräftade uppgifter (ingen åtgärd), Behöver bekräftas (Bekräfta / Ändra / Ta bort, med källa och utdrag), Saknas (Lägg till).
Före sparning visas ändringslistan Tidigare → Ny. Förtydliganden från redaktionen visas överst.

## 4. Redaktionell kö (Partner Review Approvals)
Partner, fält, nytt värde, tidigare värde, källa, datum. Godkänn (publicerar/raderar), Avvisa (återställer), Begär förtydligande (kommentar krävs, visas för partnern).

## 5. Statusmodell
Ändring: pending → approved | rejected | clarification. Profilklasser: A bekräftat, B kräver partnerbekräftelse, C saknas.

## 6. Datakvalitetsmodell
Bekräftad = partner/redaktion verifierad och publicerad. Partneruppgift = lämnad av partner, ej granskad. Publik källa = publik/importerad/förifylld. Saknas = ingen information.

## 7. Statistik (endast admin)
Verifierade partner, kompletta BC-profiler, saknade kompetensområden, väntande granskningar.

## 8. Exempel på partnerresa
1. Redaktionen kör förifyllning → "Fastprisstart" och "NAV" föreslås från partnerns text.
2. Partnern öppnar sin länk, bekräftar NAV, tar bort Fastprisstart, lägger till EDI och en branschlösning (2–3 minuter).
3. Ändringslistan visas: Migrering Tomt → NAV ✓; Kompetens Tomt → EDI.
4. Redaktionen godkänner i kön → uppgifterna blir Bekräftade och publiceras.
