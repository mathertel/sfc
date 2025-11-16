# Copilot instructions — sfc

Purpose: Quickly orient an AI coding agent to be productive in this repository.

- **Big picture:** This project implements a tiny "Single File Components" (SFC) system that loads `.sfc` files
  in the browser and registers them as Web Components. Key runtime pieces are `src/loader.ts` (the SFC loader / `UComponent`) and
  `src/data-hub.ts` (a client-side pub/sub data layer). Components live as `*.sfc` files at repository root (e.g. `u-card.sfc`).

- **Where to look first:** `README.md` (project goals), `src/loader.ts` (how SFCs are parsed and defined),
  `src/data-hub.ts` (publish/subscribe semantics), `test/index.htm` (integration test harness), and `doc/` for component docs.

- **Build & dev commands (explicit):**
  - **Type check:** `npm run test:src` — runs `tsc -noEmit -p src\\tsconfig.json` (fast feedback for TS changes).
  - **Build:** `npm run build` — runs type check and builds `data-hub.js` and `loader.js` with `esbuild`.
  - **Dev:** `npm run dev` — runs watchers for hub & loader and serves `test/index.htm` for live testing.
  - **Serve test pages:** `npm run serve` — runs a simple static server opening `test/index.htm`.
  - **Bundle SFCs:** `npm run build:bundle` — uses the `pack-sfc` CLI (`bin/pack-sfc.js`) to create `bundle.sfc`.

- **Important runtime conventions and gotchas:**
  - SFC syntax: an SFC is an HTML file with `<template>`, `<style>`, and `<script>` blocks. The `<script>` **must** `export default` the component class.
  - Event handler methods must be named in all-lowercase after the `on` prefix. Example: use `onclick(evt) { ... }` **not** `onClick` — the loader checks `key.toLowerCase()` and logs an error if not lower-case.
  - Template modes: `<template open|closed|light>` choose shadow DOM mode (open/closed) or light DOM. Styles with `scoped` are injected into each component's shadow root; styles without `scoped` are inserted once into `document.head`.
  - Script `extends` attribute: to extend native elements, add `extends="button"` on the `<script>` and export the class accordingly — see `loader.ts` define flow.
  - The loader imports scripts by building a `Blob` from the `<script>` text and using `import(URL.createObjectURL(...))`. Relative `src` attributes inside `<template>` are rewritten relative to the `.sfc` file URL.

- **DataHub specifics (from `src/data-hub.ts`):**
  - Access via `window.datahub` (global singleton created at end of file).
  - Paths use dot `.` as delimiter internally; subscribe patterns are case-insensitive and converted to regex. Wildcards: `*` (single segment), `**` (multi-segment).
  - To persist hub data use `window.datahub.configurePersistence(localStorage, 'datahub')`.

- **When modifying core files:**
  - Preserve the public behaviors of `window.sfc` and `window.datahub` (loader API `loadComponent`, `genID`, and data hub `publish/subscribe/get`).
  - Production builds rely on `esbuild` flags `--drop:console --drop:debugger`. Keep these flags for smaller production artifacts.

- **Examples to inspect before code changes:**
  - Component example: `u-card.sfc`, `u-toast.sfc` (how template/style/script are composed).
  - Loader implementation: `src/loader.ts` (how components are parsed, defined and how `UComponent` initializes shadow/template/style).
  - Data layer: `src/data-hub.ts` and `src/json-parse.ts` (tokenize/find/merge helpers).

- **Tests / quick local verification:**
  - Start dev server: `npm run dev` and open the served `test/index.htm` to manually exercise components.
  - After TypeScript edits run `npm run test:src` to catch typing errors quickly.

- **Agent behavior rules (project-specific):**
  - Do not change the SFC file format or `loader` public behavior unless implementing a backward-compatible improvement. Many demo/test pages depend on the exact parsing behavior.
  - Favor minimal, focused changes that preserve the `UComponent` lifecycle (`connectedCallback`/`init`) and the `datahub` API.

If anything here is unclear or you want other repository conventions added (linting, release steps, CI), tell me which area to expand.
