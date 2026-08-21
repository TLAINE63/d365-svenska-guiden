UPDATE public.partners
SET admin_notes = coalesce(admin_notes || E'\n', '') ||
  '[2026-08-21] FLAGGAD FÖR VERIFIERING: oklart om bolaget fortfarande är aktiv svensk Dynamics 365-partner. Ingen svensk kartpinne tills ny verifiering.'
WHERE slug IN ('eg-sverige','future-it-partner');