import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import ExampleLinks from "./ExampleLinks";
import { FSCM_CONTROL_FACTORS, FSCM_CONTROL_LEVELS, VERIFIED_AT } from "@/lib/erpAiGuidance";

export default function FscmAiControlSection() {
  return (
    <section id="ai-och-kontroll" className="scroll-mt-24 bg-background py-10 sm:py-14" aria-labelledby="fscm-ai-heading">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent"><ShieldCheck className="h-4 w-4" aria-hidden /> AI, kontroll och ansvar</p>
        <h2 id="fscm-ai-heading" className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Vilka affärsprocesser kan AI-agenter hantera, och hur behåller ni kontrollen?</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">Den viktiga frågan är inte hur självgående en agent kan bli, utan hur mycket ansvar organisationen är beredd att delegera. Samma arbetsmoment kan kräva olika kontroll i olika verksamheter.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FSCM_CONTROL_LEVELS.map((l, i) => (
            <div key={l.key} className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold text-card-foreground">{i + 1}. {l.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{l.text}</p>
              <ExampleLinks slugs={l.examples} />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
          <h3 className="font-semibold text-foreground">Vad avgör rätt kontrollnivå?</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {FSCM_CONTROL_FACTORS.map((f) => <li key={f} className="rounded-full border border-border bg-card px-3 py-1 text-foreground">{f}</li>)}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">Läs mer i analysen <Link to="/artiklar/ai-i-erp-riskbild/" className="font-medium text-primary hover:underline">När AI gör jobbet i ERP: ett skifte i riskbild</Link>.</p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Exemplen är granskade mot Microsoft Learn. Funktioner i förhandsversion är markerade. Status kontrollerad <span className="whitespace-nowrap">{VERIFIED_AT}</span>.</p>
        <AdvisoryOffer className="mt-6" variant="compact" placement="next_step_help" pageType="finance-supply-chain" cta="Diskutera kontroll och ansvar" heading="Vill ni resonera kring var gränsen ska gå hos er?" text="20 minuter med d365.se om vilka moment som passar AI och vilken kontroll ni behöver." metadata={{ topic: "fscm_ai_control" }} />
      </div>
    </section>
  );
}
