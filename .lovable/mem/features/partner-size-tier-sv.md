---
name: Partner size tier (intern leverantörsstorlek)
description: Kolumn partner_size_tier (1..5) på partners – intern signal för AI-ranking, ingen publik filter-UI. Tier 5 flaggas för admin-verifiering.
type: feature
---
Kolumn `partners.partner_size_tier smallint` (1..5, CHECK) + `partner_size_tier_needs_review boolean`.

Tier-skala (störst → minst resurser):
- 1 = Mycket stor global/Sverige-stor koncern (EY, Capgemini, Accenture, Fellowmind, ...)
- 2 = Stor / etablerad Microsoft-/D365-specialist (Cegeka, HSO, BE-terna, Innofactor, ...)
- 3 = Medelstor D365-/BC-/CRM-specialist (Goodfellows, Xlent, Dizparc, NAB Solutions, ...)
- 4 = Mindre / nischad / SMB-orienterad (Dynamic Factory, Nemely, Aperit, ...)
- 5 = Låg offentlig synlighet – behöver verifieras

**Redigeras i admin** (AdminDashboard → "Publicerad/Avtal"-sektionen) via dropdown + verifieringsflagga.
**Exponeras** i `partners_public`-vyn (ej sensitivt).
**Skickas** av `PartnerGuideDialog.tsx` och `KomIgang.tsx` till `match-partners`-edge-function.
**Används** i `match-partners` som mjuk signal (punkt 1e i ranking-instruktionen): max ±5 poäng, får ALDRIG överskugga bransch/produkt. "Ej klassad" och tier 5 med osäker klassning behandlas som neutralt.

**Ingen publik filter-UI** (TAYA-neutralitet, matchar `partner-size-revenue-bonus-sv`). Om publikt filter övervägs i framtiden: kolla med användaren först.

Tier 5 auto-flaggar `needs_review` = true när tier väljs i admin-dropdownen; övriga tiers rensar flaggan.
