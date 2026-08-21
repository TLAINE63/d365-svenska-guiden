import { AlertTriangle, EyeOff, Wallet, ShieldCheck } from "lucide-react";
import { buyerManuals } from "@/data/buyerManuals";

interface BuyerManualProps {
  /** Produktnyckel som matchar buyerManuals (t.ex. "sales", "business-central"). */
  product: keyof typeof buyerManuals;
  /** Valfri rubrik – default "Köparmanual". */
  heading?: string;
  /** Valfri underrubrik som ersätter intro från data. */
  subheading?: string;
}

const blocks = [
  {
    key: "notFit" as const,
    icon: AlertTriangle,
    title: "När passar det inte?",
    description: "Scenarier där den här produkten är fel verktyg – eller fel tidpunkt.",
  },
  {
    key: "underestimated" as const,
    icon: EyeOff,
    title: "Vad underskattas?",
    description: "Områden som regelmässigt blir större och dyrare än man tror.",
  },
  {
    key: "realCost" as const,
    icon: Wallet,
    title: "Vad kostar egentligen?",
    description: "Totalkostnaden – utöver listpriset i broschyren.",
  },
  {
    key: "partnerProof" as const,
    icon: ShieldCheck,
    title: "Vad ska partnern bevisa?",
    description: "Krav att ställa på partnern innan du skriver på.",
  },
];

const BuyerManual = ({ product, heading = "Köparmanual", subheading }: BuyerManualProps) => {
  const content = buyerManuals[product];
  if (!content) return null;

  const intro = subheading ?? content.intro;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            På köparens sida
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {heading}
          </h2>
          {intro && (
            <p className="text-base sm:text-lg text-muted-foreground">{intro}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {blocks.map(({ key, icon: Icon, title, description }) => (
            <article
              key={key}
              className="rounded border border-border bg-card p-5 sm:p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {description}
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm sm:text-base text-card-foreground/90 list-disc pl-5">
                {content[key].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuyerManual;
