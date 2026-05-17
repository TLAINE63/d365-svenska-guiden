import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isReloading: boolean;
}

const isChunkError = (error: unknown): boolean => {
  const msg = (error as Error | undefined)?.message ?? "";
  const name = (error as Error | undefined)?.name ?? "";
  return (
    name === "ChunkLoadError" ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("Loading chunk") ||
    msg.includes("Loading CSS chunk") ||
    msg.includes("Unable to preload CSS")
  );
};

/**
 * Catches chunk/lazy-load errors (e.g. after a new deploy changes JS file hashes)
 * and forces a full page reload so the browser fetches the latest assets.
 *
 * For all other runtime errors, attempts one silent reload per session before
 * showing a fallback UI to avoid leaving the user stuck after a transient hiccup.
 */
class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isReloading: false };

  static getDerivedStateFromError(): State {
    return { hasError: true, isReloading: false };
  }

  componentDidCatch(error: Error) {
    // Always surface to console for debugging
    console.error("[ChunkErrorBoundary]", error);

    const chunk = isChunkError(error);
    const key = chunk ? "chunk-reload" : "boundary-reload";
    const cooldown = chunk ? 30_000 : 60_000;

    try {
      const last = sessionStorage.getItem(key);
      const now = Date.now();
      if (!last || now - Number(last) > cooldown) {
        sessionStorage.setItem(key, String(now));
        this.setState({ isReloading: true });
        // Bypass HTTP cache for chunk errors by appending a cache-buster
        if (chunk) {
          const url = new URL(window.location.href);
          url.searchParams.set("_r", String(now));
          window.location.replace(url.toString());
        } else {
          window.location.reload();
        }
      }
    } catch {
      // sessionStorage may be unavailable (private mode); fall through to fallback UI
    }
  }

  handleReload = () => {
    try {
      sessionStorage.removeItem("chunk-reload");
      sessionStorage.removeItem("boundary-reload");
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.isReloading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground">Laddar om...</div>
        </div>
      );
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4 text-center">
          <p className="text-muted-foreground">Något gick fel vid laddning av sidan.</p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Ladda om sidan
            </button>
            <button
              onClick={this.handleGoHome}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
            >
              Till startsidan
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ChunkErrorBoundary;
