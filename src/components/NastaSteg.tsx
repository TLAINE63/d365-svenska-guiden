import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackLeadStep } from "@/lib/leadSteps";
import { INQUIRY_SELECTION_EVENT, addInquiryPartner, inquiryHref, readInquiryPartners, saveInquiryPartners } from "@/lib/inquirySelection";

export type LeadPageType = "jamforelse" | "pris-kostnad" | "partnerlista" | "partnerprofil" | "kunskapsartikel";
interface Props {
  typ: LeadPageType;
  product?: string | null;
  industry?: string | null;
  partnerSlug?: string;
  partnerName?: string;
  articleStep?: { to: string; label: string };
  className?: string;
}

export default function NastaSteg({ typ, product, industry, partnerSlug, partnerName, articleStep, className }: Props) {
  const { pathname } = useLocation();
  const [partners, setPartners] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setPartners(readInquiryPartners());
    sync();
    window.addEventListener(INQUIRY_SELECTION_EVENT, sync);
    return () => window.removeEventListener(INQUIRY_SELECTION_EVENT, sync);
  }, []);
  useEffect(() => { trackLeadStep("nasta_steg_visad", typ, { once: true }); }, [typ]);
  const added = !!partnerSlug && partners.includes(partnerSlug);
  const full = partners.length >= 3 && !added;
  const href = inquiryHref({ product, industry, partners, source: pathname });
  const copy = {
    jamforelse: "Väger ni mellan de här systemen? Beskriv läget så får ni förslag på partners som har gjort samma byte.",
    "pris-kostnad": "Vill ni ha en prisindikation för ett bolag i er storlek? Svara på fem frågor, svaret kommer från oss, inte från en säljare.",
    partnerlista: "Svårt att välja? Vi föreslår upp till tre partners utifrån bransch och storlek.",
    partnerprofil: "Välj partners att ta med i förfrågan till d365.se. Inget delas med partners utan ditt godkännande.",
    kunskapsartikel: "",
  }[typ];
  return (
    <section data-lead-block="nasta-steg" data-lead-typ={typ} className={cn("not-prose border-y border-border bg-secondary/30 py-6 my-6", className)}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {typ === "kunskapsartikel" && articleStep ? (
          <Button asChild variant="link" className="h-auto whitespace-normal px-0 text-left justify-start">
            <Link to={articleStep.to} onClick={() => trackLeadStep("nasta_steg_klick", typ)}>{articleStep.label}<ArrowRight aria-hidden /></Link>
          </Button>
        ) : (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-base text-foreground max-w-3xl leading-relaxed">{copy}</p>
            <div className="flex flex-wrap items-center gap-3 shrink-0 md:max-w-sm">
              {typ === "partnerprofil" && partnerSlug && <>
                <Button variant="outline" disabled={full || added} onClick={() => { saveInquiryPartners(addInquiryPartner(partners, partnerSlug)); trackLeadStep("partner_tillagd", typ); }} className="h-auto min-h-10 whitespace-normal">
                  {added ? <Check aria-hidden /> : <Plus aria-hidden />}{added ? "Tillagd i min förfrågan" : "Lägg till i min förfrågan"}
                </Button>
                {added && <Button variant="ghost" size="icon" aria-label={`Ta bort ${partnerName || partnerSlug} ur förfrågan`} title="Ta bort ur förfrågan" onClick={() => saveInquiryPartners(partners.filter(p => p !== partnerSlug))}><X aria-hidden /></Button>}
                <p className="w-full text-sm text-muted-foreground" role="status">{full ? "Du har valt tre partners. Ta bort en på dess profil för att välja en annan." : `${partners.length} av 3 partners valda`}</p>
              </>}
              <Button asChild className="h-auto min-h-10 whitespace-normal">
                <Link to={href} onClick={() => trackLeadStep("nasta_steg_klick", typ)}>{typ === "partnerprofil" ? "Skicka förfrågan" : "Beskriv ert läge"}<ArrowRight aria-hidden /></Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}