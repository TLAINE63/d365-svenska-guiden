import { createContext, lazy, ReactNode, Suspense, useCallback, useContext, useMemo, useState } from "react";
import { track } from "@/lib/track";

export type InquiryPartner = { slug: string; name: string };
export type InquiryType = "partner" | "kortlista" | "fraga";
type OpenArgs = { partners: InquiryPartner[]; type?: InquiryType; productArea?: string | null };

interface Ctx { open: (args: OpenArgs) => void }
const InquiryCtx = createContext<Ctx>({ open: () => {} });
const InquiryDialog = lazy(() => import("@/components/inquiry/InquiryDialog"));

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<(OpenArgs & { key: number }) | null>(null);
  const open = useCallback((args: OpenArgs) => {
    const partners = args.partners.slice(0, 3);
    track("inquiry_start", { from: typeof window !== "undefined" ? window.location.pathname : "", partner_count: partners.length });
    setState({ ...args, partners, key: Date.now() });
  }, []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <InquiryCtx.Provider value={value}>
      {children}
      {state && (
        <Suspense fallback={null}>
          <InquiryDialog key={state.key} partners={state.partners} type={state.type ?? (state.partners.length > 1 ? "kortlista" : "partner")} productArea={state.productArea} onClose={() => setState(null)} />
        </Suspense>
      )}
    </InquiryCtx.Provider>
  );
}

export const useInquiry = () => useContext(InquiryCtx);
