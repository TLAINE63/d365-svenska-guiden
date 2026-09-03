# Tydligare profilstatus och striktare innehållsregler

## 1. Nya begrepp för profilstatus

**Grundprofiler (Basic)**
- Etikett: `GRUNDPROFIL – EJ PARTNERVERIFIERAD`
- Förklaring: "Profilen är sammanställd av d365.se utifrån publikt tillgängliga uppgifter. Informationen har inte granskats eller bekräftats av partnern."

**Betalande partners**
- Etikett: `PARTNERVERIFIERAD PROFIL` (kort form "Partnerverifierad" i täta listor/kort)
- Förklaring: "Informationen i profilen har granskats och kompletterats av partnern."

Bytet görs överallt där dagens "Verifierad" / "Ej verifierad profil" visas: badge-komponenterna, basickortet, grundprofilsidan, jämförelsesidan, shortlist, branschsidor, partnerprofil, startsidans partnergrid, listan över övriga partners, partnerprogram-benchmark och profilkollen. Filternamn som "Visa endast verifierade" blir "Visa endast partnerverifierade".

Ingen text kopplar begreppet till betalning, och ingen formulering antyder Microsoft-certifiering eller kvalitetsgodkännande.

## 2. Rensa riskabla påståenden i befintlig text

En grundprofil (Accigo) innehåller idag:

> "En nordisk helhetsleverantör inom Microsoft-ekosystemet med stark certifieringsnivå och bred kompetens. Jämförbar med andra nordiska fullservice Microsoft-partners som Fellowmind och Knowit."

Denna ersätts med en neutral formulering utan namngiven konkurrent och utan obestyrkt certifieringspåstående, t.ex.:

> "En nordisk Microsoft-partner med kompetens inom flera delar av Dynamics 365-portföljen och verksamhet på flera svenska orter."

Övriga sex grundprofiler med sammanfattning gås igenom i samma svep; kontroll visar att endast Accigo har jämförelse/superlativ idag.

## 3. Redaktionell regel för grundprofiler

Regeln byggs in i AI-prompterna som genererar partnersammanfattningar och i adminvyn för Redigera Basickort.

Tillåtet: företagsnamn, kontorsorter, Dynamics 365-områden, branscher, kundstorlek (som bedömning), geografisk täckning, kort neutral beskrivning, tydligt märkta d365.se-bedömningar, verifierbara certifieringar/designations, offentliga kundreferenser.

Ej tillåtet: personliga kontaktuppgifter, partnerns bilder, långa kopierade texter, obestyrkta superlativ ("stark certifieringsnivå", "marknadsledande"), jämförelser med namngivna konkurrenter.

I adminvyn visas regeln som en kort checklista vid sammanfattningsfältet, plus en varning om texten innehåller en annan partners namn eller ett superlativmönster. Varningen blockerar inte sparande.

## Teknisk sammanfattning

- `src/components/BasicPartnerBadge.tsx` och `src/components/VerifiedPartnerBadge.tsx`: nya etiketter, aria-labels och tooltip-texter; `BASIC_PROFILE_DISCLAIMER` uppdateras (används redan av basickortet).
- Textsvep i `PartnerBasicCard.tsx`, `PartnerBasicProfile.tsx`, `UnprofiledPartnersList.tsx`, `ComparePartners.tsx`, `AiCompareInsights.tsx`, `Shortlist.tsx`, `IndustryPage.tsx`, `PartnerProfile.tsx`, `PartnerCard.tsx`, `HomeVerifiedPartnersGrid.tsx`, `PartnerProfileCheck.tsx`, `PartnerProgramBenchmark.tsx`.
- Databasuppdatering av `partners.extended_summary` för accigo.
- Promptregler i `supabase/functions/autofill-partner-profile` och övriga `generate-partner-*`-funktioner som skriver sammanfattningar.
- Checklista och mjuk validering i `src/components/AdminBasicPartnersTab.tsx`.
