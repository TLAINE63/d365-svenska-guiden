# Förenkla ERP-kompetenser och Power Platform

## Ändringar
- Ta bort Ekonomi och redovisning, Inköp, Försäljning och order, Lager och logistik samt Distribution och grossist som val för Business Central och F&SCM.
- Dessa betraktas som en gemensam basnivå för ERP-partners och ska därför inte påverka A/B/C-status eller kräva partnerbekräftelse.
- Behåll befintlig historik men dölj de utfasade valen från profileringslänk, admin och förifyllning.
- Ersätt Power Apps, Power Automate, Power Pages och Dataverse med det enda tvärgående valet Power Platform för samtliga granskade Dynamics 365-produktområden.
- Flytta eventuella befintliga undernivåval till Power Platform med bevarad verifiering, källa, publiceringsstatus och datum, utan dubbletter.
- Uppdatera modellbeskrivningen så den motsvarar den nya indelningen.

## Kontroll
- Kontrollera att bara relevanta ERP-specialiseringar återstår.
- Kontrollera att Power Platform visas en gång per produktprofil och att undernivåerna inte längre går att välja.
- Kontrollera profileringslänken, adminvyn och förifyllningen samt att projektet bygger utan fel.

## Tekniskt
- Inaktivera katalogalternativen i databasen i stället för att radera historik.
- Filtrera alltid på aktiva attribut och förmågor när granskningsdata skapas.
- Uppdatera äldre BC-formulärets tillåtna nycklar och den regelbaserade förifyllningen.
