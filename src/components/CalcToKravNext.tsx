import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuyerProfile } from "@/lib/buyerProfile";
import { calcToKravLink, trackCalcToKrav, type CalcKravInput } from "@/lib/calcToKrav";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import { ADVISORY_CTA } from "@/lib/advisory";

type Props = Omit<CalcKravInput, "profileHasIndustry"> & {
  /** Övriga, sekundära vägar (t.ex. matchningstest eller partnerlista). */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Nästa steg efter en kostnadskalkyl: kravspecifikationen för rätt produktområde,
 * förifylld med det besökaren redan angett. Allt går att ändra i kravspecen.
 */
export default function CalcToKravNext({ children, className = "", ...input }: Props) {
  const profile = useBuyerProfile();
  const profileHasIndustry = typeof profile.company?.industry === "string" && !!profile.company.industry;
  const link = calcToKravLink({ ...input, profileHasIndustry });

  const carried = [
    link.industry ? `Bransch: ${link.industry}` : link.industryFromProfile ? "Bransch från dina tidigare val" : null,
    link.size ? `${link.size} användare` : null,
    link.areas.length ? `${link.areas.length} funktionsområden förmarkerade` : null,
  ].filter(Boolean) as string[];

  return (
    <div className={`rounded-xl border border-border bg-card p-6 sm:p-8 text-left ${className}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--cta-orange))] mb-2">
        <ClipboardList className="w-3.5 h-3.5" aria-hidden />
        Vad vill ni göra härnäst?
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Gör kravspecifikationen för {link.label}</h2>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Det du har räknat på följer med som utgångsläge, så du slipper svara på samma frågor igen. Du kan ändra allt innan du tar fram underlaget.
      </p>
      {carried.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-6" aria-label="Följer med till kravspecifikationen">
          {carried.map((c) => (
            <li key={c} className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-foreground">{c}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground">
          <Link to={link.href} onClick={() => trackCalcToKrav(input.product, link)}>
            Fortsätt till kravspecifikationen <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
          </Link>
        </Button>
        {children}
      </div>
      <AdvisoryOffer
        className="mt-6 border-t border-border pt-4"
        variant="compact"
        placement="tool_result"
        pageType="calculator"
        cta={ADVISORY_CTA.tool_result}
        text="Vill ni gå igenom kalkylen med en rådgivare innan ni pratar med partners?"
        sections={[{ key: "kalkyl", label: "Kalkyl", lines: [`Produkt: ${link.label}`, ...carried] }]}
        metadata={{ tool: "calculator", product: input.product }}
      />
    </div>
  );
}
