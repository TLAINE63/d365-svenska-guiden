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

- **Separata projekt per marknad** (inte i18n i samma kodbas)
- **Subdomäner under d365guide.com** för alla marknader utom Sverige
- **Separata databaser** – varje projekt har egna partners, events, leads
- **hreflang-taggar** kopplar ihop sajterna för Google (✅ implementerat på d365.se)
- **Språk per land** (norska för Norge, danska för Danmark etc.)

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
