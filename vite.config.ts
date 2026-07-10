import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerenderPlugin from "./vite-prerender-plugin";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && prerenderPlugin(),
    mcpPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Force all assets to external files. Vite's default (4 KB) inlines the
    // small D365 icon SVGs/WebPs as data: URIs, and the SVG data URIs contain
    // HTML-encoded apostrophes (&#x27;) inside `width='…'` etc. That renders
    // fine in browsers but trips strict HTML/AI crawlers and fails our
    // "external asset" requirement. Keeping this at 0 ensures every icon is
    // served as /assets/xxx.svg (or .webp).
    assetsInlineLimit: 0,
    modulePreload: {
      resolveDependencies: () => [],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', '@radix-ui/react-popover', '@radix-ui/react-select'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
}));
