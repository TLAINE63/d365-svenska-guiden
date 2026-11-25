-- Marknadspuls: aggregerade 90-dagarsandelar per produktområde, köparsituation och verktyg/guide (bara sidräkning, inga id:n).
CREATE OR REPLACE FUNCTION public.public_market_interest()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH v AS (
    SELECT lower(rtrim(page_path, '/')) p FROM visitor_analytics
    WHERE visited_at >= now() - interval '90 days'
      AND page_path NOT ILIKE '/redaktion%' AND page_path NOT ILIKE '/admin%'
      AND page_path NOT ILIKE '/partner-update%' AND page_path NOT ILIKE '/partnerprogram%'
  ),
  prod AS (
    SELECT CASE
      WHEN p LIKE '/businesscentral%' OR p LIKE '/business-central%' OR p LIKE '%/valja-business-central%' THEN 'Business Central'
      WHEN p LIKE '/finance-supply-chain%' OR p LIKE '/d365finance%' OR p LIKE '/d365supplychain%' OR p LIKE '%fscm%' THEN 'Finance & Supply Chain'
      WHEN p LIKE '/crm%' OR p LIKE '/d365sales%' OR p LIKE '/d365marketing%' OR p LIKE '/d365customer%' OR p LIKE '/d365fieldservice%' OR p LIKE '/d365contactcenter%' OR p LIKE '%crm-partners%' OR p LIKE '%kravspecifikation-crm%' THEN 'CRM'
      WHEN p LIKE '/ai%' OR p LIKE '%copilot%' THEN 'Copilot och AI'
      WHEN p LIKE '%tillagg%' OR p LIKE '/isv%' THEN 'Tilläggslösningar (ISV)'
      WHEN p LIKE '/d365projectoperations%' OR p LIKE '/d365commerce%' OR p LIKE '/d365hr%' THEN 'Övriga Dynamics 365-appar'
    END k FROM v
  ),
  sit AS (
    SELECT CASE
      WHEN p LIKE '%byta%' OR p LIKE '/second-opinion%' THEN 'Partnerbyte'
      WHEN p LIKE '/valjdynamics365partner%' OR p LIKE '/alla-d365-partners%' OR p LIKE '/jamfor-partners%' OR p LIKE '%-partners-sverige%' OR p LIKE '/partners-per-bransch%' OR p LIKE '/guider/valja-%partner%' OR p LIKE '/partner/%' OR p LIKE '/basic/%' THEN 'Partnerval'
      WHEN p LIKE '/befintlig-kund%' OR p LIKE '%tillagg%' OR p LIKE '/isv%' THEN 'Utveckling'
      WHEN p LIKE '/ai%' OR p LIKE '%copilot%' THEN 'AI'
      WHEN p LIKE '/kom-igang%' OR p IN ('/affarssystem','/erp') OR p LIKE '%behovsanalys%' OR p LIKE '%kravspecifikation%' OR p LIKE '/kostnad%' OR p LIKE '%valja-affarssystem%' THEN 'Nytt system'
    END k FROM v
  ),
  tool AS (
    SELECT CASE
      WHEN p LIKE '/kom-igang%' THEN 'Kom igång-guiden'
      WHEN p LIKE '/valjdynamics365partner%' THEN 'Partnersök'
      WHEN p LIKE '/kostnad%' OR p LIKE '/implementationskalkylator%' OR p LIKE '%roi%' OR p LIKE '/priser%' THEN 'Kostnads- och ROI-kalkyler'
      WHEN p LIKE '%behovsanalys%' THEN 'Behovsanalyser'
      WHEN p LIKE '%kravspec%' THEN 'Kravspecifikationer'
      WHEN p LIKE '/jamfor%' THEN 'Jämförelser'
      WHEN p LIKE '/underlag%' THEN 'Min D365-plan'
      WHEN p LIKE '/guider/%' THEN 'Guider'
      WHEN p LIKE '/befintlig-kund%' OR p LIKE '/second-opinion%' THEN 'Befintlig kund-diagnos'
      WHEN p LIKE '/ai-sok%' THEN 'AI-sök'
    END k FROM v
  )
  SELECT jsonb_build_object(
    'products', (SELECT coalesce(jsonb_agg(jsonb_build_object('label',k,'count',n) ORDER BY n DESC),'[]') FROM (SELECT k, count(*) n FROM prod WHERE k IS NOT NULL GROUP BY k) t),
    'situations', (SELECT coalesce(jsonb_agg(jsonb_build_object('label',k,'count',n) ORDER BY n DESC),'[]') FROM (SELECT k, count(*) n FROM sit WHERE k IS NOT NULL GROUP BY k) t),
    'tools', (SELECT coalesce(jsonb_agg(jsonb_build_object('label',k,'count',n) ORDER BY n DESC),'[]') FROM (SELECT k, count(*) n FROM tool WHERE k IS NOT NULL GROUP BY k HAVING count(*) >= 5) t)
  );
$$;
REVOKE ALL ON FUNCTION public.public_market_interest() FROM public;
GRANT EXECUTE ON FUNCTION public.public_market_interest() TO anon, authenticated;
