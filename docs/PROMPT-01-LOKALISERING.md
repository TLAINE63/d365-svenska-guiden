# Färdig prompt 1 av N — klistra in i d365guide.com

> Kopiera allt nedanför linjen och klistra in som ett meddelande i d365guide-projektet.
> Bygg inget annat i samma pass.

---

Bygg lokaliseringsgrunden för två marknader: **global engelska på `/`** och **norska på `/no/`**.
Rör ingen befintlig affärslogik i detta pass — bara infrastrukturen nedan.

## 1. Locale-kontext

Skapa `src/i18n/locale.ts`:

```ts
export const LOCALES = ["en", "no"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Läser locale ur pathname: /no/... => "no", allt annat => "en" */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/no" || pathname.startsWith("/no/") ? "no" : "en";
}

/** Bygger en locale-korrekt intern länk. localePath("/partners", "no") => "/no/partners" */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean : `/no${clean === "/" ? "" : clean}`;
}

/** Tar bort locale-prefixet: "/no/partners" => "/partners" */
export function stripLocale(pathname: string): string {
  return pathname.startsWith("/no") ? pathname.slice(3) || "/" : pathname;
}
```

Skapa `src/i18n/LocaleProvider.tsx` med en React-context som härleder aktiv locale från
`useLocation().pathname` och exponerar `useLocale()` → `{ locale, t, path }`, där
`path(p)` är `localePath(p, locale)`. Wrappa appen i `LocaleProvider` i `src/App.tsx`.

## 2. Strängkatalog

Skapa `src/i18n/en.ts` och `src/i18n/no.ts` med **identiska nycklar**:

```ts
// src/i18n/en.ts
export const en = {
  nav: { partners: "Partners", knowledge: "Knowledge center", cost: "Cost" },
  partner: {
    verified: "Verified partner",
    basic: "Identified partner",
    contactCta: "Contact this partner",
    contactBasicCta: "Ask us about this partner",
  },
  common: { readMore: "Read more", showAll: "Show all", loading: "Loading…" },
} as const;
export type Strings = typeof en;
```

`src/i18n/no.ts` exporterar `no: Strings` (typad mot `en`, så saknad nyckel blir
kompileringsfel). Fyll på nycklar löpande i kommande pass — men **inga litterala
UI-strängar i komponenter från och med nu**.

## 3. Routing

I `src/App.tsx`: montera hela rutträdet två gånger — en gång på rot och en gång under
`/no/*`. Använd en delad `<AppRoutes />` så rutterna definieras på ett ställe:

```tsx
<Routes>
  <Route path="/no/*" element={<LocaleProvider locale="no"><AppRoutes /></LocaleProvider>} />
  <Route path="/*" element={<LocaleProvider locale="en"><AppRoutes /></LocaleProvider>} />
</Routes>
```

Ersätt alla hårdkodade `to="/..."`/`href="/..."` i navigation, footer och kort med
`path("/...")` från `useLocale()`.

## 4. SEO per locale

Uppdatera `SEOHead`-komponenten så att den:

- sätter `<html lang>` till aktiv locale,
- självrefererande `<link rel="canonical">` mot rätt locale-URL,
- lägger ut hreflang-par på varje sida:

```html
<link rel="alternate" hreflang="en" href="https://d365guide.com{path}" />
<link rel="alternate" hreflang="no" href="https://d365guide.com/no{path}" />
<link rel="alternate" hreflang="x-default" href="https://d365guide.com{path}" />
```

- kapar `<title>` till max 60 tecken via en `truncateTitle()`-helper i `src/lib/seoTitle.ts`
  (kapa på ordgräns, lägg till `…` bara om något faktiskt kapades), och applicerar samma
  kapade titel på `og:title` och `twitter:title`.

## 5. Prerender / SSG

I prerender-pluginet: generera rutt-listan en gång och mappa den till två varianter
(`/x` och `/no/x`). Verifiera efter build att:

- `dist/index.html` och `dist/no/index.html` båda finns och har olika `<title>`,
- `dist/404.html` har `<meta name="robots" content="noindex">` och saknar canonical,
- inget prerenderat dokument har fler än 60 tecken i `<title>`.

Lägg detta som ett skript `scripts/check-prerender-seo.mjs` som exiterar med kod 1 vid fel,
och kör det efter build.

## 6. Sitemaps och robots

- `public/sitemap.xml` blir ett `<sitemapindex>` som pekar på `sitemap-en.xml` och
  `sitemap-no.xml`.
- Varje `<url>` får `<xhtml:link rel="alternate" hreflang="...">` för sin motpart.
- `robots.txt` tillåter båda och pekar på sitemapindexet.
- Håll totala antalet genererade filer under 50 000 (rutter × 2 locales).

## 7. Valuta och format

Skapa `src/lib/formatMoney.ts`:

```ts
const CURRENCY: Record<Locale, { code: string; locale: string }> = {
  en: { code: "EUR", locale: "en-GB" },
  no: { code: "NOK", locale: "nb-NO" },
};

export function formatMoney(amount: number, locale: Locale) {
  const c = CURRENCY[locale];
  return new Intl.NumberFormat(c.locale, {
    style: "currency", currency: c.code, maximumFractionDigits: 0,
  }).format(amount);
}
```

Samma mönster för datum (`Intl.DateTimeFormat`, `en-GB` respektive `nb-NO`). Inga
hårdkodade valutasymboler eller datumsträngar i komponenter.

## 8. Databasförberedelse (en migration)

Lägg till stöd för lokaliserat redaktionellt innehåll utan att bryta befintlig data:

- `partners`: ny kolumn `content_i18n jsonb not null default '{}'::jsonb` — struktur
  `{ "en": { "ai_summary_short": "...", "best_fit_for": [...] }, "no": { ... } }`.
- `partners`: ny kolumn `markets text[] not null default '{en}'` — styr vilka
  marknader partnern visas på.
- `isv_solutions` (eller motsvarande): samma `content_i18n`-kolumn.
- Behåll befintliga textkolumner som fallback när `content_i18n[locale]` saknas.
- Migrationen ska innehålla `GRANT` för `anon` (läs), `authenticated` och `service_role`
  enligt tabellens befintliga policyer.

Skriv en `getLocalized(row, field, locale)`-helper i `src/lib/i18nContent.ts` som läser
`content_i18n[locale][field]` med fallback till `content_i18n.en[field]` och därefter
den gamla kolumnen.

## Klart när

- `/` och `/no/` renderar samma sidor på rätt språk,
- inga litterala UI-strängar finns kvar i de komponenter du rört,
- hreflang och canonical är korrekta i prerenderad HTML,
- `check-prerender-seo.mjs` passerar,
- migrationen är körd och `getLocalized()` används av minst en komponent som bevis.
