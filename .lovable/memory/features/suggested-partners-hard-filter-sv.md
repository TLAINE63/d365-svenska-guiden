---
name: Suggested partners hard filter (behovsanalys & kravspec)
description: pickSuggestedPartners i behovsanalyser, ROI-kalkyler och kravspecifikationer använder produkt+bransch som HÅRDA filter. Fyller aldrig ut med random partners.
type: feature
---
`src/lib/suggestPartners.ts` (`pickSuggestedPartners`) styr partnerförslagen i alla ERP-/CRM-behovsanalyser, ROI-kalkyler och kravspecifikationer (BC, F&SCM, Sales, Marketing, Customer Service m.fl.).

Regler:
1. **Produkt** – hårt filter, relaxas aldrig.
2. **Bransch** – hårt filter när kunden valt bransch, relaxas ALDRIG. Hellre färre än 3 förslag än en partner som inte täcker branschen.
3. **Storlek/omsättning** – mjuk bonus via `getSizeMatchBonus`, används endast för rangordning inom produkt+bransch-träffar.
4. **Geografi** – mjuk bonus (kan tas emot via opts men används inte som hårt filter här).
5. **Avtalspartner** (`agreement_signed`) sorteras alltid först inom respektive bonus-grupp.

Ingen "fyll upp till 3"-fallback får läggas till. Om kunden får 0-2 förslag är det korrekt beteende (TAYA – radikal transparens > falska matchningar).
