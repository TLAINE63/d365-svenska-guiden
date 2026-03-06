-- Add permissive SELECT policy for partners_public view access via anon key
-- The view is SECURITY DEFINER but the REST API still needs a permissive policy
-- to allow the anon role to query the view

-- For partner_events: add a permissive policy so anon can read approved events
CREATE POLICY "Public can view approved events"
  ON public.partner_events
  FOR SELECT
  TO anon
  USING (status = 'approved');
