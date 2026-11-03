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
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-semibold leading-none tracking-tight">Exporter</h1>
              <CardDescription>CSV-filer för Demand Engine. Datum i formatet ÅÅÅÅ-MM-DD, till och med i dag.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {token && <DemandExportsPanel token={token} onUnauthorized={logout} />}
              <Link to="/admin" className="text-sm underline text-muted-foreground">Tillbaka till Admin</Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
