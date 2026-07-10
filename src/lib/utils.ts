import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Konvertera lagrade band ("1.000-4.999", ">5.000", "25-99 MSEK") till
 * svensk visning med icke-brytande mellanslag som tusentalsavgränsare
 * och tankstreck: "1 000–4 999", ">5 000", "25–99 MSEK".
 */
export function formatSwedishBand(band: string): string {
  if (!band) return "";
  // Byt tusenpunkter mot icke-brytande mellanslag i alla numeriska grupper
  return band
    .replace(/(\d)\.(\d{3})/g, "$1\u00A0$2")
    .replace(/(\d)-(\d)/g, "$1–$2");
}

/**
 * Svensk genitiv: lägg till "s" om namnet inte redan slutar på s/x/z.
 * Ex: "Fellowmind" → "Fellowminds", "Goodfellows" → "Goodfellows'",
 * "NAB Solutions" → "NAB Solutions'".
 */
export function swedishPossessive(name: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  const last = trimmed.slice(-1).toLowerCase();
  if (last === "s" || last === "x" || last === "z") return `${trimmed}'`;
  return `${trimmed}s`;
}

/**
 * Formatera svenska telefonnummer i grupper: "070-608 21 21", "08-123 45 67".
 * Bevarar landsprefix (+46). Om numret inte matchar svenskt mönster returneras
 * ursprunget med normaliserad mellanslag.
 */
export function formatSwedishPhone(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  // Behåll landsprefix separat
  let prefix = "";
  let digits = trimmed.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+46")) {
    prefix = "+46 ";
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("0046")) {
    prefix = "+46 ";
    digits = "0" + digits.slice(4);
  }
  if (!/^\d+$/.test(digits)) return trimmed;

  // Mobil (07x) och 3-siffriga riktnummer (t.ex. 018, 019, 021, 023, 026, 031...)
  // Enkelt: om längd 10 och börjar med 07 → 3-3-2-2. Om längd 10 och börjar med 08 → 2-3-2-3.
  // Annars grupp: riktnummer 3 siffror + resten i 3-2-2.
  if (digits.length === 10 && digits.startsWith("07")) {
    return `${prefix}${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  if (digits.length === 9 && digits.startsWith("08")) {
    return `${prefix}${digits.slice(0, 2)}-${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  if (digits.length === 10 && digits.startsWith("08")) {
    return `${prefix}${digits.slice(0, 2)}-${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 10)}`;
  }
  if (digits.length === 10) {
    return `${prefix}${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  if (digits.length === 9) {
    return `${prefix}${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  return prefix ? `${prefix}${digits}` : trimmed;
}
