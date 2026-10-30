import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { resolveD365GuidePath } from "@/lib/d365guidePaths";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { deadEndMeta, NOT_FOUND_STEPS } from "@/lib/nextSteps";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const viewed = useRef(false);
  // Besökare från d365guide.com:s språkväljare landar på engelska/norska/
  // danska/finska adresser; led dem till motsvarande svenska sida.
  const guideTarget = resolveD365GuidePath(location.pathname);
  const redirectTo =
    guideTarget && guideTarget.replace(/\/+$/, "") !== location.pathname.replace(/\/+$/, "")
      ? guideTarget
      : null;

  useEffect(() => {
    if (redirectTo) return;
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    if (!viewed.current) {
      viewed.current = true;
      trackFunnelEvent({ event_type: "cta_view", event_name: "dead_end_next_step_viewed", page_path: location.pathname, metadata: deadEndMeta("not_found", location.pathname, "not_found_options") });
    }

    // Logga 404:an så att gamla/trasiga URL:er kan följas upp i admin.
    try {
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-404`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          path: location.pathname,
          full_url: typeof window !== "undefined" ? window.location.href : null,
          referrer: typeof document !== "undefined" ? document.referrer || null : null,
          session_id:
            typeof sessionStorage !== "undefined"
              ? sessionStorage.getItem("visitor_session_id")
              : null,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* tracking får aldrig krascha sidan */
    }

    // SPA-fallback: värden levererar startsidans prerenderade HTML för okända
    // URL:er. Ta bort kvarvarande SEO-taggar (canonical/og/JSON-LD) som annars
    // får sökmotorer att tolka 404-sidan som startsidan (soft 404).
    const stale = document.querySelectorAll(
      'link[rel="canonical"]:not([data-rh]), meta[property^="og:"]:not([data-rh]), meta[name^="twitter:"]:not([data-rh]), script[type="application/ld+json"]:not([data-rh])'
    );
    stale.forEach((el) => el.parentElement?.removeChild(el));
  }, [location.pathname, redirectTo]);

  if (redirectTo) {
    return <Navigate to={`${redirectTo}${location.search}${location.hash}`} replace />;
  }

  const go = (type: string, destination: string) =>
    trackFunnelEvent({ event_type: "cta_click", event_name: "dead_end_next_step_clicked", page_path: location.pathname, metadata: deadEndMeta("not_found", location.pathname, type, destination) });

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    go("search", "/fraga/");
    navigate(q ? `/fraga/?q=${encodeURIComponent(q)}` : "/fraga/");
  };

  return (
    <>
      <SEOHead
        title="Sidan hittades inte"
        description="Sidan du söker finns inte. Hitta rätt bland våra guider, jämförelser och partnerlistor för Microsoft Dynamics 365."
        noIndex={true}
      />
      <Navbar />
      <main className="bg-background">
        <div className="container mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6" data-next-step-block="" data-source-template="not_found">
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Sidan hittades inte</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Sidan kan ha flyttats eller tagits bort. Välj det som ligger närmast det ni letar efter, eller sök.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {NOT_FOUND_STEPS.map((s) => (
              <li key={s.to}>
                <Link
                  to={s.to}
                  onClick={() => go(s.type, s.to)}
                  className="group flex h-full flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="font-semibold text-foreground group-hover:text-primary">{nowrapBrand(s.label)} <ArrowRight className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" /></span>
                  <span className="text-sm text-muted-foreground">{nowrapBrand(s.text)}</span>
                </Link>
              </li>
            ))}
          </ul>

          <form onSubmit={search} className="mt-8 flex max-w-xl gap-2" role="search">
            <label htmlFor="notfound-search" className="sr-only">Sök på d365.se</label>
            <input
              id="notfound-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök, till exempel Business Central-partner eller kostnad"
              className="h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Search className="h-4 w-4" aria-hidden="true" /> Sök
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link to="/" onClick={() => go("home", "/")} className="text-primary hover:underline">Till startsidan</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
