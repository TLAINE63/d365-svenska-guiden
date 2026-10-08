# _shared

- Partner Review Queue: all logik (klass A/B/C, regelbaserad förifyllning, partnersvar, redaktionella beslut) ligger i supabase/functions/_shared/partner-review.ts och används av manage-partner-master (admin) och partner-invitations (token); partnerns ändringar blir rader i partner_review_changes ; för publicerade partners (is_featured) publiceras ändringarna direkt och loggas som auto-godkända (Thomas beslut 2026-09-29), övriga väntar på redaktionellt godkännande. Förifyllning läser aldrig AI-genererade texter.
