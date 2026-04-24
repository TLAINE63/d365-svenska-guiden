import { supabase } from "@/integrations/supabase/client";

type InvokeResult<T> = {
  data: T | null;
  error: Error | null;
};

function isTransientEdgeError(message?: string | null) {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("edge function returned 503") ||
    normalized.includes("service is temporarily unavailable") ||
    normalized.includes("failed to send a request to the edge function") ||
    normalized.includes("failed to fetch")
  );
}

export async function invokeAdminEdgeWithRetry<T = any>(
  functionName: string,
  body: Record<string, unknown>,
  attempts = 3,
): Promise<InvokeResult<T>> {
  let lastError: Error | null = null;

  for (let i = 0; i < attempts; i++) {
    const { data, error } = await supabase.functions.invoke(functionName, { body });

    if (!error) {
      return { data: (data ?? null) as T | null, error: null };
    }

    lastError = error;
    if (!isTransientEdgeError(error.message) || i === attempts - 1) {
      return { data: (data ?? null) as T | null, error };
    }

    await new Promise((resolve) => setTimeout(resolve, 600 * (i + 1)));
  }

  return { data: null, error: lastError };
}