Plan: Add implementation calculator to "Verktyg & guider" menu

Current state
- The implementation calculator page exists at `/implementationskalkylator/` and is lazy-loaded in `src/App.tsx`.
- The main navigation has a desktop dropdown and a mobile sheet named "Verktyg & guider" that already contains tools, needs analyses, AI readiness, decision-maturity index, and guide links.

Changes to make
1. `src/components/Navbar.tsx` – Desktop dropdown
   - Add a new menu item in the "Verktyg & guider" dropdown, linking to `/implementationskalkylator/`.
   - Place it in a logical group, e.g. under a new "Kalkylatorer" heading or alongside the other planning tools, so it does not get mixed with the needs analyses.

2. `src/components/Navbar.tsx` – Mobile sheet
   - Add the same link in the mobile menu's "Verktyg & guider" section, mirroring the desktop order and grouping.

3. Verify
   - Confirm the route is already registered in `src/App.tsx` (it is, at `/implementationskalkylator/`).
   - Check that the link label is consistent with the page title/breadcrumbs ("Pris- och omfattningskalkylator" / "Implementationskalkylator").

No backend, database, or edge-function changes are needed. This is a navigation-only change in the frontend.