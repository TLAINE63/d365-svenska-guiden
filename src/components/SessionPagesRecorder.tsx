import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordSessionPage } from "@/lib/sessionPages";

/** Sparar besökets sökvägar i sessionStorage (d365_session_pages). Renderar inget. */
export default function SessionPagesRecorder() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/redaktion")) return;
    recordSessionPage(pathname);
  }, [pathname]);
  return null;
}
