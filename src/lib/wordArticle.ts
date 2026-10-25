/**
 * Gör om en Word-fil (.docx) till ett artikelutkast för /redaktion.
 * Word-rubriker förskjuts ett steg (sidans H1 är artikelns titel), första bilden
 * med bildtext blir huvudbild och ett inledande helfetstilt stycke blir ingress.
 * Inget publiceras här; redaktören granskar och publicerar själv.
 */

export interface WordArticleDraft {
  title: string;
  ingress: string;
  heroImage: string | null;
  heroAlt: string;
  heroCaption: string;
  bodyHtml: string;
  imageCount: number;
  warnings: string[];
}

/** Word-formatmallar (engelska och svenska namn) till artikelns rubriknivåer. */
export const WORD_STYLE_MAP = [
  "p[style-name='Title'] => h1.doc-title:fresh",
  "p[style-name='Rubrik'] => h1.doc-title:fresh",
  "p[style-name='Subtitle'] => p.doc-subtitle:fresh",
  "p[style-name='Underrubrik'] => p.doc-subtitle:fresh",
  "p[style-name='Heading 1'] => h2:fresh",
  "p[style-name='Rubrik 1'] => h2:fresh",
  "p[style-name='Heading 2'] => h3:fresh",
  "p[style-name='Rubrik 2'] => h3:fresh",
  "p[style-name='Heading 3'] => h4:fresh",
  "p[style-name='Rubrik 3'] => h4:fresh",
  "p[style-name='Heading 4'] => h4:fresh",
  "p[style-name='Quote'] => blockquote > p:fresh",
  "p[style-name='Citat'] => blockquote > p:fresh",
  "p[style-name='Intense Quote'] => blockquote > p:fresh",
  "p[style-name='Starkt citat'] => blockquote > p:fresh",
];

