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
 * Read .env file and parse VITE_ variables for SSR build `define`.
 */
function loadEnvVars(rootDir: string): Record<string, string> {
  const envPath = path.resolve(rootDir, '.env');
  const define: Record<string, string> = {};

  if (!fs.existsSync(envPath)) return define;

  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key.startsWith('VITE_')) {
      define[`import.meta.env.${key}`] = JSON.stringify(value);
    }
  }

  // Also add common import.meta.env properties
  define['import.meta.env.SSR'] = 'true';
  define['import.meta.env.DEV'] = 'false';
  define['import.meta.env.PROD'] = 'true';
  define['import.meta.env.MODE'] = '"production"';

  return define;
}

/**
 * Set up minimal browser-API polyfills so React components that
 * reference window/document at import time won't crash in Node.
 */
function setupBrowserPolyfills() {
  if (typeof (globalThis as any).window !== 'undefined') return;

  const noop = (..._args: any[]) => {};
  const noopReturnsEmpty = () => '';

  const storage = {
    _data: {} as Record<string, string>,
    getItem(key: string) { return this._data[key] ?? null; },
    setItem(key: string, value: string) { this._data[key] = String(value); },
    removeItem(key: string) { delete this._data[key]; },
    clear() { this._data = {}; },
    get length() { return Object.keys(this._data).length; },
    key(index: number) { return Object.keys(this._data)[index] ?? null; },
  };

  const locationObj = {
    href: 'https://d365.se',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'https://d365.se',
    hostname: 'd365.se',
    host: 'd365.se',
    protocol: 'https:',
    port: '',
    assign: noop,
    replace: noop,
    reload: noop,
    toString() { return this.href; },
  };

  const styleObj = new Proxy({} as any, {
    get: (_t, _p) => '',
    set: () => true,
  });

  const createMockElement = (tag: string = 'div'): any => ({
    tagName: tag.toUpperCase(),
    nodeName: tag.toUpperCase(),
    nodeType: 1,
    style: styleObj,
    ownerDocument: null,
    parentNode: null,
    parentElement: null,
    childNodes: [],
    children: [],
    firstChild: null,
    lastChild: null,
    innerHTML: '',
    textContent: '',
    className: '',
    id: '',
    setAttribute: noop,
    getAttribute: () => null,
    removeAttribute: noop,
    hasAttribute: () => false,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    appendChild: function(child: any) { return child; },
    removeChild: function(child: any) { return child; },
    insertBefore: function(child: any) { return child; },
    replaceChild: function(newChild: any) { return newChild; },
    cloneNode: function() { return createMockElement(tag); },
    contains: () => false,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    matches: () => false,
    closest: () => null,
    getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: noop }),
    getClientRects: () => [],
    scrollIntoView: noop,
    focus: noop,
    blur: noop,
    click: noop,
    classList: {
      add: noop, remove: noop, toggle: noop,
      contains: () => false, replace: noop,
      entries: () => [][Symbol.iterator](),
      forEach: noop, keys: () => [][Symbol.iterator](),
      values: () => [][Symbol.iterator](),
      item: () => null, length: 0,
      supports: () => false,
      [Symbol.iterator]: () => [][Symbol.iterator](),
    },
    dataset: new Proxy({}, { get: () => undefined, set: () => true }),
    offsetWidth: 0, offsetHeight: 0, offsetTop: 0, offsetLeft: 0,
    clientWidth: 0, clientHeight: 0,
    scrollWidth: 0, scrollHeight: 0, scrollTop: 0, scrollLeft: 0,
  });

  const docElement = createMockElement('html');
  const headElement = createMockElement('head');
  const bodyElement = createMockElement('body');

  (globalThis as any).document = {
    createElement: (tag: string) => createMockElement(tag),
    createElementNS: (_ns: string, tag: string) => createMockElement(tag),
    createTextNode: (text: string) => ({ nodeType: 3, textContent: text }),
    createComment: (text: string) => ({ nodeType: 8, textContent: text }),
    createDocumentFragment: () => createMockElement('fragment'),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    head: headElement,
    body: bodyElement,
    documentElement: docElement,
    cookie: '',
    title: '',
    readyState: 'complete',
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    createEvent: () => ({ initEvent: noop, preventDefault: noop, stopPropagation: noop }),
    createRange: () => ({
      setStart: noop, setEnd: noop,
      commonAncestorContainer: docElement,
      createContextualFragment: () => createMockElement('fragment'),
      getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }),
      getClientRects: () => [],
      selectNodeContents: noop,
      collapse: noop,
    }),
    implementation: {
      createHTMLDocument: () => (globalThis as any).document,
    },
    defaultView: null as any, // set after window is created
    activeElement: null,
    hasFocus: () => true,
    nodeType: 9,
    childNodes: [],
    adoptNode: (node: any) => node,
    importNode: (node: any) => node,
  };

  (globalThis as any).window = {
    document: (globalThis as any).document,
    matchMedia: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
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
    outerWidth: 1920,
    outerHeight: 1080,
    devicePixelRatio: 1,
    scrollTo: noop,
    scrollBy: noop,
    scroll: noop,
    scrollX: 0,
    scrollY: 0,
    pageXOffset: 0,
    pageYOffset: 0,
    location: locationObj,
    navigator: {
      userAgent: 'Mozilla/5.0 (prerender)',
      language: 'sv-SE',
      languages: ['sv-SE', 'sv', 'en'],
      platform: 'Linux',
      cookieEnabled: true,
      onLine: true,
      clipboard: { writeText: () => Promise.resolve() },
    },
    history: {
      length: 1, state: null,
      pushState: noop, replaceState: noop, back: noop, forward: noop, go: noop,
    },
    localStorage: storage,
    sessionStorage: { ...storage, _data: {} },
    getComputedStyle: () => new Proxy({} as any, {
      get: (_t, prop) => {
        if (prop === 'getPropertyValue') return () => '';
        if (prop === 'length') return 0;
        return '';
      },
    }),
    requestAnimationFrame: (cb: (...args: any[]) => void) => setTimeout(cb, 0),
    cancelAnimationFrame: (id: any) => clearTimeout(id),
    requestIdleCallback: (cb: (...args: any[]) => void) => setTimeout(cb, 0),
    cancelIdleCallback: (id: any) => clearTimeout(id),
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval,
    fetch: globalThis.fetch,
    AbortController: globalThis.AbortController,
    URL: globalThis.URL,
    URLSearchParams: globalThis.URLSearchParams,
    Headers: globalThis.Headers,
    Request: globalThis.Request,
    Response: globalThis.Response,
    Event: class MockEvent {
      type: string;
      constructor(type: string) { this.type = type; }
      preventDefault() {}
      stopPropagation() {}
    },
    CustomEvent: class MockCustomEvent {
      type: string;
      detail: any;
      constructor(type: string, init?: any) { this.type = type; this.detail = init?.detail; }
      preventDefault() {}
      stopPropagation() {}
    },
    getSelection: () => null,
    visualViewport: { width: 1920, height: 1080, addEventListener: noop, removeEventListener: noop },
    performance: globalThis.performance || { now: () => Date.now(), mark: noop, measure: noop },
    screen: { width: 1920, height: 1080, availWidth: 1920, availHeight: 1080, colorDepth: 24, pixelDepth: 24, orientation: { type: 'landscape-primary', angle: 0 } },
    CSS: { supports: () => false, escape: (s: string) => s },
    MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    queueMicrotask: globalThis.queueMicrotask,
  };

  // Set document.defaultView to window
  (globalThis as any).document.defaultView = (globalThis as any).window;

  // Copy key properties to globalThis for direct access
  const globalsToProxy = [
    'navigator', 'location', 'localStorage', 'sessionStorage',
    'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame',
    'MutationObserver', 'ResizeObserver', 'IntersectionObserver',
    'requestIdleCallback', 'cancelIdleCallback', 'matchMedia',
    'scroll', 'scrollTo', 'scrollBy',
  ];

  for (const key of globalsToProxy) {
    if ((globalThis as any)[key] === undefined) {
      (globalThis as any)[key] = (globalThis as any).window[key];
    }
  }

  // Additional globals some libs expect
  (globalThis as any).HTMLElement = class MockHTMLElement {};
  (globalThis as any).HTMLDivElement = class extends (globalThis as any).HTMLElement {};
  (globalThis as any).HTMLSpanElement = class extends (globalThis as any).HTMLElement {};
  (globalThis as any).HTMLAnchorElement = class extends (globalThis as any).HTMLElement {};
  (globalThis as any).HTMLButtonElement = class extends (globalThis as any).HTMLElement {};
  (globalThis as any).HTMLInputElement = class extends (globalThis as any).HTMLElement {};
  (globalThis as any).HTMLImageElement = class extends (globalThis as any).HTMLElement {};
  (globalThis as any).Element = class MockElement {};
  (globalThis as any).Node = class MockNode {};
  (globalThis as any).DocumentFragment = class MockDocumentFragment {};
  (globalThis as any).SVGElement = class MockSVGElement {};
  (globalThis as any).Text = class MockText {};
  (globalThis as any).Comment = class MockComment {};
  (globalThis as any).Event = (globalThis as any).window.Event;
  (globalThis as any).CustomEvent = (globalThis as any).window.CustomEvent;
  (globalThis as any).customElements = { define: noop, get: () => undefined, whenDefined: () => Promise.resolve() };
  (globalThis as any).DOMParser = class {
    parseFromString() { return (globalThis as any).document; }
  };
  (globalThis as any).XMLSerializer = class {
    serializeToString() { return ''; }
  };
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
        // ---- 1. Load env variables for SSR build --------------------------------
        const envDefine = loadEnvVars(root);
        console.log(`  📋 Loaded ${Object.keys(envDefine).length} env variables for SSR build`);

        // ---- 2. Build SSR bundle ------------------------------------------------
        process.env.__PRERENDER_SSR = '1';

        const { build: viteBuild } = await import('vite');
        const reactPlugin = (await import('@vitejs/plugin-react-swc')).default;

        console.log('  🔨 Building SSR bundle…');

        await viteBuild({
          configFile: false,
          root,
          plugins: [reactPlugin()],
          resolve: {
            alias: {
              '@': path.resolve(root, 'src'),
            },
          },
          define: envDefine,
          assetsInclude: ['**/*.jfif', '**/*.webp'],
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
        console.log('  ✅ SSR bundle built successfully');

        // ---- 3. Set up polyfills before loading SSR module ----------------------
        setupBrowserPolyfills();
        console.log('  ✅ Browser polyfills installed');

        // ---- 4. Load SSR module -------------------------------------------------
        const { pathToFileURL } = await import('url');
        const ssrEntryPath = path.resolve(ssrOutDir, 'entry-server.js');

        if (!fs.existsSync(ssrEntryPath)) {
          console.error(`  ❌ SSR entry not found at ${ssrEntryPath}`);
          console.log('  Available files:', fs.readdirSync(ssrOutDir).join(', '));
          return;
        }

        console.log('  📦 Loading SSR module…');
        const ssrModule = await import(pathToFileURL(ssrEntryPath).href);
        const { render } = ssrModule;

        if (typeof render !== 'function') {
          console.error('  ❌ SSR module does not export a render function');
          console.log('  Exports:', Object.keys(ssrModule).join(', '));
          return;
        }

        console.log('  ✅ SSR module loaded');

        // ---- 5. Read the built index.html template ------------------------------
        const templatePath = path.resolve(outDir, 'index.html');
        const rawTemplate = fs.readFileSync(templatePath, 'utf-8');

        // ---- 6. Render each route -----------------------------------------------
        let ok = 0;
        let fail = 0;

        for (const route of STATIC_ROUTES) {
          try {
            // Update polyfill location for the current route
            (globalThis as any).window.location.pathname = route;
            (globalThis as any).window.location.href = `https://d365.se${route}`;
            (globalThis as any).location = (globalThis as any).window.location;

            const { html: appHtml, head } = render(route);

            // Check if we got meaningful content
            const contentLength = appHtml?.length || 0;

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
            console.log(`  ✅ ${route} (${contentLength} chars)`);
          } catch (err) {
            fail++;
            const error = err as Error;
            console.warn(`  ⚠️  Skipped ${route}:`);
            console.warn(`      Error: ${error.message}`);
            if (error.stack) {
              // Show first 3 lines of stack trace
              const stackLines = error.stack.split('\n').slice(1, 4).map(l => `      ${l.trim()}`);
              console.warn(stackLines.join('\n'));
            }
          }
        }

        // ---- 7. Generate sitemap.xml -------------------------------------------
        const sitemap = generateSitemap(STATIC_ROUTES);
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
        console.log('  ✅ sitemap.xml');

        // ---- 8. Cleanup --------------------------------------------------------
        fs.rmSync(ssrOutDir, { recursive: true, force: true });

        console.log(
          `\n✨ Prerender complete – ${ok} routes OK, ${fail} skipped\n`,
        );
      } catch (err) {
        const error = err as Error;
        console.error('❌ Prerender failed:', error.message);
        if (error.stack) {
          console.error(error.stack.split('\n').slice(0, 6).join('\n'));
        }
        console.error('   The SPA will still work normally without prerendered HTML.\n');

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
