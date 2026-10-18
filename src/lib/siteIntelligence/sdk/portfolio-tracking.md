# Portfolio Intelligence — Sprint 1

The existing Site Intelligence interface, SEO, partners and four-stage journey view are retained. New canonical fields prepare the five-stage view for Sprint 2. No traffic provider, external site code or published deployment is changed here.

## Sources and storage

- `journey_events`: one behavioral event stream, containing original event/stage alongside canonical event and buyer stage, source, product area, topic and partner slug. Do not add a second stream for the same events.
- `traffic_daily`: actual users, sessions, engaged sessions, organic sessions and conversions per site, date and source. Unknown metrics remain NULL; table is empty until an actual source is integrated.
- Existing search snapshots, imports and partner daily aggregates remain separate and unchanged.
- `behavior_event_definitions`: registry of active event names and stage mapping. Add a definition to support a future event without rebuilding the event schema. Nullable intent weights have deliberately not been invented.
- `buyer_intent_settings`: minimum actual session/event coverage. Thresholds and weights must be explicitly configured before Sprint 2 computes an index. A session identifier does not establish a distinct user.
- `sites.tracking_hostname` and `tracking_path_prefix`: route `/no` and `/no/...` on d365guide.com to its existing Norway site row; other paths go to the international row. Most-specific path wins; `/nothing` is not Norway.

## Tracking contract for the portfolio site projects

POST to `https://sajt-analys.lovable.app/api/public/track-journey` after Site Intelligence is published. Continue using the old payloads until the site project adopts this contract. Do not install another listener for interactions already tracked.

```typescript
const payload = {
  events: [{
    session: anonymousSessionId,
    type: "partner_outbound_click",
    event_key: crypto.randomUUID(), // create once per action; reuse on retries
    url: window.location.pathname,
    partner_slug: "partner-slug",
    product_area: "business_central",
    topic_key: "partner",
    ts: new Date().toISOString(),
  }],
};
fetch("https://sajt-analys.lovable.app/api/public/track-journey", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
  keepalive: true,
}).catch(() => {});
```

Use an anonymous per-session ID, not an email, company name, IP address or stable cross-domain identity. Existing visitor-style IDs are still accepted for compatibility, but cannot provide trustworthy session metrics until senders adopt session IDs. Include all visitors, including Thomas and partners. No personal data in paths or classification labels. Query strings/fragments are removed by the receiver. The only accepted metadata keys are `step` and `status` for the existing underlag widget; other legacy metadata is ignored. Prefer flat `product_area`, `topic_key`, `partner_slug` fields.

Batch 1–200 events. Session and replay keys: max 128 characters; classification labels: max 80. Register new types first. Unknown types and malformed batches return 400, unknown origins 403, excessive payloads 413. The whole batch is rejected before insertion if any event is unsupported. Cross-origin full URLs are rejected. Optional event keys deduplicate per reporting site; a replay returns `tracked: 0`. Missing keys preserve append-only legacy behavior. Origin matching reduces unintended browser submissions but is not proof against a malicious non-browser client forging Origin; do not use it as a trusted conversion/payment verification mechanism.

## Standard mappings

| Stage | Events |
| --- | --- |
| DISCOVERY | page_view (generic information/article) |
| RESEARCH | product_view, pricing_view, guide_start, guide_complete, calculator_start, calculator_complete, cta_click, tool_use, download |
| COMPARISON | comparison_view, journey_step |
| PARTNER_SELECTION | partner_list_view, partner_profile_view, partner_comparison, lead_start |
| CONVERSION | partner_outbound_click, lead_submit, demo_booking |

`cta_click` alone does not prove conversion; send the actual lead/outbound event separately when observed. A comparison-type page view maps to COMPARISON; a product/pricing page to RESEARCH. Legacy aliases: partner_view → partner_profile_view, partner_click → partner_outbound_click, form_start → lead_start, form_submit/lead → lead_submit. `stage` is optional; canonical stages and the four legacy Swedish stage values are accepted.

