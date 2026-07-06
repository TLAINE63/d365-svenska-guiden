
-- 1. Remove broad anon/authenticated SELECT on public.partners.
-- The public-facing partners_public view is switched to SECURITY DEFINER so
-- readers of the view do not need direct RLS access to the base table. This
-- prevents anonymous readers from selecting sensitive columns
-- (admin_contact_*, admin_notes, invoice_*, monthly_fee, org_number,
-- agreement_notes, cancellation_date, agreement_signed_at, etc.) on
-- featured partners via the base table.
DROP POLICY IF EXISTS "Public can read featured partners via view" ON public.partners;

ALTER VIEW public.partners_public SET (security_invoker = false);
GRANT SELECT ON public.partners_public TO anon, authenticated;

-- 2. partner_events: create a public view that excludes admin/review columns
-- (admin_notes, reviewed_by, reviewed_at) and expose it to anon/authenticated
-- via SECURITY DEFINER so the base table is no longer publicly readable.
CREATE OR REPLACE VIEW public.partner_events_public AS
SELECT
  id,
  partner_id,
  title,
  description,
  event_date,
  event_time,
  end_time,
  is_online,
  location,
  event_link,
  registration_link,
  registration_deadline,
  image_url,
  recording_url,
  recording_available,
  status,
  created_at,
  updated_at
FROM public.partner_events
WHERE status = 'approved';

ALTER VIEW public.partner_events_public SET (security_invoker = false);
GRANT SELECT ON public.partner_events_public TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view approved events" ON public.partner_events;
DROP POLICY IF EXISTS "Public can view approved events" ON public.partner_events;
