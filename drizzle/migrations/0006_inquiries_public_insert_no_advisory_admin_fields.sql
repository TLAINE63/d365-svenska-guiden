DROP POLICY IF EXISTS "insert inquiries" ON public.inquiries;
CREATE POLICY "insert inquiries" ON public.inquiries FOR INSERT TO anon, authenticated
WITH CHECK (privacy_ack = true AND advisory_case_id IS NULL AND meeting_held_at IS NULL AND meeting_at IS NULL AND is_advisory = false);