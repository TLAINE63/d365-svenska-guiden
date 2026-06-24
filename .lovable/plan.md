
# Optimera startsidan för Microsoft Dynamics 365 & köpsökningar

## Bakgrund

Tidigare nyckelordsanalys visade:
- **"microsoft dynamics 365"** — 1 900 sök/mån (störst volym)
- **"dynamics 365"** — 1 600/mån
- **"d365"** — 390/mån (brand)
- Långa frågor (TAYA-typiska): *"vad kostar business central"*, *"vilken dynamics 365-lösning passar"*, *"hitta dynamics 365-partner sverige"*

Idag använder vi nästan uteslutande "Dynamics 365" i hero, title och meta — vi missar därmed den största sökvolymen.

## Vad som ska ändras (endast presentation/text & SEO)

### 1. Hero (H1) i `src/pages/Index.tsx`
Lägg in "Microsoft" en gång i H1 så att första matchningen för Googlebot är fulla varumärket. Behåll köparsidig vinkel.

Förslag:
> **Microsoft Dynamics 365** — guider, jämförelser och partnerval på köparens villkor

(första "Microsoft Dynamics 365" som färgad signature, resten vit)

Ingress: byt "d365.se hjälper er förstå…" → behåll men säkerställ att "Microsoft Dynamics 365" nämns i första meningen.

### 2. Title & meta description (måste rymmas under 60 tecken)
- `index.html` `<title>` + `og:title`
- `SEOHead` i `Index.tsx` (rad 246-247 + WebSiteSchema rad 256-257)

Förslag title (59 tecken):
> `Microsoft Dynamics 365 – guider & partnerval | d365.se`

Meta description (under 160 tecken):
> `Köparsidig guide till Microsoft Dynamics 365 i Sverige – jämför ERP & CRM, gör kostnadsfri behovsanalys och hitta rätt partner per bransch.`

### 3. FAQ-block (FAQSchema)
Lägg till två nya frågor som matchar långa sökningar:
- *"Vad kostar Microsoft Dynamics 365?"* — sammanfatta licensspann + implementation
- *"Hur hittar jag en Microsoft Dynamics 365-partner i Sverige?"* — länka till `/branscher/` och partnerväljaren

Behåll existerande FAQ; lägg de nya överst för att maximera SERP-snippet-träff.

### 4. Eyebrow & sub-headlines i hero
Eyebrow säger redan "Upphandlingsguiden för Microsoft Dynamics 365" — behåll. Säkerställ att "Microsoft Dynamics 365" återkommer minst 1 gång i:
- "Börja här"-blockets rubrik (idag: "Vet ni redan vilket Dynamics 365-system…")
- AI-sök-placeholder-exempel

### 5. Strukturerad data
`WebSiteSchema`-description (rad 257) uppdateras till samma fras som meta description för konsistens.

## Vad som INTE ändras
- Layout, komponenter, navigation, designtokens
- Övriga sidor (separat insats om du vill)
- Ingen ny pelarsida — vi optimerar befintlig startsida som pelare för "microsoft dynamics 365"

## Förväntad effekt
- Bättre matchning på 1 900/mån-keyword utan att tappa "Dynamics 365"-matchen (frasen finns kvar i H1, FAQ, brödtext)
- Fler long-tail FAQ-träffar i Google's "People Also Ask"
- Konsistent varumärkesanvändning genom title → H1 → schema

## Teknisk genomgång (för utvecklare)
Filer som rörs:
- `index.html` (rad 13-14, 41-42)
- `src/pages/Index.tsx` (H1 ~rad 270, SEOHead ~246-257, FAQ-array `homeFaqs` ~rad 38)

Inga npm-installationer, inga route-ändringar, ingen sitemap-uppdatering behövs.
