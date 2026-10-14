# systemval

- Systemval guide (/kom-igang/systemval/) is config-driven: questions/modules in config.ts, deterministic routing in engine.ts; product modules plug into MODULES so the engine never needs rebuilding and UI holds no flow logic.
- Product modules live in modules/ and are registered in modules/index.ts; each module owns its questions, requestsCommon gating and a deterministic evaluate() whose output the page reads from state.moduleResults, so routing and assessment stay testable outside React.
- ERP assessment (modules/erp.ts) uses explicit rule objects with strength labels per dimension (Finance, SCM, comparison, context), never size/country/NAV/AX shortcuts or public scores; ERP8 is a configured template chosen from open uncertainty, not free AI, so outcomes are reproducible.
