import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SuggestedPartnersCTA from "@/components/SuggestedPartnersCTA";
import SendUnderlagToPartners from "@/components/SendUnderlagToPartners";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BLOCKS, QUESTIONS, visibleQuestions, type Answers, type Question } from "@/data/fscmMatchningstest";
import { calculateScore, profileLabel, topProfiles, type ProfileKey, type ScoreResult } from "@/lib/fscmScoring";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "fscm_matchningstest_answers_v1";
const TIME_PER_QUESTION_SEC = 22;

const PROFILE_STRONG_COPY: Record<ProfileKey, string> = {
 concern:
 "Koncernkonsolidering, flerbolagsstruktur och hantering av flera valutor och regelverk",
 supplyChain:
 "Avancerad lagerstyrning, tillverkning och spårbarhet genom hela leveranskedjan",
 project:
 "Projektförsäljning, tidrapportering, projektfakturering och resursplanering över projekt",
 commerce:
 "Omnikanal-handel med integrerad e-handel, kassa och realtidssynk mot lager och ekonomi",
};

const PROFILE_PARTNER_HINT: Record<ProfileKey, string> = {
 concern:
 "Här blir F&SCM:s globala finansmotor och konsolideringslager mest relevant. Project Operations och HR ligger nära till hands om verksamheten också är personalintensiv.",
 supplyChain:
 "F&SCM:s WMS-, MRP- och spårbarhetsfunktioner är kärnan i denna profil. Tilläggsmodulerna inom transport och kvalitet kan bli aktuella beroende på bransch.",
 project:
 "Här ligger Dynamics 365 Project Operations nära – ofta i kombination med Finance för projektredovisning. Många verksamheter klarar sig med Project Operations + Business Central om koncernen är liten.",
 commerce:
 "Dynamics 365 Commerce ger omnikanal-stöd ovanpå F&SCM. För renodlad e-handel utan komplex butiks- eller B2B-logik finns enklare integrationsalternativ.",
};

const FURTHER_READING: Record<ProfileKey, { label: string; to: string }[]> = {
 concern: [
 { label: "Business Central vs Finance & Supply Chain", to: "/businesscentral/" },
 { label: "Finance & Supply Chain – översikt", to: "/finance-supply-chain/" },
 ],
 supplyChain: [
 { label: "Finance & Supply Chain – översikt", to: "/finance-supply-chain/" },
 { label: "Kunskapscenter: Finance & Supply Chain", to: "/kunskapscenter/finance-supply-chain/" },
 ],
 project: [
 { label: "Dynamics 365 Project Operations", to: "/d365projectoperations/" },
 { label: "Business Central", to: "/businesscentral/" },
 ],
 commerce: [
 { label: "Dynamics 365 Commerce", to: "/d365commerce/" },
 { label: "Finance & Supply Chain – översikt", to: "/finance-supply-chain/" },
 ],
};

const LEVEL_COPY: Record<
 ScoreResult["level"],
 { headline: string; body: string }
> = {
 strong: {
 headline: "Stark matchning",
 body:
 "Dina svar pekar på en verksamhet där Dynamics 365 Finance & Supply Chain Management och dess närliggande moduler täcker behov som mindre system har svårt att hantera samlat. Det betyder inte automatiskt att F&SCM är rätt val – men att det är ett rimligt alternativ att utvärdera på allvar.",
 },
 partial: {
 headline: "Delvis matchning",
 body:
 "Vissa delar av er verksamhet talar för F&SCM, andra ligger närmare ett enklare system som Business Central. Det är värt att titta noggrant på vilka behov som faktiskt är dimensionerande och om de motiverar F&SCM:s högre komplexitet och kostnad.",
 },
 oversized: {
 headline: "Sannolikt överdimensionerat",
 body:
 "Dina svar pekar på en verksamhet där ett enklare system, som Business Central, troligen täcker behoven väl idag. F&SCM:s styrkor inom flerbolagsstruktur och avancerad supply chain blir mest relevanta först om koncernen växer i komplexitet.",
 },
};

const formatProfileScore = (v: number | "not_applicable"): string =>
 v === "not_applicable" ? "Ej aktuellt" : `${v}%`;

// ---- Wizard ----

