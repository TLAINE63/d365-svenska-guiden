/**
 * Avkodning av adressdelar (sökväg, ankarlänk) som kommer utifrån.
 *
 * En adress kan innehålla ett löst procenttecken, t.ex. /rabatt-50% eller
 * /foo%zz, och då kastar decodeURIComponent "URI malformed". Ett sådant fel får
 * aldrig en sida att sluta rendera, därför returneras stricken i sin rå form.
 */
export function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
