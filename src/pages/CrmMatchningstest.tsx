import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  getCrmMatchningstestConfig,
  type Answers,
  type ProductConfig,
  type Question,
} from "@/data/crmMatchningstestConfigs";
import {
  calculateCrmScore,
  topCrmProfiles,
  type CrmScoreResult,
} from "@/lib/crmMatchingScoring";

interface Props {
  productKey: ProductConfig["key"];
}

const TIME_PER_QUESTION_SEC = 22;

const CrmMatchningstest = ({ productKey }: Props) => {
  const config = getCrmMatchningstestConfig(productKey);
  const STORAGE_KEY = config.storageKey;

  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* noop */
    }
  }, [answers, STORAGE_KEY]);

  const questions = config.questions;
  const safeIndex = Math.min(index, Math.max(0, questions.length - 1));
  const current: Question | undefined = questions[safeIndex];
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const allAnswered = answeredCount === questions.length;
  const remainingSec = Math.max(0, (questions.length - answeredCount) * TIME_PER_QUESTION_SEC);
  const minutesLeft = Math.max(1, Math.round(remainingSec / 60));
  const progressPct = questions.length === 0 ? 0 : Math.round((answeredCount / questions.length) * 100);

  const score: CrmScoreResult | null = useMemo(
    () => (showResult ? calculateCrmScore(answers, config) : null),
    [answers, showResult, config],
  );

  useEffect(() => {
    if (!showResult || submitted || !score) return;
    setSubmitted(true);
    void supabase.from("assessments").insert([
      {
        contact_name: "anonymous",
        contact_email: "anonymous@d365.se",
        company: "anonymous",
        consent: false,
        background: {},
        responses: answers,
        dimension_scores: score as unknown as never,
        meta: { assessment_type: config.assessmentType, version: 1 },
      },
    ]);
  }, [showResult, submitted, score, answers, config]);

  const handlePick = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setTimeout(() => {
      const idx = questions.findIndex((q) => q.id === qid);
      if (idx >= 0 && idx < questions.length - 1) {
        setIndex(idx + 1);
      } else if (idx === questions.length - 1) {
        const done = questions.every((q) => ({ ...answers, [qid]: value })[q.id] !== undefined);
        if (done) setShowResult(true);
      }
    }, 250);
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    if (safeIndex < questions.length - 1) setIndex(safeIndex + 1);
    else if (allAnswered) setShowResult(true);
  };
  const restart = () => {
    setAnswers({});
    setIndex(0);
    setShowResult(false);
    setSubmitted(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={config.seoTitle}
        description={config.seoDescription}
        canonicalPath={config.canonicalPath}
        keywords={config.keywords}
        ogImage={config.ogImage}
      />
      <Navbar />

      <main className="flex-1">
        <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-24 sm:pt-28 pb-8 sm:pb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              {config.eyebrow}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold leading-tight text-white mt-3 mb-3">
              {config.h1}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl leading-relaxed">{config.intro}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-8 sm:py-12">
          {!showResult ? (
            <WizardView
              config={config}
              current={current}
              answers={answers}
              index={safeIndex}
              totalVisible={questions.length}
              minutesLeft={minutesLeft}
              progressPct={progressPct}
              allAnswered={allAnswered}
              onPick={handlePick}
              onPrev={goPrev}
              onNext={goNext}
              onFinish={() => setShowResult(true)}
            />
          ) : score ? (
            <ResultView config={config} score={score} onRestart={restart} onBack={() => setShowResult(false)} />
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface WizardViewProps {
  config: ProductConfig;
  current?: Question;
  answers: Answers;
  index: number;
  totalVisible: number;
  minutesLeft: number;
  progressPct: number;
  allAnswered: boolean;
  onPick: (qid: string, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

const WizardView = ({
  config,
  current,
  answers,
  index,
  totalVisible,
  minutesLeft,
  progressPct,
  allAnswered,
  onPick,
  onPrev,
  onNext,
  onFinish,
}: WizardViewProps) => {
  if (!current) return null;
  const block = config.blocks[current.blockIndex];
  const selected = answers[current.id];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            Fråga {index + 1} av {totalVisible} · cirka {minutesLeft} min kvar
          </span>
          <span>
            Block {current.blockIndex + 1} av {config.blocks.length}
          </span>
        </div>
        <Progress value={progressPct} className="h-2" aria-label="Framsteg" />
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{block?.title}</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-2">{current.text}</h2>
          {current.help && <p className="text-sm text-muted-foreground mb-4">{current.help}</p>}

          <div className="flex flex-col gap-2 mt-6">
            {current.options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onPick(current.id, opt.value)}
                  className={`w-full text-left rounded-lg border px-4 py-3 transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card hover:border-primary/40 hover:bg-secondary/40 text-foreground"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-sm sm:text-base">{opt.label}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button variant="ghost" onClick={onPrev} disabled={index === 0}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Föregående
        </Button>
        {index === totalVisible - 1 ? (
          <Button
            onClick={onFinish}
            disabled={!allAnswered}
            className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]"
          >
            Visa resultat
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={onNext} disabled={selected === undefined}>
            Nästa
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

interface ResultViewProps {
  config: ProductConfig;
  score: CrmScoreResult;
  onRestart: () => void;
  onBack: () => void;
}

const formatScore = (v: number | "not_applicable") =>
  v === "not_applicable" ? "Ej aktuellt" : `${v}%`;

const ResultView = ({ config, score, onRestart, onBack }: ResultViewProps) => {
  const level = config.levelCopy[score.level];
  const tops = topCrmProfiles(score, 3);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Resultat</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">{level.headline}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sammanvägd matchningsgrad:{" "}
          <span className="font-semibold text-foreground">{score.total}/100</span>
        </p>
        <p className="text-foreground/85 leading-relaxed">{level.body}</p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Profil per behovsområde</h3>
          <div className="space-y-4">
            {score.perProfile.map((p) => (
              <div key={p.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{p.label}</span>
                  <span
                    className={`text-sm ${
                      p.score === "not_applicable"
                        ? "text-muted-foreground italic"
                        : "text-foreground font-semibold"
                    }`}
                  >
                    {formatScore(p.score)}
                  </span>
                </div>
                {p.score === "not_applicable" ? (
                  <div className="h-2 rounded bg-secondary" />
                ) : (
                  <Progress value={p.score} className="h-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {tops.length > 0 && (
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Områden där {config.productName} sannolikt ger störst nytta
            </h3>
            <ul className="space-y-3">
              {tops.map((t) => {
                const p = config.profiles.find((x) => x.key === t.key);
                if (!p) return null;
                return (
                  <li key={t.key} className="flex gap-3">
                    <span className="mt-1 w-2 h-2 rounded bg-primary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{p.strongCopy}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.partnerHint}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {score.level === "oversized" && config.oversizedAlternative && (
        <Card className="border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/10">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {config.oversizedAlternative.heading}
            </h3>
            <p className="text-foreground/85 leading-relaxed mb-4">
              {config.oversizedAlternative.body}
            </p>
            <Button asChild variant="outline">
              <Link to={config.oversizedAlternative.ctaTo}>{config.oversizedAlternative.ctaLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">Vidare läsning på d365.se</h3>
          <ul className="space-y-2">
            {config.furtherReading.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="text-primary hover:underline">
                  {r.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to={config.partnerFilterPath} className="text-primary hover:underline">
                Jämför partners för {config.productName}
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tillbaka till frågorna
        </Button>
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Börja om
        </Button>
      </div>
    </div>
  );
};

export default CrmMatchningstest;
