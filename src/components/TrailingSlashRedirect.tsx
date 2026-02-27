import { useLocation, Navigate } from "react-router-dom";

/**
 * Redirects any URL with a trailing slash to the same URL without it.
 * This prevents 404s for /branschlosningar/ vs /branschlosningar etc.
 */
const TrailingSlashRedirect = () => {
  const { pathname, search, hash } = useLocation();

  if (pathname !== "/" && pathname.endsWith("/")) {
    return <Navigate to={pathname.slice(0, -1) + search + hash} replace />;
  }

  return null;
};

export default TrailingSlashRedirect;