## Verification after sender installation

1. Trigger one real interaction on the relevant site and confirm a POST with `{ok:true, tracked:1}`.
2. Repeat exactly the same event key: `{ok:true, tracked:0}`; no second database event.
3. Confirm `site_id`, `source_key`, canonical event and five-stage classification in the private database. Norway should belong to the Norway site ID.
4. Confirm the existing Köpresa timeline still shows it through the preserved legacy fields.
5. Verify no personal information was sent. Do not create fake production data to test integrations.

Traffic connections, global period/compare/product filters, Buyer Behavior/Intent, Market Pulse and other later-sprint views are not implemented in Sprint 1. External tracking installation remains an action for each site project; this project must never modify them.

## Version 2 — strict Sprint 1 integration

The legacy example above remains supported and is labelled `validation_status=legacy`. New sites should use `src/lib/tracking-service.ts` and `src/lib/tracking-contract.ts`, not another handwritten tracker. These browser-safe files are the reusable SDK; they do not import credentials or database code. `trackEvent(name, parameters)` creates the envelope, checks consent/schema/registry, and sends a non-blocking keepalive POST. The receiver loads the authoritative active registry and dimension rows and validates before storing. Events are append-only. Never await tracking before navigation or before finishing a confirmed form submission.

### Connection steps

1. Register the site in existing Settings and set its `site_key`, `tracking_hostname` and `tracking_path_prefix` in the private database. A new hostname must have an active row. Reuse the most-specific path rule for language sections. Existing keys: `d365_se`, `businesscentral_se`, `d365guide_com`, `d365guide_no`, `fpaa_se`.
2. Export active definitions (`event_key`, `required_parameters`, `journey_stage_v2`, `active`) and engagement configuration from the private database for the site's initial integration. These non-secret configuration values can be bundled in the sending site. They must match the authoritative central registry; do not invent local event definitions. This sprint does not expose private dictionaries through a public read endpoint.
3. Copy the two SDK files to the sending project. Create a single service instance with `endpoint`, the registered `siteId`, the exported registry, `environment:"test"`, shared `config`, and the sending site's actual `consent:()=>analyticsConsentGranted`. Do not use a constant true consent in production. `onValidationError` can surface safe codes in the site's development console.
4. Register product/topic/provider/content keys before using them. `provider_id` in the event contract is the stable `providers.provider_key`, not the partner slug or a name. Existing partners are linked through `partners.provider_id`. Reuse provider identities across sites; do not make a new supplier row merely for a different site. Content keys belong to one reporting site. Do not send unregistered keys from example payloads.
5. Connect the actual triggers in the event dictionary below. Replace duplicate existing listeners rather than adding a parallel collector. Call page_view on router navigation, once on initial display; never on every render. Call `observeEngagement` with active visible seconds and configured interactions. The SDK is a helper, not an automatically installed event listener.
6. Verify all relevant events in TESTDATA through Diagnostics. Replay the same action ID to confirm deduplication. Verify the actual site's form handling still works, then change the sender to production. Publishing this receiver is a separate explicit action; until then existing published clients keep the old receiver.

### Common envelope and a complete example

All 12 events require event_name, event_id (UUID), event_timestamp (ISO timestamp), site_id (stable site key), session_id and anonymous_visitor_id (random UUIDs), page_url, page_path, page_title, and consent=`granted`. `environment` defaults to production but must explicitly be test during verification. For page_view provide a per-navigation UUID `page_instance_id`; reuse it on rerenders/retries, change it on an actual navigation. The SDK supplies it automatically for pathname changes. Hash/query-only navigation is not a new page in this path-based contract.

