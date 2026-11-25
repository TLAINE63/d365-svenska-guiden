import { readFileSync } from "node:fs";
import { createHmac, webcrypto } from "node:crypto";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync("supabase/functions/sync-snitcher-visits/index.ts", "utf8")
  .replace(/^import .*;\n/gm, "");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

async function runSync(workspaces: { uuid: string; url: string }[], workspaceUuid?: string) {
  const secret = "test-only-secret";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ role: "admin", exp: Math.floor(Date.now() / 1000) + 60 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  let handler: ((req: Request) => Promise<Response>) | undefined;
  const fetch = vi.fn(async (url: string) => new Response(JSON.stringify(
    url.endsWith("/workspaces") ? { data: workspaces } : { data: [] },
  ), { status: 200 }));
  const upsert = vi.fn(async () => ({ error: null }));
  runInNewContext(compiled, {
    serve: (callback: typeof handler) => { handler = callback; },
    createClient: () => ({ from: () => ({ upsert }) }),
    Deno: { env: { get: (name: string) => name === "SUPABASE_SERVICE_ROLE_KEY" ? secret : "test-only-value" } },
    crypto: webcrypto, TextEncoder, Uint8Array, atob, Request, Response, fetch,
    console: { error: vi.fn() },
  });
  if (!handler) throw new Error("Sync handler was not registered");
  const response = await handler(new Request("https://example.test/sync", {
    method: "POST",
    body: JSON.stringify({ token: `${header}.${payload}.${signature}`, workspaceUuid }),
    headers: { "Content-Type": "application/json" },
  }));
  return { response, fetch, upsert };
}

describe("Snitcher sync workspace boundary", () => {
  const workspaces = [
    { uuid: "other-workspace", url: "https://other.test" },
    { uuid: "site-workspace", url: "https://d365.se" },
  ];

  it("ignores a client workspace override and fetches only the server-selected site workspace", async () => {
    const { response, fetch } = await runSync(workspaces, "unlisted/organisations?injected=true");
    expect(response.status).toBe(200);
    expect((await response.json()).workspaceUuid).toBe("site-workspace");
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      "https://api.snitcher.com/v1/workspaces",
      "https://api.snitcher.com/v1/workspaces/site-workspace/organisations?page=1&per_page=100",
    ]);
  });

  it("preserves normal syncing without an override", async () => {
    const { response, upsert } = await runSync(workspaces);
    expect(response.status).toBe(200);
    expect((await response.json()).workspaceUuid).toBe("site-workspace");
    expect(upsert).toHaveBeenCalledOnce();
  });

  it("cannot use a client workspace when the connected account returns none", async () => {
    const { response, fetch, upsert } = await runSync([], "unlisted-workspace");
    expect(response.status).toBe(500);
    expect(fetch).toHaveBeenCalledOnce();
    expect(upsert).not.toHaveBeenCalled();
  });
});