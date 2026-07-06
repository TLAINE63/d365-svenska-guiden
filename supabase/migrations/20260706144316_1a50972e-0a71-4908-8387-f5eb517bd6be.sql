
CREATE TABLE public.partner_ai_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_version TEXT,
  matching_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_content TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX partner_ai_knowledge_partner_id_idx ON public.partner_ai_knowledge(partner_id);
CREATE INDEX partner_ai_knowledge_active_idx ON public.partner_ai_knowledge(partner_id) WHERE is_active = true;

-- Only service_role may access. No anon / authenticated grants.
GRANT ALL ON public.partner_ai_knowledge TO service_role;

ALTER TABLE public.partner_ai_knowledge ENABLE ROW LEVEL SECURITY;

-- Deny-all policy for non-service roles (RLS blocks everything without a policy; explicit for clarity)
CREATE POLICY "service role only" ON public.partner_ai_knowledge
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_partner_ai_knowledge_updated_at
  BEFORE UPDATE ON public.partner_ai_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
