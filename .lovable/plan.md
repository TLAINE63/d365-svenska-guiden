# Plan: Lägg till saknade artiklar (en/ett) i knappar och uppmaningar

## Mål
Gå igenom sajtens publika (och i viss mån admin) knappar/länkar där en räknbar substantiv står utan artikel, och lägg till "en" eller "ett" så språket blir naturligare.

## Bakgrund
Exemplet på startsidan, där "Starta kostnadsfri behovsanalys" just ändrades till "Starta en kostnadsfri behovsanalys", visar att fler CTA:er har samma mönster.

## Identifierade ändringar

### Publika CTA:er
1. **Startsida** — `src/pages/Index.tsx:183`  
   `cta: "Starta behovsanalys"` → `"Starta en behovsanalys"`
2. **Branschsida** — `src/pages/IndustryPage.tsx:225`  
   `Gör behovsanalys →` → `Gör en behovsanalys →`
3. **AI-översikt** — `src/pages/AIOverview.tsx:800`  
   `Gör behovsanalys för Dynamics 365` → `Gör en behovsanalys för Dynamics 365`
4. **Business Central ROI** — `src/pages/BcRoiCalculator.tsx:272`  
   `Starta kalkyl` → `Starta en kalkyl`
5. **Business Central ROI** — `src/pages/BcRoiCalculator.tsx:749`  
   `Starta matchningstest` → `Starta ett matchningstest`
6. **Sales/CRM ROI** — `src/pages/SalesRoiCalculator.tsx:249`  
   `Starta kalkyl` → `Starta en kalkyl`
7. **Sales/CRM ROI** — `src/pages/SalesRoiCalculator.tsx:705`  
   `Starta behovsanalys för CRM` → `Starta en behovsanalys för CRM`
8. **Produkt-TCO/ROI** — `src/pages/ProductRoiPage.tsx:99`  
   `Starta kalkyl` → `Starta en kalkyl`
9. **CRM matchningsresultat** — `src/pages/CrmMatchningstestResultat.tsx:473`  
   `cta: "Skapa kravspecifikation"` → `"Skapa en kravspecifikation"`
10. **Välj partner-sidan** — `src/pages/ValjPartner.tsx:990`  
    `Boka möte` → `Boka ett möte`
11. **Scroll-CTA** — `src/components/ScrollCTA.tsx:121` och `:127`  
    `Boka rådgivning` → `Boka en rådgivning`

### Admin CTA:er (för konsekvens)
12. **Admin dashboard** — `src/pages/AdminDashboard.tsx:3693` och `:5445`  
    `Skapa partner` → `Skapa en partner`
13. **Partner events** — `src/pages/PartnerEvents.tsx:261`  
    `Skapa nytt event` → `Skapa ett nytt event`
14. **Partner update** — `src/pages/PartnerUpdate.tsx:2681`  
    `"Skapa event"` → `"Skapa ett event"`

### Mindre stavfix
15. **Upphandlingsguiden** — `src/pages/Upphandlingsguiden.tsx:99`  
    `Jämför Partner` → `Jämför partners` (stort P och plural för konsistens).

## Metod
- Sök-/ersättändringar i ovanstående filer med exakt matchning för att inte träffa andra förekomster.
- Kör `tsgo --noEmit` för typcheck.
- Kör bygge och ta skärmbild av ett urval sidor för att verifiera att knapparna fortfarande ser bra ut.

## Filer som ändras
- `src/pages/Index.tsx`
- `src/pages/IndustryPage.tsx`
- `src/pages/AIOverview.tsx`
- `src/pages/BcRoiCalculator.tsx`
- `src/pages/SalesRoiCalculator.tsx`
- `src/pages/ProductRoiPage.tsx`
- `src/pages/CrmMatchningstestResultat.tsx`
- `src/pages/ValjPartner.tsx`
- `src/components/ScrollCTA.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/pages/PartnerEvents.tsx`
- `src/pages/PartnerUpdate.tsx`
- `src/pages/Upphandlingsguiden.tsx`