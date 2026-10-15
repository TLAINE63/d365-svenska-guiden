CREATE TABLE public.buyer_saved_state (
  user_id uuid PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buyer_saved_state TO authenticated;
GRANT ALL ON public.buyer_saved_state TO service_role;
ALTER TABLE public.buyer_saved_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own saved state select" ON public.buyer_saved_state FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own saved state insert" ON public.buyer_saved_state FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own saved state update" ON public.buyer_saved_state FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own saved state delete" ON public.buyer_saved_state FOR DELETE TO authenticated USING (auth.uid() = user_id);