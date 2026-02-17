
-- Create a simple key-value settings table for admin-configurable content
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write
CREATE POLICY "Service role can manage settings"
ON public.site_settings
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Block anon access to settings"
ON public.site_settings
FOR SELECT
USING (false);

-- Seed with current invitation email body text
-- Using {{INVITATION_LINK}} as placeholder for the dynamic link
INSERT INTO public.site_settings (key, value) VALUES (
  'invitation_email_body',
  E'Hello,\nHoppas allt är bra!\n\nDynamic Factory har tagit fram ett initiativ för att hjälpa potentiella och befintliga kunder att välja rätt partner för sitt Dynamics 365 projekt och/eller support/förvaltning.\n\nVi kör en kostnadsfri testperiod med några utvalda partners under februari och en bit in i mars, så passa på att ladda på med alla lösningsområden som ni kan erbjuda.\n\nSiten är nu "live" https://www.d365.se, så kom gärna med feedback och kontrollera speciellt att era uppgifter är korrekta.\n\nSiten riktar sig i första hand till kunder som visat intresse för ERP/CRM och specifikt vad Microsoft har att erbjuda. Den innehåller guider och enklare behovsanalyser, jämförelser och prisindikationer och framförallt möjligheten att söka fram mest lämpade partner för ett projekt/förvaltningsuppdrag. På siten kan man välja att kontakta en partner direkt, alternativt att först ta kontakt med oss för lite kostnadsfri rådgivning.\n\nVarje partner får en partnerprofilsida. Val av produkt och branschinriktning kommer vara huvudfokus samt eventuellt företagsstorlek på kunden.\n\nVi kommer att göra en seriös marknadsinvestering för att driva trafik till siten. Siten har en kopplad programvara som loggar besökare, så att vi kan bevaka vilka företag/domäner som snurrat runt på vilka sidor. Utöver det så får vi bra generell site-statistik som vi kan dela med oss av.\n\nI diskussion med Microsoft och Microsofts CSPs/Distis så menar man att den även bör kunna användas av Microsoftsäljare internt samt att den även bör promotas mot upphandlingskonsulter.\n\nLänken här går att använda flera gånger, om ni vill gå in och ändra er profilering.\n\n{{INVITATION_LINK}}\n\nHar ni frågor kring detta är det bara att ni hör av er.\n\n\nAllt Gott!\n\nThomas Laine\nTelefon: +46 72 232 4060\nThomas.laine@dynamicfactory.se\nwww.dynamicfactory.se, www.businesscentral.se, www.d365.se'
);
