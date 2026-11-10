import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordSessionPage, recordSessionUtm } from "@/lib/sessionPages";

/** Sparar besökets sökvägar i sessionStorage (d365_session_pages). Renderar inget. */
export default function SessionPagesRecorder() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/redaktion")) return;
    recordSessionUtm(search);
    recordSessionPage(pathname);
  }, [pathname, search]);
  return null;
}
