import { Link } from "react-router-dom";
import { ArrowRight, Building2, Factory, Users, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { IDENTIFIED_PARTNER_COUNT, VERIFIED_PARTNER_COUNT } from "@/data/partnerCounts";
import { pageReviewDate } from "@/data/pageReviewDates";

const PATH = "/dynamics-365-partners-in-sweden/";
const D365 = "Dynamics\u00A0365";
const MS_D365 = "Microsoft\u00A0Dynamics\u00A0365";

const REASONS = [
  {
    title: "Swedish localisation and compliance",
    text: "Swedish accounting rules, VAT reporting and bank formats such as Bankgirot and ISO\u00A020022 payment files. Ask how the partner has handled these in earlier projects.",
  },
  {
    title: "Local support and SLA",
    text: "Consultants who speak Swedish and English and who work during Nordic business hours. Ask who will support you after go-live and on what terms.",
  },
  {
    title: "Ecosystem and ISV add-ons",
    text: "Add-ons for Swedish payroll, e-invoicing through PEPPOL and integrations with local logistics and banking services. Ask which add-ons the partner works with and why.",
  },
];

const SOLUTIONS = [
  {
    to: "/business-central-partners-sverige/",
    icon: Building2,
    title: "Business Central partners in Sweden",
    text: `ERP for small and mid-sized companies on ${MS_D365} Business Central.`,
  },
  {
    to: "/finance-supply-chain-partners-sverige/",
    icon: Factory,
    title: "Finance & Supply Chain Management partners",
    text: "ERP for larger and international organisations with complex finance, production or logistics.",
  },
  {
    to: "/dynamics-365-crm-partners-sverige/",
    icon: Users,
    title: "CRM & Sales partners in Sweden",
    text: `Sales, Customer Service, Field Service, Customer Insights and Contact Center in ${D365}.`,
  },
  {
    to: "/dynamics-365-ai-copilot-partners-sverige/",
    icon: Sparkles,
    title: "AI & Copilot partners in Sweden",
    text: `Copilot and AI agents in ${D365} and Copilot Studio.`,
  },
];

export default function PartnersInSweden() {
  const reviewed = pageReviewDate(PATH);

  return (
    <div className="min-h-screen bg-background" lang="en">
      <SEOHead
        language="en"
        title="Microsoft Dynamics 365 Partners in Sweden – Directory 2026"
        titleMaxLength={62}
        description={`Looking for a ${MS_D365} partner in Sweden? Compare verified Swedish implementation partners for Business Central, F&SCM and CRM.`}
        canonicalPath={PATH}
        breadcrumbs={[
          { name: "d365.se", url: "/" },
          { name: "Partners in Sweden", url: PATH },
        ]}
        dateModified={reviewed}
      />
      <Navbar />

      <main className="pt-24 lg:pt-32">
        <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-accent">Partner directory · Sweden</span>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Find a <span className="whitespace-nowrap">Microsoft Dynamics 365</span> Partner in Sweden
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Are you expanding into the Swedish market or looking for local expertise for your {MS_D365} implementation?
              d365.se is a Swedish, buyer-side guide to {D365}, with a directory of {IDENTIFIED_PARTNER_COUNT} identified
              partners in Sweden, of which {VERIFIED_PARTNER_COUNT} have verified profiles.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] text-primary-foreground hover:bg-[hsl(var(--cta-orange-hover))]">
                <Link to="/alla-d365-partners/">
                  Browse all partners <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/kontakt/">Ask d365.se for advice</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Why you need a local Swedish implementation partner</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {D365} is a global product, but a successful implementation in Sweden depends on local requirements. These are the areas to check with any partner.
            </p>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {REASONS.map((r, i) => (
                <li key={r.title} className="rounded-xl border border-border bg-card p-6">
                  <span className="text-sm font-bold text-accent">{i + 1}</span>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Explore partners by solution</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              The partner lists and profiles are written in Swedish. Partner names, products, industries and locations are easy to compare, and you can ask each partner about English-speaking consultants.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SOLUTIONS.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <s.icon className="mt-0.5 h-6 w-6 shrink-0 text-accent" aria-hidden />
                  <span>
                    <span className="flex items-center gap-1.5 font-semibold text-foreground group-hover:text-primary">
                      {s.title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{s.text}</span>
                    <span className="mt-2 block text-xs text-muted-foreground">In Swedish</span>
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Looking for industry experience? See <Link to="/partners-per-bransch/" className="font-semibold text-primary hover:underline">partners by industry</Link> (in Swedish).
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Find the right partner for your project</h2>
            <p className="mt-3 text-muted-foreground">
              Browse the full directory of partners, or get in touch with d365.se for a buyer-side recommendation.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] text-primary-foreground hover:bg-[hsl(var(--cta-orange-hover))]">
                <Link to="/alla-d365-partners/">
                  Browse all partners <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/kontakt/">Contact d365.se</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-8">
          <div className="container mx-auto max-w-3xl px-4 text-center text-sm text-muted-foreground sm:px-6">
            <p>
              How d365.se works: d365.se continuously maps relevant {D365} partners in the Swedish market. Partners without a profile agreement are shown with a basic profile compiled from public sources, while partners with a profile agreement can review and complete their own profile. Which partners match a company depends on relevance and needs. Ownership and interests are disclosed on{" "}
              <Link to="/agande-och-intressen/" className="font-semibold text-primary hover:underline">our transparency page</Link> (in Swedish).
              {reviewed && <> Last reviewed {reviewed}.</>}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