const FscmMatchningstest = () => {
 const navigate = useNavigate();
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
 }, [answers]);

 const visible = useMemo(() => visibleQuestions(answers), [answers]);
 const safeIndex = Math.min(index, Math.max(0, visible.length - 1));
 const current: Question | undefined = visible[safeIndex];
 const answeredCount = visible.filter((q) => answers[q.id] !== undefined).length;
 const allAnswered = answeredCount === visible.length;
 const remainingSec = Math.max(0, (visible.length - answeredCount) * TIME_PER_QUESTION_SEC);
 const minutesLeft = Math.max(1, Math.round(remainingSec / 60));
 const progressPct = visible.length === 0 ? 0 : Math.round((answeredCount / visible.length) * 100);

 const score: ScoreResult | null = useMemo(
 () => (showResult ? calculateScore(answers) : null),
 [answers, showResult],
 );

 // Persist anonymously when results are first shown.
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
 meta: { assessment_type: "fscm_matchningstest", version: 1 },
 },
 ]);
 }, [showResult, submitted, score, answers]);

 const handlePick = (qid: string, value: string) => {
 setAnswers((prev) => ({ ...prev, [qid]: value }));
 // Auto-advance for single-select & yes/no
 setTimeout(() => {
 const nextVisible = visibleQuestions({ ...answers, [qid]: value });
 const idx = nextVisible.findIndex((q) => q.id === qid);
 if (idx >= 0 && idx < nextVisible.length - 1) {
 setIndex(idx + 1);
 } else if (idx === nextVisible.length - 1) {
 // last question – go to result if all answered
 const done = nextVisible.every((q) => ({ ...answers, [qid]: value })[q.id] !== undefined);
 if (done) setShowResult(true);
 }
 }, 250);
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
 try {
 window.localStorage.removeItem(STORAGE_KEY);
 } catch {
 /* noop */
 }
 };

 return (
 <div className="min-h-screen flex flex-col bg-background">
 <SEOHead
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: "Finance & Supply Chain", url: "/finance-supply-chain/" }, { name: "Matchningstest", url: "/finance-supply-chain-management/matchningstest/" }]}
 title="Matchar F&SCM dina behov? – Matchningstest | d365.se"
 description="Tio minuter, 26 frågor. Funktionsorienterat matchningstest som visar om Dynamics 365 Finance & Supply Chain Management passar dig – eller om enklare alternativ räcker."
 canonicalPath="/finance-supply-chain-management/matchningstest"
 keywords="Dynamics 365 Finance matchningstest, F&SCM behovsanalys, ERP-test, Business Central vs F&SCM"
 ogImage="https://d365.se/og-finance-scm.png"
 />
 <Navbar />

 <main className="flex-1">
 <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20">
 <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-24 sm:pt-28 pb-8 sm:pb-10">
 <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
 Finance & Supply Chain Management
 </span>
 <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold leading-tight text-white mt-3 mb-3">
 Matchar F&SCM dina behov?
 </h1>
 <p className="text-white/70 text-base sm:text-lg max-w-3xl leading-relaxed">
 Ett funktionsorienterat matchningstest – inte ett mognadsbetyg. Vi tittar på vilka konkreta
 behov du har inom koncernekonomi, supply chain, projekt och handel, och visar ärligt om
 F&SCM matchar – eller om ett enklare system räcker.
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
 totalMax={QUESTIONS.length}
 minutesLeft={minutesLeft}
 progressPct={progressPct}
 allAnswered={allAnswered}
 onPick={handlePick}
 onPrev={goPrev}
 onNext={goNext}
 onFinish={() => setShowResult(true)}
 />
 ) : score ? (
 <ResultView score={score} onRestart={restart} onBack={() => setShowResult(false)} />
 ) : null}
 </div>
 </main>

 {score && <SuggestedPartnersCTA product="fsc" />}
 <Footer />
 </div>
 );
};

// ---- Sub-views ----

