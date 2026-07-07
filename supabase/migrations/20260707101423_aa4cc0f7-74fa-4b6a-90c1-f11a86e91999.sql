-- Add coarse partner-size tier (1..5) used as internal signal for AI ranking
-- and admin overview. Not a public filter (per TAYA-neutralitet).
--
-- Tiers (from most to least resources):
--   1 = Mycket stor global/Sverige-stor koncern
--   2 = Stor/etablerad Microsoft-/D365-specialist
--   3 = Medelstor D365-/BC-/CRM-specialist
--   4 = Mindre / nischad / SMB-orienterad
--   5 = Låg offentlig synlighet – kräver verifiering
--
-- CHECK 1..5 is safe here (immutable, not time-dependent).

ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS partner_size_tier smallint
    CHECK (partner_size_tier IS NULL OR partner_size_tier BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS partner_size_tier_needs_review boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.partners.partner_size_tier IS
  'Grov leverantörsstorlek 1..5 (1=global koncern, 5=låg synlighet/behöver verifiering). Intern signal för AI-ranking och admin – ingen publik filter-UI.';

COMMENT ON COLUMN public.partners.partner_size_tier_needs_review IS
  'True när tier är osäker (typiskt tier 5) och admin bör verifiera innan partnern viktas i AI-matchning.';

CREATE INDEX IF NOT EXISTS partners_size_tier_idx ON public.partners (partner_size_tier);