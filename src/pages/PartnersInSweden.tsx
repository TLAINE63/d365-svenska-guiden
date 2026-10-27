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
    text: "Swedish VAT (moms) reporting, the standard BAS chart of accounts and bank integration through Bankgirot and ISO\u00A020022 payment files. Ask how the partner has handled these in earlier projects.",
  },
  {
    title: "Local support and SLA",
    text: "Consultants who speak Swedish and English, work during Nordic business hours and have experience of cross-border rollouts. Ask who will support you after go-live and on what terms.",
  },
  {
    title: "Ecosystem and ISV add-ons",
    text: "Swedish add-ons for payroll, e-invoicing through PEPPOL, logistics and retail. Ask which add-ons the partner works with and why.",
  },
];

const SOLUTIONS = [
  {
    to: "/business-central-partners-sverige/",
    icon: Building2,
    title: "Business Central partners in Sweden",
    text: "Lean, all-in-one ERP for small and mid-sized companies and growing subsidiaries.",
  },
  {
    to: "/finance-supply-chain-partners-sverige/",
    icon: Factory,
    title: "Finance & Supply Chain Management partners",
    text: "ERP for complex enterprise environments, multi-company setups and manufacturing (formerly Finance & Operations).",
  },
  {
    to: "/dynamics-365-crm-partners-sverige/",
    icon: Users,
    title: "CRM & Sales partners in Sweden",
    text: `Sales, Customer Service, Field Service, Customer Insights and Contact Center in ${D365} (formerly Customer Engagement).`,
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
        title="Microsoft Dynamics 365 Implementation Partners in Sweden"
        titleMaxLength={72}
        description={`Find verified ${MS_D365} implementation partners in Sweden. Local Nordic expertise for Business Central, Finance & Supply Chain and CRM deployments.`}
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
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-accent">Partner directory · Sweden</span>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Find <span className="whitespace-nowrap">Microsoft Dynamics 365</span> Implementation Partners in Sweden
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
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
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

        <section className="pb-12 sm:pb-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Choosing the right implementation partner in Sweden</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              A successful ERP or CRM rollout depends heavily on an implementation partner that understands Swedish business culture, reporting standards and local industry practices. Key factors to evaluate:
            </p>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {[
                ["Implementation methodology", "A structured agile or phased rollout process adapted to Nordic organisations. Ask to see the plan from a comparable project."],
                ["Architecture and cloud migration", `Technical competence in moving on-premises systems to ${D365} in the cloud, including data migration and integrations.`],
                ["Post-go-live support and SLA", "A Swedish-speaking helpdesk combined with English-language support for international teams. Ask for the support terms in writing."],
              ].map(([t, x]) => (
                <li key={t} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
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
