import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import JSZip from "npm:jszip@3.10.1";
import { extractText, getDocumentProxy } from "npm:unpdf@0.12.1";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://d365-svenska-guiden.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(str: string): Uint8Array {
  const binary = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sig = base64UrlDecode(s);
    const ok = await crypto.subtle.verify("HMAC", key, sig as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch (e) {
    console.error("JWT verify error", e);
    return false;
  }
}

/**
 * Extract plain text from a DOCX (zip → word/document.xml → strip tags).
 * Uses paragraph and table-row boundaries as newlines to preserve structure.
 */
async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const docXml = zip.file("word/document.xml");
  if (!docXml) throw new Error("Ogiltig DOCX: word/document.xml saknas");
  const xml = await docXml.async("string");

  // Insert newline markers at paragraph and row ends, tab at cell ends.
  const withBreaks = xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<\/w:tr>/g, "\n")
    .replace(/<\/w:tc>/g, "\t")
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<w:br\/>/g, "\n");

  // Strip all remaining XML tags, decode a few common entities.
  const text = withBreaks
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x[0-9a-fA-F]+;/g, (m) => {
      const cp = parseInt(m.slice(3, -1), 16);
      return isNaN(cp) ? "" : String.fromCodePoint(cp);
    });

  // Normalise whitespace: collapse runs of spaces, trim per-line, drop empty lines.
  return text
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter((l) => l.length > 0)
    .join("\n");
}

/**
 * Extract plain text from a PDF using unpdf (pdfjs under the hood).
 */
async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const merged = Array.isArray(text) ? text.join("\n") : String(text || "");
  return merged
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter((l) => l.length > 0)
    .join("\n");
}

const PDF_MIME = "application/pdf";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_TEXT_LEN = 500_000; // hard cap to avoid oversized DB rows

serve(async (req: Request): Promise<Response> => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const token = (formData.get("token") as string) || "";
    const filenameHint = ((formData.get("filename") as string) || "").trim();
    const partnerId = ((formData.get("partner_id") as string) || "").trim();
    const kind = ((formData.get("kind") as string) || "source").trim(); // "source" = partnerunderlag, "agreement" = signerat avtal

    if (!file || !token) {
      return new Response(JSON.stringify({ error: "Fil och token krävs" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const ok = await verifyAdminJWT(token, supabaseKey);
    if (!ok) {
      return new Response(JSON.stringify({ error: "Ogiltig admin-token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Accept PDF always; DOCX only for source-document uploads.
    const isPdf = file.type === PDF_MIME;
    const isDocx = file.type === DOCX_MIME || /\.docx$/i.test(file.name);
    if (kind === "source") {
      if (!isPdf && !isDocx) {
        return new Response(JSON.stringify({ error: "Endast PDF eller DOCX tillåten" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...cors },
        });
      }
    } else if (!isPdf) {
      return new Response(JSON.stringify({ error: "Endast PDF tillåten" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    if (file.size > 20 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Filen får max vara 20MB" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const buffer = await file.arrayBuffer();

    // Verify magic bytes.
    if (isPdf) {
      const head = new TextDecoder().decode(new Uint8Array(buffer.slice(0, 5)));
      if (!head.startsWith("%PDF-")) {
        return new Response(JSON.stringify({ error: "Filinnehållet är inte en giltig PDF" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...cors },
        });
      }
    } else if (isDocx) {
      const b = new Uint8Array(buffer.slice(0, 2));
      if (b[0] !== 0x50 || b[1] !== 0x4b) {
        return new Response(JSON.stringify({ error: "Filinnehållet är inte en giltig DOCX" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...cors },
        });
      }
    }

    // Safe filename.
    const ext = isPdf ? "pdf" : "docx";
    const defaultBase = kind === "source" ? "partnerunderlag" : "partneravtal";
    const safeBase = filenameHint
      .toLowerCase()
      .replace(/\.(pdf|docx)$/, "")
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || defaultBase;
    const stamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const filename = `${safeBase}-${stamp}.${ext}`;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const contentType = isPdf ? PDF_MIME : DOCX_MIME;
    // Source documents are internal material and must never be publicly readable.
    const bucket = kind === "source" ? "partner-documents-internal" : "partner-documents";
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, { contentType, upsert: true });

    if (upErr) {
      console.error("Upload error:", upErr);
      return new Response(JSON.stringify({ error: "Kunde inte ladda upp filen" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    let publicUrl = "";
    if (kind === "source") {
      // Short-lived signed URL (1h) – only for the authenticated admin session.
      const { data: signed } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filename, 3600);
      publicUrl = signed?.signedUrl ?? "";
    } else {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
      publicUrl = urlData.publicUrl;
    }

    // Extract text (only for source-document uploads).
    let extractedText: string | null = null;
    let extractionError: string | null = null;
    let charCount = 0;

    if (kind === "source") {
      try {
        const raw = isPdf
          ? await extractTextFromPdf(buffer)
          : await extractTextFromDocx(buffer);
        extractedText = raw.length > MAX_TEXT_LEN ? raw.slice(0, MAX_TEXT_LEN) : raw;
        charCount = extractedText.length;
      } catch (e) {
        console.error("Text extraction failed:", e);
        extractionError = e instanceof Error ? e.message : String(e);
      }

      // Persist to partner row if partner_id supplied.
      if (partnerId && extractedText !== null) {
        const { error: updErr } = await supabase
          .from("partners")
          .update({
            source_document_text: extractedText,
            source_document_url: publicUrl,
            source_document_filename: file.name || filename,
            source_document_mime: contentType,
            source_document_updated_at: new Date().toISOString(),
          })
          .eq("id", partnerId);
        if (updErr) {
          console.error("Partner update error:", updErr);
          return new Response(
            JSON.stringify({
              success: true,
              url: publicUrl,
              filename,
              text_extracted: true,
              char_count: charCount,
              partner_update_error: updErr.message,
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        filename,
        kind,
        text_extracted: extractedText !== null,
        char_count: charCount,
        extraction_error: extractionError,
        partner_updated: Boolean(partnerId && extractedText !== null),
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } },
    );
  } catch (e) {
    console.error("upload-partner-document error", e);
    return new Response(JSON.stringify({ error: "Ett fel uppstod vid uppladdning" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
