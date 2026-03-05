import type { Plugin } from 'vite';
import { build, loadEnv } from 'vite';
import { resolve, join } from 'path';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'fs';
import { pathToFileURL } from 'url';
import react from '@vitejs/plugin-react-swc';

/**
 * Vite plugin that prerenders static HTML for all defined routes after the
 * client build completes.
 *
 * How it works:
 * 1. Builds a separate, isolated SSR bundle from src/entry-server.tsx
 * 2. Renders each route to static HTML with react-helmet SEO tags
 * 3. Links CSS files from the client build into each HTML file
 * 4. Writes route/index.html files into the dist directory
 * 5. Generates a sitemap.xml from the prerendered routes
 *
 * Loop prevention:
 * - Uses __VITE_PRERENDER env flag to prevent re-entry
 * - SSR build uses configFile: false to avoid loading this plugin again
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

      // Check that entry-server.tsx exists
      const entryPath = resolve(root, 'src/entry-server.tsx');
      if (!existsSync(entryPath)) {
        console.warn('⚠️  Prerender skipped: src/entry-server.tsx not found');
        return;
      }

      process.env.__VITE_PRERENDER = '1';
      const tempDir = resolve(root, '.prerender-temp');

      console.log('\n🔄 Prerendering routes...\n');

      try {
        // ── 1. Load environment variables for dynamic route fetching ─────
        const env = loadEnv('production', root, '');
        Object.assign(process.env, env);

        // ── 1b. Polyfill browser globals for SSR ─────────────────────────
        setupBrowserGlobals();

        // ── 2. Build the SSR bundle (completely isolated) ────────────────
        await build({
          configFile: false,
          root,
          plugins: [react()],
          resolve: {
            alias: { '@': resolve(root, 'src') },
          },
          build: {
            ssr: entryPath,
            outDir: tempDir,
            rollupOptions: {
              output: { format: 'esm' },
              // Externalize node builtins to avoid bundling issues
              external: ['stream', 'http', 'https', 'url', 'zlib', 'crypto'],
            },
          },
          logLevel: 'warn',
        });

        // ── 3. Import the built SSR module ───────────────────────────────
        const modulePath = pathToFileURL(resolve(tempDir, 'entry-server.js')).href;
        const mod = await import(modulePath);
        const { render, routes, getDynamicRoutes } = mod;

        if (!render || !routes) {
          console.error('❌ Prerender: entry-server.js missing render() or routes export');
          return;
        }

        // ── 3b. Fetch dynamic routes (partner profiles etc.) ─────────────
        let allRoutes = [...routes];
        if (typeof getDynamicRoutes === 'function') {
          try {
            const dynamicRoutes = await getDynamicRoutes();
            console.log(`  📦 Found ${dynamicRoutes.length} dynamic partner routes`);
            allRoutes = [...routes, ...dynamicRoutes];
          } catch (err: any) {
            console.warn(`  ⚠️  Dynamic routes failed: ${err.message}`);
          }
        }

        // ── 4. Read the client-built index.html as template ──────────────
        const templatePath = resolve(root, outDir, 'index.html');
        if (!existsSync(templatePath)) {
          console.error('❌ Prerender: dist/index.html not found');
          return;
        }
        const template = readFileSync(templatePath, 'utf-8');

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
        let successCount = 0;

        // ── 6. Render each route ─────────────────────────────────────────
        for (const route of allRoutes) {
          try {
            const start = Date.now();
            const { html: appHtml, head } = render(route.path);
            const elapsed = Date.now() - start;
            if (elapsed > 5000) {
              console.warn(`  ⚠️  Slow render: ${route.path} took ${elapsed}ms`);
            }

            let page = template;

            // Strip existing SEO tags from the template to avoid duplicates
            page = page.replace(/<title>.*?<\/title>/gs, '');
            page = page.replace(/<meta\s+name="description"[^>]*\/?>/g, '');
            page = page.replace(/<meta\s+name="keywords"[^>]*\/?>/g, '');
            page = page.replace(/<meta\s+name="robots"[^>]*\/?>/g, '');
            page = page.replace(/<meta\s+name="author"[^>]*\/?>/g, '');
            page = page.replace(/<meta\s+property="og:[^"]*"[^>]*\/?>/g, '');
            page = page.replace(/<meta\s+name="twitter:[^"]*"[^>]*\/?>/g, '');
            page = page.replace(/<link\s+rel="canonical"[^>]*\/?>/g, '');

            // Ensure all CSS files from the client build are linked
            for (const cssFile of cssFiles) {
              if (!page.includes(cssFile)) {
                page = page.replace(
                  '</head>',
                  `    <link rel="stylesheet" href="${cssFile}" />\n  </head>`
                );
              }
            }

            // Inject route-specific head tags from react-helmet
            let headTags = [head.title, head.meta, head.link, head.script]
              .filter(Boolean)
              .join('\n    ');

            // For dynamic routes with custom meta (e.g. partner profiles),
            // inject the meta directly if Helmet didn't produce useful tags
            if (route.meta && (!head.title || head.title.includes('d365.se</title>') && !head.title.includes(route.meta.title))) {
              const customHead = [
                `<title>${route.meta.title}</title>`,
                `<meta name="description" content="${route.meta.description.replace(/"/g, '&quot;')}" />`,
                `<link rel="canonical" href="https://d365.se${route.path}" />`,
                `<meta property="og:title" content="${route.meta.title}" />`,
                `<meta property="og:description" content="${route.meta.description.replace(/"/g, '&quot;')}" />`,
                `<meta property="og:url" content="https://d365.se${route.path}" />`,
                `<meta property="og:type" content="website" />`,
              ].join('\n    ');
              headTags = customHead;
            }

            if (headTags) {
              page = page.replace('</head>', `    ${headTags}\n  </head>`);
            }

            // Inject rendered HTML into the root div (replace any existing noscript fallback content)
            page = page.replace(
              /<div id="root">[\s\S]*?<\/div>/,
              `<div id="root">${appHtml}</div>`
            );

            // Clean up excessive blank lines
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
            successCount++;
            console.log(`  ✅ ${route.path} → ${routePath || '/'}/index.html`);

            // Collect sitemap entry
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
        if (sitemapEntries.length > 0) {
          const sitemap = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...sitemapEntries,
            '</urlset>',
            '',
          ].join('\n');

          writeFileSync(resolve(root, outDir, 'sitemap.xml'), sitemap, 'utf-8');
          console.log('  ✅ sitemap.xml');
        }

        // ── 8. Generate 404.html for GitHub Pages SPA fallback ─────────
        try {
          // Try to render the NotFound-like page, or fall back to root index.html
          const notFoundHtml = readFileSync(resolve(root, outDir, 'index.html'), 'utf-8');
          writeFileSync(resolve(root, outDir, '404.html'), notFoundHtml, 'utf-8');
          console.log('  ✅ 404.html (GitHub Pages fallback)');
        } catch {
          console.warn('  ⚠️  Could not generate 404.html');
        }

        // ── 9. Generate .nojekyll for GitHub Pages ───────────────────────
        writeFileSync(resolve(root, outDir, '.nojekyll'), '', 'utf-8');
        console.log('  ✅ .nojekyll');

        // ── 10. Generate CNAME for custom domain ─────────────────────────
        writeFileSync(resolve(root, outDir, 'CNAME'), 'd365.se', 'utf-8');
        console.log('  ✅ CNAME (d365.se)');

        console.log(`\n✅ Prerendering complete – ${successCount}/${allRoutes.length} routes\n`);
      } catch (err: any) {
        console.error('❌ Prerender failed:', err.message || err);
        // Don't throw - let the build succeed even if prerendering fails
      } finally {
        delete process.env.__VITE_PRERENDER;
        try {
          rmSync(tempDir, { recursive: true, force: true });
        } catch {
          /* ignore */
        }
        // Force exit to prevent dangling SSR module connections (Supabase auth refresh etc.)
        setTimeout(() => process.exit(0), 500);
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

  const createMockElement = (tag: string) => ({
    tagName: tag.toUpperCase(),
    style: new Proxy({}, { get: () => '', set: () => true }),
    dataset: {},
    setAttribute: noop,
    getAttribute: () => null,
    removeAttribute: noop,
    appendChild: function(child: any) { return child; },
    removeChild: function(child: any) { return child; },
    insertBefore: function(child: any) { return child; },
    replaceChild: noop,
    addEventListener: noop,
    removeEventListener: noop,
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    children: [],
    childNodes: [],
    innerHTML: '',
    textContent: '',
    firstChild: null,
    lastChild: null,
    nextSibling: null,
    previousSibling: null,
    parentNode: null,
    parentElement: null,
    ownerDocument: null,
    nodeType: 1,
    nodeName: tag.toUpperCase(),
    cloneNode: () => createMockElement(tag),
    contains: () => false,
    matches: () => false,
    closest: () => null,
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: noop }),
    getClientRects: () => [],
    hasAttribute: () => false,
    hasAttributes: () => false,
    hasChildNodes: () => false,
    normalize: noop,
    isEqualNode: () => false,
    isSameNode: () => false,
    compareDocumentPosition: () => 0,
    focus: noop,
    blur: noop,
    click: noop,
    scrollIntoView: noop,
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    // For Radix UI
    role: null,
    id: '',
    className: '',
    tabIndex: -1,
  });

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
    screen: { width: 1280, height: 800, availWidth: 1280, availHeight: 800, colorDepth: 24, pixelDepth: 24, orientation: { type: 'landscape-primary', angle: 0 } },
    navigator: { userAgent: 'prerender-bot', language: 'sv-SE', languages: ['sv-SE', 'sv'], platform: 'Linux', vendor: '', cookieEnabled: true, onLine: true },
    getComputedStyle: () => new Proxy({}, { get: (_target, prop) => typeof prop === 'string' ? '' : undefined }),
    scrollTo: noop,
    scroll: noop,
    scrollBy: noop,
    requestAnimationFrame: (cb: any) => { setTimeout(cb, 0); return 0; },
    cancelAnimationFrame: noop,
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval,
    ResizeObserver: class { observe = noop; unobserve = noop; disconnect = noop; },
    IntersectionObserver: class {
      observe = noop; unobserve = noop; disconnect = noop;
      root = null; rootMargin = ''; thresholds = [];
      takeRecords = () => [];
    },
    MutationObserver: class { observe = noop; disconnect = noop; takeRecords = () => []; },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve(''), headers: new Map() }),
    Image: class { src = ''; onload = noop; onerror = noop; width = 0; height = 0; },
    CustomEvent: class { type = ''; detail = null; constructor(t: string, o?: any) { this.type = t; this.detail = o?.detail; } },
    HTMLElement: class {},
    SVGElement: class {},
    Element: class {},
    Node: class {},
    Event: class { type = ''; constructor(t: string) { this.type = t; } preventDefault = noop; stopPropagation = noop; },
    DOMParser: class { parseFromString = () => null; },
    URL: globalThis.URL,
    URLSearchParams: globalThis.URLSearchParams,
    AbortController: globalThis.AbortController || class { signal = {}; abort = noop; },
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
    crypto: globalThis.crypto || { getRandomValues: (arr: any) => arr, randomUUID: () => 'ssr-uuid' },
  };

  g.document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    createElement: (tag: string) => createMockElement(tag),
    createElementNS: (_ns: string, tag: string) => createMockElement(tag),
    createTextNode: (text: string) => ({ textContent: text, nodeType: 3, nodeName: '#text' }),
    createDocumentFragment: () => ({ appendChild: (child: any) => child, children: [], childNodes: [], nodeType: 11, querySelectorAll: () => [] }),
    createComment: (text: string) => ({ textContent: text, nodeType: 8 }),
    head: { appendChild: (child: any) => child, removeChild: noop, querySelectorAll: () => [], insertBefore: noop, children: [], contains: () => false },
    body: { appendChild: (child: any) => child, removeChild: noop, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, contains: () => false, querySelectorAll: () => [], querySelector: () => null, style: {} },
    documentElement: {
      style: new Proxy({}, { get: () => '', set: () => true }),
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      setAttribute: noop,
      getAttribute: () => null,
      removeAttribute: noop,
      lang: 'sv',
      dir: 'ltr',
      scrollTop: 0,
      scrollLeft: 0,
      clientWidth: 1280,
      clientHeight: 800,
    },
    cookie: '',
    title: '',
    readyState: 'complete',
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    createRange: () => ({
      setStart: noop,
      setEnd: noop,
      commonAncestorContainer: {},
      createContextualFragment: (html: string) => ({ childNodes: [], children: [], innerHTML: html }),
      selectNode: noop,
      selectNodeContents: noop,
      collapse: noop,
      cloneRange: () => ({}),
      getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    }),
    implementation: { createHTMLDocument: () => g.document },
    createTreeWalker: () => ({ nextNode: () => null, currentNode: null }),
    activeElement: null,
    defaultView: null,
    nodeType: 9,
  };

  // Set defaultView after document is created
  g.document.defaultView = g.window;
  g.document.body.ownerDocument = g.document;

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
  g.Element = g.window.Element;
  g.Node = g.window.Node;
  g.Event = g.window.Event;
  g.DOMParser = g.window.DOMParser;
  g.location = g.window.location;
  g.history = g.window.history;
  g.screen = g.window.screen;
  g.innerWidth = g.window.innerWidth;
  g.innerHeight = g.window.innerHeight;
}
