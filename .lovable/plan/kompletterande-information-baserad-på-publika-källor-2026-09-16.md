# Kompletterande information baserad på publika källor

Ny sektion på den stora partnerprofilen som visar ett AI-sammanställt lager ovanpå partnerns egen profil. Partnerns egna uppgifter (beskrivning, produkter, branscher, kundstorlekar, tjänster, kontaktpersoner) rörs aldrig och skrivs aldrig över.

## Så ser det ut för besökaren

På partnerprofilen, under partnerns egna uppgifter och intill dagens analysblock, visas en ny sektion:

**Kompletterande information baserad på publika källor**

Med informationsrutan:
"Informationen nedan har sammanställts automatiskt av d365.se baserat på publika källor såsom partnerns webbplats, artiklar, webinarier, kundcase och andra öppna källor. Informationen är ett komplement till partnerns egen profilbeskrivning."

Innehåll i sektionen:
1. **Marknadsprofil**, 2 till 3 korta stycken om vad partnern kommunicerar kring i publika kanaler.
2. **Observerade fokusområden**, taggar (produktområden, teknikområden, branscher).
3. **Observerade ämnen senaste 12 månaderna**, taggar som prioriteras efter hur ofta de återkommer i partnerns nyheter, artiklar, webinarier och kundcase. Visas bara om det finns underlag från de senaste 12 månaderna.

Sektionen visas bara när det finns sammanställt innehåll, och den har egen tydlig märkning så det aldrig förväxlas med partnerns egen text. Datum för senaste sammanställning visas som ÅÅÅÅ-MM-DD.

## Så skapas innehållet

En ny funktion sammanställer underlaget per partner från material som redan finns i systemet: partnerns webbplatsinnehåll och fördjupningstext, partnernyheter och inlägg, event samt kundcase och referenser. Underlaget skickas till AI som returnerar marknadsprofil, fokusområden och ämnen.

Du kör sammanställningen från redaktionen respektive admin, per partner eller för flera i taget, och kan redigera eller rensa resultatet innan det syns. Inget publiceras automatiskt utan att du kan granska det.

## Teknisk genomförande

**Databas (migration på `partners`):**
- `public_profile_summary text` (marknadsprofil)
- `public_focus_tags text[]`
- `public_topics_12m text[]`
- `public_profile_sources text[]` (källor som använts)
- `public_profile_updated_at timestamptz`

Endast dessa nya kolumner skrivs av funktionen, aldrig befintliga profilfält. Kolumnerna exponeras i `partners_public`-vyn så publika sidor kan läsa dem.

**Edge function `generate-partner-public-profile`:**
- Samma admin/editor-tokenmönster som `generate-partner-insights` (HMAC-verifiering, roll `admin` eller `editor`, CORS-lista).
- Hämtar partner + `partner_news` (senaste 12 månader), events och kundexempel.
- Anropar Lovable AI Gateway och returnerar JSON: `public_profile_summary`, `public_focus_tags` (max 10), `public_topics_12m` (max 8), `public_profile_sources`.
- Prompt: faktabaserat, tredje person, inga superlativ, inga konkurrentnamn, inga em dash, endast observationer från underlaget. Ämnen rangordnas efter frekvens i 12-månadersmaterialet.
- Skriver endast de nya kolumnerna plus `public_profile_updated_at`.

**Frontend:**
- Ny komponent `src/components/partner/PartnerPublicSourcesSection.tsx`, samma korttypografi som `PartnerAiInsights`, taggar som pills, disclaimer i `text-[11px] text-muted-foreground`. Semantiska tokens, ingen hårdkodad färg.
- Renderas i `src/pages/PartnerProfile.tsx` direkt efter `PartnerAiInsights`, returnerar null utan innehåll.
- Fälten läggs till i `DatabasePartner` i `src/hooks/usePartners.ts` och i genereringen av `src/data/partnerData.json` (`scripts/generate-partner-data.mjs`) så SSG/prerender får med texten för SEO och AI-sök.

**Admin och redaktion:**
- Knapp "Sammanställ publika källor" i partnerredigeringen (samma plats som övriga AI-genereringar) med visning av senaste körning, samt möjlighet att redigera texten och taggarna manuellt och att rensa sektionen.

## Utanför scope
- Ingen ny extern crawling eller inköp av data i detta steg, underlaget är det som redan finns i systemet plus partnerns publicerade texter.
- Inga ändringar i partnerns egna fält eller i profileringslänkens formulär.
