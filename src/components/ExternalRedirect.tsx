import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/** Skickar besökaren vidare till en extern adress, med synlig länk som reserv. */
export default function ExternalRedirect({ to, label }: { to: string; label: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Vidare till businesscentral.se | d365.se" description="Matchningstestet för Business Central finns på businesscentral.se." canonicalPath="/businesscentral/matchningstest/" noIndex />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-2xl">
        <p className="text-foreground">
          Ni skickas vidare till <a href={to} className="text-primary underline">{label}</a>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