```json
{
  "events": [{
    "event_id": "10000000-0000-4000-8000-000000000001",
    "page_instance_id": "10000000-0000-4000-8000-000000000002",
    "event_name": "product_view",
    "event_timestamp": "2026-10-18T10:00:00Z",
    "site_id": "businesscentral_se",
    "session_id": "20000000-0000-4000-8000-000000000001",
    "anonymous_visitor_id": "30000000-0000-4000-8000-000000000001",
    "page_url": "https://businesscentral.se/produkt",
    "page_path": "/produkt",
    "page_title": "Business Central",
    "page_type": "product",
    "product_id": "business_central",
    "journey_stage": "research",
    "environment": "test",
    "consent": "granted"
  }]
}
```

Optional common dimensions: product_id, solution_category_id (classification key), topic_id, content_id, provider_id/provider_type, page_type, comparison_type, cta_type, traffic_source/medium/campaign, device_category, country_code, referrer. Missing values stay NULL; never substitute a numeric zero for an unknown metric. Optional journey_stage must agree with the registry. The examples below are parameter additions to the envelope, not production seed data.

### Event dictionary

| Event | Trigger / do not trigger | Required event parameters | Optional event parameters | Stage | Example additions |
|---|---|---|---|---|---|
| page_view | Initial visible page and actual pathname change; not a rerender | page_type | product/topic/content/provider dimensions, page_instance_id | discovery | `{"page_type":"article"}` |
| engaged_session | Once after configured visible active time, two relevant pages or configured interaction; not background time | engagement_reason, engaged_time_seconds, page_view_count | interaction_event (required for interaction reason) | research | `{"engagement_reason":"active_time","engaged_time_seconds":30,"page_view_count":1}` |
| scroll_depth | First crossing of each 50/75/90 threshold per path/session; not repeated scroll notifications | scroll_percent, page_type | product_id, topic_id, content_id | research | `{"scroll_percent":75,"page_type":"guide"}` |
| internal_search | A performed search, or selected result linked to its performed search; not typing each character | search_term_normalized, result_count | selected_result_id, selected_result_type (together, only on result click) | discovery | `{"search_term_normalized":"business central","result_count":3}` |
| internal_link_click | Relevant internal navigation click; not merely showing a link | link_url, link_context | link_text_normalized, source/destination_page_type, source/destination_product_id | research | `{"link_url":"/jamforelse","link_context":"comparison_link"}` |
| product_view | Visible product-specific content; not generic mention elsewhere | product_id, page_type | topic_id, content_id | research | `{"product_id":"finance_scm","page_type":"product"}` |
| engaged_content_view | Configured active time AND depth for registered content, once per content/session; not passive page view | content_id, page_type, engaged_time_seconds, max_scroll_percent | product_id, topic_id | research | `{"content_id":"REGISTERED_CONTENT_KEY","page_type":"guide","engaged_time_seconds":30,"max_scroll_percent":50}` |
| pricing_view | Visible price/cost content; not a price link click | pricing_type | product_id, topic_id, content_id | consideration | `{"pricing_type":"implementation_cost","product_id":"business_central"}` |
| comparison_view | A visible real comparison with registered entities; not an empty comparison form | comparison_type, primary_entity_id, compared_entity_ids | product_id, topic_id, content_id | consideration | `{"comparison_type":"product_vs_product","primary_entity_id":"business_central","compared_entity_ids":["finance_scm"]}` |
| provider_profile_view | Visible supplier profile; not directory impression | provider_id, provider_type | product_id, content_id, view_context | selection | `{"provider_id":"REGISTERED_PROVIDER_KEY","provider_type":"dynamics_partner"}` |
| outbound_provider_click | Actual supplier destination click, before leaving; not card impression | provider_id, provider_type, destination_type, link_placement | source_page_type, source_content_id, product_id, solution_category_id | selection | `{"provider_id":"REGISTERED_PROVIDER_KEY","provider_type":"dynamics_partner","destination_type":"provider_website","link_placement":"provider_profile"}` |
| lead_submit | Only after the existing form handler confirms receipt; never a submit-button click | lead_type, form_id, submission_status=confirmed | product_id, provider_id/provider_type, source_page_type, source_content_id | conversion | `{"lead_type":"partner_match","form_id":"partner-match-form","submission_status":"confirmed"}` |

