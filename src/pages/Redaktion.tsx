import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useEditorAuth } from "@/hooks/useEditorAuth";
import { useAdminPartners } from "@/hooks/useAdminPartners";
import AdminEventsTab from "@/components/AdminEventsTab";
import AdminPartnerNewsTab from "@/components/AdminPartnerNewsTab";
import AdminKnowledgeArticlesTab from "@/components/AdminKnowledgeArticlesTab";
import RedaktionPartnerLinksTab from "@/components/RedaktionPartnerLinksTab";
import SiteTrafficStatsCard from "@/components/SiteTrafficStatsCard";
import AdminStatsSummary from "@/components/AdminStatsSummary";
import AdminAiVisibilityTab from "@/components/AdminAiVisibilityTab";
import { Lock, Loader2, LogOut, PenLine } from "lucide-react";
import { toast } from "sonner";

export default function Redaktion() {
  const { isLoading, isAuthenticated, token, email, accessError, login, logout, resetPassword } =
    useEditorAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreateAccount() {
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("editor-bootstrap", {
      body: { adminPassword, email: form.email, password: form.password },
    });
    setCreating(false);
    if (error || (data as { error?: string } | null)?.error) {
      toast.error((data as { error?: string } | null)?.error ?? "Kunde inte skapa kontot");
      return;
    }
    toast.success("Kontot är klart, logga in med din e-post och ditt lösenord");
    setShowSetup(false);
    setAdminPassword("");
  }

  const { data: partners = [], isLoading: partnersLoading } = useAdminPartners(
    isAuthenticated ? token : null,
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setSubmitting(true);
    const res = await login(form.email, form.password);
    setSubmitting(false);
    if (!res.success) setLoginError(res.error ?? "Inloggningen misslyckades");
  }

  async function handleReset() {
    if (!form.email.trim()) {
      toast.error("Fyll i din e-postadress först");
      return;
    }
    const res = await resetPassword(form.email);
    if (res.success) toast.success("Återställningslänk skickad till din e-post");
    else toast.error(res.error ?? "Kunde inte skicka länken");
  }

  const seo = (
    <SEOHead
      title="Redaktion | d365.se"
      description="Intern redaktörsvy för event, partnernytt och artiklar."
      canonicalPath="/redaktion"
      noIndex
    />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {seo}
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        {seo}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Redaktion
            </CardTitle>
            <CardDescription>
              Logga in med din e-postadress för att hantera event, partnernytt och artiklar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editor-email">E-post</Label>
                <Input
                  id="editor-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="din@epost.se"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editor-password">Lösenord</Label>
                <Input
                  id="editor-password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              {(loginError || accessError) && (
                <p className="text-sm text-destructive">{loginError || accessError}</p>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Logga in
              </Button>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:underline w-full text-center"
              >
                Glömt lösenord?
              </button>
            </form>

            <div className="mt-6 pt-4 border-t">
              {!showSetup ? (
                <button
                  type="button"
                  onClick={() => setShowSetup(true)}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Första gången? Skapa ditt konto
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Fyll i e-post och lösenord ovan, och ange adminlösenordet här för att skapa
                    kontot.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="setup-admin">Adminlösenord</Label>
                    <Input
                      id="setup-admin"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={creating}
                    onClick={handleCreateAccount}
                  >
                    {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Skapa konto
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {seo}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <PenLine className="h-6 w-6" /> Redaktion
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {email} · Event, Partnernytt och Artiklar
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logga ut
          </Button>
        </div>

        <Tabs defaultValue="events">
          <TabsList className="mb-6">
            <TabsTrigger value="events">Event</TabsTrigger>
            <TabsTrigger value="partner-news">Partnernytt</TabsTrigger>
            <TabsTrigger value="articles">Artiklar</TabsTrigger>
            <TabsTrigger value="partners">Partnerprofiler</TabsTrigger>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
            <TabsTrigger value="ai">AI-synlighet</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <SiteTrafficStatsCard token={token} variant="full" />
            <AdminStatsSummary token={token || ""} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="ai">
            <AdminAiVisibilityTab token={token} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="partners">
            <RedaktionPartnerLinksTab
              token={token}
              isLoading={partnersLoading}
              partners={partners.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                is_featured: p.is_featured ?? false,
              }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          <TabsContent value="events">
            <AdminEventsTab
              token={token || ""}
              partners={partners.map((p) => ({
                id: p.id,
                name: p.name,
                is_featured: p.is_featured || false,
                slug: p.slug,
                email: p.email || "",
                admin_contact_email: p.admin_contact_email || "",
              }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          <TabsContent value="partner-news">
            <AdminPartnerNewsTab
              token={token || ""}
              partners={partners.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                is_featured: p.is_featured ?? false,
                logo_url: p.logo_url ?? null,
              }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          <TabsContent value="articles">
            <AdminKnowledgeArticlesTab token={token || null} onSessionExpired={logout} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
