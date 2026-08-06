# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Tailwind CSS v4 monorepo: a hybrid TypeScript (pnpm workspaces + Turborepo) and Rust (Cargo workspace) codebase. The CSS engine is TypeScript; high-performance file scanning is Rust exposed to Node via napi bindings.

## Setup and Commands

Requires Node.js, pnpm, and Rustup.

```sh
pnpm install
rustup default stable
rustup target add wasm32-wasip1-threads   # needed for the WASM build

pnpm build            # build all packages (turbo), then packs tarballs into dist/
pnpm test             # cargo test + vitest run (all unit tests)
pnpm tdd              # vitest in watch mode
pnpm lint             # prettier --check + per-package `tsc --noEmit`
pnpm format           # prettier --write
```

Run a single test file / test:

```sh
pnpm vitest run packages/tailwindcss/src/utilities.test.ts
pnpm vitest run packages/tailwindcss/src/utilities.test.ts -t 'test name'
cargo test -p tailwindcss-oxide            # Rust tests only
```

Other suites:

```sh
pnpm build && pnpm test:integrations   # integration tests (require a fresh build — they install the packed tarballs from dist/)
pnpm build && pnpm test:ui             # Playwright browser tests (CSS variable resolution etc.)
pnpm bench                             # vitest benchmarks (*.bench.ts)
```

Playgrounds for manual testing (build first): `pnpm build && pnpm vite` (or `pnpm nextjs`). `playgrounds/v3` is for v3-compat testing.

## Architecture

### Core engine: `packages/tailwindcss`

The framework itself, published as `tailwindcss`. Everything is CSS-first in v4: the theme, utilities, and variants are driven by parsing CSS (`@theme`, `@utility`, `@variant`, `@import`). Key modules in `src/`:

- `index.ts` — `compile()` entry point: parses CSS, processes `@import`/`@theme`/`@plugin`/`@config`, builds the `DesignSystem`, and returns a `build(candidates)` function that generates utility CSS for scanned class candidates.
- `css-parser.ts` / `ast.ts` / `walk.ts` — custom CSS parser and AST used throughout.
- `candidate.ts` — parses class-name candidates (e.g. `hover:bg-red-500/50!`) into structured form.
- `utilities.ts` / `variants.ts` — the registry of built-in utilities and variants; `compile.ts` turns parsed candidates into AST nodes.
- `theme.ts` / `design-system.ts` — theme values (CSS variables) and the aggregate object tying parser, utilities, variants, and theme together.
- `apply.ts`, `at-import.ts`, `css-functions.ts` — `@apply`, `@import` resolution, and functions like `--theme()`/`--spacing()`.
- `compat/` — the v3 compatibility layer: JS `tailwind.config.js` support, the JS plugin API (`plugin()`), `@plugin`/`@config` handling, and legacy utilities.
- `intellisense.ts`, `sort.ts` — APIs consumed by editor tooling (class completion and class sorting).
- `source-maps/` — source map generation.

Unit tests are colocated (`*.test.ts`), benchmarks are `*.bench.ts`, and many tests snapshot compiled CSS output.

### Rust: `crates/`

- `oxide` — the scanner: extracts candidate class names from source files (extractor state machine, glob handling, gitignore-aware directory walking). This is where "which classes exist in your project" is answered.
- `node` — napi-rs bindings publishing oxide to npm as `@tailwindcss/oxide` (native `.node` binaries per platform plus a WASM fallback, hence the `wasm32-wasip1-threads` target).
- `ignore` — vendored fork of the BurntSushi `ignore` crate.

Turborepo orchestrates the Rust build: `@tailwindcss/oxide#build` runs cargo via the crate's build scripts, so `pnpm build`/`pnpm dev` handle Rust and TypeScript together.

### First-party integrations: `packages/@tailwindcss-*`

All build tooling wraps the same two pieces (core compiler + oxide scanner), mostly via `@tailwindcss/node`, which provides the shared Node runtime (module/stylesheet loading, `@import` resolution via enhanced-resolve, lightningcss optimization):

- `@tailwindcss-cli` — the `@tailwindcss/cli` binary; `@tailwindcss-standalone` — self-contained executable build of it.
- `@tailwindcss-postcss`, `@tailwindcss-vite`, `@tailwindcss-webpack`, `@tailwindcss-turbopack` — plugin/loader for each bundler.
- `@tailwindcss-browser` — in-browser Play CDN build (compiles in the browser, no scanner binary).
- `@tailwindcss-upgrade` — the v3→v4 migration codemod tool.

### Integration tests: `integrations/`

End-to-end tests per integration (cli, postcss, vite, webpack, turbopack, oxide, upgrade). The harness in `integrations/utils.ts` creates throwaway projects on disk, installs the tarballs packed into `dist/` by `pnpm build`, and runs real builds — this is why integration tests require `pnpm build` first and are slow. They run with `vitest --root=./integrations`, separate from the unit-test config.

## Conventions

- Formatting is Prettier (no semicolons, single quotes, 100-char width, organized imports) — enforced by `pnpm lint`; there is no ESLint. Per-package `lint` is just `tsc --noEmit`.
- The repo pins toolchain versions: pnpm via `packageManager` in package.json, Rust via `rust-toolchain.toml`. Dependency versions shared across packages live in the pnpm catalog (`pnpm-workspace.yaml`); some deps are patched in `patches/`.
- Bug fixes should come with tests; new features are generally not accepted without prior discussion (see `.github/CONTRIBUTING.md`). Update `CHANGELOG.md` for user-facing changes (Keep a Changelog format, add under `[Unreleased]`).
- Adding `[ci-all]` to a PR description runs CI across all platforms.
