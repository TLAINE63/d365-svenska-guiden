import type { Plugin } from 'vite';
import { build } from 'vite';
import { resolve, join } from 'path';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import react from '@vitejs/plugin-react-swc';

/**
 * Vite plugin that prerenders static HTML for all defined routes after the
 * client build completes.
 *
 * - Builds a separate SSR bundle from src/entry-server.tsx
 * - Renders each route to static HTML with react-helmet SEO tags
 * - Links CSS files correctly in each generated HTML
 * - Writes route/index.html files into the dist directory
 * - Generates a fresh sitemap.xml from the prerendered routes
 */
export default function prerenderPlugin(): Plugin {
  let outDir: string;
  let root: string;
  let isSsr = false;

  return {
    name: 'vite-prerender-ssg',
    apply: 'build',

    configResolved(config) {
      outDir = config.build.outDir;
      root = config.root;
      isSsr = !!config.build.ssr;
    },

    async closeBundle() {
      // Guard: skip if this IS the SSR build or if env flag is set (prevents loops)
      if (isSsr || process.env.__VITE_PRERENDER === '1') return;

      process.env.__VITE_PRERENDER = '1';
      const tempDir = resolve(root, '.prerender-temp');

      console.log('\n🔄 Prerendering routes...\n');

      try {
        // ── 1. Polyfill browser globals for SSR ──────────────────────────
        setupBrowserGlobals();

        // ── 2. Build the SSR bundle (completely isolated) ────────────────
        await build({
          configFile: false, // Do NOT load vite.config.ts → no plugin loop
          root,
          plugins: [react()],
          resolve: {
            alias: { '@': resolve(root, 'src') },
          },
          build: {
            ssr: resolve(root, 'src/entry-server.tsx'),
            outDir: tempDir,
            rollupOptions: {
              output: { format: 'esm' },
            },
          },
          logLevel: 'warn',
        });

        // ── 3. Import the built SSR module ───────────────────────────────
        const modulePath = pathToFileURL(resolve(tempDir, 'entry-server.js')).href;
        const { render, routes } = await import(modulePath);

        // ── 4. Read the client-built index.html as template ──────────────
        const template = readFileSync(resolve(root, outDir, 'index.html'), 'utf-8');

        // ── 5. Discover CSS files from the build output ──────────────────
        const assetsDir = resolve(root, outDir, 'assets');
        let cssFiles: string[] = [];
        try {
          cssFiles = readdirSync(assetsDir)
            .filter(f => f.endsWith('.css'))
            .map(f => `/assets/${f}`);
        } catch {
          /* assets dir might not exist */
        }

        const baseUrl = 'https://d365.se';
        const today = new Date().toISOString().split('T')[0];
        const sitemapEntries: string[] = [];

        // ── 6. Render each route ─────────────────────────────────────────
        for (const route of routes) {
          try {
            const { html: appHtml, head } = render(route.path);

            let page = template;

            // Remove existing SEO tags from the template head to avoid duplicates
            page = page.replace(/<title>.*?<\/title>/gs, '');
            page = page.replace(/<meta\s+name="description"[^>]*>/g, '');
            page = page.replace(/<meta\s+name="keywords"[^>]*>/g, '');
            page = page.replace(/<meta\s+name="robots"[^>]*>/g, '');
            page = page.replace(/<meta\s+name="author"[^>]*>/g, '');
            page = page.replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '');
            page = page.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '');
            page = page.replace(/<link\s+rel="canonical"[^>]*>/g, '');

            // Ensure CSS files are linked in head (Vite usually does this, but verify)
            for (const cssFile of cssFiles) {
              if (!page.includes(cssFile)) {
                page = page.replace(
                  '</head>',
                  `    <link rel="stylesheet" href="${cssFile}" />\n  </head>`
                );
              }
            }

            // Inject route-specific head tags from react-helmet
            const headTags = [head.title, head.meta, head.link, head.script]
              .filter(Boolean)
              .join('\n    ');

            if (headTags) {
              page = page.replace('</head>', `    ${headTags}\n  </head>`);
            }

            // Inject rendered HTML into the root div
            page = page.replace(
              '<div id="root"></div>',
              `<div id="root">${appHtml}</div>`
            );

            // Clean up excessive blank lines for tidy output
            page = page.replace(/\n{3,}/g, '\n\n');

            // Write the file
            const routePath = route.path === '/' ? '' : route.path.replace(/^\//, '');
            const dir = routePath
              ? resolve(root, outDir, routePath)
              : resolve(root, outDir);

            if (routePath) {
              mkdirSync(dir, { recursive: true });
            }

            const filePath = join(dir, 'index.html');
            writeFileSync(filePath, page, 'utf-8');
            console.log(`  ✅ ${route.path} → ${routePath || '/'}/index.html`);

            // Collect sitemap entry (exclude index.html, just paths)
            sitemapEntries.push(
              [
                '  <url>',
                `    <loc>${baseUrl}${route.path}</loc>`,
                `    <lastmod>${today}</lastmod>`,
                `    <changefreq>${route.changefreq}</changefreq>`,
                `    <priority>${route.priority}</priority>`,
                '  </url>',
              ].join('\n')
            );
          } catch (err: any) {
            console.warn(`  ⚠️  Skipped ${route.path}: ${err.message}`);
          }
        }

        // ── 7. Generate sitemap.xml ──────────────────────────────────────
        const sitemap = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...sitemapEntries,
          '</urlset>',
          '',
        ].join('\n');

        writeFileSync(resolve(root, outDir, 'sitemap.xml'), sitemap, 'utf-8');
        console.log('  ✅ sitemap.xml');

        console.log(`\n✅ Prerendering complete – ${routes.length} routes\n`);
      } catch (err: any) {
        console.error('❌ Prerender failed:', err);
      } finally {
        delete process.env.__VITE_PRERENDER;
        // Clean up temporary SSR bundle
        try {
          rmSync(tempDir, { recursive: true, force: true });
        } catch {
          /* ignore */
        }
      }
    },
  };
}

