import { useEffect, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadProgramTerms, TERMS_AREAS, TERMS_DATE, type TermsArea } from "@/utils/programTerms";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_AREAS, type OrderSelection } from "@/lib/partnerOrder";

export default function RedaktionTermsTab({ token }: { token: string | null }) {
  const [orders, setOrders] = useState<Array<{ id: string; created_at: string; company: string; email: string; contact_name: string; invoice_email: string; invoice_address: string; organization_number: string; price_ex_vat: number; selection: OrderSelection; terms_snapshot: unknown }>>([]);
  const [orderError, setOrderError] = useState(false);
  useEffect(() => {
    if (!token) return;
    supabase.functions.invoke("partner-program-order", { body: { action: "list", token } }).then(({ data, error }) => {
      if (error || !data?.orders) { setOrderError(true); return; }
      setOrders(data.orders);
    });
  }, [token]);
  const [pending, setPending] = useState<TermsArea | null>(null);
  async function download(area: TermsArea) {
    setPending(area);
    try { await downloadProgramTerms(area); }
    catch { toast.error("Kunde inte skapa dokumentet. Försök igen."); }
    finally { setPending(null); }
  }
  return <section className="space-y-5">
    <div>
      <h2 className="text-xl font-semibold">Avtalsvillkor</h2>
      <p className="mt-2 text-sm text-muted-foreground">Sammanställningar av publicerade villkor och aktuella priser. Uppdaterade {TERMS_DATE}. Individuella avtal, startdatum och rabatter regleras separat.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {TERMS_AREAS.map((area) => <Card key={area.id} className="flex flex-col">
        <CardHeader><FileText className="h-6 w-6 text-accent" aria-hidden="true" /><CardTitle className="text-lg">{area.title}</CardTitle></CardHeader>
        <CardContent className="flex flex-1 flex-col gap-5">
          <p className="flex-1 text-sm text-muted-foreground">{area.description}</p>
          <Button disabled={pending !== null} onClick={() => download(area.id)} className="w-full gap-2" aria-label={`Ladda ner avtalsvillkor: ${area.title}`}>
            {pending === area.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Ladda ner PDF
          </Button>
        </CardContent>
      </Card>)}
    </div>
    <div className="border-t border-border pt-6 space-y-4">
      <h2 className="text-xl font-semibold">Partnerbeställningar</h2>
      {orderError ? <p>Kunde inte hämta beställningarna.</p> : orders.length === 0 ? <p className="text-sm text-muted-foreground">Inga beställningar registrerade.</p> : orders.map(order => <details key={order.id} className="border-b border-border pb-4">
        <summary className="cursor-pointer font-semibold">{order.created_at.slice(0, 10)} · {order.company} · {order.price_ex_vat.toLocaleString("sv-SE")} kr</summary>
        <div className="mt-3 space-y-2 text-sm">
          <p className="break-all">Beställning: {order.id}</p>
          <p>{order.contact_name} · {order.email} · Org.nr {order.organization_number}</p>
          <p>{order.selection.level === "premium" ? "Premium" : "Grundprofil"} · {order.selection.period === "year" ? "Årsbetalning" : "Månadsbetalning"} · Start {order.selection.start_date}</p>
          <p>{order.selection.areas.map(a => ORDER_AREAS[a] ?? a).join(", ")}</p>
          <p>Förmedlingsavtal: {order.selection.mediation ? "Ja" : "Nej"}</p>
          <p>Faktura: {order.invoice_email} · {order.invoice_address}</p>
          <details><summary className="cursor-pointer">Accepterade villkor</summary><pre className="whitespace-pre-wrap break-words font-sans text-xs">{JSON.stringify(order.terms_snapshot, null, 2)}</pre></details>
        </div>
      </details>)}
    </div>
  </section>;
}