import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import DemandExportsPanel from "@/components/DemandExportsPanel";

export default function AdminExporter() {
  const { isAuthenticated, token, logout } = useAdminAuth();
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Exporter | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="max-w-xl mx-auto px-4 py-16">
        {!isAuthenticated ? (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-semibold leading-none tracking-tight">Åtkomst nekad</h1>
              <CardDescription>Sidan är bara tillgänglig för inloggad admin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild><Link to="/admin">Logga in i Admin</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <header className="space-y-3">
              <h1 className="text-2xl font-semibold">Export till Claude CRM</h1>
              <p className="text-sm text-muted-foreground">En gång i veckan: klicka på Ladda ner allt för CRM och släpp zip-filen i Claude CRM under Importera. Från datum fylls i automatiskt med dagen för förra nedladdningen.</p>
            </header>
            {token && <DemandExportsPanel token={token} onUnauthorized={logout} />}
            <Link to="/admin" className="inline-block text-sm underline text-muted-foreground">Tillbaka till Admin</Link>
          </div>
        )}
      </main>
    </div>
  );
}
