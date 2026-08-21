import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, Users, Database, GitBranch, BarChart3, Workflow, Building2 } from "lucide-react";

export interface StandardSectionsData {
  buyerNeeds: string[];
  whatItSolves: string[];
  partnerMatters: {
    processDesign: string;
    integrations: string;
    dataModel: string;
    reporting: string;
    changeManagement: string;
    industryKnowledge: string;
  };
  pitfalls: string[];
}

const PARTNER_AREAS = [
  { key: "processDesign", label: "Processdesign", Icon: Workflow },
  { key: "integrations", label: "Integrationer", Icon: GitBranch },
  { key: "dataModel", label: "Datamodell", Icon: Database },
  { key: "reporting", label: "Rapportering", Icon: BarChart3 },
  { key: "changeManagement", label: "Förändringsledning", Icon: Users },
  { key: "industryKnowledge", label: "Branschkunskap", Icon: Building2 },
] as const;

interface Props {
  productName: string;
  data: StandardSectionsData;
}

export default function StandardProductSections({ productName, data }: Props) {
  return (
    <>
      {/* 2. Känner du igen dig? */}
      <section className="py-6 sm:py-7 md:py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            Känner du igen dig?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-3xl">
            Situationer där svenska bolag brukar börja utvärdera {productName}.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {data.buyerNeeds.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded border border-border bg-card"
              >
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm md:text-[15px] text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Vad Dynamics 365 löser */}
      <section className="py-6 sm:py-7 md:py-8 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            Vad Microsoft Dynamics 365 löser
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-3xl">
            Sakligt – utan Microsofts marknadsföringsord.
          </p>
          <ul className="space-y-2.5">
            {data.whatItSolves.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="text-sm md:text-[15px] text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Var partnern avgör */}
      <section className="py-6 sm:py-7 md:py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            Var partnern avgör
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-3xl">
            Microsoft levererar plattformen. Partnern avgör om implementationen faktiskt fungerar i er verksamhet.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PARTNER_AREAS.map(({ key, label, Icon }) => (
              <div key={key} className="p-4 rounded border border-border bg-card">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">{label}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.partnerMatters[key as keyof typeof data.partnerMatters]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Vanliga fallgropar */}
      <section className="py-6 sm:py-7 md:py-8 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            Vanliga fallgropar
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-3xl">
            Det vi ser oftast i utvärderingar som inte landar väl.
          </p>
          <ul className="space-y-2.5">
            {data.pitfalls.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded border border-border bg-card"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm md:text-[15px] text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Rekommenderat nästa steg */}
      <section className="py-6 sm:py-7 md:py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            Rekommenderat nästa steg
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-3xl">
            Tre konkreta steg som gör beslutsunderlaget skarpare innan partnerdialogen börjar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                title: "1. Gör en behovsanalys",
                body: "Ringa in vad du faktiskt behöver – innan du jämför produkter.",
                href: "/behovsanalys/",
                cta: "Skapa en behovsanalys",
              },
              {
                title: "2. Skapa en kravspec",
                body: "Gör offerter och partnerförslag jämförbara på rätt grunder.",
                href: "/kravspecifikation/",
                cta: "Generera en kravspecifikation",
              },
              {
                title: "3. Hitta rätt partner",
                body: "Utgå från din bransch och dina processer – inte från vilken partner som syns mest.",
                href: "/branscher/",
                cta: "Hitta partner",
              },
            ].map((step) => (
              <div
                key={step.href}
                className="flex flex-col p-4 rounded border border-border bg-card"
              >
                <h3 className="font-semibold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{step.body}</p>
                <Link
                  to={step.href}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded font-semibold text-sm text-white bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] transition-colors"
                >
                  {step.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
