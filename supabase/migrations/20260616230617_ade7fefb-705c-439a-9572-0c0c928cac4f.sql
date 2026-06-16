
-- Restore baseline Data API grants on every public base table
DO $$
DECLARE tbl record;
BEGIN
  FOR tbl IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
             WHERE c.relkind='r' AND n.nspname='public'
  LOOP
    EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl.relname);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl.relname);
  END LOOP;
END$$;

-- Anon SELECT only on tables whose policies allow public reads
GRANT SELECT ON public.industry_pages TO anon;
GRANT SELECT ON public.knowledge_articles TO anon;
GRANT SELECT ON public.partner_events TO anon;
GRANT SELECT ON public.product_prices TO anon;
GRANT SELECT ON public.unprofiled_partners TO anon;
GRANT INSERT ON public.assessments TO anon;

-- partners_public view: switch to security_definer-style (run as owner)
-- so anon can read featured partners through the safe column projection
-- without needing direct SELECT on the partners base table.
ALTER VIEW public.partners_public SET (security_invoker = false);
GRANT SELECT ON public.partners_public TO anon, authenticated;

-- Sequences (needed for INSERTs done via Data API)
DO $$
DECLARE s record;
BEGIN
  FOR s IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
           WHERE c.relkind='S' AND n.nspname='public'
  LOOP
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE public.%I TO anon, authenticated, service_role', s.relname);
  END LOOP;
END$$;
