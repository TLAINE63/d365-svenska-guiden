import { Navigate, useLocation } from "react-router-dom";

/**
 * Omdirigering som behåller ev. query-parametrar och ankare (#partners),
 * så att djuplänkar till en sektion fungerar även efter en URL-omskrivning.
 */
const RedirectTo = ({ to }: { to: string }) => {
  const { search, hash } = useLocation();
  const [path, targetQuery] = to.split("?");
  const query = targetQuery ? `?${targetQuery}` : search;
  return <Navigate to={`${path}${query}${hash}`} replace />;
};

export default RedirectTo;
