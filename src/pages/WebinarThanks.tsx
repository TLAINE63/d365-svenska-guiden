import { useLocation, useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useWebinar } from "@/hooks/useWebinars";
import { downloadPublicWebinarIcs, type PublicWebinar } from "@/lib/webinars";

export default function WebinarThanks({ initialWebinar = null }: { initialWebinar?: PublicWebinar | null }) {
  const { slug } = useParams();
  const location = useLocation();
  const { data: webinar } = useWebinar(slug, initialWebinar);
  let storedEmail = "";
  try { storedEmail = window.sessionStorage.getItem("d365_webinar_email") || ""; } catch { /* no storage */ }
  const email = (location.state as { email?: string } | null)?.email || storedEmail;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Du är anmäld till webinaret" description="Bekräftelse på din webinaranmälan." canonicalPath={`/tack/webinar/${slug}`} noIndexFollow />
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-5">Du är anmäld.</h1>
          <p className="text-lg text-muted-foreground mb-8">Vi har skickat en bekräftelse till {email || "din e-postadress"}.</p>
          {webinar && <Button onClick={() => downloadPublicWebinarIcs(webinar)} className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-[hsl(var(--primary-foreground))]">Lägg till i kalendern</Button>}
          <p className="mt-8"><Link to={`/webinar/${slug}/`} className="text-primary hover:underline">Tillbaka till webinaret</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
