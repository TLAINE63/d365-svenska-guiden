import { Link } from "react-router-dom";
import { CalendarDays, PlayCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NewsletterSignup from "@/components/NewsletterSignup";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWebinars } from "@/hooks/useWebinars";
import { formatWebinarDate, type PublicWebinar } from "@/lib/webinars";

export default function Webinars({ initialWebinars = null }: { initialWebinars?: PublicWebinar[] | null }) {
  const { data: webinars = [], isLoading } = useWebinars(initialWebinars);
  const now = Date.now();
  const upcoming = webinars.filter((item) => item.status === "publicerad" && new Date(item.starts_at).getTime() > now);
  const recordings = webinars.filter((item) => item.recording_url && (item.status === "genomford" || new Date(item.starts_at).getTime() <= now));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Webinar om Dynamics 365" description="Anmäl dig till kostnadsfria webinar om Dynamics 365 eller se inspelningar i efterhand på d365.se." canonicalPath="/webinar" />
      <BreadcrumbSchema items={[{ name: "Hem", url: "https://d365.se/" }, { name: "Webinar", url: "https://d365.se/webinar/" }]} />
      <Navbar />
      <main className="pt-16 lg:pt-24">
        <section className="py-10 sm:py-14 border-b border-border bg-secondary/30">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-semibold text-primary mb-3">d365.se webinar</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-5">Lär dig mer om Dynamics{"\u00A0"}365, live eller i efterhand</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">Praktiska genomgångar om partnerval, pris, migrering, CRM- och affärssystem (ERP) samt AI.</p>
          </div>
        </section>
        <section className="py-10">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-6">Kommande webinar</h2>
            {isLoading && !initialWebinars ? <p className="text-muted-foreground">Laddar webinar…</p> : upcoming.length === 0 ? (
              <p className="text-muted-foreground mb-10">Inga kommande webinar är publicerade just nu. Anmäl dig till nyhetsbrevet så får du nästa inbjudan.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-5 mb-12">
                {upcoming.map((webinar) => (
                  <Card key={webinar.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-primary mb-2"><CalendarDays className="h-4 w-4" />{formatWebinarDate(webinar)}</div>
                      <CardTitle><Link to={`/webinar/${webinar.slug}/`} className="hover:text-primary">{webinar.title}</Link></CardTitle>
                      <CardDescription>{webinar.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Webinar, {webinar.duration_min} minuter, kostnadsfritt{webinar.speakers ? ` · ${webinar.speakers}` : ""}</p>
                      <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-[hsl(var(--primary-foreground))]"><Link to={`/webinar/${webinar.slug}/`}>Anmäl dig</Link></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {recordings.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Se i efterhand</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {recordings.map((webinar) => (
                    <Card key={webinar.id}>
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-primary mb-2"><PlayCircle className="h-4 w-4" />Inspelat webinar</div>
                        <CardTitle><Link to={`/webinar/${webinar.slug}/`} className="hover:text-primary">{webinar.title}</Link></CardTitle>
                        <CardDescription>{webinar.description}</CardDescription>
                      </CardHeader>
                      <CardContent><Button asChild variant="outline"><Link to={`/webinar/${webinar.slug}/`}>Se inspelningen</Link></Button></CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
            <NewsletterSignup />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