// ─── Browser global polyfills for SSR ────────────────────────────────────────
function setupBrowserGlobals() {
  const g = globalThis as Record<string, any>;
  if (typeof g.window !== 'undefined' && g.window.__SSR_POLYFILLED) return;

  const noop = () => {};
  const noopMediaQuery = {
    matches: false,
    media: '',
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    onchange: null,
  };

  const storage = {
    getItem: () => null,
    setItem: noop,
    removeItem: noop,
    clear: noop,
    length: 0,
    key: () => null,
  };

  g.window = {
    __SSR_POLYFILLED: true,
    matchMedia: () => noopMediaQuery,
    localStorage: storage,
    sessionStorage: storage,
    location: {
      href: 'https://d365.se/',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'https://d365.se',
      hostname: 'd365.se',
      protocol: 'https:',
      host: 'd365.se',
      port: '',
      assign: noop,
      replace: noop,
      reload: noop,
    },
    history: { pushState: noop, replaceState: noop, back: noop, forward: noop, go: noop, length: 0, state: null },
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    innerWidth: 1280,
    innerHeight: 800,
    outerWidth: 1280,
    outerHeight: 800,
    devicePixelRatio: 1,
    screen: { width: 1280, height: 800, availWidth: 1280, availHeight: 800 },
    navigator: { userAgent: 'prerender-bot', language: 'sv-SE', languages: ['sv-SE', 'sv'] },
    getComputedStyle: () => new Proxy({}, { get: () => '' }),
    scrollTo: noop,
    scroll: noop,
    scrollBy: noop,
    requestAnimationFrame: (cb: any) => setTimeout(cb, 0),
    cancelAnimationFrame: noop,
    ResizeObserver: class { observe = noop; unobserve = noop; disconnect = noop; },
    IntersectionObserver: class {
      observe = noop; unobserve = noop; disconnect = noop;
      root = null; rootMargin = ''; thresholds = [];
      takeRecords = () => [];
    },
    MutationObserver: class { observe = noop; disconnect = noop; takeRecords = () => []; },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve('') }),
    Image: class { src = ''; onload = noop; onerror = noop; },
    CustomEvent: class { type = ''; detail = null; constructor(t: string, o?: any) { this.type = t; this.detail = o?.detail; } },
    HTMLElement: class {},
    SVGElement: class {},
  };

  g.document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    createElement: (tag: string) => ({
      tagName: tag.toUpperCase(),
      style: {},
      dataset: {},
      setAttribute: noop,
      getAttribute: () => null,
      removeAttribute: noop,
      appendChild: noop,
      removeChild: noop,
      insertBefore: noop,
      replaceChild: noop,
      addEventListener: noop,
      removeEventListener: noop,
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      children: [],
      childNodes: [],
      innerHTML: '',
      textContent: '',
      getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    }),
    createElementNS: (_ns: string, tag: string) => g.document.createElement(tag),
    createTextNode: (text: string) => ({ textContent: text }),
    createDocumentFragment: () => ({ appendChild: noop, children: [], childNodes: [] }),
    createComment: () => ({}),
    head: { appendChild: noop, removeChild: noop, querySelectorAll: () => [], insertBefore: noop, children: [] },
    body: { appendChild: noop, removeChild: noop, classList: { add: noop, remove: noop, toggle: noop, contains: () => false } },
    documentElement: {
      style: {},
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      setAttribute: noop,
      getAttribute: () => null,
      removeAttribute: noop,
      lang: 'sv',
    },
    cookie: '',
    title: '',
    readyState: 'complete',
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    createRange: () => ({ setStart: noop, setEnd: noop, commonAncestorContainer: {} }),
    implementation: { createHTMLDocument: () => g.document },
  };

  // Expose commonly accessed globals
  g.localStorage = g.window.localStorage;
  g.sessionStorage = g.window.sessionStorage;
  g.navigator = g.window.navigator;
  g.matchMedia = g.window.matchMedia;
  g.ResizeObserver = g.window.ResizeObserver;
  g.IntersectionObserver = g.window.IntersectionObserver;
  g.MutationObserver = g.window.MutationObserver;
  g.requestAnimationFrame = g.window.requestAnimationFrame;
  g.cancelAnimationFrame = g.window.cancelAnimationFrame;
  g.getComputedStyle = g.window.getComputedStyle;
  g.fetch = g.window.fetch;
  g.Image = g.window.Image;
  g.CustomEvent = g.window.CustomEvent;
  g.HTMLElement = g.window.HTMLElement;
  g.SVGElement = g.window.SVGElement;
}
