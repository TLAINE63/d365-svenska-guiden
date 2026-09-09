import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import GuideSeriesNavigation from "@/components/guides/GuideSeriesNavigation";
import GuideCardsGrid from "@/components/guides/GuideCardsGrid";
import GuideCTA from "@/components/guides/GuideCTA";
import RelatedGuides from "@/components/guides/RelatedGuides";
import NextGuideRecommendation from "@/components/guides/NextGuideRecommendation";
import StickyPartnerCTA from "@/components/guides/StickyPartnerCTA";
import {
  PARTNER_GUIDES,
  PartnerGuideKey,
  getGuide,
  guidePartnerListUrl,
  guidePath,
} from "@/data/partnerGuides";
import { GUIDE_CONTENT, GuideBlock } from "@/data/partnerGuideContent";

interface Props {
  guideKey: PartnerGuideKey;
}

const BASE = "https://d365.se";

const renderBlock = (block: GuideBlock, i: number) => {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="text-xl sm:text-2xl font-bold tracking-tight mt-10 mb-3">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="text-lg font-semibold mt-7 mb-2">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul key={i} className="my-4 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={i} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {block.head.map((h) => (
                  <th key={h} className="py-2 pr-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-border/60 align-top">
                  {row.map((cell, c) => (
                    <td key={c} className="py-2 pr-4 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return (
        <p key={i} className="my-4 text-[15px] leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
  }
};

const PartnerGuidePage = ({ guideKey }: Props) => {
  const guide = getGuide(guideKey);
  const content = GUIDE_CONTENT[guide.slug];
  const path = guidePath(guide);
  const partnerListUrl = guidePartnerListUrl(guide);

  const blocks = content.blocks;
  const firstH2 = blocks.findIndex((b) => b.type === "h2");
  const introBlocks = firstH2 === -1 ? blocks : blocks.slice(0, firstH2);
  const bodyBlocks = firstH2 === -1 ? [] : blocks.slice(firstH2);

  // CTA 2 placeras före den h2-rubrik som ligger närmast mitten av guiden.
  const h2Indexes = bodyBlocks
    .map((b, i) => (b.type === "h2" ? i : -1))
    .filter((i) => i > 0);
  const midCtaIndex = h2Indexes.length
    ? h2Indexes[Math.floor(h2Indexes.length / 2)]
    : -1;

  const breadcrumbs = [
    { name: "Start", url: "/" },
    { name: "Guider", url: "/guider/" },
    ...(guideKey === "hub"
      ? [{ name: "Välja Dynamics 365-partner", url: path }]
      : [
          { name: "Välja Dynamics 365-partner", url: "/guider/valja-dynamics-365-partner/" },
          { name: guide.shortLabel, url: path },
        ]),
  ];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.h1,
    description: guide.seoDescription,
    inLanguage: "sv-SE",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}${path}` },
    author: { "@type": "Organization", name: "d365.se", url: BASE },
    publisher: { "@type": "Organization", name: "d365.se", url: BASE },
    isPartOf: { "@type": "CreativeWorkSeries", name: "Välja Dynamics 365-partner" },
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Välja Dynamics 365-partner – guideserie",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: PARTNER_GUIDES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.cardTitle,
      url: `${BASE}${guidePath(g)}`,
    })),
  };

  const faqLd = guide.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <SEOHead
        title={guide.seoTitle}
        description={guide.seoDescription}
        canonicalPath={path}
        ogType="article"
        articleSection="Partnerval"
        breadcrumbs={breadcrumbs}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        {faqLd && <script type="application/ld+json">{JSON.stringify(faqLd)}</script>}
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16">
        <article className="container mx-auto max-w-3xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
          <GuideSeriesNavigation current={guide.key} className="mb-6" />

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-6">
            {content.h1}
          </h1>

          {introBlocks.map(renderBlock)}

          {guideKey === "hub" && <GuideCardsGrid />}

          <GuideCTA
            heading="Jämför Dynamics 365-partners"
            text="Filtrera svenska Dynamics 365-partners utifrån produktområde, bransch och företagsstorlek."
            buttonLabel="Jämför partners"
            to={partnerListUrl}
            source={`${path}#cta-intro`}
          />

          {bodyBlocks.map((block, i) => (
            <div key={i}>
              {i === midCtaIndex && (
                <GuideCTA
                  heading={guide.midCtaLabel}
                  text="Se vilka svenska partners som arbetar med det här området – filtrerat på bransch och storlek."
                  buttonLabel={guide.midCtaLabel}
                  to={partnerListUrl}
                  source={`${path}#cta-mid`}
                />
              )}
              {renderBlock(block, i)}
            </div>
          ))}

          <GuideCTA
            variant="final"
            heading="Redo att börja jämföra partners?"
            text="Använd d365.se för att identifiera relevanta Dynamics 365-partners och skapa en kortlista innan du börjar boka möten."
            buttonLabel="Jämför Dynamics 365-partners"
            to={partnerListUrl}
            source={`${path}#cta-final`}
          />

          <NextGuideRecommendation current={guide.key} />

          <RelatedGuides current={guide.key} className="mt-10" />

          <section className="mt-10 border-t border-border pt-8" aria-label="Om d365.se">
            <h2 className="text-lg font-bold mb-2">Om d365.se</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{content.about}</p>
          </section>
        </article>
      </main>

      <StickyPartnerCTA to={partnerListUrl} source={path} />
      <Footer />
    </>
  );
};

export default PartnerGuidePage;
