import { PARTNER_EDITORIAL_FAQ } from "@/data/partnerEditorialFaq";
import { FAQSchema } from "@/components/StructuredData";
import AdvisorCtaCard from "@/components/advisory/AdvisorCtaCard";

/** Redaktionella frågor och svar + rådgivningsruta för utvalda partnerprofiler. */
export default function PartnerEditorialFaqSection({ partnerSlug }: { partnerSlug: string }) {
  const data = PARTNER_EDITORIAL_FAQ[partnerSlug];
  if (!data) return null;
  return (
    <>
      <FAQSchema faqs={data.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <section className="py-8" aria-labelledby="partner-faq">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h2 id="partner-faq" className="text-xl md:text-2xl font-bold text-foreground mb-1">{data.heading}</h2>
          <p className="text-xs text-muted-foreground mb-5">Sammanställt av d365.se-redaktionen utifrån partnerns egna uppgifter.</p>
          <div className="space-y-4">
            {data.faqs.map((f) => (
              <div key={f.q} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AdvisorCtaCard
        id="partner-radgivning"
        heading={data.advisory.heading}
        text={data.advisory.text}
        bookingLabel="Boka 20 min rådgivning"
        link={{ to: "/valjdynamics365partner/", label: "Jämför partners för bygg och entreprenad" }}
      />
    </>
  );
}
