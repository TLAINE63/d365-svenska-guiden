import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ArrowLeft, Lock, Play, Loader2, Server } from "lucide-react";
import { toast } from "sonner";

type JsonSchema = {
  type?: string;
  properties?: Record<string, { type?: string; description?: string; enum?: string[] }>;
  required?: string[];
};

type McpTool = {
  name: string;
  title?: string;
  description?: string;
  annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean; idempotentHint?: boolean };
  inputSchema?: JsonSchema;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  "";
const MCP_BASE = `${SUPABASE_URL}/functions/v1/mcp`;

function commonHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (PUBLISHABLE_KEY) {
    h["apikey"] = PUBLISHABLE_KEY;
    h["Authorization"] = `Bearer ${PUBLISHABLE_KEY}`;
  }
  return h;
}

async function fetchToolList(): Promise<McpTool[]> {
  // Try helper endpoint first
  const helper = await fetch(`${MCP_BASE}/.mcp/list-tools`, { headers: commonHeaders() });
  if (helper.ok) {
    const j = await helper.json();
    if (Array.isArray(j?.tools)) return j.tools as McpTool[];
    if (Array.isArray(j)) return j as McpTool[];
  }
  // Fallback to JSON-RPC MCP protocol
  const rpc = await fetch(MCP_BASE, {
    method: "POST",
    headers: { ...commonHeaders(), Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
  });
  if (!rpc.ok) throw new Error(`list-tools failed (${rpc.status})`);
  const text = await rpc.text();
  // May be SSE — grab the last data line
  const dataLine = text.split("\n").reverse().find((l) => l.startsWith("data:"));
  const json = JSON.parse(dataLine ? dataLine.slice(5).trim() : text);
  return (json?.result?.tools ?? []) as McpTool[];
}

async function invokeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  // Try helper endpoint
  const helper = await fetch(`${MCP_BASE}/.mcp/invoke-tool/${encodeURIComponent(name)}`, {
    method: "POST",
    headers: commonHeaders(),
    body: JSON.stringify(args),
  });
  if (helper.ok) {
    return helper.json();
  }
  if (helper.status !== 404 && helper.status !== 405) {
    const txt = await helper.text();
    throw new Error(`invoke-tool ${name} failed (${helper.status}): ${txt.slice(0, 500)}`);
  }
  // Fallback to JSON-RPC tools/call
  const rpc = await fetch(MCP_BASE, {
    method: "POST",
    headers: { ...commonHeaders(), Accept: "application/json, text/event-stream" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });
  const text = await rpc.text();
  const dataLine = text.split("\n").reverse().find((l) => l.startsWith("data:"));
  const json = JSON.parse(dataLine ? dataLine.slice(5).trim() : text);
  if (json?.error) throw new Error(json.error.message ?? "MCP error");
  return json?.result;
}

function ToolCard({ tool }: { tool: McpTool }) {
  const props = tool.inputSchema?.properties ?? {};
  const required = new Set(tool.inputSchema?.required ?? []);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const propEntries = useMemo(() => Object.entries(props), [props]);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const args: Record<string, unknown> = {};
      for (const [key, schema] of propEntries) {
        const raw = values[key]?.trim();
        if (!raw) continue;
        if (schema.type === "number" || schema.type === "integer") {
          const n = Number(raw);
          if (!Number.isFinite(n)) throw new Error(`${key} måste vara ett tal`);
          args[key] = n;
        } else if (schema.type === "boolean") {
          args[key] = raw === "true";
        } else {
          args[key] = raw;
        }
      }
      for (const key of required) {
        if (args[key] === undefined) throw new Error(`${key} krävs`);
      }
      const res = await invokeTool(tool.name, args);
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      toast.error(`Fel: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {tool.title ?? tool.name}
              <code className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                {tool.name}
              </code>
            </CardTitle>
            {tool.description && (
              <CardDescription className="mt-1">{tool.description}</CardDescription>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {tool.annotations?.readOnlyHint && <Badge variant="secondary">read-only</Badge>}
            {tool.annotations?.idempotentHint && <Badge variant="secondary">idempotent</Badge>}
            {tool.annotations?.destructiveHint && <Badge variant="destructive">destructive</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {propEntries.length === 0 && (
          <p className="text-sm text-muted-foreground">Detta verktyg tar inga argument.</p>
        )}
        {propEntries.map(([key, schema]) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={`${tool.name}-${key}`} className="flex items-center gap-2">
              {key}
              {required.has(key) && <span className="text-destructive text-xs">*</span>}
              <span className="text-xs text-muted-foreground font-normal">
                ({schema.type ?? "any"})
              </span>
            </Label>
            <Input
              id={`${tool.name}-${key}`}
              placeholder={schema.description ?? ""}
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
            {schema.description && (
              <p className="text-xs text-muted-foreground">{schema.description}</p>
            )}
          </div>
        ))}
        <Button onClick={run} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Kör anrop
        </Button>
        {error && (
          <pre className="text-sm bg-destructive/10 text-destructive border border-destructive/30 rounded p-3 whitespace-pre-wrap break-words">
            {error}
          </pre>
        )}
        {result && (
          <div>
            <Label className="mb-1.5 block">Svar</Label>
            <pre className="text-xs bg-muted rounded p-3 overflow-auto max-h-96 whitespace-pre-wrap break-words">
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminMcpTest() {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tools, setTools] = useState<McpTool[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadTools() {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await fetchToolList();
      setTools(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) loadTools();
  }, [isAuthenticated]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await login(password);
    if (!res.success) setLoginError(res.error ?? "Inloggning misslyckades");
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead title="MCP-testpanel – d365.se" description="Testa MCP-verktyg." canonicalPath="/admin/mcp-test" noIndex />
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                MCP-testpanel
              </CardTitle>
              <CardDescription>Adminlösenord krävs för att köra MCP-anrop.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Lösenord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ange adminlösenord"
                  />
                  {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                </div>
                <Button type="submit" className="w-full">Logga in</Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="MCP-testpanel – d365.se" description="Testa MCP-verktyg." canonicalPath="/admin/mcp-test" noIndex />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link to="/admin" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Tillbaka till admin
              </Link>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Server className="h-6 w-6" /> MCP-testpanel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Endpoint: <code className="font-mono">{MCP_BASE}</code>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadTools} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ladda om"}
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>Logga ut</Button>
          </div>
        </div>

        {loadError && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">Kunde inte hämta verktygslista: {loadError}</p>
            </CardContent>
          </Card>
        )}

        {tools === null && !loadError && (
          <p className="text-sm text-muted-foreground">Laddar verktyg…</p>
        )}

        {tools && tools.length === 0 && (
          <p className="text-sm text-muted-foreground">Inga MCP-verktyg hittades.</p>
        )}

        <div className="space-y-6">
          {tools?.map((t) => <ToolCard key={t.name} tool={t} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
