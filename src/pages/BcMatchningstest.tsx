import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, FileDown, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SuggestedPartnersCTA from "@/components/SuggestedPartnersCTA";
import { usePartners } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { buildCompareUrl } from "@/lib/compareUrl";
import { SoftwareApplicationSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BC_BLOCKS,
  BC_QUESTIONS,
  bcVisibleQuestions,
  type BcAnswers,
  type BcQuestion,
} from "@/data/bcMatchningstest";
import {
  calculateBcResult,
  bcClassificationLabel,
  type BcClassification,
  type BcResult,
} from "@/lib/bcScoring";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SEC_PER_Q = 18;

const CLASS_ORDER: BcClassification[] = ["essentials", "premium", "config", "isv", "outside"];
const CLASS_COLOR: Record<BcClassification, string> = {
  essentials: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-100",
  premium: "bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/20 dark:text-sky-100",
  config: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100",
  isv: "bg-violet-50 border-violet-200 text-violet-900 dark:bg-violet-950/20 dark:text-violet-100",
  outside: "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:text-rose-100",
};

const BcMatchningstest = () => {
  useNavigate();
  const { toast } = useToast();
  // Starta alltid tomt — testet ska kännas färskt varje gång.
  const [answers, setAnswers] = useState<BcAnswers>({});
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visible = useMemo(() => bcVisibleQuestions(answers), [answers]);
  const safeIndex = Math.min(index, Math.max(0, visible.length - 1));
  const current: BcQuestion | undefined = visible[safeIndex];
  const answeredCount = visible.filter((q) => {
    const v = answers[q.id];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined;
  }).length;
  const allAnswered = answeredCount === visible.length;
  const remainingSec = Math.max(0, (visible.length - answeredCount) * SEC_PER_Q);
  const minutesLeft = Math.max(1, Math.round(remainingSec / 60));
  const progressPct = visible.length === 0 ? 0 : Math.round((answeredCount / visible.length) * 100);

  const result: BcResult | null = useMemo(
    () => (showResult ? calculateBcResult(answers) : null),
    [answers, showResult],
  );

  useEffect(() => {
    if (!showResult || submitted || !result) return;
    setSubmitted(true);
    void supabase.from("assessments").insert([
      {
        contact_name: "anonymous",
        contact_email: "anonymous@d365.se",
        company: "anonymous",
        consent: false,
        background: {},
        responses: answers as never,
        dimension_scores: result as unknown as never,
        meta: { assessment_type: "bc_matchningstest", version: 1 },
      },
    ]);
  }, [showResult, submitted, result, answers]);

  const handlePickSingle = (qid: string, value: string) => {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    setTimeout(() => {
      const nextVisible = bcVisibleQuestions(next);
      const idx = nextVisible.findIndex((q) => q.id === qid);
      if (idx >= 0 && idx < nextVisible.length - 1) {
        setIndex(idx + 1);
      }
    }, 200);
  };

  const handleToggleMulti = (qid: string, value: string) => {
    const cur = answers[qid];
    const arr = Array.isArray(cur) ? [...cur] : [];
    const i = arr.indexOf(value);
    if (i === -1) arr.push(value);
    else arr.splice(i, 1);
    setAnswers({ ...answers, [qid]: arr });
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    if (safeIndex < visible.length - 1) setIndex(safeIndex + 1);
    else if (allAnswered) setShowResult(true);
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setShowResult(false);
    setSubmitted(false);
  };

  const { data: partners = [] } = usePartners();

  const onPdf = async () => {
    if (!result) return;
    try {
      const { generateBcResultPdf } = await import("@/utils/generateBcResultPdf");
      const sugg = pickSuggestedPartners(partners, { product: "bc", limit: 3 });
      const origin = typeof window !== "undefined" ? window.location.origin : "https://d365.se";
      await generateBcResultPdf(result, answers, sugg.length > 0 ? {
        suggestedPartners: sugg.map((p) => ({
          name: p.name,
          slug: p.slug,
          positioning: (p as any).positioning_statement || p.description || "",
        })),
        suggestedCompareUrl: origin + buildCompareUrl(sugg.map((p) => p.slug)),
      } : undefined);
      toast({ title: "PDF skapad", description: "Resultatet har laddats ned." });
    } catch (e) {
      console.error(e);
      toast({ title: "Kunde inte skapa PDF", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Matchar Business Central era behov? – Test | d365.se"
        description="Funktionsorienterat matchningstest för Microsoft Dynamics 365 Business Central. 20–25 frågor som visar vad som ingår i standard, kräver Premium, ISV eller ligger utanför BC."
        canonicalPath="/businesscentral/matchningstest"
        keywords="Business Central matchningstest, BC behovsanalys, Dynamics 365 Business Central, Essentials Premium ISV"
      />
      <SoftwareApplicationSchema
        name="Business Central matchningstest"
        description="Funktionsorienterat 20–25-frågors matchningstest som visar hur väl Dynamics 365 Business Central täcker era behov – standard, Premium, ISV eller utanför BC."
        url="https://d365.se/businesscentral/matchningstest/"
      />
      <Navbar />

      <main className="flex-1">
        <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-24 sm:pt-28 pb-8 sm:pb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              Business Central
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold leading-tight text-white mt-3 mb-3">
              Matchar Business Central era behov?
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl leading-relaxed">
              Ett funktionsorienterat matchningstest. Först några generella frågor om storlek och bransch,
              därefter en fördjupning utifrån just ert segment. Resultatet visar vad som ingår i BC i standard,
              vad som kräver Premium, konfiguration eller ISV-tillägg — och vad som faktiskt ligger utanför BC.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-8 sm:py-12">
          {!showResult ? (
            <WizardView
              current={current}
              answers={answers}
              index={safeIndex}
              totalVisible={visible.length}
              totalMax={BC_QUESTIONS.length}
              minutesLeft={minutesLeft}
              progressPct={progressPct}
              allAnswered={allAnswered}
              onPickSingle={handlePickSingle}
              onToggleMulti={handleToggleMulti}
              onPrev={goPrev}
              onNext={goNext}
              onFinish={() => setShowResult(true)}
            />
          ) : result ? (
            <ResultView result={result} onRestart={restart} onBack={() => setShowResult(false)} onPdf={onPdf} answers={answers} />
          ) : null}
        </div>
      </main>

      {result && showResult && <SuggestedPartnersCTA product="bc" />}
      <Footer />
    </div>
  );
};

// ===== Wizard =====
interface WizardProps {
  current?: BcQuestion;
  answers: BcAnswers;
  index: number;
  totalVisible: number;
  totalMax: number;
  minutesLeft: number;
  progressPct: number;
  allAnswered: boolean;
  onPickSingle: (qid: string, value: string) => void;
  onToggleMulti: (qid: string, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

const WizardView = ({
  current,
  answers,
  index,
  totalVisible,
  totalMax,
  minutesLeft,
  progressPct,
  allAnswered,
  onPickSingle,
  onToggleMulti,
  onPrev,
  onNext,
  onFinish,
}: WizardProps) => {
  if (!current) return null;
  const block = BC_BLOCKS[current.block];
  const value = answers[current.id];
  const selectedArr = Array.isArray(value) ? value : value !== undefined ? [value] : [];
  const isMulti = !!current.multi;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            Fråga {index + 1} av {totalVisible} · cirka {minutesLeft} min kvar
          </span>
          <span>Steg {current.block} av 6</span>
        </div>
        <Progress value={progressPct} className="h-2" aria-label="Framsteg" />
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{block.title}</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-2">{current.text}</h2>
          {current.help && <p className="text-sm text-muted-foreground mb-4">{current.help}</p>}

          <div className="flex flex-col gap-2 mt-6">
            {current.options.map((opt) => {
              const isSelected = selectedArr.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    isMulti ? onToggleMulti(current.id, opt.value) : onPickSingle(current.id, opt.value)
                  }
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
          {isMulti && (
            <p className="text-xs text-muted-foreground mt-4">Tryck på alternativen som stämmer, klicka Nästa när du är klar.</p>
          )}
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
          <Button
            onClick={onNext}
            disabled={
              isMulti
                ? selectedArr.length === 0
                : value === undefined
            }
          >
            Nästa
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

// ===== Result =====
interface ResultProps {
  result: BcResult;
  answers: BcAnswers;
  onRestart: () => void;
  onBack: () => void;
  onPdf: () => void;
}

const ResultView = ({ result, answers, onRestart, onBack, onPdf }: ResultProps) => {
  const [leadOpen, setLeadOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "" });
  const { toast } = useToast();

  const onLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.name || !form.email) return;
    setSubmitting(true);
    try {
      const summary = CLASS_ORDER.map(
        (c) =>
          `${bcClassificationLabel(c)}: ${result.byClassification[c].map((s) => s.area).join(", ") || "—"}`,
      ).join(" | ");
      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          company_name: form.company,
          contact_name: form.name,
          email: form.email,
          phone: form.phone,
          selected_product: "Business Central",
          industry: result.segmentLabel,
          source_page: "/businesscentral/matchningstest",
          source_type: "bc_matchningstest",
          message: `BC-matchningstest – ${result.headline}. ${summary}`,
        },
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "Tack!", description: "Vi återkommer med matchande partners." });
    } catch (err) {
      console.error(err);
      toast({ title: "Något gick fel", description: "Försök igen om en stund.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Resultat {result.segmentLabel ? `· ${result.segmentLabel}` : ""}
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">{result.headline}</h2>
        <p className="text-foreground/85 leading-relaxed">{result.body}</p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Identifierade behov per kategori</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Listan visar de behov som era svar pekar på, grupperade efter hur de typiskt löses i en
            Business Central-implementation. Det är ingen offert eller produktrekommendation — det är
            ett underlag inför partnerdialog.
          </p>
          <div className="space-y-5">
            {CLASS_ORDER.map((c) => {
              const items = result.byClassification[c];
              if (items.length === 0) return null;
              return (
                <div key={c} className={`rounded-lg border p-4 sm:p-5 ${CLASS_COLOR[c]}`}>
                  <p className="text-sm font-semibold mb-2">{bcClassificationLabel(c)}</p>
                  <ul className="space-y-2">
                    {items.map((s) => (
                      <li key={`${c}-${s.area}`} className="text-sm">
                        <span className="font-medium">{s.area}</span>
                        {s.note && <span className="opacity-80"> — {s.note}</span>}
                      </li>
                    ))}
                  </ul>
                  {c === "isv" && (
                    <p className="text-sm mt-3 pt-3 border-t border-current/20">
                      <span className="font-semibold">Tips:</span> börja med att titta i vår{" "}
                      <Link to="/kunskapscenter/business-central-tillagg/" className="underline underline-offset-2 font-medium">
                        ISV-katalog för Business Central
                      </Link>{" "}
                      — där hittar ni de vanligaste svenska tilläggen kategoriserade. Hittar ni inget som passar finns fler appar på Microsoft Marketplace.
                    </p>
                  )}
                </div>
              );
            })}
            {result.signals.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Era svar pekar inte på några specifika behov som driver klassificering. BC i standard är
                ofta en bra utgångspunkt — fördjupa er i partner- och implementationsfrågorna istället.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Nästa steg</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onPdf} variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Ladda ned resultat som PDF
            </Button>
            {!leadOpen && !sent && (
              <Button
                onClick={() => setLeadOpen(true)}
                className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]"
              >
                <Mail className="w-4 h-4 mr-2" />
                Få matchande BC-partners
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to={`/valjpartner/?product=BC${result.segmentLabel ? `&industry=${encodeURIComponent(result.segmentLabel)}` : ""}`}>
                Se BC-partners direkt
              </Link>
            </Button>
          </div>

          {leadOpen && !sent && (
            <form onSubmit={onLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
              <div>
                <Label htmlFor="company">Företag *</Label>
                <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="name">Namn *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="email">E-post *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex gap-2 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => setLeadOpen(false)}>Avbryt</Button>
                <Button type="submit" disabled={submitting} className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]">
                  {submitting ? "Skickar..." : "Skicka och få matchning"}
                </Button>
              </div>
            </form>
          )}
          {sent && (
            <p className="text-sm text-foreground">Tack — vi återkommer inom 1–2 arbetsdagar med matchande BC-partners.</p>
          )}
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

export default BcMatchningstest;
