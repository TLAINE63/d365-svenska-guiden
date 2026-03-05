

## Analys

Prerendringen lyckas (23/23 routes, alla filer skrivs korrekt), men processen hänger sig **efter** att `closeBundle`-hooken är klar. Vite-processen avslutas inte, vilket gör att GitHub Actions 10-minuters timeout slår till.

**Orsak:** Den importerade SSR-modulen (`entry-server.js`) innehåller Supabase-klienten som startar bakgrundsprocesser (auth token refresh, realtime-anslutning). Dessa håller Node.js event-loopen aktiv, vilket förhindrar att processen avslutas.

## Plan

### 1. Tvinga process-avslut efter lyckad prerendering

I `vite-prerender-plugin.ts`, lägg till `process.exit(0)` i slutet av `closeBundle`-hookens `finally`-block. Eftersom prerendringen är det allra sista steget i bygget (efter att Vite redan skrivit alla client-filer), är det säkert att avsluta processen explicit.

Alternativt (mer kirurgiskt): Anropa `process.exit(0)` precis efter den sista `console.log` i try-blocket och i catch-blocket, innan finally körs.

### Teknisk ändring

**Fil: `vite-prerender-plugin.ts`** (rad ~256-267)

Efter raden `console.log('✅ Prerendering complete...')` och cleanup i finally, lägg till:

```typescript
// After cleanup in finally block, force exit to prevent
// dangling SSR module connections from keeping the process alive
setTimeout(() => process.exit(0), 500);
```

Detta ger 500ms för cleanup (rmSync etc.) och tvingar sedan processen att avsluta, oavsett om Supabase-klientens bakgrundsprocesser fortfarande kör.

