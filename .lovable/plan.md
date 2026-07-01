
# Köparsidig CTA-arkitektur för d365.se

Målet: göra CTA:erna mer köparsidiga, minska knappbrus i listor, och lyfta jämförelse-/underlagsflödet som d365.se:s signaturupplevelse.

## 1. Terminologi (globalt)

Ny standardnomenklatur (används i alla dialoger, knappar och e-post):

| Nu | Ny text | Signal |
|---|---|---|
| Få kontakt | **Ställ en fråga** | Låg tröskel |
| Boka demo | **Boka genomgång eller demo** | Medel |
| Begär offert | **Begär offertindikering** | Hög intent |

Underrad under primär CTA (trygghetstext):
> Kostnadsfritt. Du väljer själv vilka partners som kontaktas. Varje partner kontaktas separat — aldrig i samma tråd.

## 2. CTA per kontext

| Situation | Primär CTA | Sekundärt |
|---|---|---|
| **Partnerprofil** | Ställ en fråga till [Partner] | Boka genomgång · Begär offertindikering |
| **Jämförelsevy** (`/jamfor-partners`) | Kontakta valda partners | Väljer syfte i steg 2 |
| **Bransch-/filterlista** (`/branscher/...`, `/valjdynamics365partner`) | Sticky: Gå vidare med valda partners (0–3) | Kryssruta på kort ersätter tre knappar |
| **Efter behovsanalys / kravspec** | Skicka mitt underlag till valda partners | Väljer syfte |
| **Inga träffar** | Få hjälp att hitta rätt partner | Går till d365.se, ej partner |
| **Guide/artikel** | Hitta partners för detta område | Länk till filter |

## 3. Frågeflöden per syfte

**A. Ställ en fråga** (kort):
Namn · Företag · E-post · Telefon (frivilligt) · Din fråga · Produkt (autofyllt) · Bransch (autofyllt)

**B. Boka genomgång/demo**:
Vad vill ni se/diskutera · Lösning · Nuvarande system · Antal användare · Bransch · Tidshorisont (0–3/3–6/6–12/senare) · Föredragna tider · Demo/behovsdialog/båda

**C. Offertindikering**:
Vad vill ni få uppskattat (impl./licenser/förstudie/förvaltning) · Nuvarande system · Antal användare · Bolag/länder · Viktiga processer · Integrationer · Datamigrering · Önskad start · Önskad go-live · Kravspec finns? · Budget (frivilligt) · Fastpris/budgetpris/uppskattning

## 4. Sticky-listflöde (nytt)

På `IndustryPage` och `ValjPartner`:
- Ersätt "Få kontakt"-knappen på varje `PartnerCard` med en **kryssruta "Välj för kontakt"**.
- Behåll befintlig "Jämför"-kryssruta.
- Ny sticky bar längst ned när ≥1 partner vald för kontakt:
  ```
  [2 partners valda]   Gå vidare med valda partners →
  ```
- Klick → dialog "Hur vill du gå vidare?" med tre syfteskort → återanvänd `PartnerRequestDialog` parallellt (finns redan).

## 5. Underlagsflöde (nytt, signaturupplevelse)

Efter Behovsanalys / Kravspec / ROI:
- Ny CTA-kort: **"Skicka mitt underlag till 1–3 relevanta partners"**
- Väljer syfte (fråga/genomgång/offertindikering)
- Underlaget (PDF eller sammanfattning) bifogas som länk i e-post till partner via `send-transactional-email`

## 6. E-post till partner

Ämnesrad:
`d365.se: [CTA-typ] från [Företag] – [Produkt] – [Bransch]`

Innehåll: kund, syfte, produkt, bransch, storlek, tidshorisont, meddelande, ev. länk till underlag. Fotnot:
> Kunden har själv valt att kontakta er via d365.se efter filtrering/jämförelse. Svara direkt till kunden — d365.se är kopierad för uppföljning.

## Tekniska detaljer

**Filer som ändras:**
- `PartnerRequestDialog.tsx` — byt knapptexter, bekräftelsetexter, lägg till trygghetstext
- `PartnerProfile.tsx` + `PartnerProductTabs.tsx` — primär/sekundär-hierarki (en primär, två outline)
- `ComparePartners.tsx` — byt "Ta nästa steg"-sektion till en **"Kontakta valda partners"**-knapp som öppnar syftesväljare (parallell submit finns redan i dialog)
- `PartnerCard.tsx` — ersätt "Få kontakt"-knapp med kryssruta "Välj för kontakt"
- Nytt: `ContactSelectionContext.tsx` + `ContactSelectionBar.tsx` (sticky) — mönster likt `PartnerCompareContext`
- Nytt: `PurposePickerDialog.tsx` — tre kort (fråga / genomgång / offertindikering)
- `IndustryPage.tsx`, `ValjPartner.tsx` — publicera filter till nya kontexten
- E-post: uppdatera `send-transactional-email`-template med ny ämnesrad + fotnot
- Behovsanalys/Kravspec/ROI-sidor — lägg till "Skicka mitt underlag"-CTA (fas 2)

**Publicerings-ordning (rekommenderad fasning):**
1. **Fas 1 (nu):** Ny terminologi + trygghetstext + hierarki på profil + "Kontakta valda partners" i jämförelse
2. **Fas 2:** Sticky-listflöde med kryssruta på kort
3. **Fas 3:** "Skicka mitt underlag"-flöde
4. **Fas 4:** E-postmallen (ämnesrad + fotnot)

## Frågor innan jag börjar

1. Ska jag köra **hela Fas 1–4** i ett svep, eller bara **Fas 1** nu och stämma av innan resten?
2. På partnerprofilen: vill du ha **en primär + två sekundära** knappar (min rekommendation), eller behålla tre likvärdiga?
3. Ska "Skicka mitt underlag" (Fas 3) skicka **PDF som bilaga-länk** (Storage signed URL) eller bara en **textsammanfattning** i mailet?
