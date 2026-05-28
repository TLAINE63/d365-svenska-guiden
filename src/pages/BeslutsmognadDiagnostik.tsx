import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  questions,
  SECTION_ROMAN,
  type Dimension,
  type Question,
} from "@/data/beslutsmognadQuestions";
import { supabase } from "@/integrations/supabase/client";

const DRAFT_KEY = "beslutsmognadsindex_draft";

type Answers = Record<string, string | number>;

const TopStrip = ({
  current,
  total,
  section,
}: {
  current: number;
  total: number;
  section: string;
}) => (
  <header className="w-full border-b border-bm-rule">
    <div className="max-w-[1200px] mx-auto px-6 py-5 grid grid-cols-3 items-center">
      <Link to="/beslutsmognad" className="font-bm-display text-bm-ink text-lg tracking-tight">
        d365<span className="italic text-bm-accent-deep">.se</span>
      </Link>
      <p className="text-center font-bm-display italic text-bm-ink-soft text-sm">
        {SECTION_ROMAN[section] ? `${SECTION_ROMAN[section]}. ` : ""}
        {section}
      </p>
      <p className="text-right font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted">
        Fråga {String(current).padStart(2, "0")} av {String(total).padStart(2, "0")}
      </p>
    </div>
  </header>
);

const ProgressBar = ({ pct }: { pct: number }) => (
  <div className="fixed bottom-0 left-0 right-0 h-px bg-bm-rule">
    <div className="h-full bg-bm-accent-deep transition-all duration-500" style={{ width: `${pct}%` }} />
  </div>
);

const SectionTransition = ({ section, onContinue }: { section: string; onContinue: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onContinue, 2000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        clearTimeout(t);
        onContinue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onContinue]);
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p
        className="font-bm-display italic text-bm-accent-deep mb-6"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 360 }}
      >
        {SECTION_ROMAN[section]}.
      </p>
      <h2
        className="font-bm-display italic text-bm-ink"
        style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 360 }}
      >
        {section}
      </h2>
    </div>
  );
};

const SingleSelect = ({
  q,
  value,
  onPick,
}: {
  q: Extract<Question, { type: "single_select" }>;
  value: string | undefined;
  onPick: (v: string) => void;
}) => (
  <div className="max-w-[640px] mx-auto w-full">
    <h2
      className="font-bm-display text-bm-ink mb-10 leading-snug text-center"
      style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 360 }}
    >
      {q.text}
    </h2>
    <div className="flex flex-col gap-3">
      {q.options.map((opt, i) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onPick(opt.value)}
            className={`text-left px-5 py-4 border transition-colors font-bm-display ${
              selected
                ? "border-bm-accent-deep bg-bm-accent-soft"
                : "border-bm-rule bg-bm-paper hover:border-bm-accent hover:bg-bm-accent-soft"
            }`}
            style={{ fontWeight: 320, fontSize: "1.05rem" }}
          >
            <span className="font-bm-display italic text-bm-ink-muted mr-3">
              {String.fromCharCode(97 + i)}.
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

const Likert = ({
  q,
  value,
  onPick,
}: {
  q: Extract<Question, { type: "likert_5" }>;
  value: number | undefined;
  onPick: (v: number) => void;
}) => (
  <div className="max-w-[680px] mx-auto w-full">
    <h2
      className="font-bm-display text-bm-ink mb-10 leading-snug text-center"
      style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 360 }}
    >
      {q.text}
    </h2>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-3 mb-4">
      <span className="font-bm-display italic text-bm-ink-muted text-sm sm:max-w-[140px] text-center sm:text-left">
        1 = {q.anchor_low}
      </span>
      <div className="flex flex-row sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const sel = value === n;
          return (
            <button
              key={n}
              onClick={() => onPick(n)}
              aria-label={`${n} av 5`}
              className={`w-14 h-14 rounded-full border transition-colors font-bm-display text-lg ${
                sel
                  ? "border-bm-accent-deep bg-bm-accent-deep text-bm-paper"
                  : "border-bm-rule bg-bm-paper text-bm-ink hover:border-bm-accent hover:bg-bm-accent-soft"
              }`}
              style={{ fontWeight: 380 }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <span className="font-bm-display italic text-bm-ink-muted text-sm sm:max-w-[140px] text-center sm:text-right">
        5 = {q.anchor_high}
      </span>
    </div>
    <p className="text-center font-bm-display italic text-bm-ink-muted text-sm mt-6">
      Välj det som ligger närmast sanningen — ni behöver inte tveka.
    </p>
  </div>
);

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <label className="block">
    <span className="font-bm-display italic text-bm-ink-muted text-xs uppercase tracking-wider">
      {label}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full bg-transparent border-0 border-b border-bm-rule-strong py-3 font-bm-display text-bm-ink placeholder:italic placeholder:text-bm-ink-muted focus:outline-none focus:border-bm-accent-deep"
      style={{ fontWeight: 320, fontSize: "1.1rem" }}
    />
  </label>
);

