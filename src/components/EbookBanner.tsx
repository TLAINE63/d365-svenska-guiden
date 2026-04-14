import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, BookOpen, CheckCircle } from "lucide-react";
import ebookCover from "@/assets/ebook-partnervalet-cover.webp";

interface EbookBannerProps {
  variant?: "full" | "compact";
  sourcePage?: string;
}

const EbookBanner = ({ variant = "full", sourcePage = "homepage" }: EbookBannerProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({ title: "Ange din e-postadress", variant: "destructive" });
      return;
    }

    if (honeypot) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke("submit-lead", {
        body: {
          email,
          company_name: "E-bok Download",
          contact_name: email.split("@")[0] || "Lead",
          source_page: sourcePage,
          source_type: "ebook_download",
          message: "Begärt e-boken 'Det viktiga partnervalet'",
          _hp: honeypot,
        },
      });

      if (response.error) throw new Error(response.error.message || "Kunde inte ansluta till servern");
      if (response.data?.error) throw new Error(response.data.error);

      // Trigger PDF download
      const link = document.createElement("a");
      link.href = "/ebooks/det-viktiga-partnervalet.pdf";
      link.download = "Det-viktiga-partnervalet-d365.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSubmitted(true);
      toast({
        title: "E-boken laddas ner!",
        description: "Kolla din nedladdningsmapp.",
      });
    } catch (error: unknown) {
      console.error("Error submitting ebook lead:", error);
      toast({
        title: "Något gick fel",
        description: error instanceof Error ? error.message : "Ett oväntat fel uppstod",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Tack! E-boken laddas ner.</h3>
            <p className="text-sm text-muted-foreground">
              Fick du inte filen?{" "}
              <a
                href="/ebooks/det-viktiga-partnervalet.pdf"
                download="Det-viktiga-partnervalet-d365.pdf"
                className="text-primary hover:underline font-medium"
              >
                Ladda ner direkt här
              </a>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/30 p-5 rounded-2xl shadow-lg shadow-primary/10 overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-primary/5 rounded-full blur-2xl" />
        <div className="flex items-center gap-4 relative">
          <img
            src={ebookCover}
            alt="E-bok: Det viktiga partnervalet"
            className="w-20 h-auto flex-shrink-0 drop-shadow-lg"
            loading="lazy"
            width={80}
            height={100}
          />
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide mb-1.5">
              Gratis e-bok
            </span>
            <h3 className="font-semibold text-foreground text-sm mb-1">Det viktiga partnervalet</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              Varför systemval och partnerval måste göras tillsammans — och hur du gör det rätt.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute -left-[9999px] opacity-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="din@epost.se" className="h-8 text-xs w-36 bg-background/80" disabled={isSubmitting} />
              <Button type="submit" size="sm" disabled={isSubmitting} className="h-8 text-xs whitespace-nowrap">
                {isSubmitting ? "..." : <><Download className="h-3 w-3 mr-1" />Ladda ner</>}
              </Button>
            </form>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="py-10 sm:py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Book image */}
          <div className="flex-shrink-0">
            <img
              src={ebookCover}
              alt="E-bok: Det viktiga partnervalet"
              className="w-40 sm:w-48 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={192}
              height={240}
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide mb-3">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Gratis e-bok
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Det viktiga partnervalet
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-2 max-w-lg">
              Rätt system. Rätt partner. Bättre affärsresultat.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-5 max-w-lg">
              Vad statistiken säger om lyckade och misslyckade projekt, varför branschkompetens gör så stor skillnad och en praktisk modell för att välja Microsoftpartner. 20 sidor med konkreta insikter.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute -left-[9999px] opacity-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.se"
                className="w-full sm:w-56 bg-background/80 border-primary/30 focus:border-primary focus:ring-primary/30"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
                {isSubmitting ? "Skickar..." : <><Download className="mr-2 h-4 w-4" />Ladda ner e-boken</>}
              </Button>
            </form>
            <p className="text-[11px] text-muted-foreground/60 mt-2">Kostnadsfri. Ingen prenumeration.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookBanner;
