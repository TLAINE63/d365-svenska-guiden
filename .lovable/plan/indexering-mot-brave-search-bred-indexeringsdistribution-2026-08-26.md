# Indexering mot Brave Search + bred indexeringsdistribution

## Kort svar om Brave

Brave Search har ingen "submit URL"-tjänst och ingen Search Console. Enligt Braves egen dokumentation:

- Braves crawler använder **ingen egen user-agent** – den maskerar sig som en vanlig crawler och följer de regler som gäller för **Googlebot**. Blockerar du Googlebot, blockerar du Brave.
- Upptäckt sker via crawl + Braves Web Discovery Project (anonym data från Brave-användare).
- Brave är dessutom det index som **Claude** söker i, så Brave-synlighet påverkar AI-citeringar direkt.

Slutsats: sajten indexeras i Brave genom att vara crawlbar för Googlebot, ha korrekt sitemap och länkas externt – inget formulär att fylla i. Det finns dock konkreta luckor att täppa till.

## Vad som redan finns

- `public/robots.txt` med separata block för Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot m.fl. och sitemap-hänvisning.
- Sitemap-index med sex delsitemaps, genererade i `prebuild`.
- IndexNow-nyckel `public/1ee300110a6717b5dec524f828e978f2.txt` och färdigt skript `scripts/ping-indexnow.mjs`.

## Luckan

`scripts/ping-indexnow.mjs` **körs aldrig** – `postbuild` kör bara `check-prerender-seo.mjs`. IndexNow-pingen till Bing/Yandex/Seznam/Naver sker alltså inte vid publicering idag.

## Vad som byggs

1. **Aktivera IndexNow vid varje build**
   - Lägg till `scripts/ping-indexnow.mjs` i `postbuild` efter SEO-kontrollen.
   - Skriptet får en miljöflagga så att det bara pingar för produktionsdomänen (`d365.se`) och tyst hoppas över i preview-byggen – annars skickas preview-URL:er till sökmotorerna.
   - Skriptet felar aldrig bygget (redan så idag).

2. **Brave-/Claude-täckning i robots.txt**
   - Lägg till explicita, tillåtande block för `Bravebot` och `Brave-Search` (framtidssäkring om Brave börjar deklarera UA).
   - Säkerställ att Googlebot-blocket är minst lika tillåtande som `*`-blocket, eftersom Brave ärver Googlebots regler. Inga nya `Disallow` läggs till.
   - Behåll alla befintliga block oförändrade.

3. **Sensorer för Brave/Claude i crawler-loggen**
   - Utöka botklassificeringen i `supabase/functions/crawler-log/index.ts` med Brave-relaterade signaturer och `Claude-SearchBot`, så att adminfliken AI-synlighet kan visa om Brave/Claude faktiskt hämtar sensor-URL:erna.
   - Ingen förändring av besöksstatistiken; Thomas egna besök/IP exkluderas fortsatt.

4. **Enkel manuell verifieringsrutin**
   - Kort avsnitt i adminfliken AI-synlighet: "Kontrollera Brave" med färdiga `site:d365.se`-länkar till Brave Search, Bing och DuckDuckGo så att indexeringen kan stickprovskollas utan externa verktyg.

## Tekniska detaljer

- `package.json`: `postbuild` blir `node scripts/check-prerender-seo.mjs && node scripts/ping-indexnow.mjs`.
- `ping-indexnow.mjs`: läser sitemap-index från `dist/`, expanderar delsitemaps, dedupar och postar till `api.indexnow.org`. Ny guard: hoppa över om ingen URL matchar `https://d365.se`.
- `public/robots.txt`: två nya user-agent-block, inga borttagningar.
- `crawler-log`: utökad UA-matchlista, samma anonymiserade IP-prefix-hantering som idag.

## Vad detta inte gör

- Ger ingen garanterad Brave-indexering – Brave har ingen submission-API. Det som styr är crawlbarhet, sitemap, intern länkning och externa omnämnanden.
- Påverkar inte Google Search Console-data eller befintlig besöksanalys.
