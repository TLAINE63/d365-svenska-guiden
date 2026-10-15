import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { flushAccountSync } from "@/lib/accountSync";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

export default function Konto() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getUser().then(({ data }) => { setUser(data.user ?? null); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setBusy(true);
    try {
      if (mode === "signup") {
        if (password.length < 10) { setErr("Lösenordet måste vara minst 10 tecken."); return; }
        const { error } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: `${window.location.origin}/konto/` },
        });
        if (error) setErr("Kunde inte skapa kontot. Kontrollera uppgifterna och försök igen.");
        else setMsg("Kolla din e-post och klicka på länken för att bekräfta kontot.");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setErr("Fel e-post eller lösenord, eller så är kontot inte bekräftat än.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password?next=/konto/`,
        });
        if (error) setErr("Kunde inte skicka länken. Försök igen.");
        else setMsg("Om adressen finns får du en länk för att välja nytt lösenord.");
      }
    } finally { setBusy(false); }
  }

  async function logout() {
    await flushAccountSync();
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Mitt konto | d365.se" description="Logga in för att spara Min D365-plan, kortlista och kalkyler mellan enheter." canonicalPath="/konto/" noIndex />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-16 max-w-md w-full">
        {!ready ? (
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        ) : user ? (
          <Card className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Mitt konto</h1>
            <p className="text-sm text-muted-foreground">Inloggad som <strong className="text-foreground">{user.email}</strong>.</p>
            <p className="text-sm text-muted-foreground">
              Min D365-plan, kortlistan och sparade kalkyler sparas nu på ditt konto och finns kvar när du kommer tillbaka, även från en annan enhet. Ingen partner ser dina uppgifter.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild><Link to="/min-d365-plan/">Till Min D365-plan</Link></Button>
              <Button variant="outline" onClick={logout}>Logga ut</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {mode === "signup" ? "Skapa konto" : mode === "forgot" ? "Glömt lösenord" : "Logga in"}
            </h1>
            <p className="text-sm text-muted-foreground mb-5">
              Frivilligt. Med ett konto sparas Min D365-plan, kortlista och kalkyler så att de finns kvar nästa gång.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="konto-email">E-post</Label>
                <Input id="konto-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="konto-pw">Lösenord</Label>
                  <Input id="konto-pw" type="password" required minLength={mode === "signup" ? 10 : undefined}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              )}
              {err && <p className="text-sm text-destructive">{err}</p>}
              {msg && <p className="text-sm text-foreground">{msg}</p>}
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signup" ? "Skapa konto" : mode === "forgot" ? "Skicka länk" : "Logga in"}
              </Button>
            </form>
            <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
              {mode === "login" ? (
                <>
                  <button type="button" className="text-primary hover:underline" onClick={() => { setMode("signup"); setErr(null); setMsg(null); }}>Skapa konto</button>
                  <button type="button" className="text-muted-foreground hover:underline" onClick={() => { setMode("forgot"); setErr(null); setMsg(null); }}>Glömt lösenord?</button>
                </>
              ) : (
                <button type="button" className="text-primary hover:underline" onClick={() => { setMode("login"); setErr(null); setMsg(null); }}>Har du redan konto? Logga in</button>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Personuppgiftsansvarig: Dynamic Factory. Läs mer i vår <Link to="/dataskydd/" className="underline">dataskyddspolicy</Link>.
            </p>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
