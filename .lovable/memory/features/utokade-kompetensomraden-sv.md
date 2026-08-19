---
name: Utökade kompetensområden (AI, Automation & Power Platform)
description: Ersätter gamla AI-betyget/AI-nivån. Tre områden (Power Platform, Copilot & AI, Copilot Studio & agenter) med fyra nivåer bedömda av d365.se. Dynamics 365 alltid primär rankingfaktor.
type: feature
---

## Modell
Kolumn `partners.extended_competencies` (jsonb, publik via `partners_public`) och
`partners.extended_competency_evidence` (jsonb, ENDAST internt – exponeras aldrig publikt).

Områden: `power_platform`, `copilot_ai`, `copilot_studio_agents`.
Nivåer (stigande): `unverified` (Ej verifierad), `documented_competence` (Dokumenterad kompetens),
`documented_delivery` (Dokumenterad leverans), `leading_competence` (Ledande kompetens).

Nivåerna sätts av d365.se utifrån kundcase, referenser, certifieringar och publikt underlag –
aldrig av partnern själv. Det gamla AI-betyget ("Bedömd AI-nivå" / aiMaturityLabel) visas inte längre.

## Implementation
- `src/lib/extendedCompetencies.ts` – nivåer, färger, narrativ, filter- och bonuslogik.
- `src/components/partner/ExtendedCompetenciesSection.tsx` – publik sektion + JSON-LD (`knowsAbout`).
- `src/pages/AdminDashboard.tsx` – nivåval + internt bedömningsunderlag per område.
- `src/components/PartnerGuideDialog.tsx` – filter på "nivå eller högre" per område.
- `supabase/functions/match-partners` – sekundär rankingsignal (max 10%).

## Regel
Kompetensområdena är ALLTID sekundära. Produkt + bransch inom Dynamics 365 är hårda filter och
primär ranking; kompetensfiltret relaxas automatiskt om färre än 3 partners uppfyller det.
