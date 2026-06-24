## Lågkontrast-träffar på publika sidor

Två fall på startsidan (`src/pages/Index.tsx`) som ligger under WCAG AA mot mörk bakgrund `#15130F`:

| # | Plats | Klass | Effekt |
|---|---|---|---|
| 1 | Rad 363 — AI-sökens input-placeholder ("Beskriv ert behov…") | `placeholder:text-white/40` | Vit @ 40 % opacitet ≈ 3.6:1 mot `#15130F` → under AA (4.5:1) för bodytext |
| 2 | Rad 811 — kapitäl-undertitel "Volym 01 · Kvartal 2 · 2026" | `text-white/40` | Samma som ovan |

Övriga `text-muted-foreground/30` / `text-white/40`-träffar är admin-UI (inloggat, ej publikt) eller dekorativa ikoner — lämnas orörda.

## Föreslagen fix

1. **Index.tsx rad 363**: byt `placeholder:text-white/40` → `placeholder:text-white/70` (≈ 6.3:1, passerar AA).
2. **Index.tsx rad 811**: byt `text-white/40` → `text-white/70` på Volym-caption.

Inga andra ändringar. Inga tokens eller komponenter rörs.
