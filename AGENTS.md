# Projektregler

- Important guides use question-led H1s and content-appropriate H2 sections, with existing short answers before editorial assessments; do not force empty sections or rewrite archive articles to fit a template.

- Guides use SourcesAndMethod at the bottom to separate explicit external citations, partner evidence and editorial analysis; absent references and source dates must not be fabricated, and inline SourceNote citations remain intact.

- Public partner lists share WhyTheseResults and PartnerSelectionFacts with explicit page context; this separates actual selection rules and registered evidence from AI assessments.
- FitModel renders the manually maintained matrices inside native details with locally saved priority selectors; tables stay in HTML and visitor priorities never change scores, partner evidence or ranking.
- Min D365-plan reuses buyerProfile and buyerContext, with d365Plan storing only local priorities and investigation area; keeps anonymous persistence without server data.
- ContextualCta resolves evaluation journeys through ctaJourney before partner personalization to avoid premature product/partner assumptions.

- Editorial guides, comparisons and industry pages use the shared EditorialSource near the title; pass only existing content dates and confirmed reviewers to avoid fabricated provenance.
- Central buying pages use EditorialAssessment with manually maintained, page-specific copy so conclusions remain consistently attributed and are never generated at runtime.

- Partnerns egna produktvisa beskrivningar av typiska kunder och projekt är primär källa för AI-assisterad lämplighetsbedömning; strukturerade val kontrollerar och kompletterar, eftersom publika sammanfattningar inte får motsäga partnerverifierad information.
- Publicerade artiklar, Partnernytt-inlägg och events ska förgenereras med innehållsspecifika Open Graph- och Twitter-taggar, eftersom sociala delningstjänster inte kör klient-JavaScript.
- Branschsidornas verifierade partnerresultat renderas via ett gemensamt beslutsstödskort, så partneruppgifter, belägg och AI-bedömning hålls källmässigt åtskilda.
- Partnermastermodellen använder en katalog, produktprofiler, gemensamma attribut/förmågor och branschlösningar; legacy är skrivspärrad och export v1.0 stabil. ERP-basval efterfrågas inte för BC/F&SCM. Power Apps, Automate, Pages och Dataverse lagras endast som Power Platform. Copilot Studio och AI-agenter lagras endast som den gemensamma förmågan `copilot-studio`. Se docs/PARTNER-MASTER-MODEL.md. Används inte för ranking/matchning.
- Partner Review Queue: see supabase/functions/_shared/AGENTS.md; partner counts and BC project-cost model: see src/data/AGENTS.md.
- Frågan om särskilda projekt och leveransformer ställs inte för någon produkt (alla partners skulle kryssa i allt); data finns kvar men visas inte.

- `/roller/` ligger under Guider, länkar bara till befintligt innehåll och ändrar inte produktnavigationen.
- businesscentral.se läser BC-fält live från den publika vyn `bc_partners_v1` (schema 1.0, inga kontaktuppgifter, COSMO aldrig som branschlösning); källan sätts automatiskt (partner/redaktion), eftersom manuella verifieringsfält togs bort.
- Sökprestanda hämtas dagligen från Search Console (primär) och Bing via `search-performance` (`search_perf_daily`), grupperat efter `serp_watch_phrases` (omatchat = "Övrigt"); konkurrenter endast via manuella Semrush-CSV:er (`competitor_csv_*`), eftersom Semrush API kräver Business-plan och inte schemaläggs.
- Central page copy (d365.se description, ownership texts, founders/contact) lives in the site_texts textbank, edited in /redaktion via the site-texts function and snapshotted to src/data/siteTexts.json at build with defaults in siteTextDefaults.ts; keeps all pages consistent and SSG-safe.

- CRM page and market-data rules: see src/data/AGENTS.md.

- Published partner profiles share the opening's scoped palette/type tokens and 72rem content grid throughout; continuation hooks flatten section frames only within the profile, preserving shared cards, basic profiles, ranking, facts and action contexts.
- Köparförfrågningar går via submit-inquiry (tabeller inquiries/inquiry_partners) och partnerhändelser via track-event (partner_tracking_events, eftersom partner_events redan är eventkalendern); båda delas med businesscentral.se via source_site.
- Scope index.html critical CSS to nav (bare CTA selectors leak).
- Navbar.tsx MENUS drives main nav (ERP/CRM parity); nav CTA CSS targets `a[data-nav-cta]`.
- Read subdir AGENTS.md.
- Buyer funnel groups by anonymous journey_id (else session_id): returning visitors = one journey, no PII.
- Optional buyer accounts mirror the localStorage keys in src/lib/accountSync.ts to buyer_saved_state (own-row RLS); server wins on login, so tools stay account-unaware.

<!-- LOVABLE:BEGIN -->
- Site Intelligence uses the unmodified exported SDK and dictionaries through one consent-gated test adapter, replacing its legacy sender without changing backend statistics.
<!-- LOVABLE:END -->
- Requirement specs (ERP/Sales/Service/Marketing) restore and save industry, size and areas via useKravProfileSync in src/lib/kravProfile.ts; URL/test prefill wins, profile is the fallback, so context survives any entry path.
