# AI-exempelbiblioteket: förvaltningsmodell

Gäller från 2026-10-16. Biblioteket ska bli bättre, inte större.

## Livscykel (fältet `status` i src/data/aiExamples.ts)
| Status | Betydelse | Publik |
|---|---|---|
| DRAFT | Påbörjat, ofärdigt | Nej |
| REVIEW | Behöver redaktionell/produktgranskning | Nej |
| USE_CASE | Användningsfall utan verifierad källa | Nej |
| VERIFIED | Påståenden kontrollerade mot källa | Ja |
| PUBLISHED | Publicerat och granskat efter release | Ja |
| UPDATE_NEEDED | Källa/funktion kan vara inaktuell, granskas | Ja, tills granskat |
| ARCHIVED | Visas inte; sätt `archivedAt`, och `replacementUrl` + vidarekoppling i App.tsx om sidan ersätts | Nej |

Publika exempel kräver dessutom `sourceUrl` och `lastVerified`, annars visas de inte. Intern status visas aldrig för besökare. Produktstatus `preview` visas som "Förhandsversion"; GA/retired/unknown visas inte.

## Förvaltningsfält
`lastVerified`, `nextReviewDate` (standard +90 dagar), `verifiedBy` (internt), `sourceName`, `sourceUrl`, `imageSource`, `imageSourceUrl`, `status`, `productStatus`, `updateReason`, `archivedAt`, `replacementUrl`.

## Inaktuellt innehåll
1. Sätt `status: "UPDATE_NEEDED"` och `updateReason`. Avpublicera inte automatiskt.
2. Kontrollera källan. Uppdatera text, prompter, bild och `lastVerified`.
3. Behåll URL om användarbehovet är detsamma. Om sidan ersätts: vidarekoppling direkt till ersättaren (inga kedjor).
4. Om funktionen inte längre är relevant: ARCHIVED.

## Prioriteringsmodell för nya exempel
Bedöm: 1 tydligt användarbehov, 2 verifierbar funktion, 3 förändrat arbetssätt, 4 tillför något nytt, 5 relevant nästa steg.
- **HÖG**: alla fem uppfyllda.
- **MEDEL**: relevant behov, kräver research/verifiering.
- **LÅG**: svagt behov, stor överlappning.
- **BLOCKERAD**: funktion, källa eller bildrättighet ej verifierad.

## Redaktionell checklista (före publicering)
Verkligt behov · rätt applikation, kategori, roll, AI-typ · realistiskt Förr → Nu · naturlig svensk prompt · vad AI gör · mänskligt ansvar · konkret förändring · trovärdig källa (Microsoft först) · fungerande källänk · verifieringsdatum · produktstatus · bild med källa eller medvetet ingen bild · internlänkar · relaterade exempel · nästa steg · unik title/description · mobil · tillgänglighet. Saknas kritiska delar publiceras exemplet inte.

## Källor
Microsoft Learn är primärkälla för funktioner. Partnermaterial (t.ex. Tecman) får bara användas som kompletterande inspiration, aldrig som enda grund och aldrig kopierat. I dag används ingen sådan källa.

## Deduplicering och tunt innehåll
Samma arbetsmoment i samma applikation med samma AI-funktion = en sida med flera promptvariationer. Separata sidor bara vid annan applikation, väsentligt annan funktion eller annat behov. Tunna sidor märks REVIEW med `updateReason` (förbättra, slå samman, arkivera). Radera aldrig automatiskt.

## Uppföljning
Redaktion → Statistik → "AI-exempelbiblioteket" visar per månad: räckvidd, engagemang, fördjupning och kommersiellt nästa steg (separat), mest öppnade/kopierade exempel, filter, nollresultat, exempel som inte öppnats och granskningskön. Klick är intressesignaler, inte leads eller affärer. Inga simulerade värden.

Vid trafik men låg interaktion, granska i ordning: rubrik, kort svar, Förr → Nu, prompt, vad AI gör, nästa steg. Bygg inget nytt innan detta är prövat.

Nollresultat: återkommande behov läggs i backloggen nedan. Kontrollera först om ett befintligt exempel kan taggas bättre. Ingen ny sida för enstaka kombinationer.

## Kvartalsgranskning (jan, apr, jul, okt)
Produktnamn · preview/GA · källänkar · bilder · förfallna `nextReviewDate` · starkt och svagt innehåll (från statistiken) · dubbletter · innehållsgap · nya Microsoft-funktioner (release plans) · arkiveringsbehov.

## businesscentral.se
BC-exempel återanvänds via `getExamplesForApplication("bc")` från samma datakälla: samma fakta, källor och datum, egen ingress/CTA per sajt. Inga dubbla URL:er med identiskt innehåll.

## Redaktionell backlog
Fält: title · userNeed · application · category · role · aiType · evidenceSource · sourceUrl · priority · status · reason · owner · targetReviewDate. Typer: nytt exempel, innehållsuppdatering, källuppdatering, bildbehov, namnändring, sammanslagning, arkivering. Inga sidor skapas automatiskt från backloggen.

| title | userNeed | app | category | role | aiType | evidenceSource | priority | status | reason | owner | targetReviewDate |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Hitta ekonomisk information (Finance) | Hitta siffror utan rapportbygge | finance | hitta | ekonom | copilot-chat | Saknas | BLOCKERAD | REVIEW | Dublett av finance-fraga-data, saknar källa: slå samman | Redaktionen | 2026-11-15 |
| Förstå affärsdata (F&SCM) | Förstå data i en vy | finance | forsta | cfo | copilot | Saknas | BLOCKERAD | REVIEW | Saknar källa | Redaktionen | 2026-11-15 |
| Analysera leverantörsdata (SCM) | Bedöma leverantörer | scm | analysera | inkopare | copilot | Saknas | BLOCKERAD | REVIEW | Saknar källa, närliggande scm-efterfragan | Redaktionen | 2026-11-15 |
| Business Central + MCP | Låta externa agenter arbeta mot BC | bc | automatisera | ekonom | mcp | Saknas | BLOCKERAD | DRAFT | Ingen verifierad Microsoft-källa | Redaktionen | 2026-12-01 |
| Skärmbilder till exemplen | Se hur det ser ut | alla | - | - | - | Microsoft | MEDEL | BLOCKERAD | Kräver bildrättighet | Thomas Laine | 2026-12-01 |
| Supply Chain-roll (3 exempel) | Fler SCM-exempel | scm | - | supplychain | - | Microsoft Learn | MEDEL | Väntar på data | Bedöm efter första månadens filterdata | Redaktionen | 2026-11-30 |
| Kvartalsgranskning alla 51 | Aktualitet | alla | - | - | - | Microsoft Learn | HÖG | Planerad | nextReviewDate 2027-01-13 | Redaktionen | 2027-01-13 |
