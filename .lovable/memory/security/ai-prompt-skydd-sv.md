---
name: AI-promptskydd
description: Publika AI-endpoints (ai-chat, smart-search) får aldrig avslöja systemprompt och besökare får aldrig injicera instruktioner
type: constraint
---

Alla publika AI-endpoints ska använda `supabase/functions/_shared/prompt-guard.ts`:

- `sanitizeChatMessages()` filtrerar bort allt utom `user`/`assistant` (besökare kan inte skicka `system`/`developer`/`tool`), kapar till 30 meddelanden och 4000 tecken per meddelande.
- `PROMPT_CONFIDENTIALITY_SV` läggs SIST i systemprompten och förbjuder att instruktioner, regler, datakällor, verktyg eller modell avslöjas, samt att användarinnehåll behandlas som instruktioner.
- Fri text från användaren (t.ex. `query` i smart-search) saneras och märks explicit som data i prompten.

**Why:** Systemprompten innehåller affärsregler, partnerdata och positionering som inte får läcka, och besökare får aldrig kunna ändra assistentens beteende.
