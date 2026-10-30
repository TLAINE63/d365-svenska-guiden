-- Besökarens val i hjälpvägen (behov, produkt, område m.m.) sparas strukturerat på ärendet,
-- så redaktionen ser valt behov och Dynamics 365-produkt utan att tolka fritext.
ALTER TABLE public.advisory_cases
  ADD COLUMN IF NOT EXISTS journey_selection jsonb NOT NULL DEFAULT '{}'::jsonb;