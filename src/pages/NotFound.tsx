import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

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
  }, [location.pathname]);



  return (
    <>
      <SEOHead
        title="Sidan hittades inte"
        description="Sidan du söker finns inte. Hitta rätt bland våra guider för Microsoft Dynamics 365. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
        noIndex={true}
      />
      <Navbar />
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
          <p className="mb-2 text-xl text-foreground">Sidan hittades inte</p>
          <p className="mb-6 text-muted-foreground">
            Sidan du söker kan ha flyttats eller tagits bort.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Till startsidan
            </Link>
            <Link
              to="/valjdynamics365partner/"
              className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-foreground hover:bg-accent transition-colors"
            >
              Hitta partner
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
