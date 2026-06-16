# F&SCM Matchningstest – "Matchar F&SCM era behov?"

Ett funktionsorienterat (inte mognadsorienterat) test som hjälper besökaren att förstå om Dynamics 365 Finance & Supply Chain Management matchar deras verksamhets behov. Tonen är ärlig – även "Sannolikt överdimensionerat" är ett giltigt utfall. Ta även hänsyn till framföralllt Commerce men även Project Operations samt HR om detta blir aktuellt

## 1. Ny sida

**Route:** `/finance-supply-chain-management/matchningstest`  
**Fil:** `src/pages/FscmMatchningstest.tsx`  
Registreras i `src/App.tsx` och i `scripts/prerender.mjs` (om listan är statisk) så att SSG plockar upp den. Lägg till canonical, title `"Matchar F&SCM era behov? – Matchningstest | d365.se"`, meta description <160 tecken, samt `noindex` borttagen (vi vill att den indexeras).

## 2. Inkörsportar

**a) Hero-knapp på `/finance-supply-chain**`  
Ny sekundärknapp i hero-sektionen, bredvid befintliga CTA:er. Etikett: `"Gör F&SCM-matchningstestet (10 min)"`. Använder befintlig `--cta-orange`-token om den ligger som primär, annars sekundär stil.

**b) Egen sektion under "Vanliga frågor om Finance…"**  
Ny `<section>` direkt under FAQ-sektionen i `src/pages/FinanceSupplyChain.tsx` med rubrik `"Matchar F&SCM era behov?"`, kort ingress (2–3 meningar om vad testet ger), bullet-lista över de fyra profilområdena (koncern, supply chain, projekt, handel) och en CTA-knapp till testet.

## 3. Frågestruktur (26 frågor, 6 block)

Datalager i `src/data/fscmMatchningstest.ts` – ren TypeScript-konfig med:

- `Block` (id, titel, kort beskrivning)
- `Question` (id, block, typ: `single` | `yesno` | `scale4`, text, options med `label` + `points`, ev. `showIf: (answers) => boolean`)

Implementerar villkorslogik exakt enligt underlaget:

- Fråga 14 visas bara om 13=ja
- Fråga 20–21 visas bara om 19=ja
- Fråga 23 visas bara om 22≠nej

Progressbar visar `"Fråga X av upp till 26, cirka Y minuter kvar"` där Y beräknas från återstående *synliga* frågor (≈25 sek/fråga).

## 4. Poängberäkning

Ren funktion i `src/lib/fscmScoring.ts` (testbar separat). Returnerar:

```ts
{
  concern: number | 'not_applicable',     // 0–100
  supplyChain: number | 'not_applicable',
  project: number | 'not_applicable',
  commerce: number | 'not_applicable',
  maturity: number,                        // 0–100
  total: number,                           // 0–100, viktad
  level: 'strong' | 'partial' | 'oversized'
}
```

Vikter: koncern 0.35, supply 0.30, projekt 0.15, handel 0.20. Om en profil är `not_applicable` (fråga 19=nej för projekt, eller fråga 22=nej + 24=nej för handel) exkluderas den och övriga vikter skalas proportionellt till summa 1.0.

Nivåer: ≥70 stark, 45–69 delvis, <45 sannolikt överdimensionerat.

Enhetstester i `src/__tests__/fscmScoring.test.ts` täcker: full max, full min, "Ej aktuellt"-fall för projekt och handel, viktomskalning.

## 5. Resultatsida

Visar i ordning:

1. **Matchningsnivå** – stor rubrik + diskret totalpoäng (siffra, inte hjältevisual)
2. **Profilstaplar** – fyra horisontella staplar (koncern, supply chain, projekt, handel) med procent och tydlig "Ej aktuellt"-markering där relevant. Bygger på shadcn `Progress` med d365.se-tokens.
3. **De tre starkaste områdena** – dynamiskt genererad text utifrån de tre högst poängsatta delprofilerna. Färdiga mappade fraser per profilområde + intensitetsnivå (hög/medel).
4. **Framtidsperspektiv** – mognadsfaktor >60 lägger till AI/skalbarhetsmening, <40 tonar ner framtidsresonemanget.
5. **Vid "Sannolikt överdimensionerat"** – ärlig text som lyfter Business Central som troligt bättre alternativ + länk till BC vs F&SCM-jämförelsen.
6. **Vidare läsning** – 2–3 länkar valda dynamiskt utifrån vilket profilområde som var starkast (mappning hårdkodad till befintliga artiklar/sidor på d365.se).
7. **Mjuk avslutning** – länk till partnerlistan filtrerad på F&SCM. Ingen säljsamtals-CTA, ingen partner-branding.

## 6. Datalagring

Spara svar och poäng anonymt till `assessments`-tabellen (befintlig). Insert via supabase-klienten med:

- `assessment_type: 'fscm_matchningstest'`
- `answers: jsonb` (alla svar)
- `score_breakdown: jsonb` ({concern, supplyChain, project, commerce, maturity, total, level})
- timestamps automatiskt

Kontrollerar först att `assessments` har en INSERT-policy för `anon`. Om inte: migration som lägger till `GRANT INSERT ON public.assessments TO anon` + policy `CREATE POLICY "Anyone can submit assessments" ON public.assessments FOR INSERT TO anon WITH CHECK (true)`. (Detta görs bara om det inte redan finns.)

Lagring sker tyst i bakgrunden när användaren når resultatsidan – inga personuppgifter, inga e-postfält.

## 7. Design

Följer d365.se:s standardvisuella språk (inte Beslutsmognadsindex magasinsstil):

- Samma navbar/footer
- Card-baserat frågekort i mitten av sidan, en fråga per skärm
- Progressbar överst, "Föregående/Nästa"-knappar i botten
- Auto-advance på single-select (~250ms) enligt befintligt mönster i andra wizards
- Mobilanpassad

## 8. Implementationsordning

1. Lägg till route + tom sida + hero-CTA + FAQ-sektion
2. Frågedatakonfig + wizard-UI med villkorad logik (utan poäng)
3. Poängberäkningsmodul + enhetstester
4. Resultatsida med profilstaplar och dynamiska textblock
5. Länkmappning till befintliga d365.se-artiklar
6. Anonym datalagring till `assessments`

## Tekniska detaljer

- TypeScript-typer för svar: diskriminerade unioner per fråga-id för typsäker poängberäkning
- State: `useState` med svar-objekt `{ [questionId]: answerValue }`; ingen URL-state behövs
- Memoization av synliga frågor och progressberäkning
- A11y: `aria-current="step"`, `role="progressbar"` med `aria-valuenow`
- Inga emojis i resultattext (enligt Analysis sync-regeln)
- Använder semantiska tokens (`bg-card`, `text-foreground`, `--cta-orange`) – inga hårdkodade färger