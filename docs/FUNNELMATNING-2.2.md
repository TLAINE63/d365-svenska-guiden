# Sprint 2.2 – Funnelmätning (2026-10-30)

## Modell
Befintliga händelser översätts i `src/lib/journeyFunnels.ts` till gemensamma resehändelser (`funnel_events`, `event_type = journey_funnel`). Databasen loggar de steg som bara den kan säkerställa.

| Nivå | Händelse | Källa |
|---|---|---|
| 1 Progression | `journey_started`, `journey_progressed` | Webbläsaren, bredvid originalhändelsen |
| 2 Hand Raise till d365.se | `contact_d365_submitted` | Webbläsaren vid inskick |
| 3 Leverantörskontakt | `supplier_selfservice_clicked` (självservice) | Webbläsaren |
| 3 Förmedlad kontakt | `buyer_approved_introduction` | Trigger på partnerintroduktioner, bara efter dokumenterat godkännande |
| Möte | `meeting_requested`, `meeting_held` | Trigger på rådgivningsbokningar |

Dimensioner: source_page, journey_type, initial_intent, intent_type, conversion_type, recipient, product_context, competence_type, verification_status, original_event, journey_id. session_id och tidpunkt sparas på raden.

Funnels: CRM- eller affärssystem (ERP), Partner, Expert/konsult, Kostnad, Befintlig Dynamics 365, ISV.

## Rapport (Redaktion → Statistik, admin → Funnel)
Per funnel: entries, progression rate, Hand Raise rate (unika resor), registrerade ärenden, qualified need rate (ärenden med dokumenterat behov), buyer-approved introduction rate, meeting-held rate. Självservice till leverantör, kontakt till d365.se och förmedlad kontakt (introduktioner + direktförfrågningar med samtycke per partner) redovisas i separata kolumner. Beteende per informationsstatus visas för Partner och ISV, endast som analys; ranking ändras aldrig utifrån den.

## Kända begränsningar
- `partner_profile_help_requested` finns i modellen men ingen sådan hjälpväg finns ännu på partnerprofilerna, så siffran är 0.
- Partnerhändelser saknar sparad informationsstatus; rapporten använder partnerns nuvarande status.
- Partnersökningens händelser skickas bara när sökningen startats i besöket (Sprint 1.1-regeln).
- Mätningen börjar 2026-10-30; äldre händelser ingår inte i den nya funnelrapporten.
