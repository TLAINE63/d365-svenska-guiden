ALTER TABLE public.newsletter_subscribers ADD COLUMN first_name text, ADD COLUMN last_name text, ADD COLUMN company text, ADD COLUMN title text, ADD COLUMN list text NOT NULL DEFAULT 'kopare', ADD COLUMN status text NOT NULL DEFAULT 'vantar', ADD COLUMN subscribed_at timestamptz NOT NULL DEFAULT now(), ADD COLUMN partner_slug text, ADD COLUMN isv_slug text, ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now(), ADD COLUMN confirmation_sent_at timestamptz, ADD COLUMN confirmation_expires_at timestamptz, ADD COLUMN pending_details jsonb;
ALTER TABLE public.newsletter_subscribers DROP CONSTRAINT newsletter_subscribers_email_key, DROP CONSTRAINT newsletter_consent_version;
ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_email_list_key UNIQUE(email,list), ADD CONSTRAINT newsletter_list_check CHECK(list IN ('kopare','partner','isv')), ADD CONSTRAINT newsletter_status_check CHECK(status IN ('vantar','aktiv','avregistrerad'));
ALTER TABLE public.newsletter_subscribers ALTER COLUMN confirmation_token_hash SET DEFAULT encode(extensions.gen_random_bytes(32),'hex'), ALTER COLUMN unsubscribe_token_hash SET DEFAULT encode(extensions.gen_random_bytes(32),'hex');
UPDATE public.newsletter_subscribers SET subscribed_at=created_at, status=CASE WHEN unsubscribed_at IS NOT NULL THEN 'avregistrerad' WHEN confirmed_at IS NOT NULL THEN 'aktiv' ELSE 'vantar' END;
REVOKE ALL ON public.newsletter_subscribers FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
CREATE OR REPLACE FUNCTION public.newsletter_validate() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 NEW.email=lower(trim(NEW.email));
 IF NEW.email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN RAISE EXCEPTION 'Invalid email'; END IF;
 IF NEW.list <> 'partner' THEN NEW.partner_slug=NULL; END IF;
 IF NEW.list <> 'isv' THEN NEW.isv_slug=NULL; END IF;
 NEW.updated_at=now();
 IF TG_OP='INSERT' THEN NEW.unsubscribe_token_hash=encode(extensions.digest(NEW.unsubscribe_token,'sha256'),'hex'); END IF;
 IF NEW.unsubscribed_at IS NOT NULL THEN NEW.status='avregistrerad'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER newsletter_validate BEFORE INSERT OR UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.newsletter_validate();
