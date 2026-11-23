CREATE OR REPLACE FUNCTION public.newsletter_sync_isv_overrides() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE slug text; company_name text;
BEGIN
 SELECT s.vendor_slug,v.name INTO slug,company_name FROM public.isv_solutions s JOIN public.isv_vendors v ON v.slug=s.vendor_slug WHERE s.solution_id=NEW.solution_id;
 IF slug IS NOT NULL THEN
 PERFORM public.newsletter_register_contact(NEW.admin_contact_email,'isv',slug,company_name,NEW.admin_contact_name);
 PERFORM public.newsletter_register_contact(NEW.sales_contact_email,'isv',slug,company_name,NEW.sales_contact_name);
 PERFORM public.newsletter_register_contact(NEW.vendor_contact_email,'isv',slug,company_name,NEW.vendor_contact_name);
 END IF;
 RETURN NEW;
END $$;
DO $$ DECLARE r record; BEGIN
 FOR r IN SELECT o.*,s.vendor_slug,v.name AS company_name FROM public.isv_solution_overrides o JOIN public.isv_solutions s ON s.solution_id=o.solution_id JOIN public.isv_vendors v ON v.slug=s.vendor_slug LOOP
 PERFORM public.newsletter_register_contact(r.admin_contact_email,'isv',r.vendor_slug,r.company_name,r.admin_contact_name);
 PERFORM public.newsletter_register_contact(r.sales_contact_email,'isv',r.vendor_slug,r.company_name,r.sales_contact_name);
 PERFORM public.newsletter_register_contact(r.vendor_contact_email,'isv',r.vendor_slug,r.company_name,r.vendor_contact_name);
 END LOOP;
END $$;