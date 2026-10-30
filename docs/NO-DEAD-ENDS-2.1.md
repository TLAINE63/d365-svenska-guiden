# Sprint 2.1 – No Dead Ends, leveransrapport (2026-10-30)

Regel: ingen relevant publik sida slutar utan ett begripligt nästa steg. Varje sidtyp har ett `primary_next_step` (egen konfiguration) eller ett `fallback_next_step` (`TEMPLATE_NEXT_STEPS` i `src/lib/nextSteps.ts`). No Dead Ends betyder relevanta nästa steg, inte formulär överallt: hjälpen från d365.se är alltid ett av flera alternativ och skapar ett internt ärende (placement `next_step_help`), aldrig ett utskick till partner eller leverantör.

Global fallback: "Osäker på vad som är rätt nästa steg? / Prata med d365.se →" ligger ovanför sidfoten på alla publika sidor och döljs automatiskt när sidan redan har ett nästa steg-block (`data-next-step-block`, CSS `:has`).

Mätning (anonym, funnel_events): `dead_end_next_step_viewed` och `dead_end_next_step_clicked` med `source_template`, `source_page`, `next_step_type`, `destination` (och `stage_class`). Visas i köpvägsrapporten som "Nästa steg på alla sidtyper (No Dead Ends)".

| Sidtyp | Klass | Befintligt nästa steg | Nytt nästa steg | Conversion Exit | Tracking | Kvarvarande luckor |
|---|---|---|---|---|---|---|
| Startsida | LEARN | Hero-kort, RelatedPages, ScrollCTA, AdvisoryOffer | Tomt partnerurval: ändra filter, se alla partners, behovsguiden, hjälp | Rådgivning (AdvisoryOffer) | dead_end_* på tomt urval | – |
| Artiklar (inkl. Word/INSIDE-artiklar, fördjupningar) | LEARN | ContextualCta, RelatedPages | "Fortsätt er utvärdering" (behovsguide, jämför, kostnad, hjälp) | Hjälp från d365.se | dead_end_* | – |
| Guider | LEARN–SELECT | Egna CTA:er; ContinueEvaluation renderade bara på pilotsidor | ContinueEvaluation med guide-fallback på alla guider via PartnerGuidePage/SimpleGuidePage | Hjälp från d365.se, kompetensval | dead_end_* | Budgetguiden har egen CTA och fick inget extra block |
| Produktsidor | EXPLORE | RelatedPages (+ ContinueEvaluation på /affarssystem/ och /crm/) | Project Operations, Commerce, HR: ContinueEvaluation (kostnad, jämför, partner, hjälp) | Hjälp från d365.se | dead_end_* | Övriga produktsidor har specifika RelatedPages; global fallback täcker hjälpen |
| Branschsidor | EXPLORE | RelatedPages, ContextualCta | Global fallback | ContextualCta, hjälp | dead_end_* (fallback-klick) | – |
| Jämförelser | COMPARE | ContextualCta/GuideCTA, pilot på D365 vs Salesforce | Global fallback | ContextualCta, hjälp | dead_end_* (fallback-klick) | – |
| Kostnadssidor | PLAN | CostNextSteps ("Vad vill ni göra härnäst?") | Oförändrat (CostNextSteps räknas som nästa steg-block) | Få hjälp att bedöma kostnadsbilden | befintliga cost_* | – |
| Kalkylatorer | PLAN | Implementation: CostNextSteps. ROI: CalcToKravNext + partnerförslag | ROI-resultat inleds nu "Vad vill ni göra härnäst?" | AdvisoryOffer tool_result | befintliga calc_* | – |
| Partnerlistor | SELECT | Filter, AdvisoryOffer, ContextualCta | Tomma lägen i Alla partners och partnerjämförelsen: ändra filter, bredda, närliggande, hjälp | Partnerns webbplats, hjälp från d365.se | dead_end_* | Partnerväljarens tomläge hade redan rensa/kontakt och lämnades |
| Partnerprofiler (publicerade) | SELECT | StickyContactCTA, INSIDE, artiklar | Global fallback | Besök partnern, förfrågan | dead_end_* (fallback-klick) | – |
| Grundprofiler | SELECT | Tillbaka till alla partners | ContinueEvaluation (jämför partners, hitta partners, offerter, hjälp) | Hjälp från d365.se | dead_end_* | – |
| Kompetens | SELECT | ExpertRequirementExit | Oförändrat | Kompetensbehov till d365.se | expert_* | – |
| INSIDE | LEARN | Kanal, artikel, partnerprofil | INSIDE-sektionen visar "Utvärderar ni själva? Nästa steg" (behovsguide, partners, kostnad); videosidor får ContinueEvaluation | Hjälp från d365.se | dead_end_* | Partnerprofiler utan avsnitt visar inget INSIDE-block (avsiktligt) |
| ISV Vendor / ISV Product | EXPLORE | Lösningsrutan: produktens webbplats, hjälp, partner | Oförändrat (Sprint 1.9-exits) | Exit A/B | isv_* | Ingen egen leverantörssida finns; leverantören visas i lösningsrutan |
| Tilläggskategorier/katalog | EXPLORE | Filter + "Rensa filter" | Tomt resultat: rensa filter, visa alla statusar, partners, behovsguide, hjälp | Hjälp från d365.se | dead_end_* | – |
| Sökresultat (/fraga/) | LEARN | Svar, nästa steg, alternativ | – | PartnerCtaBlock | – | – |
| Tom/misslyckad sökning | LEARN | Bara ett tillfälligt meddelande | Beständigt block: formulera om, behovsguide, kostnad, partners, tillägg, hjälp | Hjälp från d365.se | dead_end_* | – |
| AI-chatt (/fraga-ai/) | LEARN | Inget efter chatten | ContinueEvaluation (search) | Hjälp från d365.se | dead_end_* | – |
| 404 | – | Startsidan, partnerväljaren | Fyra huvudvägar (CRM- eller affärssystem (ERP), kostnad, befintlig Dynamics 365, kompetens) + sök | Sök, huvudvägar | dead_end_* | – |
| Aktuellt (lista) | LEARN | Kort, tomläge med vägledning | ContinueEvaluation (aktuellt) | Hjälp från d365.se | dead_end_* | – |
| Aktuellt-artikel | LEARN | "Relevant nästa steg" | Oförändrat | – | – | – |
| Events, Partnernytt, Om oss, Q&A, Roller | LEARN | Egna CTA:er | Global fallback | Hjälp från d365.se | dead_end_* (fallback-klick) | – |

Kvarvarande luckor att ta ställning till: inga sidtyper slutar längre utan nästa steg. Kommersiell status påverkar aldrig vilka steg som visas.
