# Partner Data Enrichment MVP – datamodell och BC-exportmodell

Status: datamodell + partnerformulär implementerat. Ingen ranking, matchning, AI eller synk använder fälten ännu.

## 1. Implementerade fält (tabell `partners`)

| Fält | Typ | Innehåll |
|---|---|---|
| `structured_profile.migration_experience` | text[] (i jsonb) | NAV / Navision, Business Central On-Prem, Visma, Monitor, Pyramid, Jeeves, SAP Business One, Fortnox, Annat ERP |
| `structured_profile.bc_competencies` | text[] | Ekonomi, Redovisning, Inköp, Order, Lager, Distribution, Produktion, Projekt, Service, E-handel, EDI, Integrationer, Power BI, Power Platform, Copilot, Flerbolag, Internationellt |
| `structured_profile.project_types` | text[] | Nyimplementation, Migrering, Uppgradering, Förvaltning, Rescue-projekt, Internationell utrullning |
| `structured_profile.delivery_models` | text[] | Fastprisstart, Snabbstartspaket, Proof of Concept, Successiv implementation, Förvaltningspartner |
| `structured_profile.has_industry_solution` | boolean \| null | null = ej besvarat |
| `structured_profile.industry_solutions[]` | {name, description, industry} | industry = standardbransch |
| `data_verified_at` | date | Senast verifierad |
| `data_verified_by` | text | `partner` \| `redaktion` \| `publik_kalla` (validerat med trigger) |

`partner_submissions.structured_profile` sparar samma objekt per inskick (historik).
Värden valideras mot fasta listor i `src/data/structuredPartnerProfile.ts` (klient) och `partner-invitations` (server).

## 2. Ifyllnad

| Fält | Automatiskt | Partnerinput | Redaktionell granskning |
|---|---|---|---|
| Geografi, storlek, bransch | Finns redan (partnerns profil) | Ja | – |
| Migreringserfarenhet | Nej (möjligt förslag från publika kundcase) | Krävs | Vid förslag från publik källa |
| BC-kompetens | Delvis förslag från fritext/kundexempel | Krävs | Vid förslag |
| Typiska projekt | Nej | Krävs | – |
| Leveransmodell | Delvis (om paket anges publikt) | Krävs | Vid förslag |
| Branschlösning | Delvis (Marketplace-appar i `industry_apps`) | Krävs | Ja, före publik visning |
| Senast verifierad / av | Ja – sätts till dagens datum + `partner` när partnern skickar in | – | Redaktionen sätter `redaktion`/`publik_kalla` |

Regel: automatiska förslag skrivs aldrig över partnerns egna val.

## 3. BC-exportmodell (endast dokumenterad, ingen synk)

```json
{
  "slug": "string",
  "name": "string",
  "geography": ["Sverige"],
  "office_cities": ["string"],
  "company_size": ["1-49"],
  "industries": ["string"],
  "migration_experience": ["NAV / Navision"],
  "bc_competencies": ["Lager"],
  "project_types": ["Migrering"],
  "delivery_models": ["Fastprisstart"],
  "industry_solutions": [{ "name": "", "description": "", "industry": "" }],
  "verification_status": "partnerverifierad | grundprofil",
  "data_verified_at": "YYYY-MM-DD",
  "data_verified_by": "partner | redaktion | publik_kalla"
}
```
Källa: `partners` där `product_filters.bc` finns; storlek och bransch från `product_filters.bc`; `verification_status` från `agreement_signed`.

## 4. Risker
- Låg svarsfrekvens bland de 11 verifierade partnerna → tomma fält.
- Självskattning (alla kryssar allt) → behöver kontrollfrågor/belägg senare.
- Fasta listor kan behöva utökas; ändra då både klient- och serverlistan.
- Inaktuell data → `data_verified_at` bör följas upp (t.ex. var 12:e månad).

## 5. Nästa steg
Kontakta de 11 verifierade partnerna via deras profileringslänk och be dem fylla i "Strukturerad profil". Påbörja inte Min BC-plan, matchning eller leadflöde.
