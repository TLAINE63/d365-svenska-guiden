// Public display of a partner's AI, Copilot & Automation profile.
// Never shows internal AI score, confidence, badges, tiers or numerical levels.

import { Sparkles } from "lucide-react";
import {
  AiProfile,
  labelForDelivery,
  labelForCapability,
  labelForArea,
  labelForUseCase,
  labelForExperience,
  labelForEvidence,
  isAiProfileEmpty,
} from "@/lib/aiProfile";

interface Props {
  profile?: AiProfile | null;
  compact?: boolean;
}

export default function AiProfilePublic({ profile, compact = false }: Props) {
  if (isAiProfileEmpty(profile)) return null;
  const p = profile!;

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

  const caps = (p.capabilities || []).map(labelForCapability).filter(Boolean);
  const areas = (p.relevant_areas || []).map(labelForArea).filter(Boolean);
  const cases = (p.use_cases || []).map(labelForUseCase).filter(Boolean);
  const evidence = (p.evidence_level || []).map(labelForEvidence).filter(Boolean);

  return (
    <section className={`rounded-lg border border-border bg-card ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <header className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-base font-semibold">AI, Copilot &amp; Automation</h3>
      </header>

      <dl className="divide-y divide-border/60">
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
    </section>
  );
}