const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** Stycket består bara av text inuti de angivna taggarna (t.ex. helt kursivt). */
function isFullyWrapped(p: Element, tags: string[]): boolean {
  const all = text(p);
  if (!all) return false;
  const wrapped = Array.from(p.querySelectorAll(tags.join(",")))
    .filter((el) => !el.parentElement?.closest(tags.join(","))) // bara yttersta
    .map((el) => el.textContent ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  return wrapped === all;
}

const isImageOnly = (el: Element | null | undefined): el is Element =>
  !!el && el.tagName === "P" && el.querySelector("img") !== null && text(el) === "";

const isCaption = (el: Element | null | undefined): el is Element =>
  !!el && el.tagName === "P" && !el.querySelector("img") && isFullyWrapped(el, ["em", "i"]) && text(el).length <= 400;

/** Håller ihop "Dynamics 365" på en rad och ersätter långa tankstreck med korta. */
function fixTypography(root: Element) {
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  let node = walker.nextNode();
  while (node) {
    const value = node.nodeValue ?? "";
    const next = value.replace(/Dynamics 365/g, "Dynamics\u00A0365").replace(/\s—\s/g, " – ").replace(/—/g, "–");
    if (next !== value) node.nodeValue = next;
    node = walker.nextNode();
  }
}

export function fixTitleTypography(s: string): string {
  return s.replace(/Dynamics 365/g, "Dynamics\u00A0365").replace(/\s—\s/g, " – ").replace(/—/g, "–");
}

/** Efterbearbetar Word-HTML till artikelns struktur. Ren funktion, testbar utan Word. */
export function tidyWordHtml(html: string): Omit<WordArticleDraft, "imageCount"> {
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${html}</body>`, "text/html");
  const body = doc.body;
  const warnings: string[] = [];

  // Tomma stycken från Word.
  body.querySelectorAll("p").forEach((p) => {
    if (!text(p) && !p.querySelector("img")) p.remove();
  });

  // Titel ur formatmallen Rubrik/Title.
  let title = "";
  const titleEl = body.querySelector("h1.doc-title");
  if (titleEl) {
    title = text(titleEl);
    titleEl.remove();
  }
  body.querySelectorAll("h1").forEach((h) => {
    const h2 = doc.createElement("h2");
    h2.innerHTML = h.innerHTML;
    h.replaceWith(h2);
  });

  let ingress = "";
  const subtitle = body.querySelector("p.doc-subtitle");
  if (subtitle) {
    ingress = text(subtitle);
    subtitle.remove();
  }

  // Huvudbild: första stycket om det bara innehåller en bild, och bildtexten direkt under.
  let heroImage: string | null = null;
  let heroAlt = "";
  let heroCaption = "";
  const first = body.firstElementChild;
  if (isImageOnly(first)) {
    const img = first.querySelector("img")!;
    heroImage = img.getAttribute("src");
    heroAlt = img.getAttribute("alt") ?? "";
    const next = first.nextElementSibling;
    first.remove();
    if (isCaption(next)) {
      heroCaption = text(next);
      next.remove();
    }
  }

  // Ingress: inledande stycke som är helt i fetstil.
  const lead = body.firstElementChild;
  if (!ingress && lead && lead.tagName === "P" && isFullyWrapped(lead, ["strong", "b"])) {
    ingress = text(lead);
    lead.remove();
  }

  // Övriga bilder: bild + kursiv text direkt under blir bild med bildtext.
  Array.from(body.querySelectorAll("p")).forEach((p) => {
    if (!isImageOnly(p) || p.closest("td,th")) return;
    const figure = doc.createElement("figure");
    p.querySelectorAll("img").forEach((img) => figure.appendChild(img));
    const next = p.nextElementSibling;
    if (isCaption(next)) {
      const cap = doc.createElement("figcaption");
      cap.textContent = text(next);
      figure.appendChild(cap);
      next.remove();
    }
    p.replaceWith(figure);
  });

  body.querySelectorAll("[class]").forEach((el) => el.removeAttribute("class"));
  fixTypography(body);

  if (!title) warnings.push("Word-filen saknar titel i formatmallen Rubrik. Skriv titeln i fältet Titel.");
  if (!ingress) warnings.push("Ingen ingress hittades. Skriv 1–2 meningar i fältet Ingress.");

  return {
    title: fixTitleTypography(title),
    ingress: fixTitleTypography(ingress),
    heroImage,
    heroAlt,
    heroCaption: fixTitleTypography(heroCaption),
    bodyHtml: body.innerHTML.trim(),
    warnings,
  };
}

/** Krymper stora bilder till max 1600 px bredd som WebP innan uppladdning. */
async function optimizeImage(blob: Blob): Promise<Blob> {
  if (blob.type === "image/gif" || typeof createImageBitmap !== "function") return blob;
  try {
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
    return out && out.size < blob.size ? out : blob;
  } catch {
    return blob;
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  return dataUrl.slice(dataUrl.indexOf(",") + 1);
}

export type ImageUploader = (data: { base64: string; contentType: string }) => Promise<string>;

export async function uploadImageBlob(blob: Blob, upload: ImageUploader): Promise<string> {
  const optimized = await optimizeImage(blob);
  return upload({ base64: await blobToBase64(optimized), contentType: optimized.type || blob.type });
}

/** Läser Word-filen, laddar upp bilderna och returnerar ett utkast. */
export async function convertWordFile(file: File, upload: ImageUploader): Promise<WordArticleDraft> {
  const mammoth = (await import("mammoth/mammoth.browser.min.js")).default;
  let imageCount = 0;
  const result = await mammoth.convertToHtml(
    { arrayBuffer: await file.arrayBuffer() },
    {
      styleMap: WORD_STYLE_MAP,
      convertImage: mammoth.images.imgElement(async (image) => {
        const buffer = await image.readAsArrayBuffer();
        const url = await uploadImageBlob(new Blob([buffer], { type: image.contentType }), upload);
        imageCount++;
        return { src: url, alt: image.altText ?? "" };
      }),
    },
  );
  const draft = tidyWordHtml(result.value);
  return { ...draft, imageCount };
}