Product, pricing and lead events retain their registered stages, not locally inferred funnel stages. Legacy names remain aliases in the compatibility path, not competing new definitions.

### Dimension dictionary

- **Products:** business_central, finance, supply_chain_management, finance_scm, sales, customer_service, customer_insights, field_service, project_operations, commerce, human_resources, power_bi, power_apps, power_automate, copilot_studio, power_platform, fp_and_a, other_erp, other_crm, other_fp_and_a.
- **Topics:** price, licensing, implementation, implementation_cost, partner_selection, product_comparison, migration, upgrade, integration, ai_copilot, reporting_bi, budgeting, forecasting, consolidation, scenario_planning, security, industry_solution, support, change_management, data_migration.
- **Page types:** home, product, category, pricing, cost_guide, comparison, implementation, migration, licensing, partner_directory, partner_profile, isv_directory, isv_profile, csp_profile, case_study, article, guide, glossary, wizard, form, search_results, other.
- **Providers:** dynamics_partner, isv, csp, microsoft, other_provider. Reuse one registered provider across sites. Existing identity mapping is additive; future imported suppliers need reconciliation, not name-only automatic merge.
- **Stages:** discovery, research, consideration, selection, conversion. Canonical uppercase and Swedish legacy fields are preserved for older consumers.
- **Pricing:** license_price, implementation_cost, total_cost, tco, pricing_overview, cost_comparison.
- **Comparisons:** product_vs_product, product_vs_category, partner_vs_partner, isv_vs_isv, approach_vs_approach.
- **Leads:** partner_match, provider_contact, consultation, guide_request, demo_request, general_contact, newsletter, other.
- **Content:** stable registered content_key plus site, URL, title, content/page type, primary product/topic and publish timestamps. The analytics content model does not replace existing editorial workflows.

### Privacy, quality and export boundaries

No query parameter is retained in stored URLs. Allowlisted query-derived classifications are ONLY `utm_source`→traffic_source, `utm_medium`→traffic_medium, `utm_campaign`→traffic_campaign, supplied explicitly by the sender and restricted to safe identifier characters. No automatic copying of URL query data; unknown parameters and fragments are stripped. Internal link URLs are path-only; referrer is origin-only. Reject obvious email/phone/password-like strings in text/path fields. This is heuristic minimization, not a guarantee for arbitrary personal names: never provide form values, company names, customer-specific path IDs or private titles. Strict metadata permits only step/status. Validation logs contain safe error codes, never raw rejected payloads or IDs.

No ID or storage access before consent. Respect Do Not Track. IDs are random per site, session starts again after 30 minutes inactivity by the initial shared configuration. No cross-site identity joins. Existing Thomas/partner visits remain included. No automated bot-detection vendor or all-bot exclusion is claimed; test environments can be excluded and future known bots must be classified by the actual sender, never guessed here.

The database enforces replay uniqueness and semantic dedup per site/environment; page_instance_id handles rerenders, scroll is once per level/path/session, engaged content is once per content/session, engaged session once per session. Action event UUIDs must be reused on retries. Changing action IDs intentionally creates separate clicks. Origin validation is not cryptographic sender authentication; a non-browser can forge Origin. Do not use these analytics events as authoritative financial/conversion records.

`behavior_monthly` groups production events by UTC month, site, event, product, topic, page type, provider/type and stage. Session counts are anonymous sessions, not persons; visitor counts are NULL when no visitor IDs exist. Never label partial legacy coverage as complete unique-user counts. Source-provider totals stay in traffic_daily and are not summed with event sessions.

The SDK accepts optional `destinations` callbacks for GA4 or another approved destination using the same validated event object; callbacks run after receiver approval and obey consent. Configure GA4 credentials/measurement settings in the sending site's existing analytics setup. No GA4 connection, property creation, or external forwarding was enabled in this sprint. Do not install another independent page_view collector. Receiver-side dimension validation remains authoritative.

