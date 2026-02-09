import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

const STATIC_ROUTES = [
  '/',
  '/crm',
  '/business-central',
  '/finance-supply-chain',
  '/erp',
  '/copilot',
  '/agents',
  '/qa',
  '/kontakt',
  '/valj-partner',
  '/dataskydd',
  '/behovsanalys',
  '/salj-marknad-behovsanalys',
  '/kundservice-behovsanalys',
  '/branschlosningar',
  '/d365-sales',
  '/d365-marketing',
  '/d365-customer-service',
  '/d365-field-service',
  '/d365-contact-center',
  '/events',
];

/**
 * Strip existing SEO meta tags from the HTML template so they can be
 * replaced by the per-route Helmet output.
 */
function stripSeoTags(html: string): string {
  return html
    .replace(/<title>[^<]*<\/title>/g, '')
    .replace(/<meta\s+name="description"[^>]*\/?>/g, '')
    .replace(/<meta\s+name="keywords"[^>]*\/?>/g, '')
    .replace(/<meta\s+name="robots"[^>]*\/?>/g, '')
    .replace(/<meta\s+name="author"[^>]*\/?>/g, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*\/?>/g, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*\/?>/g, '')
    .replace(/<link\s+rel="canonical"[^>]*\/?>/g, '');
}

/**
 * Set up minimal browser-API polyfills so React components that
 * reference window/document at import time won't crash in Node.
 */
function setupBrowserPolyfills() {
  if (typeof (globalThis as any).window !== 'undefined') return;

  const noop = () => {};


  (globalThis as any).window = {
    matchMedia: () => ({
      matches: false,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: () => false,
    }),
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
    innerWidth: 1920,
    innerHeight: 1080,
    scrollTo: noop,
    scrollY: 0,
    pageYOffset: 0,
    location: {
      href: 'https://d365.se',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'https://d365.se',
      hostname: 'd365.se',
      protocol: 'https:',
      assign: noop,
      replace: noop,
      reload: noop,
    },
    navigator: { userAgent: 'prerender' },
    history: { pushState: noop, replaceState: noop, back: noop, forward: noop },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    requestAnimationFrame: (cb: (...args: any[]) => void) => setTimeout(cb, 0),
    cancelAnimationFrame: noop,
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop, clear: noop },
    sessionStorage: { getItem: () => null, setItem: noop, removeItem: noop, clear: noop },
  };

  (globalThis as any).document = {
    createElement: (tag: string) => ({
      tagName: tag.toUpperCase(),
      style: {},
      setAttribute: noop,
      getAttribute: () => null,
      addEventListener: noop,
      removeEventListener: noop,
      appendChild: noop,
      removeChild: noop,
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    }),
    createTextNode: () => ({}),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    head: { appendChild: noop, removeChild: noop, querySelectorAll: () => [] },
    body: { appendChild: noop, removeChild: noop },
    cookie: '',
    documentElement: { style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false } },
    createEvent: () => ({ initEvent: noop }),
    addEventListener: noop,
    removeEventListener: noop,
  };

  (globalThis as any).navigator = { userAgent: 'prerender', language: 'sv-SE' };
  (globalThis as any).localStorage = (globalThis as any).window.localStorage;
  (globalThis as any).sessionStorage = (globalThis as any).window.sessionStorage;
  (globalThis as any).location = (globalThis as any).window.location;

  (globalThis as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  (globalThis as any).MutationObserver = class {
    observe() {}
    disconnect() {}
    takeRecords() { return []; }
  };

  // Needed by some UI libraries
  (globalThis as any).HTMLElement = class {};
  (globalThis as any).Element = class {};
  (globalThis as any).customElements = { define: noop, get: () => undefined };
  (globalThis as any).getComputedStyle = (globalThis as any).window.getComputedStyle;
  (globalThis as any).requestAnimationFrame = (globalThis as any).window.requestAnimationFrame;
  (globalThis as any).cancelAnimationFrame = (globalThis as any).window.cancelAnimationFrame;
}

/**
 * Generate sitemap.xml for all prerendered routes.
 */