export default function BeslutsmognadDiagnostik() {
  const navigate = useNavigate();
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showTransition, setShowTransition] = useState<string | null>(null);
  const [pendingTransition, setPendingTransition] = useState<string | null>(null);
  const [phase, setPhase] = useState<"questions" | "contact">("questions");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const startedAt = useRef(Date.now());

  // Contact phase fields
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [followup, setFollowup] = useState<string>("Rapport via mail");

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (Date.now() - (d.savedAt ?? 0) > 7 * 24 * 60 * 60 * 1000) return;
      if (d.answers) setAnswers(d.answers);
      if (typeof d.idx === "number") setIdx(Math.min(d.idx, total - 1));
    } catch {
      /* ignore */
    }
  }, [total]);

  // Persist draft
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ answers, idx, savedAt: Date.now() })
      );
    } catch {
      /* ignore */
    }
  }, [answers, idx]);

  const q = questions[idx];
  const currentSection = q?.section ?? "";

  const advance = useCallback(() => {
    setIdx((i) => {
      const next = i + 1;
      if (next >= total) {
        setPhase("contact");
        return i;
      }
      const nextSection = questions[next].section;
      if (nextSection !== questions[i].section) {
        setPendingTransition(nextSection);
        setShowTransition(nextSection);
      }
      return next;
    });
  }, [total]);

  const back = useCallback(() => {
    setShowTransition(null);
    setPendingTransition(null);
    if (phase === "contact") {
      setPhase("questions");
      return;
    }
    setIdx((i) => Math.max(0, i - 1));
  }, [phase]);

  const handlePick = (value: string | number) => {
    setAnswers((a) => ({ ...a, [q.id]: value }));
    setTimeout(() => advance(), 400);
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showTransition) return;
      if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) {
        if (phase === "contact") return;
        if (answers[q.id] !== undefined) advance();
      } else if (e.shiftKey && e.key === "Enter") {
        back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, back, answers, q, phase, showTransition]);

  const pct = useMemo(() => {
    if (phase === "contact") return 100;
    return ((idx + (answers[q?.id] !== undefined ? 1 : 0)) / (total + 1)) * 100;
  }, [idx, answers, q, total, phase]);

  const computeScores = useCallback(() => {
    const dims: Dimension[] = [
      "behovsbild",
      "samsyn",
      "riskinsikt",
      "partnermarknad",
      "beslutsstruktur",
    ];
    const out: Record<Dimension, number> = {} as Record<Dimension, number>;
    dims.forEach((dim) => {
      const vals: number[] = [];
      questions.forEach((qq) => {
        if (qq.type === "likert_5" && qq.dimension === dim) {
          const v = answers[qq.id];
          if (typeof v === "number") vals.push(v);
        }
      });
      out[dim] = vals.length ? vals.reduce((s, n) => s + n, 0) / vals.length : 0;
    });
    return out;
  }, [answers]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);

  const handleSubmit = async () => {
    if (!contactName || !isEmailValid || !company || !consent) return;
    setSubmitting(true);
    setErrorMsg(null);
    const responses: Record<string, number> = {};
    questions.forEach((qq) => {
      if (qq.type === "likert_5" && typeof answers[qq.id] === "number") {
        responses[qq.id] = answers[qq.id] as number;
      }
    });
    const background = {
      industry: (answers.b1 as string) ?? "",
      revenue: (answers.b2 as string) ?? "",
      role: (answers.b3 as string) ?? "",
      current_erp: (answers.b4 as string) ?? "",
      eval_stage: (answers.b5 as string) ?? "",
    };
    const dimension_scores = computeScores();
    const meta = {
      completion_time_seconds: Math.round((Date.now() - startedAt.current) / 1000),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    try {
      const { error: insertError } = await supabase.from("assessments").insert({
        contact_name: contactName,
        contact_email: contactEmail,
        company,
        consent,
        background,
        responses,
        dimension_scores,
        free_text: freeText || null,
        followup_preference: followup,
        meta,
      });
      if (insertError) throw insertError;

      // Fire-and-forget notify (don't block redirect on email failures)
      supabase.functions
        .invoke("submit-assessment-notify", {
          body: {
            contact_name: contactName,
            contact_email: contactEmail,
            company,
            background,
            responses,
            dimension_scores,
            free_text: freeText,
            followup_preference: followup,
          },
        })
        .catch(() => {
          /* ignore */
        });

      localStorage.removeItem(DRAFT_KEY);
      navigate("/beslutsmognad/tack");
    } catch (e) {
      setErrorMsg(
        "Något gick fel. Försök igen, eller hör av er till hej@d365.se så löser vi det manuellt."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bm-paper text-bm-ink font-bm-display font-light flex flex-col">
      <Helmet>
        <title>Diagnostik · Beslutsmognadsindex | d365.se</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <TopStrip
        current={Math.min(idx + 1, total)}
        total={total}
        section={phase === "contact" ? "Avslut" : currentSection}
      />

      <main className="flex-1 flex flex-col">
        {showTransition && pendingTransition ? (
          <SectionTransition
            section={pendingTransition}
            onContinue={() => {
              setShowTransition(null);
              setPendingTransition(null);
            }}
          />
        ) : phase === "contact" ? (
          <div className="max-w-[640px] mx-auto w-full px-6 py-16">
            <p className="font-bm-display italic text-bm-accent-deep mb-3 text-lg">VII.</p>
            <h2
              className="font-bm-display italic text-bm-ink mb-10 leading-snug"
              style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 360 }}
            >
              Var ska vi skicka er rapport?
            </h2>

            <div className="flex flex-col gap-7">
              <Input label="För- och efternamn" value={contactName} onChange={setContactName} placeholder="Anna Andersson" />
              <Input label="E-postadress" value={contactEmail} onChange={setContactEmail} type="email" placeholder="anna@foretag.se" />
              <Input label="Företag" value={company} onChange={setCompany} placeholder="Företaget AB" />
            </div>

            <p className="mt-8 font-bm-display italic text-bm-ink-soft text-sm leading-relaxed">
              Vi använder uppgifterna för att skicka rapporten samt aggregerat och
              anonymt för Beslutsmognadsindex. Vi delar dem inte med tredje part.
            </p>

            <label className="mt-4 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 accent-bm-accent-deep"
              />
              <span className="font-bm-display text-bm-ink text-sm" style={{ fontWeight: 320 }}>
                Jag godkänner detta
              </span>
            </label>

            <div className="mt-10">
              <p className="font-bm-display italic text-bm-ink-muted text-xs uppercase tracking-wider mb-3">
                Vad är er enskilt största utmaning på 12–18 månaders sikt?
              </p>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={3}
                placeholder="Skriv kort om ni vill — det hjälper oss att förbereda er rapport."
                className="w-full bg-transparent border-0 border-b border-bm-rule-strong py-3 font-bm-display text-bm-ink placeholder:italic placeholder:text-bm-ink-muted focus:outline-none focus:border-bm-accent-deep resize-none"
                style={{ fontWeight: 320, fontSize: "1.05rem" }}
              />
            </div>

            <div className="mt-10">
              <p className="font-bm-display italic text-bm-ink-muted text-xs uppercase tracking-wider mb-4">
                Hur vill ni få ut resultatet?
              </p>
              <div className="flex flex-col gap-3">
                {["Rapport via mail", "30 min genomgång med rådgivare", "Workshop med beslutsgruppen"].map((opt) => {
                  const sel = followup === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFollowup(opt)}
                      className={`text-left px-5 py-3 border font-bm-display transition-colors ${
                        sel
                          ? "border-bm-accent-deep bg-bm-accent-soft"
                          : "border-bm-rule hover:border-bm-accent hover:bg-bm-accent-soft"
                      }`}
                      style={{ fontWeight: 320 }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <p className="mt-8 font-bm-display italic text-bm-highlight text-sm">{errorMsg}</p>
            )}

            <div className="mt-12 flex items-center justify-between">
              <button
                onClick={back}
                className="font-bm-display italic text-bm-ink-muted hover:text-bm-ink-soft text-sm"
              >
                ← Tillbaka
              </button>
              <button
                onClick={handleSubmit}
                disabled={!contactName || !isEmailValid || !company || !consent || submitting}
                className="bg-bm-ink text-bm-paper px-8 py-4 font-bm-body uppercase tracking-[0.2em] text-xs hover:bg-bm-accent-deep transition-colors rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Skickar…" : "Skicka in och få min rapport"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            {q.type === "single_select" ? (
              <SingleSelect q={q} value={answers[q.id] as string | undefined} onPick={(v) => handlePick(v)} />
            ) : (
              <Likert q={q} value={answers[q.id] as number | undefined} onPick={(v) => handlePick(v)} />
            )}
          </div>
        )}

        {/* Footer nav */}
        {!showTransition && phase === "questions" && (
          <div className="max-w-[1200px] mx-auto w-full px-6 py-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={idx === 0}
              className="font-bm-display italic text-bm-ink-muted hover:text-bm-ink-soft text-sm disabled:opacity-30"
            >
              ← Föregående
            </button>
            <button
              onClick={advance}
              disabled={answers[q.id] === undefined}
              className="border border-bm-ink px-6 py-3 font-bm-body uppercase tracking-[0.18em] text-[11px] hover:bg-bm-ink hover:text-bm-paper transition-colors rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Nästa
            </button>
          </div>
        )}
      </main>

      <ProgressBar pct={pct} />
    </div>
  );
}