Diagnostics is available at `/diagnostics` after signing in. It returns full-period totals but limits recent events to 100 and quality logs to 50; session and visitor IDs are masked. TESTDATA can be deleted by selected site/date/event filters without deleting production data. Legacy events appear with missing new parameters honestly; they are not silently backfilled with invented classifications. A zero registered quality-error count means no error logged, not proof that a site's new sender is installed.

## Delivery and acceptance — 18 October 2026

**Database:** migrations 0006–0010 added site routing keys; behavior_event_definitions, traffic_daily, buyer_intent_settings, products, providers, intelligence_content, event_quality_log, tracking_configuration; extended topics, partners and journey_events; added compatibility normalization, replay/semantic indexes, production-only monthly view and member-scoped diagnostics RPC. Existing data was retained; registry rows are configuration, not invented analytics.

**Implementation:** behavior-events.ts, tracking-contract.ts, tracking-service.ts, tracking-ingest.ts, track-journey API, authenticated diagnostics.tsx and navigation; existing journey.tsx now excludes test data. Architecture rules and regression/contract tests are retained. No external site was edited and nothing was published.

**Verified:** all 12 names sent individually as TEST through the actual receiver and read back as 12 valid test rows; replay checks for page_view, scroll_depth, engaged_content_view and engaged_session were stopped; unconfirmed lead rejected; query values stripped; Diagnostics read while signed in, event/environment filters exercised; signed-out direct access redirected to login. The 12 synthetic event rows and temporary content row were deleted, with 5 safe TEST quality logs retained. Unit tests cover all event schemas, scroll levels, missing provider/pricing/confirmation, unknown products, unsafe metadata, normalization, consent, dedup and network failure. Existing production Diagnostics displayed 513 events in the checked 30-day interval, all missing the new page_type; actual external v2 collection is not verified.

| # | Acceptance criterion | Status |
|---|---|---|
| 1 | Shared event model | Klart |
| 2 | Four sites plus Norway section | Klart |
| 3 | Product, topic, content and provider models | Klart |
| 4 | 12 Sprint 1 definitions | Klart |
| 5 | One shared tracking function | Delvis klart — SDK ready; site adoption pending |
| 6 | Required parameter validation | Klart |
| 7 | Page, scroll and content dedup | Klart |
| 8 | Test/production separation | Klart |
| 9 | Each of 12 event types verified | Klart — isolated TEST receiver check |
| 10 | Lead events without form values | Klart — strict v2 contract; sender rollout pending |
| 11 | Identifying query data stripped | Klart |
| 12 | Monthly site/event/product aggregates | Klart |
| 13 | Private Diagnostics works | Klart |
| 14 | Missing parameters and quality issues | Klart |
| 15 | Tracking failures cannot block site workflow | Delvis klart — SDK safe; external sender wiring not checked |
| 16 | Existing measurement and forms work | Delvis klart — internal regressions checked, external forms untouched/unverified |
| 17 | Documentation and event dictionary | Klart |
| 18 | New-site integration guide | Klart |
| 19 | Consistent event definitions | Klart — active central registry authoritative |
| 20 | No premature scores or market claims | Klart |

Remaining outside this project: explicit publication, site-by-site consent and router/form integration, real sender acceptance, GA4 configuration and traffic provider hookup. Intent weights/coverage settings remain unconfigured. Sprint 2 can build buyer behavior/journey/intent only after sufficient real coverage; this sprint adds no invented index, public market reporting or advanced dashboard.

## Sprint 2 — Buyer Journey delivery

The private `/journey` screen now provides nine tabs: overview, funnel, actual transitions, common paths, product transitions, comparisons, directional/normalized pairs, content contribution and quality. Historical legacy events remain visible separately; no five-stage history is fabricated. Periods select sessions by their start time and fetch their complete recorded paths. Filters select whole sessions containing the chosen product/topic/page/source/medium/device; they are not event-only slices. Monthly rows use session start month. Production is the default and all real visitors remain included.