CREATE OR REPLACE FUNCTION public.newsletter_register_contact(_email text,_list text,_slug text,_company text,_name text DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE e text;
BEGIN
 FOR e IN SELECT lower(trim(x)) FROM regexp_split_to_table(coalesce(_email,''),'[;,[:space:]]+') x LOOP
 IF e ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' AND (_list <> 'partner' OR split_part(e,'@',1) !~ '^(faktura|fakturor|invoice|invoices|billing|ekonomi|economy|accounting|accounts?|finance|admin|administration|bokforing|reskontra|ap|ar)([._-].*)?$') THEN
 INSERT INTO public.newsletter_subscribers(email,list,status,company,first_name,partner_slug,isv_slug,confirmed_at,consent_text_version,source_page)
 VALUES(e,_list,'aktiv',_company,_name,CASE WHEN _list='partner' THEN _slug END,CASE WHEN _list='isv' THEN _slug END,now(),'existing-business-contact-2026-11','/redaktion/nyhetsbrev/') ON CONFLICT(email,list) DO NOTHING;
 END IF;
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.newsletter_register_contact(text,text,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_register_contact(text,text,text,text,text) TO service_role;
CREATE OR REPLACE FUNCTION public.newsletter_sync_contact() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE j jsonb=to_jsonb(NEW); c text;
BEGIN
 IF TG_TABLE_NAME='partners' THEN
 PERFORM public.newsletter_register_contact(j->>'admin_contact_email','partner',j->>'slug',j->>'name',NULL);
 PERFORM public.newsletter_register_contact(j->>'email','partner',j->>'slug',j->>'name',NULL);
 PERFORM public.newsletter_register_contact(j->>'invoice_email','partner',j->>'slug',j->>'name',NULL);
 ELSIF TG_TABLE_NAME='isv_vendor_internal' THEN
 SELECT name INTO c FROM public.isv_vendors WHERE slug=j->>'vendor_slug';
 PERFORM public.newsletter_register_contact(j->>'contact_email','isv',j->>'vendor_slug',c,j->>'contact_name');
 ELSE
 IF j->>'vendor_slug' IS NOT NULL THEN PERFORM public.newsletter_register_contact(j->>'email','isv',j->>'vendor_slug',j->>'vendor_name',NULL); END IF;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.newsletter_sync_contact() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER newsletter_partner_contact AFTER INSERT OR UPDATE OF admin_contact_email,email,invoice_email ON public.partners FOR EACH ROW EXECUTE FUNCTION public.newsletter_sync_contact();
CREATE TRIGGER newsletter_isv_contact AFTER INSERT OR UPDATE OF contact_email ON public.isv_vendor_internal FOR EACH ROW EXECUTE FUNCTION public.newsletter_sync_contact();
CREATE TRIGGER newsletter_isv_admin_contact AFTER INSERT OR UPDATE OF email ON public.isv_invitations FOR EACH ROW EXECUTE FUNCTION public.newsletter_sync_contact();
DO $$ DECLARE r record; BEGIN
 FOR r IN SELECT slug,name,admin_contact_email,email,invoice_email FROM public.partners LOOP
 PERFORM public.newsletter_register_contact(r.admin_contact_email,'partner',r.slug,r.name,NULL);
 PERFORM public.newsletter_register_contact(r.email,'partner',r.slug,r.name,NULL);
 PERFORM public.newsletter_register_contact(r.invoice_email,'partner',r.slug,r.name,NULL);
 END LOOP;
 FOR r IN SELECT i.vendor_slug,i.contact_email,i.contact_name,v.name FROM public.isv_vendor_internal i JOIN public.isv_vendors v ON v.slug=i.vendor_slug LOOP PERFORM public.newsletter_register_contact(r.contact_email,'isv',r.vendor_slug,r.name,r.contact_name); END LOOP;
 FOR r IN SELECT vendor_slug,vendor_name,email FROM public.isv_invitations WHERE vendor_slug IS NOT NULL LOOP PERFORM public.newsletter_register_contact(r.email,'isv',r.vendor_slug,r.vendor_name,NULL); END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.newsletter_apply_suppression() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF NEW.reason IN ('bounce','complaint','unsubscribe') THEN UPDATE public.newsletter_subscribers SET status='avregistrerad',unsubscribed_at=coalesce(unsubscribed_at,now()),confirmation_expires_at=NULL,pending_details=NULL WHERE email=lower(NEW.email); END IF; RETURN NEW; END $$;
REVOKE ALL ON FUNCTION public.newsletter_apply_suppression() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER newsletter_suppression AFTER INSERT OR UPDATE ON public.suppressed_emails FOR EACH ROW EXECUTE FUNCTION public.newsletter_apply_suppression();
UPDATE public.newsletter_subscribers n SET status='avregistrerad',unsubscribed_at=coalesce(n.unsubscribed_at,now()) FROM public.suppressed_emails s WHERE lower(s.email)=n.email AND s.reason IN ('bounce','complaint','unsubscribe');
CREATE OR REPLACE FUNCTION public.newsletter_claim_confirmation(_email text,_hash text,_details jsonb) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE n integer;
BEGIN
 INSERT INTO public.newsletter_subscribers(email,consent_text_version,source_page,first_name,company,utm_source,utm_medium,utm_campaign,confirmation_token_hash,confirmation_sent_at,confirmation_expires_at)
 VALUES(lower(_email),'nl-2026-11',_details->>'source_page',_details->>'first_name',_details->>'company',_details->>'utm_source',_details->>'utm_medium',_details->>'utm_campaign',_hash,now(),now()+interval '24 hours') ON CONFLICT(email,list) DO NOTHING;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n=1 THEN RETURN true; END IF;
 UPDATE public.newsletter_subscribers SET confirmation_token_hash=_hash,confirmation_sent_at=now(),confirmation_expires_at=now()+interval '24 hours',pending_details=_details
 WHERE email=lower(_email) AND list='kopare' AND status<>'aktiv' AND (confirmation_sent_at IS NULL OR confirmation_sent_at<now()-interval '24 hours');
 GET DIAGNOSTICS n=ROW_COUNT; RETURN n=1;
END $$;
REVOKE ALL ON FUNCTION public.newsletter_claim_confirmation(text,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_claim_confirmation(text,text,jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.newsletter_confirm_token(_hash text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE n integer; BEGIN
 UPDATE public.newsletter_subscribers SET status='aktiv',confirmed_at=now(),unsubscribed_at=NULL,confirmation_expires_at=NULL,consent_text_version='nl-2026-11',first_name=coalesce(pending_details->>'first_name',first_name),company=coalesce(pending_details->>'company',company),source_page=coalesce(pending_details->>'source_page',source_page),pending_details=NULL
 WHERE confirmation_token_hash=_hash AND list='kopare' AND confirmation_expires_at>now() AND NOT EXISTS(SELECT 1 FROM public.suppressed_emails s WHERE lower(s.email)=newsletter_subscribers.email AND s.reason IN ('bounce','complaint'));
 GET DIAGNOSTICS n=ROW_COUNT;
 RETURN n=1 OR EXISTS(SELECT 1 FROM public.newsletter_subscribers WHERE confirmation_token_hash=_hash AND status='aktiv');
END $$;
REVOKE ALL ON FUNCTION public.newsletter_confirm_token(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_confirm_token(text) TO service_role;
CREATE OR REPLACE FUNCTION public.webinar_newsletter_maintenance() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 DELETE FROM public.webinar_registrations WHERE created_at<now()-interval '24 months';
 PERFORM net.http_post(url:='https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/webinar-mailer',headers:=jsonb_build_object('Content-Type','application/json','Lovable-Context','cron','X-Report-Cron-Secret',public.report_cron_secret()),body:=jsonb_build_object('action','scheduled'),timeout_milliseconds:=120000);
END $$;
CREATE INDEX newsletter_list_status_idx ON public.newsletter_subscribers(list,status);