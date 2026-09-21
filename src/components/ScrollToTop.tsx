import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToAnchorWhenReady } from "@/lib/anchorScroll";

/**
 * Hanterar scrollposition vid navigering. Vid ankarlänkar (t.ex. #partners)
 * väntar vi tills innehållet ovanför sektionen laddats och layouten är stabil,
 * och scrollar sedan fram sektionen med marginal för den fasta headern.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  // Utan ankarlänk: scrolla överst innan sidan målas, så att inte den nya
  // sidan blinkar till i fel scrollposition (t.ex. vid byte till /jamfor-partners).
  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.replace("#", ""));
    return scrollToAnchorWhenReady(id);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
