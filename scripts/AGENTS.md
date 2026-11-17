# Script rules

- Both sitemap generators (including the root prerender plugin) omit URL lastmod without a page-specific content timestamp; filesystem and build dates are not content provenance.- Sitemaps are generated only by scripts/generate-sitemap.mjs (prebuild, fetches published DB content); the prerender plugin never writes sitemap files, so one source owns every sub-sitemap.
