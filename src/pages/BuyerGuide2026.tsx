import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FunnelCTA from "@/components/FunnelCTA";
import GatedPdfDownload from "@/components/GatedPdfDownload";
import { BUYER_GUIDES } from "@/data/buyerGuides2026";
import { generateBuyerGuidePdf } from "@/utils/generateBuyerGuidePdf";
import { Check } from "lucide-react";

interface Props {
  variant: "erp" | "crm";
}

const BuyerGuide2026 = ({ variant }: Props) => {
  const guide = BUYER_GUIDES[variant];
  const path = `/${guide.slug}/`;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SEOHead
        title={guide.seoTitle}
        description={guide.seoDescription}
        canonicalPath={path}
        breadcrumbs={[
          { name: "Hem", url: "/" },
          { name: "Kunskapscenter", url: "/kunskapscenter/" },
          { name: guide.title, url: path },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <Navbar />

      <main className="min-h-screen">
        <section className="bg-[hsl(var(--hero-dark))] pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-4">
              Tidig köpfas · Köparguide
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
              {guide.title}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-6">{guide.hero}</p>
            <p className="text-base text-white/70 leading-relaxed">{guide.intro}</p>
            <p className="mt-6 text-sm text-white/60">Omfattning: {guide.scope}</p>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 max-w-4xl py-12 sm:py-16">
          <h2 className="text-xl font-bold mb-4">Det här får du ut av guiden</h2>
          <ul className="grid sm:grid-cols-2 gap-3 mb-12">
            {guide.benefits.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {guide.sections.map((section) => (
            <article key={section.heading} className="mb-10">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">{section.heading}</h2>
              {section.intro && (
                <p className="text-muted-foreground leading-relaxed mb-4">{section.intro}</p>
              )}
              <ul className="space-y-2.5">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <div className="my-12">
            <GatedPdfDownload
              documentName={guide.title}
              title={`Ladda ner ${guide.title} som PDF`}
              intro="Hela guiden i ett dokument du kan dela internt med ledning, ekonomi och IT inför beslutet."
              benefits={guide.benefits}
              sourceType={`buyer_guide_${guide.key}`}
              onDeliver={() => generateBuyerGuidePdf(guide)}
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">Vanliga frågor</h2>
          <div className="space-y-6 mb-12">
            {guide.faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold mb-1.5">{f.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {guide.nextStep}{" "}
            <Link to="/kostnad/" className="underline underline-offset-4 hover:text-foreground">
              Se kostnadsguiden
            </Link>{" "}
            för aktuella pris- och kostnadsspann.
          </p>
        </section>

        <FunnelCTA stage="early" guide={variant} source={path} />
      </main>

      <Footer />
    </>
  );
};

export default BuyerGuide2026;
