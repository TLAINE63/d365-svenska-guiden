# Internationalisering – d365.se + d365guide.com

## Översikt

Domänbaserad flerspråksstrategi med **separata Lovable-projekt per marknad**. Varje marknad har sin egen kodbas, databas och subdomän.

| Domän | Språk | Projekt | Status |
|-------|-------|---------|--------|
| d365.se | Svenska | Nuvarande | ✅ Live |
| no.d365guide.com | Norska | Norskt remix-projekt | 🚧 Under uppbyggnad |
| dk.d365guide.com | Danska | Framtida | ⏳ Planerat |
| d365guide.com | Engelska | Framtida (global fallback) | ⏳ Planerat |

---

## Arkitekturbeslut

- **Fas 1: Separata projekt** – Norge körs som eget Lovable-projekt med subdomän
- **Fas 2 (framtida option):** Konsolidera alla marknader utom Sverige till ett gemensamt i18n-projekt på d365guide.com med subdirectories (/no, /dk, /uk)
- **Sverige (d365.se) förblir alltid separat projekt**
- **Subdomäner under d365guide.com** för nu (no.d365guide.com), kan migreras till subdirectories senare
- **Separata databaser** – varje projekt har egna partners, events, leads
- **hreflang-taggar** kopplar ihop sajterna för Google (✅ implementerat på d365.se)
- **Språk per land** (norska för Norge, danska för Danmark etc.)

### Framtida migrering till subdirectories
Om vi vill gå från `no.d365guide.com` → `d365guide.com/no`:
1. Bygg i18n-stöd i ett nytt gemensamt projekt
2. Flytta innehåll och partnerdata
3. Uppdatera hreflang-taggar på d365.se
4. 301-redirect från subdomän till subdirectory
5. Uppdatera Google Search Console

---

## Genomfört på d365.se

- [x] hreflang-taggar i SEOHead.tsx (sv + no + x-default)
- [x] og:locale:alternate för norska

---

## Att göra: Norskt projekt (no.d365guide.com)

### DNS & Domän
- [ ] A-record: `no.d365guide.com` → `185.158.133.1`
- [ ] TXT-record: `_lovable` → verifieringsvärde
- [ ] Connect domain i norska projektets Settings → Domains

### Kodändringar i norska projektet
- [ ] `lang="sv"` → `lang="no"` i index.html
- [ ] Canonical-URLs → `no.d365guide.com`
- [ ] Sitemap.xml → `no.d365guide.com`-URLs
- [ ] Robots.txt → peka på norsk sitemap
- [ ] hreflang-taggar (spegla svenska sajtens, men med `no` som canonical)
- [ ] Översätt Navbar & Footer
- [ ] Översätt startsidan
- [ ] Översätt produktsidor (CRM, ERP, Business Central etc.)
- [ ] Översätt behovsanalys-sidor
- [ ] Översätt övriga sidor (QA, Kontakt, Events)

### Partnerdata
- [ ] Rekrytera norska Dynamics 365-partners
- [ ] Mata in partnerdata i norska projektets databas

---

## Framtida marknader

### Danmark (dk.d365guide.com)
- Remix av norskt projekt (liknande språk/struktur)
- Danska översättningar
- Danska partners

### Global (d365guide.com)
- Engelskspråkig version
- Fungerar som x-default fallback
- Internationella partners

---

## SEO-strategi

- Varje subdomän behandlas som separat sajt av Google
- hreflang kopplar ihop alla versioner
- Varje sajt har egen sitemap och robots.txt
- Google Search Console: lägg till varje subdomän som separat property
