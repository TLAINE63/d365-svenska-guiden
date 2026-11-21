import { parseDocument } from "htmlparser2";
import render from "dom-serializer";
import type { ChildNode, Element } from "domhandler";

/**
 * Allowlist sanitizer for stored editor article HTML. Uses htmlparser2 so it
 * works both in the browser and during static prerendering.
 */
const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "sub", "sup",
  "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption", "table", "thead", "tbody",
  "tfoot", "tr", "th", "td", "caption", "span", "div", "code", "pre",
]);
const DROP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "noscript", "template", "svg", "math", "form", "input", "button", "textarea", "select", "link", "meta", "base"]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
};
const GLOBAL_ATTRS = new Set(["class"]);

function safeUrl(value: string, forImage: boolean): boolean {
  const v = value.trim().replace(/[\u0000-\u001F\s]+/g, "").toLowerCase();
  if (v.startsWith("//")) return false;
  if (v.startsWith("/") || v.startsWith("#")) return true;
  if (v.startsWith("https://") || v.startsWith("http://")) return true;
  return !forImage && v.startsWith("mailto:");
}

function clean(nodes: ChildNode[]): ChildNode[] {
  const out: ChildNode[] = [];
  for (const node of nodes) {
    if (node.type === "text") { out.push(node); continue; }
    if (node.type !== "tag") continue; // drop comments, directives, CDATA, script/style nodes
    const el = node as Element;
    const name = el.name.toLowerCase();
    if (DROP_WITH_CONTENT.has(name)) continue;
    el.children = clean(el.children) as Element["children"];
    if (!ALLOWED_TAGS.has(name)) { out.push(...el.children); continue; }
    const allowed = ALLOWED_ATTRS[name];
    const attribs: Record<string, string> = {};
    for (const [k, v] of Object.entries(el.attribs)) {
      const key = k.toLowerCase();
      if (!(GLOBAL_ATTRS.has(key) || allowed?.has(key))) continue;
      if ((key === "href" || key === "src") && !safeUrl(v, key === "src")) continue;
      attribs[key] = v;
    }
    if (name === "a" && attribs.target === "_blank") attribs.rel = "noopener noreferrer";
    el.attribs = attribs;
    out.push(el);
  }
  return out;
}

export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";
  const doc = parseDocument(html);
  return render(clean(doc.children));
}
