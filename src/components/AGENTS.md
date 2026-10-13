# components
- BuyerFunnelCard (Sprint 6, /redaktion + admin) reads only funnel_events via funnel-stats action "buyer" (admin+editor); trackFunnelEvent auto-attaches plan segment (main_area/journey_state) from the local plan, so no PII or new tables.
- Public profile openings reuse downloadable badge SVGs, choosing the variant from live logo_dark_bg and requiring is_featured, so colors and eligibility follow partner data.
- Public partner cards use PartnerCardHeader for a native link across the identity area, name left and logo right; keep actions outside it and reuse downloadable SVGs through VerifiedPartnerBadge.
