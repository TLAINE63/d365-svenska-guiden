# components
- CountUp preserves supplied counts in server HTML and retargets client animations on async updates, cancelling superseded frames to avoid stale totals.
- BuyerFunnelCard (Sprint 6, /redaktion + admin) reads only funnel_events via funnel-stats action "buyer" (admin+editor); trackFunnelEvent auto-attaches plan segment (main_area/journey_state) from the local plan, so no PII or new tables.
- Public profile openings reuse downloadable badge SVGs, choosing the variant from live logo_dark_bg and requiring is_featured, so colors and eligibility follow partner data.
- Public partner cards use PartnerCardHeader for a native link across the identity area, name left and logo right; keep actions outside it and reuse downloadable SVGs through VerifiedPartnerBadge.

- Customer Service uses ServiceDecisionGuide and a product-specific shared ProductNextSteps ending with existing tools and partner anchors; page navigation stays separate from scoring and partner data.
- ExpertCard renders only contributors explicitly registered in src/data/contentContributors.ts; FactBox holds citation-friendly facts, so no fabricated expertise.
- ISV reseller links verify profiles via public hooks.
- Partner switch guide (/guider/byta-dynamics-partner/) is a buyer need, not a partner competence: deterministic score-free analysis in src/lib/partnerSwitch.ts, results only from answers, matching via existing partner filters.
