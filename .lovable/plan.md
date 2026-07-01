## Mål
Göra partnerval och jämförelse mer beslutsstödjande genom att (1) styra upp filterflödet med obligatoriskt produktområde, (2) förenkla partnerkorten till beslutsrelevant info och (3) bygga om jämförelsesidan så att AI-sammanfattning + skillnader syns först.

## 1. Filterflöde på `/valjdynamics365partner/`
- Gör **Produktområde obligatoriskt**: dölj partnerlistan och visa en tydlig prompt tills användaren valt ett av: Business Central, Finance & Supply Chain, Sales/CRM, Customer Service, Customer Insights, Field Service, Contact Center.
- Bransch = valfritt men markerad som *rekommenderat* (badge "Rekommenderat" på filterknappen).
- Behåll geografi + storlek som valfria.
- Höj max antal jämförbara partners från 2 → **3** (`PartnerCompareContext`, `PartnerCompareBar`, kort-labels "välj upp till 3").

## 2. Partnerkort (`PartnerCard.tsx`)
Sätt beslutsstöd först. Visa i denna ordning:
- Logo + Namn
- Produktområde-badge (det valda) + matchningsgrad om finns
- Primära branscher (max 3 chips)
- Geografisk närvaro (kort form)
- **AI-sammanfattning 1–2 meningar** ("Passar bäst för …") – använd befintlig `positioning_statement` / `ai_profile.summary`; fallback till kort autogenererad mening från industries+product.
- CTA: **Jämför** (toggle) + **Kontakta**

Ta bort/flytta ner: långa beskrivningar, kompetenslistor, storleksbadges (visas endast i "fullständig jämförelse" / profil).

## 3. Jämförelsesida `/jamfor-partners/`
Ny struktur, top-down:

**A. AI-sammanfattning** – ny sektion överst
- Rubrik: *"Vad skiljer partnerna åt?"*
- 2–4 meningar genererade via ny edge-funktion `compare-partners-summary` (Lovable AI Gateway, `google/gemini-3-flash-preview`). Input: valda partners { namn, positioning, industries, applications, ai_profile, geografi }. Output: kort text.
- Cache i `sessionStorage` per set av partner-slugs för att spara credits.

**B. Viktigaste skillnaderna** (standardvy)
Attribut som jämförs:
- Branschspecialisering
- AI-kompetens (från `ai_profile`)
- Geografisk täckning
- Produktbredd (antal D365-appar)
- Implementationsmodell / storleksfokus
- Certifieringar / specialiseringar

Regel: dölj rader där alla valda partners har samma värde. Om alla rader är lika: visa "Partnerna är mycket lika på nyckelattributen – se fullständig jämförelse".

**C. Knapp "Visa fullständig jämförelse"**
Togglar fram nuvarande fullständiga tabell (alla attribut, även identiska).

## Tekniska detaljer
- `src/pages/ValjPartner.tsx`: gate på produktval, uppdatera copy.
- `src/contexts/PartnerCompareContext.tsx`: `MAX = 3`.
- `src/components/PartnerCompareBar.tsx`: uppdatera texter.
- `src/components/PartnerCard.tsx`: ny kompakt beslutslayout (bakåtkompatibel via prop `variant="decision"` default true på partnerlistor).
- `src/pages/ComparePartners.tsx`: ny struktur med AI-summary + diff-first + toggle.
- Ny edge-funktion `supabase/functions/compare-partners-summary/index.ts` (CORS whitelist, input zod-validering, streaming ej nödvändigt).
- Hjälpfunktion `src/lib/partnerDiff.ts` som beräknar attributdiff.

## Ur scope
- Ingen ändring av admin-vy, PDF-export eller ranking-algoritm.
- Inga schema-ändringar (använder befintliga fält).
