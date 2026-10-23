# components
- CountUp preserves supplied counts in server HTML and retargets client animations on async updates, cancelling superseded frames to avoid stale totals.
- BuyerFunnelCard (Sprint 6, /redaktion + admin) reads only funnel_events via funnel-stats action "buyer" (admin+editor); trackFunnelEvent auto-attaches plan segment (main_area/journey_state) from the local plan, so no PII or new tables.
- Public profile openings reuse downloadable badge SVGs, choosing the variant from live logo_dark_bg and requiring is_featured, so colors and eligibility follow partner data.
- Public partner cards use PartnerCardHeader for a native link across the identity area, name left and logo right; keep actions outside it and reuse downloadable SVGs through VerifiedPartnerBadge.

- Customer Service uses ServiceDecisionGuide and a product-specific shared ProductNextSteps ending with existing tools and partner anchors; page navigation stays separate from scoring and partner data.
- Page end matter sits together directly before Footer in the order sources (SourcesAndMethod or the home Källor list), EditorialSource, TrustBanner, so provenance is grouped and never interrupts content. EditorialSource (light) is the single bottom-of-page credits box, and merges registered authors from src/data/contentContributors.ts with publisher info; ExpertCard is no longer placed on pages, so authorship appears once and never fabricated.
- ISV reseller links verify profiles via public hooks.
- Partner switch guide (/guider/byta-dynamics-partner/) is a buyer need, not a partner competence: deterministic score-free analysis in src/lib/partnerSwitch.ts, results only from answers, matching via existing partner filters.

- Partnernytt (/partnernytt/) is the archive for partner content; buying pages show only ProductPartnerNewsSection (max 3, topic-matched via src/lib/contextualPartnerNews.ts, hidden without matches, placed just before RelatedPages), the home page has no partner-news feed, and partner profiles keep their own partner's posts, so news never competes with buying journeys.
- Min D365-plan (/underlag/) uses the scoped .plan-premium palette shared with partner profiles (petrol opening, plan-card surfaces, 72rem grid); FitModel takes `framed` to render inside that grid instead of its own narrow band, so other pages keep the default.
