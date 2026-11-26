import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ORDER_PRICES } from "@/lib/partnerOrder";

/** Generates the partner offer PDF from the same story, prices and terms as the page, so it never goes stale. */
export function PartnerOfferDownload() {
  const [busy, setBusy] = useState(false);
  async function download() {
    setBusy(true);
    try {
      const { generateOfferDecisionPdf } = await import("@/utils/generateOfferDecisionPdf");
      const blob = await generateOfferDecisionPdf({ kind: "partner", company: "", premium: true, period: "year", areas: ["Valfritt produktområde"], mediation: true, startDate: "Enligt överenskommelse", price: ORDER_PRICES.year[1] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "d365-partnererbjudande-2027.pdf";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch { toast.error("PDF kunde inte skapas."); } finally { setBusy(false); }
  }
  return (
    <>
      <Button size="lg" variant="outline" asChild>
        <a href="/downloads/d365-partnererbjudande-2027-kort.pdf" download="d365-partnererbjudande-2027-kort.pdf">Ladda ner erbjudandet i korthet (2 sidor, PDF)</a>
      </Button>
      <Button size="lg" variant="outline" onClick={download} disabled={busy}>{busy ? "Skapar PDF …" : "Ladda ner partnererbjudandet (PDF)"}</Button>
    </>
  );
}
