import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Check, Boxes, Users, Megaphone, Headset, LayoutGrid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import {
  BMI_INTRO, BMI_STEP3_INTRO, BMI_B0, BMI_B5, BMI_B3, BMI_B1, BMI_B2, BMI_B4, BMI_HINT,
  BMI_QUESTIONS, BMI_SECTIONS, BMI_DRAFT_KEY, BMI_RESULT_KEY, bmiQuestionText, bmiTrack,
  type BmiArea, type BmiResponse,
} from "@/lib/bmi";

type Step =
  | { kind: "intro" } | { kind: "b0" } | { kind: "b5" }
  | { kind: "section"; index: number } | { kind: "q"; index: number }
  | { kind: "step3" } | { kind: "b3" } | { kind: "b1" } | { kind: "b2" } | { kind: "b4" };

const FLOW: Step[] = [
  { kind: "intro" }, { kind: "b0" }, { kind: "b5" },
  ...BMI_QUESTIONS.flatMap((_, i): Step[] => (i % 3 === 0 && i > 0 ? [{ kind: "section", index: i / 3 }, { kind: "q", index: i }] : [{ kind: "q", index: i }])),
  { kind: "step3" }, { kind: "b3" }, { kind: "b1" }, { kind: "b2" }, { kind: "b4" },
];

type Draft = { pos: number; b0?: BmiArea; b5?: number; answers: Record<string, number>; b3?: string; b1?: string; b2?: string; b4: string[] };
const EMPTY: Draft = { pos: 0, answers: {}, b4: [] };
const AREA_ICONS: Record<BmiArea, typeof Boxes> = { erp: Boxes, crm: Users, marketing: Megaphone, service: Headset, platform: LayoutGrid };

function loadDraft(): Draft {
  try { const raw = sessionStorage.getItem(BMI_DRAFT_KEY); if (raw) return { ...EMPTY, ...JSON.parse(raw) }; } catch { /* ignore */ }
  return EMPTY;
}

