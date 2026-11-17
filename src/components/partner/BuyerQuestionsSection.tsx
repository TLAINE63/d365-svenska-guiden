import { Link } from "react-router-dom";
import buyerAsks from "@/assets/journey/buyer-asks.jpg";
import advisorAnswers from "@/assets/journey/advisor-answers.jpg";
import { ArrowRight, Eye, MessageSquareText, Search } from "lucide-react";

/** Köparens verkliga frågor och varför det är värdefullt för partners. Länkar endast till befintliga sidor. */
const QUESTIONS: { q: string; help: string; links: { to: string; label: string }[] }[] = [
  {
    q: "Vad kostar ett nytt affärssystem egentligen?",
    help: "Öppna priser på licenser, kostnadsspann för projekt och kalkylatorer där köparen räknar på sin egen situation.",
    links: [
      { to: "/priser/", label: "Priser och licenser" },
      { to: "/kostnad/", label: "Vad kostar det?" },
      { to: "/implementationskalkylator/", label: "Implementationskalkylator" },
    ],
  },
  {
    q: "Vilka problem kan uppstå i ett Dynamics\u00A0365-projekt?",
    help: "Ärliga genomgångar av vad som avgör om projekt lyckas, och vilka risker köparen bör känna till.",
    links: [
      { to: "/artiklar/partnervalet-avgor-erp-crm-projekt/", label: "Partnervalet avgör projektet" },
      { to: "/artiklar/ai-i-erp-riskbild/", label: "AI i affärssystem: riskbild" },
    ],
  },
  {
    q: "Vilken Dynamics\u00A0365-lösning passar oss, och när bör vi överväga andra alternativ?",
    help: "Saklig information om CRM- och affärssystem (ERP) i Dynamics\u00A0365 och jämförelser mot andra system, även när ett annat val kan passa bättre.",
    links: [
      { to: "/crm/", label: "CRM-lösningar" },
      { to: "/affarssystem/", label: "Affärssystem (ERP)" },
      { to: "/jamfor/", label: "Jämförelser med andra system" },
    ],
  },
  {
    q: "Hur jämför vi olika Dynamics-partners?",
    help: "En guide för partnerval, neutral partnersökning och jämförelse av profiler sida vid sida.",
    links: [
      { to: "/guider/valja-dynamics-365-partner/", label: "Guide: välja partner" },
      { to: "/valjdynamics365partner/", label: "Partnersökning" },
      { to: "/jamfor-partners/", label: "Jämför partners" },
    ],
  },
  {
    q: "Hur vet vi om vi är redo att starta ett projekt?",
    help: "Verktyg som hjälper köparen att bedöma sin beslutsmognad och vilket nästa steg som är rimligt.",
    links: [
      { to: "/beslutsmognad/", label: "Beslutsmognad" },
      { to: "/kom-igang/", label: "Kom igång: behovsguide" },
    ],
  },
];

const BENEFITS = [
  { icon: Search, title: "Ni kan bli upptäckta tidigare", text: "Köpare som ännu inte vet vilka partners som finns kan hitta er när de undersöker produkter, branscher och kostnader." },
  { icon: Eye, title: "Köparen lär känna er kompetens före första mötet", text: "Era egna beskrivningar av kunder, projekt och experter hjälper köparen att förstå när ni passar." },
  { icon: MessageSquareText, title: "Dialogen kan bli mer konkret", text: "När kunden väl tar kontakt har den ofta redan ett underlag, vilket kan göra första samtalet mer relevant för båda parter." },
];

export default function BuyerQuestionsSection() {
  return (
    <section id="kopares-fragor" aria-labelledby="kopares-fragor-rubrik" className="py-14 md:py-20 scroll-mt-64">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl lg:max-w-none mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">Så arbetar d365.se</p>
          <h2 id="kopares-fragor-rubrik" className="text-2xl md:text-4xl lg:text-[2rem] xl:text-4xl lg:whitespace-nowrap font-bold text-foreground mb-5 leading-tight">
            Vi svarar på frågorna innan kunden vill prata med en säljare
          </h2>
          <div className="space-y-3 text-base md:text-lg text-muted-foreground">
            <p>Vi utgår från köparens verkliga frågor och försöker ge tydliga, användbara och ärliga svar.</p>
            <p>Det gäller också frågor om kostnader, risker, nackdelar eller situationer där Dynamics&nbsp;365 kanske inte är rätt lösning.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 mb-12 max-w-4xl">
          {[
            { img: buyerAsks, alt: "Ekonomichef ställer en fråga om ett nytt affärssystem", label: "Köparen frågar", quote: "Vad kostar det egentligen, och vad kan gå fel?" },
            { img: advisorAnswers, alt: "Rådgivare från d365.se svarar lugnt och sakligt", label: "Vi svarar", quote: "Öppet och sakligt, även när svaret är obekvämt." },
          ].map((f) => (
            <figure key={f.label} className="rounded-xl overflow-hidden border border-border bg-card">
              <img src={f.img} alt={f.alt} width={1024} height={1024} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover object-top" />
              <figcaption className="p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">{f.label}</span>
                <p className="mt-1 text-foreground font-medium">”{f.quote}”</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {QUESTIONS.map((item, i) => (
            <li key={item.q} className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">Köparfråga {i + 1}</span>
              <h3 className="text-lg font-semibold text-foreground mb-2">”{item.q}”</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.help}</p>
              <ul className="mt-auto space-y-1.5 text-sm">
                {item.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                      {l.label}<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-border bg-secondary/40 p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">Varför är detta värdefullt för er som partner?</h2>
          <div className="max-w-3xl lg:max-w-none space-y-2 text-muted-foreground mb-8">
            <p>Kunden har ofta redan jämfört lösningar och partners innan den hör av sig, så er kompetens behöver synas under researchen.</p>
            <p>På d365.se kan köparen upptäcka och jämföra partners utan att först boka ett säljmöte.</p>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <li key={b.title} className="rounded-xl bg-card border border-border p-5">
                <b.icon className="w-6 h-6 text-accent mb-3" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground max-w-3xl">
            Det här är möjligheter, inte garanterade resultat. d365.se säljer inga besöksuppgifter, och betald partnerstatus påverkar aldrig relevansordningen.
          </p>
        </div>
      </div>
    </section>
  );
}
