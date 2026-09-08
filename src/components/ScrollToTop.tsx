import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToAnchorWhenReady } from "@/lib/anchorScroll";

/**
 * Hanterar scrollposition vid navigering. Vid ankarlänkar (t.ex. #partners)
 * väntar vi tills innehållet ovanför sektionen laddats och layouten är stabil,
 * och scrollar sedan fram sektionen med marginal för den fasta headern.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.replace("#", ""));
    return scrollToAnchorWhenReady(id);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