function Progress({ step, answered }: { step: Step; answered: number }) {
  if (step.kind !== "q" && step.kind !== "section") {
    return <div className="text-xs text-muted-foreground mb-10">Om er</div>;
  }
  const qIndex = step.kind === "q" ? step.index : step.index * 3;
  const sec = Math.floor(qIndex / 3);
  return (
    <div className="mb-10">
      <div className="flex gap-1.5">
        {BMI_SECTIONS.map((s, i) => {
          const fill = i < sec ? 100 : i === sec ? (Math.max(0, answered - i * 3) / 3) * 100 : 0;
          return (
            <div key={s.id} className="h-1 flex-1 rounded-full bg-foreground/10 overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(100, fill)}%` }} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{BMI_SECTIONS[sec].name}</span>
        <span>Fråga {qIndex + 1} av 15</span>
      </div>
    </div>
  );
}

function OptionCard({ label, selected, onSelect, index }: { label: string; selected: boolean; onSelect: () => void; index: number }) {
  return (
    <button
      type="button" role="radio" aria-checked={selected} data-index={index} onClick={onSelect}
      className={`w-full text-left flex items-center gap-3.5 min-h-[56px] px-[18px] py-4 rounded-xl border bg-card text-[16px] leading-[1.45] text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? "border-primary border-[1.5px] bg-primary/[0.08]" : "border-border hover:border-foreground/40"}`}
    >
      <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${selected ? "bg-primary border-primary" : "border-muted-foreground/50"}`}>
        {selected && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </button>
  );
}

function RadioList({ label, options, value, onPick }: { label: string; options: string[]; value: number | null; onPick: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const btns = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>("[role=radio]") ?? []);
    const cur = btns.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === "ArrowDown" ? Math.min(btns.length - 1, cur + 1) : Math.max(0, cur - 1);
    btns[next]?.focus();
  };
  return (
    <div ref={ref} role="radiogroup" aria-label={label} onKeyDown={onKey} className="flex flex-col gap-2.5">
      {options.map((o, i) => <OptionCard key={o} label={o} index={i} selected={value === i} onSelect={() => onPick(i)} />)}
    </div>
  );
}

export default function BeslutsmognadDiagnostik() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industryQuery, setIndustryQuery] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => { setDraft(loadDraft()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) try { sessionStorage.setItem(BMI_DRAFT_KEY, JSON.stringify(draft)); } catch { /* ignore */ } }, [draft, hydrated]);

  const step = FLOW[draft.pos];
  const area: BmiArea = draft.b0 ?? "erp";
  const answered = Object.keys(draft.answers).length;

  const go = useCallback((pos: number) => {
    setVisible(false);
    window.setTimeout(() => { setDraft((d) => ({ ...d, pos })); setVisible(true); window.scrollTo({ top: 0 }); }, 200);
  }, []);
  const next = useCallback(() => go(Math.min(FLOW.length - 1, draft.pos + 1)), [go, draft.pos]);
  const back = useCallback(() => {
    let p = draft.pos - 1;
    while (p > 0 && (FLOW[p].kind === "section" || FLOW[p].kind === "step3")) p--;
    go(Math.max(0, p));
  }, [go, draft.pos]);

  // Section interstitial: auto-continue after 1.2 s.
  useEffect(() => {
    if (step.kind !== "section") return;
    const t = window.setTimeout(next, 1200);
    return () => window.clearTimeout(t);
  }, [step, next]);

  const pickAndAdvance = (update: (d: Draft) => Draft) => {
    setDraft(update);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => go(draft.pos + 1), 400);
  };

  const submit = async (b4: string[]) => {
    setSubmitting(true); setError(null);
    const body = { version: 2, b0: draft.b0, b5: draft.b5, answers: draft.answers, b1: draft.b1, b2: draft.b2, b3: draft.b3, b4 };
    const { data, error: err } = await supabase.functions.invoke("bmi-score", { body });
    if (err || !data?.submission_id) {
      setSubmitting(false);
      setError("Resultatet kunde inte beräknas just nu. Försök igen om en stund.");
      return;
    }
    const payload = { result: data as BmiResponse, input: body, date: new Date().toISOString().slice(0, 10) };
    try { sessionStorage.setItem(BMI_RESULT_KEY, JSON.stringify(payload)); sessionStorage.removeItem(BMI_DRAFT_KEY); } catch { /* ignore */ }
    bmiTrack("analysis_complete", "bmi_complete", { b0: draft.b0, phase: data.phase, total: data.total });
    navigate("/beslutsmognad/resultat", { state: payload });
  };

  // Keyboard: 1–4 picks, Backspace goes back.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Backspace" && draft.pos > 1) { e.preventDefault(); back(); return; }
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1) return;
      const btn = document.querySelector<HTMLButtonElement>(`[role=radiogroup] [data-index="${n - 1}"]`);
      btn?.click();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft.pos, back]);

  const industries = useMemo(() => {
    const q = industryQuery.trim().toLowerCase();
    const list = STANDARD_INDUSTRIES.map((i) => `${i.name}${i.sniCode ? ` (SNI ${i.sniCode.replace(/\D/g, "")})` : ""}`).concat(BMI_B1.other);
    return q ? list.filter((x) => x.toLowerCase().includes(q)) : list;
  }, [industryQuery]);

  const heading = (text: string, hint?: boolean) => (
    <div className="mb-8">
      <h2 className="text-[21px] md:text-[24px] leading-[1.3] font-semibold text-foreground">{text}</h2>
      {hint && <p className="mt-2 text-[13px] text-muted-foreground">{BMI_HINT}</p>}
    </div>
  );

  const prevLink = draft.pos > 1 && (
    <div className="mt-8 flex items-center justify-between">
      <button type="button" onClick={back} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Föregående</button>
      <span className="hidden md:inline text-xs text-muted-foreground">Tangent 1–4 fungerar också</span>
    </div>
  );

  let content: React.ReactNode = null;
  if (step.kind === "intro") {
    content = (
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">{BMI_INTRO.title}</h1>
        <p className="mt-5 text-[16px] leading-[1.45] text-muted-foreground">{BMI_INTRO.text}</p>
        <button
          type="button"
          onClick={() => { bmiTrack("analysis_start", "bmi_start"); next(); }}
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-primary-foreground font-medium hover:bg-primary/90"
        >{BMI_INTRO.button}</button>
      </div>
    );
  } else if (step.kind === "b0") {
    content = (
      <>
        {heading(BMI_B0.question)}
        <div role="radiogroup" aria-label={BMI_B0.question} className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {BMI_B0.options.map((o, i) => {
            const Icon = AREA_ICONS[o.value];
            const sel = draft.b0 === o.value;
            return (
              <button key={o.value} type="button" role="radio" aria-checked={sel} data-index={i}
                onClick={() => pickAndAdvance((d) => ({ ...d, b0: o.value, b4: d.b0 === o.value ? d.b4 : [] }))}
                className={`aspect-square flex flex-col items-center justify-center gap-3 p-4 rounded-xl border bg-card text-center text-[15px] leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${sel ? "border-primary border-[1.5px] bg-primary/[0.08]" : "border-border hover:border-foreground/40"}`}
              >
                <Icon className={`w-6 h-6 ${sel ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                <span>{o.label}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  } else if (step.kind === "b5") {
    content = (<>{heading(BMI_B5.question)}<RadioList label={BMI_B5.question} options={BMI_B5.options.map((o) => o.label)} value={draft.b5 ? draft.b5 - 1 : null}
      onPick={(i) => pickAndAdvance((d) => ({ ...d, b5: i + 1 }))} /></>);
  } else if (step.kind === "section") {
    const s = BMI_SECTIONS[step.index];
    content = (
      <button type="button" onClick={next} className="w-full py-24 text-center">
        <p className="text-xl font-medium text-foreground">Del {step.index + 1} av 5: {s.name}</p>
      </button>
    );
  } else if (step.kind === "q") {
    const q = BMI_QUESTIONS[step.index];
    const text = bmiQuestionText(q.text, area);
    const cur = draft.answers[q.id];
    content = (<>{heading(text, true)}<RadioList label={text} options={q.options} value={cur ?? null}
      onPick={(i) => {
        const isLastOfSection = step.index % 3 === 2;
        if (isLastOfSection && cur === undefined) bmiTrack("analysis_step", "bmi_section_complete", { section: q.section });
        pickAndAdvance((d) => ({ ...d, answers: { ...d.answers, [q.id]: i } }));
      }} /></>);
  } else if (step.kind === "step3") {
    content = (
      <div className="text-center py-10">
        <h2 className="text-[21px] md:text-[24px] leading-[1.3] font-semibold text-foreground">{BMI_STEP3_INTRO.title}</h2>
        <p className="mt-3 text-muted-foreground">{BMI_STEP3_INTRO.text}</p>
        <button type="button" onClick={next} className="mt-8 inline-flex rounded-xl bg-primary px-8 py-3 text-primary-foreground font-medium hover:bg-primary/90">Fortsätt</button>
      </div>
    );
  } else if (step.kind === "b3") {
    content = (<>{heading(BMI_B3.question)}<RadioList label={BMI_B3.question} options={BMI_B3.options} value={draft.b3 ? BMI_B3.options.indexOf(draft.b3) : null}
      onPick={(i) => pickAndAdvance((d) => ({ ...d, b3: BMI_B3.options[i] }))} /></>);
  } else if (step.kind === "b1") {
    content = (
      <>
        {heading(BMI_B1.question)}
        <input type="search" value={industryQuery} onChange={(e) => setIndustryQuery(e.target.value)} placeholder="Sök bransch"
          aria-label="Sök bransch" className="w-full mb-4 rounded-xl border border-border bg-card px-4 py-3 text-[16px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <div className="max-h-[420px] overflow-y-auto pr-1">
          <RadioList label={BMI_B1.question} options={industries} value={draft.b1 && industries.includes(draft.b1) ? industries.indexOf(draft.b1) : null}
            onPick={(i) => pickAndAdvance((d) => ({ ...d, b1: industries[i] }))} />
        </div>
      </>
    );
  } else if (step.kind === "b2") {
    content = (<>{heading(BMI_B2.question)}<RadioList label={BMI_B2.question} options={BMI_B2.options} value={draft.b2 ? BMI_B2.options.indexOf(draft.b2) : null}
      onPick={(i) => pickAndAdvance((d) => ({ ...d, b2: BMI_B2.options[i] }))} /></>);
  } else if (step.kind === "b4") {
    const cfg = BMI_B4[area];
    content = (
      <>
        {heading(cfg.question)}
        {cfg.groups.map((g) => (
          <div key={g.title ?? "all"} className="mb-6">
            {g.title && <p className="mb-3 text-sm font-medium text-foreground">{g.title}</p>}
            <div className="flex flex-wrap gap-2">
              {g.options.map((o) => {
                const sel = draft.b4.includes(o);
                return (
                  <button key={o} type="button" aria-pressed={sel}
                    onClick={() => setDraft((d) => ({ ...d, b4: sel ? d.b4.filter((x) => x !== o) : [...d.b4, o] }))}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${sel ? "border-primary bg-primary/[0.08] text-foreground" : "border-border bg-card hover:border-foreground/40"}`}
                  >{o}</button>
                );
              })}
            </div>
          </div>
        ))}
        {error && <p className="mb-4 text-sm text-destructive" role="alert">{error}</p>}
        <div className="flex items-center gap-6 mt-8">
          <button type="button" disabled={submitting} onClick={() => submit(draft.b4)}
            className="rounded-xl bg-primary px-8 py-3 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60">{submitting ? "Beräknar…" : "Fortsätt"}</button>
          <button type="button" disabled={submitting} onClick={() => submit([])} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Hoppa över</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Beslutsmognadsindex | d365.se</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://d365.se/beslutsmognad/diagnostik/" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-5">
            <Link to="/" className="font-semibold text-foreground">d365.se</Link>
          </div>
        </header>
        <div className="max-w-[600px] mx-auto px-5 py-12 md:py-20">
          {step.kind !== "intro" && <Progress step={step} answered={answered} />}
          <div className={`transition-all duration-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}>
            {content}
          </div>
          {step.kind !== "intro" && step.kind !== "section" && step.kind !== "step3" && prevLink}
        </div>
      </main>
    </>
  );
}
