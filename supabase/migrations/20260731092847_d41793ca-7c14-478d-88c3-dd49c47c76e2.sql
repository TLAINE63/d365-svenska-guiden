WITH pv AS (
  SELECT p.id AS pid, p.slug, p.name, COALESCE(NULLIF(p.admin_contact_email,''), p.email) AS rec,
         v.organisation_uuid, v.company_name, v.company_domain, v.company_industry,
         v.company_size, v.company_country, v.session_started_at, v.visited_urls
  FROM public.partners p
  JOIN public.snitcher_visits v ON p.slug = ANY(v.partner_slugs)
  WHERE p.is_featured
    AND v.session_ended_at >= '2026-07-01T00:00:00Z'
    AND v.session_ended_at <  '2026-08-01T00:00:00Z'
), sess AS (
  SELECT pv.pid, pv.slug, pv.name, pv.rec, pv.organisation_uuid, pv.company_name, pv.company_domain,
         pv.company_industry, pv.company_size, pv.company_country,
         jsonb_build_object(
           'started_at', pv.session_started_at,
           'profile_urls', q.pu,
           'other_urls', q.ou
         ) AS s
  FROM pv,
  LATERAL (
    SELECT
      COALESCE(jsonb_agg(u) FILTER (WHERE u ~* ('/partner/'||pv.slug||'(/|$|\?)')), '[]'::jsonb) AS pu,
      COALESCE(jsonb_agg(u) FILTER (WHERE u !~* ('/partner/'||pv.slug||'(/|$|\?)')), '[]'::jsonb) AS ou
    FROM (SELECT e->>'url' AS u FROM jsonb_array_elements(COALESCE(pv.visited_urls,'[]'::jsonb)) e) t
    WHERE u IS NOT NULL
  ) q
), org AS (
  SELECT pid, slug, name, rec, organisation_uuid,
         max(company_name) AS company_name, max(company_domain) AS company_domain,
         max(company_industry) AS company_industry, max(company_size) AS company_size,
         max(company_country) AS company_country,
         count(*)::int AS visit_count,
         jsonb_agg(s) AS sessions
  FROM sess
  GROUP BY pid, slug, name, rec, organisation_uuid
), agg AS (
  SELECT pid, slug, name, rec,
         count(*)::int AS company_count,
         jsonb_agg(jsonb_build_object(
           'organisation_uuid', organisation_uuid,
           'company_name', company_name,
           'company_domain', company_domain,
           'company_industry', company_industry,
           'company_size', company_size,
           'company_country', company_country,
           'visit_count', visit_count,
           'sessions', sessions
         ) ORDER BY visit_count DESC) AS companies
  FROM org
  GROUP BY pid, slug, name, rec
)
INSERT INTO public.partner_report_drafts
  (partner_id, partner_slug, partner_name, recipient_email, period_start, period_end,
   subject, intro_text, companies, status)
SELECT pid, slug, name, rec, DATE '2026-07-01', DATE '2026-07-31',
  'Besöksrapport juli 2026 – ' || company_count || ' identifierade företag',
  'Här kommer din månadsrapport för juli 2026. Under perioden identifierades ' || company_count ||
  ' företag som besökt din profil på d365.se. Rapporten visar även vilka andra sidor besökarna tittade på i samma session – ofta en signal om vilka produktområden de undersöker.',
  companies, 'pending_review'
FROM agg
ON CONFLICT (partner_slug, period_start) DO UPDATE
SET partner_id = EXCLUDED.partner_id,
    partner_name = EXCLUDED.partner_name,
    recipient_email = EXCLUDED.recipient_email,
    period_end = EXCLUDED.period_end,
    subject = EXCLUDED.subject,
    intro_text = EXCLUDED.intro_text,
    companies = EXCLUDED.companies,
    status = 'pending_review',
    updated_at = now();