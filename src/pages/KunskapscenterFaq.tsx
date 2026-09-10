import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FAQSchema } from "@/components/StructuredData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_TOPICS, ALL_FAQ_ITEMS } from "@/data/faqTopics";
import { HelpCircle, ArrowRight, BookOpen } from "lucide-react";

export default function KunskapscenterFaq() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Vanliga frågor om affärssystem och partnerval"
        description="Svar på de vanligaste frågorna om affärssystem, ERP och CRM, val av Dynamics 365-partner, kostnader, licenser, tidplan och förvaltning."
        canonicalPath="/kunskapscenter/fragor-och-svar"
        keywords="vanliga frågor affärssystem, faq erp, välja partner dynamics 365, vad kostar affärssystem"
        breadcrumbs={[
          { name: "Hem", url: "/" },
          { name: "Kunskapscenter", url: "/kunskapscenter/" },
          { name: "Vanliga frågor", url: "/kunskapscenter/fragor-och-svar/" },
        ]}
      />
      <FAQSchema faqs={ALL_FAQ_ITEMS} />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" /> Vanliga frågor
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Vanliga frågor om affärssystem och partnerval
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Här samlar vi de frågor vi oftast får från företag som står inför ett byte av
            affärssystem eller CRM. Svaren är vägledande och utgår från hur svenska
            Dynamics 365-projekt brukar se ut – de ersätter inte en dialog med en partner.
          </p>
        </div>

        {/* Innehållsförteckning */}
        <nav aria-label="Innehåll" className="mb-12 rounded-lg border border-border bg-muted/40 p-5">
          <p className="text-sm font-semibold text-foreground mb-3">Innehåll</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {FAQ_TOPICS.map((topic) => (
              <li key={topic.id}>
                <a
                  href={`#${topic.id}`}
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowRight className="h-3.5 w-3.5" /> {topic.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {FAQ_TOPICS.map((topic) => (
          <section key={topic.id} id={topic.id} className="mb-12 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-2 text-foreground">{topic.title}</h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">{topic.intro}</p>
            <Accordion type="single" collapsible className="w-full">
              {topic.items.map((item, i) => (
                <AccordionItem key={item.question} value={`${topic.id}-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    <h3 className="text-base font-semibold">{item.question}</h3>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        {/* CTA */}
        <section className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Nästa steg</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Har du fått svar på dina frågor? Då är nästa steg oftast att jämföra vilka
            partners som faktiskt passar din bransch, ditt produktområde och din storlek.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/alla-d365-partners/"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Jämför Dynamics 365-partners <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/guider/"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <BookOpen className="h-4 w-4" /> Läs guiderna om partnerval
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Vill du läsa mer? Se{" "}
            <Link to="/artiklar/valja-affarssystem-och-partner/" className="text-primary hover:underline">
              Hur väljer du rätt affärssystem och rätt partner?
            </Link>{" "}
            eller{" "}
            <Link to="/kostnad/" className="text-primary hover:underline">
              pris- och kostnadsguiden
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
