
-- Tighten assessments INSERT policy: require consent + non-empty required fields
DROP POLICY IF EXISTS "Anyone can submit an assessment" ON public.assessments;
CREATE POLICY "Anyone can submit an assessment"
ON public.assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  consent = true
  AND length(trim(contact_name)) > 0
  AND length(trim(contact_email)) > 0
  AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(trim(company)) > 0
);

-- Set fixed search_path on SECURITY DEFINER pgmq helpers
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq, pg_temp;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq, pg_temp;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq, pg_temp;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq, pg_temp;
