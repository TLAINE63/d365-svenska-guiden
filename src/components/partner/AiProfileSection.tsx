// Shared admin/partner-self-service form for the partner-level AI, Copilot & Automation profile.
// Used by AdminDashboard and PartnerUpdate.

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Info, HelpCircle } from "lucide-react";
import {
  AiProfile,
  DELIVERY_MODELS,
  AI_CAPABILITIES,
  AI_RELEVANT_AREAS,
  AI_USE_CASES,
  AI_EXPERIENCE_LEVELS,
  AI_PROJECT_COUNT_RANGES,
  AI_EVIDENCE_LEVELS,
  MAX_USE_CASES,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/aiProfile";

// Per-level explanations: what counts as this level + how it affects the internal 0–100 score.
const EXPERIENCE_LEVEL_INFO: Record<string, { what: string; points: string }> = {
  advisory: {
    what: "Ni har hållit rådgivning, workshops eller utbildningar kring AI/Copilot – men ännu inga skarpa kundprojekt.",
    points: "Bidrar med 5 poäng till delpoäng B (erfarenhet, max 25 av 100).",
  },
  pilot: {
    what: "Ni har genomfört minst en pilot eller proof-of-concept där AI/Copilot använts i en kundmiljö.",
    points: "Bidrar med 10 poäng till delpoäng B (erfarenhet, max 25 av 100).",
  },
  delivered: {
    what: "Ni har minst ett skarpt kundprojekt där AI/Copilot är i produktion.",
    points: "Bidrar med 15 poäng till delpoäng B (erfarenhet, max 25 av 100).",
  },
  multiple: {
    what: "Ni har flera kundprojekt i produktion och återanvänder erfarenhet mellan dem.",
    points: "Bidrar med 20 poäng till delpoäng B (erfarenhet, max 25 av 100).",
  },
  packaged: {
    what: "Ni har minst ett paketerat AI/Copilot-erbjudande med tydligt scope, leveransmodell och pris.",
    points: "Bidrar med 22 poäng till delpoäng B (erfarenhet, max 25 av 100).",
  },
  established: {
    what: "Etablerad leveransmodell för AI/Copilot: dedikerade roller, metodik, mätbara resultat över flera kunder.",
    points: "Bidrar med 25 poäng till delpoäng B (erfarenhet, max 25 av 100).",
  },
};

function ScoreBreakdownPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Hur räknas AI-poängen ut?"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Hur räknas AI-poängen ut?
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] text-xs leading-relaxed" align="start">
        <p className="font-semibold text-sm mb-2">AI-poäng (intern, 0–100)</p>
        <p className="mb-2 text-muted-foreground">
          Poängen används endast internt för matchning och tiebreak – den visas aldrig publikt.
          Den summeras från fem delar med tak:
        </p>
        <ul className="space-y-1.5">
          <li>
            <strong>A. AI-förmågor (max 40):</strong> Summa av valda förmågor.
            Azure AI 25, Copilot Studio 18, Power Platform-automation 16, Branschspecifik AI 16,
            Fabric/Power BI 14, Readiness 12, Governance 12, Adoption 10, Standard Copilot 8.
          </li>
          <li>
            <strong>B. Erfarenhet + projekt (max 25):</strong> Erfarenhetsnivå (5–25) plus
            projektbonus (1–2: 0, 3–5: 3, 6–10: 5, 10+: 7).
          </li>
          <li>
            <strong>C. Underlag (max 15):</strong> Högsta valda underlag räknas.
            Granskat 15, Publikt case 13, Referens på förfrågan 10, Anonymiserat 8,
            Paketerat 6, Självdeklarerat 3.
          </li>
          <li>
            <strong>D. Relevanta områden (max 10):</strong> 0 områden = 0 p, 1 = 3 p, 2–3 = 6 p,
            4+ = 10 p.
          </li>
          <li>
            <strong>E. Leveransmodell (max 10):</strong> Kombination 10, Centralt/externt team 7,
            Produktteam 5, Rådgivning 4.
          </li>
        </ul>
        <p className="mt-2 text-muted-foreground">
          Total = A + B + C + D + E, kappat till 100.
        </p>
      </PopoverContent>
    </Popover>
  );
}