function generateSitemap(routes: string[]): string {
  const today = new Date().toISOString().split('T')[0];

  const entries = routes.map((route) => {
    const loc = route === '/' ? 'https://d365.se/' : `https://d365.se${route}`;
    const priority =
      route === '/'
        ? '1.0'
        : ['/erp', '/crm', '/business-central', '/valj-partner'].includes(route)
          ? '0.9'
          : ['/behovsanalys', '/copilot', '/agents', '/finance-supply-chain', '/branschlosningar'].includes(route)
            ? '0.8'
            : route === '/dataskydd'
              ? '0.3'
              : '0.7';
    const changefreq =
      route === '/' ? 'weekly' : route === '/dataskydd' ? 'yearly' : 'monthly';

    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

export function prerenderPlugin(): Plugin {
  let outDir: string;
  let root: string;

  return {
    name: 'prerender-static-routes',
    apply: 'build',
    enforce: 'post',

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      root = config.root;
    },

    async closeBundle() {
      // Prevent recursion when the SSR build triggers this plugin
      if (process.env.__PRERENDER_SSR === '1') return;

      console.log('\n🔄 Prerender: starting static route prerendering…\n');

      const ssrOutDir = path.resolve(root, '.prerender-ssr');

      try {
        // ---- 1. Build SSR bundle ------------------------------------------------
        process.env.__PRERENDER_SSR = '1';

        const { build: viteBuild } = await import('vite');
        const reactPlugin = (await import('@vitejs/plugin-react-swc')).default;

        await viteBuild({
          configFile: false,
          root,
          plugins: [reactPlugin()],
          resolve: {
            alias: {
              '@': path.resolve(root, 'src'),
            },
          },
          build: {
            ssr: 'src/entry-server.tsx',
            outDir: ssrOutDir,
            emptyOutDir: true,
            minify: false,
            rollupOptions: {
              output: { format: 'esm' },
            },
          },
          logLevel: 'warn',
        });

        delete process.env.__PRERENDER_SSR;

        // ---- 2. Set up polyfills before loading SSR module ----------------------
        setupBrowserPolyfills();

        // ---- 3. Load SSR module -------------------------------------------------
        const { pathToFileURL } = await import('url');
        const ssrEntryPath = path.resolve(ssrOutDir, 'entry-server.js');
        const { render } = await import(pathToFileURL(ssrEntryPath).href);

        // ---- 4. Read the built index.html template ------------------------------
        const templatePath = path.resolve(outDir, 'index.html');
        const rawTemplate = fs.readFileSync(templatePath, 'utf-8');

        // ---- 5. Render each route -----------------------------------------------
        let ok = 0;
        let fail = 0;

        for (const route of STATIC_ROUTES) {
          try {
            // Update polyfill location for the current route
            (globalThis as any).window.location.pathname = route;
            (globalThis as any).window.location.href = `https://d365.se${route}`;
            (globalThis as any).location = (globalThis as any).window.location;

            const { html: appHtml, head } = render(route);

            // Strip existing SEO tags from the template
            let pageHtml = stripSeoTags(rawTemplate);

            // Inject Helmet head tags before </head>
            const headTags = [head.title, head.meta, head.link, head.script]
              .filter((t: string) => t && t.trim().length > 0)
              .join('\n    ');

            if (headTags) {
              pageHtml = pageHtml.replace('</head>', `    ${headTags}\n  </head>`);
            }

            // Inject rendered HTML into the root div
            pageHtml = pageHtml.replace(
              '<div id="root"></div>',
              `<div id="root">${appHtml}</div>`,
            );

            // Write the prerendered file
            if (route === '/') {
              fs.writeFileSync(templatePath, pageHtml);
            } else {
              const routeDir = path.join(outDir, route);
              fs.mkdirSync(routeDir, { recursive: true });
              fs.writeFileSync(path.join(routeDir, 'index.html'), pageHtml);
            }

            ok++;
            console.log(`  ✅ ${route}`);
          } catch (err) {
            fail++;
            console.warn(`  ⚠️  Skipped ${route}: ${(err as Error).message}`);
          }
        }

        // ---- 6. Generate sitemap.xml -------------------------------------------
        const sitemap = generateSitemap(STATIC_ROUTES);
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
        console.log('  ✅ sitemap.xml');

        // ---- 7. Cleanup --------------------------------------------------------
        fs.rmSync(ssrOutDir, { recursive: true, force: true });

        console.log(
          `\n✨ Prerender complete – ${ok} routes OK, ${fail} skipped\n`,
        );
      } catch (err) {
        console.error(
          '❌ Prerender failed:',
          (err as Error).message,
        );
        console.error(
          '   The SPA will still work normally without prerendered HTML.\n',
        );

        // Cleanup on failure
        try {
          fs.rmSync(ssrOutDir, { recursive: true, force: true });
        } catch {
          // ignore
        }

        delete process.env.__PRERENDER_SSR;
      }
    },
  };
}