interface WizardViewProps {
 current?: Question;
 answers: Answers;
 index: number;
 totalVisible: number;
 totalMax: number;
 minutesLeft: number;
 progressPct: number;
 allAnswered: boolean;
 onPick: (qid: string, value: string) => void;
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
 onPick,
 onPrev,
 onNext,
 onFinish,
}: WizardViewProps) => {
 if (!current) return null;
 const block = BLOCKS[current.block];
 const selected = answers[current.id];

 return (
 <div>
 <div className="mb-6">
 <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
 <span>
 Fråga {index + 1} av upp till {totalMax} · cirka {minutesLeft} min kvar
 </span>
 <span>Block {current.block} av 6</span>
 </div>
 <Progress value={progressPct} className="h-2" aria-label="Framsteg" />
 </div>

 <Card className="">
 <CardContent className="p-6 sm:p-8">
 <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
 {block.title}
 </p>
 <h2 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-2">
 {current.text}
 </h2>
 {current.help && (
 <p className="text-sm text-muted-foreground mb-4">{current.help}</p>
 )}

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
 score: ScoreResult;
 onRestart: () => void;
 onBack: () => void;
}

const ResultView = ({ score, onRestart, onBack }: ResultViewProps) => {
 const level = LEVEL_COPY[score.level];
 const tops = topProfiles(score, 3);
 const strongest = tops[0]?.key;
 const reading = strongest ? FURTHER_READING[strongest] : FURTHER_READING.concern;

 const futureNote =
 score.maturity > 60
 ? "Givet dina svar om tillväxt och AI-relevans är skalbarhet och inbyggda AI-funktioner extra viktiga i utvärderingen framöver."
 : score.maturity < 40
 ? "Dina svar pekar mer på dagens behov än ett tydligt framtida AI-tryck – fokusera utvärderingen på vad du behöver lösa nu."
 : "AI och skalbarhet är värda att ha med i utvärderingen, men inget som ensamt bör styra valet.";

 const profileBars: { key: ProfileKey; value: number | "not_applicable" }[] = [
 { key: "concern", value: score.concern },
 { key: "supplyChain", value: score.supplyChain },
 { key: "project", value: score.project },
 { key: "commerce", value: score.commerce },
 ];

 return (
 <div className="space-y-8">
 <div>
 <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
 Resultat
 </p>
 <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
 {level.headline}
 </h2>
 <p className="text-sm text-muted-foreground mb-4">
 Sammanvägd matchningsgrad: <span className="font-semibold text-foreground">{score.total}/100</span>
 </p>
 <p className="text-foreground/85 leading-relaxed">{level.body}</p>
 </div>

 <Card>
 <CardContent className="p-6 sm:p-8">
 <h3 className="text-lg font-semibold text-foreground mb-4">Profil per behovsområde</h3>
 <div className="space-y-4">
 {profileBars.map((p) => (
 <div key={p.key}>
 <div className="flex items-center justify-between mb-1">
 <span className="text-sm font-medium text-foreground">{profileLabel(p.key)}</span>
 <span
 className={`text-sm ${
 p.value === "not_applicable"
 ? "text-muted-foreground italic"
 : "text-foreground font-semibold"
 }`}
 >
 {formatProfileScore(p.value)}
 </span>
 </div>
 {p.value === "not_applicable" ? (
 <div className="h-2 rounded bg-secondary" />
 ) : (
 <Progress value={p.value} className="h-2" />
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
 Områden där F&SCM sannolikt ger störst nytta
 </h3>
 <p className="text-sm text-muted-foreground mb-4">
 Baserat på dina svar är dessa områden där F&SCM och tillhörande moduler matchar starkast:
 </p>
 <ul className="space-y-3">
 {tops.map((t) => (
 <li key={t.key} className="flex gap-3">
 <span className="mt-1 w-2 h-2 rounded bg-primary shrink-0" />
 <div>
 <p className="font-medium text-foreground">{PROFILE_STRONG_COPY[t.key]}</p>
 <p className="text-sm text-muted-foreground mt-1">{PROFILE_PARTNER_HINT[t.key]}</p>
 </div>
 </li>
 ))}
 </ul>
 <p className="text-sm text-muted-foreground mt-6 pt-4 border-t border-border">{futureNote}</p>
 </CardContent>
 </Card>
 )}

 {score.level === "oversized" && (
 <Card className="border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/10">
 <CardContent className="p-6 sm:p-8">
 <h3 className="text-lg font-semibold text-foreground mb-2">
 Är Business Central ett bättre alternativ?
 </h3>
 <p className="text-foreground/85 leading-relaxed mb-4">
 Dina svar pekar på att F&SCM:s funktioner för flerbolagsstruktur, avancerad lagerstyrning och
 global compliance sannolikt är överdimensionerade för dig i dag. Business Central täcker
 normalt motsvarande behov till en bråkdel av kostnaden och med kortare implementationstid.
 </p>
 <Button asChild variant="outline">
 <Link to="/businesscentral/">Business Central ERP</Link>
 </Button>
 </CardContent>
 </Card>
 )}

 <Card>
 <CardContent className="p-6 sm:p-8">
 <h3 className="text-lg font-semibold text-foreground mb-3">Vidare läsning på d365.se</h3>
 <ul className="space-y-2">
 {reading.map((r) => (
 <li key={r.to}>
 <Link to={r.to} className="text-primary hover:underline">
 {r.label}
 </Link>
 </li>
 ))}
 <li>
 <Link to="/valjdynamics365partner/" className="text-primary hover:underline">
 Se Microsoft-partners som arbetar med Finance & Supply Chain
 </Link>
 </li>
 </ul>
 </CardContent>
 </Card>

 <SendUnderlagToPartners
   sourcePage="/fscm-matchningstest"
   assessmentType="fscm_matching"
   products={["fsc"]}
   underlagSummary={`F&SCM matchningstest – ${level.headline}\n\nSammanvägd matchning: ${score.total}/100.\n\n${level.body}\n\nStarkaste områden: ${tops.map((t) => PROFILE_STRONG_COPY[t.key]).join("; ") || "—"}`}
   resultUrl={typeof window !== "undefined" ? window.location.href : undefined}
 />


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

export default FscmMatchningstest;
