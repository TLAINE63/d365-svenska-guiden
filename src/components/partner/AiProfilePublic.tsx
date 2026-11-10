// Public display of a partner's AI, Copilot & Automation profile.
// Never shows internal AI score, confidence, badges, tiers or numerical levels.

import { Bot } from "lucide-react";
import {
  AiProfile,
  labelForDelivery,
  labelForCapability,
  helpForCapability,
  labelForArea,
  labelForUseCase,
  labelForExperience,
  isAiProfileEmpty,
  agentCapabilities,
  agentCompetenceBasis,
  AGENT_CAPABILITY_OPTIONS,
  AGENT_BASIS_LABEL,
  labelForArea as areaLabel,
} from "@/lib/aiProfile";

interface Props {
  profile?: AiProfile | null;
  compact?: boolean;
  /** Partnerns informationsstatus (sätts manuellt i admin). */
  informationStatus?: string | null;
}

export default function AiProfilePublic({ profile, compact = false, informationStatus }: Props) {
  if (isAiProfileEmpty(profile)) return null;
  const p = profile!;

  const capItems = (p.capabilities || [])
    .map((v) => ({ label: labelForCapability(v), help: helpForCapability(v) }))
    .filter((x) => x.label);
  const caps = capItems.map((c) => c.label);
  const areas = (p.relevant_areas || []).map(labelForArea).filter(Boolean);
  const cases = (p.use_cases || []).map(labelForUseCase).filter(Boolean);
  const topCaps = capItems.slice(0, 3);
  const topCases = cases.slice(0, 4);
  const summary = (p.ai_experience_summary || "").trim();
  const agentKeys = agentCapabilities(p);
  const agentBasis = agentCompetenceBasis(p, informationStatus);
  const agentAreas = (p.relevant_areas || []).map(areaLabel).filter(Boolean);

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-3 py-1.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground/90">{children}</dd>
    </div>
  );

  const chips = (
    items: { label: string; help?: string }[] | string[],
    cls = "bg-muted text-foreground/80",
  ) => (
    <div className="flex flex-wrap gap-1.5">
      {items.map((raw) => {
        const item = typeof raw === "string" ? { label: raw, help: "" } : raw;
        return (
          <span
            key={item.label}
            title={item.help || undefined}
            className={`px-2 py-0.5 rounded-md text-xs ${cls} ${item.help ? "cursor-help" : ""}`}
          >
            {item.label}
          </span>
        );
      })}
    </div>
  );

  return (
    <section className={`rounded-lg border border-border bg-card ${compact ? "p-4" : "p-5 sm:p-6"} space-y-5`}>
      {/* Highlighted buyer-oriented "AI-erfarenhet" panel */}
      <div className="rounded-md border border-border bg-muted/30 p-4 sm:p-5">
        <header className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-sm sm:text-base font-semibold">Dokumenterade områden</h3>
          </div>
        </header>


        <div className="grid gap-4 sm:grid-cols-2">
          {topCaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Starkast inom
              </p>
              <ul className="text-sm text-foreground/90 space-y-1">
                {topCaps.map((c) => (
                  <li key={c.label} className="flex gap-1.5">
                    <span aria-hidden="true" className="text-primary mt-0.5">•</span>
                    <span>
                      <span
                        title={c.help}
                        className={c.help ? "underline decoration-dotted decoration-muted-foreground/60 underline-offset-2 cursor-help" : ""}
                      >
                        {c.label}
                      </span>
                      {c.help && (
                        <span className="block text-[11px] text-muted-foreground leading-snug">
                          {c.help}
                        </span>
                      )}
                    </span>
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
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Bedömning
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {summary}
            </p>

            <p className="text-[11px] text-muted-foreground mt-1.5">
              Genererad av d365.se utifrån partnerns AI-profil. Verifieras alltid i dialog.
            </p>
          </div>
        )}
      </div>

      {agentKeys.length > 0 && (
        <div className="rounded-md border border-border p-4 sm:p-5" aria-label="Kompetens för AI-agenter">
          <h3 className="text-sm sm:text-base font-semibold mb-1">Kompetens för AI-agenter</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Underlag: {agentBasis.map((b) => AGENT_BASIS_LABEL[b]).join(" · ")}.
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2 text-sm text-foreground/90">
            {AGENT_CAPABILITY_OPTIONS.filter((o) => agentKeys.includes(o.value)).map((o) => (
              <li key={o.value} className="flex gap-1.5">
                <span aria-hidden="true" className="text-accent">✓</span>
                <span>{o.label}</span>
              </li>
            ))}
          </ul>
          {agentAreas.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Avser: {agentAreas.join(", ")}
            </p>
          )}
          {!agentBasis.includes("reviewed") && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Uppgifterna är partnerns egna. Fråga efter exempel på levererade agenter vid kontakt.
            </p>
          )}
        </div>
      )}

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
              {chips(capItems, "bg-primary/10 text-primary border border-primary/20")}
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