function LevelInfoPopover({ levelValue }: { levelValue: string }) {
  const info = EXPERIENCE_LEVEL_INFO[levelValue];
  if (!info) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Mer info om nivån"
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] text-xs leading-relaxed" align="start">
        <p className="font-semibold text-sm mb-1">
          {AI_EXPERIENCE_LEVELS.find((l) => l.value === levelValue)?.label}
        </p>
        <p className="mb-2">{info.what}</p>
        <p className="text-muted-foreground">{info.points}</p>
      </PopoverContent>
    </Popover>
  );
}

interface Props {
  value: AiProfile;
  onChange: (next: AiProfile) => void;
}

export default function AiProfileSection({ value, onChange }: Props) {
  const v: AiProfile = {
    capabilities: [],
    relevant_areas: [],
    use_cases: [],
    evidence_level: [],
    ...value,
  };

  const update = (patch: Partial<AiProfile>) => onChange({ ...v, ...patch });

  const toggleIn = (key: keyof AiProfile, val: string, max?: number) => {
    const arr = ((v[key] as string[]) || []).slice();
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1);
    else {
      if (max && arr.length >= max) return;
      arr.push(val);
    }
    update({ [key]: arr } as any);
  };

  const caps = v.capabilities || [];
  const useCases = v.use_cases || [];
  const evidence = v.evidence_level || [];
  const desc = v.description || "";

  // Inline validation warnings
  const warnings: string[] = [];
  if (caps.includes("azure-ai") && (!desc.trim() || evidence.length === 0 || useCases.length === 0)) {
    warnings.push(
      "Ni har markerat avancerad AI. Lägg gärna till en kort beskrivning, use case eller underlag så att kunderna förstår er erfarenhet."
    );
  }
  if (caps.length > 6 && !desc.trim()) {
    warnings.push(
      "Ni har markerat många AI-förmågor. Lägg gärna till en kort beskrivning för att göra profilen mer trovärdig."
    );
  }
  if ((v.relevant_areas || []).length >= 4 && useCases.length === 0) {
    warnings.push(
      "Välj gärna några typiska use cases så att kunderna förstår hur AI-kompetensen används i praktiken."
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            AI, Copilot &amp; Automation
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Beskriv hur ni hjälper kunder med AI, Copilot och automation i Microsoft Dynamics 365- och
            Power Platform-miljöer. Markera endast områden där ni har faktisk erfarenhet från
            rådgivning, pilot eller kundprojekt. Ni behöver inte ange kundnamn – kundreferenser kan
            anges som "lämnas på förfrågan".
          </p>
        </div>
        <ScoreBreakdownPopover />
      </div>

      {/* 1. Delivery model */}
      <div>
        <Label className="text-sm font-semibold">Hur levererar ni AI-relaterade tjänster?</Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          Välj det alternativ som bäst beskriver hur AI-kompetensen är organiserad hos er.
        </p>
        <div className="space-y-1.5">
          {DELIVERY_MODELS.map((opt) => (
            <label
              key={opt.value || "none"}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="radio"
                name="ai_delivery_model"
                checked={(v.delivery_model || "") === opt.value}
                onChange={() => update({ delivery_model: opt.value || null })}
                className="accent-primary"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Capabilities */}
      <div>
        <Label className="text-sm font-semibold">Vilka AI-förmågor har ni faktisk erfarenhet av?</Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          Markera de områden där ni har praktisk erfarenhet från rådgivning, pilot eller kundprojekt.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {AI_CAPABILITIES.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer ${
                caps.includes(opt.value) ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <Checkbox
                checked={caps.includes(opt.value)}
                onCheckedChange={() => toggleIn("capabilities", opt.value)}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Relevant areas */}
      <div>
        <Label className="text-sm font-semibold">
          Inom vilka Dynamics-/Microsoft-områden är er AI-kompetens mest relevant?
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          Ni behöver inte ange separata AI-nivåer per produkt.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {AI_RELEVANT_AREAS.map((opt) => {
            const selected = (v.relevant_areas || []).includes(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => toggleIn("relevant_areas", opt.value)}
                className={`px-2.5 py-1 rounded-full border text-xs ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Use cases */}
      <div>
        <Label className="text-sm font-semibold">
          Vilka typer av AI-use cases hjälper ni kunder med?
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          Välj upp till {MAX_USE_CASES} typiska use cases som ni har erfarenhet av. (
          {useCases.length}/{MAX_USE_CASES})
        </p>
        <div className="grid sm:grid-cols-2 gap-1.5">
          {AI_USE_CASES.map((opt) => {
            const selected = useCases.includes(opt.value);
            const disabled = !selected && useCases.length >= MAX_USE_CASES;
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-2 p-2 rounded-md border text-sm cursor-pointer ${
                  selected ? "border-primary bg-primary/5" : "border-border"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Checkbox
                  checked={selected}
                  disabled={disabled}
                  onCheckedChange={() => toggleIn("use_cases", opt.value, MAX_USE_CASES)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-semibold">Erfarenhetsnivå</Label>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2">
            Välj den nivå som bäst motsvarar er nuvarande erfarenhet. Inte framtida planer.
            Klicka på <Info className="inline w-3 h-3 align-[-2px]" /> för att se vad varje nivå
            innebär och hur den påverkar AI-poängen.
          </p>
          <div className="space-y-1">
            {AI_EXPERIENCE_LEVELS.map((o) => {
              const selected = (v.experience_level || "") === o.value;
              return (
                <div
                  key={o.value || "none"}
                  className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-sm ${
                    selected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="ai_experience_level"
                      checked={selected}
                      onChange={() => update({ experience_level: o.value || null })}
                      className="accent-primary"
                    />
                    <span>{o.label}</span>
                  </label>
                  {o.value && <LevelInfoPopover levelValue={o.value} />}
                </div>
              );
            })}
          </div>
        </div>


        {/* 6. Project count */}
        <div>
          <Label className="text-sm font-semibold">Antal AI-projekt senaste 24 månaderna</Label>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2">
            Ungefärligt intervall. Exakta kundnamn krävs inte.
          </p>
          <select
            value={v.project_count_range || ""}
            onChange={(e) => update({ project_count_range: e.target.value || null })}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {AI_PROJECT_COUNT_RANGES.map((o) => (
              <option key={o.value || "none"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 7. Evidence */}
      <div>
        <Label className="text-sm font-semibold">Underlag för er AI-erfarenhet</Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          Ni behöver inte publicera kundnamn. Ange gärna om referens eller anonymiserat exempel kan
          lämnas vid kontakt.
        </p>
        <div className="grid sm:grid-cols-2 gap-1.5">
          {AI_EVIDENCE_LEVELS.map((opt) => {
            const selected = evidence.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-2 p-2 rounded-md border text-sm cursor-pointer ${
                  selected ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => toggleIn("evidence_level", opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 8. Short description */}
      <div>
        <Label className="text-sm font-semibold">
          Kort beskrivning av hur ni hjälper kunder med AI, Copilot eller automation
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          Max {MAX_DESCRIPTION_LENGTH} tecken. Beskriv gärna kundproblem, teknikområden och
          processområden. Kundnamn krävs inte.
        </p>
        <Textarea
          value={desc}
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(e) => update({ description: e.target.value })}
          rows={4}
          placeholder="Exempel: Vi hjälper kunder att identifiera och införa Copilot- och AI-lösningar i Dynamics 365, med fokus på datakvalitet, processautomation och adoption. Typiska use cases är Copilot Studio-agenter, AI-stöd i säljprocesser och analys med Power BI/Fabric."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {desc.length}/{MAX_DESCRIPTION_LENGTH} tecken
        </p>
      </div>

      {warnings.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 space-y-1.5 dark:border-amber-900/40 dark:bg-amber-950/20">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 text-[11px] text-muted-foreground border-t border-border pt-3">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          Uppgifterna används för att visa er AI-profil på partnerprofilen och för att matcha kunder
          som söker AI/Copilot-erfarenhet. AI-poäng och AI-nivå visas aldrig publikt.
        </span>
      </div>
    </div>
  );
}
