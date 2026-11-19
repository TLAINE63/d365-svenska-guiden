import { ExternalLink, Sparkles } from "lucide-react";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import ExampleLinks from "./ExampleLinks";
import { BC_ACTIVATION_LABEL, BC_CAPABILITIES, BC_LICENSE_LABEL, BC_MATURITY_LABEL, BC_READINESS_QUESTIONS, VERIFIED_AT } from "@/lib/erpAiGuidance";

export default function BcAiValueSection() {
  return (
    <section id="ai-copilot" className="scroll-mt-24 bg-background py-10 sm:py-14" aria-labelledby="bc-ai-heading">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent"><Sparkles className="h-4 w-4" aria-hidden /> Copilot och AI-agenter</p>
        <h2 id="bc-ai-heading" className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Hur mycket mer kan ni få ut av Business Central med Copilot och AI-agenter?</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">Alla AI-funktioner är inte likadana. Vissa är standard, andra behöver aktiveras, finns i förhandsversion eller kostar per användning. Här är läget per funktion.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BC_CAPABILITIES.map((c) => (
            <div key={c.title} className="flex flex-col rounded-xl border border-border bg-card p-5">
              <dl className="space-y-1 text-xs">
                <div className="flex flex-wrap items-center gap-1.5"><dt className="sr-only">Licens och kostnad</dt>{c.license.map((l) => <dd key={l} className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">{BC_LICENSE_LABEL[l]}</dd>)}</div>
                {(c.requiresActivation || c.maturity) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {c.requiresActivation && <><dt className="sr-only">Aktivering</dt><dd className="rounded border border-border px-2 py-0.5 text-muted-foreground">{BC_ACTIVATION_LABEL}</dd></>}
                    {c.maturity && <><dt className="sr-only">Mognadsgrad</dt><dd className="rounded border border-border px-2 py-0.5 text-muted-foreground">{BC_MATURITY_LABEL[c.maturity]}</dd></>}
                  </div>
                )}
              </dl>
              <h3 className="mt-3 font-semibold text-card-foreground">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
              {c.example && <ExampleLinks slugs={[c.example]} />}
              {c.sourceUrl && <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-auto pt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline">Källa: Microsoft Learn, kontrollerad <span className="whitespace-nowrap">{VERIFIED_AT}</span> <ExternalLink className="h-3 w-3" aria-hidden /></a>}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
          <h3 className="font-semibold text-foreground">Tre frågor innan ni automatiserar ett arbetsmoment</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-foreground">
            {BC_READINESS_QUESTIONS.map((q) => <li key={q}>{q}</li>)}
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">Svarar ni nej på någon fråga är det oftast där arbetet bör börja, före val av agent eller partner.</p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Status och licensvillkor kontrollerade mot Microsoft Learn <span className="whitespace-nowrap">{VERIFIED_AT}</span>. Villkoren ändras, kontrollera alltid aktuell information för er licens.</p>
        <AdvisoryOffer className="mt-6" variant="compact" placement="next_step_help" pageType="businesscentral" cta="Diskutera AI i ert Business Central" heading="Vill ni veta vad som passar ert Business Central?" text="20 minuter med d365.se om vilka funktioner som är värda att aktivera och vad som kostar extra." metadata={{ topic: "bc_ai_value" }} />
      </div>
    </section>
  );
}
