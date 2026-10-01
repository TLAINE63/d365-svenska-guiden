import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

interface Result { partner: string; status: string; reason?: string }

export default function AdminNewsletterCard({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);

  const send = async () => {
    setSending(true);
    setResults(null);
    const { data, error } = await supabase.functions.invoke("send-partner-outreach", {
      body: { token, action: "newsletter-send" },
    });
    setSending(false);
    if (error || (data as any)?.error) {
      toast({ title: "Utskicket misslyckades", description: (data as any)?.error || error?.message, variant: "destructive" });
      return;
    }
    const d = data as any;
    setResults(d.results ?? []);
    toast({
      title: `Klart: ${d.sent} mejl skickade till thomas.laine@dynamicfactory.se`,
      description: d.skipped ? `${d.skipped} partners hoppades över (saknar länk).` : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nyhetsbrev september 2026: testutskick</CardTitle>
        <CardDescription>
          Skickar nyhetsbrevet (statistik, nyheter och uppmaning) en gång per publicerad partner, med respektive partners
          personliga profileringslänk, men alla mejl levereras till thomas.laine@dynamicfactory.se så att du kan granska
          hur det ser ut innan det går ut till partnerna.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={send} disabled={!token || sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          Skicka testutskick till mig
        </Button>
        {results && (
          <div className="divide-y rounded-md border text-sm">
            {results.map((r) => (
              <div key={r.partner} className="flex items-center gap-3 px-3 py-2">
                <span className="font-medium w-44 truncate">{r.partner}</span>
                <span className={r.status === "sent" ? "text-muted-foreground" : "text-destructive"}>
                  {r.status === "sent" ? "Skickad" : r.status === "failed" ? "Misslyckades" : `Hoppades över: ${r.reason}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
