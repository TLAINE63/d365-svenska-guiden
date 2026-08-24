import { supabase } from "@/integrations/supabase/client";

/**
 * Anropar en edge-funktion med ett automatiskt återförsök vid nätverksfel
 * (t.ex. "Failed to fetch" när funktionen just startats om / kallstartar).
 * Terminala fel (4xx från funktionen) återförsöks inte.
 */
export async function invokeWithRetry<T = any>(
  functionName: string,
  body: unknown,
  attempts = 2,
  delayMs = 1500,
): Promise<T> {
  let lastError: any = null;

  for (let i = 0; i < attempts; i++) {
    const { data, error } = await supabase.functions.invoke(functionName, { body: body as any });

    if (!error && !(data as any)?.error) return data as T;

    lastError = error || new Error((data as any)?.error);

    const message = String(lastError?.message || "");
    const isNetworkError =
      message.includes("Failed to fetch") ||
      message.includes("Failed to send a request") ||
      message.includes("NetworkError") ||
      message.includes("load failed");

    if (!isNetworkError || i === attempts - 1) break;

    await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
  }

  const msg = String(lastError?.message || "");
  if (msg.includes("Failed to fetch") || msg.includes("Failed to send a request")) {
    throw new Error("Kunde inte nå tjänsten just nu. Kontrollera din uppkoppling och försök igen om en stund.");
  }
  throw lastError instanceof Error ? lastError : new Error("Något gick fel – försök igen.");
}
