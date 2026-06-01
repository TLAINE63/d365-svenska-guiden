## Mål

Skapa en ny pelarsida **Upphandlingsguiden** (/upphandlingsguiden/) som guidar köpare genom hela upphandlingsresan för Dynamics 365 – inspirerad av strukturen på herbertnathan.com/tjanster/upphandling/, men i d365.se:s ton (köparsidig vägledning, TAYA, aldrig "oberoende"). Lägg till en menypunkt i Verksamhetsguider-dropdownen (desktop + mobil).

## Innehållsstruktur på sidan

Sex tematiska steg, alla anpassade till Dynamics 365-kontexten och med deep-länkar in i befintliga verktyg på sajten:

```text
Hero: "Kvalitetssäkrad upphandling av Dynamics 365 – från behov till avtal"
 └─ ingress + två CTA: "Starta behovsanalys" / "Hitta partner"

1. Behovsanalys        → /ERPbehovsanalys/, /CRMbehovsanalys/, /kundservice-behovsanalys/
2. Kravspecifikation   → /kravspecifikation/ (+ Sales/Marketing/Kundservice)
3. Marknads- & partneranalys → /valjdynamics365partner/, /branscher/
4. Utvärdering av system & partner → /valjdynamics365partner/?ai=1 (AI-guide)
5. Val av implementeringspartner   → partnerprofiler, kundexempel
6. Införandeplan & avtal           → /kunskapscenter/upphandlingsresan, relevanta artiklar

Avslutning:
 - "Så jobbar vi köparsidigt" (TAYA-block, länk till /agande-och-intressen)
 - Relaterade sidor (RelatedPages)
 - CTA-banner: kontakta rådgivare (Thomas Laine / Michael Uhman)
```

Varje steg = kort + rubrik + 2–4 raders förklaring + primär CTA-knapp. Återanvänd visuellt språk från `BuyerJourneyStages` och stegsektionerna i `Upphandlingsresan.tsx` (mörkt premiumkort för "hetare" steg, ljust kort för analyssteg) så det känns enhetligt.

## Navigation

I `src/components/Navbar.tsx`, Verksamhetsguider-dropdown, lägg till en ny post **högst upp** (eller direkt under "Hitta Dynamics 365-partner") som primär, accentfärgad länk:

- Desktop: ny `DropdownMenuItem` "🗺️ Upphandlingsguiden" → `/upphandlingsguiden/`
- Mobil: motsvarande länk i mobilmenyns Verksamhetsguider-block

Befintlig länk till `/kunskapscenter/upphandlingsresan` ("Upphandlingsresan") behålls – den är en mer kompakt 7-stegs-översikt; nya sidan är den fördjupade pelaren.

## SEO

- `SEOHead` med title "Upphandlingsguiden – så upphandlar du Dynamics 365" (<60 tecken), meta-desc <160 tecken med köparsidig vinkel.
- canonicalPath `/upphandlingsguiden`
- En H1, semantiska H2 per steg, alt-text på bilder.
- Lägg till route i `App.tsx` + i `scripts/generate-sitemap.mjs` så den prerenderas (SSG).
- Lägg in OG-bild (återanvänd befintlig generell OG eller skapa enkel ny via `src/lib/ogImage.ts`-mönstret om behövs).
- Intern länkning enligt minnesregler: pelarna `/`, `/erp`, `/affarssystem`, `/businesscentral` – lägg "Upphandlingsguiden" i `RelatedPages`/footer-länklistan där det är relevant (MOFU/BOFU).

## Filer som påverkas

```text
src/pages/Upphandlingsguiden.tsx        (NY – pelarsida)
src/components/Navbar.tsx               (lägg till menypunkt desktop + mobil)
src/App.tsx                             (route /upphandlingsguiden/)
scripts/generate-sitemap.mjs            (lägg till URL i SSG-listan)
src/components/Footer.tsx               (valfri länk under "Guider")
```

Inga DB- eller backend-ändringar. Ingen ny logik, bara presentation + navigation + SEO.

## TAYA-vakt

Ingen text om "oberoende". Formuleringar = "köparsidig vägledning", "vi står på din sida". Inga direktlänkar till partners webbplatser – CTA går via plattformens partnermatchning/lead-flöde.

## Klart-kriterier

- /upphandlingsguiden/ renderas, prerendreras i SSG och syns i sitemap.
- Menypunkt syns och fungerar i desktop-dropdown och mobilmeny.
- Sidan har 6 stegsektioner + hero + avslutnings-CTA, fullt responsiv.
- SEO-taggar och canonical satta, inga "oberoende"-ord.
