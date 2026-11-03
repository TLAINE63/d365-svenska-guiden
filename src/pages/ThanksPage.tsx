import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";
import { isThanksKind, thanksPath, type ThanksKind, type ThanksState } from "@/lib/thanksPages";

/** Standardtext när tacksidan öppnas direkt (omladdning eller länk). */
const DEFAULTS: Record<ThanksKind, { title: string; description: string }> = {
  radgivning: { title: "Tack, vi har tagit emot er förfrågan", description: "d365.se går igenom ert underlag och hör av sig. Inget har skickats till någon partner." },
  "second-opinion": { title: "Tack, vi har tagit emot er förfrågan", description: "d365.se går igenom ert underlag och hör av sig. Inget har skickats till någon partner." },
  partnermatchning: { title: "Tack, er förfrågan är skickad", description: "Ni får en bekräftelse på e-post." },
  kompetens: { title: "Tack, vi har tagit emot ert kompetensbehov", description: "Vi går igenom behovet manuellt och hör av oss." },
  "skicka-underlag": { title: "Tack, ert underlag är mottaget", description: "Vi granskar underlaget innan något skickas vidare till de partners ni valt." },
  underlag: { title: "Tack, ert underlag är skickat", description: "Underlaget har skickats till er e-postadress." },
  kontakt: { title: "Tack för din förfrågan!", description: "Vi återkommer till dig så snart som möjligt." },
};

export default function ThanksPage() {
  const { kind } = useParams();
  const location = useLocation();
  if (!isThanksKind(kind)) return <NotFound />;
  const state = (location.state || {}) as ThanksState;
  const text = { ...DEFAULTS[kind], ...(state.title ? { title: state.title } : {}), ...(state.description ? { description: state.description } : {}) };
  const back = state.back && state.back.startsWith("/") ? state.back : null;
  return (
    <>
      <SEOHead title={`${text.title} – d365.se`} description="Bekräftelse på skickat formulär via d365.se." canonicalPath={thanksPath(kind)} noIndexFollow />
      <Navbar />
      <main className="min-h-[60vh] container mx-auto max-w-2xl px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-4">{text.title}</h1>
        <p className="text-lg mb-8">{text.description}</p>
        <div className="flex flex-wrap gap-3">
          {back && <Button asChild><Link to={back}>Tillbaka till sidan</Link></Button>}
          <Button asChild variant={back ? "outline" : "default"}><Link to="/kunskapscenter/">Till kunskapscentret</Link></Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
