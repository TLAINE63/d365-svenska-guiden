Implementera den valda "Midnight advisory"-stilen för filtreringsrutorna på /jamfor-partners.

## Teknisk plan

1. **Målfil**: `src/pages/ComparePartners.tsx`, radintervallet ca 983–1078 (filter-griden för produkt och bransch).

2. **Designval (låst)**: Användaren valde "Midnight advisory filters" — mörka, exklusiva filterboxar med petrolgrön hover- och fokusaccent, övre etiketter och subtil understrykningsdetalj.

3. **CSS/Tailwind-tokens**: Ingen hård-kodad hex-färg. Använd projektets semantiska tokens:
   - Mörk bakgrund: `bg-[hsl(var(--card-dark))]`
   - Subtil kant: `border-[hsl(var(--border-on-dark)/15)]`
   - Vit huvudtext: `text-[hsl(var(--primary-foreground))]`
   - Dämpad text: `text-[hsl(var(--muted-dark))]` / `text-[hsl(var(--muted-foreground))]`
   - Petrolgrön accent: `text-[hsl(var(--primary))]`, `hover:border-[hsl(var(--primary)/40)]`, gradient-aktiverad linje
   - Chevron-container: `bg-[hsl(var(--primary-foreground)/0.08)]`

4. **Layout**: Byt från ljus grå wrap (`bg-slate-50`) till en ren 2-kolumns grid med separata mörka kort per filter. Behåll popover-innehåll och select-innehåll ljusa för läsbarhet i listorna.

5. **Komponentbeteende**: Oförändrat — samma produkt-popover med kryssrutor, samma bransch-select, samma "Rensa filter"-länk. Endast estetik och struktur ändras.

6. **Verifiering**: Visuell kontroll i preview (kontrollera att båda filterboxarna syns korrekt, att hover/fokus ger petrolaccent, och att de inte ser ut som standard ljusa input-fält).