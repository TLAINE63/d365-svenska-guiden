import { Link, useParams } from "react-router-dom";
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NotFound from "@/pages/NotFound";
import BeforeAfterWorkflow from "@/components/ai-examples/BeforeAfterWorkflow";
import AiExampleCard from "@/components/ai-examples/AiExampleCard";
import { AI_TYPES, AUTOMATION_STEPS, getApplication, getCategory, getExampleBySlug, getRelatedExamples } from "@/data/aiExamples";

const Section = ({ letter, title, children }: { letter: string; title: string; children: React.ReactNode }) => (
  <section className="border-t border-border py-8">
    <h2 className="flex items-baseline gap-3 text-xl font-bold text-foreground">
      <span className="text-sm font-semibold text-accent">{letter}</span>{title}
    </h2>
    <div className="mt-4 text-muted-foreground">{children}</div>
  </section>
);

const AiExempelDetalj = () => {
  const { slug = "" } = useParams();
  const ex = getExampleBySlug(slug);
  if (!ex) return <NotFound />;
  const app = getApplication(ex.application);
  const level = AUTOMATION_STEPS.findIndex((s) => s.key === ex.automationLevel);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${ex.title} med AI i ${app.label}`}
        description={`${ex.summary} Exempel på hur arbetssättet förändras med ${AI_TYPES[ex.aiType].label}.`}
        canonicalPath={`/ai/exempel/${ex.slug}/`}
        breadcrumbs={[{ name: "Start", url: "/" }, { name: "AI-exempel", url: "/ai/exempel/" }, { name: ex.title, url: `/ai/exempel/${ex.slug}/` }]}
      />
      <Navbar />
      <main className="pt-24">
        <article className="container mx-auto max-w-3xl px-4 py-10">
          <Link to="/ai/exempel/" className="text-sm text-muted-foreground hover:text-primary">← Alla exempel</Link>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-muted-foreground">
              <img src={app.icon} alt="" className="h-4 w-4" /> <span className="whitespace-nowrap">{app.label}</span>
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">{getCategory(ex.category).label}</span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-muted-foreground" title={AI_TYPES[ex.aiType].text}>{AI_TYPES[ex.aiType].label}</span>
          </div>
          {!ex.verified && <p className="mt-3 inline-flex rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground">Exempel på användningsfall</p>}
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">{ex.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{ex.summary}</p>

          <Section letter="A" title="Vad vill du göra?"><p className="text-lg italic">"{ex.userGoal}"</p></Section>
          <Section letter="B" title="Så arbetade du tidigare">
            <p>Den traditionella arbetsgången: {ex.traditionalWorkflow.join(" → ")}.</p>
          </Section>
          <Section letter="C" title="Så kan du arbeta med AI">
            <p className="mb-4">Med AI börjar du i uppgiften i stället för i menyn: {ex.aiWorkflow.join(" → ")}.</p>
            <BeforeAfterWorkflow traditional={ex.traditionalWorkflow} ai={ex.aiWorkflow} />
          </Section>
          <Section letter="D" title="Exempel på vad du kan fråga">
            <div className="space-y-3">
              {ex.promptExamples.map((p) => (
                <div key={p} className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <p className="break-words text-foreground">{p}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section letter="E" title="Vad händer?"><p>{ex.whatHappens}</p></Section>
          <Section letter="F" title="Du har fortfarande kontrollen">
            <div className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <p className="text-foreground">{ex.humanResponsibility}</p>
            </div>
          </Section>
          <Section letter="G" title="Vad förändras?"><p>{ex.efficiencyBenefit}</p></Section>
          <Section letter="H" title="Nästa nivå">
            <ol className="flex flex-wrap gap-2">
              {AUTOMATION_STEPS.map((s, i) => (
                <li key={s.key} className={`rounded-md border px-3 py-1.5 text-sm ${i === level ? "border-primary bg-primary text-primary-foreground" : i < level ? "border-border bg-muted text-foreground" : "border-dashed border-border text-muted-foreground"}`}>
                  {s.label}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm">Markerat steg visar var exemplet befinner sig. Nästa nivå kräver ofta processbeslut och rätt licens, inte bara teknik.</p>
          </Section>

          <div className="border-t border-border py-6 text-xs text-muted-foreground">
            {ex.verified && ex.sourceUrl ? (
              <>Källa: <a href={ex.sourceUrl} className="underline" rel="noopener" target="_blank">{ex.sourceName}</a>{ex.lastVerified && `, senast verifierad ${ex.lastVerified}`}</>
            ) : (
              <>Exempel på användningsfall. Ännu inte verifierat mot källa; funktionalitet varierar mellan versioner och licenser.</>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-border bg-card p-5">
            <Link to="/ai/exempel/" className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Se fler exempel <ArrowRight className="h-4 w-4" /></Link>
            <Link to={app.productUrl} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Läs mer om <span className="whitespace-nowrap">{app.label}</span></Link>
          </div>

          <section className="pt-10">
            <h2 className="text-xl font-bold text-foreground"><span className="mr-3 text-sm font-semibold text-accent">I</span>Relaterade exempel</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {getRelatedExamples(ex, 3).map((r) => <AiExampleCard key={r.id} example={r} />)}
            </div>
          </section>
          <p className="mt-10 text-sm text-muted-foreground">
            Vill du se hur det här kan fungera hos er?{" "}
            <Link to="/valjdynamics365partner/" className="font-medium text-primary hover:underline">Hitta rätt Dynamics&nbsp;365-partner</Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default AiExempelDetalj;
