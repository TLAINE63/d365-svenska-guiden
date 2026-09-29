# Projektregler

- Partnerns egna produktvisa beskrivningar av typiska kunder och projekt är primär källa för AI-assisterad lämplighetsbedömning; strukturerade val kontrollerar och kompletterar, eftersom publika sammanfattningar inte får motsäga partnerverifierad information.
- Publicerade artiklar, Partnernytt-inlägg och events ska förgenereras med innehållsspecifika Open Graph- och Twitter-taggar, eftersom sociala delningstjänster inte kör klient-JavaScript.
- Branschsidornas verifierade partnerresultat renderas via ett gemensamt beslutsstödskort, så partneruppgifter, belägg och AI-bedömning hålls källmässigt åtskilda.
- Partnermastermodell: product_catalog + partner_product_profiles + produktmoduler (partner_bc_attributes, partner_industry_solutions); generell data bara på partners; skrivs endast via manage-partner-master (admin) och profileringslänken; export via export_bc_partner_v1. Se docs/PARTNER-MASTER-MODEL.md. Används inte för ranking/matchning, så nuvarande logik påverkas inte.
