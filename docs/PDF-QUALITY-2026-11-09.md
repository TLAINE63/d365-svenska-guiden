# Utgående dokument: kvalitetsgranskning 2026-11-09

## Genomfört
- Samtliga 12 generatorer använder gemensam komprimerad A4-export, svensk språkmarkering, avsändare och textsäkring. Microsoft Dynamics 365 och Dynamics 365 hålls ihop vid automatisk radbrytning.
- Gemensamma sidfötter och dokumenttitlar även före base64-export för mejlbilagor. Långa sidhuvuden anpassas till tillgänglig bredd.
- Rättat överstor produktnamnsrubrik i kravspecifikationens försättsblad, fasta disclaimerhöjder, för tidiga radkontroller i implementationstabellen och långa jämförelselänkar.
- Partnerguidens textblock kontrollerar höjd före sidbrytning. Sidnummer räknas efter slutlig layout, inte efter hårdkodade kapitelnummer.
- Logotyper i tre behovsanalyser använder importerade projektbilder, inte utvecklingsadresser som saknas på publicerad sajt.
- Kontaktblock i behovsanalyserna har fått separata rader för budskap och kontaktuppgifter; telefon och e-post kommer från den gemensamma organisationskällan.
- Efter Thomas godkännande rättat partnerbilagans uppgift om avtalsprioritet till neutral relevansordning. Urval och poäng har inte ändrats.

## Verifiering enligt PDF-guiden
- 15 prov-PDF:er genererade med verkliga generatorer i förhandsvisningen: partnerguide, kravspecifikation, två köparguider, marknadsrapport, BC-test, fem CRM-test, NAV-test, implementationskalkyl, ROI och samlade partner-/ISV-bilagor.
- Alla provsidor renderade med Poppler och visuellt granskade. Tätare sidor granskade separat. Efter rättningar renderades provfilerna igen. Ingen ny överlappning eller kantklippning identifierad i dessa prover.
- Partner-/ISV-bilagor provade med fem partnerprofiler och åtta tillägg. Prover använder påhittade namn och inte verkliga kunduppgifter. Bilageprovet startade med en tom jsPDF-sida innan bilagorna lades till, detta är provets tomma startsida och inte en ändring av vanliga exporter.
- Publika e-bokens elva sidor renderade och granskade. Layouten är läsbar utan påvisad överlappning, men innehåller äldre D365Guide-logotyp, långa tankstreck och tidigare positionering. Filen har inte skrivits över utan redigerbart original.
- Rapportens verkliga PDF-knapp klickad och nedladdningen läst tillbaka som fil. Fyra riktade tester godkända. Senaste automatiska byggkontroll godkänd.

## Avgränsningar, inte fullständigt kvalitetscertifierat
- De fyra inbyggda behovs-/AI-analysernas fullständiga användarresor och skickade mejlbilagor är inte provkörda från formulär till inkorg. Gemensam export och sidfot är införda, men varje möjlig lång AI-text eller fritextkombination är inte visuellt verifierad.
- Ändringar av texthantering är inte en ny fullständig formgivning av varje rapport. Äldre innehåll, källor och alla ekonomiska beräkningar har inte reviderats i denna granskning.
- Adminens hårdkodade offentliga avtalsadress gav HTTP 400 vid hämtning. Det avtalet kunde därför inte granskas visuellt; den eventuella separata uppladdade avtalsfilen i admin har inte hämtats. Avtalens juridiska text har inte ändrats.
- Externa leverantörs-PDF:er, privata Word-dokument och tidigare skickade bilagor är inte ändrade.
- Inget publicerat och inget testmejl skickat.