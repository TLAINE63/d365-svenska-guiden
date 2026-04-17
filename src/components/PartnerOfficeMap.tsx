import { useEffect, useState } from "react";

// Lazy-load Leaflet map only on client to avoid SSR/SSG issues with react-leaflet ESM.
const PartnerOfficeMap = () => {
  const [MapImpl, setMapImpl] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    import("./PartnerOfficeMapClient").then(mod => {
      if (mounted) setMapImpl(() => mod.default);
    });
    return () => { mounted = false; };
  }, []);

  if (!MapImpl) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-muted/30 h-[320px] md:h-[400px] flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Laddar karta…</span>
      </div>
    );
  }

  return <MapImpl />;
};

export default PartnerOfficeMap;
