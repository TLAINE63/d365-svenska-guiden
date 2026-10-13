import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import partnerData from "@/data/partnerData.json";

type P = { slug: string; name: string; is_featured: boolean };
const VERIFIED = (partnerData as P[]).filter((p) => p.is_featured).sort((a, b) => a.name.localeCompare(b.name, "sv"));

/** Embeddable "Verifierad partner på d365.se" badge, only for verified partners. */
export default function VerifiedPartnerBadgeEmbed() {
  const [variant, setVariant] = useState<"dark" | "light">("dark");
  const [slug, setSlug] = useState(VERIFIED[0]?.slug ?? "");
  const file = `/badges/verifierad-partner-${variant}.svg`;
  const code = `<a href="https://d365.se/partner/${slug}/" target="_blank" rel="noopener">\n  <img src="https://d365.se${file}" alt="Verifierad Dynamics 365-partner på d365.se" width="240" height="72" />\n</a>`;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Koden är kopierad");
  };

  return (
    <section id="badge" className="py-14 md:py-20 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Badge för verifierade partners</h2>
        <p className="text-base text-muted-foreground mb-8 max-w-3xl leading-relaxed">
          Visa att er profil på d365.se är partnerverifierad. Lägg badgen i sidfoten eller på er
          Dynamics&nbsp;365-sida, länkad till er egen profil.
        </p>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((v) => (
                <Button key={v} variant={variant === v ? "default" : "outline"} size="sm" onClick={() => setVariant(v)}>
                  {v === "dark" ? "Mörk" : "Ljus"}
                </Button>
              ))}
            </div>
            <div className={`rounded-xl border p-8 flex justify-center ${variant === "dark" ? "bg-card" : "bg-foreground/90"}`}>
              <img src={file} alt="Verifierad Dynamics 365-partner på d365.se" width={240} height={72} />
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={file} download>
                <Download className="w-4 h-4 mr-2" aria-hidden="true" /> Ladda ner SVG
              </a>
            </Button>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground" htmlFor="badge-partner">Er partnerprofil</label>
            <select
              id="badge-partner"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {VERIFIED.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
            <pre className="rounded-md border bg-background p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all">{code}</pre>
            <Button onClick={copy} size="sm">
              <Copy className="w-4 h-4 mr-2" aria-hidden="true" /> Kopiera kod
            </Button>
            <p className="text-xs text-muted-foreground">Badgen är endast till för partners med verifierad profil.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
