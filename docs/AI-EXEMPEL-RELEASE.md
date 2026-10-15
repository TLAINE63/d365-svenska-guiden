# AI-exempelbiblioteket: releasechecklista och rapport (Sprint 6)

Datum: 2026-10-15. Testat lokalt i Chromium (Chrome/Edge-motor) och WebKit (Safari-motor), desktop 1280 px och mobil 390 px.

## Checklista

| Område | Status | Kommentar |
|---|---|---|
| Huvudbudskap (H1 + ingress + CTA) | PASS | Oförändrat, tydligt |
| Primär resa bibliotek → filter → exempel → relaterat | PASS | Startsidan saknar egen länk "Se hur du kan arbeta smartare"; den finns i bibliotekets hero. Startsidan ändrades inte (hero låst) |
| AI-hubb ↔ bibliotek | PASS | Länkar åt båda håll, olika roller |
| Applikationsfilter (7 st) | PASS | Alla har 5–11 exempel |
| Rollfilter (9 st) | PASS | Alla har minst 3 exempel |
| Arbetssätt Hitta → Automatisera | PASS | finance-hem omklassad från agent till Copilot (Agera) |
| BC-, Sales-, Customer Service-flöden | PASS | |
| Filterkombinationer och URL | PASS | Filter sparas i adressen (?app=, kategori=, roll=, typ=), tillbaka bevarar val |
| Nollresultat | PASS | "Inga exempel matchar dina val just nu." + ta bort senaste / visa alla / rensa |
| Endast VERIFIED publikt | PASS | 51 publicerade, 4 REVIEW dolda |
| Källor och datum | PASS | Alla publicerade har källa och 2026-10-15 |
| Unika titlar | PASS | Dublett "Hitta kundinformation" (Sales) ändrad till "Hitta senaste kundaktiviteter" |
| Bilder | NOT APPLICABLE | Inga bilder publicerade; layout fungerar utan bild |
| SEO (title, description, canonical, sitemap) | PASS | Filtrerade adresser har canonical till /ai/exempel/ och skapar inga egna sidor |
| Strukturerad data | PASS | BreadcrumbList + Article på exempelsidor; ingen FAQ/HowTo/Review |
| Analytics | PASS | 13 ai_*-händelser via befintlig GA4-funktion, ingen prompttext eller PII |
| Promptkopiering | PASS | Knapp, tangentbordsstöd, "Prompten är kopierad" (statusmeddelande) |
| CTA-hierarki | PASS | Fler exempel → produkt/AI → partner (diskret textlänk) |
| Tillgänglighet | PASS | Knappar med aria-pressed, fokusringar, status med aria-live |
| Felhantering / 404 | PASS | Okänd slug ger 404-sida; dolda slugs vidarekopplas utan kedjor |
| Mobil/desktop | PASS | |
| Cross-browser | PASS | Chromium + WebKit; Edge = Chromium. Riktig Safari på iPhone ej testad |
| Prestanda | PASS | Inga stora bilder; ikoner laddas lazy |

## Rapport

- Publicerade exempel: 51 (alla verifierade funktionsexempel)
- Per applikation: BC 11, Sales 7, Customer Service 7, Finance 8, SCM 5, Field Service 6, Project Operations 7
- Användningsfall/REVIEW (opublicerade): 4
- Saknar källa bland publicerade: 0
- Bilder saknas: alla (avsiktligt, Microsoft-skärmbilder kräver godkännande)
- Brutna länkar hittade: 0
- Blockerande problem: inga
- Kvarvarande förbättringar: bilder, eventuell länk från startsidan, test i fysisk Safari

**Rekommendation: READY**
