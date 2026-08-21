# Plan: Lägg till partnertext på verifierade partnerkort (hemsidegrid)

## Bakgrund
På hemsidegridet `HomeVerifiedPartnersGrid.tsx` (sektionen "Sök fram rätt verifierad partner för din bransch") visar varje kort idag bara: logotyp, VERIFIERAD-badge, partnernamn, produktområdestaggar och (när ett filter är valt) branscher + kundstorlek. Det saknas en kort beskrivande text som ger besökaren en tydligare insikt om vad partnern gör.

Alla 17 verifierade partners har redan fältet `ai_summary` i `partnerData.json` — en kort, neutral, en-meningars sammanfattning genererad via Gemini (t.ex. "4PS är en specialiserad Dynamics 365 Business Central-partner för bygg-, installations-, service- och entreprenadverksamheter…"). Ingen databas- eller datagenerering krävs.

## Förändring

**Fil:** `src/components/HomeVerifiedPartnersGrid.tsx`

Lägg till en kort partnertext på varje kort, baserat på `p.ai_summary` (med fallback till `p.positioning_statement` om ai_summary saknas):

- **Placering:** Mellan partnernamnet (`h3`) och produktområdestaggarna — så att texten blir det första innehållet besökaren läser efter namnet och får svara på "vad gör den här partnern?".
- **Styling:** `text-[11px] text-muted-foreground leading-snug line-clamp-2 mb-2` — samma kompakta stil som befintlig branschtext, begränsad till 2 rader så korten behåller jämn höjd i 5-kolumnersgridet.
- **Visas alltid** (även när inget produktfilter är valt), så att korten aldrig bara visar namn + taggar utan sammanhang.
- **Fallback:** Om varken `ai_summary` noch `positioning_statement` finns, visas ingen text (inget genererat fallback — undviker fabrikation).

```tsx
{(p.ai_summary || p.positioning_statement) && (
  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mb-2">
    {p.ai_summary || p.positioning_statement}
  </p>
)}
```

Infogas direkt efter `h3`-blocket (rad ~327) och före produktområdes-tag-sektionen.

## Begränsning
Inga ändringar i andra partnerlistningskomponenter (`ValjPartner.tsx`/`PartnerCard.tsx`, `AllD365Partners.tsx`) — de visar redan beskrivande text. Denna ändring gäller enbart hemsidegridet i `HomeVerifiedPartnersGrid.tsx`.
