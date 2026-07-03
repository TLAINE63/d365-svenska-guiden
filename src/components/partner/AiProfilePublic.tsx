// Public display of a partner's AI, Copilot & Automation profile.
// Never shows internal AI score, confidence, badges, tiers or numerical levels.

import { Sparkles, Bot } from "lucide-react";
import {
  AiProfile,
  labelForDelivery,
  labelForCapability,
  labelForArea,
  labelForUseCase,
  labelForExperience,
  isAiProfileEmpty,
  aiMaturityLabel,
} from "@/lib/aiProfile";

interface Props {
  profile?: AiProfile | null;
  compact?: boolean;
}

export default function AiProfilePublic({ profile, compact = false }: Props) {
  if (isAiProfileEmpty(profile)) return null;
  const p = profile!;

  const caps = (p.capabilities || []).map(labelForCapability).filter(Boolean);
  const areas = (p.relevant_areas || []).map(labelForArea).filter(Boolean);
  const cases = (p.use_cases || []).map(labelForUseCase).filter(Boolean);
  const maturity = aiMaturityLabel(p);
  const topCaps = caps.slice(0, 3);
  const topCases = cases.slice(0, 4);
  const summary = (p.ai_experience_summary || "").trim();

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-3 py-1.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground/90">{children}</dd>
    </div>
  );

  const chips = (items: string[], cls = "bg-muted text-foreground/80") => (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className={`px-2 py-0.5 rounded-md text-xs ${cls}`}>
          {t}
        </span>
      ))}
    </div>
  );

  return (
    <section className={`rounded-lg border border-border bg-card ${compact ? "p-4" : "p-5 sm:p-6"} space-y-5`}>
      {/* Highlighted buyer-oriented "AI-erfarenhet" panel */}
      <div className="rounded-md border border-primary/25 bg-primary/[0.04] p-4 sm:p-5">
        <header className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" aria-hidden="true" />
            <h3 className="text-sm sm:text-base font-semibold">AI-erfarenhet</h3>
          </div>
          {maturity && (
            <span className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/25">
              AI-mognad: {maturity}
            </span>
          )}
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {topCaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Starkast inom
              </p>
              <ul className="text-sm text-foreground/90 space-y-0.5">
                {topCaps.map((c) => (
                  <li key={c} className="flex gap-1.5">
                    <span aria-hidden="true" className="text-primary">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {topCases.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Typiska AI-initiativ
              </p>
              <ul className="text-sm text-foreground/90 space-y-0.5">
                {topCases.map((c) => (
                  <li key={c} className="flex gap-1.5">
                    <span aria-hidden="true" className="text-primary">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {summary && (
          <div className="mt-4 pt-4 border-t border-primary/15">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              AI:s sammanfattning
            </p>
            <p className="text-sm leading-relaxed text-foreground/90 italic">
              {summary}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Genererad av d365.se utifrån partnerns AI-profil. Verifieras alltid i dialog.
            </p>
          </div>
        )}
      </div>

      {/* Detaljer för den som vill fördjupa sig */}
      <details className="group">
        <summary className="text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground select-none">
          Visa fullständig AI-, Copilot- &amp; automationsprofil
        </summary>
        <dl className="divide-y divide-border/60 mt-3">
          {p.delivery_model && (
            <Row label="AI-leveransmodell">{labelForDelivery(p.delivery_model)}</Row>
          )}
          {caps.length > 0 && (
            <Row label="AI-förmågor">
              {chips(caps, "bg-primary/10 text-primary border border-primary/20")}
            </Row>
          )}
          {areas.length > 0 && <Row label="Relevant för">{chips(areas)}</Row>}
          {cases.length > 0 && <Row label="Typiska use cases">{chips(cases)}</Row>}
          {p.experience_level && (
            <Row label="Erfarenhetsnivå">{labelForExperience(p.experience_level)}</Row>
          )}
          {p.description && (
            <Row label="Kort beskrivning">
              <p className="leading-relaxed">{p.description}</p>
            </Row>
          )}
        </dl>
      </details>
    </section>
  );
}
