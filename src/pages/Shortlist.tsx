import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FunnelCTA from "@/components/FunnelCTA";
import { useShortlist } from "@/contexts/ShortlistContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bookmark, Trash2 } from "lucide-react";

const Shortlist = () => {
  const { items, remove, clear, count } = useShortlist();

  return (
    <>
      <SEOHead
        title="Min shortlist – sparade Dynamics 365-partners"
        description="Din personliga shortlist över Dynamics 365-partners. Jämför dina sparade partners, öppna profilerna och gå vidare till dialog när du är redo."
        canonicalPath="/shortlist/"
        noIndex
        breadcrumbs={[
          { name: "Hem", url: "/" },
          { name: "Min shortlist", url: "/shortlist/" },
        ]}
      />
      <Navbar />

      <main className="min-h-screen">
        <section className="container mx-auto px-4 sm:px-6 max-w-4xl py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Aktiv utvärdering
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Min shortlist</h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Här samlas de partners du sparat medan du utforskar sajten. Listan sparas lokalt i din
            webbläsare – vi kopplar den inte till dig som person.
          </p>

          {count === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <Bookmark className="mx-auto h-6 w-6 text-muted-foreground mb-3" />
              <p className="font-semibold mb-1.5">Din shortlist är tom</p>
              <p className="text-sm text-muted-foreground mb-6">
                Spara partners från partnerlistorna, produktsidorna eller branschsidorna så dyker de upp här.
              </p>
              <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                <Link to="/jamfor-partners/">
                  Utforska partners
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-border rounded-lg border border-border bg-card">
                {items.map((item) => (
                  <li key={item.slug} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <Link to={item.url} className="font-semibold hover:text-[hsl(var(--cta-orange))]">
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.verified ? "Verifierad partner" : "Övrig partner"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      aria-label={`Ta bort ${item.name} från shortlist`}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                  <Link to="/jamfor-partners/">
                    Jämför partners
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/valjdynamics365partner/">Hitta rätt partner</Link>
                </Button>
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Töm shortlist
                </button>
              </div>
            </>
          )}
        </section>

        <FunnelCTA stage="evaluation" source="/shortlist/" />
      </main>

      <Footer />
    </>
  );
};

export default Shortlist;
