// Skalar ner logotyper från sajtens bildlagring (visas max ~160px breda).
export function optimizedLogo(url?: string | null, width = 320): string | undefined {
  if (!url) return url ?? undefined;
  const marker = "/storage/v1/object/public/";
  if (!url.includes(marker) || url.toLowerCase().split("?")[0].endsWith(".svg")) return url;
  const base = url.replace(marker, "/storage/v1/render/image/public/").split("?")[0];
  return `${base}?width=${width}&quality=75&resize=contain`;
}
