# Projektregler

- Important guides use question-led H1s and content-appropriate H2 sections, with existing short answers before editorial assessments; do not force empty sections or rewrite archive articles to fit a template.

- Guides use SourcesAndMethod at the bottom to separate explicit external citations, partner evidence and editorial analysis; absent references and source dates must not be fabricated, and inline SourceNote citations remain intact.

- Public partner lists share WhyTheseResults and PartnerSelectionFacts with explicit page context; this separates actual selection rules and registered evidence from AI assessments.
- FitModel renders the manually maintained matrices inside native details with locally saved priority selectors; tables stay in HTML and visitor priorities never change scores, partner evidence or ranking.
- Min D365-plan reuses buyerProfile and buyerContext, with d365Plan storing only local priorities and investigation area; this keeps existing answers and anonymous persistence intact without new server data.
- ContextualCta resolves evaluation journeys through ctaJourney before partner personalization; this prevents generic ERP/CRM and comparisons from prematurely assuming a product or partner recommendation.

- Editorial guides, comparisons and industry pages use the shared EditorialSource near the title; pass only existing content dates and confirmed reviewers to avoid fabricated provenance.
- Central buying pages use EditorialAssessment with manually maintained, page-specific copy so conclusions remain consistently attributed and are never generated at runtime.

- Partnerns egna produktvisa beskrivningar av typiska kunder och projekt är primär källa för AI-assisterad lämplighetsbedömning; strukturerade val kontrollerar och kompletterar, eftersom publika sammanfattningar inte får motsäga partnerverifierad information.
- Publicerade artiklar, Partnernytt-inlägg och events ska förgenereras med innehållsspecifika Open Graph- och Twitter-taggar, eftersom sociala delningstjänster inte kör klient-JavaScript.
- Branschsidornas verifierade partnerresultat renderas via ett gemensamt beslutsstödskort, så partneruppgifter, belägg och AI-bedömning hålls källmässigt åtskilda.
- Partnermastermodellen använder en katalog, produktprofiler, gemensamma attribut/förmågor och branschlösningar; legacy är skrivspärrad och export v1.0 stabil. ERP-basval efterfrågas inte för BC/F&SCM. Power Apps, Automate, Pages och Dataverse lagras endast som Power Platform. Copilot Studio och AI-agenter lagras endast som den gemensamma förmågan `copilot-studio`. Se docs/PARTNER-MASTER-MODEL.md. Används inte för ranking/matchning.
- Partner Review Queue logic lives in supabase/functions/_shared (see its AGENTS.md).
- Frågan om särskilda projekt och leveransformer ställs inte för någon produkt (alla partners skulle kryssa i allt); data finns kvar men visas inte.

- Rollvägledningen på `/roller/` ligger under Guider och länkar endast till befintligt innehåll; den ändrar inte produktnavigationen.
- businesscentral.se läser BC-fält live från den publika vyn `bc_partners_v1` (schema 1.0, inga kontaktuppgifter, COSMO aldrig som branschlösning); källan sätts automatiskt (partner/redaktion), eftersom manuella verifieringsfält togs bort.
- Sökprestanda hämtas dagligen från Search Console (primär) och Bing via `search-performance` (`search_perf_daily`), grupperat efter `serp_watch_phrases` (omatchat = "Övrigt"); konkurrenter endast via manuella Semrush-CSV:er (`competitor_csv_*`), eftersom Semrush API kräver Business-plan och inte schemaläggs.
- Central page copy (d365.se description, ownership texts, founders/contact) lives in the site_texts textbank, edited in /redaktion via the site-texts function and snapshotted to src/data/siteTexts.json at build with defaults in siteTextDefaults.ts; keeps all pages consistent and SSG-safe.

- CRM pages lead with the buyer problem (BuyerFitSection from crmBuyerFit.ts, generic guides in crmCategoryGuides.ts) before Microsoft product detail; CRM market figures are computed at build by scripts/generate-crm-market-data.mjs from published partners only, so numbers stay sourced and SSG-safe.

- Published partner profiles share the opening's scoped palette/type tokens and 72rem content grid throughout; continuation hooks flatten section frames only within the profile, preserving shared cards, basic profiles, ranking, facts and action contexts.
- Köparförfrågningar går via submit-inquiry (tabeller inquiries/inquiry_partners) och partnerhändelser via track-event (partner_tracking_events, eftersom partner_events redan är eventkalendern); båda delas med businesscentral.se via source_site.
