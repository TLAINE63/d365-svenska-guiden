CREATE OR REPLACE VIEW public.partners_public AS
SELECT id, name, description, logo_url, website, email, phone, contact_person,
       applications, industries, secondary_industries, geography, customer_examples,
       product_filters, is_featured, logo_dark_bg, created_at, updated_at,
       industry_apps, slug, office_cities, map_url, invoice_email, invoice_contact
FROM partners
WHERE is_featured = true;