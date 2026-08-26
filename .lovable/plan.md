# Insikt om vilka AI-bottar som besöker sajten

## Kort svar på frågan

Sajten ligger på statisk hosting, och där finns ingen åtkomlig webbserverlogg. Dagens besöksmätning körs i webbläsaren (`track-visitor`), och AI-crawlers kör normalt ingen JavaScript – därför syns GPTBot, ClaudeBot, PerplexityBot m.fl. i princip aldrig i statistiken idag. Admin-fliken AI-synlighet visar därför i praktiken bara *hänvisningstrafik från människor* som kommer via ChatGPT/Perplexity/Copilot, inte botarna själva.

Det går att lösa – men det kräver att vi skapar en egen serverlogg för de anrop botarna faktiskt gör.

## Vad som byggs

### 1. Egen crawler-logg (serverside)
En ny publik backend-funktion `crawler-log` som:
- tar emot ett anrop, läser `User-Agent`, sökväg, referrer och anonymiserad IP
- klassificerar botten (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Meta AI, Bytespider, Amazonbot, samt Googlebot/Bingbot för jämförelse)
- skriver en rad i ny tabell `crawler_hits`
- svarar med rätt innehåll (302 till den riktiga filen, eller filens innehåll direkt)

### 2. Botarnas faktiska ingångar dirigeras via loggen
Botar hämtar nästan alltid dessa tre saker – de blir våra sensorer:
- `Sitemap:`-raden i `robots.txt` pekar på funktionens sitemap-URL, som loggar och skickar vidare till riktiga sitemapen
- `llms.txt` refereras via funktionens URL (den statiska filen ligger kvar oförändrad)
- en logg-URL läggs som `<link rel="alternate">` i head, som AI-crawlers följer

Det ger verklig, serverside-mätning av vilka AI-botar som hämtar sajten och hur ofta.

### 3. Ny vy i admin
AI-synlighet-fliken utökas med sektionen "AI-crawlers (serverlogg)":
- antal hämtningar per bot senaste 7/30/90 dagar
- trend per månad
- senaste hämtningstidpunkt per bot
- vilka sökvägar som hämtas mest
- tydlig notering om vad mätningen täcker (sensor-URL:er, inte varje enskild sidhämtning)

### 4. Kompletterande källor som redan finns
- Search Console visar Googlebots crawl-statistik – länkas in som referens.
- Befintlig referrer-mätning (ChatGPT/Perplexity/Claude → besök) behålls oförändrad och visas bredvid crawler-loggen så att skillnaden mellan "bot hämtar" och "människa kommer via AI" blir tydlig.

All besöksstatistik fortsätter exkludera dina egna besök/IP-adresser.

## Begränsningar (viktigt att veta i förväg)
- Vi kan bara logga de anrop som går via våra sensor-URL:er. En bot som bara hämtar en vanlig HTML-sida direkt från den statiska hostingen syns inte.
- Det ger ändå en pålitlig bild av *vilka* AI-botar som är aktiva mot sajten och hur aktiviteten utvecklas över tid, vilket är det frågan gäller.
- Full loggning av varje sidhämtning skulle kräva en CDN/proxy framför sajten (t.ex. Cloudflare) – kan tas som separat steg om du vill ha 100 % täckning.

## Tekniska detaljer
- Ny tabell `public.crawler_hits`: `id`, `bot_id`, `bot_label`, `user_agent`, `path`, `referrer`, `ip_prefix` (anonymiserad), `hit_at`, index på `hit_at` och `bot_id`. RLS på, inga anon/authenticated-policys; endast `service_role` skriver/läser (via edge-funktionerna).
- `supabase/functions/crawler-log/index.ts` – publik (ingen JWT), skriver med service role, rate-limit-tolerant, sanerar UA till 500 tecken.
- `ai-visibility-stats` utökas med aggregat från `crawler_hits` (admin-JWT som idag).
- `AdminAiVisibilityTab.tsx` får ny sektion för crawler-data.
- `public/robots.txt` och head-referenser uppdateras med sensor-URL:er; statisk `llms.txt` och sitemap-filer lämnas intakta.
