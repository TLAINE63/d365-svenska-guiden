-- Add anonymized IP address column to partner_clicks table
ALTER TABLE public.partner_clicks
ADD COLUMN ip_address_anonymized text;

-- Add index for geographic analysis queries
CREATE INDEX idx_partner_clicks_ip_anonymized ON public.partner_clicks(ip_address_anonymized);

-- Add comment explaining the column
COMMENT ON COLUMN public.partner_clicks.ip_address_anonymized IS 'Anonymized IP address with last octet removed (e.g., 192.168.1.x) for GDPR-compliant geographic analysis';