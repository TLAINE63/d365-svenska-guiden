import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AgreementSection {
  id: string;
  title: string;
  body: string;
}
interface AgreementConfig {
  heading: string;
  intro: string;
  pdfUrl: string;
  pdfLabel: string;
  sections: AgreementSection[];
}

const DEFAULT_CONFIG: AgreementConfig = {
  heading: "Partneravtal – d365.se",
  intro:
    "Sammanfattning av villkor för partnersamarbete med d365.se. Fullständigt avtal kan laddas ner som PDF nedan.",
  pdfUrl: "",
  pdfLabel: "Gällande partneravtal (PDF)",
  sections: [],
};

export default function PartnerAgreement() {
  const [config, setConfig] = useState<AgreementConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("partner-agreement-config");
        if (data?.config) {
          setConfig({
            ...DEFAULT_CONFIG,
            ...data.config,
            sections: Array.isArray(data.config.sections) ? data.config.sections : [],
          });
        }
      } catch (e) {
        console.error("load agreement config", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  return (
    <>
      <SEOHead
        title={config.heading}
        description="Avtalsvillkor för partners på d365.se."
        canonicalPath="/avtalssida"
        noIndex
      />
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container max-w-3xl mx-auto px-4 space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{config.heading}</h1>
            {config.intro && <p className="text-muted-foreground whitespace-pre-line">{config.intro}</p>}
          </header>

          {config.pdfUrl && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{config.pdfLabel || "Partneravtal (PDF)"}</div>
                    <div className="text-xs text-muted-foreground">Senast uppdaterad version</div>
                  </div>
                </div>
                <Button asChild>
                  <a href={config.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Ladda ner
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {loaded && config.sections.length === 0 && !config.pdfUrl && (
            <p className="text-sm text-muted-foreground">
              Innehåll håller på att uppdateras. Återkom snart.
            </p>
          )}

          {config.sections.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="whitespace-pre-line">{s.body}</p>
              </CardContent>
            </Card>
          ))}

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="w-5 h-5" />
                Frågor om avtalet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Kontakta oss via{" "}
              <a href="/kontakt/" className="underline text-foreground">/kontakt</a> så återkommer vi.
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
