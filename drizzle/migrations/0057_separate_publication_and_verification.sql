ALTER TABLE public.isv_vendors ADD COLUMN extra_premium_products integer NOT NULL DEFAULT 0 CHECK (extra_premium_products >= 0);
CREATE OR REPLACE FUNCTION public.isv_premium_selection_validate() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE allowed_count integer; selected_count integer;
BEGIN
 IF TG_TABLE_NAME='isv_solutions' THEN
  IF NOT NEW.premium_product OR NEW.vendor_slug IS NULL THEN RETURN NEW; END IF;
  IF TG_OP='UPDATE' AND NEW.premium_product IS NOT DISTINCT FROM OLD.premium_product AND NEW.vendor_slug IS NOT DISTINCT FROM OLD.vendor_slug THEN RETURN NEW; END IF;
  PERFORM pg_advisory_xact_lock(hashtext(NEW.vendor_slug));
  SELECT 3+extra_premium_products INTO allowed_count FROM public.isv_vendors WHERE slug=NEW.vendor_slug AND premium_vendor=true;
  IF allowed_count IS NULL THEN RAISE EXCEPTION 'Leverantören behöver aktiv ISV Presence'; END IF;
  SELECT count(*) INTO selected_count FROM public.isv_solutions WHERE vendor_slug=NEW.vendor_slug AND premium_product AND solution_id<>NEW.solution_id;
  IF selected_count>=allowed_count THEN RAISE EXCEPTION 'Tre Premiumprodukter ingår. Registrera köpta extra produkter innan fler väljs.'; END IF;
 ELSE
  PERFORM pg_advisory_xact_lock(hashtext(NEW.slug));
  SELECT count(*) INTO selected_count FROM public.isv_solutions WHERE vendor_slug=NEW.slug AND premium_product;
  IF NEW.premium_vendor AND selected_count>3+NEW.extra_premium_products THEN RAISE EXCEPTION 'Antalet valda Premiumprodukter överstiger tre plus köpta extra produkter'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER isv_premium_selection BEFORE INSERT OR UPDATE OF premium_product,vendor_slug ON public.isv_solutions FOR EACH ROW EXECUTE FUNCTION public.isv_premium_selection_validate();
CREATE TRIGGER isv_vendor_premium_allowance BEFORE UPDATE OF extra_premium_products,premium_vendor ON public.isv_vendors FOR EACH ROW EXECUTE FUNCTION public.isv_premium_selection_validate();
CREATE VIEW public.isv_products_d365_public AS SELECT s.solution_id,s.name,s.vendor,s.short_description,s.category,s.type,s.tier,s.tags,s.industries,s.geo,s.what,s.use_cases,s.when_fits,s.combos,s.products,s.industry_focus,s.partner_slugs,s.vendor_website,s.is_published,s.sort_order,s.updated_at,s.vendor_slug,s.subcategory,s.delivery_model,s.finance_relevance,s.supply_chain_relevance,s.best_for,s.considerations,s.source_url,s.verified_at,s.editorial_tier,s.nordic_relevance,s.publication_wave,s.sales_relevance,s.customer_insights_relevance,s.customer_service_relevance,s.field_service_relevance,s.contact_center_relevance,s.source_status,s.lifecycle_status,s.lifecycle_note,s.successor_solution_id,s.last_verified_date,s.information_status,(s.premium_product AND COALESCE(v.premium_vendor,false)) AS premium_product,s.logo_url,s.demo_video_url,s.customer_cases,s.product_gallery,s.product_features,s.integration_evidence,s.partner_evidence,s.solution_kind,s.appsource_url,s.appsource_rating,s.appsource_rating_count
FROM public.isv_solutions s LEFT JOIN public.isv_vendors v ON v.slug=s.vendor_slug
WHERE s.is_published AND s.publish_d365 AND (s.vendor_slug IS NULL OR (v.publication_status='published' AND v.publish_d365));
GRANT SELECT ON public.isv_products_d365_public TO anon,authenticated,service_role;
CREATE VIEW public.isv_vendors_d365_public AS SELECT slug,name,website,description,logo_url,information_status,last_verified_date,office_scope,office_city,office_country,premium_vendor FROM public.isv_vendors WHERE publication_status='published' AND publish_d365;
GRANT SELECT ON public.isv_vendors_d365_public TO anon,authenticated,service_role;
CREATE OR REPLACE VIEW public.partners_basic_public AS SELECT id,slug,name,website,observed_products,observed_industries,observed_locations,observed_updated_at,observed_company_sizes,observed_revenue,observed_delivery_geo,extended_content,extended_content_updated_at,extended_summary,profile_level,created_at,updated_at,information_status,information_verified_at FROM public.partners WHERE COALESCE(is_featured,false)=false AND COALESCE(hide_basic_card,false)=false AND (COALESCE(observed_products,'{}'::jsonb)<>'{}'::jsonb OR COALESCE(observed_industries,'{}'::jsonb)<>'{}'::jsonb OR COALESCE(array_length(observed_locations,1),0)>0);
GRANT SELECT ON public.partners_basic_public TO anon,authenticated,service_role;