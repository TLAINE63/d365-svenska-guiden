CREATE OR REPLACE VIEW public.partners_mcp_v1 AS
SELECT slug, name, description, website, applications, industries, secondary_industries,
       geography, office_cities, customer_examples, positioning_statement,
       team_size_sweden, implementations_done, ai_summary, is_featured
FROM public.partners WHERE is_featured = true;
REVOKE ALL ON public.partners_mcp_v1 FROM PUBLIC;
GRANT SELECT ON public.partners_mcp_v1 TO anon, authenticated, service_role;