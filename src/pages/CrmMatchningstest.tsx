import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getCrmMatchningstestConfig,
  type Answers,
  type ProductConfig,
  type Question,
} from "@/data/crmMatchningstestConfigs";
import { trackFunnelEvent, trackFunnelEventOnce } from "@/lib/funnelTracking";

interface Props {
  productKey: ProductConfig["key"];
}

const TIME_PER_QUESTION_SEC = 22;

const CrmMatchningstest = ({ productKey }: Props) => {
  const config = getCrmMatchningstestConfig(productKey);
  const navigate = useNavigate();
  const STORAGE_KEY = config.storageKey;
  const resultPath = `${config.canonicalPath}/resultat`;

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

  useEffect(() => {
    window.scrollTo(0, 0);
    trackFunnelEventOnce(`crm_test_start:${productKey}`, "crm_test_start", {
      product_key: productKey,
      assessment_type: config.assessmentType,
      total_questions: config.questions.length,
      resumed: Object.keys(answers).length > 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const goToResult = () => navigate(resultPath);

  const handlePick = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    const idx = questions.findIndex((q) => q.id === qid);
    trackFunnelEvent("crm_test_question_answer", {
      product_key: productKey,
      assessment_type: config.assessmentType,
      question_id: qid,
      question_index: idx + 1,
      total_questions: questions.length,
      answer_value: value,
    });
    setTimeout(() => {
      if (idx >= 0 && idx < questions.length - 1) {
        setIndex(idx + 1);
      } else if (idx === questions.length - 1) {
        const done = questions.every((q) => ({ ...answers, [qid]: value })[q.id] !== undefined);
        if (done) goToResult();
      }
    }, 250);
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    if (safeIndex < questions.length - 1) setIndex(safeIndex + 1);
    else if (allAnswered) goToResult();
  };

  if (!current) return null;
  const block = config.blocks[current.blockIndex];
  const selected = answers[current.id];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: config.h1, url: config.canonicalPath }]}
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
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>
                Fråga {safeIndex + 1} av {questions.length} · cirka {minutesLeft} min kvar
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
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-2">
                {current.text}
              </h2>
              {current.help && <p className="text-sm text-muted-foreground mb-4">{current.help}</p>}

              <div className="flex flex-col gap-2 mt-6">
                {current.options.map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handlePick(current.id, opt.value)}
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
            <Button variant="ghost" onClick={goPrev} disabled={safeIndex === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Föregående
            </Button>
            {safeIndex === questions.length - 1 ? (
              <Button
                onClick={goToResult}
                disabled={!allAnswered}
                className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]"
              >
                Visa resultat
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={goNext} disabled={selected === undefined}>
                Nästa
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CrmMatchningstest;
