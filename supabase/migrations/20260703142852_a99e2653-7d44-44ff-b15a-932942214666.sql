UPDATE public.site_settings
SET value = jsonb_set(value::jsonb, '{pdfUrl}', to_jsonb('https://vnvphfrrmoaskiwlspeo.supabase.co/storage/v1/object/public/partner-documents/D365_Partner_Agreement_2026.pdf'::text))::text
WHERE key = 'partner_agreement_page_config';