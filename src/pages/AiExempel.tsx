import { Fragment, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { trackAi } from "@/lib/aiLibraryTracking";
import { ArrowRight, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BeforeAfterWorkflow from "@/components/ai-examples/BeforeAfterWorkflow";
import AiExampleCard from "@/components/ai-examples/AiExampleCard";
import { AI_APPLICATIONS, AI_CATEGORIES, AI_ROLES, AI_TYPES, AiApplication, AiCategory, AiRole, AiType, filterExamples, getApplication, getCategory } from "@/data/aiExamples";

const ROLE_CARDS: AiRole[] = ["ekonom", "saljare", "kundservice", "inkopare", "projektledare", "servicepersonal"];
const FILTER_ROLES: AiRole[] = ["cfo", "ekonom", "saljare", "saljchef", "kundservice", "inkopare", "supplychain", "projektledare", "servicepersonal"];
const FORR = ["Jag måste veta var informationen finns.", "Jag behöver förstå systemets struktur.", "Jag söker, filtrerar och sammanställer.", "Jag utför återkommande moment manuellt."];
const NU = ["Jag börjar med vad jag vill få gjort.", "Jag kan fråga med naturligt språk där funktionen stöder det.", "AI kan hjälpa mig hitta, förstå, analysera eller skapa.", "Agenter kan i vissa processer utföra delar av arbetet."];
const STEPS: [AiCategory, string][] = [
  ["hitta", "AI hjälper mig hitta rätt information."],
  ["forsta", "AI hjälper mig förstå information och funktioner."],
  ["analysera", "AI hjälper mig bearbeta och sammanställa."],
  ["skapa", "AI hjälper mig skapa ett första resultat."],
  ["agera", "AI hjälper till i själva arbetsmomentet."],
  ["automatisera", "En agent kan hantera definierade delar av processen."],
];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const chip = (active: boolean) =>
  `min-h-[40px] rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${focus} ${
    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"
  }`;

const AiExempel = () => {
  const [params, setParams] = useSearchParams();
  const read = <T,>(k: string) => (params.get(k)?.split(",").filter(Boolean) ?? []) as T[];
  const cats = read<AiCategory>("kategori"), apps = read<AiApplication>("app"), roles = read<AiRole>("roll"), types = read<AiType>("typ");
  const setter = <T extends string>(k: string, ev: "ai_category_filter" | "ai_application_filter" | "ai_role_filter" | "ai_type_filter") =>
    (u: T[] | ((l: T[]) => T[])) => {
      const next = typeof u === "function" ? u(read<T>(k)) : u;
      const np = new URLSearchParams(params);
      next.length ? np.set(k, next.join(",")) : np.delete(k);
      setParams(np, { replace: true, preventScrollReset: true });
      if (next.length) trackAi(ev, null, { [ev === "ai_category_filter" ? "category" : ev === "ai_application_filter" ? "application" : ev === "ai_role_filter" ? "role" : "ai_type"]: next.join(",") });
    };
  const setCats = setter<AiCategory>("kategori", "ai_category_filter");
  const setApps = setter<AiApplication>("app", "ai_application_filter");
  const setRoles = setter<AiRole>("roll", "ai_role_filter");
  const setTypes = setter<AiType>("typ", "ai_type_filter");
  useEffect(() => { trackAi("ai_library_view"); if (window.location.hash === "#exempel") setTimeout(() => document.getElementById("exempel")?.scrollIntoView(), 50); }, []);
  useEffect(() => { try { sessionStorage.setItem("ai_library_filters", params.toString()); } catch { /* */ } }, [params]);
  const results = useMemo(() => filterExamples({ categories: cats, applications: apps, roles, aiTypes: types }), [params]); // eslint-disable-line react-hooks/exhaustive-deps
  const zeroKey = useRef("");
  useEffect(() => { const k = params.toString(); if (!results.length && k !== zeroKey.current) { zeroKey.current = k; trackAi("ai_zero_results", null, { filters: k }); } }, [results.length, params]);
  const active = [
    ...cats.map((c) => ({ key: `c-${c}`, label: getCategory(c).label, off: () => setCats((l) => l.filter((x) => x !== c)) })),
    ...apps.map((a) => ({ key: `a-${a}`, label: getApplication(a).label, off: () => setApps((l) => l.filter((x) => x !== a)) })),
    ...roles.map((r) => ({ key: `r-${r}`, label: AI_ROLES[r], off: () => setRoles((l) => l.filter((x) => x !== r)) })),
    ...types.map((t) => ({ key: `t-${t}`, label: AI_TYPES[t].label, off: () => setTypes((l) => l.filter((x) => x !== t)) })),
  ];
  const clear = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
  const goToExamples = () => document.getElementById("exempel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const moreCount = roles.length + types.length;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI i Dynamics 365: exempel på nya arbetssätt"
        description="Källgranskade exempel på hur Copilot, inbyggd AI och agenter förändrar arbetet i Business Central, Sales, Customer Service, Finance och Supply Chain."
        canonicalPath="/ai/exempel/"
        breadcrumbs={[{ name: "Start", url: "/" }, { name: "AI i Dynamics 365", url: "/aioversikt/" }, { name: "Exempel", url: "/ai/exempel/" }]}
      />
      <Navbar />
      <main className="pt-24 lg:pt-32">
        {/* Hero */}
        <section className="container mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">Ett nytt sätt att arbeta med Dynamics&nbsp;365</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Du behöver inte alltid börja med att leta efter rätt meny, vy eller funktion. Med AI kan du i allt fler situationer börja med att beskriva vad du vill få gjort och få hjälp att hitta, förstå, analysera och agera.
          </p>
          <p className="mt-6 max-w-3xl border-l-4 border-accent pl-4 text-xl font-semibold text-foreground">
            Från att navigera i systemet till att arbeta utifrån det du vill åstadkomma.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" onClick={goToExamples} className={`inline-flex items-center gap-1 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 ${focus}`}>
              Se hur du kan arbeta smartare <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <Link to="/aioversikt/" onClick={() => trackAi("ai_ai_hub_click", null, { cta_destination: "/aioversikt/" })} className={`inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary hover:underline ${focus}`}>
              Utforska AI i Dynamics&nbsp;365
            </Link>
          </div>
        </section>

        {/* Förr och nu + mognadstrappa + roller */}
        <section className="container mx-auto max-w-6xl px-4 pb-12" aria-labelledby="forr-nu">
          <h2 id="forr-nu" className="text-2xl font-bold text-foreground">Förr och nu</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/40 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Förr</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground">{FORR.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="rounded-xl border border-accent/40 bg-accent/5 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">Nu</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground">{NU.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
          <button type="button" onClick={goToExamples} className={`mt-5 inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-primary hover:underline ${focus}`}>
            Se konkreta exempel <ArrowRight className="h-4 w-4" aria-hidden />
          </button>

          <h2 className="mt-12 text-2xl font-bold text-foreground">Från att hitta till att automatisera</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(([key, d], i) => (
              <li key={key}>
                <button type="button" onClick={() => { setCats([key]); goToExamples(); }}
                  className={`h-full w-full rounded-xl border border-border bg-card p-4 text-left hover:border-primary/40 ${focus}`}>
                  <span className="block text-sm font-semibold text-foreground"><span className="mr-2 text-accent">{i + 1}.</span>{getCategory(key).label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{d}</span>
                </button>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-2xl font-bold text-foreground">Vad betyder det nya arbetssättet för dig?</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ROLE_CARDS.map((r) => (
              <button key={r} type="button" aria-pressed={roles.includes(r)}
                onClick={() => { setRoles(roles.length === 1 && roles[0] === r ? [] : [r]); goToExamples(); }}
                className={`min-h-[56px] rounded-xl border p-4 text-left text-sm font-semibold text-foreground transition ${focus} ${roles.includes(r) ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"}`}>
                {AI_ROLES[r]}
              </button>
            ))}
          </div>
        </section>

        {/* Biblioteket */}
        <section id="exempel" className="container mx-auto max-w-6xl scroll-mt-24 px-4 pb-16" aria-labelledby="sluta-leta">
          <h2 id="sluta-leta" className="text-3xl font-bold text-foreground">Sluta leta. Börja fråga.</h2>
          <p className="mt-2 text-muted-foreground">Se konkreta exempel på hur AI förändrar arbetet i Dynamics&nbsp;365.</p>

          <h3 className="mt-8 text-lg font-semibold text-foreground">Vad vill du få gjort?</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AI_CATEGORIES.map((c) => (
              <button key={c.key} type="button" aria-pressed={cats.includes(c.key)} onClick={() => setCats((l) => toggle(l, c.key))}
                className={`rounded-xl border p-4 text-left transition ${focus} ${cats.includes(c.key) ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"}`}>
                <span className="block font-semibold text-foreground">{c.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{c.text}</span>
              </button>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold text-foreground">Vilken Dynamics&nbsp;365-applikation använder du?</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {AI_APPLICATIONS.map((a) => (
              <button key={a.key} type="button" aria-pressed={apps.includes(a.key)} onClick={() => setApps((l) => toggle(l, a.key))} className={chip(apps.includes(a.key))}>
                <span className="whitespace-nowrap">{a.label}</span>
              </button>
            ))}
          </div>

          <details className="mt-6 rounded-xl border border-border bg-card p-4" open={moreCount > 0}>
            <summary className={`cursor-pointer rounded-sm text-sm font-semibold text-foreground ${focus}`}>Fler filter: roll och AI-typ{moreCount > 0 ? ` (${moreCount} valda)` : ""}</summary>
            <h4 className="mt-4 text-sm font-semibold text-muted-foreground">Roll</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {FILTER_ROLES.map((r) => (
                <button key={r} type="button" aria-pressed={roles.includes(r)} onClick={() => setRoles((l) => toggle(l, r))} className={chip(roles.includes(r))}>{AI_ROLES[r]}</button>
              ))}
            </div>
            <h4 className="mt-4 text-sm font-semibold text-muted-foreground">AI-typ</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(AI_TYPES) as AiType[]).map((t) => (
                <button key={t} type="button" aria-pressed={types.includes(t)} title={AI_TYPES[t].text} onClick={() => setTypes((l) => toggle(l, t))} className={chip(types.includes(t))}>{AI_TYPES[t].label}</button>
              ))}
            </div>
          </details>

          <div className="mt-6 flex flex-wrap items-center gap-2" aria-live="polite">
            <p className="mr-2 text-sm font-semibold text-foreground">{results.length} exempel</p>
            {active.map((f) => (
              <button key={f.key} type="button" onClick={f.off} aria-label={`Ta bort filter ${f.label}`}
                className={`inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground ${focus}`}>
                {f.label} <X className="h-3 w-3" aria-hidden />
              </button>
            ))}
            {active.length > 0 && (
              <button type="button" onClick={clear} className={`rounded-sm px-1 text-sm text-muted-foreground underline ${focus}`}>Rensa filter</button>
            )}
          </div>

          {results.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((e, i) => (
                <Fragment key={e.id}>
                  <AiExampleCard example={e} />
                  {i === 5 && results.length > 6 && (
                    <nav aria-label="Fortsätt utforska" className="rounded-xl border border-dashed border-border bg-muted/30 p-5 sm:col-span-2 lg:col-span-3">
                      <p className="text-sm font-semibold text-foreground">Fortsätt utforska</p>
                      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                        <li><Link to="/aioversikt/" onClick={() => trackAi("ai_ai_hub_click", null, { cta_destination: "/aioversikt/" })} className={`rounded-sm font-medium text-primary hover:underline ${focus}`}>AI i Dynamics&nbsp;365</Link></li>
                        {apps.length === 1 && <li><Link to={getApplication(apps[0]).productUrl} onClick={() => trackAi("ai_product_content_click", null, { application: apps[0], cta_destination: getApplication(apps[0]).productUrl })} className={`rounded-sm font-medium text-primary hover:underline ${focus}`}>Läs om {getApplication(apps[0]).label}</Link></li>}
                        <li><Link to="/valjdynamics365partner/" onClick={() => trackAi("ai_partner_cta_click", null, { cta_destination: "/valjdynamics365partner/" })} className={`rounded-sm font-medium text-primary hover:underline ${focus}`}>Hitta en Dynamics&nbsp;365-partner</Link></li>
                      </ul>
                    </nav>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-card p-6">
              <p className="font-semibold text-foreground">Inga exempel matchar dina val just nu.</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {active.length > 1 && <button type="button" onClick={active[active.length - 1].off} className={`rounded-sm text-sm font-medium text-primary underline ${focus}`}>Ta bort senaste filtret ({active[active.length - 1].label})</button>}
                <button type="button" onClick={clear} className={`rounded-sm text-sm font-medium text-primary underline ${focus}`}>Visa alla exempel</button>
              </div>
              </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Varje exempel bygger på Microsofts dokumentation och visar källa och datum för senaste granskning. Funktionerna förändras löpande och skiljer sig mellan licenser och versioner.
          </p>
        </section>

        <section className="container mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Så fungerar tekniken</h2>
            <p className="mt-1 text-sm text-muted-foreground">Exemplen visar hur arbetet förändras. I AI-översikten förklarar vi Copilot, agenter och utvecklingen.</p>
            <Link to="/aioversikt/" onClick={() => trackAi("ai_ai_hub_click", null, { cta_destination: "/aioversikt/" })} className={`mt-3 inline-flex items-center gap-1 rounded-sm font-semibold text-primary hover:underline ${focus}`}>Utforska AI i Dynamics&nbsp;365 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AiExempel;
