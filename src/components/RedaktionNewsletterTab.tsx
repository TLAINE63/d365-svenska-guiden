import { useCallback, useEffect, useState } from "react";
import { Download, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RedaktionNewsletterTab({ token, onSessionExpired }: { token: string | null; onSessionExpired: () => void }) {
  const [count, setCount] = useState<number | null>(null);
  const { toast } = useToast();
  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-subscription`;
  const headers = () => ({ Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY });
  const load = useCallback(async () => {
    if (!token) return;
    const response = await fetch(`${base}?action=stats`, { headers: headers() });
    if (response.status === 401) return onSessionExpired();
    const data = await response.json();
    if (response.ok) setCount(data.count || 0);
  }, [token]);
  useEffect(() => { load(); }, [load]);
  const download = async () => {
    const response = await fetch(`${base}?action=csv`, { headers: headers() });
    if (response.status === 401) return onSessionExpired();
    if (!response.ok) return toast({ title: "CSV kunde inte hämtas", variant: "destructive" });
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = "d365se-nyhetsbrev.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Nyhetsbrev</CardTitle><CardDescription>Bekräftade prenumeranter på nya artiklar och webinarinbjudningar. Avregistrerade och obekräftade adresser ingår inte i exporten.</CardDescription></CardHeader>
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div><div className="text-4xl font-bold">{count ?? "…"}</div><p className="text-sm text-muted-foreground">bekräftade aktiva prenumeranter</p><p className="text-sm text-muted-foreground mt-3">CSV:n innehåller även varje adress unika avregistreringstoken för ditt externa utskicksverktyg.</p></div>
        <Button onClick={download} disabled={!count}><Download className="h-4 w-4 mr-2" />Hämta CSV</Button>
      </CardContent>
    </Card>
  );
}
