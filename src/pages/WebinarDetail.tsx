import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CalendarDays, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WebinarRegistrationForm from "@/components/WebinarRegistrationForm";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { useWebinar } from "@/hooks/useWebinars";
import { formatWebinarDate, webinarEndsAt, webinarSchema, type PublicWebinar } from "@/lib/webinars";

export default function WebinarDetail({ initialWebinar = null }: { initialWebinar?: PublicWebinar | null }) {
  const { slug } = useParams();
  const { data: webinar, isLoading } = useWebinar(slug, initialWebinar);
  if (!webinar && isLoading && !initialWebinar) return <><Navbar /><main className="min-h-screen pt-32 text-center text-muted-foreground">Laddar webinar…</main><Footer /></>;
  if (!webinar) return <Navigate to="/webinar/" replace />;
  const ended = webinarEndsAt(webinar).getTime() <= Date.now() || webinar.status === "genomford";
  const canonicalPath = `/webinar/${webinar.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`${webinar.title} | Webinar`} description={webinar.description} canonicalPath={canonicalPath} ogType="event" />
      <BreadcrumbSchema items={[{ name: "Hem", url: "https://d365.se/" }, { name: "Webinar", url: "https://d365.se/webinar/" }, { name: webinar.title, url: `https://d365.se${canonicalPath}/` }]} />
      <Helmet><script type="application/ld+json">{JSON.stringify(webinarSchema(webinar))}</script></Helmet>
      <Navbar />
      <main className="pt-16 lg:pt-24">
        <section className="py-10 sm:py-14 bg-secondary/30 border-b border-border">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <Link to="/webinar/" className="text-sm text-primary hover:underline">← Alla webinar</Link>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground mt-5 mb-5">{webinar.title}</h1>
            <div className="flex flex-wrap gap-5 text-muted-foreground">
              <span className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" />{formatWebinarDate(webinar)}</span>
              {webinar.speakers && <span className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />{webinar.speakers}</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-3">Webinar, {webinar.duration_min} minuter, kostnadsfritt</p>
          </div>
        </section>
        <section className="py-10">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            {webinar.status === "installd" ? (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-xl font-bold mb-3">Webinaret är inställt</h2>
                <p className="text-muted-foreground mb-5">Detta webinar genomförs inte.</p>
                <Button asChild variant="outline"><Link to="/webinar/">Se andra webinar</Link></Button>
              </div>
            ) : ended ? (
              <div className="rounded-lg border border-border bg-card p-6">
                {webinar.recording_url ? (
                  <>
                    <h2 className="text-2xl font-bold mb-3">Se webinaret i efterhand</h2>
                    <p className="text-muted-foreground mb-5">Inspelningen är publicerad och öppnas i en ny flik.</p>
                    <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-[hsl(var(--primary-foreground))]"><a href={webinar.recording_url} target="_blank" rel="noopener noreferrer">Se inspelningen</a></Button>
                  </>
                ) : <h2 className="text-xl font-bold">Webinaret är genomfört.</h2>}
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Om webinaret</h2>
                  <p className="text-lg text-muted-foreground mb-5">{webinar.description}</p>
                  {webinar.body && <div className="text-foreground whitespace-pre-line leading-relaxed">{webinar.body}</div>}
                </div>
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h2 className="text-2xl font-bold mb-5">Anmäl dig</h2>
                  <WebinarRegistrationForm webinar={webinar} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
