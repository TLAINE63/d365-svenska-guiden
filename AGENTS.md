# Projektregler

- Important guides use question-led H1s and content-appropriate H2 sections, with existing short answers before editorial assessments; do not force empty sections or rewrite archive articles to fit a template.

- Guides use SourcesAndMethod at the bottom to separate explicit external citations, partner evidence and editorial analysis; absent references and source dates must not be fabricated, and inline SourceNote citations remain intact.

- Public partner lists share WhyTheseResults and PartnerSelectionFacts with explicit page context; this separates actual selection rules and registered evidence from AI assessments.
- FitModel renders the manually maintained matrices inside native details with locally saved priority selectors; tables stay in HTML and visitor priorities never change scores, partner evidence or ranking.
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
- Read subdir AGENTS.md (src/lib: buyer context, plan, accounts, kravspec and Systemval handoff).
- Buyer funnel groups by anonymous journey_id (else session_id): returning visitors = one journey, no PII.
- SEO titles are shortened in src/lib/seoTitle.ts (drop trailing sub-title at a separator, then drop brand suffix, ellipsis last); the prerender safety net leaves Helmet (data-rh) titles alone and decodes entities first, so titles are never cut twice or mid-"&amp;".
- Aktuellt (d365.se's own change analyses) lives in knowledge_articles with content_type "aktuellt", internal AI assessments in knowledge_article_assessments (no public access), and all writes via manage-aktuellt; the DB trigger blocks publishing without approval, primary source, fact-check date and cleared verification, so neither AI nor a future intake agent can publish; the /redaktion/ queue publishes in one editor click (approve then publish), and pages take their context from AKTUELLT_PLACEMENTS, which also tells the editor where an article will appear. Partnernytt stays a separate model.

<!-- LOVABLE:BEGIN -->
- Site Intelligence uses the unmodified exported SDK and dictionaries through one consent-gated test adapter, replacing its legacy sender without changing backend statistics.
<!-- LOVABLE:END -->
- Meta descriptions pass through fitMetaDescription (src/lib/metaDescription.ts) in SEOHead and the prerender fallback: max 160 chars, cut at full sentences, suffix only if it fits whole; sitemap generation skips any legacy-redirect source, so Bing never sees over-long descriptions or redirect URLs.
- Advisory (WP1): bookings reuse inquiries (is_advisory, via PlanContactDialog advisory mode → submit-inquiry, which opens one new advisory_cases row per booking); partner_introductions and advisory_case_links are admin-only (service role via manage-advisory, admin JWT) with DB triggers enforcing consent before sending, the qualification rule and anonymous funnel_events logging; public placements use the shared AdvisoryOffer, so no parallel booking flow exists and direct partner requests stay separate.
- Word articles from /redaktion are converted in the browser (src/lib/wordArticle.ts), sanitized and stored by manage-knowledge-articles in knowledge_articles.body_html (images in partner-documents/redaktion-artiklar, since new public buckets are blocked), and rendered by BlogArticle via editorRowToBlogArticle with SSR data from entry-server; coded articles win on slug clashes and nothing publishes without the editor's switch. Editors link an article to partner profiles via knowledge_articles.partner_slugs (picked in the dialog), and PartnerArticlesSection lists them on those profiles, so the link is an explicit editorial choice, never inferred from tags or text.
- Single YouTube videos are added by link via manage-d365-videos add-video (admin or editor token), saved as status new with AI-suggested summary, so the editor publishes them; channel ingest stays separate.
- Heading outline: footer column titles are h2 and CardTitle takes `as` (default h3), so pages never skip from h1 to h3; check new sections keep h1 > h2 > h3.
