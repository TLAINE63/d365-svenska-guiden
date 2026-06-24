# Standardiserad struktur för Dynamics 365-produktsidor

## Mål
Ge alla produktområdessidor samma 6-sektionersstruktur i en köparsidig, senior ton — utan att riva befintlig design, SEO eller funktionalitet.

## Sidor som omfattas
1. `src/pages/BusinessCentral.tsx`
2. `src/pages/FinanceSupplyChain.tsx`
3. `src/pages/D365Sales.tsx`
4. `src/pages/D365Marketing.tsx` (Customer Insights)
5. `src/pages/D365CustomerService.tsx`
6. `src/pages/D365FieldService.tsx`
7. `src/pages/D365ContactCenter.tsx`
8. `src/pages/D365ProjectOperations.tsx`

(Lägger även till `D365Commerce`, `D365HumanResources` om du vill — säg till.)

## Angreppssätt
Sidorna är idag stora, individuellt uppbyggda filer med olika ordning av sektioner, partnerlistor, FAQ, video, prissektioner m.m. För att hålla designen oförändrad **flyttar/lägger jag till** sektioner snarare än att skriva om hela sidorna.

### Återanvändbara komponenter (nya, frontend-only)
Skapas under `src/components/product/`:

- `TypicalBuyerNeeds.tsx` — punktlista över utvärderingssituationer (prop: `items: string[]`, `title?`)
- `WhereThePartnerMatters.tsx` — 6 kort: processdesign, integrationer, datamodell, rapportering, förändringsledning, branschkunskap (prop: `items: {label, body}[]`)
- `CommonPitfalls.tsx` — punktlista över fallgropar
- `NextStepsBlock.tsx` — 3 CTA-kort: Behovsanalys → `/behovsanalys/`, Kravspec → `/kravspecifikation/`, Hitta partner → `/branscher/`

Komponenterna använder befintliga design-tokens (`bg-card`, `border-border`, `--cta-orange`) — ingen ny visuell stil införs.

### Per sida
Sektionerna **läggs in i denna ordning** direkt efter Hero-sektionen, före befintliga djupare moduler (BuyerManual, CostBreakdown, partnerlistor, FAQ, video):

```text
1. Hero                       (befintlig — minimal copy-justering om ingressen saknar "varför partnerval spelar roll")
2. Typiska köparbehov         (NY)
3. Vad Dynamics 365 löser     (NY — kort & saklig)
4. Var partnern avgör         (NY — 6 områden)
5. Vanliga fallgropar         (NY)
6. Rekommenderat nästa steg   (NY — 3 CTA)
--- befintligt innehåll därunder oförändrat ---
```

### Data per sida
Innehållet skrivs per produkt i `src/data/productStandardSections.ts` som en map `{ [slug]: { buyerNeeds, whatItSolves, partnerMatters, pitfalls } }`. Det gör att copy kan iterera utan att röra sidkomponenterna igen.

## Ton & innehåll
- Inga "Microsoft är ledande..."-formuleringar.
- Konkreta köparsituationer ("Vi har vuxit ur Visma/Fortnox", "Vi planerar att gå internationellt", "Vi behöver gemensam kunddata över Sales och Service").
- Fallgropar uttryckta som observationer, inte varningar med utropstecken.
- Nästa steg använder verifierade interna länkar (`/behovsanalys/`, `/kravspecifikation/`, `/branscher/`).

## Vad som INTE ändras
- Befintlig Hero-design, gradients, ikoner, layout
- SEO-metadata (title/description/canonical) — redan optimerade
- Partnerlistor, FAQ, video, BuyerManual, CostBreakdown
- Routing, URL:er, prerendering

## Leverans
Föreslagen ordning:
1. Skapa de 4 komponenterna + data-filen
2. Hooka in i BusinessCentral och FinanceSupplyChain först (visa resultat)
3. Efter ditt OK: rulla ut på återstående 6 sidor i ett svep

## Frågor innan jag börjar
- **Commerce & HR**: ska jag ta dem också? (de listades inte men följer samma mönster)
- **Hero-justering**: får jag finjustera ingressen där "varför partnerval spelar roll" saknas, eller ska Hero lämnas helt orört?
- **Leverans i steg eller allt i ett svep?** Default = steg (BC + F&SCM först, sedan resten efter ditt OK).
