import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FunnelCTA from "@/components/FunnelCTA";
import { useShortlist } from "@/contexts/ShortlistContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bookmark, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useInquiry } from "@/contexts/InquiryContext";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { track } from "@/lib/track";
import { usePartners } from "@/hooks/usePartners";
import UnderlagMatchBox from "@/components/underlag/UnderlagMatchBox";
import { setAnswer, useBuyerProfile, hasAnyAnswer } from "@/lib/buyerProfile";
import { deriveCompareFilters, questionsToTakeForward } from "@/lib/underlag";
import { trackUnderlagEvent } from "@/utils/trackUnderlagEvent";

const Shortlist = () => {
  const { items, remove, clear, count } = useShortlist();
  const { data: partners = [] } = usePartners();
  const profile = useBuyerProfile();
  const [sideBySide, setSideBySide] = useState(false);
  const navigate = useNavigate();
  const inquiry = useInquiry();
  const compare = usePartnerCompare();
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => { setPicked((prev) => (prev.length ? prev.filter((s) => items.some((i) => i.slug === s)) : items.slice(0, 3).map((i) => i.slug))); }, [items]);
  const chosen = items.filter((i) => picked.includes(i.slug));
  const togglePick = (slug: string) => setPicked((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length >= 3 ? prev : [...prev, slug]);
  const compareChosen = () => {
    compare.clear();
    chosen.forEach((c) => compare.toggle({ slug: c.slug, name: c.name }));
    navigate(`/jamfor-partners/?${new URLSearchParams(Object.fromEntries(chosen.map((c, i) => [["a", "b", "c"][i], c.slug])))}`);
  };
  const contactChosen = () => inquiry.open({ partners: chosen.map((c) => ({ slug: c.slug, name: c.name })), type: "kortlista" });
  const filters = deriveCompareFilters(profile);
  const withProfile = hasAnyAnswer(profile);
  const openSideBySide = () => {
    setSideBySide(true);
    setAnswer("assessment", "compared", true);
    trackUnderlagEvent("partners_compared", { count });
  };

  return (
    <>
      <SEOHead
        title="Min kortlista – sparade Dynamics 365-partners"
        description="Din personliga kortlista över Dynamics 365-partners. Jämför dina sparade partners, öppna profilerna och gå vidare till dialog när du är redo."
        canonicalPath="/kortlista/"
        noIndex
        breadcrumbs={[
          { name: "Hem", url: "/" },
          { name: "Min kortlista", url: "/kortlista/" },
        ]}
      />
      <Navbar />

      <main className="min-h-screen">
        <section className="container mx-auto px-4 sm:px-6 max-w-4xl py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Aktiv utvärdering
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Min kortlista</h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Här samlas de partners du sparat medan du utforskar sajten. Listan sparas lokalt i din
            webbläsare – vi kopplar den inte till dig som person.
          </p>

          {count === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <Bookmark className="mx-auto h-6 w-6 text-muted-foreground mb-3" />
              <p className="font-semibold mb-1.5">Din kortlista är tom</p>
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
              <p className="text-sm text-muted-foreground mb-3">Välj upp till tre partners att jämföra eller kontakta.</p>
              <ul className="divide-y divide-border rounded-lg border border-border bg-card">
                {items.map((item) => (
                  <li key={item.slug} className="flex items-center justify-between gap-4 p-4">
                    <Checkbox checked={picked.includes(item.slug)} onCheckedChange={() => togglePick(item.slug)} aria-label={`Välj ${item.name}`} disabled={!picked.includes(item.slug) && picked.length >= 3} />
                    <div className="min-w-0 flex-1">
                      <Link to={item.url} className="font-semibold hover:text-[hsl(var(--cta-orange))]">
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.verified ? "Partnerverifierad profil" : "Grundprofil"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { remove(item.slug); track("shortlist_remove", null, item.slug); }}
                      aria-label={`Ta bort ${item.name} från kortlistan`}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              {count >= 2 && !sideBySide && (
                <Button variant="outline" className="mt-6" onClick={openSideBySide}>
                  Jämför sida vid sida mot ert underlag
                </Button>
              )}
              {sideBySide && (
                <div className="mt-6">
                  {!withProfile && (
                    <p className="text-sm text-muted-foreground mb-3">
                      Ni har inget underlag ännu. <Link to="/underlag/" className="text-primary underline">Fyll i ert underlag</Link> för att se hur partnerna matchar.
                    </p>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const partner = partners.find((p) => p.slug === item.slug);
                      return (
                        <div key={item.slug} className="rounded-lg border border-border bg-card p-4 space-y-3 min-w-0">
                          <Link to={item.url} className="font-semibold hover:text-[hsl(var(--cta-orange))] break-words">{item.name}</Link>
                          {partner ? (
                            <UnderlagMatchBox partner={partner as any} filters={filters} />
                          ) : (
                            <p className="text-xs text-muted-foreground">Grundprofil. Uppgifterna kommer från publika sajter och bör kontrolleras.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {questionsToTakeForward(profile).length > 0 && (
                    <div className="mt-6 rounded-lg border border-border p-4">
                      <h2 className="font-semibold mb-2">Frågor inför partnerdialogen</h2>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {questionsToTakeForward(profile).map((q) => <li key={q}>{q}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button onClick={contactChosen} disabled={!chosen.length}>
                  Kontakta valda partners
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={compareChosen} disabled={chosen.length < 2}>Jämför</Button>
                <Button asChild variant="outline">
                  <Link to="/valjdynamics365partner/">Hitta rätt partner</Link>
                </Button>
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Töm kortlistan
                </button>
              </div>
            </>
          )}
        </section>

        <FunnelCTA stage="evaluation" source="/kortlista/" />
      </main>

      <Footer />
    </>
  );
};

export default Shortlist;