### Additional event dictionary

All events use the v2 envelope, consent rules and registered dimensions above. The SDK now depends on `journey-rules.ts` as well as `tracking-contract.ts`; copy all three browser-safe modules and preserve relative imports.

| Event | Actual trigger and required additions |
|---|---|
| comparison_start | Real comparison beginning: comparison_id, comparison_type, primary_entity_id, compared_entity_ids, start_method |
| comparison_interaction | Deliberate comparison action: comparison_id, comparison_type, interaction_type, user_initiated=true |
| comparison_complete | Qualified end: comparison_id/type, primary_entity_id, compared_entity_ids, completion_method and qualifying measurements |
| comparison_result_click | Selected result: comparison_id/type, selected_entity_type/id, destination_type |
| alternative_view | Visible alternative: primary_entity_type/id, alternative_entity_type/id, alternative_category |
| provider_comparison_start | comparison_id, at least two distinct registered provider_ids, provider_type, start_method |
| provider_comparison_interaction | Same provider identity fields plus interaction_type, user_initiated=true |
| provider_comparison_complete | Same provider identity fields plus completion_method and qualifying measurements |
| wizard_start | wizard_id, wizard_type, total_steps |
| wizard_step_complete | wizard_id/type, step_id, step_number, selected_option_ids (identifiers, never answers/free text) |
| wizard_complete | wizard_id/type, total_steps, completed_steps, result_type; all steps must be complete; not a lead |
| buyer_next_step_click | next_step_type, current_journey_stage, intended_next_journey_stage, destination_page_type; intent does not prove arrival |
| multiple_products_viewed | Receiver-derived once at two distinct products; never send manually |
| repeated_product_view | Receiver-derived after intervening classified content or deliberate revisit after configured time; never send manually |
| multiple_comparisons_viewed | Receiver-derived once at two registered comparisons; never send manually |
| multiple_providers_viewed | Receiver-derived once at two distinct providers; never send manually |
| journey_step_reached | Receiver-derived for observed stages only, never invented intermediate stages |

Register `comparisons` per reporting site and stable `comparison_entities` for non-product alternatives before sending. Comparison start/completion identity includes comparison ID, configuration ID, primary entity and ordered compared entity/provider IDs. Completion must have a matching prior start. Initial qualification is active time >=30s AND scroll >=75%, OR >=3 criteria AND >=2 interactions, OR a deliberate result/next-step/provider choice. Plain exit, timeout or start never implies completion. These thresholds live in `tracking_configuration.key=journey`; effective-dated stage mappings live in `journey_rules`. No historical reclassification occurs. Optional approved content stages are used only for new received content events.

Funnel step ratios intentionally divide counts reaching a destination by counts reaching the preceding stage; they can exceed 100% with skipped stages and are not actual transition counts. Actual transitions use ordered observed stages, including backward moves and direct skips. Comparison associations are labelled neutrally; no causal effect is inferred. Small paths are suppressed below the configured session threshold (initially three). Market preparation remains private database views, with no public market/sponsor/intent UI.

### Acceptance and limits

Verified locally while signed in: a TEST journey through all five stages, two products, comparison start/interaction/completion, provider view and confirmed lead was accepted, read back through the UI, and replayed without another start. TEST/production selection, comparisons, quality, threshold save/readback/restore and signed-out access were exercised. Regression tests cover the fourteen requested scenarios plus central rules, privacy and derived counting. Test rows and the temporary comparison definition are removed after verification.

External v2 senders are **not verified or installed** by this sprint. Existing production records lack new stage/dimension coverage; missing analytics remain labelled rather than claimed as complete. No external website or form changed and nothing was published. Each site project must register its actual comparison/content keys, adopt the shared contract with real consent, verify its actual router/comparison/wizard/form triggers in TEST, then enable production only after explicitly requested receiver publication. Analytics origin checking and client confirmation are not cryptographic proof of a conversion. Derived rows are idempotently repaired on retries; raw and derived row writes are not one database transaction.